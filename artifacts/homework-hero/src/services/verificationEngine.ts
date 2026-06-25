/**
 * Solution Verification Engine
 *
 * Verifies every AI-generated answer across four dimensions:
 *  1. OCR Alignment      — does the detected question match the raw OCR text?
 *  2. Topic Consistency  — does the solution topic align with the detected topic?
 *  3. Answer Coherence   — does the final answer share substance with the steps?
 *  4. Reasoning Chain    — are the steps structurally sound and sequential?
 *
 * Returns a VerificationResult with:
 *  - A 0–100 composite score
 *  - A per-dimension breakdown
 *  - An array of flagged inconsistencies (empty = clean)
 *  - A status: "verified" (≥75) | "needs_review" (<75)
 *
 * The composite score is fed back into the Confidence Engine so it factors
 * into the displayed confidence meter.
 */

import type { AIResponse } from "@/data/solutionBank";

// ─── Public types ─────────────────────────────────────────────────────────────

export interface VerificationBreakdown {
  /** 0–100 — OCR text ↔ detected question alignment */
  ocrAlignment:      number;
  /** 0–100 — solution topic ↔ topic-matcher output consistency */
  topicConsistency:  number;
  /** 0–100 — final answer shares substance with the step content */
  answerCoherence:   number;
  /** 0–100 — steps are sequential, non-empty, and internally consistent */
  reasoningChain:    number;
}

export interface VerificationFlag {
  /** Short code identifying the inconsistency category */
  code:    string;
  /** Human-readable description shown to the student */
  message: string;
  /** How serious this flag is */
  severity: "warn" | "error";
}

