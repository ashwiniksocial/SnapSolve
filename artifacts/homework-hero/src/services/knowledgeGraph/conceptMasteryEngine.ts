/**
 * Concept Mastery Engine — per-concept mastery tracking with propagation.
 *
 * Unlike topic-level mastery (masteryEngine.ts in studentModel),
 * this engine tracks mastery at the CONCEPT granularity and propagates
 * mastery changes through the dependency graph.
 *
 * Propagation rules:
 *  1. If concept A mastery drops, all successors of A are dampened.
 *  2. If concept A mastery rises, successors check if they can rise too.
 *  3. Propagation decays with distance (depth-1 = 80%, depth-2 = 50%, depth-3 = 20%).
 *
 * Firestore path: students/{id}/conceptMastery/{conceptId}
 */

import { getConceptById, getAllDescendants, getAllAncestors } from "./knowledgeGraphEngine";
import type { ConceptNode } from "./conceptGraph";

const KEY = "studyai-v1-concept-mastery";

export interface ConceptMasteryEntry {
  conceptId:       string;
  conceptName:     string;
  masteryScore:    number;    // 0–100
  confidence:      number;    // 0–100, how certain we are the score is accurate
  attempts:        number;
  correctCount:    number;
  lastAttempted:   number;
  lastImproved:    number;
  trend:           "rising" | "stable" | "falling";
  source:          "direct" | "propagated";   // was mastery measured or inferred?
  propagatedFrom?: string;   // source concept ID if propagated
}

