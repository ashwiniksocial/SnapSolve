/**
 * Central question bank registry — Classes 6–9 Mathematics; Class 9 Economics; Class 9 Physics; Class 9 Chemistry; Class 9 Biology.
 *
 * Adding a new class/chapter:
 *  1. Create a class<N>-<subject>.ts file in this directory.
 *  2. Import and spread CHAPTERS + QUESTIONS below.
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
import { CHAPTER_META as CH16_META, QUESTIONS as CH16_QUESTIONS } from "./class9-maths-ch16";
import { CHAPTER_META as CH17_META, QUESTIONS as CH17_QUESTIONS } from "./class9-maths-ch17";

import { CLASS6_MATHS_CHAPTERS, CLASS6_MATHS_QUESTIONS } from "./class6-maths";
import { CLASS7_MATHS_CHAPTERS, CLASS7_MATHS_QUESTIONS } from "./class7-maths";
import { CLASS8_MATHS_CHAPTERS, CLASS8_MATHS_QUESTIONS } from "./class8-maths";

import { CHAPTER_META as ECO_CH1_META, QUESTIONS as ECO_CH1_QUESTIONS } from "./class9-economics-ch1";
import { CHAPTER_META as ECO_CH2_META, QUESTIONS as ECO_CH2_QUESTIONS } from "./class9-economics-ch2";
import { CHAPTER_META as ECO_CH3_META, QUESTIONS as ECO_CH3_QUESTIONS } from "./class9-economics-ch3";
import { CHAPTER_META as ECO_CH4_META, QUESTIONS as ECO_CH4_QUESTIONS } from "./class9-economics-ch4";

import { CHAPTER_META as PHY_CH1_META, QUESTIONS as PHY_CH1_QUESTIONS } from "./class9-physics-ch1";
import { CHAPTER_META as PHY_CH2_META, QUESTIONS as PHY_CH2_QUESTIONS } from "./class9-physics-ch2";
import { CHAPTER_META as PHY_CH3_META, QUESTIONS as PHY_CH3_QUESTIONS } from "./class9-physics-ch3";
import { CHAPTER_META as PHY_CH4_META, QUESTIONS as PHY_CH4_QUESTIONS } from "./class9-physics-ch4";
import { CHAPTER_META as PHY_CH5_META, QUESTIONS as PHY_CH5_QUESTIONS } from "./class9-physics-ch5";

import { CLASS9_CHEMISTRY_CHAPTERS, CLASS9_CHEMISTRY_QUESTIONS } from "./class9-chemistry";
import { CLASS9_BIOLOGY_CHAPTERS,  CLASS9_BIOLOGY_QUESTIONS  } from "./class9-biology";

const CLASS9_MATHS_CHAPTERS: ChapterMeta[] = [
  CH1_META, CH2_META, CH3_META, CH4_META, CH5_META,
  CH6_META, CH7_META, CH8_META, CH9_META, CH10_META,
  CH11_META, CH12_META, CH13_META, CH14_META, CH15_META,
  CH16_META, CH17_META,
];

const CLASS9_MATHS_QUESTIONS: Question[] = [
  ...CH1_QUESTIONS,  ...CH2_QUESTIONS,  ...CH3_QUESTIONS,
  ...CH4_QUESTIONS,  ...CH5_QUESTIONS,  ...CH6_QUESTIONS,
  ...CH7_QUESTIONS,  ...CH8_QUESTIONS,  ...CH9_QUESTIONS,
  ...CH10_QUESTIONS, ...CH11_QUESTIONS, ...CH12_QUESTIONS,
  ...CH13_QUESTIONS, ...CH14_QUESTIONS, ...CH15_QUESTIONS,
  ...CH16_QUESTIONS, ...CH17_QUESTIONS,
];

const CLASS9_ECONOMICS_CHAPTERS: ChapterMeta[] = [
  ECO_CH1_META, ECO_CH2_META, ECO_CH3_META, ECO_CH4_META,
];

const CLASS9_ECONOMICS_QUESTIONS: Question[] = [
  ...ECO_CH1_QUESTIONS, ...ECO_CH2_QUESTIONS,
  ...ECO_CH3_QUESTIONS, ...ECO_CH4_QUESTIONS,
];

const CLASS9_PHYSICS_CHAPTERS: ChapterMeta[] = [
  PHY_CH1_META, PHY_CH2_META, PHY_CH3_META, PHY_CH4_META, PHY_CH5_META,
];

const CLASS9_PHYSICS_QUESTIONS: Question[] = [
  ...PHY_CH1_QUESTIONS, ...PHY_CH2_QUESTIONS, ...PHY_CH3_QUESTIONS,
  ...PHY_CH4_QUESTIONS, ...PHY_CH5_QUESTIONS,
];

export const ALL_CHAPTERS: ChapterMeta[] = [
  ...CLASS6_MATHS_CHAPTERS,
  ...CLASS7_MATHS_CHAPTERS,
  ...CLASS8_MATHS_CHAPTERS,
  ...CLASS9_MATHS_CHAPTERS,
  ...CLASS9_ECONOMICS_CHAPTERS,
  ...CLASS9_PHYSICS_CHAPTERS,
  ...CLASS9_CHEMISTRY_CHAPTERS,
  ...CLASS9_BIOLOGY_CHAPTERS,
];

export const ALL_QUESTIONS: Question[] = [
  ...CLASS6_MATHS_QUESTIONS,
  ...CLASS7_MATHS_QUESTIONS,
  ...CLASS8_MATHS_QUESTIONS,
  ...CLASS9_MATHS_QUESTIONS,
  ...CLASS9_ECONOMICS_QUESTIONS,
  ...CLASS9_PHYSICS_QUESTIONS,
  ...CLASS9_CHEMISTRY_QUESTIONS,
  ...CLASS9_BIOLOGY_QUESTIONS,
];

export type { ChapterMeta, Question };
export type { Difficulty, TopicMeta, SolutionStep, QuestionType, EffectiveQuestionType } from "./types";
