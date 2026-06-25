/**
 * Student Model — public API
 *
 * Import from here, not from individual files.
 * This ensures a stable contract when cloud sync is added.
 */

export { getOrCreateProfile, recordQuestionAnswered, recordSectionOpened, getStudentId } from "./studentProfile";
export { getMasteryEntry, getAllMasteryEntries, updateMasteryAfterAnswer, recordTopicVisit, getWeakTopics, getTopicsNeedingRevision, addConfusionPoint } from "./topicMastery";
export { recordMistakesFromResponse, getPersistentMistakes, getAllPersistentMistakes } from "./mistakeEngine";
export { recordSession, getLearningVelocity, getBestStudyTimeLabel, getRecentSessions, getDaysSinceLastStudy } from "./studyPatterns";
export { getTutorInsights, buildStudentContext, getRecommendedDepth } from "./adaptationEngine";
export type { TutorInsights } from "./adaptationEngine";
export type { StoredProfile, TopicMasteryEntry, MistakeRecord, SessionRecord } from "./syncManager";
