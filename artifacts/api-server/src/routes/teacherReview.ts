/**
 * Teacher Review routes
 *
 * POST   /api/reviews          — submit a new teacher review (auth required)
 * GET    /api/reviews          — list reviews (filters: subject, topic, verdict)
 * GET    /api/reviews/stats    — aggregate stats per topic (used by confidence engine)
 * GET    /api/reviews/:id      — single review
 * DELETE /api/reviews/:id      — delete own review (auth required, own review only)
 *
 * Confidence boost contract (GET /api/reviews/stats):
 *   { topic, subject, totalReviews, correctPct, partialPct, incorrectPct,
 *     avgAdjustedConfidence, confidenceBoost }
 *   confidenceBoost is -15 to +15, applied by the frontend confidence engine.
 */

import { Router }    from "express";
import { getAuth }   from "@clerk/express";
import { eq, and, desc, sql } from "drizzle-orm";

import type {
  db                  as _DbType,
  teacherReviewsTable as _TrType,
} from "@workspace/db";

// ─── Types ───────────────────────────────────────────────────────────────────

type Verdict = "correct" | "partially_correct" | "incorrect";

const VALID_VERDICTS: Verdict[] = ["correct", "partially_correct", "incorrect"];
const VALID_SOURCES = ["bank", "openai", "fallback"];

interface SubmitBody {
  solutionId:         string;
  questionText:       string;
  subject:            string;
  topic:              string;
  solutionSource?:    string;
  verdict:            Verdict;
  comment?:           string;
  verificationScore?: number;
  confidenceScore?:   number;
  adjustedConfidence?: number;
  reviewerName?:      string;
}

function validateSubmitBody(body: unknown): { data: SubmitBody } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Request body must be a JSON object." };
  const b = body as Record<string, unknown>;

  if (!b["solutionId"]  || typeof b["solutionId"]  !== "string") return { error: "solutionId is required." };
  if (!b["questionText"] || typeof b["questionText"] !== "string") return { error: "questionText is required." };
  if (!b["subject"]      || typeof b["subject"]      !== "string") return { error: "subject is required." };
  if (!b["topic"]        || typeof b["topic"]        !== "string") return { error: "topic is required." };
  if (!b["verdict"]      || !VALID_VERDICTS.includes(b["verdict"] as Verdict)) {
    return { error: `verdict must be one of: ${VALID_VERDICTS.join(", ")}` };
  }
  if (b["comment"] !== undefined && typeof b["comment"] !== "string") return { error: "comment must be a string." };
  if (b["comment"] && (b["comment"] as string).length > 2000) return { error: "comment must be ≤2000 chars." };
  if (b["solutionSource"] !== undefined && b["solutionSource"] !== null &&
      !VALID_SOURCES.includes(b["solutionSource"] as string)) {
    return { error: `solutionSource must be one of: ${VALID_SOURCES.join(", ")}` };
  }
  const numFields: Array<keyof SubmitBody> = ["verificationScore", "confidenceScore", "adjustedConfidence"];
  for (const f of numFields) {
    if (b[f] !== undefined && b[f] !== null) {
      const n = Number(b[f]);
      if (!Number.isInteger(n) || n < 0 || n > 100) return { error: `${f} must be an integer 0–100.` };
    }
  }

  return {
    data: {
      solutionId:         b["solutionId"]  as string,
      questionText:       b["questionText"] as string,
      subject:            b["subject"]      as string,
      topic:              b["topic"]        as string,
      solutionSource:     b["solutionSource"] as string | undefined,
      verdict:            b["verdict"]      as Verdict,
      comment:            b["comment"]      as string | undefined,
      verificationScore:  b["verificationScore"]  != null ? Number(b["verificationScore"])  : undefined,
      confidenceScore:    b["confidenceScore"]    != null ? Number(b["confidenceScore"])    : undefined,
      adjustedConfidence: b["adjustedConfidence"] != null ? Number(b["adjustedConfidence"]) : undefined,
      reviewerName:       b["reviewerName"] as string | undefined,
    },
  };
}

// ─── Lazy DB ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mod: any = null;

