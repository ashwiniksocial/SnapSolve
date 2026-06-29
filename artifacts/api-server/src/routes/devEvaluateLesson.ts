/**
 * POST /api/dev/evaluateLesson
 *
 * Developer-only endpoint. Evaluates a TeachingLesson against the
 * SnapSolve Teaching Standards and returns a structured EvaluationReport.
 *
 * PRODUCTION GUARD: returns 403 when NODE_ENV === "production".
 * Read-only: never modifies the lesson or calls any AI service.
 *
 * Request body:
 *   {
 *     lesson:  LessonResponse  (required — the raw lesson JSON, e.g. from /api/solveQuestion)
 *     subject: string          (optional — e.g. "Mathematics", "Physics")
 *   }
 *
 * Response: EvaluationReport
 *   {
 *     lessonTopic:    string
 *     subject:        string
 *     overallScore:   number   (0–100)
 *     grade:          "A"|"B"|"C"|"D"|"F"
 *     dimensions:     DimensionScore[]
 *     criticalIssues: string[]
 *     promptGuidance: string[]
 *     summary:        string
 *     evaluatedAt:    string   (ISO timestamp)
 *   }
 *
 * Usage (curl):
 *   curl -s localhost:80/api/dev/evaluateLesson \
 *     -H "Content-Type: application/json" \
 *     -d '{"subject":"Mathematics","lesson":<lesson JSON>}'
 *
 * Usage (after solving a question):
 *   1. POST /api/solveQuestion → save the JSON response
 *   2. POST /api/dev/evaluateLesson  body: { lesson: <saved response>, subject: "Mathematics" }
 */

import { Router } from "express";
import { parseLessonResponse } from "../lib/lessonTypes";
import { evaluateLesson }       from "../services/lessonEvaluator";

const router = Router();

router.post("/dev/evaluateLesson", (req, res) => {
  // ── Production guard ──────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    res.status(403).json({
      error:   "dev_tools_disabled",
      message: "POST /api/dev/evaluateLesson is only available in development.",
    });
    return;
  }

  // ── Input validation ──────────────────────────────────────────────────────
  const { lesson: rawLesson, subject: rawSubject } = req.body as {
    lesson?:  unknown;
    subject?: unknown;
  };

  if (rawLesson === null || rawLesson === undefined || typeof rawLesson !== "object") {
    res.status(400).json({
      error:   "missing_lesson",
      message: "Request body must include a 'lesson' object. Pass the raw JSON returned by POST /api/solveQuestion.",
    });
    return;
  }

  const subject = typeof rawSubject === "string" && rawSubject.trim().length > 0
    ? rawSubject.trim()
    : "Unknown";

  // ── Parse + evaluate ──────────────────────────────────────────────────────
  let lesson;
  try {
    lesson = parseLessonResponse(rawLesson);
  } catch (err) {
    res.status(400).json({
      error:   "invalid_lesson",
      message: `Could not parse the provided lesson object: ${String(err)}`,
    });
    return;
  }

  const report = evaluateLesson(lesson, subject);

  req.log.info(
    { lessonTopic: report.lessonTopic, overallScore: report.overallScore, grade: report.grade },
    "dev/evaluateLesson: evaluation complete"
  );

  res.json(report);
});

export default router;
