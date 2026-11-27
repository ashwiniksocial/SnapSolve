import assert from "node:assert/strict";
import test from "node:test";
import { zeroUsage } from "../../lib/aiCost";
import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";
import type { ReviewReport } from "./lessonReviewer";
import {
  classifyTeachingQuality,
  mayDeliverTeachingQualityStatus,
  runQualityPipeline,
  type QualityPipelineServices,
} from "./index";
import type { DimensionScores } from "./qualityScoreEngine";

function lesson(): LessonResponse {
  return parseLessonResponse({
    topic: "Triangle congruence",
    difficulty: "Hard",
    keyConcepts: ["SSS"],
    intuition: {
      story: "Compare the matching sides.",
      visual: "Three side pairs match.",
      everyday: "",
    },
    guidedReasoning: [{
      what: "Compare three side pairs.",
      why: "SSS uses three equal side pairs.",
      math: "",
      result: "The triangles are congruent.",
      pause: "",
    }],
    finalAnswer: {
      answer: "The triangles are congruent by SSS.",
      whyCorrect: "All three corresponding sides match.",
      verification: "SSS applies.",
    },
  });
}

function scores(value: number): DimensionScores {
  return {
    vocabulary: value,
    conceptTeaching: value,
    reasoning: value,
    stepExplanation: value,
    examples: value,
    memory: value,
    practice: value,
    confidenceBuilding: value,
    weakStudentUnderstanding: value,
    overall: value,
  };
}

function report(passed: boolean, score = passed ? 100 : 60): ReviewReport {
  return {
    scores: scores(score),
    confusions: [],
    criticalIssues: [],
    passed,
    rubricLabel: passed ? "PASS" : "FAIL",
  };
}

function services(
  review: QualityPipelineServices["reviewLesson"],
  improve: QualityPipelineServices["improveLesson"] = async (current) => ({
    lesson: current,
    usage: zeroUsage(),
    latencyMs: 1,
  }),
): QualityPipelineServices {
  return { reviewLesson: review, improveLesson: improve };
}

const reviewOnly = {
  maxReviewCycles: 1,
  allowImprovements: false,
  requireReviewerPass: true,
};

test("Simplify accepts a passing academic review without running the generic improver", async () => {
  let improveCalls = 0;
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    reviewOnly,
    services(
      async () => ({ report: report(true), usage: zeroUsage(), latencyMs: 1 }),
      async (current) => {
        improveCalls += 1;
        return { lesson: current, usage: zeroUsage(), latencyMs: 1 };
      },
    ),
  );

  assert.equal(result.passed, true);
  assert.equal(result.reviewFailed, false);
  assert.equal(result.reviewerCalls, 1);
  assert.equal(result.improverCalls, 0);
  assert.equal(improveCalls, 0);
});

test("Simplify review rejection is fail-closed and does not invoke an improver", async () => {
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    reviewOnly,
    services(async () => ({
      report: report(false),
      usage: zeroUsage(),
      latencyMs: 1,
    })),
  );

  assert.equal(result.passed, false);
  assert.equal(result.reviewFailed, false);
  assert.equal(result.improverCalls, 0);
});

test("bank lessons may persist as IMPROVE when only review scores miss targets", async () => {
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    { maxReviewCycles: 1, allowImprovements: false, requireReviewerPass: false },
    services(async () => ({
      report: report(false, 50),
      usage: zeroUsage(),
      latencyMs: 1,
    })),
  );

  assert.equal(result.passed, true);
  assert.equal(result.decision.status, "IMPROVE");
  assert.ok(result.decision.improvementFlags.some((flag) => flag.includes("weakStudentUnderstanding")));
  assert.equal(result.reviewerCalls, 1);
  assert.equal(result.improverCalls, 0);
});

test("a reviewer rejection is not overridden by passing dimension scores for Simplify", async () => {
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    reviewOnly,
    services(async () => ({
      report: report(false, 100),
      usage: zeroUsage(),
      latencyMs: 1,
    })),
  );

  assert.equal(result.passed, false);
  assert.equal(result.improverCalls, 0);
});

test("reviewer failure is not reported as academic approval", async () => {
  let improveCalls = 0;
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    reviewOnly,
    services(
      async () => {
        throw new Error("review service unavailable");
      },
      async (current) => {
        improveCalls += 1;
        return { lesson: current, usage: zeroUsage(), latencyMs: 1 };
      },
    ),
  );

  assert.equal(result.passed, false);
  assert.equal(result.reviewFailed, true);
  assert.equal(result.reviewerCalls, 0);
  assert.equal(result.improverCalls, 0);
  assert.equal(improveCalls, 0);
});

