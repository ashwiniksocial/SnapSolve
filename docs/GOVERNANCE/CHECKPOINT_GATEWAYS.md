# CHECKPOINT_GATEWAYS.md

**Document type:** Curriculum gateway state record — what is registered, what each entry means, current pass/fail/warn status per subject, and what is not yet covered.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-08
**Source:** `scripts/src/curriculumGateway.ts` (direct inspection), `GATEWAY_FIX_VERIFICATION.md` (last verified run).

---

## What the gateway does

The curriculum gateway (`scripts/src/curriculumGateway.ts`) is a CI-style script that reads the live question bank and validates it against the `EXPECTED` map — the authoritative list of chapter names and exam-inclusion status for each registered class+subject.

**Run command:** `pnpm --filter @workspace/scripts run curriculum-check`

**FAIL conditions (exit 1 — blocks any release pipeline):**
- F1: Duplicate chapter IDs within the same class+subject
- F2: Duplicate chapter names within the same class+subject
- F3: Zero-question chapters (for active, non-`cbseDeleted` chapters)
- F6: Chapter name mismatch against `EXPECTED` map
- F7: Missing expected chapter (a chapter in `EXPECTED` not found in the bank)

**WARN conditions (reported, non-blocking):**
- W1: Question count below minimum floor for the subject
- W3: Chapter question count is more than 3× the smallest chapter in the same class+subject (size-spread imbalance)
- Difficulty distribution warnings (too high a percentage of Hard questions in a chapter)

**`cbseDeleted: true` flag:** When set on a chapter entry in `EXPECTED`, that chapter is treated as a non-exam chapter — it is exempt from minimum-question floors and F3/W1 checks. It is still validated for name match and presence.

---

## EXPECTED map — current state

### `6-Mathematics`

- Registration: ACTIVE
- Minimum floor: default (no custom floor set for Class 6)
- Format: V2 (read via adapter from `question-bank/questions/mathematics/class6/`)
- Chapters: 14 CBSE-active chapters
- `cbseDeleted` entries: none recorded as of last audit
- Last gateway result: WARN — 3 difficulty-distribution warnings; 0 failures

---

### `7-Mathematics`

- Registration: ACTIVE
- Minimum floor: 50 questions/chapter (V2 subject convention)
- Format: V2
- Chapters: 15 total (13 active + 1 `cbseDeleted` + 1 pending)

| Chapter | Status | Notes |
|---|---|---|
| Ch1–Ch9, Ch11–Ch14 | Active | No flags |
| Ch10 Practical Geometry | `cbseDeleted: true` | Applied GC-04 (2026-07-08). NCERT rationalization: pages 193–204 dropped in full. |
| Ch15 Visualising Solid Shapes | **Active — pending review** | Claim that it is deleted is **unverified**. No `cbseDeleted` flag until official evidence provided. (GC-05 blocked) |

- Last gateway result: WARN — 3 difficulty-distribution warnings; 0 failures

---

### `8-Mathematics`

- Registration: ACTIVE
- Minimum floor: default
- Format: V2
- Chapters: 14 CBSE-active chapters. Ch4 Practical Geometry and Ch16 Playing with Numbers confirmed deleted by NCERT rationalization — `cbseDeleted: true` set on both.
- Last gateway result: WARN — 5 difficulty-distribution warnings; 0 failures

---

### `9-Mathematics`

- Registration: ACTIVE
- Minimum floor: **20 questions/chapter**
- Format: V1 (15 separate `class9-maths-ch{N}.ts` files)
- Chapters: 15 total

| Chapter | Status | Notes |
|---|---|---|
| Ch1 Number Systems | Active | |
| Ch2 Polynomials | Active | |
| Ch3 Coordinate Geometry | Active | |
| Ch4 Linear Equations in Two Variables | Active | |
| Ch5 Introduction to Euclid's Geometry | **Active** | `cbseDeleted: true` removed (GC-01, 2026-07-08). Now treated as exam-included. Confirmed active by CBSE 2022-23 and 2026-27 syllabi. |
| Ch6 Lines and Angles | Active | |
| Ch7 Triangles | Active | 19q — below 20q floor → W1 warning |
| Ch8 Quadrilaterals | Active | 17q — below 20q floor → W1 warning |
| Ch9 Circles | Active | |
| Ch10 Heron's Formula | Active | |
| Ch11 Constructions | `cbseDeleted: true` | Confirmed deleted by CBSE. No floor check applied. (GC-02: correct as-is) |
| Ch12 Surface Areas and Volumes | Active | |
| Ch13 Statistics | Active | |
| Ch14 Probability | Active | 19q — below 20q floor → W1 warning |
| Ch15 [15th chapter] | Active | Chapter-size spread warning (Coordinate Geometry 56q vs Quadrilaterals 17q → W3) |

- Last gateway result: WARN — 4 warnings (3× W1 under-count + 1× W3 spread); 0 failures

---

### `9-Economics`

