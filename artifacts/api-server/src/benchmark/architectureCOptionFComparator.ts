/**
 * Same-primary Option-F comparator for the Prompt 044 M6 fast-pass result.
 * Reuses the retained M6 primary and performs no lesson generation.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { addUsage, type UsageSnapshot } from "../lib/aiCost";
import { parseLessonResponse } from "../lib/lessonTypes";
import { runQualityPipeline } from "../services/teachingQuality";

interface RetainedCase {
  questionId: string;
  rawOutput: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

function parseRaw(rawOutput: string): unknown {
  const trimmed = rawOutput.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  return JSON.parse(fenced ? fenced[1].trim() : trimmed);
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required.");

  const retained = JSON.parse(
    readFileSync(resolve("benchmark_results_detailed.json"), "utf8"),
  ) as { raw: { baseline: RetainedCase[] } };
  const primary = retained.raw.baseline.find(item => item.questionId === "M6");
  if (!primary) throw new Error("Retained M6 case not found.");

  const primaryUsage: UsageSnapshot = {
    model: "gpt-4o-mini",
    promptTokens: primary.promptTokens,
    completionTokens: primary.completionTokens,
    cachedTokens: primary.cachedTokens,
    totalTokens: primary.totalTokens,
    estimatedCostUsd: primary.estimatedCostUsd,
  };

  const startedAt = Date.now();
  const quality = await runQualityPipeline(
    parseLessonResponse(parseRaw(primary.rawOutput)),
    apiKey,
  );
  const qualityLatencyMs = Date.now() - startedAt;
  const output = {
    retainedOnly: true,
    primaryGenerationCallsDuringMeasurement: 0,
    questionId: "M6",
    architecturePath: "option_f",
    totalLatencyMs: primary.latencyMs + qualityLatencyMs,
    aiCalls: 1 + quality.reviewerCalls + quality.improverCalls,
    usage: addUsage(primaryUsage, quality.usageTotal),
    quality: {
      latencyMs: qualityLatencyMs,
      reviewerCalls: quality.reviewerCalls,
      improverCalls: quality.improverCalls,
      cyclesRun: quality.cyclesRun,
      passed: quality.passed,
      reviewLatencies: quality.callLatencies.review,
      improveLatencies: quality.callLatencies.improve,
      usage: quality.usageTotal,
    },
  };

  writeFileSync(
    resolve("architecture_c_option_f_comparator.json"),
    JSON.stringify(output, null, 2),
  );
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});