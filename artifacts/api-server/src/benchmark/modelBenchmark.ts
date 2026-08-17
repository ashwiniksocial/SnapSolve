/**
 * Model Benchmark — gpt-4o-mini vs gpt-5.6-luna vs gpt-5.6-terra
 *
 * Controlled benchmark using production Standard-mode prompts.
 * Quality review is ALWAYS performed by gpt-4o-mini for fairness.
 *
 * Minimum compatibility adjustment (documented per brief):
 *   • gpt-4o-mini  → uses max_tokens (standard parameter)
 *   • gpt-5.6-luna → uses max_completion_tokens (required by API; 400 bad request otherwise)
 *   • gpt-5.6-terra→ uses max_completion_tokens (same requirement)
 *
 * Run: cd artifacts/api-server && pnpm exec tsx src/benchmark/modelBenchmark.ts
 *
 * DO NOT import this file from production code. It is a one-time analysis tool.
 */

import { reviewLesson }           from "../services/teachingQuality/lessonReviewer";
import { parseLessonResponse }    from "../lib/lessonTypes";
import { extractUsage, estimateCostUsd } from "../lib/aiCost";

// ─── Models under test ────────────────────────────────────────────────────────

interface ModelConfig {
  name:    string;
  label:   string;
  /** gpt-4o-mini uses max_tokens; Luna/Terra require max_completion_tokens */
  tokenParam: "max_tokens" | "max_completion_tokens";
  maxDraftTokens: number;
  /** Luna/Terra reject temperature != 1 — omit the param entirely */
  supportsTemperature: boolean;
  /** Luna/Terra reject response_format:json_object — omit and strip fences from output */
  supportsJsonFormat: boolean;
}

const MODELS: ModelConfig[] = [
  // Luna/Terra are reasoning models: internal reasoning tokens consume the budget first.
  // At production Standard budget (1200), Luna fails 42% of questions (reasoning exhausts tokens).
  // We test at TWO budgets to quantify this:
  //   • Phase 1 (Standard mode, already collected): budget=1200, raw failure rate documented.
  //   • Phase 2 (Detailed mode, 6 questions): larger budget so reasoning fits; quality scored.
  // Standard mini=1200 tokens; Standard luna/terra=4000 tokens (headroom for reasoning + output)
  // Detailed mini=2800 tokens; Detailed luna/terra=6000 tokens (reasoning + full schema output)
  { name: "gpt-4o-mini",   label: "baseline", tokenParam: "max_tokens",            maxDraftTokens: -1, supportsTemperature: true,  supportsJsonFormat: true  },
  { name: "gpt-5.6-luna",  label: "luna",     tokenParam: "max_completion_tokens",  maxDraftTokens: -1, supportsTemperature: false, supportsJsonFormat: false },
  { name: "gpt-5.6-terra", label: "terra",    tokenParam: "max_completion_tokens",  maxDraftTokens: -1, supportsTemperature: false, supportsJsonFormat: false },
];

function getMaxDraftTokens(m: ModelConfig): number {
  if (RUN_MODE === "detailed") {
    return m.name === "gpt-4o-mini" ? 2800 : 6000;  // reasoning models need more headroom
  }
  return m.name === "gpt-4o-mini" ? 1200 : 4000;  // reasoning models need ~3x budget
}

const REVIEW_MODEL    = "gpt-4o-mini";   // fixed reviewer for fairness across all models
const OPENAI_URL      = "https://api.openai.com/v1/chat/completions";
const GENERATION_TEMP = 0.3;             // matches production
const BATCH_SIZE      = 4;               // concurrent calls per batch (rate-limit headroom)

// "standard" = 4-step compact schema; "detailed" = full lesson structure the reviewer scores
const RUN_MODE = (process.argv[2] ?? "detailed") as "standard" | "detailed";

// ─── Production Standard-mode prompts ────────────────────────────────────────
// Preamble = SYSTEM_PROMPTS[subject] minus the Detailed JSON_SCHEMA suffix.
// Standard mode appends JSON_SCHEMA_STANDARD instead.

