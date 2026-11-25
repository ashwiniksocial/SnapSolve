import assert from "node:assert/strict";
import test from "node:test";
import { resolvePracticeTarget } from "./Practice";

const chapters = [
  {
    id: "science-1",
    topics: [
      { id: "motion", name: "Motion" },
      { id: "force", name: "Force" },
    ],
  },
  {
    id: "science-2",
    topics: [{ id: "energy", name: "Energy" }],
  },
];

test("Practice resolves an assigned topic to its chapter and topic filter", () => {
  assert.deepEqual(resolvePracticeTarget(chapters, null, "Force"), {
    chapterId: "science-1",
    topicId: "force",
  });
});

test("Practice respects an explicit chapter and accepts saved topic IDs", () => {
  assert.deepEqual(resolvePracticeTarget(chapters, "science-2", "energy"), {
    chapterId: "science-2",
    topicId: "energy",
  });
});

test("an invalid target safely falls back to an accessible chapter without a false topic filter", () => {
  assert.deepEqual(resolvePracticeTarget(chapters, "missing", "missing"), {
    chapterId: "science-1",
    topicId: "all",
  });
});
