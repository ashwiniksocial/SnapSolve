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
  stepNumber:   number;
  title:        string;
  explanation:  string;
  whyThisStep?: string;   // WHY this step is taken (Level 2 reasoning)
  formula?:     string;
  result?:      string;
}

interface SolveResponse {
  topic:               string;
  difficulty:          "Easy" | "Medium" | "Hard";
  prerequisites:       string[];                               // What you need to know first
  conceptExplanation:  string;                                // Level 1 — define concept simply
  steps:               SolveStep[];
  finalAnswer:         string;
  confusionPoint:      string;                                // Why students get confused here
  examTrap:            string;                                // Common exam trap (specific error)
  examTip:             string;                                // Level 4 — Remember This (shortcut)
  similarExample:      { problem: string; solution: string }; // One similar example
  checkUnderstanding:  { question: string; answer: string };  // Follow-up question
  keyConcepts:         string[];
  commonMistakes:      string[];
  deeperExplanation:   string;   // Explain More — deeper theory
  additionalExamples:  string[]; // Explain More — varied examples
  confidence:          number;
  cached?:             boolean;
}

// ─── Subject-specific system prompts ─────────────────────────────────────────

const JSON_SCHEMA = `
Respond ONLY with a valid JSON object — no markdown fences, no extra text.
Schema:
{
  "topic": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "prerequisites": string[],
  "conceptExplanation": string,
  "steps": [
    {
      "stepNumber": number,
      "title": string,
      "explanation": string,
      "whyThisStep": string,
      "formula": string | null,
      "result": string | null
    }
  ],
  "finalAnswer": string,
  "confusionPoint": string,
  "examTrap": string,
  "examTip": string,
  "similarExample": { "problem": string, "solution": string },
  "checkUnderstanding": { "question": string, "answer": string },
  "keyConcepts": string[],
  "commonMistakes": string[],
  "deeperExplanation": string,
  "additionalExamples": string[],
  "confidence": number
}
Rules:
- prerequisites: 3–5 short plain-phrase items listing what the student MUST know before solving. Start from the most basic. Never assume any prior knowledge — list even basic arithmetic if it is needed.
- conceptExplanation: 1–3 sentences in plain language. Define the concept from scratch. Use an everyday analogy for Easy questions. Assume the student has NEVER seen this concept.
- steps: 3–7 items. explanation = WHAT to compute (the method). whyThisStep = WHY this step is the right move (the reasoning). Both must always be non-empty.
- Verbosity by difficulty — Easy: very detailed, define every term, use analogies; Medium: moderate detail; Hard: concise but complete.
- finalAnswer: specific and complete — include value, units, and sign. Write as a full sentence.
- confusionPoint: 1–2 sentences on what most students misunderstand about this topic. Name the specific misconception.
- examTrap: 1–2 sentences on a CBSE/ICSE-specific exam trap — sign error, unit mistake, or trick that directly costs marks.
- examTip: 1–2 sentences — a practical shortcut or memory trick. Directly actionable.
- similarExample: A different but parallel problem. problem = 1 clear sentence. solution = 2–4 sentence worked answer with key steps shown.
- checkUnderstanding: 1 follow-up question to verify understanding. question = 1 sentence. answer = complete working shown in 1–3 sentences.
- deeperExplanation: 2–4 sentences of underlying theory aimed at Class 11–12 students.
- additionalExamples: 2–3 strings formatted as "Example N: [brief problem] → [answer with units]".
- keyConcepts: 3–5 short phrases.
- commonMistakes: 2–4 common mistakes on this exact type of problem.
- confidence: 0–1 reflecting topic-label match quality.
Core principle: Write as if the student knows NOTHING about this topic. Every term must be defined or explained. No prior knowledge is ever assumed.
Language: Clear English for CBSE/ICSE students aged 11–18.`.trim();

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are an expert Class 6–12 Mathematics tutor using the Explanation Quality V2 format.
CORE PRINCIPLE: NEVER assume any prior knowledge. Every concept, term, and symbol must be explained as if the student is encountering it for the very first time. A weak student who barely passed Class 8 must be able to follow every sentence.

Fill every field in the schema:
- prerequisites: list what the student must know first, starting from the absolute basics.
- conceptExplanation: define the mathematical concept from scratch using an everyday analogy.
- steps: each step has explanation (WHAT to compute) + whyThisStep (WHY this step is the right move).
- confusionPoint: name the specific misconception most students have on this topic.
- examTrap: identify a specific CBSE/ICSE exam trap — wrong sign, wrong formula, skipped step — that costs marks.
- examTip: one practical shortcut or memory trick.
- similarExample: a parallel problem (different numbers) with a worked solution.
- checkUnderstanding: 1 follow-up question with a complete answer including key working.
- deeperExplanation: underlying theory or derivation for curious Class 11–12 students.

Subject rules:
- Show every algebraic manipulation explicitly.
- State the rule or formula before applying it.
- For geometry, name the theorem used.
- Verify the answer at the final step.
${JSON_SCHEMA}`,

  Physics: `You are an expert Class 6–12 Physics tutor using the Explanation Quality V2 format.