test("reviewer timeout is not reported as academic approval", async () => {
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    reviewOnly,
    services(async () => {
      const timeout = new Error("review timed out");
      timeout.name = "AbortError";
      throw timeout;
    }),
  );

  assert.equal(result.passed, false);
  assert.equal(result.reviewFailed, true);
  assert.equal(result.improverCalls, 0);
});

test("the default quality pipeline retains its existing improvement cycle", async () => {
  let reviewCalls = 0;
  let improveCalls = 0;
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    undefined,
    services(
      async () => ({
        report: report(++reviewCalls > 1),
        usage: zeroUsage(),
        latencyMs: 1,
      }),
      async (current) => {
        improveCalls += 1;
        return {
          lesson: {
            ...current,
            intuition: { ...current.intuition, visual: "An improved explanation." },
          },
          usage: zeroUsage(),
          latencyMs: 1,
        };
      },
    ),
  );

  assert.equal(result.passed, true);
  assert.equal(result.reviewFailed, false);
  assert.equal(result.reviewerCalls, 2);
  assert.equal(result.improverCalls, 1);
  assert.equal(improveCalls, 1);
});

test("quality logs retain exact reviewer feedback for blocked-draft diagnostics", async () => {
  const issue = {
    section: "guidedReasoning",
    findingType: "unclear" as const,
    mode: "Detailed" as const,
    evidence: [{
      section: "Step-by-Step Solution",
      quote: "Compare three side pairs.",
    }],
    reviewedSections: [],
    problem: "The lesson skips why the numerator and denominator are divided by the same value.",
    reason: "A weak student may treat the reduction as an unexplained rule.",
    suggestedFix: "Explain that dividing both parts by the same nonzero number keeps the ratio unchanged.",
    priority: "high" as const,
  };
  const result = await runQualityPipeline(
    lesson(),
    "",
    undefined,
    { maxReviewCycles: 1, allowImprovements: false, requireReviewerPass: true },
    services(async () => ({
      report: {
        ...report(false, 75),
        confusions: ["Why can both parts of the fraction be divided by the same number?"],
        criticalIssues: [issue],
      },
      usage: zeroUsage(),
      latencyMs: 1,
    })),
  );

  assert.equal(result.decision.status, "REVIEW_REQUIRED");
  assert.deepEqual(result.qualityLog[0]?.criticalIssues, [issue]);
  assert.deepEqual(result.qualityLog[0]?.confusions, [
    "Why can both parts of the fraction be divided by the same number?",
  ]);
});

test("quality decision marks a sufficiently strong lesson with a medium weakness IMPROVE", () => {
  const result = classifyTeachingQuality({
    ...report(false, 75),
    scores: { ...scores(85), examples: 75, overall: 84 },
    criticalIssues: [{
      section: "examples",
      findingType: "unclear",
      mode: "Detailed",
      evidence: [{ section: "One Similar Example", quote: "A comparison example." }],
      reviewedSections: [],
      problem: "The example could use one clearer intermediate explanation.",
      reason: "A weak student may need another cue.",
      suggestedFix: "Add one sentence explaining the comparison.",
      priority: "medium",
    }],
    confusions: [],
  });

  assert.equal(result.status, "IMPROVE");
  assert.deepEqual(result.blockReasons, []);
  assert.ok(result.improvementFlags.includes("dimension_below_pass_target:examples=75"));
  assert.ok(result.improvementFlags.includes("medium_priority_issue:unclear:examples"));
});

test("incorrect reasoning is held while low reviewer scores become advisory", () => {
  const critical = classifyTeachingQuality({
    ...report(true, 90),
    scores: scores(90),
    criticalIssues: [{
      section: "guidedReasoning",
      findingType: "incorrect",
      mode: "Detailed",
      evidence: [{ section: "Step-by-Step Solution", quote: "The triangles are not congruent." }],
      reviewedSections: [],
      problem: "The explanation teaches an incorrect relationship.",
      reason: "This would mislead the student.",
      suggestedFix: "Correct the relationship.",
      priority: "critical",
    }],
    confusions: [],
  });
  const lowUnderstanding = classifyTeachingQuality({
    ...report(false, 75),
    scores: { ...scores(75), weakStudentUnderstanding: 65, overall: 74 },
    criticalIssues: [],
    confusions: [],
  });

  assert.equal(critical.status, "REVIEW_REQUIRED");
  assert.match(critical.blockReasons[0] ?? "", /incorrect:guidedReasoning/);
  assert.equal(critical.resolution, "manual_review_once");
  assert.equal(lowUnderstanding.status, "IMPROVE");
  assert.deepEqual(lowUnderstanding.blockReasons, []);
  assert.ok(lowUnderstanding.improvementFlags.includes(
    "dimension_below_pass_target:weakStudentUnderstanding=65",
  ));
});

