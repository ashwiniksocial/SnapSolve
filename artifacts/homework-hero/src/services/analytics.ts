/**
 * analytics.ts — pure analytics functions for the Practice analytics feature.
 *
 * No React, no hooks, no side effects.
 * Consumed by Analytics.tsx and will power the future Report Card screen.
 */

import type { ChapterCompletion } from "@/hooks/useChapterStats";
import type { Question } from "@/services/questionService";

// ─── Difficulty weights ────────────────────────────────────────────────────────

export const DIFF_WEIGHT: Record<string, number> = {
  Easy:   1.0,
  Medium: 1.5,
  Hard:   2.0,
};

// ─── Core functions ────────────────────────────────────────────────────────────

/**
 * Overall accuracy across all chapters for a subject.
 * Returns 0 if no attempts.
 */
export function overallAccuracy(chapters: ChapterCompletion[]): number {
  const totalSolved  = chapters.reduce((s, c) => s + c.solved,  0);
  const totalCorrect = chapters.reduce((s, c) => s + c.correct, 0);
  return totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
}

/**
 * Accuracy for a single chapter (0–100).
 */
export function chapterAccuracy(ch: ChapterCompletion): number {
  return ch.solved > 0 ? Math.round((ch.correct / ch.solved) * 100) : 0;
}

/**
 * Difficulty-weighted accuracy for a chapter.
 *
 * Harder chapters receive a leniency boost so that low accuracy on easy
 * chapters is penalised more when detecting weak areas.
 * Falls back to plain chapterAccuracy when questions are not provided.
 */
export function weightedAccuracy(
  ch: ChapterCompletion,
  questions?: Question[],
): number {
  if (ch.solved === 0) return 100;
  const base = chapterAccuracy(ch);
  if (!questions || questions.length === 0) return base;

  const total  = questions.length;
  const hard   = questions.filter((q) => q.difficulty === "Hard").length;
  const medium = questions.filter((q) => q.difficulty === "Medium").length;

  const leniency = 1 + (hard / total) * 0.15 + (medium / total) * 0.07;
  return Math.min(100, Math.round(base * leniency));
}

/**
 * Strongest chapter: highest plain accuracy among chapters with ≥ minAttempts solved.
 * Returns null if no chapters meet the threshold.
 */
export function strongestChapter(
  chapters: ChapterCompletion[],
  minAttempts = 1,
): ChapterCompletion | null {
  const eligible = chapters.filter((c) => c.solved >= minAttempts);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, c) =>
    chapterAccuracy(c) > chapterAccuracy(best) ? c : best,
  );
}

/**
 * Weakest chapter: lowest difficulty-weighted accuracy among chapters with
 * ≥ minAttempts solved (default 10 per Weak Area Engine spec).
 * Returns null if no chapters meet the threshold.
 */
export function weakestChapter(
  chapters: ChapterCompletion[],
  questionMap?: Record<string, Question[]>,
  minAttempts = 10,
): ChapterCompletion | null {
  const eligible = chapters.filter((c) => c.solved >= minAttempts);
  if (eligible.length === 0) return null;
  return eligible.reduce((worst, c) => {
    const wA = weightedAccuracy(c, questionMap?.[c.chapterId]);
    const wW = weightedAccuracy(worst, questionMap?.[worst.chapterId]);
    return wA < wW ? c : worst;
  });
}

/**
 * Build a questionMap (chapterId → Question[]) from a flat question array.
 * Passed to weakestChapter for difficulty weighting.
 */
export function buildQuestionMap(
  questions: Question[],
): Record<string, Question[]> {
  const map: Record<string, Question[]> = {};
  for (const q of questions) {
    (map[q.chapterId] ??= []).push(q);
  }
  return map;
}
