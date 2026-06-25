/**
 * Adaptation Engine — the "brain" of the personal tutor.
 *
 * Takes all student data and produces:
 *  1. A `studentContext` string for the AI prompt (personalises explanations)
 *  2. UI insights (shown in the Tutor Profile panel)
 *  3. Recommended reading level for the next question
 */

import { getOrCreateProfile }         from "./studentProfile";
import { getAllMasteryEntries, getWeakTopics, getTopicsNeedingRevision, getTopicsReadyForAdvanced } from "./topicMastery";
import { getAllPersistentMistakes }    from "./mistakeEngine";
import { getLearningVelocity, getBestStudyTimeLabel, getDaysSinceLastStudy, getPreferredSubject, getRecentSessions } from "./studyPatterns";

export interface TutorInsights {
  learningVelocity:    "fast" | "medium" | "slow";
  bestStudyTime:       string;
  preferredDepth:      "basic" | "standard" | "advanced";
  weakTopics:          string[];
  revisionDue:         string[];
  readyForAdvanced:    string[];
  persistentMistakes:  string[];
  motivationScore:     number;
  currentStreak:       number;
  totalStudyHours:     number;
  preferredSubject:    string | null;
  daysSinceLastStudy:  number;
  personalizedTips:    string[];
}

export function getTutorInsights(): TutorInsights {
  const profile    = getOrCreateProfile();
  const weak       = getWeakTopics(5);
  const revision   = getTopicsNeedingRevision(60);
  const advanced   = getTopicsReadyForAdvanced(80);
  const mistakes   = getAllPersistentMistakes();
  const velocity   = getLearningVelocity();

  const tips: string[] = [];
  if (getDaysSinceLastStudy() > 3) tips.push("It's been a few days — a short revision session now will prevent forgetting.");
  if (revision.length > 0)         tips.push(`Revise ${revision[0].topic} soon — your retention is dropping.`);
  if (profile.currentStreak >= 3)  tips.push(`${profile.currentStreak}-day streak! Keep it going.`);
  if (velocity === "slow")         tips.push("Try breaking questions into smaller parts — work through the prerequisites first.");
  if (advanced.length > 0)         tips.push(`You're ready to explore advanced problems on ${advanced[0].topic}.`);

  return {
    learningVelocity:   velocity,
    bestStudyTime:      getBestStudyTimeLabel(),
    preferredDepth:     profile.preferredDepth,
    weakTopics:         weak.map((e) => e.topic),
    revisionDue:        revision.map((e) => e.topic),
    readyForAdvanced:   advanced.map((e) => e.topic),
    persistentMistakes: mistakes.map((m) => m.description),
    motivationScore:    profile.motivationScore,
    currentStreak:      profile.currentStreak,
    totalStudyHours:    Math.round(profile.totalStudyTimeMs / 3_600_000 * 10) / 10,
    preferredSubject:   getPreferredSubject(),
    daysSinceLastStudy: getDaysSinceLastStudy(),
    personalizedTips:   tips.slice(0, 3),
  };
}

/**
 * Builds a student context string to include in the AI prompt.
 * This is the most important output — it personalises every explanation.
 */
export function buildStudentContext(subject: string, topic?: string): string {
  const profile  = getOrCreateProfile();
  const all      = getAllMasteryEntries();
  const entry    = topic ? all.find((e) => e.topic === topic && e.subject === subject) : null;
  const mistakes = getAllPersistentMistakes().slice(0, 3);
  const velocity = getLearningVelocity();
  const daysSince = getDaysSinceLastStudy();

  if (profile.totalQuestionsAnswered === 0) {
    // New student — no profile data yet
    return "";
  }

  const lines: string[] = [
    "STUDENT PROFILE — personalise your explanation based on this data:",
  ];

  // Learning speed
  if (velocity === "slow") {
    lines.push("- Learning speed: SLOW. This student needs more time than average. Use maximum detail. Repeat key ideas.");
  } else if (velocity === "fast") {
    lines.push("- Learning speed: FAST. This student grasps concepts quickly. You may be slightly more concise in transitions, but never skip WHY.");
  }

  // Preferred depth
  lines.push(`- Preferred explanation depth: ${profile.preferredDepth.toUpperCase()}. Match this depth unless the question requires otherwise.`);

  // Topic mastery
  if (entry && topic) {
    const daysSinceTopic = Math.floor((Date.now() - entry.lastPracticed) / 86_400_000);
    if (daysSinceTopic > 7) {
      lines.push(`- This student last studied ${topic} ${daysSinceTopic} days ago. Some forgetting has occurred. Re-introduce the concept gently.`);
    }
    if (entry.masteryScore < 40) {
      lines.push(`- Mastery on ${topic}: LOW (${entry.masteryScore}/100). Start from absolute basics. Do not assume any prior knowledge.`);
    } else if (entry.masteryScore >= 80) {
      lines.push(`- Mastery on ${topic}: HIGH (${entry.masteryScore}/100). This student is comfortable with the basics — focus on depth and nuance.`);
    }
    if (entry.confusionPoints.length > 0) {
      lines.push(`- Known confusion points on ${topic}: ${entry.confusionPoints.slice(-3).join("; ")}. Address these explicitly in your explanation.`);
    }
  } else if (topic) {
    lines.push(`- This is the FIRST TIME this student is encountering ${topic}. Start from absolute zero. Explain every term.`);
  }

  // Persistent mistakes
  if (mistakes.length > 0) {
    lines.push(`- Repeated mistakes this student makes: ${mistakes.slice(0, 2).map((m) => m.description).join(" | ")}. Warn about these proactively.`);
  }

  // Motivation
  if (profile.motivationScore > 70) {
    lines.push("- Motivation: HIGH. This student is engaged and consistent — you can challenge them slightly.");
  } else if (profile.motivationScore < 30) {
    lines.push("- Motivation: LOW. Use extra encouragement. Celebrate small wins. Keep the explanation upbeat.");
  }

  // Study gap
  if (daysSince > 5) {
    lines.push(`- This student has not studied for ${daysSince} days. Start the explanation with a warm welcome-back and a brief reminder of related concepts.`);
  }

  return lines.join("\n");
}

/** Returns the recommended reading level for the next question based on student history. */
export function getRecommendedDepth(subject: string, topic: string): "basic" | "standard" | "advanced" {
  const profile = getOrCreateProfile();
  const entry   = getAllMasteryEntries().find((e) => e.topic === topic && e.subject === subject);

  if (!entry || entry.masteryScore < 50) return "basic";
  if (entry.masteryScore >= 80 && profile.preferredDepth === "advanced") return "advanced";
  if (entry.masteryScore >= 65) return "standard";
  return profile.preferredDepth;
}
