# ROADMAP.md

**Document type:** Sequenced delivery plan — derived from confirmed governance facts only.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-09
**Sources:** `PROJECT_STATUS.md` (blockers, next task), `PROJECT_MASTER_CONTEXT.md` (scope, priority order), `PROJECT_MEMORY.md` (chapter lists, architecture), `GOVERNANCE_AUDIT.md` (findings C-01 through C-08), `DECISION_LOG.md` (DEC-001 through DEC-013).

**Reading this document:**
- Each phase lists tasks in dependency order — do not skip ahead.
- Evidence requirements (DEC-002) apply to every curriculum item. No authoring begins without a confirmed official-source citation already on file.
- Estimated question deficits are internal estimates, not CBSE minimums. Do not treat them as external commitments.
- The Priority order (Mathematics → Science → CA → IT → AI → CT+AI) is set by DEC-001 and is not revisable without CEO approval.

---

## Current state snapshot (2026-07-09)

| Subject / Domain | Launch gate | Blocker |
|---|---|---|
| Mathematics — Classes 6, 7, 8, 9 | **OPEN** | None — ready to launch |
| Class 9 Physics | **PARTIAL** | Gravitation label; Simple Machines gap |
| Class 9 Chemistry | **CLOSED** | 0 questions in 3 official exam chapters; not gateway-registered |
| Class 9 Biology | **CLOSED** | 0 questions, 0 wiring, live dead-end in UI; not gateway-registered |
| Class 9 Science (unified) | **CLOSED** | Both Chemistry and Biology closed |
| Class 9 CA / IT / AI | **NOT STARTED** | Not started |
| Classes 6–8 Science | **NOT STARTED** | Not started |
| Classes 6–8 CT+AI | **NOT STARTED** | Not started |

---

## Phase 0 — Live defect fixes and governance cleanup

**Dependency:** None — all Phase 0 tasks are independent of each other and of new content.
**Blocks:** Everything else — these must be done before any Phase 1 implementation.

These are not new features. They correct known errors in the current codebase and governance record. None requires curriculum research or content authoring.

---

### P0-A — Fix `replit.md` class range and question count

**Type:** Documentation
**Severity:** CRITICAL (Finding C-01, GOVERNANCE_AUDIT.md)

`replit.md` currently reads "Class 6–12 students" and "150-question structured bank (Class 9 Maths)." Both are wrong. Any session or developer reading the README first starts with incorrect assumptions.

**Actions:**
1. Change "Class 6–12" → "Class 6–9" in `replit.md` line 3.
2. Update question count: "150-question structured bank (Class 9 Maths)" → current count (584 per status report; note the 2-script discrepancy).
3. Update subject coverage in the Product section to reflect actual current state.

---

### P0-B — Fix `Practice.tsx` subject list and `subjects.ts` type

**Type:** Code — one targeted edit in `Practice.tsx` and `subjects.ts`
**Severity:** CRITICAL (Findings C-02, C-03, C-04, DEC-011)

`Practice.tsx` `ALL_SUBJECTS` currently: `["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"]`

Problems:
- **Biology** — zero content, zero wiring → silent dead-end for any student who selects it (DEC-011, BLOCKER 1 in PS)
- **Economics** — out of approved scope per DEC-010; must not be marketed to students
- **Computer Science** — not in approved scope (approved subjects are CA, IT, AI — not "Computer Science"); no governance record; unknown content state (GOVERNANCE_AUDIT.md C-03)
- **Physics, Chemistry, Biology** — should not appear as top-level student-facing subject names; internal domains only (DEC-001, PMC Section 3)

**Actions:**
1. Hide Biology in `ALL_SUBJECTS` or replace with a "Coming Soon" state.
2. Hide or remove Economics from `ALL_SUBJECTS` (out of scope per DEC-010).
3. Audit "Computer Science" — determine if it has any content in `index.ts`; hide or remove.
4. Remove Physics, Chemistry, Biology as top-level `ALL_SUBJECTS` entries. Science (unified) is the student-facing subject for Class 9.
5. Update `subjects.ts` `Subject` type to reflect the corrected list.

