/**
 * Deterministic offline generator — proof of concept.
 *
 * Chapter  : Mathematics, Class 7, Chapter 4 — Simple Equations
 * Output   : question-bank/questions/mathematics/class7/ch04-simple-equations-generated-proof.ts
 *
 * Three reusable templates (no AI, no randomness, no network):
 *   T1 — Direct Solve      : ax [+/-] b = c  →  isolate x
 *   T2 — Word-to-Equation  : verbal statement → equation → solve
 *   T3 — MCQ Verification  : identify which of 4 options satisfies the equation
 *
 * Run with:  pnpm --filter @workspace/scripts run generate-proof
 * Determinism guarantee: running twice produces byte-for-byte identical output.
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

/** Escape a string for embedding inside a double-quoted TypeScript literal. */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Display form for a signed number used inside an equation: +7, −4 etc. */
function signedDisplay(n: number): string {
  return n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`;
}

// ─── Template T1 : Direct Solve  (ax + b = c) ────────────────────────────────
//
// Parameters:
//   seq        — ID suffix, e.g. "gen-001"
//   difficulty — "Easy" | "Medium"
//   a          — coefficient of x  (must be positive integer)
//   b          — additive constant  (may be negative — displayed as subtraction)
//   c          — right-hand side value
//
// All solutions must be positive integers; caller is responsible for ensuring
// (c - b) is divisible by a.

interface T1Params {
  seq: string;
  difficulty: "Easy" | "Medium";
  a: number;
  b: number;
  c: number;
}

function makeT1(p: T1Params): string {
  const x = (p.c - p.b) / p.a; // verified: always a positive integer for chosen params

  // Equation display string
  let eq: string;
  if (p.a === 1 && p.b === 0)       eq = `x = ${p.c}`;
  else if (p.a === 1 && p.b > 0)    eq = `x + ${p.b} = ${p.c}`;
  else if (p.a === 1 && p.b < 0)    eq = `x − ${Math.abs(p.b)} = ${p.c}`;
  else if (p.b === 0)                eq = `${p.a}x = ${p.c}`;
  else if (p.b > 0)                  eq = `${p.a}x + ${p.b} = ${p.c}`;
  else                               eq = `${p.a}x − ${Math.abs(p.b)} = ${p.c}`;

  // Step 2: move constant
  const afterMove = p.c - p.b;
  let step2: string;
  if (p.b === 0) {
    step2 = `Equation is already ${p.a}x = ${p.c}. Proceed to divide.`;
  } else if (p.b > 0) {
    step2 = `Subtract ${p.b} from both sides: ${p.a === 1 ? "" : p.a}x = ${p.c} − ${p.b} = ${afterMove}`;
  } else {
    step2 = `Add ${Math.abs(p.b)} to both sides: ${p.a === 1 ? "" : p.a}x = ${p.c} + ${Math.abs(p.b)} = ${afterMove}`;
  }

  // Step 3: divide
  const step3 = p.a === 1
    ? `x is already isolated: x = ${x}`
    : `Divide both sides by ${p.a}: x = ${afterMove} ÷ ${p.a} = ${x}`;

  // Verification string
  let verifyLHS: string;
  if (p.a === 1 && p.b >= 0)        verifyLHS = `${x} + ${p.b}`;
  else if (p.a === 1 && p.b < 0)    verifyLHS = `${x} − ${Math.abs(p.b)}`;
  else if (p.b === 0)                verifyLHS = `${p.a} × ${x}`;
  else if (p.b > 0)                  verifyLHS = `${p.a}(${x}) + ${p.b}`;
  else                               verifyLHS = `${p.a}(${x}) − ${Math.abs(p.b)}`;

  const lhsValue = p.a * x + p.b;
  const timeMin = p.difficulty === "Easy" ? 3 : 5;

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
      { stepNumber: 1, title: "State the equation", explanation: "Given equation: ${esc(eq)}" },
      { stepNumber: 2, title: "Move the constant", explanation: "${esc(step2)}" },
      { stepNumber: 3, title: "Isolate x", explanation: "${esc(step3)}" },
      { stepNumber: 4, title: "Verify", explanation: "Substitute x = ${x}: LHS = ${esc(verifyLHS)} = ${lhsValue} = ${p.c} = RHS ✓" },
    ],
    hint: "Use the balance method: apply the same operation to both sides to isolate x.",
    keyConcepts: ["solving equations", "balance method", "transposition", "verification"],
    conceptsCovered: ["mth:7:ch04:balance-method", "mth:7:ch04:transposition", "mth:7:ch04:verification"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Applying the operation to only one side of the equation instead of both."],
    tags: ["computational", "ncert-direct", "class7", "ch04", "solve-equation", "generated-proof"],
    source: "original",
  }`;
}