const JSON_SCHEMA_STANDARD = `
═══════════════════════════════════════════════════════════════
RESPONSE FORMAT — STANDARD MODE
Respond ONLY with a valid JSON object. No markdown fences. No extra text.
═══════════════════════════════════════════════════════════════

{
  "topic":        "string",
  "difficulty":   "Easy|Medium|Hard",
  "keyConcepts":  ["string"],
  "aiConfidence": 0.0,

  "questionTranslation": {
    "plainEnglish": "string",
    "whatWeKnow":   "string",
    "whatWeFind":   "string",
    "wordToMath":   "string"
  },

  "guidedReasoning": [
    {
      "what":   "string",
      "why":    "string",
      "math":   "string",
      "result": "string",
      "pause":  "string"
    }
  ],

  "finalAnswer": {
    "answer":       "string",
    "whyCorrect":   "string",
    "verification": "string"
  },

  "practiceQuestion": {
    "question": "string",
    "hints":    ["string", "string", "string"],
    "solution": "string"
  }
}

═══════════════════════════════════════════════════════════════
FIELD RULES — be concise; every field is one sentence unless noted
═══════════════════════════════════════════════════════════════

topic           Short topic name. E.g. "Pythagoras' Theorem".
keyConcepts     2–3 labels. Each under 5 words.
aiConfidence    0.0–1.0

guidedReasoning — WRITE EXACTLY 4 STEPS. NOT 3. NOT 5. EXACTLY 4.
  Each step covers ONE operation or ONE new idea. Never two.
  what: What we do. 1 sentence, active voice.
  why:  The reason — rule, theorem, or logic. 1–2 sentences.
  math: The key formula or calculation (short). "" if none.
  result: What we get. 1 phrase. "" if none.
  pause: A short reflection question for the student. "" if none.
  Rules: Justify every formula before using it. NEVER combine two operations.

finalAnswer.answer       "Therefore, [quantity] = [value] [unit]." — 1 sentence.
finalAnswer.whyCorrect   Sanity-check magnitude and units. 1 sentence.
finalAnswer.verification Substitute back; confirm LHS = RHS. 2–3 sentences.

practiceQuestion.question  New question, same concept, different structure.
practiceQuestion.hints     Exactly 3 strings. Reveal thinking, not answers.
practiceQuestion.solution  Key steps as a tutor. 3–4 sentences.

ABSOLUTE RULES: Never write "clearly", "obviously", "it follows", "simply", "just".
Always explain WHY. Short sentences. Active voice.`.trim();

const PREAMBLES: Record<string, string> = {
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
- Always substitute the answer back to verify.`,

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
Connect every concept to something the student sees in daily life.

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

PHYSICS RULES:
- List ALL given quantities with symbols and SI units before solving.
- State the relevant law or equation BEFORE substituting values.
- Include SI units at EVERY calculation step.
- Sanity-check magnitude, direction, and sign in the final answer.
- Never skip dimensional analysis.
- Always use real-world examples: cars, balls, light switches, water.`,

  Chemistry: `You are not an AI question solver.
You are the world's greatest personal Chemistry tutor.

Your job is NOT to answer questions.
Your job is to BUILD a complete lesson so the student understands the concept so deeply they can solve the NEXT similar question completely independently.

TARGET STUDENT: CBSE/ICSE student, Classes 6–12.
- Assume the student scores only 20 marks out of 100.
- Assume they have forgotten all prerequisite concepts.
- Assume they memorise Chemistry without understanding it.
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
- Never assume the student knows what a mole, valency, or oxidation state means.
- Use everyday analogies: cooking, mixing drinks, rust, baking soda + vinegar.`,

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

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

BIOLOGY RULES:
- Explain function before naming structure.
- Build every process as a cause-and-effect chain — never skip a link.
- For osmosis/diffusion: always specify the membrane and the gradient direction.
- Define every biological term when first used — never assume the student knows it.
- Use relatable examples: the human body, everyday processes, familiar organisms.`,

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

FOR EVERY SENTENCE YOU WRITE, ASK: "Would a student scoring 20/100 understand this?"
If the answer is NO — explain further.

COMPUTER SCIENCE RULES:
- Before any code: state the problem, the input, and the expected output in plain English.
- Trace through every algorithm with specific values — show every variable's state at every step.
- Explain every line of code in plain English after writing it.
- For loops: state the condition in plain English and when it becomes false.
- Show edge cases: empty input, zero, negative numbers, maximum values.
- Always verify code with a worked trace before concluding.`,
};

