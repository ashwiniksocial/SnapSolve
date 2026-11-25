/**
 * OpenAI Solver — client-side (browser-safe, key-free).
 *
 * All OpenAI calls are proxied through the backend route POST /api/solveQuestion.
 * No API key is stored or transmitted from the browser.
 *
 * Two-layer caching:
 *  1. Client-side localStorage (7-day TTL) — avoids backend round-trips for
 *     questions the student has seen before.
 *  2. Server-side in-memory cache — avoids OpenAI charges for repeated questions
 *     across students.
 *
 * The backend now returns a TeachingLesson object instead of steps[].
 * This file maps BackendLessonResponse → AIResponse.lesson.
 */

import type { Subject }                    from "@/data/subjects";
import { getStoredAcademicContext, makeChapterContextKey, type BoardId } from "@/data/questions/academicContext";
import type { Question }                   from "@/data/questions/types";
import type { AIResponse, TeachingLesson } from "@/data/solutionBank";
import {
  assessTeachingLessonAnswerLast,
  compareBankAnswers,
  isBankLessonAnswerSafe,
  type AnswerLastContext,
} from "@workspace/api-zod/bank-answer-integrity";
import type { SimplifyContext } from "@/services/teachingActions";
import { buildStudentContext }             from "@/services/studentModel";
import { getStoredLevel, type ReadingLevel } from "@/services/explanation/readingModeEngine";

export type SolveIntent = "simplify";

// ─── Availability check ───────────────────────────────────────────────────────

export function isOpenAIAvailable(): boolean {
  return true;
}

// ─── Client-side localStorage cache ──────────────────────────────────────────

const CACHE_STORE_KEY = "studyai-ai-cache-v3"; // bumped — mode-specific responses
const CACHE_TTL_MS    = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  response:  AIResponse;
  timestamp: number;
}

// Matches the normalisation used server-side so the same question always hits the same cache entry.
function normaliseQ(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.?!,;:]+$/, "");
}

