/**
 * AI Solver — orchestrates the bank → OpenAI → fallback pipeline.
 *
 * Resolution order:
 *  1. Question bank keyword match (score > 0)  → source: "bank"   (instant)
 *  2. OpenAI Chat Completions (if key present)  → source: "openai" (3–10 s)
 *  3. Question bank subject default             → source: "fallback"
 *
 * Switching to a different LLM: replace `solveWithOpenAI` import only.
 * The AIResponse shape and all downstream UI stay unchanged.
 */

import { matchSolutionWithScore, type AIResponse } from "@/data/solutionBank";
import { solveWithOpenAI, isOpenAIAvailable }      from "@/services/ai/openaiSolver";
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
  "AI is solving your question…",
  "Building step-by-step solution…",
  "Finalising answer…",
];

export function getLoadingPhases(): string[] {
  // Always return 5 phases so the dot count is stable
  return PHASES_BANK;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Public API ───────────────────────────────────────────────────────────────

export async function solve(
  subject: Subject,
  question: string,
  _imageBase64?: string,
  onPhase?: (msg: string, index: number) => void
): Promise<AIResponse> {

  // Phase 0 — reading
  onPhase?.(PHASES_BANK[0], 0);
  await delay(280);

  // Phase 1 — check bank
  onPhase?.(PHASES_BANK[1], 1);
  await delay(280);

  const { response: bankResp, score } = matchSolutionWithScore(subject, question);
  const detectedQ = question.trim() || bankResp.detectedQuestion;

  // ── Path A: strong bank match ─────────────────────────────────────────────
  if (score > 0) {
    onPhase?.(PHASES_BANK[2], 2);
    await delay(500);
    onPhase?.(PHASES_BANK[3], 3);
    await delay(380);
    onPhase?.(PHASES_BANK[4], 4);
    await delay(240);

    return {
      ...bankResp,
      detectedQuestion: detectedQ,
      source:           "bank",
    };
  }

  // ── Path B: OpenAI ────────────────────────────────────────────────────────
  if (isOpenAIAvailable()) {
    onPhase?.(PHASES_AI[2], 2); // "AI is solving your question…"

    try {
      const aiResp = await solveWithOpenAI(subject, question);

      onPhase?.(PHASES_AI[3], 3);
      await delay(280);
      onPhase?.(PHASES_AI[4], 4);
      await delay(200);

      return aiResp;

    } catch {
      // OpenAI failed — drop through to fallback
    }
  }

  // ── Path C: fallback (no key / OpenAI error / bank default) ──────────────
  onPhase?.(PHASES_BANK[2], 2);
  await delay(480);
  onPhase?.(PHASES_BANK[3], 3);
  await delay(360);
  onPhase?.(PHASES_BANK[4], 4);
  await delay(220);

  return {
    ...bankResp,
    detectedQuestion: detectedQ,
    source:           "fallback",
  };
}
