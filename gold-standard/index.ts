/**
 * Gold Standard Lesson Library — Index
 *
 * Developer-only. NEVER imported by any runtime service.
 * Import this file only in developer tools, benchmarking scripts, or test harnesses.
 *
 * This library is the permanent quality benchmark for SnapSolve lesson generation.
 * Every lesson in this library represents the teaching quality that generated lessons
 * should aspire to reach.
 *
 * Scope: Classes 6–9, CBSE and ICSE.
 * Subjects: Mathematics, Physics, Chemistry, Biology, Computer Science, Economics.
 *
 * To add a new gold standard lesson:
 *   1. Add it to the appropriate subject file (or create a new subject file).
 *   2. Ensure it satisfies every field in the GoldStandardLesson type.
 *   3. Verify cmfCompliance is true for all 15 rules.
 *   4. Export it from this index.
 */

export type {
  GoldStandardLesson,
  CMFCompliance,
  LessonOutlineSection,
  SupportedSubject,
  SupportedClass,
  SupportedBoard,
} from "./types";

export { MATHEMATICS_GOLD_STANDARDS }   from "./mathematics";
export { PHYSICS_GOLD_STANDARDS }       from "./physics";
export { CHEMISTRY_GOLD_STANDARDS }     from "./chemistry";
export { BIOLOGY_GOLD_STANDARDS }       from "./biology";
export { COMPUTER_SCIENCE_GOLD_STANDARDS } from "./computerScience";
export { ECONOMICS_GOLD_STANDARDS }     from "./economics";

import { MATHEMATICS_GOLD_STANDARDS }      from "./mathematics";
import { PHYSICS_GOLD_STANDARDS }          from "./physics";
import { CHEMISTRY_GOLD_STANDARDS }        from "./chemistry";
import { BIOLOGY_GOLD_STANDARDS }          from "./biology";
import { COMPUTER_SCIENCE_GOLD_STANDARDS } from "./computerScience";
import { ECONOMICS_GOLD_STANDARDS }        from "./economics";

/**
 * The complete Gold Standard Lesson Library.
 * All lessons from all subjects in one flat array.
 * Use this for iteration, search, or benchmarking across subjects.
 */
export const ALL_GOLD_STANDARDS = [
  ...MATHEMATICS_GOLD_STANDARDS,
  ...PHYSICS_GOLD_STANDARDS,
  ...CHEMISTRY_GOLD_STANDARDS,
  ...BIOLOGY_GOLD_STANDARDS,
  ...COMPUTER_SCIENCE_GOLD_STANDARDS,
  ...ECONOMICS_GOLD_STANDARDS,
];

/**
 * Summary statistics for the library.
 * Use during development to verify coverage.
 */
export function getLibrarySummary() {
  const bySubject = ALL_GOLD_STANDARDS.reduce<Record<string, number>>((acc, lesson) => {
    acc[lesson.subject] = (acc[lesson.subject] ?? 0) + 1;
    return acc;
  }, {});

  const byClass = ALL_GOLD_STANDARDS.reduce<Record<number, number>>((acc, lesson) => {
    acc[lesson.class] = (acc[lesson.class] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total:     ALL_GOLD_STANDARDS.length,
    bySubject,
    byClass,
    ids:       ALL_GOLD_STANDARDS.map(l => l.id),
  };
}
