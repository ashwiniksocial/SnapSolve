---
name: Class 6 Maths Question Bank
description: Authoring-only static asset in question-bank/questions/mathematics/class6/; quality gate results and known structural constraints.
---

## Status
Complete — 14 chapters, 1090 questions, all registered in `question-bank/chapterRegistry.ts`.

## Quality gate (final state)
- TF_PREFIX violations: **0**
- MISSING_CE violations: **0**
- DUP_TRIPLE violations ch01–ch12: **0**
- DUP_TRIPLE violations ch13: **7** (irreducible — greedy sub-optimal; symmetry-in-figures concept saturates all 30 slots)
- DUP_TRIPLE violations ch14: **17** (structurally irreducible — 2 concepts × 6 blooms × 5 formats = 60 max slots for 75 questions; minimum 15 unavoidable)

**Why:** ch13 and ch14 were written with very few concept nodes (3 and 2 respectively) relative to question count (75 each). The only fix would be adding new concept nodes or regenerating questions — both out of scope.

## Key constraints
- These files are developer-only authoring assets — NOT imported by the runtime app (`artifacts/homework-hero/src/data/questions/` is class9 only).
- No barrel index exists in `question-bank/questions/`; chapter files are standalone.
- Fixer logic: group by (concept0, format) → assign unique bloomsLevels cycling through 6 levels → if all 6 exhausted, change questionFormat (never to TrueOrFalse unless answer starts "True."/"False.").

## Audit script
`/tmp/audit_class6.py` — checks TF_PREFIX, MISSING_CE, DUP_TRIPLE across all 14 chapters.
