export type QualityReviewStatus = "PASS" | "IMPROVE" | "REVIEW_REQUIRED" | "BLOCK";

export function mayPersistQualityStatus(
  status: QualityReviewStatus,
  passOnly: boolean,
): boolean {
  return status === "PASS" || (!passOnly && status === "IMPROVE");
}
