---
name: Verified simpler lesson cache
description: Rules for reusing a student's previously verified simpler lesson.
---

Simpler lessons may be cached locally only after the generated lesson is complete, its canonical answer, question, topic, and difficulty match the frozen original, and its student-facing explanation materially differs from the source. Ignore only insignificant whitespace and Unicode normalization when comparing explanation text. Cache identity includes the exact question and support level; the source snapshot includes the original response content but excludes its transient response ID. Every reuse must compare the current source snapshot and rerun the same metadata, answer, and no-op checks. A source mismatch or unchanged explanation invalidates the stored rewrite; a cached rewrite never replaces or mutates the original lesson.

The two support levels are separate output contracts: **Clearer** keeps the source's main-step count/order and includes an accessible worked example; **Very simple steps** adds prerequisites, has more short reasoning units than the source, and gives each unit a short guided checkpoint. Version-bump the existing cache when these contracts change so old same-style variants are not reused.

For the initial beta, Simplify is deferred: keep its student-facing UI gate disabled, but preserve its implementation, contracts, safeguards, and cached/history data.

**Why:** A persisted AI-generated explanation must remain subordinate to the current authoritative lesson and answer; otherwise a changed source can make an old simplification misleading.

**How to apply:** Keep simplification persistence separate from the general AI lesson cache. Fail closed by discarding stale, no-op, or wrong-level variants and show the original lesson with a visible error; never substitute one support level for the other. Do not re-enable the beta control or remove Simplify internals without a new scope decision.
