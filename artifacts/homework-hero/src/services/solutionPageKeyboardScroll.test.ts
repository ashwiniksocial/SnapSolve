import assert from "node:assert/strict";
import test from "node:test";
import { getSolutionScrollTarget } from "./solutionPageKeyboardScroll";

const metrics = { scrollTop: 500, scrollHeight: 2_000, clientHeight: 1_000 };

test("arrow keys scroll a small amount", () => {
  assert.equal(getSolutionScrollTarget("ArrowUp", metrics), 452);
  assert.equal(getSolutionScrollTarget("ArrowDown", metrics), 548);
});

test("Page Up and Page Down move most of the viewport", () => {
  assert.equal(getSolutionScrollTarget("PageUp", metrics), 0);
  assert.equal(
    getSolutionScrollTarget("PageDown", { ...metrics, scrollHeight: 3_000 }),
    1_400,
  );
  assert.equal(
    getSolutionScrollTarget("PageDown", { ...metrics, clientHeight: 80 }),
    620,
  );
});

test("Home and End move to the document boundaries", () => {
  assert.equal(getSolutionScrollTarget("Home", metrics), 0);
  assert.equal(getSolutionScrollTarget("End", metrics), 1_000);
});

test("scroll targets clamp at document boundaries", () => {
  assert.equal(getSolutionScrollTarget("ArrowUp", { ...metrics, scrollTop: 10 }), 0);
  assert.equal(getSolutionScrollTarget("PageDown", { ...metrics, scrollTop: 950 }), 1_000);
  assert.equal(getSolutionScrollTarget("End", { ...metrics, scrollTop: 1_500 }), 1_000);
});

test("unknown keys and non-scrollable pages are left to the browser", () => {
  assert.equal(getSolutionScrollTarget("Enter", metrics), null);
  assert.equal(
    getSolutionScrollTarget("PageDown", { scrollTop: 0, scrollHeight: 900, clientHeight: 900 }),
    null,
  );
});
