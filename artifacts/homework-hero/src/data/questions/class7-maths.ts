/**
 * Class 7 Mathematics — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 * 8 chapters available (ch01, ch02, ch04, ch06, ch08, ch09, ch12, ch13).
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_INTEGERS }               from "../../../../../question-bank/questions/mathematics/class7/ch01-integers";
import { CH02_FRACTIONS_AND_DECIMALS } from "../../../../../question-bank/questions/mathematics/class7/ch02-fractions-and-decimals";
import { CH04_SIMPLE_EQUATIONS }       from "../../../../../question-bank/questions/mathematics/class7/ch04-simple-equations";
import { CH06_TRIANGLE_AND_ITS_PROPERTIES } from "../../../../../question-bank/questions/mathematics/class7/ch06-triangle-and-its-properties";
import { CH08_COMPARING_QUANTITIES }   from "../../../../../question-bank/questions/mathematics/class7/ch08-comparing-quantities";
import { CH09_RATIONAL_NUMBERS }       from "../../../../../question-bank/questions/mathematics/class7/ch09-rational-numbers";
import { CH12_ALGEBRAIC_EXPRESSIONS }  from "../../../../../question-bank/questions/mathematics/class7/ch12-algebraic-expressions";
import { CH13_EXPONENTS_AND_POWERS }   from "../../../../../question-bank/questions/mathematics/class7/ch13-exponents-and-powers";

const RAW: QuestionV2Like[] = [
  ...(CH01_INTEGERS               as unknown as QuestionV2Like[]),
  ...(CH02_FRACTIONS_AND_DECIMALS as unknown as QuestionV2Like[]),
  ...(CH04_SIMPLE_EQUATIONS       as unknown as QuestionV2Like[]),
  ...(CH06_TRIANGLE_AND_ITS_PROPERTIES as unknown as QuestionV2Like[]),
  ...(CH08_COMPARING_QUANTITIES   as unknown as QuestionV2Like[]),
  ...(CH09_RATIONAL_NUMBERS       as unknown as QuestionV2Like[]),
  ...(CH12_ALGEBRAIC_EXPRESSIONS  as unknown as QuestionV2Like[]),
  ...(CH13_EXPONENTS_AND_POWERS   as unknown as QuestionV2Like[]),
];

export const CLASS7_MATHS_QUESTIONS: Question[] = adaptV2Questions(RAW);
export const CLASS7_MATHS_CHAPTERS:  ChapterMeta[] = buildChapterMeta(CLASS7_MATHS_QUESTIONS);
