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
   - `bankContext: { questionId, sourceHash, answer, hint, steps, keyConcepts }` — frozen Gold Standard answer as authoritative grounding

3. **Backend handling** (stream route in `solveQuestion.ts`):
   - Server-side bank cache check by `makeBankCacheKey(questionId)` — serves a hit only when source hash and answer are verified
   - Skips `buildTeachingBlueprint` (frozen question, no topic routing needed)
   - Injects bankContext grounding into `userContent`: Gold Standard answer + approved steps; AI must anchor `finalAnswer` and `guidedReasoning` to these but may enrich all other sections
   - `systemContent` from `buildDraftPrompts(subj, q, "basic", ...)` → full subject tutor prompt + full schema
   - `streamMaxTokens = 2800` (from buildDraftPrompts for "basic" mode)
   - **No quality pipeline** (stream route never runs it)
   - Skips Standard post-processing guards (questionTranslation clearing, practiceQuestion clearing) for bank questions
   - Caches completed lesson by `makeBankCacheKey(questionId)` in `responseCache` Map with its source hash

4. **Stream completion and presentation** — `LessonStreamExtractor` processes sections, but the bank route does not emit bank lesson sections until the final answer passes integrity validation. The student Solution page remains loading until the final SSE response; this preserves Q59 final-only display.

5. **Client-side cache write** — After `done` event, full lesson cached by `questionId` in localStorage.

**Historical timing notes:**
- Cache hit: <50 ms (localStorage read)
- Earlier notes estimated 8–12 s for a full lesson; the founder's confirmed current cold-response baseline is 33–46 s. Treat neither as a guarantee without fresh measurements.

**Why "basic" mode for generation:**
All 3 teaching modes (Detailed 8 sections / Standard 5 / Compact 3) need different fields from the lesson. Generating at "basic" (Detailed) produces all fields. Mode switching is then purely a render decision in `LessonRenderer.show` — 0 additional AI calls.

**Why skip quality pipeline:**
Bank questions have a Gold Standard answer from subject-expert review. The quality reviewer would add ~30 s latency with no accuracy benefit (the answer is already correct). The founder explicitly requires: "NO reviewer/improver cycles on this path."

**Key files:**
- Backend: `artifacts/api-server/src/routes/solveQuestion.ts` (stream route, ~1725–1990)
- Backend: `artifacts/api-server/src/lib/lessonStreamExtractor.ts` (step limit bumped to 8)
- Frontend: `artifacts/homework-hero/src/services/ai/openaiSolver.ts` — `getBankCachedLesson`, `cacheBankLesson`, `callBankStream`, `solveBankWithStream`
- Frontend: `artifacts/homework-hero/src/pages/Solution.tsx` — bank fast-path (~line 74)

**Failure handling:** Explicit backend `timeout` and `stream_interrupted` errors use the existing frozen-bank solution with a distinct “AI lesson could not finish” notice, but only when the active bank record has a non-empty question and answer plus usable steps. A missing or invalid bank solution stays in the safe error state. Confirmed answer mismatches and indeterminate comparisons keep their existing frozen-bank fallback. Incomplete lessons and other errors remain errors; no partial or failed generated lesson is displayed as complete, cached, or automatically retried.

**Why:** A known generation-budget abort should not leave a student without the original solution, while generated content must remain subordinate to the frozen answer and must never be presented as verified unless it passes the existing integrity gate.

**How to apply:** Keep timeout fallback limited to the bank-question path and explicit timeout/interruption codes. Do not broaden it to generic network/OCR errors, raise the backend budget, retry generation, or cache failed responses.

**Repeated-failure suppression:** After a recognized bank failure displays the frozen solution, record only the canonical question ID, source hash, and failure category in per-question `sessionStorage`. Check the marker after validated pre-generated and browser-cache lookups, but before streaming. A matching marker reuses the frozen fallback; a stale hash is removed, and a verified pre-generated, cached, or streamed lesson clears the marker. The marker expires with the browser tab session and never applies to another question or the non-bank/OCR path.

**Why:** The failed generation is deliberately not cached, but retrying it on every visit would repeatedly cost students 30–50 seconds without improving the frozen fallback.

**How to apply:** Keep this as a small session marker, not a lesson cache. Store no question text or generated content; use only the four confirmed failure categories, and keep pre-generated/verified cache precedence.

## Frozen-answer integrity and telemetry

- Compare generated final answers conservatively: normalized text, explicit multiple-choice labels, exact bounded rational/scientific values, complete labeled multipart answers, and the restricted exact integer-polynomial subset can be verified. Unsupported algebra, unit conversions, or prose differences stay indeterminate.
- A cache or pre-generated lesson is reusable only when its source hash matches the active frozen question and its answer is deterministically verified.
- The API suppresses partial bank lesson SSE sections until the answer passes validation. A mismatch or indeterminate result is not cached; the student receives the frozen bank solution with a distinct notice.
- Performance logs record path, outcome, and elapsed time only; do not include student data, question IDs, question text, answers, or credentials.

**Why:** A Gold Standard answer is the source of truth; generated and cached lessons must not be presented as verified when comparison is uncertain.

**How to apply:** Keep future changes to bank generation, caches, pre-generated assets, or telemetry behind these same source-hash and answer-integrity checks.

Format inventories describe comparator coverage, not academic correctness. A partial or exact-only result means some alternate representations cannot be proven; it does not show the frozen answer is wrong.

**Why:** The offline inventory found many prose/symbolic answers outside the safe equivalence subset, and no answer-content review is implied by that classification.

**How to apply:** Keep unsupported or ambiguous generated answers unverified. Expand comparison only with deterministic positive and negative fixtures; do not relax cache or delivery guards based on format counts.

**Why:**
Founder explicitly rejected P0-D first attempt (manually reinterpreting bank fields into TeachingLesson). Required architecture: frozen question → ONE streaming AI call grounded in frozen answer → one lesson → all 3 modes. No quality cycles. Cache by questionId.
