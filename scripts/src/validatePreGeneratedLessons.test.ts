import assert from "node:assert/strict";
import test from "node:test";
import {
  buildExpectedLessonIds,
  parseAdditionalLessonIds,
} from "./validatePreGeneratedLessons.ts";
import { PILOT_QUESTION_IDS } from "./preGeneratedLessonPilot.ts";

test("validator preserves every pilot ID and appends only explicit additional IDs", () => {
  const additions = ["math-approved-q", "science-approved-q", "it-approved-q"];
  const expected = buildExpectedLessonIds(PILOT_QUESTION_IDS, additions);

  assert.equal(expected.length, 29);
  assert.deepEqual(expected.slice(0, PILOT_QUESTION_IDS.length), [...PILOT_QUESTION_IDS]);
  assert.deepEqual(expected.slice(PILOT_QUESTION_IDS.length), additions);
});

test("validator parses trimmed comma-separated additional IDs", () => {
  assert.deepEqual(
    parseAdditionalLessonIds(["--additional-ids=math-q, science-q", "--other-option"]),
    ["math-q", "science-q"],
  );
});

test("validator rejects empty, duplicate, or pilot-overlapping additional IDs", () => {
  assert.throws(() => parseAdditionalLessonIds(["--additional-ids="]), /requires one or more/);
  assert.throws(() => parseAdditionalLessonIds(["--additional-ids", "math-q"]), /Use --additional-ids=/);
  assert.throws(
    () => parseAdditionalLessonIds(["--additional-ids=math-q,math-q"]),
    /duplicate question IDs/,
  );
  assert.throws(
    () => buildExpectedLessonIds(PILOT_QUESTION_IDS, [PILOT_QUESTION_IDS[0]]),
    /must not repeat a frozen pilot/,
  );
});
