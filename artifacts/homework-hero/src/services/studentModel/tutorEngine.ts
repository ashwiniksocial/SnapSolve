/**
 * Tutor Engine — the master intelligence layer.
 *
 * Orchestrates ALL other engines and produces:
 *  1. A complete TutorProfile snapshot of the student
 *  2. A rich AI context string (far more detailed than the base adaptationEngine)
 *  3. A daily learning plan
 *  4. A "What your tutor says today" message for the home screen
 *  5. Session start/end hooks that update all engines in one call
 *
 * This is the ONLY file most of the app should import from.
 * Individual engines are internal implementation details.
 *
 * Firestore path: students/{id}/tutorProfile (snapshot, regenerated on demand)
 */

import { getOrCreateProfile, recordQuestionAnswered } from "./studentProfile";
import { getEnrichedProfile, recomputeTraits, daysUntilExam } from "./studentProfileEngine";
import { getBehaviorSignals, recordSessionBehavior } from "./behaviorEngine";
import { getLearningStyle, recomputeLearningStyle, describeLearningStyle } from "./learningStyleEngine";
import { getKnowledgeGapReport, recomputeFoundationalGaps, getCriticalGaps } from "./knowledgeGapEngine";
import { getMasterySnapshot, recomputeMasterySnapshot } from "./masteryEngine";
import { generateDailyPlan, getRecommendedSessionLength } from "./recommendationEngine";
import { generateExamPrediction } from "./examPredictionEngine";
import { generateDailyReflection, recordMilestone, getMilestones } from "./reflectionEngine";
import { getAllMasteryEntries, getWeakTopics } from "./topicMastery";
import { getTutorInsights, buildStudentContext } from "./adaptationEngine";
import { getLearningVelocity, getBestStudyTimeLabel, getDaysSinceLastStudy } from "./studyPatterns";
import { getAllPersistentMistakes } from "./mistakeEngine";
import { recordSession } from "./studyPatterns";
import type { SessionRecord } from "./syncManager";

// ── TutorProfile ──────────────────────────────────────────────────────────────

export interface TutorProfile {
  // Identity
  studentId:         string;
  archetype:         string;
  learningStyle:     string;    // plain English description
  primaryStyleLabel: string;

  // Performance snapshot
  globalMastery:     number;
  subjectMastery:    Record<string, number>;
  weakTopics:        string[];
  criticalGapCount:  number;

  // Motivation
  currentStreak:     number;
  motivationScore:   number;
  consistencyScore:  number;
  daysActive:        number;
  totalStudyHours:   number;

  // Exam
  examCountdown:     number | null;
  predictedScore:    number;
  examReadiness:     string;

  // Behavioural
  learningVelocity:  string;
  bestStudyTime:     string;
  attentionSpan:     number;    // minutes
  practiceOriented:  boolean;

  // Plan
  todayGoal:         string;
  nextRecommendation: string | null;
  recommendedSessionMins: number;

  generatedAt: number;
}

export function getTutorProfile(): TutorProfile {
  const base     = getOrCreateProfile();
  const enriched = getEnrichedProfile();
  const style    = getLearningStyle();
  const snap     = recomputeMasterySnapshot();
  const insights = getTutorInsights();
  const plan     = generateDailyPlan();
  const exam     = generateExamPrediction();

  return {
    studentId:           base.studentId,
    archetype:           enriched.archetype,
    learningStyle:       describeLearningStyle(),
    primaryStyleLabel:   style.primaryStyle,
    globalMastery:       snap.globalAverage,
    subjectMastery:      snap.subjectAverages,
    weakTopics:          insights.weakTopics,
    criticalGapCount:    getKnowledgeGapReport().criticalGapCount,
    currentStreak:       base.currentStreak,
    motivationScore:     base.motivationScore,
    consistencyScore:    base.consistencyScore,
    daysActive:          base.totalQuestionsAnswered, // proxy for days active
    totalStudyHours:     Math.round(base.totalStudyTimeMs / 3_600_000 * 10) / 10,
    examCountdown:       daysUntilExam(),
    predictedScore:      exam.overallPrediction,
    examReadiness:       exam.overallReadiness,
    learningVelocity:    getLearningVelocity(),
    bestStudyTime:       getBestStudyTimeLabel(),
    attentionSpan:       enriched.attentionSpanMinutes,
    practiceOriented:    getBehaviorSignals().practiceAttemptRate >= 0.5,
    todayGoal:           plan.sessionGoal,
    nextRecommendation:  plan.recommendations[0]?.reason ?? null,
    recommendedSessionMins: getRecommendedSessionLength(),
    generatedAt: Date.now(),
  };
}

// ── Rich AI Context ───────────────────────────────────────────────────────────

/**
 * Builds the richest possible student context for the AI prompt.
 * Much more detailed than adaptationEngine.buildStudentContext().
 * Use this when OPENAI_API_KEY is available and personalization matters.
 */