function hashKey(subject: string, question: string, mode: ReadingLevel): string {
  const context = getStoredAcademicContext();
  const contextKey = context ? `${context.boardId}:${context.classNum}:${context.academicSession ?? ""}` : "unscoped";
  const raw = `${contextKey}::${mode}::${subject}::${normaliseQ(question)}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function readCache(): Record<string, CacheEntry> {
  try { return JSON.parse(localStorage.getItem(CACHE_STORE_KEY) ?? "{}"); }
  catch { return {}; }
}

function writeCache(store: Record<string, CacheEntry>): void {
  try { localStorage.setItem(CACHE_STORE_KEY, JSON.stringify(store)); } catch {}
}

function answerLastContextFor(
  canonicalQuestion: string | undefined,
  approvedSteps: readonly { title: string; explanation: string; formula?: string; result?: string }[] = [],
): AnswerLastContext {
  const approvedIntermediates = approvedSteps
    .slice(0, -1)
    .flatMap((step) => [step.title, step.explanation, step.formula, step.result])
    .filter((value): value is string => typeof value === "string");
  return {
    canonicalQuestion,
    intermediateText: approvedIntermediates,
  };
}

export function getCachedSolution(subject: string, question: string, mode: ReadingLevel = "standard"): AIResponse | null {
  const store = readCache();
  const key = hashKey(subject, question, mode);
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    delete store[key];
    writeCache(store);
    return null;
  }
  if (
    entry.response.lesson &&
    assessTeachingLessonAnswerLast(
      entry.response.lesson,
      undefined,
      answerLastContextFor(question),
    ).status !== "clear"
  ) {
    delete store[key];
    writeCache(store);
    return null;
  }
  return entry.response;
}

function cacheSolution(subject: string, question: string, mode: ReadingLevel, response: AIResponse): void {
  if (
    response.lesson &&
    assessTeachingLessonAnswerLast(
      response.lesson,
      undefined,
      answerLastContextFor(question),
    ).status !== "clear"
  ) return;
  const store = readCache();
  const now   = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[hashKey(subject, question, mode)] = { response, timestamp: now };
  writeCache(store);
}

export function clearAICache(): void {
  localStorage.removeItem(CACHE_STORE_KEY);
}

// ─── Bank question lesson cache ───────────────────────────────────────────────
// Keyed by questionId (not question text) — 7-day TTL localStorage cache.
// One entry per bank question; the same lesson serves all 3 teaching modes.

const BANK_CACHE_STORE_KEY = "studyai-bank-lesson-cache-v1";

interface BankCacheEntry {
  lesson:    AIResponse;
  timestamp: number;
  sourceHash?: string;
}

function readBankCache(): Record<string, BankCacheEntry> {
  try { return JSON.parse(localStorage.getItem(BANK_CACHE_STORE_KEY) ?? "{}"); }
  catch { return {}; }
}

function writeBankCache(store: Record<string, BankCacheEntry>): void {
  try { localStorage.setItem(BANK_CACHE_STORE_KEY, JSON.stringify(store)); } catch {}
}

/**
 * Smallest validity guard: a bank lesson is complete iff it has:
 * - a lesson object
 * - ≥1 real guided reasoning step
 * - a finalAnswer that is not the generic placeholder
 * - ≥1 key concept
 *
 * This guards against caching partial stream state or fallback skeletons.
 */
function isBankLessonComplete(response: AIResponse): boolean {
  const lesson = response.lesson;
  if (!lesson) return false;
  if (!lesson.guidedReasoning || lesson.guidedReasoning.length === 0) return false;
  const ans = lesson.finalAnswer?.answer ?? "";
  if (
    !ans ||
    ans === "See guided reasoning above." ||
    ans === "Work through the four steps above to find your specific answer."
  ) return false;
  if (!lesson.keyConcepts || lesson.keyConcepts.length === 0) return false;
  return true;
}

function bankLessonCacheKey(
  questionId: string,
  context: Pick<BankQuestionContext, "boardId" | "classNum" | "canonicalChapterId" | "academicSession">,
  subject: string,
): string {
  const chapterKey = makeChapterContextKey({
    boardId: context.boardId,
    classNum: context.classNum,
    subject,
    canonicalChapterId: context.canonicalChapterId,
    chapterId: context.canonicalChapterId ?? `question:${questionId}`,
    academicSession: context.academicSession,
  });
  return `${chapterKey}|${encodeURIComponent(questionId)}`;
}

export function getBankCachedLesson(
  questionId: string,
  context?: BankQuestionContext,
  canonicalQuestion?: string,
): AIResponse | null {
  if (!context) return null;
  const store = readBankCache();
  const key = bankLessonCacheKey(questionId, context, context.subject);
  // Preserve the old CBSE-only cache as a read-only compatibility path. It is
  // never considered for ICSE, WBBSE, or an unknown board.
  const legacyEntry = context.boardId === "CBSE" ? store[questionId] : undefined;
  const entryKey = store[key] ? key : legacyEntry ? questionId : null;
  const entry = store[key] ?? legacyEntry;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    if (entryKey) delete store[entryKey];
    writeBankCache(store);
    return null;
  }
  const candidateAnswer = entry.lesson.lesson?.finalAnswer?.answer ?? "";
  if (
    !entry.sourceHash ||
    !isBankLessonAnswerSafe(candidateAnswer, context.answer, entry.sourceHash, context.sourceHash) ||
    assessTeachingLessonAnswerLast(
      entry.lesson.lesson,
      context.answer,
      answerLastContextFor(canonicalQuestion, context.steps),
    ).status !== "clear" ||
    !isBankLessonComplete(entry.lesson)
  ) {
    if (entryKey) delete store[entryKey];
    writeBankCache(store);
    return null;
  }
  return entry.lesson;
}

function cacheBankLesson(
  questionId: string,
  context: BankQuestionContext,
  lesson: AIResponse,
  canonicalQuestion: string,
): void {
  const candidateAnswer = lesson.lesson?.finalAnswer?.answer ?? "";
  if (
    !isBankLessonComplete(lesson) ||
    compareBankAnswers(candidateAnswer, context.answer).status !== "match" ||
    assessTeachingLessonAnswerLast(
      lesson.lesson,
      context.answer,
      answerLastContextFor(canonicalQuestion, context.steps),
    ).status !== "clear"
  ) {
    console.warn("[BANK:CACHE] Lesson failed completeness or answer integrity — not caching");
    return;
  }
  const store = readBankCache();
  const now   = Date.now();
  // Evict expired entries to keep the store tidy
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[bankLessonCacheKey(questionId, context, context.subject)] = {
    lesson,
    timestamp: now,
    sourceHash: context.sourceHash,
  };
  writeBankCache(store);
}

function assertBankAnswer(
  response: AIResponse,
  canonicalAnswer: string,
  context?: AnswerLastContext,
): void {
  const comparison = compareBankAnswers(response.lesson?.finalAnswer?.answer ?? "", canonicalAnswer);
  if (comparison.status === "mismatch") throw new Error("bank_answer_mismatch");
  if (comparison.status !== "match") throw new Error("bank_answer_unverified");
  const answerLast = assessTeachingLessonAnswerLast(
    response.lesson,
    canonicalAnswer,
    context ?? answerLastContextFor(response.detectedQuestion),
  );
  if (answerLast.status === "leak") throw new Error("bank_answer_leakage");
  if (answerLast.status === "review") throw new Error("bank_answer_last_review");
}

export function logBankLessonTiming(
  stage: "pre-generated" | "browser-cache" | "model-generated" | "final-ready",
  outcome: string,
  elapsedMs: number,
): void {
  console.info("[BANK:PERF]", JSON.stringify({
    stage,
    outcome,
    elapsedMs: Math.max(0, Math.round(elapsedMs)),
  }));
}

export function createFrozenBankFallback(question: Question): AIResponse {
  return {
    id: `bank-${question.id}`,
    subject: question.subject as Subject,
    topic: question.topicName,
    difficulty: question.difficulty,
    detectedQuestion: question.question,
    keyConcepts: question.keyConcepts,
    similarQuestions: [],
    steps: question.steps,
    finalAnswer: question.answer,
    source: "bank",
  };
}

export function isValidFrozenBankSolution(
  question: Question | null | undefined,
): question is Question {
  if (
    !question ||
    typeof question.id !== "string" ||
    !question.id.trim() ||
    typeof question.question !== "string" ||
    !question.question.trim() ||
    typeof question.answer !== "string" ||
    !question.answer.trim() ||
    !Array.isArray(question.steps) ||
    question.steps.length === 0
  ) {
    return false;
  }

  return question.steps.every((step) =>
    step != null &&
    [step.title, step.explanation, step.formula, step.result].some(
      (value) => typeof value === "string" && value.trim().length > 0,
    )
  );
}

export function createImmediatePracticeBankFallback(
  question: Question | null | undefined,
): AIResponse | null {
  return isValidFrozenBankSolution(question)
    ? createFrozenBankFallback(question)
    : null;
}

export function getBankAnswerIntegrityNotice(code: string): string | null {
  if (code === "bank_teaching_quality_review_failed") {
    return "The generated lesson did not pass the teaching-quality checks. The original question-bank solution is shown instead.";
  }
  if (
    code === "stream_incomplete_lesson" ||
    code === "bank_lesson_incomplete" ||
    code === "stream_incomplete"
  ) {
    return "The generated lesson was incomplete. The original question-bank solution is shown instead.";
  }
  if (code === "bank_answer_mismatch") {
    return "The generated lesson did not match the approved answer. The original question-bank solution is shown instead.";
  }
  if (code === "bank_answer_unverified") {
    return "The generated lesson could not be verified against the approved answer. The original question-bank solution is shown instead.";
  }
  if (code === "bank_answer_leakage") {
    return "The generated lesson revealed the answer too early. The original question-bank solution is shown instead.";
  }
  if (code === "bank_answer_last_review") {
    return "The generated lesson may reveal the answer too early and could not be verified. The original question-bank solution is shown instead.";
  }
  if (code === "timeout" || code === "stream_interrupted") {
    return "The AI lesson could not finish. The original question-bank solution is shown instead.";
  }
  return null;
}

export function resolveFrozenBankFallback(
  question: Question | null | undefined,
  code: string,
): { response: AIResponse; notice: string } | null {
  const notice = getBankAnswerIntegrityNotice(code);
  if (!notice || !isValidFrozenBankSolution(question)) return null;
  return { response: createFrozenBankFallback(question), notice };
}

export type BankFailureCategory =
  | "bank_teaching_quality_review_failed"
  | "stream_incomplete_lesson"
  | "bank_lesson_incomplete"
  | "stream_incomplete"
  | "bank_answer_unverified"
  | "bank_answer_mismatch"
  | "bank_answer_leakage"
  | "bank_answer_last_review"
  | "timeout"
  | "stream_interrupted";

const BANK_FAILURE_SESSION_KEY_PREFIX = "studyai-bank-failure-v1:";

function isBankFailureCategory(value: unknown): value is BankFailureCategory {
  return value === "bank_teaching_quality_review_failed" ||
    value === "stream_incomplete_lesson" ||
    value === "bank_lesson_incomplete" ||
    value === "stream_incomplete" ||
    value === "bank_answer_unverified" ||
    value === "bank_answer_mismatch" ||
    value === "bank_answer_leakage" ||
    value === "bank_answer_last_review" ||
    value === "timeout" ||
    value === "stream_interrupted";
}

function bankFailureSessionKey(questionId: string): string {
  return `${BANK_FAILURE_SESSION_KEY_PREFIX}${encodeURIComponent(questionId)}`;
}

export function rememberBankFailure(
  questionId: string,
  sourceHash: string,
  category: string,
): void {
  if (!questionId || !sourceHash || !isBankFailureCategory(category)) return;
  try {
    globalThis.sessionStorage.setItem(
      bankFailureSessionKey(questionId),
      JSON.stringify({ questionId, sourceHash, category }),
    );
  } catch {
    // If session storage is unavailable, preserve normal lesson behavior.
  }
}

export function getBankFailureCategory(
  questionId: string,
  sourceHash: string,
): BankFailureCategory | null {
  if (!questionId || !sourceHash) return null;
  const key = bankFailureSessionKey(questionId);

  try {
    const stored = globalThis.sessionStorage.getItem(key);
    if (!stored) return null;

    const marker = JSON.parse(stored) as {
      questionId?: unknown;
      sourceHash?: unknown;
      category?: unknown;
    };
    if (
      marker.questionId !== questionId ||
      typeof marker.sourceHash !== "string" ||
      !isBankFailureCategory(marker.category) ||
      marker.sourceHash !== sourceHash
    ) {
      globalThis.sessionStorage.removeItem(key);
      return null;
    }
    return marker.category;
  } catch {
    try { globalThis.sessionStorage.removeItem(key); } catch {}
    return null;
  }
}

export function clearBankFailureMarker(questionId: string): void {
  if (!questionId) return;
  try {
    globalThis.sessionStorage.removeItem(bankFailureSessionKey(questionId));
  } catch {
    // If session storage is unavailable, preserve normal lesson behavior.
  }
}

export function resolveBankFailureFallback(
  question: Question | null | undefined,
  sourceHash: string,
): { response: AIResponse; notice: string } | null {
  if (!question) return null;
  const category = getBankFailureCategory(question.id, sourceHash);
  return category ? resolveFrozenBankFallback(question, category) : null;
}

export function recordBankFailureFallback(
  question: Question,
  sourceHash: string,
  code: string,
): { response: AIResponse; notice: string } | null {
  const fallback = resolveFrozenBankFallback(question, code);
  if (!fallback) return null;
  rememberBankFailure(question.id, sourceHash, code);
  return fallback;
}

// ─── Backend lesson response shape (mirrors solveQuestion.ts LessonResponse) ──

interface BackendLessonStep {
  what:   string;
  why:    string;
  math:   string;
  result: string;
  pause:  string;
}

interface BackendLessonResponse {
  topic:        string;
  difficulty:   "Easy" | "Medium" | "Hard";
  keyConcepts:  string[];
  aiConfidence: number;

  beforeWeStart: {
    motivator:      string;
    anxietyReducer: string;
    preview:        string;
  };

  prerequisites: string[];
  vocabulary:    { term: string; meaning: string }[];

  intuition: {
    story:    string;
    visual:   string;
    everyday: string;
  };

  questionTranslation: {
    plainEnglish: string;
    whatWeKnow:   string;
    whatWeFind:   string;
    wordToMath:   string;
  };

  teacherThinking: {
    firstNotice:   string;
    whyThisMethod: string;
    clues:         string;
  };

  guidedReasoning: BackendLessonStep[];
  confusionPoints: string[];

  commonMistakes: {
    mistake:      string;
    whyItHappens: string;
    howToAvoid:   string;
  }[];

  examinerThinking: {
    whyAsked:      string;
    conceptTested: string;
    topperInsight: string;
    examTip:       string;
    examTrap:      string;
  };

  finalAnswer: {
    answer:       string;
    whyCorrect:   string;
    verification: string;
  };

  simplerExample: {
    problem:  string;
    solution: string;
  };

  practiceQuestion: {
    question: string;
    hints:    string[];
    solution: string;
  };

  confidenceCheck: {
    question:     string;
    options:      string[];
    correctIndex: number;
    explanation:  string;
  };

  retrievalPractice: string[];
  rememberThese:     string[];
  confidenceBuilder: string;

  cached?: boolean;
}

interface BackendErrorResponse {
  error:       string;
  message?:    string;
  retryAfter?: number;
}

// ─── Progress polling ─────────────────────────────────────────────────────────

/**
 * Polls GET /api/solveQuestion/progress/:requestId every 1.5 s while the main
 * POST is in-flight, calling onProgress with the latest message + percentage.
 * Stops automatically when the provided AbortSignal fires.
 */
async function pollProgress(
  requestId:  string,
  onProgress: (message: string, percent: number) => void,
  signal:     AbortSignal,
): Promise<void> {
  while (!signal.aborted) {
    await new Promise<void>((r) => setTimeout(r, 1_500));
    if (signal.aborted) break;
    try {
      const res = await fetch(`/api/solveQuestion/progress/${encodeURIComponent(requestId)}`, { signal });
      if (res.ok) {
        const data = await res.json() as { message?: unknown; percent?: unknown };
        if (typeof data.message === "string" && typeof data.percent === "number") {
          onProgress(data.message, data.percent);
        }
      }
    } catch {
      // Polling errors are non-fatal — the main POST drives the final state
    }
  }
}

// ─── Backend call ─────────────────────────────────────────────────────────────

const FRONTEND_TIMEOUT_MS = 120_000; // 120 s — well above worst-case ~70 s backend time

async function callBackend(
  subject:         Subject,
  question:        string,
  mode:            ReadingLevel,
  studentContext?: string,
  onProgress?:     (message: string, percent: number) => void,
  intent?:         SolveIntent,
  simplifyContext?: SimplifyContext,
): Promise<BackendLessonResponse> {
  const academicContext = getStoredAcademicContext();
  // Generate a requestId so the backend can key progress entries to this request
  const requestId = (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    ? crypto.randomUUID()
    : `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), FRONTEND_TIMEOUT_MS);

  // Start progress polling concurrently with the main POST request
  let pollAbort: AbortController | null = null;
  if (onProgress) {
    pollAbort = new AbortController();
    void pollProgress(requestId, onProgress, pollAbort.signal);
  }

  let res: Response;
  try {
    res = await fetch("/api/solveQuestion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({
        subject,
        question: question.trim(),
        mode,
        studentContext,
        ...(academicContext ? {
          boardId: academicContext.boardId,
          classNum: academicContext.classNum,
          academicSession: academicContext.academicSession,
        } : {}),
        requestId,
        ...(intent ? { intent } : {}),
        ...(simplifyContext ? { simplifyContext } : {}),
      }),
    });
  } finally {
    clearTimeout(timer);
    pollAbort?.abort(); // Stop polling once the main request finishes
  }

  if (!res.ok) {
    let errBody: BackendErrorResponse = { error: `http_${res.status}` };
    try { errBody = (await res.json()) as BackendErrorResponse; } catch {}

    const code = errBody.error ?? "";
    if (code === "simplify_unchanged" || code === "simplify_level_mismatch") throw new Error(code);
    if (res.status === 429 || code.includes("rate_limit")) throw new Error("rate_limit");
    if (res.status === 503 || code === "no_key")           throw new Error("no_key");
    if (res.status === 503 || code === "invalid_key")      throw new Error("invalid_key");
    if (res.status === 504 || code === "timeout")          throw new Error("aborted");
    throw new Error(`backend_${res.status}`);
  }

  return res.json() as Promise<BackendLessonResponse>;
}

