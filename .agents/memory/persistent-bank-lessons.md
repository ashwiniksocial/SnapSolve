---
name: Persistent bank lesson assets
description: Rules for serving selected bank questions instantly from the derived static lesson asset.
---

Derived lessons are a performance asset, not an academic source. Each one must be keyed by the bank question ID, source-hashed from the exact frozen grounding fields, and accepted only when its normalized Detailed lesson is complete and its final answer exactly matches the bank answer.

**Why:** Browser storage and server memory are transient. A bundled asset survives local-storage clearing, API restarts, and separate browser sessions without adding infrastructure, while the source hash makes changes to the authoritative bank fail safe rather than serving stale instruction.

**How to apply:** Resolve a valid static lesson before browser/server caches and the existing bank stream. Missing, malformed, stale, or answer-mismatched records must retain the normal streamed bank fallback. Optional renderer sections must be either fully populated or normalized empty so they stay hidden; never persist a lesson that displays blank content.