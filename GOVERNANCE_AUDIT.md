# GOVERNANCE_AUDIT.md

**Version:** 1.0
**Status:** FROZEN — changes only with CEO approval.
**Document type:** Cross-document consistency audit — read-only. No files were modified.
**Date:** 2026-07-09
**Auditor:** Agent (no code changes made)
**Scope:** Five governance documents compared against each other and against the live repository across 10 audit dimensions.

**Documents audited:**
1. `docs/GOVERNANCE/PROJECT_MASTER_CONTEXT.md` (PMC)
2. `docs/GOVERNANCE/PROJECT_MEMORY.md` (PM)
3. `docs/GOVERNANCE/PROJECT_STATUS.md` (PS)
4. `docs/GOVERNANCE/DECISION_LOG.md` (DL)
5. `docs/GOVERNANCE/CHECKPOINT_GATEWAYS.md` (CG)

**Repository files cross-checked:**
- `artifacts/homework-hero/src/pages/Practice.tsx` — live subject list
- `artifacts/homework-hero/src/data/subjects.ts` — Subject type and SubjectConfig
- `artifacts/homework-hero/src/data/questions/index.ts` — runtime question registry
- `replit.md` — project README

**Severity ratings:**
- **CRITICAL** — actively misleads a future session or causes wrong implementation
- **HIGH** — gap that will cause friction or incorrect decisions
- **MEDIUM** — inconsistency that needs correction but does not immediately block work
- **LOW** — minor cleanup, duplicate content, or cosmetic inconsistency

---

## PART 1 — Findings by audit dimension

---

### Dimension 1 — Product objective

| Document | Coverage | Status |
|---|---|---|
| PMC Section 1 | Full statement with feature list | ✓ |
| PM | No product objective — jumps directly to architecture | MISSING |
| PS | No product objective — starts with completed work | MISSING |
| DL | DEC-001 rationale references the goal implicitly | Partial |
| CG | No product objective | MISSING |

**Finding 1.1 — CRITICAL — `replit.md` states Class 6–12; governance says Class 6–9**
`replit.md` (the project README) reads: *"AI-powered homework and practice platform for **Class 6–12** students covering Physics, Chemistry, and Mathematics."* Every governance document defines the scope as **Class 6–9**. This is a direct conflict between the authoritative scope definition and the primary developer-facing README. Any session that reads `replit.md` before the governance folder will start with a wrong class range assumption.

**Finding 1.2 — HIGH — `replit.md` question count is severely stale**
`replit.md` reads: *"150-question structured bank (Class 9 Maths)."* The actual count is 584 (status report) or 499 (gateway count). The README is outdated by a factor of ~4×.

**Finding 1.3 — MEDIUM — PM and PS have no product objective statement**
PM and PS have no opening statement of what SnapSolve is. If either is read in isolation (e.g., by a developer who skips PMC), there is no product context.

---

### Dimension 2 — Launch target

| Document | Coverage | Status |
|---|---|---|
| PMC Section 2 | "Ship before the 2026 Half-Yearly examinations" | ✓ |
| PM | Not mentioned | MISSING |
| PS | Date referenced in last-updated header only; not in any section body | MISSING |
| DL DEC-001 | "Half-Yearly 2026 examinations are the target deadline" | ✓ |
| CG | Not mentioned | MISSING |

**Finding 2.1 — MEDIUM — Launch target absent from PM and CG**
PM and CG have no reference to the launch deadline. A future session reading either document in isolation cannot derive the time constraint or urgency level from those documents alone.

**Finding 2.2 — LOW — PMC launch-blocking items list is dated 2026-07-08**
PMC Section 2 lists "Launch-blocking items as of 2026-07-08." This date stamp will age and become ambiguous as the document is updated. It would be clearer to reference PS blockers dynamically ("see `PROJECT_STATUS.md` — Current blockers") rather than embedding a dated snapshot in PMC.

---

### Dimension 3 — Subject scope

| Document | Coverage | Status |
|---|---|---|
| PMC Section 3 | Full table: Classes 6–8 (Maths, Science, CT&AI), Class 9 (Maths, Science, IT, CA, AI) | ✓ |
| PM | Only mentions Mathematics (Classes 6–8) and Physics/Chemistry/Biology/Economics (Class 9) — Science, CT&AI, IT, CA, AI absent | PARTIAL |
| PS | Only Mathematics and Class 9 Physics/Chemistry covered; Class 6–8 Science, CT&AI, IT, CA, AI absent | PARTIAL |
| DL DEC-001 | Full scope listed | ✓ |
| CG Gate 2 | Only Mathematics for Classes 6–8 and Science domains for Class 9; Science (6–8), CT&AI, IT, CA, AI absent | PARTIAL |

