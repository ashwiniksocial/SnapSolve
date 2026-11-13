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
