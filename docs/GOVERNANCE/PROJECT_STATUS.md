# PROJECT_STATUS.md

**Document type:** Current-state snapshot — per-class, per-subject coverage, gateway registration, and launch readiness.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-08
**Source:** `GATEWAY_FIX_VERIFICATION.md`, `CLASS9_SCIENCE_LAUNCH_READINESS.md`, direct repository inspection.

---

## Overall launch readiness

| Subject group | Status | Blockers |
|---|---|---|
| Class 6–8 Mathematics | READY (with warnings) | 15 pre-existing content-quality warnings (difficulty distribution, under-count floors on isolated chapters) — no failures |
| Class 9 Mathematics | READY (with warnings) | Same 15-warning baseline; Euclid's Geometry gap-fix applied (GC-01) |
| Class 9 Physics | PARTIAL | Gravitation is a non-exam chapter with no disclaimer; Work/Energy missing Simple Machines sub-topic |
| Class 9 Chemistry | BLOCKED | 0 of 3 official exam chapters have content; all 75 authored questions are in a non-exam chapter |
| Class 9 Biology | BLOCKED | Zero content, zero wiring; subject is live-selectable in UI with empty result |
| Class 9 Economics | OUT OF SCOPE | Content exists and passes gateway — but subject is outside approved scope |
| Class 9 Science (unified) | BLOCKED | Underlying Chemistry and Biology are blocked; Physics is partial |

---

## Class 6 — Mathematics

| Metric | Value |
|---|---|
| Gateway registration | `6-Mathematics` — registered |
| Gateway result | WARN (difficulty distribution on some chapters; no failures) |
| Chapter count (gateway) | Part of 67-chapter total audited |
| Chapter count (product) | 14 chapters |
| Question count | 1,090 questions |
| Format | V2 (via `v2adapter.ts`) |
| Source files | `class6-maths.ts` → `question-bank/questions/mathematics/class6/` |
| Launch readiness | READY (warnings are non-blocking for launch) |

---

## Class 7 — Mathematics

| Metric | Value |
|---|---|
| Gateway registration | `7-Mathematics` — registered |
| Gateway result | WARN (difficulty distribution; Practical Geometry now `cbseDeleted`, Visualising Solid Shapes pending) |
| Chapter count (product) | 15 chapters (13 ch + Ch10 `cbseDeleted` + Ch15 pending) |
| Question count | 979 questions |
| Format | V2 (via `v2adapter.ts`) |
| Launch readiness | READY (warnings are non-blocking) |

**Open items:**
- Ch10 "Practical Geometry" — `cbseDeleted: true` applied (GC-04, done 2026-07-08). Confirmed deleted by NCERT rationalization booklet.
- Ch15 "Visualising Solid Shapes" — GC-05 status: **BLOCKED pending official evidence**. No `cbseDeleted` flag added. Gateway carries the chapter as active.

---

## Class 8 — Mathematics

| Metric | Value |
|---|---|
| Gateway registration | `8-Mathematics` — registered |
| Gateway result | WARN (difficulty distribution on 5 chapters; no failures) |
| Chapter count (product) | 13 chapters (original 14 minus Ch4 Practical Geometry + Ch16 Playing with Numbers, both confirmed deleted) |
| Question count | 979 questions |
| Format | V2 (via `v2adapter.ts`) |
| Launch readiness | READY (warnings are non-blocking) |

---

## Class 9 — Mathematics

| Metric | Value |
|---|---|
| Gateway registration | `9-Mathematics` — registered, min floor 20 questions/chapter |
| Gateway result | WARN (Triangles 19q, Quadrilaterals 17q, Probability 19q below 20q floor; chapter-size spread warning) |
| Chapter count (product) | 15 chapters |
| Question count | 584 (status report count) / 499 (gateway count — pre-existing discrepancy, under investigation) |
| Format | V1 (15 separate `class9-maths-ch{N}.ts` files) |
| Launch readiness | READY (warnings are non-blocking; under-count chapters identified) |

**Open items:**
- Ch5 "Introduction to Euclid's Geometry" — `cbseDeleted: true` flag removed (GC-01, done 2026-07-08). Chapter is now treated as fully active and exam-included. No warning triggered (question count already sufficient).
- Ch11 "Constructions" — `cbseDeleted: true` retained. GC-02 (no action required).
- Triangles, Quadrilaterals, Probability all below 20-question floor — content gap, not a blocker.

---

## Class 9 — Physics (internal Science domain)

| Metric | Value |
|---|---|
| Gateway registration | `9-Physics` — registered, min floor 15 questions/chapter |
| Gateway result | PASS — clean (0 failures, 0 warnings) |
| Chapter count (repo) | 5 chapters |
| Chapter count (official 2026-27) | 4 assessed chapters |
| Question count | 125 (25 per chapter, uniform) |
| Format | V1 (5 separate `class9-physics-ch{N}.ts` files) |
| Launch readiness | PARTIAL |

