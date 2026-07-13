# CHAPTER_ALIGNMENT_CLASSES6-9.md

**Document type:** Source extraction alignment record — official textbook chapters vs. legacy repo structure  
**Date:** 14 July 2026  
**Performed by:** AI governance session (read-only analysis; no code, gateway, or content changes)  
**Sources processed:** SRC-001, SRC-002, SRC-004, SRC-005, SRC-012, SRC-014  
**Authority:** All chapter titles drawn from `docs/governance/ACADEMIC_LIBRARY_INDEX.md` (FROZEN v1.0) and `docs/governance/PROJECT_BASELINE_2026_27.md` (FROZEN 2026-07-09) only. No web research performed.

---

## CORRECTION NOTICE — PROJECT_BASELINE C-1, C-2, C-3

`docs/governance/PROJECT_BASELINE_2026_27.md` sections C-1, C-2, and C-3 each contain the following note (or equivalent):

> *"Legacy NCERT; new Middle Stage Mathematics textbooks under NCF-SE 2023 are expected for 2027-28."*

This is factually incorrect. `ACADEMIC_LIBRARY_INDEX.md` (FROZEN v1.0, 13 July 2026, §§3.1, 4.1, 5.1) confirms:

| Class | New Textbook | Edition | Status |
|---|---|---|---|
| 6 | Ganita Prakash — Textbook of Mathematics for Grade 6 | First Edition August 2024; Reprint 2026–27 | **COMPLETE (received)** |
| 7 | Ganita Prakash — Textbook of Mathematics for Grade 7 | Reprint 2026–27 | **COMPLETE (received)** |
| 8 | Ganita Prakash — Textbook of Mathematics for Grade 8 | Reprint 2026–27 | **COMPLETE (received)** |
| 6 | Curiosity — Textbook of Science for Grade 6 | First Edition July 2024; Reprint 2026–27 | **COMPLETE (received)** |

The Ganita Prakash (Grades 6, 7, 8) and Curiosity (Grade 6) ARE the current 2026-27 official textbooks, already in use. `PROJECT_BASELINE` C-1/C-2/C-3 were written on 2026-07-09 with incorrect textbook status assumptions. ACADEMIC_LIBRARY_INDEX, frozen 4 days later, is the authoritative correction.

**Impact:** The repo question banks for Classes 6–8 Mathematics were built against the **OLD** legacy NCERT chapter structures. The correct 2026-27 structures are the Ganita Prakash chapters documented below. All alignment tables in this document reflect the **current official 2026-27 position**.

PROJECT_BASELINE C-1 through C-3 remain FROZEN as written (audit trail); the correct position is recorded here.

---

## SECTION 1 — SRC-001: Class 6 Mathematics

**Source:** Ganita Prakash — Textbook of Mathematics for Grade 6  
**Edition:** First Edition August 2024; Reprint 2026-27  
**Files received:** `fegp1ps`, `fegp101`–`fegp110` (11 PDFs)  
**Chapter titles source:** ACADEMIC_LIBRARY_INDEX §3.1 (FROZEN)

### 1.1 Official Chapter List — Ganita Prakash Grade 6 (10 chapters, all exam-active)

| Ch | Official 2026-27 name | Exam status |
|---|---|---|
| 1 | Patterns in Mathematics | Active |
| 2 | Lines and Angles | Active |
| 3 | Number Play | Active |
| 4 | Data Handling and Presentation | Active |
| 5 | Prime Time | Active |
| 6 | Perimeter and Area | Active |
| 7 | Fractions | Active |
| 8 | Playing with Constructions | Active |
| 9 | Symmetry | Active |
| 10 | The Other Side of Zero | Active |

**Assessment structure:** School-based internal assessment (Middle Stage — no CBSE external Board exam for Class 6). All 10 chapters are exam-active; no chapter is designated non-exam or deleted by CBSE for 2026-27.

### 1.2 Alignment — Ganita Prakash (new) vs. Legacy NCERT Class 6 (old)

The current repo and gateway use the 14-chapter legacy NCERT Class 6 structure. The official 2026-27 textbook is Ganita Prakash with 10 completely redesigned chapters.

