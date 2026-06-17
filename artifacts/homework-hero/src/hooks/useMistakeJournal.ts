/**
 * useMistakeJournal
 *
 * Tracks every wrong answer as an immutable event with a timestamp so we can
 * answer questions like:
 *   - "What did I get wrong today / this week?"
 *   - "Which question keeps tripping me up?"
 *   - "How many tries before I finally solved this?"
 *   - "Which topics need the most revision?"
 *
 * Data is persisted in localStorage under `studyai-mistakes-v1`.
 * The events array is append-only; resolution is tracked in a separate map.
 */

import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

const KEY = "studyai-mistakes-v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MistakeEvent {
  id:         string;
  subject:    Subject;
  topic:      string;      // q.topicName
  chapter:    string;      // q.chapterName
  questionId: string;      // q.id
  question:   string;      // q.question text (for display)
  timestamp:  number;      // Date.now()
  date:       string;      // "YYYY-MM-DD" (used for fast date filtering)
}

interface AttemptRecord {
  subject:  Subject;
  topic:    string;
  chapter:  string;
  question: string;
  wrong:    number;    // total wrong attempts so far
  solved:   boolean;  // answered correctly at least once
}

interface JournalData {
  events:   MistakeEvent[];
  /** keyed by questionId */
  attempts: Record<string, AttemptRecord>;
}

export interface RecurringMistake {
  questionId: string;
  question:   string;
  topic:      string;
  chapter:    string;
  subject:    Subject;
  count:      number;  // total wrong attempts across all time
}

export interface TopicRevisionItem {
  topic:      string;
  chapter:    string;
  subject:    Subject;
  wrongCount: number;
  /** true if at least one question in this topic was eventually solved correctly */
  solved:     boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Inclusive start of the last 7 days window */
function weekAgoStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}

function nanoId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── localStorage ─────────────────────────────────────────────────────────────

function load(): JournalData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as JournalData;
  } catch {}
  return { events: [], attempts: {} };
}

function persist(data: JournalData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMistakeJournal() {
  const [data, setData] = useState<JournalData>(load);

  // Single mutate helper so persist is always called
  const mutate = useCallback((fn: (prev: JournalData) => JournalData) => {
    setData((prev) => {
      const next = fn(prev);
      persist(next);
      return next;
    });
  }, []);

  // ── Write operations ──────────────────────────────────────────────────────

  /** Record one wrong answer. May be called multiple times for the same question. */
  const recordMistake = useCallback(
    (
      subject:    Subject,
      topic:      string,
      chapter:    string,
      questionId: string,
      question:   string,
    ) => {
      mutate((prev) => {
        const event: MistakeEvent = {
          id: nanoId(),
          subject, topic, chapter, questionId, question,
          timestamp: Date.now(),
          date: todayStr(),
        };

        const prevRec = prev.attempts[questionId] ?? {
          subject, topic, chapter, question, wrong: 0, solved: false,
        };

        return {
          events:   [...prev.events, event],
          attempts: {
            ...prev.attempts,
            [questionId]: { ...prevRec, wrong: prevRec.wrong + 1 },
          },
        };
      });
    },
    [mutate]
  );

  /** Call when the student gets a question right — marks it as resolved. */
  const recordResolution = useCallback(
    (questionId: string) => {
      mutate((prev) => {
        const rec = prev.attempts[questionId];
        if (!rec || rec.solved) return prev;  // no-op if not tracked or already resolved
        return {
          ...prev,
          attempts: {
            ...prev.attempts,
            [questionId]: { ...rec, solved: true },
          },
        };
      });
    },
    [mutate]
  );

  // ── Read queries ──────────────────────────────────────────────────────────

  const getMistakesToday = useCallback(
    (): MistakeEvent[] =>
      data.events.filter((e) => e.date === todayStr()),
    [data]
  );

  const getMistakesThisWeek = useCallback(
    (): MistakeEvent[] =>
      data.events.filter((e) => e.date >= weekAgoStr()),
    [data]
  );

  /** Returns the top-n most re-attempted questions, sorted by wrong count. */
  const getTopRecurringMistakes = useCallback(
    (n = 3): RecurringMistake[] => {
      const map = new Map<string, RecurringMistake>();
      for (const e of data.events) {
        if (map.has(e.questionId)) {
          map.get(e.questionId)!.count++;
        } else {
          map.set(e.questionId, {
            questionId: e.questionId,
            question: e.question,
            topic: e.topic,
            chapter: e.chapter,
            subject: e.subject,
            count: 1,
          });
        }
      }
      return [...map.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
    },
    [data]
  );

  /** Topics grouped by subject, sorted by total wrong count descending. */
  const getTopicsNeedingRevision = useCallback(
    (): TopicRevisionItem[] => {
      const map = new Map<string, TopicRevisionItem>();

      for (const e of data.events) {
        const key = `${e.subject}::${e.topic}`;
        if (map.has(key)) {
          map.get(key)!.wrongCount++;
        } else {
          map.set(key, {
            topic: e.topic,
            chapter: e.chapter,
            subject: e.subject,
            wrongCount: 1,
            solved: false,
          });
        }
      }

      // Promote solved flag when any question in the topic was eventually solved
      for (const rec of Object.values(data.attempts)) {
        if (rec.solved) {
          const key = `${rec.subject}::${rec.topic}`;
          if (map.has(key)) map.get(key)!.solved = true;
        }
      }

      return [...map.values()].sort((a, b) => b.wrongCount - a.wrongCount);
    },
    [data]
  );

  /**
   * Mean number of total attempts (wrong + the final correct one) across all
   * questions that the student has since resolved.  Returns 0 if none.
   */
  const getAvgAttemptsBeforeSolving = useCallback((): number => {
    const resolved = Object.values(data.attempts).filter((r) => r.solved);
    if (resolved.length === 0) return 0;
    const sum = resolved.reduce((s, r) => s + r.wrong + 1, 0);
    return Math.round((sum / resolved.length) * 10) / 10;
  }, [data]);

  /** Quick summary counters (cheap — no full list materialisation). */
  const getMistakeStats = useCallback(() => {
    const today = todayStr();
    const weekStart = weekAgoStr();
    let todayCount = 0;
    let weekCount  = 0;
    for (const e of data.events) {
      if (e.date === today)      todayCount++;
      if (e.date >= weekStart)   weekCount++;
    }
    return { today: todayCount, thisWeek: weekCount, total: data.events.length };
  }, [data]);

  const clearAll = useCallback(() => {
    const empty: JournalData = { events: [], attempts: {} };
    persist(empty);
    setData(empty);
  }, []);

  return {
    recordMistake,
    recordResolution,
    getMistakesToday,
    getMistakesThisWeek,
    getTopRecurringMistakes,
    getTopicsNeedingRevision,
    getAvgAttemptsBeforeSolving,
    getMistakeStats,
    clearAll,
    totalMistakes: data.events.length,
  };
}
