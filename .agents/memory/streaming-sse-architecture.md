---
name: Streaming SSE Architecture
description: How Standard-mode streaming is implemented — server route, extractor, client threading, stable IDs.
---

## Rule
Standard-mode fresh questions stream via SSE (`POST /api/solveQuestion/stream`).
Bank questions, Detailed mode, Compact mode, and simplify intent use the regular `/api/solveQuestion` route unchanged.

## Why
Full Standard lesson takes 5–7 s with nothing shown. SSE streaming delivers first content at ~850–1550 ms (well under 3 s), while the complete lesson arrives at 5–7 s as before.

## How to apply

### Server (`artifacts/api-server/src/routes/solveQuestion.ts`)
- `buildDraftPrompts()` helper extracted from `generateDraft()` — both routes share it.
- Streaming route: SSE headers → blueprint planning → `fetch(OPENAI_URL, { stream:true, stream_options:{include_usage:true} })` → `LessonStreamExtractor.feed(chunk)` → emit `data: {...}\n\n` per section → post-process (QT classifier + practiceQuestion strip same as regular route) → `setCached` → emit `done`.
- Client disconnect handled: `res.on('close', () => abortCtrl.abort())`.
- Cache hit returns via SSE (`type:"cached"`) so the client always reads SSE.
- Server-side 15 s `STANDARD_BUDGET_MS` AbortController applied.

### Extractor (`artifacts/api-server/src/lib/lessonStreamExtractor.ts`)
- `LessonStreamExtractor` class: accumulates JSON text, bracket-counts to detect complete fields.
- Only emits after `JSON.parse` succeeds — no malformed data ever emitted.
- Steps emitted sequentially 0→3 (stops at first incomplete step).
- Fields: `topic`, `difficulty`, `aiConfidence`, `keyConcepts[]`, `questionTranslation{}`, `step[0..3]`, `finalAnswer{}`.

### Client (`artifacts/homework-hero/src/services/ai/openaiSolver.ts`)
- `callBackendStream()` reads SSE, calls `onSection` per field, returns full lesson from `done` event.
- `solveWithOpenAI()` accepts `onPartial?: (partial: AIResponse) => void` as 5th param.
- Streaming path active only when: `mode === "standard" && !intent && onPartial`.
- Stable `streamId = ai-${Date.now()}` generated once, shared by ALL partial updates AND final result → `SolutionCard` never remounts during streaming (no `key={solution.id}` churn).
- On stream failure: silently falls through to regular `callBackend()` — no visible error.
- First partial triggered on: first step OR non-empty `questionTranslation.plainEnglish`.
- Practice question zeroed out on partial renders (toAIResponse fills defaults otherwise).

### Threading
- `aiSolver.ts` `solve()` gains `onPartial?` as 8th parameter, passes to `solveWithOpenAI()`.
- `Solution.tsx` `runSolver()` defines `onPartial = (partial) => { setSolution(partial); setPageState("done"); }` and passes it as 7th arg to `solve()`.

## Benchmark results (measured, gpt-4o-mini, Standard mode)
- First content: 849–1545 ms (median ~1.1 s) — well below 3 s target and 5 s gate
- Full lesson: 5.1–6.4 s (unchanged from pre-streaming)
- AI calls: exactly 1 per fresh question
- All 6/6 test cases: 4 steps, valid finalAnswer
