import assert from "node:assert/strict";
import test from "node:test";
import { mayPersistQualityStatus } from "./lessonGenerationPolicy.ts";

test("ordinary generation can save PASS and IMPROVE, while pass-only generation saves only PASS", () => {
  assert.equal(mayPersistQualityStatus("PASS", false), true);
  assert.equal(mayPersistQualityStatus("IMPROVE", false), true);
  assert.equal(mayPersistQualityStatus("PASS", true), true);
  assert.equal(mayPersistQualityStatus("IMPROVE", true), false);
});
