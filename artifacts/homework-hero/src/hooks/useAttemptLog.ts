/**
 * useAttemptLog — per-question attempt detail log.
 *
 * Stores correct/incorrect result, timestamp, difficulty, and chapter context
 * for every question the student attempts. Powers the Question Drilldown
 * section in Analytics.
 *
 * Records use a board/class-scoped localStorage key.
 */

import { useState, useCallback, useEffect } from "react";
import type { Subject } from "@/data/subjects";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import { useProfile } from "@/hooks/useProfile";

const KEY_PREFIX = "studyai-attempt-log-v2";

export interface AttemptRecord {
  questionId:    string;
  boardId?:      string;
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

function load(key: string | null): AttemptLog {
  if (!key) return {};
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as AttemptLog;
  } catch {}
  return {};
}

function persist(key: string | null, log: AttemptLog) {
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(log));
  } catch {}
}

export function useAttemptLog(classNumOverride?: number) {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, classNumOverride ?? profile.classLevel);
  const storageKey = scopedStorageKey(KEY_PREFIX, context);
  const [stored, setStored] = useState(() => ({ key: storageKey, log: load(storageKey) }));

  useEffect(() => {
    setStored({ key: storageKey, log: load(storageKey) });
  }, [storageKey]);

  const log = stored.key === storageKey ? stored.log : {};

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
      if (!storageKey) return;
      setStored((storedPrev) => {
        const prev = storedPrev.key === storageKey ? storedPrev.log : load(storageKey);
        const existing = prev[questionId];
        const next: AttemptLog = {
          ...prev,
          [questionId]: {
            questionId,
            boardId: storageKey.split(":")[1],
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
        persist(storageKey, next);
        return { key: storageKey, log: next };
      });
    },
    [storageKey],
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
