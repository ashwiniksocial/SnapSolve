/**
 * Prerequisite Recovery — targeted recovery plans for foundational gaps.
 *
 * When a student can't progress because a prerequisite is missing,
 * this engine builds a micro-lesson recovery sequence:
 *
 *   Step 1: Mini-assessment (3 quick questions to confirm the gap)
 *   Step 2: Targeted explanation (focused only on the gap, not the whole topic)
 *   Step 3: Guided practice (2–3 problems at the gap level)
 *   Step 4: Confidence check (student self-reports readiness)
 *   Step 5: Re-assessment (confirm gap is closed before returning to main topic)
 *
 * Recovery tracks:
 *  - How many attempts before the prerequisite was recovered
 *  - Which explanation strategy worked
 *  - Whether recovery held over time (re-tested in next session)
 *
 * Firestore path: students/{id}/prerequisiteRecoveries
 */

import { getKnowledgeGapReport } from "../studentModel/knowledgeGapEngine";

const KEY = "studyai-v1-prereq-recoveries";

export type RecoveryStep =
  | "mini_assessment"      // confirm the gap exists
  | "targeted_explanation" // reteach only the prerequisite
  | "guided_practice"      // 2–3 problems at prerequisite level
  | "confidence_check"     // student self-reports readiness
  | "reassessment"         // confirm gap is closed
  | "completed"            // recovery successful
  | "abandoned";           // student gave up

export interface RecoveryPlan {
  planId:              string;
  prerequisiteTopic:   string;
  prerequisiteSubject: string;
  blockedTopic:        string;   // the topic the student was trying to learn
  masteryAtStart:      number;
  masteryAtEnd?:       number;

  currentStep:         RecoveryStep;
  stepsCompleted:      RecoveryStep[];

  // Step content
  miniAssessmentQuestions: string[];   // 3 quick diagnostic questions
  explanationApproach:     string;     // which teaching strategy was used
  practiceQuestions:       string[];   // curated practice problems
  confidenceScore?:        number;     // 1–5, student self-report

  attempts:            number;    // how many recovery attempts for this prereq
  successfulRecovery:  boolean;
  recoveryDurationMs?: number;

  createdAt:  number;
  updatedAt:  number;
}

// ── Prerequisite dependency map ───────────────────────────────────────────────
// topic → its prerequisites (what you need to know first)

const PREREQUISITE_MAP: Record<string, string[]> = {
  // Mathematics
  "Quadratic Equations":   ["Algebra", "Factorisation", "Fractions"],
  "Trigonometry":          ["Geometry", "Pythagoras' Theorem", "Ratios"],
  "Logarithms":            ["Exponents", "Algebra"],
  "Calculus":              ["Algebra", "Trigonometry", "Graphs"],
  "Probability":           ["Fractions", "Ratios", "Basic Counting"],
  "Permutation and Combination": ["Probability", "Factorials"],
  "Matrices":              ["Algebra", "Systems of Equations"],
  "Vectors":               ["Trigonometry", "Coordinate Geometry"],
  "Differentiation":       ["Algebra", "Limits", "Functions"],
  "Integration":           ["Differentiation", "Algebra"],
  // Physics
  "Newton's Laws":         ["Basic Algebra", "Force Concepts"],
  "Work and Energy":       ["Newton's Laws", "Vectors"],
  "Electric Current":      ["Basic Algebra", "Ohm's Law"],
  "Electromagnetic Induction": ["Electric Current", "Magnetic Fields"],
  "Wave Optics":           ["Wave Motion", "Refraction"],
  // Chemistry
  "Electrochemistry":      ["Redox Reactions", "Electric Current"],
  "Chemical Equilibrium":  ["Acids and Bases", "Reaction Rates"],
  "Organic Chemistry":     ["Atomic Structure", "Chemical Bonding"],
};

// ── Quick diagnostic questions per topic ──────────────────────────────────────

const DIAGNOSTIC_QUESTIONS: Record<string, string[]> = {
  "Algebra":    ["Solve: 2x + 5 = 11", "Simplify: 3(x + 2) − x", "What does it mean to 'solve for x'?"],
  "Fractions":  ["What is ½ + ¼?", "Simplify 6/9 to its lowest form.", "What does the denominator represent?"],
  "Exponents":  ["What is 2³?", "Simplify: x² × x³", "What does a negative exponent mean?"],
  "Geometry":   ["Name the angles in a right triangle.", "What is the sum of angles in a triangle?", "What makes two triangles congruent?"],
  "Pythagoras' Theorem": ["State Pythagoras' theorem.", "In a right triangle with sides 3 and 4, find the hypotenuse.", "Which side is the hypotenuse?"],
  "Ratios":     ["Write 3:5 as a fraction.", "If a ratio is 2:3 and the total is 25, find each part.", "Simplify the ratio 12:8."],
  "Force Concepts": ["What is the unit of force?", "Define acceleration.", "State Newton's First Law in your own words."],
};

