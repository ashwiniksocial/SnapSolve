/**
 * Student profile routes — cloud sync for board / class / display name.
 *
 * GET /api/profile  — fetch (or auto-create) the authenticated user's profile
 * PUT /api/profile  — upsert board, classLevel, displayName
 *
 * Requires Clerk session cookie from the browser.
 * Returns 401 when not authenticated, 503 when DATABASE_URL is absent.
 * The rest of the app falls back to localStorage in both cases.
 */

import { Router }     from "express";
import { getAuth }    from "@clerk/express";
import { eq }         from "drizzle-orm";

import type { db as _DbType, studentProfilesTable as _SpType } from "@workspace/db";

// ─── Lazy DB (same pattern as admin.ts) ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mod: any = null;

async function requireDb(): Promise<{
  db:                    typeof _DbType;
  studentProfilesTable:  typeof _SpType;
}> {
  if (_mod) return _mod as typeof _mod;
  if (!process.env.DATABASE_URL) {
    throw Object.assign(
      new Error("DATABASE_URL is not configured on the server"),
      { code: "no_database" },
    );
  }
  _mod = await import("@workspace/db");
  return _mod;
}

function sendDbError(res: import("express").Response, err: unknown) {
  const msg    = err instanceof Error ? err.message : String(err);
  const code   = (err as { code?: string }).code ?? "database_error";
  const status = code === "no_database" ? 503 : 500;
  res.status(status).json({ error: code, message: msg });
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

// ── GET /profile ──────────────────────────────────────────────────────────────

router.get("/profile", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  let db: typeof _DbType;
  let studentProfilesTable: typeof _SpType;
  try { ({ db, studentProfilesTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  let rows = await db
    .select()
    .from(studentProfilesTable)
    .where(eq(studentProfilesTable.clerkUserId, userId))
    .limit(1);

  if (rows.length === 0) {
    // Auto-create empty profile on first fetch
    const inserted = await db
      .insert(studentProfilesTable)
      .values({ clerkUserId: userId })
      .returning();
    rows = inserted;
  }

  const p = rows[0];
  req.log.info({ userId }, "profile: fetched");
  res.json({
    board:       p.board,
    classLevel:  p.classLevel,
    displayName: p.displayName,
  });
});

// ── PUT /profile ──────────────────────────────────────────────────────────────

router.put("/profile", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const body = req.body as {
    board?:       string | null;
    classLevel?:  number | null;
    displayName?: string | null;
  };

  let db: typeof _DbType;
  let studentProfilesTable: typeof _SpType;
  try { ({ db, studentProfilesTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if ("board"       in body) set["board"]       = body.board       ?? null;
  if ("classLevel"  in body) set["classLevel"]  = body.classLevel  ?? null;
  if ("displayName" in body) set["displayName"] = body.displayName ?? null;

  await db
    .insert(studentProfilesTable)
    .values({ clerkUserId: userId, ...(set as object) })
    .onConflictDoUpdate({
      target: studentProfilesTable.clerkUserId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set:    set as any,
    });

  req.log.info({ userId, keys: Object.keys(set) }, "profile: updated");
  res.json({ ok: true });
});

export default router;
