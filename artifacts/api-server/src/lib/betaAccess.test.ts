import assert from "node:assert/strict";
import test from "node:test";
import { isBetaEmailApproved } from "./betaAccess";

test("an unset general list preserves the existing open-beta behavior", () => {
  assert.equal(isBetaEmailApproved("student@example.test", undefined, undefined, "production"), true);
});

test("general beta approvals match normalized complete email addresses", () => {
  assert.equal(
    isBetaEmailApproved(" Student@Example.Test ", "other@example.test, student@example.test", undefined, "production"),
    true,
  );
  assert.equal(
    isBetaEmailApproved("student@example.test.attacker.test", "student@example.test", undefined, "development"),
    false,
  );
});

test("the configured founder email is approved only in the development environment", () => {
  assert.equal(
    isBetaEmailApproved(" Founder@Example.Test ", "student@example.test", "founder@example.test", "development"),
    true,
  );
  assert.equal(
    isBetaEmailApproved("founder@example.test", "student@example.test", "founder@example.test", "production"),
    false,
  );
  assert.equal(
    isBetaEmailApproved("founder@example.test", "student@example.test", "founder@example.test", "test"),
    false,
  );
});

test("a founder address cannot be matched by a missing or partial email", () => {
  assert.equal(
    isBetaEmailApproved(undefined, "student@example.test", "founder@example.test", "development"),
    false,
  );
  assert.equal(
    isBetaEmailApproved("founder", "student@example.test", "founder@example.test", "development"),
    false,
  );
});
