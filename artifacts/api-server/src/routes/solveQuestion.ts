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
  whyThisStep?: string;
  formula?:     string;
  result?:      string;
}

interface ConfidenceCheckData {
  question:     string;
  options:      string[];   // exactly 4
  correctIndex: number;     // 0–3
  explanation:  string;
}

interface SolveResponse {
  topic:                 string;
  difficulty:            "Easy" | "Medium" | "Hard";
  prerequisites:         string[];
  conceptExplanation:    string;
  questionUnderstanding: string;   // V3 — rewrite question in plain English
  wordToMath:            string;   // V3 — translate every phrase to maths notation
  steps:                 SolveStep[];
  finalAnswer:           string;
  verification:          string;   // V3 — substitute answer back and confirm
  confusionPoint:        string;
  examTrap:              string;
  examTip:               string;
  memoryShortcut:        string[]; // V3 — 1-3 short exam-ready memory tricks
  similarExample:        { problem: string; solution: string };
  checkUnderstanding:    { question: string; answer: string };
  confidenceCheck:       ConfidenceCheckData; // V3 — MCQ conceptual question
  keyConcepts:           string[];
  commonMistakes:        string[];
  deeperExplanation:     string;
  additionalExamples:    string[];
  confidence:            number;
  cached?:               boolean;
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
  "questionUnderstanding": string,
  "wordToMath": string,
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
  "verification": string,
  "confusionPoint": string,
  "examTrap": string,
  "examTip": string,
  "memoryShortcut": string[],
  "similarExample": { "problem": string, "solution": string },
  "checkUnderstanding": { "question": string, "answer": string },
  "confidenceCheck": {
    "question": string,
    "options": string[],
    "correctIndex": number,
    "explanation": string
  },
  "keyConcepts": string[],
  "commonMistakes": string[],
  "deeperExplanation": string,
  "additionalExamples": string[],
  "confidence": number
}

FIELD RULES — read every rule, follow all of them:

prerequisites: 3–5 short plain-phrase items of what the student MUST already know. Start from the absolute basics. Never assume prior knowledge — include arithmetic if needed.

conceptExplanation: 1–3 sentences. Define the concept from scratch in plain language. Use a real-world everyday analogy. Assume the student has NEVER seen this concept before.

questionUnderstanding: 2–4 sentences. (1) Rewrite the question in simple, friendly English. (2) State clearly what information is GIVEN. (3) State clearly what needs to be FOUND. (4) Name the chapter/topic being used. Purpose: remove fear before solving.

wordToMath: Mandatory for all subjects. Show how every key phrase in the question maps to a mathematical expression, step by step. Use → arrows. Never write the final equation directly — build it phrase by phrase. Example format:
"The angle is x.
Its complement → 90 − x
Four times its complement → 4(90 − x)
Given: angle = four times complement → x = 4(90 − x)"
Include a brief WHY for each mapping.

steps: 3–7 items. For EVERY step provide: explanation = WHAT to do (the method). whyThisStep = WHY we do it (the reasoning). Never combine two operations into one step. Show every intermediate algebraic step.

finalAnswer: Full sentence. Include value, units, and sign. Specific and complete.

verification: Substitute the final answer back into the original equation or condition. Show each substitution step explicitly. Confirm both sides match. Example: "Substituting x = 72: LHS = 72, RHS = 4(90−72) = 4×18 = 72. LHS = RHS ✓"

confusionPoint: 1–2 sentences on the specific misconception most students have on this topic.

examTrap: 1–2 sentences on a CBSE/ICSE-specific trap — wrong sign, wrong unit, skipped step — that costs marks.

examTip: 1–2 sentences — one practical shortcut or memory trick, directly usable in an exam.

memoryShortcut: 1–3 ultra-short strings a student can memorise in seconds. Format: "Concept → shortcut" e.g. "Complementary → 90°", "F = ma". These must be instantly usable in an exam without calculation.

similarExample: A different problem with the same underlying method. problem = 1 clear sentence (different numbers/scenario). solution = full worked solution in 3–5 sentences showing every key step.

checkUnderstanding: One new question (different from the problem). question = 1 clear sentence. answer = complete working in 2–4 sentences.

confidenceCheck: One conceptual MCQ testing WHY a key step was taken. question = 1 sentence. options = exactly 4 strings (one correct, three plausible but wrong). correctIndex = 0-based index of correct option. explanation = 1–2 sentences explaining why the correct answer is right.

