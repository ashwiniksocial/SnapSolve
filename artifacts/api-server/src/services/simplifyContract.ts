import type { LessonResponse } from "../lib/lessonTypes";

export type SimplifyDifficulty = LessonResponse["difficulty"];

export interface SimplifyContext {
  topic: string;
  difficulty: SimplifyDifficulty;
  answer: string;
  lesson: Record<string, unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseSimplifyContext(value: unknown): SimplifyContext | null {
  if (!isRecord(value) || !isRecord(value.lesson)) return null;

  const { topic, difficulty, answer, lesson } = value;
  if (
    typeof topic !== "string" ||
    !topic.trim() ||
    topic.length > 200 ||
    (difficulty !== "Easy" && difficulty !== "Medium" && difficulty !== "Hard") ||
    typeof answer !== "string" ||
    !answer.trim() ||
    answer.length > 4000 ||
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

  return { topic, difficulty, answer, lesson };
}

export function matchesSimplifyCanonicalFields(
  candidate: Pick<LessonResponse, "topic" | "difficulty" | "finalAnswer">,
  canonical: SimplifyContext,
): boolean {
  return candidate.topic === canonical.topic &&
    candidate.difficulty === canonical.difficulty &&
    candidate.finalAnswer?.answer === canonical.answer;
}