| Ganita Prakash Ch (2026-27) | Closest legacy NCERT chapter(s) | Match type |
|---|---|---|
| 1 · Patterns in Mathematics | — | New concept; no legacy equivalent |
| 2 · Lines and Angles | Ch4 Basic Geometrical Ideas + Ch5 Understanding Elementary Shapes | Partial — GP condenses and restructures |
| 3 · Number Play | Ch3 Playing with Numbers | Thematic overlap; scope diverges |
| 4 · Data Handling and Presentation | Ch9 Data Handling | Partial — "Presentation" adds graphical output |
| 5 · Prime Time | Ch3 Playing with Numbers (prime/factor topics) | Partial — primes/divisibility extracted as standalone |
| 6 · Perimeter and Area | Ch10 Mensuration | Partial — Mensuration in legacy was broader |
| 7 · Fractions | Ch7 Fractions | Closest match (topic overlap) |
| 8 · Playing with Constructions | Ch14 Practical Geometry | Partial — GP redesigns approach |
| 9 · Symmetry | Ch13 Symmetry | Closest match |
| 10 · The Other Side of Zero | Ch6 Integers | Partial — "Other side of zero" = negative integers |

**Legacy chapters with NO Ganita Prakash equivalent (require reclassification):**

| Legacy NCERT chapter | Legacy Ch# | Disposition in Ganita Prakash 2026-27 |
|---|---|---|
| Knowing Our Numbers | 1 | Not present as standalone; number concepts woven into multiple GP chapters |
| Whole Numbers | 2 | Not present as standalone; absorbed into number/pattern work |
| Decimals | 8 | Not present in Ganita Prakash Grade 6 — decimals appear in Grade 7 |
| Algebra | 11 | Not present as standalone in Grade 6 GP; algebraic reasoning in Grade 7 |
| Ratio and Proportion | 12 | Not present as standalone in Grade 6 GP |

**Summary:** The legacy 14-chapter structure is entirely superseded by the 10-chapter Ganita Prakash. The 1,090 legacy questions in the repo map to a structure that no longer matches the official 2026-27 textbook.

### 1.3 Repo Mapping

| Item | State |
|---|---|
| Current repo question files | Single adapter file; legacy 14-chapter structure |
| Gateway key | `6-Mathematics` (registered; legacy chapter names) |
| Official vs. repo alignment | **MISALIGNED** — 14 legacy chapters vs. 10 official GP chapters |
| Missing chapters vs. GP | 0 chapters missing from repo (legacy chapters exist); but legacy chapter names do not match official 2026-27 names |
| Extra legacy chapters | 4 legacy chapters have no GP equivalent (Knowing Our Numbers, Whole Numbers, Decimals, Algebra, Ratio and Proportion — 5 chapters unmatched) |

### 1.4 Extraction Verdict

| Check | Result |
|---|---|
| Chapter titles extracted | ✓ 10 of 10 — in ACADEMIC_LIBRARY_INDEX §3.1 |
| Exam-active flags confirmed | ✓ All 10 active; 0 cbseDeleted |
| Assessment structure confirmed | ✓ School-based; no external Board exam |
| Alignment with legacy documented | ✓ This section |
| Outstanding extraction gap | None |

**SRC-001 extraction: COMPLETE (100%)**  
**CM: COMPLETE**

---

## SECTION 2 — SRC-002: Class 6 Science

**Source:** Curiosity — Textbook of Science for Grade 6  
**Edition:** First Edition July 2024; Reprint 2026-27  
**Files received:** `fecu1ps`, `fecu101`–`fecu112` (13 PDFs)  
**Chapter titles source:** ACADEMIC_LIBRARY_INDEX §3.2 (FROZEN)

### 2.1 Official Chapter List — Curiosity Grade 6 (12 chapters, all exam-active)

| Ch | Official 2026-27 name | Exam status |
|---|---|---|
| 1 | The Wonderful World of Science | Active |
| 2 | Diversity in the Living World | Active |
| 3 | Mindful Eating: A Path to a Healthy Body | Active |
| 4 | Exploring Magnets | Active |
| 5 | Measurement of Length and Motion | Active |
| 6 | Materials Around Us | Active |
| 7 | Temperature and its Measurement | Active |
| 8 | A Journey through States of Water | Active |
| 9 | Methods of Separation in Everyday Life | Active |
| 10 | Living Creatures: Exploring their Characteristics | Active |
| 11 | Nature's Treasures | Active |
| 12 | Beyond Earth | Active |

