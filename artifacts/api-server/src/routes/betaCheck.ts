/**
 * GET /api/beta/check
 *
 * Returns { approved: boolean } for the authenticated caller.
 * Never exposes the allowlist contents in responses or logs.
 *
 * APPROVED_BETA_EMAILS — server-only env var, comma-separated list of
 * approved email addresses. If unset or empty, authenticated users are
 * approved (the existing open-beta contract). FOUNDER_BETA_EMAIL grants
 * one additional Clerk-verified email access in development only.
 */

import { Router }      from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { isBetaEmailApproved } from "../lib/betaAccess";

const router = Router();

router.get("/beta/check", async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }

  const rawList = process.env.APPROVED_BETA_EMAILS;

  // No list configured → open beta; approve all authenticated users.
  if (!(rawList ?? "").trim()) {
    res.json({ approved: true });
    return;
  }

  try {
    // clerkClient is a pre-instantiated singleton in @clerk/express v2
    const user = await clerkClient.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (e: { id: string; emailAddress: string }) =>
        e.id === user.primaryEmailAddressId,
    );
    res.json({
      approved: isBetaEmailApproved(
        primary?.emailAddress,
        rawList,
        process.env.FOUNDER_BETA_EMAIL,
        process.env.NODE_ENV,
      ),
    });
  } catch (err) {
    req.log.warn({ err }, "beta/check: failed to fetch Clerk user");
    res.json({ approved: false });
  }
});

export default router;
