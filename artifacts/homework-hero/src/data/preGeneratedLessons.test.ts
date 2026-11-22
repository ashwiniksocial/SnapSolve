import assert from "node:assert/strict";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import encodedChunk from "./generatedLessonChunks/9--Physics--phy-ch4";
import { QUESTIONS } from "./questions/class9-physics-ch4";
import {
  resolveStoredLessonEntry,
  type PreGeneratedLessonChunk,
} from "./preGeneratedLessons";

const chunk = JSON.parse(
  gunzipSync(Buffer.from(encodedChunk, "base64")).toString("utf8"),
) as PreGeneratedLessonChunk;

test("saved Q1 and Q3 lessons resolve without invoking a model", () => {
  for (const [id, expectedSteps] of [
    ["c9-phy-ch4-t6-q01", 6],
    ["c9-phy-ch4-t6-q03", 4],
  ] as const) {
    const question = QUESTIONS.find((item) => item.id === id);
    assert.ok(question, `canonical question ${id} exists`);

    const response = resolveStoredLessonEntry(chunk.lessons[id], question);
    assert.ok(response, `${id} resolves from the saved chunk`);
    assert.equal(response.source, "bank");
    assert.equal(response.lesson.guidedReasoning.length, expectedSteps);
    assert.equal(response.detectedQuestion, question.question);
  }
});

test("absent Q2 does not resolve to a lesson or trigger fallback itself", () => {
  const question = QUESTIONS.find((item) => item.id === "c9-phy-ch4-t6-q02");
  assert.ok(question);
  assert.equal(resolveStoredLessonEntry(chunk.lessons[question.id], question), null);
});
