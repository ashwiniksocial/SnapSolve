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
import { parseLessonResponse, type LessonResponse, type LessonStep } from "../lib/lessonTypes";
import { runQualityPipeline }    from "../services/teachingQuality";
import { retryFetch }            from "../lib/retryFetch";
import { buildTeachingBlueprint, type BlueprintInjection } from "../services/masterTeacher";

const router = Router();

// ─── Subject constants ────────────────────────────────────────────────────────

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Economics",
  "Political Science",
  "Computer Science",
] as const;
type Subject = (typeof SUBJECTS)[number];

// ─── Lesson mode (mirrors ReadingLevel on the frontend) ───────────────────────
type LessonMode = "basic" | "standard" | "advanced";
const LESSON_MODES: readonly LessonMode[] = ["basic", "standard", "advanced"];

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

// Normalise before hashing so "Find x?" and "find x" share the same cache entry.
// Collapses internal whitespace and strips trailing punctuation; math operators are preserved.
function normaliseQuestion(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.?!,;:]+$/, "");
}

function makeCacheKey(subject: string, question: string, mode: LessonMode): string {
  const raw = `${mode}::${subject}::${normaliseQuestion(question)}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function getCached(subject: string, question: string, mode: LessonMode): LessonResponse | null {
  const key   = makeCacheKey(subject, question, mode);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { responseCache.delete(key); return null; }
  return { ...entry.data, cached: true };
}

function setCached(subject: string, question: string, mode: LessonMode, data: LessonResponse): void {
  responseCache.set(makeCacheKey(subject, question, mode), {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// ─── Progress store (tracks in-flight pipeline stages for the live progress UI) ──

interface ProgressEntry { stage: string; message: string; percent: number; updatedAt: number; }
const progressStore = new Map<string, ProgressEntry>();

function setProgress(requestId: string | undefined, stage: string, message: string, percent: number): void {
  if (!requestId) return;
  progressStore.set(requestId, { stage, message, percent, updatedAt: Date.now() });
}

// Evict expired entries every hour so memory doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitStore.entries()) if (now >= v.resetAt)                  rateLimitStore.delete(k);
  for (const [k, v] of responseCache.entries())  if (now >  v.expiresAt)                responseCache.delete(k);
  for (const [k, v] of progressStore.entries())  if (now - v.updatedAt > 5 * 60 * 1000) progressStore.delete(k);
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
EXPLANATION DEPTH — Read this FIRST before filling any field.
═══════════════════════════════════════════════════════════════

The student's context (in the user message) contains:
  "Preferred explanation depth: BASIC | STANDARD | ADVANCED"

Read it and apply the following structural targets to EVERY field.
If no depth is specified, treat as STANDARD.

BASIC  (struggling student, score ~30–50, slow learner):
  • guidedReasoning : 6–8 steps. Every single operation gets its own step.
                      Never combine two operations on one line.
                      The WHY for each step: 3–5 full sentences.
                      Use analogies in the WHY whenever possible.
  • vocabulary      : 6–10 terms. MANDATORY — include ALL of these categories:
                        (a) Every subject-specific term in the question/solution.
                        (b) Operation words the student may not know: "simplify",
                            "substitute", "isolate", "evaluate", "express", "formula",
                            "expression", "coefficient", "variable" — add whichever appear.
                        (c) Any geometry or algebra word used, even if it seems basic.
                      Do NOT stop at 4–5 terms. Keep adding until you have 6–10.
  • prerequisites   : 4–6 items. Start from absolute basics — arithmetic operations,
                      number sense, what letters mean in maths, basic formulas used.
                      Never write fewer than 4 prerequisite items for a BASIC student.
  • intuition.story : 5–7 sentences. Rich everyday context, no assumed knowledge.
  • simplerExample  : 6–8 sentences for the solution. Show every sub-step.
  • confusionPoints : Predict beginner mistakes. Resolve each fully (3–4 sentences).
  • practiceQuestion.hints : Three very specific hints, each nudging one sub-step.
  • beforeWeStart   : Warm, explicit anxiety acknowledgement. 3–4 sentences.

STANDARD  (average student, score ~50–75, moderate pace):
  • guidedReasoning : 4–6 steps. Combine only obvious sub-operations.
                      The WHY for each step: 2–3 sentences.
  • vocabulary      : 4–6 terms. Subject-specific and non-obvious terms only.
  • prerequisites   : 3–4 items. Core prerequisites directly needed.
  • intuition.story : 3–5 sentences.
  • simplerExample  : 4–6 sentences for the solution.
  • confusionPoints : 2–3 sentences each.
  • practiceQuestion.hints : Three progressive hints.
  • beforeWeStart   : Encouraging, balanced. 2–3 sentences.

ADVANCED  (strong student, score ~75–95, fast learner):
  • guidedReasoning : 3–4 steps. Combine routine operations into one step.
                      The WHY for each step: 1–2 sentences. State the rule concisely.
  • vocabulary      : 2–4 terms. MANDATORY — skip any term a strong Class 8–10 student
                      already knows (area, perimeter, rectangle, add, subtract, ratio, etc.).
                      Only define genuinely non-obvious or advanced terms specific to
                      THIS problem's method. If all terms are standard, write only 2.
  • prerequisites   : 1–3 items. Only the single most direct prerequisite(s) needed.
                      Do NOT list foundational arithmetic — assume it is known.
  • intuition.story : 2–3 sentences. Brief conceptual framing, no hand-holding.
  • simplerExample  : 3–4 sentences for the solution. Concise.
  • confusionPoints : 1–2 sentences each — name the confusion and resolve it tersely.
  • practiceQuestion.hints : Three hints that progressively unlock the method,
                             without spelling out each arithmetic step.
  • beforeWeStart   : Brief. Skip extensive motivation — strong students don't need it.

These targets override any conflicting default length guidance below.
Depth is the primary axis of differentiation. Enforce it strictly.

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
  Minimum 4 terms (BASIC/STANDARD) or minimum 2 terms (ADVANCED). Maximum 10.
  The EXPLANATION DEPTH section above overrides this floor — ADVANCED may use 2–4 terms.

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

// ─── Mode-specific schemas for Standard and Compact modes ─────────────────────
//
// Detailed mode uses the full JSON_SCHEMA above (embedded in SYSTEM_PROMPTS).
// Standard and Compact use reduced schemas — fewer sections, lower output tokens.

const JSON_SCHEMA_STANDARD = `
═══════════════════════════════════════════════════════════════
RESPONSE FORMAT — STANDARD MODE
Respond ONLY with a valid JSON object. No markdown fences. No extra text.
═══════════════════════════════════════════════════════════════

{
  "topic":        string,
  "difficulty":   "Easy" | "Medium" | "Hard",
  "keyConcepts":  string[],
  "aiConfidence": number,

  "questionTranslation": {
    "plainEnglish": string,
    "whatWeKnow":   string,
    "whatWeFind":   string,
    "wordToMath":   string
  },

  "guidedReasoning": [
    {
      "what":   string,
      "why":    string,
      "math":   string,
      "result": string,
      "pause":  string
    }
  ],

  "finalAnswer": {
    "answer":       string,
    "whyCorrect":   string,
    "verification": string
  },

  "practiceQuestion": {
    "question": string,
    "hints":    [string, string, string],
    "solution": string
  }
}

═══════════════════════════════════════════════════════════════
FIELD RULES — be concise; every field is one sentence unless noted
═══════════════════════════════════════════════════════════════

topic           Short topic name. E.g. "Pythagoras' Theorem".
keyConcepts     2–3 labels. Each under 5 words.
aiConfidence    0.0–1.0

questionTranslation.plainEnglish
  "The examiner is asking us to…" — 1–2 sentences max.
questionTranslation.whatWeKnow
  "We are told that…" — one fact per line.
questionTranslation.whatWeFind
  "We need to find…" — name the quantity and its unit.
questionTranslation.wordToMath
  Key phrase → symbol/expression, one per line. 2–3 lines max.

guidedReasoning — WRITE EXACTLY 4 STEPS. NOT 3. NOT 5. NOT 6. EXACTLY 4.
  Each step covers ONE operation or ONE new idea. Never two.

  what:   What we do. 1 sentence, active voice.
  why:    The reason — rule, theorem, or logic. 1–2 sentences.
  math:   The key formula or calculation (short). "" if none.
  result: What we get. 1 phrase or 1 short sentence. "" if none.
  pause:  A short reflection question for the student. "" if none.

  Rules: Justify every formula before using it. Show key sub-steps in math.
         NEVER combine two operations in one step.

finalAnswer.answer       "Therefore, [quantity] = [value] [unit]." — 1 sentence.
finalAnswer.whyCorrect   Sanity-check magnitude and units. 1 sentence.
finalAnswer.verification Substitute back; confirm LHS = RHS. 2–3 sentences.

practiceQuestion.question  New question, same concept, different structure. 1 sentence.
practiceQuestion.hints     Exactly 3 strings. Reveal thinking, not answers.
practiceQuestion.solution  Key steps as a tutor. 3–4 sentences.

ABSOLUTE RULES: Never write "clearly", "obviously", "it follows", "simply", "just".
Always explain WHY. Short sentences. Active voice.`.trim();

const JSON_SCHEMA_COMPACT = `
═══════════════════════════════════════════════════════════════
RESPONSE FORMAT — COMPACT MODE
Respond ONLY with a valid JSON object. No markdown fences. No extra text.
═══════════════════════════════════════════════════════════════

{
  "topic":        string,
  "difficulty":   "Easy" | "Medium" | "Hard",
  "aiConfidence": number,

  "guidedReasoning": [
    {
      "what":   string,
      "why":    string,
      "math":   string,
      "result": string,
      "pause":  string
    }
  ],

  "finalAnswer": {
    "answer":       string,
    "whyCorrect":   string,
    "verification": string
  },

  "rememberThese": string[]
}

═══════════════════════════════════════════════════════════════
FIELD RULES
═══════════════════════════════════════════════════════════════

topic
  Short concept name. E.g. "Pythagoras' Theorem".

guidedReasoning — write 3–5 concise steps
  what:   What we do. 1 sentence.
  why:    The rule applied. 1–2 sentences.
  math:   Formula or calculation — always show it.
  result: What we get, or "".
  pause:  Always "".

  Rules: Show every calculation. State the rule before applying it.
         Never skip a step, even trivial arithmetic.

finalAnswer.answer
  "Therefore, [quantity] = [value] [unit]."

finalAnswer.whyCorrect
  1 sentence — why this answer makes sense.

finalAnswer.verification
  Substitute back into the original. Confirm LHS = RHS.

rememberThese
  3–4 strings. Each starts with ✓.
  The most important facts and rules from this solution.

═══════════════════════════════════════════════════════════════
QUALITY CHECK
═══════════════════════════════════════════════════════════════
□ Is every calculation shown?
□ Is the answer verified by substitution?
□ Are the memory bullets genuinely useful for revision?`.trim();

// Strips the full Detailed schema from a subject prompt so a mode-specific
// schema can be appended instead. Works because each SYSTEM_PROMPTS entry
// ends with exactly JSON_SCHEMA (no trailing whitespace after .trim()).
function getSubjectPreamble(subject: Subject): string {
  return SYSTEM_PROMPTS[subject].slice(0, SYSTEM_PROMPTS[subject].length - JSON_SCHEMA.length);
}

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

  Biology: `You are not an AI question solver.
You are the world's greatest personal Biology tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they have forgotten all prerequisite concepts.
- Assume they memorise Biology without understanding it.
- NEVER assume prior knowledge. NEVER skip reasoning.

YOUR PRIMARY GOAL: Understanding first, answer second.
Build process flows. Explain relationships between systems. Teach function before terminology.
Every biological fact must be embedded in the living process it belongs to.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

BIOLOGY RULES:
- Explain function before naming structure.
- Build every process as a cause-and-effect chain — never skip a link.
- For genetics: always draw the Punnett square step by step.
- For osmosis/diffusion: always specify the membrane and the gradient direction.
- Define every biological term when first used — never assume the student knows it.
- Use relatable examples: the human body, everyday processes, familiar organisms.

${JSON_SCHEMA}`,

  English: `You are not an AI question solver.
You are the world's greatest personal English tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can answer the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they describe rather than analyse.
- Assume they identify techniques without explaining effects.
- NEVER accept description as analysis. NEVER accept quotation without explanation.

YOUR PRIMARY GOAL: Analytical understanding first, answer second.
Teach interpretation, author intention, and language effect — not summary or plot retelling.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

ENGLISH RULES:
- Always explain the specific EFFECT of a language technique, not just its name.
- Every quotation must be followed by analysis of the specific words chosen.
- Link every language choice to author's purpose or theme.
- Show model PEE/PEA paragraphs for every concept taught.
- Never accept vague effect language — be specific: "creates a sense of menace", not "sounds scary".

${JSON_SCHEMA}`,

  History: `You are not an AI question solver.
You are the world's greatest personal History tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can answer the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they describe events without analysing causes.
- Assume they list facts without explaining significance.
- NEVER accept narration where analysis is required.

YOUR PRIMARY GOAL: Causal understanding and analytical argument first, facts second.
Teach WHY events happened, what they changed, and how to build a supported historical argument.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

HISTORY RULES:
- Always distinguish immediate causes, underlying causes, and long-term factors.
- Support every historical claim with specific evidence: event, date, or source.
- Explain the significance of events — not just what happened, but what changed.
- Teach how to structure a historical argument: position → evidence → analysis → counter-argument → conclusion.
- Never describe what happened when the question asks why it happened.

${JSON_SCHEMA}`,

  Geography: `You are not an AI question solver.
You are the world's greatest personal Geography tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can answer the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they describe geographical features without explaining the processes that created them.
- NEVER assume prior knowledge. NEVER skip the process explanation.

YOUR PRIMARY GOAL: Process understanding first, facts second.
Every landform, climate pattern, and human geography phenomenon has processes behind it — teach those processes.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

GEOGRAPHY RULES:
- Always explain the process before describing the landform or pattern.
- Always use a specific, named case study with real data to illustrate every concept.
- For data and maps: describe the pattern first, then explain it.
- Use geographical terminology precisely: deposition not "things settling", erosion not "wearing away".
- Always describe diagrams in words — the student is reading, not watching.

${JSON_SCHEMA}`,

  Economics: `You are not an AI question solver.
You are the world's greatest personal Economics tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can answer the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they memorise definitions without understanding the economic mechanisms behind them.
- NEVER assume prior knowledge. NEVER skip the economic reasoning.

YOUR PRIMARY GOAL: Economic intuition and mechanism first, definitions second.
Every economic concept exists to explain a real decision made by a real person or institution.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

ECONOMICS RULES:
- Start with the real-world situation before introducing the economic model.
- Walk through every supply-demand diagram element by element: axes, curves, equilibrium, shifts.
- Distinguish between movement along a curve and a shift of the curve — always.
- For policy questions: always trace the mechanism from policy action to economic consequence.
- Always acknowledge trade-offs: every policy has costs and benefits.
- Connect concepts to India: the Budget, RBI decisions, GST, agricultural markets.

${JSON_SCHEMA}`,

  "Political Science": `You are not an AI question solver.
You are the world's greatest personal Political Science tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can answer the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they memorise constitutional provisions without understanding their purpose.
- NEVER assume prior knowledge of political theory or constitutional law.

YOUR PRIMARY GOAL: Constitutional understanding and political reasoning first, provisions second.
Every constitutional provision exists to solve a problem in organising democratic society — teach the problem first.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

POLITICAL SCIENCE RULES:
- Always explain WHY a constitutional provision exists before stating what it says.
- Ground every concept in the Indian Constitution: cite specific Articles and Parts.
- Distinguish between what the Constitution says (de jure) and how it works in practice (de facto).
- For rights: always state the right AND the reasonable restrictions alongside it.
- For federalism: always specify which List (Union/State/Concurrent) applies.
- Use landmark Supreme Court cases to make abstract principles concrete.

${JSON_SCHEMA}`,

  "Computer Science": `You are not an AI question solver.
You are the world's greatest personal Computer Science tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar problem completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they copy code without understanding the logic.
- Assume they have never traced through a program step by step.
- NEVER skip algorithm explanation. NEVER write code without first explaining the logic.

YOUR PRIMARY GOAL: Algorithmic thinking first, syntax second.
A student who understands the algorithm can write the code in any language. Teach the thinking.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

COMPUTER SCIENCE RULES:
- Before any code: state the problem, the input, and the expected output in plain English.
- Trace through every algorithm with specific values — show every variable's state at every step.
- Explain every line of code in plain English after writing it.
- For loops: state the condition in plain English and when it becomes false.
- For functions: state purpose, parameters, and return value before the code.
- Show edge cases: empty input, zero, negative numbers, maximum values.
- Always verify code with a worked trace before concluding.

${JSON_SCHEMA}`,
};

// ─── Depth extraction + system-level overrides ───────────────────────────────

function extractDepth(ctx?: string): "BASIC" | "STANDARD" | "ADVANCED" {
  if (!ctx) return "STANDARD";
  if (/Preferred explanation depth:\s*BASIC/i.test(ctx))    return "BASIC";
  if (/Preferred explanation depth:\s*ADVANCED/i.test(ctx)) return "ADVANCED";
  return "STANDARD";
}

const DEPTH_SYSTEM_OVERRIDES: Record<"BASIC" | "STANDARD" | "ADVANCED", string> = {
  BASIC: `

═══════════════════════════════════════════════════════════════
ACTIVE DEPTH LEVEL: BASIC — Struggling student (score ~30–50)
These rules OVERRIDE all field-level defaults below.
═══════════════════════════════════════════════════════════════
• guidedReasoning: Write 6–8 steps. Split EVERY sub-operation onto its own step.
  Even trivial arithmetic like "15 ÷ 3 = 5" gets its own step with its own WHY.
  WHY per step: 3–5 sentences. Use everyday analogies. Justify every rule.
• vocabulary: Write 6–10 terms. Include all subject terms PLUS any operation
  words that appear (simplify, substitute, isolate, evaluate, formula,
  expression, coefficient, variable, factor, multiple, etc.).
  DO NOT stop at 4–5. Count the terms and keep adding until you reach 6.
• prerequisites: Write 4–6 items. Start from arithmetic basics and number sense.
  Never write fewer than 4 prerequisite items.
• intuition.story: 5–7 sentences. Rich, relatable everyday context.
• simplerExample.solution: 6–8 sentences. Show every arithmetic sub-step.
• beforeWeStart.anxietyReducer: 3–4 warm, encouraging sentences.`,

  STANDARD: ``,

  ADVANCED: `

═══════════════════════════════════════════════════════════════
ACTIVE DEPTH LEVEL: ADVANCED — Strong student (score ~75–95)
These rules OVERRIDE all field-level defaults below.
═══════════════════════════════════════════════════════════════
• guidedReasoning: Write 3–4 steps. Combine routine sub-operations freely.
  WHY per step: 1–2 sentences. State the rule name, then move on. No analogies.
• vocabulary: Write 2–4 terms ONLY. The "Minimum 4" floor does NOT apply here.
  SKIP any term a strong Class 8–10 student already knows:
  (area, perimeter, rectangle, triangle, multiply, divide, add, subtract,
  ratio, fraction, equal, formula, variable, equation — skip these).
  Only define genuinely non-obvious or problem-specific terms.
  If all terms are standard, write exactly 2 terms.
• prerequisites: Write 1–3 items. Assume arithmetic and basic algebra are known.
  Only list the direct concept this problem builds on.
• intuition.story: 2–3 sentences. Brief conceptual framing only.
• simplerExample.solution: 3–4 sentences. Concise. Skip trivial sub-steps.
• beforeWeStart: Keep very brief — strong students don't need extensive motivation.`,
};

