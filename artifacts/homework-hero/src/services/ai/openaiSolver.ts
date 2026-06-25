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
 * Migration:
 *  - Change model / provider: update `artifacts/api-server/src/routes/solveQuestion.ts` only.
 *  - This file does NOT need to change for model upgrades.
 */

import type { Subject }               from "@/data/subjects";
import type { AIResponse, SolutionStep } from "@/data/solutionBank";

// ─── Availability check ───────────────────────────────────────────────────────

/**
 * The backend always exists; availability is determined server-side.
 * Returns true so the orchestrator (aiSolver.ts) always tries the backend
 * for questions with no bank match. The server returns a clean 503 if
 * OPENAI_API_KEY is not configured.
 */
export function isOpenAIAvailable(): boolean {
  return true;
}

// ─── Client-side localStorage cache ──────────────────────────────────────────

const CACHE_STORE_KEY = "studyai-ai-cache";
const CACHE_TTL_MS    = 7 * 24 * 60 * 60 * 1000; // 7 days

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
  // Evict stale entries
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[hashKey(subject, question)] = { response, timestamp: now };
  writeCache(store);
}

export function clearAICache(): void {
  localStorage.removeItem(CACHE_STORE_KEY);
}

// ─── Backend response shape ───────────────────────────────────────────────────

interface BackendSolveResponse {
  topic:                  string;
  difficulty:             "Easy" | "Medium" | "Hard";
  prerequisites?:         string[];
  conceptExplanation?:    string;
  questionUnderstanding?: string;
  wordToMath?:            string;
  thinkingProcess?:       string;
  visualThinking?:        string;
  steps: Array<{
    stepNumber:   number;
    title:        string;
    explanation:  string;
    whyThisStep?: string;
    formula?:     string;
    result?:      string;
  }>;
  finalAnswer:          string;
  verification?:        string;
  confusionPoint?:      string;
  examTrap?:            string;
  examTip?:             string;
  memoryShortcut?:      string[];
  similarExample?:      { problem: string; solution: string };
  checkUnderstanding?:  { question: string; answer: string };
  confidenceCheck?:     {
    question:     string;
    options:      string[];
    correctIndex: number;
    explanation:  string;
  };
  keyConcepts:          string[];
  commonMistakes:       string[];
  deeperExplanation?:   string;
  additionalExamples?:  string[];
  confidence:           number;
  cached?:              boolean;
  conceptualQuestions?: string[];
  learningSummary?:     string[];
  rememberThis?: {
    examTips:     string[];
    memoryTricks: string[];
    observations: string[];
  };
}

interface BackendErrorResponse {
  error:    string;
  message?: string;
  retryAfter?: number;
}

// ─── Backend call ─────────────────────────────────────────────────────────────

const FRONTEND_TIMEOUT_MS = 35_000; // slightly longer than backend's 30 s (V3.0)

async function callBackend(subject: Subject, question: string): Promise<BackendSolveResponse> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), FRONTEND_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch("/api/solveQuestion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({ subject, question: question.trim() }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    let errBody: BackendErrorResponse = { error: `http_${res.status}` };
    try { errBody = (await res.json()) as BackendErrorResponse; } catch {}

    // Map known error codes to thrown error messages the orchestrator understands
    const code = errBody.error ?? "";
    if (res.status === 429 || code.includes("rate_limit")) throw new Error("rate_limit");
    if (res.status === 503 || code === "no_key")           throw new Error("no_key");
    if (res.status === 503 || code === "invalid_key")      throw new Error("invalid_key");
    if (res.status === 504 || code === "timeout")          throw new Error("aborted");
    throw new Error(`backend_${res.status}`);
  }

  return res.json() as Promise<BackendSolveResponse>;
}

// ─── Parse backend → AIResponse ───────────────────────────────────────────────

