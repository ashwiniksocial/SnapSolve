# DECISION_LOG.md

**Document type:** Chronological record of all governance, scope, and architectural decisions.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Read this to understand:** Why things are the way they are. What was explicitly decided (and what was not). What prior records have been superseded.

Each entry records: the decision, the evidence or rationale, the confidence level, and the current status.

---

## 2026-07-08

---

### DEC-001 — Scope freeze: approved curriculum scope and priorities

**Decision:** Approved curriculum scope frozen as follows:
- CBSE Classes 6–9
- All classes: Mathematics, Science
- Classes 6–8: Computational Thinking and AI
- Class 9: Computer Applications (CA), Information Technology (IT), Artificial Intelligence (AI)
- Physics, Chemistry, Biology are internal Science domains — not student-facing subjects
- Economics is out of scope unless future official evidence requires inclusion
- Priority order: Mathematics → Science → CA → IT → AI → CT+AI (6–8)

**Rationale:** Cash and time constraints require a focused launch. Half-Yearly 2026 examinations are the target deadline. Scope limited to subjects with confirmed CBSE evidence already on hand or readily obtainable.

**Evidence source:** Product/CEO decision — no external curriculum source required for a scope constraint.
**Confidence:** HIGH (explicit constraint, not a curriculum fact)
**Status:** ACTIVE — binding on all future decisions until formally revised.
**Supersedes:** Any prior scope assumption that treated Economics as a core subject or Physics/Chemistry/Biology as student-facing top-level subjects.

---

### DEC-002 — Authoritative sources rule

**Decision:** CBSE (`cbseacademic.nic.in`), NCERT (`ncert.nic.in`), and the Ministry of Education (`education.gov.in`) are the only evidence-grade sources. Coaching sites, blogs, publishers, and third-party aggregators may be used for discovery only and may never be cited as evidence in governance documents.

**Rationale:** Prior internal documents made disputed claims that could not be resolved because they cited different sources of varying authority. This rule prevents recurrence.

**Evidence source:** Product/governance decision.
**Confidence:** HIGH
**Status:** ACTIVE

---

### DEC-003 — GC-01: Remove `cbseDeleted` from Class 9 Maths Ch5 (Euclid's Geometry)

**Decision:** `cbseDeleted: true` removed from the `"Introduction to Euclid's Geometry"` entry in `scripts/src/curriculumGateway.ts`. Chapter now treated as a full, active, exam-included chapter.

**Evidence:**
- CBSE Class 9 Maths Syllabus 2022-23 (`cbseacademic.nic.in`): Chapter present with full topic description and period allocation.
- CBSE Class 9 Maths Syllabus 2026-27 (`cbseacademic.nic.in`): Chapter present in Course Structure table.
- Neither source marks it as deleted or non-assessable.

**Evidence source:** CBSE (both 2022-23 and 2026-27 syllabi)
**Confidence:** HIGH
**Implementation:** Done 2026-07-08. Verified — gateway PASS, no new warnings (question count already sufficient).
**Status:** CLOSED

---

### DEC-004 — GC-04: Add `cbseDeleted` to Class 7 Maths Ch10 (Practical Geometry)

**Decision:** `cbseDeleted: true` added to the `"Practical Geometry"` entry in `scripts/src/curriculumGateway.ts`. Chapter now exempt from minimum-question-count floor.

**Evidence:**
- NCERT Class 7 Maths Rationalization Booklet (`ncert.nic.in`): Chapter dropped in full (pages 193–204 removed). Confirmed deleted by official NCERT rationalization.

**Evidence source:** NCERT (rationalization booklet)
**Confidence:** HIGH
**Implementation:** Done 2026-07-08. Verified — gateway PASS, no new warnings.
**Status:** CLOSED

---

### DEC-005 — GC-05: Class 7 Maths Ch15 (Visualising Solid Shapes) — blocked pending evidence

**Decision:** No change applied to `"Visualising Solid Shapes"` in Class 7. A claim was made that this chapter was deleted, but no official NCERT or CBSE source was produced to confirm it during the audit that covered GC-01 and GC-04.

**Current gateway state:** Chapter is active (no `cbseDeleted` flag).
**Evidence source:** Repository claim only — no official source confirmed.
**Confidence:** LOW (claim unverified)
**Status:** BLOCKED — pending official NCERT or CBSE evidence. Do not add `cbseDeleted` until evidence is on file.

---

### DEC-006 — GC-02: Class 9 Maths Ch11 (Constructions) — no action

