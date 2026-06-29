# Gold Standard Lesson Library

**Developer-only reference. Never sent to students. No runtime behaviour.**

---

## Purpose

This library defines what a SnapSolve lesson should look like at its best.
Each lesson record is a **teaching quality benchmark** — not a pre-written lesson,
but a precise specification of what an ideal lesson on that concept must contain,
in what order, and why.

Developers use this library to:
- Understand what the Quality Pipeline is trying to produce
- Write test cases that verify generated lessons meet the benchmark
- Train reviewers by comparing generated lessons against these records
- Identify gaps in subject coverage for future improvements

---

## Scope

| Dimension | Supported values |
|---|---|
| Classes | 6, 7, 8, 9 |
| Boards | CBSE, ICSE (most lessons apply to Both) |
| Subjects | Mathematics, Physics, Chemistry, Biology, Computer Science, Economics |

---

## Folder Structure

```
gold-standard/
├── README.md             ← this file
├── types.ts              ← GoldStandardLesson type + CMFCompliance + LessonOutlineSection
├── index.ts              ← barrel export + ALL_GOLD_STANDARDS array + getLibrarySummary()
├── mathematics.ts        ← 4 lessons (fractions, linear equations, Pythagoras, quadratics)
├── physics.ts            ← 3 lessons (Newton's 2nd Law, pressure in fluids, Ohm's Law)
├── chemistry.ts          ← 3 lessons (balancing equations, acids/bases, atomic structure)
├── biology.ts            ← 2 lessons (photosynthesis, cell structure)
├── computerScience.ts    ← 2 lessons (for loops, functions)
└── economics.ts          ← 2 lessons (demand/supply/equilibrium, money/barter)
```

Total: **16 gold standard lessons** across 6 subjects.

---

## Lesson Record Structure

Each `GoldStandardLesson` contains:

| Field | Purpose |
|---|---|
| `id` | Unique kebab-case identifier |
| `concept` | The specific concept this lesson benchmarks |
| `class` | CBSE/ICSE class level (6–9) |
| `board` | CBSE, ICSE, or Both |
| `subject` | One of the six supported subjects |
| `whyGoldStandard` | A precise statement of WHY this lesson exemplifies gold-standard teaching |
| `teachingTechniques` | Specific techniques demonstrated, named and described |
| `expectedQualityCharacteristics` | Observable hallmarks — what a reviewer should find when reading |
| `commonNonGoldFailures` | The errors that non-gold lessons make on this concept |
| `cmfCompliance` | 15-point CMF compliance checklist — all `true` for every gold standard lesson |
| `lessonOutline` | Ordered sections, each with `mustContain` and `typicalFailures` |

---

## CMF Compliance

Every gold standard lesson must satisfy all 15 rules of the Concept Mastery Framework:

| Rule | Key requirement |
|---|---|
| CMF-1 | WHY before WHAT — concept opens with the problem it solves |
| CMF-2 | Historical/practical problem stated |
| CMF-3 | Intuition before formalism |
| CMF-4 | Six questions answered: What/Why/How/When/Where/Why not |
| CMF-5 | Confusions pre-empted before student reaches them |
| CMF-6 | Next student question answered before it is asked |
| CMF-7 | No skipped steps; "obviously" and "clearly" absent |
| CMF-8 | Formula derivation present |
| CMF-9 | Theorem WHY explained (not just HOW) |
| CMF-10 | Scientific law: intuition before equation |
| CMF-11 | Biology: every process as a flowing story |
| CMF-12 | CS: algorithm in plain English before code |
| CMF-13 | Economics: everyday situation before terminology |
| CMF-14 | Three explanations for difficult concepts: visual, logical, real-life |
| CMF-15 | Younger Sibling Test: student can explain to a younger sibling |

---

## How to Add a New Lesson

1. Choose the correct subject file (or create a new one for a new subject).
2. Add a new `GoldStandardLesson` object to the subject's array.
3. Fill in all required fields — especially `whyGoldStandard` (must be specific, not vague praise).
4. Set all 15 `cmfCompliance` fields to `true` and verify each one is genuinely satisfied.
5. Write `lessonOutline` sections that capture the critical structure — with `mustContain` items and `typicalFailures`.
6. Export the new lesson from `index.ts` if you added a new subject file.

**Do not add a lesson that you cannot justify against the `whyGoldStandard` field.**
If you cannot write a specific reason why this lesson exemplifies great teaching,
the lesson is not ready to be a benchmark.

---

## How to Use This Library in Future Work

This library is currently **reference only** — it is not integrated into generation or the Quality Pipeline.

Future uses may include:
- **Benchmark testing**: generate a lesson on a benchmarked concept and compare its `lessonOutline` sections against `mustContain` items
- **Reviewer training**: show the reviewer what a gold-standard lesson structure looks like before asking it to score a generated lesson
- **Few-shot examples**: inject the `lessonOutline` of a gold-standard lesson as a structural hint in the generation prompt (no generated text — only the structure)
- **Regression detection**: if a generated lesson on `maths-pythagoras-theorem-class8` fails to mention the area-based proof, flag it

None of these integrations exist yet. The library is the permanent benchmark — the integration work comes later.

---

## Current Coverage

| Subject | Lessons | Concepts covered |
|---|---|---|
| Mathematics | 4 | Fractions (division), Linear equations, Pythagoras, Quadratics |
| Physics | 3 | Newton's 2nd Law, Pressure in fluids, Ohm's Law |
| Chemistry | 3 | Balancing equations, Acids/bases, Atomic structure |
| Biology | 2 | Photosynthesis, Cell structure |
| Computer Science | 2 | For loops, Functions |
| Economics | 2 | Demand/supply/equilibrium, Money and barter |
| **Total** | **16** | |

---

*This library is maintained by the SnapSolve engineering team.*
*Last updated: initial creation — 16 lessons across 6 subjects.*
