---
name: Mode-specific lesson generation
description: How LessonMode drives schema selection, pipeline skipping, and token budgets for each reading mode.
---

## The rule
Each reading mode generates only the sections it actually renders — smaller input + output = faster response.

**Why:** Full pipeline (Plan+Draft+Quality) took ~103 s cold. Reducing scope: Standard skips Quality → ~43 s, Compact skips Blueprint + Quality → ~7 s.

## Mode → sections
- **basic (Detailed)**: All sections — uses `SYSTEM_PROMPTS[subject]` (which embeds full `JSON_SCHEMA`), depth override, Blueprint + Quality pipeline. max_tokens=4000.
- **standard (Standard)**: keyConcepts, questionTranslation, guidedReasoning, finalAnswer, practiceQuestion — uses `getSubjectPreamble(subject) + JSON_SCHEMA_STANDARD`, Blueprint but NO Quality. max_tokens=2000.
- **advanced (Compact)**: guidedReasoning, finalAnswer, rememberThese — uses `getSubjectPreamble(subject) + JSON_SCHEMA_COMPACT`, NO Blueprint, NO Quality. max_tokens=1200.

## `getSubjectPreamble(subject)`
Strips `JSON_SCHEMA` (the full Detailed schema) from the end of `SYSTEM_PROMPTS[subject]` so a mode-specific schema can be appended instead. Works because each subject prompt ends with exactly the trimmed `JSON_SCHEMA` string.

## Missing fields ≠ broken
`parseLessonResponse` always fills ALL fields with defaults. A Standard/Compact response will have empty `commonMistakes`, `simplerExample`, etc. — that is correct and expected. The frontend `show.*` flags gate rendering based on mode AND data presence.

## Cache keys include mode
Both server (`makeCacheKey`) and client (`hashKey`) prefix the cache key with mode. Cache store key is `studyai-ai-cache-v3`. Different modes for the same question are cached independently.

## How to apply
When adding a new section: add it to the appropriate mode schemas and update `show.*` in `TeachingLayout.tsx`. Never put a new section only in Standard/Compact — it won't be in `JSON_SCHEMA` so Detailed mode won't generate it either.