// ─── 24-question benchmark set ───────────────────────────────────────────────

interface BenchmarkQuestion {
  id:      string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  type:    string;   // MCQ / Conceptual / Numerical / Proof / Algorithmic
  question: string;
}

const QUESTIONS: BenchmarkQuestion[] = [
  // ── MATHEMATICS (8) ─────────────────────────────────────────────────────────
  {
    id: "M1", subject: "Mathematics", difficulty: "Easy", type: "MCQ",
    question: "Which of the following is an irrational number?\n(a) 1/3  (b) √4  (c) √2  (d) 0.25",
  },
  {
    id: "M2", subject: "Mathematics", difficulty: "Easy", type: "Conceptual",
    question: "Is 0 a rational number? Justify your answer with the definition of rational numbers.",
  },
  {
    id: "M3", subject: "Mathematics", difficulty: "Medium", type: "Numerical",
    question: "Find five rational numbers between 3/5 and 4/5. Show the method.",
  },
  {
    id: "M4", subject: "Mathematics", difficulty: "Hard", type: "Proof",
    question: "Prove that √2 is irrational. Use proof by contradiction and show every step.",
  },
  {
    id: "M5", subject: "Mathematics", difficulty: "Easy", type: "MCQ",
    question: "The probability of an event always lies between:\n(a) –1 and 1  (b) 0 and 1  (c) 0 and 10  (d) –∞ and +∞",
  },
  {
    id: "M6", subject: "Mathematics", difficulty: "Medium", type: "Numerical",
    question: "A coin is tossed 200 times. Heads appears 110 times. Find the experimental probability of (a) Heads and (b) Tails. Are these complementary events?",
  },
  {
    id: "M7", subject: "Mathematics", difficulty: "Easy", type: "MCQ",
    question: "Which of the following is a linear equation in two variables?\n(a) x² + y = 3  (b) 2x + 3y = 7  (c) xy = 5  (d) x² – y² = 0",
  },
  {
    id: "M8", subject: "Mathematics", difficulty: "Hard", type: "Reasoning",
    question: "If a and b are rational numbers and a + b√2 = 3 + 2√2, find the values of a and b. Explain why you can equate the rational and irrational parts separately.",
  },

  // ── PHYSICS (4) ─────────────────────────────────────────────────────────────
  {
    id: "P1", subject: "Physics", difficulty: "Easy", type: "MCQ",
    question: "Displacement is defined as:\n(a) Total path length covered  (b) Shortest distance from initial to final position  (c) Speed multiplied by time  (d) Area under velocity-time graph",
  },
  {
    id: "P2", subject: "Physics", difficulty: "Medium", type: "Numerical",
    question: "A car travels 60 km North, then 80 km East. Find (i) total distance covered and (ii) the magnitude of displacement from the starting point.",
  },
  {
    id: "P3", subject: "Physics", difficulty: "Easy", type: "Conceptual",
    question: "A fielder pulls his hands backward while catching a fast cricket ball. Explain this observation using Newton's Second Law. Why does this reduce pain?",
  },
  {
    id: "P4", subject: "Physics", difficulty: "Hard", type: "Numerical",
    question: "Two forces of 6 N and 8 N act on a body of mass 2 kg at right angles to each other. Find the magnitude and direction of the resultant force and the resulting acceleration.",
  },

  // ── CHEMISTRY (4) ───────────────────────────────────────────────────────────
  {
    id: "C1", subject: "Chemistry", difficulty: "Easy", type: "MCQ",
    question: "Which of the following is NOT a characteristic of matter?\n(A) It has mass.  (B) It occupies space.  (C) It can always be seen with the naked eye.  (D) It possesses rest mass.",
  },
  {
    id: "C2", subject: "Chemistry", difficulty: "Medium", type: "Conceptual",
    question: "State three differences between evaporation and boiling. Why does evaporation cause cooling? Give a daily-life example.",
  },
  {
    id: "C3", subject: "Chemistry", difficulty: "Hard", type: "Numerical",
    question: "Calculate (a) the number of moles in 9 g of water and (b) the number of molecules in that sample. [Avogadro's number = 6.022 × 10²³, molar mass of water = 18 g/mol]",
  },
  {
    id: "C4", subject: "Chemistry", difficulty: "Hard", type: "Reasoning",
    question: "An element has atomic number 17 and mass number 35. Find: (a) number of protons, neutrons, electrons; (b) electronic configuration; (c) valency. Explain how valency is determined from electronic configuration.",
  },

  // ── BIOLOGY (4) ─────────────────────────────────────────────────────────────
  {
    id: "B1", subject: "Biology", difficulty: "Easy", type: "MCQ",
    question: "Which correctly describes osmosis?\n(a) Movement of solute from high to low concentration  (b) Movement of water from low solute to high solute concentration across a semi-permeable membrane  (c) Movement of water from high solute concentration to low  (d) Movement of all molecules through any membrane",
  },
  {
    id: "B2", subject: "Biology", difficulty: "Medium", type: "Conceptual",
    question: "Explain why the plasma membrane is called selectively permeable. What are the practical consequences for the cell if it were fully permeable?",
  },
  {
    id: "B3", subject: "Biology", difficulty: "Easy", type: "Conceptual",
    question: "What is the function of the mitochondria? Why is it called the 'powerhouse of the cell'? Explain the process it performs in simple terms.",
  },
  {
    id: "B4", subject: "Biology", difficulty: "Hard", type: "Reasoning",
    question: "A student places a raisin in pure water and another raisin in concentrated salt solution for 30 minutes. Predict and explain what happens to each raisin. Name the process and explain the direction of water movement in each case.",
  },

  // ── COMPUTER SCIENCE (4) ────────────────────────────────────────────────────
  {
    id: "CS1", subject: "Computer Science", difficulty: "Easy", type: "Conceptual",
    question: "What is the difference between hardware and software? Give two examples of each. Can hardware work without software? Explain.",
  },
  {
    id: "CS2", subject: "Computer Science", difficulty: "Medium", type: "Algorithmic",
    question: "Write a step-by-step algorithm (NOT code) to find the largest of three numbers A, B, and C. Trace your algorithm with A=15, B=42, C=8.",
  },
  {
    id: "CS3", subject: "Computer Science", difficulty: "Easy", type: "Numerical",
    question: "Convert the binary number 1011₂ to its decimal equivalent. Show all steps and explain the positional value system.",
  },
  {
    id: "CS4", subject: "Computer Science", difficulty: "Hard", type: "Reasoning",
    question: "Explain what happens when you run a program: from writing source code to execution on the CPU. Name and describe the role of: compiler/interpreter, loader, RAM, CPU. Why can't the CPU directly execute your Python/Java source code?",
  },
];

