/**
 * POST /api/solveQuestion
 *
 * Secure server-side OpenAI proxy for StudyAI.
 * API key never leaves the server process.
 *
 * Features:
 *  - Per-IP rate limiting   (20 req / hour)
 *  - Server-side cache      (in-memory, 7-day TTL)
 *  - OpenAI timeout         (15 s via AbortController)
 *  - Structured prompts     per subject
 *  - Graceful error codes   (no_key / rate_limit / timeout / invalid_key)
 */

import { Router } from "express";

const router = Router();

// ─── Subject constants ────────────────────────────────────────────────────────

const SUBJECTS = ["Mathematics", "Physics", "Chemistry"] as const;
type Subject = (typeof SUBJECTS)[number];

// ─── Rate limiting ────────────────────────────────────────────────────────────

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT     = 20;              // requests per window per IP

interface RateEntry { count: number; resetAt: number; }
const rateLimitStore = new Map<string, RateEntry>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now   = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true };
}

// ─── Server-side cache ────────────────────────────────────────────────────────

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry { data: SolveResponse; expiresAt: number; }
const responseCache = new Map<string, CacheEntry>();

function makeCacheKey(subject: string, question: string): string {
  const raw = `${subject}::${question.trim().toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function getCached(subject: string, question: string): SolveResponse | null {
  const key   = makeCacheKey(subject, question);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { responseCache.delete(key); return null; }
  return { ...entry.data, cached: true };
}

function setCached(subject: string, question: string, data: SolveResponse): void {
  responseCache.set(makeCacheKey(subject, question), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// Evict expired entries every hour so memory doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitStore.entries()) if (now >= v.resetAt) rateLimitStore.delete(k);
  for (const [k, v] of responseCache.entries()) if (now >  v.expiresAt) responseCache.delete(k);
}, 60 * 60 * 1000).unref();

// ─── Response types ───────────────────────────────────────────────────────────

interface SolveStep {
  stepNumber:  number;
  title:       string;
  explanation: string;
  formula?:    string;
  result?:     string;
}

interface SolveResponse {
  topic:          string;
  difficulty:     "Easy" | "Medium" | "Hard";
  steps:          SolveStep[];
  finalAnswer:    string;
  keyConcepts:    string[];
  commonMistakes: string[];
  confidence:     number;
  cached?:        boolean;
}

// ─── Subject-specific system prompts ─────────────────────────────────────────

const JSON_SCHEMA = `
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
- steps: 3–6 items. Each explanation is 2–4 clear sentences at Class 6–12 level.
- finalAnswer: specific and complete — include value + units where relevant.
- keyConcepts: 3–5 short phrases.
- commonMistakes: 2–4 mistakes students commonly make on this type of problem.
- confidence: 0–1 reflecting how well the topic label matches the question.`.trim();

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are an expert Class 6–12 Mathematics tutor helping students understand problems deeply.
- Show every algebraic step explicitly.
- State the rule or formula at each step before using it.
- Use plain language; explain any jargon on first use.
- For geometry, name the theorem applied.
- Verify the answer at the final step.
${JSON_SCHEMA}`,

  Physics: `You are an expert Class 6–12 Physics tutor focused on physical intuition alongside calculation.
- Start by listing all given quantities and the target quantity.
- State the relevant law or equation before substituting values.
- Include SI units at every step.
- Explain WHY a formula applies, not only HOW to use it.
- Sanity-check the answer for correct magnitude, direction, and sign.
${JSON_SCHEMA}`,

  Chemistry: `You are an expert Class 6–12 Chemistry tutor.
- For chemical equations, balance atoms and charges methodically, element by element.
- For stoichiometry, show the mole-ratio reasoning explicitly.
- Explain the underlying chemistry, not just the arithmetic.
- Include state symbols (s), (l), (g), (aq) when writing equations.
- Confirm conservation of mass or charge in the final step.
${JSON_SCHEMA}`,
};

