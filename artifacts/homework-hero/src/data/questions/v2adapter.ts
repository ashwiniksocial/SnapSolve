/**
 * V2 → V1 adapter: converts QuestionV2 (question-bank schema) into
 * the Question (V1) type used by the frontend's questionService.
 *
 * Only the fields required by Question are extracted; V2-only fields
 * (bloomsLevel, marks, source, etc.) are intentionally dropped.
 */

import type { Question, ChapterMeta, CurriculumStatus } from "./types";
import type { Difficulty, QuestionType } from "./types";
import { lookupCanonical } from "./canonicalChapterRegistry.gen";
import {
  makeChapterContextKey,
  type BoardApplicability,
  type BoardId,
} from "./academicContext";

/**
 * Minimal interface covering the V2 fields we actually read.
 * Kept local to avoid importing from question-bank/types.ts directly.
 */
export interface QuestionV2Like {
  id:              string;
  classNum:        number;
  subject:         string;
  board:           BoardApplicability;
  verifiedBoards?: BoardId[];
  academicSession?: string;
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
  return qs.map((q) => {
    const chapterId = prefixChapterId(q.subject, q.chapterId);
    // "Both" is not evidence that a chapter matches every board. The current
    // canonical source is CBSE-only, so use that context only for its registry
    // lookup; service-level applicability still requires explicit verification
    // before serving the content outside CBSE.
    const canonicalBoard = q.board === "Both" ? "CBSE" : q.board;
    const registry = lookupCanonical(
      chapterId,
      canonicalBoard,
      q.classNum,
      q.subject,
      q.academicSession,
    );
    return {
      id:                q.id,
      classNum:          q.classNum,
      subject:           q.subject,
      chapterId,
      boardApplicability: q.board,
      verifiedBoards:    q.verifiedBoards,
      academicSession:   registry?.academicSession ?? q.academicSession,
      canonicalChapterId: registry?.canonicalChapterId ?? null,
      chapterName:       q.chapterName,
      topicId:           q.topicId,
      topicName:         q.topicName,
      difficulty:        mapDifficulty(q.difficulty),
      questionType:      mapQuestionType(q.questionType, q.questionFormat),
      question:          q.question,
      hint:              q.hint,
      answer:            q.answer,
      steps:             q.steps,
      keyConcepts:       q.keyConcepts,
    };
  });
}

/**
 * Derive ChapterMeta[] from an already-adapted Question[].
 * Topic questionCounts are computed from the array, so they are always accurate.
 *
 * Populates canonicalChapterId and curriculumStatus by looking up each chapterId
 * in the canonical chapter registry (canonicalChapterRegistry.gen.ts), which is
 * generated from the single maintained source: scripts/src/canonicalCurriculum.ts.
 *
 * SOURCE_UNRESOLVED and SOURCE_PENDING chapters get canonicalChapterId = null.
 */
export function buildChapterMeta(qs: Question[]): ChapterMeta[] {
  const chMap = new Map<
    string,
    {
      id: string;
      name: string;
      classNum: number;
      subject: string;
      boardId: BoardId;
      applicability: BoardApplicability;
      verifiedBoards: Set<BoardId>;
      academicSession?: string;
      canonicalChapterId: string | null;
      topics: Map<string, { name: string; count: number }>;
    }
  >();

  for (const q of qs) {
    const canonicalBoard = q.boardApplicability === "Both" ? "CBSE" : q.boardApplicability;
    if (!canonicalBoard) continue;
    const contextKey = makeChapterContextKey({
      boardId: canonicalBoard,
      classNum: q.classNum,
      subject: q.subject,
      canonicalChapterId: q.canonicalChapterId ?? null,
      chapterId: q.chapterId,
      academicSession: q.academicSession,
    });
    if (!chMap.has(contextKey)) {
      chMap.set(contextKey, {
        id: q.chapterId,
        name:     q.chapterName,
        classNum: q.classNum,
        subject:  q.subject,
        boardId: canonicalBoard,
        applicability: q.boardApplicability!,
        verifiedBoards: new Set(q.verifiedBoards ?? []),
        academicSession: q.academicSession,
        canonicalChapterId: q.canonicalChapterId ?? null,
        topics:   new Map(),
      });
    }
    const ch = chMap.get(contextKey)!;
    if (q.boardApplicability === "Both") ch.applicability = "Both";
    for (const board of q.verifiedBoards ?? []) ch.verifiedBoards.add(board);
    if (!ch.topics.has(q.topicId)) {
      ch.topics.set(q.topicId, { name: q.topicName, count: 0 });
    }
    ch.topics.get(q.topicId)!.count++;
  }

  return Array.from(chMap.values()).map((ch) => {
    const reg = lookupCanonical(
      ch.id,
      ch.boardId,
      ch.classNum,
      ch.subject,
      ch.academicSession,
    );
    const canonicalChapterId: string | null   = ch.canonicalChapterId ?? reg?.canonicalChapterId ?? null;
    const curriculumStatus:   CurriculumStatus = reg?.curriculumStatus ?? "SOURCE_UNRESOLVED";
    return {
      id:          ch.id,
      name:        ch.name,
      classNum:    ch.classNum,
      subject:     ch.subject,
      boardId:     ch.boardId,
      boardApplicability: ch.applicability,
      verifiedBoards: [...ch.verifiedBoards],
      academicSession: ch.academicSession ?? reg?.academicSession,
      canonicalChapterId,
      curriculumStatus,
      topics:      Array.from(ch.topics.entries()).map(([tid, t]) => ({
        id:            tid,
        name:          t.name,
        questionCount: t.count,
      })),
    };
  });
}
