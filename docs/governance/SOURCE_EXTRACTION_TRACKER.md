# SOURCE_EXTRACTION_TRACKER.md

**Document type:** Official curriculum source extraction and implementation mapping tracker  
**Version:** 1.0 (draft)  
**Date:** 13 July 2026  
**Status:** LIVE TRACKER — updated after each extraction session  
**Authority:** `ACADEMIC_LIBRARY_INDEX.md` (FROZEN v1.0) is the canonical source list. This document tracks implementation progress against it.

**Source files read to populate this document:**

1. `docs/governance/ACADEMIC_LIBRARY_INDEX.md` — canonical source library (FROZEN v1.0)
2. `docs/governance/SYLLABUS_FREEZE_v1.md` — implementation map (draft)
3. `docs/GOVERNANCE/PROJECT_STATUS.md` — current product state
4. `docs/GOVERNANCE/DECISION_LOG.md` — governance decisions DEC-001 through DEC-016

---

## SOURCE EXTRACTION RULE

No official source is considered complete until:

- extraction is 100%;
- curriculum mapping is verified;
- implementation mapping is verified;
- freeze status is COMPLETE.

Until all four conditions are met, the corresponding subject row in `SYLLABUS_FREEZE_v1.md` must not be marked as frozen and must not be presented as implementation-complete.

---

## CURRENT PRIORITY

Extractions are ordered by: (1) live student-facing gap severity, (2) launch blocking, (3) subject priority (P1–P6 per DEC-001).

1. **Class 9 Mathematics Part I** — chapter names stale in gateway and question bank; 2 new chapters at 0 questions; launch-critical
2. **Class 9 Science** — textbook extraction confirms DEC-007 chapter list; Chemistry, Biology, Earth Science have gateway and content gaps
3. **Class 9 Artificial Intelligence (Code 417)** — 3 source documents received; unit freeze pending (P5)
4. **Class 9 Information Technology (Code 402)** — 2 source documents received; unit freeze pending (P4)
5. **Class 9 Computer Applications (Code 165)** — 1 syllabus document received; unit freeze pending (P3)
6. **Classes 6–8 Computational Thinking and AI** — combined PDF received; class-wise scope extraction pending for all three classes
7. **Class 7 Science** — Curiosity Grade 7 PDFs received; chapter titles not extracted
8. **Class 8 Mathematics** — Ganita Prakash Grade 8 PDFs received; chapter titles not extracted
9. **Class 8 Science** — Curiosity Grade 8 PDFs received; chapter titles not extracted

**Do not extract content yet. Do not freeze anything.**

---

## SOURCE TRACKER TABLE

Column key:

- **Ext Status** — extraction status of the source document itself
- **Ext %** — estimated percentage of source content extracted into governance records
- **CM** — Curriculum Mapping Verified (chapter/unit list matches official source)
- **GM** — Gateway Mapping Verified (curriculumGateway.ts EXPECTED map matches official)
- **QBM** — Question Bank Mapping Verified (repo question files map to official chapters)
- **UIM** — UI Mapping Verified (student-facing labels match official chapter/unit names)
- **Freeze** — freeze status for this source's implementation

Allowed values: `NOT STARTED` · `IN PROGRESS` · `COMPLETE` · `PENDING SOURCE` · `BLOCKED` · `NOT APPLICABLE`