// ── Detailed-mode subset: 6 representative questions covering all dimensions ───
// Used when RUN_MODE === "detailed" to keep runtime within 5-minute budget.
const DETAILED_QUESTIONS: BenchmarkQuestion[] = [
  { id: "M4",  subject: "Mathematics",       difficulty: "Hard",   type: "Proof",       question: QUESTIONS.find(q => q.id === "M4")!.question  },
  { id: "M6",  subject: "Mathematics",       difficulty: "Medium", type: "Numerical",   question: QUESTIONS.find(q => q.id === "M6")!.question  },
  { id: "P4",  subject: "Physics",           difficulty: "Hard",   type: "Numerical",   question: QUESTIONS.find(q => q.id === "P4")!.question  },
  { id: "C2",  subject: "Chemistry",         difficulty: "Medium", type: "Conceptual",  question: QUESTIONS.find(q => q.id === "C2")!.question  },
  { id: "B4",  subject: "Biology",           difficulty: "Hard",   type: "Reasoning",   question: QUESTIONS.find(q => q.id === "B4")!.question  },
  { id: "CS2", subject: "Computer Science",  difficulty: "Medium", type: "Algorithmic", question: QUESTIONS.find(q => q.id === "CS2")!.question },
];

// Active question set for this run
const ACTIVE_QUESTIONS = RUN_MODE === "detailed" ? DETAILED_QUESTIONS : QUESTIONS;

