---
name: Teaching Quality Pipeline
description: Server-side pipeline that reviews and improves every AI lesson before it reaches the student.
---

## Location
`artifacts/api-server/src/services/teachingQuality/` — 9 files

## Shared types
`artifacts/api-server/src/lib/lessonTypes.ts` — `LessonResponse`, `LessonStep`, `parseLessonResponse()`, `safeStr()`, `parseStep()`. Both `solveQuestion.ts` and the quality services import from here.

## Pipeline flow (in `index.ts`)
```
generateDraft()  →  runQualityPipeline(draft, apiKey)
                       ↓
                   reviewLesson()   ← one OpenAI call: scores + confusions + issues
                       ↓
                    if failed + cycles remaining (standard lesson flow):
                   improveLesson()  ← one OpenAI call: returns full improved lesson
                       ↓
                    re-review (max 2 cycles total)
                       ↓
                   return best lesson + QualityPipelineResult
```

## Pass threshold
ALL nine dimension scores must be ≥ 95:
`vocabulary`, `conceptTeaching`, `reasoning`, `stepExplanation`, `examples`, `memory`, `practice`, `confidenceBuilding`, `weakStudentUnderstanding`

## Max cycles
`MAX_REVIEW_CYCLES = 2` — after the second review cycle, the best lesson is returned regardless for the standard lesson flow.

## Graceful degradation
For standard lesson generation, a review or improve error stops the pipeline and returns the best lesson seen so far. Simplify is intentionally stricter: it must pass the existing reviewer and canonical checks; reviewer rejection, timeout, or failure is not approval and must not return the candidate as a successful simplification.

## Simplify rule
Simplify uses one review of the candidate and does not invoke the generic lesson improver. The selected level's generation instruction must remain distinct; a candidate is accepted only when the reviewer explicitly passes it, canonical fields still match, and student-facing explanatory text materially differs from the source (ignoring only whitespace/Unicode normalization). Failure leaves the original lesson displayed.

**Why:** The generic improver's expansion-only instruction conflicts with shorter explanations, and returning an unreviewed or unchanged candidate falsely reports success.

**How to apply:** Keep Simplify fail-closed and review-only. Do not add another generation cycle or weaken the reviewer or canonical checks to force a visible difference.

## Logging
All quality data logged server-side via `req.log`. Nothing sent to the client:
- `solveQuestion: quality pipeline complete` — cyclesRun, passed, overall score, weakStudentScore
- `solveQuestion: quality cycle` — per-cycle DEBUG log with scores, confusion count, issue count

## Models used
- Draft generation: `gpt-4o-mini`, temp 0.3, max_tokens 5000, timeout 30s
- Review:          `gpt-4o-mini`, temp 0.1, max_tokens 3000, timeout 25s
- Improve:         `gpt-4o-mini`, temp 0.4, max_tokens 5000, timeout 35s

## Why
**Why:** The brief states "every lesson must first be reviewed" before reaching the student. The pipeline is the gatekeeper — not a UI feature, not a dashboard, purely a server-side quality gate.

**How to apply:** Any future change to lesson quality logic belongs in this service directory. Do NOT add quality gating inside the route handler directly. The route handler only calls `runQualityPipeline()` and logs the result.