| SRC ID | Class | Subject | Official Source Name | Source Type | Official Version / Session | Source File / Location | Ext Status | Ext % | CM | GM | QBM | UIM | Freeze | Required Next Action | Remarks |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SRC-001 | 6 | Mathematics | Ganita Prakash — Textbook of Mathematics for Grade 6 | NCERT Textbook | First Edition August 2024; Reprint 2026–27 | `fegp1ps`, `fegp101`–`fegp110` (11 PDFs) | IN PROGRESS | 50% | IN PROGRESS | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Audit alignment between 10 official Ganita Prakash chapters and current 14-chapter legacy gateway; update EXPECTED map | Chapter titles recorded in ACADEMIC_LIBRARY_INDEX; repo and gateway use legacy NCERT structure |
| SRC-002 | 6 | Science | Curiosity — Textbook of Science for Grade 6 | NCERT Textbook | First Edition July 2024; Reprint 2026–27 | `fecu1ps`, `fecu101`–`fecu112` (13 PDFs) | IN PROGRESS | 50% | IN PROGRESS | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Register `6-Science` in gateway with official Curiosity chapter names; author questions | 12 chapter titles recorded in ACADEMIC_LIBRARY_INDEX; no questions authored; subject not live in UI |
| SRC-003 | 6 | Computational Thinking and AI | CBSE Computational Thinking and Artificial Intelligence Curriculum | CBSE Curriculum Document | 2026–27; Classes 3–8 combined | Combined official PDF (class-wise extraction pending) | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | BLOCKED | Extract Class 6 scope from combined PDF; freeze chapter/unit list | Same physical document as SRC-007 and SRC-011; extraction must be done per class |
| SRC-004 | 7 | Mathematics | Ganita Prakash — Textbook of Mathematics for Grade 7 (Part I) | NCERT Textbook | Reprint 2026–27 | `gegp1ps`, `gegp101`–`gegp108` (9 PDFs) | IN PROGRESS | 50% | IN PROGRESS | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Audit alignment between official Part I chapters and legacy gateway; update EXPECTED map | 8 Part I chapter titles recorded in ACADEMIC_LIBRARY_INDEX |
| SRC-005 | 7 | Mathematics | Ganita Prakash — Textbook of Mathematics for Grade 7 (Part II) | NCERT Textbook | Reprint 2026–27 | `gegp2ps`, `gegp201`–`gegp207` (8 PDFs) | IN PROGRESS | 50% | IN PROGRESS | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Audit alignment between official Part II chapters and legacy gateway; update EXPECTED map | 7 Part II chapter titles recorded in ACADEMIC_LIBRARY_INDEX; Ch10 Practical Geometry `cbseDeleted: true` carries forward |
| SRC-006 | 7 | Science | Curiosity — Textbook of Science for Grade 7 | NCERT Textbook | Reprint 2026–27 | 13 PDFs received; canonical pattern pending extraction | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | BLOCKED | Extract exact chapter titles from official Curiosity Grade 7 PDFs; record in governance; register `7-Science` in gateway | ACADEMIC_LIBRARY_INDEX records source as complete; chapter titles not yet extracted |
| SRC-007 | 7 | Computational Thinking and AI | CBSE Computational Thinking and Artificial Intelligence Curriculum | CBSE Curriculum Document | 2026–27; Classes 3–8 combined | Combined official PDF (class-wise extraction pending) | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | BLOCKED | Extract Class 7 scope from combined PDF; freeze chapter/unit list | Same physical document as SRC-003 and SRC-011 |
| SRC-008 | 8 | Mathematics | Ganita Prakash — Textbook of Mathematics for Grade 8 (Part I) | NCERT Textbook | Reprint 2026–27 | Part I: 8 PDFs received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | BLOCKED | Extract exact chapter titles from official Ganita Prakash Grade 8 Part I PDFs; record in governance | Chapter titles not yet extracted; current repo and gateway use legacy NCERT structure |
| SRC-009 | 8 | Mathematics | Ganita Prakash — Textbook of Mathematics for Grade 8 (Part II) | NCERT Textbook | Reprint 2026–27 | Part II: 8 PDFs received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | BLOCKED | Extract exact chapter titles from official Ganita Prakash Grade 8 Part II PDFs; record in governance | Chapter titles not yet extracted |
| SRC-010 | 8 | Science | Curiosity — Textbook of Science for Grade 8 | NCERT Textbook | Reprint 2026–27 | 14 PDFs received; canonical pattern pending extraction | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | BLOCKED | Extract exact chapter titles from official Curiosity Grade 8 PDFs; register `8-Science` in gateway | ACADEMIC_LIBRARY_INDEX records source as complete; chapter titles not yet extracted |
| SRC-011 | 8 | Computational Thinking and AI | CBSE Computational Thinking and Artificial Intelligence Curriculum | CBSE Curriculum Document | 2026–27; Classes 3–8 combined | Combined official PDF (class-wise extraction pending) | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | BLOCKED | Extract Class 8 scope from combined PDF; freeze chapter/unit list | Same physical document as SRC-003 and SRC-007 |
| SRC-012 | 9 | Mathematics | Ganita Manjari — Textbook of Mathematics for Grade 9 (Part I) | NCERT Textbook | First Edition April 2026 | 9 PDFs + 1 cover JPG received | IN PROGRESS | 50% | IN PROGRESS | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | Update `9-Mathematics` EXPECTED map with 8 official Part I chapter names; rename stale repo chapters; create 2 missing chapter files | 8 Part I chapter titles recorded in ACADEMIC_LIBRARY_INDEX; gateway and repo use pre-2026-27 names; source: CBSE `Maths_SecP1IX_2026-27.pdf` and PROJECT_BASELINE_2026_27.md Part C-4 |
| SRC-013 | 9 | Mathematics | Ganita Manjari — Textbook of Mathematics for Grade 9 (Part II) | NCERT Textbook | Not yet released | Not yet received | PENDING SOURCE | 0% | PENDING SOURCE | PENDING SOURCE | PENDING SOURCE | PENDING SOURCE | BLOCKED | Await official NCERT publication of Part II; receive source; begin extraction | Implementation rule: do not invent, infer, or author Part II chapters until official NCERT publication is received (ACADEMIC_LIBRARY_INDEX §6.1) |
| SRC-014 | 9 | Science | Exploration — Textbook of Science for Grade 9 | NCERT Textbook | First Edition April 2026 | `iesc1ps`, `iesc101`–`iesc113` (14 PDFs) | IN PROGRESS | 40% | IN PROGRESS | IN PROGRESS | IN PROGRESS | NOT STARTED | NOT STARTED | Extract exact chapter titles from official Exploration PDFs to confirm DEC-007 14-chapter list; complete Chemistry, Biology, Earth Science gateway registration | Chapter structure established via DEC-007; ACADEMIC_LIBRARY_INDEX notes chapter titles still to be extracted from PDFs; Physics gateway PASS; Chemistry/Biology/EarthScience gateways not registered |
| SRC-015 | 9 | Artificial Intelligence (417) | CBSE Artificial Intelligence Syllabus — Code 417 | CBSE Syllabus Document | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract unit list, marks, and exam-active scope from Code 417 syllabus; cross-check with SRC-016 and SRC-017; register `9-ArtificialIntelligence` in gateway | Part of three-document set for AI (417); unit-by-unit freeze requires all three sources |
| SRC-016 | 9 | Artificial Intelligence (417) | AI Facilitator Handbook | CBSE Supplementary Document | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract unit scope and learning objectives; cross-check with SRC-015 | Part of three-document set for AI (417) |
| SRC-017 | 9 | Artificial Intelligence (417) | AI Python Content Manual / Handbook | CBSE Supplementary Document | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract Python unit scope; cross-check with SRC-015 and SRC-016 | Part of three-document set for AI (417) |
| SRC-018 | 9 | Information Technology (402) | CBSE Information Technology Syllabus — Code 402 | CBSE Syllabus Document | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract unit list, marks, and exam-active scope from Code 402 syllabus; cross-check with SRC-019; register `9-InformationTechnology` in gateway | Part of two-document set for IT (402) |
| SRC-019 | 9 | Information Technology (402) | NCERT Domestic Data Entry Operator — Textbook for Class IX | NCERT Textbook | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract unit scope and content coverage; cross-check with SRC-018 | Part of two-document set for IT (402) |
| SRC-020 | 9 | Computer Applications (165) | CBSE Computer Applications Syllabus — Code 165 | CBSE Syllabus Document | 2026–27 | Official PDF received | NOT STARTED | 0% | NOT STARTED | NOT STARTED | NOT STARTED | NOT APPLICABLE | NOT STARTED | Extract unit list, marks, and exam-active scope from Code 165 syllabus; register `9-ComputerApplications` in gateway | Syllabus only; no complete official textbook currently in source library (ACADEMIC_LIBRARY_INDEX §6.5) |
| SRC-021 | All | Overarching | CBSE Secondary Curriculum 2026–27 | CBSE Curriculum Document | 2026–27 | `Maths_SecP1IX_2026-27.pdf` and related documents on `cbseacademic.nic.in` | IN PROGRESS | 80% | IN PROGRESS | IN PROGRESS | NOT STARTED | NOT STARTED | NOT STARTED | Complete cross-check of all Class 9 subject structures against this document; confirm no subject-level gaps remain | Used extensively in PROJECT_BASELINE_2026_27.md; covers Class 9 curriculum framework and subject structure; does not cover Classes 6–8 |

