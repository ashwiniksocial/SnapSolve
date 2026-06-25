/**
 * Central question bank registry.
 *
 * Adding a new class/chapter:
 *  1. Create `class<N>-<subject>-ch<M>.ts` following the same structure.
 *  2. Import and spread QUESTIONS here.
 *  3. Add CHAPTER_META to ALL_CHAPTERS.
 *
 * Firebase migration path:
 *  Replace ALL_QUESTIONS with a Firestore query in questionService.ts.
 *  Everything else stays the same.
 */

import type { ChapterMeta, Question } from "./types";

import { CHAPTER_META as CH1_META,  QUESTIONS as CH1_QUESTIONS  } from "./class9-maths-ch1";
import { CHAPTER_META as CH2_META,  QUESTIONS as CH2_QUESTIONS  } from "./class9-maths-ch2";
import { CHAPTER_META as CH3_META,  QUESTIONS as CH3_QUESTIONS  } from "./class9-maths-ch3";
import { CHAPTER_META as CH4_META,  QUESTIONS as CH4_QUESTIONS  } from "./class9-maths-ch4";
import { CHAPTER_META as CH5_META,  QUESTIONS as CH5_QUESTIONS  } from "./class9-maths-ch5";
import { CHAPTER_META as CH6_META,  QUESTIONS as CH6_QUESTIONS  } from "./class9-maths-ch6";
import { CHAPTER_META as CH7_META,  QUESTIONS as CH7_QUESTIONS  } from "./class9-maths-ch7";
import { CHAPTER_META as CH8_META,  QUESTIONS as CH8_QUESTIONS  } from "./class9-maths-ch8";
import { CHAPTER_META as CH9_META,  QUESTIONS as CH9_QUESTIONS  } from "./class9-maths-ch9";
import { CHAPTER_META as CH10_META, QUESTIONS as CH10_QUESTIONS } from "./class9-maths-ch10";
import { CHAPTER_META as CH11_META, QUESTIONS as CH11_QUESTIONS } from "./class9-maths-ch11";
import { CHAPTER_META as CH12_META, QUESTIONS as CH12_QUESTIONS } from "./class9-maths-ch12";
import { CHAPTER_META as CH13_META, QUESTIONS as CH13_QUESTIONS } from "./class9-maths-ch13";
import { CHAPTER_META as CH14_META, QUESTIONS as CH14_QUESTIONS } from "./class9-maths-ch14";
import { CHAPTER_META as CH15_META, QUESTIONS as CH15_QUESTIONS } from "./class9-maths-ch15";

export const ALL_CHAPTERS: ChapterMeta[] = [
  CH1_META, CH2_META, CH3_META, CH4_META, CH5_META,
  CH6_META, CH7_META, CH8_META, CH9_META, CH10_META,
  CH11_META, CH12_META, CH13_META, CH14_META, CH15_META,
];

export const ALL_QUESTIONS: Question[] = [
  ...CH1_QUESTIONS,  ...CH2_QUESTIONS,  ...CH3_QUESTIONS,
  ...CH4_QUESTIONS,  ...CH5_QUESTIONS,  ...CH6_QUESTIONS,
  ...CH7_QUESTIONS,  ...CH8_QUESTIONS,  ...CH9_QUESTIONS,
  ...CH10_QUESTIONS, ...CH11_QUESTIONS, ...CH12_QUESTIONS,
  ...CH13_QUESTIONS, ...CH14_QUESTIONS, ...CH15_QUESTIONS,
];

export type { ChapterMeta, Question };
export type { Difficulty, TopicMeta, SolutionStep, QuestionType } from "./types";
