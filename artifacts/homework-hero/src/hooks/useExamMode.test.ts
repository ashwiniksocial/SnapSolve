import assert from "node:assert/strict";
import test from "node:test";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import {
  loadCompletedTasks,
  loadConfig,
  mergeCompletedTasks,
  persistCompletedExamTask,
  saveExamConfig,
  type ExamTask,
} from "./useExamMode";

const config = {
  examName: "CBSE Class 9 final exam",
  subject: "All" as const,
  examDate: "2027-02-25",
  createdAt: "2026-11-25T00:00:00.000Z",
};

function withLocalStorage<T>(storage: Storage, run: () => T): T {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  try {
    return run();
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
}

test("exam countdown saves the scoped config and reloads it after refresh", () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as unknown as Storage;

  withLocalStorage(storage, () => {
    const key = "studyai-exam-v2:CBSE:9";
    const result = saveExamConfig(key, makeAcademicContext("CBSE", 9), config);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.config.boardId, "CBSE");
    assert.equal(result.config.classNum, 9);
    assert.deepEqual(loadConfig(key), result.config);
  });
});

test("exam setup reports missing academic scope rather than silently ignoring save", () => {
  const result = saveExamConfig(null, null, config);
  assert.deepEqual(result, { ok: false, reason: "missing-academic-context" });
});

test("exam setup reports local storage failures", () => {
  const storage = {
    getItem: () => null,
    setItem: () => { throw new Error("storage blocked"); },
    removeItem: () => undefined,
  } as unknown as Storage;

  const result = withLocalStorage(storage, () =>
    saveExamConfig("studyai-exam-v2:CBSE:9", makeAcademicContext("CBSE", 9), config),
  );
  assert.deepEqual(result, { ok: false, reason: "storage-unavailable" });
});

test("completed plan tasks persist as Done after refresh without changing question coverage", () => {
  const values = new Map<string, string>();
  const coverageKey = scopedStorageKey("studyai-progress-v3", makeAcademicContext("CBSE", 9));
  const attemptKey = scopedStorageKey("studyai-attempt-log-v2", makeAcademicContext("CBSE", 9));
  if (coverageKey) values.set(coverageKey, "pre-existing coverage");
  if (attemptKey) values.set(attemptKey, "pre-existing attempts");
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } as unknown as Storage;
  const task: ExamTask = {
    id: "weak-Mathematics-Algebra",
    type: "practice",
    subject: "Mathematics",
    topic: "Algebra",
    chapter: "Number Systems",
    label: "Review Algebra",
    description: "Practice questions for Algebra.",
    estimatedMin: 15,
    priority: "high",
    href: "/practice?subject=Mathematics&topic=Algebra&returnTo=%2Fexam",
    completedToday: false,
  };

  withLocalStorage(storage, () => {
    const persisted = persistCompletedExamTask("exam:done:today", "exam:done:today:tasks", task);
    assert.ok(persisted);
    assert.deepEqual([...persisted.completedIds], [task.id]);
    assert.equal(persisted.completedTasks[0].completedToday, true);

    const afterRefresh = loadCompletedTasks("exam:done:today:tasks");
    assert.equal(afterRefresh[0].id, task.id);
    assert.equal(afterRefresh[0].completedToday, true);
    assert.deepEqual(
      mergeCompletedTasks([], afterRefresh, new Set([task.id])).map((item) => [item.id, item.completedToday]),
      [[task.id, true]],
    );
    assert.equal(coverageKey ? values.get(coverageKey) : null, "pre-existing coverage");
    assert.equal(attemptKey ? values.get(attemptKey) : null, "pre-existing attempts");
  });
});

test("completed task IDs mark regenerated tasks Done and do not duplicate their cards", () => {
  const task: ExamTask = {
    id: "chapter-physics-force",
    type: "chapter",
    subject: "Science",
    topic: "Force",
    chapter: "Motion",
    label: "Finish Force",
    description: "Complete the chapter task.",
    estimatedMin: 20,
    priority: "medium",
    href: "/practice?subject=Science&topic=Force",
    completedToday: false,
  };

  const merged = mergeCompletedTasks([task], [task], new Set([task.id]));
  assert.equal(merged.length, 1);
  assert.equal(merged[0].completedToday, true);
});
