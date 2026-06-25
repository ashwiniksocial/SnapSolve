/**
 * Validates whether a lesson has passed all quality thresholds.
 * Pure logic — no AI calls.
 */

import { PASS_THRESHOLD } from "./teachingRubric";
import { type DimensionScores } from "./qualityScoreEngine";

export interface ValidationResult {
  passed:          boolean;
  failingDimensions: string[];
  lowestScore:     number;
  lowestDimension: string;
}

export function validateLesson(scores: DimensionScores): ValidationResult {
  const dims = [
    "vocabulary",
    "conceptTeaching",
    "reasoning",
    "stepExplanation",
    "examples",
    "memory",
    "practice",
    "confidenceBuilding",
    "weakStudentUnderstanding",
  ] as const;

  const failing: string[] = [];
  let lowestScore = 100;
  let lowestDimension = "";

  for (const dim of dims) {
    const score = scores[dim];
    if (score < PASS_THRESHOLD) {
      failing.push(`${dim}=${score}`);
    }
    if (score < lowestScore) {
      lowestScore = score;
      lowestDimension = dim;
    }
  }

  return {
    passed:              failing.length === 0,
    failingDimensions:   failing,
    lowestScore,
    lowestDimension,
  };
}
