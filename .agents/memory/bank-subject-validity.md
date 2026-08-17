---
name: Bank Subject Validity Rule
description: "Earth Science" bank questions were rejected by the server's SUBJECTS guard, causing all 86 questions to fall back to the legacy renderer. Fix: add to SUBJECTS + SYSTEM_PROMPTS.
---

## Rule

Every subject value used in bank question data files must appear in the server's `SUBJECTS` array in `artifacts/api-server/src/routes/solveQuestion.ts`.

## The Bug

`"Earth Science"` was used in 86 questions in `class9-science-placeholders.ts` but was absent from `SUBJECTS`. The stream route's subject validation (line ~1774) returned HTTP 400 `invalid_subject` for every one of those questions. `callBankStream` threw `backend_400`, Solution.tsx caught it, and rendered the minimal legacy bank fallback (no `lesson` field → LegacyRenderer, ~2 sections).

## The Fix (applied 2026-08-18)

1. Added `"Earth Science"` to the `SUBJECTS` const array in `solveQuestion.ts`
2. Added `"Earth Science"` entry to `SYSTEM_PROMPTS` — a dedicated tutor prompt covering natural resources, atmosphere, soil, water, climate, biosphere (India-anchored analogies)

**Why:** The fix must be in SUBJECTS + SYSTEM_PROMPTS together. SUBJECTS is a `const` array; `Subject` type is derived from it; `SYSTEM_PROMPTS` is typed as `Record<Subject, string>` which requires all Subject members. Adding to SUBJECTS without SYSTEM_PROMPTS causes a TypeScript error.

## How to Apply

When adding a new subject to bank question data files, always:
1. Add the subject string to `SUBJECTS` in `solveQuestion.ts`
2. Add a matching entry to `SYSTEM_PROMPTS` with a full tutor persona prompt ending in `${JSON_SCHEMA}`
3. Run `npx tsc --noEmit` in `artifacts/api-server` to confirm no type errors
