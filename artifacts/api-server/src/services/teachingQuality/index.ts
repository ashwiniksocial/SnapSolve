/**
 * Teaching Quality Pipeline — Orchestrator
 *
 * Every AI-generated lesson passes through this pipeline before reaching the student.
 *
 * Pipeline per cycle:
 *   Draft Lesson → Review → [if needed] Improve → final review or hold
 *
 * Maximum 2 review cycles. Unresolved review-required lessons are held, not delivered.
 * If a quality service call fails, the decision is REVIEW_REQUIRED; the route holds
 * the lesson rather than returning an unreviewed draft.
 */

import type { LessonResponse }  from "../../lib/lessonTypes";
import { reviewLesson }          from "./lessonReviewer";
import { improveLesson }         from "./lessonImprover";
import { validateLesson }        from "./lessonValidator";
import type { ReviewReport }     from "./lessonReviewer";
import type { DimensionScores }  from "./qualityScoreEngine";
import { MAX_REVIEW_CYCLES }     from "./teachingRubric";
import { addUsage, zeroUsage, type UsageSnapshot } from "../../lib/aiCost";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CycleLog {
  cycle:     number;
  scores:    DimensionScores;
  confusions: string[];
  criticalIssues: ReviewReport["criticalIssues"];
  issueCount: number;
  passed:    boolean;
  improved:  boolean;   // true if an improve call was made after this review
}

export interface QualityPipelineResult {
  lesson:         LessonResponse;
  finalScore:     DimensionScores;
  passed:         boolean;
  decision:       TeachingQualityDecision;
  reviewFailed:   boolean;
  cyclesRun:      number;
  qualityLog:     CycleLog[];
  /** Accumulated token usage across all reviewer + improver calls in this pipeline run. */
  usageTotal:     UsageSnapshot;
  /** Number of reviewLesson AI calls made. */
  reviewerCalls:  number;
  /** Number of improveLesson AI calls made. */
  improverCalls:  number;
  /** Wall-clock duration of each successful quality call, in execution order. */
  callLatencies: {
    review:  number[];
    improve: number[];
  };
  callUsage: {
    review:  UsageSnapshot[];
    improve: UsageSnapshot[];
  };
}

export type TeachingQualityDecisionStatus = "PASS" | "IMPROVE" | "REVIEW_REQUIRED" | "BLOCK";
export type TeachingQualityResolution = "none" | "manual_review_once";

export interface TeachingQualityDecision {
  status: TeachingQualityDecisionStatus;
  improvementFlags: string[];
  blockReasons: string[];
  resolution: TeachingQualityResolution;
}

export function mayDeliverTeachingQualityStatus(
  status: TeachingQualityDecisionStatus,
): status is "PASS" | "IMPROVE" {
  return status === "PASS" || status === "IMPROVE";
}

function isCoreLessonSection(section: string): boolean {
  const normalized = section.toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized.startsWith("guidedreasoning") ||
    normalized.startsWith("stepbystepsolution") ||
    normalized.startsWith("solutionsteps") ||
    normalized.startsWith("finalanswer");
}

function isMaterialReviewFinding(issue: ReviewReport["criticalIssues"][number]): boolean {
  if (issue.findingType === "incorrect") return true;
  return isCoreLessonSection(issue.section) &&
    issue.findingType === "unclear";
}

/**
 * A teaching-quality verdict separates safely deliverable lessons from
 * noncritical polish and material failures. Canonical answer, completeness,
 * and answer-last checks remain independent hard gates in the caller.
 */
export function classifyTeachingQuality(
  report: ReviewReport | null,
  reviewFailed = false,
): TeachingQualityDecision {
  if (reviewFailed || !report) {
    return {
      status: "REVIEW_REQUIRED",
      improvementFlags: [],
      blockReasons: [reviewFailed ? "reviewer_unavailable" : "review_diagnostics_missing"],
      resolution: "manual_review_once",
    };
  }

  // Scores and missing/extra teaching coverage are advisory. Only a reported
  // incorrect claim, or an unclear core explanation in the worked reasoning or
  // final answer, keeps the existing reviewer hold in place. Required schema
  // fields and canonical/integrity checks remain independent hard checks.
  const reviewReasons = report.criticalIssues
      .filter(isMaterialReviewFinding)
      .map((issue) => {
        const evidence = issue.evidence.length > 0
          ? issue.evidence.map((item) => `${item.section}: "${item.quote}"`).join(" | ")
          : `complete_scan=${issue.reviewedSections.join(" > ")}`;
        return [
          `review_required:${issue.findingType}:${issue.section}`,
          issue.problem,
          issue.reason,
          evidence,
        ].filter(Boolean).join(" — ");
      });
  if (reviewReasons.length > 0) {
    return {
      status: "REVIEW_REQUIRED",
      improvementFlags: [],
      blockReasons: reviewReasons,
      resolution: "manual_review_once",
    };
  }

  const validation = validateLesson(report.scores);
  const improvementFlags = [
    ...validation.failingDimensions.map((dimension) => `dimension_below_pass_target:${dimension}`),
    ...report.criticalIssues
      .filter((issue) => !isMaterialReviewFinding(issue))
      .map((issue) =>
        `${issue.priority}_priority_issue:${issue.findingType}:${issue.section || "unspecified"}`,
      ),
  ];
  if (report.confusions.length > 0) {
    improvementFlags.push(`student_confusions:${report.confusions.length}`);
  }
  if (!report.passed && improvementFlags.length === 0) {
    improvementFlags.push("reviewer_threshold_not_met");
  }

  return {
    status: improvementFlags.length === 0 ? "PASS" : "IMPROVE",
    improvementFlags,
    blockReasons: [],
    resolution: "none",
  };
}

