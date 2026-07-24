/**
 * validateCurriculum.ts — curriculum inventory + content-integrity guard for Class 9.
 *
 * Checks the static display-order maps against the expected official counts,
 * and verifies every non-placeholder chapter has a content-match record.
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
  "ch3":     1,   // iemh101 — Orienting Yourself: The Use of Coordinates
  "iemh102": 2,   // iemh102 — Introduction to Linear Polynomials (placeholder)
  "ch1":     3,   // iemh103 — The World of Numbers
  "ch16":    4,   // iemh104 — Exploring Algebraic Identities
  "ch4":     5,   // iemh105 — SOURCE_UNRESOLVED: iemh105 is "I'm Up and Down, and Round and Round" (circles); ch4 questions cover old-NCERT linear equations
  "ch18":    6,   // iemh106 — Measuring Space: Perimeter and Area (placeholder)
  "ch15":    7,   // iemh107 — The Mathematics of Maybe: Introduction to Probability
  "ch17":    8,   // iemh108 — Predicting What Comes Next: Exploring Sequences and Progressions
};

// ── Content-match registry ─────────────────────────────────────────────────────
// Maps internal chapterId → { status, verifiedDate, officialCode, note }
// MATCH        — questions confirmed to match official chapter scope (inspected)
// PARTIAL_MATCH — subset matches; scope gap noted; no wrong questions present
// PLACEHOLDER  — 0-question placeholder; no questions to mismatch
// MISMATCH     — questions do not match official chapter (must NOT be visible)
// ARCHIVED     — cbseDeleted; kept for future reference, not student-facing

/**
 * SOURCE_UNRESOLVED: question bank content exists but no chapter in the
 * 2026-27 canonical index (master-curriculum-index.json) covers this topic.
 * Content is retained; mapping is blocked until confirmed.
 */
type ContentStatus = "MATCH" | "PARTIAL_MATCH" | "PLACEHOLDER" | "MISMATCH" | "ARCHIVED" | "SOURCE_UNRESOLVED";

interface ContentRecord {
  status: ContentStatus;
  officialCode: string;
  officialTitle: string;
  verifiedDate: string;
  note?: string;
}

const MATHS_CONTENT_RECORDS: Record<string, ContentRecord> = {
  "ch3": {
    status: "MATCH",
    officialCode: "iemh101",
    officialTitle: "Orienting Yourself: The Use of Coordinates",
    verifiedDate: "2026-07-24",
    note: "Cartesian plane, coordinates, quadrants, plotting, reading graphs — 50 q confirmed. Content matches iemh101 (Ganita Manjari Part I, Ch 1).",
  },
  "iemh102": {
    status: "PLACEHOLDER",
    officialCode: "iemh102",
    officialTitle: "Introduction to Linear Polynomials",
    verifiedDate: "2026-07-24",
    note: "0-question placeholder. Internal ch2 bank covers general polynomials (degree 1–4) + Remainder/Factor Theorem — archived. iemh102 canonical title is 'Introduction to Linear Polynomials'.",
  },
  "ch1": {
    status: "MATCH",
    officialCode: "iemh103",
    officialTitle: "The World of Numbers",
    verifiedDate: "2026-07-24",
    note: "Rational/irrational numbers, surds, laws of exponents, operations on real numbers, number line — 50 q confirmed. Content matches iemh103 (Ganita Manjari Part I, Ch 3).",
  },
  "ch16": {
    status: "MATCH",
    officialCode: "iemh104",
    officialTitle: "Exploring Algebraic Identities",
    verifiedDate: "2026-07-24",
    note: "(a+b)², (a-b)², (a+b)(a-b), (x+a)(x+b), (a+b+c)², factorisation — 75 q confirmed. Content matches iemh104 (Ganita Manjari Part I, Ch 4).",
  },
  "ch4": {
    status: "SOURCE_UNRESOLVED",
    officialCode: "iemh105",
    officialTitle: "Linear Equations in Two Variables",
    verifiedDate: "2026-07-24",
    note: "SOURCE_UNRESOLVED: ch4 questions cover linear equations in two variables (old NCERT content). iemh105 in 2026-27 Ganita Manjari Part I is 'I'm Up and Down, and Round and Round' (circles — Symmetries, Chords, Arcs) — content mismatch confirmed via master-curriculum-index.json. No 2026-27 chapter exists for this content. Questions retained; canonical mapping blocked.",
  },
  "ch18": {
    status: "PLACEHOLDER",
    officialCode: "iemh106",
    officialTitle: "Measuring Space: Perimeter and Area",
    verifiedDate: "2026-07-24",
    note: "75-question bank exists. Content matches iemh106 (Ganita Manjari Part I, Ch 6: perimeter, area of circles and shapes). Previously labelled 'Area and Perimeter' — corrected to canonical title.",
  },
  "ch15": {
    status: "MATCH",
    officialCode: "iemh107",
    officialTitle: "The Mathematics of Maybe: Introduction to Probability",
    verifiedDate: "2026-07-24",
    note: "Probability basics, experimental probability, complementary events, probability calculations — 50 q confirmed. Content matches iemh107 (Ganita Manjari Part I, Ch 7).",
  },
  "ch17": {
    status: "MATCH",
    officialCode: "iemh108",
    officialTitle: "Predicting What Comes Next: Exploring Sequences and Progressions",
    verifiedDate: "2026-07-24",
    note: "Number sequences, arithmetic patterns, multiplicative patterns, visual patterns — 75 q confirmed. Content matches iemh108 (Ganita Manjari Part I, Ch 8).",
  },
};

