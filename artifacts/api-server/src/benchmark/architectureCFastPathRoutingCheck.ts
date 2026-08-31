import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { zeroUsage } from "../lib/aiCost";
import {
  evaluateArchitectureCFastPath,
  isArchitectureCFastPathEnabled,
} from "../services/architectureCFastPath";
import type { ArchitectureCShadowReport } from "../services/architectureCShadow";

const normalizedLesson = {
  topic: "Fixture",
  guidedReasoning: [],
  finalAnswer: { answer: "Fixture answer" },
} as unknown as ArchitectureCShadowReport["structural"]["normalizedLesson"];

function report(input: {
  structural: boolean;
  material: "MATERIAL_PASS" | "MATERIAL_FAIL" | "VALIDATOR_ERROR";
}): ArchitectureCShadowReport {
  return {
    architecture: "C-shadow",
    structural: {
      passed: input.structural,
      issues: [],
      defaultedPaths: [],
      normalizedLesson,
      latencyMs: 0,
    },
    material: {
      status: input.structural ? input.material : "NOT_RUN",
      issues: [],
      optionalPolish: [],
      confidence: 1,
      usage: zeroUsage(),
      latencyMs: 0,
      ...(!input.structural ? { reason: "structural_gate_failed" } : {}),
    } as ArchitectureCShadowReport["material"],
    totalLatencyMs: 0,
    productionRoutingChanged: false,
  };
}

async function main(): Promise<void> {
  let validatorCalls = 0;
  const runner = async (): Promise<ArchitectureCShadowReport> => {
    validatorCalls += 1;
    return report({ structural: true, material: "MATERIAL_PASS" });
  };

  assert.equal(isArchitectureCFastPathEnabled({}), false, "flag must default off");
  assert.equal(isArchitectureCFastPathEnabled({
    ARCHITECTURE_C_FAST_PATH_ENABLED: "true",
  }), true);

  const off = await evaluateArchitectureCFastPath({
    enabled: false,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, runner);
  assert.equal(off.architecturePath, "option_f");
  assert.equal(validatorCalls, 0, "flag-off must not invoke validator");

  const noBudget = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
    validatorTimeoutMs: 0,
  }, runner);
  assert.equal(noBudget.architecturePath, "architecture_c_fallback");
  assert.equal(noBudget.fallbackReason, "insufficient_validation_budget");
  assert.equal(validatorCalls, 0, "no-budget fallback must not invoke validator");

  const pass = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, runner);
  assert.equal(pass.architecturePath, "architecture_c_fast_pass");
  assert.equal(pass.lesson, normalizedLesson);

  const materialFail = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, async () => report({ structural: true, material: "MATERIAL_FAIL" }));
  assert.equal(materialFail.architecturePath, "architecture_c_fallback");
  assert.equal(materialFail.fallbackReason, "material_fail");

  const structuralFail = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, async () => report({ structural: false, material: "MATERIAL_FAIL" }));
  assert.equal(structuralFail.architecturePath, "architecture_c_fallback");
  assert.equal(structuralFail.materialValidator, "SKIPPED");

  const validatorError = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, async () => report({ structural: true, material: "VALIDATOR_ERROR" }));
  assert.equal(validatorError.architecturePath, "architecture_c_fallback");
  assert.equal(validatorError.fallbackReason, "validator_error");

  const exception = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
  }, async (_raw, options) => {
    options?.onMaterialValidationStart?.();
    throw new Error("fixture validator failure");
  });
  assert.equal(exception.architecturePath, "architecture_c_fallback");
  assert.equal(exception.fallbackReason, "validator_exception");
  assert.equal(exception.validatorCalls, 1);

  const delayedStartedAt = Date.now();
  const delayed = await evaluateArchitectureCFastPath({
    enabled: true,
    eligible: true,
    rawLesson: {},
    subject: "Mathematics",
    question: "Fixture",
    apiKey: "fixture",
    validatorTimeoutMs: 10,
  }, async (_raw, options) => {
    options?.onMaterialValidationStart?.();
    await new Promise(resolve => setTimeout(resolve, 100));
    return report({ structural: true, material: "MATERIAL_PASS" });
  });
  const delayedElapsedMs = Date.now() - delayedStartedAt;
  assert.equal(delayed.architecturePath, "architecture_c_fallback");
  assert.equal(delayed.fallbackReason, "validator_exception");
  assert.equal(delayed.validatorCalls, 1);
  assert.ok(
    delayedElapsedMs < 80,
    `hard deadline must not await retry backoff (elapsed ${delayedElapsedMs} ms)`,
  );

  const routeSource = readFileSync(
    resolve("src/routes/solveQuestion.ts"),
    "utf8",
  );
  assert.equal(
    (routeSource.match(/const draftResult = await generateDraft\(/g) ?? []).length,
    1,
    "regular solve route must contain exactly one primary generation call",
  );
  assert.match(
    routeSource,
    /runQualityPipeline\(draft,/,
    "Option F fallback must receive the existing draft",
  );

  console.log(JSON.stringify({
    flagOff: "option_f",
    fastPass: "reviewer_unreachable",
    materialFail: "same_draft_option_f_fallback",
    structuralFail: "same_draft_option_f_fallback",
    validatorError: "same_draft_option_f_fallback",
    validatorException: "same_draft_option_f_fallback",
    primaryGenerationCallsInRegularRoute: 1,
  }, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});