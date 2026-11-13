import type { AIResponse, TeachingLesson } from "../data/solutionBank";

export type SimplifyLevel = "clearer" | "step_by_step";

export interface SimplifyContext {
  topic: string;
  difficulty: TeachingLesson["difficulty"];
  answer: string;
  lesson: TeachingLesson;
  level: SimplifyLevel;
}

export interface SimplifyActionState {
  loading: boolean;
  response: AIResponse | null;
  selectedLevel: SimplifyLevel | null;
  showingSimplified: boolean;
  error: string | null;
}

export const INITIAL_SIMPLIFY_ACTION_STATE: SimplifyActionState = {
  loading: false,
  response: null,
  selectedLevel: null,
  showingSimplified: false,
  error: null,
};

export type SimplifyAction =
  | { type: "start"; level: SimplifyLevel }
  | { type: "success"; response: AIResponse; level: SimplifyLevel }
  | { type: "failure"; message: string }
  | { type: "show" }
  | { type: "showOriginal" }
  | { type: "reset" };

export function simplifyActionReducer(
  state: SimplifyActionState,
  action: SimplifyAction,
): SimplifyActionState {
  switch (action.type) {
    case "start":
      return {
        loading: true,
        response: null,
        selectedLevel: action.level,
        showingSimplified: false,
        error: null,
      };
    case "success":
      return {
        loading: false,
        response: action.response,
        selectedLevel: action.level,
        showingSimplified: true,
        error: null,
      };
    case "failure":
      return {
        ...state,
        loading: false,
        response: null,
        selectedLevel: null,
        showingSimplified: false,
        error: action.message,
      };
    case "show":
      return state.response && !state.loading
        ? { ...state, showingSimplified: true, error: null }
        : state;
    case "showOriginal":
      return state.response && !state.loading
        ? { ...state, showingSimplified: false, error: null }
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
    candidate.topic !== original.topic ||
    candidateLesson.topic !== original.topic ||
    candidate.difficulty !== original.difficulty ||
    candidateLesson.difficulty !== original.difficulty ||
    !canonicalAnswer?.trim() ||
    original.finalAnswer !== canonicalAnswer ||
    candidate.finalAnswer !== canonicalAnswer ||
    candidateAnswer !== canonicalAnswer
  ) {
    return null;
  }

  return {
    ...original,
    lesson: {
      ...candidateLesson,
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
