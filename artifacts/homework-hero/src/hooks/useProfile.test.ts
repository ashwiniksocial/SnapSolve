import assert from "node:assert/strict";
import test from "node:test";
import { syncProfileFormField } from "./useProfile";

test("profile form adopts asynchronously loaded values until the user edits that field", () => {
  assert.equal(syncProfileFormField("stale local board", "CBSE", false), "CBSE");
  assert.equal(syncProfileFormField(8, 9, false), 9);
  assert.equal(syncProfileFormField("ICSE", "CBSE", true), "ICSE");
});