async function requireDb(): Promise<{
  db:                   typeof _DbType;
  teacherReviewsTable:  typeof _TrType;
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

// ── POST /reviews ─────────────────────────────────────────────────────────────

router.post("/reviews", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const parsed = validateSubmitBody(req.body);
  if ("error" in parsed) {
    res.status(400).json({ error: "validation_error", message: parsed.error });
    return;
  }

  let db: typeof _DbType;
  let teacherReviewsTable: typeof _TrType;
  try { ({ db, teacherReviewsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const data = parsed.data;

  // Derive adjustedConfidence from verdict if not explicitly set
  const adjustedConfidence =
    data.adjustedConfidence ??
    (data.verdict === "correct"           ? 88 :
     data.verdict === "partially_correct" ? 55 : 20);

  const [row] = await db
    .insert(teacherReviewsTable)
    .values({
      solutionId:         data.solutionId,
      questionText:       data.questionText,
      subject:            data.subject,
      topic:              data.topic,
      solutionSource:     data.solutionSource ?? null,
      reviewerClerkId:    userId,
      reviewerName:       data.reviewerName   ?? null,
      verdict:            data.verdict,
      comment:            data.comment        ?? null,
      verificationScore:  data.verificationScore  ?? null,
      confidenceScore:    data.confidenceScore    ?? null,
      adjustedConfidence,
    })
    .returning();

  req.log.info({ userId, solutionId: data.solutionId, verdict: data.verdict }, "review: submitted");
  res.status(201).json(row);
});

// ── GET /reviews/stats ─────────────────────────────────────────────────────────

router.get("/reviews/stats", async (req, res) => {
  const { subject, topic } = req.query as Record<string, string>;

  let db: typeof _DbType;
  let teacherReviewsTable: typeof _TrType;
  try { ({ db, teacherReviewsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [];
  if (subject) conditions.push(eq(teacherReviewsTable.subject, subject));
  if (topic)   conditions.push(eq(teacherReviewsTable.topic,   topic));

  const rows = await db
    .select({
      topic:              teacherReviewsTable.topic,
      subject:            teacherReviewsTable.subject,
      totalReviews:       sql<number>`count(*)::int`,
      correctCount:       sql<number>`sum(case when ${teacherReviewsTable.verdict} = 'correct' then 1 else 0 end)::int`,
      partialCount:       sql<number>`sum(case when ${teacherReviewsTable.verdict} = 'partially_correct' then 1 else 0 end)::int`,
      incorrectCount:     sql<number>`sum(case when ${teacherReviewsTable.verdict} = 'incorrect' then 1 else 0 end)::int`,
      avgAdjustedConf:    sql<number>`round(avg(${teacherReviewsTable.adjustedConfidence}))::int`,
    })
    .from(teacherReviewsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(teacherReviewsTable.topic, teacherReviewsTable.subject);

  const stats = rows.map((r) => {
    const total        = r.totalReviews || 1;
    const correctPct   = Math.round((r.correctCount   / total) * 100);
    const partialPct   = Math.round((r.partialCount   / total) * 100);
    const incorrectPct = Math.round((r.incorrectCount / total) * 100);

    // Confidence boost: +15 for mostly-correct, -15 for mostly-incorrect
    const confidenceBoost =
      correctPct   >= 70 ? 15  :
      incorrectPct >= 70 ? -15 :
      correctPct   >= 50 ? 8   :
      incorrectPct >= 50 ? -8  : 0;

    return {
      topic:                r.topic,
      subject:              r.subject,
      totalReviews:         r.totalReviews,
      correctPct,
      partialPct,
      incorrectPct,
      avgAdjustedConfidence: r.avgAdjustedConf ?? 0,
      confidenceBoost,
    };
  });

  res.json(stats);
});

// ── GET /reviews ──────────────────────────────────────────────────────────────

router.get("/reviews", async (req, res) => {
  const { subject, topic, verdict, limit: lim, offset: off } =
    req.query as Record<string, string>;

  let db: typeof _DbType;
  let teacherReviewsTable: typeof _TrType;
  try { ({ db, teacherReviewsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const pageLimit  = Math.min(Number(lim)  || 50, 200);
  const pageOffset = Math.max(Number(off)  || 0, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [];
  if (subject) conditions.push(eq(teacherReviewsTable.subject, subject));
  if (topic)   conditions.push(eq(teacherReviewsTable.topic,   topic));
  if (verdict) conditions.push(eq(teacherReviewsTable.verdict, verdict));

  const rows = await db
    .select()
    .from(teacherReviewsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(teacherReviewsTable.createdAt))
    .limit(pageLimit)
    .offset(pageOffset);

  res.json(rows);
});

// ── GET /reviews/:id ──────────────────────────────────────────────────────────

router.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  let db: typeof _DbType;
  let teacherReviewsTable: typeof _TrType;
  try { ({ db, teacherReviewsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const rows = await db
    .select()
    .from(teacherReviewsTable)
    .where(eq(teacherReviewsTable.id, id))
    .limit(1);

  if (rows.length === 0) { res.status(404).json({ error: "not_found" }); return; }
  res.json(rows[0]);
});

// ── DELETE /reviews/:id ───────────────────────────────────────────────────────

router.delete("/reviews/:id", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { id } = req.params;

  let db: typeof _DbType;
  let teacherReviewsTable: typeof _TrType;
  try { ({ db, teacherReviewsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const rows = await db
    .select({ reviewerClerkId: teacherReviewsTable.reviewerClerkId })
    .from(teacherReviewsTable)
    .where(eq(teacherReviewsTable.id, id))
    .limit(1);

  if (rows.length === 0) { res.status(404).json({ error: "not_found" }); return; }
  if (rows[0].reviewerClerkId !== userId) {
    res.status(403).json({ error: "forbidden", message: "You can only delete your own reviews." });
    return;
  }

  await db.delete(teacherReviewsTable).where(eq(teacherReviewsTable.id, id));
  req.log.info({ userId, reviewId: id }, "review: deleted");
  res.json({ ok: true });
});

export default router;
