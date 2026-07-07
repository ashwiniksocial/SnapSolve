/**
 * useAdaptiveLearning — Adaptive Learning Engine
 *
 * Reads all three persistence layers directly from localStorage (self-contained)
 * so it can be called from any component without prop-drilling hook state.
 *
 * Per-topic metrics computed:
 *   masteryScore        — accuracy × depth multiplier  (0-100)
 *   confidenceScore     — mastery weighted by attempt count  (0-100)
 *   mistakeFrequency    — normalized wrong-answer history  (0-100)
 *   revisionProgress    — average SR interval / 14  (0-100)
 *   practiceConsistency — attempt count proxy  (0-100)
 *
 * Difficulty tiers (per spec):
 *   masteryScore < 40   → Easy
 *   40 ≤ mastery < 70   → Medium
 *   70 ≤ mastery < 90   → Hard
 *   ≥ 90                → Challenge
 *
 * Daily recommendations are cached in `studyai-adaptive-v1` and regenerated
 * automatically when the calendar date changes.
 */

import { useState, useCallback, useRef } from "react";
import type { Subject } from "@/data/subjects";

// ─── localStorage keys ────────────────────────────────────────────────────────
const PROGRESS_KEY = "studyai-progress-v2";
const MISTAKES_KEY = "studyai-mistakes-v1";
const REVISION_KEY = "studyai-revision-v1";
const ADAPTIVE_KEY = "studyai-adaptive-v1";

// ─── Minimal local storage shapes ─────────────────────────────────────────────
// These mirror the storage format of the sibling hooks but are scoped to
// exactly what the engine needs (no React state involved).

interface ProgressRec  { solved: number; correct: number; }
type ProgressStore     = Record<string, Record<string, ProgressRec>>;

interface AttemptRec   { subject: string; topic: string; chapter: string; wrong: number; solved: boolean; }
interface JournalStore { events: unknown[]; attempts: Record<string, AttemptRec>; }

interface RevItem      { subject: string; topic: string; interval: number; mastered: boolean; }
type RevisionStore     = Record<string, RevItem>;

// ─── Public types ─────────────────────────────────────────────────────────────

export type RecommendedTier = "Easy" | "Medium" | "Hard" | "Challenge";

export interface TopicProfile {
  subject:             Subject;
  topic:               string;
  chapter:             string;
  /** Raw accuracy × depth multiplier (0-100) */
  masteryScore:        number;
  /** masteryScore weighted by attempt count (0-100) */
  confidenceScore:     number;
  /** Normalized wrong-answer rate (0-100) */
  mistakeFrequency:    number;
  /** Average SR interval / 14, as percentage (0-100) */
  revisionProgress:    number;
  /** Attempt count proxy (0-100) */
  practiceConsistency: number;
  recommendedDifficulty: RecommendedTier;
  /** Composite urgency score — higher means more important to study */
  priorityScore:       number;
}

export interface DailyRecommendation {
  rank:                  1 | 2 | 3;
  subject:               Subject;
  topic:                 string;
  chapter:               string;
  masteryScore:          number;
  recommendedDifficulty: RecommendedTier;
  /** Human-readable reason why this topic was chosen */
  reason:                string;
  priorityScore:         number;
}

