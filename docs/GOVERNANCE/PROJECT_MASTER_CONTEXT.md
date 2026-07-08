# PROJECT_MASTER_CONTEXT.md

**Generated:** 2026-07-08
**Document type:** Permanent project memory — single source of truth for all future audits, planning, implementation, and AI handoffs.
**Instruction:** Read this file before any recommendation, audit, gateway update, metadata change, or authoring task. If new evidence conflicts with anything recorded here, flag the conflict, do not implement automatically, and request governance review.

---

## 1. Product objective

**SnapSolve** is a CBSE-focused learning application. Target launch: before the 2026 Half-Yearly examinations.

**Primary goal:** Provide syllabus-aligned question practice, revision, assessment, progress tracking, and AI-assisted learning for Classes 6–9 CBSE students.

### CEO / CTO operating constraints

| Constraint | Implication |
|---|---|
| Cash constrained | No speculative implementation; every build decision must have confirmed curriculum scope behind it |
| Time constrained | Launch speed prioritized over completeness — ship what is correct, defer what is not yet evidenced |
| No unnecessary rewrites | Do not refactor working code to accommodate unconfirmed syllabus changes |
| No duplicate audits | Each subject/class gets one authoritative audit per syllabus cycle; prior audit results are binding until superseded with a formal governance review |
| No speculative implementation | Do not build for a chapter, subject, or feature unless official evidence for that scope is already recorded in this file or in a downstream governance document that cites it |

---

## 2. Curriculum governance rules

### Authoritative sources (evidence-grade)

All curriculum claims — chapter lists, chapter names, mark schemes, exam scope, subject classification — must be traced to one of the following:

| Source | Domain | URL pattern |
|---|---|---|
| CBSE Academic | Curriculum, syllabi, mark schemes | `cbseacademic.nic.in` |
| NCERT | Textbooks, learning outcomes | `ncert.nic.in` |
| Ministry of Education | Policy, NEP/NCF documents (if required) | `education.gov.in` |

### Non-authoritative sources (discovery only, never evidence)

The following may be used to discover that a topic or chapter exists, but may **never** be cited as evidence for any governance, authoring, gateway, or audit decision:

- Coaching websites (Vedantu, BYJU'S, Unacademy, Toppr, Embibe, etc.)
- Blogs or educational portals
- Publishers (S. Chand, NCERT reprints from third parties, etc.)
- Any third-party syllabus aggregator

If a claim can only be sourced from a non-authoritative source, it must be flagged for official verification before implementation.

---

## 3. Approved curriculum scope

### Board

**CBSE only.**

### Classes

**6, 7, 8, 9.**

### Subjects

| Class | Student-facing subject | Notes |
|---|---|---|
| 6 | Mathematics | |
| 6 | Science | |
| 6 | Computational Thinking and AI | |
| 7 | Mathematics | |
| 7 | Science | |
| 7 | Computational Thinking and AI | |
| 8 | Mathematics | |
| 8 | Science | |
| 8 | Computational Thinking and AI | |
| 9 | Mathematics | |
| 9 | Science | |
| 9 | Computer Applications (CA) | Subject Code 165 |
| 9 | Information Technology (IT) | Subject Code 402 |
| 9 | Artificial Intelligence (AI) | Subject Code 417 |

### Explicit subject-classification rules

**Class 9 Science — internal domain structure:**
- Physics, Chemistry, and Biology are **not** treated as separate product-facing subjects.
- They exist only as internal domain labels used to organize Science question content.
- The student-facing subject name is **Science** in all UI, analytics, and reporting.
- Internal domain codes (e.g., `9-Physics`, `9-Chemistry`, `9-Biology`) may be used inside the question bank and gateway for content organization, but must never surface to the student as top-level subjects.

**Economics — out of scope:**
- Economics is **out of scope** for this product unless future official CBSE curriculum evidence (sourced from `cbseacademic.nic.in`) requires its inclusion.
- Any existing Economics question bank content (e.g., Class 9 Economics questions already present in the repository) must be treated as legacy/exploratory and should not be marketed to students or counted as covered curriculum until this constraint is explicitly revisited in a governance review.

---

## 4. Implementation priority order

When resourcing decisions must be made, work on subjects in this order:

| Priority | Subject | Classes |
|---|---|---|
| 1 | Mathematics | 6, 7, 8, 9 |
| 2 | Science | 6, 7, 8, 9 |
| 3 | Computer Applications (CA) | 9 |
| 4 | Information Technology (IT) | 9 |
| 5 | Artificial Intelligence (AI) | 9 |
| 6 | Computational Thinking and AI | 6, 7, 8 |

---

## 5. Governance gate

Before any of the following actions are taken, official CBSE/NCERT evidence must already be recorded in this file or in a downstream governance document that cites an authoritative source:

- Content authoring (question writing)
- Curriculum auditing (chapter coverage analysis)
- Gateway validation (EXPECTED map updates in `curriculumGateway.ts`)
- Metadata updates (chapter names, slugs, subject labels)
- Curriculum scope changes (adding or removing a subject or class)

No implementation may proceed on the basis of memory, prior-project convention, coaching-site content, or unverified assumption. All changes require a traceable official source.

---

## 6. Project memory rules

- **Read this file first.** Before making any recommendation, audit, or implementation plan, confirm it is consistent with the scope, priority, and governance rules recorded here.
- **This file is the single source of truth.** In any conflict between this file and another internal document (audit, gateway approval, status report, code comment), this file's recorded scope and rules take precedence unless a formal governance review has explicitly superseded a specific entry.
- **Conflict protocol:** If new evidence (from an authoritative source) contradicts something recorded here, do the following:
  1. Flag the conflict explicitly.
  2. Do not implement the conflicting change automatically.
  3. Request a governance review before updating this file or acting on the new evidence.
- **Stale document protocol:** Prior internal documents that were written against a superseded syllabus (e.g., any document referencing a "rationalized 2022-23" or pre-NCF-SE-2023 chapter structure) are considered stale. They may be referenced for history but must not be used as evidence for new decisions.

---

## 7. Change log

All changes to approved scope, governance rules, or priority order must be recorded here before taking effect.

---

### [2026-07-08] — Initial scope freeze

- Curriculum scope frozen: CBSE Classes 6–9.
- Approved subjects:
  - Mathematics and Science for all classes (6, 7, 8, 9).
  - Computational Thinking and AI for Classes 6–8.
  - Computer Applications (CA), Information Technology (IT), and Artificial Intelligence (AI) for Class 9.
- Official-sources-only governance rule adopted: `cbseacademic.nic.in`, `ncert.nic.in`, `education.gov.in` (if required) are the only evidence-grade sources.
- Physics, Chemistry, Biology classified as internal Science domains — not student-facing product subjects.
- Economics classified as out of scope pending official curriculum evidence.
- Implementation priority order established: Maths → Science → CA → IT → AI → CT+AI (6–8).
