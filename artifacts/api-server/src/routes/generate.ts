/**
 * POST /api/admin/generate
 *
 * AI-powered Q&A generation with Academic Review gate.
 *
 * Pipeline (full detail in qaGenerationPipeline/index.ts):
 *   1. Validate request body
 *   2. Generate Compact + Standard + Detailed answers (3 parallel OpenAI calls)
 *   3. Academic Reviewer validates all three (1 OpenAI call)
 *   4. Partial regeneration of any failed section (≤3 OpenAI calls)
 *   5. Partial re-review of regenerated sections (1 OpenAI call)
 *   6. Save to DB; Standard answer stored in `answer` field
 *
 * Reviewer metadata stored in `tags` column (no schema changes):
 *   ["reviewer:PASS", "reviewed:YYYY-MM-DD"]              — Approved
 *   ["reviewer:needs-review", "reviewed:YYYY-MM-DD", ...]  — NeedsReview
 *
 * Requires: OPENAI_API_KEY, DATABASE_URL
 */

import { Router }     from "express";
import { createHash } from "crypto";
import { runQAGenerationPipeline, type PipelineInput } from "../services/qaGenerationPipeline";

import type { db as _DbType, questionsTable as _QtType } from "@workspace/db";

// ─── Lazy DB ──────────────────────────────────────────────────────────────────
// Same pattern as admin.ts: dynamic import keeps the server alive when
// DATABASE_URL is absent — the generate route returns 503 gracefully.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _mod: any = null;

async function requireDb(): Promise<{
  db:             typeof _DbType;
  questionsTable: typeof _QtType;
}> {
  if (_mod) return _mod as typeof _mod;
  if (!process.env.DATABASE_URL)
    throw Object.assign(
      new Error("DATABASE_URL is not configured on the server"),
      { code: "no_database" },
    );
  _mod = await import("@workspace/db");
  return _mod;
}

function sendDbError(res: import("express").Response, err: unknown) {
  const msg    = err instanceof Error ? err.message : String(err);
  const code   = (err as { code?: string }).code ?? "database_error";
  const status = code === "no_database" ? 503 : 500;
  res.status(status).json({ error: code, message: msg });
}

