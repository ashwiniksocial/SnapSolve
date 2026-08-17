/**
 * pipelineTest.ts
 *
 * Tests whether the quality-pipeline improvement step
 * can fix M4 and P4 lessons that scored ct=50 on raw generation.
 *
 * Takes the saved raw lesson from benchmark_results_detailed.json,
 * runs reviewLesson → improveLesson → reviewLesson, and reports
 * before-vs-after scores.
 *
 * Run: pnpm exec tsx src/benchmark/pipelineTest.ts
 */

import * as fs from "fs";
import { parseLessonResponse } from "../lib/lessonTypes";
import { reviewLesson }        from "../services/teachingQuality/lessonReviewer";
import { improveLesson }       from "../services/teachingQuality/lessonImprover";

const API_KEY = process.env.OPENAI_API_KEY ?? "";
if (!API_KEY) throw new Error("OPENAI_API_KEY not set");

async function testPipeline(questionId: string, rawOutput: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(` Pipeline test: ${questionId}`);
  console.log(`${"═".repeat(60)}`);

  // Parse raw lesson
  const parsed = JSON.parse(rawOutput);
  const lesson = parseLessonResponse(parsed);

  // Step 1: Initial review (same as what benchmark measures)
  console.log("\nStep 1: Initial review...");
  const { report: report1, usage: u1 } = await reviewLesson(lesson, API_KEY);
  const ct1 = report1.scores.conceptTeaching;
  const rs1 = report1.scores.reasoning;
  console.log(`  conceptTeaching: ${ct1}  reasoning: ${rs1}  passed: ${report1.passed}`);
  console.log(`  Critical issues: ${report1.criticalIssues.length}`);
  for (const issue of report1.criticalIssues.slice(0, 3)) {
    console.log(`    [${issue.priority}] ${issue.section}: ${issue.problem.slice(0, 120)}`);
    console.log(`    Fix: ${issue.suggestedFix.slice(0, 120)}`);
  }

  if (report1.passed) {
    console.log("  ✓ Already passed! No improvement needed.");
    return;
  }

  // Step 2: Improve (what the pipeline does when raw lesson fails)
  console.log("\nStep 2: Running improveLesson...");
  const t0 = Date.now();
  const { lesson: improved, usage: u2 } = await improveLesson(lesson, report1, API_KEY);
  console.log(`  Improve complete in ${Date.now() - t0}ms`);

  // Step 3: Re-review the improved lesson
  console.log("\nStep 3: Re-reviewing improved lesson...");
  const { report: report2, usage: u3 } = await reviewLesson(improved, API_KEY);
  const ct2 = report2.scores.conceptTeaching;
  const rs2 = report2.scores.reasoning;
  console.log(`  conceptTeaching: ${ct2}  reasoning: ${rs2}  passed: ${report2.passed}`);

  // Summary
  console.log(`\n  BEFORE → AFTER:`);
  console.log(`    conceptTeaching: ${ct1} → ${ct2}  (${ct2 >= 80 ? "✓ PASS" : ct2 > ct1 ? "↑ improved" : "✗ unchanged"})`);
  console.log(`    reasoning:       ${rs1} → ${rs2}  (${rs2 >= 80 ? "✓ PASS" : rs2 > rs1 ? "↑ improved" : "✗ unchanged"})`);
  console.log(`    Pipeline result: ${report2.passed ? "✓ PASSED" : "✗ STILL FAILING"}`);

  // Show improved Step 1 and parity step
  const steps = improved.guidedReasoning;
  if (steps.length > 0) {
    console.log(`\n  IMPROVED guidedReasoning Step 1:`);
    console.log(`    what: ${steps[0].what.slice(0, 100)}`);
    console.log(`    why:  ${steps[0].why.slice(0, 200)}`);
    if (steps.length >= 3) {
      console.log(`\n  IMPROVED guidedReasoning Step 3:`);
      console.log(`    what: ${steps[2].what.slice(0, 100)}`);
      console.log(`    why:  ${steps[2].why.slice(0, 300)}`);
    }
  }

  // Show improved confusionPoints
  console.log(`\n  IMPROVED confusionPoints:`);
  for (const cp of improved.confusionPoints.slice(0, 2)) {
    console.log(`    - ${cp.slice(0, 250)}`);
  }
}

async function main() {
  // Load saved benchmark results (raw lessons before pipeline)
  const benchFile = "./benchmark_results_detailed.json";
  const data = JSON.parse(fs.readFileSync(benchFile, "utf-8"));

  // Find M4 and P4 (gpt-4o-mini baseline)
  const questions = ["M4", "P4"];

  for (const qid of questions) {
    const row = data.raw.baseline.find((r: any) => r.questionId === qid && r.parsedOk);
    if (!row) {
      console.log(`${qid}: not found in benchmark results`);
      continue;
    }
    await testPipeline(qid, row.rawOutput);
  }

  console.log("\n\nPipeline test complete.");
}

main().catch(console.error);
