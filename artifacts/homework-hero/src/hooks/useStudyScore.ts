/**
 * useStudyScore — Composite 0-100 Study Score
 *
 * Formula (four weighted components):
 *   Accuracy      40%  — overall correct / solved across all subjects
 *   Practice      25%  — problems solved, normalised to a 50-question ceiling
 *   Revision      20%  — spaced-repetition completion rate today
 *   Streak        15%  — consecutive study days, normalised to a 7-day ceiling
 *
 * Self-contained: reads localStorage directly, no hook composition needed.
 *
 * Grade thresholds:
 *   ≥ 90  Scholar        ✦  #7c3aed (violet)
 *   ≥ 80  Top Performer  🌟 #10b981 (emerald)
 *   ≥ 65  Strong Learner 💪 #4f46e5 (indigo)
 *   ≥ 50  Making Progress📈 #f59e0b (amber)
 *   ≥ 30  Building Up    📚 #f97316 (orange)
 *    < 30  Just Starting  🌱 #94a3b8 (slate)
 */

import { useMemo } from "react";

// ─── Storage keys ─────────────────────────────────────────────────────────────
const PROGRESS_KEY = "studyai-progress-v2";
const REVISION_KEY = "studyai-revision-v1";
const STREAK_KEY   = "homework-hero-streak";

// ─── Formula weights ──────────────────────────────────────────────────────────
const W_ACCURACY = 0.40;
const W_PRACTICE = 0.25;
const W_REVISION = 0.20;
const W_STREAK   = 0.15;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  accuracy: number;  // 0-100 raw input value
  practice: number;
  revision: number;
  streak:   number;
}

export interface StudyScore {
  score:     number;        // 0-100, final composite
  grade:     string;        // e.g. "Strong Learner"
  emoji:     string;        // e.g. "💪"
  color:     string;        // hex, matches grade tier
  breakdown: ScoreBreakdown;
  hasData:   boolean;       // false when no questions have been solved yet
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ─── Internal types for raw storage ──────────────────────────────────────────

interface TopicRecord { solved: number; correct: number }
interface ProgressData {
  Physics:     Record<string, TopicRecord>;
  Chemistry:   Record<string, TopicRecord>;
  Mathematics: Record<string, TopicRecord>;
}
interface RevisionItem { dueDate: string }
interface StreakData { streak: number }

// ─── Grade lookup ─────────────────────────────────────────────────────────────

function toGrade(score: number): { grade: string; emoji: string; color: string } {
  if (score >= 90) return { grade: "Scholar",        emoji: "✦",  color: "#7c3aed" };
  if (score >= 80) return { grade: "Top Performer",  emoji: "🌟", color: "#10b981" };
  if (score >= 65) return { grade: "Strong Learner", emoji: "💪", color: "#4f46e5" };
  if (score >= 50) return { grade: "Making Progress",emoji: "📈", color: "#f59e0b" };
  if (score >= 30) return { grade: "Building Up",    emoji: "📚", color: "#f97316" };
  return             { grade: "Just Starting",       emoji: "🌱", color: "#94a3b8" };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStudyScore(): StudyScore {
  return useMemo(() => {
    // ── 1. Accuracy ────────────────────────────────────────────────────────
    const prog = safeRead<ProgressData>(PROGRESS_KEY, {
      Physics: {}, Chemistry: {}, Mathematics: {},
    });

    const allTopics = [
      ...Object.values(prog.Physics),
      ...Object.values(prog.Chemistry),
      ...Object.values(prog.Mathematics),
    ];
    const totalSolved  = allTopics.reduce((s, v) => s + v.solved,  0);
    const totalCorrect = allTopics.reduce((s, v) => s + v.correct, 0);
    const accuracy     = totalSolved > 0
      ? Math.round((totalCorrect / totalSolved) * 100)
      : 0;

    // ── 2. Practice depth ─────────────────────────────────────────────────
    // 50 questions = 100 % — rewards volume of practice
    const practice = Math.min(totalSolved / 50, 1) * 100;

    // ── 3. Revision completion ────────────────────────────────────────────
    const revData  = safeRead<Record<string, RevisionItem>>(REVISION_KEY, {});
    const revItems = Object.values(revData);
    const today    = new Date().toISOString().slice(0, 10);
    const overdue  = revItems.filter((r) => r.dueDate <= today).length;
    const revision = revItems.length > 0
      ? Math.round(((revItems.length - overdue) / revItems.length) * 100)
      : 0;

    // ── 4. Streak ─────────────────────────────────────────────────────────
    // 7-day consecutive streak = 100 %
    const streakData = safeRead<StreakData>(STREAK_KEY, { streak: 0 });
    const streak     = Math.min(streakData.streak / 7, 1) * 100;

    // ── Composite score ───────────────────────────────────────────────────
    const raw   = accuracy  * W_ACCURACY
                + practice  * W_PRACTICE
                + revision  * W_REVISION
                + streak    * W_STREAK;
    const score = Math.round(Math.max(0, Math.min(100, raw)));

    const { grade, emoji, color } = toGrade(score);

    return {
      score,
      grade,
      emoji,
      color,
      hasData: totalSolved > 0,
      breakdown: {
        accuracy: Math.round(accuracy),
        practice: Math.round(practice),
        revision: Math.round(revision),
        streak:   Math.round(streak),
      },
    };
  }, []);
}