---

## EXTRACTION STATUS SUMMARY

| Status | Count | Source IDs |
|---|---|---|
| COMPLETE | 0 | — |
| IN PROGRESS | 7 | SRC-001, SRC-002, SRC-004, SRC-005, SRC-012, SRC-014, SRC-021 |
| NOT STARTED | 13 | SRC-003, SRC-006, SRC-007, SRC-008, SRC-009, SRC-010, SRC-011, SRC-015, SRC-016, SRC-017, SRC-018, SRC-019, SRC-020 |
| PENDING SOURCE | 1 | SRC-013 |
| BLOCKED | 0 | — |
| NOT APPLICABLE | 0 | — |

---

## FREEZE READINESS SUMMARY

No source row has reached COMPLETE freeze status. Zero subjects are ready for implementation freeze as of 13 July 2026.

| Prerequisite | Classes 6–8 Maths | Classes 6–8 Science | Classes 6–8 CT&AI | Class 9 Maths | Class 9 Science | Class 9 CA/IT/AI |
|---|---|---|---|---|---|---|
| Official source received | COMPLETE | COMPLETE | COMPLETE | Part I COMPLETE; Part II PENDING | COMPLETE | COMPLETE |
| Chapter/unit list extracted | PARTIAL | PARTIAL | NOT STARTED | PARTIAL | PARTIAL | NOT STARTED |
| Curriculum mapping verified | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | IN PROGRESS | NOT STARTED |
| Gateway mapping verified | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | PARTIAL | NOT STARTED |
| Question bank mapping verified | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | PARTIAL | NOT STARTED |
| UI mapping verified | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED | NOT STARTED |
| **Ready for freeze** | **NO** | **NO** | **NO** | **NO** | **NO** | **NO** |
