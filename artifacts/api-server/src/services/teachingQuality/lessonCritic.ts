/**
 * Lesson Critic — types for the structured critique report.
 *
 * The actual critique is generated inside the lessonReviewer OpenAI call
 * (combined into one call for efficiency). This file owns the types so
 * both reviewer and improver can import them without circular dependencies.
 */

export type IssuePriority = "critical" | "high" | "medium";

export interface CriticalIssue {
  section:      string;         // which lesson section has the problem
  problem:      string;         // what exactly is wrong
  reason:       string;         // why it harms a weak student's understanding
  suggestedFix: string;         // specific text/approach to improve it
  priority:     IssuePriority;
}

export interface CriticReport {
  issues: CriticalIssue[];
}
