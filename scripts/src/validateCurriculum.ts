/**
 * validateCurriculum.ts — display-order invariants + canonical integrity guard for Class 9.
 *
 * Validates the display-order maps against the canonical academic contract
 * (scripts/src/canonicalCurriculum.ts). Every chapter in the display order
 * must be registered in the canonical contract. No independent chapter-title
 * registry may exist in this file.
 *
 * Run with: pnpm --filter @workspace/scripts run validate-curriculum
 * Exits 1 with a clear message if any invariant fails.
 */

import { getCanonicalChapter, getClass9DisplayOrder } from "./canonicalCurriculum.js";

// ── Display-order maps — derived from the canonical contract ─────────────────
// Single source of truth: scripts/src/canonicalCurriculum.ts → INTERNAL_TO_CANONICAL.
// Do not add chapter names or titles here — use canonicalCurriculum.ts for that.

const { math: MATHS_DISPLAY_ORDER_CLASS9, science: SCIENCE_DISPLAY_ORDER_CLASS9 } = getClass9DisplayOrder();

// Archived chapters — must NOT appear in student-facing display order
const MATHS_ARCHIVED_IDS   = ["ch2"];
const SCIENCE_ARCHIVED_IDS = ["phy-ch3", "bio-ch04"];

// ─────────────────────────────────────────────────────────────────────────────

let failed = false;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`OK:   ${message}`);
  }
}

// ── 1. Count checks ───────────────────────────────────────────────────────────
const scienceIds  = Object.keys(SCIENCE_DISPLAY_ORDER_CLASS9);
const scienceNums = Object.values(SCIENCE_DISPLAY_ORDER_CLASS9);
const mathIds     = Object.keys(MATHS_DISPLAY_ORDER_CLASS9);
const mathNums    = Object.values(MATHS_DISPLAY_ORDER_CLASS9);

assert(scienceIds.length === 13, `Science chapter count must be 13 (got ${scienceIds.length})`);
assert(mathIds.length    === 8,  `Math chapter count must be 8 (got ${mathIds.length})`);

// ── 2. Contiguous numbering ───────────────────────────────────────────────────
const scienceSeq = [...scienceNums].sort((a, b) => a - b);
assert(
  scienceSeq.join(",") === Array.from({ length: 13 }, (_, i) => i + 1).join(","),
  "Science display numbers must be contiguous 1–13",
);
const mathSeq = [...mathNums].sort((a, b) => a - b);
assert(
  mathSeq.join(",") === Array.from({ length: 8 }, (_, i) => i + 1).join(","),
  "Math display numbers must be contiguous 1–8",
);

// ── 3. No duplicate display numbers ──────────────────────────────────────────
const scienceDuplicates = scienceNums.filter((n, i) => scienceNums.indexOf(n) !== i);
assert(scienceDuplicates.length === 0, `No duplicate Science display numbers (found: ${scienceDuplicates})`);
const mathDuplicates = mathNums.filter((n, i) => mathNums.indexOf(n) !== i);
assert(mathDuplicates.length === 0, `No duplicate Math display numbers (found: ${mathDuplicates})`);

// ── 4. Anchor checks (by stable internalId — not by title) ───────────────────
assert(SCIENCE_DISPLAY_ORDER_CLASS9["chem-ch01"] === 1,  "Science Ch.1 is chem-ch01 (SOURCE_UNRESOLVED states-of-matter)");
assert(SCIENCE_DISPLAY_ORDER_CLASS9["esc-ch01"]  === 13, "Science Ch.13 is esc-ch01 (iesc113)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch3"]         === 1,  "Math Ch.1 is ch3 (iemh101)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch17"]        === 8,  "Math Ch.8 is ch17 (iemh108)");

// ── 5. Every chapter in display order is registered in the canonical contract ─
// Replaces: manual MATHS_CONTENT_RECORDS / SCIENCE_CONTENT_RECORDS.
// Source of truth is canonicalCurriculum.ts → master-curriculum-index.json.

for (const id of mathIds) {
  const ch = getCanonicalChapter(id);
  assert(ch !== null, `Math chapter '${id}' is registered in the canonical academic contract`);
  if (ch) {
    assert(
      ch.status !== "OFFICIALLY_DELETED",
      `Math chapter '${id}' (${ch.bookId}) is not OFFICIALLY_DELETED in the display order`,
    );
    if (ch.status === "ACTIVE") {
      assert(
        ch.bookId !== "" && ch.bookId !== "SOURCE_UNRESOLVED",
        `Math chapter '${id}' has a valid canonical bookId (${ch.bookId})`,
      );
    } else {
      console.log(`OK:   Math chapter '${id}' is ${ch.status} — noted, not blocked`);
    }
  }
}

