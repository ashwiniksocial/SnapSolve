export const BANK_CALCULATION_CONTEXT_INSTRUCTION = [
  "For every calculation, explain why the operation preserves meaning and how the result answers this exact question.",
  "For a probability or ratio, explain why dividing numerator and denominator by the same nonzero factor preserves the ratio, then interpret the final fraction using the source question's actual event and total. Do not invent counts or trials.",
].join(" ");

export function buildIncompleteLessonRetryInstruction(
  missingFields: readonly string[],
): string {
  const fieldList = missingFields.length > 0
    ? missingFields.join(", ")
    : "one or more required Detailed lesson sections";

  return [
    "BOUNDED STRUCTURE RECOVERY:",
    `The previous response did not pass the existing completeness check. Missing or incomplete: ${fieldList}.`,
    "Return the full Detailed JSON again, filling those sections with question-grounded teaching.",
    "Keep the original frozen answer, all schema fields, and the answer-last rule unchanged.",
    "Do not add unsupported facts, calculations, or padding to reach a step count.",
  ].join("\n");
}

export function bankLessonGenerationRecoveryEnabled(
  maxGenerationAttempts?: 1 | 2,
): boolean {
  return maxGenerationAttempts !== 1;
}
