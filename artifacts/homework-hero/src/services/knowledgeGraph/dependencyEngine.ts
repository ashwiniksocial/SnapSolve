/**
 * Dependency Engine — concept dependency analysis.
 *
 * Answers questions like:
 *  - "What must I know before learning Quadratic Equations?"
 *  - "What will be unlocked once I master Polynomials?"
 *  - "Which topics does this concept bridge between?"
 *  - "How far is this concept from what the student knows?"
 *
 * Uses the concept graph adjacency data and student mastery state
 * to produce dependency-aware recommendations.
 */

import { getConceptById, getAllAncestors, getAllDescendants, topologicalSort } from "./knowledgeGraphEngine";
import type { ConceptNode } from "./conceptGraph";

export interface DependencyReport {
  conceptId:         string;
  conceptName:       string;

  directPrerequisites:  ConceptNode[];
  allPrerequisites:     ConceptNode[];   // transitive closure
  directSuccessors:     ConceptNode[];
  allSuccessors:        ConceptNode[];   // transitive closure

  prerequisiteDepth:    number;          // longest path to a root concept
  successorDepth:       number;          // longest path to a leaf concept
  bridgingScore:        number;          // how many concepts depend on this one (centrality)

  // Mastery-gated analysis (requires student mastery data)
  blockedBy?:           ConceptNode[];   // prerequisites not yet mastered
  willUnlock?:          ConceptNode[];   // successors gated on this concept
}

/**
 * Build a full dependency report for a concept.
 * Optionally provide `masteredIds` to enrich with mastery-gated analysis.
 */
export function buildDependencyReport(
  conceptId: string,
  masteredIds?: Set<string>,
): DependencyReport | null {
  const node = getConceptById(conceptId);
  if (!node) return null;

  const directPrerequisites = node.prerequisites
    .map((id) => getConceptById(id))
    .filter(Boolean) as ConceptNode[];

  const directSuccessors = node.successors
    .map((id) => getConceptById(id))
    .filter(Boolean) as ConceptNode[];

  const allPrerequisites = getAllAncestors(conceptId);
  const allSuccessors    = getAllDescendants(conceptId);

  const prerequisiteDepth = _longestPath(conceptId, "backward");
  const successorDepth    = _longestPath(conceptId, "forward");
  const bridgingScore     = allSuccessors.length;   // concepts that depend on this

  const report: DependencyReport = {
    conceptId, conceptName: node.concept,
    directPrerequisites, allPrerequisites,
    directSuccessors, allSuccessors,
    prerequisiteDepth, successorDepth, bridgingScore,
  };

  if (masteredIds) {
    report.blockedBy  = directPrerequisites.filter((p) => !masteredIds.has(p.id));
    report.willUnlock = directSuccessors.filter((s) =>
      s.prerequisites.every((pid) => pid === conceptId || masteredIds.has(pid))
    );
  }

  return report;
}

/** Longest chain going backward (to roots) or forward (to leaves). */
function _longestPath(id: string, direction: "forward" | "backward"): number {
  const memo = new Map<string, number>();
  function dfs(nodeId: string): number {
    if (memo.has(nodeId)) return memo.get(nodeId)!;
    const node = getConceptById(nodeId);
    if (!node) return 0;
    const neighbours = direction === "backward" ? node.prerequisites : node.successors;
    if (neighbours.length === 0) { memo.set(nodeId, 0); return 0; }
    const depth = 1 + Math.max(...neighbours.map(dfs));
    memo.set(nodeId, depth);
    return depth;
  }
  return dfs(id);
}

// ── Mastery-gated analysis ─────────────────────────────────────────────────────

/**
 * Given a set of mastered concept IDs, return which concepts are NOW learnable
 * (all prerequisites met) but not yet mastered.
 */
export function getLearnableNow(masteredIds: Set<string>): ConceptNode[] {
  const sorted = topologicalSort();
  return sorted.filter((node) => {
    if (masteredIds.has(node.id)) return false;  // already mastered
    return node.prerequisites.every((pid) => masteredIds.has(pid));
  });
}

/**
 * Given a target concept, find the first missing prerequisite walking backwards.
 * Returns the "shallowest" gap — the root-most missing concept.
 */
export function findFirstGap(targetId: string, masteredIds: Set<string>): ConceptNode | null {
  // BFS from the target going backward through prerequisites
  const visited = new Set<string>();
  const queue   = [targetId];

  while (queue.length > 0) {
    const id   = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = getConceptById(id);
    if (!node) continue;

    // Check each prerequisite
    for (const pid of node.prerequisites) {
      if (!masteredIds.has(pid)) {
        const prereq = getConceptById(pid);
        if (!prereq) continue;
        // Is THIS the deepest missing link?  Check if its own prereqs are all mastered
        const prereqsGapFree = prereq.prerequisites.every((pp) => masteredIds.has(pp));
        if (prereqsGapFree) return prereq;   // this is the root cause
        queue.push(pid);
      }
    }
  }
  return null;
}

/**
 * Impact score: how many unmastered concepts will be affected
 * if concept `id` remains unmastered.
 */
export function computeImpactScore(id: string, masteredIds: Set<string>): number {
  const descendants = getAllDescendants(id);
  return descendants.filter((d) => !masteredIds.has(d.id)).length;
}

/**
 * Prerequisite readiness score for a concept: 0–100.
 * 100 = all prerequisites mastered.
 * 0   = no prerequisites mastered.
 */
export function prerequisiteReadiness(conceptId: string, masteredIds: Set<string>): number {
  const node = getConceptById(conceptId);
  if (!node || node.prerequisites.length === 0) return 100;
  const met = node.prerequisites.filter((pid) => masteredIds.has(pid)).length;
  return Math.round((met / node.prerequisites.length) * 100);
}

/**
 * Return the full prerequisite chain in learning order for a target concept.
 * Only includes concepts not yet mastered.
 */
export function getRequiredLearningPath(
  targetId: string,
  masteredIds: Set<string>,
): ConceptNode[] {
  const ancestors = getAllAncestors(targetId);
  const allIds    = [...ancestors.map((n) => n.id), targetId];
  const sorted    = topologicalSort(allIds);
  return sorted.filter((n) => !masteredIds.has(n.id));
}