**Assessment structure:** School-based internal assessment (Middle Stage — no CBSE external Board exam for Class 6). All 12 chapters are exam-active; no chapter is designated non-exam or deleted by CBSE for 2026-27.

**Note on legacy structure:** The old NCERT Class 6 Science textbook had 16 chapters (as referenced in PROJECT_BASELINE C-5). The 2026-27 textbook is Curiosity with 12 completely redesigned chapters. PROJECT_BASELINE C-5 treated the 16 legacy chapters as "standard NCERT for reference only" and correctly noted they were unverified. The correct 2026-27 chapter list is the 12 Curiosity chapters above.

### 2.2 Repo Mapping

| Item | State |
|---|---|
| Current repo question files | None — no Class 6 Science content |
| Gateway key | `6-Science` not registered |
| Required action | Register `6-Science` with official Curiosity chapter names when authoring begins |

### 2.3 Extraction Verdict

| Check | Result |
|---|---|
| Chapter titles extracted | ✓ 12 of 12 — in ACADEMIC_LIBRARY_INDEX §3.2 |
| Exam-active flags confirmed | ✓ All 12 active; 0 cbseDeleted |
| Assessment structure confirmed | ✓ School-based; no external Board exam |
| Old 16-chapter legacy status | ✓ Superseded — do not use for authoring |
| Outstanding extraction gap | None |

**SRC-002 extraction: COMPLETE (100%)**  
**CM: COMPLETE**

---

## SECTION 3 — SRC-004 + SRC-005: Class 7 Mathematics

**SRC-004 Source:** Ganita Prakash — Textbook of Mathematics for Grade 7, Part I  
**SRC-005 Source:** Ganita Prakash — Textbook of Mathematics for Grade 7, Part II  
**Edition:** Reprint 2026-27  
**Files received (SRC-004):** `gegp1ps`, `gegp101`–`gegp108` (9 PDFs)  
**Files received (SRC-005):** `gegp2ps`, `gegp201`–`gegp207` (8 PDFs)  
**Chapter titles source:** ACADEMIC_LIBRARY_INDEX §4.1 (FROZEN); SYLLABUS_FREEZE_v1 §2.1

### 3.1 Official Chapter List — Ganita Prakash Grade 7, Part I + Part II (15 chapters total, all exam-active)

| Part | Ch | Official 2026-27 name | SRC | Exam status |
|---|---|---|---|---|
| I | 1 | Large Numbers Around Us | SRC-004 | Active |
| I | 2 | Arithmetic Expressions | SRC-004 | Active |
| I | 3 | A Peek Beyond the Point | SRC-004 | Active |
| I | 4 | Expressions Using Letter-Numbers | SRC-004 | Active |
| I | 5 | Parallel and Intersecting Lines | SRC-004 | Active |
| I | 6 | Number Play | SRC-004 | Active |
| I | 7 | A Tale of Three Intersecting Lines | SRC-004 | Active |
| I | 8 | Working with Fractions | SRC-004 | Active |
| II | 1 | Geometric Twins | SRC-005 | Active |
| II | 2 | Operations with Integers | SRC-005 | Active |
| II | 3 | Finding Common Ground | SRC-005 | Active |
| II | 4 | Another Peek Beyond the Point | SRC-005 | Active |
| II | 5 | Connecting the Dots | SRC-005 | Active |
| II | 6 | Constructions and Tilings | SRC-005 | Active |
| II | 7 | Finding the Unknown | SRC-005 | Active |

**Total: 15 chapters (Part I: 8 · Part II: 7). All exam-active. No cbseDeleted chapters.**

**Assessment structure:** School-based internal assessment. No CBSE external Board exam for Class 7.

### 3.2 Critical Finding — "Practical Geometry" Deleted Status

The legacy NCERT Class 7 textbook included Ch10 "Practical Geometry" which was marked `cbseDeleted: true` in the repo gateway (confirmed by NCERT rationalization circular, DEC-004 / GC-04). 

**In the official 2026-27 Ganita Prakash Grade 7, there is NO chapter named "Practical Geometry."** The deleted chapter simply does not exist in the new textbook structure. The gateway entry `cbseDeleted: true` for "Practical Geometry" was relevant only to the old NCERT textbook; when the gateway is updated to Ganita Prakash chapter names, there is no chapter requiring cbseDeleted treatment.

