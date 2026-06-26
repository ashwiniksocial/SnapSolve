---
name: Dev Audit URL
description: How to reliably test LessonRenderer end-to-end without an OpenAI key or Playwright textarea quirks.
---

# Dev Audit URL — `/solution?audit=1`

## The rule
Navigate to `/solution?audit=1` to test the full TeachingLesson → LessonRenderer pipeline without needing `OPENAI_API_KEY` or going through the Scan page.

**Why:** Playwright's `page.fill()` / `page.type()` with bracket chars (`[`, `]`) does not reliably trigger React's synthetic `onChange` on textareas. Typing `[AUDIT]` in the Scan page Type tab worked at the DOM level but the React state (`typedQ`) was never updated, so `handleTypedSolve` fired with the old session question instead of `[AUDIT]`.

**How to apply:**
1. Open any browser / Playwright context.
2. Navigate to `/solution?audit=1`.
3. Solution.tsx checks `URLSearchParams("audit") === "1"`, calls `GET /api/devLesson`, maps via `toAIResponse()`, and renders with LessonRenderer.
4. Confirm in browser console:
   - `[AUDIT-PAGE] audit=1 detected → calling GET /api/devLesson`
   - `[AUDIT-PAGE] fixture mapped: topic="Proof that √2 is Irrational" lesson=true steps=7`
   - `[PIPELINE:C1] RENDERER=LessonRenderer (new teaching pipeline)`

## Files touched
- `Solution.tsx` — audit branch in `runSolver` (reads `window.location.search`)
- `openaiSolver.ts` — `callDevLesson` and `toAIResponse` exported so Solution.tsx can import them
- `api-server/src/routes/devLesson.ts` — fixture endpoint (`GET /api/devLesson`)

## Min-length guard note
`[AUDIT]` is 7 chars; `MIN_QUESTION_CHARS = 10`. In `openaiSolver.ts` the `[AUDIT]` check was moved **above** the min-length guard so the string route test can still use `[AUDIT]` directly. The `?audit=1` approach sidesteps this entirely since Solution.tsx never calls `solveWithOpenAI()`.
