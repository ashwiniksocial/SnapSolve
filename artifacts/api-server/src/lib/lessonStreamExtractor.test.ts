import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyLessonStreamCompletion,
  runWithSingleLessonStreamRecovery,
} from "./lessonStreamExtractor";

test("classifies valid complete JSON", () => {
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":\"Simple Machines\"}",
      finishReason: "stop",
      sawDoneMarker: true,
    }),
    { status: "complete", json: { topic: "Simple Machines" } },
  );
});

test("classifies finish_reason length as output truncation", () => {
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":\"looks complete\"}",
      finishReason: "length",
      sawDoneMarker: true,
    }),
    { status: "failed", category: "output_truncation" },
  );
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":\"partial",
      finishReason: "length",
      sawDoneMarker: false,
      interrupted: true,
    }),
    { status: "failed", category: "output_truncation" },
  );
});

test("classifies a thrown read and a missing done marker as interrupted streams", () => {
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":\"partial",
      finishReason: null,
      sawDoneMarker: false,
      interrupted: true,
    }),
    { status: "failed", category: "interrupted_stream" },
  );
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":\"complete\"}",
      finishReason: "stop",
      sawDoneMarker: false,
    }),
    { status: "failed", category: "interrupted_stream" },
  );
});

test("distinguishes malformed JSON after a normally ended response", () => {
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "{\"topic\":",
      finishReason: "stop",
      sawDoneMarker: true,
    }),
    { status: "failed", category: "invalid_json" },
  );
});

test("classifies empty model output", () => {
  assert.deepEqual(
    classifyLessonStreamCompletion({
      text: "  ",
      finishReason: "stop",
      sawDoneMarker: true,
    }),
    { status: "failed", category: "empty_response" },
  );
});

test("allows exactly one recovery for incomplete output", async () => {
  const outcomes = [
    { status: "failed" as const, category: "output_truncation" as const },
    { status: "complete" as const, value: "recovered lesson" },
  ];
  let calls = 0;
  const result = await runWithSingleLessonStreamRecovery(async () => {
    calls += 1;
    return outcomes[calls - 1];
  }, true);

  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.deepEqual(result.outcome, { status: "complete", value: "recovered lesson" });
});

test("stops after recovery is exhausted", async () => {
  let calls = 0;
  const result = await runWithSingleLessonStreamRecovery(async () => {
    calls += 1;
    return { status: "failed" as const, category: "invalid_json" as const };
  }, true);

  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.deepEqual(result.outcome, { status: "failed", category: "invalid_json" });
});

test("does not retry academic validation failures", async () => {
  let calls = 0;
  const result = await runWithSingleLessonStreamRecovery(async () => {
    calls += 1;
    return { status: "failed" as const, category: "validation_failure" as const };
  }, true);

  assert.equal(calls, 1);
  assert.equal(result.attempts, 1);
  assert.deepEqual(result.outcome, { status: "failed", category: "validation_failure" });
});

test("does not retry when recovery is disabled", async () => {
  let calls = 0;
  const result = await runWithSingleLessonStreamRecovery(async () => {
    calls += 1;
    return { status: "failed" as const, category: "incomplete_lesson" as const };
  }, false);

  assert.equal(calls, 1);
  assert.equal(result.attempts, 1);
});
