# SnapSolve Gold Standard — Governing Rule
**Status:** Governing policy — enforced before any implementation begins
**Scope:** Question-bank authoring, lesson quality, and student-ready acceptance in SnapSolve

---

## Five Mandatory Gates for Student-Ready Content

Every student-ready question and its complete teaching experience must satisfy all five gates:

### G1 — Curriculum and question validity

Use the current official curriculum and source for the correct board, class, subject, chapter, and topic. Confirm concept coverage, unambiguous wording, appropriate difficulty, and source attribution.

### G2 — Academic correctness

Verify the answer, reasoning, formulas, arithmetic, units, and MCQ option. Explain meaningful distractors and reject unsupported assumptions or misleading explanations.

### G3 — Teaching excellence

Explain what, why, and how. Justify the selected method and formula, show essential reasoning and calculations, address relevant misconceptions and exam traps, and use accessible language and transferable examples so a weak student can attempt a similar problem independently.

### G4 — Structured teaching completeness

Preserve the existing 16-section `TeachingLesson` contract and Detailed, Standard, and Compact compatibility. Require enough meaningful steps for understanding, not a fixed step count. Permit source-supported intermediate calculations before `finalAnswer` while retaining the existing answer-last safeguards.

### G5 — Instant reusable delivery

Generate once, validate, save, and reuse the complete lesson. A valid saved-lesson hit must be returned before any AI fallback and must make zero model calls. Measure local retrieval separately from authenticated browser display.

### Gate routing — one path, no duplicate checklist

These gates are one release-level standard mapped onto existing mechanisms; they are not five new checklist runs:

| Gate | Existing mechanism |
|---|---|
| G1–G2 | The existing academic-review workflow and its single formal checklist |
| G3 | The shared lesson reviewer and improver pipeline, across the boards, classes, subjects, and chapters it supports |
| G4 | The existing `TeachingLesson` parser, completeness/integrity validation, and renderers |
| G5 | The existing saved-lesson assets and resolver, which validates a hit before reaching fallback |

All five gates are required to claim the complete student-ready standard. `GOLD_STANDARD_PASS` remains the only formal Q&A outcome that permits freezing a question-bank entry. A lesson-quality result or saved-asset hit does not replace or duplicate that formal review.

---

## Cost-Control Constraint

There must be ONE formal Gold Standard path only.
Do not implement separate authoring-stage and acceptance-stage checklist evaluations.
Do not invoke the full checklist twice.

---

## Generation Guidance (prompt-only, no evaluation)

Question-generation prompts may include only this compact instruction:

> "Create every Question & Answer to the SnapSolve Gold Standard: important,
> relevant and examination-worthy; suitable for use by an experienced CBSE
> teacher; acceptable to an experienced CBSE examiner; fully accurate; complete
> in marking points; sufficiently deep; and understandable by a weak student."

This instruction is **generation guidance only**.
It must not run a checklist, generate scores, create review records, or make a PASS decision.

---

## Formal Acceptance (one path, one invocation)

Run the complete Gold Standard Question & Answer Acceptance Checklist **once only**,
inside the **existing academic-review workflow** (`@workspace/scripts` → `academic-review`),
after the Question & Answer has been generated.

### Permitted outcomes (issued only by this formal review)

| Outcome | Meaning |
|---|---|
| `GOLD_STANDARD_PASS` | Q&A meets all checklist criteria — may be frozen |
| `CONFIRMED_DEFECT` | Clear failure on one or more criteria — must be corrected |
| `POSSIBLE_DEFECT_REQUIRES_VERIFICATION` | Reviewer uncertainty requiring human check |
| `REVIEWER_UNCERTAINTY` | Reviewer could not assess — requires human judgement |

**Only `GOLD_STANDARD_PASS` permits freezing.**

### Remediation loop

- Correct only the failed criteria.
- Re-review only the modified Question & Answer.
- Retain cached PASS results for all unchanged content.

---

## Prohibitions

- Do not create a separate authoring-stage checklist pipeline.
- Do not create a separate acceptance-stage checklist pipeline.
- Do not invoke the full checklist at generation time.
- Do not invoke the full checklist more than once per Q&A.
- Do not implement a parallel review system alongside the existing academic-review workflow.

---

## Relationship to Existing Systems

| System | Role | Affected by this rule? |
|---|---|---|
| `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts` | Runtime lesson-quality evaluator (18-point, scores generated lesson explanations) | **No** — remains separate; do not merge it with or turn it into a second formal Q&A checklist |
| `scripts/src/academicReview.ts` | Existing academic-review workflow — the one formal acceptance path for Q&A gates G1–G2 | **Yes** — retain this as the only path that issues formal Q&A outcomes |