function getDiagnosticQuestions(topic: string): string[] {
  const exact = DIAGNOSTIC_QUESTIONS[topic];
  if (exact) return exact;
  // Generic fallback
  return [
    `Define ${topic} in one sentence.`,
    `Give one real-world example of ${topic}.`,
    `What formula or rule is central to ${topic}?`,
  ];
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

function getAll(): RecoveryPlan[] {
  return lsRead<RecoveryPlan[]>(KEY, []);
}

// ── Core API ──────────────────────────────────────────────────────────────────

/** Identify which prerequisites are missing for a given topic. */
export function getMissingPrerequisites(topic: string, subject: string): Array<{ topic: string; subject: string }> {
  const prereqs = PREREQUISITE_MAP[topic] ?? [];
  const gapReport = getKnowledgeGapReport();
  const gapTopics = new Set(gapReport.gaps.filter((g) => !g.resolved).map((g) => g.topic));

  return prereqs
    .filter((p) => gapTopics.has(p))
    .map((p) => ({ topic: p, subject }));
}

/** Create a recovery plan for a specific prerequisite gap. */
export function createRecoveryPlan(opts: {
  prerequisiteTopic:   string;
  prerequisiteSubject: string;
  blockedTopic:        string;
  masteryAtStart:      number;
}): RecoveryPlan {
  const all = getAll();
  const existing = all.find(
    (p) => p.prerequisiteTopic === opts.prerequisiteTopic
      && p.prerequisiteSubject === opts.prerequisiteSubject
      && !p.successfulRecovery
  );

  if (existing) {
    existing.attempts++;
    existing.updatedAt = Date.now();
    lsWrite(all);
    return existing;
  }

  const plan: RecoveryPlan = {
    planId:              `rp-${Date.now().toString(36)}`,
    prerequisiteTopic:   opts.prerequisiteTopic,
    prerequisiteSubject: opts.prerequisiteSubject,
    blockedTopic:        opts.blockedTopic,
    masteryAtStart:      opts.masteryAtStart,
    currentStep:         "mini_assessment",
    stepsCompleted:      [],
    miniAssessmentQuestions: getDiagnosticQuestions(opts.prerequisiteTopic),
    explanationApproach: "scaffolding",
    practiceQuestions:   _generatePracticeQuestions(opts.prerequisiteTopic),
    attempts:            1,
    successfulRecovery:  false,
    createdAt:           Date.now(),
    updatedAt:           Date.now(),
  };

  all.push(plan);
  if (all.length > 50) all.splice(0, all.length - 50);
  lsWrite(all);
  return plan;
}

function _generatePracticeQuestions(topic: string): string[] {
  const banks: Record<string, string[]> = {
    "Algebra":   ["Solve: 3x − 7 = 8", "Expand: (x + 3)(x − 2)", "If y = 2x + 1, find y when x = 4"],
    "Fractions": ["Calculate: ⅔ × ¾", "Divide: 5/6 ÷ 2/3", "Add: 1/3 + 2/5"],
    "Exponents": ["Evaluate: 3⁴", "Simplify: (2x)³", "Solve: 2ˣ = 32"],
  };
  return banks[topic] ?? [
    `Solve a basic ${topic} problem.`,
    `Apply ${topic} to a straightforward example.`,
    `Identify and correct this ${topic} mistake: [student will fill this in].`,
  ];
}

/** Advance recovery plan to the next step. */
export function advanceRecoveryStep(planId: string, newStep: RecoveryStep): RecoveryPlan | null {
  const all = getAll();
  const plan = all.find((p) => p.planId === planId);
  if (!plan) return null;

  plan.stepsCompleted.push(plan.currentStep);
  plan.currentStep = newStep;

  if (newStep === "completed") {
    plan.successfulRecovery = true;
    plan.recoveryDurationMs = Date.now() - plan.createdAt;
  }

  plan.updatedAt = Date.now();
  lsWrite(all);
  return plan;
}

export function recordConfidenceScore(planId: string, score: number): void {
  const all = getAll();
  const plan = all.find((p) => p.planId === planId);
  if (plan) { plan.confidenceScore = score; plan.updatedAt = Date.now(); lsWrite(all); }
}

export function getActiveRecoveryPlan(topic?: string): RecoveryPlan | null {
  return getAll().find((p) => !p.successfulRecovery && p.currentStep !== "abandoned"
    && (!topic || p.prerequisiteTopic === topic)) ?? null;
}

export function getRecoveryStats(): { total: number; successful: number; avgAttempts: number } {
  const all = getAll();
  const successful = all.filter((p) => p.successfulRecovery).length;
  const avgAttempts = all.length ? all.reduce((s, p) => s + p.attempts, 0) / all.length : 0;
  return { total: all.length, successful, avgAttempts: Math.round(avgAttempts * 10) / 10 };
}

/** Prerequisite chain for a topic (what needs to be learned in order). */
export function getPrerequisiteChain(topic: string): string[] {
  const visited = new Set<string>();
  const chain: string[] = [];
  function walk(t: string) {
    if (visited.has(t)) return;
    visited.add(t);
    const prereqs = PREREQUISITE_MAP[t] ?? [];
    for (const p of prereqs) walk(p);
    chain.push(t);
  }
  walk(topic);
  return chain.slice(0, -1); // exclude the topic itself
}
