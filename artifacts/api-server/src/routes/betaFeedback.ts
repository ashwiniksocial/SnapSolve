/**
 * Controlled-beta feedback.
 *
 * POST /api/beta/feedback — signed-in tester submits one small feedback record.
 * GET  /api/beta/feedback — founder-only feedback list.
 *
 * Access to the list fails closed. ADMIN_EMAILS is preferred for server-side
 * authorization; VITE_ADMIN_EMAILS is accepted as a compatibility fallback for
 * the existing founder admin configuration.
 */

import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { desc } from "drizzle-orm";

import type { db as _DbType, betaFeedbackTable as _BfType } from "@workspace/db";

type TesterType = "student" | "parent";

interface FeedbackBody {
  testerType: TesterType;
  experienceRating: number;
  issueText?: string;
  likedText?: string;
  contextReference?: string;
}

function optionalText(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length <= maxLength ? trimmed || null : undefined;
}

function validateFeedbackBody(body: unknown): { data: FeedbackBody } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Request body must be a JSON object." };
  const source = body as Record<string, unknown>;
  const testerType = source.testerType;
  if (testerType !== "student" && testerType !== "parent") {
    return { error: "testerType must be student or parent." };
  }

  const experienceRating = Number(source.experienceRating);
  if (!Number.isInteger(experienceRating) || experienceRating < 1 || experienceRating > 5) {
    return { error: "experienceRating must be an integer from 1 to 5." };
  }

  const issueText = optionalText(source.issueText, 2000);
  const likedText = optionalText(source.likedText, 2000);
  const contextReference = optionalText(source.contextReference, 300);
  if (issueText === undefined || likedText === undefined || contextReference === undefined) {
    return { error: "Feedback text is too long or invalid." };
  }

  return {
    data: {
      testerType,
      experienceRating,
      ...(issueText ? { issueText } : {}),
      ...(likedText ? { likedText } : {}),
      ...(contextReference ? { contextReference } : {}),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbModule: any = null;

async function requireDb(): Promise<{
  db: typeof _DbType;
  betaFeedbackTable: typeof _BfType;
}> {
  if (dbModule) return dbModule as typeof dbModule;
  if (!process.env.DATABASE_URL) {
    throw Object.assign(new Error("DATABASE_URL is not configured on the server"), {
      code: "no_database",
    });
  }
  dbModule = await import("@workspace/db");
  return dbModule;
}

function sendDbError(res: import("express").Response, err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string }).code ?? "database_error";
  res.status(code === "no_database" ? 503 : 500).json({ error: code, message });
}

function configuredAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? process.env.VITE_ADMIN_EMAILS ?? "";
  return new Set(raw.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

async function isApprovedBetaUser(userId: string): Promise<boolean> {
  const rawList = (process.env.APPROVED_BETA_EMAILS ?? "").trim();
  // Match the existing beta-check contract: a deliberately empty list means
  // open-beta/development mode.
  if (!rawList) return true;

  const approved = new Set(
    rawList.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
  );
  const user = await clerkClient.users.getUser(userId);
  const primary = user.emailAddresses.find(
    (email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId,
  );
  return Boolean(primary && approved.has(primary.emailAddress.trim().toLowerCase()));
}

async function isFounderAdmin(userId: string): Promise<boolean> {
  const allowed = configuredAdminEmails();
  if (allowed.size === 0) return false;

  const user = await clerkClient.users.getUser(userId);
  const primary = user.emailAddresses.find(
    (email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId,
  );
  return Boolean(primary && allowed.has(primary.emailAddress.trim().toLowerCase()));
}

const router = Router();

router.post("/beta/feedback", async (req, res) => {
  const userId = getAuth(req).userId;
  if (!userId) { res.status(401).json({ error: "unauthenticated" }); return; }

  try {
    if (!(await isApprovedBetaUser(userId))) {
      res.status(403).json({ error: "beta_access_required" });
      return;
    }
  } catch (err) {
    req.log.warn({ err }, "beta feedback eligibility check failed");
    res.status(403).json({ error: "beta_access_required" });
    return;
  }

  const parsed = validateFeedbackBody(req.body);
  if ("error" in parsed) {
    res.status(400).json({ error: "validation_error", message: parsed.error });
    return;
  }

  let db: typeof _DbType;
  let betaFeedbackTable: typeof _BfType;
  try { ({ db, betaFeedbackTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const data = parsed.data;
  const [feedback] = await db.insert(betaFeedbackTable).values({
    clerkUserId: userId,
    testerType: data.testerType,
    experienceRating: data.experienceRating,
    issueText: data.issueText ?? null,
    likedText: data.likedText ?? null,
    contextReference: data.contextReference ?? null,
  }).returning();

  req.log.info({ userId, testerType: data.testerType, experienceRating: data.experienceRating }, "beta feedback submitted");
  res.status(201).json({ feedback });
});

router.get("/beta/feedback", async (req, res) => {
  const userId = getAuth(req).userId;
  if (!userId) { res.status(401).json({ error: "unauthenticated" }); return; }

  try {
    if (!(await isFounderAdmin(userId))) {
      res.status(403).json({ error: "forbidden" });
      return;
    }
  } catch (err) {
    req.log.warn({ err }, "beta feedback authorization failed");
    res.status(403).json({ error: "forbidden" });
    return;
  }

  let db: typeof _DbType;
  let betaFeedbackTable: typeof _BfType;
  try { ({ db, betaFeedbackTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const feedback = await db.select()
    .from(betaFeedbackTable)
    .orderBy(desc(betaFeedbackTable.createdAt));
  res.json({ feedback });
});

export default router;