**Note:** This fix does not require content authoring. It only changes what is selectable in the UI.

---

### P0-C — Supersede stale internal curriculum documents

**Type:** Documentation
**Severity:** HIGH (BLOCKER 4 in PS, DEC-007)

`PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` and `GATEWAY_CHANGE_APPROVAL.md` still reference the pre-2026-27 chapter structure and treat the Gravitation dispute as open. DEC-007 and DEC-008 closed both. These documents have not been updated.

**Actions:**
1. Add a supersession notice to `GATEWAY_CHANGE_APPROVAL.md`: mark it superseded by `CLASS9_SCIENCE_EXECUTIVE_DECISION.md` (date and DEC-007 reference).
2. Add a supersession notice to `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`: mark it superseded by `CLASS9_SCIENCE_LAUNCH_READINESS.md` and `docs/GOVERNANCE/PROJECT_STATUS.md`.

---

### P0-D — Update `PROJECT_STATUS.md` governance table

**Type:** Documentation
**Severity:** MEDIUM (Finding O-03, GOVERNANCE_AUDIT.md)

PS governance table says "DECISION_LOG.md — Complete — 11 decisions recorded." There are now 13 decisions (DEC-001 through DEC-013).

**Action:** Update the row to "Complete — 13 decisions recorded."

---

### P0-E — Update `CHECKPOINT_GATEWAYS.md` Gate 4 condition U3

**Type:** Documentation
**Severity:** HIGH (Finding C-05, GOVERNANCE_AUDIT.md)

CG Gate 4 U3 is marked OPEN with the note "Physics/Chemistry/Biology not surfaced as top-level subjects (correct)." This is incorrect — they are in `Practice.tsx` `ALL_SUBJECTS` today. U3 must be marked CLOSED until P0-B is implemented.

**Action:** Change U3 status to CLOSED; update the blocking condition note. Revert to OPEN after P0-B is verified.

---

## Phase 1 — Class 9 Science completion

**Dependency:** Phase 0 complete (especially P0-B gateway fix, P0-C documentation).
**Priority:** Highest — Science is the second-priority subject (DEC-001) and is the current launch blocker.

---

### P1-A — Register `9-Chemistry` in curriculum gateway

**Type:** Code — `scripts/src/curriculumGateway.ts`
**Severity:** HIGH (BLOCKER 3 in PS)
**Dependency:** None (pure code change, no content required)

Add `9-Chemistry` to the `EXPECTED` map using the confirmed 2026-27 chapter list (all evidence already on file in `CLASS9_SCIENCE_LAUNCH_READINESS.md` and DEC-007/DEC-009):

| Gateway key | Chapter name | Exam status |
|---|---|---|
| `ch01-matter-in-our-surroundings` | Matter in Our Surroundings | `cbseDeleted: true` — non-exam |
| `ch02-exploring-mixtures` | Exploring Mixtures and their Separation | Active exam chapter (official Ch5) |
| `ch03-atoms-and-molecules` | Atoms and Molecules | Active exam chapter (official Ch9) |
| `ch04-structure-of-the-atom` | Structure of an Atom | Active exam chapter (official Ch8) |

**Run gateway after:** `pnpm --filter @workspace/scripts run curriculum-check` — expect FAIL (0-question exam chapters) until content is authored (P1-C).

---

### P1-B — Register `9-Biology` in curriculum gateway

**Type:** Code — `scripts/src/curriculumGateway.ts`
**Severity:** HIGH (BLOCKER 3 in PS)
**Dependency:** None (pure code change, no content required)

Add `9-Biology` to the `EXPECTED` map using the confirmed 2026-27 chapter list (evidence on file in `CLASS9_SCIENCE_LAUNCH_READINESS.md`):

