/**
 * Reasoning Analyzer — understands HOW the student thinks, not just WHAT they answer.
 *
 * Identifies the student's dominant reasoning style from their written answers:
 *
 *  - Forward reasoning:   "I know A, so B, so C" (given → find)
 *  - Backward reasoning:  "I need C, which needs B, which needs A" (goal-directed)
 *  - Example-based:       "This is like the problem where..." (analogical)
 *  - Rule-based:          "The rule says X, so apply X" (algorithmic)
 *  - Intuitive:           "I think it's Y because it feels right" (no explicit justification)
 *  - Exhaustive:          "Let me try all possibilities" (trial and error)
 *
 * Also detects reasoning GAPS:
 *  - Missing justification (assertion without reason)
 *  - Circular reasoning ("it is X because it is X")
 *  - Leaps (skipped intermediate steps)
 *  - Reversal (confuses cause and effect)
 *
 * Firestore path: students/{id}/reasoningProfile
 */

const KEY = "studyai-v1-reasoning-profile";

export type ReasoningStyle =
  | "forward"     // deductive: derives answer from given facts
  | "backward"    // goal-directed: works from desired answer back
  | "analogical"  // maps to a known example
  | "rule_based"  // identifies and applies a rule algorithmically
  | "intuitive"   // gives answer with weak or no justification
  | "exhaustive"  // trial and error
  | "mixed";      // adapts style to situation

export type ReasoningGap =
  | "missing_justification"   // states conclusion without reason
  | "circular"                // uses conclusion as its own reason
  | "step_leap"               // skips intermediate steps
  | "causal_reversal"         // confuses cause and effect
  | "incomplete_chain"        // starts reasoning but trails off
  | "irrelevant_info";        // introduces off-topic reasoning

export interface ReasoningSignal {
  signalId:    string;
  style:       ReasoningStyle;
  gaps:        ReasoningGap[];
  rawText:     string;          // student's actual answer
  topic:       string;
  subject:     string;
  timestamp:   number;
}

