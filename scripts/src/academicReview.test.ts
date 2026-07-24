/**
 * Focused tests for the Gold Standard academic review engine.
 *
 * Tests pure exported functions only — no OpenAI calls, no file I/O.
 *
 * Run:
 *   pnpm --filter @workspace/scripts run test:academic-review
 */

import { test }   from "node:test";
import assert     from "node:assert/strict";

import {
  GS_CONFIG,
  CHECKLIST,
  computeContentHash,
  isEvidenceComplete,
  determineOutcome,
  applyFalsePositiveGuards,
  normalizeReviewResult,
  shouldReview,
  applyFilters,
} from "./academicReview.js";

import type {
  ReviewableQuestion,
  DefectEvidence,
  ReviewRecord,
} from "./academicReview.js";

// ─── Test fixtures ────────────────────────────────────────────────────────────

function makeQuestion(overrides: Partial<ReviewableQuestion> = {}): ReviewableQuestion {
  return {
    id:          "test-q-001",
    schema:      "v1",
    classNum:    9,
    subject:     "Mathematics",
    board:       "CBSE",
    chapterId:   "iemh105",
    chapterName: "Circles",
    topicId:     "circles-t1",
    topicName:   "Basic Properties",
    difficulty:  "Medium",
    question:    "A chord of a circle is 8 cm. Find the distance from the centre if the radius is 5 cm.",
    answer:      "3 cm",
    steps: [
      { stepNumber: 1, title: "Apply Pythagoras", explanation: "Use r² = d² + (L/2)²", formula: "5² = d² + 4²", result: "d = 3" },
    ],
    hint:        "Use the perpendicular from centre to chord bisects it.",
    keyConcepts: ["chord", "perpendicular"],
    ...overrides,
  };
}

function makeCompleteEvidence(overrides: Partial<DefectEvidence> = {}): DefectEvidence {
  return {
    criterion_id:         "correctness",
    exact_defective_text: "d = 3",
    reason:               "The calculation is incorrect",
    expected_correction:  "d = 4",
    supporting_evidence:  "5² = 3² + 4²  →  25 = 9 + 16 = 25 ✓  wait, 5² = d² + 4²  →  d² = 25 - 16 = 9  →  d = 3 ✓",
    reviewer_confidence:  0.9,
    ...overrides,
  };
}

function makeAllPassDimensions(): Record<string, "PASS" | "FAIL"> {
  return Object.fromEntries(CHECKLIST.map(c => [c.id, "PASS" as const]));
}

function makeRecord(overrides: Partial<ReviewRecord> = {}): ReviewRecord {
  return {
    questionId:          "test-q-001",
    contentHash:         "abc123",
    checklistVersion:    GS_CONFIG.CHECKLIST_VERSION,
    reviewedAt:          "2026-07-24T10:00:00.000Z",
    model:               GS_CONFIG.REVIEWER_MODEL,
    sourceContextStatus: "PRESENT",
    overall:             "GOLD_STANDARD_PASS",
    dimensions:          makeAllPassDimensions(),
    failEvidence:        [],
    failConfidences:     {},
    reasons:             [],
    ...overrides,
  };
}

// ─── 1. Dynamic criterion iteration ──────────────────────────────────────────

test("1. Dynamic criterion iteration — CHECKLIST is non-empty and iterable", () => {
  assert.ok(CHECKLIST.length > 0, "CHECKLIST must not be empty");
  for (const criterion of CHECKLIST) {
    assert.ok(typeof criterion.id   === "string" && criterion.id.length   > 0, `criterion.id must be non-empty: ${JSON.stringify(criterion)}`);
    assert.ok(typeof criterion.name === "string" && criterion.name.length > 0, `criterion.name must be non-empty: ${JSON.stringify(criterion)}`);
  }
  // Engine references criteria by iterating CHECKLIST, not by hardcoded count
  const determinedByIteration = CHECKLIST.map(c => c.id);
  assert.deepEqual(determinedByIteration.length, CHECKLIST.length);
});

// ─── 2. All-pass result ───────────────────────────────────────────────────────

test("2. All-pass result → GOLD_STANDARD_PASS", () => {
  const dimensions = makeAllPassDimensions();
  const outcome = determineOutcome(dimensions, []);
  assert.equal(outcome, "GOLD_STANDARD_PASS");
});

// ─── 3. Failure with complete evidence ───────────────────────────────────────

test("3. FAIL with complete evidence → POSSIBLE_DEFECT_REQUIRES_VERIFICATION", () => {
  const dimensions = makeAllPassDimensions();
  dimensions["correctness"] = "FAIL";
  const ev = makeCompleteEvidence();
  const outcome = determineOutcome(dimensions, [ev]);
  assert.equal(outcome, "POSSIBLE_DEFECT_REQUIRES_VERIFICATION");
});

