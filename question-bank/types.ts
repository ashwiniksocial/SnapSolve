/**
 * Question Bank — Type System
 *
 * Developer-only architecture document. Never imported by any runtime service.
 *
 * This is the single source of truth for the question data schema.
 * All question files — present and future — must conform to these types.
 *
 * ── Backward compatibility ───────────────────────────────────────────────────
 * The existing Question type in artifacts/homework-hero/src/data/questions/types.ts
 * must be kept in sync with the QuestionV1 interface here. That type is the
 * runtime type used by the frontend. This file is the authoritative schema.
 *
 * The existing 150 Class 9 Mathematics questions conform to QuestionV1.
 * All new questions must conform to QuestionV2 (a superset of V1).
 * The runtime type will be migrated to V2 when a second subject is added.
 *
 * ── Hierarchy ────────────────────────────────────────────────────────────────
 * Board → Class → Subject → Chapter → Topic → Question
 */

// ─── Primitive enumerations ───────────────────────────────────────────────────

export type SupportedClass   = 6 | 7 | 8 | 9;
export type SupportedSubject = "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Computer Science" | "Economics";
export type SupportedBoard   = "CBSE" | "ICSE";

/** Which board(s) a question or chapter applies to */
export type BoardApplicability = "CBSE" | "ICSE" | "Both";

// ─── Question type taxonomy ──────────────────────────────────────────────────

/**
 * The 9 question types that every chapter blueprint must plan for.
 * These are the PEDAGOGICAL purpose of the question — not its format.
 *
 * See tagging.ts for descriptions of each type.
 */
export type QuestionType =
  | "concept"          // Foundational understanding of a single concept
  | "ncert"            // NCERT exercise style — standard textbook questions
  | "icse"             // ICSE-pattern style — often more computational or proof-heavy
  | "competency"       // NEP-aligned: requires decision + application (not recall)
  | "hots"             // Higher-Order Thinking: analysis, evaluation, or synthesis
  | "previous-year"    // Sourced from or modelled on actual CBSE/ICSE board papers
  | "case-study"       // Passage-based multi-part questions (applicable in select subjects)
  | "assertion-reason" // Assertion + Reason format (CBSE Class 9-10 standard)
  | "olympiad";        // Enrichment: competition-level problem (optional, not in every chapter)

/**
 * The answer FORMAT of the question — determines how the student responds.
 * Orthogonal to QuestionType: a HOTS question can be MCQ or LongAnswer.
 */
export type QuestionFormat =
  | "MCQ"              // Single correct answer from 4 options
  | "ShortAnswer"      // 2–3 sentences; 1–2 marks
  | "LongAnswer"       // Full working shown; 3–5 marks
  | "Numerical"        // Numerical answer with full working; common in Physics/Chemistry
  | "AssertionReason"  // Assertion and Reason with 4 standard options (see AuthoringGuide)
  | "CaseStudy"        // Passage + 3–5 sub-questions; mix of MCQ and ShortAnswer
  | "MatchTheFollowing"// Column-A to Column-B matching
  | "FillInTheBlanks"  // Single word or phrase; 1 mark
  | "TrueOrFalse"      // True/False with mandatory justification
  | "Proof";           // Formal mathematical or logical proof

// ─── Difficulty and Bloom's ──────────────────────────────────────────────────

/** Difficulty as perceived by the target student (Class-relative, not absolute) */
export type Difficulty = "Easy" | "Medium" | "Hard" | "Olympiad";

/**
 * Bloom's Taxonomy cognitive level.
 * Every question must be tagged at exactly one level.
 * This drives the HOTS identification and NEP-HOT compliance.
 */
export type BloomsLevel =
  | "remember"    // Recall facts, definitions, formulas
  | "understand"  // Explain in own words, classify, summarise
  | "apply"       // Use the concept on a new problem
  | "analyse"     // Break down, compare, find relationships
  | "evaluate"    // Judge correctness, critique an approach, verify
  | "create";     // Produce something new — a proof, a design, an example

/** Mark allocation — drives question length and depth */
export type QuestionMarks = 1 | 2 | 3 | 4 | 5;

// ─── Source provenance ───────────────────────────────────────────────────────

export type QuestionSource =
  | "ncert-textbook"    // Directly from NCERT textbook exercise
  | "ncert-exemplar"    // NCERT Exemplar Problems book
  | "cbse-board"        // Past CBSE board exam paper
  | "icse-board"        // Past ICSE board exam paper
  | "icse-textbook"     // ICSE textbook (Selina, Frank, etc.)
  | "olympiad"          // Math/Science Olympiad (IMO, NSO, NTSE, etc.)
  | "original";         // Original question authored for SnapSolve

// ─── Solution structure ───────────────────────────────────────────────────────

/** A single step in a question's solution — unchanged from V1 for compatibility */
export interface SolutionStep {
  stepNumber:   number;
  title:        string;
  explanation:  string;
  formula?:     string;
  result?:      string;
}

