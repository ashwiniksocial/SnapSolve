import assert from "node:assert/strict";
import test from "node:test";
import { zeroUsage } from "../../lib/aiCost";
import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";
import type { ReviewReport } from "./lessonReviewer";
import {
  classifyTeachingQuality,
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

test("quality decision marks a sufficiently strong lesson with a medium weakness IMPROVE", () => {
  const result = classifyTeachingQuality({
    ...report(false, 75),
    scores: { ...scores(85), examples: 75, overall: 84 },
    criticalIssues: [{
      section: "examples",
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
  assert.ok(result.improvementFlags.includes("medium_priority_issue:examples"));
});

test("quality decision blocks critical issues and weak-student comprehension floors", () => {
  const critical = classifyTeachingQuality({
    ...report(true, 90),
    scores: scores(90),
    criticalIssues: [{
      section: "guidedReasoning",
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

  assert.equal(critical.status, "BLOCK");
  assert.deepEqual(critical.blockReasons, ["blocking_issue:guidedReasoning"]);
  assert.equal(lowUnderstanding.status, "BLOCK");
  assert.ok(lowUnderstanding.blockReasons.includes("student_understanding_below_block_floor=65"));
});

test("quality decision blocks reviewer failures and missing diagnostics", () => {
  assert.equal(classifyTeachingQuality(null, true).status, "BLOCK");
  assert.equal(classifyTeachingQuality(null, false).status, "BLOCK");
});
