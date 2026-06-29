/**
 * Lesson Evaluation Framework — Orchestrator.
 *
 * Developer tool only. Evaluates a LessonResponse against the
 * SnapSolve Teaching Standards and returns a structured EvaluationReport.
 *
 * Usage:
 *   import { evaluateLesson } from "./services/lessonEvaluator";
 *   const report = evaluateLesson(lesson, "Mathematics");
 *
 * Never call this from student-facing routes. It is wired exclusively to
 * POST /api/dev/evaluateLesson which returns 403 in production.
 */

import type { LessonResponse } from "../../lib/lessonTypes";
import type { DimensionScore, EvaluationReport } from "./types";
import {
  scoreConceptClarity,
  scoreReasoningCompleteness,
  scoreStepContinuity,
  scoreWeakStudentComprehension,
  scoreVocabularySimplicity,
  scoreAnalogyQuality,
  scoreMisconceptionPrevention,
  scoreCognitiveLoad,
  scorePracticeQuality,
  scoreConfidenceBuilding,
} from "./dimensions";

export type { EvaluationReport, DimensionScore, Deduction } from "./types";

// ─── Grading ─────────────────────────────────────────────────────────────────

function grade(score: number): EvaluationReport["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 45) return "D";
  return "F";
}

// ─── Summary narrative ────────────────────────────────────────────────────────

function buildSummary(dimensions: DimensionScore[], overall: number): string {
  const sorted  = [...dimensions].sort((a, b) => a.score - b.score);
  const worst   = sorted[0];
  const best    = sorted[sorted.length - 1];
  const critical = dimensions.flatMap(d => d.deductions.filter(x => x.severity === "critical"));

  if (critical.length > 0) {
    return (
      `This lesson has ${critical.length} critical issue(s) that block effective teaching — ` +
      `students will not be able to follow the lesson as-is. ` +
      `The weakest dimension is ${worst.name} (${worst.score}/10). ` +
      `Address all critical deductions before reviewing minor issues.`
    );
  }
  if (overall >= 80) {
    return (
      `This is a strong lesson (${overall}/100). ` +
      `${best.name} is the standout section (${best.score}/10). ` +
      `The primary opportunity for improvement is ${worst.name} (${worst.score}/10) — ` +
      `addressing the major deductions there will push this to an A-grade lesson.`
    );
  }
  return (
    `This lesson scores ${overall}/100 and needs work in several dimensions. ` +
    `The weakest section is ${worst.name} (${worst.score}/10) and should be the first priority. ` +
    `Review all major deductions, update the generation prompt, and re-evaluate.`
  );
}

// ─── Prompt guidance (top 5 actionable improvements) ─────────────────────────

function buildPromptGuidance(dimensions: DimensionScore[]): string[] {
  return dimensions
    .flatMap(d =>
      d.deductions
        .filter(x => x.severity === "critical" || x.severity === "major")
        .map(x => ({ dimName: d.name, ...x }))
    )
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map(x => `[${x.dimName} · ${x.severity}] ${x.suggestion}`);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Evaluate a parsed LessonResponse against the SnapSolve Teaching Standards.
 *
 * Pure function — no I/O, no AI calls, no side-effects.
 * Returns a fully structured EvaluationReport.
 */
export function evaluateLesson(lesson: LessonResponse, subject: string): EvaluationReport {
  const dimensions: DimensionScore[] = [
    scoreConceptClarity(lesson),
    scoreReasoningCompleteness(lesson),
    scoreStepContinuity(lesson),
    scoreWeakStudentComprehension(lesson),
    scoreVocabularySimplicity(lesson),
    scoreAnalogyQuality(lesson),
    scoreMisconceptionPrevention(lesson),
    scoreCognitiveLoad(lesson),
    scorePracticeQuality(lesson),
    scoreConfidenceBuilding(lesson),
  ];

  // overallScore: average of 10 dimension scores (each 0–10) → 0–100
  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length * 10
  );

  const criticalIssues = dimensions.flatMap(d =>
    d.deductions
      .filter(x => x.severity === "critical")
      .map(x => `[${d.name}] ${x.section}: ${x.issue}`)
  );

  return {
    lessonTopic:    lesson.topic,
    subject,
    overallScore,
    grade:          grade(overallScore),
    dimensions,
    criticalIssues,
    promptGuidance: buildPromptGuidance(dimensions),
    summary:        buildSummary(dimensions, overallScore),
    evaluatedAt:    new Date().toISOString(),
  };
}
