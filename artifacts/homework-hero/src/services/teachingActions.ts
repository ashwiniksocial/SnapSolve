import type { AIResponse } from "../data/solutionBank";

export interface SimplifyActionState {
  loading: boolean;
  response: AIResponse | null;
  showingSimplified: boolean;
  error: string | null;
}

export const INITIAL_SIMPLIFY_ACTION_STATE: SimplifyActionState = {
  loading: false,
  response: null,
  showingSimplified: false,
  error: null,
};

export type SimplifyAction =
  | { type: "start" }
  | { type: "success"; response: AIResponse }
  | { type: "failure"; message: string }
  | { type: "toggle" }
  | { type: "reset" };

export function simplifyActionReducer(
  state: SimplifyActionState,
  action: SimplifyAction,
): SimplifyActionState {
  switch (action.type) {
    case "start":
      return { ...state, loading: true, error: null };
    case "success":
      return {
        loading: false,
        response: action.response,
        showingSimplified: true,
        error: null,
      };
    case "failure":
      return { ...state, loading: false, showingSimplified: false, error: action.message };
    case "toggle":
      return state.response && !state.loading
        ? { ...state, showingSimplified: !state.showingSimplified, error: null }
        : state;
    case "reset":
      return INITIAL_SIMPLIFY_ACTION_STATE;
  }
}

/**
 * Keep a transient simplified lesson only when it reproduces the original
 * canonical answer exactly. The source response is never mutated.
 */
export function createSimplifiedResponse(
  original: AIResponse,
  candidate: AIResponse,
): AIResponse | null {
  const originalLesson = original.lesson;
  const candidateLesson = candidate.lesson;
  const canonicalAnswer = originalLesson?.finalAnswer?.answer;
  const candidateAnswer = candidateLesson?.finalAnswer?.answer;

  if (
    !originalLesson ||
    !candidateLesson ||
    candidate.detectedQuestion !== original.detectedQuestion ||
    !canonicalAnswer?.trim() ||
    original.finalAnswer !== canonicalAnswer ||
    candidate.finalAnswer !== canonicalAnswer ||
    candidateAnswer !== canonicalAnswer
  ) {
    return null;
  }

  return {
    ...original,
    finalAnswer: canonicalAnswer,
    lesson: {
      ...candidateLesson,
      topic: original.topic,
      difficulty: original.difficulty,
      finalAnswer: {
        ...candidateLesson.finalAnswer,
        answer: canonicalAnswer,
      },
    },
  };
}

export function supportsSimplify(
  response: Pick<AIResponse, "lesson" | "detectedQuestion" | "finalAnswer">,
): boolean {
  const lessonAnswer = response.lesson?.finalAnswer?.answer ?? "";
  return Boolean(
    response.lesson &&
    response.detectedQuestion.trim().length >= 5 &&
    response.finalAnswer.trim() &&
    lessonAnswer.trim() &&
    response.finalAnswer === lessonAnswer,
  );
}

export function supportsVisualization(lesson: AIResponse["lesson"]): boolean {
  return Boolean(
    lesson &&
    typeof lesson.intuition?.visual === "string" &&
    lesson.intuition.visual.trim(),
  );
}
