/**
 * Mastery Engine — multi-dimensional mastery beyond a single score.
 *
 * Bloom's Taxonomy levels (for each topic):
 *   1. Remember   — can recall definitions and formulas           (mastery 0–20)
 *   2. Understand — can explain the concept in own words          (mastery 20–40)
 *   3. Apply      — can solve standard exam questions             (mastery 40–60)
 *   4. Analyse    — can identify patterns and edge cases          (mastery 60–75)
 *   5. Evaluate   — can spot mistakes and choose best approaches  (mastery 75–90)
 *   6. Create     — can derive and extend the concept             (mastery 90–100)
 *
 * Two mastery types tracked:
 *  - Procedural mastery: can follow steps (measured by correctness)
 *  - Conceptual mastery: understands the WHY (measured by conceptual Q answers)
 *
 * Firestore path: students/{id}/masteryProfiles/{topicKey}
 */

import { readAllMastery } from "./syncManager";

const KEY = "studyai-v1-mastery-profiles";

export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface TopicMasteryProfile {
  topicKey:           string;
  topic:              string;
  subject:            string;

  proceduralMastery:  number;   // 0–100, from correct answers + step engagement
  conceptualMastery:  number;   // 0–100, from conceptual Q correct answers
  overallMastery:     number;   // weighted: 60% procedural + 40% conceptual
  bloomLevel:         BloomLevel;
  bloomLabel:         string;

  // Trend: is the student improving or declining?
  trend:              "improving" | "stable" | "declining";
  lastScores:         number[];  // last 5 mastery readings (for trend)

  // Confidence gap: does student THINK they know it? (self-report vs actual)
  perceivedMastery:   number;   // 0–100, from confidence sliders / self-reports
  confidenceGap:      number;   // perceivedMastery − overallMastery (positive = overconfident)

  updatedAt: number;
}

export interface MasterySnapshot {
  profiles:            Record<string, TopicMasteryProfile>;
  subjectAverages:     Record<string, number>;  // subject → average mastery
  globalAverage:       number;
  strongestTopic:      string | null;
  weakestTopic:        string | null;
  bloomDistribution:   Record<BloomLevel, number>;  // how many topics at each level
  updatedAt:           number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

function scoreToBloom(score: number): BloomLevel {
  if (score >= 90) return 6;
  if (score >= 75) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

const BLOOM_LABELS: Record<BloomLevel, string> = {
  1: "Remember",
  2: "Understand",
  3: "Apply",
  4: "Analyse",
  5: "Evaluate",
  6: "Create",
};

function computeTrend(lastScores: number[]): "improving" | "stable" | "declining" {
  if (lastScores.length < 3) return "stable";
  const recent = lastScores.slice(-3);
  const delta  = recent[2] - recent[0];
  if (delta >= 5)  return "improving";
  if (delta <= -5) return "declining";
  return "stable";
}

export function getMasterySnapshot(): MasterySnapshot {
  return lsRead<MasterySnapshot>(KEY, {
    profiles: {}, subjectAverages: {}, globalAverage: 0,
    strongestTopic: null, weakestTopic: null,
    bloomDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    updatedAt: 0,
  });
}

/** Recompute full mastery snapshot from base mastery data. Call after each session. */
export function recomputeMasterySnapshot(): MasterySnapshot {
  const allMastery  = readAllMastery();
  const snapshot    = getMasterySnapshot();
  const profiles: Record<string, TopicMasteryProfile> = { ...snapshot.profiles };

  for (const [key, entry] of Object.entries(allMastery)) {
    const prev = profiles[key];
    const lastScores = prev ? [...prev.lastScores, entry.masteryScore].slice(-5) : [entry.masteryScore];
    const proceduralMastery = entry.masteryScore;
    // Conceptual mastery: we track this via conceptual Q answers; default to 60% of procedural for now
    const conceptualMastery = prev?.conceptualMastery ?? Math.round(proceduralMastery * 0.6);
    const overallMastery = Math.round(proceduralMastery * 0.6 + conceptualMastery * 0.4);
    const bloomLevel = scoreToBloom(overallMastery);

    profiles[key] = {
      topicKey:          key,
      topic:             entry.topic,
      subject:           entry.subject,
      proceduralMastery,
      conceptualMastery,
      overallMastery,
      bloomLevel,
      bloomLabel:        BLOOM_LABELS[bloomLevel],
      trend:             computeTrend(lastScores),
      lastScores,
      perceivedMastery:  prev?.perceivedMastery ?? proceduralMastery,
      confidenceGap:     (prev?.perceivedMastery ?? proceduralMastery) - overallMastery,
      updatedAt:         Date.now(),
    };
  }

  // Subject averages
  const subjectGroups: Record<string, number[]> = {};
  for (const p of Object.values(profiles)) {
    if (!subjectGroups[p.subject]) subjectGroups[p.subject] = [];
    subjectGroups[p.subject].push(p.overallMastery);
  }
  const subjectAverages: Record<string, number> = {};
  for (const [subj, scores] of Object.entries(subjectGroups)) {
    subjectAverages[subj] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  const allProfiles = Object.values(profiles);
  const globalAverage = allProfiles.length
    ? Math.round(allProfiles.reduce((s, p) => s + p.overallMastery, 0) / allProfiles.length)
    : 0;

  const sorted = [...allProfiles].sort((a, b) => b.overallMastery - a.overallMastery);
  const strongestTopic = sorted[0]?.topic ?? null;
  const weakestTopic   = sorted[sorted.length - 1]?.topic ?? null;

  const bloomDist: Record<BloomLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const p of allProfiles) bloomDist[p.bloomLevel]++;

  const result: MasterySnapshot = {
    profiles, subjectAverages, globalAverage,
    strongestTopic, weakestTopic,
    bloomDistribution: bloomDist,
    updatedAt: Date.now(),
  };

  lsWrite(result);
  return result;
}

/** Update conceptual mastery after a learning-loop answer. */
export function updateConceptualMastery(topicKey: string, correct: boolean): void {
  const snap = getMasterySnapshot();
  const p    = snap.profiles[topicKey];
  if (!p) return;

  const delta = correct ? 15 : -8;
  const newConceptual = Math.min(100, Math.max(0, p.conceptualMastery + delta));
  snap.profiles[topicKey] = {
    ...p,
    conceptualMastery: newConceptual,
    overallMastery: Math.round(p.proceduralMastery * 0.6 + newConceptual * 0.4),
    updatedAt: Date.now(),
  };
  lsWrite(snap);
}

/** Self-reported confidence for a topic (0–100). */
export function reportPerceivedMastery(topicKey: string, confidence: number): void {
  const snap = getMasterySnapshot();
  const p    = snap.profiles[topicKey];
  if (!p) return;
  snap.profiles[topicKey] = {
    ...p,
    perceivedMastery: confidence,
    confidenceGap: confidence - p.overallMastery,
    updatedAt: Date.now(),
  };
  lsWrite(snap);
}

/** Topics where the student is overconfident (perceived > actual by ≥ 20). */
export function getOverconfidentTopics(): TopicMasteryProfile[] {
  const snap = getMasterySnapshot();
  return Object.values(snap.profiles).filter((p) => p.confidenceGap >= 20);
}
