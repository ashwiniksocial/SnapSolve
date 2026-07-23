/**
 * QA Generation Pipeline — orchestrates the full Academic Review flow.
 *
 * Pipeline steps:
 *   1. Generate Compact + Standard + Detailed answers (3 parallel OpenAI calls)
 *   2. Academic Reviewer evaluates all three (1 OpenAI call)
 *   3. If PASS → done (total: 4 calls)
 *   4. If FAIL → regenerate ONLY failed sections in parallel (1–3 OpenAI calls)
 *   5. Academic Re-reviewer evaluates ONLY regenerated sections (1 OpenAI call)
 *   6. If PASS → Approved; if still FAIL → NeedsReview
 *
 * Maximum LLM calls per question:
 *   4 (best case: all PASS) to 8 (worst case: all 3 sections fail → all regen → re-review)
 *
 * Token savings vs. naive full-regeneration:
 *   Partial regen avoids ≥1 answer-generation call per passing section.
 *   Partial re-review avoids evaluating already-approved sections.
 *
 * No infinite retry loops. Maximum one regeneration attempt per section.
 */

import type { Logger } from "pino";
import {
  generateAnswers,
  regenerateSection,
  type GeneratedAnswers,
  type AnswerGeneratorInput,
  type AnswerSection,
} from "../answerGenerator";
import {
  reviewAnswers,
  type ReviewResult,
  type ReviewInput,
} from "../academicReviewer";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ReviewerStatus = "Approved" | "NeedsReview";

export interface PipelineInput extends AnswerGeneratorInput {
  board:      string;
  classLevel: number;
}

export interface ReviewLogEntry {
  questionText:        string;
  reviewerStatus:      ReviewerStatus;
  overallResult:       "PASS" | "FAIL";
  failedSections:      AnswerSection[];
  failureReasons:      string[];
  regeneratedSections: AnswerSection[];
  firstReview:         ReviewResult;
  secondReview?:       ReviewResult;
  timestamp:           string;
}

export interface PipelineResult {
  answers:        GeneratedAnswers;
  reviewerStatus: ReviewerStatus;
  log:            ReviewLogEntry;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function failedAnswerSections(review: ReviewResult): AnswerSection[] {
  const out: AnswerSection[] = [];
  if (review.compact  === "FAIL") out.push("compact");
  if (review.standard === "FAIL") out.push("standard");
  if (review.detailed === "FAIL") out.push("detailed");
  return out;
}

function toReviewInput(
  input:             PipelineInput,
  answers:           GeneratedAnswers,
  sectionsToReview?: AnswerSection[],
): ReviewInput {
  return {
    board:            input.board,
    classLevel:       input.classLevel,
    subject:          input.subject,
    chapter:          input.chapter,
    topic:            input.topic,
    difficulty:       input.difficulty,
    questionText:     input.questionText,
    compact:          answers.compact,
    standard:         answers.standard,
    detailed:         answers.detailed,
    sectionsToReview,
  };
}

// ─── Pipeline ──────────────────────────────────────────────────────────────────

export async function runQAGenerationPipeline(
  input:  PipelineInput,
  apiKey: string,
  log:    Logger,
): Promise<PipelineResult> {
  const timestamp = new Date().toISOString();

  // ── Step 1: Generate all three formats in parallel ────────────────────────
  log.info(
    { subject: input.subject, chapter: input.chapter, topic: input.topic },
    "[QA-PIPELINE:1] Generating Compact + Standard + Detailed answers",
  );
  const answers = await generateAnswers(input, apiKey);
  log.info("[QA-PIPELINE:1] Generation complete");

  // ── Step 2: Full Academic Review (all three sections, one call) ───────────
  log.info("[QA-PIPELINE:2] Running Academic Reviewer — full review");
  const firstReview = await reviewAnswers(toReviewInput(input, answers), apiKey);
  log.info(
    { overall: firstReview.overall, reasons: firstReview.reasons.length },
    "[QA-PIPELINE:2] Review complete",
  );

  // ── Step 3: Approve immediately on PASS ───────────────────────────────────
  if (firstReview.overall === "PASS") {
    log.info("[QA-PIPELINE:3] PASS — approved on first review (no regeneration needed)");
    return {
      answers,
      reviewerStatus: "Approved",
      log: {
        questionText:        input.questionText,
        reviewerStatus:      "Approved",
        overallResult:       "PASS",
        failedSections:      [],
        failureReasons:      [],
        regeneratedSections: [],
        firstReview,
        timestamp,
      },
    };
  }

  // ── Step 4: Partial regeneration — only failed sections, in parallel ──────
  const failedSections = failedAnswerSections(firstReview);
  log.info(
    { failedSections, corrections: firstReview.corrections.length },
    "[QA-PIPELINE:4] FAIL — regenerating failed sections only (approved sections reused)",
  );

  const regenParts = await Promise.all(
    failedSections.map((section) =>
      regenerateSection(section, input, firstReview.corrections, apiKey)
        .then((text) => ({ section, text })),
    ),
  );

  const regenAnswers: GeneratedAnswers = { ...answers };
  for (const { section, text } of regenParts) {
    regenAnswers[section] = text;
  }

  // ── Step 5: Partial re-review — only the regenerated sections ─────────────
  log.info(
    { sectionsToReview: failedSections },
    "[QA-PIPELINE:5] Re-reviewing regenerated sections only (approved sections skipped)",
  );
  const secondReview = await reviewAnswers(
    toReviewInput(input, regenAnswers, failedSections),
    apiKey,
  );
  log.info(
    { overall: secondReview.overall },
    "[QA-PIPELINE:5] Re-review complete",
  );

  // ── Step 6: Final verdict ─────────────────────────────────────────────────
  const status: ReviewerStatus = secondReview.overall === "PASS" ? "Approved" : "NeedsReview";
  log.info(
    { status, regeneratedSections: failedSections },
    `[QA-PIPELINE:6] Final status: ${status}`,
  );

  return {
    answers:        regenAnswers,
    reviewerStatus: status,
    log: {
      questionText:        input.questionText,
      reviewerStatus:      status,
      overallResult:       secondReview.overall,
      failedSections,
      failureReasons:      firstReview.reasons,
      regeneratedSections: failedSections,
      firstReview,
      secondReview,
      timestamp,
    },
  };
}
