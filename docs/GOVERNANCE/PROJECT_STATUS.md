# PROJECT_STATUS.md

**Document type:** Living status record — updated after every significant work session.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-13
**Sources:** `GATEWAY_FIX_VERIFICATION.md`, `CLASS9_SCIENCE_LAUNCH_READINESS.md`, `CLASS9_SCIENCE_EXECUTIVE_DECISION.md`, direct repository inspection, governance reconstruction session 2026-07-09.

---

## Current completed work

### Question bank — Mathematics (all classes)

| Class | Chapters | Questions | Gateway | Status |
|---|---|---|---|---|
| Class 6 Maths | 14 | 1,090 | WARN (difficulty distribution) | Complete |
| Class 7 Maths | 13 active + 1 deleted | 979 | WARN (difficulty distribution) | Complete |
| Class 8 Maths | 13 active + 2 deleted | 979 | WARN (difficulty distribution) | Complete |
| Class 9 Maths | 15 chapters (1 cbseDeleted) | 584 | WARN (3 chapters below 20q floor) | Complete |

All four classes pass the curriculum gateway with zero failures. Warnings are non-blocking for launch.

### Question bank — Class 9 Physics

| Chapters | Questions | Gateway | Status |
|---|---|---|---|
| 5 (3 full match, 1 partial, 1 non-exam) | 125 | PASS — clean | Partial |

Physics passes the curriculum gateway. Chapter-level content issues (Gravitation label, Simple Machines gap) are recorded as open items — not gateway failures.

### Question bank — Class 9 Biology (partial)

| File | Chapter | Questions | Gateway | Quality Audit |
|---|---|---|---|---|
| `ch01-the-fundamental-unit-of-life.ts` | The Fundamental Unit of Life | 75 | slug detected — PASS | PASS — HOTS_EQUIVALENT tag fix applied (see DEC-015) |

**Difficulty distribution:** Easy 30 · Medium 30 · Hard 15 (40%/40%/20%).
**Topic coverage:** t1 Cell Theory and Cell Discovery 20q · t2 Cell Membrane and Cell Wall 25q · t3 Cell Organelles 30q.
**Type distribution:** con×14, nce×16, cmp×12, asr×10, hot×13, pyq×10.
**Duplicate IDs:** none.
**Invalid tags:** none (after fix — all 12 STANDARD_TAGS references are valid).
**TypeScript:** clean exit, zero errors.
**Adapter:** CH01 imported and exported in `class9-biology.ts`.

### Question bank — Class 9 Chemistry (partial)

| File | Chapter | Questions | Exam-relevant | Quality Audit |
|---|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | 75 | NO — non-exam chapter | Not audited (non-exam) |
| `ch02-is-matter-around-us-pure.ts` | Exploring Mixtures (official Ch5) | 31 | YES | PASS — 4 fixes applied (see DEC-012) |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules (official Ch9) | 30 | YES | PASS — no fixes required |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom (official Ch8) | 30 | YES | PASS — no fixes required |

91 exam-ready questions across three official exam chapters. Quality audit completed 2026-07-09 (see DEC-012).

### Curriculum gateway fixes