export interface QualityPipelineOptions {
  maxReviewCycles?: number;
  allowImprovements?: boolean;
  /**
   * `true` keeps strict reviewer-score passage (used by Simplify);
   * `false` accepts classified PASS/IMPROVE for bank persistence while
   * material findings and deterministic integrity checks remain blocking.
   */
  requireReviewerPass?: boolean;
}

export interface QualityPipelineServices {
  reviewLesson: typeof reviewLesson;
  improveLesson: typeof improveLesson;
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function runQualityPipeline(
  draft:       LessonResponse,
  apiKey:      string,
  onProgress?: (message: string, percent: number) => void,
  options:     QualityPipelineOptions = {},
  services:    QualityPipelineServices = { reviewLesson, improveLesson },
): Promise<QualityPipelineResult> {
  const configuredCycles = options.maxReviewCycles ?? MAX_REVIEW_CYCLES;
  const maxReviewCycles = Number.isInteger(configuredCycles) && configuredCycles > 0
    ? Math.min(configuredCycles, MAX_REVIEW_CYCLES)
    : MAX_REVIEW_CYCLES;
  const allowImprovements = options.allowImprovements ?? true;
  let current       = draft;
  const qualityLog: CycleLog[] = [];
  let lastReport:   ReviewReport | null = null;
  let reviewFailed  = false;
  let usageTotal    = zeroUsage();
  let reviewerCalls = 0;
  let improverCalls = 0;
  const callLatencies = { review: [] as number[], improve: [] as number[] };
  const callUsage = { review: [] as UsageSnapshot[], improve: [] as UsageSnapshot[] };

  for (let cycle = 1; cycle <= maxReviewCycles; cycle++) {
    const reviewPct  = 65 + (cycle - 1) * 10;
    const improvePct = reviewPct + 5;
    onProgress?.(`Quality review — cycle ${cycle} of ${maxReviewCycles}…`, reviewPct);

    // ── Review ────────────────────────────────────────────────────────────────
    let report: ReviewReport;
    try {
      const result  = await services.reviewLesson(current, apiKey);
      report        = result.report;
      usageTotal    = addUsage(usageTotal, result.usage);
      reviewerCalls += 1;
      callLatencies.review.push(result.latencyMs);
      callUsage.review.push(result.usage);
    } catch {
      // Review call failed — stop pipeline, return best lesson so far
      reviewFailed = true;
      break;
    }

    lastReport = report;
    const validation = validateLesson(report.scores);
    const decision = classifyTeachingQuality(report);

    const cycleEntry: CycleLog = {
      cycle,
      scores:     report.scores,
      confusions: report.confusions,
      criticalIssues: report.criticalIssues,
      issueCount: report.criticalIssues.length,
      passed:     report.passed,
      improved:   false,
    };

    const qualityDispositionAllowsDelivery =
      mayDeliverTeachingQualityStatus(decision.status);
    const reviewPassed = options.requireReviewerPass === false
      ? qualityDispositionAllowsDelivery
      : options.requireReviewerPass === true
        ? report.passed && validation.passed && qualityDispositionAllowsDelivery
        : (report.passed || validation.passed) && qualityDispositionAllowsDelivery;
    if (reviewPassed) {
      // Lesson passed all thresholds — we're done
      qualityLog.push(cycleEntry);
      return {
        lesson:        current,
        finalScore:    report.scores,
        passed:        true,
        decision,
        reviewFailed:  false,
        cyclesRun:     cycle,
        qualityLog,
        usageTotal,
        reviewerCalls,
        improverCalls,
        callLatencies,
        callUsage,
      };
    }

    // ── Improve (not on the last cycle — just accept) ─────────────────────────
    if (allowImprovements && cycle < maxReviewCycles) {
      onProgress?.(`Improving lesson — cycle ${cycle}…`, improvePct);
      try {
        const improved   = await services.improveLesson(current, report, apiKey);
        current          = improved.lesson;
        usageTotal       = addUsage(usageTotal, improved.usage);
        improverCalls   += 1;
        callLatencies.improve.push(improved.latencyMs);
        callUsage.improve.push(improved.usage);
        cycleEntry.improved = true;
      } catch {
        // Improve call failed — stop pipeline, return best lesson so far
        qualityLog.push(cycleEntry);
        break;
      }
    }

    qualityLog.push(cycleEntry);
  }

  // Exhausted cycles or hit an error — return the best lesson we have
  return {
    lesson:        current,
    finalScore:    lastReport?.scores ?? ({} as DimensionScores),
    passed:        false,
    decision:      classifyTeachingQuality(lastReport, reviewFailed),
    reviewFailed,
    cyclesRun:     qualityLog.length,
    qualityLog,
    usageTotal,
    reviewerCalls,
    improverCalls,
    callLatencies,
    callUsage,
  };
}
