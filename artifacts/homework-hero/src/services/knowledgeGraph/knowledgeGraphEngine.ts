/**
 * Knowledge Graph Engine — core runtime graph operations.
 *
 * This is the central API for the concept graph.
 * All other engines import from here, not directly from conceptGraph.ts.
 *
 * Capabilities:
 *  - Node lookup by id, subject, class, chapter, topic, keyword
 *  - Adjacency queries (predecessors, successors, neighbours)
 *  - Shortest-path traversal (BFS)
 *  - Subgraph extraction (connected component for a topic cluster)
 *  - Topological sort (learning order)
 *  - Graph statistics
 */

import {
  CONCEPT_NODES,
  CONCEPT_INDEX,
  getConceptsBySubject,
  getConceptsByClass,
} from "./conceptGraph";
export type { ConceptNode, Subject, Board, ExamFrequency, RevisionPriority } from "./conceptGraph";
import type { ConceptNode, Subject } from "./conceptGraph";

// ── Lookup ─────────────────────────────────────────────────────────────────────

export function getConceptById(id: string): ConceptNode | undefined {
  return CONCEPT_INDEX.get(id);
}

export function getConceptsByTopic(topic: string, subject?: Subject): ConceptNode[] {
  const lower = topic.toLowerCase();
  return CONCEPT_NODES.filter(
    (n) =>
      (n.topic.toLowerCase().includes(lower) || n.concept.toLowerCase().includes(lower) || n.chapter.toLowerCase().includes(lower)) &&
      (!subject || n.subject === subject),
  );
}

export function getConceptsByChapter(chapter: string, subject?: Subject): ConceptNode[] {
  const lower = chapter.toLowerCase();
  return CONCEPT_NODES.filter(
    (n) => n.chapter.toLowerCase().includes(lower) && (!subject || n.subject === subject),
  );
}

export { getConceptsBySubject, getConceptsByClass };

// ── Adjacency ─────────────────────────────────────────────────────────────────

/** Direct prerequisites of a concept node. */
export function getPrerequisites(id: string): ConceptNode[] {
  const node = CONCEPT_INDEX.get(id);
  if (!node) return [];
  return node.prerequisites.map((pid) => CONCEPT_INDEX.get(pid)).filter(Boolean) as ConceptNode[];
}

/** Concepts that directly depend on this node. */
export function getSuccessors(id: string): ConceptNode[] {
  const node = CONCEPT_INDEX.get(id);
  if (!node) return [];
  return node.successors.map((sid) => CONCEPT_INDEX.get(sid)).filter(Boolean) as ConceptNode[];
}

/** All concepts transitively reachable by following prerequisites (ancestors). */
export function getAllAncestors(id: string): ConceptNode[] {
  const visited = new Set<string>();
  const result:  ConceptNode[] = [];
  function walk(nodeId: string) {
    const node = CONCEPT_INDEX.get(nodeId);
    if (!node || visited.has(nodeId)) return;
    visited.add(nodeId);
    for (const pid of node.prerequisites) {
      walk(pid);
      const p = CONCEPT_INDEX.get(pid);
      if (p && !visited.has(pid)) result.push(p);
    }
  }
  walk(id);
  return result;
}

/** All concepts transitively reachable by following successors (descendants). */
export function getAllDescendants(id: string): ConceptNode[] {
  const visited = new Set<string>();
  const result:  ConceptNode[] = [];
  function walk(nodeId: string) {
    const node = CONCEPT_INDEX.get(nodeId);
    if (!node || visited.has(nodeId)) return;
    visited.add(nodeId);
    for (const sid of node.successors) {
      const s = CONCEPT_INDEX.get(sid);
      if (s && !visited.has(sid)) { result.push(s); walk(sid); }
    }
  }
  walk(id);
  return result;
}

/** Immediate neighbours (prereqs + successors + related). */
export function getNeighbours(id: string): ConceptNode[] {
  const node = CONCEPT_INDEX.get(id);
  if (!node) return [];
  const ids = new Set([...node.prerequisites, ...node.successors, ...node.relatedConcepts]);
  return [...ids].map((i) => CONCEPT_INDEX.get(i)).filter(Boolean) as ConceptNode[];
}

// ── Shortest path (BFS) ────────────────────────────────────────────────────────

/**
 * Find the shortest prerequisite-chain path from `fromId` to `toId`.
 * Traverses both forward (successors) and backward (prerequisites).
 * Returns the ordered list of concept IDs including start and end.
 * Returns null if no path exists.
 */