| Gateway key | Chapter name | Exam status |
|---|---|---|
| `ch02-cell` | Cell — The Fundamental Unit of Life | Active exam chapter (official Ch2) |
| `ch03-tissues` | Tissues | Active exam chapter (official Ch3) |
| `ch11-reproduction` | Reproduction in Plants and Animals | Active exam chapter (official Ch11) |
| `ch12-diversity` | Diversity in Living Organisms | Active exam chapter (official Ch12) |

**Run gateway after:** `pnpm --filter @workspace/scripts run curriculum-check` — expect FAIL (0 questions) until content is authored (P1-D).

---

### P1-C — Author Class 9 Chemistry exam chapters

**Type:** Content authoring
**Severity:** CRITICAL (BLOCKER 2 in PS)
**Dependency:** P1-A (gateway must be registered before authoring begins)

Three empty scaffold files exist in `question-bank/questions/chemistry/class9/`:
- `ch02-is-matter-around-us-pure.ts` — rename to `ch02-exploring-mixtures-and-their-separation.ts`; remove `// @ts-nocheck`; author questions
- `ch03-atoms-and-molecules.ts` — remove `// @ts-nocheck`; author questions
- `ch04-structure-of-the-atom.ts` — rename to `ch04-structure-of-an-atom.ts`; remove `// @ts-nocheck`; author questions

**Before starting:**
- Update all three scaffold file names to match official 2026-27 chapter names (the current names are stale — DEC-009 finding in PM).
- Update `class9-chemistry.ts` adapter to reference new file names.
- Remove all `// @ts-nocheck` suppressions before adding any question content (AR3, CG Gate 6).

**Evidence on file:** `CLASS9_SCIENCE_LAUNCH_READINESS.md`, DEC-007, DEC-009.

---

### P1-D — Scaffold and author Class 9 Biology

**Type:** Code + content authoring
**Severity:** CRITICAL
**Dependency:** P1-B (gateway registered); P0-B (Biology hidden in UI until content exists)

Biology has no source files, no adapter, and no `index.ts` wiring. Full scaffolding required before any authoring.

**Scaffolding steps (in order):**
1. Create `question-bank/questions/biology/class9/` directory with four chapter files matching the confirmed gateway keys from P1-B.
2. Create `artifacts/homework-hero/src/data/questions/class9-biology.ts` adapter — follow the Chemistry adapter pattern (`class9-chemistry.ts`), not the Physics V1 per-chapter pattern (PMC Section 7, PM Architecture).
3. Wire Biology into `index.ts` (`ALL_CHAPTERS` and `ALL_QUESTIONS`).
4. Run gateway: expect FAIL → PASS as questions are added.

**After scaffolding:** Author questions for all four chapters. Run `pnpm --filter @workspace/scripts run curriculum-check` after each chapter to confirm no regressions.

---

### P1-E — Physics: resolve Gravitation and Simple Machines

**Type:** Code + (if kept) content authoring
**Severity:** MEDIUM — not a launch blocker; Physics is already PARTIAL-launchable
**Dependency:** None

Two open items:

**Gravitation (25q, `class9-physics-ch3.ts`):**
A product decision is pending (DEC-008): keep as enrichment content with a non-exam disclaimer, or deprecate. No code change until the decision is made. Options:
- **Option A — Label:** Add `cbseDeleted: true` to the Gravitation gateway entry; add a "Non-exam enrichment" label in the Practice UI for this chapter.
- **Option B — Deprecate:** Remove from `index.ts`; 25 questions are no longer student-visible. File retained in history.

**Simple Machines (missing sub-topic in `class9-physics-ch4.ts` — Work and Energy):**
`class9-physics-ch4.ts` covers Work and Energy but is missing the Simple Machines sub-topic confirmed present in the official 2026-27 chapter "Work, Energy and Simple Machines" (official Ch7). Additional questions needed to cover this sub-topic.

