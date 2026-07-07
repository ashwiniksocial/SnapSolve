/**
 * useAttemptLog — per-question attempt detail log.
 *
 * Stores correct/incorrect result, timestamp, difficulty, and chapter context
 * for every question the student attempts. Powers the Question Drilldown
 * section in Analytics.
 *
 * localStorage key: "studyai-attempt-log-v1"
 */

import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

const KEY = "studyai-attempt-log-v1";

export interface AttemptRecord {
  questionId:    string;
  questionText:  string;
  correct:       boolean;
  difficulty:    string;
  chapterId:     string;
  chapterName:   string;
  subject:       Subject;
  classNum:      number;
  lastAttempted: string;  // ISO date string
  attempts:      number;  // total times recorded
}

type AttemptLog = Record<string, AttemptRecord>;

function load(): AttemptLog {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as AttemptLog;
  } catch {}
  return {};
}

function persist(log: AttemptLog) {
  try {
    localStorage.setItem(KEY, JSON.stringify(log));
  } catch {}
}

export function useAttemptLog() {
  const [log, setLog] = useState<AttemptLog>(load);

  /** Record or update an attempt for a question. */
  const logAttempt = useCallback(
    (
      questionId:   string,
      questionText: string,
      correct:      boolean,
      difficulty:   string,
      chapterId:    string,
      chapterName:  string,
      subject:      Subject,
      classNum:     number,
    ) => {
      setLog((prev) => {
        const existing = prev[questionId];
        const next: AttemptLog = {
          ...prev,
          [questionId]: {
            questionId,
            questionText,
            correct,
            difficulty,
            chapterId,
            chapterName,
            subject,
            classNum,
            lastAttempted: new Date().toISOString(),
            attempts: (existing?.attempts ?? 0) + 1,
          },
        };
        persist(next);
        return next;
      });
    },
    [],
  );

  /** All attempts for a specific chapter. */
  const getChapterAttempts = useCallback(
    (chapterId: string, classNum: number, subject: Subject): AttemptRecord[] =>
      Object.values(log).filter(
        (r) =>
          r.chapterId === chapterId &&
          r.classNum  === classNum  &&
          r.subject   === subject,
      ),
    [log],
  );

  return { log, logAttempt, getChapterAttempts };
}
