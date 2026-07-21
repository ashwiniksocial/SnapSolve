/**
 * GET /api/beta/check
 *
 * Returns { approved: boolean } for the authenticated caller.
 * Never exposes the allowlist contents in responses or logs.
 *
 * APPROVED_BETA_EMAILS — server-only env var, comma-separated list of
 * approved email addresses.  If unset or empty, all authenticated users
 * are approved (open-beta / development mode).
 */

import { Router }      from "express";
import { getAuth, clerkClient } from "@clerk/express";

const router = Router();

router.get("/beta/check", async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }

  const rawList = (process.env.APPROVED_BETA_EMAILS ?? "").trim();

  // No list configured → open beta; approve all authenticated users.
  if (!rawList) {
    res.json({ approved: true });
    return;
  }

  const approvedEmails = new Set(
    rawList.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
  );

  try {
    // clerkClient is a pre-instantiated singleton in @clerk/express v2
    const user = await clerkClient.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (e: { id: string; emailAddress: string }) =>
        e.id === user.primaryEmailAddressId,
    );
    const email = (primary?.emailAddress ?? "").toLowerCase();
    res.json({ approved: Boolean(email && approvedEmails.has(email)) });
  } catch (err) {
    req.log.warn({ err }, "beta/check: failed to fetch Clerk user");
    res.json({ approved: false });
  }
});

export default router;