**Decision:** `cbseDeleted: true` flag on `"Constructions"` in Class 9 was verified as correct during the GC-01/GC-04 audit. No change needed.

**Evidence source:** CBSE (confirmed chapter removed from 2022-23 onwards)
**Confidence:** HIGH
**Status:** CLOSED — flag retained, chapter correctly exempt.

---

### DEC-007 — Class 9 Science restructuring: 2026-27 syllabus supersedes all prior internal docs

**Decision:** The 2026-27 CBSE Science curriculum (Code 086) represents a complete structural overhaul under NCF-SE 2023/NEP 2020. The new 14-chapter structure (Ch1–Ch14, with Ch1 and Ch14 excluded from assessment) replaces the older "rationalized 2022-23" chapter structure that prior internal documents assumed.

All prior internal documents that reference the older chapter structure are now stale for planning purposes. They may be referenced for history but must not be used as evidence for decisions going forward.

**Key structural changes confirmed:**
- 12 assessed chapters (Ch2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)
- Ch1 (Matter in Our Surroundings) and Ch14 (Natural Resources) excluded from annual exam
- "Gravitation" does not exist as a chapter in the 2026-27 structure
- Ch13 "Earth as a System: Energy, Matter & Life" is a new cross-cutting chapter (Earth Science domain)

**Evidence source:** CBSE (`cbseacademic.nic.in`, Science Code 086 Classes IX 2026-27 PDF)
**Confidence:** HIGH
**Status:** ACTIVE — binding for all Class 9 Science authoring and gateway decisions.
**Supersedes:** `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`, `GATEWAY_CHANGE_APPROVAL.md` (both contained outdated or disputed chapter assumptions).

---

### DEC-008 — Gravitation dispute resolution

**Decision:** The standing dispute between `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` (Gravitation = not exam) and `GATEWAY_CHANGE_APPROVAL.md` (disputed, cited competency C 2.2 as evidence it was active) is resolved.

**Resolved finding:** Both prior positions were working from an incomplete picture of the 2026-27 curriculum. The correct answer is that Gravitation is **not a chapter at all** in the 2026-27 structure. Mass/weight competencies are folded into other chapters' learning outcomes, not taught as a standalone chapter.

**Evidence source:** CBSE (2026-27 Science PDF — Course Structure table and full per-chapter key-concepts/learning-outcomes sections confirm no "Gravitation" chapter anywhere in the 14-chapter list).
**Confidence:** HIGH
**Status:** CLOSED — dispute closed, no further debate on this point.

**Pending product decision (not yet decided):** Whether to keep the existing 25-question Gravitation chapter in the product as an enrichment/non-exam resource, or deprecate it. This is a product call, not a curriculum call. No action required from this decision entry — it simply records that the curriculum question is settled.

---

### DEC-009 — Chemistry Ch1 content-misallocation confirmed

**Decision (finding, not an action):** The 75 fully authored questions in Class 9 Chemistry "Matter in Our Surroundings" (Ch01) are confirmed to be in a non-exam chapter. This is not a content-quality problem — the questions may be pedagogically sound — but it means 100% of Chemistry authoring effort to date is concentrated in a chapter that will not appear on the CBSE 2026-27 annual exam.

**Evidence source:** CBSE (2026-27 Science PDF — Ch1 is absent from all assessed unit tables).
**Confidence:** HIGH
**Status:** RECORDED — no action taken under this decision. Authoring of exam chapters (Ch5, Ch8, Ch9 equivalents) has not started. Next actions for Chemistry are defined in `CLASS9_SCIENCE_EXECUTIVE_DECISION.md`, Section 5.

---

### DEC-010 — Economics content retained but scope-locked

**Decision:** Class 9 Economics (4 chapters, gateway-registered, PASS) is retained in the repository and the curriculum gateway, but is classified as out of scope for the current product launch. It must not be marketed to students or counted as a subject coverage milestone until a formal governance review reinstates it.

**Rationale:** Economics is not in the approved subject list in `PROJECT_MASTER_CONTEXT.md`. The content exists as legacy from a broader initial scope.
**Confidence:** HIGH (product decision)
**Status:** ACTIVE

---

### DEC-011 — Biology UI exposure is a live blocker

**Decision (finding):** Biology is currently exposed as a selectable subject in the Practice UI (`Practice.tsx` `ALL_SUBJECTS` list, `subjects.ts` `SubjectConfig`) despite having zero content, zero wiring, and zero gateway registration. This is a live student-facing defect, not a future planning note.

