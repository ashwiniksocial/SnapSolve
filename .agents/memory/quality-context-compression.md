---
name: Quality context compression
description: Benchmark evidence and constraints for reducing Detailed quality-pipeline context without weakening lessons.
---

Keep the full TeachingLesson contract and every quality check, but send lesson JSON without formatting whitespace, keep reviewer findings concise, and give the improver only actionable high-priority issue fields.

**Why:** A controlled one-request A/B on the same personalized Detailed path reduced API latency by 12%, total tokens by 7%, and normalized uncached cost by 10%, while preserving correctness and improving the recorded final review score. The full rewrite remained the largest quality-stage call at about 15.6 seconds.

**How to apply:** Preserve the two-review/one-improvement sequence and early-exit behavior. For further material latency work, evaluate avoiding a full rewrite when only isolated sections fail; do not reduce student-facing lesson detail merely to shorten output.