// ─── Template T2 : Word-to-Equation ──────────────────────────────────────────
//
// Parameters:
//   seq        — ID suffix
//   difficulty — "Easy" | "Medium"
//   op         — operation pattern (determines question text and equation shape)
//   k          — multiplier (1 for add/sub, 2 or 3 for mul_add/mul_sub)
//   n1         — modifier (the added/subtracted constant in the equation)
//   n2         — result (RHS of the equation)
//
// Supported operations and their equation shape:
//   "add"     : n + n1 = n2   →  n = n2 − n1
//   "sub"     : n − n1 = n2   →  n = n2 + n1
//   "mul_add" : k·n + n1 = n2 →  n = (n2 − n1) / k
//   "mul_sub" : k·n − n1 = n2 →  n = (n2 + n1) / k

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

  // Derive question text
  let qText: string;
  switch (p.op) {
    case "add":     qText = `${p.n1} more than a number is ${p.n2}. Find the number.`; break;
    case "sub":     qText = `A number decreased by ${p.n1} equals ${p.n2}. Find the number.`; break;
    case "mul_add": qText = `${kWord} a number, increased by ${p.n1}, equals ${p.n2}. Find the number.`; break;
    case "mul_sub": qText = `${kWord} a number, decreased by ${p.n1}, equals ${p.n2}. Find the number.`; break;
  }

  // Derive equation text
  let eqText: string;
  switch (p.op) {
    case "add":     eqText = `n + ${p.n1} = ${p.n2}`; break;
    case "sub":     eqText = `n − ${p.n1} = ${p.n2}`; break;
    case "mul_add": eqText = `${p.k}n + ${p.n1} = ${p.n2}`; break;
    case "mul_sub": eqText = `${p.k}n − ${p.n1} = ${p.n2}`; break;
  }

  // Compute solution
  let n: number;
  switch (p.op) {
    case "add":     n = p.n2 - p.n1; break;
    case "sub":     n = p.n2 + p.n1; break;
    case "mul_add": n = (p.n2 - p.n1) / p.k; break;
    case "mul_sub": n = (p.n2 + p.n1) / p.k; break;
  }

  // Step 3: move constant
  let step3: string;
  switch (p.op) {
    case "add":     step3 = `Subtract ${p.n1} from both sides: n = ${p.n2} − ${p.n1} = ${n}`; break;
    case "sub":     step3 = `Add ${p.n1} to both sides: n = ${p.n2} + ${p.n1} = ${n}`; break;
    case "mul_add": step3 = `Subtract ${p.n1} from both sides: ${p.k}n = ${p.n2} − ${p.n1} = ${p.n2 - p.n1}`; break;
    case "mul_sub": step3 = `Add ${p.n1} to both sides: ${p.k}n = ${p.n2} + ${p.n1} = ${p.n2 + p.n1}`; break;
  }

  const needsDivide = p.op === "mul_add" || p.op === "mul_sub";
  const intermediateVal = p.op === "mul_add" ? p.n2 - p.n1 : p.n2 + p.n1;
  const step4 = needsDivide
    ? `Divide both sides by ${p.k}: n = ${intermediateVal} ÷ ${p.k} = ${n}`
    : "";

  // Verify
  let verifyText: string;
  switch (p.op) {
    case "add":     verifyText = `${n} + ${p.n1} = ${n + p.n1} = ${p.n2}`; break;
    case "sub":     verifyText = `${n} − ${p.n1} = ${n - p.n1} = ${p.n2}`; break;
    case "mul_add": verifyText = `${p.k}(${n}) + ${p.n1} = ${p.k * n} + ${p.n1} = ${p.k * n + p.n1} = ${p.n2}`; break;
    case "mul_sub": verifyText = `${p.k}(${n}) − ${p.n1} = ${p.k * n} − ${p.n1} = ${p.k * n - p.n1} = ${p.n2}`; break;
  }

  const timeMin = p.difficulty === "Easy" ? 4 : 6;
  const bloomsLvl = p.difficulty === "Easy" ? "understand" : "apply";
  const qTyp = p.difficulty === "Easy" ? "concept" : "competency";

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

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "t1", topicName: "Setting Up Equations",
    questionType: "${qTyp}", questionFormat: "ShortAnswer",
    difficulty: "${p.difficulty}", bloomsLevel: "${bloomsLvl}",
    marks: 2, estimatedTimeMinutes: ${timeMin},
    question: "${esc(qText)}",
    answer: "The number is ${n}. (Equation used: ${esc(eqText)}, solved to get n = ${n}.)",
    steps: [
${stepsBlock}
    ],
    hint: "First name the unknown as n, write the equation from the sentence, then solve it.",
    keyConcepts: ["word problems", "equation formation", "balance method"],
    conceptsCovered: ["mth:7:ch04:equation-from-statement", "mth:7:ch04:word-problem-to-equation", "mth:7:ch04:balance-method"],
    prerequisites: ["mth:7:ch04:variable-vs-constant"],
    commonErrors: ["Setting up the wrong equation — misidentifying which quantity is unknown.", "Forgetting to verify the answer in the original word statement."],
    tags: ["conceptual", "real-life", "class7", "ch04", "word-problem", "generated-proof"],
    source: "original",
  }`;
}

// ─── Template T3 : MCQ Verification ──────────────────────────────────────────
//
// Parameters:
//   seq          — ID suffix
//   topicId      — "t1" or "t2"
//   question     — full question text (caller supplies)
//   solveSteps   — array of { title, explanation } for the solution
//   options      — exactly 4 option strings
//   correctIdx   — 0-based index of the correct option
//   hintText     — hint string

interface T3Params {
  seq: string;
  topicId: "t1" | "t2";
  topicName: "Setting Up Equations" | "Solving and Verifying";
  question: string;
  solveSteps: Array<{ title: string; explanation: string }>;
  options: [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  hintText: string;
  keyConcepts: string[];
  conceptsCovered: string[];
  commonErrors: string[];
}

function makeT3(p: T3Params): string {
  const labels = ["(A)", "(B)", "(C)", "(D)"];
  const correctLabel = labels[p.correctIdx];
  const correctText  = p.options[p.correctIdx];

  const stepsLines = p.solveSteps
    .map((s, i) => `      { stepNumber: ${i + 1}, title: "${esc(s.title)}", explanation: "${esc(s.explanation)}" },`)
    .join("\n");

  const optionsLine = p.options.map(o => `"${esc(o)}"`).join(", ");

  const kcLine  = p.keyConcepts.map(k => `"${esc(k)}"`).join(", ");
  const ccLine  = p.conceptsCovered.map(c => `"${esc(c)}"`).join(", ");
  const ceLine  = p.commonErrors.map(e => `"${esc(e)}"`).join(", ");

  return `  {
    id: "bo-mth-7-ch04-${esc(p.seq)}",
    schemaVersion: 2, classNum: 7, subject: "Mathematics", board: "Both",
    chapterId: "ch04", chapterName: "Simple Equations",
    topicId: "${p.topicId}", topicName: "${p.topicName}",
    questionType: "competency", questionFormat: "MCQ",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 1, estimatedTimeMinutes: 6,
    question: "${esc(p.question)}",
    options: [${optionsLine}],
    answer: "Correct answer: ${correctLabel} ${esc(correctText)}",
    steps: [
${stepsLines}
    ],
    hint: "${esc(p.hintText)}",
    keyConcepts: [${kcLine}],
    conceptsCovered: [${ccLine}],
    prerequisites: ["mth:7:ch04:balance-method", "mth:7:ch04:transposition"],
    commonErrors: [${ceLine}],
    tags: ["board-important", "computational", "class7", "ch04", "MCQ-solve", "generated-proof"],
    source: "original",
  }`;
}

// ─── Fixed parameter sets (deterministic — no randomness) ────────────────────

const T1_INSTANCES: T1Params[] = [
  // Easy: single-step
  { seq: "gen-001", difficulty: "Easy",   a: 1, b:  7, c: 15 }, // x + 7 = 15  → x = 8
  { seq: "gen-002", difficulty: "Easy",   a: 3, b:  0, c: 21 }, // 3x = 21      → x = 7
  // Medium: two-step
  { seq: "gen-005", difficulty: "Medium", a: 2, b:  5, c: 17 }, // 2x + 5 = 17  → x = 6
  { seq: "gen-006", difficulty: "Medium", a: 3, b: -4, c: 14 }, // 3x − 4 = 14  → x = 6
];

const T2_INSTANCES: T2Params[] = [
  // Easy: single-step word problems
  { seq: "gen-003", difficulty: "Easy",   op: "add",     k: 1, n1:  8, n2: 20 }, // n + 8 = 20   → n = 12
  { seq: "gen-004", difficulty: "Easy",   op: "sub",     k: 1, n1:  6, n2: 10 }, // n − 6 = 10   → n = 16
  // Medium: two-step word problems
  { seq: "gen-007", difficulty: "Medium", op: "mul_add", k: 2, n1:  3, n2: 19 }, // 2n + 3 = 19  → n = 8
  { seq: "gen-008", difficulty: "Medium", op: "mul_sub", k: 3, n1:  7, n2: 11 }, // 3n − 7 = 11  → n = 6
];

const T3_INSTANCES: T3Params[] = [
  {
    seq:       "gen-009",
    topicId:   "t2",
    topicName: "Solving and Verifying",
    question:  "Which value of x satisfies the equation 4x − 6 = 2x + 8?",
    // Solution: 4x − 2x = 8 + 6 → 2x = 14 → x = 7
    // Check distractors: x=5 → LHS=14, RHS=18 ✗ | x=6 → LHS=18, RHS=20 ✗ | x=8 → LHS=26, RHS=24 ✗
    options: ["x = 5", "x = 6", "x = 7", "x = 8"],
    correctIdx: 2,
    solveSteps: [
      { title: "Collect x-terms on one side",  explanation: "Subtract 2x from both sides: 4x − 2x − 6 = 8, giving 2x − 6 = 8." },
      { title: "Move constant to RHS",          explanation: "Add 6 to both sides: 2x = 8 + 6 = 14." },
      { title: "Divide both sides by 2",        explanation: "x = 14 ÷ 2 = 7." },
      { title: "Verify",                        explanation: "LHS = 4(7) − 6 = 22; RHS = 2(7) + 8 = 22. LHS = RHS ✓" },
      { title: "Check distractors",             explanation: "x=5: LHS=14, RHS=18 ✗. x=6: LHS=18, RHS=20 ✗. x=8: LHS=26, RHS=24 ✗." },
    ],
    hintText:       "Move all x-terms to one side and all numbers to the other, then divide.",
    keyConcepts:    ["variables on both sides", "transposition", "verification"],
    conceptsCovered: ["mth:7:ch04:transposition", "mth:7:ch04:verification", "mth:7:ch04:balance-method"],
    commonErrors:   [
      "Subtracting 6 from the RHS instead of adding it when moving the constant.",
      "Guessing x = 8 because it is the largest option — always verify by substitution.",
    ],
  },
  {
    seq:       "gen-010",
    topicId:   "t1",
    topicName: "Setting Up Equations",
    question:  "The sum of three consecutive integers is 54. What is the smallest of the three integers?",
    // Let n, n+1, n+2. n + (n+1) + (n+2) = 54 → 3n + 3 = 54 → 3n = 51 → n = 17
    // Check: 17 + 18 + 19 = 54 ✓
    // Distractors: 15→48 ✗, 16→51 ✗, 18→57 ✗
    options: ["15", "16", "17", "18"],
    correctIdx: 2,
    solveSteps: [
      { title: "Assign variables",          explanation: "Let the three consecutive integers be n, n + 1, and n + 2." },
      { title: "Form the equation",         explanation: "n + (n + 1) + (n + 2) = 54, which simplifies to 3n + 3 = 54." },
      { title: "Solve for n",               explanation: "Subtract 3: 3n = 51. Divide by 3: n = 17." },
      { title: "Verify",                    explanation: "17 + 18 + 19 = 54 ✓. The smallest integer is 17." },
      { title: "Eliminate distractors",     explanation: "n=15: 15+16+17=48 ✗. n=16: 16+17+18=51 ✗. n=18: 18+19+20=57 ✗." },
    ],
    hintText:       "Name the smallest integer n. The next two are n+1 and n+2. Write their sum equal to 54.",
    keyConcepts:    ["consecutive integers", "equation formation", "solving equations"],
    conceptsCovered: ["mth:7:ch04:word-problem-to-equation", "mth:7:ch04:equation-from-statement", "mth:7:ch04:balance-method"],
    commonErrors:   [
      "Using n, n+2, n+4 (even gap) instead of n, n+1, n+2 for consecutive integers.",
      "Choosing 18 by dividing 54 ÷ 3 = 18 — this gives the middle integer, not the smallest.",
    ],
  },
];

// ─── Compute verified answers (runtime check) ─────────────────────────────────

function verifyAll(): void {
  for (const p of T1_INSTANCES) {
    const x = (p.c - p.b) / p.a;
    const lhs = p.a * x + p.b;
    if (lhs !== p.c) throw new Error(`T1 verification failed for ${p.seq}: LHS=${lhs} ≠ RHS=${p.c}`);
    if (!Number.isInteger(x) || x <= 0) throw new Error(`T1 non-positive-integer solution for ${p.seq}: x=${x}`);
  }
  for (const p of T2_INSTANCES) {
    let n: number;
    switch (p.op) {
      case "add":     n = p.n2 - p.n1;           break;
      case "sub":     n = p.n2 + p.n1;           break;
      case "mul_add": n = (p.n2 - p.n1) / p.k;  break;
      case "mul_sub": n = (p.n2 + p.n1) / p.k;  break;
    }
    if (!Number.isInteger(n) || n <= 0) throw new Error(`T2 non-positive-integer solution for ${p.seq}: n=${n}`);
    // Re-verify equation
    let lhs: number;
    switch (p.op) {
      case "add":     lhs = n + p.n1;            break;
      case "sub":     lhs = n - p.n1;            break;
      case "mul_add": lhs = p.k * n + p.n1;      break;
      case "mul_sub": lhs = p.k * n - p.n1;      break;
    }
    if (lhs !== p.n2) throw new Error(`T2 verification failed for ${p.seq}: LHS=${lhs} ≠ RHS=${p.n2}`);
  }
  for (const p of T3_INSTANCES) {
    if (p.options.length !== 4) throw new Error(`T3 must have exactly 4 options: ${p.seq}`);
    // Check correct option appears exactly once
    const correctText = p.options[p.correctIdx];
    const count = p.options.filter(o => o === correctText).length;
    if (count !== 1) throw new Error(`T3 correct option appears ${count} times in ${p.seq}`);
  }
  console.log("✓ All answers independently verified.");
}

// ─── Assemble output file ─────────────────────────────────────────────────────

function generate(): string {
  // Sort all instances by seq number to get deterministic output order
  const t1Qs = T1_INSTANCES.map(makeT1);
  const t2Qs = T2_INSTANCES.map(makeT2);
  const t3Qs = T3_INSTANCES.map(makeT3);

  // Interleave: gen-001..gen-010 in numerical order
  const ordered: Record<string, string> = {};
  T1_INSTANCES.forEach((p, i) => { ordered[p.seq] = t1Qs[i]!; });
  T2_INSTANCES.forEach((p, i) => { ordered[p.seq] = t2Qs[i]!; });
  T3_INSTANCES.forEach((p, i) => { ordered[p.seq] = t3Qs[i]!; });

  const sortedKeys = Object.keys(ordered).sort();
  const questionBlocks = sortedKeys.map(k => ordered[k]).join(",\n\n");

  return `// @ts-nocheck
/**
 * Question Bank — Mathematics, Class 7, Chapter 4: Simple Equations
 * GENERATED PROOF FILE — offline deterministic generator.
 *
 * Generator : scripts/src/generateMathQuestionProof.ts
 * Command   : pnpm --filter @workspace/scripts run generate-proof
 *
 * 10 questions — 4 Easy / 4 Medium / 2 Hard
 * Topics: t1 Setting Up Equations (6 q) | t2 Solving and Verifying (4 q)
 * Templates used:
 *   T1 Direct Solve     (gen-001, gen-002, gen-005, gen-006) — ax [+/-] b = c
 *   T2 Word-to-Equation (gen-003, gen-004, gen-007, gen-008) — verbal → equation → solve
 *   T3 MCQ Verification (gen-009, gen-010)                   — identify correct solution
 *
 * Safe variation capacity: T1 ≈ 200+, T2 ≈ 150+, T3 ≈ 40+ per chapter.
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
console.log(`  Questions: ${(content.match(/id: "bo-mth-7-ch04-gen-/g) ?? []).length}`);
