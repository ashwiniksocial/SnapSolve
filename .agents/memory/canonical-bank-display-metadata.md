---
name: Canonical Bank Display Metadata
description: Rule for keeping Practice, Solution, and readiness metadata aligned with an active bank question.
---

## Rule
For Practice-originated bank questions, the active canonical question is the sole authority for student-facing subject, chapter, topic, type, difficulty, question text, and display numbering. Generated, streamed, and cached lessons may supply teaching content only.

**Why:** A streamed lesson can omit difficulty and the client adapter then defaults it to Medium. That model-derived field must never alter a canonical Practice label or Solution badge.

**How to apply:** Resolve bank identity from its question ID first. Apply canonical metadata immediately before rendering any Solution response (including partial streams, caches, generated assets, and fallback lessons). Keep the full-bank integrity audit exercising the Practice, Solution, and readiness resolver paths with non-canonical lesson metadata.