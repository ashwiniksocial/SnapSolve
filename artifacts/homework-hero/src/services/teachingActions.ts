import type { AIResponse, TeachingLesson } from "../data/solutionBank";

export type SimplifyLevel = "clearer" | "step_by_step";

// The initial beta omits Simplify from the student UI; keep its implementation intact.
export const SIMPLIFY_BETA_UI_ENABLED = false;

export interface SimplifyContext {
  topic: string;
  difficulty: TeachingLesson["difficulty"];
  answer: string;
  lesson: TeachingLesson;
  level: SimplifyLevel;
}

const SIMPLIFY_CACHE_STORE_KEY = "studyai-simplified-lesson-cache-v2";
const SIMPLIFY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const SIMPLIFY_CACHE_MAX_ENTRIES = 40;
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

interface SimplifyCacheEntry {
  identity: string;
  sourceSignature: string;
  response: AIResponse;
  timestamp: number;
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

function explanationSignature(lesson: TeachingLesson): string {
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
    if (typeof value !== "object" || value === null) return;

    for (const key of Object.keys(value).sort()) {
      if (
        key === "aiConfidence" ||
        key === "cached" ||
        key === "correctIndex" ||
        (path === "finalAnswer" && key === "answer")
      ) {
        continue;
      }
      collect((value as Record<string, unknown>)[key], `${path}.${key}`);
    }
  };

  for (const field of SIMPLIFY_EXPLANATION_FIELDS) {
    collect(lesson[field], field);
  }
  return JSON.stringify(parts);
}

export function hasMaterialSimplifyChange(
  original: TeachingLesson,
  candidate: TeachingLesson,
): boolean {
  return explanationSignature(original) !== explanationSignature(candidate);
}

function wordCount(value: unknown): number {
  return typeof value === "string" ? value.trim().split(/\s+/u).filter(Boolean).length : 0;
}

function hasText(record: Record<string, unknown>, field: string): boolean {
  return typeof record[field] === "string" && !!(record[field] as string).trim();
}

export function matchesSimplifyLevelStructure(
  original: TeachingLesson,
  candidate: TeachingLesson,
  level: SimplifyLevel,
): boolean {
  const sourceSteps = Array.isArray(original.guidedReasoning) ? original.guidedReasoning : [];
  const candidateSteps = Array.isArray(candidate.guidedReasoning) ? candidate.guidedReasoning : [];
  if (sourceSteps.length === 0 || candidateSteps.length === 0) return false;

  if (level === "clearer") {
    return candidateSteps.length === sourceSteps.length &&
      candidateSteps.every((step) => !!step.what.trim() && !!step.why.trim()) &&
      !!candidate.simplerExample?.problem.trim() &&
      !!candidate.simplerExample?.solution.trim();
  }

  const prerequisites = Array.isArray(candidate.prerequisites)
    ? candidate.prerequisites.filter((prerequisite) =>
        typeof prerequisite === "string" && !!prerequisite.trim())
    : [];
  return prerequisites.length > 0 &&
    candidateSteps.length >= 3 &&
    candidateSteps.length > sourceSteps.length &&
    candidateSteps.every((step) =>
      !!step.what.trim() &&
      !!step.why.trim() &&
      !!step.pause.trim() &&
      step.pause.includes("?") &&
      wordCount(step.what) <= 20 &&
      wordCount(step.why) <= 45 &&
      wordCount(step.pause) <= 24
    );
}

export function getSimplifyFailureMessage(error: unknown): string {
  if (error instanceof Error && error.message === "simplify_unchanged") {
    return "The explanation did not change enough to count as a simpler version. Your original lesson is unchanged.";
  }
  if (error instanceof Error && error.message === "simplify_level_mismatch") {
    return "The lesson did not meet the selected explanation style. Your original lesson is unchanged.";
  }
  return "A simpler version could not be verified. Your original lesson is unchanged.";
}

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
  level: SimplifyLevel,
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
    candidateAnswer !== canonicalAnswer ||
    !hasMaterialSimplifyChange(originalLesson, candidateLesson) ||
    !matchesSimplifyLevelStructure(originalLesson, candidateLesson, level)
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