**Evidence source:** Repository (direct file inspection)
**Confidence:** HIGH
**Status:** RECORDED — fix (hide or show Coming Soon state) is pending implementation. No code was changed as part of this audit session.

---

## 2026-07-09

---

### DEC-012 — Governance framework created

**Decision:** A permanent governance folder (`docs/GOVERNANCE/`) was established as the single source of truth for all future sessions, audits, implementation, and AI handoffs. The following documents were created and committed:

| Document | Purpose |
|---|---|
| `PROJECT_MASTER_CONTEXT.md` | 9-section permanent reference: product objective, launch target, curriculum scope, official source rule, teaching philosophy, UI philosophy, architecture rules, CEO/CTO constraints, restart protocol |
| `PROJECT_MEMORY.md` | Durable facts, architectural decisions, sharp edges — what the code alone cannot tell a future session |
| `PROJECT_STATUS.md` | Living status record: completed work, pending work, blockers, next task, known risks |
| `DECISION_LOG.md` | Chronological record of all governance, scope, and architectural decisions (this file) |
| `CHECKPOINT_GATEWAYS.md` | 7-gate quality registry: curriculum, question bank, teaching quality, UI, AI, architecture, release |

Additionally, three audit documents were committed to the repo root:

| Document | Purpose |
|---|---|
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | Full Class 9 Science audit against official CBSE 2026-27 curriculum |
| `CLASS9_SCIENCE_EXECUTIVE_DECISION.md` | CEO-level decision brief: evidence source, confidence, product impact per finding; 5 sections |
| `GATEWAY_FIX_VERIFICATION.md` | Post-implementation verification record for GC-01 and GC-04 |

**Rationale:** Prior sessions produced audit findings and decisions but had no persistent governance structure. Any future session starting without this folder risked re-litigating closed decisions (especially the Gravitation dispute) or acting on stale documents.
**Evidence source:** Product/governance decision.
**Confidence:** HIGH
**Status:** ACTIVE — all documents are live. Restart protocol (Section 9 of `PROJECT_MASTER_CONTEXT.md`) requires reading these four documents before any new session begins.

---

### DEC-014 — Quality audit: Class 9 Chemistry Ch02, Ch03, Ch04

**Decision (audit record):** A formal 15-point quality audit was performed on all three authored Class 9 Chemistry exam chapters (91 questions total). The audit covered: CBSE/NCERT 2026-27 compliance, factual accuracy, duplicate detection, numerical correctness, answer key correctness, Bloom's taxonomy balance, Assertion-Reason correctness, hint correctness, step correctness, topic coverage, difficulty distribution accuracy, tag consistency, weak-student suitability, teaching quality, and curriculum authority.

**Verdicts:**

| Chapter | Questions | Verdict | Issues found | Fixes applied |
|---|---|---|---|---|
| Ch02 — Exploring Mixtures | 31 | CONDITIONAL PASS → PASS | 4 | 4 |
| Ch03 — Atoms and Molecules | 30 | PASS | 0 | 0 |
| Ch04 — Structure of the Atom | 30 | PASS | 0 | 0 |

**Issues found and fixed in Ch02:**

| Fix ID | ID(s) affected | Issue | Resolution |
|---|---|---|---|
| F1 | ch02-cmp-003 | "roughly 10–300 nm" for milk's colloidal particles contradicts the NCERT-standard 1–100 nm colloid range | Changed to "1–100 nm per NCERT definition" |
| F2 | ch02-nce-005 | "(1–100 µm range)" for fog in answer text and step — µm (micrometres) are 1000× larger than nm, contradicting the colloid definition stated in the same chapter | Removed µm size qualifier; replaced with "classified as a colloidal aerosol in NCERT" in both answer and step |
| F3 | ch02-pyq-001 | Near-duplicate of nce-011 (both asked for chromatography principle + dye separation at the same cognitive level, ≈80% answer overlap) | Converted pyq-001 to an Rf value calculation question (two-dye scenario with quantitative Rf computation + adsorption interpretation + substance identification) — a distinct skill not tested elsewhere in the bank |
| F4 | ch02 file header | Header declared Easy=10, Medium=14 but actual counts were Easy=9, Medium=16 | Updated header comment to match actual distribution |