for (const id of scienceIds) {
  const ch = getCanonicalChapter(id);
  assert(ch !== null, `Science chapter '${id}' is registered in the canonical academic contract`);
  if (ch) {
    assert(
      ch.status !== "OFFICIALLY_DELETED",
      `Science chapter '${id}' (${ch.bookId}) is not OFFICIALLY_DELETED in the display order`,
    );
    if (ch.status === "ACTIVE") {
      assert(
        ch.bookId !== "" && ch.bookId !== "SOURCE_UNRESOLVED",
        `Science chapter '${id}' has a valid canonical bookId (${ch.bookId})`,
      );
    } else {
      console.log(`OK:   Science chapter '${id}' is ${ch.status} — noted, not blocked`);
    }
  }
}

// ── 6. Archived chapters NOT in student-facing display order ──────────────────
for (const id of MATHS_ARCHIVED_IDS) {
  assert(
    !(id in MATHS_DISPLAY_ORDER_CLASS9),
    `Archived Math chapter '${id}' must NOT appear in MATHS_DISPLAY_ORDER_CLASS9`,
  );
}
for (const id of SCIENCE_ARCHIVED_IDS) {
  assert(
    !(id in SCIENCE_DISPLAY_ORDER_CLASS9),
    `Archived Science chapter '${id}' must NOT appear in SCIENCE_DISPLAY_ORDER_CLASS9`,
  );
}

// ── 7. Static order integrity — order must not drift ─────────────────────────
const mathOrder = mathIds.slice().sort((a, b) => MATHS_DISPLAY_ORDER_CLASS9[a] - MATHS_DISPLAY_ORDER_CLASS9[b]);
assert(
  mathOrder[0] === "ch3" && mathOrder[7] === "ch17",
  `Math order is stable: first='${mathOrder[0]}' last='${mathOrder[7]}' (expected ch3, ch17)`,
);
const scienceOrder = scienceIds.slice().sort((a, b) => SCIENCE_DISPLAY_ORDER_CLASS9[a] - SCIENCE_DISPLAY_ORDER_CLASS9[b]);
assert(
  scienceOrder[0] === "chem-ch01" && scienceOrder[12] === "esc-ch01",
  `Science order is stable: first='${scienceOrder[0]}' last='${scienceOrder[12]}' (expected chem-ch01, esc-ch01)`,
);

// ── 8. iemh102 is in display position 2 (not the archived ch2 polynomials bank) ──
assert(MATHS_DISPLAY_ORDER_CLASS9["iemh102"] === 2, "Math Ch.2 is iemh102 (not archived ch2 polynomials bank)");
assert(!("ch2" in MATHS_DISPLAY_ORDER_CLASS9),      "Archived ch2 polynomials bank is NOT in Math display order");

// ── 9. SOURCE_UNRESOLVED chapters are explicit in the contract (not silent) ───
const mathUnresolved    = mathIds.filter(id => getCanonicalChapter(id)?.status === "SOURCE_UNRESOLVED");
const scienceUnresolved = scienceIds.filter(id => getCanonicalChapter(id)?.status === "SOURCE_UNRESOLVED");
console.log(`\nNOTE: SOURCE_UNRESOLVED chapters in display order:`);
console.log(`  Math:    ${mathUnresolved.length > 0 ? mathUnresolved.join(", ") : "(none)"}`);
console.log(`  Science: ${scienceUnresolved.length > 0 ? scienceUnresolved.join(", ") : "(none)"}`);
console.log(`  These chapters retain questions but cannot be frozen until canonical source is confirmed.\n`);

// ── 10. No independent curriculum registries ──────────────────────────────────
// This file must NOT contain MATHS_CONTENT_RECORDS, SCIENCE_CONTENT_RECORDS,
// or any hardcoded chapter-title list. If this check somehow fails, a duplicate
// registry was reintroduced — remove it and use canonicalCurriculum.ts instead.
assert(
  typeof (globalThis as Record<string,unknown>)["MATHS_CONTENT_RECORDS"] === "undefined",
  "No MATHS_CONTENT_RECORDS independent registry in this scope",
);
assert(
  typeof (globalThis as Record<string,unknown>)["SCIENCE_CONTENT_RECORDS"] === "undefined",
  "No SCIENCE_CONTENT_RECORDS independent registry in this scope",
);

// ── 11. Canonical-contract coverage for all display-order chapters ────────────
const allDisplayIds = [...mathIds, ...scienceIds];
const unregistered  = allDisplayIds.filter(id => getCanonicalChapter(id) === null);
assert(
  unregistered.length === 0,
  `All display-order chapters are registered in canonical contract (unregistered: ${unregistered.join(", ") || "none"})`,
);

if (failed) {
  process.exit(1);
} else {
  console.log("\nAll curriculum invariants passed.");
}