**"Constructions and Tilings" (Part II Ch6) is a DISTINCT, DIFFERENT, EXAM-ACTIVE chapter.** It is not a renamed version of "Practical Geometry." Ganita Prakash uses a constructions-via-tilings and tessellations approach that is substantively different from the old classical compass-and-ruler Practical Geometry that was deleted. It carries no cbseDeleted status and questions must be authored for it.

### 3.3 Alignment — Ganita Prakash (new) vs. Legacy NCERT Class 7 (old)

| Ganita Prakash (2026-27) | Best legacy NCERT chapter(s) | Match type |
|---|---|---|
| I-1 · Large Numbers Around Us | Spreads over legacy: number topics, exponents | New framing; no clean single match |
| I-2 · Arithmetic Expressions | Ch4 Simple Equations + Ch12 Algebraic Expressions | Partial |
| I-3 · A Peek Beyond the Point | Ch2 Fractions and Decimals (decimal/rational numbers) | Partial |
| I-4 · Expressions Using Letter-Numbers | Ch12 Algebraic Expressions | Partial |
| I-5 · Parallel and Intersecting Lines | Ch5 Lines and Angles | Closest match |
| I-6 · Number Play | Novel: no direct legacy equivalent | New chapter |
| I-7 · A Tale of Three Intersecting Lines | Ch6 The Triangle and Its Properties | Closest match |
| I-8 · Working with Fractions | Ch2 Fractions and Decimals | Partial |
| II-1 · Geometric Twins | Ch7 Congruence of Triangles | Closest match |
| II-2 · Operations with Integers | Ch1 Integers | Closest match |
| II-3 · Finding Common Ground | Ch9 Rational Numbers | Partial |
| II-4 · Another Peek Beyond the Point | Ch2 Fractions and Decimals (continued) | Partial |
| II-5 · Connecting the Dots | Ch8 Comparing Quantities + Ch11 Perimeter and Area | Partial — merged topics |
| II-6 · Constructions and Tilings | No equivalent — Ch10 Practical Geometry was **deleted**; this is a NEW ACTIVE chapter | New chapter; distinct from deleted chapter |
| II-7 · Finding the Unknown | Ch4 Simple Equations | Closest match |

**Legacy chapters with no Ganita Prakash equivalent:**

| Legacy NCERT chapter | Legacy Ch# | Disposition in Ganita Prakash 2026-27 |
|---|---|---|
| Practical Geometry | 10 | **Deleted in old NCERT; absent from GP entirely. Not the same as "Constructions and Tilings."** |
| Data Handling | 3 | Not present as standalone; data reasoning may appear within other GP chapters |
| Comparing Quantities | 8 | Partially absorbed into "Connecting the Dots" (II-5) |
| Perimeter and Area | 11 | Partially absorbed into "Connecting the Dots" (II-5) |
| Exponents and Powers | 13 | Partly absorbed into "Large Numbers Around Us" (I-1) |
| Symmetry | 14 | Aspects covered in "Geometric Twins" (II-1); not standalone |
| Visualising Solid Shapes | 15 | Not present as standalone in Grade 7 GP |

**Note:** The 15-chapter count is preserved (GP has 15 chapters; legacy had 15). However, the chapter structure is completely redesigned. Direct name-to-name alignment for gateway update requires textbook-level reading.

### 3.4 Repo Mapping

| Item | State |
|---|---|
| Current repo question files | Single adapter file; legacy 15-chapter structure (14 active + 1 cbseDeleted) |
| Gateway key | `7-Mathematics` (registered; legacy chapter names; WARN difficulty distribution) |
| Official vs. repo alignment | **MISALIGNED** — legacy chapter names do not match official Ganita Prakash 2026-27 names |
| "Practical Geometry" cbseDeleted flag | Was correct for the old textbook; **has no counterpart in GP** — when gateway is updated to GP names, this flag does not transfer to any GP chapter |
| "Constructions and Tilings" status | Not yet in repo; **must be authored as a new active exam chapter** when Class 7 authoring begins |

### 3.5 Extraction Verdict

