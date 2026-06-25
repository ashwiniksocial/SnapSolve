import type { AIResponse } from "@/data/solutionBank";

export interface ValidationResult {
  valid:         boolean;
  missingFields: string[];
  warnings:      string[];
}

export function validateAIResponse(r: AIResponse): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!r.questionUnderstanding?.trim())         missing.push("Question understanding");
  if (!r.conceptExplanation?.trim())            missing.push("Concept explanation");
  if (!r.thinkingProcess?.trim())               missing.push("Thinking process");
  if (!r.wordToMath?.trim())                    missing.push("Word-to-math translation");

  if ((r.steps?.length ?? 0) < 3)              warnings.push("Fewer than 3 solution steps");
  if (!r.verification?.trim())                  warnings.push("No verification step shown");
  if ((r.commonMistakes?.length ?? 0) < 3)     warnings.push("Fewer than 3 common mistakes");
  if (!r.similarExample?.problem)              warnings.push("No similar example provided");
  if (!r.checkUnderstanding?.question)         warnings.push("No practice question provided");
  if ((r.conceptualQuestions?.length ?? 0) < 3) warnings.push("Fewer than 3 conceptual questions");
  if ((r.learningSummary?.length ?? 0) < 3)    warnings.push("Learning summary too short");

  return { valid: missing.length === 0, missingFields: missing, warnings };
}
