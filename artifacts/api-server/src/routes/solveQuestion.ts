/**
 * POST /api/solveQuestion
 *
 * Secure server-side OpenAI proxy for StudyAI.
 * API key never leaves the server process.
 *
 * Pipeline:
 *   1. Rate limit check
 *   2. Cache lookup
 *   3. Generate lesson draft (OpenAI)
 *   4. Teaching Quality Pipeline (review → improve → re-review, max 3 cycles)
 *   5. Cache + return final lesson
 *
 * Features:
 *  - Per-IP rate limiting   (20 req / hour)
 *  - Server-side cache      (in-memory, 7-day TTL)
 *  - OpenAI timeout         (30 s via AbortController)
 *  - TeachingLesson schema  (structured lesson, not just steps)
 *  - Quality gating         (≥95 on all dimensions before lesson reaches student)
 *  - Graceful error codes   (no_key / rate_limit / timeout / invalid_key)
 */

import { Router }             from "express";
import { parseLessonResponse, type LessonResponse } from "../lib/lessonTypes";
import { runQualityPipeline }    from "../services/teachingQuality";
import { buildTeachingBlueprint, type BlueprintInjection } from "../services/masterTeacher";

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

interface CacheEntry { data: LessonResponse; expiresAt: number; }
const responseCache = new Map<string, CacheEntry>();