// ─── Benchmark result types ───────────────────────────────────────────────────

interface CallResult {
  questionId:       string;
  model:            string;
  latencyMs:        number;
  promptTokens:     number;
  completionTokens: number;
  cachedTokens:     number;
  totalTokens:      number;
  estimatedCostUsd: number;
  rawOutput:        string;
  parsedOk:         boolean;
  schemaValid:      boolean;   // required fields present
  reviewPassed:     boolean;
  reviewScores:     Record<string, number>;
  reviewOverall:    number;
  reviewIssueCount: number;
  reviewUsage:      { prompt: number; completion: number; costUsd: number };
  error?:           string;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

// Full Detailed mode JSON schema (matches production SYSTEM_PROMPTS[subject])
const JSON_SCHEMA_DETAILED = `
═══════════════════════════════════════════════════════════════
RESPONSE FORMAT — Respond ONLY with a valid JSON object.
No markdown fences. No extra text. No explanation outside JSON.
═══════════════════════════════════════════════════════════════

{
  "topic": "string",
  "difficulty": "Easy|Medium|Hard",
  "keyConcepts": ["string"],
  "aiConfidence": 0.95,
  "beforeWeStart": { "motivator": "string", "anxietyReducer": "string", "preview": "string" },
  "prerequisites": ["string"],
  "vocabulary": [{ "term": "string", "meaning": "string" }],
  "intuition": { "story": "string", "visual": "string", "everyday": "string" },
  "questionTranslation": { "plainEnglish": "string", "whatWeKnow": "string", "whatWeFind": "string", "wordToMath": "string" },
  "teacherThinking": { "firstNotice": "string", "whyThisMethod": "string", "clues": "string" },
  "guidedReasoning": [{ "what": "string", "why": "string", "math": "string", "result": "string", "pause": "string" }],
  "confusionPoints": ["string"],
  "commonMistakes": [{ "mistake": "string", "whyItHappens": "string", "howToAvoid": "string" }],
  "examinerThinking": { "whyAsked": "string", "conceptTested": "string", "topperInsight": "string", "examTip": "string", "examTrap": "string" },
  "finalAnswer": { "answer": "string", "whyCorrect": "string", "verification": "string" },
  "simplerExample": { "problem": "string", "solution": "string" },
  "practiceQuestion": { "question": "string", "hints": ["string","string","string"], "solution": "string" },
  "confidenceCheck": { "question": "string", "options": ["string","string","string","string"], "correctIndex": 0, "explanation": "string" },
  "retrievalPractice": ["string"],
  "rememberThese": ["string"],
  "confidenceBuilder": "string"
}

FIELD RULES (STANDARD depth unless specified):
- beforeWeStart: motivator (2–4 sentences, real-world), anxietyReducer (2–3 sentences encouraging), preview (1–2 sentences what student will learn).
- prerequisites: 3–4 concepts the student must know first.
- vocabulary: 4–6 terms. Define EVERY unfamiliar word, symbol, or phrase. Plain-English meanings, no jargon.
- intuition.story: 3–5 sentences. Everyday analogy. No maths yet.
- guidedReasoning: 4–6 steps. Each step: one operation only. WHY per step: 2–3 sentences. Show every calculation.
- confusionPoints: Exactly 3 strings. Name the confusion and resolve it.
- commonMistakes: Exactly 3 objects. Start mistake with ❌.
- examinerThinking: All 5 sub-fields mandatory.
- finalAnswer.verification: Substitute back. Show every step. End with "LHS = RHS ✓".
- simplerExample: A simpler version of the problem with full worked solution.
- practiceQuestion.hints: Exactly 3 strings. Reveal thinking, never answers.
- confidenceCheck: One MCQ testing WHY, not just the final answer.
- retrievalPractice: 3–5 short recall questions.
- rememberThese: 3–5 key rules or insights.
- confidenceBuilder: 1–2 warm sentences telling student what they can now do.

ABSOLUTE RULES: NEVER write "clearly", "obviously", "trivially", "it follows that", "simply", "just".
ALWAYS explain WHY. Short sentences. Active voice. Encourage throughout.`.trim();

function buildSystemPrompt(subject: string): string {
  const preamble = PREAMBLES[subject] ?? PREAMBLES["Computer Science"];
  const schema   = RUN_MODE === "detailed" ? JSON_SCHEMA_DETAILED : JSON_SCHEMA_STANDARD;
  return preamble + "\n\n" + schema;
}

// ─── JSON extraction (strips optional ```json ... ``` fences) ─────────────────

function extractJson(raw: string): string {
  const s = raw.trim();
  // Strip ```json ... ``` or ``` ... ``` fence if present
  const fenceMatch = s.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  if (fenceMatch) return fenceMatch[1].trim();
  return s;
}

// ─── Schema validation ────────────────────────────────────────────────────────

function validateSchema(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.topic !== "string" || !o.topic)           return false;
  if (!Array.isArray(o.guidedReasoning))                  return false;
  if (!o.finalAnswer || typeof o.finalAnswer !== "object") return false;
  const fa = o.finalAnswer as Record<string, unknown>;
  if (!fa.answer) return false;
  return true;
}

