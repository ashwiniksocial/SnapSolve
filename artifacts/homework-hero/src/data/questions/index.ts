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

import {
  CHAPTER_META as CH1_META,
  QUESTIONS as CH1_QUESTIONS,
} from "./class9-maths-ch1";

import {
  CHAPTER_META as CH2_META,
  QUESTIONS as CH2_QUESTIONS,
} from "./class9-maths-ch2";

import {
  CHAPTER_META as CH3_META,
  QUESTIONS as CH3_QUESTIONS,
} from "./class9-maths-ch3";

export const ALL_CHAPTERS: ChapterMeta[] = [CH1_META, CH2_META, CH3_META];

export const ALL_QUESTIONS: Question[] = [
  ...CH1_QUESTIONS,
  ...CH2_QUESTIONS,
  ...CH3_QUESTIONS,
];

export type { ChapterMeta, Question };
export type { Difficulty, TopicMeta, SolutionStep } from "./types";
