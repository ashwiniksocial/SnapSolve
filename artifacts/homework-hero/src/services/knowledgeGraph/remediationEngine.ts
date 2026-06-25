/**
 * Remediation Engine — personalised recovery plans at the concept level.
 *
 * When a concept gap is identified, this engine builds a 4-step recovery plan:
 *
 *   Step 1: TEACH prerequisite
 *     — Tutor explains the missing concept using the best strategy for this student
 *   Step 2: PRACTICE prerequisite
 *     — 3 targeted practice questions at the prerequisite level
 *   Step 3: VERIFY prerequisite
 *     — Mini-assessment (2 questions) to confirm the gap is closed
 *   Step 4: RETURN to original topic
 *     — Resume the original concept with the gap now filled
 *
 * Plans are concept-aware:
 *  - Uses analogy bank for this concept
 *  - Selects practice questions from the question bank or generates them
 *  - Adapts to the student's learning style and reasoning profile
 *
 * Firestore path: students/{id}/remediationPlans
 */

import { getConceptById, topologicalSort }   from "./knowledgeGraphEngine";
import { inferPrerequisiteGaps }              from "./prerequisiteInference";
import { getMasteredConceptIds }              from "./conceptMasteryEngine";
import { getLearnableNow }                    from "./dependencyEngine";
import type { ConceptNode }                   from "./conceptGraph";
import type { PrerequisiteGap }               from "./prerequisiteInference";

export type RemediationStep =
  | "teach"      // tutor explains the prerequisite concept
  | "practice"   // student attempts 3 practice questions
  | "verify"     // 2-question mini-assessment to confirm mastery
  | "return"     // return to the original concept
  | "complete"   // remediation successful
  | "abandoned"; // student gave up

export interface RemediationStepDetail {
  step:         RemediationStep;
  conceptId:    string;
  conceptName:  string;
  content:      string;          // instructions for the tutor at this step
  questions?:   string[];        // practice or verification questions
  completed:    boolean;
  startedAt?:   number;
  completedAt?: number;
  masteryAtEnd?: number;
}

export interface RemediationPlan {
  planId:              string;
  originConceptId:     string;    // the concept the student was trying to learn
  originConceptName:   string;
  targetGap:           PrerequisiteGap;

  steps:               RemediationStepDetail[];
  currentStepIndex:    number;
  currentStep:         RemediationStep;

  masteryAtStart:      number;
  masteryAtEnd?:       number;
  status:              "active" | "complete" | "abandoned";

  attempts:            number;    // how many plans have been created for this gap
  teachingStrategy:    string;    // strategy selected for this student
  analogyUsed?:        string;    // analogy that was tried

  createdAt:           number;
  updatedAt:           number;
}

// ── Practice question bank ────────────────────────────────────────────────────
// Curated per concept — used when no online generation is available

