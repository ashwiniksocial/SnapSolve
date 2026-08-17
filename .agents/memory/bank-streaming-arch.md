---
name: Bank Question Streaming Architecture
description: How bank questions generate a TeachingLesson via streaming — cache-first, grounded in frozen answer, one lesson for all 3 modes.
---

## Architecture (P0-D final)

**Trigger:** `practiceMode=1` + `session.practiceQuestionId` matched by `getQuestionById()`

**Data flow:**

1. **Client cache check** — `getBankCachedLesson(questionId)` in `openaiSolver.ts` (localStorage key `studyai-bank-lesson-cache-v1`). 7-day TTL. Cache hit → instant render, 0 AI calls.

2. **Stream generation** — `solveBankWithStream()` calls `callBankStream()` which POSTs to `/api/solveQuestion/stream` with:
   - `mode: "basic"` — full Detailed schema (2800 tokens), all sections populated, all 3 teaching modes work
   - `bankContext: { questionId, answer, hint, steps, keyConcepts }` — frozen Gold Standard answer as authoritative grounding

3. **Backend handling** (stream route in `solveQuestion.ts`):
   - Server-side bank cache check by `makeBankCacheKey(questionId)` — emits `{type:"cached"}` if hit
   - Skips `buildTeachingBlueprint` (frozen question, no topic routing needed)
   - Injects bankContext grounding into `userContent`: Gold Standard answer + approved steps; AI must anchor `finalAnswer` and `guidedReasoning` to these but may enrich all other sections
   - `systemContent` from `buildDraftPrompts(subj, q, "basic", ...)` → full subject tutor prompt + full schema
   - `streamMaxTokens = 2800` (from buildDraftPrompts for "basic" mode)
   - **No quality pipeline** (stream route never runs it)
   - Skips Standard post-processing guards (questionTranslation clearing, practiceQuestion clearing) for bank questions
   - Caches completed lesson by `makeBankCacheKey(questionId)` in `responseCache` Map

4. **Progressive rendering** — `LessonStreamExtractor` emits sections as they arrive. `solveBankWithStream` triggers `onPartial` on first `keyConcepts` or `step` section (~300–500ms). Frontend calls `setSolution(partial)` + `setPageState("done")` → spinner disappears, partial lesson renders.

5. **Client-side cache write** — After `done` event, full lesson cached by `questionId` in localStorage.

**Speed contract:**
- Cache hit: <50 ms (localStorage read)
- Cache miss first content: ~300–500 ms (keyConcepts arrives early)
- Cache miss full lesson: ~8–12 s (2800 token full Detailed generation)

**Why "basic" mode for generation:**
All 3 teaching modes (Detailed 8 sections / Standard 5 / Compact 3) need different fields from the lesson. Generating at "basic" (Detailed) produces all fields. Mode switching is then purely a render decision in `LessonRenderer.show` — 0 additional AI calls.

**Why skip quality pipeline:**
Bank questions have a Gold Standard answer from subject-expert review. The quality reviewer would add ~30 s latency with no accuracy benefit (the answer is already correct). The founder explicitly requires: "NO reviewer/improver cycles on this path."

**Key files:**
- Backend: `artifacts/api-server/src/routes/solveQuestion.ts` (stream route, ~1725–1990)
- Backend: `artifacts/api-server/src/lib/lessonStreamExtractor.ts` (step limit bumped to 8)
- Frontend: `artifacts/homework-hero/src/services/ai/openaiSolver.ts` — `getBankCachedLesson`, `cacheBankLesson`, `callBankStream`, `solveBankWithStream`
- Frontend: `artifacts/homework-hero/src/pages/Solution.tsx` — bank fast-path (~line 74)

**Fallback:** If streaming fails, Solution.tsx catches and shows the minimal `bankResult` skeleton (question text + keyConcepts + steps + finalAnswer) so the student isn't blocked.

**Why:**
Founder explicitly rejected P0-D first attempt (manually reinterpreting bank fields into TeachingLesson). Required architecture: frozen question → ONE streaming AI call grounded in frozen answer → one lesson → all 3 modes. No quality cycles. Cache by questionId.