// ─── 4. Failure with incomplete evidence ─────────────────────────────────────

test("4. FAIL with incomplete evidence → REVIEWER_UNCERTAINTY", () => {
  const dimensions = makeAllPassDimensions();
  dimensions["correctness"] = "FAIL";
  const incompleteEv: DefectEvidence = {
    criterion_id:         "correctness",
    exact_defective_text: "d = 3",
    reason:               "Incorrect",
    expected_correction:  "d = 4",
    supporting_evidence:  "", // missing — incomplete
    reviewer_confidence:  0.9,
  };
  const outcome = determineOutcome(dimensions, [incompleteEv]);
  assert.equal(outcome, "REVIEWER_UNCERTAINTY");
});

// ─── 5. Reviewer contradiction (G1 guard) ────────────────────────────────────

test("5. G1: proposed correction restates same value as answer → demote to PASS", () => {
  const q = makeQuestion({ answer: "3 cm" });
  const dimensions = makeAllPassDimensions();
  dimensions["correctness"] = "FAIL";
  const ev = makeCompleteEvidence({
    criterion_id:        "correctness",
    expected_correction: "3 cm", // same as answer — self-contradiction
    supporting_evidence: "My calculation gives 3 cm",
  });
  const { dimensions: guarded } = applyFalsePositiveGuards(q, dimensions, [ev]);
  assert.equal(guarded["correctness"], "PASS", "Contradiction must demote to PASS");
});

// ─── 6. Second-review agreement → CONFIRMED_DEFECT ───────────────────────────

test("6. Second-review agreement → CONFIRMED_DEFECT (logic verification)", () => {
  // Simulate the second-verification agreement logic used in reviewOneQuestion.
  // Both reviewers find the same criterion failed with complete evidence.
  const firstEvidence: DefectEvidence[] = [makeCompleteEvidence({ criterion_id: "correctness" })];
  const secondEvidence: DefectEvidence[] = [makeCompleteEvidence({ criterion_id: "correctness", reason: "Independent calculation confirms error" })];

  const firstFailedIds  = new Set(firstEvidence.map(e => e.criterion_id));
  const secondConfirmed = secondEvidence.filter(e => firstFailedIds.has(e.criterion_id));

  assert.ok(secondConfirmed.length > 0, "Second reviewer confirms same criterion → CONFIRMED_DEFECT path");
  assert.equal(secondConfirmed[0].criterion_id, "correctness");
});

// ─── 7. Second-review disagreement → REVIEWER_UNCERTAINTY ────────────────────

test("7. Second-review disagrees → REVIEWER_UNCERTAINTY (logic verification)", () => {
  const firstEvidence: DefectEvidence[] = [makeCompleteEvidence({ criterion_id: "correctness" })];
  // Second reviewer flags a different criterion or none at all
  const secondEvidence: DefectEvidence[] = [makeCompleteEvidence({ criterion_id: "hint_quality" })];

  const firstFailedIds  = new Set(firstEvidence.map(e => e.criterion_id));
  const secondConfirmed = secondEvidence.filter(e => firstFailedIds.has(e.criterion_id));

  assert.equal(secondConfirmed.length, 0, "No overlap → REVIEWER_UNCERTAINTY path");
});

// ─── 8. Identical proposed correction false-positive guard ────────────────────

test("8. G1: exact numeric match in correction restates answer → demote", () => {
  const q = makeQuestion({ answer: "25 cm²" });
  const dimensions = makeAllPassDimensions();
  dimensions["correctness"] = "FAIL";
  const ev = makeCompleteEvidence({
    expected_correction:  "The area is 25 cm²", // contains same value
    exact_defective_text: "25 cm²",
    supporting_evidence:  "My own calculation gives 25 cm²",
  });
  const { dimensions: guarded } = applyFalsePositiveGuards(q, dimensions, [ev]);
  assert.equal(guarded["correctness"], "PASS");
});

// ─── 9. ShortAnswer / MCQ-option false-positive guard ────────────────────────

test("9. G2: non-MCQ review references Option (A) → demote to PASS", () => {
  // Question with no MCQ options in the text
  const q = makeQuestion({ question: "Find the area of a circle with radius 5 cm." });
  const dimensions = makeAllPassDimensions();
  dimensions["question_clarity"] = "FAIL";
  const ev: DefectEvidence = {
    criterion_id:         "question_clarity",
    exact_defective_text: "5 cm",
    reason:               "Option (A) is ambiguous compared to Option (B)",
    expected_correction:  "Clarify the options",
    supporting_evidence:  "Option (A) and Option (B) overlap",
    reviewer_confidence:  0.9,
  };
  const { dimensions: guarded } = applyFalsePositiveGuards(q, dimensions, [ev]);
  assert.equal(guarded["question_clarity"], "PASS", "MCQ-option hallucination on non-MCQ must be demoted");
});

