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

**Permitted outcomes:**

| Outcome | Meaning |
|---|---|
| `GOLD_STANDARD_PASS` | Meets all criteria — may be frozen |
| `CONFIRMED_DEFECT` | Clear failure — must be corrected |
| `POSSIBLE_DEFECT_REQUIRES_VERIFICATION` | Requires human check |
| `REVIEWER_UNCERTAINTY` | Requires human judgement |

Only `GOLD_STANDARD_PASS` permits freezing.

**Remediation loop:** correct only failed criteria → re-review only modified Q&A →
retain cached PASS results for all unchanged content.

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
generation. See governance rule at `.local/governance/GOLD_STANDARD_QA_RULE.md`.

---

## Running a Review

```bash
# Review a single chapter (incremental — skips unchanged PASS records)
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId>

# Force re-review of all questions in a chapter
pnpm --filter @workspace/scripts run academic-review -- --chapter <chapterId> --force
```

Results are written to `academic-review/results/<chapterId>.json` after each
question (Ctrl+C safe). Exit code 0 means all reviewed questions passed.
