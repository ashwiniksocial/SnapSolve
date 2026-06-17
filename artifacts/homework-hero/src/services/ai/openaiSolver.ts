/**
 * OpenAI Solver — calls the Chat Completions API to generate a full AIResponse.
 *
 * Architecture:
 *  1. Check cache first (localStorage, 7-day TTL).
 *  2. Build a subject-specific system prompt.
 *  3. Call gpt-4o-mini with a 15-second timeout.
 *  4. Parse and validate the JSON response.
 *  5. On any failure (timeout / rate-limit / parse error), propagate the error
 *     so the caller can fall back gracefully.
 *
 * Model upgrade: change MODEL constant only.
 * Provider swap: replace `callOpenAI` body — types stay identical.
 */

import type { Subject } from "@/data/subjects";
import type { AIResponse, SolutionStep } from "@/data/solutionBank";

// ─── Config ──────────────────────────────────────────────────────────────────

const API_URL    = "https://api.openai.com/v1/chat/completions";
const MODEL      = "gpt-4o-mini";
const TIMEOUT_MS = 15_000;

// Vite exposes VITE_-prefixed env vars to the browser
function apiKey(): string {
  return (import.meta.env.VITE_OPENAI_API_KEY as string | undefined) ?? "";
}

export function isOpenAIAvailable(): boolean {
  return apiKey().startsWith("sk-");
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_STORE_KEY = "studyai-ai-cache";
const CACHE_TTL_MS    = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  response:  AIResponse;
  timestamp: number;
}

function hashKey(subject: string, question: string): string {
  const raw = `${subject}::${question.trim().toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  }
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
  // Evict stale entries while we're here
  const now = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].timestamp > CACHE_TTL_MS) delete store[k];
  }
  store[hashKey(subject, question)] = { response, timestamp: now };
  writeCache(store);
}

export function clearAICache(): void {
  localStorage.removeItem(CACHE_STORE_KEY);
}

// ─── System prompts ───────────────────────────────────────────────────────────

const JSON_SCHEMA_NOTE = `
Respond ONLY with a valid JSON object — no markdown fences, no extra text.
Schema:
{
  "topic": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "steps": [
    {
      "stepNumber": number,
      "title": string,
      "explanation": string,
      "formula": string | null,
      "result": string | null
    }
  ],
  "finalAnswer": string,
  "keyConcepts": string[],
  "commonMistakes": string[],
  "confidence": number
}
Rules:
- steps: 3–6 items. Each explanation is 2–4 sentences, student-friendly.
- finalAnswer: specific and complete (include numerical value + units if applicable).
- keyConcepts: 3–5 short phrases.
- commonMistakes: 2–4 mistakes students often make on this type of question.
- confidence: 0–1 (how well the topic matches the question).
- All text must be clear for a Class 6–12 student.`.trim();

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are an expert Class 6–12 Mathematics tutor. Your goal is to help students truly understand problems, not just get the answer. When solving:
- Show every algebraic step explicitly.
- Mention the rule or formula being applied at each step.
- Use simple language; avoid jargon without explanation.
- For geometry, mention which theorem is used.
- Always verify the answer at the end.
${JSON_SCHEMA_NOTE}`,

  Physics: `You are an expert Class 6–12 Physics tutor. Your goal is to build physical intuition alongside mathematical skill. When solving:
- Always start by identifying the given quantities and the quantity to find.
- State the relevant law or equation before applying it.
- Include SI units at every step.
- Explain WHY a formula applies, not just HOW to use it.
- Sanity-check the answer (order of magnitude, direction, sign).
${JSON_SCHEMA_NOTE}`,

  Chemistry: `You are an expert Class 6–12 Chemistry tutor. When solving:
- For equations, balance atoms and charges systematically.
- For stoichiometry, show mole-ratio reasoning clearly.
- Explain the underlying chemistry, not just the arithmetic.
- Include state symbols when writing equations.
- Confirm conservation of mass/charge in the final step.
${JSON_SCHEMA_NOTE}`,
};