---

## Phase 2 — Class 9 technology subjects

**Dependency:** Phase 1 substantially complete (Science must not be deprioritised for these).
**Priority order (DEC-001):** CA → IT → AI

Each of these subjects requires:
1. Official curriculum audit (official chapter list, subject code confirmation)
2. Governance review and DECISION_LOG entry
3. Gateway registration
4. Content authoring
5. UI wiring

None has been started. No curriculum research has been done. Do not begin any subject in this phase without completing the official-source audit step first.

| Subject | CBSE Subject Code | Status |
|---|---|---|
| Computer Applications (CA) | 165 | Not started |
| Information Technology (IT) | 402 | Not started |
| Artificial Intelligence (AI) | 417 | Not started |

---

### P2-A — Class 9 Computer Applications (CA)

1. Fetch and review official CBSE Class 9 CA syllabus (`cbseacademic.nic.in`, Subject Code 165).
2. Record confirmed chapter list in a new `CLASS9_CA_AUDIT.md`.
3. Add DL entry for the audit decision.
4. Register in curriculum gateway.
5. Author questions.
6. Wire into `index.ts` and Practice UI.

---

### P2-B — Class 9 Information Technology (IT)

Same sequence as P2-A, Subject Code 402.

---

### P2-C — Class 9 Artificial Intelligence (AI)

Same sequence as P2-A, Subject Code 417.

---

## Phase 3 — Classes 6–8 non-Mathematics subjects

**Dependency:** Phase 2 complete.
**Priority order (DEC-001):** Science (6–8) → Computational Thinking and AI (6–8)

No curriculum research has been done for any of these. Every subject requires an official-source audit before any content work begins.

| Subject | Classes | Status |
|---|---|---|
| Science | 6, 7, 8 | Not started |
| Computational Thinking and AI | 6, 7, 8 | Not started |

---

### P3-A — Classes 6–8 Science

For each class (6, 7, 8):
1. Fetch CBSE/NCERT Class {N} Science syllabus and chapter list.
2. Record confirmed chapters in a governance audit doc.
3. Add DL entry.
4. Register in curriculum gateway.
5. Author questions.
6. Wire into `index.ts` and Practice UI.

**Architecture note:** Classes 6–8 Science questions will likely use V2 format (following the Mathematics pattern). Confirm before authoring begins.

---

### P3-B — Classes 6–8 Computational Thinking and AI

Same sequence as P3-A, per class.

---

## Standing items (no phase dependency)

These apply to every phase and must be checked at every session start.

| Item | Rule |
|---|---|
| Run curriculum gateway before and after every curriculum-adjacent change | `pnpm --filter @workspace/scripts run curriculum-check` |
| No authoring without official-source evidence on file | DEC-002 |
| No speculative implementation | PMC Section 8 |
| One authoritative audit per subject per syllabus cycle | PMC Section 8 |
| Biology must be hidden in UI until P1-D is complete | DEC-011, P0-B |
| Chemistry Ch01 must be labeled non-exam or hidden until labeling is implemented | DEC-009 |
| Economics must not be marketed to students | DEC-010 |
| "Computer Science" UI presence must be resolved (hide or reclassify) | GOVERNANCE_AUDIT.md C-03 |
| Restart protocol must be followed at the start of every session | PMC Section 9 |

---

## What this roadmap does not cover

- **Exact question counts per chapter** — these are internal authoring targets, not CBSE minimums. Do not treat them as external commitments.
- **Timeline dates** — no deadline other than "before the 2026 Half-Yearly examinations" (PMC Section 2). Sequencing is by dependency and priority, not by calendar date.
- **Feature additions** — this roadmap covers curriculum content and correctness only. New product features (new UI flows, new AI capabilities, etc.) are out of scope here.
- **Class 10–12** — explicitly out of approved scope. Do not begin any work for these classes.
