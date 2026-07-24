# Academic Review

This directory contains configuration and results for the SnapSolve question-bank
academic review pipeline.

---

## Directory Contents

| Path | Purpose |
|---|---|
| `context-audit.json` | Maps chapter IDs to source-context availability for the reviewer |
| `results/<chapterId>.json` | Per-chapter review records written by `pnpm --filter @workspace/scripts run academic-review` |

---

## Two Separate Quality Systems — Important Distinction

### 1. Runtime Teaching Quality Checklist

**File:** `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts`

An 18-point checklist (`CHECKLIST: ChecklistItem[]`) that evaluates every
AI-generated lesson response **at runtime** before it reaches the student.
It scores 9 dimensions: `vocabulary`, `conceptTeaching`, `reasoning`,
`stepExplanation`, `examples`, `memory`, `practice`, `confidenceBuilding`,
and `weakStudentUnderstanding`.

This is a **runtime lesson-quality evaluator**. It assesses how well the AI
explained a concept in a generated lesson. It is not a question-bank validator.

### 2. Approved Gold Standard Question & Answer Acceptance Checklist

The approved SnapSolve **Gold Standard Q&A Acceptance Checklist** governs the
question bank: it defines the criteria a question, answer, hints, and steps must
satisfy before being accepted into the bank.

This checklist must be implemented **within the existing academic-review workflow**
(the `academic-review` npm script in `@workspace/scripts`) — not as a separate
parallel system.

**These two systems are entirely independent.** The runtime Teaching Quality
checklist must not be renamed, deleted, or merged with the Q&A Acceptance
Checklist.

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