/**
 * Fingerprint the frozen source without tying it to a transient response ID.
 * Including the full response content invalidates cached rewrites when source
 * lesson content or any of its metadata changes.
 */
export function getSimplifySourceSignature(original: AIResponse): string | null {
  try {
    const { id: _transientId, ...source } = original;
    return JSON.stringify(source);
  } catch {
    return null;
  }
}

function simplifyCacheIdentity(original: AIResponse, level: SimplifyLevel): string {
  return JSON.stringify([original.subject, original.detectedQuestion, level]);
}

function simplifyCacheKey(identity: string): string {
  let hash = 0;
  for (let i = 0; i < identity.length; i++) {
    hash = (Math.imul(31, hash) + identity.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function readSimplifyCache(): Record<string, SimplifyCacheEntry> {
  try {
    const raw = globalThis.localStorage?.getItem(SIMPLIFY_CACHE_STORE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as Record<string, SimplifyCacheEntry>
      : {};
  } catch {
    return {};
  }
}

function writeSimplifyCache(store: Record<string, SimplifyCacheEntry>): void {
  try {
    globalThis.localStorage?.setItem(SIMPLIFY_CACHE_STORE_KEY, JSON.stringify(store));
  } catch {
    // Storage may be unavailable or full; simplify can still work without it.
  }
}

function removeSimplifyCacheEntry(identity: string): void {
  const store = readSimplifyCache();
  delete store[simplifyCacheKey(identity)];
  writeSimplifyCache(store);
}

/**
 * Reuse only an unexpired rewrite for the exact source and rerun the same
 * answer/topic/difficulty checks used for a newly generated candidate.
 */
export function getCachedSimplifiedResponse(
  original: AIResponse,
  level: SimplifyLevel,
): AIResponse | null {
  const sourceSignature = getSimplifySourceSignature(original);
  if (!sourceSignature) return null;

  const identity = simplifyCacheIdentity(original, level);
  const key = simplifyCacheKey(identity);
  const store = readSimplifyCache();
  const entry = store[key];
  if (!entry || typeof entry !== "object" || !entry.response || typeof entry.response !== "object") {
    if (entry !== undefined) {
      delete store[key];
      writeSimplifyCache(store);
    }
    return null;
  }

  if (
    entry.identity !== identity ||
    entry.sourceSignature !== sourceSignature ||
    !Number.isFinite(entry.timestamp) ||
    Date.now() - entry.timestamp > SIMPLIFY_CACHE_TTL_MS
  ) {
    delete store[key];
    writeSimplifyCache(store);
    return null;
  }

  const verified = createSimplifiedResponse(original, entry.response, level);
  if (!verified) {
    delete store[key];
    writeSimplifyCache(store);
    return null;
  }
  return verified;
}

/**
 * Save only a response that passes the canonical metadata checks. Callers
 * must additionally confirm the lesson is complete before storing it.
 */
export function cacheSimplifiedResponse(
  original: AIResponse,
  level: SimplifyLevel,
  response: AIResponse,
): void {
  const sourceSignature = getSimplifySourceSignature(original);
  const verified = createSimplifiedResponse(original, response, level);
  if (!sourceSignature || !verified) return;

  const identity = simplifyCacheIdentity(original, level);
  const key = simplifyCacheKey(identity);
  const store = readSimplifyCache();
  const now = Date.now();

  for (const [existingKey, entry] of Object.entries(store)) {
    if (
      !entry ||
      !Number.isFinite(entry.timestamp) ||
      now - entry.timestamp > SIMPLIFY_CACHE_TTL_MS
    ) {
      delete store[existingKey];
    }
  }

  store[key] = { identity, sourceSignature, response: verified, timestamp: now };

  const newestFirst = Object.entries(store)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, SIMPLIFY_CACHE_MAX_ENTRIES);
  writeSimplifyCache(Object.fromEntries(newestFirst));
}

export function discardCachedSimplifiedResponse(
  original: AIResponse,
  level: SimplifyLevel,
): void {
  removeSimplifyCacheEntry(simplifyCacheIdentity(original, level));
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
