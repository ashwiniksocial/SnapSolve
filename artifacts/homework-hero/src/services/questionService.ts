/**
 * Question Service — query layer over the static question bank.
 *
 * All public functions are pure and return new arrays (no mutation).
 * Designed to be swappable with Firebase Firestore calls:
 *   - Replace `ALL_QUESTIONS` reads with `getDocs(query(...))`.
 *   - Function signatures stay identical.
 */

import { ALL_CHAPTERS, ALL_QUESTIONS } from "@/data/questions";
import type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType } from "@/data/questions";

export type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType };

// ─── Chapter / topic navigation ───────────────────────────────────────────────

/** All chapters for a given class + subject. */
export function getChapters(classNum: number, subject: string): ChapterMeta[] {
  return ALL_CHAPTERS.filter(
    (c) => c.classNum === classNum && c.subject === subject
  );
}

/** All topics for a specific chapter. */
export function getTopics(chapterId: string): TopicMeta[] {
  return ALL_CHAPTERS.find((c) => c.id === chapterId)?.topics ?? [];
}

// ─── Question querying ────────────────────────────────────────────────────────

export interface QuestionFilter {
  classNum?: number;
  subject?: string;
  chapterId?: string;
  topicId?: string;
  topicName?: string;
  difficulty?: Difficulty | "All";
  questionType?: QuestionType | "All";
}

/**
 * Returns questions matching ALL supplied filters.
 * Omitting a filter field means "any value is accepted".
 */
export function getQuestions(filter: QuestionFilter = {}): Question[] {
  const results = ALL_QUESTIONS.filter((q) => {
    if (filter.classNum  !== undefined && q.classNum  !== filter.classNum)  return false;
    if (filter.subject   !== undefined && q.subject   !== filter.subject)   return false;
    if (filter.chapterId !== undefined && q.chapterId !== filter.chapterId) return false;
    if (filter.topicId   !== undefined && q.topicId   !== filter.topicId)   return false;
    if (filter.topicName !== undefined && q.topicName !== filter.topicName) return false;
    if (filter.difficulty && filter.difficulty !== "All" && q.difficulty !== filter.difficulty) return false;
    if (filter.questionType && filter.questionType !== "All" && q.questionType !== filter.questionType) return false;
    return true;
  });
  console.log(`[BANK:getQuestions] filter=${JSON.stringify(filter)} → ${results.length} questions from ALL_QUESTIONS (static local TypeScript import — no network, no DB, no API)`);
  const sample = results[0];
  if (sample) {
    console.log(`[BANK:getQuestions] sample[0] id="${sample.id}" steps.length=${sample.steps.length} has_answer=${!!sample.answer} lesson=undefined (Question type has no lesson field)`);
  }
  return results;
}

/** Get a single question by id. */
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/** Get n random questions matching a filter (for quiz / challenge modes). */
export function getRandomQuestions(filter: QuestionFilter, n: number): Question[] {
  const pool = getQuestions(filter);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// ─── Difficulty distribution ──────────────────────────────────────────────────

export interface DifficultyCount {
  Easy: number;
  Medium: number;
  Hard: number;
  total: number;
}

export function getDifficultyBreakdown(filter: QuestionFilter): DifficultyCount {
  const qs = getQuestions(filter);
  return {
    Easy:   qs.filter((q) => q.difficulty === "Easy").length,
    Medium: qs.filter((q) => q.difficulty === "Medium").length,
    Hard:   qs.filter((q) => q.difficulty === "Hard").length,
    total:  qs.length,
  };
}

// ─── Chapter stats ────────────────────────────────────────────────────────────

export interface ChapterStats {
  chapterId: string;
  chapterName: string;
  chapterNumber: number;
  totalQuestions: number;
  byDifficulty: DifficultyCount;
  byType: Record<QuestionType, number>;
}

/** Get stats for all chapters of a given class + subject. */
export function getAllChapterStats(classNum: number, subject: string): ChapterStats[] {
  const chapters = getChapters(classNum, subject);
  return chapters.map((ch) => {
    const qs = getQuestions({ classNum, subject, chapterId: ch.id });
    const byType: Record<QuestionType, number> = {
      MCQ: 0, ShortAnswer: 0, LongAnswer: 0, HOTS: 0, PYQ: 0,
    };
    for (const q of qs) {
      if (q.questionType) byType[q.questionType]++;
    }
    return {
      chapterId: ch.id,
      chapterName: ch.name,
      chapterNumber: parseInt(ch.id.replace("ch", ""), 10),
      totalQuestions: qs.length,
      byDifficulty: getDifficultyBreakdown({ classNum, subject, chapterId: ch.id }),
      byType,
    };
  });
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

/** Unique topic names for a chapter (preserving the order they appear in the data). */
export function getTopicNames(chapterId: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of ALL_QUESTIONS) {
    if (q.chapterId === chapterId && !seen.has(q.topicName)) {
      seen.add(q.topicName);
      result.push(q.topicName);
    }
  }
  return result;
}

/** Total question count for a topic across all difficulties. */
export function getTopicQuestionCount(chapterId: string, topicId: string): number {
  return ALL_QUESTIONS.filter(
    (q) => q.chapterId === chapterId && q.topicId === topicId
  ).length;
}
