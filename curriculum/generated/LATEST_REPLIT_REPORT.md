# Gold Standard Q&A Acceptance Checklist — Design Report
**Date:** 2026-07-24  
**Type:** Design only — no code written, no systems modified  
**Spec file:** `.local/governance/GOLD_STANDARD_QA_SPEC.md`

---

## 1. Spec Summary

The complete implementation specification is at `.local/governance/GOLD_STANDARD_QA_SPEC.md`.

It defines:

- 10 acceptance criteria with full PASS/FAIL definitions
- Automation classification (YES / PARTIALLY / NO) for each criterion
- AI judgement prompts, confidence thresholds, and uncertainty handling for every non-objective criterion
- The four formal outcomes and the post-processing logic that produces them
- Caching: content-hash strategy, prompt-version strategy, invalidation rules, skip rules
- Legacy transition rules for all five Q&A states
- Measurable definitions for all 10 subjective concepts from the generation prompt
- A false-positive guard system grounded in the iemh105 review sessions
- A three-phase implementation roadmap with complexity, risk, and cost estimates
- Architecture recommendation: extend `academicReview.ts` in-place — no parallel system

---

## 2. The 10 Criteria

| # | Criterion | Maps to generation prompt | Automatable | Priority | Blocks PASS |
|---|---|---|---|---|---|
| C1 | Curriculum Alignment | "relevant" | PARTIALLY | Mandatory | Yes |
| C2 | Question Clarity | "suitable for CBSE teacher" | PARTIALLY | Mandatory | Yes |
| C3 | Factual & Mathematical Correctness | "fully accurate" | PARTIALLY | Mandatory | Yes |
| C4 | Solution Steps Validity | "complete in marking points" (steps) | PARTIALLY | Mandatory | Yes |
| C5 | Marking Completeness | "complete in marking points" (answer) | NO | Mandatory | Yes |
| C6 | Examination Worthiness | "examination-worthy", "acceptable to CBSE examiner" | NO | Mandatory | Yes |
| C7 | Curriculum Importance | "important" | NO | Mandatory | Yes |
| C8 | Appropriate Depth | "sufficiently deep" | PARTIALLY | Mandatory | Yes |
| C9 | Weak Student Accessibility | "understandable by a weak student" | NO | Mandatory | Yes |
| C10 | Hint Quality | (supporting criterion) | PARTIALLY | Mandatory | Yes |

All 10 criteria are Mandatory. Any FAIL blocks `GOLD_STANDARD_PASS`.

**No criterion is purely objective** (automatable: YES). Three require significant AI judgement (C5, C6, C7). The partially-automatable criteria have objective pre-checks (e.g. answer string contains correct numeric value) before the AI call.

---

## 3. Outcome Determination

The reviewer returns per-dimension PASS/FAIL plus a confidence score [0.0–1.0] for each FAIL.  
Post-processing code — not the reviewer — determines the outcome:

```
all dimensions PASS                                  → GOLD_STANDARD_PASS
any FAIL + all fail-confidences ≥ 0.85              → CONFIRMED_DEFECT
any FAIL + any fail-confidence < 0.85               → POSSIBLE_DEFECT_REQUIRES_VERIFICATION
malformed/contradictory output                      → REVIEWER_UNCERTAINTY
```

**The reviewer does not set `overall`** — this prevents the model from routing its own false positives to `GOLD_STANDARD_PASS`.

**False-positive guards** (post-processing, not prompt-based):
1. If `required_fix` for `correctness` restates the same value as the `answer` field → downgrade to `REVIEWER_UNCERTAINTY`
2. If `questionType === "ShortAnswer"` and correction mentions "Option (A/B/C/D)" → `REVIEWER_UNCERTAINTY`
3. Any `FAIL` on `correctness` or `curriculum_alignment` without a field correction showing specific evidence → `REVIEWER_UNCERTAINTY`

These guards are grounded in the documented gpt-4o-mini failure patterns from the iemh105 review sessions.

---

## 4. Subjective Concepts — Measurable Definitions

| Concept | Measurable proxy | Objectively automatable? |
|---|---|---|
| Teacher Approval | C2 + C6 + C7 all PASS | No — encodes professional pedagogy judgement |
| Examiner Approval | C3 + C5 + C6 all PASS | No — CBSE mark schemes are not machine-readable |
| Important Question | C7: concept in chapter summary, exercises, or PYQ | No — requires curriculum graph beyond source context |
| Exam-worthy | C6: would appear on CBSE exam for this class | No — requires CBSE exam culture knowledge |
| Ample Depth | C8: requires application, not verbatim recall | Partially — single-fact verbatim recall is objectively detectable |
| Weak Student Friendly | C9: all terms defined; no unexplained jumps | No — simulates a cognitive state |
| Complete Marking Points | C5: every mark-worthy element present and explicit | No — CBSE mark schemes confidential |
| Conceptual Understanding | C8 PASS for Medium/Hard questions | Partially — `HOTS` type is objective; others require AI |
| Not Trivial | C8 FAIL trigger: answer ⊆ single source sentence | Partially — verbatim substring check is objective |
| Worth Student Time | C7 + C8 + C6 all PASS | No — depends on student's knowledge state |

