/**
 * Recommendation Engine — "What should I study next?"
 *
 * Generates 4 types of recommendations:
 *  1. REVISION    — topics with decaying retention (spaced repetition)
 *  2. NEW_TOPIC   — next logical topic based on mastery progression
 *  3. PRACTICE    — topics where conceptual mastery lags procedural
 *  4. GAP_FILL    — prerequisites with critical gaps
 *  5. CHALLENGE   — topics ready for advanced problems
 *
 * Priority order: GAP_FILL → REVISION → PRACTICE → NEW_TOPIC → CHALLENGE
 *
 * Firestore path: students/{id}/recommendations
 */

import { getAllMasteryEntries, getTopicsNeedingRevision }  from "./topicMastery";
import { getActiveGaps }            from "./knowledgeGapEngine";
import { getMasterySnapshot }       from "./masteryEngine";
import { getBestStudyTimeLabel, getDaysSinceLastStudy, getLearningVelocity } from "./studyPatterns";
import { getEnrichedProfile, daysUntilExam } from "./studentProfileEngine";

export type RecommendationType = "revision" | "new_topic" | "practice" | "gap_fill" | "challenge";

export interface Recommendation {
  id:             string;
  type:           RecommendationType;
  subject:        string;
  topic:          string;
  urgency:        "high" | "medium" | "low";
  reason:         string;    // human-readable explanation
  estimatedMins:  number;    // suggested study time
  generatedAt:    number;
}

export interface DailyPlan {
  recommendations: Recommendation[];
  totalMins:       number;
  sessionGoal:     string;   // motivating 1-line goal
  examCountdown:   number | null;
  updatedAt:       number;
}

/** Generate a fresh daily plan based on all student model data. */
export function generateDailyPlan(): DailyPlan {
  const recs: Recommendation[] = [];
  const now = Date.now();

  // 1. GAP_FILL — critical gaps block everything else
  const criticalGaps = getActiveGaps().filter((g) => g.severity === "critical").slice(0, 2);
  for (const gap of criticalGaps) {
    recs.push({
      id:            `gap-${gap.gapId}`,
      type:          "gap_fill",
      subject:       gap.subject,
      topic:         gap.topic,
      urgency:       "high",
      reason:        `You can't fully understand ${gap.affectedTopics[0] ?? "related topics"} until ${gap.topic} is stronger. Let's fix that.`,
      estimatedMins: 15,
      generatedAt:   now,
    });
  }

  // 2. REVISION — topics with retention < 60
  const revisionNeeded = getTopicsNeedingRevision(60).slice(0, 3);
  for (const entry of revisionNeeded) {
    const daysSince = Math.floor((now - entry.lastPracticed) / 86_400_000);
    recs.push({
      id:            `rev-${entry.topic.replace(/\s/g, "_")}`,
      type:          "revision",
      subject:       entry.subject,
      topic:         entry.topic,
      urgency:       entry.retentionScore < 40 ? "high" : "medium",
      reason:        `You studied ${entry.topic} ${daysSince} day${daysSince !== 1 ? "s" : ""} ago. A quick revision now will lock it in memory.`,
      estimatedMins: 10,
      generatedAt:   now,
    });
  }

  // 3. PRACTICE — topics where conceptual mastery < procedural
  const snap = getMasterySnapshot();
  const practiceTargets = Object.values(snap.profiles)
    .filter((p) => p.proceduralMastery >= 50 && p.conceptualMastery < p.proceduralMastery - 20)
    .slice(0, 2);
  for (const p of practiceTargets) {
    recs.push({
      id:            `prac-${p.topicKey}`,
      type:          "practice",
      subject:       p.subject,
      topic:         p.topic,
      urgency:       "medium",
      reason:        `You can solve ${p.topic} problems but may not fully understand WHY the method works. Let's strengthen that.`,
      estimatedMins: 12,
      generatedAt:   now,
    });
  }

  // 4. CHALLENGE — topics with high mastery ready for harder problems
  const challengeReady = getAllMasteryEntries()
    .filter((e) => e.masteryScore >= 80)
    .slice(0, 1);
  for (const entry of challengeReady) {
    recs.push({
      id:            `chal-${entry.topic.replace(/\s/g, "_")}`,
      type:          "challenge",
      subject:       entry.subject,
      topic:         entry.topic,
      urgency:       "low",
      reason:        `Your mastery on ${entry.topic} is strong (${entry.masteryScore}/100). Time to push to the next level.`,
      estimatedMins: 20,
      generatedAt:   now,
    });
  }

  // Limit and score by urgency
  const sorted = recs.sort((a, b) => {
    const u = { high: 3, medium: 2, low: 1 };
    return u[b.urgency] - u[a.urgency];
  }).slice(0, 5);

  const totalMins = sorted.reduce((s, r) => s + r.estimatedMins, 0);
  const velocity  = getLearningVelocity();
  const examDays  = daysUntilExam();
  const daysSince = getDaysSinceLastStudy();

  let sessionGoal = "Keep the momentum going — consistent practice beats cramming every time.";
  if (daysSince > 3)   sessionGoal = "Welcome back! Even 15 minutes today will make a big difference.";
  if (examDays !== null && examDays <= 14) sessionGoal = `${examDays} days to exam — every session counts now. Stay focused.`;
  if (velocity === "slow" && sorted.length > 0) sessionGoal = `Take your time on ${sorted[0].topic} — depth matters more than speed.`;

  return {
    recommendations: sorted,
    totalMins,
    sessionGoal,
    examCountdown: examDays,
    updatedAt:     now,
  };
}

/** Quick next-topic recommendation (for the home screen CTA). */
export function getQuickRecommendation(): Recommendation | null {
  const plan = generateDailyPlan();
  return plan.recommendations[0] ?? null;
}

/** Recommended session length in minutes based on student's attention span. */
export function getRecommendedSessionLength(): number {
  const { attentionSpanMinutes } = getEnrichedProfile();
  const bestTime = getBestStudyTimeLabel();
  // Evening and night sessions tend to be longer
  const bonus = bestTime === "evening" || bestTime === "night" ? 5 : 0;
  return Math.max(15, Math.min(60, attentionSpanMinutes + bonus));
}