test("Probability Q3 weak-student score of 50 is advisory when no material finding exists", () => {
  const decision = classifyTeachingQuality({
    ...report(false, 75),
    scores: { ...scores(75), weakStudentUnderstanding: 50, overall: 70 },
    criticalIssues: [],
    confusions: [],
  });

  assert.equal(decision.status, "IMPROVE");
  assert.deepEqual(decision.blockReasons, []);
  assert.ok(decision.improvementFlags.includes(
    "dimension_below_pass_target:weakStudentUnderstanding=50",
  ));
});

test("reviewer failures and missing diagnostics are held with a bounded resolution", () => {
  const unavailable = classifyTeachingQuality(null, true);
  const missing = classifyTeachingQuality(null, false);
  assert.equal(unavailable.status, "REVIEW_REQUIRED");
  assert.equal(missing.status, "REVIEW_REQUIRED");
  assert.deepEqual(unavailable.blockReasons, ["reviewer_unavailable"]);
  assert.deepEqual(missing.blockReasons, ["review_diagnostics_missing"]);
  assert.equal(unavailable.resolution, "manual_review_once");
});

test("only PASS and IMPROVE are deliverable; holds and blocks cannot reach students", () => {
  assert.equal(mayDeliverTeachingQualityStatus("PASS"), true);
  assert.equal(mayDeliverTeachingQualityStatus("IMPROVE"), true);
  assert.equal(mayDeliverTeachingQualityStatus("REVIEW_REQUIRED"), false);
  assert.equal(mayDeliverTeachingQualityStatus("BLOCK"), false);
});

test("optional missing teaching coverage across subjects is advisory", () => {
  const cases = [
    ["Math", "probability_context"],
    ["Science", "permeability_explanation"],
    ["IT", "security_reasoning"],
  ] as const;

  for (const [subject, section] of cases) {
    const decision = classifyTeachingQuality({
      ...report(false, 75),
      scores: scores(75),
      criticalIssues: [{
        section,
        findingType: "missing",
        mode: "Detailed",
        evidence: [],
        reviewedSections: ["Key Concept", "Step-by-Step Solution", "Final Answer"],
        problem: `Reviewer could not locate the ${subject} teaching context.`,
        reason: "The issue has no supporting quote from the student-visible lesson.",
        suggestedFix: "Manually compare the rendered sections once.",
        priority: "high",
      }],
      confusions: [],
    });

    assert.equal(decision.status, "IMPROVE", `${subject} remains eligible`);
    assert.deepEqual(decision.blockReasons, []);
    assert.ok(decision.improvementFlags.some((flag) => flag.includes(`missing:${section}`)));
  }
});

test("unclear core reasoning blocks while missing explanatory details remain advisory", () => {
  const baseIssue = {
    mode: "Detailed" as const,
    evidence: [],
    reviewedSections: ["Key Concept", "Step-by-Step Solution", "Final Answer"],
    reason: "The student may need additional explanation.",
    suggestedFix: "Clarify or expand the relevant section.",
    priority: "medium" as const,
  };
  const unclearCore = classifyTeachingQuality({
    ...report(false, 95),
    scores: scores(95),
    criticalIssues: [{
      ...baseIssue,
      section: "guidedReasoning[0].why",
      findingType: "unclear",
      problem: "The reason does not explain the step.",
    }],
    confusions: [],
  });
  const missingCoreDetail = classifyTeachingQuality({
    ...report(false, 65),
    scores: scores(65),
    criticalIssues: [{
      ...baseIssue,
      section: "Final Answer",
      findingType: "missing",
      problem: "One additional explanation is missing.",
    }],
    confusions: [],
  });

  assert.equal(unclearCore.status, "REVIEW_REQUIRED");
  assert.match(unclearCore.blockReasons[0] ?? "", /unclear:guidedReasoning/);
  assert.equal(missingCoreDetail.status, "IMPROVE");
  assert.deepEqual(missingCoreDetail.blockReasons, []);
  assert.ok(missingCoreDetail.improvementFlags.includes("medium_priority_issue:missing:Final Answer"));
});
