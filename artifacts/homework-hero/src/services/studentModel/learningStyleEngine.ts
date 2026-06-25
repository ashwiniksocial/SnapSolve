/**
 * Learning Style Engine — derives HOW this student learns best.
 *
 * Detects 5 learning dimensions from cumulative behaviour signals:
 *
 *  1. Visual vs verbal       (opens visual/mental-picture sections often?)
 *  2. Example-first vs rule-first (opens similarExample before steps?)
 *  3. Deep vs surface        (engages with deeperExplanation, conceptualQuestions?)
 *  4. Active vs passive      (attempts practice questions / learning loop?)
 *  5. Reflective vs impulsive (reads learningSummary, memoryShortcut?)
 *
 * Each dimension is a score 0–100. The tutor uses this to decide which
 * sections to highlight and which AI content to emphasise.
 *
 * Firestore path: students/{id}/learningStyle
 */

import { getBehaviorSignals } from "./behaviorEngine";

const KEY = "studyai-v1-learning-style";

export interface LearningStyleProfile {
  // Dimension scores 0–100
  visualScore:      number;   // high = learns better with pictures/analogies
  exampleScore:     number;   // high = needs worked example before abstract rules
  depthScore:       number;   // high = wants the "why" behind everything
  activeScore:      number;   // high = engages with practice, not just reading
  reflectiveScore:  number;   // high = reads summaries, memory tricks

  // Derived primary style label (most dominant dimension)
  primaryStyle: "visual" | "example-first" | "conceptual" | "active" | "reflective" | "balanced";

  // Recommended section order for this student (highest value sections first)
  recommendedSectionOrder: string[];

  // Which sections the AI should always include/expand for this student
  mustIncludeSections: string[];

  sessionsAnalysed: number;
  updatedAt: number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT_STYLE: LearningStyleProfile = {
  visualScore: 50, exampleScore: 50, depthScore: 50, activeScore: 50, reflectiveScore: 50,
  primaryStyle: "balanced",
  recommendedSectionOrder: ["concept", "steps", "example", "practice", "memory"],
  mustIncludeSections: [],
  sessionsAnalysed: 0, updatedAt: Date.now(),
};

export function getLearningStyle(): LearningStyleProfile {
  return lsRead<LearningStyleProfile>(KEY, DEFAULT_STYLE);
}

/**
 * Recompute learning style from current section engagement data.
 * Call after each session (or lazily on demand).
 */
export function recomputeLearningStyle(): LearningStyleProfile {
  const b = getBehaviorSignals();
  const sigs = b.sectionSignals;
  const n = b.totalSessionsTracked;
  if (n < 2) {
    lsWrite(DEFAULT_STYLE);
    return DEFAULT_STYLE;
  }

  function opens(key: string): number { return sigs[key]?.totalOpens ?? 0; }
  function rate(key: string): number { return opens(key) / n; }

  // Visual: opens visual / visualThinking section
  const visualScore = Math.min(100, Math.round(rate("visual") * 200));

  // Example-first: opens similar example
  const exampleScore = Math.min(100, Math.round(rate("example") * 200));

  // Depth: opens deeperExplanation, conceptualQuestions
  const depthScore = Math.min(100, Math.round(
    (rate("deeper") + rate("conceptual")) * 100
  ));

  // Active: opens practice / learning loop
  const activeScore = Math.min(100, Math.round(b.practiceAttemptRate * 100));

  // Reflective: reads summary / memory
  const reflectiveScore = Math.min(100, Math.round(
    (b.summaryReadRate + b.memoryReadRate) * 50
  ));

  // Primary style: whichever dimension scores highest
  const scores: Array<[keyof Omit<LearningStyleProfile, "primaryStyle" | "recommendedSectionOrder" | "mustIncludeSections" | "sessionsAnalysed" | "updatedAt">, LearningStyleProfile["primaryStyle"]]> = [
    ["visualScore",     "visual"],
    ["exampleScore",    "example-first"],
    ["depthScore",      "conceptual"],
    ["activeScore",     "active"],
    ["reflectiveScore", "reflective"],
  ];
  const vals: Record<string, number> = { visualScore, exampleScore, depthScore, activeScore, reflectiveScore };
  const maxKey = scores.reduce((a, b) => vals[a[0]] >= vals[b[0]] ? a : b)[0];
  const maxVal = vals[maxKey];
  const primaryStyle: LearningStyleProfile["primaryStyle"] = maxVal >= 60
    ? (scores.find(([k]) => k === maxKey)?.[1] ?? "balanced")
    : "balanced";

  // Recommended section order: sort by engagement rate descending
  const sectionRates: [string, number][] = [
    ["concept",     rate("concept")],
    ["steps",       rate("steps")],
    ["visual",      rate("visual")],
    ["example",     rate("example")],
    ["practice",    rate("practice")],
    ["memory",      rate("memory")],
    ["summary",     rate("summary")],
    ["mistakes",    rate("mistakes")],
    ["conceptual",  rate("conceptual")],
    ["deeper",      rate("deeper")],
  ];
  const recommendedSectionOrder = sectionRates
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  // Must-include: sections with high engagement (rate ≥ 0.6)
  const mustIncludeSections = sectionRates
    .filter(([, r]) => r >= 0.6)
    .map(([k]) => k);

  const profile: LearningStyleProfile = {
    visualScore, exampleScore, depthScore, activeScore, reflectiveScore,
    primaryStyle,
    recommendedSectionOrder,
    mustIncludeSections,
    sessionsAnalysed: n,
    updatedAt: Date.now(),
  };

  lsWrite(profile);
  return profile;
}

/** Plain-English description of the student's learning style (for UI + AI prompt). */
export function describeLearningStyle(): string {
  const s = getLearningStyle();
  const parts: string[] = [];
  if (s.visualScore >= 60)     parts.push("learns best with visual mental pictures");
  if (s.exampleScore >= 60)    parts.push("needs a worked example before abstract rules");
  if (s.depthScore >= 60)      parts.push("wants to understand the WHY behind every step");
  if (s.activeScore >= 60)     parts.push("actively attempts practice questions");
  if (s.reflectiveScore >= 60) parts.push("reads summaries and memory tricks");
  if (!parts.length) return "balanced learner — adapts to any explanation style";
  return parts.join(", ");
}
