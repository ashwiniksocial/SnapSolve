export function isBetaEmailApproved(
  email: string | null | undefined,
  approvedEmailsValue: string | undefined,
  founderEmailValue: string | undefined,
  nodeEnv: string | undefined,
): boolean {
  const normalizedEmail = email?.trim().toLowerCase() ?? "";
  const rawApprovedEmails = approvedEmailsValue?.trim() ?? "";

  // Preserve the existing open-beta contract when no general list is configured.
  if (!rawApprovedEmails) return true;
  if (!normalizedEmail) return false;

  const approvedEmails = new Set(
    rawApprovedEmails.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean),
  );
  if (approvedEmails.has(normalizedEmail)) return true;

  // A single founder can test the development preview without changing the
  // general allowlist. This never grants access in production or test builds.
  const founderEmail = founderEmailValue?.trim().toLowerCase() ?? "";
  return nodeEnv === "development" && !!founderEmail && normalizedEmail === founderEmail;
}