- Registration: ACTIVE
- Minimum floor: **15 questions/chapter**
- Format: V1 (4 separate `class9-economics-ch{N}.ts` files)
- Chapters: 4
- Last gateway result: PASS — clean; 0 failures, 0 warnings
- **Scope note:** Economics is **out of approved scope** (DEC-010). Gateway registration is retained to prevent F3/F7 failures if the content remains in the bank, but Economics must not be treated as a launch-ready subject.

---

### `9-Physics`

- Registration: ACTIVE
- Minimum floor: **15 questions/chapter**
- Format: V1 (5 separate `class9-physics-ch{N}.ts` files)
- Chapters: 5

| Chapter | Gateway flag | Official 2026-27 status | Notes |
|---|---|---|---|
| Motion | Active | Ch4 — YES | Full match |
| Force and Laws of Motion | Active | Ch6 — YES | Full match |
| Gravitation | Active (no `cbseDeleted`) | **No official chapter** | Product decision pending — not flagged as non-exam yet; content is misleadingly presented as exam-relevant |
| Work and Energy | Active | Ch7 — PARTIAL | Simple Machines sub-topic missing from content |
| Sound | Active | Ch10 — YES | Full match |

- Last gateway result: PASS — clean; 0 failures, 0 warnings
- **Known gap:** Gravitation should receive `cbseDeleted: true` once the product decision to relabel it as non-exam/enrichment is made. Currently the gateway passes because the chapter has content — it does not check curriculum relevance, only question counts and name matches.

---

### `9-Chemistry` — NOT REGISTERED

- Registration: **MISSING**
- Gateway coverage: **NONE** — no validation runs for Chemistry at any class
- Files in repo: `question-bank/questions/chemistry/class9/ch0{1-4}-*.ts` (1 authored, 3 empty scaffolds)
- Question count: 75 (all in Ch01, a non-exam chapter)
- Action required: Register `9-Chemistry` in `EXPECTED` map with the confirmed 2026-27 exam chapters before authoring begins

**Proposed `9-Chemistry` EXPECTED entries (per 2026-27 CBSE Science PDF):**

| Chapter | Official name | Official Ch# | Notes |
|---|---|---|---|
| Exploring Mixtures and their Separation | (formerly "Is Matter Around Us Pure?") | Ch5 | Repo scaffold name is stale — must be renamed |
| Structure of an Atom | Structure of an Atom | Ch8 | Name match |
| Atoms and Molecules | Atoms and Molecules | Ch9 | Name match |
| Matter in Our Surroundings | Matter in Our Surroundings | Ch1 | `cbseDeleted: true` — non-exam, content already authored |

---

### `9-Biology` — NOT REGISTERED

- Registration: **MISSING**
- Gateway coverage: **NONE**
- Files in repo: zero
- Question count: 0
- Action required: Register `9-Biology` in `EXPECTED` map, create scaffold files, remove Biology from UI `ALL_SUBJECTS` or gate with Coming Soon state

**Proposed `9-Biology` EXPECTED entries (per 2026-27 CBSE Science PDF):**

| Chapter | Official name | Official Ch# |
|---|---|---|
| The Fundamental Unit of Life | Cell | Ch2 |
| Tissues | Tissues | Ch3 |
| Reproduction in Plants and Animals | Reproduction | Ch11 |
| Diversity in Living Organisms | Diversity | Ch12 |

---

## Gateway coverage gaps summary

| Class | Subject | Gap type |
|---|---|---|
| 9 | Chemistry | Entire subject unregistered |
| 9 | Biology | Entire subject unregistered |
| 6, 7, 8 | Science | Entire subject unregistered |
| 6, 7, 8 | Computational Thinking and AI | Entire subject unregistered |
| 9 | Computer Applications | Entire subject unregistered |
| 9 | Information Technology | Entire subject unregistered |
| 9 | Artificial Intelligence | Entire subject unregistered |
| 9 | Physics | Gravitation entry missing `cbseDeleted: true` despite confirmed non-exam status |

---

## Last verified run

**Date:** 2026-07-08
**Command:** `pnpm --filter @workspace/scripts run curriculum-check`

```
CURRICULUM QUALITY REPORT
Classes audited:  6, 7, 8, 9
Subjects audited: Mathematics, Economics, Physics
Chapters audited: 67
Total questions:  3,997

FAILURES (0)   [PASS] No failures detected.

WARNINGS (15)
  6-Mathematics  — 3 warnings (difficulty distribution)
  7-Mathematics  — 3 warnings (difficulty distribution)
  8-Mathematics  — 5 warnings (difficulty distribution)
  9-Mathematics  — 4 warnings (W1 under-count: Triangles 19q, Quadrilaterals 17q,
                               Probability 19q; W3 spread: Coordinate Geometry vs Quadrilaterals)
  9-Economics    — 0 warnings  [PASS]
  9-Physics      — 0 warnings  [PASS]

CURRICULUM GATEWAY: PASS — 15 warning(s), 0 failures
```

**Important:** This PASS result covers only 3 of the 7 Class 9 subjects in the approved scope (Mathematics, Economics, Physics). Chemistry and Biology are unregistered and receive no validation whatsoever. The PASS label does not indicate full Science readiness.
