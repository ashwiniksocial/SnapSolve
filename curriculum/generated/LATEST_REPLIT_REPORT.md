# Gold Standard Q&A Acceptance Checklist — Refinement Report
**Date:** 2026-07-24  
**Type:** Design refinement only — no code written, no systems modified  
**Spec file:** `.local/governance/GOLD_STANDARD_QA_SPEC.md` (version 1.1)

---

## 1. Files Changed

| File | Change |
|---|---|
| `.local/governance/GOLD_STANDARD_QA_SPEC.md` | Refined in-place. Version 1.0 → 1.1. Five targeted refinements applied. |
| `curriculum/generated/LATEST_REPLIT_REPORT.md` | This file — overwrites previous report. |

No other files were touched.

---

## 2. Exact Refinements Made

### Refinement 1 — Configuration (new §1)

A dedicated **§1 Configuration** section was added. Every tunable parameter is now listed there:

| Parameter | Value |
|---|---|
| `CHECKLIST_VERSION` | `"2.0"` |
| `REVIEWER_MODEL` | `"gpt-4o-mini"` |
| `ESCALATION_MODEL` | `"gpt-4o"` |
| `REVIEW_CONFIDENCE_THRESHOLD` | `0.85` |
| `MAX_UNCERTAINTY_RETRIES` | `2` |
| `LEGACY_VERSION` | `"1.1"` |

All occurrences of hardcoded `0.85`, `"gpt-4o-mini"`, `"2.0"`, `"1.1"`, and retry counts were removed from the body of the spec. The review engine must read configuration — not embed constants.

The `ReviewRecord` field was renamed from `promptVersion` to `checklistVersion` to match the new config parameter name.

---

### Refinement 2 — Checklist Structure

All references to "10 criteria", "10 dimensions", and "10-criterion evaluation" were removed throughout.

- `§2 Outcomes` now says "iterates over the checklist definition"
- `§5 Review Workflow` says "Iterates over the checklist definition" (not a fixed count)
- `§6 Caching` `ReviewRecord.dimensions` is now `Record<string, "PASS" | "FAIL">` — not a named interface with fixed keys
- `§7 JSON Schema` explicitly states: *"The `dimensions` object is keyed by criterion id and must include one entry per criterion in the current checklist definition — the engine does not validate a fixed count."*
- `§10 Phase 1` says "Add `dimensions: Record<string, 'PASS' | 'FAIL'>` replacing fixed-key interface"

Future criteria can be added or removed by updating §3 and bumping `CHECKLIST_VERSION`. No review logic changes required.

---

### Refinement 3 — Defect Evidence

The outcome routing was fundamentally changed from confidence-gated to evidence-gated.

**Before:**  
`CONFIRMED_DEFECT` when confidence ≥ `REVIEW_CONFIDENCE_THRESHOLD`

**After:**  
`CONFIRMED_DEFECT` requires all four of:
1. `exact_defective_text` — verbatim wrong text
2. `reason` — why it fails the criterion
3. `expected_correction` — specific fix required
4. `supporting_evidence` — source citation or shown calculation

`REVIEW_CONFIDENCE_THRESHOLD` is now **metadata only** — stored in the record and used in reporting, not in routing. The word "metadata" is explicit in §2, §6, and §7.

The `field_corrections` JSON schema was replaced with `fail_evidence` containing the four required fields plus `reviewer_confidence` as optional metadata.

All per-criterion "Confidence threshold: 0.85" lines were removed (they were repeated 6 times across the criteria tables — all gone).

§8 False-Positive Guard 3 was updated to reflect evidence completeness, not confidence level.

---

### Refinement 4 — Automation-First

**Before:** POSSIBLE_DEFECT → human review (default path)

**After:** POSSIBLE_DEFECT → second AI verification (automatic, same `REVIEWER_MODEL`) → agreement → CONFIRMED_DEFECT OR REVIEWER_UNCERTAINTY

The §5 Review Workflow diagram was rewritten to show:

```
POSSIBLE_DEFECT_REQUIRES_VERIFICATION
  └─ SECOND AI VERIFICATION (one API call using REVIEWER_MODEL)
       ├─ Second reviewer confirms FAIL with complete evidence → CONFIRMED_DEFECT
       └─ Second reviewer disagrees or returns incomplete evidence → REVIEWER_UNCERTAINTY
```

Human review is now explicitly reserved for **three exceptional situations only**:
- Conflicting Government sources
- Persistent AI disagreement across REVIEWER_MODEL and ESCALATION_MODEL
- Missing review context (source material unavailable for an ACTIVE chapter)

§10 Phase 2 now includes `runSecondVerification()` as a required implementation item.

---

### Refinement 5 — Freeze Design

The following was removed as speculative future architecture not required before launch:

- **Phase 3** (entire section) — covered `--verify-possible-defects`, `--human-override`, and `--escalate-uncertainty` CLI flags. These were the human-verification loop. The second AI verification now handles this automatically. The `--escalate-uncertainty` concept is folded into the Phase 2 `REVIEWER_UNCERTAINTY` retry loop.
- **§10 Architecture Recommendation** (entire section) — duplicated constraints already stated in §0. Removed.
- `humanVerified?: boolean` field from `ReviewRecord` — no longer needed; human review is exceptional and out-of-band.
- All per-criterion "Confidence threshold: 0.85" repetitions (6 occurrences)
- "All N criteria are Mandatory" summary line repeated at the top of §3
- The `POSSIBLE_DEFECT caching` note about human action in §6 — replaced with second verification behaviour
- The "50 questions" hardcoded reference in the FREEZE step of the workflow

The spec is now 540 lines (was 587). Every remaining section is required for launch.

---

## 3. Confirmation — No Architecture Redesign

- `academicReview.ts` was not modified
- No new files were created
- No question banks were modified
- No curriculum was modified
- No runtime behaviour was changed
- No new governance files were created
- The architecture remains: extend `academicReview.ts` in-place; one formal path; no parallel system
- `qualityChecklist.ts` (runtime lesson-quality evaluator) was not touched

---

## 4. Confirmation — Implementation-Ready

The specification is implementation-ready. A developer reading §0–§10 has everything required to implement:

- All configuration parameters (§1)
- All outcome types and routing logic (§2)
- All criteria with PASS/FAIL definitions and required evidence (§3)
- The complete review workflow including second AI verification (§5)
- The full `ReviewRecord` and `DefectEvidence` TypeScript interfaces (§6)
- The reviewer JSON schema (§7)
- All false-positive guards (§8)
- Legacy migration rules (§9)
- A two-phase implementation roadmap with scope, risk, and cost (§10)

---

## 5. Remaining Blockers

None. The specification is complete and ready for implementation.