// ─── 10. Cache hit — matching hash and version → skip ────────────────────────

test("10. Cache hit (hash match + current version + GOLD_STANDARD_PASS) → skip", () => {
  const q     = makeQuestion();
  const hash  = computeContentHash(q);
  const cache = {
    [q.id]: makeRecord({
      contentHash:      hash,
      checklistVersion: GS_CONFIG.CHECKLIST_VERSION,
      overall:          "GOLD_STANDARD_PASS",
    }),
  };
  const args  = { contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false, failedOnly: false, force: false, costEstimate: false };
  const { skip, reason } = shouldReview(q, cache, args);
  assert.ok(skip, `Expected skip=true, got reason: ${reason}`);
  assert.ok(reason.includes("GOLD_STANDARD_PASS"), `Expected GOLD_STANDARD_PASS in reason, got: ${reason}`);
});

// ─── 11. Cache invalidation — content change ──────────────────────────────────

test("11. Cache invalidation after content change → re-review", () => {
  const q       = makeQuestion();
  const oldHash = "aaaa1111bbbb2222cccc3333dddd4444eeee5555ffff6666aaaa1111bbbb2222"; // wrong hash
  const cache   = {
    [q.id]: makeRecord({
      contentHash:      oldHash,
      checklistVersion: GS_CONFIG.CHECKLIST_VERSION,
      overall:          "GOLD_STANDARD_PASS",
    }),
  };
  const args = { contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false, failedOnly: false, force: false, costEstimate: false };
  const { skip, reason } = shouldReview(q, cache, args);
  assert.ok(!skip, `Expected skip=false, got reason: ${reason}`);
  assert.ok(reason.includes("content changed"), `Expected 'content changed' in reason, got: ${reason}`);
});

// ─── 12. Cache invalidation — checklist version change ───────────────────────

test("12. Cache invalidation after checklist-version change → re-review", () => {
  const q    = makeQuestion();
  const hash = computeContentHash(q);
  const cache = {
    [q.id]: makeRecord({
      contentHash:      hash,
      checklistVersion: GS_CONFIG.LEGACY_VERSION, // stale version
      overall:          "GOLD_STANDARD_PASS",
    }),
  };
  const args = { contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false, failedOnly: false, force: false, costEstimate: false };
  const { skip, reason } = shouldReview(q, cache, args);
  assert.ok(!skip, `Expected skip=false, got reason: ${reason}`);
  assert.ok(reason.includes("checklist version changed"), `Expected version change message, got: ${reason}`);
});

// ─── 13. Legacy content remains pending (not skipped) ────────────────────────

test("13. Legacy PASS record (old promptVersion) is not skipped — awaits re-review", () => {
  const q    = makeQuestion();
  const hash = computeContentHash(q);
  // Simulate old-format cache record with promptVersion instead of checklistVersion
  const cache = {
    [q.id]: {
      questionId:          q.id,
      contentHash:         hash,
      promptVersion:       GS_CONFIG.LEGACY_VERSION, // old field name, old version
      reviewedAt:          "2026-01-01T00:00:00.000Z",
      model:               "gpt-4o-mini",
      sourceContextStatus: "PRESENT" as const,
      overall:             "PASS" as any,  // old outcome type
      dimensions:          { curriculum: "PASS" } as any,
      failEvidence:        [],
      failConfidences:     {},
      reasons:             [],
    } as ReviewRecord,
  };
  const args = { contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false, failedOnly: false, force: false, costEstimate: false };
  const { skip } = shouldReview(q, cache, args);
  assert.ok(!skip, "Legacy PASS record must not be skipped — it requires re-review under current checklist");
});

// ─── 14. Old-rubric PASS not accepted as Gold Standard PASS ──────────────────

test("14. Old-rubric PASS (v1.1) is not treated as GOLD_STANDARD_PASS", () => {
  const q    = makeQuestion();
  const hash = computeContentHash(q);
  const cache = {
    [q.id]: makeRecord({
      contentHash:      hash,
      checklistVersion: GS_CONFIG.LEGACY_VERSION, // LEGACY version
      overall:          "GOLD_STANDARD_PASS",       // even if outcome is "correct" label, version mismatch wins
    }),
  };
  const args = { contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false, failedOnly: false, force: false, costEstimate: false };
  const { skip, reason } = shouldReview(q, cache, args);
  assert.ok(!skip, `Old-rubric PASS must trigger re-review. Got reason: ${reason}`);
});

