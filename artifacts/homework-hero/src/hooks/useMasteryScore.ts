/**
 * useMasteryScore — 0–100 composite mastery score per subject.
 *
 * Formula (weighted average of four dimensions):
 *
 *   Mastery = round(
 *     0.40 × accuracy_score       (% correct of all attempts)
 *     + 0.30 × difficulty_score   (difficulty-weighted accuracy)
 *     + 0.20 × consistency_score  (breadth: distinct chapters practiced / total)
 *     + 0.10 × recency_score      (last-10 attempts, exponential decay weights)
 *   )
 *
 * Difficulty weights: Easy → 1.0 × Medium → 1.5 × Hard → 2.0
 * Recency decay: most-recent attempt weight 1.0, each older × 0.85
 *
 * Returns 0 when no attempts exist.
 */

import { useMemo } from "react";
import type { Subject } from "@/data/subjects";
import { useAttemptLog, type AttemptRecord } from "@/hooks/useAttemptLog";
import { getChapters } from "@/services/questionService";

const DIFF_WEIGHT: Record<string, number> = {
  Easy: 1.0,
  Medium: 1.5,
  Hard: 2.0,
};
const RECENCY_DECAY = 0.85;

/** Compute 0–100 accuracy score from attempt records. */
function accuracyScore(records: AttemptRecord[]): number {
  if (records.length === 0) return 0;
  const correct = records.filter((r) => r.correct).length;
  return (correct / records.length) * 100;
}

/**
 * Difficulty-weighted accuracy.
 * Each question earns DIFF_WEIGHT[difficulty] × (1 if correct, 0 if not).
 * Score = sum(earned) / sum(max_possible) × 100.
 */
function difficultyScore(records: AttemptRecord[]): number {
  if (records.length === 0) return 0;
  let earned = 0;
  let maxPossible = 0;
  for (const r of records) {
    const w = DIFF_WEIGHT[r.difficulty] ?? 1.0;
    maxPossible += w;
    if (r.correct) earned += w;
  }
  return maxPossible > 0 ? (earned / maxPossible) * 100 : 0;
}

/**
 * Consistency score: proportion of total chapters practised at least once.
 * = distinct chapters with ≥1 attempt / total chapters in subject.
 * Capped at 100.
 */
function consistencyScore(
  records: AttemptRecord[],
  subject: Subject,
  classNum: number,
): number {
  if (records.length === 0) return 0;
  const totalChapters = getChapters(classNum, subject).length;
  if (totalChapters === 0) return 0;
  const practiced = new Set(records.map((r) => r.chapterId)).size;
  return Math.min((practiced / totalChapters) * 100, 100);
}

/**
 * Recency score: weight last-10 attempts with exponential decay.
 * Most recent: weight 1.0. Each older: × 0.85.
 * Score = weighted_correct / weighted_total × 100.
 */
function recencyScore(records: AttemptRecord[]): number {
  if (records.length === 0) return 0;
  const sorted = [...records].sort(
    (a, b) => new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime(),
  );
  const last10 = sorted.slice(0, 10);
  let weightedCorrect = 0;
  let weightedTotal = 0;
  last10.forEach((r, idx) => {
    const w = Math.pow(RECENCY_DECAY, idx);
    weightedTotal += w;
    if (r.correct) weightedCorrect += w;
  });
  return weightedTotal > 0 ? (weightedCorrect / weightedTotal) * 100 : 0;
}

export interface MasteryResult {
  score: number;       // 0–100 composite
  accuracy: number;    // 0–100
  difficulty: number;  // 0–100 difficulty-weighted accuracy
  consistency: number; // 0–100 chapter breadth
  recency: number;     // 0–100 recent performance
  label: "Beginner" | "Developing" | "Proficient" | "Advanced" | "Expert";
  color: string;       // Tailwind text colour class
}

function masteryLabel(score: number): MasteryResult["label"] {
  if (score >= 85) return "Expert";
  if (score >= 70) return "Advanced";
  if (score >= 55) return "Proficient";
  if (score >= 35) return "Developing";
  return "Beginner";
}

function masteryColor(score: number): string {
  if (score >= 85) return "#8b5cf6";  // violet-500
  if (score >= 70) return "#10b981";  // emerald-500
  if (score >= 55) return "#3b82f6";  // blue-500
  if (score >= 35) return "#f59e0b";  // amber-500
  return "#94a3b8";                   // slate-400
}

export function useMasteryScore(subject: Subject, classNum: number): MasteryResult {
  const { log } = useAttemptLog();

  return useMemo(() => {
    const records = Object.values(log).filter(
      (r) => r.subject === subject && r.classNum === classNum,
    );

    if (records.length === 0) {
      return {
        score: 0, accuracy: 0, difficulty: 0, consistency: 0, recency: 0,
        label: "Beginner", color: masteryColor(0),
      };
    }

    const acc  = accuracyScore(records);
    const diff = difficultyScore(records);
    const cons = consistencyScore(records, subject, classNum);
    const rec  = recencyScore(records);

    const raw   = 0.40 * acc + 0.30 * diff + 0.20 * cons + 0.10 * rec;
    const score = Math.round(Math.min(Math.max(raw, 0), 100));

    return {
      score,
      accuracy:    Math.round(acc),
      difficulty:  Math.round(diff),
      consistency: Math.round(cons),
      recency:     Math.round(rec),
      label:       masteryLabel(score),
      color:       masteryColor(score),
    };
  }, [log, subject, classNum]);
}
