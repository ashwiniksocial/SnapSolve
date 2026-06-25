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
  lesson:      LessonResponse;
  finalScore:  DimensionScores;
  passed:      boolean;
  cyclesRun:   number;
  qualityLog:  CycleLog[];
}

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function runQualityPipeline(
  draft:   LessonResponse,
  apiKey:  string,
): Promise<QualityPipelineResult> {
  let current     = draft;
  const qualityLog: CycleLog[] = [];
  let lastReport:   ReviewReport | null = null;

  for (let cycle = 1; cycle <= MAX_REVIEW_CYCLES; cycle++) {
    // ── Review ────────────────────────────────────────────────────────────────
    let report: ReviewReport;
    try {
      report = await reviewLesson(current, apiKey);
    } catch {
      // Review call failed — stop pipeline, return best lesson so far
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

    if (report.passed || validation.passed) {
      // Lesson passed all thresholds — we're done
      qualityLog.push(cycleEntry);
      return {
        lesson:     current,
        finalScore: report.scores,
        passed:     true,
        cyclesRun:  cycle,
        qualityLog,
      };
    }

    // ── Improve (not on the last cycle — just accept) ─────────────────────────
    if (cycle < MAX_REVIEW_CYCLES) {
      try {
        current          = await improveLesson(current, report, apiKey);
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
    lesson:     current,
    finalScore: lastReport?.scores ?? ({} as DimensionScores),
    passed:     false,
    cyclesRun:  qualityLog.length,
    qualityLog,
  };
}
