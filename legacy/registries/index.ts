/**
 * Question Bank Architecture — Index
 *
 * Developer-only. NEVER imported by any runtime service.
 * Import this file only in developer tools, validation scripts, or authoring utilities.
 *
 * This file exports the complete architecture: all types, taxonomies,
 * the chapter registry, and all subject blueprints.
 *
 * ── What this is NOT ─────────────────────────────────────────────────────────
 * This folder contains the ARCHITECTURE and METADATA — not the questions.
 * Actual questions live in:
 *   artifacts/homework-hero/src/data/questions/
 *
 * ── How to use this in authoring tools ───────────────────────────────────────
 * import { findChapter, MATHEMATICS_BLUEPRINT, buildQuestionId } from './question-bank/index';
 */

// ── Type system ───────────────────────────────────────────────────────────────
export type {
  SupportedClass,
  SupportedSubject,
  SupportedBoard,
  BoardApplicability,
  QuestionType,
  QuestionFormat,
  Difficulty,
  BloomsLevel,
  QuestionMarks,
  QuestionSource,
  SolutionStep,
  AssertionReasonOption,
  QuestionV1,
  QuestionV2,
  CaseStudySubQuestion,
  TopicSpec,
  ChapterRecord,
  ChapterCategory,
  QuestionTypeQuota,
  DifficultyQuota,
  BloomsQuota,
  CategoryBlueprint,
  SubjectBlueprint,
  BankCoverage,
} from "./types";

// ── Tagging taxonomy ──────────────────────────────────────────────────────────
export {
  BOARD_CODES,
  SUBJECT_CODES,
  TYPE_CODES,
  buildQuestionId,
  QUESTION_TYPE_DESCRIPTIONS,
  FORMAT_DESCRIPTIONS,
  BLOOMS_DESCRIPTIONS,
  DIFFICULTY_DESCRIPTIONS,
  CONCEPT_NODE_CONVENTION,
  STANDARD_TAGS,
} from "./tagging";
export type { StandardTag } from "./tagging";

// ── Chapter registry ──────────────────────────────────────────────────────────
export {
  ALL_CHAPTERS,
  MATHEMATICS_CHAPTERS,
  PHYSICS_CHAPTERS,
  CHEMISTRY_CHAPTERS,
  BIOLOGY_CHAPTERS,
  CS_CHAPTERS,
  ECONOMICS_CHAPTERS,
  findChapter,
} from "./chapterRegistry";

// ── Subject blueprints ────────────────────────────────────────────────────────
export { MATHEMATICS_BLUEPRINT }    from "./blueprints/mathematics";
export { PHYSICS_BLUEPRINT }        from "./blueprints/physics";
export { CHEMISTRY_BLUEPRINT }      from "./blueprints/chemistry";
export { BIOLOGY_BLUEPRINT }        from "./blueprints/biology";
export { COMPUTER_SCIENCE_BLUEPRINT } from "./blueprints/computerScience";
export { ECONOMICS_BLUEPRINT }      from "./blueprints/economics";

import { MATHEMATICS_BLUEPRINT }    from "./blueprints/mathematics";
import { PHYSICS_BLUEPRINT }        from "./blueprints/physics";
import { CHEMISTRY_BLUEPRINT }      from "./blueprints/chemistry";
import { BIOLOGY_BLUEPRINT }        from "./blueprints/biology";
import { COMPUTER_SCIENCE_BLUEPRINT } from "./blueprints/computerScience";
import { ECONOMICS_BLUEPRINT }      from "./blueprints/economics";
import { ALL_CHAPTERS }             from "./chapterRegistry";
import type { SubjectBlueprint, BankCoverage, SupportedSubject, SupportedClass, ChapterCategory } from "./types";

/** All subject blueprints in one map for programmatic access */
export const ALL_BLUEPRINTS: Record<SupportedSubject, SubjectBlueprint> = {
  Mathematics:       MATHEMATICS_BLUEPRINT,
  Physics:           PHYSICS_BLUEPRINT,
  Chemistry:         CHEMISTRY_BLUEPRINT,
  Biology:           BIOLOGY_BLUEPRINT,
  "Computer Science": COMPUTER_SCIENCE_BLUEPRINT,
  Economics:         ECONOMICS_BLUEPRINT,
};

/**
 * Calculate the total question target for a chapter given its category.
 */
export function getChapterTarget(
  subject:   SupportedSubject,
  category:  ChapterCategory,
): number {
  return ALL_BLUEPRINTS[subject].categoryBlueprints[category].targetTotal;
}

/**
 * Generate a summary of the bank's current architectural coverage.
 * Does not count actual authored questions — only registered chapters and targets.
 */
export function getBankCoverage(): BankCoverage {
  const bySubject: BankCoverage["bySubject"] = {
    Mathematics:       { chapters: 0, targetQuestions: 0 },
    Physics:           { chapters: 0, targetQuestions: 0 },
    Chemistry:         { chapters: 0, targetQuestions: 0 },
    Biology:           { chapters: 0, targetQuestions: 0 },
    "Computer Science": { chapters: 0, targetQuestions: 0 },
    Economics:         { chapters: 0, targetQuestions: 0 },
  };

  const byClass: BankCoverage["byClass"] = {
    6: { chapters: 0, targetQuestions: 0 },
    7: { chapters: 0, targetQuestions: 0 },
    8: { chapters: 0, targetQuestions: 0 },
    9: { chapters: 0, targetQuestions: 0 },
  };

  const byBoard: BankCoverage["byBoard"] = {
    CBSE: { chapters: 0 },
    ICSE: { chapters: 0 },
    Both: { chapters: 0 },
  };

  let totalChapters = 0;
  let totalTargetQuestions = 0;

  for (const chapter of ALL_CHAPTERS) {
    const target = getChapterTarget(chapter.subject, chapter.category);

    bySubject[chapter.subject].chapters++;
    bySubject[chapter.subject].targetQuestions += target;

    byClass[chapter.classNum as SupportedClass].chapters++;
    byClass[chapter.classNum as SupportedClass].targetQuestions += target;

    byBoard[chapter.board].chapters++;

    totalChapters++;
    totalTargetQuestions += target;
  }

  return { totalChapters, totalTargetQuestions, bySubject, byClass, byBoard };
}
