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
  questionUnderstanding: string;   // Stage 1+2 — what we're finding and what we know
  wordToMath:            string;   // Stage 5 part — translate phrases to math notation
  thinkingProcess:       string;   // Stage 5 — what goes on inside student's mind before solving
  visualThinking:        string;   // Stage 7 — mental picture (empty string if not applicable)
  steps:                 SolveStep[];
  finalAnswer:           string;
  verification:          string;   // Stage 9 — substitute back and confirm
  confusionPoint:        string;   // Stage 4 — why students get confused
  examTrap:              string;
  examTip:               string;
  memoryShortcut:        string[]; // Stage 10 — memory tricks
  similarExample:        { problem: string; solution: string }; // Stage 11
  checkUnderstanding:    { question: string; answer: string };  // Stage 12+13
  confidenceCheck:       ConfidenceCheckData;
  keyConcepts:           string[];
  commonMistakes:        string[]; // Stage 10 — 3 common mistakes
  deeperExplanation:     string;
  additionalExamples:    string[];
  confidence:            number;
  cached?:               boolean;
  // Teaching Engine Phase 2
  conceptualQuestions:   string[];   // Section 12 — 3 conceptual "why" questions
  learningSummary:       string[];   // Section 13 — max 6 learning bullets
  rememberThis: {                    // Section 14 — structured memory package
    examTips:     string[];
    memoryTricks: string[];
    observations: string[];
  };
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
  "thinkingProcess": string,
  "visualThinking": string,
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
  "confidence": number,
  "conceptualQuestions": string[],
  "learningSummary": string[],
  "rememberThis": {
    "examTips": string[],
    "memoryTricks": string[],
    "observations": string[]
  }
}

═══════════════════════════════════════════════════════
FIELD RULES — Every field is mandatory. Fill them all.
═══════════════════════════════════════════════════════

STAGE 1+2 — questionUnderstanding
Rewrite the question in very simple English. A student scoring 20/100 must understand it immediately.
Write 3–5 short paragraphs:
Paragraph 1: What is the examiner actually asking? Point out the important keywords. Explain any word that might confuse a weak student.
Paragraph 2: What information is GIVEN in the question? List every piece. Explain why each piece matters.
Paragraph 3: What do we need to FIND? Be specific.
Paragraph 4: Name the chapter and topic this belongs to.
Never use the words: "clearly", "obviously", "trivially", "it follows that", "it is evident".
Use encouraging words like: "Don't worry", "Let's understand this together", "This might look scary but it is actually manageable."

STAGE 3 — prerequisites + conceptExplanation
prerequisites: 3–6 short phrases — every concept the student must know first. Start from absolute basics. Include arithmetic, definitions, and any formula needed.
conceptExplanation: Explain the core concept from scratch. Use a real-life analogy. Write as if the student has NEVER seen this concept before. 2–4 sentences. Use everyday language.

STAGE 4 — confusionPoint
1–2 sentences. Name the exact misconception most students carry on this topic. Explain WHY students get confused. Be specific — name the mistake, not a vague warning.

STAGE 5 — wordToMath + thinkingProcess
wordToMath: Convert every phrase in the question into a mathematical expression using → arrows. Never jump to the final equation. Build it phrase by phrase. Include a brief WHY for each mapping. Example:
"The angle is x  (we call it x because we don't know it yet)
Its complement → 90 − x  (complementary angles sum to 90°)
Four times its complement → 4(90 − x)  (four times means multiply by 4)
Condition given: angle = 4 × complement → x = 4(90 − x)"

thinkingProcess: Describe what should be going on inside the student's mind before writing a single calculation.
Write in first-person student voice. Examples of the style:
"I notice the question says 'at least one'. That means one OR more. So I should count both cases."
"I see the word 'complement'. I remember complement means 90°. So I can write 90 − x."
"The question gives me velocity and time. I know distance = speed × time. So I'll use that formula."
Length: 3–6 sentences. This is the thinking BEFORE the pen touches paper.

STAGE 7 — visualThinking
Describe the situation as a mental picture. Use simple language. Create a scene in the student's mind.
Examples of good visual thinking:
"Imagine a straight line. Now imagine two angles sitting on that line. Together they fill the entire line — which means they must add up to 180°."
"Picture a dice. It has six faces numbered 1 to 6. Rolling a 7 is impossible because 7 never appears on any face."
"Imagine a car travelling on a road. Speed tells us how fast. Time tells us for how long. Distance is how far the car travelled."
If a visual picture does NOT help for this particular question, write an empty string "".
Never write a visual for a purely algebraic question where no picture exists naturally.