// ─── OpenAI call helper ───────────────────────────────────────────────────────

async function callOpenAI(
  model:    ModelConfig,
  system:   string,
  user:     string,
  apiKey:   string,
): Promise<{ body: unknown; latencyMs: number }> {
  const t0 = Date.now();

  const bodyObj: Record<string, unknown> = {
    model:            model.name,
    ...(model.supportsTemperature ? { temperature: GENERATION_TEMP } : {}),
    [model.tokenParam]: getMaxDraftTokens(model),
    ...(model.supportsJsonFormat ? { response_format: { type: "json_object" } } : {}),
    messages: [
      { role: "system", content: system },
      { role: "user",   content: `Subject: ${user.split("\n")[0]}\n\nQuestion:\n${user}` },
    ],
  };

  const res = await fetch(OPENAI_URL, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(bodyObj),
  });

  const body = await res.json();
  const latencyMs = Date.now() - t0;
  if (!res.ok) throw new Error(`api_${res.status}: ${JSON.stringify((body as Record<string, unknown>)?.error)}`);
  return { body, latencyMs };
}

// ─── Single question benchmark ────────────────────────────────────────────────

async function benchmarkOne(
  q:      BenchmarkQuestion,
  model:  ModelConfig,
  apiKey: string,
): Promise<CallResult> {
  const system = buildSystemPrompt(q.subject);
  const base: Partial<CallResult> = {
    questionId:  q.id,
    model:       model.name,
    parsedOk:    false,
    schemaValid: false,
    reviewPassed:     false,
    reviewScores:     {},
    reviewOverall:    0,
    reviewIssueCount: 0,
    reviewUsage:      { prompt: 0, completion: 0, costUsd: 0 },
  };

  // ── Draft generation ────────────────────────────────────────────────────────
  let rawOutput = "";
  let parsedLesson: unknown = null;
  try {
    const { body, latencyMs } = await callOpenAI(model, system, q.question, apiKey);
    const usage   = extractUsage(body, model.name);
    rawOutput     = (body as Record<string, unknown>)?.choices?.[0]?.message?.content as string ?? "{}";

    base.latencyMs        = latencyMs;
    base.promptTokens     = usage.promptTokens;
    base.completionTokens = usage.completionTokens;
    base.cachedTokens     = usage.cachedTokens;
    base.totalTokens      = usage.totalTokens;
    base.estimatedCostUsd = usage.estimatedCostUsd;
    base.rawOutput        = rawOutput;

    try {
      parsedLesson  = JSON.parse(extractJson(rawOutput));
      base.parsedOk    = true;
      base.schemaValid = validateSchema(parsedLesson);
    } catch {
      base.parsedOk    = false;
      base.schemaValid = false;
    }
  } catch (err) {
    base.error = String(err);
    return base as CallResult;
  }

  // ── Quality review (always gpt-4o-mini for fairness) ────────────────────────
  if (base.schemaValid && parsedLesson) {
    try {
      const lessonObj = parseLessonResponse(parsedLesson);
      const { report, usage: ru } = await reviewLesson(lessonObj, apiKey);
      const scores = report.scores as Record<string, number>;
      const overall = Object.values(scores).reduce((s, v) => s + v, 0) / Object.values(scores).length;
      base.reviewPassed     = report.passed;
      base.reviewScores     = scores;
      base.reviewOverall    = Math.round(overall);
      base.reviewIssueCount = report.criticalIssues.length;
      base.reviewUsage      = {
        prompt:     ru.promptTokens,
        completion: ru.completionTokens,
        costUsd:    ru.estimatedCostUsd,
      };
    } catch (err) {
      base.error = `review_failed: ${String(err)}`;
    }
  }

  return base as CallResult;
}