export function buildRichStudentContext(subject: string, topic?: string): string {
  const base     = buildStudentContext(subject, topic);
  if (!base) return ""; // new student — no profile yet

  const enriched  = getEnrichedProfile();
  const style     = getLearningStyle();
  const behavior  = getBehaviorSignals();
  const gaps      = getCriticalGaps();
  const mistakes  = getAllPersistentMistakes().slice(0, 3);

  const additions: string[] = [];

  // Learning style
  if (style.sessionsAnalysed >= 5) {
    additions.push(`- Learning style: ${describeLearningStyle()}`);
    if (style.mustIncludeSections.length > 0) {
      additions.push(`- Sections this student ALWAYS reads: ${style.mustIncludeSections.join(", ")}. Make these sections especially rich.`);
    }
  }

  // Archetype
  const archetypeHints: Record<string, string> = {
    methodical:     "This student is methodical — they read every word. Do NOT skip any step.",
    sprinter:       "This student is a sprinter — they want the key idea fast, then the steps. Lead with the core insight.",
    anxious:        "This student is anxious — extra encouragement throughout. Every 2-3 sentences add an affirming phrase.",
    overconfident:  "This student skips steps. Explicitly warn where rushing causes errors.",
    explorer:       "This student loves depth — include the deeperExplanation and all analogies.",
    unknown:        "",
  };
  const hint = archetypeHints[enriched.archetype];
  if (hint) additions.push(`- Learner archetype: ${hint}`);

  // Critical gaps
  if (gaps.length > 0 && topic) {
    const relevantGap = gaps.find((g) => g.affectedTopics.includes(topic));
    if (relevantGap) {
      additions.push(`- CRITICAL GAP: The student has not mastered "${relevantGap.topic}" which is a prerequisite. Re-explain any connection to ${relevantGap.topic} from scratch.`);
    }
  }

  // Hesitation
  if (behavior.avgHesitationMs > 30_000) {
    additions.push("- This student often hesitates before reading — they find the question daunting. Open with a reassuring framing before diving into content.");
  }

  // Abandonment
  if (behavior.abandonmentCount > 2) {
    additions.push("- This student has abandoned sessions when overwhelmed. Keep each section concise and end with an encouraging transition.");
  }

  // Persistent mistakes (global)
  if (mistakes.length > 0) {
    additions.push(`- Globally repeated mistakes: ${mistakes.map((m) => m.description).join(" | ")}`);
  }

  // Exam countdown urgency
  const examDays = daysUntilExam();
  if (examDays !== null && examDays <= 14) {
    additions.push(`- EXAM IN ${examDays} DAYS. Focus on exam technique, common question patterns, and mark-scoring steps. Less theory, more applied strategy.`);
  }

  if (additions.length === 0) return base;
  return `${base}\n${additions.join("\n")}`;
}

// ── Daily Tutor Message ───────────────────────────────────────────────────────

/**
 * A single personalised sentence for the home screen.
 * Changes based on the student's current state.
 */
export function getDailyTutorMessage(): { icon: string; message: string; color: string } {
  const base      = getOrCreateProfile();
  const plan      = generateDailyPlan();
  const daysSince = getDaysSinceLastStudy();
  const examDays  = daysUntilExam();
  const milestone = getMilestones().slice(-1)[0];

  if (milestone && Date.now() - milestone.achievedAt < 24 * 3_600_000) {
    return { icon: "🏆", message: `Milestone unlocked: ${milestone.description}`, color: "text-amber-700" };
  }
  if (examDays !== null && examDays <= 3) {
    return { icon: "🔔", message: `Exam in ${examDays} day${examDays !== 1 ? "s" : ""}! Stay calm, trust your preparation.`, color: "text-red-700" };
  }
  if (daysSince > 4) {
    return { icon: "👋", message: `${daysSince} days since your last session. Your tutor missed you — let's get back on track.`, color: "text-indigo-700" };
  }
  if (base.currentStreak >= 7) {
    return { icon: "🔥", message: `${base.currentStreak}-day streak! You're building a habit that will last.`, color: "text-orange-700" };
  }
  if (plan.recommendations.length > 0) {
    const rec = plan.recommendations[0];
    return { icon: "📚", message: `Today's focus: ${rec.topic} — ${rec.reason}`, color: "text-violet-700" };
  }
  return { icon: "✦", message: "Your tutor is ready. Every question you solve makes the next one easier.", color: "text-slate-700" };
}

// ── Session lifecycle hooks ───────────────────────────────────────────────────

export interface SessionStartData {
  topic:   string;
  subject: string;
}

export interface SessionEndData extends SessionRecord {
  sectionsOpenedWithDwellMs?: Record<string, number>;
  depthSwitched?: boolean;
  hesitationMs?:  number;
}

/** Call at the start of a study session. Returns sessionId. */
export function onSessionStart(_data: SessionStartData): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

/** Call at the end of a study session. Updates ALL engines. */
export function onSessionEnd(data: SessionEndData): void {
  // Core session record
  recordSession(data);
  recordQuestionAnswered(data.durationMs, data.depthUsed);

  // Behavior signals
  recordSessionBehavior({
    topic:          data.topic,
    durationMs:     data.durationMs,
    sectionsOpened: data.sectionsOpened,
    depthSwitched:  data.depthSwitched ?? false,
    hesitationMs:   data.hesitationMs ?? 0,
  });

  // Recompute derived state
  const entries = getAllMasteryEntries();
  recomputeFoundationalGaps();
  recomputeLearningStyle();
  recomputeMasterySnapshot();

  // Trait update (attention span, processing speed, cognitive load)
  recomputeTraits(
    data.durationMs,
    data.durationMs / Math.max(1, data.conceptualTotal || 1),
    data.sectionsOpened.length
  );

  // Daily reflection
  generateDailyReflection();

  // Check for milestones
  const topicEntry = entries.find((e) => e.topic === data.topic && e.subject === data.subject);
  if (topicEntry && topicEntry.masteryScore >= 70) {
    recordMilestone({
      topic:       data.topic,
      subject:     data.subject,
      type:        "first_mastered",
      description: `Mastered ${data.topic} (${topicEntry.masteryScore}/100)`,
    });
  }
}
