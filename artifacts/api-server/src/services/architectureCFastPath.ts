import type { LessonResponse } from "../lib/lessonTypes";
import { zeroUsage, type UsageSnapshot } from "../lib/aiCost";
import {
  runArchitectureCShadow,
  type ArchitectureCShadowReport,
} from "./architectureCShadow";

export type ArchitecturePath =
  | "option_f"
  | "architecture_c_fast_pass"
  | "architecture_c_fallback";
export type GateTelemetryStatus = "PASS" | "FAIL" | "SKIPPED";

export interface ArchitectureCFastPathDecision {
  architecturePath: ArchitecturePath;
  structuralGate: GateTelemetryStatus;
  materialValidator: GateTelemetryStatus;
  validatorCalls: number;
  validatorLatencyMs: number;
  validatorUsage: UsageSnapshot;
  fallbackReason?: string;
  lesson?: LessonResponse;
}

type ShadowRunner = typeof runArchitectureCShadow;

export function isArchitectureCFastPathEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.ARCHITECTURE_C_FAST_PATH_ENABLED === "true";
}

export function isArchitectureCFastPathEligible(input: {
  generationMode: string;
  intent?: string;
}): boolean {
  return input.generationMode === "basic" && input.intent === undefined;
}

export async function evaluateArchitectureCFastPath(
  input: {
    enabled: boolean;
    eligible: boolean;
    rawLesson: unknown;
    subject: string;
    question: string;
    apiKey: string;
    validatorTimeoutMs?: number;
  },
  runShadow: ShadowRunner = runArchitectureCShadow,
): Promise<ArchitectureCFastPathDecision> {
  if (!input.enabled || !input.eligible) {
    return {
      architecturePath: "option_f",
      structuralGate: "SKIPPED",
      materialValidator: "SKIPPED",
      validatorCalls: 0,
      validatorLatencyMs: 0,
      validatorUsage: zeroUsage(),
    };
  }

  if ((input.validatorTimeoutMs ?? Number.POSITIVE_INFINITY) < 1) {
    return {
      architecturePath: "architecture_c_fallback",
      structuralGate: "SKIPPED",
      materialValidator: "SKIPPED",
      validatorCalls: 0,
      validatorLatencyMs: 0,
      validatorUsage: zeroUsage(),
      fallbackReason: "insufficient_validation_budget",
    };
  }

  const startedAt = Date.now();
  let materialValidationStarted = false;
  let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    const shadowPromise = runShadow(input.rawLesson, {
      subject: input.subject,
      question: input.question,
      apiKey: input.apiKey,
      timeoutMs: input.validatorTimeoutMs,
      onMaterialValidationStart: () => {
        materialValidationStarted = true;
      },
    });
    const report: ArchitectureCShadowReport = input.validatorTimeoutMs === undefined
      ? await shadowPromise
      : await Promise.race([
          shadowPromise,
          new Promise<never>((_, reject) => {
            deadlineTimer = setTimeout(
              () => reject(new Error("architecture_c_deadline_exceeded")),
              Math.max(1, input.validatorTimeoutMs!),
            );
          }),
        ]);
    const validatorUsage = report.material.usage;

    if (report.structural.passed && report.material.status === "MATERIAL_PASS") {
      return {
        architecturePath: "architecture_c_fast_pass",
        structuralGate: "PASS",
        materialValidator: "PASS",
        validatorCalls: 1,
        validatorLatencyMs: report.totalLatencyMs,
        validatorUsage,
        lesson: report.structural.normalizedLesson,
      };
    }

    return {
      architecturePath: "architecture_c_fallback",
      structuralGate: report.structural.passed ? "PASS" : "FAIL",
      materialValidator: report.structural.passed ? "FAIL" : "SKIPPED",
      validatorCalls: report.structural.passed ? 1 : 0,
      validatorLatencyMs: report.totalLatencyMs,
      validatorUsage,
      fallbackReason:
        !report.structural.passed
          ? "structural_fail"
          : report.material.status === "MATERIAL_FAIL"
            ? "material_fail"
            : report.material.status === "VALIDATOR_ERROR"
              ? "validator_error"
              : "material_not_run",
    };
  } catch {
    return {
      architecturePath: "architecture_c_fallback",
      structuralGate: "FAIL",
      materialValidator: "FAIL",
      validatorCalls: materialValidationStarted ? 1 : 0,
      validatorLatencyMs: Date.now() - startedAt,
      validatorUsage: zeroUsage(),
      fallbackReason: "validator_exception",
    };
  } finally {
    if (deadlineTimer) clearTimeout(deadlineTimer);
  }
}