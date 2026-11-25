import assert from "node:assert/strict";
import test from "node:test";
import {
  applyRevisionReview,
  applySelfAssessment,
  buildRevisionSolutionHref,
  getDueRevisionItems,
  getUpcomingRevisionSchedule,
  loadRevisionStore,
  parseRevisionStore,
  resolveRevisionClassNum,
  saveRevisionStore,
  type RevisionStore,
  type SelfAssessmentInput,
} from "./useRevisionPlanner";

const today = "2026-08-20";
const question: SelfAssessmentInput = {
  questionId: "science-q35",
  boardId: "CBSE",
  classNum: 9,
  canonicalChapterId: "bio-ch01",
  academicSession: "2026-27",
  question: "Which cell structure controls what enters and leaves the cell?",
  subject: "Biology",
  topic: "Cell membrane",
  chapter: "The Fundamental Unit of Life",
  difficulty: "Medium",
};

function emptyStore(): RevisionStore {
  return { items: {}, selfAssessments: {} };
}

test("Class 9 self-assessments schedule for tomorrow and become due on that date", () => {
  const store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);
  const item = store.items[question.questionId];

  assert.ok(item);
  assert.equal(item.questionId, question.questionId);
  assert.equal(item.classNum, 9);
  assert.equal(item.boardId, "CBSE");
  assert.equal(item.interval, 1);
  assert.equal(item.nextReview, "2026-08-21");
  assert.equal(getDueRevisionItems(store.items, today).length, 0);
  assert.deepEqual(
    getUpcomingRevisionSchedule(store.items, today).map(({ date }) => date),
    ["2026-08-21"],
  );
  assert.deepEqual(
    getDueRevisionItems(store.items, "2026-08-21").map(({ questionId }) => questionId),
    [question.questionId],
  );
});

test("repeat Not Confident marking updates the same question and resets to one day", () => {
  let store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);
  store = applyRevisionReview(store, question.questionId, true, "2026-08-21");
  assert.equal(store.items[question.questionId].interval, 3);
  store = applySelfAssessment(store, question, "NEEDS_PRACTICE", "2026-08-22");

  assert.equal(Object.keys(store.items).length, 1);
  assert.equal(store.selfAssessments[question.questionId]?.status, "NEEDS_PRACTICE");
  assert.equal(store.items[question.questionId].interval, 1);
  assert.equal(store.items[question.questionId].nextReview, "2026-08-23");
  assert.equal(store.items[question.questionId].timesCorrect, 1);
});

test("review completion advances through 3, 7, and 14 days, then masters", () => {
  let store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);

  store = applyRevisionReview(store, question.questionId, true, "2026-08-21");
  assert.equal(store.items[question.questionId].interval, 3);
  assert.equal(store.items[question.questionId].nextReview, "2026-08-24");

  store = applyRevisionReview(store, question.questionId, true, "2026-08-24");
  assert.equal(store.items[question.questionId].interval, 7);
  assert.equal(store.items[question.questionId].nextReview, "2026-08-31");

  store = applyRevisionReview(store, question.questionId, true, "2026-08-31");
  assert.equal(store.items[question.questionId].interval, 14);
  assert.equal(store.items[question.questionId].nextReview, "2026-09-14");

  store = applyRevisionReview(store, question.questionId, true, "2026-09-14");
  assert.equal(store.items[question.questionId].mastered, true);
  assert.equal(store.items[question.questionId].nextReview, "2026-10-14");
  assert.deepEqual(getDueRevisionItems(store.items, "2026-10-14"), []);
});

test("an incorrect revision answer resets the schedule to one day", () => {
  let store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);
  store = applyRevisionReview(store, question.questionId, true, "2026-08-21");
  store = applyRevisionReview(store, question.questionId, false, "2026-08-24");

  assert.equal(store.items[question.questionId].interval, 1);
  assert.equal(store.items[question.questionId].nextReview, "2026-08-25");
  assert.equal(store.items[question.questionId].timesWrong, 1);
});

test("a refresh round-trip preserves question IDs, assessments, and legacy records", () => {
  const store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);
  const refreshed = parseRevisionStore(JSON.stringify(store));
  assert.deepEqual(refreshed, store);
  assert.equal(refreshed.items[question.questionId]?.questionId, question.questionId);

  const legacy = parseRevisionStore(JSON.stringify(store.items));
  assert.deepEqual(legacy.items, store.items);
  assert.deepEqual(legacy.selfAssessments, {});
});

test("localStorage reload preserves both marked Science question IDs", () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });

  try {
    const q75 = { ...question, questionId: "science-q75", question: "How does a cell membrane work?" };
    let store = applySelfAssessment(emptyStore(), question, "NEEDS_PRACTICE", today);
    store = applySelfAssessment(store, q75, "NEEDS_PRACTICE", today);
    saveRevisionStore("studyai-revision-v2:CBSE:9", store);

    // A new hook/page instance after navigation or refresh reads the same scoped key.
    const reloaded = loadRevisionStore("studyai-revision-v2:CBSE:9");
    assert.deepEqual(
      Object.keys(reloaded.items).sort(),
      ["science-q35", "science-q75"],
    );
    assert.equal(reloaded.items["science-q35"].nextReview, "2026-08-21");
    assert.equal(reloaded.items["science-q75"].nextReview, "2026-08-21");
  } finally {
    if (originalDescriptor) Object.defineProperty(globalThis, "localStorage", originalDescriptor);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("Revision uses the practice class when profile class is missing and preserves the ID in navigation", () => {
  assert.equal(resolveRevisionClassNum(9, null), 9);
  assert.equal(resolveRevisionClassNum(undefined, 8), 8);
  assert.equal(resolveRevisionClassNum(undefined, null), 9);
  assert.equal(
    buildRevisionSolutionHref("science-q35"),
    "/solution?practiceMode=1&questionId=science-q35",
  );
  assert.equal(
    buildRevisionSolutionHref("question id/75"),
    "/solution?practiceMode=1&questionId=question%20id%2F75",
  );
});