---

## 5. Caching

| Signal | Action |
|---|---|
| `contentHash` match + `promptVersion` match + `overall === GOLD_STANDARD_PASS` | Skip — cached |
| `contentHash` changed | Re-review |
| `promptVersion` mismatch | Re-review |
| `overall === CONFIRMED_DEFECT` | Re-review |
| `overall === REVIEWER_UNCERTAINTY` | Re-review automatically |
| `overall === POSSIBLE_DEFECT_REQUIRES_VERIFICATION` | Hold for human review |
| `overall === REVIEW_BLOCKED_CONTEXT_MISSING` | Re-attempt when context is fixed |

**Version bump:** Current prompt version `"1.1"` → new version `"2.0"` on implementation. All 750 existing questions re-review once. Estimated cost: ~$0.15 at gpt-4o-mini pricing.

---

## 6. Legacy Transition

| Q&A state | Treatment |
|---|---|
| New Q&A | No cache entry → reviewed on first run |
| Modified Q&A | `contentHash` changes → automatic re-review |
| Legacy PASS (v1.1) | `promptVersion` mismatch → re-queued; re-reviewed in batches |
| Legacy FAIL (v1.1) | Already re-queued by existing `shouldReview()` logic |
| Deleted Q&A | Orphan cache record — harmless; never re-reviewed (question no longer in source) |
| Merged Q&A | New ID → treated as new; originals become orphan records |

---

## 7. Implementation Roadmap

| Phase | Scope | Complexity | Engineering risk | API cost | Maintainability |
|---|---|---|---|---|---|
| **1** — Schema + outcome migration | Types, `shouldReview()`, `normalizeReviewResult()`, false-positive guards, version bump | Low | Low | Zero | High |
| **2** — New reviewer prompt | `REVIEWER_SYSTEM`, `buildReviewerPrompt()`, confidence fields, outcome-exclusion instruction | Medium | Medium | ~$0.15 (full re-review) | Medium |
| **3** — Escalation + human-verification loop | `--verify-possible-defects`, `--human-override`, `--escalate-uncertainty` flags; gpt-4o escalation | Medium | Low | Variable (only on uncertain questions) | Low |

**Recommendation:** Implement Phases 1 and 2. Defer Phase 3 until a `POSSIBLE_DEFECT` backlog warrants it.

---

## 8. Architecture Recommendation

**Extend `scripts/src/academicReview.ts` in-place.** Do not create a new file, class, or service.

- All new requirements are additive: new types, new prompt, new routing
- Existing caching, hash, CLI, and OpenAI infrastructure is correct and production-tested
- A parallel system would duplicate the caching mechanism and violate the cost-control rule
- Model: `gpt-4o-mini` by default; `gpt-4o` only for `REVIEWER_UNCERTAINTY` escalation in Phase 3

**Cheapest compliant architecture:** Phases 1 + 2 fully satisfy all governance requirements at minimal cost.

---

## 9. Open Design Questions

**OQ-1: Confidence scoring — how should the reviewer express confidence?**  
The spec defines a numeric `[0.0–1.0]` confidence field per FAIL. gpt-4o-mini can produce these reliably when instructed, but they are uncalibrated (the model does not have a well-defined internal probability distribution for these tasks). The threshold of 0.85 is a reasonable starting point but may need calibration after the first full run. Recommendation: treat the first Phase-2 run on iemh105 as a calibration run and adjust the threshold before running the full 750-question bank.

**OQ-2: PYQ (previous-year question) type handling**  
Questions with `questionType === "PYQ"` are exact reproductions of board exam questions. C6 (Examination Worthiness) is trivially PASS for these. C7 (Curriculum Importance) is trivially PASS. Consider a short-circuit rule: if `questionType === "PYQ"`, skip C6 and C7, mark both PASS automatically. This saves ~10% of the AI evaluation effort on PYQ questions.

**OQ-3: Multi-mark questions and partial marking**  
HOTS and LongAnswer questions may have multiple distinct marking points. C5 (Marking Completeness) becomes more complex when the answer field is long and contains several independently-markable parts. The spec handles this via AI judgement, but a structured `markingPoints: string[]` field in the `Question` type would make this criterion more objective. This would be a question-bank schema change — out of scope for the checklist implementation, but worth noting.

---

## 10. Confirmation

| Item | Status |
|---|---|
| `GOLD_STANDARD_QA_SPEC.md` written | ✅ `.local/governance/GOLD_STANDARD_QA_SPEC.md` |
| No code written | ✅ |
| `academicReview.ts` not modified | ✅ |
| Runtime behaviour not modified | ✅ |
| Question banks not modified | ✅ |
| Curriculum not modified | ✅ |
| No new review engine created | ✅ |
| `qualityChecklist.ts` not modified | ✅ |