// ─── Parse backend → AIResponse ───────────────────────────────────────────────

function s(v: unknown): string { return typeof v === "string" ? v.trim() : ""; }

export function toAIResponse(data: BackendLessonResponse, subject: Subject, question: string): AIResponse {
  const lesson: TeachingLesson = {
    topic:        s(data.topic) || "General",
    difficulty:   data.difficulty || "Medium",
    keyConcepts:  Array.isArray(data.keyConcepts)  ? data.keyConcepts.filter(Boolean)  : [],
    aiConfidence: typeof data.aiConfidence === "number" ? data.aiConfidence : 0.8,

    beforeWeStart: {
      motivator:      s(data.beforeWeStart?.motivator),
      anxietyReducer: s(data.beforeWeStart?.anxietyReducer),
      preview:        s(data.beforeWeStart?.preview),
    },

    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites.filter(Boolean) : [],
    vocabulary:    Array.isArray(data.vocabulary)
      ? data.vocabulary
          .filter((v) => v && typeof v.term === "string")
          .map((v) => ({ term: v.term.trim(), meaning: s(v.meaning) }))
      : [],

    intuition: {
      story:    s(data.intuition?.story),
      visual:   s(data.intuition?.visual),
      everyday: s(data.intuition?.everyday),
    },

    questionTranslation: {
      plainEnglish: s(data.questionTranslation?.plainEnglish),
      whatWeKnow:   s(data.questionTranslation?.whatWeKnow),
      whatWeFind:   s(data.questionTranslation?.whatWeFind),
      wordToMath:   s(data.questionTranslation?.wordToMath),
    },

    teacherThinking: {
      firstNotice:   s(data.teacherThinking?.firstNotice),
      whyThisMethod: s(data.teacherThinking?.whyThisMethod),
      clues:         s(data.teacherThinking?.clues),
    },

    guidedReasoning: Array.isArray(data.guidedReasoning)
      ? data.guidedReasoning.map((st) => ({
          what:   s(st.what),
          why:    s(st.why),
          math:   s(st.math),
          result: s(st.result),
          pause:  s(st.pause),
        }))
      : [],

    confusionPoints: Array.isArray(data.confusionPoints) ? data.confusionPoints.filter(Boolean) : [],

    commonMistakes: Array.isArray(data.commonMistakes)
      ? data.commonMistakes
          .filter((m) => m && typeof m.mistake === "string")
          .map((m) => ({
            mistake:      s(m.mistake),
            whyItHappens: s(m.whyItHappens),
            howToAvoid:   s(m.howToAvoid),
          }))
      : [],

    examinerThinking: {
      whyAsked:      s(data.examinerThinking?.whyAsked),
      conceptTested: s(data.examinerThinking?.conceptTested),
      topperInsight: s(data.examinerThinking?.topperInsight),
      examTip:       s(data.examinerThinking?.examTip),
      examTrap:      s(data.examinerThinking?.examTrap),
    },

    finalAnswer: {
      answer:       s(data.finalAnswer?.answer) || "See guided reasoning above.",
      whyCorrect:   s(data.finalAnswer?.whyCorrect),
      verification: s(data.finalAnswer?.verification),
    },

    simplerExample: {
      problem:  s(data.simplerExample?.problem),
      solution: s(data.simplerExample?.solution),
    },

    practiceQuestion: {
      question: s(data.practiceQuestion?.question),
      hints:    Array.isArray(data.practiceQuestion?.hints)
                  ? data.practiceQuestion.hints.filter(Boolean).slice(0, 3)
                  : [],
      solution: s(data.practiceQuestion?.solution),
    },

    confidenceCheck: {
      question:     s(data.confidenceCheck?.question),
      options:      Array.isArray(data.confidenceCheck?.options)
                      ? data.confidenceCheck.options.slice(0, 4).map(s)
                      : [],
      correctIndex: typeof data.confidenceCheck?.correctIndex === "number"
                      ? data.confidenceCheck.correctIndex : 0,
      explanation:  s(data.confidenceCheck?.explanation),
    },

    retrievalPractice: Array.isArray(data.retrievalPractice) ? data.retrievalPractice.filter(Boolean) : [],
    rememberThese:     Array.isArray(data.rememberThese)     ? data.rememberThese.filter(Boolean)     : [],
    confidenceBuilder: s(data.confidenceBuilder),
  };

  // ── Normalise required sections ─────────────────────────────────────────────
  // LessonRenderer.show flags are now mode-only (not data-dependent), so every
  // mode-specific section must have at least placeholder content here.
  if (lesson.keyConcepts.length === 0) {
    lesson.keyConcepts = [lesson.topic];
  }
  if (!lesson.intuition.story && !lesson.intuition.visual && !lesson.intuition.everyday) {
    lesson.intuition.story =
      `${lesson.topic} connects to principles you already know — each step here builds on familiar ground.`;
  }
  if (!lesson.questionTranslation.plainEnglish) {
    lesson.questionTranslation.plainEnglish =
      question.length > 10 ? question.slice(0, 200).trim() : `Solve this ${lesson.topic} problem step by step.`;
  }
  if (lesson.commonMistakes.length === 0) {
    lesson.commonMistakes = [{
      mistake:      "Arithmetic or sign errors",
      whyItHappens: "Rushing through calculations without checking each step",
      howToAvoid:   "Write each step clearly and verify your working before moving on.",
    }];
  }
  if (!lesson.simplerExample.problem) {
    lesson.simplerExample = {
      problem:  `Apply the same method to a simpler ${lesson.topic} question.`,
      solution: "Follow the same guided steps shown in the solution above.",
    };
  }
  if (!lesson.practiceQuestion.question) {
    lesson.practiceQuestion = {
      question: `Practise the same technique on a similar ${lesson.topic} problem.`,
      hints:    ["Re-read the steps above", "Identify what you know and what you need to find", "Apply the same method."],
      solution: "Follow the same guided reasoning shown in the solution.",
    };
  }
  if (lesson.rememberThese.length === 0) {
    lesson.rememberThese = lesson.keyConcepts.slice(0, 2).map((c) => `Key idea: ${c}`);
  }

  // Flatten a few lesson fields onto AIResponse for backward-compat with
  // analytics, student model, and other engines that read these top-level fields.
  const mistakeStrings = lesson.commonMistakes.map(
    (m) => `❌ ${m.mistake} — ${m.howToAvoid}`
  );

  return {
    id:               `ai-${Date.now()}`,
    subject,
    topic:            lesson.topic,
    difficulty:       lesson.difficulty,
    detectedQuestion: question,
    keyConcepts:      lesson.keyConcepts,
    similarQuestions: [],
    source:           "openai",
    lesson,

    // Legacy fields populated from lesson for analytics compatibility
    steps:            [],
    finalAnswer:      lesson.finalAnswer.answer,
    prerequisites:    lesson.prerequisites,
    examTrap:         lesson.examinerThinking.examTrap  || undefined,
    examTip:          lesson.examinerThinking.examTip   || undefined,
    verification:     lesson.finalAnswer.verification   || undefined,
    commonMistakes:   mistakeStrings.length > 0 ? mistakeStrings : undefined,
    confidence:       lesson.aiConfidence,
  };
}

