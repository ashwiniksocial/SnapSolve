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
                   if failed + cycles remaining:
                   improveLesson()  ← one OpenAI call: returns full improved lesson
                       ↓
                   re-review (max 3 cycles total)
                       ↓
                   return best lesson + QualityPipelineResult
```

## Pass threshold
ALL nine dimension scores must be ≥ 95:
`vocabulary`, `conceptTeaching`, `reasoning`, `stepExplanation`, `examples`, `memory`, `practice`, `confidenceBuilding`, `weakStudentUnderstanding`

## Max cycles
`MAX_REVIEW_CYCLES = 3` — after the third review cycle, the best lesson is returned regardless.

## Graceful degradation
If any review or improve call throws (timeout, API error), the pipeline stops and returns the best lesson seen so far. The route handler also wraps the entire pipeline in a try/catch so a pipeline failure never 500s the request — the original draft is returned instead.

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
