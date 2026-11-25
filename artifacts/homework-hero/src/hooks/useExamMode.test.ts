import assert from "node:assert/strict";
import test from "node:test";
import { makeAcademicContext } from "@/data/questions/academicContext";
import { loadConfig, saveExamConfig } from "./useExamMode";

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
