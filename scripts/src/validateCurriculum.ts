/**
 * validateCurriculum.ts — curriculum inventory guard for Class 9.
 *
 * Checks the static display-order maps against the expected official counts.
 * Run with: pnpm --filter @workspace/scripts run validate-curriculum
 *
 * Exits 1 with a clear message if any invariant fails.
 */

const SCIENCE_DISPLAY_ORDER_CLASS9: Record<string, number> = {
  "chem-ch01":  1,
  "bio-ch01":   2,
  "bio-ch02":   3,
  "phy-ch1":    4,
  "chem-ch02":  5,
  "phy-ch2":    6,
  "phy-ch4":    7,
  "chem-ch04":  8,
  "chem-ch03":  9,
  "phy-ch5":   10,
  "bio-ch05":  11,
  "bio-ch03":  12,
  "esc-ch01":  13,
};

const MATHS_DISPLAY_ORDER_CLASS9: Record<string, number> = {
  "ch3":  1,
  "ch2":  2,
  "ch1":  3,
  "ch16": 4,
  "ch4":  5,
  "ch18": 6,
  "ch15": 7,
  "ch17": 8,
};

let failed = false;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`OK:   ${message}`);
  }
}

const scienceIds = Object.keys(SCIENCE_DISPLAY_ORDER_CLASS9);
const scienceNums = Object.values(SCIENCE_DISPLAY_ORDER_CLASS9);
const mathIds = Object.keys(MATHS_DISPLAY_ORDER_CLASS9);
const mathNums = Object.values(MATHS_DISPLAY_ORDER_CLASS9);

assert(scienceIds.length === 13, `Science chapter count must be 13 (got ${scienceIds.length})`);
assert(mathIds.length === 8, `Math chapter count must be 8 (got ${mathIds.length})`);

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

const scienceDuplicates = scienceNums.filter((n, i) => scienceNums.indexOf(n) !== i);
assert(scienceDuplicates.length === 0, `No duplicate Science display numbers (found: ${scienceDuplicates})`);

const mathDuplicates = mathNums.filter((n, i) => mathNums.indexOf(n) !== i);
assert(mathDuplicates.length === 0, `No duplicate Math display numbers (found: ${mathDuplicates})`);

assert(SCIENCE_DISPLAY_ORDER_CLASS9["chem-ch01"] === 1, "Science Ch.1 is chem-ch01 (Matter in Our Surroundings)");
assert(SCIENCE_DISPLAY_ORDER_CLASS9["esc-ch01"] === 13, "Science Ch.13 is esc-ch01 (Earth as a System)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch3"] === 1, "Math Ch.1 is ch3 (Orienting Yourself: The Use of Coordinates)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch17"] === 8, "Math Ch.8 is ch17 (Predicting What Comes Next)");

if (failed) {
  process.exit(1);
} else {
  console.log("\nAll curriculum invariants passed.");
}