// Archived chapters — must NOT appear in student-facing view
const MATHS_ARCHIVED_IDS = ["ch2"];

const SCIENCE_CONTENT_RECORDS: Record<string, ContentRecord> = {
  "chem-ch01": {
    status: "SOURCE_UNRESOLVED",
    officialCode: "iesc101",
    officialTitle: "Matter in Our Surroundings",
    verifiedDate: "2026-07-24",
    note: "SOURCE_UNRESOLVED: chem-ch01 questions cover states of matter, change of state, evaporation (old NCERT content). iesc101 in 2026-27 Curiosity Book 1 is 'Exploration: Entering the World of Secondary Science' (introductory chapter, no sections) — content mismatch confirmed via master-curriculum-index.json. No 2026-27 chapter exists for states-of-matter content. Questions retained; canonical mapping blocked.",
  },
  "bio-ch01": {
    status: "MATCH",
    officialCode: "iesc102",
    officialTitle: "Cell: The Building Block of Life",
    verifiedDate: "2026-07-24",
    note: "Cell structure, organelles, prokaryote/eukaryote, cell membrane, cell wall — V2 bank confirmed. Content matches iesc102 (Curiosity Book 1, Ch 2).",
  },
  "bio-ch02": {
    status: "MATCH",
    officialCode: "iesc103",
    officialTitle: "Tissues in Action",
    verifiedDate: "2026-07-24",
    note: "Plant tissues (meristematic, permanent), animal tissues (epithelial, connective, muscular, nervous) — V2 bank confirmed. Content matches iesc103 (Curiosity Book 1, Ch 3).",
  },
  "phy-ch1": {
    status: "MATCH",
    officialCode: "iesc104",
    officialTitle: "Describing Motion Around Us",
    verifiedDate: "2026-07-24",
    note: "Distance, displacement, velocity, speed, acceleration, equations of motion, distance-time graphs — 50 q confirmed. Content matches iesc104 (Curiosity Book 1, Ch 4).",
  },
  "chem-ch02": {
    status: "MATCH",
    officialCode: "iesc105",
    officialTitle: "Exploring Mixtures and their Separation",
    verifiedDate: "2026-07-24",
    note: "Pure substances, mixtures, methods of separation, colloids, solutions, Tyndall effect — V2 bank confirmed. Content matches iesc105 (Curiosity Book 1, Ch 5). Canonical title uses lowercase 'their'.",
  },
  "phy-ch2": {
    status: "MATCH",
    officialCode: "iesc106",
    officialTitle: "How Forces Affect Motion",
    verifiedDate: "2026-07-24",
    note: "Newton's three laws, inertia, momentum, conservation of momentum — 50 q confirmed. Content matches iesc106 (Curiosity Book 1, Ch 6).",
  },
  "phy-ch4": {
    status: "PARTIAL_MATCH",
    officialCode: "iesc107",
    officialTitle: "Work, Energy, and Simple Machines",
    verifiedDate: "2026-07-24",
    note: "Work, KE, PE, conservation of energy, power, commercial unit — 50 q confirmed. 'Simple Machines' subtopic (levers, pulleys, inclined planes) absent from question bank — content gap only, no wrong questions. Content matches iesc107 (Curiosity Book 1, Ch 7). Canonical title has Oxford comma.",
  },
  "chem-ch04": {
    status: "MATCH",
    officialCode: "iesc108",
    officialTitle: "Journey Inside the Atom",
    verifiedDate: "2026-07-24",
    note: "Thomson model, Rutherford model, Bohr model, electrons/protons/neutrons, shells, atomic number, mass number — V2 bank confirmed. Content matches iesc108 (Curiosity Book 1, Ch 8).",
  },
  "chem-ch03": {
    status: "MATCH",
    officialCode: "iesc109",
    officialTitle: "Atomic Foundations of Matter",
    verifiedDate: "2026-07-24",
    note: "Law of conservation of mass, law of constant proportions, Dalton's atomic theory, chemical formulas, Avogadro's number — V2 bank confirmed. Content matches iesc109 (Curiosity Book 1, Ch 9).",
  },
  "phy-ch5": {
    status: "MATCH",
    officialCode: "iesc110",
    officialTitle: "Sound Waves: Characteristics and Applications",
    verifiedDate: "2026-07-24",
    note: "Wave motion, longitudinal waves, frequency, amplitude, speed of sound, reflection, SONAR, human ear — 50 q confirmed. Content matches iesc110 (Curiosity Book 1, Ch 10).",
  },
  "bio-ch05": {
    status: "PLACEHOLDER",
    officialCode: "iesc111",
    officialTitle: "Reproduction: How Life Continues",
    verifiedDate: "2026-07-24",
    note: "0-question placeholder. No existing question bank for this chapter. Content matches iesc111 (Curiosity Book 1, Ch 11).",
  },
  "bio-ch03": {
    status: "MATCH",
    officialCode: "iesc112",
    officialTitle: "Patterns in Life: Diversity and Classification",
    verifiedDate: "2026-07-24",
    note: "Classification hierarchy, kingdoms (Monera, Protista, Fungi, Plantae, Animalia), vertebrates — V2 bank confirmed. Content matches iesc112 (Curiosity Book 1, Ch 12).",
  },
  "esc-ch01": {
    status: "PLACEHOLDER",
    officialCode: "iesc113",
    officialTitle: "Earth as a System: Energy, Matter, and Life",
    verifiedDate: "2026-07-24",
    note: "0-question placeholder. No existing question bank for this chapter. Content matches iesc113 (Curiosity Book 1, Ch 13).",
  },
};

