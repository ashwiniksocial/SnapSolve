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

export function getSimplifyLevelInstruction(level: SimplifyLevel): string {
  if (level === "step_by_step") {
    return `SIMPLIFICATION LEVEL: VERY SIMPLE STEPS.
Use the same mathematical depth and complete reasoning as the source, but break it into the smallest useful steps.
Explain only one move or idea at a time, state what to do before showing the result, and say why that move is allowed.
Use short, concrete sentences and define technical words immediately. Do not skip conditions, proof steps, or facts needed to justify the exact answer.`;
  }

  return `SIMPLIFICATION LEVEL: CLEARER EXPLANATION.
Keep the source lesson's structure and depth, but make the wording easier to follow.
Use plain language, shorter sentences, and define technical words when first used. Clarify transitions between ideas without removing reasoning, conditions, proof steps, or facts needed to justify the exact answer.`;
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