keyConcepts: 3–5 short phrases.
commonMistakes: 3 common mistakes on this exact type of problem, each starting with "❌".
deeperExplanation: 2–4 sentences of underlying theory aimed at Class 11–12 students.
additionalExamples: 2–3 strings formatted as "Example N: [brief problem] → [answer with key step]".
confidence: 0–1 reflecting topic-label match quality.

CORE TEACHING PRINCIPLE: Assume the student knows NOTHING. Every term must be defined. Every formula must be explained. A weak student who barely passed Class 8 must be able to follow every sentence independently, without a tutor.
Language: Clear English for CBSE/ICSE students aged 11–18. Use encouraging tone — never say "this is easy". Say "Let's solve it together", "Take it one step at a time", "This step is important because...".`.trim();

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are an expert CBSE/ICSE Class 6–12 Mathematics teacher using the Explanation Quality V3.0 format.
TEACHING MISSION: Write as if you are personally teaching the weakest student in the class who has no tutor. They must be able to solve a similar question independently after reading your explanation once. Never say "this is easy." Say "Let's solve it together" and "Take it one step at a time."

MANDATORY — fill EVERY field:
- prerequisites: what the student must know first, from absolute basics.
- conceptExplanation: define the concept from scratch with an everyday analogy.
- questionUnderstanding: rewrite the question in simple English, state what's given, what to find, and which chapter.
- wordToMath: translate EVERY phrase in the question to a mathematical expression using → arrows, phrase by phrase.
- steps: for EVERY step give explanation (WHAT) + whyThisStep (WHY). Never skip algebra. Never combine two operations.
- finalAnswer: complete sentence with value and units.
- verification: substitute the answer back in and confirm both sides match. Show every substitution step.
- confusionPoint: the specific misconception most students have.
- examTrap: specific CBSE/ICSE exam trap — wrong sign, formula, or skipped step.
- examTip: one practical shortcut or memory trick.
- memoryShortcut: 1–3 ultra-short memory hooks usable in an exam instantly.
- similarExample: different numbers, same method, full worked solution.
- checkUnderstanding: one new question + complete working answer.
- confidenceCheck: MCQ testing WHY a key step was taken (4 options, 1 correct, include explanation).
- commonMistakes: exactly 3, each starting with "❌".
- deeperExplanation: underlying theory for Class 11–12 students.
- additionalExamples: 2–3 varied examples with answers.

Mathematics rules:
- Show every algebraic manipulation explicitly on its own line.
- State the rule or formula BEFORE applying it.
- For geometry, name the theorem being used.
- Verify the answer at the final step by substituting back.
${JSON_SCHEMA}`,

  Physics: `You are an expert CBSE/ICSE Class 6–12 Physics teacher using the Explanation Quality V3.0 format.
TEACHING MISSION: Write as if you are personally teaching the weakest student in the class who has no tutor. They must be able to solve a similar question independently after reading your explanation once. Never say "this is easy." Say "Let's solve it together" and "Take it one step at a time."

MANDATORY — fill EVERY field:
- prerequisites: physics and maths concepts the student must know first, from basics.
- conceptExplanation: explain the physical phenomenon in everyday language with a real-world analogy.
- questionUnderstanding: rewrite the question in simple English, list all given quantities, state what to find, and name the chapter.
- wordToMath: translate EVERY piece of given data to a mathematical symbol and value using → arrows.
- steps: for EVERY step give explanation (WHAT) + whyThisStep (WHY this law/formula applies here). Include SI units at every step.
- finalAnswer: full sentence with SI units, sign, and magnitude.
- verification: substitute the answer back and confirm it satisfies the original conditions.
- confusionPoint: the specific misconception most students have.
- examTrap: CBSE/ICSE trap — unit confusion, direction sign, or formula mix-up.
- examTip: one practical shortcut or memory trick.
- memoryShortcut: 1–3 ultra-short memory hooks (e.g. "F = ma", "v = u + at").
- similarExample: different scenario, same law, full worked solution.
- checkUnderstanding: one new question + complete working answer.
- confidenceCheck: MCQ testing WHY a law or formula was applied (4 options, 1 correct, include explanation).
- commonMistakes: exactly 3, each starting with "❌".
- deeperExplanation: underlying principle or derivation for Class 11–12 students.
- additionalExamples: 2–3 varied examples with answers.

Physics rules:
- List all given quantities before solving.
- State the relevant law or equation before substituting values.
- Include SI units at every calculation step.
- Sanity-check magnitude, direction, and sign in the final step.
${JSON_SCHEMA}`,

  Chemistry: `You are an expert CBSE/ICSE Class 6–12 Chemistry teacher using the Explanation Quality V3.0 format.
TEACHING MISSION: Write as if you are personally teaching the weakest student in the class who has no tutor. They must be able to solve a similar question independently after reading your explanation once. Never say "this is easy." Say "Let's solve it together" and "Take it one step at a time."

MANDATORY — fill EVERY field:
- prerequisites: chemistry and science concepts the student must know first, including what atoms/moles are if relevant.
- conceptExplanation: explain the chemical principle in plain language with a real-world analogy.
- questionUnderstanding: rewrite the question in simple English, state what's given, what to find, and which chapter.
- wordToMath: translate EVERY given value and condition to a chemical or mathematical expression using → arrows.
- steps: for EVERY step give explanation (WHAT) + whyThisStep (WHY this procedure is chemically correct).
- finalAnswer: complete sentence with value, units, and state.
- verification: confirm conservation of mass or charge using the final answer.
- confusionPoint: the specific misconception most students have.
- examTrap: CBSE/ICSE trap — balancing error, wrong stoichiometry, missing state symbol.
- examTip: one practical shortcut or memory trick.
- memoryShortcut: 1–3 ultra-short memory hooks usable in an exam instantly.
- similarExample: different compound/reaction, same method, full worked solution.
- checkUnderstanding: one new question + complete working answer.
- confidenceCheck: MCQ testing WHY a step was taken (4 options, 1 correct, include explanation).
- commonMistakes: exactly 3, each starting with "❌".
- deeperExplanation: underlying chemistry theory for Class 11–12 students.
- additionalExamples: 2–3 varied examples with answers.

Chemistry rules:
- Balance atoms and charges element by element.
- For stoichiometry, show mole-ratio reasoning explicitly.
- Include state symbols (s), (l), (g), (aq) in all equations.
- Confirm conservation of mass or charge at the final step.
${JSON_SCHEMA}`,
};