export interface VerificationResult {
  /** 0–100 composite verification score */
  score:      number;
  /** Per-dimension breakdown */
  breakdown:  VerificationBreakdown;
  /** List of detected inconsistencies — empty means clean */
  flags:      VerificationFlag[];
  /** "verified" ≥75, "needs_review" <75 */
  status:     "verified" | "needs_review";
  /** ISO timestamp — when this verification was computed */
  verifiedAt: string;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function wordSet(text: string): Set<string> {
  const STOP_WORDS = new Set([
    "the","a","an","is","are","was","were","be","been","being",
    "have","has","had","do","does","did","will","would","could",
    "should","may","might","can","this","that","these","those",
    "it","its","in","on","at","to","for","of","and","or","but",
    "not","with","from","by","as","into","than","so","if","then",
  ]);
  const tokens: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return new Set(tokens.filter((w) => w.length > 2 && !STOP_WORDS.has(w)));
}

function jaccard(a: string, b: string): number {
  const sa = wordSet(a);
  const sb = wordSet(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  if (sa.size === 0 || sb.size === 0) return 0;
  let intersection = 0;
  for (const w of sa) if (sb.has(w)) intersection++;
  const union = sa.size + sb.size - intersection;
  return union === 0 ? 1 : intersection / union;
}

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.round(Math.min(hi, Math.max(lo, n)));
}

// ─── 1. OCR Alignment ─────────────────────────────────────────────────────────

/**
 * Compares the raw OCR text (before cleaning) with the detectedQuestion
 * that was actually used for solving. High similarity → both represent the
 * same question, no data was lost or corrupted in processing.
 *
 * For typed questions (no OCR), we default to 92 (typed input is exact).
 */
function scoreOcrAlignment(
  ocrRawText:        string | undefined,
  detectedQuestion:  string,
  ocrConfidence:     number   // 0–1 from Tesseract, 1.0 for typed
): { score: number; flags: VerificationFlag[] } {
  const flags: VerificationFlag[] = [];

  // No OCR involved — question was typed directly
  if (!ocrRawText || ocrRawText.trim() === detectedQuestion.trim()) {
    return { score: 92, flags };
  }

  const sim   = jaccard(ocrRawText, detectedQuestion);
  const score = clamp(sim * 100 + (ocrConfidence - 0.5) * 20);

  if (score < 40) {
    flags.push({
      code:     "ocr_mismatch",
      message:  "Scanned text and processed question differ significantly — OCR may have misread characters.",
      severity: "warn",
    });
  }
  if (ocrConfidence < 0.5) {
    flags.push({
      code:     "low_ocr_confidence",
      message:  "Scan quality is low. Re-photographing the question may improve accuracy.",
      severity: "warn",
    });
  }

  return { score, flags };
}

// ─── 2. Topic Consistency ─────────────────────────────────────────────────────

/**
 * Checks whether the topic the solution claims matches what was independently
 * detected from the question text. Mismatches suggest the solver answered a
 * different concept than the one in the question.
 */
function scoreTopicConsistency(
  solutionTopic:  string,
  detectedTopic:  string | undefined,
  topicConf:      number  // 0–1 from topicMatcher
): { score: number; flags: VerificationFlag[] } {
  const flags: VerificationFlag[] = [];

  if (!detectedTopic) {
    // No topic could be detected — penalise slightly
    const score = clamp(50 + topicConf * 30);
    if (topicConf < 0.3) {
      flags.push({
        code:     "topic_undetected",
        message:  "Could not confirm the topic from the question text. Verify the solution matches your chapter.",
        severity: "warn",
      });
    }
    return { score, flags };
  }

  const sim   = jaccard(solutionTopic, detectedTopic);
  const score = clamp(sim * 80 + topicConf * 20);

  if (score < 35) {
    flags.push({
      code:     "topic_mismatch",
      message:  `Solution topic "${solutionTopic}" may not match the detected topic "${detectedTopic}".`,
      severity: "warn",
    });
  }

  return { score, flags };
}

// ─── 3. Answer Coherence ─────────────────────────────────────────────────────

/**
 * Checks that the final answer is substantive and shares key vocabulary with
 * the solution steps. An answer that shares no content words with the steps
 * suggests a disconnect in the solution logic.
 */
function scoreAnswerCoherence(
  finalAnswer: string,
  steps:       AIResponse["steps"],
  source:      AIResponse["source"]
): { score: number; flags: VerificationFlag[] } {
  const flags: VerificationFlag[] = [];

  if (!finalAnswer || finalAnswer.trim().length < 10) {
    flags.push({
      code:     "answer_missing",
      message:  "Final answer is too short or missing.",
      severity: "error",
    });
    return { score: 20, flags };
  }

  const GENERIC_ANSWER_PATTERNS = [
    /see steps above/i,
    /refer to steps/i,
    /solution generated/i,
    /check your textbook/i,
  ];
  const isGeneric = GENERIC_ANSWER_PATTERNS.some((p) => p.test(finalAnswer));

  if (isGeneric && source === "fallback") {
    // Expected for fallback — don't penalise heavily
    return { score: 60, flags };
  }

  const stepsText  = steps.map((s) => `${s.explanation} ${s.result ?? ""} ${s.formula ?? ""}`).join(" ");
  const sim        = jaccard(finalAnswer, stepsText);

  let score = clamp(40 + sim * 70);

  if (isGeneric) {
    score = Math.min(score, 55);
    flags.push({
      code:     "answer_generic",
      message:  "Final answer appears generic — ensure the solution addresses your specific question.",
      severity: "warn",
    });
  }

  if (sim < 0.05 && !isGeneric) {
    flags.push({
      code:     "answer_step_disconnect",
      message:  "Final answer shares little content with the solution steps — reasoning may be inconsistent.",
      severity: "warn",
    });
  }

  return { score, flags };
}

// ─── 4. Reasoning Chain ──────────────────────────────────────────────────────

/**
 * Validates the structural integrity of the step-by-step reasoning:
 *  - Steps are ordered sequentially (no gaps or jumps)
 *  - Each step has a non-empty title and explanation
 *  - There are at least 2 steps for non-trivial answers
 *  - Steps that include a formula actually contain formula text
 */
function scoreReasoningChain(
  steps:  AIResponse["steps"],
  source: AIResponse["source"]
): { score: number; flags: VerificationFlag[] } {
  const flags: VerificationFlag[] = [];

  if (!steps || steps.length === 0) {
    flags.push({
      code:     "no_steps",
      message:  "No solution steps were generated.",
      severity: "error",
    });
    return { score: 10, flags };
  }

  let deductions = 0;

  // Check minimum step count
  if (steps.length < 2 && source !== "bank") {
    flags.push({
      code:     "too_few_steps",
      message:  "Solution has fewer than 2 steps — may be incomplete.",
      severity: "warn",
    });
    deductions += 15;
  }

  // Check sequential ordering
  for (let i = 0; i < steps.length; i++) {
    const expected = i + 1;
    if (steps[i].stepNumber !== expected) {
      flags.push({
        code:     "step_sequence_error",
        message:  `Step numbering is inconsistent at position ${i + 1} (expected ${expected}, got ${steps[i].stepNumber}).`,
        severity: "warn",
      });
      deductions += 10;
      break; // one flag is enough
    }
  }

  // Check each step has title + explanation
  const emptySteps = steps.filter(
    (s) => !s.title?.trim() || !s.explanation?.trim()
  );
  if (emptySteps.length > 0) {
    flags.push({
      code:     "empty_step_content",
      message:  `${emptySteps.length} step(s) are missing a title or explanation.`,
      severity: emptySteps.length > 1 ? "error" : "warn",
    });
    deductions += emptySteps.length * 12;
  }

  // Check steps with formulas have non-trivial formula text
  const badFormulas = steps.filter(
    (s) => s.formula !== undefined && s.formula.trim().length < 3
  );
  if (badFormulas.length > 0) {
    flags.push({
      code:     "formula_empty",
      message:  `${badFormulas.length} step(s) claim a formula but contain no formula text.`,
      severity: "warn",
    });
    deductions += badFormulas.length * 8;
  }

  const score = clamp(100 - deductions);
  return { score, flags };
}

// ─── Composite ────────────────────────────────────────────────────────────────

const WEIGHTS = {
  ocrAlignment:     0.20,
  topicConsistency: 0.25,
  answerCoherence:  0.30,
  reasoningChain:   0.25,
};

// ─── Public API ───────────────────────────────────────────────────────────────

export interface VerifyInput {
  /** The AIResponse to verify */
  solution:      AIResponse;
  /** Raw OCR text before cleaning (undefined for typed questions) */
  ocrRawText?:   string;
  /** Best topic detected from the raw question text */
  detectedTopic?: string;
  /** Tesseract confidence 0–1 (1.0 for typed) */
  ocrConfidence?: number;
}

/**
 * Run all four verification checks and return a consolidated VerificationResult.
 * This is called in `aiSolver.ts` after the solution is obtained, before
 * returning to the UI.
 */
export function verifySolution(input: VerifyInput): VerificationResult {
  const { solution, ocrRawText, detectedTopic, ocrConfidence = 1.0 } = input;

  const { score: ocrScore,    flags: ocrFlags    } = scoreOcrAlignment(
    ocrRawText,
    solution.detectedQuestion,
    ocrConfidence
  );
  const { score: topicScore,  flags: topicFlags  } = scoreTopicConsistency(
    solution.topic,
    detectedTopic,
    ocrConfidence   // use ocrConfidence as a proxy when no topicConf is threaded separately
  );
  const { score: answerScore, flags: answerFlags } = scoreAnswerCoherence(
    solution.finalAnswer,
    solution.steps,
    solution.source
  );
  const { score: chainScore,  flags: chainFlags  } = scoreReasoningChain(
    solution.steps,
    solution.source
  );

  const composite = clamp(
    ocrScore    * WEIGHTS.ocrAlignment     +
    topicScore  * WEIGHTS.topicConsistency +
    answerScore * WEIGHTS.answerCoherence  +
    chainScore  * WEIGHTS.reasoningChain
  );

  const allFlags = [...ocrFlags, ...topicFlags, ...answerFlags, ...chainFlags];

  return {
    score: composite,
    breakdown: {
      ocrAlignment:     ocrScore,
      topicConsistency: topicScore,
      answerCoherence:  answerScore,
      reasoningChain:   chainScore,
    },
    flags:      allFlags,
    status:     composite >= 75 ? "verified" : "needs_review",
    verifiedAt: new Date().toISOString(),
  };
}