**Chapter detail:**

| Repo chapter | Official match | Questions | Exam-relevant |
|---|---|---|---|
| Motion | Ch4 Motion | 25 | YES (full match) |
| Force and Laws of Motion | Ch6 Force and Laws of Motion | 25 | YES (full match) |
| Gravitation | — (no official 2026-27 chapter) | 25 | NO — gateway has no `cbseDeleted` flag yet |
| Work and Energy | Ch7 Work, Energy and Simple Machines | 25 | PARTIAL — Simple Machines sub-topic missing |
| Sound | Ch10 Sound | 25 | YES (full match) |

**Open items:**
- Gravitation: product decision pending — label as enrichment/non-exam or deprecate. No `cbseDeleted` flag in gateway yet.
- Work and Energy: Simple Machines content (levers, pulleys, inclined plane, mechanical advantage) not authored.
- Uniform circular motion coverage in "Motion" chapter: not confirmed present in topic list — content review needed.

---

## Class 9 — Chemistry (internal Science domain)

| Metric | Value |
|---|---|
| Gateway registration | **NOT REGISTERED** — no `9-Chemistry` in `EXPECTED` map |
| Gateway result | Not audited |
| Chapter count (repo) | 4 files (1 authored, 3 empty scaffolds) |
| Question count | 75 (all in Ch01 — a non-exam chapter) |
| Format | Chemistry adapter pattern (`class9-chemistry.ts` → `question-bank/questions/chemistry/class9/`) |
| Launch readiness | **BLOCKED** |

**Chapter detail:**

| Repo file | Chapter name | Questions | Exam-relevant (2026-27) |
|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | 75 | NO — Ch1 is outside all assessed units |
| `ch02-is-matter-around-us-pure.ts` | Is Matter Around Us Pure? | 0 | YES — maps to Ch5 (renamed, new scope) |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules | 0 | YES — maps to Ch9 |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom | 0 | YES — maps to Ch8 |

---

## Class 9 — Biology (internal Science domain)

| Metric | Value |
|---|---|
| Gateway registration | **NOT REGISTERED** — no `9-Biology` in `EXPECTED` map |
| Gateway result | Not audited |
| Chapter count (repo) | 0 |
| Question count | 0 |
| UI status | **Live dead-end** — selectable in Practice UI, returns empty |
| Launch readiness | **BLOCKED** |

**Chapter detail:**

| Official 2026-27 chapter | Repo status | Questions |
|---|---|---|
| Ch2 Cell — The Fundamental Unit of Life | No file | 0 |
| Ch3 Tissues | No file | 0 |
| Ch11 Reproduction in Plants and Animals | No file | 0 |
| Ch12 Diversity in Living Organisms | No file | 0 |

---

## Class 9 — Economics (out of scope)

| Metric | Value |
|---|---|
| Gateway registration | `9-Economics` — registered, min floor 15 questions/chapter |
| Gateway result | PASS — clean |
| Chapter count | 4 |
| Question count | ~100 (estimated from gateway report) |
| Scope status | **OUT OF SCOPE** per 2026-07-08 governance freeze |

Content exists and functions correctly. Not to be marketed or counted as a coverage milestone until scope is revisited.

---

## Class 9 — Computer Applications, Information Technology, AI

| Subject | Gateway registration | Content | Status |
|---|---|---|---|
| Computer Applications (CA) | Not registered | None | Not yet started |
| Information Technology (IT) | Not registered | None | Not yet started |
| Artificial Intelligence (AI) | Not registered | None | Not yet started |

These are in the approved scope (priority 3–5) but authoring has not begun. No blocker other than prioritization.

---

## Classes 6–8 — Science, Computational Thinking and AI

| Subject | Gateway registration | Content | Status |
|---|---|---|---|
| Science (Classes 6–8) | Not registered | None | Not yet started |
| Computational Thinking and AI (Classes 6–8) | Not registered | None | Not yet started |

Approved scope (priority 6 for CT+AI, Science is priority 2 across all classes). Not yet started.

---

## Curriculum gateway summary

| Gateway key | Registered | Min floor | Last result | Failures | Warnings |
|---|---|---|---|---|---|
| `6-Mathematics` | YES | — | WARN | 0 | 3 |
| `7-Mathematics` | YES | — | WARN | 0 | 3 |
| `8-Mathematics` | YES | — | WARN | 0 | 5 |
| `9-Mathematics` | YES | 20 | WARN | 0 | 4 |
| `9-Economics` | YES | 15 | PASS | 0 | 0 |
| `9-Physics` | YES | 15 | PASS | 0 | 0 |
| `9-Chemistry` | **NO** | — | Not audited | — | — |
| `9-Biology` | **NO** | — | Not audited | — | — |

**Overall gateway: PASS — 0 failures, 15 warnings.** Coverage is incomplete: Chemistry and Biology are unregistered.