CORE PRINCIPLE: NEVER assume any prior knowledge. Every concept, term, symbol, and SI unit must be explained as if the student is seeing it for the very first time. A student who has never studied Physics must be able to follow.

Fill every field in the schema:
- prerequisites: list the physics and maths concepts the student must know first.
- conceptExplanation: explain the physical phenomenon in everyday language with a real-world analogy.
- steps: each step has explanation (WHAT to compute/apply) + whyThisStep (WHY this law/formula applies here).
- confusionPoint: name the specific misconception most students have on this topic.
- examTrap: identify a CBSE/ICSE exam trap — unit confusion, direction sign, or formula mix-up that costs marks.
- examTip: one practical shortcut or memory trick.
- similarExample: a parallel problem with a worked solution.
- checkUnderstanding: 1 follow-up question with a complete answer.
- deeperExplanation: underlying principle or derivation for Class 11–12 students.

Subject rules:
- List all given quantities and the target quantity first.
- State the relevant law or equation before substituting values.
- Include SI units at every calculation step.
- Sanity-check magnitude, direction, and sign in the final step.
${JSON_SCHEMA}`,

  Chemistry: `You are an expert Class 6–12 Chemistry tutor using the Explanation Quality V2 format.
CORE PRINCIPLE: NEVER assume any prior knowledge. Every chemical concept, symbol, equation, and unit must be explained as if the student is encountering it for the very first time. Even basic terms like "atom" or "mole" must be briefly defined if relevant.

Fill every field in the schema:
- prerequisites: list the chemistry and science concepts the student must know first (including what atoms and molecules are if relevant).
- conceptExplanation: explain the chemical principle in plain language with a real-world analogy.
- steps: each step has explanation (WHAT to do) + whyThisStep (WHY this procedure is chemically correct).
- confusionPoint: name the specific misconception most students have on this topic.
- examTrap: identify a CBSE/ICSE exam trap — balancing error, wrong stoichiometry, missing state symbol.
- examTip: one practical shortcut or memory trick.
- similarExample: a parallel problem with a worked solution.
- checkUnderstanding: 1 follow-up question with a complete answer.
- deeperExplanation: underlying chemistry theory for Class 11–12 students.

Subject rules:
- Balance atoms and charges element by element.
- For stoichiometry, show mole-ratio reasoning explicitly.
- Include state symbols (s), (l), (g), (aq) in equations.
- Confirm conservation of mass or charge at the final step.
${JSON_SCHEMA}`,
};

// ─── OpenAI call ──────────────────────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const OPENAI_TIMEOUT = 15_000; // ms

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStep(s: any, i: number): SolveStep {
  return {
    stepNumber:  typeof s.stepNumber  === "number" ? s.stepNumber : i + 1,
    title:       typeof s.title       === "string" ? s.title.trim()       : `Step ${i + 1}`,
    explanation: typeof s.explanation === "string" ? s.explanation.trim() : "",
    ...(s.whyThisStep && typeof s.whyThisStep === "string" ? { whyThisStep: s.whyThisStep.trim() } : {}),
    ...(s.formula     && typeof s.formula     === "string" ? { formula:     s.formula.trim()     } : {}),
    ...(s.result      && typeof s.result      === "string" ? { result:      s.result.trim()      } : {}),
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
        max_tokens:      2500,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function safeStr(v: any): string { return typeof v === "string" ? v.trim() : ""; }

  return {
    topic:               safeStr(parsed.topic)              || "General",
    difficulty,
    prerequisites:       Array.isArray(parsed.prerequisites)   ? parsed.prerequisites.filter(Boolean)        : [],
    conceptExplanation:  safeStr(parsed.conceptExplanation),
    steps:               Array.isArray(parsed.steps)           ? parsed.steps.map(parseStep)                 : [],
    finalAnswer:         safeStr(parsed.finalAnswer)           || "See steps above.",
    confusionPoint:      safeStr(parsed.confusionPoint),
    examTrap:            safeStr(parsed.examTrap),
    examTip:             safeStr(parsed.examTip),
    similarExample:      parsed.similarExample && typeof parsed.similarExample.problem === "string"
                           ? { problem: parsed.similarExample.problem.trim(), solution: safeStr(parsed.similarExample.solution) }
                           : { problem: "", solution: "" },
    checkUnderstanding:  parsed.checkUnderstanding && typeof parsed.checkUnderstanding.question === "string"
                           ? { question: parsed.checkUnderstanding.question.trim(), answer: safeStr(parsed.checkUnderstanding.answer) }
                           : { question: "", answer: "" },
    keyConcepts:         Array.isArray(parsed.keyConcepts)    ? parsed.keyConcepts.filter(Boolean)           : [],
    commonMistakes:      Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes.filter(Boolean)        : [],
    deeperExplanation:   safeStr(parsed.deeperExplanation),
    additionalExamples:  Array.isArray(parsed.additionalExamples) ? parsed.additionalExamples.filter(Boolean) : [],
    confidence:          typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
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
