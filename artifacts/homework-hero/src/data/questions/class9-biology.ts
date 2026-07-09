/**
 * Class 9 Biology — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 * 4 chapters: Ch01–Ch04 (CBSE 2026-27 Science Biology chapters).
 *
 * Chapters:
 *   Ch01 The Fundamental Unit of Life
 *   Ch02 Tissues
 *   Ch03 Diversity in Living Organisms
 *   Ch04 Why Do We Fall Ill?
 *
 * All chapter arrays are currently empty placeholders.
 * Add questions to question-bank/questions/biology/class9/ and re-run the bank audit.
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_THE_FUNDAMENTAL_UNIT_OF_LIFE } from "../../../../../question-bank/questions/biology/class9/ch01-the-fundamental-unit-of-life";
import { CH02_TISSUES }                      from "../../../../../question-bank/questions/biology/class9/ch02-tissues";
import { CH03_DIVERSITY_IN_LIVING_ORGANISMS } from "../../../../../question-bank/questions/biology/class9/ch03-diversity-in-living-organisms";
import { CH04_WHY_DO_WE_FALL_ILL }           from "../../../../../question-bank/questions/biology/class9/ch04-why-do-we-fall-ill";

const RAW: QuestionV2Like[] = [
  ...(CH01_THE_FUNDAMENTAL_UNIT_OF_LIFE  as unknown as QuestionV2Like[]),
  ...(CH02_TISSUES                       as unknown as QuestionV2Like[]),
  ...(CH03_DIVERSITY_IN_LIVING_ORGANISMS as unknown as QuestionV2Like[]),
  ...(CH04_WHY_DO_WE_FALL_ILL            as unknown as QuestionV2Like[]),
];

export const CLASS9_BIOLOGY_QUESTIONS: Question[]    = adaptV2Questions(RAW);
export const CLASS9_BIOLOGY_CHAPTERS:  ChapterMeta[] = buildChapterMeta(CLASS9_BIOLOGY_QUESTIONS);
