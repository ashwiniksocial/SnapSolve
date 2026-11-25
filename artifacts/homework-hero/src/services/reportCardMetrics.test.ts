import assert from "node:assert/strict";
import test from "node:test";
import type { SubjectStats } from "@/hooks/useProgress";
import type { ChapterCompletion } from "@/hooks/useChapterStats";
import {
  deriveImprovementSteps,
  deriveReportCardMetrics,
  formatTrackedStudyTime,
} from "./reportCardMetrics";

function stats(
  topics: SubjectStats["topicStats"],
  totalSolved = topics.reduce((sum, topic) => sum + topic.solved, 0),
  totalCorrect = topics.reduce((sum, topic) => sum + topic.correct, 0),
): SubjectStats {
  return {
    totalSolved,
    totalCorrect,
    accuracy: totalSolved ? Math.round((totalCorrect / totalSolved) * 100) : 0,
    topicStats: topics,
    weakTopics: topics.filter((topic) => topic.solved > 0 && topic.accuracy < 60).map((topic) => topic.topic),
    strongTopics: topics.filter((topic) => topic.solved >= 3 && topic.accuracy >= 80).map((topic) => topic.topic),
    recommendations: [],
  };
}

function chapter(
  totalQuestions: number,
  topics: Array<{ name: string; totalQuestions: number; attempted: number }>,
): ChapterCompletion {
  return {
    chapterId: "ch1",
    chapterName: "Sample chapter",
    chapterNumber: 1,
    totalQuestions,
    attempted: topics.reduce((sum, topic) => sum + topic.attempted, 0),
    correct: 0,
    solved: 0,
    accuracy: 0,
    completionPct: 0,
    topics: topics.map((topic, index) => ({
      topicId: `t${index + 1}`,
      topicName: topic.name,
      totalQuestions: topic.totalQuestions,
      attempted: topic.attempted,
      correct: 0,
      solved: 0,
      accuracy: 0,
      masteryPct: 0,
      completionPct: 0,
    })),
  };
}

test("report card separates unique practice coverage from graded accuracy", () => {
  const mathStats = stats([
    { topic: "Coordinates", solved: 2, correct: 1, accuracy: 50, masteryPct: 50, attempted: ["m-q1", "m-q2", "m-q3"] },
  ]);
  const scienceStats = stats([
    { topic: "Cells", solved: 0, correct: 0, accuracy: 0, masteryPct: 0, attempted: ["bio-q1"] },
  ]);
  const metrics = deriveReportCardMetrics([
    {
      subject: "Mathematics",
      stats: mathStats,
      chapters: [chapter(10, [
        { name: "Coordinates", totalQuestions: 8, attempted: 2 },
        { name: "Plotting", totalQuestions: 2, attempted: 0 },
      ])],
    },
    {
      subject: "Science",
      stats: scienceStats,
      chapters: [chapter(6, [
        { name: "Cells", totalQuestions: 6, attempted: 1 },
      ])],
    },
  ]);

  assert.equal(metrics.questionsPractised, 3);
  assert.equal(metrics.activeQuestions, 16);
  assert.equal(metrics.topicsCovered, 2);
  assert.equal(metrics.activeTopics, 3);
  assert.equal(metrics.gradedAnswers, 2);
  assert.equal(metrics.gradedCorrect, 1);
  assert.equal(metrics.gradedAccuracy, 50);
});

test("strengths and weak areas use graded answers only", () => {
  const metrics = deriveReportCardMetrics([{
    subject: "Mathematics",
    stats: stats([
      { topic: "Strength", solved: 3, correct: 3, accuracy: 100, masteryPct: 100, attempted: ["m1", "m2", "m3"] },
      { topic: "Needs work", solved: 2, correct: 0, accuracy: 0, masteryPct: 0, attempted: ["m4", "m5"] },
      { topic: "Check-in only", solved: 0, correct: 0, accuracy: 0, masteryPct: 0, attempted: ["m6"] },
    ]),
    chapters: [chapter(6, [
      { name: "Strength", totalQuestions: 2, attempted: 2 },
      { name: "Needs work", totalQuestions: 2, attempted: 2 },
      { name: "Check-in only", totalQuestions: 2, attempted: 1 },
    ])],
  }]);

  assert.deepEqual(metrics.strengths.map((topic) => topic.topic), ["Strength"]);
  assert.deepEqual(metrics.weakAreas.map((topic) => topic.topic), ["Needs work"]);
  assert.equal(metrics.weakAreas[0].gradedAnswers, 2);
});

test("inactive or empty topic placeholders do not inflate coverage denominators", () => {
  const metrics = deriveReportCardMetrics([{
    subject: "Mathematics",
    stats: stats([]),
    chapters: [chapter(4, [
      { name: "Active", totalQuestions: 4, attempted: 1 },
      { name: "Empty placeholder", totalQuestions: 0, attempted: 0 },
    ])],
  }]);

  assert.equal(metrics.activeQuestions, 4);
  assert.equal(metrics.activeTopics, 1);
  assert.equal(metrics.topicsCovered, 1);
  assert.equal(metrics.gradedAccuracy, null);
});

test("improvement steps cite graded weaknesses, scheduled reviews, and uncovered topics", () => {
  const metrics = deriveReportCardMetrics([{
    subject: "Mathematics",
    stats: stats([
      { topic: "Fractions", solved: 3, correct: 1, accuracy: 33, masteryPct: 33, attempted: ["m1", "m2", "m3"] },
    ]),
    chapters: [chapter(8, [
      { name: "Fractions", totalQuestions: 4, attempted: 3 },
      { name: "Geometry", totalQuestions: 4, attempted: 0 },
    ])],
  }]);

  const steps = deriveImprovementSteps(metrics, 2, 1, 90_000);
  assert.equal(steps.length, 3);
  assert.match(steps[0].title, /Fractions/);
  assert.match(steps[0].evidence, /33% across 3 graded answers/);
  assert.equal(steps[1].href, "/revision");
  assert.match(steps[1].evidence, /2 due now/);
  assert.match(steps[2].title, /Geometry/);
  assert.match(steps[2].evidence, /No practice is recorded/);
});

test("confidence-only practice does not become a weak concept or graded recommendation", () => {
  const metrics = deriveReportCardMetrics([{
    subject: "Science",
    stats: stats([
      { topic: "Cells", solved: 0, correct: 0, accuracy: 0, masteryPct: 0, attempted: ["s1"] },
    ]),
    chapters: [chapter(5, [
      { name: "Cells", totalQuestions: 3, attempted: 1 },
      { name: "Forces", totalQuestions: 2, attempted: 0 },
    ])],
  }]);

  const steps = deriveImprovementSteps(metrics, 0, 1, 0);
  assert.equal(metrics.weakAreas.length, 0);
  assert.equal(steps.length, 2);
  assert.equal(steps[0].href, "/revision");
  assert.match(steps[1].title, /Forces/);
});

test("no activity produces no personalized steps and time shows only measured values", () => {
  const metrics = deriveReportCardMetrics([{
    subject: "Mathematics",
    stats: stats([]),
    chapters: [chapter(4, [
      { name: "Algebra", totalQuestions: 4, attempted: 0 },
    ])],
  }]);

  assert.deepEqual(deriveImprovementSteps(metrics, 0, 0, 0), []);
  assert.equal(formatTrackedStudyTime(0), "No time logged");
  assert.equal(formatTrackedStudyTime(30_000), "Under 1 min");
  assert.equal(formatTrackedStudyTime(3_720_000), "1 hr 2 min");
});
