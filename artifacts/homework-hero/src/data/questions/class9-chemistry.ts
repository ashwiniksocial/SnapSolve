/**
 * Class 9 Chemistry — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 * 4 chapters: Ch01–Ch04 (NCERT Class 9 Science Chemistry chapters, 2025-26 syllabus).
 *
 * Chapters:
 *   Ch01 Matter in Our Surroundings
 *   Ch02 Exploring Mixtures and Their Separation
 *   Ch03 Atoms and Molecules
 *   Ch04 Structure of the Atom
 *
 * Note: Ch05 Periodic Classification of Elements was relocated to Class 10 in the
 * 2022-23 NCERT rationalization and is intentionally excluded from this adapter.
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_MATTER_IN_OUR_SURROUNDINGS } from "../../../../../question-bank/questions/chemistry/class9/ch01-matter-in-our-surroundings";
import { CH02_IS_MATTER_AROUND_US_PURE }   from "../../../../../question-bank/questions/chemistry/class9/ch02-is-matter-around-us-pure";
import { CH03_ATOMS_AND_MOLECULES }        from "../../../../../question-bank/questions/chemistry/class9/ch03-atoms-and-molecules";
import { CH04_STRUCTURE_OF_THE_ATOM }      from "../../../../../question-bank/questions/chemistry/class9/ch04-structure-of-the-atom";

const RAW: QuestionV2Like[] = [
  ...(CH01_MATTER_IN_OUR_SURROUNDINGS as unknown as QuestionV2Like[]),
  ...(CH02_IS_MATTER_AROUND_US_PURE   as unknown as QuestionV2Like[]),
  ...(CH03_ATOMS_AND_MOLECULES        as unknown as QuestionV2Like[]),
  ...(CH04_STRUCTURE_OF_THE_ATOM      as unknown as QuestionV2Like[]),
];

export const CLASS9_CHEMISTRY_QUESTIONS: Question[]    = adaptV2Questions(RAW);

// Mark chem-ch01 (Matter in Our Surroundings) as cbseDeleted — it was removed from
// the CBSE board exam syllabus in 2022-23 (confirmed in the curriculum gateway).
// Questions are preserved in CLASS9_CHEMISTRY_QUESTIONS for archival; the chapter
// is hidden from the student-facing Science chapter list via getChapters().
export const CLASS9_CHEMISTRY_CHAPTERS: ChapterMeta[] = buildChapterMeta(CLASS9_CHEMISTRY_QUESTIONS)
  .map((ch) => ch.id === "chem-ch01" ? { ...ch, cbseDeleted: true as const } : ch);