// ─── Assertion-Reason sub-types ──────────────────────────────────────────────

/**
 * The four standard options for Assertion-Reason questions.
 * The correct option is identified in the answer field.
 */
export type AssertionReasonOption =
  | "A"  // Both Assertion and Reason are true, and Reason is the correct explanation of Assertion
  | "B"  // Both Assertion and Reason are true, but Reason is NOT the correct explanation
  | "C"  // Assertion is true, but Reason is false
  | "D"; // Assertion is false, but Reason is true (or both false — specify in question)

// ─── Core Question entity ─────────────────────────────────────────────────────

/**
 * QuestionV1 — the current runtime type.
 * Defined here for reference. The runtime type in types.ts must match this.
 * All 150 existing questions conform to this interface.
 */
export interface QuestionV1 {
  id:            string;
  classNum:      number;
  subject:       string;
  chapterId:     string;
  chapterName:   string;
  topicId:       string;
  topicName:     string;
  difficulty:    "Easy" | "Medium" | "Hard";
  questionType?: "MCQ" | "ShortAnswer" | "LongAnswer" | "HOTS" | "PYQ";
  question:      string;
  hint:          string;
  answer:        string;
  steps:         SolutionStep[];
  keyConcepts:   string[];
}

/**
 * QuestionV2 — the target schema for all new questions.
 * Extends V1: every V1 field is present; all new fields are required for V2.
 *
 * ID scheme: {boardCode}-{subjectCode}-{classNum}-{chapterNum}-{typeCode}-{seq3}
 * Example: bo-mth-9-ch01-hot-023
 *   bo      = Both boards
 *   mth     = Mathematics
 *   9       = Class 9
 *   ch01    = Chapter 1
 *   hot     = HOTS question type
 *   023     = Sequence number (zero-padded to 3 digits)
 *
 * See tagging.ts for board codes, subject codes, and type codes.
 */
export interface QuestionV2 {
  // ── Identity ──────────────────────────────────────────────────────────────
  id:              string;            // Unique, stable. Never reassigned once published.
  schemaVersion:   2;                 // Distinguishes V2 from V1 at runtime

  // ── Classification (V1 compatible) ────────────────────────────────────────
  classNum:        SupportedClass;
  subject:         SupportedSubject;
  board:           BoardApplicability; // V2: explicit board (V1 had no board field)
  chapterId:       string;             // format: "ch01", "ch02", ...
  chapterName:     string;
  topicId:         string;             // format: "t1", "t2", ...
  topicName:       string;

  // ── Question taxonomy ──────────────────────────────────────────────────────
  questionType:    QuestionType;       // V2: expanded from V1's 5 values to 9
  questionFormat:  QuestionFormat;     // V2: new — the answer format
  difficulty:      Difficulty;         // V2: adds "Olympiad" level
  bloomsLevel:     BloomsLevel;        // V2: new — required for all questions
  marks:           QuestionMarks;      // V2: new — mark allocation
  estimatedTimeMinutes: number;        // V2: new — approximate time to answer

  // ── Question content ───────────────────────────────────────────────────────
  question:        string;             // The question text (markdown supported)
  options?:        [string, string, string, string]; // MCQ options: exactly 4

  // Assertion-Reason specific (only when questionFormat === "AssertionReason")
  assertion?:      string;
  reason?:         string;

  // Case-Study specific (only when questionFormat === "CaseStudy")
  caseStudyPassage?: string;
  caseStudySubQuestions?: CaseStudySubQuestion[];

  // ── Answer and solution ────────────────────────────────────────────────────
  answer:          string;             // The correct answer (or option letter for MCQ)
  steps:           SolutionStep[];     // Full worked solution
  hint:            string;             // First hint — directional, not revealing
  hint2?:          string;             // Second hint — closer to the approach
  hint3?:          string;             // Third hint — reveals the first step only
  examTip?:        string;             // Examiner insight or mark-scheme note

  // ── Tags and metadata ──────────────────────────────────────────────────────
  keyConcepts:     string[];           // V1 compatible — key concepts tested
  conceptsCovered: string[];           // Fine-grained concept nodes (from tagging.ts)
  prerequisites:   string[];           // conceptsCovered IDs needed before this question
  commonErrors:    string[];           // Specific mistakes students make on this question
  tags:            string[];           // Free-form tags for search and filtering

  // ── Source ────────────────────────────────────────────────────────────────
  source:          QuestionSource;
  yearIfPreviousYear?: number;         // e.g. 2023 — only for source "cbse-board" | "icse-board"
  boardIfPreviousYear?: "CBSE" | "ICSE";
  sourceReference?: string;           // e.g. "NCERT Class 9 Maths Ex 1.2 Q3"
}

// ─── Case-Study sub-question ──────────────────────────────────────────────────