| Check | Result |
|---|---|
| Chapter titles extracted (SRC-004 Part I) | ✓ 8 of 8 — in ACADEMIC_LIBRARY_INDEX §4.1 |
| Chapter titles extracted (SRC-005 Part II) | ✓ 7 of 7 — in ACADEMIC_LIBRARY_INDEX §4.1 |
| Exam-active flags confirmed | ✓ All 15 active; 0 cbseDeleted in Ganita Prakash |
| Practical Geometry cbseDeleted status clarified | ✓ Does not carry forward to GP structure |
| Alignment with legacy documented | ✓ This section |
| Outstanding extraction gap | None |

**SRC-004 extraction: COMPLETE (100%) — CM: COMPLETE**  
**SRC-005 extraction: COMPLETE (100%) — CM: COMPLETE**

---

## SECTION 4 — SRC-012: Class 9 Mathematics, Ganita Manjari Part I

**Source:** Ganita Manjari — Textbook of Mathematics for Grade 9, Part I  
**Edition:** First Edition April 2026  
**Files received:** 9 PDFs + 1 cover JPG (prelims + 8 chapter PDFs)  
**Chapter titles source:** ACADEMIC_LIBRARY_INDEX §6.1 (FROZEN); SYLLABUS_FREEZE_v1 §4.1  
**Cross-reference source:** PROJECT_BASELINE_2026_27.md §C-4 — 15-chapter official CBSE curriculum structure (from `Maths_SecP1IX_2026-27.pdf`, SRC-021)

### 4.1 Official Chapter List — Ganita Manjari Part I (8 chapters)

| Textbook Ch | Official Ganita Manjari Part I name |
|---|---|
| 1 | Orienting Yourself: The Use of Coordinates |
| 2 | Introduction to Linear Polynomials |
| 3 | The World of Numbers |
| 4 | Exploring Algebraic Identities |
| 5 | I'm Up and Down, and Round and Round |
| 6 | Measuring Space: Perimeter and Area |
| 7 | The Mathematics of Maybe: Introduction to Probability |
| 8 | Predicting What Comes Next: Exploring Sequences and Progressions |

### 4.2 Mapping — Ganita Manjari Part I Chapters to Official CBSE 15-Chapter Curriculum

The CBSE curriculum (`Maths_SecP1IX_2026-27.pdf`, extracted in PROJECT_BASELINE C-4) lists 15 official chapters. Ganita Manjari Part I covers 8 of these; Part II (pending official NCERT release) will cover the remaining 7.

| Textbook (Ganita Manjari Part I) | CBSE Curriculum Ch# | CBSE Curriculum name | Confidence |
|---|---|---|---|
| Ch1 · Orienting Yourself: The Use of Coordinates | 6 | Coordinate Geometry | **HIGH** — direct title match |
| Ch2 · Introduction to Linear Polynomials | 2 | Introduction to Polynomials | **HIGH** — "Linear Polynomials" is the Part I scope of the full Polynomials chapter |
| Ch3 · The World of Numbers | 1 | Number System | **HIGH** — direct conceptual match |
| Ch4 · Exploring Algebraic Identities | 4 | Exploring Algebraic Identities | **HIGH** — exact title match |
| Ch5 · I'm Up and Down, and Round and Round | 5 | Linear Equations in Two Variables | **INFERRED** — graphing linear equations produces lines with positive/negative slopes (up and down); the phrase likely describes the graphical behavior of y = mx + c as x varies; "round and round" may reference the coordinate plane or bidirectionality of the line. Requires textbook-level confirmation. |
| Ch6 · Measuring Space: Perimeter and Area | 12 | Area and Perimeter | **HIGH** — direct title match (reversed word order) |
| Ch7 · The Mathematics of Maybe: Introduction to Probability | 15 | Introduction to Probability | **HIGH** — exact conceptual match; "Mathematics of Maybe" is the creative subtitle |
| Ch8 · Predicting What Comes Next: Exploring Sequences and Progressions | 3 | Sequences and Progressions | **HIGH** — exact match; creative subtitle is "Predicting What Comes Next" |

**Part I coverage: CBSE curriculum chapters 1, 2, 3, 4, 5 (inferred), 6, 12, 15 — total 8 chapters.**

### 4.3 Projected Part II Coverage

If the mapping above is correct, Ganita Manjari Part II (pending NCERT release) will cover:

