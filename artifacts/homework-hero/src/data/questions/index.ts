/**
 * Central question bank registry — Class 9: Mathematics, Physics, Chemistry, Biology, Earth Science.
 *
 * Adding a new chapter:
 *  1. Create a class9-<subject>-<ch>.ts file in this directory.
 *  2. Import and spread CHAPTERS + QUESTIONS below.
 *
 * Firebase migration path:
 *  Replace ALL_QUESTIONS with a Firestore query in questionService.ts.
 *  Everything else stays the same.
 */

import type { ChapterMeta, Question } from "./types";

import { CHAPTER_META as CH1_META,  QUESTIONS as CH1_QUESTIONS  } from "./class9-maths-ch1";
import { CHAPTER_META as CH3_META,  QUESTIONS as CH3_QUESTIONS  } from "./class9-maths-ch3";
import { CHAPTER_META as CH4_META,  QUESTIONS as CH4_QUESTIONS  } from "./class9-maths-ch4";
import { CHAPTER_META as CH15_META, QUESTIONS as CH15_QUESTIONS } from "./class9-maths-ch15";
import { CHAPTER_META as CH16_META, QUESTIONS as CH16_QUESTIONS } from "./class9-maths-ch16";
import { CHAPTER_META as CH17_META, QUESTIONS as CH17_QUESTIONS } from "./class9-maths-ch17";
import { CHAPTER_META as CH18_META, QUESTIONS as CH18_QUESTIONS } from "./class9-maths-ch18";
import { CHAPTER_META as IEMH102_META, QUESTIONS as IEMH102_QUESTIONS } from "./class9-maths-iemh102";

import { CHAPTER_META as PHY_CH1_META, QUESTIONS as PHY_CH1_QUESTIONS } from "./class9-physics-ch1";
import { CHAPTER_META as PHY_CH2_META, QUESTIONS as PHY_CH2_QUESTIONS } from "./class9-physics-ch2";
import { CHAPTER_META as PHY_CH4_META, QUESTIONS as PHY_CH4_QUESTIONS } from "./class9-physics-ch4";
import { CHAPTER_META as PHY_CH5_META, QUESTIONS as PHY_CH5_QUESTIONS } from "./class9-physics-ch5";

import { CLASS9_CHEMISTRY_CHAPTERS, CLASS9_CHEMISTRY_QUESTIONS } from "./class9-chemistry";
import { CLASS9_BIOLOGY_CHAPTERS,  CLASS9_BIOLOGY_QUESTIONS  } from "./class9-biology";
import { CLASS9_SCIENCE_PLACEHOLDER_CHAPTERS, CLASS9_SCIENCE_PLACEHOLDER_QUESTIONS } from "./class9-science-placeholders";

const CLASS9_MATHS_CHAPTERS: ChapterMeta[] = [
  CH1_META, CH3_META, CH4_META, CH15_META,
  CH16_META, CH17_META, CH18_META, IEMH102_META,
];

const CLASS9_MATHS_QUESTIONS: Question[] = [
  ...CH1_QUESTIONS,  ...CH3_QUESTIONS,  ...CH4_QUESTIONS,
  ...CH15_QUESTIONS, ...CH16_QUESTIONS, ...CH17_QUESTIONS,
  ...CH18_QUESTIONS, ...IEMH102_QUESTIONS,
];

const CLASS9_PHYSICS_CHAPTERS: ChapterMeta[] = [
  PHY_CH1_META, PHY_CH2_META, PHY_CH4_META, PHY_CH5_META,
];

const CLASS9_PHYSICS_QUESTIONS: Question[] = [
  ...PHY_CH1_QUESTIONS, ...PHY_CH2_QUESTIONS,
  ...PHY_CH4_QUESTIONS, ...PHY_CH5_QUESTIONS,
];

export const ALL_CHAPTERS: ChapterMeta[] = [
  ...CLASS9_MATHS_CHAPTERS,
  ...CLASS9_PHYSICS_CHAPTERS,
  ...CLASS9_CHEMISTRY_CHAPTERS,
  ...CLASS9_BIOLOGY_CHAPTERS,
  ...CLASS9_SCIENCE_PLACEHOLDER_CHAPTERS,
];

export const ALL_QUESTIONS: Question[] = [
  ...CLASS9_MATHS_QUESTIONS,
  ...CLASS9_PHYSICS_QUESTIONS,
  ...CLASS9_CHEMISTRY_QUESTIONS,
  ...CLASS9_BIOLOGY_QUESTIONS,
  ...CLASS9_SCIENCE_PLACEHOLDER_QUESTIONS,
];

export type { ChapterMeta, Question };
export type { Difficulty, TopicMeta, SolutionStep, QuestionType, EffectiveQuestionType } from "./types";
