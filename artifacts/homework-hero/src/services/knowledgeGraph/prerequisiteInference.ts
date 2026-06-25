/**
 * Prerequisite Inference — walk backwards through the graph to find root causes.
 *
 * When a student repeatedly fails a concept, this engine:
 *  1. Walks backwards through the dependency graph
 *  2. Tests mastery at each ancestor node
 *  3. Identifies the FIRST (shallowest/earliest) missing prerequisite
 *  4. Quantifies the "prerequisite deficit" — how far back the gap is
 *  5. Ranks gaps by learning impact (which gap, if closed, unblocks the most)
 *
 * This is the diagnostic backbone for remediation planning.
 *
 * Firestore path: students/{id}/prerequisiteInferences
 */

import {
  getConceptById,
  getAllAncestors,
  topologicalSort,
} from "./knowledgeGraphEngine";
import { getMasteredConceptIds, getConceptMastery } from "./conceptMasteryEngine";
import { findFirstGap, prerequisiteReadiness, computeImpactScore } from "./dependencyEngine";
import type { ConceptNode } from "./conceptGraph";

export interface PrerequisiteGap {
  concept:           ConceptNode;
  masteryScore:      number;       // current (may be inferred/default)
  deficit:           number;       // how far below threshold (0–100)
  depth:             number;       // how many hops from the failing concept
  impactScore:       number;       // concepts unblocked if this gap is filled
  readiness:         number;       // 0–100: are ITS prerequisites met?
  isLearnable:       boolean;      // true if all its prereqs are mastered
}

export interface InferenceResult {
  targetConceptId:   string;
  targetConceptName: string;
  failureCount:      number;

  rootCause:         PrerequisiteGap | null;  // deepest / most foundational gap
  topGap:            PrerequisiteGap | null;  // highest-impact gap (repair this first)
  allGaps:           PrerequisiteGap[];       // every missing prerequisite, ranked

  prerequisiteReadiness: number;   // 0–100 overall readiness for the target
  recommendation:    string;       // plain-English action for the tutor
  inferredAt:        number;
}

// ── Core inference ────────────────────────────────────────────────────────────

/**
 * Run prerequisite inference for a concept the student is failing.
 * `failureCount` = how many times in a row they've answered incorrectly.
 */
export function inferPrerequisiteGaps(
  targetConceptId: string,
  failureCount:    number = 1,
): InferenceResult | null {
  const targetNode = getConceptById(targetConceptId);
  if (!targetNode) return null;

  const mastered = getMasteredConceptIds();
  const ancestors = getAllAncestors(targetConceptId);

  // Build gap list for every unmastered ancestor
  const gaps: PrerequisiteGap[] = [];

  for (const ancestor of ancestors) {
    if (mastered.has(ancestor.id)) continue;  // already mastered, skip

    const masteryEntry = getConceptMastery(ancestor.id);
    const masteryScore = masteryEntry?.masteryScore ?? 30;  // default prior
    const deficit      = Math.max(0, 70 - masteryScore);    // 70 is mastery threshold

    // Depth from target: count hops
    const depth = _hopsFromTarget(targetConceptId, ancestor.id);

    const impactScore = computeImpactScore(ancestor.id, mastered);
    const readiness   = prerequisiteReadiness(ancestor.id, mastered);
    const isLearnable = readiness === 100;

    gaps.push({
      concept:     ancestor,
      masteryScore,
      deficit,
      depth,
      impactScore,
      readiness,
      isLearnable,
    });
  }

  // Sort by depth ascending (shallowest = closest to target = most direct blocker)
  gaps.sort((a, b) => a.depth - b.depth || b.deficit - a.deficit);

  // Root cause = deepest learnable gap (earliest in the chain that has no unmet prereqs)
  const learnableGaps = gaps.filter((g) => g.isLearnable);
  const rootCause = learnableGaps.sort((a, b) => b.depth - a.depth)[0] ?? null;

  // Top gap = highest impact learnable gap
  const topGap = learnableGaps.sort((a, b) => b.impactScore - a.impactScore)[0] ?? null;

  const readiness = prerequisiteReadiness(targetConceptId, mastered);

  const recommendation = _buildRecommendation(
    targetNode, rootCause, topGap, gaps.length, readiness, failureCount,
  );

  return {
    targetConceptId,
    targetConceptName: targetNode.concept,
    failureCount,
    rootCause,
    topGap,
    allGaps: gaps,
    prerequisiteReadiness: readiness,
    recommendation,
    inferredAt: Date.now(),
  };
}

