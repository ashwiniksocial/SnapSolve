/**
 * Core data types for the StudyAI question bank.
 * Hierarchy: Class → Subject → Chapter → Topic → Question
 *
 * Designed to be forward-compatible with Firebase/Firestore:
 * - Every entity has a string `id` field.
 * - No circular references.
 * - All arrays are flat (no nested arrays).
 */

/**
 * Curriculum lifecycle status for a chapter.
 * Mirrors CanonicalStatus in scripts/src/canonicalCurriculum.ts.
 * The single source of truth for this mapping is canonicalCurriculum.ts;
 * the generated canonicalChapterRegistry.gen.ts propagates it here at build time.
 */
export type CurriculumStatus =
  | "ACTIVE"              // canonical source confirmed; eligible for review/freeze
  | "SOURCE_PENDING"      // official source not yet released; build deferred
  | "SOURCE_UNRESOLVED"   // questions exist but no matching 2026-27 chapter confirmed
  | "OFFICIALLY_DELETED"; // removed from active curriculum by the board

export type Difficulty = "Easy" | "Medium" | "Hard";

/** Stored question type — the five canonical values written into question data. */
export type QuestionType = "MCQ" | "ShortAnswer" | "LongAnswer" | "HOTS" | "PYQ";

/**
 * Effective question type — extends QuestionType with the virtual
 * "Unclassified" category used exclusively at the filter/UI layer for
 * legacy questions that were authored before the questionType field existed.
 * "Unclassified" is never written into Question objects.
 */
export type EffectiveQuestionType = QuestionType | "Unclassified";

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  result?: string;
}

export interface Question {
  id: string;                     // e.g. "c9-math-ch1-t1-q01"
  classNum: number;               // 9
  subject: string;                // "Mathematics"
  chapterId: string;              // "ch1"
  chapterName: string;            // "Number Systems"
  topicId: string;                // "t1"
  topicName: string;              // "Real Numbers and Their Types"
  difficulty: Difficulty;
  questionType?: QuestionType;    // optional for backward-compat with ch1–ch3
  question: string;
  hint: string;
  answer: string;
  steps: SolutionStep[];
  keyConcepts: string[];
}

/** Metadata-only view — useful for nav rendering without loading full questions */
export interface TopicMeta {
  id: string;
  name: string;
  questionCount: number;
}

export interface ChapterMeta {
  id: string;
  name: string;
  classNum: number;
  subject: string;
  /**
   * Official NCERT/board book code (e.g. "iemh101", "iesc104").
   * null when no canonical 2026-27 chapter is confirmed (SOURCE_UNRESOLVED / SOURCE_PENDING).
   * Use this — not `id`, not `name` — for all relational joins, persistence, and review caches.
   * Derived from canonicalChapterRegistry.gen.ts (generated from canonicalCurriculum.ts).
   */
  canonicalChapterId: string | null;
  /**
   * Curriculum lifecycle status.
   * SOURCE_UNRESOLVED and SOURCE_PENDING chapters are blocked from academic review and freeze.
   */
  curriculumStatus: CurriculumStatus;
  topics: TopicMeta[];
  /** Chapter removed from CBSE board exam syllabus; hidden from active Practice. Questions archived. */
  cbseDeleted?: true;
}
