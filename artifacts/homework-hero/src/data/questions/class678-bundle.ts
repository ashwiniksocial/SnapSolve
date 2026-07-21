/**
 * Classes 6–8 question-bank bundle — imported lazily by questionService.preloadQBank.
 * Aggregates all Classes 6, 7, and 8 Maths data.
 */
import type { ChapterMeta, Question } from "./types";

import { CLASS6_MATHS_CHAPTERS, CLASS6_MATHS_QUESTIONS } from "./class6-maths";
import { CLASS7_MATHS_CHAPTERS, CLASS7_MATHS_QUESTIONS } from "./class7-maths";
import { CLASS8_MATHS_CHAPTERS, CLASS8_MATHS_QUESTIONS } from "./class8-maths";

export const CHAPTERS: ChapterMeta[] = [
  ...CLASS6_MATHS_CHAPTERS,
  ...CLASS7_MATHS_CHAPTERS,
  ...CLASS8_MATHS_CHAPTERS,
];

export const QUESTIONS: Question[] = [
  ...CLASS6_MATHS_QUESTIONS,
  ...CLASS7_MATHS_QUESTIONS,
  ...CLASS8_MATHS_QUESTIONS,
];