**Finding 3.1 — CRITICAL — "Computer Science" is live in the UI but absent from all governance documents**
`Practice.tsx` line 50: `ALL_SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"]`
`subjects.ts` defines a full `SubjectConfig` for `"Computer Science"` (icon, color, topic list).

"Computer Science" does not appear in any governance document — not as an approved subject, not as an out-of-scope subject, not as a flagged dead-end. The approved Class 9 tech subjects are **Computer Applications (CA)**, **Information Technology (IT)**, and **Artificial Intelligence (AI)**. "Computer Science" is none of these. It is almost certainly a legacy subject name that predates the governance scope freeze, and it is selectable by students with unknown content backing. No governance document flags this.

**Finding 3.2 — HIGH — Economics is out-of-scope but still live in the UI with no governance flag**
Economics appears in `Practice.tsx` `ALL_SUBJECTS` and has a `SubjectConfig` in `subjects.ts`. Governance (DEC-010, PMC Section 3) says Economics must not be marketed to students. However, no governance document flags Economics as a UI exposure problem — only Biology is flagged as a "live dead-end." Economics is in the same category: selectable in the UI, out of approved scope. The gateway runs for it and it passes, but that does not mean it should be student-facing.

**Finding 3.3 — HIGH — PM omits IT, CA, AI, and Classes 6–8 Science/CT&AI from scope**
PM's architecture section only describes question bank files that currently exist. It has no acknowledgment that IT, CA, AI, and Classes 6–8 Science and CT&AI are in the approved scope but not yet started. A developer reading PM alone would not know these subjects exist in the plan.

**Finding 3.4 — HIGH — CG Gate 2 has no rows for out-of-scope/not-started subjects**
Gate 2 (Question bank gate) only checks subjects with existing content. It has no rows for Classes 6–8 Science, CT&AI, or Class 9 IT/CA/AI. This means the gate cannot signal readiness (or lack thereof) for 60% of the approved subject scope. These should at minimum appear as "NOT STARTED" rows so the gate provides complete coverage of the full scope.

**Finding 3.5 — MEDIUM — PM still lists `class9-economics-ch{N}.ts` as a current file naming pattern**
PM's "Question bank file naming conventions" table includes `class9-economics-ch{N}.ts` as an active pattern. While accurate as a repo fact, it should note that Economics is out of scope — otherwise future sessions may treat it as a reference pattern for new subjects.

---

### Dimension 4 — Official curriculum policy (GOI sources only)

| Document | Coverage | Status |
|---|---|---|
| PMC Section 4 | Full rule, source list, governance gate, non-authoritative list | ✓ |
| PM | Referenced implicitly in decisions; no dedicated section | Partial |
| PS | Not stated | MISSING |
| DL DEC-002 | Recorded formally | ✓ |
| CG | Not stated; Gate 1 references official chapters but not the source rule itself | MISSING |

**Finding 4.1 — MEDIUM — CG Gate 1 enforces chapter-level correctness but not the source rule**
Gate 1 (Curriculum gate) checks chapter names, exam-inclusion flags, and question counts, but has no condition that says "evidence for each `cbseDeleted` decision must exist in a governance document citing an authoritative URL." Condition C7 comes close ("All authoritative source evidence is on file for every `cbseDeleted` decision") but does not state the source rule that defines what counts as authoritative evidence. A reader of CG alone cannot derive the DEC-002 rule from Gate 1 alone.

**Finding 4.2 — LOW — PS makes no reference to the official source rule**
PS's "Current next task" section instructs registering Chemistry and Biology in the gateway using "confirmed official chapter names" but never says where the confirmation must come from. If PS is read without PMC, the official-source constraint is not visible.

---

### Dimension 5 — Teaching philosophy

| Document | Coverage | Status |
|---|---|---|
| PMC Section 5 | Full statement: TeachingLesson, depth modes, quality pipeline, speed budget, privacy, resolution order, source field | ✓ |
| PM | Technical pipeline components described in "AI solve pipeline" section; no philosophy framing | Partial |
| PS | Teaching pipeline components listed as completed work only | Partial |
| DL | No teaching philosophy entry | MISSING |
| CG Gate 3 | Conditions derived from the philosophy but philosophy not stated | Partial |

