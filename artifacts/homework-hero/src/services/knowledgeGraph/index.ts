/**
 * Knowledge Graph Engine — public API
 *
 * Moves SnapSolve from topic-based learning to concept-based learning.
 * Every chapter, topic and question is part of one connected knowledge graph.
 *
 * Layer hierarchy:
 *   conceptGraph           ← node schema + 35+ concept dataset
 *   knowledgeGraphEngine   ← core graph operations (lookup, traversal, BFS, sort)
 *   dependencyEngine       ← mastery-gated dependency analysis
 *   conceptMasteryEngine   ← per-concept mastery with propagation
 *   prerequisiteInference  ← root-cause gap detection (walk backward)
 *   learningPathEngine     ← optimal concept-level learning paths
 *   remediationEngine      ← personalised 4-step recovery plans
 *   conceptSearch          ← natural-language concept search
 */

// ── Concept Graph (schema + dataset) ─────────────────────────────────────────
export {
  CONCEPT_NODES,
  CONCEPT_INDEX,
  getConceptsBySubject,
  getConceptsByClass,
} from "./conceptGraph";
export type {
  ConceptNode,
  Subject,
  Board,
  Difficulty,
  Importance,
  ExamFrequency,
  RevisionPriority,
} from "./conceptGraph";

// ── Knowledge Graph Engine (core operations) ──────────────────────────────────
export {
  getConceptById,
  getConceptsByTopic,
  getConceptsByChapter,
  getPrerequisites,
  getSuccessors,
  getAllAncestors,
  getAllDescendants,
  getNeighbours,
  shortestPath,
  topologicalSort,
  getSubgraph,
  getGraphStats,
} from "./knowledgeGraphEngine";
export type { GraphStats } from "./knowledgeGraphEngine";

// ── Dependency Engine ─────────────────────────────────────────────────────────
export {
  buildDependencyReport,
  getLearnableNow,
  findFirstGap,
  computeImpactScore,
  prerequisiteReadiness,
  getRequiredLearningPath,
} from "./dependencyEngine";
export type { DependencyReport } from "./dependencyEngine";

// ── Concept Mastery Engine ────────────────────────────────────────────────────
export {
  getConceptMastery,
  getAllConceptMasteries,
  getMasteredConceptIds,
  recordConceptAttempt,
  setConceptMastery,
  getConceptMasteryReport,
  getHighestImpactConceptToLearn,
  getFoundationScore,
} from "./conceptMasteryEngine";
export type {
  ConceptMasteryEntry,
  ConceptMasteryMap,
  ConceptMasteryReport,
} from "./conceptMasteryEngine";

// ── Prerequisite Inference ────────────────────────────────────────────────────
export {
  inferPrerequisiteGaps,
  batchInference,
  saveInferenceResult,
  getInferenceHistory,
  getLastInference,
} from "./prerequisiteInference";
export type {
  PrerequisiteGap,
  InferenceResult,
} from "./prerequisiteInference";

// ── Learning Path Engine ──────────────────────────────────────────────────────
export {
  generateExamPrepPath,
  generateTopicMasteryPath,
  generateGapRepairPath,
  generateNextUnlockPath,
  saveActivePath,
  getActivePath,
  clearActivePath,
} from "./learningPathEngine";
export type {
  PathType,
  PathNode,
  LearningPath,
} from "./learningPathEngine";

// ── Remediation Engine ────────────────────────────────────────────────────────
export {
  createRemediationPlan,
  advanceRemediationStep,
  abandonRemediationPlan,
  getActivePlan,
  getAllPlans,
  getRemediationStats,
} from "./remediationEngine";
export type {
  RemediationStep,
  RemediationStepDetail,
  RemediationPlan,
} from "./remediationEngine";

// ── Concept Search ────────────────────────────────────────────────────────────
export {
  searchConcepts,
  searchConceptsWithAI,
  findBestMatchingConcept,
  findRelatedConcepts,
  getSearchHistory,
  getFrequentSearchTerms,
} from "./conceptSearch";
export type {
  SearchResult,
  ConceptSearchResponse,
} from "./conceptSearch";
