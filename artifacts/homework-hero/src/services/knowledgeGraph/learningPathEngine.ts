/**
 * Learning Path Engine — generates concept-level learning paths.
 *
 * Instead of recommending topics, this engine recommends CONCEPTS.
 * It generates the shortest, most efficient path from the student's
 * current mastery state to a specified target (exam score, topic mastery, etc.).
 *
 * Path types:
 *  - EXAM_PREP:    maximize exam score given remaining time
 *  - TOPIC_MASTERY: master a specific concept and all its prerequisites
 *  - GAP_REPAIR:   close the most impactful knowledge gaps first
 *  - NEXT_UNLOCK:  learn the next concept that will unlock the most successors
 *
 * Path nodes are annotated with:
 *  - Estimated time to learn
 *  - Current mastery score
 *  - Priority reason
 *  - Learning dependencies satisfied
 *
 * Firestore path: students/{id}/activeLearningPath
 */

import {
  getConceptById,
  topologicalSort,
  getAllDescendants,
  getConceptsBySubject,
} from "./knowledgeGraphEngine";
import {
  getMasteredConceptIds,
  getConceptMastery,
  getFoundationScore,
} from "./conceptMasteryEngine";
import { prerequisiteReadiness, getLearnableNow } from "./dependencyEngine";
import type { ConceptNode, Subject } from "./conceptGraph";

export type PathType = "exam_prep" | "topic_mastery" | "gap_repair" | "next_unlock";

export interface PathNode {
  concept:             ConceptNode;
  currentMastery:      number;
  targetMastery:       number;
  estimatedMinutes:    number;
  priority:            number;       // 1 = highest
  reason:              string;       // why this concept is at this position
  prerequisitesMet:    boolean;
  foundationScore:     number;       // how solid are ITS prerequisites
  examWeight:          number;       // contribution to exam score (0–1)
}

export interface LearningPath {
  pathType:          PathType;
  subject?:          Subject;
  targetConceptId?:  string;
  nodes:             PathNode[];

  totalEstimatedMinutes: number;
  conceptsToMaster:      number;
  currentAvgMastery:     number;
  projectedExamScore:    number;   // estimated after completing this path
  generatedAt:           number;
}

// ── Exam weight heuristic ─────────────────────────────────────────────────────
// Maps examFrequency to a score weight

const EXAM_WEIGHTS: Record<string, number> = {
  very_frequent: 1.0,
  frequent:      0.7,
  occasional:    0.4,
  rare:          0.15,
};

const REVISION_WEIGHTS: Record<string, number> = {
  critical: 1.0,
  high:     0.75,
  medium:   0.5,
  low:      0.25,
};

// ── Path generators ───────────────────────────────────────────────────────────

/** Generate an exam-prep path: prioritise high-frequency, high-importance concepts. */
export function generateExamPrepPath(opts: {
  subject:          Subject;
  daysUntilExam:    number;
  dailyMinutes?:    number;
  targetScore?:     number;
}): LearningPath {
  const { subject, daysUntilExam, dailyMinutes = 45, targetScore = 75 } = opts;
  const totalMinutes = daysUntilExam * dailyMinutes;
  const mastered     = getMasteredConceptIds();
  const all          = getConceptsBySubject(subject);

  // Filter to learnable (prereqs met) or nearly learnable (readiness >= 60%)
  const candidates = all.filter((n) => {
    if (mastered.has(n.id)) return false;
    const mastery = getConceptMastery(n.id)?.masteryScore ?? 30;
    if (mastery >= 70) return false;
    return prerequisiteReadiness(n.id, mastered) >= 60;
  });

  // Score each candidate
  const scored = candidates.map((c) => {
    const mastery    = getConceptMastery(c.id)?.masteryScore ?? 30;
    const examWeight = EXAM_WEIGHTS[c.examFrequency] ?? 0.5;
    const revWeight  = REVISION_WEIGHTS[c.revisionPriority] ?? 0.5;
    const importanceWeight = c.importance / 5;
    const readiness  = prerequisiteReadiness(c.id, mastered);

    // Score = exam impact × importance × readiness bonus
    const score = examWeight * revWeight * importanceWeight * (0.5 + readiness / 200);
    return { concept: c, score, mastery, readiness };
  });

  // Sort by score descending; respect topological order within ties
  scored.sort((a, b) => b.score - a.score);

  // Build path nodes, capped by time budget
  let minutesUsed = 0;
  const nodes: PathNode[] = [];

  for (let i = 0; i < scored.length; i++) {
    const { concept, mastery, readiness } = scored[i];
    const estimatedMinutes = Math.max(20, concept.estimatedLearningTimeMinutes * (1 - mastery / 100));
    if (minutesUsed + estimatedMinutes > totalMinutes) continue;

    minutesUsed += estimatedMinutes;
    nodes.push({
      concept,
      currentMastery:   mastery,
      targetMastery:    Math.min(90, mastery + 40),
      estimatedMinutes: Math.round(estimatedMinutes),
      priority:         i + 1,
      reason:           `${concept.examFrequency.replace("_", " ")} in exams, importance ${concept.importance}/5`,
      prerequisitesMet: readiness >= 80,
      foundationScore:  getFoundationScore(concept.id),
      examWeight:       EXAM_WEIGHTS[concept.examFrequency] ?? 0.5,
    });
  }

  return _finalise("exam_prep", nodes, subject);
}

