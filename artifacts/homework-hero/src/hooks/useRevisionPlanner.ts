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
 * Persisted in a board/class-scoped localStorage store.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import type { Subject } from "@/data/subjects";
import type { Difficulty } from "@/services/questionService";
import { scopedStorageKey, makeAcademicContext } from "@/data/questions/academicContext";
import { useProfile } from "@/hooks/useProfile";

const KEY_PREFIX = "studyai-revision-v2";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SRInterval = 1 | 3 | 7 | 14;
export type SelfAssessmentStatus = "CONFIDENT" | "NEEDS_PRACTICE" | "UNSET";

const NEXT_INTERVAL: Record<SRInterval, SRInterval> = {
  1: 3,
  3: 7,
  7: 14,
  14: 14,   // stays at 14 until mastered
};

export interface RevisionItem {
  questionId:   string;
  boardId?:     string;
  classNum?:    number;
  canonicalChapterId?: string | null;
  academicSession?: string;
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

export type RevisionItems = Record<string, RevisionItem>;  // keyed by questionId

export interface SelfAssessmentRecord {
  questionId: string;
  boardId?: string;
  classNum?: number;
  canonicalChapterId?: string | null;
  academicSession?: string;
  question: string;
  subject: Subject;
  topic: string;
  chapter: string;
  difficulty: Difficulty;
  status: Exclude<SelfAssessmentStatus, "UNSET">;
  updatedAt: string;
}

export interface RevisionStore {
  items: RevisionItems;
  selfAssessments: Record<string, SelfAssessmentRecord>;
}

export type SelfAssessmentInput = Omit<SelfAssessmentRecord, "status" | "updatedAt">;

export function resolveRevisionClassNum(
  practiceClassNum: number | undefined,
  profileClassNum: number | null,
): number {
  for (const candidate of [practiceClassNum, profileClassNum]) {
    if (typeof candidate === "number" && Number.isInteger(candidate) && candidate >= 6 && candidate <= 12) {
      return candidate;
    }
  }
  return 9;
}

export function buildRevisionSolutionHref(questionId: string): string {
  return `/solution?practiceMode=1&questionId=${encodeURIComponent(questionId)}`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(fromDate: string, days: number): string {
  const d = new Date(fromDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function parseRevisionStore(raw: string | null): RevisionStore {
  if (!raw) return { items: {}, selfAssessments: {} };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { items: {}, selfAssessments: {} };
    }
    const value = parsed as Record<string, unknown>;
    if (
      value.items &&
      typeof value.items === "object" &&
      !Array.isArray(value.items) &&
      value.selfAssessments &&
      typeof value.selfAssessments === "object" &&
      !Array.isArray(value.selfAssessments)
    ) {
      return {
        items: value.items as RevisionItems,
        selfAssessments: value.selfAssessments as Record<string, SelfAssessmentRecord>,
      };
    }
    // Preserve legacy revision items while adding the canonical self-assessment
    // map to this same existing persistence boundary.
    return { items: value as RevisionItems, selfAssessments: {} };
  } catch {}
  return { items: {}, selfAssessments: {} };
}

export function loadRevisionStore(key: string | null): RevisionStore {
  if (!key) return { items: {}, selfAssessments: {} };
  try {
    return parseRevisionStore(localStorage.getItem(key));
  } catch {
    return { items: {}, selfAssessments: {} };
  }
}

export function saveRevisionStore(key: string | null, store: RevisionStore): void {
  if (key) localStorage.setItem(key, JSON.stringify(store));
}

/** Pure self-assessment transition for deterministic readiness-state tests. */
export function applySelfAssessment(
  previous: RevisionStore,
  question: SelfAssessmentInput,
  status: Exclude<SelfAssessmentStatus, "UNSET">,
  today = todayStr(),
  updatedAt = new Date().toISOString(),
): RevisionStore {
  const existingItem = previous.items[question.questionId];
  const context = {
    ...(question.boardId !== undefined ? { boardId: question.boardId } : {}),
    ...(question.classNum !== undefined ? { classNum: question.classNum } : {}),
    ...(question.canonicalChapterId !== undefined
      ? { canonicalChapterId: question.canonicalChapterId }
      : {}),
    ...(question.academicSession !== undefined ? { academicSession: question.academicSession } : {}),
  };
  const items = status === "NEEDS_PRACTICE"
    ? {
        ...previous.items,
        [question.questionId]: existingItem
          ? {
              ...existingItem,
              ...context,
              interval: 1 as SRInterval,
              nextReview: addDays(today, 1),
              mastered: false,
            }
          : {
              questionId: question.questionId,
              question: question.question,
              subject: question.subject,
              topic: question.topic,
              chapter: question.chapter,
              difficulty: question.difficulty,
              ...context,
              interval: 1 as SRInterval,
              nextReview: addDays(today, 1),
              addedDate: today,
              lastReview: null,
              timesCorrect: 0,
              timesWrong: 0,
              mastered: false,
            },
      }
    : previous.items;

  return {
    items,
    selfAssessments: {
      ...previous.selfAssessments,
      [question.questionId]: {
        ...question,
        status,
        updatedAt,
      },
    },
  };
}

export function applyRevisionReview(
  previous: RevisionStore,
  questionId: string,
  correct: boolean,
  today = todayStr(),
): RevisionStore {
  const item = previous.items[questionId];
  if (!item) return previous;

  const newInterval = correct ? NEXT_INTERVAL[item.interval] : 1;
  const mastered = correct && item.interval === 14;
  const nextReview = mastered ? addDays(today, 30) : addDays(today, newInterval);

  return {
    ...previous,
    items: {
      ...previous.items,
      [questionId]: {
        ...item,
        interval: newInterval,
        nextReview,
        lastReview: today,
        timesCorrect: item.timesCorrect + (correct ? 1 : 0),
        timesWrong: item.timesWrong + (correct ? 0 : 1),
        mastered,
      },
    },
  };
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

export function getDueRevisionItems(
  items: RevisionItems,
  today = todayStr(),
  weakTopics: string[] = [],
): RevisionItem[] {
  return Object.values(items)
    .filter((item) => !item.mastered && item.nextReview <= today)
    .sort((a, b) => priorityScore(b, weakTopics, today) - priorityScore(a, weakTopics, today));
}

export function getUpcomingRevisionSchedule(
  items: RevisionItems,
  today = todayStr(),
): Array<{ date: string; items: RevisionItem[] }> {
  const cutoff = addDays(today, 14);
  const upcoming = Object.values(items).filter(
    (item) => !item.mastered && item.nextReview > today && item.nextReview <= cutoff,
  );
  const byDate = new Map<string, RevisionItem[]>();
  for (const item of upcoming) {
    if (!byDate.has(item.nextReview)) byDate.set(item.nextReview, []);
    byDate.get(item.nextReview)!.push(item);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, scheduledItems]) => ({ date, items: scheduledItems }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRevisionPlanner(classNumOverride?: number) {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, classNumOverride ?? profile.classLevel);
  const storageKey = scopedStorageKey(KEY_PREFIX, context);
  const [stored, setStored] = useState(() => ({ key: storageKey, value: loadRevisionStore(storageKey) }));

  useEffect(() => {
    setStored({ key: storageKey, value: loadRevisionStore(storageKey) });
  }, [storageKey]);

  const store: RevisionStore = stored.key === storageKey
    ? stored.value
    : { items: {}, selfAssessments: {} };

  const mutate = useCallback((fn: (prev: RevisionStore) => RevisionStore) => {
    if (!storageKey) return;
    // Persist before scheduling React state so a route change in the same turn
    // cannot leave a newly marked question visible only in memory.
    const next = fn(loadRevisionStore(storageKey));
    saveRevisionStore(storageKey, next);
    setStored({ key: storageKey, value: next });
  }, [storageKey]);

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
        const existing = prev.items[questionId];

        if (!existing) {
          return {
            ...prev,
            items: {
              ...prev.items,
              [questionId]: {
              questionId, question, subject, topic, chapter, difficulty,
                boardId: context?.boardId,
                classNum: context?.classNum,
              interval:     1,
              nextReview:   addDays(today, 1),
              addedDate:    today,
              lastReview:   null,
              timesCorrect: correct ? 1 : 0,
              timesWrong:   correct ? 0 : 1,
              mastered:     false,
              },
            },
          };
        }

        const newInterval = correct ? NEXT_INTERVAL[existing.interval] : 1;
        const mastered    = correct && existing.interval === 14;
        // Mastered items: schedule a long-term check-in instead of removing
        const nextReview  = mastered ? addDays(today, 30) : addDays(today, newInterval);

        return {
          ...prev,
          items: {
            ...prev.items,
            [questionId]: {
            ...existing,
            interval:     newInterval,
            nextReview,
            lastReview:   today,
            timesCorrect: existing.timesCorrect + (correct ? 1 : 0),
            timesWrong:   existing.timesWrong   + (correct ? 0 : 1),
            mastered,
            },
          },
        };
      });
    },
    [context?.boardId, context?.classNum, mutate]
  );

  /**
   * Canonical student self-assessment. CONFIDENT and NEEDS_PRACTICE are mutually
   * exclusive per question ID; absence from the map represents UNSET.
   *
   * NEEDS_PRACTICE also schedules the existing revision lifecycle, without
   * fabricating a wrong-answer event.
   */
  const setSelfAssessment = useCallback(
    (
      question: SelfAssessmentInput,
      status: Exclude<SelfAssessmentStatus, "UNSET">,
    ) => {
      if (!context) return;
      mutate((prev) => applySelfAssessment(prev, {
        ...question,
        boardId: context.boardId,
        classNum: context.classNum,
      }, status));
    },
    [context?.boardId, context?.classNum, mutate],
  );

  /**
   * Called when a due item is reviewed on the Revision page.
   * Same SR logic as recordAttempt.
   */
  const completeReview = useCallback(
    (questionId: string, correct: boolean) => {
      mutate((prev) => applyRevisionReview(prev, questionId, correct));
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
      return getDueRevisionItems(store.items, todayStr(), weakTopics);
    },
    [store]
  );

  /**
   * Upcoming items grouped by date for the next 14 days.
   */
  const getUpcomingSchedule = useCallback(
    (): Array<{ date: string; items: RevisionItem[] }> => {
      return getUpcomingRevisionSchedule(store.items, todayStr());
    },
    [store]
  );

  // Derived counts (cheap — no full sort)
  const dueCount = useMemo(() => {
    const today = todayStr();
    return Object.values(store.items).filter(
      (item) => !item.mastered && item.nextReview <= today
    ).length;
  }, [store]);

  const next7Count = useMemo(() => {
    const today  = todayStr();
    const cutoff = addDays(today, 7);
    return Object.values(store.items).filter(
      (item) =>
        !item.mastered &&
        item.nextReview > today &&
        item.nextReview <= cutoff
    ).length;
  }, [store]);

  const masteredCount = useMemo(
    () => Object.values(store.items).filter((item) => item.mastered).length,
    [store]
  );

  const totalScheduled = useMemo(
    () => Object.values(store.items).filter((item) => !item.mastered).length,
    [store]
  );

  return {
    recordAttempt,
    setSelfAssessment,
    completeReview,
    getDueItems,
    getUpcomingSchedule,
    dueCount,
    next7Count,
    masteredCount,
    totalScheduled,
    revisionItems: Object.values(store.items),
    selfAssessments: store.selfAssessments,
  };
}
