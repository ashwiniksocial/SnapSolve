/**
 * Cognitive Load Engine — monitors and manages the student's mental bandwidth.
 *
 * Based on Sweller's Cognitive Load Theory:
 *  - Intrinsic load:   inherent complexity of the topic (fixed)
 *  - Extraneous load:  unnecessary complexity from poor presentation (reducible)
 *  - Germane load:     productive mental effort that builds schemas (desirable)
 *
 * Signals of overload detected from behaviour:
 *  - Hint escalation to level 3+ quickly (< 60 s after question)
 *  - Multiple wrong answers on the same question
 *  - Session duration approaching / exceeding attention span
 *  - Abandonment pattern (< 10 s sessions)
 *  - Rapidly switching explanation depths
 *
 * Outputs:
 *  - Current load estimate (low / moderate / high / overloaded)
 *  - Recommended intervention (simplify / break / chunk / reassure)
 *
 * Firestore path: students/{id}/cognitiveLoadHistory
 */

import { getEnrichedProfile } from "../studentModel/studentProfileEngine";
import { getBehaviorSignals }  from "../studentModel/behaviorEngine";

const KEY = "studyai-v1-cognitive-load";

export type LoadLevel = "low" | "moderate" | "high" | "overloaded";

export type Intervention =
  | "continue"            // load is fine, keep going
  | "simplify_language"   // reduce jargon and sentence length
  | "chunk_content"       // break topic into smaller pieces
  | "take_break"          // recommend a short rest
  | "reduce_difficulty"   // lower Bloom's level temporarily
  | "use_analogy"         // shift to concrete example
  | "offer_worked_example"// show a fully worked example
  | "affirm_and_reset";   // reassure + fresh start

export interface LoadSnapshot {
  timestamp:     number;
  level:         LoadLevel;
  intrinsic:     number;   // 0–10, topic complexity
  extraneous:    number;   // 0–10, estimated unnecessary complexity
  germane:       number;   // 0–10, productive effort signal
  signals:       string[]; // human-readable load signals
  intervention:  Intervention;
}

