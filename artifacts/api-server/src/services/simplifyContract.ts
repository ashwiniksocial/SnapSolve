import type { LessonResponse } from "../lib/lessonTypes";

export type SimplifyDifficulty = LessonResponse["difficulty"];
export type SimplifyLevel = "clearer" | "step_by_step";

export interface SimplifyContext {
  topic: string;
  difficulty: SimplifyDifficulty;
  answer: string;
  lesson: Record<string, unknown>;
  level: SimplifyLevel;
}

const SIMPLIFY_EXPLANATION_FIELDS = [
  "keyConcepts",
  "beforeWeStart",
  "prerequisites",
  "vocabulary",
  "intuition",
  "questionTranslation",
  "teacherThinking",
  "guidedReasoning",
  "confusionPoints",
  "commonMistakes",
  "examinerThinking",
  "simplerExample",
  "practiceQuestion",
  "confidenceCheck",
  "retrievalPractice",
  "rememberThese",
  "confidenceBuilder",
  "finalAnswer",
] as const;

function normalizedExplanationSignature(lesson: Record<string, unknown>): string {
  const parts: string[] = [];

  const collect = (value: unknown, path: string): void => {
    if (typeof value === "string") {
      const text = value.normalize("NFC").replace(/\s+/gu, " ").trim();
      if (text) parts.push(`${path}:${text}`);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => collect(entry, `${path}[${index}]`));
      return;
    }
    if (!isRecord(value)) return;

    for (const key of Object.keys(value).sort()) {
      if (
        key === "aiConfidence" ||
        key === "cached" ||
        key === "correctIndex" ||
        (path === "finalAnswer" && key === "answer")
      ) {
        continue;
      }
      collect(value[key], `${path}.${key}`);
    }
  };

  for (const field of SIMPLIFY_EXPLANATION_FIELDS) {
    collect(lesson[field], field);
  }
  return JSON.stringify(parts);
}

/**
 * Compare student-facing explanation text only. Unicode normalization and
 * whitespace collapsing ignore formatting noise; wording and punctuation
 * remain significant. The canonical final answer is deliberately excluded.
 */
export function hasMaterialSimplifyChange(original: unknown, candidate: unknown): boolean {
  if (!isRecord(original) || !isRecord(candidate)) return false;
  return normalizedExplanationSignature(original) !== normalizedExplanationSignature(candidate);
}

function wordCount(value: unknown): number {
  return typeof value === "string" ? value.trim().split(/\s+/u).filter(Boolean).length : 0;
}

function hasText(record: Record<string, unknown>, field: string): boolean {
  return typeof record[field] === "string" && !!(record[field] as string).trim();
}

/**
 * Enforce an observable instructional contract for the selected level. This
 * prevents a structurally identical rewrite from being accepted under both
 * labels; academic correctness remains the reviewer's responsibility.
 */
export function matchesSimplifyLevelStructure(
  original: unknown,
  candidate: unknown,
  level: SimplifyLevel,
): boolean {
  if (!isRecord(original) || !isRecord(candidate)) return false;
  const sourceSteps = Array.isArray(original.guidedReasoning)
    ? original.guidedReasoning.filter(isRecord)
    : [];
  const candidateSteps = Array.isArray(candidate.guidedReasoning)
    ? candidate.guidedReasoning.filter(isRecord)
    : [];
  if (sourceSteps.length === 0 || candidateSteps.length === 0) return false;

  if (level === "clearer") {
    const example = isRecord(candidate.simplerExample) ? candidate.simplerExample : {};
    return candidateSteps.length === sourceSteps.length &&
      candidateSteps.every((step) => hasText(step, "what") && hasText(step, "why")) &&
      hasText(example, "problem") &&
      hasText(example, "solution");
  }

  const prerequisites = Array.isArray(candidate.prerequisites)
    ? candidate.prerequisites.filter((entry) => typeof entry === "string" && entry.trim())
    : [];
  return prerequisites.length > 0 &&
    candidateSteps.length >= 3 &&
    candidateSteps.length > sourceSteps.length &&
    candidateSteps.every((step) =>
      hasText(step, "what") &&
      hasText(step, "why") &&
      hasText(step, "pause") &&
      (step.pause as string).includes("?") &&
      wordCount(step.what) <= 20 &&
      wordCount(step.why) <= 45 &&
      wordCount(step.pause) <= 24
    );
}

export function getSimplifyLevelInstruction(level: SimplifyLevel): string {
  if (level === "step_by_step") {
    return `SIMPLIFICATION LEVEL: VERY SIMPLE STEPS.
Teach the same mathematics in a visibly different structure from a clearer rewrite:
- Put the exact facts and terms the student needs first in the existing prerequisites field.
- Split combined reasoning into MORE guidedReasoning items than the source lesson. Each item must contain one small action, a short what, a short why, and a short question in pause that checks understanding before continuing.
- Keep each what under 20 words, each why under 45 words, and each pause checkpoint under 24 words.
- Never leave pause blank. Use the existing Pause & Think interaction; do not put checkpoints only in prose.
Use the existing lesson fields only. Do not add fields or change topic, difficulty, question, or final answer. Copy finalAnswer.answer exactly, character for character. Never omit a proof step, mathematical fact, or condition needed to justify the answer.`;
  }

  return `SIMPLIFICATION LEVEL: CLEARER EXPLANATION.
Keep the same number and order of main guidedReasoning steps as the source. Preserve all reasoning and teaching coverage, but make the language simpler, the transitions clearer, and the examples accessible and mathematically accurate.
Use the existing simplerExample field for one familiar worked example, and define technical words when first used. Do not turn this level into the Very simple steps format: do not split every main step into microsteps or add a checkpoint to every step.
Never omit reasoning, proof steps, conditions, or facts needed to justify the exact answer. Use existing lesson fields only. Do not change the question, topic, difficulty, or mathematical facts. Copy finalAnswer.answer exactly, character for character.`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseSimplifyContext(value: unknown): SimplifyContext | null {
  if (!isRecord(value) || !isRecord(value.lesson)) return null;

  const { topic, difficulty, answer, lesson, level } = value;
  if (
    typeof topic !== "string" ||
    !topic.trim() ||
    topic.length > 200 ||
    (difficulty !== "Easy" && difficulty !== "Medium" && difficulty !== "Hard") ||
    typeof answer !== "string" ||
    !answer.trim() ||
    answer.length > 4000 ||
    (level !== "clearer" && level !== "step_by_step") ||
    lesson.topic !== topic ||
    lesson.difficulty !== difficulty ||
    !isRecord(lesson.finalAnswer) ||
    lesson.finalAnswer.answer !== answer
  ) {
    return null;
  }

  try {
    if (JSON.stringify(lesson).length > 24_000) return null;
  } catch {
    return null;
  }

  return { topic, difficulty, answer, lesson, level };
}

export function matchesSimplifyCanonicalFields(
  candidate: Pick<LessonResponse, "topic" | "difficulty" | "finalAnswer">,
  canonical: SimplifyContext,
): boolean {
  return candidate.topic === canonical.topic &&
    candidate.difficulty === canonical.difficulty &&
    candidate.finalAnswer?.answer === canonical.answer;
}