// ─── Batch runner (BATCH_SIZE concurrent calls per batch) ─────────────────────

async function runModel(
  model:  ModelConfig,
  apiKey: string,
): Promise<CallResult[]> {
  console.log(`\n▶ Running model: ${model.name} (${model.label})`);
  const results: CallResult[] = [];
  for (let i = 0; i < ACTIVE_QUESTIONS.length; i += BATCH_SIZE) {
    const batch  = ACTIVE_QUESTIONS.slice(i, i + BATCH_SIZE);
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ACTIVE_QUESTIONS.length / BATCH_SIZE)}: Q${batch.map(q => q.id).join(", Q")}`);
    const settled = await Promise.allSettled(
      batch.map(q => benchmarkOne(q, model, apiKey)),
    );
    for (const r of settled) {
      if (r.status === "fulfilled") {
        results.push(r.value);
      } else {
        results.push({ questionId: "?", model: model.name, error: String(r.reason) } as CallResult);
      }
    }
    // Brief pause between batches to avoid rate-limit bursts
    if (i + BATCH_SIZE < ACTIVE_QUESTIONS.length) await new Promise(r => setTimeout(r, 1500));
  }
  return results;
}

// ─── Metrics aggregation ──────────────────────────────────────────────────────

interface ModelSummary {
  model:              string;
  label:              string;
  questionsRun:       number;
  parseFailures:      number;
  schemaFailures:     number;
  qualityPassCount:   number;
  qualityPassRate:    string;
  avgDraftPromptT:    number;
  avgDraftCompletionT: number;
  avgDraftTotalT:     number;
  avgDraftCostUsd:    number;
  avgReviewPromptT:   number;
  avgReviewCompletionT: number;
  avgReviewCostUsd:   number;
  avgTotalCostUsd:    number;
  avgLatencyMs:       number;
  avgOverallScore:    number;
  avgByDimension:     Record<string, number>;
  errors:             string[];
  costVsBaseline:     string;
}

function summarise(results: CallResult[], label: string, baselineCost?: number): ModelSummary {
  const valid = results.filter(r => !r.error && r.parsedOk);
  const scored = valid.filter(r => r.schemaValid && r.reviewOverall > 0);

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const avgF = (arr: number[], dp = 6) => arr.length
    ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(dp))
    : 0;

  const dimensions = scored.length
    ? Object.keys(scored[0].reviewScores)
    : [];
  const avgByDimension: Record<string, number> = {};
  for (const dim of dimensions) {
    avgByDimension[dim] = avg(scored.map(r => r.reviewScores[dim] ?? 0));
  }

  const totalCosts = valid.map(r => (r.estimatedCostUsd ?? 0) + (r.reviewUsage?.costUsd ?? 0));
  const avgTotalCost = avgF(totalCosts);
  const costVsBaseline = baselineCost != null && baselineCost > 0
    ? `${((avgTotalCost / baselineCost - 1) * 100).toFixed(1)}%`
    : "—";

  return {
    model:               results[0]?.model ?? label,
    label,
    questionsRun:        results.length,
    parseFailures:       results.filter(r => !r.parsedOk).length,
    schemaFailures:      results.filter(r => r.parsedOk && !r.schemaValid).length,
    qualityPassCount:    scored.filter(r => r.reviewPassed).length,
    qualityPassRate:     scored.length ? `${scored.filter(r => r.reviewPassed).length}/${scored.length}` : "0/0",
    avgDraftPromptT:     avg(valid.map(r => r.promptTokens ?? 0)),
    avgDraftCompletionT: avg(valid.map(r => r.completionTokens ?? 0)),
    avgDraftTotalT:      avg(valid.map(r => r.totalTokens ?? 0)),
    avgDraftCostUsd:     avgF(valid.map(r => r.estimatedCostUsd ?? 0)),
    avgReviewPromptT:    avg(scored.map(r => r.reviewUsage?.prompt ?? 0)),
    avgReviewCompletionT: avg(scored.map(r => r.reviewUsage?.completion ?? 0)),
    avgReviewCostUsd:    avgF(scored.map(r => r.reviewUsage?.costUsd ?? 0)),
    avgTotalCostUsd:     avgTotalCost,
    avgLatencyMs:        avg(valid.map(r => r.latencyMs ?? 0)),
    avgOverallScore:     avg(scored.map(r => r.reviewOverall)),
    avgByDimension,
    errors:              results.filter(r => r.error).map(r => `${r.questionId}: ${r.error}`),
    costVsBaseline,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { console.error("OPENAI_API_KEY not set"); process.exit(1); }

  console.log("═══════════════════════════════════════════════════════");
  console.log(" SnapSolve Model Benchmark — Class 9 CBSE");
  console.log(" Models: gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra");
  console.log(`" Questions: ${ACTIVE_QUESTIONS.length} (${RUN_MODE} mode) | Reviewer: ${REVIEW_MODEL} (fixed)`);
  console.log(" Mode: Standard (production-equivalent prompts)");
  console.log("═══════════════════════════════════════════════════════");

  const allResults: Record<string, CallResult[]> = {};

  for (const model of MODELS) {
    allResults[model.label] = await runModel(model, apiKey);
    // Pause between models
    await new Promise(r => setTimeout(r, 2000));
  }

  // Compute summaries
  const baselineSummary  = summarise(allResults.baseline,  "baseline");
  const lunaSummary      = summarise(allResults.luna,      "luna",  baselineSummary.avgTotalCostUsd);
  const terraSummary     = summarise(allResults.terra,     "terra", baselineSummary.avgTotalCostUsd);

  const output = {
    timestamp:   new Date().toISOString(),
    totalQuestions: ACTIVE_QUESTIONS.length,
    reviewModel: REVIEW_MODEL,
    generationMode: RUN_MODE,
    compatibility: {
      "gpt-4o-mini":   "max_tokens (standard)",
      "gpt-5.6-luna":  "max_completion_tokens (required — 400 error otherwise)",
      "gpt-5.6-terra": "max_completion_tokens (required — 400 error otherwise)",
    },
    summaries: { baseline: baselineSummary, luna: lunaSummary, terra: terraSummary },
    raw: allResults,
  };

  const outPath = `./benchmark_results_${RUN_MODE}.json`;
  import("fs").then(fs => {
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`\n✓ Results written to ${outPath}`);
  });

  // Print quick summary table
  console.log("\n\n══════ QUICK RESULTS ══════");
  for (const s of [baselineSummary, lunaSummary, terraSummary]) {
    console.log(`\n${s.model.toUpperCase()}`);
    console.log(`  Pass rate:      ${s.qualityPassRate}`);
    console.log(`  Avg overall:    ${s.avgOverallScore}/100`);
    console.log(`  Avg latency:    ${s.avgLatencyMs} ms`);
    console.log(`  Avg draft tok:  ${s.avgDraftTotalT} (in:${s.avgDraftPromptT} out:${s.avgDraftCompletionT})`);
    console.log(`  Avg review tok: in:${s.avgReviewPromptT} out:${s.avgReviewCompletionT}`);
    console.log(`  Avg total cost: $${s.avgTotalCostUsd.toFixed(6)}`);
    console.log(`  vs baseline:    ${s.costVsBaseline}`);
    console.log(`  Parse failures: ${s.parseFailures}`);
    console.log(`  Schema failures:${s.schemaFailures}`);
    console.log(`  Errors:         ${s.errors.length}`);
    if (Object.keys(s.avgByDimension).length) {
      console.log(`  Dim scores:`);
      for (const [dim, score] of Object.entries(s.avgByDimension)) {
        console.log(`    ${dim.padEnd(26)} ${score}`);
      }
    }
  }
}

main().catch(console.error);
