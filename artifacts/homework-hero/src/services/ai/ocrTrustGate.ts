/**
 * OCR Trust Gate — pure deterministic classifier (Prompt #032, Strategy B).
 *
 * Takes the raw Tesseract output and applies lightweight coherence checks to
 * decide whether the result is safe to route directly to the solver, needs
 * student review, or must be blocked entirely.
 *
 * This file is Scan-OCR-specific. It does NOT touch Practice, the question
 * bank, canonical metadata, pre-generated lessons, or any other system.
 *
 * No AI calls are made here. All checks are O(n) string operations.
 */

// ─── Output type ─────────────────────────────────────────────────────────────

export type OcrTrustState =
  | "OCR_HIGH_CONFIDENCE"   // readable; solver allowed immediately
  | "OCR_NEEDS_REVIEW"      // uncertain; student must confirm before solving
  | "OCR_FAILED";           // garbage / blank; solver must not be called

export interface OcrTrustResult {
  state:      OcrTrustState;
  /** Tesseract word-level confidence passed in, 0–1 */
  rawConf:    number;
  /** Proportion of alphanumeric characters in the cleaned text (0–1) */
  alphaRatio: number;
  /** Number of distinct whitespace-separated tokens */
  wordCount:  number;
  /** Reason string for debugging / logging (never shown to the student) */
  reason:     string;
}

// ─── Thresholds ───────────────────────────────────────────────────────────────
//
// Derived from analysis of the founder's failure case and representative
// printed-text samples. Adjusting these is the only tuning needed for beta.
//
// Founder failure: "RISER Ad ~~ — | - 26 = e ~ospig y ) Ti os RIES ce ger"
//   alphaRatio ≈ 0.32, wordCount = 14, rawConf ≈ 0.25, noiseRatio ≈ 0.40
//   → OCR_FAILED (caught by alpha ratio + noise ratio)
//
// Handwritten "In which quadrant is x < 0 and y > 0?" (well-captured):
//   alphaRatio ≈ 0.78, wordCount ≈ 10, rawConf ≈ 0.55
//   → OCR_NEEDS_REVIEW (rawConf below HIGH threshold; student can confirm)
//
// Printed textbook question (clear):
//   alphaRatio ≈ 0.85, wordCount ≥ 5, rawConf ≈ 0.80
//   → OCR_HIGH_CONFIDENCE

const MIN_CHARS       = 8;    // absolute minimum meaningful characters
const MIN_WORDS       = 3;    // at least 3 whitespace tokens
const MIN_ALPHA_RATIO = 0.42; // below this → FAILED (too many noise chars)
const MAX_NOISE_RATIO = 0.30; // above this → FAILED (too many symbols/punct)
const HIGH_CONF_TESSERACT  = 0.60; // Tesseract threshold for HIGH_CONFIDENCE
const LOW_CONF_TESSERACT   = 0.20; // below this → always FAILED regardless
// Combined gate: very low Tesseract confidence AND mixed-quality alpha
// catches the founder failure case (rawConf=0.25, alphaRatio≈0.55)
const LOW_CONF_COMBINED    = 0.30;
const LOW_CONF_ALPHA_CEIL  = 0.65;

// Characters that Tesseract produces on garbage images (noise symbols)
const NOISE_CHARS = /[~|\\^`<>{}[\]@#$%*+=_]+/g;

// ─── Main classifier ─────────────────────────────────────────────────────────

/**
 * Classify OCR output into a trust state.
 *
 * @param text      Cleaned OCR text (after cleanOcrText).
 * @param rawConf   Tesseract word-level confidence mapped to 0–1.
 */
export function classifyOcrOutput(text: string, rawConf: number): OcrTrustResult {
  const trimmed = text.trim();

  // ── 1. Blank / too short ──────────────────────────────────────────────────
  if (trimmed.length < MIN_CHARS) {
    return result("OCR_FAILED", rawConf, 0, 0, "text too short");
  }

  // ── 2. Tesseract confidence floor ─────────────────────────────────────────
  if (rawConf < LOW_CONF_TESSERACT) {
    return result("OCR_FAILED", rawConf, alphaRatio(trimmed), wordCount(trimmed),
      `tesseract confidence ${(rawConf * 100).toFixed(0)}% below floor`);
  }

  // ── 3. Compute ratios ─────────────────────────────────────────────────────
  const alpha = alphaRatio(trimmed);
  const noise = noiseRatio(trimmed);
  const words = wordCount(trimmed);

  // ── 4a. Combined low-conf + mixed-alpha gate ───────────────────────────────
  // Catches cases like the founder failure: rawConf≈0.25, alpha≈0.55.
  // A very low Tesseract confidence combined with mixed-quality alpha ratio
  // (not cleanly alphabetic) reliably indicates garbage handwriting output
  // even when individual thresholds are not individually breached.
  if (rawConf < LOW_CONF_COMBINED && alpha < LOW_CONF_ALPHA_CEIL) {
    return result("OCR_FAILED", rawConf, alpha, words,
      `combined gate: conf ${(rawConf * 100).toFixed(0)}% + alpha ${(alpha * 100).toFixed(0)}%`);
  }

  // ── 4. Noise / symbol ratio gate ──────────────────────────────────────────
  if (noise > MAX_NOISE_RATIO) {
    return result("OCR_FAILED", rawConf, alpha, words,
      `noise ratio ${(noise * 100).toFixed(0)}% exceeds limit`);
  }

  // ── 5. Alpha ratio gate ───────────────────────────────────────────────────
  if (alpha < MIN_ALPHA_RATIO) {
    return result("OCR_FAILED", rawConf, alpha, words,
      `alpha ratio ${(alpha * 100).toFixed(0)}% below minimum`);
  }

  // ── 6. Word count gate ────────────────────────────────────────────────────
  if (words < MIN_WORDS) {
    return result("OCR_NEEDS_REVIEW", rawConf, alpha, words, "too few words for certainty");
  }

  // ── 7. High confidence path ───────────────────────────────────────────────
  if (rawConf >= HIGH_CONF_TESSERACT) {
    return result("OCR_HIGH_CONFIDENCE", rawConf, alpha, words, "all checks passed");
  }

  // ── 8. Marginal confidence → needs review ─────────────────────────────────
  return result("OCR_NEEDS_REVIEW", rawConf, alpha, words,
    `tesseract confidence ${(rawConf * 100).toFixed(0)}% — requires confirmation`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function result(
  state:      OcrTrustState,
  rawConf:    number,
  alphaR:     number,
  words:      number,
  reason:     string,
): OcrTrustResult {
  return { state, rawConf, alphaRatio: alphaR, wordCount: words, reason };
}

/** Fraction of characters that are letters or digits (0–1). */
function alphaRatio(text: string): number {
  if (!text.length) return 0;
  const alphanumeric = (text.match(/[a-zA-Z0-9]/g) ?? []).length;
  return alphanumeric / text.length;
}

/**
 * Fraction of characters that are high-noise punctuation / symbol runs (0–1).
 * We count each NOISE_CHARS character, not each run, to be conservative.
 */
function noiseRatio(text: string): number {
  if (!text.length) return 0;
  const rawMatches = text.match(NOISE_CHARS);
  const noiseChars = rawMatches ? rawMatches.join("").length : 0;
  return noiseChars / text.length;
}

/** Number of distinct whitespace-separated tokens. */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
