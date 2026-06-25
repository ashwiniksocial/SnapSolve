/**
 * Admin routes — content import and management.
 *
 * POST /api/admin/import           CSV bulk import with auto-deduplication
 * GET  /api/admin/stats            aggregate statistics
 * GET  /api/admin/questions        paginated question list
 * GET  /api/admin/export/firestore Firestore-compatible JSON download
 *
 * DATABASE_URL must be set for these routes to work.
 * If absent the routes return 503 — the rest of the server is unaffected.
 */

import { Router }     from "express";
import { createHash } from "crypto";
import { eq, and, desc, sql, type SQL } from "drizzle-orm";

// ─── Lazy DB access ───────────────────────────────────────────────────────────
// Dynamic import keeps the module from crashing the server when DATABASE_URL is
// absent (main solution routes work fine without a DB).

import type { db as _DbType, questionsTable as _QtType } from "@workspace/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mod: any = null;

async function requireDb(): Promise<{
  db:             typeof _DbType;
  questionsTable: typeof _QtType;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeHash(text: string): string {
  return createHash("sha256")
    .update(text.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex");
}

/** Minimal RFC-4180 CSV parser that handles quoted fields. */
function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      fields.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
    .split("\n").filter((l: string) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVRow(lines[0]).map((h: string) => h.trim());
  return lines.slice(1).map((line: string) => {
    const vals = parseCSVRow(line);
    return Object.fromEntries(headers.map((h: string, i: number) => [h, (vals[i] ?? "").trim()]));
  });
}

// ─── Row validation (no external deps) ───────────────────────────────────────

interface ValidRow {
  board:          string;
  classNum:       number;
  subject:        string;
  chapter:        string;
  chapterNumber:  number | undefined;
  topic:          string;
  difficulty:     "Easy" | "Medium" | "Hard";
  questionText:   string;
  answer:         string | undefined;
  source:         string | undefined;
  tags:           string | undefined;
}

function validateRow(
  raw: Record<string, string>,
): { ok: true; data: ValidRow } | { ok: false; error: string } {
  const errs: string[] = [];

  const board        = raw["board"]?.trim()         ?? "";
  const classRaw     = raw["class"]?.trim()         ?? "";
  const subject      = raw["subject"]?.trim()       ?? "";
  const chapter      = raw["chapter"]?.trim()       ?? "";
  const topic        = raw["topic"]?.trim()         ?? "";
  const difficultyRaw = raw["difficulty"]?.trim()   ?? "";
  const questionText = raw["question_text"]?.trim() ?? "";

  if (!board)       errs.push("board is required");
  const classNum = parseInt(classRaw);
  if (isNaN(classNum) || classNum < 6 || classNum > 12)
    errs.push("class must be an integer between 6 and 12");
  if (!subject)     errs.push("subject is required");
  if (!chapter)     errs.push("chapter is required");
  if (!topic)       errs.push("topic is required");
  if (!["Easy", "Medium", "Hard"].includes(difficultyRaw))
    errs.push("difficulty must be Easy, Medium, or Hard");
  if (questionText.length < 5)
    errs.push("question_text must be at least 5 characters");

  if (errs.length > 0) return { ok: false, error: errs.join("; ") };

  const chNumRaw     = raw["chapter_number"]?.trim() ?? "";
  const chapterNumber = chNumRaw ? (parseInt(chNumRaw) || undefined) : undefined;

  return {
    ok: true,
    data: {
      board,
      classNum,
      subject,
      chapter,
      chapterNumber,
      topic,
      difficulty:   difficultyRaw as "Easy" | "Medium" | "Hard",
      questionText,
      answer: raw["answer"]?.trim() || undefined,
      source: raw["source"]?.trim() || undefined,
      tags:   raw["tags"]?.trim()   || undefined,
    },
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

// ── POST /admin/import ────────────────────────────────────────────────────────

router.post("/admin/import", async (req, res) => {
  const { csv } = req.body as { csv?: unknown };
  if (typeof csv !== "string" || !csv.trim()) {
    res.status(400).json({ error: "csv_required", message: "Provide a non-empty csv string in the request body" });
    return;
  }

  let db: typeof _DbType;
  let questionsTable: typeof _QtType;
  try { ({ db, questionsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const rawRows = parseCSV(csv);
  if (rawRows.length === 0) {
    res.status(400).json({ error: "empty_csv", message: "CSV has no data rows" });
    return;
  }

  const toInsert: Record<string, unknown>[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const result = validateRow(rawRows[i]);
    if (!result.ok) {
      errors.push({ row: i + 2, message: result.error });
      continue;
    }
    const d = result.data;
    toInsert.push({
      board:         d.board,
      classLevel:    d.classNum,
      subject:       d.subject,
      chapter:       d.chapter,
      chapterNumber: d.chapterNumber ?? null,
      topic:         d.topic,
      difficulty:    d.difficulty,
      questionText:  d.questionText,
      answer:        d.answer ?? null,
      source:        d.source ?? null,
      tags:          d.tags ? d.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : null,
      contentHash:   computeHash(d.questionText),
    });
  }

  let imported = 0;
  let skipped  = 0;

  // Batch insert in chunks of 100; skip duplicates via unique content_hash
  for (let i = 0; i < toInsert.length; i += 100) {
    const batch  = toInsert.slice(i, i + 100);
    const result = await db
      .insert(questionsTable)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values(batch as any)
      .onConflictDoNothing()
      .returning({ id: questionsTable.id });
    imported += result.length;
    skipped  += batch.length - result.length;
  }

  req.log.info({ imported, skipped, errors: errors.length }, "admin: CSV import completed");
  res.json({ imported, skipped, errors, totalRows: rawRows.length });
});

// ── GET /admin/stats ──────────────────────────────────────────────────────────

router.get("/admin/stats", async (req, res) => {
  let db: typeof _DbType;
  let questionsTable: typeof _QtType;
  try { ({ db, questionsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const [totalRes, byChapter, byTopic, byDifficulty, byBoard, bySubject] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(questionsTable),
    db.select({
      chapter: questionsTable.chapter,
      subject: questionsTable.subject,
      count:   sql<number>`count(*)::int`,
    }).from(questionsTable)
      .groupBy(questionsTable.chapter, questionsTable.subject)
      .orderBy(sql`count(*) desc`),
    db.select({
      topic: questionsTable.topic,
      count: sql<number>`count(*)::int`,
    }).from(questionsTable)
      .groupBy(questionsTable.topic)
      .orderBy(sql`count(*) desc`)
      .limit(20),
    db.select({
      difficulty: questionsTable.difficulty,
      count:      sql<number>`count(*)::int`,
    }).from(questionsTable).groupBy(questionsTable.difficulty),
    db.select({
      board: questionsTable.board,
      count: sql<number>`count(*)::int`,
    }).from(questionsTable).groupBy(questionsTable.board),
    db.select({
      subject: questionsTable.subject,
      count:   sql<number>`count(*)::int`,
    }).from(questionsTable).groupBy(questionsTable.subject),
  ]);

  req.log.info({ total: totalRes[0]?.count ?? 0 }, "admin: stats fetched");
  res.json({
    total:        totalRes[0]?.count ?? 0,
    byChapter,
    byTopic,
    byDifficulty,
    byBoard,
    bySubject,
  });
});

// ── GET /admin/questions ──────────────────────────────────────────────────────

router.get("/admin/questions", async (req, res) => {
  let db: typeof _DbType;
  let questionsTable: typeof _QtType;
  try { ({ db, questionsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const page   = Math.max(1, parseInt(String(req.query["page"]  ?? "1")));
  const limit  = Math.min(100, Math.max(1, parseInt(String(req.query["limit"] ?? "20"))));
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [];
  if (req.query["board"])      conditions.push(eq(questionsTable.board,      String(req.query["board"])));
  if (req.query["subject"])    conditions.push(eq(questionsTable.subject,    String(req.query["subject"])));
  if (req.query["chapter"])    conditions.push(eq(questionsTable.chapter,    String(req.query["chapter"])));
  if (req.query["difficulty"]) conditions.push(eq(questionsTable.difficulty, String(req.query["difficulty"])));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countRes] = await Promise.all([
    db.select().from(questionsTable)
      .where(where)
      .orderBy(desc(questionsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(questionsTable).where(where),
  ]);

  res.json({ questions: rows, total: countRes[0]?.count ?? 0, page, limit });
});

// ── GET /admin/export/firestore ───────────────────────────────────────────────

router.get("/admin/export/firestore", async (req, res) => {
  let db: typeof _DbType;
  let questionsTable: typeof _QtType;
  try { ({ db, questionsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  const rows = await db.select().from(questionsTable).orderBy(questionsTable.createdAt);

  // Firestore batch-import format (firebase-admin compatible)
  const firestoreExport = {
    __collections__: {
      questions: Object.fromEntries(
        rows.map(q => [
          q.id,
          {
            board:         q.board,
            classLevel:    q.classLevel,
            subject:       q.subject,
            chapter:       q.chapter,
            chapterNumber: q.chapterNumber,
            topic:         q.topic,
            difficulty:    q.difficulty,
            questionText:  q.questionText,
            answer:        q.answer,
            source:        q.source,
            tags:          q.tags ?? [],
            contentHash:   q.contentHash,
            createdAt:     q.createdAt.toISOString(),
          },
        ]),
      ),
    },
  };

  res.setHeader("Content-Disposition", 'attachment; filename="questions_firestore.json"');
  req.log.info({ total: rows.length }, "admin: Firestore export downloaded");
  res.json(firestoreExport);
});

export default router;
