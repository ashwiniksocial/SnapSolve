/**
 * Prompt 044 — retained-evidence measurement for the controlled fail-safe A/B.
 *
 * No primary lesson is generated. M6 measures the fast-pass path. C2 measures
 * the fail-safe path by feeding the same retained primary lesson into the
 * existing Option-F quality pipeline after Architecture C rejects it.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { addUsage } from "../lib/aiCost";
import { runArchitectureCShadow } from "../services/architectureCShadow";
import { runQualityPipeline } from "../services/teachingQuality";

const QUESTIONS = {
  M6: "A coin is tossed 200 times. Heads appears 110 times. Find the experimental probability of (a) Heads and (b) Tails. Are these complementary events?",
  C2: "State three differences between evaporation and boiling. Why does evaporation cause cooling? Give a daily-life example.",
} as const;

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

interface RetainedDetailed {
  generationMode: string;
  raw: { baseline?: RetainedCase[] };
}

function parseRaw(rawOutput: string): unknown {
  const trimmed = rawOutput.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  return JSON.parse(fenced ? fenced[1].trim() : trimmed);
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required.");

  const retainedPath = resolve(process.argv[2] ?? "benchmark_results_detailed.json");
  const outputPath = resolve(process.argv[3] ?? "architecture_c_failsafe_measurement.json");
  const retained = JSON.parse(readFileSync(retainedPath, "utf8")) as RetainedDetailed;
  if (retained.generationMode !== "detailed") throw new Error("Expected Detailed retained evidence.");

  const getCase = (id: keyof typeof QUESTIONS): RetainedCase => {
    const found = retained.raw.baseline?.find(item => item.questionId === id);
    if (!found) throw new Error(`Retained ${id} case not found.`);
    return found;
  };

  const m6Primary = getCase("M6");
  const c2Primary = getCase("C2");

  const m6Shadow = await runArchitectureCShadow(parseRaw(m6Primary.rawOutput), {
    subject: "Mathematics",
    question: QUESTIONS.M6,
    apiKey,
  });
  if (!m6Shadow.structural.passed || m6Shadow.material.status !== "MATERIAL_PASS") {
    throw new Error(`M6 did not produce the expected fast pass: ${m6Shadow.material.status}`);
  }

  const c2Shadow = await runArchitectureCShadow(parseRaw(c2Primary.rawOutput), {
    subject: "Chemistry",
    question: QUESTIONS.C2,
    apiKey,
  });
  if (!c2Shadow.structural.passed || c2Shadow.material.status !== "MATERIAL_FAIL") {
    throw new Error(`C2 did not produce the expected fail-safe fallback: ${c2Shadow.material.status}`);
  }

  const qualityStartedAt = Date.now();
  const c2Quality = await runQualityPipeline(
    c2Shadow.structural.normalizedLesson,
    apiKey,
  );
  const qualityLatencyMs = Date.now() - qualityStartedAt;

  const m6Usage = addUsage({
    model: "gpt-4o-mini",
    promptTokens: m6Primary.promptTokens,
    completionTokens: m6Primary.completionTokens,
    cachedTokens: m6Primary.cachedTokens,
    totalTokens: m6Primary.totalTokens,
    estimatedCostUsd: m6Primary.estimatedCostUsd,
  }, m6Shadow.material.usage);
  const c2PreQualityUsage = addUsage({
    model: "gpt-4o-mini",
    promptTokens: c2Primary.promptTokens,
    completionTokens: c2Primary.completionTokens,
    cachedTokens: c2Primary.cachedTokens,
    totalTokens: c2Primary.totalTokens,
    estimatedCostUsd: c2Primary.estimatedCostUsd,
  }, c2Shadow.material.usage);
  const c2Usage = addUsage(c2PreQualityUsage, c2Quality.usageTotal);

  const output = {
    retainedOnly: true,
    primaryGenerationCallsDuringMeasurement: 0,
    fastPass: {
      questionId: "M6",
      architecturePath: "architecture_c_fast_pass",
      totalLatencyMs: m6Primary.latencyMs + m6Shadow.totalLatencyMs,
      aiCalls: 2,
      usage: m6Usage,
      validator: {
        structuralLatencyMs: m6Shadow.structural.latencyMs,
        semanticLatencyMs: m6Shadow.material.latencyMs,
      },
      reviewerCalls: 0,
      improverCalls: 0,
    },
    fallback: {
      questionId: "C2",
      architecturePath: "architecture_c_fallback",
      totalLatencyMs: c2Primary.latencyMs + c2Shadow.totalLatencyMs + qualityLatencyMs,
      aiCalls: 2 + c2Quality.reviewerCalls + c2Quality.improverCalls,
      usage: c2Usage,
      validator: {
        structuralLatencyMs: c2Shadow.structural.latencyMs,
        semanticLatencyMs: c2Shadow.material.latencyMs,
      },
      quality: {
        latencyMs: qualityLatencyMs,
        reviewerCalls: c2Quality.reviewerCalls,
        improverCalls: c2Quality.improverCalls,
        cyclesRun: c2Quality.cyclesRun,
        passed: c2Quality.passed,
        reviewLatencies: c2Quality.callLatencies.review,
        improveLatencies: c2Quality.callLatencies.improve,
        usage: c2Quality.usageTotal,
      },
    },
    optionFComparableBaseline: {
      questionId: "C2",
      note: "Same retained primary plus the same measured Option-F quality pipeline, excluding only the Architecture C validator overhead.",
      totalLatencyMs: c2Primary.latencyMs + qualityLatencyMs,
      aiCalls: 1 + c2Quality.reviewerCalls + c2Quality.improverCalls,
      usage: addUsage({
        model: "gpt-4o-mini",
        promptTokens: c2Primary.promptTokens,
        completionTokens: c2Primary.completionTokens,
        cachedTokens: c2Primary.cachedTokens,
        totalTokens: c2Primary.totalTokens,
        estimatedCostUsd: c2Primary.estimatedCostUsd,
      }, c2Quality.usageTotal),
    },
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});