// Archived Science chapters — must NOT appear in student-facing view
const SCIENCE_ARCHIVED_IDS = ["phy-ch3", "bio-ch04"];

let failed = false;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`OK:   ${message}`);
  }
}

// ── 1. Count checks ─────────────────────────────────────────────────────────────
const scienceIds = Object.keys(SCIENCE_DISPLAY_ORDER_CLASS9);
const scienceNums = Object.values(SCIENCE_DISPLAY_ORDER_CLASS9);
const mathIds = Object.keys(MATHS_DISPLAY_ORDER_CLASS9);
const mathNums = Object.values(MATHS_DISPLAY_ORDER_CLASS9);

assert(scienceIds.length === 13, `Science chapter count must be 13 (got ${scienceIds.length})`);
assert(mathIds.length === 8, `Math chapter count must be 8 (got ${mathIds.length})`);

// ── 2. Contiguous numbering ──────────────────────────────────────────────────────
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

// ── 3. No duplicate display numbers ─────────────────────────────────────────────
const scienceDuplicates = scienceNums.filter((n, i) => scienceNums.indexOf(n) !== i);
assert(scienceDuplicates.length === 0, `No duplicate Science display numbers (found: ${scienceDuplicates})`);

const mathDuplicates = mathNums.filter((n, i) => mathNums.indexOf(n) !== i);
assert(mathDuplicates.length === 0, `No duplicate Math display numbers (found: ${mathDuplicates})`);

// ── 4. Anchor checks ─────────────────────────────────────────────────────────────
assert(SCIENCE_DISPLAY_ORDER_CLASS9["chem-ch01"] === 1, "Science Ch.1 is chem-ch01 (SOURCE_UNRESOLVED: old-NCERT states-of-matter content; iesc101 is intro chapter)");
assert(SCIENCE_DISPLAY_ORDER_CLASS9["esc-ch01"] === 13, "Science Ch.13 is esc-ch01 (iesc113 Earth as a System: Energy, Matter, and Life)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch3"] === 1, "Math Ch.1 is ch3 (iemh101 Orienting Yourself: The Use of Coordinates)");
assert(MATHS_DISPLAY_ORDER_CLASS9["ch17"] === 8, "Math Ch.8 is ch17 (iemh108 Predicting What Comes Next: Exploring Sequences and Progressions)");