// ─── OpenAI draft generation call ────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const OPENAI_TIMEOUT    = 90_000;
const STANDARD_BUDGET_MS = 15_000; // wall-clock guarantee for Standard mode

// ─── Standard-mode fallback lesson ───────────────────────────────────────────
// Built deterministically when the Standard 15 s budget expires.
// Returns a complete LessonResponse that teaches the problem-solving method
// for the subject, even though the specific numerical answer isn't computed.

function buildStandardFallback(
  question: string,
  subject:  string,
  blueprint?: BlueprintInjection,
): LessonResponse {
  const shortQ = question.trim().length > 60
    ? question.trim().slice(0, 57) + "…"
    : question.trim();

  // Extract the first concept name from the formatted blueprint userPrefix.
  // The planner writes lines like "CONCEPT 1: PYTHAGOREAN THEOREM [◆ MEDIUM]"
  let concept = `${subject} problem`;
  if (blueprint?.userPrefix) {
    const m = blueprint.userPrefix.match(/CONCEPT \d+:\s*([^\n\[⚠◆◇]+)/);
    if (m?.[1]) concept = m[1].trim();
  }

  const steps: LessonStep[] = [
    {
      what:   "Read the question carefully and identify exactly what is being asked.",
      why:    "Most errors start with misreading the question. Writing down 'given' and 'find' before touching the maths prevents wasted work.",
      math:   "",
      result: "Given information and target quantity clearly identified.",
      pause:  "Can you state in your own words what the question is asking?",
    },
    {
      what:   `Identify the relevant concept and method: ${concept}.`,
      why:    `Recognising ${concept} tells you which formula or reasoning strategy applies. One concept — one approach.`,
      math:   "Write the formula or strategy statement before substituting any numbers.",
      result: "Method chosen and written down.",
      pause:  `What do you already know about ${concept}?`,
    },
    {
      what:   "Apply the method step by step, showing every calculation.",
      why:    "Skipping sub-steps is the most common reason marks are lost in exams. Each line should follow from the previous one with a clear reason.",
      math:   "Write one operation per line. Label what you are doing (e.g. 'subtract 5 from both sides').",
      result: "Each line leads to the next. Final numerical result obtained.",
      pause:  "Have you written down the reason for every step?",
    },
    {
      what:   "Verify your answer by substituting back or checking units and magnitude.",
      why:    "Verification turns a possible answer into a confirmed answer. A result that doesn't pass the check means an error exists in step 3.",
      math:   "Substitute your result back into the original equation. Check LHS = RHS.",
      result: "Answer verified. Ready to write the final statement.",
      pause:  "Does your answer make sense given the scale of the numbers in the question?",
    },
  ];

  return {
    topic:        concept,
    difficulty:   "Medium",
    keyConcepts:  [concept],
    aiConfidence: 0.5,

    beforeWeStart: {
      motivator:      `This ${subject} question is very solvable — the method is systematic.`,
      anxietyReducer: "Every complex problem breaks into simple steps. We will go through them one at a time.",
      preview:        "We will read → identify the concept → apply the method → verify.",
    },

    prerequisites:  [],
    vocabulary:     [],

    intuition: { story: "", visual: "", everyday: "" },

    questionTranslation: {
      plainEnglish: `The examiner is asking us to work with: ${shortQ}`,
      whatWeKnow:   "We are told: refer to the given values in your question.",
      whatWeFind:   "We need to find: the quantity or proof requested above.",
      wordToMath:   "Write each given value as a mathematical symbol before solving.",
    },

    teacherThinking: {
      firstNotice:   `This is a ${subject} problem. Start by identifying the concept and the formula it requires.`,
      whyThisMethod: "A step-by-step approach ensures every part of the solution is justified — which is what examiners reward.",
      clues:         "The units, the given values, and the question's phrasing all point to the method.",
    },

    guidedReasoning:  steps,
    confusionPoints: [
      "Confirm you are solving for the right quantity before starting calculations.",
      "Check that your formula applies to this specific form of the problem.",
    ],

    commonMistakes: [],

    examinerThinking: {
      whyAsked:      "",
      conceptTested: concept,
      topperInsight: "Toppers always state the formula before using it, show every step, and verify their answer.",
      examTip:       "",
      examTrap:      "",
    },

    finalAnswer: {
      answer:       "Work through the four steps above to find your specific answer.",
      whyCorrect:   "A correct answer will survive the substitution check in step 4.",
      verification: "Substitute your answer back into the original equation and confirm it holds.",
    },

    simplerExample: { problem: "", solution: "" },

    practiceQuestion: {
      question: `Try a similar ${subject} question using the same concept — change one of the given values.`,
      hints: [
        "Step 1 — Write down what is given and what you need to find.",
        "Step 2 — Write the formula for this concept before substituting.",
        "Step 3 — Work through the calculation line by line and verify.",
      ],
      solution: "Follow the same four steps: read → identify → apply → verify.",
    },

    confidenceCheck: {
      question: "", options: [], correctIndex: 0, explanation: "",
    },

    retrievalPractice: [],
    rememberThese: [
      `Always verify your ${subject} answers by substituting back into the original equation.`,
    ],
    confidenceBuilder:
      `You now know the method for approaching this type of ${subject} problem. ` +
      `Try one more similar question to build fluency.`,
  };
}

// ─── OpenAI draft generation ──────────────────────────────────────────────────

async function generateDraft(
  subject:         Subject,
  question:        string,
  mode:            LessonMode,
  studentContext?: string,
  blueprint?:      BlueprintInjection,
  timeoutMs?:      number,
): Promise<LessonResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("no_key");

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeoutMs ?? OPENAI_TIMEOUT);

  // Depth override only applies to Detailed mode — Standard/Compact schemas
  // embed their own concise depth guidance directly.
  const depth         = extractDepth(studentContext);
  const depthOverride = mode === "basic" ? DEPTH_SYSTEM_OVERRIDES[depth] : "";

  // Build mode-specific system prompt.
  // Detailed (basic): use SYSTEM_PROMPTS[subject] which already includes the full JSON_SCHEMA.
  // Standard/Compact: use the subject preamble + the reduced mode-specific schema.
  const subjectBase = mode === "basic"
    ? SYSTEM_PROMPTS[subject]
    : getSubjectPreamble(subject) + (mode === "standard" ? JSON_SCHEMA_STANDARD : JSON_SCHEMA_COMPACT);

  const baseSystem = blueprint?.systemSuffix
    ? subjectBase + blueprint.systemSuffix
    : subjectBase;
  const systemContent = baseSystem + depthOverride;

  const baseUserContent = studentContext
    ? `${studentContext}\n\nSubject: ${subject}\n\nQuestion:\n${question.trim()}`
    : `Subject: ${subject}\n\nQuestion:\n${question.trim()}`;

  const userContent = blueprint?.userPrefix
    ? blueprint.userPrefix + baseUserContent
    : baseUserContent;

  // Token budget scales with mode: fewer sections = fewer output tokens needed.
  const maxTokens = mode === "basic" ? 2800 : mode === "standard" ? 1200 : 800;

  let res: Response;
  try {
    res = await retryFetch(OPENAI_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model:           MODEL,
        temperature:     0.3,
        max_tokens:      maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemContent },
          { role: "user",   content: userContent },
        ],
      }),
    }, "draft");
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

