export type QualityReviewStatus = "PASS" | "IMPROVE";

export function mayPersistQualityStatus(
  status: QualityReviewStatus,
  passOnly: boolean,
): boolean {
  return !passOnly || status === "PASS";
}