const PRACTICE_QUESTIONS: Record<string, string[]> = {
  "math-integers": [
    "Calculate: (−5) + 8 − (−3)",
    "What is the product of −4 × (−7)?",
    "Order from least to greatest: −3, 0, −7, 4, −1",
  ],
  "math-fractions": [
    "Simplify: 18/24 to its lowest form.",
    "Calculate: ⅔ + ¾",
    "Which is greater: 5/8 or 3/5? Show your working.",
  ],
  "math-algebra-basics": [
    "Simplify: 3x + 5 − x + 2",
    "Expand: 2(3x − 4)",
    "If x = 3, find the value of 4x² − 2x + 1",
  ],
  "math-linear-equations": [
    "Solve: 5x − 3 = 2x + 9",
    "Solve: (x + 2)/3 = 5",
    "A number is doubled and 7 is added. The result is 19. Find the number.",
  ],
  "math-factorisation": [
    "Factorise: x² − 5x + 6",
    "Factorise: 4x² − 9",
    "Factorise completely: 2x² + 8x",
  ],
  "math-pythagoras": [
    "In a right triangle with legs 5 cm and 12 cm, find the hypotenuse.",
    "A ladder 13 m long leans against a wall. The base is 5 m from the wall. How high does the ladder reach?",
    "Is a triangle with sides 7, 24, 25 a right triangle? Prove it.",
  ],
  "phys-motion-basics": [
    "A car travels 120 km in 2 hours. What is its average speed?",
    "A ball moves 50 m east then 30 m west. What is its displacement?",
    "What is the difference between uniform and non-uniform motion? Give one example of each.",
  ],
  "phys-forces": [
    "A 5 kg object accelerates at 3 m/s². What net force acts on it?",
    "State Newton's First Law and give a real-world example.",
    "Why does a rocket accelerate upward when it ejects gases downward?",
  ],
  "phys-electricity-basics": [
    "A resistor of 10 Ω has a voltage of 5 V across it. What current flows?",
    "State Ohm's Law. What are its limitations?",
    "If resistance doubles and voltage stays the same, what happens to current?",
  ],
  "chem-atomic-structure": [
    "An atom has 11 protons and 12 neutrons. What is its atomic number and mass number?",
    "How many electrons can the second shell hold?",
    "What is the difference between atomic number and mass number?",
  ],
  "chem-acids-bases": [
    "What pH range indicates an acid? A base?",
    "Write the word equation for the neutralisation of HCl with NaOH.",
    "What does an indicator tell you about a solution?",
  ],
};

/** Generate a default practice question if none in bank. */
function getDefaultQuestion(concept: ConceptNode, index: number): string {
  const templates = [
    `Explain the key idea behind ${concept.concept} in your own words.`,
    `Give one real-world example that demonstrates ${concept.concept}.`,
    `What is the most common mistake students make with ${concept.concept}? Why is it wrong?`,
  ];
  return templates[index] ?? templates[0];
}

function getPracticeQuestions(conceptId: string, concept: ConceptNode): string[] {
  return PRACTICE_QUESTIONS[conceptId] ?? [0, 1, 2].map((i) => getDefaultQuestion(concept, i));
}

/** 2-question verification set (harder than practice). */
function getVerificationQuestions(conceptId: string, concept: ConceptNode): string[] {
  const practice = getPracticeQuestions(conceptId, concept);
  return [
    practice[practice.length - 1],  // hardest practice question
    `Without using any notes: ${getDefaultQuestion(concept, 0)}`,
  ];
}

// ── Storage ───────────────────────────────────────────────────────────────────

const KEY = "studyai-v1-remediation-plans";

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

function getAll(): RemediationPlan[] { return lsRead<RemediationPlan[]>(KEY, []); }

// ── Core API ──────────────────────────────────────────────────────────────────

/**
 * Create a remediation plan for a failing concept.
 * Automatically infers which prerequisite gap to address.
 */