| Fix | Description | Status |
|---|---|---|
| GC-01 | Removed `cbseDeleted` from Class 9 Maths Ch5 (Euclid's Geometry) — confirmed active by CBSE 2022-23 and 2026-27 syllabi | Done 2026-07-08 |
| GC-02 | Class 9 Maths Ch11 (Constructions) `cbseDeleted: true` — verified correct, no change needed | Done 2026-07-08 |
| GC-04 | Added `cbseDeleted` to Class 7 Maths Ch10 (Practical Geometry) — confirmed deleted by NCERT rationalization | Done 2026-07-08 |

### Governance documentation

| Document | Location | Status |
|---|---|---|
| `PROJECT_MASTER_CONTEXT.md` | `docs/GOVERNANCE/` | Complete — 9 sections |
| `PROJECT_MEMORY.md` | `docs/GOVERNANCE/` | Complete |
| `PROJECT_STATUS.md` | `docs/GOVERNANCE/` | This file |
| `DECISION_LOG.md` | `docs/GOVERNANCE/` | Complete — 11 decisions recorded |
| `CHECKPOINT_GATEWAYS.md` | `docs/GOVERNANCE/` | Complete |
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | repo root | Complete — full audit |
| `CLASS9_SCIENCE_EXECUTIVE_DECISION.md` | repo root | Complete — CEO-level decision brief |
| `GATEWAY_FIX_VERIFICATION.md` | repo root | Complete — GC-01 and GC-04 verified |

### AI teaching pipeline

| Component | Status |
|---|---|
| TeachingLesson architecture | Complete — replaces raw steps[] |
| Teaching quality pipeline | Complete — server-side review, max 2 cycles, graceful degradation |
| Master Teacher Engine | Complete — deterministic planner replaces planning LLM call (< 1 ms) |
| Depth differentiation (BASIC/STD/ADV) | Complete — injected via system-level override |
| Confidence engine | Complete — source-adaptive formula |
| Adaptive engine | Complete — reads 3 localStorage keys |
| Student model | Complete — 7-service localStorage-first system, Firestore-ready |
| Personalization flow | Complete — studentContext sent in body, never cached server-side |

---

## Current pending work

### GC-05 — Class 7 Maths Ch15 (Visualising Solid Shapes)

A claim was made that this chapter was deleted from the CBSE curriculum. No official NCERT or CBSE source has been produced to confirm this. The chapter remains active in the gateway (no `cbseDeleted` flag). This item is blocked until official evidence is provided.

### Gravitation — product decision pending

The 25-question "Gravitation" chapter in Class 9 Physics is confirmed non-exam by the 2026-27 CBSE Science PDF. A product decision is needed on whether to:
- Label it as enrichment/non-exam content with a disclaimer in the UI, or
- Deprecate it entirely

No code change has been made. The chapter currently appears to students without any disclaimer.

### Internal curriculum documentation update

Prior internal documents (`PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`, `GATEWAY_CHANGE_APPROVAL.md`) reference the pre-2026-27 chapter structure and contain disputed/outdated Gravitation assumptions. These need to be updated or superseded to reflect the confirmed 2026-27 Science curriculum structure.

### Chemistry and Biology gateway registration

`9-Chemistry` and `9-Biology` are not registered in the curriculum gateway's `EXPECTED` map. Registration must happen before content authoring begins for either subject, so every new chapter is validated as it is added.

---

## Current blockers

### BLOCKER 1 — Biology is live in the UI with partial content (Ch01 only)

**Severity:** High — potentially incomplete student-facing experience.
**Detail:** `Practice.tsx` lists "Biology" in `ALL_SUBJECTS`. Ch01 (75q) is authored and wired into `class9-biology.ts`. Ch02–Ch04 are not yet authored. A student who selects Biology will see only one chapter; remaining chapters show zero questions.
**Resolution:** Either surface Ch01 only (hide unwritten chapters), or render a "More chapters coming soon" notice. Does not require further content authoring to unblock.
**Dependency:** None — UI-only decision.

### BLOCKER 2 — Chemistry exam-chapter authoring (PARTIALLY RESOLVED)

**Severity:** High — was Critical; now partially resolved.
**Detail:** All three official exam chapters (Ch5 Exploring Mixtures, Ch8 Structure of the Atom, Ch9 Atoms and Molecules) have been authored and quality-audited. Ch02 (31q), Ch03 (30q), Ch04 (30q) = 91 exam-ready questions. Quality audit completed 2026-07-09, all three chapters PASS (see DEC-014).
**Remaining gap:** Ch01 "Matter in Our Surroundings" (75q) is confirmed non-exam and excluded from launch. The three exam chapters are now content-complete for an initial launch set.
**Resolution needed:** Gateway registration for `9-Chemistry` to enable automated quality gating. UI integration to surface Chemistry chapters to students.
**Dependency:** BLOCKER 3 (gateway registration) remains open.

### BLOCKER 3 — Chemistry and Biology have no gateway coverage

**Severity:** High — no automated quality safety net for either subject.
**Detail:** `9-Chemistry` and `9-Biology` are absent from the `EXPECTED` map in `scripts/src/curriculumGateway.ts`. The gateway's PASS result covers only Mathematics, Economics, and Physics. Any content added to Chemistry or Biology today is completely unchecked.
**Resolution:** Add `9-Chemistry` and `9-Biology` entries to the `EXPECTED` map using the confirmed official chapter lists.
**Dependency:** None — pure code change in `curriculumGateway.ts`.

### BLOCKER 4 — Internal documentation is stale

**Severity:** Medium — risk of future decisions being made on wrong chapter assumptions.
**Detail:** Prior documents still reference the old chapter numbering and treat the Gravitation dispute as open. Any new session that reads those documents without reading this governance folder first may make incorrect decisions.
**Resolution:** Update or supersede `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`. Mark `GATEWAY_CHANGE_APPROVAL.md` as superseded by `CLASS9_SCIENCE_EXECUTIVE_DECISION.md`.
**Dependency:** None — documentation only.

---

## Current next task

**Recommended: Documentation and gateway registration pass — metadata and governance only, zero content authoring.**

Three actions, one bounded task:

1. **Update curriculum ground-truth documentation** — Supersede or annotate `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` and `GATEWAY_CHANGE_APPROVAL.md` to reflect the confirmed 2026-27 Science chapter structure. Closes BLOCKER 4 and prevents stale-document decisions.

2. **Register `9-Chemistry` in the gateway `EXPECTED` map** — Add the four Chemistry entries (three exam chapters + Ch1 with `cbseDeleted: true`) using the confirmed official chapter names. Closes BLOCKER 3 partially.

3. **Register `9-Biology` in the gateway `EXPECTED` map** — Add the four Biology exam chapter entries. Closes BLOCKER 3 fully.

**Why this task first:**
- Requires no content authoring and no new curriculum research.
- 100% HIGH-confidence, CBSE-sourced — every chapter name is already on file.
- Unblocks safe, gateway-validated authoring for Chemistry and Biology as the next content task.
- Takes less than one session; immediate risk reduction.

**What follows this task (in order):**
1. Biology UI fix (hide or gate Biology in `Practice.tsx` — one-line change, no content dependency)
2. Chemistry exam-chapter authoring (Ch5, Ch8, Ch9 — after gateway is live)
3. Biology structural scaffolding + content authoring (after gateway is live)
4. Physics gap-fill (Simple Machines sub-topic in Work and Energy chapter)
5. Gravitation product decision (label or deprecate)

---

## Known risks

### RISK 1 — Content authoring without gateway coverage (Chemistry/Biology)

If questions are authored for Chemistry or Biology before the gateway is registered, there is no automated check for missing chapters, wrong chapter names, or under-populated questions. Errors will only be caught manually.
**Mitigation:** Always register the gateway entry before the first authoring commit for a new subject.

### RISK 2 — Non-exam content being presented as exam-ready

Two chapters currently carry fully authored content but are confirmed non-exam in 2026-27: Physics "Gravitation" (25q) and Chemistry "Matter in Our Surroundings" (75q). If these are marketed to students as CBSE exam preparation content, the product makes a false claim.
**Mitigation:** Add `cbseDeleted: true` to the Gravitation gateway entry (pending product decision) and ensure the UI labels these chapters clearly as enrichment/non-exam.

### RISK 3 — Gateway PASS misread as full Science coverage

The curriculum gateway currently reports PASS. This covers only Mathematics, Economics, and Physics. Any stakeholder reading "GATEWAY: PASS" as "Science is ready" is drawing the wrong conclusion.
**Mitigation:** `CHECKPOINT_GATEWAYS.md` records this caveat. The gateway summary line in status reports should be amended to say "PASS — 3 of 5 Class 9 subjects covered" once Chemistry and Biology are registered and their current state (0 questions) triggers the expected FAILs.

### RISK 4 — Stale documents consulted by a future session

If a future AI session or developer reads `GATEWAY_CHANGE_APPROVAL.md` or `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` without first reading this governance folder, they may act on outdated chapter assumptions (especially the unresolved Gravitation dispute, which is now resolved).
**Mitigation:** Add supersession notices to those documents. Enforce the restart protocol (Section 9 of `PROJECT_MASTER_CONTEXT.md`) at the start of every session.

### RISK 5 — Question-count target figures treated as compliance requirements

The estimated deficits (~225 questions for Chemistry, ~320 for Biology) are derived from internal repo conventions and the Biology blueprint file, not from any official CBSE minimum. If these figures are used to set external commitments or launch criteria, they may create artificial obligations.
**Mitigation:** Always qualify these figures as "internal estimates" in any planning or resourcing document. No CBSE minimum-question-count standard has been identified.

### RISK 6 — Class 7 Ch15 (Visualising Solid Shapes) treated as deleted without evidence

A claim that this chapter was deleted from the CBSE curriculum was made but not substantiated with an official source. If this claim is acted on (adding `cbseDeleted: true`) without evidence, the chapter would be incorrectly exempted from question-count floors.
**Mitigation:** GC-05 remains BLOCKED in `DECISION_LOG.md`. No action until official NCERT or CBSE evidence is produced.