**All numericals independently verified:**
- Ch02: NaCl w/w% = 10% ✅; saline 4.5 g ✅; Rf values 0.75 and 0.25 (new pyq-001) ✅
- Ch03: Al₂O₃ stoichiometry 6.12 g ✅; Cu oxide ratio 1:2 ✅; all mole concept calculations ✅; aspirin M=180 (C₉H₈O₄) ✅
- Ch04: All electronic configurations ✅; Cl avg mass 35.5 u ✅; isobar/isotope neutron counts ✅; D₂O physical properties ✅

**TypeScript status:** `pnpm --filter @workspace/homework-hero run typecheck` — clean exit, zero errors, after all fixes.

**Evidence source:** Direct file audit against NCERT Class 9 Science textbook definitions and CLASS9_CURRICULUM_BASELINE.md.
**Confidence:** HIGH
**Status:** CLOSED — all three chapters are PASS. Content is ready for gateway registration and launch gating.

---

### DEC-015 — Biology Ch01 "The Fundamental Unit of Life" authored and verified

**Decision:** 75 questions authored for Class 9 Biology Chapter 1 with full V2 metadata. One invalid tag (`STANDARD_TAGS.HOTS_EQUIVALENT`) was identified and removed from `cmp-003`; `STANDARD_TAGS.BOARD_IMPORTANT` (already present in the same array) covers the intent.

**Content summary:**

| Dimension | Detail |
|---|---|
| File | `question-bank/questions/biology/class9/ch01-the-fundamental-unit-of-life.ts` |
| Total questions | 75 |
| Difficulty | Easy 30 · Medium 30 · Hard 15 |
| Topics | t1 Cell Theory 20q · t2 Cell Membrane/Wall 25q · t3 Organelles 30q |
| Types | con 14 · nce 16 · cmp 12 · asr 10 · hot 13 · pyq 10 |
| Duplicate IDs | None |
| Invalid tags | None (after fix) |

**Verification results (2026-07-13):**
- TypeScript (`pnpm --filter @workspace/homework-hero run typecheck`): PASS — clean exit, zero errors.
- Curriculum gateway: Biology slug `fundamental-unit-of-life` detected in ch01 filename — PASS. No Biology failures in `curriculum-check` output.
- Bank audit: Biology is outside the bank-audit script scope (Mathematics only by design) — not a defect.
- Adapter wiring: `CH01_THE_FUNDAMENTAL_UNIT_OF_LIFE` imported and spread into `CLASS9_BIOLOGY_QUESTIONS` in `class9-biology.ts`.

**Evidence source:** Direct repository inspection; `tagging.ts` STANDARD_TAGS vocabulary; TypeScript compiler; `curriculum-check` output.
**Confidence:** HIGH
**Status:** CLOSED — Ch01 is content-complete and verified.

---

### DEC-013 — Governance reconstruction session completed

**Decision (session record):** A formal project-state reconstruction was performed at the start of the 2026-07-09 session. All four governance documents were read in full. Project state was confirmed as follows:

- **No changes were made to product code.** All work in the session was documentation only.
- **No decisions were reversed or reopened.** DEC-001 through DEC-011 remain as recorded.
- **Blockers confirmed unchanged:** Biology live dead-end (B1), Chemistry zero exam content (B2), gateway unregistered for Chemistry/Biology (B3), stale internal docs (B4).
- **Next task confirmed:** Documentation + gateway registration pass — register `9-Chemistry` and `9-Biology` in `EXPECTED` map; supersede stale internal curriculum docs. Zero content authoring, zero new curriculum research required.

**Evidence source:** Governance documents (this folder) + direct repository inspection.
**Confidence:** HIGH
**Status:** CLOSED — reconstruction complete. Project state is fully understood. Implementation may proceed on the confirmed next task.

---

## 2026-07-13

---

### DEC-016 — Academic Library Index frozen as the canonical source library

**Decision:** `docs/governance/ACADEMIC_LIBRARY_INDEX.md` is frozen at v1.0 as the canonical record of all official Government of India academic sources held for SnapSolve. No chapter, topic, curriculum mapping, gateway rule, or content file may be created or modified unless it is traceable to a source listed in this index.

**Rationale:** Formalises the source-library governance rule. Provides a single authoritative reference that any session, developer, or auditor can consult to verify whether a curriculum claim has official backing.

**Change-control rule recorded in document:** Modifications permitted only on official NCERT release, official CBSE curriculum revision, or discovery of a factual error against an official Government source.

**Evidence source:** Product/CEO decision — governance document, not a curriculum fact.
**Confidence:** HIGH
**Status:** ACTIVE — binding on all curriculum and content decisions.
