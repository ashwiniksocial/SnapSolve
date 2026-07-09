# CLASS9_CURRICULUM_BASELINE.md

**Status:** FROZEN — operational reference  
**Version:** 1.0  
**Date frozen:** 2026-07-09  
**Authority:** `PROJECT_MASTER_CONTEXT.md` §3 (scope); `PROJECT_BASELINE_2026_27.md` (official source record)  
**Scope:** All five Class 9 subjects in the approved V1 scope: Mathematics, Science, Computer Applications (165), Information Technology (402), Artificial Intelligence (417)

> **Relation to PROJECT_BASELINE_2026_27.md:** That document is the official-source record (PDF citations, chapter lists, mark schemes). This document is the **operational gap analysis** — it maps official 2026-27 chapter names to repo state, question counts, gateway status, and ordered remediation tasks. Read both; use this one for day-to-day implementation decisions.

---

## Quick-Reference: Class 9 Launch Readiness

| Subject | Official chs (exam) | Repo chs | Exam-ready q | Gateway | Launch status |
|---|---|---|---|---|---|
| Mathematics | 15 (all exam) | 15 (stale names) | ~499 | WARN | ⚠️ Name update required before new authoring |
| Science — Physics | 4 exam-active | 5 (1 non-exam) | 100 | PASS | ⚠️ Minor name gap; Gravitation decision pending |
| Science — Chemistry | 3 exam-active | 4 (0 exam-ready) | 0 | NOT REGISTERED | 🔴 Critical — zero exam content |
| Science — Biology | 4 exam-active | 0 | 0 | NOT REGISTERED | 🔴 Critical — live UI dead-end |
| Science — Earth Science | 1 exam-active | 0 | 0 | NOT REGISTERED | 🔴 Critical — no content |
| Computer Applications (165) | 3 units | 0 | 0 | NOT REGISTERED | ⚪ P3 — not started |
| Information Technology (402) | 5 units | 0 | 0 | NOT REGISTERED | ⚪ P4 — not started |
| Artificial Intelligence (417) | 5 units | 0 | 0 | NOT REGISTERED | ⚪ P5 — not started |

**Legend:** 🔴 Blocks launch · ⚠️ Non-blocking issue requiring attention · ⚪ Out-of-sprint (future work)

---

## 1. Class 9 Mathematics

**Official source:** `Maths_SecP1IX_2026-27.pdf` — `cbseacademic.nic.in`  
**Total marks:** 80 (exam) + 20 (internal) = 100  
**Structure:** 6 units, 15 chapters — all exam-active, no non-exam chapters  
**Gateway key:** `9-Mathematics` — REGISTERED, currently WARN  
**Gateway status:** PASS with warnings — 3 chapters below 20-question floor (ch7 Triangles 19q, ch8 Quadrilaterals 17q, ch15 Probability 19q). Warnings are non-blocking.

> **⚠️ STRUCTURAL CHANGE FOR 2026-27:** All chapter names and two chapter slots have been replaced under NCF-SE 2023. The repo chapter names are from the pre-2026-27 syllabus. The gateway `EXPECTED` map must be updated before any new authoring sprint begins, or new content will be registered under incorrect chapter names.

### Per-chapter inventory — Class 9 Mathematics