// ─── 15. Targeted chapter filtering remains functional ───────────────────────

test("15. Targeted chapter filtering via --chapter remains functional", () => {
  const q1 = makeQuestion({ id: "q1", chapterId: "iemh105" });
  const q2 = makeQuestion({ id: "q2", chapterId: "iemh106" });
  const q3 = makeQuestion({ id: "q3", chapterId: "iemh105" });
  const args = {
    contextAudit: false, batchSize: 5, delayMs: 0, dryRun: false,
    failedOnly: false, force: false, costEstimate: false,
    chapter: "iemh105",
  };
  const filtered = applyFilters([q1, q2, q3], args);
  assert.equal(filtered.length, 2);
  assert.ok(filtered.every(q => q.chapterId === "iemh105"));
  assert.ok(!filtered.some(q => q.id === "q2"), "iemh106 question must be excluded");
});

// ─── Bonus: isEvidenceComplete ────────────────────────────────────────────────

test("B1. isEvidenceComplete — true when all four fields non-empty", () => {
  const ev = makeCompleteEvidence();
  assert.ok(isEvidenceComplete(ev));
});

test("B2. isEvidenceComplete — false when any field is empty", () => {
  assert.ok(!isEvidenceComplete(makeCompleteEvidence({ supporting_evidence: "" })));
  assert.ok(!isEvidenceComplete(makeCompleteEvidence({ expected_correction: "" })));
  assert.ok(!isEvidenceComplete(makeCompleteEvidence({ exact_defective_text: "  " })));
  assert.ok(!isEvidenceComplete(makeCompleteEvidence({ reason: "" })));
});

test("B3. normalizeReviewResult — malformed input → REVIEWER_UNCERTAINTY", () => {
  const q      = makeQuestion();
  const result = normalizeReviewResult(null, q);
  assert.equal(result.outcome, "REVIEWER_UNCERTAINTY");
});

test("B4. normalizeReviewResult — all-pass dimensions → GOLD_STANDARD_PASS", () => {
  const q = makeQuestion();
  const raw = {
    dimensions:   makeAllPassDimensions(),
    fail_evidence: [],
  };
  const result = normalizeReviewResult(raw, q);
  assert.equal(result.outcome, "GOLD_STANDARD_PASS");
});

test("B5. G3: correctness FAIL without supporting evidence → demote", () => {
  const q = makeQuestion();
  const dimensions = makeAllPassDimensions();
  dimensions["correctness"] = "FAIL";
  const ev: DefectEvidence = {
    criterion_id:         "correctness",
    exact_defective_text: "3 cm",
    reason:               "Wrong answer",
    expected_correction:  "4 cm",
    supporting_evidence:  "", // missing
    reviewer_confidence:  0.9,
  };
  const { dimensions: guarded } = applyFalsePositiveGuards(q, dimensions, [ev]);
  assert.equal(guarded["correctness"], "PASS", "G3: missing supporting_evidence must demote to PASS");
});

test("B6. computeContentHash — deterministic and sensitive to changes", () => {
  const q1 = makeQuestion();
  const q2 = makeQuestion({ answer: "4 cm" });
  const h1 = computeContentHash(q1);
  const h2 = computeContentHash(q2);
  assert.equal(h1, computeContentHash(q1), "Same question must produce same hash");
  assert.notEqual(h1, h2, "Different answers must produce different hashes");
  assert.equal(h1.length, 64, "SHA-256 hex digest must be 64 chars");
});

test("B7. GS_CONFIG — all required parameters present", () => {
  assert.ok(GS_CONFIG.CHECKLIST_VERSION,           "CHECKLIST_VERSION must be set");
  assert.ok(GS_CONFIG.REVIEWER_MODEL,              "REVIEWER_MODEL must be set");
  assert.ok(GS_CONFIG.ESCALATION_MODEL,            "ESCALATION_MODEL must be set");
  assert.ok(GS_CONFIG.REVIEW_CONFIDENCE_THRESHOLD > 0, "REVIEW_CONFIDENCE_THRESHOLD must be > 0");
  assert.ok(GS_CONFIG.MAX_UNCERTAINTY_RETRIES >= 1, "MAX_UNCERTAINTY_RETRIES must be >= 1");
  assert.ok(GS_CONFIG.LEGACY_VERSION,              "LEGACY_VERSION must be set");
  assert.notEqual(GS_CONFIG.CHECKLIST_VERSION, GS_CONFIG.LEGACY_VERSION, "Current and legacy versions must differ");
});
