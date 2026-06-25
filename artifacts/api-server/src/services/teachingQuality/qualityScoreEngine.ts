/**
 * Computes the weighted overall teaching quality score from dimension scores.
 * Pure logic — no AI calls.
 */

import { DIMENSION_WEIGHTS, type DimensionKey } from "./qualityChecklist";

export interface DimensionScores {
  vocabulary:               number;
  conceptTeaching:          number;
  reasoning:                number;
  stepExplanation:          number;
  examples:                 number;
  memory:                   number;
  practice:                 number;
  confidenceBuilding:       number;
  weakStudentUnderstanding: number;
  overall:                  number;
}

/**
 * Given per-dimension scores (0–100 each), compute the weighted overall score.
 */
export function computeOverall(scores: Omit<DimensionScores, "overall">): number {
  const totalWeight = Object.values(DIMENSION_WEIGHTS).reduce((a, b) => a + b, 0);
  let weighted = 0;
  for (const dim of Object.keys(DIMENSION_WEIGHTS) as DimensionKey[]) {
    weighted += (scores[dim] ?? 0) * DIMENSION_WEIGHTS[dim];
  }
  return Math.round(weighted / totalWeight);
}

/**
 * Build a complete DimensionScores object from the raw per-dimension map returned by OpenAI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseDimensionScores(raw: any): DimensionScores {
  function clamp(v: unknown): number {
    const n = typeof v === "number" ? v : 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  const base: Omit<DimensionScores, "overall"> = {
    vocabulary:               clamp(raw?.vocabulary),
    conceptTeaching:          clamp(raw?.conceptTeaching),
    reasoning:                clamp(raw?.reasoning),
    stepExplanation:          clamp(raw?.stepExplanation),
    examples:                 clamp(raw?.examples),
    memory:                   clamp(raw?.memory),
    practice:                 clamp(raw?.practice),
    confidenceBuilding:       clamp(raw?.confidenceBuilding),
    weakStudentUnderstanding: clamp(raw?.weakStudentUnderstanding),
  };

  return { ...base, overall: computeOverall(base) };
}