// ─── Error descriptions ───────────────────────────────────────────────────────

export function describeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("rate_limit"))   return "Rate limit reached — try again later.";
  if (msg.includes("no_key"))       return "OpenAI API key not configured on server.";
  if (msg.includes("invalid_key"))  return "OpenAI API key is invalid — contact support.";
  if (msg.includes("aborted") || msg.includes("timeout"))
                                    return "AI request timed out — showing question bank solution.";
  if (msg.includes("question_too_short")) return "Question too short for AI solving.";
  return "AI unavailable — showing question bank solution.";
}

// ─── Public API ───────────────────────────────────────────────────────────────

const MIN_QUESTION_CHARS = 10;

// ─── Dev fixture call (no API key needed) ─────────────────────────────────────

export async function callDevLesson(): Promise<BackendLessonResponse> {
  const res = await fetch("/api/devLesson", { method: "GET" });
  if (!res.ok) throw new Error(`devLesson_${res.status}`);
  return res.json() as Promise<BackendLessonResponse>;
}

// ─── SSE streaming support ────────────────────────────────────────────────────

interface StreamEvent {
  type:            "section" | "done" | "cached" | "error";
  field?:          string;
  index?:          number;
  value?:          unknown;
  lesson?:         BackendLessonResponse;
  firstContentMs?: number;
  totalLatencyMs?: number;
  promptTokens?:   number;
  completionTokens?: number;
  code?:           string;
  message?:        string;
}