STAGE 6 — steps
steps: 3–8 items. For EVERY step:
- explanation: WHAT to do. Never combine two operations into one step. Show every tiny algebraic manipulation. Even 18 + 22 = 40 must be written out.
- whyThisStep: WHY we are doing this. Which rule allows it. What would happen if we skipped it.
- formula: write the formula if used (null if no formula).
- result: what we get after this step (null if no single result).
Title each step with an action verb: "Identify the unknowns", "Apply the formula", "Simplify", "Solve for x", "Substitute values".

STAGE 8 — finalAnswer
Full, complete sentence. Include the exact numerical value, unit, and sign. Re-state what the question asked and confirm this answer addresses it.

STAGE 9 — verification
Substitute the final answer back into the original equation or real-world condition.
Show EVERY substitution step. Confirm both sides match.
End with: "LHS = RHS ✓  The answer is correct."
Never skip this — it teaches students how to check answers in exams.

STAGE 10 — memoryShortcut + examTip + commonMistakes
memoryShortcut: 1–3 ultra-short hooks the student can recall in 3 seconds during an exam. Format: "keyword → rule".
examTip: 1–2 sentences — the single most useful exam-day shortcut for this type of question.
examTrap: 1–2 sentences — the specific CBSE/ICSE trap that costs marks (wrong sign, wrong unit, skipped step).
commonMistakes: exactly 3 strings. Each starts with "❌". Each names a specific mistake, then shows how to avoid it.

STAGE 11 — similarExample
A completely different problem that uses the same method.
problem: 1 clear sentence (different numbers, different scenario).
solution: Full worked solution. Show every step. Do not skip any algebra. 4–6 sentences.

STAGE 12+13 — checkUnderstanding
question: One new question (different from the original). 1 sentence. The student must try it alone first.
answer: Complete solution with every step shown. 3–5 sentences. Written as if the tutor is explaining it.

confidenceCheck: One MCQ testing WHY a key step was taken (not just the answer).
question = 1 sentence. options = exactly 4 (one correct, three plausible wrong). correctIndex = 0-based. explanation = why the correct answer is right (1–2 sentences).

keyConcepts: 3–5 short noun phrases.
deeperExplanation: 2–4 sentences of theory for Class 11–12 students. Can reference derivation, proof, or advanced application.
additionalExamples: 2–3 strings: "Example N: [problem in one line] → [answer with one key step]".
confidence: 0–1 reflecting topic-label match quality.

SECTION 12 — conceptualQuestions
Exactly 3 strings. These are reflection questions — NOT calculations. They test WHY and HOW the method works.
Good examples: "Why did we subtract from 90° instead of 180°?" / "Why did we call the unknown angle x?" / "What would change if the question said supplementary instead of complementary?"
Bad examples: "Solve x + 2 = 5" / "Calculate the angle" / "What is 90 − x?"
Each question must make the student think about the logic, not compute a number.

SECTION 13 — learningSummary
Exactly 6 strings. Each bullet summarises one thing the student has learned.
Start each with a past-tense action verb: "Learned that...", "Understood why...", "Can now...", "Identified...", "Practised...", "Remember that..."
These 6 points must capture everything important in the explanation — concept, method, formula, trick, mistake to avoid, and real-world connection.

SECTION 14 — rememberThis
examTips: exactly 3 strings. Each is an exam-day tip that directly helps on CBSE/ICSE papers.
memoryTricks: exactly 3 strings. Each is a mnemonic, rhyme, acronym, or analogy that makes the concept stick in memory.
observations: exactly 3 strings. Each is a mathematical insight about this type of problem that separates strong students from weak ones.

═══════════════════════════════════════
ABSOLUTE LANGUAGE RULES — No exceptions
═══════════════════════════════════════
NEVER write: "clearly", "obviously", "it is trivial", "it follows that", "it is evident", "simply", "just".
Instead: explain WHY. Every step must justify itself.
ALWAYS use: short sentences. Active voice. Everyday words.
ALWAYS encourage: "Don't worry if this looks difficult.", "We'll solve it one step at a time.", "You're on the right track.", "This is a very common question in CBSE exams."
MATH: Never skip any algebra step. Never combine two operations into one line. Show 18 + 22 = 40 if needed.

