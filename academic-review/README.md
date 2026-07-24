# Academic Review

This directory contains configuration and results for the SnapSolve question-bank
academic review pipeline — the **one formal Gold Standard acceptance path**.

---

## Directory Contents

| Path | Purpose |
|---|---|
| `context-audit.json` | Maps chapter IDs to source-context availability for the reviewer |
| `results/<chapterId>.json` | Per-chapter review records written by `pnpm --filter @workspace/scripts run academic-review` |

---

## Gold Standard Q&A — One Formal Path

### Cost-Control Rule

There must be **one formal Gold Standard path only**.  
Do not implement separate authoring-stage and acceptance-stage checklist evaluations.  
Do not invoke the full checklist twice.

### Generation (prompt-only, no evaluation)

Question-generation prompts include only this compact instruction — it produces no
scores, no review records, and no PASS decision:

> "Create every Question & Answer to the SnapSolve Gold Standard: important,
> relevant and examination-worthy; suitable for use by an experienced CBSE
> teacher; acceptable to an experienced CBSE examiner; fully accurate; complete
> in marking points; sufficiently deep; and understandable by a weak student."

### Formal Acceptance (this workflow)

Run the complete Gold Standard Q&A Acceptance Checklist **once**, inside this
academic-review workflow, after the Q&A has been generated.

**Checklist version:** `2.0` — defined by `GS_CONFIG.CHECKLIST_VERSION` in `scripts/src/academicReview.ts`.  
**Model:** `gpt-4o-mini` (first review and automatic second verification); `gpt-4o` for escalation only.

**Permitted outcomes:**

| Outcome | Meaning | Permits freeze? |
|---|---|---|
| `GOLD_STANDARD_PASS` | All criteria pass — eligible for @frozen | **Yes** |
| `CONFIRMED_DEFECT` | Both reviewers confirmed a defect with complete evidence — must be corrected | No |
| `POSSIBLE_DEFECT_REQUIRES_VERIFICATION` | First reviewer flagged an issue — second verification running | No |
| `REVIEWER_UNCERTAINTY` | Malformed output, insufficient evidence, or AI disagreement after retries | No |
| `REVIEW_BLOCKED_CONTEXT_MISSING` | Chapter not ACTIVE in canonical contract — no API call made | No |

Only `GOLD_STANDARD_PASS` under the **current** `CHECKLIST_VERSION` permits freezing.

**Review flow:**
```
First review → if POSSIBLE_DEFECT → automatic second verification
                                  → both agree with evidence → CONFIRMED_DEFECT
                                  → disagree or uncertain   → REVIEWER_UNCERTAINTY
              → if REVIEWER_UNCERTAINTY → auto-retry (up to MAX_UNCERTAINTY_RETRIES)
                                        → escalate to gpt-4o if retries exhausted
```

Human review is reserved for three exceptional situations only:
- Conflicting Government sources
- Persistent AI disagreement across both models
- Missing review context for an ACTIVE chapter

**Remediation loop:** correct only failed criteria → re-review only modified Q&A →
retain cached `GOLD_STANDARD_PASS` results for all unchanged content (hash + version match).

---

## Checklist Criteria

The engine iterates over 10 criteria defined in `CHECKLIST` in `academicReview.ts`.
Adding or removing a criterion requires only updating that array and bumping `CHECKLIST_VERSION` — no review logic changes needed.

| # | Criterion ID | What it verifies |
|---|---|---|
| C1 | `curriculum_alignment` | Concept present in NCERT source context for this chapter |
| C2 | `question_clarity` | Unambiguous, complete, grammatically correct question |
| C3 | `correctness` | Factually and mathematically correct answer, steps, and formulas |
| C4 | `steps_validity` | Gap-free logical path from question to answer |
| C5 | `marking_completeness` | Answer earns full CBSE marks as written |
| C6 | `examination_worthiness` | Would appear in a CBSE school or board exam |
| C7 | `curriculum_importance` | Tests a central concept, not a peripheral detail |
| C8 | `appropriate_depth` | Requires reasoning, not verbatim recall |
| C9 | `weak_student_accessibility` | Every step followable by a struggling student |
| C10 | `hint_quality` | Hints guide toward method without revealing the answer |

**Evidence required for any FAIL:** All four fields must be non-empty — `exact_defective_text`, `reason`, `expected_correction`, `supporting_evidence`. A FAIL without complete evidence is treated as `REVIEWER_UNCERTAINTY`, not `CONFIRMED_DEFECT`.

---

## Caching and Targeted Review

- Skip condition: `overall === "GOLD_STANDARD_PASS"` AND content hash matches AND `checklistVersion` matches current `CHECKLIST_VERSION`
- Any non-GOLD_STANDARD_PASS outcome → re-review on next run
- Legacy records with old `promptVersion` → treated as stale → re-review

---

## Running a Review

```bash
# Review a single chapter (incremental — skips unchanged GOLD_STANDARD_PASS records)
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId>

# Force re-review of all questions in a chapter
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId> --force

# Preview what would be reviewed (no API calls)
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId> --dry-run

# Estimate cost before running
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId> --cost-estimate

# Check curriculum context coverage (no API calls)
pnpm --filter @workspace/scripts run academic-review -- --context-audit
```

Results are written to `academic-review/results/<chapterId>.json` after each
question (Ctrl+C safe). Exit code 0 means all reviewed questions achieved GOLD_STANDARD_PASS.

---

## Two Separate Quality Systems — Do Not Conflate

### 1. Runtime Teaching Quality Checklist (lesson evaluator — NOT this system)

**File:** `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts`

An 18-point checklist that evaluates every AI-generated **lesson response** at
runtime before it reaches the student. It scores 9 dimensions: `vocabulary`,
`conceptTeaching`, `reasoning`, `stepExplanation`, `examples`, `memory`,
`practice`, `confidenceBuilding`, `weakStudentUnderstanding`.

This evaluates **how well the AI explained a concept**. It is not the Gold
Standard Q&A Acceptance Checklist and must not be renamed, deleted, or merged
with it.

### 2. Gold Standard Q&A Acceptance Checklist (this workflow)

Validates that a question, answer, hints, and steps meet the Gold Standard before
the Q&A may be frozen into the question bank. Runs here, once per Q&A, after
generation. See governance rule at `.local/governance/GOLD_STANDARD_QA_RULE.md`
and full specification at `.local/governance/GOLD_STANDARD_QA_SPEC.md`.