function toAIResponse(data: BackendSolveResponse, subject: Subject, question: string): AIResponse {
  const steps: SolutionStep[] = (data.steps ?? []).map((s, i) => ({
    stepNumber:  s.stepNumber ?? i + 1,
    title:       s.title?.trim()       || `Step ${i + 1}`,
    explanation: s.explanation?.trim() || "",
    ...(s.whyThisStep ? { whyThisStep: s.whyThisStep.trim() } : {}),
    ...(s.formula     ? { formula:     s.formula.trim()     } : {}),
    ...(s.result      ? { result:      s.result.trim()      } : {}),
  }));

  const cc = data.confidenceCheck;

  return {
    id:                    `ai-${Date.now()}`,
    subject,
    topic:                 data.topic     || "General",
    difficulty:            data.difficulty || "Medium",
    detectedQuestion:      question,
    steps,
    finalAnswer:           data.finalAnswer || "See steps above.",
    prerequisites:         (data.prerequisites     ?? []).filter(Boolean),
    conceptExplanation:    data.conceptExplanation?.trim()    || undefined,
    questionUnderstanding: data.questionUnderstanding?.trim() || undefined,
    wordToMath:            data.wordToMath?.trim()            || undefined,
    thinkingProcess:       data.thinkingProcess?.trim()       || undefined,
    visualThinking:        data.visualThinking?.trim()        || undefined,
    verification:          data.verification?.trim()          || undefined,
    confusionPoint:        data.confusionPoint?.trim()        || undefined,
    examTrap:              data.examTrap?.trim()              || undefined,
    examTip:               data.examTip?.trim()               || undefined,
    memoryShortcut:        (data.memoryShortcut ?? []).filter(Boolean),
    similarExample:        data.similarExample?.problem
                             ? { problem: data.similarExample.problem.trim(), solution: (data.similarExample.solution ?? "").trim() }
                             : undefined,
    checkUnderstanding:    data.checkUnderstanding?.question
                             ? { question: data.checkUnderstanding.question.trim(), answer: (data.checkUnderstanding.answer ?? "").trim() }
                             : undefined,
    confidenceCheck:       cc?.question && Array.isArray(cc.options) && cc.options.length === 4
                             ? { question: cc.question.trim(), options: cc.options, correctIndex: cc.correctIndex ?? 0, explanation: (cc.explanation ?? "").trim() }
                             : undefined,
    deeperExplanation:     data.deeperExplanation?.trim()    || undefined,
    additionalExamples:    (data.additionalExamples ?? []).filter(Boolean),
    keyConcepts:           (data.keyConcepts        ?? []).filter(Boolean),
    commonMistakes:        (data.commonMistakes     ?? []).filter(Boolean),
    conceptualQuestions:   (data.conceptualQuestions ?? []).filter(Boolean),
    learningSummary:       (data.learningSummary     ?? []).filter(Boolean),
    rememberThis:          data.rememberThis?.examTips?.length
                             ? {
                                 examTips:     (data.rememberThis.examTips     ?? []).filter(Boolean),
                                 memoryTricks: (data.rememberThis.memoryTricks ?? []).filter(Boolean),
                                 observations: (data.rememberThis.observations ?? []).filter(Boolean),
                               }
                             : undefined,
    similarQuestions:      [],
    source:                "openai",
    confidence:            data.confidence ?? 0.8,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

const MIN_QUESTION_CHARS = 10;

/** Human-readable error descriptions for the loading screen. */
export function describeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("rate_limit"))       return "Rate limit reached — try again later.";
  if (msg.includes("no_key"))           return "OpenAI API key not configured on server.";
  if (msg.includes("invalid_key"))      return "OpenAI API key is invalid — contact support.";
  if (msg.includes("aborted") || msg.includes("timeout"))
                                        return "AI request timed out — showing question bank solution.";
  if (msg.includes("question_too_short")) return "Question too short for AI solving.";
  return "AI unavailable — showing question bank solution.";
}

/**
 * Solve a question via the backend AI proxy.
 * Throws on all error cases so the orchestrator in `aiSolver.ts` can fall back.
 */
export async function solveWithOpenAI(
  subject: Subject,
  question: string
): Promise<AIResponse> {
  if (question.trim().length < MIN_QUESTION_CHARS) {
    throw new Error("question_too_short");
  }

  // 1. Client-side cache hit → instant, no network
  const cached = getCachedSolution(subject, question);
  if (cached) return { ...cached, detectedQuestion: question };

  // 2. Backend call
  const data   = await callBackend(subject, question);
  const result = toAIResponse(data, subject, question);

  // 3. Store in client-side cache
  cacheSolution(subject, question, result);

  return result;
}