function computeHash(text: string): string {
  return createHash("sha256")
    .update(text.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex");
}

// ─── Request validation ───────────────────────────────────────────────────────

interface GenerateBody {
  board:           string;
  classLevel:      number;
  subject:         string;
  chapter:         string;
  chapterNumber?:  number;
  topic:           string;
  difficulty:      "Easy" | "Medium" | "Hard";
  questionText:    string;
}

function validateBody(
  raw: unknown,
): { ok: true; data: GenerateBody } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object")
    return { ok: false, error: "Request body must be a JSON object" };

  const b    = raw as Record<string, unknown>;
  const errs: string[] = [];

  if (typeof b["board"] !== "string" || !b["board"])
    errs.push("board is required (e.g. CBSE)");

  const cl = Number(b["classLevel"]);
  if (!Number.isInteger(cl) || cl < 6 || cl > 12)
    errs.push("classLevel must be an integer between 6 and 12");

  if (typeof b["subject"] !== "string" || !b["subject"])
    errs.push("subject is required");

  if (typeof b["chapter"] !== "string" || !b["chapter"])
    errs.push("chapter is required");

  if (typeof b["topic"] !== "string" || !b["topic"])
    errs.push("topic is required");

  if (!["Easy", "Medium", "Hard"].includes(String(b["difficulty"])))
    errs.push("difficulty must be Easy, Medium, or Hard");

  const qt = typeof b["questionText"] === "string" ? b["questionText"].trim() : "";
  if (qt.length < 5)
    errs.push("questionText must be at least 5 characters");

  if (errs.length) return { ok: false, error: errs.join("; ") };

  const chNum = b["chapterNumber"] !== undefined ? Number(b["chapterNumber"]) : undefined;

  return {
    ok: true,
    data: {
      board:          b["board"] as string,
      classLevel:     cl,
      subject:        b["subject"] as string,
      chapter:        b["chapter"] as string,
      chapterNumber:  chNum !== undefined && !isNaN(chNum) ? chNum : undefined,
      topic:          b["topic"] as string,
      difficulty:     b["difficulty"] as "Easy" | "Medium" | "Hard",
      questionText:   qt,
    },
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────

const router = Router();

router.post("/admin/generate", async (req, res) => {
  // ── API key check ──────────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "no_key", message: "OPENAI_API_KEY is not configured on the server" });
    return;
  }

  // ── DB check ───────────────────────────────────────────────────────────────
  let db: typeof _DbType;
  let questionsTable: typeof _QtType;
  try { ({ db, questionsTable } = await requireDb()); }
  catch (err) { sendDbError(res, err); return; }

  // ── Body validation ────────────────────────────────────────────────────────
  const validation = validateBody(req.body);
  if (!validation.ok) {
    res.status(400).json({ error: "validation_error", message: validation.error });
    return;
  }
  const body = validation.data;

  // ── Run generation pipeline ────────────────────────────────────────────────
  req.log.info(
    { subject: body.subject, chapter: body.chapter, topic: body.topic, difficulty: body.difficulty },
    "[GENERATE] Starting QA generation pipeline",
  );

  const pipelineInput: PipelineInput = {
    board:        body.board,
    classLevel:   body.classLevel,
    subject:      body.subject,
    chapter:      body.chapter,
    topic:        body.topic,
    difficulty:   body.difficulty,
    questionText: body.questionText,
  };

  let result: Awaited<ReturnType<typeof runQAGenerationPipeline>>;
  try {
    result = await runQAGenerationPipeline(pipelineInput, apiKey, req.log);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log.error({ err: msg }, "[GENERATE] Pipeline error");
    if (msg.includes("no_key") || msg.includes("invalid_key"))
      { res.status(503).json({ error: "no_key",     message: "OPENAI_API_KEY is invalid or missing" }); return; }
    if (msg.includes("openai_429") || msg.includes("rate_limit"))
      { res.status(429).json({ error: "rate_limit", message: "OpenAI rate limit — please retry in a moment" }); return; }
    res.status(502).json({ error: "generation_error", message: msg });
    return;
  }

  // ── Build reviewer tags ────────────────────────────────────────────────────
  // Stored in `tags` column so reviewer status is queryable without schema changes.
  const reviewDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const reviewerTag = result.reviewerStatus === "Approved" ? "reviewer:PASS" : "reviewer:needs-review";
  const tags: string[] = [reviewerTag, `reviewed:${reviewDate}`];
  if (result.log.regeneratedSections.length > 0) {
    tags.push(`regenerated:${result.log.regeneratedSections.join(",")}`);
  }

  // ── Save to DB ─────────────────────────────────────────────────────────────
  // answer  = Standard answer (most useful for exam practice)
  // source  = "ai-generated"
  // tags    = reviewer metadata
  // ON CONFLICT (content_hash) DO NOTHING handles duplicates gracefully.
  const contentHash = computeHash(body.questionText);
  let savedId: string | null = null;

  try {
    const rows = await db
      .insert(questionsTable)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values({
        board:         body.board,
        classLevel:    body.classLevel,
        subject:       body.subject,
        chapter:       body.chapter,
        chapterNumber: body.chapterNumber ?? null,
        topic:         body.topic,
        difficulty:    body.difficulty,
        questionText:  body.questionText,
        answer:        result.answers.standard,
        source:        "ai-generated",
        tags,
        contentHash,
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      .onConflictDoNothing()
      .returning({ id: questionsTable.id });

    savedId = rows[0]?.id ?? null;

    if (savedId) {
      req.log.info(
        { id: savedId, reviewerStatus: result.reviewerStatus, regenerated: result.log.regeneratedSections },
        "[GENERATE] Saved to DB",
      );
    } else {
      req.log.info({ contentHash }, "[GENERATE] Duplicate — question already exists in DB, skipped insert");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    req.log.error({ err: msg }, "[GENERATE] DB save error");
    res.status(500).json({ error: "db_error", message: msg });
    return;
  }

  // ── Response ───────────────────────────────────────────────────────────────
  res.status(savedId ? 201 : 200).json({
    id:             savedId,
    reviewerStatus: result.reviewerStatus,
    answers: {
      compact:  result.answers.compact,
      standard: result.answers.standard,
      detailed: result.answers.detailed,
    },
    review: {
      overall:             result.log.overallResult,
      failedSections:      result.log.failedSections,
      regeneratedSections: result.log.regeneratedSections,
      reasons:             result.log.failureReasons,
    },
    savedToDb: !!savedId,
    duplicate: !savedId,
  });
});

export default router;
