import assert from "node:assert/strict";
import test from "node:test";
import { recordUniquePractice } from "./useProgress";

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
