/**
 * Architecture C shadow validation — diagnostic-only orchestration.
 *
 * This module is intentionally not imported by solveQuestion or the production
 * Teaching Quality Pipeline. It validates a raw Detailed result, runs the
 * semantic call only after a structural pass, and never repairs or routes it.
 */

import { validateMaterialSafety, type MaterialValidationResult } from "./materialValidator";
import { validateRawDetailedLesson, type StructuralGateResult } from "./structuralGate";

export interface ArchitectureCShadowReport {
  architecture: "C-shadow";
  structural: StructuralGateResult;
  material: MaterialValidationResult | {
    status: "NOT_RUN";
    issues: [];
    optionalPolish: [];
    confidence: 0;
    usage: {
      model: string;
      promptTokens: number;
      completionTokens: number;
      cachedTokens: number;
      totalTokens: number;
      estimatedCostUsd: number;
    };
    latencyMs: 0;
    reason: string;
  };
  totalLatencyMs: number;
  productionRoutingChanged: false;
}

export async function runArchitectureCShadow(
  rawLesson: unknown,
  options: {
    subject?: string;
    question?: string;
    apiKey?: string;
  } = {},
): Promise<ArchitectureCShadowReport> {
  const startedAt = Date.now();
  const structural = validateRawDetailedLesson(rawLesson);

  if (!structural.passed) {
    return {
      architecture: "C-shadow",
      structural,
      material: {
        status: "NOT_RUN",
        issues: [],
        optionalPolish: [],
        confidence: 0,
        usage: {
          model: "gpt-4o-mini",
          promptTokens: 0,
          completionTokens: 0,
          cachedTokens: 0,
          totalTokens: 0,
          estimatedCostUsd: 0,
        },
        latencyMs: 0,
        reason: "structural_gate_failed",
      },
      totalLatencyMs: Date.now() - startedAt,
      productionRoutingChanged: false,
    };
  }

  if (!options.apiKey) {
    return {
      architecture: "C-shadow",
      structural,
      material: {
        status: "NOT_RUN",
        issues: [],
        optionalPolish: [],
        confidence: 0,
        usage: {
          model: "gpt-4o-mini",
          promptTokens: 0,
          completionTokens: 0,
          cachedTokens: 0,
          totalTokens: 0,
          estimatedCostUsd: 0,
        },
        latencyMs: 0,
        reason: "missing_openai_api_key",
      },
      totalLatencyMs: Date.now() - startedAt,
      productionRoutingChanged: false,
    };
  }

  const material = await validateMaterialSafety(
    structural.normalizedLesson,
    options.subject ?? "Unknown",
    options.question ?? "Unknown question",
    options.apiKey,
  );
  return {
    architecture: "C-shadow",
    structural,
    material,
    totalLatencyMs: Date.now() - startedAt,
    productionRoutingChanged: false,
  };
}

export { validateRawDetailedLesson } from "./structuralGate";
export { validateMaterialSafety } from "./materialValidator";
export type {
  StructuralGateResult,
  StructuralIssue,
} from "./structuralGate";
export type {
  MaterialCategory,
  MaterialIssue,
  MaterialValidationResult,
  MaterialValidationStatus,
} from "./materialValidator";