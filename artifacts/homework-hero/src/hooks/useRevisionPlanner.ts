/**
 * useRevisionPlanner — Spaced Repetition Engine
 *
 * Scheduling intervals: 1 → 3 → 7 → 14 days.
 * Correct answer at 14 days = mastered (check-in at 30 days).
 * Wrong answer at any stage = reset to 1 day.
 *
 * Priority factors (for sorting due items):
 *   1. Days overdue
 *   2. Wrong-answer history
 *   3. Weak topic (from Mistake Journal)
 *   4. Short interval (less confident)
 *
 * Persisted in localStorage under `studyai-revision-v1`.
 */

import { useState, useCallback, useMemo } from "react";
import type { Subject } from "@/data/subjects";
import type { Difficulty } from "@/services/questionService";

const KEY = "studyai-revision-v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SRInterval = 1 | 3 | 7 | 14;

const NEXT_INTERVAL: Record<SRInterval, SRInterval> = {
  1: 3,
  3: 7,
  7: 14,
  14: 14,   // stays at 14 until mastered
};

export interface RevisionItem {
  questionId:   string;
  question:     string;
  subject:      Subject;
  topic:        string;
  chapter:      string;
  difficulty:   Difficulty;
  /** Current spaced-repetition interval in days */
  interval:     SRInterval;
  /** ISO date string "YYYY-MM-DD" of the next scheduled review */
  nextReview:   string;
  /** ISO date string when first added to the queue */
  addedDate:    string;
  /** ISO date string of most recent review, or null */
  lastReview:   string | null;
  timesCorrect: number;
  timesWrong:   number;
  /** true once answered correctly at the 14-day interval */
  mastered:     boolean;
}

type RevisionStore = Record<string, RevisionItem>;  // keyed by questionId

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(fromDate: string, days: number): string {
  const d = new Date(fromDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function load(): RevisionStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as RevisionStore;
  } catch {}
  return {};
}

function persist(store: RevisionStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}

/** Higher score = show first */
function priorityScore(item: RevisionItem, weakTopics: string[], today: string): number {
  let score = 0;

  // Each day overdue adds substantial weight
  if (item.nextReview < today) {
    const msOverdue = Date.now() - new Date(item.nextReview + "T12:00:00").getTime();
    score += Math.floor(msOverdue / 86_400_000) * 10;
  }

  // Wrong history — struggle means higher priority
  score += item.timesWrong * 5;

  // Weak topic bonus (cross-referenced from Mistake Journal)
  if (weakTopics.includes(item.topic)) score += 20;

  // Shorter interval = less confident = higher priority
  score += (14 - item.interval) * 2;

  return score;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRevisionPlanner() {
  const [store, setStore] = useState<RevisionStore>(load);

  const mutate = useCallback((fn: (prev: RevisionStore) => RevisionStore) => {
    setStore((prev) => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }, []);

  // ── Write operations ──────────────────────────────────────────────────────

  /**
   * Called when a question is answered in Practice mode.
   * - First encounter: enqueues with a 1-day interval.
   * - Repeat attempt: advances or resets the SR interval.
   */
  const recordAttempt = useCallback(
    (
      questionId: string,
      question:   string,
      subject:    Subject,
      topic:      string,
      chapter:    string,
      difficulty: Difficulty,
      correct:    boolean,
    ) => {
      mutate((prev) => {
        const today    = todayStr();
        const existing = prev[questionId];

        if (!existing) {
          return {
            ...prev,
            [questionId]: {
              questionId, question, subject, topic, chapter, difficulty,
              interval:     1,
              nextReview:   addDays(today, 1),
              addedDate:    today,
              lastReview:   null,
              timesCorrect: correct ? 1 : 0,
              timesWrong:   correct ? 0 : 1,
              mastered:     false,
            },
          };
        }

        const newInterval = correct ? NEXT_INTERVAL[existing.interval] : 1;
        const mastered    = correct && existing.interval === 14;
        // Mastered items: schedule a long-term check-in instead of removing
        const nextReview  = mastered ? addDays(today, 30) : addDays(today, newInterval);

        return {
          ...prev,
          [questionId]: {
            ...existing,
            interval:     newInterval,
            nextReview,
            lastReview:   today,
            timesCorrect: existing.timesCorrect + (correct ? 1 : 0),
            timesWrong:   existing.timesWrong   + (correct ? 0 : 1),
            mastered,
          },
        };
      });
    },
    [mutate]
  );

  /**
   * Called when a due item is reviewed on the Revision page.
   * Same SR logic as recordAttempt.
   */
  const completeReview = useCallback(
    (questionId: string, correct: boolean) => {
      mutate((prev) => {
        const item = prev[questionId];
        if (!item) return prev;

        const today       = todayStr();
        const newInterval = correct ? NEXT_INTERVAL[item.interval] : 1;
        const mastered    = correct && item.interval === 14;
        const nextReview  = mastered ? addDays(today, 30) : addDays(today, newInterval);

        return {
          ...prev,
          [questionId]: {
            ...item,
            interval:     newInterval,
            nextReview,
            lastReview:   today,
            timesCorrect: item.timesCorrect + (correct ? 1 : 0),
            timesWrong:   item.timesWrong   + (correct ? 0 : 1),
            mastered,
          },
        };
      });
    },
    [mutate]
  );

  // ── Read queries ──────────────────────────────────────────────────────────

  /**
   * Items overdue or due today, sorted by priority descending.
   * Pass weakTopics from useMistakeJournal for bonus scoring.
   */
  const getDueItems = useCallback(
    (weakTopics: string[] = []): RevisionItem[] => {
      const today = todayStr();
      return Object.values(store)
        .filter((item) => !item.mastered && item.nextReview <= today)
        .sort(
          (a, b) =>
            priorityScore(b, weakTopics, today) -
            priorityScore(a, weakTopics, today)
        );
    },
    [store]
  );

  /**
   * Upcoming items grouped by date for the next 14 days.
   */
  const getUpcomingSchedule = useCallback(
    (): Array<{ date: string; items: RevisionItem[] }> => {
      const today  = todayStr();
      const cutoff = addDays(today, 14);
      const upcoming = Object.values(store).filter(
        (item) =>
          !item.mastered &&
          item.nextReview > today &&
          item.nextReview <= cutoff
      );
      const byDate = new Map<string, RevisionItem[]>();
      for (const item of upcoming) {
        if (!byDate.has(item.nextReview)) byDate.set(item.nextReview, []);
        byDate.get(item.nextReview)!.push(item);
      }
      return [...byDate.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, items]) => ({ date, items }));
    },
    [store]
  );

  // Derived counts (cheap — no full sort)
  const dueCount = useMemo(() => {
    const today = todayStr();
    return Object.values(store).filter(
      (item) => !item.mastered && item.nextReview <= today
    ).length;
  }, [store]);

  const next7Count = useMemo(() => {
    const today  = todayStr();
    const cutoff = addDays(today, 7);
    return Object.values(store).filter(
      (item) =>
        !item.mastered &&
        item.nextReview > today &&
        item.nextReview <= cutoff
    ).length;
  }, [store]);

  const masteredCount = useMemo(
    () => Object.values(store).filter((item) => item.mastered).length,
    [store]
  );

  const totalScheduled = useMemo(
    () => Object.values(store).filter((item) => !item.mastered).length,
    [store]
  );

  return {
    recordAttempt,
    completeReview,
    getDueItems,
    getUpcomingSchedule,
    dueCount,
    next7Count,
    masteredCount,
    totalScheduled,
  };
}
