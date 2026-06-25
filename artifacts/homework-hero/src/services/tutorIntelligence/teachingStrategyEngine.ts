/**
 * Teaching Strategy Engine — selects the optimal pedagogical approach.
 *
 * Strategies (from learning science research):
 *  1. direct_instruction   — explicit, structured explanation (works for novices)
 *  2. scaffolding          — temporary support that is gradually removed
 *  3. socratic_questioning — guide through questions, don't tell (works for mid-mastery)
 *  4. worked_example       — model the full solution, then ask them to reproduce
 *  5. analogical_transfer  — use a familiar domain to illuminate the unfamiliar
 *  6. spaced_retrieval     — test memory across growing time intervals
 *  7. error_analysis       — learn from mistakes explicitly (high-mastery)
 *  8. peer_explanation     — ask student to "teach it back" (consolidation)
 *  9. interleaving         — mix problem types to strengthen discrimination
 * 10. desirable_difficulty — make the task harder than comfortable (challenge mode)
 *
 * Selection is based on:
 *  - Mastery level (0–100)
 *  - Cognitive load (low / moderate / high / overloaded)
 *  - Learning style (from learningStyleEngine)
 *  - Dominant reasoning style (from reasoningAnalyzer)
 *  - Recent performance pattern (improving / stable / declining)
 *
 * Firestore path: students/{id}/teachingStrategy
 */

import { getLearningStyle }      from "../studentModel/learningStyleEngine";
import { getReasoningProfile }   from "./reasoningAnalyzer";
import { getCognitiveLoadProfile } from "./cognitiveLoadEngine";
import { getMasterySnapshot }    from "../studentModel/masteryEngine";

export type TeachingStrategy =
  | "direct_instruction"
  | "scaffolding"
  | "socratic_questioning"
  | "worked_example"
  | "analogical_transfer"
  | "spaced_retrieval"
  | "error_analysis"
  | "peer_explanation"
  | "interleaving"
  | "desirable_difficulty";

export interface StrategyRecommendation {
  strategy:       TeachingStrategy;
  confidence:     number;         // 0–100, how certain we are this is the right choice
  reason:         string;         // plain-English rationale
  duration:       "short" | "medium" | "long";   // approximate time commitment
  aiInstruction:  string;         // instruction snippet for the AI prompt
  alternates:     TeachingStrategy[];             // fallback strategies
}

export interface StrategyHistory {
  records:           Array<{ strategy: TeachingStrategy; topic: string; effectiveScore: number; timestamp: number }>;
  effectiveStrategies: Partial<Record<TeachingStrategy, number>>; // strategy → avg effectiveness
  preferredStrategy: TeachingStrategy | null;
}

const KEY = "studyai-v1-strategy-history";

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getStrategyHistory(): StrategyHistory {
  return lsRead<StrategyHistory>(KEY, { records: [], effectiveStrategies: {}, preferredStrategy: null });
}

