/**
 * Prompt 042 — targeted Architecture C validation.
 *
 * Exactly four new AI calls at most:
 *   1. retained M6 material validation
 *   2. corrupted M6 negative-control material validation
 *   3. one Easy Detailed primary generation
 *   4. Easy material validation (only after structural pass)
 *
 * C2 is reused from the prior retained result. No production route, reviewer,
 * improver, repair, or streaming path is called.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { addUsage, zeroUsage, type UsageSnapshot } from "../lib/aiCost";
import { runArchitectureCShadow } from "../services/architectureCShadow";
import { generateDetailedBenchmarkDraft } from "./modelBenchmark";

const M6_QUESTION =
  "A coin is tossed 200 times. Heads appears 110 times. Find the experimental probability of (a) Heads and (b) Tails. Are these complementary events?";
const EASY_QUESTION = "Is √9 rational or irrational? Justify.";

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

function corruptM6Transformation(rawLesson: unknown): unknown {
  const corrupted = structuredClone(rawLesson) as {
    guidedReasoning?: Array<{ result?: unknown }>;
  };
  const target = corrupted.guidedReasoning?.find(step =>
    typeof step.result === "string" && step.result.includes("9 / 20")
  );
  if (!target) throw new Error("Could not find retained M6 simplification result.");
  target.result = "P(Tails) = 9 / 10";
  return corrupted;
}

function usageOf(report: Awaited<ReturnType<typeof runArchitectureCShadow>>): UsageSnapshot {
  return report.material.usage;
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required.");

  const retainedPath = resolve(process.argv[2] ?? "benchmark_results_detailed.json");
  const priorShadowPath = resolve(process.argv[3] ?? "architecture_c_shadow_results.json");
  const outputPath = resolve(process.argv[4] ?? "architecture_c_targeted_results.json");
  const retained = JSON.parse(readFileSync(retainedPath, "utf8")) as RetainedDetailed;
  if (retained.generationMode !== "detailed") throw new Error("Expected retained Detailed evidence.");

  const m6 = retained.raw.baseline?.find(item => item.questionId === "M6");
  if (!m6) throw new Error("Retained M6 case not found.");
  const retainedM6 = parseRaw(m6.rawOutput);

  const m6After = await runArchitectureCShadow(retainedM6, {
    subject: "Mathematics",
    question: M6_QUESTION,
    apiKey,
  });
  const negativeControl = await runArchitectureCShadow(corruptM6Transformation(retainedM6), {
    subject: "Mathematics",
    question: M6_QUESTION,
    apiKey,
  });

  // The only new primary generation authorized by Prompt 042.
  const easyDraft = await generateDetailedBenchmarkDraft(
    "Mathematics",
    EASY_QUESTION,
    apiKey,
  );
  const easyShadow = await runArchitectureCShadow(easyDraft.rawLesson, {
    subject: "Mathematics",
    question: EASY_QUESTION,
    apiKey,
  });

  let c2Status: string | undefined;
  try {
    const prior = JSON.parse(readFileSync(priorShadowPath, "utf8")) as {
      results?: Array<{
        questionId?: string;
        architectureC?: { material?: { status?: string } };
      }>;
    };
    c2Status = prior.results
      ?.find(result => result.questionId === "C2")
      ?.architectureC?.material?.status;
  } catch {
    c2Status = undefined;
  }

  let diagnosticUsage = zeroUsage();
  diagnosticUsage = addUsage(diagnosticUsage, usageOf(m6After));
  diagnosticUsage = addUsage(diagnosticUsage, usageOf(negativeControl));
  diagnosticUsage = addUsage(diagnosticUsage, easyDraft.usage);
  diagnosticUsage = addUsage(diagnosticUsage, usageOf(easyShadow));

  const output = {
    architecture: "C-shadow-targeted",
    generatedAt: new Date().toISOString(),
    productionRoutingChanged: false,
    symbolicMathSubsystemCreated: false,
    sectionRepairPerformed: false,
    streamingAdded: false,
    retained: {
      m6Primary: {
        reused: true,
        latencyMs: m6.latencyMs,
        promptTokens: m6.promptTokens,
        completionTokens: m6.completionTokens,
        cachedTokens: m6.cachedTokens,
        totalTokens: m6.totalTokens,
        costUsd: m6.estimatedCostUsd,
      },
      c2StatusReused: c2Status ?? "UNAVAILABLE",
    },
    m6: {
      before: {
        status: "MATERIAL_FAIL",
        falseFail: true,
        citedEvidence: "P(Tails) = 90 / 200",
      },
      after: m6After,
      manualExpectedDecision: "MATERIAL_PASS",
    },
    negativeControl: {
      mutation: {
        changedField: "guidedReasoning[*].result",
        before: "P(Tails) = 9 / 20",
        after: "P(Tails) = 9 / 10",
        allOtherFieldsUnchanged: true,
      },
      result: negativeControl,
      manualExpectedDecision: "MATERIAL_FAIL",
    },
    easy: {
      sourceQuestionId: "c9-m-ch1-t2-q02",
      subject: "Mathematics",
      difficulty: "Easy",
      question: EASY_QUESTION,
      knownAnswer: "Rational. √9 = 3 = 3/1.",
      primary: {
        latencyMs: easyDraft.latencyMs,
        usage: easyDraft.usage,
      },
      shadow: easyShadow,
      totalShadowLatencyMs:
        easyDraft.latencyMs + easyShadow.structural.latencyMs + easyShadow.material.latencyMs,
      rawLesson: easyDraft.rawLesson,
    },
    diagnosticTotals: {
      aiCalls: 1 + [m6After, negativeControl, easyShadow]
        .filter(report => report.material.usage.totalTokens > 0)
        .length,
      usage: diagnosticUsage,
      note: "One Easy Detailed primary generation plus validator calls only after structural pass. Retained M6/C2 generation and reviewer calls were not rerun.",
    },
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});