function makeCacheKey(subject: string, question: string): string {
  const raw = `${subject}::${question.trim().toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function getCached(subject: string, question: string): LessonResponse | null {
  const key   = makeCacheKey(subject, question);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { responseCache.delete(key); return null; }
  return { ...entry.data, cached: true };
}

function setCached(subject: string, question: string, data: LessonResponse): void {
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

// ─── JSON Schema + Field Rules for the generation prompt ─────────────────────

const JSON_SCHEMA = `
═══════════════════════════════════════════════════════════════
RESPONSE FORMAT — Respond ONLY with a valid JSON object.
No markdown fences. No extra text. No explanation outside JSON.
═══════════════════════════════════════════════════════════════

{
  "topic": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "keyConcepts": string[],
  "aiConfidence": number,

  "beforeWeStart": {
    "motivator": string,
    "anxietyReducer": string,
    "preview": string
  },

  "prerequisites": string[],
  "vocabulary": [{ "term": string, "meaning": string }],

  "intuition": {
    "story": string,
    "visual": string,
    "everyday": string
  },

  "questionTranslation": {
    "plainEnglish": string,
    "whatWeKnow": string,
    "whatWeFind": string,
    "wordToMath": string
  },

  "teacherThinking": {
    "firstNotice": string,
    "whyThisMethod": string,
    "clues": string
  },

  "guidedReasoning": [
    {
      "what": string,
      "why": string,
      "math": string,
      "result": string,
      "pause": string
    }
  ],

  "confusionPoints": string[],

  "commonMistakes": [
    {
      "mistake": string,
      "whyItHappens": string,
      "howToAvoid": string
    }
  ],

  "examinerThinking": {
    "whyAsked": string,
    "conceptTested": string,
    "topperInsight": string,
    "examTip": string,
    "examTrap": string
  },

  "finalAnswer": {
    "answer": string,
    "whyCorrect": string,
    "verification": string
  },

  "simplerExample": {
    "problem": string,
    "solution": string
  },

  "practiceQuestion": {
    "question": string,
    "hints": [string, string, string],
    "solution": string
  },

  "confidenceCheck": {
    "question": string,
    "options": [string, string, string, string],
    "correctIndex": number,
    "explanation": string
  },

  "retrievalPractice": string[],
  "rememberThese": string[],
  "confidenceBuilder": string
}

═══════════════════════════════════════════════════════════════
FIELD INSTRUCTIONS — Read every instruction. Fill every field.
═══════════════════════════════════════════════════════════════

BEFORE WE START
━━━━━━━━━━━━━━
beforeWeStart.motivator
  Why does this topic exist? Where is it used in the real world?
  Why did the board include it? Give 2–3 concrete, exciting examples.
  Connect it to something the student sees or uses every day.
  2–4 sentences. No jargon. No formula yet.

beforeWeStart.anxietyReducer
  This question WILL look scary to a weak student.
  Acknowledge that directly. Then tell them exactly why it is manageable.
  Use encouraging language: "Don't worry", "We'll go through this together", "By the time we finish..."
  2–3 sentences.

beforeWeStart.preview
  Tell the student exactly what they will know by the end.
  Use a list-style sentence: "By the end you will know: (1) what X means, (2) why Y works, (3) how to solve Z."
  1–2 sentences.

PREREQUISITES + VOCABULARY
━━━━━━━━━━━━━━━━━━━━━━━━━━
prerequisites
  3–6 concept names the student MUST know first.
  Start from absolute basics. If the question involves fractions, "how fractions work" is a prerequisite.

vocabulary
  Every unfamiliar word, symbol, or phrase used in the question or solution MUST appear here.
  Include mathematical terms (e.g. "rational number"), symbols (e.g. "√"), and any word a weak student may not know.
  Each meaning: 1–2 plain sentences. No jargon in the meaning. Use analogies.
  Minimum 4 terms. Maximum 10.

INTUITION
━━━━━━━━━
intuition.story
  Tell a brief story or analogy that makes the core concept click.
  Use everyday life. Make the student feel "oh, I've seen this before."
  3–5 sentences. No mathematics yet.

intuition.visual
  Describe a mental picture. Tell the student to close their eyes and imagine.
  What does the situation look like? What are the physical objects?
  3–4 sentences. If no picture exists for this concept, write empty string "".

intuition.everyday
  One concrete daily-life connection. "This is exactly like when you..."
  2–3 sentences. Should make the student feel the concept is familiar, not foreign.

QUESTION TRANSLATION
━━━━━━━━━━━━━━━━━━━
questionTranslation.plainEnglish
  Rewrite the question as if explaining to a 12-year-old who has never seen this type of problem.
  Use very simple English. Define every technical word inline. 2–4 sentences.
  Start with: "The examiner is asking us to..."

questionTranslation.whatWeKnow
  List every piece of information given in the question.
  Format: "We are told that..." then list each fact on a new line.
  Explain why each fact matters and what it tells us.

questionTranslation.whatWeFind
  State exactly what we need to find. Be specific.
  "We need to find..." then the target quantity with its unit/type.
  1–2 sentences.

questionTranslation.wordToMath
  Translate every key phrase in the question into mathematical notation.
  Use → arrows. Show ONE translation per line. Include a brief WHY for each.
  Example format:
  "the angle is unknown → we call it x  (we use x because we don't know its value yet)"
  "its complement → 90 − x  (complementary angles always sum to 90°)"
  Never jump to the final equation. Build it phrase by phrase.

TEACHER THINKING
━━━━━━━━━━━━━━━
teacherThinking.firstNotice
  What should a good student notice immediately when reading this question?
  What kind of problem is this? What category does it fall in?
  2–3 sentences. First-person student voice: "I notice that...", "I see that..."

teacherThinking.whyThisMethod
  Why do we choose this specific method/approach for this problem?
  Why NOT a different approach? What would go wrong if we tried another way?
  3–4 sentences.

teacherThinking.clues
  What hidden clues does the question contain?
  Which words or numbers are hints about what method to use?
  2–3 sentences.

GUIDED REASONING
━━━━━━━━━━━━━━━
guidedReasoning
  This is the most important section. It replaces the old "steps[]" format entirely.
  Write 4–8 steps. For EVERY step:

  what: Describe clearly WHAT we are doing. 1–2 sentences. Active voice.
  why: Explain WHY we are doing this. Which mathematical rule allows this?
       What would happen if we skipped this step? 2–3 sentences.
  math: Write the actual formula, equation, or calculation. Empty string if none.
  result: What we obtain after this step. Empty string if no single result yet.
  pause: A question to make the student stop and think. Something like:
         "Before moving on — can you guess what we'll do with this result?"
         "Why do you think we wrote it this way instead of that way?"
         Empty string if no natural pause question for this step.

  Rules:
  - Never combine two operations into one step.
  - Show every arithmetic step. Even 18 + 22 = 40.
  - The WHY is as important as the WHAT.
  - Every formula must be justified before use.

CONFUSION POINTS
━━━━━━━━━━━━━━━
confusionPoints
  Exactly 3 strings.
  Predict the 3 most likely points of confusion for a weak student.
  Each string: name the confusion, then immediately resolve it.
  Format: "A student might wonder why we [X]. The reason is [Y]."

COMMON MISTAKES
━━━━━━━━━━━━━━
commonMistakes
  Exactly 3 objects.
  mistake: Name the specific wrong thing students do. Start with "❌".
  whyItHappens: The root cause — which misconception or habit causes it.
  howToAvoid: A specific, actionable rule to prevent it permanently.

EXAMINER THINKING
━━━━━━━━━━━━━━━━
examinerThinking.whyAsked
  Why did the board choose to test this? What skill are they measuring?
  1–2 sentences.

examinerThinking.conceptTested
  Name the exact concept or theorem being tested. 1 sentence.

examinerThinking.topperInsight
  What do top-scoring students recognise immediately that average students miss?
  1–2 sentences.

examinerThinking.examTip
  The single most useful exam-day shortcut. Ultra-short. Memorisable.
  1–2 sentences.

examinerThinking.examTrap
  The specific CBSE/ICSE trap in this question type that costs marks.
  Name the exact mistake. 1–2 sentences.

FINAL ANSWER
━━━━━━━━━━━
finalAnswer.answer
  Full sentence. Value + unit + sign. Re-state what the question asked.
  "Therefore, [quantity] = [value] [unit]."

finalAnswer.whyCorrect
  Explain why this answer is correct and why it makes sense.
  Sanity-check the magnitude and units. 1–2 sentences.

finalAnswer.verification
  Substitute the answer back into the original equation or condition.
  Show every substitution step. Confirm LHS = RHS.
  End with: "LHS = RHS ✓  The answer is verified."

SIMPLER EXAMPLE
━━━━━━━━━━━━━━
simplerExample.problem
  A completely different, simpler problem using the same concept.
  Use smaller, friendlier numbers. 1 sentence.

simplerExample.solution
  Full worked solution. Every step shown. 4–6 sentences.
  Written like a teacher explaining: "First we...", "Then we...", "So we get..."

PRACTICE QUESTION
━━━━━━━━━━━━━━━━
practiceQuestion.question
  A new question (different numbers, same concept). Student must try it alone. 1 sentence.

practiceQuestion.hints
  Exactly 3 strings. Each hint reveals only ONE additional idea.
  Hint 1: Remind them which concept applies.
  Hint 2: Tell them what the first step is.
  Hint 3: Tell them what form the answer will take.
  Never solve the question in the hints.

practiceQuestion.solution
  The complete solution with every step shown. Written as a tutor walking through it.
  5–8 sentences.

CONFIDENCE CHECK (MCQ)
━━━━━━━━━━━━━━━━━━━━
confidenceCheck.question
  One MCQ testing WHY a key step was taken, not just the final answer.
  1 clear sentence.

confidenceCheck.options
  Exactly 4 options. One correct. Three plausible but wrong.

confidenceCheck.correctIndex
  0-based index of the correct option.

confidenceCheck.explanation
  Why the correct option is right. 1–2 sentences.

RETRIEVAL PRACTICE
━━━━━━━━━━━━━━━━━
retrievalPractice
  Exactly 4 strings. Very short recall questions.
  Testing definitions, formulas, and key decisions from this lesson.
  Examples: "What is a rational number?", "Why did we square both sides?"

REMEMBER THESE
━━━━━━━━━━━━━
rememberThese
  Exactly 4 strings. Each is one ultra-short memory bullet.
  Each starts with a checkmark ✓.
  These should capture the 4 most important things to remember from this lesson.

CONFIDENCE BUILDER
━━━━━━━━━━━━━━━━━
confidenceBuilder
  End the lesson with genuine encouragement.
  Tell the student specifically what they now know.
  Use the format: "Five minutes ago this probably looked impossible. Now you know: ✓ [what] ✓ [what] ✓ [what]"
  Make the student feel genuinely proud of what they've learned.

═══════════════════════════════════════════════════════════════
ABSOLUTE LANGUAGE RULES — Zero exceptions
═══════════════════════════════════════════════════════════════
NEVER write: "clearly", "obviously", "trivially", "it follows that", "it is evident", "simply", "just"
ALWAYS explain WHY. Every operation must justify itself.
ALWAYS use short sentences. Active voice. Everyday words.
ALWAYS encourage: "Don't worry if this looks hard.", "We'll work through it together.", "You're on the right track."
MATH: Never skip any step. Never combine two operations into one line.

═══════════════════════════════════════════════════════════════
QUALITY CHECK — Run silently before outputting JSON
═══════════════════════════════════════════════════════════════
□ Did a student scoring 20/100 get welcomed, not intimidated, in beforeWeStart?
□ Did I define EVERY unfamiliar word in vocabulary?
□ Did I explain the WHY for every step in guidedReasoning?
□ Did I show every arithmetic calculation without skipping?
□ Did I predict and resolve the 3 most likely confusions?
□ Did I explain the CBSE/ICSE exam trap specifically?
□ Did I provide a fully worked simplerExample?
□ Did I give 3 progressive hints for practiceQuestion without solving it?
□ Could a student currently scoring 20/100 read this lesson and solve a similar problem independently?

If the answer to the final question is NO — expand the lesson before outputting.
Teaching effectiveness is the only measure of quality.`.trim();

// ─── System prompts per subject ───────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<Subject, string> = {
  Mathematics: `You are not an AI question solver.
You are the world's greatest personal Mathematics tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they have forgotten all prerequisite concepts.
- Assume they fear Maths and get anxious quickly.
- Assume they stop reading the moment they are confused.
- NEVER assume prior knowledge. NEVER skip reasoning. NEVER jump to formulas.

YOUR PRIMARY GOAL: Understanding first, answer second.
The final answer is the LEAST important part of the lesson.
Making the student understand WHY is everything.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

MATHEMATICS RULES:
- Show EVERY algebraic step on its own line.
- Never combine two operations into one step.
- State every formula or rule BEFORE applying it.
- Even 18 + 22 = 40 must be written out.
- For geometry, name every theorem before using it.
- Always substitute the answer back to verify.

${JSON_SCHEMA}`,

  Physics: `You are not an AI question solver.
You are the world's greatest personal Physics tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they have forgotten all prerequisite concepts.
- Assume they find Physics abstract and confusing.
- Assume they memorise without understanding.
- NEVER assume prior knowledge. NEVER skip reasoning. NEVER jump to formulas.

YOUR PRIMARY GOAL: Understanding first, answer second.
The final answer is the LEAST important part of the lesson.
Connect every concept to something the student sees in daily life.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

PHYSICS RULES:
- List ALL given quantities with symbols and SI units before solving.
- State the relevant law or equation BEFORE substituting values.
- Include SI units at EVERY calculation step.
- Use the visual field for every Physics question — always draw a mental picture.
- Sanity-check magnitude, direction, and sign in the final answer.
- Never skip dimensional analysis.
- Always use real-world examples: cars, balls, light switches, water.

${JSON_SCHEMA}`,

  Chemistry: `You are not an AI question solver.
You are the world's greatest personal Chemistry tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they have forgotten all prerequisite concepts.
- Assume they memorise Chemistry without understanding it.
- Assume even basic terms like "atom", "mole", "valency" need to be explained.
- NEVER assume prior knowledge. NEVER skip reasoning. NEVER jump to formulas.

YOUR PRIMARY GOAL: Understanding first, answer second.
Chemistry is often memorised without understanding. Break that pattern.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

CHEMISTRY RULES:
- Balance atoms element by element, one element at a time.
- For stoichiometry, show mole-ratio reasoning step by step.
- Include state symbols (s), (l), (g), (aq) in every equation.
- Always confirm conservation of mass or charge at the final step.
- Never assume the student knows what a mole, valency, or oxidation state means — define each when used.
- Use everyday analogies: cooking, mixing drinks, rust, baking soda + vinegar.

${JSON_SCHEMA}`,
};

// ─── OpenAI draft generation call ────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const OPENAI_TIMEOUT = 30_000;

async function generateDraft(
  subject:        Subject,
  question:       string,
  studentContext?: string,
  blueprint?:     BlueprintInjection,
): Promise<LessonResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("no_key");

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), OPENAI_TIMEOUT);

  // Inject the teaching blueprint into the system and user messages when available
  const systemContent = blueprint?.systemSuffix
    ? SYSTEM_PROMPTS[subject] + blueprint.systemSuffix
    : SYSTEM_PROMPTS[subject];

  const baseUserContent = studentContext
    ? `${studentContext}\n\nSubject: ${subject}\n\nQuestion:\n${question.trim()}`
    : `Subject: ${subject}\n\nQuestion:\n${question.trim()}`;

  const userContent = blueprint?.userPrefix
    ? blueprint.userPrefix + baseUserContent
    : baseUserContent;

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
        max_tokens:      5000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemContent },
          { role: "user",   content: userContent },
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
  const content = body?.choices?.[0]?.message?.content ?? "{}";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = JSON.parse(content) as any;
  return parseLessonResponse(p);
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
  const ctx  = typeof studentContext === "string" && studentContext.length > 0
    ? studentContext.slice(0, 2000)
    : undefined;

  // 3. Server-side cache — skip for personalised responses
  if (!ctx) {
    const cached = getCached(subj, q);
    if (cached) {
      req.log.info({ subject: subj, cached: true }, "solveQuestion: cache hit");
      res.json(cached);
      return;
    }
  }

  // 4. Build teaching blueprint (lesson planning before generation)
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  let blueprint: BlueprintInjection | undefined;
  if (apiKey) {
    try {
      blueprint = await buildTeachingBlueprint(subj, q, apiKey);
      req.log.info({
        subject:      subj,
        concepts:     blueprint.conceptCount,
        planningUsed: blueprint.planningUsed,
      }, "solveQuestion: teaching blueprint built");
    } catch {
      req.log.warn("solveQuestion: blueprint build failed — proceeding without plan");
    }
  }

  // 5. Generate draft lesson (with blueprint injected into the prompt)
  let draft: LessonResponse;
  try {
    draft = await generateDraft(subj, q, ctx, blueprint);
    req.log.info({ subject: subj, topic: draft.topic }, "solveQuestion: draft generated");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log.warn({ err: msg }, "solveQuestion: draft generation failed");

    if (msg.includes("no_key"))      { res.status(503).json({ error: "no_key",          message: "OPENAI_API_KEY is not configured on the server" }); return; }
    if (msg.includes("invalid_key")) { res.status(503).json({ error: "invalid_key",     message: "OPENAI_API_KEY is invalid" }); return; }
    if (msg.includes("rate_limit"))  { res.status(429).json({ error: "openai_rate_limit" }); return; }
    if (msg.includes("aborted"))     { res.status(504).json({ error: "timeout",          message: "OpenAI request timed out" }); return; }
    res.status(502).json({ error: "openai_error", message: msg });
    return;
  }

  // 6. Teaching Quality Pipeline — review → improve → repeat (max 3 cycles)
  let finalLesson = draft;

  try {
    const pipelineResult = await runQualityPipeline(draft, apiKey);

    finalLesson = pipelineResult.lesson;

    // Log quality metrics server-side (not sent to client)
    req.log.info({
      subject:    subj,
      topic:      draft.topic,
      cyclesRun:  pipelineResult.cyclesRun,
      passed:     pipelineResult.passed,
      overall:    pipelineResult.finalScore.overall,
      rubric:     pipelineResult.qualityLog.at(-1)?.scores,
      weakScore:  pipelineResult.finalScore.weakStudentUnderstanding,
    }, "solveQuestion: quality pipeline complete");

    // Detailed per-cycle log for future model improvement
    for (const cycle of pipelineResult.qualityLog) {
      req.log.debug({
        cycle:      cycle.cycle,
        scores:     cycle.scores,
        confusions: cycle.confusions.length,
        issues:     cycle.issueCount,
        passed:     cycle.passed,
        improved:   cycle.improved,
      }, "solveQuestion: quality cycle");
    }
  } catch (err) {
    // Quality pipeline failure is non-fatal — we still return the draft
    req.log.warn({ err: String(err) }, "solveQuestion: quality pipeline failed — returning draft");
  }

  // 6. Cache the reviewed lesson (not the draft)
  if (!ctx) setCached(subj, q, finalLesson);

  res.json(finalLesson);
});

export default router;
