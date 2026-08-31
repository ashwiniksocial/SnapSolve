/**
 * Prompt 043 — retained-evidence validator contract retest.
 *
 * Makes zero primary-generation calls. It reuses retained M6, Easy, and C2
 * lessons and spends one semantic-validator call per structurally valid case.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { addUsage, zeroUsage, type UsageSnapshot } from "../lib/aiCost";
import { runArchitectureCShadow } from "../services/architectureCShadow";

const M6_QUESTION =
  "A coin is tossed 200 times. Heads appears 110 times. Find the experimental probability of (a) Heads and (b) Tails. Are these complementary events?";
const EASY_QUESTION = "Is √9 rational or irrational? Justify.";
const C2_QUESTION =
  "State three differences between evaporation and boiling. Why does evaporation cause cooling? Give a daily-life example.";

interface RetainedCase {
  questionId: string;
  rawOutput: string;
}

interface RetainedDetailed {
  generationMode: string;
  raw: { baseline?: RetainedCase[] };
}

interface Prompt042Result {
  easy?: { rawLesson?: unknown };
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

function reportUsage(
  report: Awaited<ReturnType<typeof runArchitectureCShadow>>,
): UsageSnapshot {
  return report.material.usage;
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required.");

  const retainedPath = resolve(process.argv[2] ?? "benchmark_results_detailed.json");
  const prompt042Path = resolve(process.argv[3] ?? "architecture_c_targeted_results.json");
  const outputPath = resolve(process.argv[4] ?? "architecture_c_contract_results.json");

  const retained = JSON.parse(readFileSync(retainedPath, "utf8")) as RetainedDetailed;
  const prompt042 = JSON.parse(readFileSync(prompt042Path, "utf8")) as Prompt042Result;
  if (retained.generationMode !== "detailed") throw new Error("Expected retained Detailed evidence.");

  const findRetained = (id: string): unknown => {
    const retainedCase = retained.raw.baseline?.find(item => item.questionId === id);
    if (!retainedCase) throw new Error(`Retained ${id} case not found.`);
    return parseRaw(retainedCase.rawOutput);
  };

  const m6Lesson = findRetained("M6");
  const easyLesson = prompt042.easy?.rawLesson;
  if (!easyLesson) throw new Error("Retained Easy lesson from Prompt 042 not found.");
  const c2Lesson = findRetained("C2");

  if (process.argv.includes("--c2-only")) {
    const c2 = await runArchitectureCShadow(c2Lesson, {
      subject: "Chemistry",
      question: C2_QUESTION,
      apiKey,
    });
    const c2OutputPath = resolve("architecture_c_contract_c2_retest.json");
    writeFileSync(c2OutputPath, JSON.stringify({
      retainedOnly: true,
      primaryGenerationCalls: 0,
      reason: "Corrected diagnostic question metadata for retained C2.",
      c2,
    }, null, 2));
    console.log(JSON.stringify({ c2, outputPath: c2OutputPath }, null, 2));
    return;
  }

  const m6 = await runArchitectureCShadow(m6Lesson, {
    subject: "Mathematics",
    question: M6_QUESTION,
    apiKey,
  });
  const negativeControl = await runArchitectureCShadow(corruptM6Transformation(m6Lesson), {
    subject: "Mathematics",
    question: M6_QUESTION,
    apiKey,
  });
  const easy = await runArchitectureCShadow(easyLesson, {
    subject: "Mathematics",
    question: EASY_QUESTION,
    apiKey,
  });
  const c2 = await runArchitectureCShadow(c2Lesson, {
    subject: "Chemistry",
    question: C2_QUESTION,
    apiKey,
  });

  const cases = { m6, negativeControl, easy, c2 };
  let usage = zeroUsage();
  for (const report of Object.values(cases)) {
    usage = addUsage(usage, reportUsage(report));
  }

  const output = {
    architecture: "C-shadow-contract-correction",
    generatedAt: new Date().toISOString(),
    retainedOnly: true,
    primaryGenerationCalls: 0,
    productionRoutingChanged: false,
    symbolicMathSubsystemCreated: false,
    sectionRepairPerformed: false,
    streamingAdded: false,
    cases,
    expectations: {
      m6: "MATERIAL_PASS",
      negativeControl: "MATERIAL_FAIL",
      easy: "MATERIAL_PASS",
      c2: "MATERIAL_PASS",
    },
    summary: {
      validatorCalls: Object.values(cases)
        .filter(report => report.material.usage.totalTokens > 0)
        .length,
      falsePasses:
        negativeControl.material.status === "MATERIAL_PASS" ? 1 : 0,
      falseFails: [
        m6.material.status !== "MATERIAL_PASS",
        easy.material.status !== "MATERIAL_PASS",
        c2.material.status !== "MATERIAL_PASS",
      ].filter(Boolean).length,
      allReadinessExpectationsMet:
        m6.structural.passed &&
        m6.material.status === "MATERIAL_PASS" &&
        negativeControl.structural.passed &&
        negativeControl.material.status === "MATERIAL_FAIL" &&
        easy.structural.passed &&
        easy.material.status === "MATERIAL_PASS" &&
        c2.structural.passed &&
        c2.material.status === "MATERIAL_PASS",
      usage,
    },
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});