# Gold Standard Q&A Acceptance Checklist — Implementation Report
**Date:** 2026-07-24  
**Type:** Implementation — `scripts/src/academicReview.ts` extended in-place  
**Spec:** `.local/governance/GOLD_STANDARD_QA_SPEC.md` v1.1

---

## 1. Files Changed

| File | Change |
|---|---|
| `scripts/src/academicReview.ts` | Rewritten in-place. Gold Standard implementation. All prior CLI, caching, and question-loading behaviour preserved. |
| `scripts/src/academicReview.test.ts` | **Created.** 22 focused tests covering all 15 required scenarios. |
| `scripts/package.json` | Added `test:academic-review` script. |
| `academic-review/README.md` | Updated to reflect Gold Standard outcomes, criteria list, automatic second verification, and evidence requirements. |
| `curriculum/generated/LATEST_REPLIT_REPORT.md` | This file — overwrites previous report. |

No question banks, curriculum, runtime Teaching Quality (`qualityChecklist.ts`), UI, or API server files were modified.

---

## 2. Minimum Implementation Completed

### Configuration — `GS_CONFIG` (centralised, no hardcoded values)
```typescript
export const GS_CONFIG = {
  CHECKLIST_VERSION:           "2.0",   // invalidates all cache on bump
  REVIEWER_MODEL:              "gpt-4o-mini",
  ESCALATION_MODEL:            "gpt-4o",
  REVIEW_CONFIDENCE_THRESHOLD: 0.85,    // metadata only — does not gate outcomes
  MAX_UNCERTAINTY_RETRIES:     2,
  LEGACY_VERSION:              "1.1",
} as const;
```

### Dynamic Checklist — `CHECKLIST: CriterionDef[]`
The engine iterates over this array. No criterion key is hardcoded in decision logic. Adding or removing a criterion requires updating the array and bumping `CHECKLIST_VERSION` only.

10 criteria implemented: `curriculum_alignment`, `question_clarity`, `correctness`, `steps_validity`, `marking_completeness`, `examination_worthiness`, `curriculum_importance`, `appropriate_depth`, `weak_student_accessibility`, `hint_quality`.

### Types — `GoldStandardOutcome`, `DefectEvidence`, `ReviewRecord`
- `GoldStandardOutcome`: 5 values (4 formal + `REVIEW_BLOCKED_CONTEXT_MISSING`)
- `DefectEvidence`: 4 required evidence fields + `reviewer_confidence` as metadata
- `ReviewRecord`: `checklistVersion?` (optional for legacy compatibility), `failEvidence[]`, `failConfidences` (metadata)

---

## 3. Review Outcomes and Evidence Routing

### Outcome determination (code-driven, not reviewer-driven)

```
Reviewer returns dimensions + fail_evidence (never overall)
  ↓
Apply false-positive guards (G1–G4)
  ↓
determineOutcome():
  all criteria PASS                                     → GOLD_STANDARD_PASS
  any FAIL + all fail-evidence complete (4 fields)      → POSSIBLE_DEFECT_REQUIRES_VERIFICATION
  any FAIL + any fail-evidence incomplete               → REVIEWER_UNCERTAINTY
  malformed/missing dimensions                          → REVIEWER_UNCERTAINTY
```

### Evidence requirement for CONFIRMED_DEFECT
All four fields must be non-empty for every FAIL:
1. `exact_defective_text` — verbatim wrong text from the Q&A
2. `reason` — why it fails the criterion
3. `expected_correction` — the specific fix required
4. `supporting_evidence` — shown calculation or source context citation

**Confidence is metadata only.** `reviewer_confidence` is stored and reported but never gates any outcome decision.

### False-positive guards (applied in `applyFalsePositiveGuards()`)
- **G1** — proposed correction for `correctness` is semantically identical to the existing answer (number match or normalised string match) → demote to PASS
- **G2** — non-MCQ question review references `Option (A/B/C/D)` → demote to PASS
- **G3** — `correctness` or `curriculum_alignment` FAIL without non-empty `supporting_evidence` → demote to PASS
- **G4** — any criterion FAIL with empty `exact_defective_text` → demote to PASS

---

## 4. Automatic Second-Verification Behaviour

```
POSSIBLE_DEFECT_REQUIRES_VERIFICATION
  ↓
buildSecondVerificationPrompt(q, ctx, firstEvidence)
  — shows original Q&A + first reviewer's exact allegations
  — instructs second reviewer to independently confirm or reject
  ↓
callOpenAI(REVIEWER_MODEL) → normalizeReviewResult() → applyFalsePositiveGuards()
  ↓
  Second confirms same criterion(s) with complete evidence → CONFIRMED_DEFECT
  Second disagrees, changes allegation, or evidence incomplete → REVIEWER_UNCERTAINTY
```

**Human review is NOT the default path.** It is reserved for three exceptional situations only (conflicting Government sources, persistent cross-model disagreement, missing review context).

