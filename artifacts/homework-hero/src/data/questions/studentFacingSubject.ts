/**
 * Student-facing Beta Science is the union of these native bank domains.
 * Earth Science remains intentionally outside the Beta Science aggregation.
 */
export const BETA_SCIENCE_DOMAINS = ["Physics", "Chemistry", "Biology"] as const;

export function getStudentFacingSubject(subject: string): string {
  return BETA_SCIENCE_DOMAINS.includes(subject as typeof BETA_SCIENCE_DOMAINS[number])
    ? "Science"
    : subject;
}