export function createRemediationPlan(opts: {
  originConceptId: string;
  failureCount:    number;
  teachingStrategy?: string;
}): RemediationPlan | null {
  const originNode = getConceptById(opts.originConceptId);
  if (!originNode) return null;

  const inference = inferPrerequisiteGaps(opts.originConceptId, opts.failureCount);
  if (!inference) return null;

  const gap = inference.topGap ?? inference.rootCause;
  if (!gap) return null;

  const gapNode  = gap.concept;
  const strategy = opts.teachingStrategy ?? "scaffolding";

  const steps: RemediationStepDetail[] = [
    {
      step:        "teach",
      conceptId:   gapNode.id,
      conceptName: gapNode.concept,
      completed:   false,
      content:     `Teach "${gapNode.concept}" using ${strategy}. Focus on: ${gapNode.commonMisconceptions.map((m) => `avoiding "${m}"`).join("; ")}. Estimated time: ${Math.round(gapNode.estimatedLearningTimeMinutes * 0.4)} minutes for the core explanation.`,
    },
    {
      step:        "practice",
      conceptId:   gapNode.id,
      conceptName: gapNode.concept,
      completed:   false,
      content:     `Give the student these 3 practice questions on "${gapNode.concept}". Provide hints if needed but track hint usage.`,
      questions:   getPracticeQuestions(gapNode.id, gapNode),
    },
    {
      step:        "verify",
      conceptId:   gapNode.id,
      conceptName: gapNode.concept,
      completed:   false,
      content:     `Verification check: 2 questions to confirm "${gapNode.concept}" is now solid. No hints. Student must answer both correctly to pass.`,
      questions:   getVerificationQuestions(gapNode.id, gapNode),
    },
    {
      step:        "return",
      conceptId:   opts.originConceptId,
      conceptName: originNode.concept,
      completed:   false,
      content:     `Return to "${originNode.concept}". Bridge back explicitly: "Now that we've sorted out ${gapNode.concept}, let's revisit the original problem." Use the same question the student was failing before.`,
    },
  ];

  const existing = getAll().filter((p) => p.targetGap.concept.id === gapNode.id && !p.masteryAtEnd);
  const attempts = existing.length + 1;

  const plan: RemediationPlan = {
    planId:           `remed-${Date.now().toString(36)}`,
    originConceptId:  opts.originConceptId,
    originConceptName: originNode.concept,
    targetGap:        gap,
    steps,
    currentStepIndex: 0,
    currentStep:      "teach",
    masteryAtStart:   gap.masteryScore,
    status:           "active",
    attempts,
    teachingStrategy: strategy,
    createdAt:        Date.now(),
    updatedAt:        Date.now(),
  };

  const all = getAll();
  all.push(plan);
  if (all.length > 30) all.splice(0, all.length - 30);
  lsWrite(all);
  return plan;
}

/** Advance the plan to the next step. */
export function advanceRemediationStep(
  planId:     string,
  masteryEnd?: number,
): RemediationPlan | null {
  const all  = getAll();
  const plan = all.find((p) => p.planId === planId);
  if (!plan) return null;

  // Mark current step complete
  const currentDetail = plan.steps[plan.currentStepIndex];
  if (currentDetail) {
    currentDetail.completed    = true;
    currentDetail.completedAt  = Date.now();
    if (masteryEnd !== undefined) currentDetail.masteryAtEnd = masteryEnd;
  }

  plan.currentStepIndex++;

  if (plan.currentStepIndex >= plan.steps.length) {
    plan.currentStep  = "complete";
    plan.status       = "complete";
    plan.masteryAtEnd = masteryEnd;
  } else {
    plan.currentStep = plan.steps[plan.currentStepIndex].step;
    plan.steps[plan.currentStepIndex].startedAt = Date.now();
  }

  plan.updatedAt = Date.now();
  lsWrite(all);
  return plan;
}

export function abandonRemediationPlan(planId: string): void {
  const all  = getAll();
  const plan = all.find((p) => p.planId === planId);
  if (plan) { plan.status = "abandoned"; plan.currentStep = "abandoned"; plan.updatedAt = Date.now(); lsWrite(all); }
}

export function getActivePlan(originConceptId?: string): RemediationPlan | null {
  return getAll().find(
    (p) => p.status === "active" && (!originConceptId || p.originConceptId === originConceptId),
  ) ?? null;
}

export function getAllPlans(): RemediationPlan[] { return getAll(); }

export function getRemediationStats(): {
  total: number; completed: number; abandoned: number; successRate: number;
  avgStepsCompleted: number;
} {
  const all       = getAll();
  const completed = all.filter((p) => p.status === "complete").length;
  const abandoned = all.filter((p) => p.status === "abandoned").length;
  const avgSteps  = all.length
    ? all.reduce((s, p) => s + p.steps.filter((st) => st.completed).length, 0) / all.length
    : 0;
  return {
    total: all.length, completed, abandoned,
    successRate: all.length ? Math.round((completed / all.length) * 100) : 0,
    avgStepsCompleted: Math.round(avgSteps * 10) / 10,
  };
}