**Finding 5.1 — MEDIUM — Teaching philosophy exists in PMC but is not cross-referenced from PM or CG**
PM and CG describe the technical implementation (TeachingLesson, pipeline, depth modes) without stating the underlying principle ("SnapSolve teaches — it does not merely answer"). Future implementation decisions may satisfy the technical gate conditions while violating the underlying intent, because the intent is not stated where implementation conditions are checked.

**Finding 5.2 — LOW — DL has no record of any teaching philosophy decision**
The TeachingLesson architecture, depth differentiation system, and quality pipeline represent significant architectural decisions. None appear in DL as formal entries. If these are ever revisited or challenged, there is no decision record to reference. Agent memory files (`.agents/memory/`) have entries for these, but DL does not.

---

### Dimension 6 — UI philosophy

| Document | Coverage | Status |
|---|---|---|
| PMC Section 6 | Full statement: mobile-first, no empty states, CBSE terminology, accuracy visible, Scan is entry point | ✓ |
| PM | Partially implied via "Biology is a live dead-end" and critical wiring rule | Partial |
| PS | "mobile-first" referenced in passing | Partial |
| DL | No UI philosophy entry | MISSING |
| CG Gate 4 | Conditions U1–U6 derive from the philosophy but philosophy not stated | Partial |

**Finding 6.1 — MEDIUM — CG Gate 4 condition U3 conflicts with the live repository**
U3 states: *"Student-facing subject names use official CBSE terminology, not internal domain labels — OPEN: Physics/Chemistry/Biology are not surfaced as top-level subjects (correct)."*
This is not fully accurate. `Practice.tsx` ALL_SUBJECTS includes `"Physics"`, `"Chemistry"`, `"Biology"`, and `"Economics"` as explicit top-level selectable subjects. U3 is marked OPEN when it should be PARTIAL or CLOSED — these names do appear to students in the subject selector even if the governance intent is for them to be internal only.

**Finding 6.2 — LOW — DL has no record of UI philosophy decisions**
The "mobile-first" and "no empty states" principles drove concrete implementation decisions (e.g., the Biology blocker was identified as a UI problem, not just a data problem). These are not recorded as DL entries with rationale.

---

### Dimension 7 — CEO / CTO constraints

| Document | Coverage | Status |
|---|---|---|
| PMC Section 8 | Full table: cash, time, no rewrites, no duplicate audits, no speculative implementation | ✓ |
| PM | Referenced implicitly in "Economics is out of scope" and "Gravitation" decisions | Partial |
| PS | Implied by "Recommended: … zero content authoring" but not stated | Partial |
| DL DEC-001 | Rationale references "cash and time constraints" | Partial |
| CG | Not mentioned | MISSING |

**Finding 7.1 — MEDIUM — CG has no CEO/CTO constraint reference**
CG defines 7 gates with detailed conditions but never states the overarching constraint that governs when to stop and defer rather than push forward. "Cash constrained / time constrained / no speculative implementation" are the meta-rules that explain why gates matter. Without them, CG reads as an ideal checklist with no operating context.

---

### Dimension 8 — Architecture principles

| Document | Coverage | Status |
|---|---|---|
| PMC Section 7 | Non-negotiable rules table, layer diagram, AI pipeline diagram | ✓ |
| PM | Architecture section: layer table, naming conventions, two-format coexistence, gateway, AI pipeline | ✓ |
| PS | Brief gateway references | Partial |
| DL | No dedicated architecture decisions | MISSING |
| CG Gate 6 | Conditions AR1–AR8 | ✓ |

**Finding 8.1 — HIGH — PMC and PM duplicate architecture content in different formats**
PMC Section 7 and PM's Architecture section cover the same ground — layer order, format coexistence, gateway, AI pipeline — using different presentation formats (table vs. bullet list; diagram vs. prose). Neither cites the other. A future editor updating one will likely not update the other, creating drift. One should be the definitive source and the other should reference it.

**Finding 8.2 — HIGH — DL has no architecture decision entries**
DL contains gateway-fix decisions and scope decisions but no entries for: V1/V2 format coexistence (why), TeachingLesson replacing steps[] (why), deterministic planner replacing LLM planner (why), Chemistry using the adapter pattern (why), `parseV1Meta` regex fix (why). These decisions exist in agent memory (`MEMORY.md`) but not in the project-facing DL. They are at risk of being reversed by a future session without awareness of the prior reasoning.

