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
import type { AIResponse, TeachingLesson } from "@/data/solutionBank";
import { buildStudentContext }             from "@/services/studentModel";

// ─── Availability check ───────────────────────────────────────────────────────

export function isOpenAIAvailable(): boolean {
  return true;
}

// ─── Client-side localStorage cache ──────────────────────────────────────────

const CACHE_STORE_KEY = "studyai-ai-cache-v2"; // bumped — new lesson schema
const CACHE_TTL_MS    = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  response:  AIResponse;
  timestamp: number;
}

function hashKey(subject: string, question: string): string {
  const raw = `${subject}::${question.trim().toLowerCase()}`;
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

export function getCachedSolution(subject: string, question: string): AIResponse | null {
  const store = readCache();
  const entry = store[hashKey(subject, question)];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    delete store[hashKey(subject, question)];
    writeCache(store);
    return null;
  }
  return entry.response;
}

function cacheSolution(subject: string, question: string, response: AIResponse): void {
  const store = readCache();
  const now   = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[hashKey(subject, question)] = { response, timestamp: now };
  writeCache(store);
}

export function clearAICache(): void {
  localStorage.removeItem(CACHE_STORE_KEY);
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

// ─── Backend call ─────────────────────────────────────────────────────────────

const FRONTEND_TIMEOUT_MS = 38_000;

async function callBackend(
  subject:        Subject,
  question:       string,
  studentContext?: string
): Promise<BackendLessonResponse> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), FRONTEND_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/solveQuestion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({ subject, question: question.trim(), studentContext }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let errBody: BackendErrorResponse = { error: `http_${res.status}` };
    try { errBody = (await res.json()) as BackendErrorResponse; } catch {}

    const code = errBody.error ?? "";
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

// ─── Public API ─────────────────────────────────────────────────────────────

export async function solveWithOpenAI(
  subject:  Subject,
  question: string
): Promise<AIResponse> {
  console.log(`[PIPELINE:B1] solveWithOpenAI() — subject="${subject}" q="${question.slice(0, 80)}"`);

  // ── Dev audit path: bypass API key, return hardcoded fixture ──────────────
  // Must be checked BEFORE the min-length guard.
  if (question.trim() === "[AUDIT]") {
    console.log("[PIPELINE:B2] AUDIT MODE — calling GET /api/devLesson (no API key needed)");
    const raw = await callDevLesson();
    console.log("[PIPELINE:B3-RAW] devLesson raw JSON:", JSON.stringify(raw, null, 2));
    const mapped = toAIResponse(raw, subject, question.trim());
    console.log(`[PIPELINE:B4-MAPPED] AIResponse after toAIResponse():
  source   = "${mapped.source}"
  topic    = "${mapped.topic}"
  lesson   = ${!!mapped.lesson}
  keyConcepts = [${mapped.lesson?.keyConcepts.join(", ")}]
  guidedReasoning steps = ${mapped.lesson?.guidedReasoning.length}
  confusionPoints = ${mapped.lesson?.confusionPoints.length}
  commonMistakes  = ${mapped.lesson?.commonMistakes.length}
  practiceQuestion present = ${!!mapped.lesson?.practiceQuestion.question}
  confidenceCheck present  = ${!!mapped.lesson?.confidenceCheck.question}
  retrievalPractice items  = ${mapped.lesson?.retrievalPractice.length}
  rememberThese items      = ${mapped.lesson?.rememberThese.length}
  confidenceBuilder present = ${!!mapped.lesson?.confidenceBuilder}`);
    return mapped;
  }

  // Client-side cache hit → instant, no network
  const cached = getCachedSolution(subject, question);
  if (cached) {
    console.log("[PIPELINE:B2] HIT — localStorage cache → returning cached AIResponse, no backend call");
    return { ...cached, detectedQuestion: question };
  }
  console.log("[PIPELINE:B2] MISS — localStorage cache empty → calling backend POST /api/solveQuestion");

  // Build student context for personalised AI response
  const studentContext = buildStudentContext(subject);
  console.log(`[PIPELINE:B3] studentContext built — length=${studentContext?.length ?? 0} chars`);

  // Backend call
  console.log("[PIPELINE:B4] START — fetch POST /api/solveQuestion");
  const data = await callBackend(subject, question, studentContext || undefined);
  console.log(`[PIPELINE:B5-RAW] backend raw response:
  topic            = "${data.topic}"
  difficulty       = "${data.difficulty}"
  keyConcepts      = [${data.keyConcepts?.join(", ")}]
  guidedReasoning  = ${data.guidedReasoning?.length ?? 0} steps
  confusionPoints  = ${data.confusionPoints?.length ?? 0}
  commonMistakes   = ${data.commonMistakes?.length ?? 0}
  practiceQuestion = "${data.practiceQuestion?.question?.slice(0, 60)}…"
  confidenceCheck  = "${data.confidenceCheck?.question?.slice(0, 60)}…"
  retrievalPractice= ${data.retrievalPractice?.length ?? 0} items
  rememberThese    = ${data.rememberThese?.length ?? 0} items`);

  const result = toAIResponse(data, subject, question);
  console.log(`[PIPELINE:B6-MAPPED] AIResponse after mapping:
  source  = "${result.source}"
  lesson  = ${!!result.lesson}
  topic   = "${result.topic}"
  guidedReasoning steps = ${result.lesson?.guidedReasoning.length ?? 0}`);

  // Store in client-side cache
  cacheSolution(subject, question, result);
  console.log("[PIPELINE:B7] response stored in localStorage cache");

  return result;
}