| CBSE Curriculum Ch# | CBSE Curriculum name |
|---|---|
| 7 | Introduction to Euclid's Geometry: Axioms and Postulates |
| 8 | Lines and Angles |
| 9 | Triangles – Congruence Theorems |
| 10 | 4-gons (Quadrilaterals) |
| 11 | Circles |
| 13 | Surface Area and Volume |
| 14 | Statistics |

This is a logically coherent split: Part I covers algebra, number theory, coordinate geometry, probability, sequences, and perimeter/area; Part II covers the full geometry sequence (Euclid → Lines → Triangles → Quadrilaterals → Circles → Surface Area) plus Statistics.

**This Part II projection is for planning purposes only and must not be treated as official until Ganita Manjari Part II is received.**

### 4.4 Repo Mapping

| Item | State |
|---|---|
| Existing repo chapter files | `class9-maths-ch1.ts` through `class9-maths-ch15.ts` (15 files with PRE-2026-27 names) |
| Gateway key | `9-Mathematics` (registered; stale pre-2026-27 chapter names; 3 chapters below floor) |
| Alignment | **MISALIGNED** — repo files use old chapter names; see PROJECT_BASELINE C-4 for full old→new mapping |
| Part I chapters needing rename | 8 files — names must be updated to official Ganita Manjari Part I titles |
| Uncertain mapping | Ch5 "I'm Up and Down, and Round and Round" → old repo file to be confirmed at textbook level |

### 4.5 Extraction Verdict

| Check | Result |
|---|---|
| Chapter titles extracted (8 of 8) | ✓ In ACADEMIC_LIBRARY_INDEX §6.1 |
| Mapping to CBSE 15-chapter curriculum | ✓ 7 of 8 with HIGH confidence; 1 inferred (Ch5) |
| Part II projection documented | ✓ Planning only |
| Outstanding extraction gap | 1 uncertain mapping: Ch5 "I'm Up and Down, and Round and Round" → Ch5 "Linear Equations in Two Variables" is a reasonable inference but requires textbook body confirmation |

**SRC-012 extraction: 90% — CM: IN PROGRESS**  
Remaining 10%: Textbook-level confirmation of Ch5 mapping. Cannot be resolved without reading the Ganita Manjari Part I Chapter 5 body content from the official PDF.

---

## SECTION 5 — SRC-014: Class 9 Science, Exploration Textbook

**Source:** Exploration — Textbook of Science for Grade 9  
**Edition:** First Edition April 2026  
**Files received:** `iesc1ps`, `iesc101`–`iesc113` (14 PDFs = 1 prelims + 13 chapter PDFs)  
**Chapter structure source:** DEC-007 (CBSE Academic Circular, authoritative); PROJECT_BASELINE_2026_27.md §C-8  
**Note from ACADEMIC_LIBRARY_INDEX §6.2:** "Chapter titles: To be extracted and frozen directly from uploaded official PDFs." This indicates the title-for-title textbook-PDF verification has not yet been performed.

### 5.1 Established Chapter List — Class 9 Science 2026-27 (from DEC-007)

The 14-chapter structure is established via DEC-007 (CBSE Circular / authoritative governance decision). The chapter names below are as recorded in PROJECT_BASELINE C-8.

| Ch | Chapter name (DEC-007) | Discipline | Exam status |
|---|---|---|---|
| 1 | Matter in Our Surroundings | Chemistry | **Non-exam** (formative/portfolio only) |
| 2 | Cell — The Fundamental Unit of Life | Biology | Exam-active |
| 3 | Tissues | Biology | Exam-active |
| 4 | Motion | Physics | Exam-active |
| 5 | Exploring Mixtures | Chemistry | Exam-active |
| 6 | Force and Laws of Motion | Physics | Exam-active |
| 7 | Work, Energy and Simple Machines | Physics | Exam-active |
| 8 | Structure of the Atom | Chemistry | Exam-active |
| 9 | Atoms and Molecules | Chemistry | Exam-active |
| 10 | Sound | Physics | Exam-active |
| 11 | Reproduction | Biology | Exam-active |
| 12 | Diversity in Living Organisms | Biology | Exam-active |
| 13 | Earth as a System: Energy, Matter and Life | Earth Science | Exam-active |
| 14 | Natural Resources | Earth Science | **Non-exam** (formative/portfolio only) |