| Unit | 2026-27 Official name | Repo file | Repo name (stale) | Questions | Name match | Action required |
|---|---|---|---|---|---|---|
| I | Number System | `ch1` | Number Systems | 50 | Minor (plural) | Rename |
| II | Introduction to Polynomials | `ch2` | Polynomials | 50 | **No** | Rename |
| II | Sequences and Progressions *(NEW)* | — | *(does not exist)* | 0 | — | **Create file + author questions** |
| II | Exploring Algebraic Identities *(NEW)* | — | *(does not exist)* | 0 | — | **Create file + author questions** |
| II | Linear Equations in Two Variables | `ch4` | Linear Equations in Two Variables | 38 | ✓ Match | None |
| III | Coordinate Geometry | `ch3` | Coordinate Geometry | 56 | ✓ Match | File renumber only |
| IV | Introduction to Euclid's Geometry: Axioms and Postulates | `ch5` | Introduction to Euclid's Geometry | 24 | **No** (subtitle missing) | Rename |
| IV | Lines and Angles | `ch6` | Lines and Angles | 25 | ✓ Match | None |
| IV | Triangles – Congruence Theorems | `ch7` | Triangles | 19 | **No** (subtitle missing) | Rename; below q-floor |
| IV | 4-gons (Quadrilaterals) | `ch8` | Quadrilaterals | 17 | **No** | Rename; below q-floor |
| IV | Circles | `ch10` | Circles | 20 | ✓ Match | None |
| V | Area and Perimeter *(merged)* | `ch9` + `ch12` | Areas of Parallelograms and Triangles / Heron's Formula | 45 + 45 = 90 | **No** — 2 old → 1 new | Merge/consolidate |
| V | Surface Area and Volume | `ch13` | Surface Areas and Volumes | 23 | **No** (minor) | Rename |
| VI | Statistics | `ch14` | Statistics | 22 | ✓ Match | None |
| VI | Introduction to Probability | `ch15` | Probability | 19 | **No** | Rename; below q-floor |
| *(deleted)* | *(Constructions — removed 2022-23)* | `ch11` | Constructions | 46 | — | `cbseDeleted: true` ✓ (already set) |

**Total repo questions (directly counted):** ~499  
**Total per PROJECT_STATUS.md:** 584 (count method differs — use gateway output as authoritative total)

### Chapters removed in 2026-27 (vs. prior syllabus)

| Old name | Old repo file | 2026-27 status | Content fate |
|---|---|---|---|
| Areas of Parallelograms and Triangles | `ch9` | Merged into "Area and Perimeter" | 45q available to reuse/relabel |
| Constructions | `ch11` | **Permanently deleted** (since 2022-23) | 46q are enrichment only — must not be exam-surfaced |
| Heron's Formula | `ch12` | Merged into "Area and Perimeter" | 45q available to reuse/relabel |

### New chapters in 2026-27

| New chapter | Description | Priority |
|---|---|---|
| Sequences and Progressions | AP (nth term, sum, visualisation), GP (nth term, fractals), Tower of Hanoi puzzle | Author after rename pass |
| Exploring Algebraic Identities | Algebraic identities, geometric visualisation, factorisation using algebra tiles, rational expressions | Author after rename pass |

### Mathematics action queue (ordered)