export function shortestPath(fromId: string, toId: string): string[] | null {
  if (fromId === toId) return [fromId];

  const visited = new Set<string>([fromId]);
  const queue:   Array<{ id: string; path: string[] }> = [{ id: fromId, path: [fromId] }];

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    const node = CONCEPT_INDEX.get(id);
    if (!node) continue;

    const neighbours = [...node.prerequisites, ...node.successors, ...node.relatedConcepts];
    for (const nid of neighbours) {
      if (visited.has(nid)) continue;
      const newPath = [...path, nid];
      if (nid === toId) return newPath;
      visited.add(nid);
      queue.push({ id: nid, path: newPath });
    }
  }
  return null;
}

// ── Topological sort ──────────────────────────────────────────────────────────

/**
 * Return concepts in a valid learning order (prerequisites before successors).
 * Uses Kahn's algorithm on the provided concept IDs.
 * Falls back to all concepts if no ids provided.
 */
export function topologicalSort(ids?: string[]): ConceptNode[] {
  const nodeSet = ids
    ? new Set(ids)
    : new Set(CONCEPT_NODES.map((n) => n.id));

  // Build in-degree map within the subgraph
  const inDegree = new Map<string, number>();
  const adjList  = new Map<string, string[]>();

  for (const id of nodeSet) {
    inDegree.set(id, 0);
    adjList.set(id, []);
  }
  for (const id of nodeSet) {
    const node = CONCEPT_INDEX.get(id);
    if (!node) continue;
    for (const pid of node.prerequisites) {
      if (!nodeSet.has(pid)) continue;
      inDegree.set(id, (inDegree.get(id) ?? 0) + 1);
      adjList.get(pid)?.push(id);
    }
  }

  const queue:  string[] = [];
  const result: ConceptNode[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = CONCEPT_INDEX.get(id);
    if (node) result.push(node);
    for (const successorId of adjList.get(id) ?? []) {
      inDegree.set(successorId, (inDegree.get(successorId) ?? 1) - 1);
      if (inDegree.get(successorId) === 0) queue.push(successorId);
    }
  }
  return result;
}

// ── Subgraph ──────────────────────────────────────────────────────────────────

/**
 * Extract a connected subgraph around a concept, up to `depth` hops.
 * Useful for rendering a local neighbourhood of the graph.
 */
export function getSubgraph(id: string, depth: number = 2): ConceptNode[] {
  const visited = new Set<string>();
  const result:  ConceptNode[] = [];

  function walk(nodeId: string, remaining: number) {
    if (visited.has(nodeId) || remaining < 0) return;
    visited.add(nodeId);
    const node = CONCEPT_INDEX.get(nodeId);
    if (!node) return;
    result.push(node);
    for (const nid of [...node.prerequisites, ...node.successors, ...node.relatedConcepts]) {
      walk(nid, remaining - 1);
    }
  }
  walk(id, depth);
  return result;
}

// ── Graph statistics ──────────────────────────────────────────────────────────

export interface GraphStats {
  totalConcepts:     number;
  bySubject:         Record<string, number>;
  byClass:           Record<number, number>;
  avgPrerequisites:  number;
  avgSuccessors:     number;
  rootConcepts:      string[];   // concepts with no prerequisites
  leafConcepts:      string[];   // concepts with no successors in the dataset
  highImportance:    number;     // count of importance >= 4
  criticalRevision:  number;     // count of revisionPriority === "critical"
}

export function getGraphStats(): GraphStats {
  const bySubject: Record<string, number>  = {};
  const byClass:   Record<number, number>  = {};
  let totalPrereqs = 0, totalSuccessors = 0;
  const roots: string[] = [], leaves: string[] = [];
  let highImportance = 0, criticalRevision = 0;

  for (const n of CONCEPT_NODES) {
    bySubject[n.subject] = (bySubject[n.subject] ?? 0) + 1;
    byClass[n.class]     = (byClass[n.class]     ?? 0) + 1;
    totalPrereqs    += n.prerequisites.length;
    totalSuccessors += n.successors.length;
    if (n.prerequisites.length === 0) roots.push(n.id);
    if (n.successors.length === 0)    leaves.push(n.id);
    if (n.importance >= 4)            highImportance++;
    if (n.revisionPriority === "critical") criticalRevision++;
  }

  return {
    totalConcepts:    CONCEPT_NODES.length,
    bySubject, byClass,
    avgPrerequisites: Math.round((totalPrereqs / CONCEPT_NODES.length) * 10) / 10,
    avgSuccessors:    Math.round((totalSuccessors / CONCEPT_NODES.length) * 10) / 10,
    rootConcepts:     roots,
    leafConcepts:     leaves,
    highImportance, criticalRevision,
  };
}