export interface ReasoningProfile {
  dominantStyle:     ReasoningStyle;
  styleScores:       Record<ReasoningStyle, number>;  // cumulative signal counts
  frequentGaps:      ReasoningGap[];
  avgJustificationLength: number;    // words in reasoning explanations
  canChainSteps:     boolean;        // student links multiple steps together
  usesConditionals:  boolean;        // "if…then…" reasoning present
  selfCorrectsOften: boolean;        // student corrects themselves mid-answer
  totalSignals:      number;
  updatedAt:         number;
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT_PROFILE: ReasoningProfile = {
  dominantStyle: "mixed",
  styleScores: { forward: 0, backward: 0, analogical: 0, rule_based: 0, intuitive: 0, exhaustive: 0, mixed: 0 },
  frequentGaps: [],
  avgJustificationLength: 0,
  canChainSteps: false,
  usesConditionals: false,
  selfCorrectsOften: false,
  totalSignals: 0,
  updatedAt: Date.now(),
};

export function getReasoningProfile(): ReasoningProfile {
  return lsRead<ReasoningProfile>(KEY, DEFAULT_PROFILE);
}

// ── Text analysis (heuristic, no AI needed) ───────────────────────────────────

/** Analyse a student's written answer and extract reasoning signals. */
export function analyseAnswer(opts: {
  answer:  string;
  topic:   string;
  subject: string;
}): ReasoningSignal {
  const { answer, topic, subject } = opts;
  const a     = answer.trim();
  const lower = a.toLowerCase();
  const words = a.split(/\s+/).length;

  // ── Style detection ────────────────────────────────────────────────────────
  let style: ReasoningStyle = "intuitive";

  const forwardPatterns    = /so |therefore |thus |which means |this gives |we get |then |hence /i;
  const backwardPatterns   = /need |require |to find |so i need |first i need |in order to /i;
  const analogyPatterns    = /like |similar to |same as |reminds me |just like |think of it as /i;
  const rulePatterns       = /formula|rule|theorem|law|equation|apply |using |by |according to /i;
  const exhaustivePatterns = /let me try|if .* then|what if|suppose |maybe |perhaps /i;

  const fwd  = forwardPatterns.test(lower);
  const bwd  = backwardPatterns.test(lower);
  const anl  = analogyPatterns.test(lower);
  const rul  = rulePatterns.test(lower);
  const exh  = exhaustivePatterns.test(lower);

  const count = [fwd, bwd, anl, rul, exh].filter(Boolean).length;
  if (count >= 2)       style = "mixed";
  else if (fwd)         style = "forward";
  else if (bwd)         style = "backward";
  else if (anl)         style = "analogical";
  else if (rul)         style = "rule_based";
  else if (exh)         style = "exhaustive";

  // ── Gap detection ──────────────────────────────────────────────────────────
  const gaps: ReasoningGap[] = [];

  if (words < 5)                                              gaps.push("missing_justification");
  if (/because.{0,30}(it is|is just|always is)/i.test(lower)) gaps.push("circular");
  if (!fwd && !bwd && words > 10)                             gaps.push("incomplete_chain");
  if (/because.{0,20}(effect|result|outcome)/i.test(lower))  gaps.push("causal_reversal");
  if (/also |additionally |furthermore |moreover /i.test(lower) && !rul) gaps.push("irrelevant_info");

  // ── Linguistic markers ─────────────────────────────────────────────────────
  const canChain        = /first.{0,40}then.{0,40}(finally|lastly|so)/i.test(lower);
  const usesConditionals = /if.{0,40}then/i.test(lower);
  const selfCorrects    = /actually|wait|no,|correction|i mean/i.test(lower);

  const signal: ReasoningSignal = {
    signalId:  `rs-${Date.now().toString(36)}`,
    style, gaps, rawText: a, topic, subject,
    timestamp: Date.now(),
  };

  _updateProfile(signal, words, canChain, usesConditionals, selfCorrects);
  return signal;
}

function _updateProfile(
  signal: ReasoningSignal,
  wordCount: number,
  canChain: boolean,
  usesConditionals: boolean,
  selfCorrects: boolean,
): void {
  const p = getReasoningProfile();
  const n = p.totalSignals;

  p.styleScores[signal.style] = (p.styleScores[signal.style] ?? 0) + 1;

  // Dominant style
  const maxStyle = Object.entries(p.styleScores).sort(([, a], [, b]) => b - a)[0];
  p.dominantStyle = (maxStyle?.[0] ?? "mixed") as ReasoningStyle;

  // Frequent gaps (appear > 30% of the time)
  const gapCounts = lsRead<Record<string, number>>("studyai-v1-reasoning-gaps", {});
  for (const gap of signal.gaps) gapCounts[gap] = (gapCounts[gap] ?? 0) + 1;
  localStorage.setItem("studyai-v1-reasoning-gaps", JSON.stringify(gapCounts));
  p.frequentGaps = Object.entries(gapCounts)
    .filter(([, c]) => c / Math.max(1, n) >= 0.3)
    .map(([g]) => g as ReasoningGap);

  p.avgJustificationLength = Math.round((p.avgJustificationLength * n + wordCount) / (n + 1));
  p.canChainSteps   = canChain   || p.canChainSteps;
  p.usesConditionals = usesConditionals || p.usesConditionals;
  p.selfCorrectsOften = (p.selfCorrectsOften && n > 5) || (selfCorrects && n > 3);

  p.totalSignals = n + 1;
  p.updatedAt = Date.now();
  lsWrite(p);
}

/** Plain-English description of how this student reasons. */
export function describeReasoningStyle(): string {
  const p = getReasoningProfile();
  const descriptions: Record<ReasoningStyle, string> = {
    forward:    "thinks deductively — derives answers step by step from what is given",
    backward:   "works goal-directed — starts from the answer and reasons backward",
    analogical: "reasons by analogy — connects new problems to familiar examples",
    rule_based: "algorithmic thinker — identifies and applies formulas systematically",
    intuitive:  "relies on intuition — often gets the right answer without explicit reasoning",
    exhaustive: "trial-and-error thinker — tests possibilities until one fits",
    mixed:      "flexible reasoner — adapts their approach to the problem",
  };
  return descriptions[p.dominantStyle];
}

/** Coaching advice for the tutor based on reasoning profile. */
export function getReasoningCoachingHint(): string {
  const p = getReasoningProfile();
  if (p.frequentGaps.includes("missing_justification"))
    return "Always ask this student to explain their reasoning, not just state an answer.";
  if (p.frequentGaps.includes("step_leap"))
    return "Encourage this student to write out every intermediate step explicitly.";
  if (p.dominantStyle === "intuitive")
    return "Challenge intuitive answers with 'Why does that work?' to build explicit reasoning.";
  if (p.dominantStyle === "rule_based" && !p.canChainSteps)
    return "Student applies formulas but struggles to chain multi-step reasoning. Use scaffolded multi-step examples.";
  return "Ask the student to explain their reasoning as if teaching a classmate.";
}