// ─── API call ─────────────────────────────────────────────────────────────────

interface RawStep {
  stepNumber?: number;
  title?: string;
  explanation?: string;
  formula?: string | null;
  result?: string | null;
}

interface RawLLMResponse {
  topic?: string;
  difficulty?: string;
  steps?: RawStep[];
  finalAnswer?: string;
  keyConcepts?: string[];
  commonMistakes?: string[];
  confidence?: number;
}

function parseSteps(raw: RawStep[]): SolutionStep[] {
  return (raw ?? []).map((s, i) => ({
    stepNumber:  s.stepNumber ?? i + 1,
    title:       s.title?.trim()       || `Step ${i + 1}`,
    explanation: s.explanation?.trim() || "",
    ...(s.formula ? { formula: s.formula.trim() } : {}),
    ...(s.result  ? { result:  s.result.trim()  } : {}),
  }));
}

function parseLLMResponse(
  json: RawLLMResponse,
  subject: Subject,
  question: string
): AIResponse {
  return {
    id:               `ai-${Date.now()}`,
    subject,
    topic:            json.topic?.trim()       || "General",
    difficulty:       (["Easy", "Medium", "Hard"].includes(json.difficulty ?? "")
                        ? json.difficulty as "Easy" | "Medium" | "Hard"
                        : "Medium"),
    detectedQuestion: question,
    steps:            parseSteps(json.steps ?? []),
    finalAnswer:      json.finalAnswer?.trim() || "See steps above.",
    keyConcepts:      (json.keyConcepts   ?? []).filter(Boolean),
    commonMistakes:   (json.commonMistakes ?? []).filter(Boolean),
    similarQuestions: [],
    source:           "openai",
    confidence:       typeof json.confidence === "number" ? json.confidence : 0.8,
  };
}

async function callOpenAI(subject: Subject, question: string): Promise<RawLLMResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey()}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model:           MODEL,
        temperature:     0.3,
        max_tokens:      1200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[subject] },
          {
            role: "user",
            content: `Subject: ${subject}\n\nQuestion:\n${question.trim()}`,
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) throw new Error("rate_limit");
  if (res.status === 401) throw new Error("invalid_key");
  if (!res.ok) throw new Error(`openai_error_${res.status}`);

  const data = (await res.json()) as { choices?: [{ message?: { content?: string } }] };
  const content = data?.choices?.[0]?.message?.content ?? "";
  return JSON.parse(content) as RawLLMResponse;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Minimum meaningful question length (chars) — reject garbled OCR output. */
const MIN_QUESTION_CHARS = 10;

/** Returns a human-readable error message for known error codes. */
export function describeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("rate_limit"))  return "OpenAI rate limit reached — showing cached solution.";
  if (msg.includes("invalid_key")) return "OpenAI API key is invalid — check VITE_OPENAI_API_KEY.";
  if (msg.includes("aborted") || msg.includes("abort"))
    return "AI request timed out (15 s) — showing question bank solution.";
  return `AI unavailable (${msg}) — showing question bank solution.`;
}

/**
 * Main entry point.
 * Throws on all recoverable errors so the caller can decide the fallback.
 */
export async function solveWithOpenAI(
  subject: Subject,
  question: string
): Promise<AIResponse> {
  if (!isOpenAIAvailable()) throw new Error("no_key");

  if (question.trim().length < MIN_QUESTION_CHARS) {
    throw new Error("question_too_short");
  }

  // Check cache first
  const cached = getCachedSolution(subject, question);
  if (cached) return { ...cached, detectedQuestion: question };

  // Call API
  const raw    = await callOpenAI(subject, question);
  const result = parseLLMResponse(raw, subject, question);

  // Store in cache
  cacheSolution(subject, question, result);

  return result;
}