**Finding 8.3 — MEDIUM — PMC's "generated" date is misleading**
PMC header says `Generated: 2026-07-08` but the document was substantially revised on 2026-07-08 and then not updated on 2026-07-09 (only PS and DL were updated that day). A `Last updated:` field would be less ambiguous than `Generated:`.

---

### Dimension 9 — Gateway rules

| Document | Coverage | Status |
|---|---|---|
| PMC Section 4 (gate) + Section 7 | Evidence gate + architecture rule | ✓ |
| PM | Curriculum gateway section | ✓ |
| PS | Blocker 3 + pending work references | ✓ |
| DL DEC-003 through DEC-006 | Individual gateway decisions | ✓ |
| CG | 7 gates, comprehensive | ✓ |

**Finding 9.1 — HIGH — CG Gate 2 reports Class 9 Physics as having 100 exam questions but this figure is derived, not directly verified**
CG Gate 2 question count table states "Class 9 Physics: 4 official | 100 (Gravitation 25q non-exam excluded) | 125." The "100" figure is a manual subtraction (125 total minus 25 Gravitation), not a gateway-verified count. Since Gravitation has no `cbseDeleted` flag in the gateway, the gateway itself does not enforce this exclusion — it sees 125 questions across 5 chapters, all passing. The "100 exam questions" number is a governance calculation, not a verified system output. The table should clarify this.

**Finding 9.2 — MEDIUM — PS says BLOCKER 1 (Biology UI fix) has "Dependency: None" but the next task section sequences it after gateway registration**
PS BLOCKER 1: *"Dependency: None — this is a one-line UI fix."*
PS Current next task, "What follows": item 1 is "Biology UI fix (hide or gate Biology in Practice.tsx — one-line change, no content dependency)" — listed as coming after the gateway registration task.

These two statements conflict. If dependency is truly None, the Biology UI fix could and arguably should happen independently and immediately, not after gateway registration. The sequencing in "What follows" implies a dependency that the blocker entry explicitly denies.

**Finding 9.3 — MEDIUM — PM notes Economics is gateway-registered but doesn't flag that this conflicts with out-of-scope status**
PM: *"Currently registered keys: `6-Mathematics`, `7-Mathematics`, `8-Mathematics`, `9-Mathematics`, `9-Economics`, `9-Physics`"*
The presence of `9-Economics` in the registered list is noted as a fact but not flagged as a tension: the gateway actively validates and passes Economics content, lending it an implicit "approved" status that contradicts DEC-010 (out of scope). CG Gate 7 (Release gate) also does not include Economics as a column — it is simply absent, which is cleaner, but PM's gateway section doesn't explain why Economics remains registered if it is out of scope.

**Finding 9.4 — LOW — CG's last verified run date (2026-07-08) has not been updated to reflect the 2026-07-09 audit session**
The 2026-07-09 governance reconstruction session read the gateway state but did not re-run `curriculum-check`. CG still shows the 2026-07-08 run as the last verified run. This is technically accurate (no new run happened) but may be misleading when the document itself was conceptually confirmed on 2026-07-09.

---

### Dimension 10 — Restart protocol

| Document | Coverage | Status |
|---|---|---|
| PMC Section 9 | Full 5-step protocol with conflict resolution rule | ✓ |
| PM | "How to use this file" preamble — partial, covers PM only | Partial |
| PS | Not mentioned | MISSING |
| DL DEC-013 | References the reconstruction session and protocol | Partial |
| CG | Not mentioned | MISSING |