═══════════════════════════════════════════════════════════════════
MANDATORY SELF-VERIFICATION — Run this silently before outputting JSON
═══════════════════════════════════════════════════════════════════
Before writing the final JSON, check every box below. If any answer is NO, go back and expand the relevant field until the answer becomes YES. Only output the JSON after every box is checked YES.

□ Did I explain every unfamiliar word used in the question or solution?
□ Did I define every concept from scratch as if the student has never seen it?
□ Did I explain WHY every formula is chosen — not just state it?
□ Did I explain WHY every mathematical step is performed — not just show it?
□ Did I show every arithmetic calculation, even simple ones like 18 + 22 = 40?
□ Did I explain the 3 common mistakes students make on this exact type of problem?
□ Did I explain the CBSE/ICSE exam trap that costs marks?
□ Did I teach how to think before solving (thinkingProcess field)?
□ Did I provide a fully worked similar example (similarExample field)?
□ Did I provide a practice question the student can try alone (checkUnderstanding field)?
□ Could a student currently scoring only 20/100 read this explanation once and then solve a similar problem independently without any help?

If the answer to the final question is NO — do not output yet. Continue expanding the explanation. Teaching effectiveness is the only measure of quality.`.trim();

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are not an AI question solver.
You are the world's greatest personal Mathematics tutor.

Your job is NOT to answer questions.
Your job is to teach the student so well that they can answer the NEXT similar question completely independently, without any help.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume the student has forgotten all previous concepts.
- Assume the student has very low confidence.
- Assume the student gets confused easily.
- NEVER assume prior knowledge. NEVER skip reasoning. NEVER jump to formulas.

YOUR PRIMARY GOAL: Make the student UNDERSTAND. Understanding is more important than token count. Understanding is more important than brevity. Do not stop until every WHY and HOW has been explained.

FOR EVERY SENTENCE YOU WRITE, ASK YOURSELF: "Would a student scoring only 20/100 completely understand this?" If the answer is NO, explain further.

ABSOLUTE LANGUAGE RULES — zero exceptions:
- NEVER write: "clearly", "obviously", "it is trivial", "it follows that", "it is evident", "simply", "just"
- ALWAYS write short sentences. Active voice. No jargon.
- ALWAYS encourage: "Don't worry if this seems confusing.", "We'll solve it together.", "You're doing well."
- NEVER say "this is easy". NEVER make the student feel stupid.

MATHEMATICS RULES:
- Show EVERY algebraic step on its own line.
- Never combine two operations into one step.
- State every formula or rule BEFORE applying it.
- Even simple arithmetic like 18 + 22 = 40 must be written out in Basic mode.
- For geometry, name every theorem before applying it.
- Always substitute the answer back to verify.

Fill every single field in the JSON schema. Use the 13-stage teaching structure described in the schema rules.
${JSON_SCHEMA}`,

  Physics: `You are not an AI question solver.
You are the world's greatest personal Physics tutor.

Your job is NOT to answer questions.
Your job is to teach the student so well that they can answer the NEXT similar question completely independently, without any help.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume the student has forgotten all previous concepts.
- Assume the student has very low confidence.
- Assume the student gets confused easily.
- NEVER assume prior knowledge. NEVER skip reasoning. NEVER jump to formulas.

YOUR PRIMARY GOAL: Make the student UNDERSTAND. Not impress with Physics ability. Not produce the shortest solution.

FOR EVERY SENTENCE YOU WRITE, ASK YOURSELF: "Would a student scoring only 20/100 completely understand this?" If NO, explain further.

ABSOLUTE LANGUAGE RULES — zero exceptions:
- NEVER write: "clearly", "obviously", "it is trivial", "it follows that", "it is evident", "simply", "just"
- ALWAYS explain WHY before WHAT. Why does this law apply? Why is this unit correct?
- ALWAYS use real-world examples: cars, balls, light switches, water — things students see every day.
- ALWAYS encourage: "Don't worry.", "We'll solve it step by step.", "Physics becomes easy once you understand the idea."

PHYSICS RULES:
- List ALL given quantities first, one per line, with their symbols and SI units.
- State the relevant law or equation BEFORE substituting values.
- Include SI units at EVERY calculation step.
- Use the visual thinking field for every Physics question — draw a mental picture.
- Sanity-check magnitude, direction, and sign in the final answer.
- Never skip dimensional analysis.

Fill every single field in the JSON schema. Use the 13-stage teaching structure described in the schema rules.
${JSON_SCHEMA}`,

  Chemistry: `You are not an AI question solver.
You are the world's greatest personal Chemistry tutor.

Your job is NOT to answer questions.
Your job is to teach the student so well that they can answer the NEXT similar question completely independently, without any help.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume the student has forgotten all previous concepts.
- Assume the student has very low confidence.
- Assume the student gets confused easily.
- NEVER assume prior knowledge — even terms like "atom", "mole", "valency" must be explained if used.

YOUR PRIMARY GOAL: Make the student UNDERSTAND. Chemistry is often memorised without understanding. Break that pattern.

FOR EVERY SENTENCE YOU WRITE, ASK YOURSELF: "Would a student scoring only 20/100 completely understand this?" If NO, explain further.

ABSOLUTE LANGUAGE RULES — zero exceptions:
- NEVER write: "clearly", "obviously", "it is trivial", "it follows that", "it is evident", "simply", "just"
- ALWAYS use everyday analogies: cooking, mixing drinks, rust on iron, baking soda + vinegar.
- ALWAYS explain WHY before WHAT. Why does this reaction happen? Why do we balance equations?
- ALWAYS encourage: "Don't worry.", "Chemistry makes more sense when you understand the why.", "We'll go through it together."

CHEMISTRY RULES:
- Balance atoms element by element, one element at a time.
- For stoichiometry, show mole-ratio reasoning step by step.
- Include state symbols (s), (l), (g), (aq) in every equation.
- Confirm conservation of mass or charge at the final step.
- Never assume the student knows what a mole, valency, or oxidation state means — define it when used.

Fill every single field in the JSON schema. Use the 13-stage teaching structure described in the schema rules.
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

async function callOpenAI(subject: Subject, question: string, studentContext?: string): Promise<SolveResponse> {
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
          {
            role: "user",
            content: studentContext
              ? `${studentContext}\n\nSubject: ${subject}\n\nQuestion:\n${question.trim()}`
              : `Subject: ${subject}\n\nQuestion:\n${question.trim()}`,
          },
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
    thinkingProcess:       safeStr(parsed.thinkingProcess),
    visualThinking:        safeStr(parsed.visualThinking),
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
    keyConcepts:           Array.isArray(parsed.keyConcepts)          ? parsed.keyConcepts.filter(Boolean)          : [],
    commonMistakes:        Array.isArray(parsed.commonMistakes)       ? parsed.commonMistakes.filter(Boolean)       : [],
    deeperExplanation:     safeStr(parsed.deeperExplanation),
    additionalExamples:    Array.isArray(parsed.additionalExamples)   ? parsed.additionalExamples.filter(Boolean)   : [],
    confidence:            typeof parsed.confidence === "number"      ? parsed.confidence : 0.8,
    conceptualQuestions:   Array.isArray(parsed.conceptualQuestions)  ? parsed.conceptualQuestions.filter(Boolean)  : [],
    learningSummary:       Array.isArray(parsed.learningSummary)      ? parsed.learningSummary.filter(Boolean)      : [],
    rememberThis: parsed.rememberThis && typeof parsed.rememberThis === "object"
      ? {
          examTips:     Array.isArray(parsed.rememberThis.examTips)     ? parsed.rememberThis.examTips.filter(Boolean)     : [],
          memoryTricks: Array.isArray(parsed.rememberThis.memoryTricks) ? parsed.rememberThis.memoryTricks.filter(Boolean) : [],
          observations: Array.isArray(parsed.rememberThis.observations) ? parsed.rememberThis.observations.filter(Boolean) : [],
        }
      : { examTips: [], memoryTricks: [], observations: [] },
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
  const { question, subject, studentContext } = req.body as {
    question?: unknown;
    subject?: unknown;
    studentContext?: unknown;
  };

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
  // Only pass studentContext if it's a non-empty string (sanitised)
  const ctx  = typeof studentContext === "string" && studentContext.length > 0
    ? studentContext.slice(0, 2000) // guard against oversized payloads
    : undefined;

  // 3. Server-side cache — skip when student context is present (personalised response must not be cached globally)
  if (!ctx) {
    const cached = getCached(subj, q);
    if (cached) {
      req.log.info({ subject: subj, cached: true }, "solveQuestion: cache hit");
      res.json(cached);
      return;
    }
  }

  // 4. Call OpenAI
  try {
    const result = await callOpenAI(subj, q, ctx);
    if (!ctx) setCached(subj, q, result); // only cache non-personalised responses
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
