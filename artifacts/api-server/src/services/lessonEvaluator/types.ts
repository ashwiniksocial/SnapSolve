/**
 * Lesson Evaluation Framework — Type definitions.
 *
 * Developer tool only. Never imported by student-facing code.
 */

export type Severity = "critical" | "major" | "minor";

/**
 * A single finding within a dimension.
 * `section`    — exact dot-path into the LessonResponse (e.g. "lesson.vocabulary[1].meaning")
 * `issue`      — what is wrong and why it weakens the lesson
 * `suggestion` — a concrete, copy-pasteable rewrite prompt developers can use
 * `severity`   — "critical" blocks effective teaching; "major" noticeably hurts quality; "minor" is a polish issue
 * `points`     — points deducted from the dimension's 10-point budget
 */
export interface Deduction {
  section:    string;
  issue:      string;
  suggestion: string;
  severity:   Severity;
  points:     number;
}

/** One of the 10 teaching-standard dimensions. Score = 10 − sum(deduction.points), clamped to [0, 10]. */
export interface DimensionScore {
  name:       string;
  score:      number;
  maxScore:   10;
  deductions: Deduction[];
}

/**
 * Full evaluation report for one lesson.
 * `overallScore`    — 0–100 (average of 10 dimension scores × 10)
 * `grade`           — letter grade derived from overallScore
 * `criticalIssues`  — human-readable list of every "critical" deduction (the blocking problems)
 * `promptGuidance`  — top 5 actionable suggestions for improving the generation prompt
 * `summary`         — 2–3 sentence narrative developers can read at a glance
 */
export interface EvaluationReport {
  lessonTopic:    string;
  subject:        string;
  overallScore:   number;
  grade:          "A" | "B" | "C" | "D" | "F";
  dimensions:     DimensionScore[];
  criticalIssues: string[];
  promptGuidance: string[];
  summary:        string;
  evaluatedAt:    string;
}
