/**
 * Class 8 Mathematics — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 * 6 chapters available (ch01, ch02, ch05, ch07, ch08, ch13).
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_RATIONAL_NUMBERS }      from "../../../../../question-bank/questions/mathematics/class8/ch01-rational-numbers";
import { CH02_LINEAR_EQUATIONS }      from "../../../../../question-bank/questions/mathematics/class8/ch02-linear-equations";
import { CH05_SQUARES_AND_SQUARE_ROOTS } from "../../../../../question-bank/questions/mathematics/class8/ch05-squares-and-square-roots";
import { CH07_COMPARING_QUANTITIES }  from "../../../../../question-bank/questions/mathematics/class8/ch07-comparing-quantities";
import { CH08_ALGEBRAIC_EXPRESSIONS_AND_IDENTITIES } from "../../../../../question-bank/questions/mathematics/class8/ch08-algebraic-expressions-and-identities";
import { CH13_FACTORISATION }         from "../../../../../question-bank/questions/mathematics/class8/ch13-factorisation";

const RAW: QuestionV2Like[] = [
  ...(CH01_RATIONAL_NUMBERS      as unknown as QuestionV2Like[]),
  ...(CH02_LINEAR_EQUATIONS      as unknown as QuestionV2Like[]),
  ...(CH05_SQUARES_AND_SQUARE_ROOTS as unknown as QuestionV2Like[]),
  ...(CH07_COMPARING_QUANTITIES  as unknown as QuestionV2Like[]),
  ...(CH08_ALGEBRAIC_EXPRESSIONS_AND_IDENTITIES as unknown as QuestionV2Like[]),
  ...(CH13_FACTORISATION         as unknown as QuestionV2Like[]),
];

export const CLASS8_MATHS_QUESTIONS: Question[] = adaptV2Questions(RAW);
export const CLASS8_MATHS_CHAPTERS:  ChapterMeta[] = buildChapterMeta(CLASS8_MATHS_QUESTIONS);
