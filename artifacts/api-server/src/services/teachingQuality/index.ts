/**
 * Teaching Quality Pipeline — Orchestrator
 *
 * Every AI-generated lesson passes through this pipeline before reaching the student.
 *
 * Pipeline per cycle:
 *   Draft Lesson → Review → [if failed] → Improve → Review → [if failed] → Improve → Review → Accept
 *
 * Maximum 3 review cycles. After the third cycle the best lesson is returned regardless.
 * If ANY quality service call fails (timeout, API error), the pipeline degrades gracefully
 * and returns the current best lesson rather than erroring the entire request.
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
  issueCount: number;
  passed:    boolean;
  improved:  boolean;   // true if an improve call was made after this review
}

export interface QualityPipelineResult {
  lesson:         LessonResponse;
  finalScore:     DimensionScores;
  passed:         boolean;
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

export interface QualityPipelineOptions {
  maxReviewCycles?: number;
  allowImprovements?: boolean;
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

    const cycleEntry: CycleLog = {
      cycle,
      scores:     report.scores,
      confusions: report.confusions,
      issueCount: report.criticalIssues.length,
      passed:     report.passed,
      improved:   false,
    };

    const reviewPassed = options.requireReviewerPass
      ? report.passed && validation.passed
      : report.passed || validation.passed;
    if (reviewPassed) {
      // Lesson passed all thresholds — we're done
      qualityLog.push(cycleEntry);
      return {
        lesson:        current,
        finalScore:    report.scores,
        passed:        true,
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