/**
 * Build a partial BackendLessonResponse from accumulated streaming sections.
 * Only includes fields that have actually been received.
 */
function buildPartialData(sections: Map<string, unknown>): Partial<BackendLessonResponse> {
  const d: Partial<BackendLessonResponse> = {};
  if (sections.has("topic"))              d.topic        = sections.get("topic") as string;
  if (sections.has("difficulty"))         d.difficulty   = sections.get("difficulty") as BackendLessonResponse["difficulty"];
  if (sections.has("keyConcepts"))        d.keyConcepts  = sections.get("keyConcepts") as string[];
  if (sections.has("aiConfidence"))       d.aiConfidence = sections.get("aiConfidence") as number;
  if (sections.has("questionTranslation")) d.questionTranslation = sections.get("questionTranslation") as BackendLessonResponse["questionTranslation"];
  if (sections.has("finalAnswer"))        d.finalAnswer  = sections.get("finalAnswer") as BackendLessonResponse["finalAnswer"];

  const steps: BackendLessonStep[] = [];
  // Support up to 8 steps — Detailed/bank mode uses 6–8; Standard uses 4.
  for (let i = 0; i < 8; i++) {
    const step = sections.get(`step_${i}`);
    if (step) steps.push(step as BackendLessonStep);
  }
  if (steps.length > 0) d.guidedReasoning = steps;

  return d;
}

