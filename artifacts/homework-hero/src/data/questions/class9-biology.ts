/**
 * Class 9 Biology — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 * 3 active chapters: Ch01–Ch03 (Exploration iesc102, iesc103, iesc112).
 *
 * Chapters:
 *   Ch01 The Fundamental Unit of Life  — iesc102
 *   Ch02 Tissues                       — iesc103
 *   Ch03 Diversity in Living Organisms — iesc112
 *
 * Ch04 Why Do We Fall Ill? is archived in /legacy (not in locked Exploration curriculum).
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_THE_FUNDAMENTAL_UNIT_OF_LIFE } from "../../../../../question-bank/questions/biology/class9/ch01-the-fundamental-unit-of-life";
import { CH02_TISSUES }                      from "../../../../../question-bank/questions/biology/class9/ch02-tissues";
import { CH03_DIVERSITY_IN_LIVING_ORGANISMS } from "../../../../../question-bank/questions/biology/class9/ch03-diversity-in-living-organisms";

const RAW: QuestionV2Like[] = [
  ...(CH01_THE_FUNDAMENTAL_UNIT_OF_LIFE  as unknown as QuestionV2Like[]),
  ...(CH02_TISSUES                       as unknown as QuestionV2Like[]),
  ...(CH03_DIVERSITY_IN_LIVING_ORGANISMS as unknown as QuestionV2Like[]),
];

export const CLASS9_BIOLOGY_QUESTIONS: Question[]    = adaptV2Questions(RAW);
export const CLASS9_BIOLOGY_CHAPTERS:  ChapterMeta[] = buildChapterMeta(CLASS9_BIOLOGY_QUESTIONS)
  .map((ch) => {
    if (ch.id === "bio-ch01") return { ...ch, name: "Cell \u2014 The Fundamental Unit of Life" };
    return ch;
  });
