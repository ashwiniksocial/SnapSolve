---
name: AI Personalization Flow
description: How student context is built client-side and injected into the AI prompt without being cached globally
---

## Flow
1. `solveWithOpenAI` in `openaiSolver.ts` calls `buildStudentContext(subject)` (no topic — unknown before AI responds)
2. `studentContext` string is sent as a field in the POST body to `/api/solveQuestion`
3. Backend accepts `studentContext?: string` in request body, slices to 2000 chars (guard)
4. If `ctx` is present: **skip server-side cache** (personalised responses must not be cached globally)
5. `callOpenAI(subj, q, ctx)` injects context into the user message: `${ctx}\n\nSubject: ${subject}\n\nQuestion:\n${question}`
6. If no `ctx`: use server-side cache as before

## Why cache is bypassed for personalised calls
Server cache key = subject+question hash. If a personalised response were cached, all future students asking the same question would receive one student's personalised explanation. Bypass is the only correct behaviour.

**How to apply:** Any future change to caching logic must preserve this invariant: `if (!ctx) setCached(...)` — the guard must stay.
