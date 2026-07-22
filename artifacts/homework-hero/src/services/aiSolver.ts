/**
 * AI Solver — orchestrates the bank → OpenAI → fallback pipeline.
 *
 * Resolution order:
 *  1. Question bank keyword match (score > 0)  → source: "bank"    (instant)
 *  2. OpenAI Chat Completions (if key present)  → source: "openai"  (3–10 s)
 *  3. Question bank subject default             → source: "fallback"
 *
 * Each path computes a ConfidenceBreakdown and attaches it to the returned
 * AIResponse. ocrConfidence (0–1) threads the Tesseract signal from the
 * Scan page down to the breakdown calculator.
 *
 * Switching to a different LLM: replace `solveWithOpenAI` import only.
 */

import { matchSolutionWithScore, type AIResponse } from "@/data/solutionBank";
import { solveWithOpenAI, isOpenAIAvailable }      from "@/services/ai/openaiSolver";
import { detectBestTopic }                          from "@/services/ai/topicMatcher";
import { computeConfidenceBreakdown }               from "@/services/confidenceEngine";
import { verifySolution }                           from "@/services/verificationEngine";
import type { Subject } from "@/data/subjects";

export type { AIResponse, SolutionStep, SimilarQuestion } from "@/data/solutionBank";

// ─── Loading phases (used by LoadingSpinner dot count) ────────────────────────

const PHASES_BANK: string[] = [
  "Reading your question…",
  "Checking question bank…",
  "Building step-by-step solution…",
  "Generating similar problems…",
  "Finalising answer…",
];

const PHASES_AI: string[] = [
  "Reading your question…",
  "Checking question bank…",
  "AI is working on your lesson…",
  "Building step-by-step solution…",
  "Finalising lesson…",
];

export function getLoadingPhases(): string[] {
  return PHASES_BANK;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * @param ocrConfidence  Tesseract confidence 0–1 (default 1.0 = typed question).
 *                       Passed through to the confidence engine.
 * @param opts.skipBank      When true, skip Path A (bank match) and go straight to OpenAI.
 *                           Used by Practice mode to force the full AI teaching pipeline.
 * @param opts.requireLesson When true, throw if the AI pipeline fails or returns no lesson.
 *                           Disables all silent fallbacks. Failures become visible errors.
 */
export async function solve(
  subject:       Subject,
  question:      string,
  ocrConfidence  = 1.0,
  onPhase?:      (msg: string, index: number) => void,
  opts?:         { skipBank?: boolean; requireLesson?: boolean },
  onDetail?:     (message: string, percent: number) => void,
): Promise<AIResponse> {

  // Phase 0 — reading
  onPhase?.(PHASES_BANK[0], 0);
  await delay(280);

  // Phase 1 — check bank
  onPhase?.(PHASES_BANK[1], 1);
  await delay(280);

  const { response: bankResp, score: bankScore } = matchSolutionWithScore(subject, question);
  const detectedQ  = question.trim() || bankResp.detectedQuestion;

  // Compute topic confidence once — used by all confidence paths
  const topicMatch = detectBestTopic(question, subject);
  const topicConf  = topicMatch?.confidence ?? 0;

  const detectedTopicName = topicMatch?.topic;

  // ── Path A: strong bank match (skipped when skipBank=true) ───────────────
  if (!opts?.skipBank && bankScore > 0) {
    onPhase?.(PHASES_BANK[2], 2);
    await delay(500);
    onPhase?.(PHASES_BANK[3], 3);
    await delay(380);
    onPhase?.(PHASES_BANK[4], 4);
    await delay(240);

    const partial: AIResponse = {
      ...bankResp,
      detectedQuestion: detectedQ,
      source:           "bank",
    };

    const verificationResult = verifySolution({
      solution:      partial,
      detectedTopic: detectedTopicName,
      ocrConfidence,
    });

    const confidenceBreakdown = computeConfidenceBreakdown({
      ocrConf:           ocrConfidence,
      topicConf,
      bankScore,
      aiConf:            1.0,
      source:            "bank",
      verificationScore: verificationResult.score,
    });

    return { ...partial, confidenceBreakdown, verificationResult };
  }

  // ── Path B: OpenAI ────────────────────────────────────────────────────────
  if (isOpenAIAvailable()) {
    onPhase?.(PHASES_AI[2], 2);

    try {
      const aiResp = await solveWithOpenAI(subject, question, onDetail);

      onPhase?.(PHASES_AI[3], 3);
      await delay(280);
      onPhase?.(PHASES_AI[4], 4);
      await delay(200);

      const verificationResult = verifySolution({
        solution:      aiResp,
        detectedTopic: detectedTopicName,
        ocrConfidence,
      });

      const confidenceBreakdown = computeConfidenceBreakdown({
        ocrConf:           ocrConfidence,
        topicConf,
        bankScore:         0,
        aiConf:            aiResp.confidence ?? 0.8,
        source:            "openai",
        verificationScore: verificationResult.score,
      });

      return { ...aiResp, confidenceBreakdown, verificationResult };

    } catch (err) {
      if (opts?.requireLesson) {
        // requireLesson=true means Practice mode: no silent fallback allowed.
        // The caller (Solution.tsx) will catch this and show an explicit error UI.
        console.error(`[PIPELINE:A4] PATH B FAILED — requireLesson=true → re-throwing, no fallback: "${String(err)}"`);
        throw err;
      }
      console.warn(`[PIPELINE:A4] PATH B FAILED — error="${String(err)}" → falling through to Path C (fallback)`);
      // OpenAI failed — fall through to fallback
    }
  }

  // ── Path C: fallback (no key / OpenAI error / bank default) ──────────────
  // When requireLesson=true, Path C is forbidden — the pipeline must either
  // return a real TeachingLesson or throw a visible error.
  if (opts?.requireLesson) {
    const reason = isOpenAIAvailable() ? "backend_unavailable_or_no_key" : "openai_not_configured";
    console.error(`[PIPELINE:A3] PATH C BLOCKED — requireLesson=true, reason="${reason}" → throwing to caller`);
    throw new Error(`teaching_pipeline_unavailable — ${reason}`);
  }
  onPhase?.(PHASES_BANK[2], 2);
  await delay(480);
  onPhase?.(PHASES_BANK[3], 3);
  await delay(360);
  onPhase?.(PHASES_BANK[4], 4);
  await delay(220);

  const fallbackPartial: AIResponse = {
    ...bankResp,
    detectedQuestion: detectedQ,
    source:           "fallback",
  };

  const verificationResult = verifySolution({
    solution:      fallbackPartial,
    detectedTopic: detectedTopicName,
    ocrConfidence,
  });

  const confidenceBreakdown = computeConfidenceBreakdown({
    ocrConf:           ocrConfidence,
    topicConf,
    bankScore:         0,
    aiConf:            0.5,
    source:            "fallback",
    verificationScore: verificationResult.score,
  });

  return { ...fallbackPartial, confidenceBreakdown, verificationResult };
}
