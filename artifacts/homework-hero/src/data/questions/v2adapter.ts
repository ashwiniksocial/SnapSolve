/**
 * V2 → V1 adapter: converts QuestionV2 (question-bank schema) into
 * the Question (V1) type used by the frontend's questionService.
 *
 * Only the fields required by Question are extracted; V2-only fields
 * (bloomsLevel, marks, source, etc.) are intentionally dropped.
 */

import type { Question, ChapterMeta } from "./types";
import type { Difficulty, QuestionType } from "./types";

/**
 * Minimal interface covering the V2 fields we actually read.
 * Kept local to avoid importing from question-bank/types.ts directly.
 */
export interface QuestionV2Like {
  id:              string;
  classNum:        number;
  subject:         string;
  chapterId:       string;
  chapterName:     string;
  topicId:         string;
  topicName:       string;
  difficulty:      string;    // "Easy" | "Medium" | "Hard" | "Olympiad"
  questionType:    string;    // V2 pedagogical type
  questionFormat?: string;    // V2 answer format
  question:        string;
  hint:            string;
  answer:          string;
  steps:           Array<{
    stepNumber:   number;
    title:        string;
    explanation:  string;
    formula?:     string;
    result?:      string;
  }>;
  keyConcepts:     string[];
}

function mapDifficulty(d: string): Difficulty {
  switch (d.trim().toLowerCase()) {
    case "easy":     return "Easy";
    case "medium":   return "Medium";
    case "hard":
    case "olympiad": return "Hard";
    default:         return d.trim() as Difficulty;
  }
}

function mapQuestionType(qType: string, qFormat?: string): QuestionType | undefined {
  if (qType === "hots")                                           return "HOTS";
  if (qType === "previous-year")                                  return "PYQ";
  // Assertion-reason is a two-statement MCQ variant
  if (qType === "assertion-reason" || qFormat === "AssertionReason") return "MCQ";
  if (qFormat === "MCQ" || qFormat === "TrueOrFalse")             return "MCQ";
  if (qFormat === "LongAnswer" || qFormat === "Proof" || qFormat === "CaseStudy") return "LongAnswer";
  return "ShortAnswer";
}

/**
 * Ensure chapter IDs are globally unique across all Science sub-domains.
 * Chemistry and Biology both use bare "ch01"–"ch04" in the V2 question bank,
 * which collides when both bundles are loaded into the shared ALL_CHAPTERS cache.
 * Prefix those IDs here — at the single adapt boundary — so every downstream
 * consumer (getChapters, getQuestions, getTopics, useChapterStats, render keys)
 * automatically sees non-colliding IDs without needing per-call workarounds.
 */
function prefixChapterId(subject: string, chapterId: string): string {
  if (subject === "Chemistry") return `chem-${chapterId}`;
  if (subject === "Biology")   return `bio-${chapterId}`;
  return chapterId;
}

/** Convert an array of QuestionV2-shaped objects to the frontend Question type. */
export function adaptV2Questions(qs: QuestionV2Like[]): Question[] {
  return qs.map((q) => ({
    id:           q.id,
    classNum:     q.classNum,
    subject:      q.subject,
    chapterId:    prefixChapterId(q.subject, q.chapterId),
    chapterName:  q.chapterName,
    topicId:      q.topicId,
    topicName:    q.topicName,
    difficulty:   mapDifficulty(q.difficulty),
    questionType: mapQuestionType(q.questionType, q.questionFormat),
    question:     q.question,
    hint:         q.hint,
    answer:       q.answer,
    steps:        q.steps,
    keyConcepts:  q.keyConcepts,
  }));
}

/**
 * Derive ChapterMeta[] from an already-adapted Question[].
 * Topic questionCounts are computed from the array, so they are always accurate.
 */
export function buildChapterMeta(qs: Question[]): ChapterMeta[] {
  const chMap = new Map<
    string,
    { name: string; classNum: number; subject: string; topics: Map<string, { name: string; count: number }> }
  >();

  for (const q of qs) {
    if (!chMap.has(q.chapterId)) {
      chMap.set(q.chapterId, {
        name:     q.chapterName,
        classNum: q.classNum,
        subject:  q.subject,
        topics:   new Map(),
      });
    }
    const ch = chMap.get(q.chapterId)!;
    if (!ch.topics.has(q.topicId)) {
      ch.topics.set(q.topicId, { name: q.topicName, count: 0 });
    }
    ch.topics.get(q.topicId)!.count++;
  }

  return Array.from(chMap.entries()).map(([id, ch]) => ({
    id,
    name:     ch.name,
    classNum: ch.classNum,
    subject:  ch.subject,
    topics:   Array.from(ch.topics.entries()).map(([tid, t]) => ({
      id:            tid,
      name:          t.name,
      questionCount: t.count,
    })),
  }));
}