### REVIEWER_UNCERTAINTY retry loop
```
REVIEWER_UNCERTAINTY → retry up to MAX_UNCERTAINTY_RETRIES (REVIEWER_MODEL)
                     → if still uncertain → one retry with ESCALATION_MODEL
                     → if still uncertain → record REVIEWER_UNCERTAINTY
```

`ESCALATION_MODEL` is never used by default — only for persistent uncertainty.

---

## 5. Caching and Targeted-Review Preservation

All existing CLI flags preserved: `--chapter`, `--subject`, `--class`, `--question`, `--force`, `--dry-run`, `--cost-estimate`, `--failed-only`, `--context-audit`, `--batch-size`, `--max-questions`, `--delay-ms`.

### Skip condition (single, unambiguous rule)
Skip if and only if: `overall === "GOLD_STANDARD_PASS"` AND `contentHash` matches AND `checklistVersion === GS_CONFIG.CHECKLIST_VERSION`.

### Cache invalidation
| Condition | Action |
|---|---|
| Content hash changed | Re-review |
| `checklistVersion` mismatch (including legacy `promptVersion` records) | Re-review |
| `overall` is any non-GOLD_STANDARD_PASS outcome | Re-review |
| `--force` | Re-review all |
| `REVIEW_BLOCKED_CONTEXT_MISSING` | Re-attempt on next run |

### ReviewRecord schema (new)
`checklistVersion`, `failEvidence[]`, `failConfidences` added. `promptVersion` retained as optional for legacy-record compatibility. `dimensions` now `Record<string, "PASS" | "FAIL">` — not a fixed-key interface.

---

## 6. Legacy Transition

| Q&A state | Behaviour |
|---|---|
| New Q&A | No cache entry → reviewed on first run |
| Modified Q&A | Hash changes → automatic re-review |
| Legacy unchanged Q&A (old `promptVersion`) | Version mismatch → `shouldReview()` returns `skip: false` → queued for review |
| Legacy PASS (`overall: "PASS"`) | Does not match `GOLD_STANDARD_PASS` condition → re-queued |
| Deleted Q&A | Orphan cache record — harmless; never re-reviewed |

Legacy Q&A is **not reviewed in this task** per the implementation brief. It will be reviewed on the next incremental run (automatically, by version mismatch detection). Run `--cost-estimate` first.

---

## 7. Confirmation — No Question Bank Reviewed or Modified

- No question bank file was read, parsed, or written
- No chapter was reviewed (no OpenAI calls made)
- `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts` was not touched
- Curriculum, UI, and runtime behaviour were not modified

---

## 8. Test and Validation Results

### Scripts typecheck
```
✅ PASS — 0 errors
```

### homework-hero typecheck
```
✅ PASS — 0 errors
```

### api-server typecheck
```
✅ PASS — 0 errors
```

### Focused academic-review tests (22 tests)
```
✔  1.  Dynamic criterion iteration — CHECKLIST is non-empty and iterable
✔  2.  All-pass result → GOLD_STANDARD_PASS
✔  3.  FAIL with complete evidence → POSSIBLE_DEFECT_REQUIRES_VERIFICATION
✔  4.  FAIL with incomplete evidence → REVIEWER_UNCERTAINTY
✔  5.  G1: proposed correction restates same value as answer → demote to PASS
✔  6.  Second-review agreement → CONFIRMED_DEFECT (logic verification)
✔  7.  Second-review disagrees → REVIEWER_UNCERTAINTY (logic verification)
✔  8.  G1: exact numeric match in correction restates answer → demote
✔  9.  G2: non-MCQ review references Option (A) → demote to PASS
✔ 10.  Cache hit (hash match + current version + GOLD_STANDARD_PASS) → skip
✔ 11.  Cache invalidation after content change → re-review
✔ 12.  Cache invalidation after checklist-version change → re-review
✔ 13.  Legacy PASS record (old promptVersion) is not skipped — awaits re-review
✔ 14.  Old-rubric PASS (v1.1) is not treated as GOLD_STANDARD_PASS
✔ 15.  Targeted chapter filtering via --chapter remains functional
✔ B1.  isEvidenceComplete — true when all four fields non-empty
✔ B2.  isEvidenceComplete — false when any field is empty
✔ B3.  normalizeReviewResult — malformed input → REVIEWER_UNCERTAINTY
✔ B4.  normalizeReviewResult — all-pass dimensions → GOLD_STANDARD_PASS
✔ B5.  G3: correctness FAIL without supporting evidence → demote
✔ B6.  computeContentHash — deterministic and sensitive to changes
✔ B7.  GS_CONFIG — all required parameters present

tests: 22  pass: 22  fail: 0  duration: 238ms
```

### validate-curriculum
```
✅ PASS — All curriculum invariants passed
```

### curriculum-check
```
✅ PASS — 0 failures, 2 pre-existing warnings (SOURCE_UNRESOLVED, unrelated to this task)
```

---

## 9. Genuine Blockers

None. The implementation is complete and all validations pass.