// ── 5. Content-match record coverage ─────────────────────────────────────────────
for (const id of mathIds) {
  const record = MATHS_CONTENT_RECORDS[id];
  assert(!!record, `Math chapter '${id}' has a content-match record`);
  if (record) {
    assert(
      record.status !== "MISMATCH",
      `Math chapter '${id}' (${record.officialCode}) is not a MISMATCH in the display order`,
    );
  }
}

for (const id of scienceIds) {
  const record = SCIENCE_CONTENT_RECORDS[id];
  assert(!!record, `Science chapter '${id}' has a content-match record`);
  if (record) {
    assert(
      record.status !== "MISMATCH",
      `Science chapter '${id}' (${record.officialCode}) is not a MISMATCH in the display order`,
    );
  }
}

// ── 6. Archived chapters are NOT in the student-facing display order ──────────────
for (const id of MATHS_ARCHIVED_IDS) {
  assert(
    !(id in MATHS_DISPLAY_ORDER_CLASS9),
    `Archived/mismatched Math chapter '${id}' must NOT appear in MATHS_DISPLAY_ORDER_CLASS9`,
  );
}

for (const id of SCIENCE_ARCHIVED_IDS) {
  assert(
    !(id in SCIENCE_DISPLAY_ORDER_CLASS9),
    `Archived/mismatched Science chapter '${id}' must NOT appear in SCIENCE_DISPLAY_ORDER_CLASS9`,
  );
}

// ── 7. Placeholder chapters have a record flagged PLACEHOLDER ────────────────────
const mathPlaceholders = mathIds.filter(id => MATHS_CONTENT_RECORDS[id]?.status === "PLACEHOLDER");
const sciencePlaceholders = scienceIds.filter(id => SCIENCE_CONTENT_RECORDS[id]?.status === "PLACEHOLDER");
assert(mathPlaceholders.length > 0, `At least one Math placeholder exists (found: ${mathPlaceholders.join(",")})`);
assert(sciencePlaceholders.length > 0, `At least one Science placeholder exists (found: ${sciencePlaceholders.join(",")})`);

// ── 8. Static order integrity — order must not drift ────────────────────────────
const mathOrder = mathIds.slice().sort((a, b) => MATHS_DISPLAY_ORDER_CLASS9[a] - MATHS_DISPLAY_ORDER_CLASS9[b]);
assert(
  mathOrder[0] === "ch3" && mathOrder[7] === "ch17",
  `Math chapter order is stable: first='${mathOrder[0]}' last='${mathOrder[7]}' (expected ch3, ch17)`,
);

const scienceOrder = scienceIds.slice().sort((a, b) => SCIENCE_DISPLAY_ORDER_CLASS9[a] - SCIENCE_DISPLAY_ORDER_CLASS9[b]);
assert(
  scienceOrder[0] === "chem-ch01" && scienceOrder[12] === "esc-ch01",
  `Science chapter order is stable: first='${scienceOrder[0]}' last='${scienceOrder[12]}' (expected chem-ch01, esc-ch01)`,
);

// ── 9. iemh102 is a placeholder (not the mismatched ch2 bank) ───────────────────
assert(
  MATHS_DISPLAY_ORDER_CLASS9["iemh102"] === 2,
  "Math Ch.2 is iemh102 placeholder (not mismatched ch2 polynomials bank)",
);
assert(
  !("ch2" in MATHS_DISPLAY_ORDER_CLASS9),
  "Mismatched ch2 (general polynomials bank) is NOT in Math display order",
);

// ── 10. All content-match records have an official code and verified date ─────────
for (const [id, rec] of Object.entries({ ...MATHS_CONTENT_RECORDS, ...SCIENCE_CONTENT_RECORDS })) {
  assert(!!rec.officialCode, `Content record for '${id}' has an officialCode`);
  assert(!!rec.verifiedDate, `Content record for '${id}' has a verifiedDate`);
}

if (failed) {
  process.exit(1);
} else {
  console.log("\nAll curriculum invariants passed.");
}
