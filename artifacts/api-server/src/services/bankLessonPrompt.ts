export const BANK_CALCULATION_CONTEXT_INSTRUCTION = [
  "For every calculation, explain why the operation preserves meaning and how the result answers this exact question.",
  "For a probability or ratio, explain why dividing numerator and denominator by the same nonzero factor preserves the ratio, then interpret the final fraction using the source question's actual event and total. Do not invent counts or trials.",
].join(" ");

export interface BankPromptStep {
  title: string;
  explanation: string;
  formula?: string;
  result?: string;
}

export interface BankLessonGrounding {
  question: string;
  answer: string;
  stepsText: string;
  isMultipleChoice: boolean;
}

export type BankPromptQuestionType = "MCQ" | "ShortAnswer" | "LongAnswer" | "HOTS" | "PYQ";

function hasLabeledMultipleChoiceOptions(question: string): boolean {
  return new Set(
    [...question.matchAll(/\(\s*([a-d])\s*\)/gi)].map((match) => match[1].toLowerCase()),
  ).size >= 3;
}

function redactMultipleChoiceLabels(value: string): string {
  return value
    .replace(
      /(?:^|[.!?;]\s*)\b(?:the\s+)?(?:final\s+)?answer\s*(?:is\s*|:|=)\s*\(?[a-d]\)?\s*[^.!?;\n]*/gi,
      "",
    )
    .replace(/\(\s*[a-d]\s*\)/gi, " ");
}

/**
 * Keep option content and approved reasoning available to the lesson writer,
 * while withholding the option-to-letter mapping that repeatedly leaked into
 * pre-final lesson sections. The source bank remains authoritative and the
 * answer comparator validates any label-free MCQ answer body against it;
 * non-MCQ prompts remain byte-for-byte unchanged.
 */
export function prepareBankLessonGrounding(
  question: string,
  answer: string,
  steps: readonly BankPromptStep[],
  questionType?: BankPromptQuestionType,
): BankLessonGrounding {
  const isMultipleChoice = questionType === undefined
    ? hasLabeledMultipleChoiceOptions(question)
    : questionType === "MCQ";
  if (!isMultipleChoice) {
    return {
      question,
      answer,
      isMultipleChoice: false,
      stepsText: steps.map((step, index) => [
        `Step ${index + 1} — ${step.title}:`,
        step.explanation,
        ...(step.formula ? [`Formula: ${step.formula}`] : []),
        ...(step.result ? [`Result: ${step.result}`] : []),
      ].join("\n")).join("\n\n"),
    };
  }

  const anonymize = (value: string) => redactMultipleChoiceLabels(value);
  const answerWithoutLabel = answer.replace(/^\s*\([a-d]\)\s*/i, "");
  const stepsText = steps.map((step, index) => [
    `Step ${index + 1} — ${anonymize(step.title)}:`,
    anonymize(step.explanation),
    ...(step.formula ? [`Formula: ${anonymize(step.formula)}`] : []),
    ...(step.result ? [`Result: ${anonymize(step.result)}`] : []),
  ].join("\n")).join("\n\n");

  return {
    question: redactMultipleChoiceLabels(question).replace(/\s{2,}/g, " ").trim(),
    answer: answerWithoutLabel,
    isMultipleChoice: true,
    stepsText,
  };
}

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