/**
 * Stream a Standard-mode lesson from the backend SSE endpoint.
 * Calls onSection for each complete field as it arrives.
 * Returns the final complete BackendLessonResponse from the "done" event.
 */
async function callBackendStream(
  subject:         Subject,
  question:        string,
  mode:            ReadingLevel,
  studentContext?: string,
  onSection?:      (ev: { field: string; index?: number; value: unknown }) => void,
): Promise<BackendLessonResponse> {
  const academicContext = getStoredAcademicContext();
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), FRONTEND_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/solveQuestion/stream", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({
        subject, question: question.trim(), mode, studentContext,
        ...(academicContext ? {
          boardId: academicContext.boardId,
          classNum: academicContext.classNum,
          academicSession: academicContext.academicSession,
        } : {}),
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let errBody: BackendErrorResponse = { error: `http_${res.status}` };
    try { errBody = (await res.json()) as BackendErrorResponse; } catch {}
    const code = errBody.error ?? "";
    if (res.status === 429 || code.includes("rate_limit")) throw new Error("rate_limit");
    if (code === "no_key")      throw new Error("no_key");
    if (code === "invalid_key") throw new Error("invalid_key");
    throw new Error(`backend_${res.status}`);
  }

  const reader     = res.body!.getReader();
  const decoder    = new TextDecoder();
  let   lineBuf    = "";
  let   finalLesson: BackendLessonResponse | null = null;

  try {
    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lineBuf += decoder.decode(value, { stream: true });
      const lines = lineBuf.split("\n");
      lineBuf = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let event: StreamEvent;
        try { event = JSON.parse(raw) as StreamEvent; } catch { continue; }

        if (event.type === "section" && event.field && onSection) {
          onSection({ field: event.field, index: event.index, value: event.value });
        } else if (event.type === "done") {
          finalLesson = event.lesson as BackendLessonResponse;
          break outer;
        } else if (event.type === "cached") {
          finalLesson = event.lesson as BackendLessonResponse;
          break outer;
        } else if (event.type === "error") {
          throw new Error(event.code ?? "stream_error");
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  if (!finalLesson) throw new Error("stream_incomplete");
  return finalLesson;
}

// ─── Bank question streaming ──────────────────────────────────────────────────
//
// Bank questions use a separate streaming path:
//   1. Solution.tsx checks the validated saved lesson, then localStorage cache.
//   2. Cache miss → POST /api/solveQuestion/stream with mode:"basic" + bankContext
//      Backend skips blueprint planning, then performs one fail-closed academic
//      review (generic improvement is disabled) before caching the full lesson.
//   3. Progressive partial renders via onPartial as SSE sections arrive
//   4. Cache the completed lesson by questionId for future instant loads
//   5. One lesson serves all 3 teaching modes — mode switching is zero AI calls
//
// Speed contract: first content ≤2 s (trigger on keyConcepts or first step),
//                 full lesson ≤10 s, cache hit ≤50 ms.

export interface BankQuestionContext {
  questionId:  string;
  sourceHash:  string;
  boardId:     BoardId;
  classNum:    number;
  subject:     string;
  canonicalChapterId: string | null;
  academicSession?: string;
  answer:      string;
  hint:        string;
  steps:       { title: string; explanation: string; formula?: string; result?: string }[];
  keyConcepts: string[];
}

/**
 * Stream a bank question lesson from the backend.
 * Posts bankContext as authoritative grounding; backend generates a full
 * Detailed-mode TeachingLesson without running the quality pipeline.
 */
async function callBankStream(
  subject:     Subject,
  question:    string,
  bankContext: BankQuestionContext,
  onSection?:  (ev: { field: string; index?: number; value: unknown }) => void,
): Promise<BackendLessonResponse> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), FRONTEND_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/solveQuestion/stream", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({
        subject,
        question:    question.trim(),
        mode:        "basic",    // Full Detailed schema → all sections → all 3 modes work
        boardId:     bankContext.boardId,
        classNum:    bankContext.classNum,
        academicSession: bankContext.academicSession,
        bankContext,             // Authoritative grounding: frozen answer, steps, hint
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let errBody: BackendErrorResponse = { error: `http_${res.status}` };
    try { errBody = (await res.json()) as BackendErrorResponse; } catch {}
    const code = errBody.error ?? "";
    if (res.status === 504 || code === "timeout") throw new Error("timeout");
    if (code === "stream_interrupted") throw new Error("stream_interrupted");
    if (res.status === 429 || code.includes("rate_limit")) throw new Error("rate_limit");
    if (code === "no_key")      throw new Error("no_key");
    if (code === "invalid_key") throw new Error("invalid_key");
    throw new Error(`backend_${res.status}`);
  }

  const reader     = res.body!.getReader();
  const decoder    = new TextDecoder();
  let   lineBuf    = "";
  let   finalLesson: BackendLessonResponse | null = null;

  try {
    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      lineBuf += decoder.decode(value, { stream: true });
      const lines = lineBuf.split("\n");
      lineBuf = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (!raw) continue;

        let event: StreamEvent;
        try { event = JSON.parse(raw) as StreamEvent; } catch { continue; }

        if (event.type === "section" && event.field && onSection) {
          onSection({ field: event.field, index: event.index, value: event.value });
        } else if (event.type === "done") {
          finalLesson = event.lesson as BackendLessonResponse;
          break outer;
        } else if (event.type === "cached") {
          finalLesson = event.lesson as BackendLessonResponse;
          break outer;
        } else if (event.type === "error") {
          throw new Error(event.code ?? "stream_error");
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  if (!finalLesson) throw new Error("stream_incomplete");
  return finalLesson;
}

/**
 * Stream a bank question after Solution.tsx has checked saved and browser caches.
 * Calls onPartial progressively as SSE sections arrive so the student sees
 * content within ~1 s. Returns the complete AIResponse and stores it after
 * canonical-answer and answer-last checks pass.
 */
export async function solveBankWithStream(
  subject:     Subject,
  question:    string,
  bankContext: BankQuestionContext,
  onPartial:   (partial: AIResponse) => void,
): Promise<AIResponse> {
  // Stable ID shared across partial and final renders — prevents SolutionCard remount
  const streamId = `bank-${bankContext.boardId}-${bankContext.classNum}-${bankContext.questionId}`;

  const sectionMap      = new Map<string, unknown>();
  let   firstMeaningful = false;

  const data = await callBankStream(
    subject, question, bankContext,
    (sec) => {
      const key = sec.field === "step" ? `step_${sec.index ?? 0}` : sec.field;
      sectionMap.set(key, sec.value);

      // Trigger first partial render on keyConcepts (arrives early, ~300–500 ms)
      // or the first step, whichever comes first.
      if (!firstMeaningful) {
        const isEarly = sec.field === "keyConcepts" || sec.field === "step";
        if (isEarly) firstMeaningful = true;
      }

      if (firstMeaningful) {
        const partialData = buildPartialData(sectionMap);
        const partial     = toAIResponse(partialData as BackendLessonResponse, subject, question);
        // Suppress placeholder practice question during partial renders
        if (partial.lesson) {
          partial.lesson.practiceQuestion.question = "";
          partial.lesson.practiceQuestion.hints    = [];
          partial.lesson.practiceQuestion.solution = "";
        }
        onPartial({ ...partial, id: streamId, source: "bank" });
      }
    },
  );

  const result: AIResponse = { ...toAIResponse(data, subject, question), id: streamId, source: "bank" };
  assertBankAnswer(
    result,
    bankContext.answer,
    answerLastContextFor(question, bankContext.steps),
  );
  cacheBankLesson(bankContext.questionId, bankContext, result, question);
  return result;
}

/**
 * Keep the Solution page in its loading state while a bank lesson streams.
 * Partial SSE sections are useful to other callers, but must not replace the
 * legacy fallback with an incomplete TeachingLesson in the student display.
 */
export async function awaitFinalBankLesson(
  runStream: (onPartial: (partial: AIResponse) => void) => Promise<AIResponse>,
  canonicalAnswer: string,
  answerLastContext?: AnswerLastContext,
): Promise<AIResponse> {
  const result = await runStream(() => undefined);
  if (!isBankLessonComplete(result)) {
    throw new Error("bank_lesson_incomplete");
  }
  assertBankAnswer(
    result,
    canonicalAnswer,
    answerLastContext ?? answerLastContextFor(result.detectedQuestion),
  );
  return result;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function solveWithOpenAI(
  subject:     Subject,
  question:    string,
  onProgress?: (message: string, percent: number) => void,
  intent?:     SolveIntent,
  onPartial?:  (partial: AIResponse) => void,
  simplifyContext?: SimplifyContext,
): Promise<AIResponse> {
  // ── Dev audit path: bypass API key, return hardcoded fixture ──────────────
  // Must be checked BEFORE the min-length guard.
  if (question.trim() === "[AUDIT]") {
    const raw = await callDevLesson();
    const mapped = toAIResponse(raw, subject, question.trim());
    return mapped;
  }

  // Read the stored mode so the backend generates only the sections this mode needs.
  const mode = getStoredLevel();

  // Simplify variants are reused only after client-side verification. Any
  // simplify request reaching this solver must be fresh; a normal lesson-cache
  // entry must never satisfy an intent-specific regeneration.
  if (!intent) {
    const cached = getCachedSolution(subject, question, mode);
    if (cached) {
      return { ...cached, detectedQuestion: question };
    }
  }

  // Build student context for personalised AI response
  const studentContext = buildStudentContext(subject);

  // ── Streaming path: Standard mode, no intent, onPartial provided ──────────
  // For fresh uncached Standard questions: stream sections progressively so
  // the student sees meaningful content within ≤3 s.
  if (mode === "standard" && !intent && onPartial) {
    // Stable ID shared across all partial updates AND the final result so the
    // SolutionCard never remounts during streaming.
    const streamId        = `ai-${Date.now()}`;
    const sectionMap      = new Map<string, unknown>();
    let   firstMeaningful = false;
    // Tracks whether the server has started emitting OpenAI content.
    // Set to true on the first section event — meaning tokens are being consumed.
    let   generationStarted = false;

    try {
      const data = await callBackendStream(
        subject, question, mode, studentContext || undefined,
        (sec) => {
          // Mark generation as in-progress on the first section received.
          // Used in the catch block to prevent a second AI call on stream failure.
          generationStarted = true;

          const key = sec.field === "step" ? `step_${sec.index ?? 0}` : sec.field;
          sectionMap.set(key, sec.value);

          // Trigger first partial render on: the first step, or a non-empty
          // questionTranslation (lesson intro visible before step 1 arrives).
          if (!firstMeaningful) {
            const isStep = sec.field === "step";
            const isQT   = sec.field === "questionTranslation" &&
                           !!(sec.value as { plainEnglish?: string })?.plainEnglish;
            if (isStep || isQT) firstMeaningful = true;
          }

          if (firstMeaningful) {
            const partialData = buildPartialData(sectionMap);
            const partial     = toAIResponse(partialData as BackendLessonResponse, subject, question);
            // Suppress the default practice-question placeholder for partial renders
            if (partial.lesson) {
              partial.lesson.practiceQuestion.question = "";
              partial.lesson.practiceQuestion.hints    = [];
              partial.lesson.practiceQuestion.solution = "";
            }
            onPartial({ ...partial, id: streamId });
          }
        },
      );

      const result = toAIResponse(data, subject, question);
      if (!intent) cacheSolution(subject, question, mode, result);
      // Return final result with the same stable ID so React does not remount the card.
      return { ...result, id: streamId };

    } catch (err) {
      if (generationStarted) {
        // OpenAI was already generating (tokens consumed).  Do NOT fall through to
        // callBackend() — that would trigger a second full OpenAI generation for
        // the same question.  Re-throw so aiSolver goes to its bank fallback path
        // (Path C, zero additional AI calls).
        console.warn("[STREAM] stream failed after generation started — re-throwing to prevent second AI call:", String(err));
        throw err;
      }
      // Pre-generation failure (HTTP 4xx/5xx, network error, auth error).
      // No OpenAI tokens were consumed, so falling back to the regular route is safe.
      console.warn("[STREAM] pre-generation SSE failure, falling back to regular call:", String(err));
      // Fall through to regular callBackend below.
    }
  }

  // ── Regular (non-streaming) path ──────────────────────────────────────────
  // Backend call — passes mode so the server generates only the required sections
  const data = await callBackend(
    subject,
    question,
    mode,
    studentContext || undefined,
    onProgress,
    intent,
    simplifyContext,
  );

  const result = toAIResponse(data, subject, question);

  // Intent-specific lessons are transient and must not replace or share the
  // normal lesson cache entry.
  if (!intent) cacheSolution(subject, question, mode, result);

  return result;
}