// ─── OpenAI call ──────────────────────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const OPENAI_TIMEOUT = 30_000; // ms — increased for V3.0 richer output

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
        max_tokens:      4000,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cc: any = parsed.confidenceCheck;

  return {
    topic:                 safeStr(parsed.topic)              || "General",
    difficulty,
    prerequisites:         Array.isArray(parsed.prerequisites)      ? parsed.prerequisites.filter(Boolean)        : [],
    conceptExplanation:    safeStr(parsed.conceptExplanation),
    questionUnderstanding: safeStr(parsed.questionUnderstanding),
    wordToMath:            safeStr(parsed.wordToMath),
    steps:                 Array.isArray(parsed.steps)              ? parsed.steps.map(parseStep)                 : [],
    finalAnswer:           safeStr(parsed.finalAnswer)              || "See steps above.",
    verification:          safeStr(parsed.verification),
    confusionPoint:        safeStr(parsed.confusionPoint),
    examTrap:              safeStr(parsed.examTrap),
    examTip:               safeStr(parsed.examTip),
    memoryShortcut:        Array.isArray(parsed.memoryShortcut)     ? parsed.memoryShortcut.filter(Boolean)       : [],
    similarExample:        parsed.similarExample && typeof parsed.similarExample.problem === "string"
                             ? { problem: parsed.similarExample.problem.trim(), solution: safeStr(parsed.similarExample.solution) }
                             : { problem: "", solution: "" },
    checkUnderstanding:    parsed.checkUnderstanding && typeof parsed.checkUnderstanding.question === "string"
                             ? { question: parsed.checkUnderstanding.question.trim(), answer: safeStr(parsed.checkUnderstanding.answer) }
                             : { question: "", answer: "" },
    confidenceCheck:       cc && typeof cc.question === "string" && Array.isArray(cc.options)
                             ? { question: cc.question.trim(), options: cc.options.slice(0, 4), correctIndex: typeof cc.correctIndex === "number" ? cc.correctIndex : 0, explanation: safeStr(cc.explanation) }
                             : { question: "", options: [], correctIndex: 0, explanation: "" },
    keyConcepts:           Array.isArray(parsed.keyConcepts)        ? parsed.keyConcepts.filter(Boolean)          : [],
    commonMistakes:        Array.isArray(parsed.commonMistakes)     ? parsed.commonMistakes.filter(Boolean)       : [],
    deeperExplanation:     safeStr(parsed.deeperExplanation),
    additionalExamples:    Array.isArray(parsed.additionalExamples) ? parsed.additionalExamples.filter(Boolean)   : [],
    confidence:            typeof parsed.confidence === "number"    ? parsed.confidence : 0.8,
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
