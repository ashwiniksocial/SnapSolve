/**
 * useChapterStats — chapter completion % and topic mastery from progress data.
 *
 * Reads the user's attempted question IDs from useProgress and maps them
 * against the question bank to compute per-chapter completion and accuracy.
 *
 * @param subject  Subject to compute stats for.
 * @param classNum Class number (defaults to 9 for backward compatibility).
 */

import { useMemo } from "react";
import { useProgress } from "./useProgress";
import { getChapters, getQuestions } from "@/services/questionService";
import type { Subject } from "@/data/subjects";

export interface TopicCompletion {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  solved: number;
  accuracy: number;
  masteryPct: number;
  completionPct: number;
}

export interface ChapterCompletion {
  chapterId: string;
  chapterName: string;
  chapterNumber: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  solved: number;
  accuracy: number;
  completionPct: number;
  topics: TopicCompletion[];
}

/** @param _bankReady Pass the bankReady flag from the page so the memo re-runs when the lazy bundle finishes loading. */
export function useChapterStats(subject: Subject, classNum = 9, _bankReady?: boolean): ChapterCompletion[] {
  const { progress } = useProgress();

  return useMemo(() => {
    const chapters = getChapters(classNum, subject);
    const subjectProgress = (progress as Record<string, Record<string, { solved: number; correct: number; attempted: string[] }>>)[subject] ?? {};

    return chapters.map((ch) => {
      const chapterQuestions = getQuestions({ classNum, subject, chapterId: ch.id });

      const topicCompletions: TopicCompletion[] = ch.topics.map((t) => {
        const topicQs = chapterQuestions.filter((q) => q.topicId === t.id);
        const rec = subjectProgress[t.name] ?? { solved: 0, correct: 0, attempted: [] };
        const attemptedSet = new Set<string>(rec.attempted ?? []);
        const attemptedCount = topicQs.filter((q) => attemptedSet.has(q.id)).length;
        const accuracy = rec.solved > 0 ? Math.round((rec.correct / rec.solved) * 100) : 0;

        return {
          topicId: t.id,
          topicName: t.name,
          totalQuestions: topicQs.length,
          attempted: attemptedCount,
          correct: rec.correct,
          solved: rec.solved,
          accuracy,
          masteryPct: accuracy,
          completionPct:
            topicQs.length > 0
              ? Math.round((attemptedCount / topicQs.length) * 100)
              : 0,
        };
      });

      let chCorrect = 0;
      let chSolved = 0;
      for (const t of ch.topics) {
        const rec = subjectProgress[t.name];
        if (rec) {
          chCorrect += rec.correct ?? 0;
          chSolved += rec.solved ?? 0;
        }
      }
      const chAttempted = topicCompletions.reduce((s, t) => s + t.attempted, 0);

      return {
        chapterId: ch.id,
        chapterName: ch.name,
        chapterNumber: parseInt(ch.id.replace("ch", ""), 10),
        totalQuestions: chapterQuestions.length,
        attempted: chAttempted,
        correct: chCorrect,
        solved: chSolved,
        accuracy: chSolved > 0 ? Math.round((chCorrect / chSolved) * 100) : 0,
        completionPct:
          chapterQuestions.length > 0
            ? Math.round((chAttempted / chapterQuestions.length) * 100)
            : 0,
        topics: topicCompletions,
      };
    });
  }, [progress, subject, classNum, _bankReady]);
}
