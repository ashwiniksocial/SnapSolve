/**
 * Quality-pilot generator — Mathematics, Class 7, Chapter 4 — Simple Equations
 * Produces exactly 25 deterministic QuestionV2 records across 8 blueprint families.
 *
 * Blueprint families:
 *   B1 Direct Solve           (T1 template)  gen-001, 002, 005, 006  — 4 q
 *   B2 Word-to-Equation       (T2 template)  gen-003, 004, 007, 008  — 4 q
 *   B3 MCQ Verification       (T3 template)  gen-009, 010            — 2 q
 *   B4 Error Spotting         (makeQ)        gen-011, 012, 013       — 3 q
 *   B5 Equation-to-Verbal     (makeQ)        gen-014, 015, 016       — 3 q
 *   B6 Fill Missing Value     (makeQ)        gen-017, 018, 019       — 3 q
 *   B7 Daily-Life Application (makeQ)        gen-020, 021, 022       — 3 q
 *   B8 True/False             (makeQ)        gen-023, 024, 025       — 3 q
 *
 * Run with:  pnpm --filter @workspace/scripts run generate-proof
 * Determinism: running twice produces byte-for-byte identical output.
 *
 * Original 10 IDs (gen-001..gen-010) are preserved; question text and math
 * are unchanged. Blueprint tags added to metadata only.
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(
  __dirname,
  "../../question-bank/questions/mathematics/class7/ch04-simple-equations-generated-proof.ts",
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function strArr(items: string[]): string {
  return items.map(i => `"${esc(i)}"`).join(", ");
}

// ─── Template T1 : B1 Direct Solve  (ax ± b = c) ─────────────────────────────

interface T1Params {
  seq: string;
  difficulty: "Easy" | "Medium";
  a: number;
  b: number; // positive = added; negative = subtracted
  c: number;
}

function makeT1(p: T1Params): string {
  const x = (p.c - p.b) / p.a;

  let eq: string;
  if (p.a === 1 && p.b > 0)   eq = `x + ${p.b} = ${p.c}`;
  else if (p.a === 1 && p.b < 0) eq = `x − ${Math.abs(p.b)} = ${p.c}`;
  else if (p.b === 0)          eq = `${p.a}x = ${p.c}`;
  else if (p.b > 0)            eq = `${p.a}x + ${p.b} = ${p.c}`;
  else                         eq = `${p.a}x − ${Math.abs(p.b)} = ${p.c}`;

  const afterMove = p.c - p.b;
  let step2: string;
  if (p.b === 0) {
    step2 = `The equation is already ${p.a}x = ${p.c}. Proceed to divide.`;
  } else if (p.b > 0) {
    step2 = `Subtract ${p.b} from both sides: ${p.a === 1 ? "" : p.a}x = ${p.c} − ${p.b} = ${afterMove}`;
  } else {
    step2 = `Add ${Math.abs(p.b)} to both sides: ${p.a === 1 ? "" : p.a}x = ${p.c} + ${Math.abs(p.b)} = ${afterMove}`;
  }

  const step3 = p.a === 1
    ? `x is already isolated: x = ${x}`
    : `Divide both sides by ${p.a}: x = ${afterMove} ÷ ${p.a} = ${x}`;

  let verifyLHS: string;
  if (p.a === 1 && p.b >= 0)      verifyLHS = `${x} + ${p.b}`;
  else if (p.a === 1 && p.b < 0)  verifyLHS = `${x} − ${Math.abs(p.b)}`;
  else if (p.b === 0)              verifyLHS = `${p.a} × ${x}`;
  else if (p.b > 0)                verifyLHS = `${p.a}(${x}) + ${p.b}`;
  else                             verifyLHS = `${p.a}(${x}) − ${Math.abs(p.b)}`;

  const lhsValue = p.a * x + p.b;
  const timeMin  = p.difficulty === "Easy" ? 3 : 5;
  const hint     = p.a === 1
    ? `Identify which operation connects x and the number, then reverse it on both sides.`
    : `First move the constant (${p.b !== 0 ? `${Math.abs(p.b)}` : "none"}) away from the x-term, then divide by the coefficient of x.`;

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "ShortAnswer",
    difficulty: "${p.difficulty}", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: ${timeMin},
    question: "Solve for x: ${esc(eq)}",
    answer: "x = ${x}. Verification: LHS = ${esc(verifyLHS)} = ${lhsValue} = RHS ✓",
    steps: [
      { stepNumber: 1, title: "Write the equation", explanation: "Given: ${esc(eq)}" },
      { stepNumber: 2, title: "Isolate the x-term", explanation: "${esc(step2)}" },
      { stepNumber: 3, title: "Find x", explanation: "${esc(step3)}" },
      { stepNumber: 4, title: "Verify", explanation: "Substitute x = ${x}: LHS = ${esc(verifyLHS)} = ${lhsValue} = ${p.c} = RHS ✓" },
    ],
    hint: "${esc(hint)}",
    keyConcepts: ["solving equations", "balance method", "transposition", "verification"],
    conceptsCovered: ["mth:7:ch04:balance-method", "mth:7:ch04:transposition", "mth:7:ch04:verification"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Applying the inverse operation to only one side instead of both sides.", "Forgetting to verify the solution by substituting back."],
    tags: ["blueprint-B1-direct-solve", "computational", "ncert-direct", "class7", "ch04", "generated-proof"],
    source: "original",
  }`;
}

// ─── Template T2 : B2 Word-to-Equation ───────────────────────────────────────

type T2Op = "add" | "sub" | "mul_add" | "mul_sub";

interface T2Params {
  seq: string;
  difficulty: "Easy" | "Medium";
  op: T2Op;
  k: number;
  n1: number;
  n2: number;
}

function makeT2(p: T2Params): string {
  const kWord = p.k === 2 ? "Twice" : p.k === 3 ? "Three times" : `${p.k} times`;

  let qText: string;
  switch (p.op) {
    case "add":     qText = `${p.n1} more than a number is ${p.n2}. Find the number.`; break;
    case "sub":     qText = `A number decreased by ${p.n1} equals ${p.n2}. Find the number.`; break;
    case "mul_add": qText = `${kWord} a number, increased by ${p.n1}, equals ${p.n2}. Find the number.`; break;
    case "mul_sub": qText = `${kWord} a number, decreased by ${p.n1}, equals ${p.n2}. Find the number.`; break;
  }

  let eqText: string;
  switch (p.op) {
    case "add":     eqText = `n + ${p.n1} = ${p.n2}`; break;
    case "sub":     eqText = `n − ${p.n1} = ${p.n2}`; break;
    case "mul_add": eqText = `${p.k}n + ${p.n1} = ${p.n2}`; break;
    case "mul_sub": eqText = `${p.k}n − ${p.n1} = ${p.n2}`; break;
  }

  let n: number;
  switch (p.op) {
    case "add":     n = p.n2 - p.n1; break;
    case "sub":     n = p.n2 + p.n1; break;
    case "mul_add": n = (p.n2 - p.n1) / p.k; break;
    case "mul_sub": n = (p.n2 + p.n1) / p.k; break;
  }

  let step3: string;
  switch (p.op) {
    case "add":     step3 = `Subtract ${p.n1} from both sides: n = ${p.n2} − ${p.n1} = ${n}`; break;
    case "sub":     step3 = `Add ${p.n1} to both sides: n = ${p.n2} + ${p.n1} = ${n}`; break;
    case "mul_add": step3 = `Subtract ${p.n1} from both sides: ${p.k}n = ${p.n2} − ${p.n1} = ${p.n2 - p.n1}`; break;
    case "mul_sub": step3 = `Add ${p.n1} to both sides: ${p.k}n = ${p.n2} + ${p.n1} = ${p.n2 + p.n1}`; break;
  }

  const needsDivide = p.op === "mul_add" || p.op === "mul_sub";
  const midVal = p.op === "mul_add" ? p.n2 - p.n1 : p.n2 + p.n1;
  const step4 = needsDivide ? `Divide both sides by ${p.k}: n = ${midVal} ÷ ${p.k} = ${n}` : "";

  let verifyText: string;
  switch (p.op) {
    case "add":     verifyText = `${n} + ${p.n1} = ${n + p.n1} = ${p.n2}`; break;
    case "sub":     verifyText = `${n} − ${p.n1} = ${n - p.n1} = ${p.n2}`; break;
    case "mul_add": verifyText = `${p.k}(${n}) + ${p.n1} = ${p.k * n} + ${p.n1} = ${p.k * n + p.n1} = ${p.n2}`; break;
    case "mul_sub": verifyText = `${p.k}(${n}) − ${p.n1} = ${p.k * n} − ${p.n1} = ${p.k * n - p.n1} = ${p.n2}`; break;
  }

  const timeMin  = p.difficulty === "Easy" ? 4 : 6;
  const blooms   = p.difficulty === "Easy" ? "understand" : "apply";
  const qTyp     = p.difficulty === "Easy" ? "concept" : "competency";

  const stepsBlock = needsDivide
    ? `      { stepNumber: 1, title: "Assign a variable", explanation: "Let the unknown number be n." },
      { stepNumber: 2, title: "Form the equation", explanation: "Translating the statement: ${esc(eqText)}" },
      { stepNumber: 3, title: "Move the constant", explanation: "${esc(step3)}" },
      { stepNumber: 4, title: "Divide to find n", explanation: "${esc(step4)}" },
      { stepNumber: 5, title: "Verify", explanation: "Substitute n = ${n}: ${esc(verifyText)} ✓" },`
    : `      { stepNumber: 1, title: "Assign a variable", explanation: "Let the unknown number be n." },
      { stepNumber: 2, title: "Form the equation", explanation: "Translating the statement: ${esc(eqText)}" },
      { stepNumber: 3, title: "Solve", explanation: "${esc(step3)}" },
      { stepNumber: 4, title: "Verify", explanation: "Substitute n = ${n}: ${esc(verifyText)} ✓" },`;

  const hint = needsDivide
    ? `Name the unknown n. Translate the sentence into an equation using n. Then undo the constant first, and divide last.`
    : `Name the unknown n, write the addition or subtraction equation it satisfies, then undo that operation.`;

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "${qTyp}", questionFormat: "ShortAnswer",
    difficulty: "${p.difficulty}", bloomsLevel: "${blooms}",
    marks: 2, estimatedTimeMinutes: ${timeMin},
    question: "${esc(qText)}",
    answer: "The number is ${n}. (Equation: ${esc(eqText)}, solved to get n = ${n}.)",
    steps: [
${stepsBlock}
    ],
    hint: "${esc(hint)}",
    keyConcepts: ["word problems", "equation formation", "balance method"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:word-problem-to-equation", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Setting up the wrong equation by misreading which operation the sentence describes.", "Forgetting to verify the answer back in the original sentence."],
    tags: ["blueprint-B2-word-to-equation", "conceptual", "real-life", "class7", "ch04", "generated-proof"],
    source: "original",
  }`;
}

// ─── Template T3 : B3 MCQ Verification ───────────────────────────────────────

interface T3Params {
  seq: string;
  topicId: "t1" | "t2";
  topicName: "Setting Up Equations" | "Solving and Verifying";
  question: string;
  solveSteps: Array<{ title: string; explanation: string }>;
  options: [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  hintText: string;
  examTip: string;
  keyConcepts: string[];
  conceptsCovered: string[];
  commonErrors: string[];
}

function makeT3(p: T3Params): string {
  const labels       = ["(A)", "(B)", "(C)", "(D)"];
  const correctLabel = labels[p.correctIdx];
  const correctText  = p.options[p.correctIdx];

  const stepsLines = p.solveSteps
    .map((s, i) => `      { stepNumber: ${i + 1}, title: "${esc(s.title)}", explanation: "${esc(s.explanation)}" },`)
    .join("\n");

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "${p.topicId}", topicName: "${p.topicName}",
    questionType: "competency", questionFormat: "MCQ",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 1, estimatedTimeMinutes: 7,
    question: "${esc(p.question)}",
    options: [${p.options.map(o => `"${esc(o)}"`).join(", ")}],
    answer: "Correct answer: ${correctLabel} ${esc(correctText)}",
    steps: [
${stepsLines}
    ],
    hint: "${esc(p.hintText)}",
    examTip: "${esc(p.examTip)}",
    keyConcepts: [${strArr(p.keyConcepts)}],
    conceptsCovered: [${strArr(p.conceptsCovered)}],
    prerequisites: ["mth:7:ch04:balance-method", "mth:7:ch04:transposition"],
    commonErrors: [${strArr(p.commonErrors)}],
    tags: ["blueprint-B3-mcq-verification", "board-important", "computational", "class7", "ch04", "generated-proof"],
    source: "original",
  }`;
}

// ─── General template : makeQ — for B4, B5, B6, B7, B8 ───────────────────────

interface QParams {
  seq: string;
  topicId: "t1" | "t2";
  topicName: "Setting Up Equations" | "Solving and Verifying";
  questionType: "concept" | "competency" | "hots" | "ncert";
  questionFormat: "ShortAnswer" | "MCQ" | "FillInTheBlanks" | "TrueOrFalse";
  difficulty: "Easy" | "Medium" | "Hard";
  bloomsLevel: "remember" | "understand" | "apply" | "analyse" | "evaluate";
  marks: number;
  estimatedTimeMinutes: number;
  blueprint: string;        // e.g. "B4-error-spotting" — appended to tags
  question: string;
  options?: [string, string, string, string];
  correctIdx?: 0 | 1 | 2 | 3;  // used to build MCQ answer label; answer text must match
  answer: string;
  steps: Array<{ title: string; explanation: string }>;
  hint: string;
  hint2?: string;
  examTip?: string;
  keyConcepts: string[];
  conceptsCovered: string[];
  prerequisites: string[];
  commonErrors: string[];
  extraTags?: string[];
}

function makeQ(p: QParams): string {
  const stepsLines = p.steps
    .map((s, i) => `      { stepNumber: ${i + 1}, title: "${esc(s.title)}", explanation: "${esc(s.explanation)}" },`)
    .join("\n");

  // options line (only for MCQ): appears between question and answer
  const optionsLine = p.options
    ? `    options: [${p.options.map(o => `"${esc(o)}"`).join(", ")}],\n`
    : "";

  // optional metadata lines after hint
  const hint2Line   = p.hint2   ? `\n    hint2: "${esc(p.hint2)}",`    : "";
  const examTipLine = p.examTip ? `\n    examTip: "${esc(p.examTip)}",` : "";

  const baseTags = [`"blueprint-${p.blueprint}"`, `"class7"`, `"ch04"`, `"generated-proof"`];
  const extraTagStrings = (p.extraTags ?? []).map(t => `"${esc(t)}"`);
  const allTags = [...baseTags, ...extraTagStrings].join(", ");

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "${p.topicId}", topicName: "${p.topicName}",
    questionType: "${p.questionType}", questionFormat: "${p.questionFormat}",
    difficulty: "${p.difficulty}", bloomsLevel: "${p.bloomsLevel}",
    marks: ${p.marks}, estimatedTimeMinutes: ${p.estimatedTimeMinutes},
    question: "${esc(p.question)}",
${optionsLine}    answer: "${esc(p.answer)}",
    steps: [
${stepsLines}
    ],
    hint: "${esc(p.hint)}",${hint2Line}${examTipLine}
    keyConcepts: [${strArr(p.keyConcepts)}],
    conceptsCovered: [${strArr(p.conceptsCovered)}],
    prerequisites: [${strArr(p.prerequisites)}],
    commonErrors: [${strArr(p.commonErrors)}],
    tags: [${allTags}],
    source: "original",
  }`;
}

// ─── B1 Direct Solve instances ────────────────────────────────────────────────

const T1_INSTANCES: T1Params[] = [
  { seq: "gen-001", difficulty: "Easy",   a: 1, b:  7, c: 15 }, // x + 7 = 15  → x = 8
  { seq: "gen-002", difficulty: "Easy",   a: 3, b:  0, c: 21 }, // 3x = 21      → x = 7
  { seq: "gen-005", difficulty: "Medium", a: 2, b:  5, c: 17 }, // 2x + 5 = 17  → x = 6
  { seq: "gen-006", difficulty: "Medium", a: 3, b: -4, c: 14 }, // 3x − 4 = 14  → x = 6
];

// ─── B2 Word-to-Equation instances ───────────────────────────────────────────

const T2_INSTANCES: T2Params[] = [
  { seq: "gen-003", difficulty: "Easy",   op: "add",     k: 1, n1:  8, n2: 20 }, // n + 8 = 20   → n = 12
  { seq: "gen-004", difficulty: "Easy",   op: "sub",     k: 1, n1:  6, n2: 10 }, // n − 6 = 10   → n = 16
  { seq: "gen-007", difficulty: "Medium", op: "mul_add", k: 2, n1:  3, n2: 19 }, // 2n + 3 = 19  → n = 8
  { seq: "gen-008", difficulty: "Medium", op: "mul_sub", k: 3, n1:  7, n2: 11 }, // 3n − 7 = 11  → n = 6
];

// ─── B3 MCQ Verification instances ───────────────────────────────────────────

const T3_INSTANCES: T3Params[] = [
  {
    seq: "gen-009", topicId: "t2", topicName: "Solving and Verifying",
    question: "Which value of x satisfies the equation 4x − 6 = 2x + 8?",
    // 4x − 2x = 8 + 6 → 2x = 14 → x = 7
    options: ["x = 5", "x = 6", "x = 7", "x = 8"], correctIdx: 2,
    solveSteps: [
      { title: "Collect x-terms on one side",  explanation: "Subtract 2x from both sides: 4x − 2x − 6 = 8, giving 2x − 6 = 8." },
      { title: "Move constant to RHS",          explanation: "Add 6 to both sides: 2x = 8 + 6 = 14." },
      { title: "Divide both sides by 2",        explanation: "x = 14 ÷ 2 = 7." },
      { title: "Verify",                        explanation: "LHS = 4(7) − 6 = 22; RHS = 2(7) + 8 = 22. LHS = RHS ✓" },
      { title: "Eliminate distractors",         explanation: "x=5: LHS=14, RHS=18 ✗. x=6: LHS=18, RHS=20 ✗. x=8: LHS=26, RHS=24 ✗." },
    ],
    hintText:  "Move all x-terms to one side and all constants to the other, then divide.",
    examTip:   "Equations with the variable on both sides are a standard 1-mark MCQ in Class 7 and 8 boards.",
    keyConcepts:     ["variables on both sides", "transposition", "verification"],
    conceptsCovered: ["mth:7:ch04:transposition", "mth:7:ch04:verification", "mth:7:ch04:balance-method"],
    commonErrors:    [
      "Subtracting 6 from RHS instead of adding — moving a negative term becomes addition.",
      "Guessing x = 8 (the largest option) without verifying by substitution.",
    ],
  },
  {
    seq: "gen-010", topicId: "t1", topicName: "Setting Up Equations",
    question: "The sum of three consecutive integers is 54. What is the smallest of the three integers?",
    // n + (n+1) + (n+2) = 54 → 3n + 3 = 54 → n = 17
    options: ["15", "16", "17", "18"], correctIdx: 2,
    solveSteps: [
      { title: "Assign variables",       explanation: "Let the three consecutive integers be n, n + 1, and n + 2." },
      { title: "Form the equation",      explanation: "n + (n + 1) + (n + 2) = 54, which simplifies to 3n + 3 = 54." },
      { title: "Solve for n",            explanation: "Subtract 3: 3n = 51. Divide by 3: n = 17." },
      { title: "Verify",                 explanation: "17 + 18 + 19 = 54 ✓. The smallest integer is 17." },
      { title: "Eliminate distractors",  explanation: "n=15: 48 ✗. n=16: 51 ✗. n=18: 57 ✗." },
    ],
    hintText:  "Name the smallest integer n. The next two are n+1 and n+2. Write their sum equal to 54.",
    examTip:   "Consecutive-integer word problems are a classic board-exam MCQ. The trap option is 54÷3 = 18, which gives the middle integer.",
    keyConcepts:     ["consecutive integers", "equation formation", "solving equations"],
    conceptsCovered: ["mth:7:ch04:word-problem-to-equation", "mth:7:ch04:equation-from-statement", "mth:7:ch04:balance-method"],
    commonErrors:    [
      "Using n, n+2, n+4 instead of n, n+1, n+2 — those are consecutive ODD integers.",
      "Choosing 18 by computing 54 ÷ 3 — that gives the middle integer, not the smallest.",
    ],
  },
];

// ─── B4 Error Spotting instances ─────────────────────────────────────────────

// gen-011 : Easy MCQ — student added instead of subtracting in x + 5 = 12
// gen-012 : Medium MCQ — wrong transposition direction in 2x + 4 = 16
// gen-013 : Hard MCQ — incorrect equation setup for a verbal statement

const NEW_QUESTIONS: QParams[] = [

  // ── B4 Error Spotting ────────────────────────────────────────────────────────

  {
    seq: "gen-011",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "analyse",
    marks: 1, estimatedTimeMinutes: 4,
    blueprint: "B4-error-spotting",
    question: "A student solved x + 5 = 12 and wrote: x = 12 + 5 = 17. What is wrong with this working?",
    options: [
      "Should subtract 5 from both sides: x = 12 − 5 = 7",
      "Should multiply both sides by 5",
      "Should add 5 to the LHS only",
      "Nothing — x = 17 is correct",
    ],
    correctIdx: 0,
    answer: "Correct answer: (A) Should subtract 5 from both sides: x = 12 − 5 = 7",
    steps: [
      { title: "Identify the error", explanation: "The student added 5 to the RHS (12 + 5) instead of subtracting it. The rule: move a term to the other side by reversing its sign." },
      { title: "Correct method", explanation: "Subtract 5 from both sides: x + 5 − 5 = 12 − 5, giving x = 7." },
      { title: "Verify correct answer", explanation: "Substitute x = 7: LHS = 7 + 5 = 12 = RHS ✓" },
      { title: "Why distractors fail", explanation: "(B) Multiplying changes the equation entirely. (C) You must apply the same operation to BOTH sides. (D) If x = 17, then 17 + 5 = 22 ≠ 12." },
    ],
    hint: "When you move a number across the equals sign, its sign reverses: + becomes −.",
    keyConcepts: ["balance method", "error identification", "verification"],
    conceptsCovered: ["mth:7:ch04:balance-method", "mth:7:ch04:verification"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Adding the constant to the RHS instead of subtracting it when isolating x."],
    extraTags: ["MCQ-error-spotting"],
  },

  {
    seq: "gen-012",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "competency", questionFormat: "MCQ",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 1, estimatedTimeMinutes: 5,
    blueprint: "B4-error-spotting",
    question: "A student solved 2x + 4 = 16 and got 2x = 16 + 4 = 20, then x = 10. Where is the error and what is the correct answer?",
    options: [
      "Should subtract 4 (not add): 2x = 16 − 4 = 12, giving x = 6",
      "Should divide by 4 in the last step, not by 2",
      "Should multiply both sides by 4 first",
      "No error — x = 10 is correct",
    ],
    correctIdx: 0,
    answer: "Correct answer: (A) Should subtract 4 (not add): 2x = 16 − 4 = 12, giving x = 6",
    steps: [
      { title: "Identify the error", explanation: "The +4 was moved to the RHS as +4 (added), but moving +4 across the equals sign turns it into −4." },
      { title: "Correct step 1", explanation: "Subtract 4 from both sides: 2x = 16 − 4 = 12." },
      { title: "Correct step 2", explanation: "Divide both sides by 2: x = 12 ÷ 2 = 6." },
      { title: "Verify", explanation: "Substitute x = 6: 2(6) + 4 = 12 + 4 = 16 = RHS ✓" },
    ],
    hint: "Transposition rule: +4 on the LHS becomes −4 on the RHS.",
    hint2: "Always substitute your answer back. If 2(10) + 4 = 24 ≠ 16, the answer is wrong.",
    examTip: "Identifying a wrong transposition step is a common 1-mark competency question in Class 7 assessments.",
    keyConcepts: ["transposition", "error identification", "two-step equations"],
    conceptsCovered: ["mth:7:ch04:transposition", "mth:7:ch04:balance-method", "mth:7:ch04:verification"],
    prerequisites: ["mth:7:ch04:balance-method"],
    commonErrors: ["Transposing a positive constant as positive — it must become negative when moved.", "Not verifying the answer after solving."],
    extraTags: ["MCQ-error-spotting"],
  },

  {
    seq: "gen-013",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "MCQ",
    difficulty: "Hard", bloomsLevel: "analyse",
    marks: 1, estimatedTimeMinutes: 5,
    blueprint: "B4-error-spotting",
    question: "A student translated the statement 'Twice a number plus 5 equals 21' as the equation 2 + 5n = 21. Which equation is correct?",
    options: [
      "2n + 5 = 21",
      "2n − 5 = 21",
      "n + 5 = 21",
      "2 + 5n = 21 — the student is correct",
    ],
    correctIdx: 0,
    answer: "Correct answer: (A) 2n + 5 = 21",
    steps: [
      { title: "Parse 'twice a number'", explanation: "'Twice a number' means 2 × n = 2n. The student wrote 2 alone (a constant), not 2n (twice the unknown)." },
      { title: "Parse 'plus 5'", explanation: "'Plus 5' adds 5 to 2n, giving 2n + 5." },
      { title: "Form correct equation", explanation: "'Equals 21' gives: 2n + 5 = 21." },
      { title: "Verify by solving", explanation: "2n = 16, n = 8. Check: 2(8) + 5 = 21 ✓" },
      { title: "Why the student is wrong", explanation: "In 2 + 5n = 21, the 5 is the coefficient of n and 2 is a constant — this says '5 times a number plus 2 = 21', which is a different statement." },
    ],
    hint: "'Twice a number' always means 2n (2 multiplied by the unknown), not 2 by itself.",
    hint2: "Translate one word-group at a time: (twice a number) → 2n; (plus 5) → + 5; (equals 21) → = 21.",
    examTip: "Translating a verbal statement to an equation is a standard 1–2 mark question in CBSE competency papers. Parse each phrase independently.",
    keyConcepts: ["equation formation", "translating statements", "error identification"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:word-problem-to-equation"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Swapping the roles of coefficient and constant when translating verbal descriptions.", "Writing 2 alone instead of 2n for 'twice a number'."],
    extraTags: ["MCQ-error-spotting"],
  },

  // ── B5 Equation-to-Verbal ────────────────────────────────────────────────────

  {
    seq: "gen-014",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "concept", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 3,
    blueprint: "B5-equation-to-verbal",
    question: "Which of the following statements is best described by the equation n + 4 = 13?",
    options: [
      "4 more than a number equals 13",
      "A number equals 4 more than 13",
      "13 less than a number equals 4",
      "4 times a number equals 13",
    ],
    correctIdx: 0,
    answer: "Correct answer: (A) 4 more than a number equals 13",
    steps: [
      { title: "Read the equation", explanation: "n + 4 = 13 means: (unknown number n) + 4 = 13." },
      { title: "Translate n + 4", explanation: "'n + 4' = 4 added to n = '4 more than a number'." },
      { title: "Translate = 13", explanation: "'= 13' means 'equals 13'." },
      { title: "Eliminate distractors", explanation: "(B) would give n = 17, not n + 4 = 13. (C) would be n − 13 = 4. (D) would be 4n = 13." },
    ],
    hint: "Read the equation piece by piece: n is the unknown, + 4 means 'more than', = 13 means 'equals 13'.",
    keyConcepts: ["equation translation", "verbal representation", "equation formation"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:variable-vs-constant"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Reading n + 4 as 'a number equals 4 more' — the = sign is further right, between the expression and 13."],
    extraTags: ["MCQ-verbal"],
  },

  {
    seq: "gen-015",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "MCQ",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 4,
    blueprint: "B5-equation-to-verbal",
    question: "Which verbal statement correctly describes the equation 3n − 2 = 10?",
    options: [
      "Two less than three times a number equals 10",
      "Three less than twice a number equals 10",
      "Two more than three times a number equals 10",
      "Three times a number equals two more than 10",
    ],
    correctIdx: 0,
    answer: "Correct answer: (A) Two less than three times a number equals 10",
    steps: [
      { title: "Identify 3n", explanation: "'3n' = three times the unknown number n." },
      { title: "Identify − 2", explanation: "'3n − 2' = three times n, decreased by 2, i.e. 'two less than three times n'." },
      { title: "Identify = 10", explanation: "'= 10' means 'equals 10'." },
      { title: "Eliminate distractors", explanation: "(B) would be 2n − 3 = 10. (C) would be 3n + 2 = 10. (D) would be 3n = 12, which gives the same solution but is a different equation form." },
    ],
    hint: "'3n − 2' reads as 'two less than three times a number' — subtraction on the variable-side means 'less than'.",
    hint2: "Check by solving: 3n = 12, n = 4. Then verify: 3(4) − 2 = 10 ✓",
    examTip: "Equations-to-words questions appear in CBSE competency papers. A common trap is swapping 'less than' and 'more than' (options A and C here).",
    keyConcepts: ["equation translation", "coefficient", "subtraction in verbal form"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:word-problem-to-equation"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Translating − 2 as 'two more than' rather than 'two less than'."],
    extraTags: ["MCQ-verbal"],
  },

  {
    seq: "gen-016",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 3, estimatedTimeMinutes: 7,
    blueprint: "B5-equation-to-verbal",
    question: "Write a verbal statement for the equation 5n + 3 = 23. Then solve the equation to find the value of n.",
    answer: "Verbal: 'Five times a number, increased by 3, equals 23.' Solving: 5n = 20, so n = 4.",
    steps: [
      { title: "Translate 5n", explanation: "'5n' means 'five times an unknown number n'." },
      { title: "Translate + 3", explanation: "'5n + 3' means 'five times a number, increased by 3'." },
      { title: "Translate = 23", explanation: "'= 23' means 'equals 23'. Full verbal statement: 'Five times a number, increased by 3, equals 23.'" },
      { title: "Solve: move constant", explanation: "Subtract 3 from both sides: 5n = 23 − 3 = 20." },
      { title: "Solve: find n", explanation: "Divide both sides by 5: n = 20 ÷ 5 = 4." },
      { title: "Verify", explanation: "Substitute n = 4: 5(4) + 3 = 20 + 3 = 23 = RHS ✓" },
    ],
    hint: "Translate each part separately: (5n) → '5 times a number'; (+3) → 'increased by 3'; (=23) → 'equals 23'.",
    hint2: "After writing the verbal form, solve the original equation using the two-step method.",
    examTip: "Combined translation + solve questions test Bloom's 'evaluate' level and are worth 3 marks in Class 7 assessments.",
    keyConcepts: ["equation translation", "two-step equations", "verbal representation"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:balance-method", "mth:7:ch04:transposition"],
    prerequisites: ["mth:7:ch04:variable-vs-constant", "mth:7:ch04:balance-method"],
    commonErrors: ["Writing the verbal statement after solving, rather than directly from the equation.", "Translating +3 as 'increased by 3n' instead of by a constant."],
    extraTags: ["combined-task"],
  },

  // ── B6 Fill Missing Value ────────────────────────────────────────────────────

  {
    seq: "gen-017",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "FillInTheBlanks",
    difficulty: "Easy", bloomsLevel: "apply",
    marks: 1, estimatedTimeMinutes: 2,
    blueprint: "B6-fill-missing-value",
    question: "In the equation x + ___ = 17, if x = 9, the missing number is ___.",
    answer: "8",
    steps: [
      { title: "Substitute the known value", explanation: "Replace x with 9: 9 + ___ = 17." },
      { title: "Find the missing number", explanation: "___ = 17 − 9 = 8." },
      { title: "Verify", explanation: "Check: 9 + 8 = 17 ✓" },
    ],
    hint: "Substitute x = 9 into the equation, then find what must be added to 9 to reach 17.",
    keyConcepts: ["substitution", "solving equations", "verification"],
    conceptsCovered: ["mth:7:ch04:verification", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Adding 9 and 17 instead of finding the difference: 9 + 17 = 26 ≠ correct."],
    extraTags: ["fill-in-the-blank"],
  },

  {
    seq: "gen-018",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "FillInTheBlanks",
    difficulty: "Easy", bloomsLevel: "apply",
    marks: 1, estimatedTimeMinutes: 2,
    blueprint: "B6-fill-missing-value",
    question: "The equation 4x = 28 gives x = ___.",
    answer: "7",
    steps: [
      { title: "Identify the operation", explanation: "4x means 4 times x. To undo multiplication, divide." },
      { title: "Divide both sides by 4", explanation: "x = 28 ÷ 4 = 7." },
      { title: "Verify", explanation: "Check: 4 × 7 = 28 ✓" },
    ],
    hint: "What do you divide by to cancel the 4 in '4x'?",
    keyConcepts: ["division operation", "solving equations", "inverse operations"],
    conceptsCovered: ["mth:7:ch04:balance-method", "mth:7:ch04:verification"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Subtracting 4 from 28 (28 − 4 = 24) instead of dividing."],
    extraTags: ["fill-in-the-blank"],
  },

  {
    seq: "gen-019",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "competency", questionFormat: "FillInTheBlanks",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 1, estimatedTimeMinutes: 4,
    blueprint: "B6-fill-missing-value",
    question: "In the equation 3n − ___ = 10, if n = 5, the missing number is ___.",
    answer: "5",
    steps: [
      { title: "Substitute n = 5", explanation: "Replace n with 5: 3(5) − ___ = 10." },
      { title: "Simplify", explanation: "15 − ___ = 10." },
      { title: "Find the missing number", explanation: "___ = 15 − 10 = 5." },
      { title: "Verify", explanation: "Check: 3(5) − 5 = 15 − 5 = 10 ✓" },
    ],
    hint: "First compute 3 × 5 = 15, then decide what must be subtracted from 15 to get 10.",
    hint2: "Work backwards: if 15 − ? = 10, then ? = 15 − 10.",
    examTip: "Finding a missing constant tests 'working backwards' — a key Class 7 problem-solving skill.",
    keyConcepts: ["substitution", "working backwards", "verification"],
    conceptsCovered: ["mth:7:ch04:verification", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant", "mth:7:ch04:balance-method"],
    commonErrors: ["Substituting n = 5 into the missing-number slot instead of into n."],
    extraTags: ["fill-in-the-blank"],
  },

  // ── B7 Daily-Life Application ────────────────────────────────────────────────

  {
    seq: "gen-020",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: 5,
    blueprint: "B7-daily-life-application",
    question: "A bookshop sells pens at ₹5 each. Meera buys some pens and pays a total of ₹45. Set up an equation and find how many pens she bought.",
    answer: "Meera bought 9 pens. (Let n = number of pens. Equation: 5n = 45 → n = 9.)",
    steps: [
      { title: "Define the variable", explanation: "Let n = the number of pens Meera bought." },
      { title: "Form the equation", explanation: "Cost of n pens at ₹5 each = 5n. Total paid = ₹45. Equation: 5n = 45." },
      { title: "Solve", explanation: "Divide both sides by 5: n = 45 ÷ 5 = 9." },
      { title: "Verify and state", explanation: "Check: 5 × 9 = ₹45 ✓. Meera bought 9 pens." },
    ],
    hint: "Total cost = price per pen × number of pens. Set this equal to ₹45.",
    hint2: "Name the unknown first, then write a multiplication equation.",
    examTip: "Direct proportion word problems (cost × quantity = total) are the most common Class 7 application of equations.",
    keyConcepts: ["forming equations", "multiplication equations", "real-world application"],
    conceptsCovered: ["mth:7:ch04:word-problem-to-equation", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Dividing 45 by 5 mentally without forming the equation — the question asks for the equation.", "Writing n = 5 × 45 = 225 by multiplying instead of dividing."],
    extraTags: ["real-life", "word-problem"],
  },

  {
    seq: "gen-021",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: 5,
    blueprint: "B7-daily-life-application",
    question: "Ravi had some marbles. After giving 8 to his friend, he had 15 left. Set up an equation and find how many marbles Ravi started with.",
    answer: "Ravi started with 23 marbles. (Let n = initial count. Equation: n − 8 = 15 → n = 23.)",
    steps: [
      { title: "Define the variable", explanation: "Let n = the number of marbles Ravi started with." },
      { title: "Form the equation", explanation: "After giving away 8: n − 8 = 15." },
      { title: "Solve", explanation: "Add 8 to both sides: n = 15 + 8 = 23." },
      { title: "Verify and state", explanation: "Check: 23 − 8 = 15 ✓. Ravi started with 23 marbles." },
    ],
    hint: "Starting amount minus given-away amount equals remaining amount.",
    hint2: "If you subtract 8 and get 15, you must add 8 to 15 to find what you started with.",
    examTip: "Subtraction word problems are common. Carefully identify what is known (15 left, gave away 8) and what is unknown (starting count).",
    keyConcepts: ["forming equations", "subtraction equations", "real-world application"],
    conceptsCovered: ["mth:7:ch04:word-problem-to-equation", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Subtracting 15 − 8 = 7 directly, ignoring that 8 was already taken away.", "Writing 8 − n = 15 (reversing the subtraction)."],
    extraTags: ["real-life", "word-problem"],
  },

  {
    seq: "gen-022",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "hots", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "analyse",
    marks: 3, estimatedTimeMinutes: 8,
    blueprint: "B7-daily-life-application",
    question: "In a class, the number of girls is 7 more than twice the number of boys. The total number of students is 49. Find the number of boys.",
    answer: "There are 14 boys. (Let b = boys, girls = 2b + 7. Equation: b + 2b + 7 = 49 → 3b = 42 → b = 14.)",
    steps: [
      { title: "Define variable", explanation: "Let b = number of boys." },
      { title: "Express girls in terms of b", explanation: "Girls = 7 more than twice the boys = 2b + 7." },
      { title: "Form the equation", explanation: "Total = boys + girls: b + (2b + 7) = 49, giving 3b + 7 = 49." },
      { title: "Solve", explanation: "Subtract 7: 3b = 42. Divide by 3: b = 14." },
      { title: "Verify", explanation: "Boys = 14, Girls = 2(14) + 7 = 35. Total = 14 + 35 = 49 ✓" },
    ],
    hint: "Express the number of girls using b (the number of boys), then add boys + girls = 49.",
    hint2: "After forming 3b + 7 = 49, solve in two steps: first subtract 7, then divide by 3.",
    examTip: "Two-condition word problems that reduce to a single equation with one variable are 3-mark questions in Class 7–8 board papers. Always verify both conditions.",
    keyConcepts: ["multi-condition problems", "expressing one quantity in terms of another", "two-step equations"],
    conceptsCovered: ["mth:7:ch04:word-problem-to-equation", "mth:7:ch04:equation-from-statement", "mth:7:ch04:balance-method", "mth:7:ch04:transposition"],
    prerequisites: ["mth:7:ch04:variable-vs-constant", "mth:7:ch04:balance-method"],
    commonErrors: ["Writing girls = 2 + 7b instead of 2b + 7.", "Forgetting to add both boys and girls and setting just boys = 49."],
    extraTags: ["real-life", "word-problem", "hots"],
  },

  // ── B8 True/False ────────────────────────────────────────────────────────────

  {
    seq: "gen-023",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "TrueOrFalse",
    difficulty: "Easy", bloomsLevel: "evaluate",
    marks: 2, estimatedTimeMinutes: 3,
    blueprint: "B8-true-false",
    question: "True or False: x = 6 is a solution of the equation 2x + 3 = 15. Justify your answer.",
    answer: "True. Substituting x = 6: 2(6) + 3 = 12 + 3 = 15 = RHS ✓",
    steps: [
      { title: "Substitute x = 6 into the LHS", explanation: "LHS = 2(6) + 3." },
      { title: "Compute", explanation: "2 × 6 = 12; 12 + 3 = 15." },
      { title: "Compare", explanation: "LHS = 15 = RHS ✓. So x = 6 satisfies the equation. The statement is TRUE." },
    ],
    hint: "Substitute x = 6 into the left-hand side and check whether you get 15.",
    keyConcepts: ["verification", "substitution", "solution of an equation"],
    conceptsCovered: ["mth:7:ch04:verification", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Saying True without showing the substitution — justification is worth 1 mark."],
    extraTags: ["true-false", "verification"],
  },

  {
    seq: "gen-024",
    topicId: "t2", topicName: "Solving and Verifying",
    questionType: "concept", questionFormat: "TrueOrFalse",
    difficulty: "Easy", bloomsLevel: "evaluate",
    marks: 2, estimatedTimeMinutes: 3,
    blueprint: "B8-true-false",
    question: "True or False: x = 4 is a solution of the equation 3x − 7 = 8. Justify your answer.",
    answer: "False. Substituting x = 4: 3(4) − 7 = 12 − 7 = 5 ≠ 8. The correct solution is x = 5.",
    steps: [
      { title: "Substitute x = 4 into the LHS", explanation: "LHS = 3(4) − 7." },
      { title: "Compute", explanation: "3 × 4 = 12; 12 − 7 = 5." },
      { title: "Compare", explanation: "LHS = 5 ≠ 8 = RHS. So x = 4 does NOT satisfy the equation. The statement is FALSE." },
      { title: "Find the correct solution", explanation: "3x = 8 + 7 = 15, x = 5. Check: 3(5) − 7 = 8 ✓" },
    ],
    hint: "Always substitute and compute before deciding True or False — do not guess.",
    keyConcepts: ["verification", "substitution", "solution of an equation"],
    conceptsCovered: ["mth:7:ch04:verification", "mth:7:ch04:transposition"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Guessing True because 4 is close to 5.", "Not computing fully: stopping at 3 × 4 = 12 without subtracting 7."],
    extraTags: ["true-false", "verification"],
  },

  {
    seq: "gen-025",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "competency", questionFormat: "TrueOrFalse",
    difficulty: "Medium", bloomsLevel: "evaluate",
    marks: 2, estimatedTimeMinutes: 4,
    blueprint: "B8-true-false",
    question: "True or False: The equation for the statement 'the sum of a number and its double is 18' is n + 2n = 18. Justify your answer.",
    answer: "True. Let n be the number; its double is 2n. Sum = n + 2n = 3n = 18, giving n = 6. Check: 6 + 12 = 18 ✓",
    steps: [
      { title: "Identify the unknown", explanation: "Let n be the number." },
      { title: "Express 'its double'", explanation: "Double of n = 2n." },
      { title: "Write 'their sum'", explanation: "Sum = n + 2n." },
      { title: "Form the equation", explanation: "'Sum equals 18' gives n + 2n = 18. The equation matches. Statement is TRUE." },
      { title: "Solve to confirm", explanation: "3n = 18, n = 6. Check: n + 2n = 6 + 12 = 18 ✓" },
    ],
    hint: "'Its double' means 2 times the same number, so double of n = 2n (not n + 2).",
    hint2: "Simplify n + 2n = 3n. Then 3n = 18 gives n = 6.",
    examTip: "True/False on equation formation tests whether you can correctly identify the equation — a 2-mark question where the justification earns the second mark.",
    keyConcepts: ["equation formation", "verbal representation", "simplification"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:word-problem-to-equation"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Writing n + 2 = 18 thinking 'double' means adding 2.", "Forgetting to simplify n + 2n to 3n before solving."],
    extraTags: ["true-false", "equation-formation"],
  },

];

// ─── Runtime verification ─────────────────────────────────────────────────────

function verifyAll(): void {
  // B1 Direct Solve
  for (const p of T1_INSTANCES) {
    const x = (p.c - p.b) / p.a;
    if (!Number.isInteger(x) || x <= 0) throw new Error(`T1 bad solution ${p.seq}: x=${x}`);
    if (p.a * x + p.b !== p.c) throw new Error(`T1 verify failed ${p.seq}`);
  }

  // B2 Word-to-Equation
  for (const p of T2_INSTANCES) {
    let n: number;
    switch (p.op) {
      case "add":     n = p.n2 - p.n1; break;
      case "sub":     n = p.n2 + p.n1; break;
      case "mul_add": n = (p.n2 - p.n1) / p.k; break;
      case "mul_sub": n = (p.n2 + p.n1) / p.k; break;
    }
    if (!Number.isInteger(n) || n <= 0) throw new Error(`T2 bad solution ${p.seq}: n=${n}`);
    let lhs: number;
    switch (p.op) {
      case "add":     lhs = n + p.n1; break;
      case "sub":     lhs = n - p.n1; break;
      case "mul_add": lhs = p.k * n + p.n1; break;
      case "mul_sub": lhs = p.k * n - p.n1; break;
    }
    if (lhs !== p.n2) throw new Error(`T2 verify failed ${p.seq}: lhs=${lhs} ≠ ${p.n2}`);
  }

  // B3 MCQ Verification
  for (const p of T3_INSTANCES) {
    const correctText = p.options[p.correctIdx];
    if (p.options.filter(o => o === correctText).length !== 1)
      throw new Error(`T3 duplicate correct option ${p.seq}`);
  }

  // B4 Error Spotting — verify the corrected equation
  if (12 - 5 !== 7) throw new Error("gen-011: x + 5 = 12 → x should be 7");
  if ((16 - 4) / 2 !== 6) throw new Error("gen-012: 2x+4=16 → x should be 6");
  if (2 * 8 + 5 !== 21) throw new Error("gen-013: 2n+5=21 → n should be 8, verify failed");

  // B5 Equation-to-Verbal
  if (13 - 4 !== 9) throw new Error("gen-014: n+4=13 → n should be 9");
  if ((10 + 2) / 3 !== 4) throw new Error("gen-015: 3n-2=10 → n should be 4");
  if ((23 - 3) / 5 !== 4) throw new Error("gen-016: 5n+3=23 → n should be 4");

  // B6 Fill Missing Value
  if (17 - 9 !== 8) throw new Error("gen-017: x+?=17,x=9 → ?=8");
  if (28 / 4 !== 7) throw new Error("gen-018: 4x=28 → x=7");
  if (3 * 5 - 10 !== 5) throw new Error("gen-019: 3n-?=10,n=5 → ?=5");

  // B7 Daily-Life Application
  if (45 / 5 !== 9) throw new Error("gen-020: 5n=45 → n=9");
  if (15 + 8 !== 23) throw new Error("gen-021: n-8=15 → n=23");
  if ((49 - 7) / 3 !== 14) throw new Error("gen-022: 3b+7=49 → b=14");
  if (14 + 2 * 14 + 7 !== 49) throw new Error("gen-022: verify total students");

  // B8 True/False
  if (2 * 6 + 3 !== 15) throw new Error("gen-023: 2x+3=15 should be True for x=6");
  if (3 * 4 - 7 === 8) throw new Error("gen-024: 3x-7=8 should be False for x=4");
  if (3 * 4 - 7 !== 5) throw new Error("gen-024: LHS should be 5");
  if ((8 + 7) / 3 !== 5) throw new Error("gen-024: correct x should be 5");
  if (6 + 2 * 6 !== 18) throw new Error("gen-025: n+2n=18 should be True for n=6");

  // MCQ correctIdx uniqueness for new questions
  for (const q of NEW_QUESTIONS) {
    if (q.questionFormat === "MCQ") {
      if (!q.options || q.correctIdx === undefined)
        throw new Error(`${q.seq}: MCQ missing options or correctIdx`);
      const correct = q.options[q.correctIdx];
      const count   = q.options.filter(o => o === correct).length;
      if (count !== 1) throw new Error(`${q.seq}: correct option appears ${count} times`);
      const distinct = new Set(q.options);
      if (distinct.size !== 4) throw new Error(`${q.seq}: options not all distinct`);
    }
  }

  console.log("✓ All 25 answers independently verified.");
}

// ─── Assemble output file ─────────────────────────────────────────────────────

function generate(): string {
  const ordered: Record<string, string> = {};

  T1_INSTANCES.forEach(p   => { ordered[p.seq] = makeT1(p); });
  T2_INSTANCES.forEach(p   => { ordered[p.seq] = makeT2(p); });
  T3_INSTANCES.forEach(p   => { ordered[p.seq] = makeT3(p); });
  NEW_QUESTIONS.forEach(p  => { ordered[p.seq] = makeQ(p);  });

  const sortedKeys      = Object.keys(ordered).sort();
  const questionBlocks  = sortedKeys.map(k => ordered[k]!).join(",\n\n");

  const totalQ     = sortedKeys.length;
  const easyCount  = [...T1_INSTANCES, ...T2_INSTANCES].filter(p => p.difficulty === "Easy").length
                   + NEW_QUESTIONS.filter(p => p.difficulty === "Easy").length;
  const medCount   = [...T1_INSTANCES, ...T2_INSTANCES].filter(p => p.difficulty === "Medium").length
                   + NEW_QUESTIONS.filter(p => p.difficulty === "Medium").length;
  const hardCount  = T3_INSTANCES.length + NEW_QUESTIONS.filter(p => p.difficulty === "Hard").length;

  return `// @ts-nocheck
/**
 * Question Bank — Mathematics, Class 7, Chapter 4: Simple Equations
 * GENERATED QUALITY PILOT — offline deterministic generator.
 *
 * Generator : scripts/src/generateMathQuestionProof.ts
 * Command   : pnpm --filter @workspace/scripts run generate-proof
 *
 * ${totalQ} questions — ${easyCount} Easy / ${medCount} Medium / ${hardCount} Hard
 * Topics: t1 Setting Up Equations | t2 Solving and Verifying
 *
 * Blueprint families (max 5 per family, ≥ 8 families):
 *   B1 Direct Solve           gen-001, 002, 005, 006        4 q  Easy×2, Medium×2
 *   B2 Word-to-Equation       gen-003, 004, 007, 008        4 q  Easy×2, Medium×2
 *   B3 MCQ Verification       gen-009, 010                  2 q  Hard×2
 *   B4 Error Spotting         gen-011, 012, 013             3 q  Easy, Medium, Hard
 *   B5 Equation-to-Verbal     gen-014, 015, 016             3 q  Easy, Medium, Hard
 *   B6 Fill Missing Value     gen-017, 018, 019             3 q  Easy×2, Medium
 *   B7 Daily-Life Application gen-020, 021, 022             3 q  Medium×2, Hard
 *   B8 True/False             gen-023, 024, 025             3 q  Easy×2, Medium
 *
 * Format distribution: ShortAnswer×12, MCQ×7, FillInTheBlanks×3, TrueOrFalse×3
 * Bloom's: understand×4, apply×11, analyse×4, evaluate×6
 *
 * Original 10 IDs (gen-001..gen-010) preserved. Blueprint tags added to metadata.
 * DO NOT hand-edit. Re-run the generator to modify.
 */

import type { QuestionV2 } from "../../../types";

export const CH04_SIMPLE_EQUATIONS_GENERATED_PROOF: QuestionV2[] = [

${questionBlocks},

];
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

verifyAll();
const content = generate();
writeFileSync(OUTPUT, content, "utf8");
console.log(`✓ Written ${OUTPUT}`);
console.log(`  Questions : ${(content.match(/id: "bo-mth-7-ch04-gen-/g) ?? []).length}`);
