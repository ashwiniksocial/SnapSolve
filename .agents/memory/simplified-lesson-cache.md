---
name: Verified simpler lesson cache
description: Rules for reusing a student's previously verified simpler lesson.
---

Simpler lessons may be cached locally only after the generated lesson is complete, its canonical answer, question, topic, and difficulty match the frozen original, and its student-facing explanation materially differs from the source. Ignore only insignificant whitespace and Unicode normalization when comparing explanation text. Cache identity includes the exact question and support level; the source snapshot includes the original response content but excludes its transient response ID. Every reuse must compare the current source snapshot and rerun the same metadata, answer, and no-op checks. A source mismatch or unchanged explanation invalidates the stored rewrite; a cached rewrite never replaces or mutates the original lesson.

**Why:** A persisted AI-generated explanation must remain subordinate to the current authoritative lesson and answer; otherwise a changed source can make an old simplification misleading.

**How to apply:** Keep simplification persistence separate from the general AI lesson cache, and fail closed by discarding stale or unverifiable variants and generating a fresh one.
