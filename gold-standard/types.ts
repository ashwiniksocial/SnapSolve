/**
 * Gold Standard Lesson Library — Type Definitions
 *
 * Developer-only reference types. Never imported by any runtime service.
 * These types define what a benchmark lesson record looks like.
 */

export type SupportedSubject =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Computer Science"
  | "Economics";

export type SupportedClass = 6 | 7 | 8 | 9;

export type SupportedBoard = "CBSE" | "ICSE" | "Both";

/**
 * The 15 Concept Mastery Framework rules, checked as pass/fail for this lesson.
 * Used to verify a gold standard lesson demonstrates each rule in practice.
 */
export interface CMFCompliance {
  cmf1_whyBeforeWhat:              boolean;
  cmf2_problemFirst:               boolean;
  cmf3_intuitionBeforeFormalism:   boolean;
  cmf4_sixQuestionsAnswered:       boolean;
  cmf5_confusionsPreEmpted:        boolean;
  cmf6_nextQuestionAnswered:       boolean;
  cmf7_noSkippedSteps:             boolean;
  cmf8_formulaDerivation:          boolean;
  cmf9_theoremWhyExplained:        boolean;
  cmf10_lawIntuitionFirst:         boolean;
  cmf11_biologyFlowingStory:       boolean; // Biology only; true for non-Biology
  cmf12_csAlgorithmFirst:          boolean; // CS only; true for non-CS
  cmf13_economicsEverydayFirst:    boolean; // Economics only; true for non-Economics
  cmf14_threeExplanations:         boolean;
  cmf15_youngerSiblingTest:        boolean;
}

/**
 * A structured outline of what the gold standard lesson covers, in teaching order.
 * Not the full lesson text — a specification of what must be present and in what order.
 */
export interface LessonOutlineSection {
  /** The section name (e.g. "The WHY", "Intuition", "Worked Example") */
  name: string;
  /** What this section must contain to be considered gold standard */
  mustContain: string[];
  /** Typical failure modes seen in non-gold lessons at this section */
  typicalFailures: string[];
}

/**
 * A single Gold Standard Lesson record.
 * Represents the teaching quality benchmark for one concept in one subject/class.
 */
export interface GoldStandardLesson {
  /** Unique identifier (kebab-case) */
  id: string;

  /** The specific concept this lesson teaches */
  concept: string;

  /** CBSE/ICSE class level */
  class: SupportedClass;

  /** Board this applies to */
  board: SupportedBoard;

  /** Subject */
  subject: SupportedSubject;

  /**
   * A precise, specific statement of WHY this lesson exemplifies gold-standard teaching.
   * Must reference specific pedagogical choices, not vague praise.
   */
  whyGoldStandard: string;

  /**
   * The specific teaching techniques this lesson demonstrates.
   * Each entry names the technique and how it is applied to this concept.
   */
  teachingTechniques: string[];

  /**
   * Observable quality characteristics — what a reviewer should find when reading this lesson.
   * These are the benchmark criteria against which generated lessons are compared.
   */
  expectedQualityCharacteristics: string[];

  /**
   * The common mistakes that non-gold lessons make on this concept.
   * Used to train reviewers and catch regressions.
   */
  commonNonGoldFailures: string[];

  /** CMF compliance — every rule should be true for a gold standard lesson */
  cmfCompliance: CMFCompliance;

  /**
   * The ordered sections of what a gold standard lesson on this concept covers.
   * Not full lesson text — a specification of what must be present.
   */
  lessonOutline: LessonOutlineSection[];
}
