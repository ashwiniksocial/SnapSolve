/**
 * Tutor Intelligence — public API
 *
 * The intelligence layer that sits above the Socratic engines.
 * Understands not just WHAT the student answers, but WHY they're struggling
 * and exactly HOW to help.
 *
 * Layer hierarchy:
 *   learningRecovery       ← master recovery orchestrator
 *   ├── misunderstandingDetector  ← root-cause analysis of wrong answers
 *   ├── reasoningAnalyzer         ← how the student thinks
 *   ├── cognitiveLoadEngine       ← mental bandwidth monitoring
 *   ├── teachingStrategyEngine    ← optimal pedagogy selection
 *   ├── analogyEngine             ← concrete analogy generation
 *   ├── prerequisiteRecovery      ← gap-filling recovery plans
 *   └── confidenceRecovery        ← learned helplessness intervention
 */

// ── Misunderstanding Detector ─────────────────────────────────────────────────
export {
  recordMisunderstanding,
  inferNatureFromAnswer,
  markResolved,
  recordReteachAttempt,
  getMisunderstandingReport,
  getStructuralMisunderstandings,
  getPersistentMisunderstandings,
} from "./misunderstandingDetector";
export type {
  MisunderstandingNature,
  MisunderstandingDepth,
  MisunderstandingStability,
  MisunderstandingOrigin,
  MisunderstandingProfile,
  MisunderstandingReport,
} from "./misunderstandingDetector";

// ── Reasoning Analyzer ────────────────────────────────────────────────────────
export {
  getReasoningProfile,
  analyseAnswer,
  describeReasoningStyle,
  getReasoningCoachingHint,
} from "./reasoningAnalyzer";
export type {
  ReasoningStyle,
  ReasoningGap,
  ReasoningSignal,
  ReasoningProfile,
} from "./reasoningAnalyzer";

// ── Cognitive Load Engine ─────────────────────────────────────────────────────
export {
  getCognitiveLoadProfile,
  assessCognitiveLoad,
  getInterventionMessage,
  isOverloaded,
} from "./cognitiveLoadEngine";
export type {
  LoadLevel,
  Intervention,
  LoadSnapshot,
  CognitiveLoadProfile,
} from "./cognitiveLoadEngine";

// ── Teaching Strategy Engine ──────────────────────────────────────────────────
export {
  getStrategyHistory,
  recordStrategyEffectiveness,
  selectStrategy,
  STRATEGY_LABELS,
} from "./teachingStrategyEngine";
export type {
  TeachingStrategy,
  StrategyRecommendation,
  StrategyHistory,
} from "./teachingStrategyEngine";

// ── Analogy Engine ────────────────────────────────────────────────────────────
export {
  getAnalogyHistory,
  getBestAnalogy,
  rateAnalogy,
  getTopicsWithAnalogies,
} from "./analogyEngine";
export type {
  Analogy,
  AnalogyRecord,
  AnalogyHistory,
} from "./analogyEngine";

// ── Prerequisite Recovery ─────────────────────────────────────────────────────
export {
  getMissingPrerequisites,
  createRecoveryPlan,
  advanceRecoveryStep,
  recordConfidenceScore,
  getActiveRecoveryPlan,
  getRecoveryStats,
  getPrerequisiteChain,
} from "./prerequisiteRecovery";
export type {
  RecoveryStep,
  RecoveryPlan,
} from "./prerequisiteRecovery";

// ── Confidence Recovery ───────────────────────────────────────────────────────
export {
  detectNegativeSelfTalk,
  getConfidenceProfile,
  recordConfidenceEvent,
  getRecoveryMessage,
  needsConfidenceIntervention,
  getMotivationSummary,
} from "./confidenceRecovery";
export type {
  ConfidenceLevel,
  ConfidenceEvent,
  ConfidenceSnapshot,
  ConfidenceProfile,
  RecoveryMessage,
} from "./confidenceRecovery";

// ── Learning Recovery (master orchestrator) ───────────────────────────────────
export {
  getRecoveryLog,
  assessRecoveryNeed,
  logRecovery,
  completeRecovery,
  URGENCY_LABELS,
  RECOVERY_LABELS,
} from "./learningRecovery";
export type {
  RecoveryType,
  RecoveryStatus,
  RecoveryEvent,
  RecoveryLog,
  RecoveryAssessment,
} from "./learningRecovery";
