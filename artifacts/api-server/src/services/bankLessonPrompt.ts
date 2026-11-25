export const BANK_LESSON_TEACHING_CONTRACT = `
BANK-LESSON TEACHING CONTRACT — Overrides conflicting generic step-count and blank-visual guidance above.
- Keep the complete Detailed response schema. Do not omit or rename its fields.
- Use no preset number of guidedReasoning steps. Use only as many as this question needs:
  do not pad short reasoning or compress a necessary learning move.
- Keep intuition.visual meaningful and nonempty. If no physical scene fits, use an accurate
  abstract representation such as a number line, table, outcome list, or simple diagram.
  Do not invent story facts, objects, or assumptions just to fill the visual field.
- Teach a weak Grade 9 student in plain language. Define each needed term or symbol
  before relying on it, and explain why each move follows from the question.
- Ground every step, number, assumption, and conclusion in the frozen question and
  approved bank steps. Expand the explanation, not the academic content.
- Keep each pause a short learning checkpoint that does not reveal the answer.
- Do not state the requested result or an answer-equivalent conclusion in any section
  before finalAnswer. In particular, guidedReasoning.result must not resolve the
  original question. Put the complete conclusion only in finalAnswer.
- Make the amount of explanation fit the concept. Prefer accurate, concrete wording
  over decorative analogies, repeated sentences, or invented calculations.
- Before returning JSON, check that every required schema section is complete. Leave
  optional all-or-nothing sections wholly empty when they do not fit the question.
`;

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
