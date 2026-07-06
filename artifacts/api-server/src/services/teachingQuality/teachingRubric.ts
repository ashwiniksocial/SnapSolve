/**
 * Teaching quality rubric — the benchmark every lesson is measured against.
 * Pure data — no AI calls.
 */

export interface RubricBand {
  min:         number;
  max:         number;
  label:       string;
  description: string;
}

export const RUBRIC: RubricBand[] = [
  { min: 0,  max: 40, label: "AI answer",                   description: "Outputs an answer. No teaching. A weak student cannot follow." },
  { min: 40, max: 60, label: "Textbook",                    description: "Correct but dry. Only a student who already knows can follow." },
  { min: 60, max: 80, label: "Good school teacher",         description: "Explains steps. Still misses WHY for weak students." },
  { min: 80, max: 90, label: "Excellent private tutor",     description: "Explains WHY. Has some hidden jumps and assumptions." },
  { min: 90, max: 95, label: "Top IIT coaching faculty",    description: "Very thorough. Weak students can mostly follow." },
  { min: 95, max: 101, label: "World-class personal tutor", description: "Zero assumptions. Zero hidden jumps. Every weak student understands." },
];

/**
 * Every scored dimension must reach this score before the lesson is approved.
 * If even one dimension is below this threshold, the lesson is sent for improvement.
 *
 * 80 = "Excellent private tutor" — explains WHY, very few hidden jumps.
 * Lessons that clear this bar on the first review skip the improve cycle entirely,
 * saving 2–4 LLM calls per question. The threshold is still high enough to catch
 * genuinely poor lessons (textbook-quality, < 60) and trigger improvement.
 */
export const PASS_THRESHOLD = 80;

/**
 * Maximum number of review+improve cycles before accepting the best result.
 * Two cycles (1 review → 1 improve → 1 final review) give a strong quality
 * signal while keeping the worst-case call count to 5 (plan + draft + 2 reviews + 1 improve).
 */
export const MAX_REVIEW_CYCLES = 2;

export function getRubricLabel(score: number): string {
  for (const band of RUBRIC) {
    if (score >= band.min && score < band.max) return band.label;
  }
  return RUBRIC[RUBRIC.length - 1].label;
}
