/**
 * Confidence Engine
 *
 * Computes a composite answer-confidence score (0–100) from four signals:
 *
 *  1. OCR quality    — Tesseract word-level confidence (1.0 = typed question)
 *  2. Topic match    — Pattern-based topic detection strength
 *  3. Bank match     — Keyword-score density from the question bank
 *  4. AI confidence  — Model-reported confidence (or 1.0 for bank solutions)
 *
 * Tiers:
 *   90–100 → High confidence  (green)
 *   70–89  → Medium confidence (amber)
 *   0–69   → Verify answer    (red)
 */

import type { ConfidenceBreakdown } from "@/data/solutionBank";

export type { ConfidenceBreakdown };

// Raw bank scores: weight=10, ~4 keywords match = good signal.
// Normalise so 4 matched keywords = 1.0; cap at 1.
const BANK_SCORE_SCALE = 40;

export interface ConfidenceInput {
  /** Raw Tesseract confidence / 100, or 1.0 for typed questions */
  ocrConf:   number;
  /** TopicMatch.confidence from topicMatcher (0–1) */
  topicConf: number;
  /** Raw score from matchSolutionWithScore (0 = no match) */
  bankScore: number;
  /** Model-reported confidence from AIResponse.confidence (0–1) */
  aiConf:    number;
  /** Which resolution path was taken */
  source:    "bank" | "openai" | "fallback";
}

/**
 * Compute a ConfidenceBreakdown from all four signals.
 * All output fields are 0–100 integers.
 */
export function computeConfidenceBreakdown(input: ConfidenceInput): ConfidenceBreakdown {
  const { ocrConf, topicConf, bankScore, aiConf, source } = input;

  // Normalise bank score: 4 matched keywords → 1.0
  const bankNorm = Math.min(bankScore / BANK_SCORE_SCALE, 1);

  // Source-adaptive base score
  let base: number;
  if (source === "bank") {
    // Answer comes directly from bank → bank match drives confidence
    base = 60 + 40 * bankNorm;
  } else if (source === "openai") {
    // AI solved it → model confidence is primary signal
    base = 55 + 40 * Math.min(aiConf, 1);
  } else {
    // Fallback → topic + bank signal guide quality
    base = 40 + 25 * topicConf + 15 * bankNorm;
  }

  // Topic bonus: strong topic detection adds up to +10
  const topicBonus = topicConf * 10;

  // OCR penalty: only for very poor scans (below 65% confidence)
  const ocrPenalty = Math.max(0, (0.65 - Math.min(ocrConf, 1)) * 30);

  return {
    ocr:       Math.round(Math.min(ocrConf, 1) * 100),
    topic:     Math.round(Math.min(topicConf, 1) * 100),
    bankMatch: Math.round(bankNorm * 100),
    ai:        Math.round(Math.min(aiConf, 1) * 100),
    composite: Math.round(Math.min(100, Math.max(0, base + topicBonus - ocrPenalty))),
  };
}

// ─── Tier display data ────────────────────────────────────────────────────────

export interface ConfidenceTier {
  label:       string;
  description: string;
  color:       string;  // text / stroke
  bg:          string;  // panel background
  border:      string;  // panel border
  ring:        string;  // SVG gauge track
  emoji:       string;
}

export function getConfidenceTier(composite: number): ConfidenceTier {
  if (composite >= 90) {
    return {
      label:       "High confidence",
      description: "Answer verified with high accuracy. Proceed with confidence.",
      color:  "#16a34a",
      bg:     "#f0fdf4",
      border: "#bbf7d0",
      ring:   "#86efac",
      emoji:  "✓",
    };
  }
  if (composite >= 70) {
    return {
      label:       "Medium confidence",
      description: "Answer is likely correct. Review your question if unsure.",
      color:  "#d97706",
      bg:     "#fffbeb",
      border: "#fde68a",
      ring:   "#fcd34d",
      emoji:  "◑",
    };
  }
  return {
    label:       "Verify answer",
    description: "Cross-check this answer in your textbook before trusting it.",
    color:  "#dc2626",
    bg:     "#fef2f2",
    border: "#fecaca",
    ring:   "#fca5a5",
    emoji:  "⚠",
  };
}
