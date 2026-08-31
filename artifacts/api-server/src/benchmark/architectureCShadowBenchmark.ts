/**
 * Architecture C shadow benchmark — retained Detailed evidence only.
 *
 * Run:
 *   cd artifacts/api-server
 *   pnpm exec tsx src/benchmark/architectureCShadowBenchmark.ts
 *
 * An optional first argument may point to a retained Detailed benchmark JSON.
 * This script never calls the production solve route and never runs the
 * existing reviewer again. It reuses the retained primary metrics/reviewer
 * evidence and spends one compact validator call per selected case.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  runArchitectureCShadow,
  type ArchitectureCShadowReport,
} from "../services/architectureCShadow";

interface RetainedCase {
  questionId: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  rawOutput: string;
  parsedOk: boolean;
  schemaValid: boolean;
  reviewPassed: boolean;
  reviewScores: Record<string, number>;
  reviewOverall: number;
  reviewIssueCount: number;
  reviewUsage: { prompt: number; completion: number; costUsd: number };
}

interface RetainedBenchmark {
  generationMode: string;
  raw: { baseline?: RetainedCase[] };
}

interface CaseMeta {
  subject: string;
  type: string;
  difficulty: string;
  question: string;
}

interface ManualAssessment {
  expectedDecision: "PASS" | "FAIL";
  rationale: string;
  materialDefects: string[];
  correctlyIgnoredEnhancements: string[];
}

const CASE_META: Record<string, CaseMeta> = {
  M4: {
    subject: "Mathematics",
    difficulty: "Hard",
    type: "Proof",
    question: "Prove that √2 is irrational. Use proof by contradiction and show every step.",
  },
  M6: {
    subject: "Mathematics",
    difficulty: "Medium",
    type: "Numerical",
    question: "A coin is tossed 200 times. Heads appears 110 times. Find (a) experimental probability of Heads and (b) Tails. Are these complementary events?",
  },
  C2: {
    subject: "Chemistry",
    difficulty: "Medium",
    type: "Conceptual",
    question: "State three differences between evaporation and boiling. Why does evaporation cause cooling? Give a daily-life example.",
  },
};

const SELECTED_IDS = ["M4", "M6", "C2"] as const;

const MANUAL_ASSESSMENTS: Record<string, ManualAssessment> = {
  M4: {
    expectedDecision: "FAIL",
    rationale: "The raw object is not a complete TeachingLesson: examinerThinking is absent, a guided step omits pause, and commonMistakes contains a malformed fourth item.",
    materialDefects: [
      "TeachingLesson completeness failure before semantic review.",
    ],
    correctlyIgnoredEnhancements: [],
  },
  M6: {
    expectedDecision: "PASS",
    rationale: "All probability calculations are correct. 90/200 is a correct intermediate fraction and the next step simplifies it to 9/20; the final probabilities sum to 1.",
    materialDefects: [],
    correctlyIgnoredEnhancements: [
      "The explanation of complementary events could be richer, but the central answer and reasoning are usable and correct.",
    ],
  },
  C2: {
    expectedDecision: "PASS",
    rationale: "The lesson correctly gives three differences, explains cooling through heat transfer to evaporation, and supplies sweat as the requested daily-life example.",
    materialDefects: [],
    correctlyIgnoredEnhancements: [
      "More examples, a comparison diagram, or a stronger recap are optional polish rather than safety defects.",
    ],
  },
};

function parseRawOutput(rawOutput: string): unknown {
  const trimmed = rawOutput.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  return JSON.parse(fenced ? fenced[1].trim() : trimmed);
}

function relation(
  shadowStatus: string,
  reviewerPassed: boolean,
): "agreement" | "shadow_pass_reviewer_fail" | "shadow_fail_reviewer_pass" | "both_failed" {
  if (shadowStatus === "MATERIAL_PASS" && reviewerPassed) return "agreement";
  if (shadowStatus === "MATERIAL_PASS" && !reviewerPassed) return "shadow_pass_reviewer_fail";
  if (shadowStatus === "MATERIAL_FAIL" && reviewerPassed) return "shadow_fail_reviewer_pass";
  return "both_failed";
}

function reportCase(
  retained: RetainedCase,
  meta: CaseMeta,
  shadow: ArchitectureCShadowReport,
) {
  const shadowStatus = shadow.material.status;
  const relativeRelation = relation(shadowStatus, retained.reviewPassed);
  const manualAssessment = MANUAL_ASSESSMENTS[retained.questionId];
  const shadowDecision = shadow.structural.passed
    ? shadowStatus === "MATERIAL_PASS"
      ? "PASS"
      : shadowStatus === "MATERIAL_FAIL"
        ? "FAIL"
        : "ERROR"
    : "FAIL";
  const falsePass = manualAssessment?.expectedDecision === "FAIL" && shadowDecision === "PASS";
  const falseFail = manualAssessment?.expectedDecision === "PASS" && shadowDecision === "FAIL";
  return {
    questionId: retained.questionId,
    subject: meta.subject,
    type: meta.type,
    difficulty: meta.difficulty,
    retainedEvidence: {
      source: "benchmark_results_detailed.json",
      primaryLatencyMs: retained.latencyMs,
      promptTokens: retained.promptTokens,
      completionTokens: retained.completionTokens,
      cachedTokens: retained.cachedTokens,
      totalTokens: retained.totalTokens,
      primaryCostUsd: retained.estimatedCostUsd,
      reviewer: {
        reused: true,
        passed: retained.reviewPassed,
        overall: retained.reviewOverall,
        issueCount: retained.reviewIssueCount,
        scores: retained.reviewScores,
        promptTokens: retained.reviewUsage.prompt,
        completionTokens: retained.reviewUsage.completion,
        costUsd: retained.reviewUsage.costUsd,
      },
    },
    architectureC: {
      safePathLatencyMs: shadow.structural.latencyMs + shadow.material.latencyMs,
      primaryPlusShadowLatencyMs:
        retained.latencyMs + shadow.structural.latencyMs + shadow.material.latencyMs,
      structural: {
        status: shadow.structural.passed ? "STRUCTURAL_PASS" : "STRUCTURAL_FAIL",
        latencyMs: shadow.structural.latencyMs,
        exactReasons: shadow.structural.issues,
        defaultedPaths: shadow.structural.defaultedPaths,
      },
      material: {
        status: shadowStatus,
        latencyMs: shadow.material.latencyMs,
        promptTokens: shadow.material.usage.promptTokens,
        completionTokens: shadow.material.usage.completionTokens,
        totalTokens: shadow.material.usage.totalTokens,
        costUsd: shadow.material.usage.estimatedCostUsd,
        issues: shadow.material.issues,
        optionalPolish: shadow.material.optionalPolish,
        confidence: shadow.material.confidence,
        error: "error" in shadow.material ? shadow.material.error : undefined,
      },
    },
    comparison: {
      reviewerEvidenceIsNotGroundTruth: true,
      relation: relativeRelation,
      manualAssessment,
      shadowDecision,
      falsePass,
      falseFail,
      interpretation:
        falsePass
          ? "Confirmed shadow false pass against the manual material-safety assessment."
          : falseFail
            ? "Confirmed shadow false fail against the manual material-safety assessment."
            : relativeRelation === "shadow_pass_reviewer_fail"
          ? "Reviewer rejected the lesson on broader teaching-quality criteria; this is not a confirmed shadow false pass."
          : relativeRelation === "shadow_fail_reviewer_pass"
            ? "Potential shadow false fail; requires human adjudication because reviewer pass does not prove material safety."
            : relativeRelation === "both_failed"
              ? "Both systems rejected or could not approve the case; inspect material issues separately."
              : "Both systems approved the case under their respective criteria.",
    },
  };
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for the semantic shadow benchmark.");
  }

  const inputPath = resolve(process.argv[2] ?? "benchmark_results_detailed.json");
  const outputPath = resolve(process.argv[3] ?? "architecture_c_shadow_results.json");
  const retained = JSON.parse(readFileSync(inputPath, "utf8")) as RetainedBenchmark;
  if (retained.generationMode !== "detailed") {
    throw new Error(`Expected a Detailed retained artifact; received ${retained.generationMode}.`);
  }

  const cases = SELECTED_IDS.map(id => retained.raw.baseline?.find(item => item.questionId === id))
    .filter((item): item is RetainedCase => Boolean(item));
  if (cases.length === 0) throw new Error("No selected retained Detailed cases were found.");

  const results = [];
  for (const retainedCase of cases.slice(0, 3)) {
    const meta = CASE_META[retainedCase.questionId];
    if (!meta) continue;
    const rawLesson = parseRawOutput(retainedCase.rawOutput);
    const shadow = await runArchitectureCShadow(rawLesson, {
      subject: meta.subject,
      question: meta.question,
      apiKey,
    });
    results.push(reportCase(retainedCase, meta, shadow));
  }

  const output = {
    architecture: "C-shadow",
    generatedAt: new Date().toISOString(),
    retainedSource: inputPath,
    retainedCaseLimit: 3,
    selectedCases: results.map(result => result.questionId),
    coverageNote: "The retained Detailed artifact contains no Easy case; selected coverage is Hard proof, Medium numerical, and Medium conceptual.",
    productionRoutingChanged: false,
    repairPerformed: false,
    reviewerRerun: false,
    falsePassFalseFailNote: "Relative mismatches are signals for adjudication, not ground truth. Existing reviewer evidence is broader than the material-safety contract.",
    results,
    summary: {
      casesRun: results.length,
      structuralPasses: results.filter(result => result.architectureC.structural.status === "STRUCTURAL_PASS").length,
      structuralFailures: results.filter(result => result.architectureC.structural.status === "STRUCTURAL_FAIL").length,
      materialPasses: results.filter(result => result.architectureC.material.status === "MATERIAL_PASS").length,
      materialFailures: results.filter(result => result.architectureC.material.status === "MATERIAL_FAIL").length,
      validatorErrors: results.filter(result => result.architectureC.material.status === "VALIDATOR_ERROR").length,
      falsePasses: results.filter(result => result.comparison.falsePass).length,
      falseFails: results.filter(result => result.comparison.falseFail).length,
      totalValidatorCostUsd: results.reduce((sum, result) => sum + result.architectureC.material.costUsd, 0),
      totalPrimaryCostUsd: results.reduce((sum, result) => sum + result.retainedEvidence.primaryCostUsd, 0),
      averageEligibleShadowLatencyMs: (() => {
        const eligible = results.filter(result => result.architectureC.material.status !== "NOT_RUN");
        return eligible.length
          ? Math.round(eligible.reduce((sum, result) => sum + result.architectureC.safePathLatencyMs, 0) / eligible.length)
          : 0;
      })(),
    },
  };

  writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
  console.log("\nARCHITECTURE C SHADOW VALIDATION COMPLETE — AWAITING FOUNDER DECISION");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});