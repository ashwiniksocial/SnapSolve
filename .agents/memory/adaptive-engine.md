---
name: Adaptive Learning Engine design
description: Architecture decisions for useAdaptiveLearning — why it reads localStorage directly instead of composing hooks.
---

## Rule
`useAdaptiveLearning` reads the three data-source keys (`studyai-progress-v2`, `studyai-mistakes-v1`, `studyai-revision-v1`) directly from localStorage via `safeRead()`. It does NOT compose or call `useProgress`, `useMistakeJournal`, or `useRevisionPlanner`.

## Why
Composing those hooks inside `useAdaptiveLearning` would require every consumer to also mount all three hooks in its component tree, creating prop-drilling or context-wrapping complexity. Since all three sibling hooks call `persist()` synchronously on every write, localStorage is always up to date by the time the engine reads it.

## How to apply
- When adding new data sources: extend `safeRead` calls in `computeAll()` in `useAdaptiveLearning.ts`; do not import the sibling hooks.
- `refresh()` must be called explicitly after a practice session for same-day recommendations to reflect new data (daily cache would otherwise serve stale recs).
- `generateAndCache()` writes to `studyai-adaptive-v1`; cache is keyed by date (YYYY-MM-DD) and regenerated automatically on day change.

## Minimum data threshold
Topics with fewer than 2 attempts are excluded from profiles to avoid noisy recommendations.