interface AdaptiveCache {
  date:            string;
  recommendations: DailyRecommendation[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_LIST: Subject[] = ["Physics", "Chemistry", "Mathematics", "Economics"];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

// ─── Core computation ─────────────────────────────────────────────────────────

function computeTopicProfiles(
  progress: ProgressStore,
  journal:  JournalStore,
  revision: RevisionStore,
): TopicProfile[] {
  const profiles: TopicProfile[] = [];

  for (const subject of SUBJECT_LIST) {
    const subjectProgress = progress[subject] ?? {};

    for (const [topic, rec] of Object.entries(subjectProgress)) {
      // Require at least 2 attempts for meaningful data
      if (!rec || rec.solved < 2) continue;

      // 1. Mastery — raw accuracy
      const accuracy     = rec.correct / rec.solved;
      const masteryScore = Math.round(accuracy * 100);

      // 2. Confidence — accuracy weighted by attempt depth
      //    8+ attempts = full confidence; fewer = proportionally less
      const confidenceScore = Math.round(
        masteryScore * Math.min(rec.solved / 8, 1)
      );

      // 3. Mistake frequency — total wrong attempts for this topic
      const totalWrong = Object.values(journal.attempts)
        .filter((a) => a.subject === subject && a.topic === topic)
        .reduce((s, a) => s + a.wrong, 0);
      const mistakeFrequency = Math.round(Math.min(totalWrong / 15, 1) * 100);

      // 4. Revision progress — average SR interval for active items
      const revItems = Object.values(revision).filter(
        (r) => r.subject === subject && r.topic === topic && !r.mastered
      );
      const avgInterval =
        revItems.length > 0
          ? revItems.reduce((s, r) => s + r.interval, 0) / revItems.length
          : 0;
      const revisionProgress = Math.round((avgInterval / 14) * 100);

      // 5. Practice consistency — solved-count proxy (10+ = consistent)
      const practiceConsistency = Math.round(Math.min(rec.solved / 10, 1) * 100);

      // Recommended difficulty tier (per product spec)
      let recommendedDifficulty: RecommendedTier;
      if      (masteryScore < 40) recommendedDifficulty = "Easy";
      else if (masteryScore < 70) recommendedDifficulty = "Medium";
      else if (masteryScore < 90) recommendedDifficulty = "Hard";
      else                        recommendedDifficulty = "Challenge";

      // Composite priority score — higher = more urgent to revise
      //   40% weight: low mastery
      //   30% weight: mistake history
      //   20% weight: not yet reinforced via spaced repetition
      //   10% weight: inconsistent practice
      const priorityScore = Math.round(
        (100 - masteryScore)                   * 0.40 +
        mistakeFrequency                       * 0.30 +
        (100 - Math.max(revisionProgress, 5)) * 0.20 +
        (100 - practiceConsistency)            * 0.10
      );

      // Chapter lookup — first matching journal attempt record
      const chapterAttempt = Object.values(journal.attempts).find(
        (a) => a.subject === subject && a.topic === topic
      );

      profiles.push({
        subject: subject as Subject,
        topic,
        chapter:             chapterAttempt?.chapter ?? "",
        masteryScore,
        confidenceScore,
        mistakeFrequency,
        revisionProgress,
        practiceConsistency,
        recommendedDifficulty,
        priorityScore,
      });
    }
  }

  // Highest priority first
  return profiles.sort((a, b) => b.priorityScore - a.priorityScore);
}

function buildReason(p: TopicProfile): string {
  const { masteryScore, mistakeFrequency, recommendedDifficulty } = p;
  if (masteryScore < 30)     return `Mastery ${masteryScore}% — build the foundation`;
  if (mistakeFrequency > 60) return `High mistake rate — targeted review needed`;
  if (masteryScore < 50)     return `Accuracy ${masteryScore}% — consistent practice helps`;
  if (masteryScore < 70)     return `Building up — try ${recommendedDifficulty} questions`;
  if (masteryScore < 90)     return `Strong base — challenge with Hard questions`;
  return `Near mastery — Challenge mode awaits!`;
}

// ─── Daily recommendation persistence ─────────────────────────────────────────

function generateAndCache(profiles: TopicProfile[]): DailyRecommendation[] {
  const today = todayStr();
  const recs  = profiles.slice(0, 3).map((p, i) => ({
    rank:                  (i + 1) as 1 | 2 | 3,
    subject:               p.subject,
    topic:                 p.topic,
    chapter:               p.chapter,
    masteryScore:          p.masteryScore,
    recommendedDifficulty: p.recommendedDifficulty,
    reason:                buildReason(p),
    priorityScore:         p.priorityScore,
  }));
  try {
    localStorage.setItem(ADAPTIVE_KEY, JSON.stringify({ date: today, recommendations: recs }));
  } catch {}
  return recs;
}

function loadCachedRecommendations(): DailyRecommendation[] | null {
  const cache = safeRead<AdaptiveCache | null>(ADAPTIVE_KEY, null);
  if (
    cache?.date === todayStr() &&
    Array.isArray(cache.recommendations) &&
    cache.recommendations.length > 0
  ) {
    return cache.recommendations;
  }
  return null;
}

// ─── Engine snapshot ──────────────────────────────────────────────────────────

function computeAll(): TopicProfile[] {
  return computeTopicProfiles(
    safeRead<ProgressStore>(PROGRESS_KEY, { Physics: {}, Chemistry: {}, Mathematics: {}, Economics: {} }),
    safeRead<JournalStore>(MISTAKES_KEY, { events: [], attempts: {} }),
    safeRead<RevisionStore>(REVISION_KEY, {}),
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdaptiveLearning() {
  const [profiles, setProfiles] = useState<TopicProfile[]>(() => computeAll());

  const [recommendations, setRecommendations] = useState<DailyRecommendation[]>(() => {
    const cached = loadCachedRecommendations();
    if (cached) return cached;
    return generateAndCache(computeAll());
  });

  // Auto-regenerate on calendar day change (e.g. tab left open overnight)
  const lastDayRef  = useRef(todayStr());
  const currentDay  = todayStr();
  if (lastDayRef.current !== currentDay) {
    lastDayRef.current = currentDay;
    const fresh = computeAll();
    setProfiles(fresh);
    setRecommendations(generateAndCache(fresh));
  }

  /**
   * Force a full recomputation — call after a practice session completes so
   * recommendations reflect the latest attempts before the next day.
   */
  const refresh = useCallback(() => {
    const fresh = computeAll();
    setProfiles(fresh);
    setRecommendations(generateAndCache(fresh));
  }, []);

  // ── Queries ────────────────────────────────────────────────────────────────

  /** Recommended difficulty tier for one specific topic. */
  const getTopicTier = useCallback(
    (subject: Subject, topic: string): RecommendedTier =>
      profiles.find((p) => p.subject === subject && p.topic === topic)
        ?.recommendedDifficulty ?? "Easy",
    [profiles]
  );

  /**
   * Overall recommended difficulty for a subject — derived from the average
   * mastery score across all practiced topics in that subject.
   */
  const getSubjectTier = useCallback(
    (subject: Subject): RecommendedTier => {
      const subj = profiles.filter((p) => p.subject === subject);
      if (subj.length === 0) return "Easy";
      const avg = subj.reduce((s, p) => s + p.masteryScore, 0) / subj.length;
      if (avg < 40) return "Easy";
      if (avg < 70) return "Medium";
      if (avg < 90) return "Hard";
      return "Challenge";
    },
    [profiles]
  );

  /** Average mastery score (0-100) across all practiced topics in a subject. */
  const getSubjectMastery = useCallback(
    (subject: Subject): number => {
      const subj = profiles.filter((p) => p.subject === subject);
      if (subj.length === 0) return 0;
      return Math.round(
        subj.reduce((s, p) => s + p.masteryScore, 0) / subj.length
      );
    },
    [profiles]
  );

  return {
    topicProfiles:  profiles,
    recommendations,
    getTopicTier,
    getSubjectTier,
    getSubjectMastery,
    refresh,
  };
}
