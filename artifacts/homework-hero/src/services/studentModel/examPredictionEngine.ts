/**
 * Exam Prediction Engine — predicts exam readiness and expected score.
 *
 * Computes:
 *  - Expected score per subject (0–100) based on mastery + retention
 *  - Exam readiness level (not_ready / developing / ready / confident)
 *  - Risk topics: most likely to cost marks in the exam
 *  - Days needed to reach the student's target score
 *  - Chapter-wise prediction (if data available)
 *
 * Formula:
 *   predictedScore = 0.5×avgMastery + 0.3×avgRetention + 0.2×consistencyBonus
 *
 * Firestore path: students/{id}/examPrediction
 */

import { getAllMasteryEntries }     from "./topicMastery";
import { getMasterySnapshot }       from "./masteryEngine";
import { getOrCreateProfile }       from "./studentProfile";
import { getEnrichedProfile, daysUntilExam } from "./studentProfileEngine";
import { getKnowledgeGapReport }    from "./knowledgeGapEngine";

export type ExamReadiness = "not_ready" | "developing" | "ready" | "confident";

export interface SubjectPrediction {
  subject:          string;
  predictedScore:   number;      // 0–100
  targetScore:      number;      // from student's goal
  gap:              number;      // targetScore − predictedScore (negative = on track)
  readiness:        ExamReadiness;
  riskTopics:       string[];    // topics likely to cost marks
  strongTopics:     string[];    // topics likely to earn marks
  daysToTarget:     number | null;  // estimated days of study needed
}

export interface ExamPrediction {
  subjects:           SubjectPrediction[];
  overallPrediction:  number;
  overallReadiness:   ExamReadiness;
  daysUntilExam:      number | null;
  examSurvivabilityScore: number;  // 0–100, probability of passing
  criticalActions:    string[];    // top 3 things to do before the exam
  updatedAt:          number;
}

function readinessFromScore(score: number, target: number): ExamReadiness {
  const ratio = score / target;
  if (ratio >= 0.95) return "confident";
  if (ratio >= 0.80) return "ready";
  if (ratio >= 0.60) return "developing";
  return "not_ready";
}

export function generateExamPrediction(): ExamPrediction {
  const allEntries    = getAllMasteryEntries();
  const snap          = getMasterySnapshot();
  const profile       = getOrCreateProfile();
  const enriched      = getEnrichedProfile();
  const gapReport     = getKnowledgeGapReport();
  const examDays      = daysUntilExam();
  const SUBJECTS      = ["Mathematics", "Physics", "Chemistry"];

  const subjects: SubjectPrediction[] = SUBJECTS.map((subj) => {
    const entries  = allEntries.filter((e) => e.subject === subj);
    const profiles = Object.values(snap.profiles).filter((p) => p.subject === subj);

    if (entries.length === 0) {
      return {
        subject: subj, predictedScore: 40, targetScore: enriched.subjectGoals[subj] ?? enriched.targetScore,
        gap: (enriched.subjectGoals[subj] ?? enriched.targetScore) - 40,
        readiness: "not_ready", riskTopics: [], strongTopics: [], daysToTarget: null,
      };
    }

    const avgMastery    = entries.reduce((s, e) => s + e.masteryScore, 0) / entries.length;
    const avgRetention  = entries.reduce((s, e) => s + e.retentionScore, 0) / entries.length;
    const consistencyBonus = profile.consistencyScore * 0.5;

    const predictedScore = Math.min(100, Math.round(
      avgMastery * 0.5 + avgRetention * 0.3 + consistencyBonus * 0.2
    ));

    const targetScore  = enriched.subjectGoals[subj] ?? enriched.targetScore;
    const gap          = targetScore - predictedScore;

    const riskTopics   = entries.filter((e) => e.masteryScore < 50).map((e) => e.topic).slice(0, 3);
    const strongTopics = entries.filter((e) => e.masteryScore >= 75).map((e) => e.topic).slice(0, 3);

    // Rough estimate: each +5 score needs ~2 days of focused study
    const daysToTarget = gap > 0 ? Math.ceil((gap / 5) * 2) : 0;

    return {
      subject: subj,
      predictedScore,
      targetScore,
      gap,
      readiness: readinessFromScore(predictedScore, targetScore),
      riskTopics,
      strongTopics,
      daysToTarget: gap > 0 ? daysToTarget : null,
    };
  });

  const overallPrediction = Math.round(
    subjects.reduce((s, p) => s + p.predictedScore, 0) / subjects.length
  );
  const overallTarget = enriched.targetScore;
  const overallReadiness = readinessFromScore(overallPrediction, overallTarget);

  // Survivability: can they pass?
  const criticalGapCount = gapReport.criticalGapCount;
  const examSurvivabilityScore = Math.min(100, Math.max(0,
    overallPrediction - criticalGapCount * 10
  ));

  // Critical actions (top 3)
  const criticalActions: string[] = [];
  const worstSubject = subjects.sort((a, b) => a.predictedScore - b.predictedScore)[0];
  if (worstSubject && worstSubject.predictedScore < 50) {
    criticalActions.push(`Focus on ${worstSubject.subject} — it needs the most work before the exam.`);
  }
  if (gapReport.mostUrgentGap) {
    criticalActions.push(`Close the ${gapReport.mostUrgentGap.topic} gap — it's blocking multiple other topics.`);
  }
  if (examDays !== null && examDays <= 14 && overallReadiness !== "confident") {
    criticalActions.push("Daily revision sessions for the next 2 weeks — even 20 minutes per day will move your score significantly.");
  }
  if (criticalActions.length === 0) {
    criticalActions.push("Keep solving 5+ questions a day and review any mistakes immediately.");
  }

  return {
    subjects,
    overallPrediction,
    overallReadiness,
    daysUntilExam: examDays,
    examSurvivabilityScore,
    criticalActions,
    updatedAt: Date.now(),
  };
}

export function getSubjectPrediction(subject: string): SubjectPrediction | null {
  return generateExamPrediction().subjects.find((s) => s.subject === subject) ?? null;
}