export function recordStrategyEffectiveness(
  strategy: TeachingStrategy,
  topic: string,
  effectiveScore: number  // 0–100: did it work?
): void {
  const h = getStrategyHistory();
  h.records = [...h.records.slice(-49), { strategy, topic, effectiveScore, timestamp: Date.now() }];

  const grouped: Partial<Record<TeachingStrategy, number[]>> = {};
  for (const r of h.records) {
    if (!grouped[r.strategy]) grouped[r.strategy] = [];
    grouped[r.strategy]!.push(r.effectiveScore);
  }
  for (const [s, scores] of Object.entries(grouped)) {
    h.effectiveStrategies[s as TeachingStrategy] =
      Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  const best = Object.entries(h.effectiveStrategies).sort(([, a], [, b]) => b - a)[0];
  h.preferredStrategy = (best?.[0] as TeachingStrategy) ?? null;
  lsWrite(h);
}

/** Select the optimal teaching strategy for this moment. */
export function selectStrategy(opts: {
  topic:   string;
  subject: string;
  mastery: number;
}): StrategyRecommendation {
  const { mastery } = opts;
  const style    = getLearningStyle();
  const reasoning = getReasoningProfile();
  const load     = getCognitiveLoadProfile();
  const snap     = getMasterySnapshot();
  const history  = getStrategyHistory();

  const topicProfile = Object.values(snap.profiles).find(
    (p) => p.topic === opts.topic && p.subject === opts.subject
  );
  const trend = topicProfile?.trend ?? "stable";

  // ── Core strategy selection matrix ────────────────────────────────────────

  // Overloaded → always simplify first
  if (load.currentLevel === "overloaded") {
    return _make("scaffolding", 85, "medium",
      "Student is cognitively overloaded — scaffold with small, manageable pieces.",
      ["direct_instruction", "worked_example"],
      "Break this into the smallest possible steps. Handle one micro-concept per exchange. Confirm understanding before moving forward.",
    );
  }

  // Very low mastery → direct instruction
  if (mastery < 30) {
    return _make("direct_instruction", 90, "medium",
      "Low mastery — student needs explicit structured explanation before Socratic probing.",
      ["worked_example", "analogical_transfer"],
      "Give a clear, structured explanation using simple language. Define all terms. Do not use Socratic questioning yet — the student lacks the foundation to answer meaningfully.",
    );
  }

  // Declining trend → error analysis
  if (trend === "declining" && mastery >= 40) {
    return _make("error_analysis", 80, "medium",
      "Declining mastery — focus on understanding what's going wrong.",
      ["direct_instruction", "scaffolding"],
      "Don't introduce new content. Instead, review a recent mistake together, identify exactly why it happened, and rebuild from that point.",
    );
  }

  // Example-first learner → worked example
  if (style.exampleScore >= 65 && mastery < 60) {
    return _make("worked_example", 80, "medium",
      "This student learns best from examples before abstract rules.",
      ["analogical_transfer", "scaffolding"],
      "Start with a fully worked example — narrate every step as you would to a classmate. Then ask the student to identify the pattern and apply it to a new problem.",
    );
  }

  // Good mastery but intuitive reasoner → Socratic questioning
  if (mastery >= 55 && reasoning.dominantStyle === "intuitive") {
    return _make("socratic_questioning", 85, "long",
      "Student relies on intuition — Socratic questioning will build explicit reasoning.",
      ["peer_explanation", "error_analysis"],
      "Never accept 'I just know it'. After every answer, ask: 'Why does that work?' Force the student to articulate their reasoning step by step.",
    );
  }

  // High mastery + rule-based reasoner → interleaving
  if (mastery >= 70 && reasoning.dominantStyle === "rule_based") {
    return _make("interleaving", 78, "long",
      "High mastery rule-based thinker — interleaving will improve discrimination.",
      ["desirable_difficulty", "peer_explanation"],
      "Mix this question type with related types so the student must actively identify which rule applies. Don't separate problems by topic.",
    );
  }

  // High mastery + improving → peer explanation
  if (mastery >= 75 && trend === "improving") {
    return _make("peer_explanation", 82, "medium",
      "Strong, improving student — 'teach it back' consolidates deep understanding.",
      ["desirable_difficulty", "interleaving"],
      "Ask the student to explain this concept as if teaching a younger student. Probe gaps in their explanation with follow-up questions.",
    );
  }

  // Visual learner → analogical transfer
  if (style.visualScore >= 65) {
    return _make("analogical_transfer", 75, "medium",
      "Visual learner — analogies and concrete mappings accelerate understanding.",
      ["worked_example", "scaffolding"],
      "Introduce a vivid, concrete analogy before returning to abstraction. Check the student understands where the analogy breaks down.",
    );
  }

  // Default: scaffolding for moderate mastery
  return _make("scaffolding", 70, "medium",
    "General scaffolding — guide step by step, removing support as confidence builds.",
    ["socratic_questioning", "worked_example"],
    "Provide structured guidance, breaking the problem into parts. After each step, pause and check understanding before moving on.",
  );
}

function _make(
  strategy: TeachingStrategy,
  confidence: number,
  duration: StrategyRecommendation["duration"],
  reason: string,
  alternates: TeachingStrategy[],
  aiInstruction: string,
): StrategyRecommendation {
  return { strategy, confidence, duration, reason, alternates, aiInstruction };
}

/** Plain label for display. */
export const STRATEGY_LABELS: Record<TeachingStrategy, string> = {
  direct_instruction:  "Direct Instruction",
  scaffolding:         "Scaffolding",
  socratic_questioning:"Socratic Questioning",
  worked_example:      "Worked Example",
  analogical_transfer: "Analogy",
  spaced_retrieval:    "Spaced Retrieval",
  error_analysis:      "Error Analysis",
  peer_explanation:    "Teach It Back",
  interleaving:        "Interleaved Practice",
  desirable_difficulty:"Challenge Mode",
};
