/**
 * POST /api/dev/architectureCShadow
 *
 * Developer-only Architecture C diagnostic. It accepts raw Detailed output,
 * performs a deterministic structural gate, and optionally calls the compact
 * material validator. It never repairs, rewrites, or routes student requests.
 */

import { Router } from "express";
import { runArchitectureCShadow } from "../services/architectureCShadow";

const router = Router();

router.post("/dev/architectureCShadow", async (req, res) => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_ARCHITECTURE_C_SHADOW !== "true"
  ) {
    res.status(403).json({
      error: "dev_tools_disabled",
      message: "Architecture C shadow validation requires a non-production environment and explicit ENABLE_ARCHITECTURE_C_SHADOW=true opt-in.",
    });
    return;
  }

  const body = req.body as {
    lesson?: unknown;
    subject?: unknown;
    question?: unknown;
  };
  if (body.lesson === null || body.lesson === undefined || typeof body.lesson !== "object") {
    res.status(400).json({
      error: "missing_lesson",
      message: "Request body must include the raw Detailed lesson as 'lesson'.",
    });
    return;
  }

  const report = await runArchitectureCShadow(body.lesson, {
    subject: typeof body.subject === "string" ? body.subject : undefined,
    question: typeof body.question === "string" ? body.question : undefined,
    apiKey: process.env.OPENAI_API_KEY,
  });

  req.log.info(
    {
      structural: report.structural.passed,
      structuralIssueCount: report.structural.issues.length,
      materialStatus: report.material.status,
    },
    "dev/architectureCShadow: diagnostic complete",
  );

  res.status(report.material.status === "VALIDATOR_ERROR" ? 503 : 200).json(report);
});

export default router;