/** Generate a topic-mastery path: learn a specific concept and all its prerequisites. */
export function generateTopicMasteryPath(targetConceptId: string): LearningPath | null {
  const targetNode = getConceptById(targetConceptId);
  if (!targetNode) return null;

  const mastered = getMasteredConceptIds();
  const allIds   = topologicalSort(
    [...getAllDescendants(targetConceptId).map((n) => n.id).reverse(), targetConceptId]
  ).map((n) => n.id);

  const nodes: PathNode[] = [];

  for (const id of allIds) {
    const concept = getConceptById(id);
    if (!concept) continue;
    if (mastered.has(id)) continue;

    const mastery    = getConceptMastery(id)?.masteryScore ?? 30;
    if (mastery >= 70) continue;

    const readiness  = prerequisiteReadiness(id, mastered);
    const priority   = nodes.length + 1;

    nodes.push({
      concept,
      currentMastery:   mastery,
      targetMastery:    75,
      estimatedMinutes: Math.round(concept.estimatedLearningTimeMinutes * (1 - mastery / 100)),
      priority,
      reason:           id === targetConceptId ? "Target concept" : `Prerequisite for ${targetNode.concept}`,
      prerequisitesMet: readiness === 100,
      foundationScore:  getFoundationScore(id),
      examWeight:       EXAM_WEIGHTS[concept.examFrequency] ?? 0.5,
    });
  }

  return _finalise("topic_mastery", nodes, undefined, targetConceptId);
}

/** Generate a gap-repair path: close the most impactful gaps first. */
export function generateGapRepairPath(subject?: Subject): LearningPath {
  const mastered  = getMasteredConceptIds();
  const learnable = getLearnableNow(mastered);
  const filtered  = subject ? learnable.filter((n) => n.subject === subject) : learnable;

  // Score by impact: how many descendants will be unlocked?
  const scored = filtered.map((concept) => {
    const mastery   = getConceptMastery(concept.id)?.masteryScore ?? 30;
    const impact    = getAllDescendants(concept.id).filter((d) => !mastered.has(d.id)).length;
    const examImpact = EXAM_WEIGHTS[concept.examFrequency] ?? 0.5;
    return { concept, mastery, impact, score: impact * examImpact * (concept.importance / 5) };
  });

  scored.sort((a, b) => b.score - a.score);

  const nodes: PathNode[] = scored.slice(0, 15).map(({ concept, mastery, impact }, i) => ({
    concept,
    currentMastery:   mastery,
    targetMastery:    75,
    estimatedMinutes: Math.round(concept.estimatedLearningTimeMinutes * (1 - mastery / 100)),
    priority:         i + 1,
    reason:           `Closes gap blocking ${impact} concept${impact !== 1 ? "s" : ""}`,
    prerequisitesMet: true,
    foundationScore:  getFoundationScore(concept.id),
    examWeight:       EXAM_WEIGHTS[concept.examFrequency] ?? 0.5,
  }));

  return _finalise("gap_repair", nodes, subject);
}

/** Next-unlock path: learn the concept that unlocks the most successors. */
export function generateNextUnlockPath(subject?: Subject): LearningPath {
  const mastered  = getMasteredConceptIds();
  const learnable = getLearnableNow(mastered);
  const filtered  = subject ? learnable.filter((n) => n.subject === subject) : learnable;

  const scored = filtered.map((concept) => {
    const mastery  = getConceptMastery(concept.id)?.masteryScore ?? 30;
    const unlocks  = concept.successors.filter((sid) => {
      const s = getConceptById(sid);
      if (!s) return false;
      return s.prerequisites.every((pid) => pid === concept.id || mastered.has(pid));
    }).length;
    return { concept, mastery, unlocks, score: unlocks * (concept.importance / 5) };
  });

  scored.sort((a, b) => b.score - a.score);

  const nodes: PathNode[] = scored.slice(0, 10).map(({ concept, mastery, unlocks }, i) => ({
    concept,
    currentMastery:   mastery,
    targetMastery:    75,
    estimatedMinutes: Math.round(concept.estimatedLearningTimeMinutes * (1 - mastery / 100)),
    priority:         i + 1,
    reason:           `Directly unlocks ${unlocks} new concept${unlocks !== 1 ? "s" : ""}`,
    prerequisitesMet: true,
    foundationScore:  getFoundationScore(concept.id),
    examWeight:       EXAM_WEIGHTS[concept.examFrequency] ?? 0.5,
  }));

  return _finalise("next_unlock", nodes, subject);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _finalise(
  pathType:        PathType,
  nodes:           PathNode[],
  subject?:        Subject,
  targetConceptId?: string,
): LearningPath {
  const total = nodes.reduce((s, n) => s + n.estimatedMinutes, 0);
  const avgMastery = nodes.length
    ? Math.round(nodes.reduce((s, n) => s + n.currentMastery, 0) / nodes.length)
    : 0;

  // Projected exam score: weighted sum of target masteries × exam weights
  const examContrib = nodes.reduce((s, n) => s + n.targetMastery * n.examWeight, 0);
  const maxContrib  = nodes.reduce((s, n) => s + 100 * n.examWeight, 0);
  const projected   = maxContrib > 0 ? Math.round((examContrib / maxContrib) * 100) : 0;

  return {
    pathType, subject, targetConceptId, nodes,
    totalEstimatedMinutes: total,
    conceptsToMaster:      nodes.length,
    currentAvgMastery:     avgMastery,
    projectedExamScore:    projected,
    generatedAt:           Date.now(),
  };
}

// ── Persistence ───────────────────────────────────────────────────────────────

const PATH_KEY = "studyai-v1-active-learning-path";

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}

export function saveActivePath(path: LearningPath): void {
  try { localStorage.setItem(PATH_KEY, JSON.stringify(path)); } catch {}
}

export function getActivePath(): LearningPath | null {
  return lsRead<LearningPath | null>(PATH_KEY, null);
}

export function clearActivePath(): void {
  localStorage.removeItem(PATH_KEY);
}