export interface CaseStudySubQuestion {
  part:      string;                   // "a", "b", "c", ...
  question:  string;
  marks:     QuestionMarks;
  format:    "MCQ" | "ShortAnswer";
  options?:  [string, string, string, string];
  answer:    string;
}

// ─── Chapter and Topic metadata ───────────────────────────────────────────────

/** Fine-grained topic within a chapter */
export interface TopicSpec {
  id:                string;           // "t1", "t2", ...
  name:              string;
  minQuestions:      number;           // Minimum questions required for this topic
  targetQuestions:   number;           // Target questions (can exceed minimum)
  conceptNodes:      string[];         // The specific concept identifiers covered in this topic
}

/**
 * Chapter record in the canonical chapter registry.
 * Every chapter across all subjects/classes/boards is registered here.
 */
export interface ChapterRecord {
  chapterId:         string;           // Canonical ID: "ch01", "ch02", ...
  name:              string;
  classNum:          SupportedClass;
  subject:           SupportedSubject;
  board:             BoardApplicability;
  chapterNumber:     number;           // 1-indexed position within the subject for this class
  category:          ChapterCategory; // Drives quota targets
  topics:            TopicSpec[];
  applicableTypes:   QuestionType[];  // Which question types suit this chapter
  boardSpecificNotes?: string;        // Differences between CBSE and ICSE for this chapter
}

/**
 * Chapter category determines the target question quota.
 * The blueprint for each subject maps categories to quotas.
 *
 * major:    75–100 questions  (e.g. Triangles, Motion, Chemical Reactions)
 * standard: 50–75 questions   (e.g. Data Handling, Heat, Atoms and Molecules)
 * minor:    30–50 questions   (e.g. Symmetry, Introduction to Euclid's Geometry)
 * brief:    15–30 questions   (e.g. Practical Geometry, Appendix chapters)
 */
export type ChapterCategory = "major" | "standard" | "minor" | "brief";

// ─── Blueprint structures ─────────────────────────────────────────────────────

/** Target question count per question type for a given chapter category */
export interface QuestionTypeQuota {
  concept:          number;
  ncert:            number;
  icse:             number;
  competency:       number;
  hots:             number;
  "previous-year":  number;
  "case-study":     number;            // 0 if not applicable for this chapter
  "assertion-reason": number;          // 0 if not applicable
  olympiad:         number;            // 0 if not applicable (always optional)
}

/** Target question count per difficulty for a given chapter category */
export interface DifficultyQuota {
  Easy:             number;
  Medium:           number;
  Hard:             number;
  Olympiad:         number;
}

/** Target question count per Bloom's level for a given chapter category */
export interface BloomsQuota {
  remember:         number;
  understand:       number;
  apply:            number;
  analyse:          number;
  evaluate:         number;
  create:           number;
}

/**
 * Full blueprint for one chapter category within a subject.
 * The SubjectBlueprint maps each ChapterCategory to one of these.
 */
export interface CategoryBlueprint {
  targetTotal:        number;          // Total questions for a chapter of this category
  byType:             QuestionTypeQuota;
  byDifficulty:       DifficultyQuota;
  byBlooms:           BloomsQuota;

  // Constraints
  caseStudyApplicable:     boolean;
  assertionReasonApplicable: boolean;
  olympiadApplicable:      boolean;

  // Quality minimums
  minHintsRequired:        number;    // Minimum hint count per question (1-3)
  minStepsRequired:        number;    // Minimum solution steps for LongAnswer
  minConceptNodesTagged:   number;    // Minimum conceptsCovered per question
  minCommonErrorsTagged:   number;    // Minimum commonErrors per question (HOTS/Hard only)
}

/**
 * The complete blueprint for one subject.
 * Defines quota targets for each chapter category and subject-wide constraints.
 */
export interface SubjectBlueprint {
  subject:               SupportedSubject;
  boardApplicability:    BoardApplicability;

  /** Quota targets per chapter category */
  categoryBlueprints:    Record<ChapterCategory, CategoryBlueprint>;

  /**
   * Which question types are structurally unsuitable for this subject.
   * (e.g., case-study is rarely used in Mathematics; assertion-reason is common in Science)
   */
  globallyExcludedTypes: QuestionType[];

  /**
   * Subject-wide tagging requirements.
   * These apply to every question in this subject regardless of type or chapter.
   */
  mandatoryTags:         string[];

  /** Notes for question authors specific to this subject */
  authoringNotes:        string[];
}

// ─── Library summary ──────────────────────────────────────────────────────────

export interface BankCoverage {
  totalChapters:    number;
  totalTargetQuestions: number;  // Sum of all chapter targets
  bySubject:        Record<SupportedSubject, { chapters: number; targetQuestions: number }>;
  byClass:          Record<SupportedClass,   { chapters: number; targetQuestions: number }>;
  byBoard:          Record<BoardApplicability, { chapters: number }>;
}