/** Count hops from `targetId` back to `ancestorId` via prerequisites. */
function _hopsFromTarget(targetId: string, ancestorId: string): number {
  // BFS backward from target
  const visited = new Set<string>();
  const queue: Array<{ id: string; hops: number }> = [{ id: targetId, hops: 0 }];
  while (queue.length > 0) {
    const { id, hops } = queue.shift()!;
    if (id === ancestorId) return hops;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = getConceptById(id);
    if (!node) continue;
    for (const pid of node.prerequisites) queue.push({ id: pid, hops: hops + 1 });
  }
  return 999;
}

function _buildRecommendation(
  target:       ConceptNode,
  rootCause:    PrerequisiteGap | null,
  topGap:       PrerequisiteGap | null,
  gapCount:     number,
  readiness:    number,
  failureCount: number,
): string {
  if (gapCount === 0 && readiness >= 80) {
    return `Prerequisite foundations for "${target.concept}" look solid. The issue may be in how the concept itself is being presented — try a different teaching strategy or analogy.`;
  }

  if (rootCause && rootCause.isLearnable) {
    return `The root gap appears to be "${rootCause.concept.concept}" (${rootCause.concept.topic}). This concept is directly learnable now and, once mastered, will unblock ${rootCause.impactScore} dependent concept${rootCause.impactScore !== 1 ? "s" : ""}. Start there before returning to "${target.concept}".`;
  }

  if (topGap) {
    return `There are ${gapCount} prerequisite gaps. The highest-impact one to repair is "${topGap.concept.concept}" — fixing it unblocks ${topGap.impactScore} other concept${topGap.impactScore !== 1 ? "s" : ""}. Prerequisite readiness for "${target.concept}" is currently ${readiness}%.`;
  }

  if (failureCount >= 3) {
    return `After ${failureCount} failures, all prerequisites appear met but the concept is still not landing. Consider an analogy-based explanation or a full worked example.`;
  }

  return `Prerequisite readiness for "${target.concept}" is ${readiness}%. Some foundations need strengthening before this concept will become accessible.`;
}

// ── Batch inference ───────────────────────────────────────────────────────────

/**
 * Run inference across multiple failing concepts and aggregate results.
 * Useful for identifying the SINGLE most impactful concept to repair
 * that unblocks the most failing areas.
 */
export function batchInference(
  failingConceptIds: string[],
): { priorityRepair: PrerequisiteGap | null; allResults: InferenceResult[] } {
  const allResults: InferenceResult[] = [];
  const gapTally  = new Map<string, { gap: PrerequisiteGap; frequency: number }>();

  for (const id of failingConceptIds) {
    const result = inferPrerequisiteGaps(id);
    if (!result) continue;
    allResults.push(result);

    for (const gap of result.allGaps) {
      const existing = gapTally.get(gap.concept.id);
      if (existing) {
        existing.frequency++;
        existing.gap.impactScore += gap.impactScore;
      } else {
        gapTally.set(gap.concept.id, { gap: { ...gap }, frequency: 1 });
      }
    }
  }

  // Priority repair = most frequently appearing + highest impact
  const sorted = [...gapTally.values()]
    .sort((a, b) => (b.frequency * b.gap.impactScore) - (a.frequency * a.gap.impactScore));

  return {
    priorityRepair: sorted[0]?.gap ?? null,
    allResults,
  };
}

// ── Historical tracking ───────────────────────────────────────────────────────

const HISTORY_KEY = "studyai-v1-prereq-inference-history";

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}

export function saveInferenceResult(result: InferenceResult): void {
  const history = lsRead<InferenceResult[]>(HISTORY_KEY, []);
  const updated = [...history.filter((r) => r.targetConceptId !== result.targetConceptId), result];
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(-30))); } catch {}
}

export function getInferenceHistory(): InferenceResult[] {
  return lsRead<InferenceResult[]>(HISTORY_KEY, []);
}

export function getLastInference(conceptId: string): InferenceResult | null {
  return getInferenceHistory().find((r) => r.targetConceptId === conceptId) ?? null;
}