**Finding 10.1 — MEDIUM — Restart protocol only fully stated in PMC; not cross-referenced from PM or CG**
PM and CG are both designated as documents to read at session start (per PMC's restart protocol), but neither PM nor CG reminds the reader to follow the restart protocol or refers back to PMC for the full procedure. If someone starts a session by reading CG first (e.g., to check gate status), they will not be directed to the restart protocol.

**Finding 10.2 — LOW — PMC restart protocol lists 4 documents to read but PM is not in the list**
PMC Section 9 Step 1 lists: PMC, PS, DL, CG. PROJECT_MEMORY.md is not in the restart reading list, even though PMC's own preamble says "Read this file first" (where "this file" is PMC) and PM's own preamble says "Read this before any planning, auditing, or implementation session." The two preambles conflict on whether PM is mandatory reading at session start.

---

## PART 2 — Summary tables

### Missing items by document

| Item | PMC | PM | PS | DL | CG |
|---|---|---|---|---|---|
| Product objective | ✓ | ✗ | ✗ | Partial | ✗ |
| Launch target | ✓ | ✗ | ✗ | ✓ | ✗ |
| Classes 6–8 Science, CT&AI in scope | ✓ | ✗ | ✗ | ✓ | ✗ |
| Class 9 IT, CA, AI in scope | ✓ | ✗ | ✗ | ✓ | ✗ |
| "Computer Science" UI exposure | ✗ | ✗ | ✗ | ✗ | ✗ |
| Economics UI exposure flagged | ✗ | ✗ | ✗ | ✗ | ✗ |
| Teaching philosophy | ✓ | Partial | ✗ | ✗ | Partial |
| UI philosophy | ✓ | Partial | ✗ | ✗ | Partial |
| CEO/CTO constraints | ✓ | Partial | ✗ | Partial | ✗ |
| Architecture decision rationale (DL entries) | ✓ | ✓ | ✗ | ✗ | ✗ |
| Restart protocol | ✓ | ✗ | ✗ | ✗ | ✗ |

### Conflicts found

| # | Conflict | Severity | Between |
|---|---|---|---|
| C-01 | `replit.md` says Class 6–12; governance says Class 6–9 | CRITICAL | replit.md ↔ All governance docs |
| C-02 | `Practice.tsx` lists Physics, Chemistry, Biology as student-selectable top-level subjects; governance says they are internal domains only | CRITICAL | Repo ↔ PMC/PM/DL |
| C-03 | "Computer Science" is live in the UI and has a SubjectConfig, but is absent from all governance documents (not approved, not flagged) | CRITICAL | Repo ↔ All governance docs |
| C-04 | Economics is out-of-scope per governance but live and selectable in the UI with no governance flag for UI removal | HIGH | PMC/DL ↔ Repo |
| C-05 | CG Gate 4 condition U3 is marked OPEN ("Physics/Chemistry/Biology not surfaced as top-level subjects — correct") but they ARE in `Practice.tsx` ALL_SUBJECTS | HIGH | CG ↔ Repo |
| C-06 | PS BLOCKER 1 says Biology UI fix has "Dependency: None" but the next-task sequencing places it after gateway registration | MEDIUM | PS (internal) |
| C-07 | PM architecture section and PMC Section 7 duplicate the same content in different formats with no cross-reference | MEDIUM | PMC ↔ PM |
| C-08 | PMC lists launch blockers "as of 2026-07-08" as a static snapshot, conflicting with PS as the intended living record of blockers | LOW | PMC ↔ PS |

### Outdated items

| # | Outdated item | Location | Correct value |
|---|---|---|---|
| O-01 | "Class 6–12 students" | `replit.md` line 3 | Class 6–9 |
| O-02 | "150-question structured bank (Class 9 Maths)" | `replit.md` Product section | 584 questions (status report) / 499 (gateway) |
| O-03 | "Complete — 11 decisions recorded" for DECISION_LOG.md | PS governance documentation table | 13 decisions (DEC-001 through DEC-013) |
| O-04 | `Generated: 2026-07-08` in PMC header | PMC | Should be `Last updated: 2026-07-08` or updated to 2026-07-09 |
| O-05 | CHECKPOINT_GATEWAYS.md `Last updated: 2026-07-08` | CG | Reviewed but not re-run on 2026-07-09 — may be noted as confirmed-not-changed |

### Duplicate content

| # | Content | Locations | Risk |
|---|---|---|---|
| D-01 | Question bank layer order (table in PM / diagram in PMC) | PMC Section 7, PM Architecture | Drift if one is updated without the other |
| D-02 | AI pipeline description (diagram in PMC / bullets in PM) | PMC Section 7, PM AI solve pipeline | Drift |
| D-03 | Gateway registration list (PM + CG) | PM Curriculum gateway, CG multiple gates | Drift |
| D-04 | Biology dead-end description | PM Architectural decisions, PS BLOCKER 1, CG Gate 2/4, DL DEC-011 | High repetition; acceptable for a cross-referenced system |
| D-05 | Non-exam chapter list (Gravitation, Chemistry Ch01) | PM, PS, CG, DL | High repetition; acceptable |

---

## PART 3 — Prioritised action list

The following actions are ordered by severity. All are documentation changes unless noted.

| Priority | Finding | Action |
|---|---|---|
| 1 | C-01, Finding 1.1 | Update `replit.md`: change "Class 6–12" to "Class 6–9"; update question count from "150" to current figure |
| 2 | C-03, Finding 3.1 | Add "Computer Science" to governance docs: flag it as an unresolved UI subject not in approved scope; decide: hide in UI (like Biology) or reclassify |
| 3 | C-02, Finding 6.1 | Fix CG Gate 4 condition U3: mark as CLOSED or PARTIAL — Physics, Chemistry, Biology, Economics are all in Practice.tsx ALL_SUBJECTS as student-selectable top-level subjects, contradicting governance intent |
| 4 | C-04, Finding 3.2 | Add Economics to governance as a UI exposure flag (same category as Biology dead-end); Economics is out of scope per DEC-010 but is still selectable in the UI |
| 5 | O-03 | Update PS governance documentation table: DECISION_LOG.md row should read "Complete — 13 decisions recorded" |
| 6 | Finding 3.3, 3.4 | Update PM and CG to acknowledge IT, CA, AI, Classes 6–8 Science, and CT&AI as in-scope-but-not-started; add "NOT STARTED" rows to CG Gate 2 |
| 7 | C-06, Finding 9.2 | Resolve the Biology UI fix dependency conflict in PS: either change BLOCKER 1 dependency from "None" to "After gateway registration" or move the Biology UI fix to first in the next-task sequencing |
| 8 | Finding 8.2 | Add DL entries for key architecture decisions: V1/V2 format coexistence, TeachingLesson replacing steps[], deterministic planner decision, Chemistry adapter pattern, parseV1Meta regex fix |
| 9 | Finding 5.2, 6.2 | Add DL entries for teaching philosophy and UI philosophy decisions — these are architectural choices that need rationale on record |
| 10 | C-07, Finding 8.1 | Designate PM as the canonical architecture reference and have PMC Section 7 reference PM rather than duplicate it, or vice versa |
| 11 | Finding 2.1, 10.1 | Add launch target and restart protocol cross-references to PM and CG headers |
| 12 | O-04 | Change PMC header from `Generated:` to `Last updated:` |
| 13 | Finding 9.1 | Clarify in CG Gate 2 that the "100 exam questions" for Physics is a governance calculation, not a gateway-verified count |
| 14 | Finding 9.3 | Add a note in PM's gateway section explaining why Economics remains gateway-registered despite being out of scope |

---

## PART 4 — Items consistent across all five documents

The following are confirmed consistent and do not require any action:

- Gravitation is not a 2026-27 chapter — closed, agreed across PM/PS/DL/CG
- Chemistry Ch01 ("Matter in Our Surroundings") is non-exam — consistent
- `OPENAI_API_KEY` is server-side only — consistent
- Two-layer cache (localStorage + server Map, 7-day TTL) — consistent
- Resolution order (bank → OpenAI → fallback) — consistent
- `cbseDeleted: true` flag semantics — consistent
- GC-01, GC-04 are closed — consistent
- GC-05 is blocked pending evidence — consistent
- Biology is a live dead-end — consistent (though incomplete, see C-03)
- Teaching quality pipeline is complete (7 conditions, all OPEN) — consistent
- AI gate is fully OPEN — consistent
- Mathematics (Classes 6–9) is release-ready — consistent
- The official sources rule (CBSE/NCERT/MoE only) — consistent
- Economics is out of approved scope — consistent

---

## PART 5 — Audit verdict

**The governance framework is internally coherent on closed decisions but has material gaps on live repository state.**

The five documents agree on what has been decided. They disagree — or are silent — on what the repository actually contains right now. The three most urgent discrepancies are:

1. **`replit.md` says Class 6–12.** This is the document most likely to be read first by any new session or developer. It directly contradicts the governance scope.

2. **"Computer Science" is a live student-selectable subject in the UI** and is not mentioned in any governance document. It is not in the approved subject scope. It is a blind spot.

3. **CG Gate 4 U3 is marked OPEN ("Physics/Chemistry/Biology not surfaced as top-level subjects") when the repository shows they are still in `Practice.tsx` `ALL_SUBJECTS`.** This means the UI gate is reporting a false positive on one of its conditions.

No code was changed. This document records findings only.