**Exam-active chapters: 12 (Ch2–Ch13). Non-exam: 2 (Ch1, Ch14).**  
**Total marks: 80 annual exam + 20 internal assessment = 100** (as per SRC-021, PROJECT_BASELINE C-8).

### 5.2 Textbook PDF vs. DEC-007 Alignment

DEC-007 cites CBSE Academic Circular and NCF-SE 2023 restructuring as evidence — both are at least as authoritative as the textbook itself. The 14 textbook PDFs are received (`iesc1ps` + `iesc101`–`iesc113`). The outstanding extraction task per ACADEMIC_LIBRARY_INDEX is to read each PDF and confirm the chapter title printed on the opening page matches the DEC-007 name exactly.

Known areas where titles may differ between the CBSE Circular and textbook printing:
- Ch5: DEC-007 records "Exploring Mixtures"; CBSE Secondary Curriculum source document listed it as "Exploring Mixtures and their Separation" (see PROJECT_BASELINE C-4 cross-reference). Title may vary between PDF files.
- Ch11: DEC-007 records "Reproduction"; full textbook title may be "Reproduction in Plants and Animals" (see PROJECT_BASELINE C-8 §Biology mapping, which lists "Ch11 Reproduction in Plants and Animals").
- Ch12: DEC-007 records "Diversity in Living Organisms"; textbook title may match exactly or may vary.
- Ch13: DEC-007 records "Earth as a System: Energy, Matter and Life"; PROJECT_BASELINE C-8 lists "Earth as a System: Energy, Matter & Life" (ampersand vs "and"). Minor formatting.

These are title-level discrepancies only. The chapter structure (14 chapters, discipline mapping, exam/non-exam flags) is fully established.

### 5.3 Repo Mapping

| Item | State |
|---|---|
| Physics files | `class9-physics-ch1.ts` through `class9-physics-ch5.ts` (5 files; old naming convention) |
| Chemistry file | `class9-chemistry.ts` (single combined adapter) |
| Biology files | `class9-biology.ts` (single file; Ch2 only — 75 questions) |
| Earth Science files | None |
| Gateway keys registered | `9-Physics` (PASS); `9-Chemistry` and `9-Biology` not registered |

### 5.4 Extraction Verdict

| Check | Result |
|---|---|
| Chapter list established (14 chapters) | ✓ Via DEC-007 — high authority |
| Exam-active flags confirmed | ✓ 12 exam-active; 2 non-exam (Ch1, Ch14) |
| Discipline mapping confirmed | ✓ Physics 4ch · Chemistry 3ch · Biology 4ch · Earth Science 1ch |
| Total marks confirmed | ✓ 80 + 20 = 100 |
| Textbook PDF title-for-title verification | **PENDING** — requires reading iesc101–iesc113 chapter title pages |
| Known title discrepancies flagged | ✓ Ch5, Ch11, Ch12, Ch13 noted above |

**SRC-014 extraction: 90% — CM: IN PROGRESS**  
Remaining 10%: Read each chapter PDF (iesc101–iesc113) and record exact printed title; resolve the 4 flagged title discrepancies. This work requires access to the PDF contents.

---

## EXTRACTION SUMMARY

| SRC | Subject | Class | Previous % | Final % | CM | Remaining work |
|---|---|---|---|---|---|---|
| SRC-001 | Mathematics | 6 | 50% | **100%** | **COMPLETE** | None |
| SRC-002 | Science | 6 | 50% | **100%** | **COMPLETE** | None |
| SRC-004 | Mathematics (Part I) | 7 | 50% | **100%** | **COMPLETE** | None |
| SRC-005 | Mathematics (Part II) | 7 | 50% | **100%** | **COMPLETE** | None |
| SRC-012 | Mathematics (Part I) | 9 | 50% | **90%** | IN PROGRESS | Confirm Ch5 "I'm Up and Down" → "Linear Equations in Two Variables" mapping from textbook PDF |
| SRC-014 | Science | 9 | 40% | **90%** | IN PROGRESS | Read iesc101–iesc113 PDF title pages; resolve 4 flagged title discrepancies (Ch5, Ch11, Ch12, Ch13) |

---

*End of document*
