/**
 * aiCost.ts — OpenAI token-usage capture and cost estimation for beta telemetry.
 *
 * Single source for:
 *   • UsageSnapshot  — the per-call token/cost record
 *   • extractUsage   — reads an OpenAI response body safely (all fields fail to 0)
 *   • estimateCostUsd — converts tokens → USD using per-model pricing
 *   • addUsage / zeroUsage — accumulation helpers for multi-call totals
 *
 * Pricing lives here and nowhere else.
 * Raw token counts are always stored so historical beta data remains valid
 * even when model pricing later changes.
 *
 * Source: https://openai.com/api/pricing (last updated 2025-08)
 */

// ─── Pricing table ─────────────────────────────────────────────────────────────
// USD per token — update here only.
const PRICING: Record<string, { input: number; cached: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15 / 1_000_000, cached: 0.075 / 1_000_000, output: 0.60  / 1_000_000 },
  "gpt-4o":      { input: 2.50 / 1_000_000, cached: 1.25  / 1_000_000, output: 10.00 / 1_000_000 },
};

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Token counts and estimated cost for one OpenAI call. */
export interface UsageSnapshot {
  /** Actual model string returned/used (e.g. "gpt-4o-mini"). */
  model:            string;
  /** Total prompt (input) tokens, including any cached portion. */
  promptTokens:     number;
  /** Output (completion) tokens. */
  completionTokens: number;
  /** Cached prompt tokens (subset of promptTokens). May be 0 if not exposed. */
  cachedTokens:     number;
  /** promptTokens + completionTokens. */
  totalTokens:      number;
  /** Estimated USD cost for this call, calculated from token counts and model pricing. */
  estimatedCostUsd: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Safely extract usage metadata from a raw OpenAI JSON response body.
 * Returns all-zero counts if any field is absent — never throws.
 * Pass the declared model name as fallback; prefers `body.model` if present.
 */
export function extractUsage(body: unknown, fallbackModel: string): UsageSnapshot {
  const b  = body as Record<string, unknown> | null | undefined;
  const model = (typeof b?.model === "string" && b.model.length > 0) ? b.model : fallbackModel;
  const u  = b?.usage as Record<string, unknown> | undefined;
  const promptTokens     = typeof u?.prompt_tokens     === "number" ? u.prompt_tokens     : 0;
  const completionTokens = typeof u?.completion_tokens === "number" ? u.completion_tokens : 0;
  const det              = u?.prompt_tokens_details as Record<string, unknown> | undefined;
  const cachedTokens     = typeof det?.cached_tokens === "number" ? det.cached_tokens : 0;
  const totalTokens      = promptTokens + completionTokens;
  const estimatedCostUsd = estimateCostUsd(model, promptTokens, completionTokens, cachedTokens);
  return { model, promptTokens, completionTokens, cachedTokens, totalTokens, estimatedCostUsd };
}

/** Convert token counts to estimated USD. Uses model-specific pricing; falls back to gpt-4o-mini rates. */
export function estimateCostUsd(
  model:            string,
  promptTokens:     number,
  completionTokens: number,
  cachedTokens:     number,
): number {
  const p            = PRICING[model] ?? PRICING["gpt-4o-mini"];
  const nonCached    = Math.max(0, promptTokens - cachedTokens);
  return (
    nonCached        * p.input  +
    cachedTokens     * p.cached +
    completionTokens * p.output
  );
}

/** Zero-value snapshot for accumulator initialisation or calls that did not happen. */
export function zeroUsage(model = "gpt-4o-mini"): UsageSnapshot {
  return { model, promptTokens: 0, completionTokens: 0, cachedTokens: 0, totalTokens: 0, estimatedCostUsd: 0 };
}

/** Add two snapshots. The second snapshot's model name is recorded on the aggregate. */
export function addUsage(a: UsageSnapshot, b: UsageSnapshot): UsageSnapshot {
  const promptTokens     = a.promptTokens     + b.promptTokens;
  const completionTokens = a.completionTokens + b.completionTokens;
  const cachedTokens     = a.cachedTokens     + b.cachedTokens;
  const totalTokens      = promptTokens       + completionTokens;
  const estimatedCostUsd = a.estimatedCostUsd + b.estimatedCostUsd;
  return { model: b.model || a.model, promptTokens, completionTokens, cachedTokens, totalTokens, estimatedCostUsd };
}