export interface CognitiveLoadProfile {
  snapshots:          LoadSnapshot[];
  currentLevel:       LoadLevel;
  avgLoad:            number;          // 0–10
  peakLoadTimestamp:  number;
  overloadEvents:     number;
  preferredChunkSize: number;          // estimated items student can hold at once (2–7)
  updatedAt:          number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getCognitiveLoadProfile(): CognitiveLoadProfile {
  return lsRead<CognitiveLoadProfile>(KEY, {
    snapshots: [], currentLevel: "low", avgLoad: 3, peakLoadTimestamp: 0,
    overloadEvents: 0, preferredChunkSize: 4, updatedAt: Date.now(),
  });
}

/** Topic complexity estimate (0–10). Needs a topic name — heuristic only. */
function estimateIntrinsicLoad(topic: string): number {
  const HIGH_COMPLEXITY = [
    "integration", "differentiation", "vectors", "matrices", "complex numbers",
    "electrochemistry", "quantum", "thermodynamics", "electromagnetic", "optics",
    "trigonometry", "logarithm", "probability", "permutation", "combination",
  ];
  const MED_COMPLEXITY = [
    "algebra", "geometry", "polynomial", "equation", "circle", "triangle",
    "acids", "bases", "redox", "motion", "force", "energy", "electricity",
  ];
  const t = topic.toLowerCase();
  if (HIGH_COMPLEXITY.some((k) => t.includes(k))) return 8;
  if (MED_COMPLEXITY.some((k)  => t.includes(k))) return 5;
  return 3;
}

/**
 * Assess current cognitive load based on session behaviour.
 * Call periodically during a tutoring session.
 */
export function assessCognitiveLoad(opts: {
  topic:              string;
  sessionDurationMs:  number;
  wrongAnswersInRow:  number;
  hintLevelReached:   number;
  timeBeforeFirstHintMs: number;
  depthSwitches:      number;
}): LoadSnapshot {
  const profile   = getEnrichedProfile();
  const behavior  = getBehaviorSignals();

  const intrinsic  = estimateIntrinsicLoad(opts.topic);
  const signals: string[] = [];
  let extraneous   = 0;
  let germane      = 5; // start positive

  // ── Extraneous load signals ────────────────────────────────────────────────
  if (opts.wrongAnswersInRow >= 3) {
    extraneous += 3;
    signals.push("3+ consecutive wrong answers — likely confused by explanation style");
  }
  if (opts.hintLevelReached >= 3 && opts.timeBeforeFirstHintMs < 30_000) {
    extraneous += 2;
    signals.push("High hints requested quickly — explanation may be too complex");
  }
  if (opts.depthSwitches >= 2) {
    extraneous += 2;
    signals.push("Depth-level switching — explanation depth mismatched");
  }
  if (behavior.abandonmentCount >= 2) {
    extraneous += 2;
    signals.push("Past abandonment history — student has overwhelm risk");
  }

  // ── Session duration vs attention span ────────────────────────────────────
  const spanMs = profile.attentionSpanMinutes * 60_000;
  if (opts.sessionDurationMs > spanMs * 1.2) {
    extraneous += 3;
    signals.push("Session exceeding attention span — fatigue likely");
  } else if (opts.sessionDurationMs > spanMs * 0.8) {
    extraneous += 1;
    signals.push("Approaching attention limit — consider wrapping up soon");
  }

  // ── Germane load signals (positive) ───────────────────────────────────────
  if (opts.wrongAnswersInRow === 0) germane += 2;
  if (opts.hintLevelReached <= 1)   germane += 2;
  germane = Math.min(10, Math.max(0, germane));
  extraneous = Math.min(10, Math.max(0, extraneous));

  // ── Total load estimate ───────────────────────────────────────────────────
  const totalLoad = (intrinsic + extraneous) / 2 - germane * 0.3;
  let level: LoadLevel =
    totalLoad >= 8 ? "overloaded" :
    totalLoad >= 6 ? "high" :
    totalLoad >= 4 ? "moderate" : "low";

  // ── Intervention selection ────────────────────────────────────────────────
  let intervention: Intervention = "continue";
  if (level === "overloaded") {
    intervention = opts.sessionDurationMs > spanMs ? "take_break" : "affirm_and_reset";
  } else if (level === "high") {
    intervention = opts.hintLevelReached >= 3 ? "offer_worked_example"
      : opts.depthSwitches >= 2               ? "reduce_difficulty"
      : "chunk_content";
  } else if (level === "moderate") {
    intervention = extraneous > 4 ? "simplify_language" : "use_analogy";
  }

  const snapshot: LoadSnapshot = {
    timestamp: Date.now(), level,
    intrinsic: Math.round(intrinsic),
    extraneous: Math.round(extraneous),
    germane: Math.round(germane),
    signals, intervention,
  };

  _saveSnapshot(snapshot);
  return snapshot;
}

function _saveSnapshot(snap: LoadSnapshot): void {
  const prof = getCognitiveLoadProfile();
  prof.snapshots = [...prof.snapshots.slice(-29), snap];
  prof.currentLevel = snap.level;

  const loads = prof.snapshots.map((s) => s.intrinsic + s.extraneous);
  prof.avgLoad = Math.round(loads.reduce((a, b) => a + b, 0) / loads.length);

  if (snap.level === "overloaded") {
    prof.overloadEvents++;
    prof.peakLoadTimestamp = Date.now();
  }

  // Preferred chunk size: 7 - load pressure (Miller's Law adjusted)
  prof.preferredChunkSize = Math.max(2, Math.min(7, 7 - Math.round(snap.extraneous / 2)));
  prof.updatedAt = Date.now();
  lsWrite(prof);
}

/** Human-readable intervention advice for the tutor to display. */
export function getInterventionMessage(intervention: Intervention): string {
  const messages: Record<Intervention, string> = {
    continue:             "Keep going — the student is managing well.",
    simplify_language:    "Use shorter sentences. Avoid jargon. One idea per sentence.",
    chunk_content:        "Break this into smaller parts. Teach one sub-concept before moving to the next.",
    take_break:           "Recommend a short pause — even 2 minutes away from the screen helps consolidation.",
    reduce_difficulty:    "Drop back to a simpler version of this question. Build confidence before scaling up.",
    use_analogy:          "Introduce a concrete analogy before returning to the abstract.",
    offer_worked_example: "Show a fully worked example, narrating each step. Then ask them to identify the pattern.",
    affirm_and_reset:     "Acknowledge the difficulty explicitly, praise effort, and start fresh with a simpler entry point.",
  };
  return messages[intervention];
}

export function isOverloaded(): boolean {
  return getCognitiveLoadProfile().currentLevel === "overloaded";
}
