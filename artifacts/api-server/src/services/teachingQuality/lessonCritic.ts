/**
 * Lesson Critic — types for the structured critique report.
 *
 * The actual critique is generated inside the lessonReviewer OpenAI call
 * (combined into one call for efficiency). This file owns the types so
 * both reviewer and improver can import them without circular dependencies.
 */

export type IssuePriority = "critical" | "high" | "medium";
export type FindingType = "missing" | "late" | "unclear" | "incorrect";
export type StudentLessonMode = "Detailed" | "Standard" | "Compact";

export interface ReviewEvidence {
  section: string;
  quote: string;
}

export interface CriticalIssue {
  section:         string;         // student-visible section affected
  findingType:     FindingType;    // missing, late, unclear, or incorrect
  mode:            StudentLessonMode;
  evidence:        ReviewEvidence[];
  reviewedSections: string[];      // complete visible order checked for this finding
  problem:         string;         // what exactly is wrong
  reason:          string;         // why it harms a weak student's understanding
  suggestedFix:    string;         // specific text/approach to improve it
  priority:        IssuePriority;
}

export interface CriticReport {
  issues: CriticalIssue[];
}
