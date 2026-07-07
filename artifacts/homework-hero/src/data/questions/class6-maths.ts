/**
 * Class 6 Mathematics — question bank integration.
 * Imports QuestionV2 data from question-bank/ and adapts to the frontend Question (V1) type.
 */

import { adaptV2Questions, buildChapterMeta } from "./v2adapter";
import type { QuestionV2Like } from "./v2adapter";
import type { Question, ChapterMeta } from "./types";

import { CH01_KNOWING_OUR_NUMBERS }        from "../../../../../question-bank/questions/mathematics/class6/ch01-knowing-our-numbers";
import { CH02_WHOLE_NUMBERS }              from "../../../../../question-bank/questions/mathematics/class6/ch02-whole-numbers";
import { CH03_PLAYING_WITH_NUMBERS }       from "../../../../../question-bank/questions/mathematics/class6/ch03-playing-with-numbers";
import { CH04_BASIC_GEOMETRICAL_IDEAS }    from "../../../../../question-bank/questions/mathematics/class6/ch04-basic-geometrical-ideas";
import { CH05_UNDERSTANDING_ELEMENTARY_SHAPES } from "../../../../../question-bank/questions/mathematics/class6/ch05-understanding-elementary-shapes";
import { CH06_INTEGERS }                   from "../../../../../question-bank/questions/mathematics/class6/ch06-integers";
import { CH07_FRACTIONS }                  from "../../../../../question-bank/questions/mathematics/class6/ch07-fractions";
import { CH08_DECIMALS }                   from "../../../../../question-bank/questions/mathematics/class6/ch08-decimals";
import { CH09_DATA_HANDLING }              from "../../../../../question-bank/questions/mathematics/class6/ch09-data-handling";
import { CH10_MENSURATION }                from "../../../../../question-bank/questions/mathematics/class6/ch10-mensuration";
import { CH11_ALGEBRA }                    from "../../../../../question-bank/questions/mathematics/class6/ch11-algebra";
import { CH12_RATIO_AND_PROPORTION }       from "../../../../../question-bank/questions/mathematics/class6/ch12-ratio-and-proportion";
import { CH13_SYMMETRY }                   from "../../../../../question-bank/questions/mathematics/class6/ch13-symmetry";
import { CH14_PRACTICAL_GEOMETRY }         from "../../../../../question-bank/questions/mathematics/class6/ch14-practical-geometry";

const RAW: QuestionV2Like[] = [
  ...(CH01_KNOWING_OUR_NUMBERS         as unknown as QuestionV2Like[]),
  ...(CH02_WHOLE_NUMBERS               as unknown as QuestionV2Like[]),
  ...(CH03_PLAYING_WITH_NUMBERS        as unknown as QuestionV2Like[]),
  ...(CH04_BASIC_GEOMETRICAL_IDEAS     as unknown as QuestionV2Like[]),
  ...(CH05_UNDERSTANDING_ELEMENTARY_SHAPES as unknown as QuestionV2Like[]),
  ...(CH06_INTEGERS                    as unknown as QuestionV2Like[]),
  ...(CH07_FRACTIONS                   as unknown as QuestionV2Like[]),
  ...(CH08_DECIMALS                    as unknown as QuestionV2Like[]),
  ...(CH09_DATA_HANDLING               as unknown as QuestionV2Like[]),
  ...(CH10_MENSURATION                 as unknown as QuestionV2Like[]),
  ...(CH11_ALGEBRA                     as unknown as QuestionV2Like[]),
  ...(CH12_RATIO_AND_PROPORTION        as unknown as QuestionV2Like[]),
  ...(CH13_SYMMETRY                    as unknown as QuestionV2Like[]),
  ...(CH14_PRACTICAL_GEOMETRY          as unknown as QuestionV2Like[]),
];

export const CLASS6_MATHS_QUESTIONS: Question[] = adaptV2Questions(RAW);
export const CLASS6_MATHS_CHAPTERS:  ChapterMeta[] = buildChapterMeta(CLASS6_MATHS_QUESTIONS);
