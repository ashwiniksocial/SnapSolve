import assert from "node:assert/strict";
import test from "node:test";
import {
  getSubjectStatsFromProgress,
  recordSolvedPractice,
  recordUniquePractice,
} from "./useProgress";

test("a confidence check-in records unique coverage without inventing a correct answer", () => {
  const empty = {} as Parameters<typeof recordUniquePractice>[0];
  const recorded = recordUniquePractice(empty, "Mathematics", "Number Systems", "math-q1");
  const topic = recorded.Mathematics["Number Systems"];

  assert.deepEqual(topic.attempted, ["math-q1"]);
  assert.equal(topic.solved, 0);
  assert.equal(topic.correct, 0);
});

test("practice recording repairs a legacy topic record without an attempted list", () => {
  const legacy = {
    Mathematics: {
      Algebra: { solved: 3, correct: 2 },
    },
  } as unknown as Parameters<typeof recordUniquePractice>[0];

  const recorded = recordUniquePractice(legacy, "Mathematics", "Algebra", "math-q2");
  assert.deepEqual(recorded.Mathematics.Algebra.attempted, ["math-q2"]);
  assert.equal(recorded.Mathematics.Algebra.solved, 3);
  assert.equal(recorded.Mathematics.Algebra.correct, 2);
});

test("repeating confidence submission for the same question does not add coverage again", () => {
  const empty = {} as Parameters<typeof recordUniquePractice>[0];
  const first = recordUniquePractice(empty, "Mathematics", "Number Systems", "math-q1");
  const repeated = recordUniquePractice(first, "Mathematics", "Number Systems", "math-q1");

  assert.equal(repeated, first);
  assert.deepEqual(repeated.Mathematics["Number Systems"].attempted, ["math-q1"]);
});

test("solving a legacy topic repairs missing attempt IDs and preserves accuracy totals", () => {
  const legacy = {
    Mathematics: { Algebra: { solved: 3, correct: 2 } },
  } as unknown as Parameters<typeof recordSolvedPractice>[0];

  const next = recordSolvedPractice(legacy, "Mathematics", "Algebra", true, "math-q4");
  assert.equal(next.Mathematics.Algebra.solved, 4);
  assert.equal(next.Mathematics.Algebra.correct, 3);
  assert.deepEqual(next.Mathematics.Algebra.attempted, ["math-q4"]);
});

test("student-facing Science statistics aggregate native Physics, Chemistry, Biology and legacy Science", () => {
  const progress = {
    Science: { "Typed scan": { solved: 1, correct: 0, attempted: [] } },
    Physics: { Force: { solved: 2, correct: 1, attempted: ["phy-q1", "phy-q2"] } },
    Biology: { Force: { solved: 1, correct: 1, attempted: ["phy-q2", "bio-q1"] } },
    Chemistry: { Matter: { solved: 1, correct: 1, attempted: ["chem-q1"] } },
  } as unknown as Parameters<typeof getSubjectStatsFromProgress>[0];

  const stats = getSubjectStatsFromProgress(progress, "Science");
  assert.equal(stats.totalSolved, 5);
  assert.equal(stats.totalCorrect, 3);
  assert.equal(stats.accuracy, 60);
  assert.deepEqual(
    stats.topicStats.find((topic) => topic.topic === "Force")?.attempted.sort(),
    ["bio-q1", "phy-q1", "phy-q2"],
  );
  assert.deepEqual(stats.weakTopics, ["Typed scan"]);
});