| # | Action | Blocker for | DEC ref |
|---|---|---|---|
| M1 | Update `9-Mathematics` in `curriculumGateway.ts` `EXPECTED` map — all 15 official chapter names | Safe new authoring | — |
| M2 | Rename gateway slugs for chapters with name changes (see table above) | M1 | — |
| M3 | Decide fate of old `ch9` (Areas of Parallelograms) + `ch12` (Heron's Formula) questions — consolidate into new "Area and Perimeter" chapter | M1 | — |
| M4 | Create repo file for "Sequences and Progressions"; author ≥20 questions | Maths completeness | — |
| M5 | Create repo file for "Exploring Algebraic Identities"; author ≥20 questions | Maths completeness | — |
| M6 | Top up ch7 Triangles, ch8 Quadrilaterals, ch15 Probability to ≥20 questions each (eliminate gateway WARN) | Gateway PASS (no WARN) | — |

---

## 2. Class 9 Science

**Official source:** DEC-007; `Science_SecP1IX_2026-27_RM.pdf` — `cbseacademic.nic.in`  
**Subject code:** 086  
**Total marks:** 80 (exam) + 20 (internal) = 100  
**Structure:** 14 chapters; Ch1 and Ch14 are **non-exam** (formative/portfolio only)  
**Internal domains:** Physics, Chemistry, Biology, Earth Science — student sees "Science" only

### Master chapter register — Class 9 Science 2026-27

| Ch | Official name | Domain | Exam status | Repo content | Questions | Gap |
|---|---|---|---|---|---|---|
| 1 | Matter in Our Surroundings | Chemistry | **NON-EXAM** | `ch01-matter-in-our-surroundings.ts` | 75 | N/A — non-exam |
| 2 | Cell — The Fundamental Unit of Life | Biology | Exam-active | None | 0 | 🔴 |
| 3 | Tissues | Biology | Exam-active | None | 0 | 🔴 |
| 4 | Motion | Physics | Exam-active | `class9-physics-ch1.ts` | 25 | ✓ |
| 5 | Exploring Mixtures | Chemistry | Exam-active | *(see note)* | 0 | 🔴 |
| 6 | Force and Laws of Motion | Physics | Exam-active | `class9-physics-ch2.ts` | 25 | ✓ |
| 7 | Work, Energy and Simple Machines | Physics | Exam-active | `class9-physics-ch4.ts` | 25 | ⚠️ Name + "Simple Machines" gap |
| 8 | Structure of the Atom | Chemistry | Exam-active | `ch04-structure-of-the-atom.ts` | 0 | 🔴 |
| 9 | Atoms and Molecules | Chemistry | Exam-active | `ch03-atoms-and-molecules.ts` | 0 | 🔴 |
| 10 | Sound | Physics | Exam-active | `class9-physics-ch5.ts` | 25 | ✓ |
| 11 | Reproduction | Biology | Exam-active | None | 0 | 🔴 |
| 12 | Diversity in Living Organisms | Biology | Exam-active | None | 0 | 🔴 |
| 13 | Earth as a System: Energy, Matter & Life | Earth Science | Exam-active | None | 0 | 🔴 |
| 14 | Natural Resources | Earth Science | **NON-EXAM** | None | 0 | N/A — non-exam; do not author |

**Exam-active chapters:** 12 (Ch2–Ch13)  
**Exam-ready question coverage:** 100 questions across 4 Physics chapters = 33% of exam-active chapters covered

### 2-A · Physics domain

**Gateway key:** `9-Physics` — REGISTERED, PASS (clean)  
**Repo files:** `class9-physics-ch1.ts` through `class9-physics-ch5.ts` (5 files)

| Repo file | Repo chapter name | Official 2026-27 name | Questions | Exam status | Issue |
|---|---|---|---|---|---|
| `ch1` | Motion | Ch4 Motion | 25 | ✓ Exam-active | None — content correct |
| `ch2` | Force and Laws of Motion | Ch6 Force and Laws of Motion | 25 | ✓ Exam-active | None |
| `ch3` | **Gravitation** | *(not a chapter in 2026-27)* | 25 | 🚫 **NON-EXAM** | DEC-008: no Gravitation chapter in 2026-27. Product decision pending (label as enrichment or deprecate). |
| `ch4` | Work and Energy | Ch7 Work, Energy and Simple Machines | 25 | ✓ Exam-active | ⚠️ Name mismatch; "Simple Machines" sub-topic may be undercovered |
| `ch5` | Sound | Ch10 Sound | 25 | ✓ Exam-active | None |

**Exam-active questions:** 100 (ch1 + ch2 + ch4 + ch5)  
**Non-exam questions in repo:** 25 (ch3 Gravitation — must not be presented as exam prep)

**Physics action queue:**

| # | Action | Blocker for |
|---|---|---|
| P1 | Product decision: label Gravitation as "Enrichment / Not in 2026-27 exam" in UI, or hide it | Accuracy of exam-prep claim |
| P2 | Update repo + gateway names: `ch4` → "Work, Energy and Simple Machines" | Name accuracy |
| P3 | Audit `ch4` questions — ensure "Simple Machines" (levers, pulleys) sub-topic is covered | Coverage of official syllabus |
| P4 | Update repo + gateway names: `ch3` → flag as non-exam | Transparency |

### 2-B · Chemistry domain

**Gateway key:** `9-Chemistry` — **NOT REGISTERED**  
**Repo files:** Adapter at `class9-chemistry.ts`; source files in `question-bank/questions/chemistry/class9/`

> **⚠️ CHAPTER NAME MISMATCH:** The Chemistry adapter uses the **pre-2026-27 chapter structure** (2022-23 rationalization era). The official 2026-27 chapter names and content scope differ. The mapping below shows the translation required.

| Repo file | Repo name (stale) | Official 2026-27 | Questions | Exam status | Action |
|---|---|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | Ch1 Matter in Our Surroundings | 75 | **NON-EXAM** | Keep as enrichment; do not surface as exam prep |
| `ch02-is-matter-around-us-pure.ts` | Is Matter Around Us Pure? | *(closest: Ch5 Exploring Mixtures)* | 0 | Exam-active | Rename + restructure per official 2026-27 scope |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules | Ch9 Atoms and Molecules | 0 | Exam-active | Name matches — author questions |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom | Ch8 Structure of the Atom | 0 | Exam-active | Name matches — author questions |

**Note on Ch5 "Exploring Mixtures":** The 2026-27 chapter is a restructured replacement for "Is Matter Around Us Pure?" It covers mixtures (elements, compounds, suspensions, colloids, solutions), separation methods (filtration, distillation, crystallisation, chromatography, centrifugation), and physical/chemical changes. The old "Is Matter Around Us Pure?" questions should be reviewed for alignment before being reused.

**Chemistry action queue:**

| # | Action | Blocker for |
|---|---|---|
| C1 | Register `9-Chemistry` in `curriculumGateway.ts` `EXPECTED` map (3 exam chapters + Ch1 with `cbseDeleted: true`) | Safe authoring |
| C2 | Mark `ch01` in gateway as non-exam (`cbseDeleted: true`) | Correct UI filtering |
| C3 | Rename `ch02-is-matter-around-us-pure` → `ch05-exploring-mixtures`; align content scope to 2026-27 official | Author new questions |
| C4 | Author ≥20 questions for Ch5 Exploring Mixtures (separation methods, types of mixtures, colloids, solutions) | Science coverage |
| C5 | Author ≥20 questions for Ch8 Structure of the Atom (Bohr model, atomic structure, isotopes, isobars) | Science coverage |
| C6 | Author ≥20 questions for Ch9 Atoms and Molecules (atomic mass, molecular mass, mole concept, chemical formulae) | Science coverage |

### 2-C · Biology domain

**Gateway key:** `9-Biology` — **NOT REGISTERED**  
**Repo content:** Zero — no question files, no adapter, no scaffolds  
**UI status:** 🔴 LIVE DEAD-END — Biology is selectable in Practice UI but returns 0 chapters and 0 questions (DEC-011)

**Official 2026-27 Biology chapters (all exam-active):**

| Ch | Official name | Content scope |
|---|---|---|
| 2 | Cell — The Fundamental Unit of Life | Cell structure, organelles (nucleus, mitochondria, ER, vacuoles, chloroplast, cell wall), semi-permeable membrane |
| 3 | Tissues | Plant tissues (meristematic, permanent), animal tissues (epithelial, connective, muscular, nervous) |
| 11 | Reproduction | Cell division (mitosis, meiosis); reproduction in plants and animals; asexual and sexual reproduction |
| 12 | Diversity in Living Organisms | Five kingdoms classification; binomial nomenclature; major plant and animal groups |

**Biology action queue:**

| # | Action | Blocker for |
|---|---|---|
| B1 | **IMMEDIATE:** Hide Biology in `Practice.tsx` `ALL_SUBJECTS` or add "Coming Soon" gate | Live defect (DEC-011) |
| B2 | Register `9-Biology` in `curriculumGateway.ts` `EXPECTED` map (4 chapters) | Safe authoring |
| B3 | Create question bank scaffold files for Ch2, Ch3, Ch11, Ch12 | Authoring |
| B4 | Create Chemistry-pattern adapter file (`class9-biology.ts`) | Wiring |
| B5 | Wire Biology adapter into `index.ts` `ALL_CHAPTERS` and `ALL_QUESTIONS` | UI visibility |
| B6 | Author ≥20 questions each: Ch2 Cell, Ch3 Tissues, Ch11 Reproduction, Ch12 Diversity | Coverage |

**Dependency:** B1 has no dependencies — do it immediately. B2–B6 must be done in order.

### 2-D · Earth Science domain

**Gateway key:** None (sub-domain of `9-Science` — not separately registered)  
**Repo content:** Zero  
**Official 2026-27 Earth Science chapters:**

| Ch | Official name | Exam status | Content scope |
|---|---|---|---|
| 13 | Earth as a System: Energy, Matter & Life | Exam-active | Hydrosphere, biosphere, atmosphere, geosphere, cryosphere; interconnections; Earth processes; hazards; energy cycles |
| 14 | Natural Resources | **Non-exam** | Air, water, soil, biogeochemical cycles | 

**Earth Science action queue:**

| # | Action | Blocker for |
|---|---|---|
| E1 | Register Ch13 "Earth as a System" under `9-Science` gateway (or `9-EarthScience` key) | Safe authoring |
| E2 | Author ≥20 questions for Ch13 | Science coverage |
| E3 | **Do not** author questions for Ch14 Natural Resources (non-exam per DEC-007) | N/A |

---

## 3. Class 9 Computer Applications (Code 165)

**Official source:** `Computer_Applications_SecP1IX_2026-27.pdf` — `cbseacademic.nic.in`  
**Priority:** P3 — after Mathematics and Science are launch-ready  
**Gateway key:** `9-ComputerApplications` — NOT REGISTERED  
**Total marks:** 100 (Theory 50 + Practical 50)

### Unit structure and content scope

| Unit | Name | Marks | Key topics |
|---|---|---|---|
| 1 | Basics of Information Technology | 10 | CPU, memory (RAM/ROM/secondary), I/O devices, software types, networking (PAN/LAN/MAN/WAN/Wi-Fi/Bluetooth/cloud), multimedia |
| 2 | Cyber Safety | 05 | Safe browsing, identity protection, passwords, privacy, cyberstalking, reporting cybercrime, malware (viruses, adware) |
| 3 | Office Tools | 55 | Word processor (create, edit, format, tables, headers, drawing tools), Presentation (slide shows, layouts, animations, sound), Spreadsheets (worksheets, formulas, SUM/AVERAGE/MAX/MIN/IF, charts) |
| 4 | Lab Exercises | — | Practical only — browser security, OS file navigation, word processing and spreadsheet practicals |

**Note for question authoring:** Unit 4 is practical-only. For MCQ/theory question bank, focus on Units 1–3. Unit 3 carries 55 of 70 theory+practical marks — it is the highest-yield authoring target.

### CA action queue

| # | Action | Priority |
|---|---|---|
| CA1 | Register `9-ComputerApplications` in gateway | Before authoring |
| CA2 | Author Unit 1 (Basics of IT) — ≥15 questions | After Science launch |
| CA3 | Author Unit 2 (Cyber Safety) — ≥10 questions | After Science launch |
| CA4 | Author Unit 3 (Office Tools) — ≥30 questions; cover all three tools | After Science launch |

---

## 4. Class 9 Information Technology (Code 402)

**Official source:** `402-IT-IX.pdf` — `cbseacademic.nic.in`  
**Classification:** Vocational (Skill subject — students choose this instead of one elective)  
**Priority:** P4  
**Gateway key:** `9-InformationTechnology` — NOT REGISTERED  
**Total marks:** 100 (Theory 50 + Practical 50)

### Subject-specific unit structure (Part B)

| Unit | Name | Theory hrs | Practical hrs | Marks | Key topics |
|---|---|---|---|---|---|
| B1 | Introduction to IT-ITeS Industry | 2 | 4 | 10 | IT industry overview, roles of data entry operator |
| B2 | Data Entry & Keyboarding Skills | 4 | 4 | — | Typing speed, accuracy, data entry techniques |
| B3 | Digital Documentation | 10 | 26 | 10 | Word processing (LibreOffice/MS Word), document creation, formatting |
| B4 | Electronic Spreadsheet | 18 | 35 | 10 | Spreadsheet creation, formulas, functions, data analysis |
| B5 | Digital Presentation | 10 | 31 | 10 | Slide creation, animations, multimedia presentations |

**Authoring focus:** B3, B4, B5 carry 30 of 40 subject-specific marks — highest ROI for question authoring.

---

## 5. Class 9 Artificial Intelligence (Code 417)

**Official source:** `417-AI-IX.pdf` — `cbseacademic.nic.in`  
**Classification:** Vocational (Skill subject — optional)  
**Priority:** P5  
**Gateway key:** `9-ArtificialIntelligence` — NOT REGISTERED  
**Total marks:** 100 (Theory 50 + Practical 50)

### Subject-specific unit structure (Part B)

| Unit | Name | Theory hrs | Practical hrs | Marks | Key topics |
|---|---|---|---|---|---|
| B1 | AI Reflection, Project Cycle and Ethics | 30 | 25 | 10 | AI applications, three AI domains (Data/CV/NLP), AI Project Cycle, ethics, bias, fairness |
| B2 | Data Literacy | 22 | 28 | 10 | Data requirements, sources, visualisation, types of modelling |
| B3 | Math for AI (Statistics & Probability) | 12 | 13 | 07 | Statistics and probability concepts for AI |
| B4 | Introduction to Generative AI | 08 | 12 | 05 | Generative AI concepts and applications |
| B5 | Introduction to Python | — | — | — | Introductory Python programming |

---

## 6. Launch Readiness Matrix

This matrix reflects the state as of 2026-07-09, based on direct repo inspection and official 2026-27 CBSE curriculum verification.

### Science launch readiness

| Domain | Exam chs | Chs with ≥1q | Chs with ≥20q | Gateway | Launch gate |
|---|---|---|---|---|---|
| Physics | 4 | 4 | 4 | PASS | ⚠️ Passes; Gravitation disclaimer needed |
| Chemistry | 3 | 0 | 0 | NOT REGISTERED | 🔴 BLOCKS — zero exam content |
| Biology | 4 | 0 | 0 | NOT REGISTERED | 🔴 BLOCKS — live dead-end in UI |
| Earth Science | 1 | 0 | 0 | NOT REGISTERED | 🔴 BLOCKS — zero content |

**Science cannot be launched** until Chemistry (3 chapters), Biology (4 chapters + UI fix), and Earth Science (1 chapter) have:
1. Gateway registration
2. ≥1 question per exam chapter (gateway trigger)
3. ≥20 questions per chapter (internal quality floor)

### Mathematics launch readiness

| Criterion | State |
|---|---|
| All chapters registered in gateway | ⚠️ Registered but stale names |
| All chapters ≥20 questions | ⚠️ 3 of 15 below floor (ch7, ch8, ch15) |
| New 2026-27 chapters have content | 🔴 2 new chapters have 0 questions |
| Chapter names match official 2026-27 | 🔴 8 of 15 names misaligned |
| Gateway result | WARN (non-blocking) |
| Launch decision | ✅ **Mathematics can launch** — the misaligned names and new chapters are a content debt, not a breaking defect. Content students see is exam-relevant even with old names. |

---

## 7. Ordered Task Queue — All Class 9 Subjects

Tasks are ordered by: (1) live defect severity, (2) launch blocking, (3) priority.

| Seq | Task | Subject | Priority | Dependencies | Type |
|---|---|---|---|---|---|
| T01 | Hide Biology in `Practice.tsx` or add "Coming Soon" gate | Biology | 🔴 Immediate | None | Code (1-line) |
| T02 | Register `9-Chemistry` in gateway EXPECTED map | Chemistry | 🔴 Critical | None | Code |
| T03 | Register `9-Biology` in gateway EXPECTED map | Biology | 🔴 Critical | None | Code |
| T04 | Update `9-Mathematics` gateway chapter names to 2026-27 official | Maths | HIGH | None | Code |
| T05 | Mark Chemistry Ch1 as non-exam (`cbseDeleted: true`) in gateway | Chemistry | HIGH | T02 | Code |
| T06 | Rename Chemistry `ch02` → `ch05-exploring-mixtures`; align to 2026-27 scope | Chemistry | HIGH | T02 | Code |
| T07 | Author Ch5 Exploring Mixtures — ≥20 questions | Chemistry | HIGH | T06 | Content |
| T08 | Author Ch8 Structure of the Atom — ≥20 questions | Chemistry | HIGH | T02 | Content |
| T09 | Author Ch9 Atoms and Molecules — ≥20 questions | Chemistry | HIGH | T02 | Content |
| T10 | Create Biology scaffold files (Ch2, Ch3, Ch11, Ch12) | Biology | HIGH | T03 | Code |
| T11 | Create `class9-biology.ts` adapter; wire into `index.ts` | Biology | HIGH | T10 | Code |
| T12 | Author Ch2 Cell — ≥20 questions | Biology | HIGH | T10 | Content |
| T13 | Author Ch3 Tissues — ≥20 questions | Biology | HIGH | T10 | Content |
| T14 | Author Ch11 Reproduction — ≥20 questions | Biology | HIGH | T10 | Content |
| T15 | Author Ch12 Diversity in Living Organisms — ≥20 questions | Biology | HIGH | T10 | Content |
| T16 | Author Ch13 Earth as a System — ≥20 questions | Earth Sci | HIGH | T03 | Content |
| T17 | Gravitation product decision — label as enrichment or hide | Physics | MEDIUM | None | Product |
| T18 | Rename Physics `ch4` → "Work, Energy and Simple Machines" in gateway | Physics | MEDIUM | None | Code |
| T19 | Audit Physics `ch4` for Simple Machines coverage | Physics | MEDIUM | None | Content review |
| T20 | Create "Sequences and Progressions" repo file; author ≥20 questions | Maths | MEDIUM | T04 | Content |
| T21 | Create "Exploring Algebraic Identities" repo file; author ≥20 questions | Maths | MEDIUM | T04 | Content |
| T22 | Consolidate old ch9+ch12 into "Area and Perimeter" gateway entry | Maths | MEDIUM | T04 | Code |
| T23 | Top up ch7 (Triangles), ch8 (Quadrilaterals), ch15 (Probability) to ≥20q | Maths | LOW | None | Content |
| T24 | Register `9-ComputerApplications` + begin CA (165) authoring | CA | LOW | — | P3 |
| T25 | Register `9-InformationTechnology` + begin IT (402) authoring | IT | LOW | — | P4 |
| T26 | Register `9-ArtificialIntelligence` + begin AI (417) authoring | AI | LOW | — | P5 |

**T01 is the immediate action.** It has no dependencies and unblocks students from a broken experience right now.  
**T02–T03** are pure code changes (no content authoring), can be done in the same session.  
**T07–T16** are the content authoring sprint — all require their respective gateway registration (T02 or T03) to be done first.

---

## 8. Decision Cross-Reference

| Decision | Subject | Implication for this document |
|---|---|---|
| DEC-001 | All | Scope freeze — Economics excluded; CA/IT/AI are in scope but low priority |
| DEC-002 | All | Official source rule — all chapter claims must trace to CBSE or NCERT |
| DEC-003 | Maths | Euclid's Geometry (ch5) is exam-active; no `cbseDeleted` flag |
| DEC-004 | — | Class 7 Maths Ch10 — not Class 9, but recorded for completeness |
| DEC-006 | Maths | Constructions (ch11) — `cbseDeleted: true` is correct; do not alter |
| DEC-007 | Science | 14-chapter structure is authoritative; Ch1 and Ch14 are non-exam |
| DEC-008 | Physics | Gravitation is not a chapter in 2026-27; pending product decision on existing 25 questions |
| DEC-009 | Chemistry | 75 Chemistry questions are in non-exam Ch1 — confirmed misallocation |
| DEC-010 | — | Economics out of scope — repo content retained but not marketed |
| DEC-011 | Biology | Biology is a live dead-end — T01 in this task queue is the fix |

---

## 9. Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-07-09 | Initial freeze. Per-chapter question counts from direct file inspection. Chapter name analysis from `Maths_SecP1IX_2026-27.pdf` (CBSE). Science chapter register from DEC-007. Chemistry repo structure from direct adapter inspection. |