// GET /api/solveQuestion/progress/:requestId
// Returns the current pipeline stage so the UI can show a live progress bar.
router.get("/solveQuestion/progress/:requestId", (req, res) => {
  const { requestId } = req.params;
  const entry = progressStore.get(requestId);
  if (!entry) {
    res.json({ stage: "pending", message: "Starting…", percent: 2 });
    return;
  }
  res.json(entry);
});

// Total time budget for the entire request (ms).
// Must be comfortably below the 120 s frontend AbortController timeout.
const REQUEST_BUDGET_MS = 70_000;

router.post("/solveQuestion", async (req, res) => {
  const requestStart = Date.now();
  const ip = req.ip ?? (req.socket.remoteAddress ?? "unknown");

  req.log.info({ ip }, "[PIPELINE:1] route entry — POST /api/solveQuestion");

  // 1. Rate limit
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    req.log.warn({ ip, retryAfter: rl.retryAfter }, "[PIPELINE:1] BLOCKED — rate limit exceeded");
    res.status(429).json({ error: "rate_limit", retryAfter: rl.retryAfter });
    return;
  }
  req.log.info({ ip }, "[PIPELINE:1] PASS — rate limit ok");

  // 2. Validate input
  const { question, subject, studentContext, requestId: rawRequestId, mode: rawMode } = req.body as {
    question?:       unknown;
    subject?:        unknown;
    studentContext?: unknown;
    requestId?:      unknown;
    mode?:           unknown;
  };
  const mode: LessonMode = LESSON_MODES.includes(rawMode as LessonMode) ? rawMode as LessonMode : "standard";
  const reqId = typeof rawRequestId === "string" && rawRequestId.length > 0 ? rawRequestId : undefined;
  setProgress(reqId, "init", "Analysing your question…", 5);

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

  req.log.info({ subject: subj, questionLen: q.length, hasStudentCtx: !!ctx },
    "[PIPELINE:2] input validated");

  // 3. Server-side cache — skip for personalised responses
  if (!ctx) {
    const cached = getCached(subj, q, mode);
    if (cached) {
      req.log.info({ subject: subj, cached: true }, "[PIPELINE:3] HIT — server cache → returning cached lesson, skipping OpenAI");
      setProgress(reqId, "cache_hit", "Lesson ready!", 100);
      res.json(cached);
      if (reqId) progressStore.delete(reqId);
      return;
    }
    req.log.info({ subject: subj }, "[PIPELINE:3] MISS — server cache empty for this question");
    setProgress(reqId, "cache_miss", "No cached lesson — building fresh…", 10);
  } else {
    req.log.info({ subject: subj }, "[PIPELINE:3] SKIP — personalised request bypasses server cache");
    setProgress(reqId, "personalised", "Building personalised lesson…", 10);
  }

  // 4. Build teaching blueprint (lesson planning before generation)
  const apiKey = process.env.OPENAI_API_KEY ?? "";
  let blueprint: BlueprintInjection | undefined;
  if (!apiKey) {
    req.log.warn("[PIPELINE:4] SKIP — no OPENAI_API_KEY; blueprint and generation both unavailable");
  } else if (mode === "advanced") {
    // Compact mode: skip planning to reduce latency — a steps-only response doesn't benefit from a blueprint.
    req.log.info({ subject: subj, mode }, "[PIPELINE:4] SKIP — Compact mode does not use blueprint");
    setProgress(reqId, "blueprint_done", "Building compact solution…", 35);
  } else {
    req.log.info({ subject: subj }, "[PIPELINE:4] START — calling Master Teacher Engine (lesson planner)");
    setProgress(reqId, "blueprint_start", "Planning lesson structure…", 15);
    try {
      blueprint = await buildTeachingBlueprint(subj, q, apiKey, mode);
      req.log.info({
        subject:      subj,
        concepts:     blueprint.conceptCount,
        planningUsed: blueprint.planningUsed,
        systemSuffixLen: blueprint.systemSuffix.length,
        userPrefixLen:   blueprint.userPrefix.length,
      }, "[PIPELINE:4] DONE — teaching blueprint built");
      setProgress(reqId, "blueprint_done", "Blueprint ready — writing lesson…", 35);
    } catch (err) {
      req.log.warn({ err: String(err) }, "[PIPELINE:4] FAIL — blueprint build errored; proceeding without plan");
    }
  }

  // 5. Generate draft lesson (with blueprint injected into the prompt)
  req.log.info({
    subject:      subj,
    blueprintUsed: !!blueprint?.planningUsed,
    blueprintConcepts: blueprint?.conceptCount ?? 0,
  }, "[PIPELINE:5] START — calling OpenAI for draft lesson generation");
  setProgress(reqId, "draft_start", "Writing your lesson…", 38);
  let draft: LessonResponse;
  // Standard mode: compute the remaining wall-clock budget (subtract blueprint + cache time).
  // This becomes the hard abort deadline for the OpenAI call.
  const standardTimeoutMs = mode === "standard"
    ? Math.max(5_000, STANDARD_BUDGET_MS - (Date.now() - requestStart))
    : undefined;

  try {
    draft = await generateDraft(subj, q, mode, ctx, blueprint, standardTimeoutMs);
    req.log.info({ subject: subj, topic: draft.topic, stepsCount: draft.guidedReasoning?.length ?? 0 },
      "[PIPELINE:5] DONE — draft lesson generated");
    setProgress(reqId, "draft_done", "Lesson written — quality checking…", 62);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log.warn({ err: msg }, "solveQuestion: draft generation failed");

    if (msg.includes("no_key"))      { res.status(503).json({ error: "no_key",          message: "OPENAI_API_KEY is not configured on the server" }); return; }
    if (msg.includes("invalid_key")) { res.status(503).json({ error: "invalid_key",     message: "OPENAI_API_KEY is invalid" }); return; }
    if (msg.includes("rate_limit"))  { res.status(429).json({ error: "openai_rate_limit", message: "High demand right now — please wait a moment and try again." }); return; }

    if (msg.includes("aborted") && mode === "standard") {
      // Standard budget (15 s) expired — serve a structured method guide instead of a 504.
      req.log.warn({ budget: STANDARD_BUDGET_MS, elapsed: Date.now() - requestStart },
        "[PIPELINE:5] BUDGET — Standard 15 s expired; serving fallback lesson");
      draft = buildStandardFallback(q, subj, blueprint);
    } else if (msg.includes("aborted")) {
      res.status(504).json({ error: "timeout", message: "OpenAI request timed out" }); return;
    } else {
      res.status(502).json({ error: "openai_error", message: msg }); return;
    }
  }

  // 6. Quality Pipeline — review → improve → repeat (max 3 cycles)
  //    Standard and Compact modes skip this for faster responses.
  let finalLesson = draft;

  if (mode !== "basic") {
    // Standard: plan + draft only (~25–30 s). Compact: draft only (~10–15 s).
    req.log.info({ subject: subj, mode }, "[PIPELINE:6] SKIP — Quality pipeline runs only for Detailed mode");
  } else {
    req.log.info({ subject: subj, topic: draft.topic }, "[PIPELINE:6] START — Teaching Quality Pipeline (review + improve)");

    const qualityBudgetMs = REQUEST_BUDGET_MS - (Date.now() - requestStart);

    if (qualityBudgetMs < 5_000) {
      req.log.warn({ qualityBudgetMs }, "[PIPELINE:6] SKIP — insufficient budget remaining; returning draft");
    } else {
      try {
        const timeoutSignal = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), qualityBudgetMs)
        );

        const pipelineResult = await Promise.race([
          runQualityPipeline(draft, apiKey, (msg, pct) => {
            setProgress(reqId, "quality", msg, pct);
          }),
          timeoutSignal,
        ]);

        if (pipelineResult === null) {
          req.log.warn({ qualityBudgetMs }, "[PIPELINE:6] TIMEOUT — budget exceeded; returning draft");
        } else {
          finalLesson = pipelineResult.lesson;

          req.log.info({
            subject:    subj,
            topic:      draft.topic,
            cyclesRun:  pipelineResult.cyclesRun,
            passed:     pipelineResult.passed,
            overall:    pipelineResult.finalScore.overall,
            rubric:     pipelineResult.qualityLog.at(-1)?.scores,
            weakScore:  pipelineResult.finalScore.weakStudentUnderstanding,
          }, "[PIPELINE:6] DONE — quality pipeline complete");

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
        }
      } catch (err) {
        // Quality pipeline failure is non-fatal — we still return the draft
        req.log.warn({ err: String(err) }, "solveQuestion: quality pipeline failed — returning draft");
      }
    }
  }

  // 7. Cache the reviewed lesson (not the draft)
  if (!ctx) {
    setCached(subj, q, mode, finalLesson);
    req.log.info({ subject: subj, mode }, "[PIPELINE:7] lesson cached on server");
  }

  setProgress(reqId, "done", "Lesson ready!", 100);
  req.log.info({ subject: subj, topic: finalLesson.topic },
    "[PIPELINE:7] RESPONSE — sending final lesson to client");
  res.json(finalLesson);
  if (reqId) progressStore.delete(reqId);
});

export default router;