export interface ConceptMasteryMap {
  entries:   Record<string, ConceptMasteryEntry>;
  updatedAt: number;
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

function getMap(): ConceptMasteryMap {
  return lsRead<ConceptMasteryMap>(KEY, { entries: {}, updatedAt: Date.now() });
}

// ── Core API ──────────────────────────────────────────────────────────────────

export function getConceptMastery(conceptId: string): ConceptMasteryEntry | null {
  return getMap().entries[conceptId] ?? null;
}

export function getAllConceptMasteries(): ConceptMasteryEntry[] {
  return Object.values(getMap().entries);
}

/** Mastered = mastery score >= 70. */
export function getMasteredConceptIds(): Set<string> {
  const map = getMap();
  const ids = new Set<string>();
  for (const [id, entry] of Object.entries(map.entries)) {
    if (entry.masteryScore >= 70) ids.add(id);
  }
  return ids;
}

/**
 * Record an attempt result for a concept and propagate changes.
 * `correct` = did the student answer correctly?
 * `strength` = weight of this evidence (0–1, default 1)
 */
export function recordConceptAttempt(opts: {
  conceptId: string;
  correct:   boolean;
  strength?: number;  // 0–1
}): ConceptMasteryEntry {
  const { conceptId, correct, strength = 1 } = opts;
  const map  = getMap();
  const node = getConceptById(conceptId);

  const existing = map.entries[conceptId] ?? _createEntry(conceptId, node);
  const oldScore = existing.masteryScore;

  // EMA-style update: new mastery = old * 0.7 + new_signal * 0.3
  const signal   = correct ? 100 : 0;
  const newScore = Math.round(existing.masteryScore * 0.7 + signal * strength * 0.3);

  existing.masteryScore  = Math.min(100, Math.max(0, newScore));
  existing.confidence    = Math.min(100, existing.confidence + (correct ? 5 : -3));
  existing.attempts++;
  if (correct) existing.correctCount++;
  existing.lastAttempted = Date.now();
  if (newScore > oldScore) existing.lastImproved = Date.now();

  // Trend: compare last 3 implicit signals
  if (existing.attempts >= 3) {
    const accuracy = existing.correctCount / existing.attempts;
    existing.trend = accuracy > 0.67 ? "rising" : accuracy < 0.4 ? "falling" : "stable";
  }

  existing.source = "direct";
  map.entries[conceptId] = existing;

  // Propagate changes to successors/ancestors
  _propagateMastery(map, conceptId, newScore - oldScore);

  map.updatedAt = Date.now();
  lsWrite(map);
  return existing;
}

/**
 * Directly set mastery score (e.g. from a diagnostic assessment).
 * Also propagates.
 */
export function setConceptMastery(conceptId: string, score: number): void {
  const map  = getMap();
  const node = getConceptById(conceptId);
  const existing = map.entries[conceptId] ?? _createEntry(conceptId, node);
  const delta = score - existing.masteryScore;
  existing.masteryScore = Math.min(100, Math.max(0, score));
  existing.source = "direct";
  existing.lastAttempted = Date.now();
  map.entries[conceptId] = existing;
  _propagateMastery(map, conceptId, delta);
  map.updatedAt = Date.now();
  lsWrite(map);
}

// ── Propagation ───────────────────────────────────────────────────────────────

const PROPAGATION_DECAY = [1.0, 0.6, 0.35, 0.15];  // depth 0,1,2,3

/**
 * When concept X changes by `delta`, propagate to its successors (downward)
 * and update prerequisite confidence upward.
 */
function _propagateMastery(map: ConceptMasteryMap, sourceId: string, delta: number): void {
  if (Math.abs(delta) < 3) return;  // don't propagate tiny changes

  const descendants = getAllDescendants(sourceId);
  for (let depth = 0; depth < Math.min(descendants.length, 3); depth++) {
    const successor = descendants[depth];
    if (!successor) continue;

    const existing = map.entries[successor.id] ?? _createEntry(successor.id, getConceptById(successor.id));
    const dampedDelta = delta * PROPAGATION_DECAY[depth + 1];

    // If source mastery dropped, successors are harder to maintain
    // If source mastery rose, successors may benefit slightly
    const newScore = Math.min(100, Math.max(0, existing.masteryScore + dampedDelta * 0.4));
    existing.masteryScore = Math.round(newScore);
    existing.source       = "propagated";
    existing.propagatedFrom = sourceId;
    existing.confidence   = Math.max(10, existing.confidence - 10);  // less certain now
    map.entries[successor.id] = existing;
  }
}

function _createEntry(conceptId: string, node: ConceptNode | undefined): ConceptMasteryEntry {
  return {
    conceptId,
    conceptName:    node?.concept ?? conceptId,
    masteryScore:   30,   // start with 30% (some prior knowledge assumed)
    confidence:     20,
    attempts:       0,
    correctCount:   0,
    lastAttempted:  0,
    lastImproved:   0,
    trend:          "stable",
    source:         "direct",
  };
}

// ── Analysis ──────────────────────────────────────────────────────────────────

export interface ConceptMasteryReport {
  totalTracked:        number;
  mastered:            number;    // score >= 70
  learning:            number;    // 40 <= score < 70
  struggling:          number;    // score < 40
  avgMastery:          number;
  strongestConcepts:   ConceptMasteryEntry[];
  weakestConcepts:     ConceptMasteryEntry[];
  risingConcepts:      ConceptMasteryEntry[];
  fallingConcepts:     ConceptMasteryEntry[];
  propagatedEntries:   number;    // how many are inferred vs directly measured
}

export function getConceptMasteryReport(): ConceptMasteryReport {
  const all = getAllConceptMasteries();
  if (all.length === 0) {
    return {
      totalTracked: 0, mastered: 0, learning: 0, struggling: 0, avgMastery: 0,
      strongestConcepts: [], weakestConcepts: [], risingConcepts: [], fallingConcepts: [], propagatedEntries: 0,
    };
  }

  const sorted = [...all].sort((a, b) => b.masteryScore - a.masteryScore);
  return {
    totalTracked:      all.length,
    mastered:          all.filter((e) => e.masteryScore >= 70).length,
    learning:          all.filter((e) => e.masteryScore >= 40 && e.masteryScore < 70).length,
    struggling:        all.filter((e) => e.masteryScore < 40).length,
    avgMastery:        Math.round(all.reduce((s, e) => s + e.masteryScore, 0) / all.length),
    strongestConcepts: sorted.slice(0, 5),
    weakestConcepts:   sorted.slice(-5).reverse(),
    risingConcepts:    all.filter((e) => e.trend === "rising").slice(0, 5),
    fallingConcepts:   all.filter((e) => e.trend === "falling").slice(0, 5),
    propagatedEntries: all.filter((e) => e.source === "propagated").length,
  };
}

/**
 * Concept mastery impact analysis:
 * which tracked concept, if improved, would lift the most other concepts?
 */
export function getHighestImpactConceptToLearn(): ConceptMasteryEntry | null {
  const mastered     = getMasteredConceptIds();
  const allEntries   = getAllConceptMasteries().filter((e) => e.masteryScore < 70);
  if (allEntries.length === 0) return null;

  let best: ConceptMasteryEntry | null = null;
  let bestScore = -1;

  for (const entry of allEntries) {
    const descendants = getAllDescendants(entry.conceptId);
    const impactCount = descendants.filter((d) => !mastered.has(d.id)).length;
    if (impactCount > bestScore) { bestScore = impactCount; best = entry; }
  }
  return best;
}

/**
 * Ancestor mastery average — how solid are the foundations for a concept?
 * Score of 100 = all ancestors fully mastered.
 */
export function getFoundationScore(conceptId: string): number {
  const ancestors = getAllAncestors(conceptId);
  if (ancestors.length === 0) return 100;
  const map = getMap();
  const scores = ancestors.map((a) => map.entries[a.id]?.masteryScore ?? 30);
  return Math.round(scores.reduce((s, x) => s + x, 0) / scores.length);
}
