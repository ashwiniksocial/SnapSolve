/**
 * Student Model — public API
 *
 * Import from here, not from individual files.
 * This ensures a stable contract when cloud sync is added.
 *
 * Engine hierarchy:
 *   tutorEngine          ← master orchestrator (import this for most use cases)
 *   ├── studentProfileEngine  ← enriched academic/cognitive profile
 *   ├── behaviorEngine        ← micro-signals from interactions
 *   ├── learningStyleEngine   ← derived learning dimensions
 *   ├── knowledgeGapEngine    ← prerequisite and foundational gaps
 *   ├── masteryEngine         ← Bloom's taxonomy multi-dimensional mastery
 *   ├── recommendationEngine  ← daily plan and next-topic suggestions
 *   ├── examPredictionEngine  ← predicted score and exam readiness
 *   ├── reflectionEngine      ← daily/weekly summaries, milestones, notes
 *   └── adaptationEngine      ← base AI context string (used by tutorEngine)
 */

// ── Core (V1 — always available) ──────────────────────────────────────────────
export {
  getOrCreateProfile,
  recordQuestionAnswered,
  recordSectionOpened,
  getStudentId,
} from "./studentProfile";

export {
  getMasteryEntry,
  getAllMasteryEntries,
  updateMasteryAfterAnswer,
  recordTopicVisit,
  getWeakTopics,
  getTopicsNeedingRevision,
  addConfusionPoint,
} from "./topicMastery";

export {
  recordMistakesFromResponse,
  getPersistentMistakes,
  getAllPersistentMistakes,
} from "./mistakeEngine";

export {
  recordSession,
  getLearningVelocity,
  getBestStudyTimeLabel,
  getRecentSessions,
  getDaysSinceLastStudy,
} from "./studyPatterns";

export {
  getTutorInsights,
  buildStudentContext,
  getRecommendedDepth,
} from "./adaptationEngine";

// ── Engine V2 — extended intelligence ─────────────────────────────────────────

export {
  getEnrichedProfile,
  saveEnrichedProfile,
  setAcademicContext,
  recomputeTraits,
  setSubjectGoal,
  daysUntilExam,
} from "./studentProfileEngine";
export type { EnrichedProfile, Board, Grade, LearnerArchetype } from "./studentProfileEngine";

export {
  getBehaviorSignals,
  recordSessionBehavior,
  getSkippedSections,
  getLevelMismatchTopics,
  isPracticeOriented,
} from "./behaviorEngine";
export type { BehaviorSignals, SectionSignal } from "./behaviorEngine";

export {
  getLearningStyle,
  recomputeLearningStyle,
  describeLearningStyle,
} from "./learningStyleEngine";
export type { LearningStyleProfile } from "./learningStyleEngine";

export {
  getKnowledgeGapReport,
  recordPrerequisiteGap,
  recomputeFoundationalGaps,
  getActiveGaps,
  getCriticalGaps,
  resolveGap,
} from "./knowledgeGapEngine";
export type { KnowledgeGap, KnowledgeGapReport } from "./knowledgeGapEngine";

export {
  getMasterySnapshot,
  recomputeMasterySnapshot,
  updateConceptualMastery,
  reportPerceivedMastery,
  getOverconfidentTopics,
} from "./masteryEngine";
export type { TopicMasteryProfile, MasterySnapshot, BloomLevel } from "./masteryEngine";

export {
  generateDailyPlan,
  getQuickRecommendation,
  getRecommendedSessionLength,
} from "./recommendationEngine";
export type { Recommendation, DailyPlan, RecommendationType } from "./recommendationEngine";

export {
  generateExamPrediction,
  getSubjectPrediction,
} from "./examPredictionEngine";
export type { ExamPrediction, SubjectPrediction, ExamReadiness } from "./examPredictionEngine";

export {
  getTodayReflection,
  getAllReflections,
  generateDailyReflection,
  saveMoodScore,
  generateWeeklyNarrative,
  getMilestones,
  recordMilestone,
  getLatestMilestone,
  getTopicNotes,
  saveTopicNote,
} from "./reflectionEngine";
export type { DailyReflection, MilestoneMoment, TopicNote } from "./reflectionEngine";

// ── Tutor Engine — master orchestrator ────────────────────────────────────────
export {
  getTutorProfile,
  buildRichStudentContext,
  getDailyTutorMessage,
  onSessionStart,
  onSessionEnd,
} from "./tutorEngine";
export type { TutorProfile, SessionStartData, SessionEndData } from "./tutorEngine";

// ── Sync types (used by cloud sync layer) ─────────────────────────────────────
export type {
  StoredProfile,
  TopicMasteryEntry,
  MistakeRecord,
  SessionRecord,
} from "./syncManager";

// ── Re-export TutorInsights from adaptationEngine ─────────────────────────────
export type { TutorInsights } from "./adaptationEngine";