// ─── OpenAI call ──────────────────────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const OPENAI_TIMEOUT = 15_000; // ms

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStep(s: any, i: number): SolveStep {
  return {
    stepNumber:  typeof s.stepNumber === "number" ? s.stepNumber : i + 1,
    title:       typeof s.title       === "string" ? s.title.trim()       : `Step ${i + 1}`,
    explanation: typeof s.explanation === "string" ? s.explanation.trim() : "",
    ...(s.formula && typeof s.formula === "string" ? { formula: s.formula.trim() } : {}),
    ...(s.result  && typeof s.result  === "string" ? { result:  s.result.trim()  } : {}),
  };
}

async function callOpenAI(subject: Subject, question: string): Promise<SolveResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("no_key");

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model:           MODEL,
        temperature:     0.3,
        max_tokens:      1200,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[subject] },
          { role: "user",   content: `Subject: ${subject}\n\nQuestion:\n${question.trim()}` },
        ],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) throw new Error("rate_limit");
  if (res.status === 401) throw new Error("invalid_key");
  if (!res.ok)            throw new Error(`openai_${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body    = (await res.json()) as any;
  const content = body?.choices?.[0]?.message?.content ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed  = JSON.parse(content) as any;

  const difficulties = ["Easy", "Medium", "Hard"] as const;
  const difficulty: SolveResponse["difficulty"] =
    difficulties.includes(parsed.difficulty) ? parsed.difficulty : "Medium";

  return {
    topic:          typeof parsed.topic       === "string" ? parsed.topic.trim() : "General",
    difficulty,
    steps:          Array.isArray(parsed.steps)          ? parsed.steps.map(parseStep)             : [],
    finalAnswer:    typeof parsed.finalAnswer === "string" ? parsed.finalAnswer.trim() : "See steps above.",
    keyConcepts:    Array.isArray(parsed.keyConcepts)    ? parsed.keyConcepts.filter(Boolean)    : [],
    commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes.filter(Boolean) : [],
    confidence:     typeof parsed.confidence  === "number" ? parsed.confidence : 0.8,
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

router.post("/solveQuestion", async (req, res) => {
  const ip = req.ip ?? (req.socket.remoteAddress ?? "unknown");

  // 1. Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    res.status(429).json({ error: "rate_limit", retryAfter: rl.retryAfter });
    return;
  }

  // 2. Validate input
  const { question, subject } = req.body as { question?: unknown; subject?: unknown };

  if (typeof question !== "string" || question.trim().length < 5) {
    res.status(400).json({ error: "invalid_question", message: "question must be at least 5 characters" });
    return;
  }
  if (question.length > 2000) {
    res.status(400).json({ error: "question_too_long", message: "question must be under 2000 characters" });
    return;
  }
  if (!SUBJECTS.includes(subject as Subject)) {
    res.status(400).json({ error: "invalid_subject", message: `subject must be one of: ${SUBJECTS.join(", ")}` });
    return;
  }

  const subj = subject as Subject;
  const q    = question.trim();

  // 3. Server-side cache
  const cached = getCached(subj, q);
  if (cached) {
    req.log.info({ subject: subj, cached: true }, "solveQuestion: cache hit");
    res.json(cached);
    return;
  }

  // 4. Call OpenAI
  try {
    const result = await callOpenAI(subj, q);
    setCached(subj, q, result);
    req.log.info({ subject: subj, topic: result.topic }, "solveQuestion: AI solution generated");
    res.json(result);

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log.warn({ err: msg }, "solveQuestion: OpenAI call failed");

    if (msg.includes("no_key"))     { res.status(503).json({ error: "no_key",         message: "OPENAI_API_KEY is not configured on the server" }); return; }
    if (msg.includes("invalid_key")){ res.status(503).json({ error: "invalid_key",    message: "OPENAI_API_KEY is invalid" }); return; }
    if (msg.includes("rate_limit")) { res.status(429).json({ error: "openai_rate_limit" }); return; }
    if (msg.includes("aborted"))    { res.status(504).json({ error: "timeout",         message: "OpenAI request timed out" }); return; }
    res.status(502).json({ error: "openai_error", message: msg });
  }
});

export default router;
