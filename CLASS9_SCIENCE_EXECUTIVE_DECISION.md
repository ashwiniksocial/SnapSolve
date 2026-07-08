# CLASS9_SCIENCE_EXECUTIVE_DECISION.md

**Document type:** Executive decision brief — derived entirely from `CLASS9_SCIENCE_LAUNCH_READINESS.md`. No new curriculum research was performed, no code was modified, no content was authored.
**Date:** 2026-07-08
**Input document:** `CLASS9_SCIENCE_LAUNCH_READINESS.md` (audited 2026-07-08)
**Purpose:** Convert the audit's findings into decisions — what is safe to act on now, what still needs evidence, what it changes about prior conclusions, and what to do next.

---

## How to read this document

Every finding below is scored on three axes:

- **Evidence source** — Repository / NCERT / CBSE (per the audit's citations)
- **Confidence** — HIGH (directly stated in an official source document), MEDIUM (inferred from official source + repository cross-reference), LOW (repository-only, blueprint/estimate, or no official minimum exists)
- **Product impact** — No action / Metadata change / Content change / Architecture change

---

## Master findings table

| # | Finding | Evidence source | Confidence | Product impact |
|---|---|---|---|---|
| 1 | Class 9 Science was fully restructured for 2026-27 (NCF-SE 2023); chapter numbers, names, and groupings changed from the older syllabus the repo and prior docs assume. | CBSE (curriculum PDF) | HIGH | Metadata change (curriculum ground-truth docs) |
| 2 | "Gravitation" does not exist as a standalone chapter in the official 2026-27 curriculum; it is folded into competency C 2.2, not examined as a chapter. | CBSE (curriculum PDF, Course Structure table + full chapter listing) | HIGH | Metadata change (reclassify), no content deletion required |
| 3 | Official 2026-27 Physics exam chapters are exactly 4: Motion (Ch4), Force and Laws of Motion (Ch6), Work Energy and Simple Machines (Ch7), Sound (Ch10). | CBSE (curriculum PDF) | HIGH | No action (repo already has 4 matching chapters, 1 partial) |
| 4 | Official 2026-27 Chemistry exam chapters are exactly 3: Exploring Mixtures and their Separation (Ch5), Structure of an Atom (Ch8), Atoms and Molecules (Ch9). | CBSE (curriculum PDF) | HIGH | Content change (all 3 unauthored in repo) |
| 5 | Official 2026-27 Biology exam chapters are exactly 4: Cell (Ch2), Tissues (Ch3), Reproduction (Ch11), Diversity (Ch12). | CBSE (curriculum PDF) | HIGH | Architecture + Content change (subject doesn't exist in repo yet) |
| 6 | Chapter 1 (Matter in Our Surroundings) and Chapter 14 (Natural Resources) are excluded from the 2026-27 annual exam. | CBSE (curriculum PDF, Course Structure table — neither chapter number appears in any assessed unit) | HIGH | Metadata change |
| 7 | Repo Physics: Motion, Force and Laws of Motion, and Sound fully match official chapters (25 questions each, name and scope aligned). | Repository + CBSE (cross-reference) | HIGH | No action |
| 8 | Repo Physics "Work and Energy" chapter is missing the "Simple Machines" sub-topic (levers, pulleys, inclined plane, mechanical advantage) required by official Ch7. | Repository + CBSE (cross-reference) | MEDIUM | Content change |
| 9 | Repo Physics "Motion" chapter's topic list (Distance/Displacement, Speed/Velocity, Acceleration) does not confirm coverage of "elementary idea of uniform circular motion," which the official curriculum lists as a required key concept. | Repository + CBSE (cross-reference) | LOW — audit flagged this as "not confirmed present," not confirmed absent; topic titles don't preclude the concept being covered inside an existing topic | Content change (pending confirmation) |
| 10 | Repo Physics "Gravitation" chapter (25 questions, fully authored) has no home in the official 2026-27 structure. | Repository + CBSE (cross-reference) | HIGH | Metadata change (relabel as non-exam/enrichment) — not a content deletion decision |
| 11 | Repo Chemistry: only "Matter in Our Surroundings" is authored (75 questions), and it is the one chapter confirmed excluded from the 2026-27 exam. | Repository + CBSE (cross-reference) | HIGH | Content change (effort was concentrated in the wrong chapter under the new syllabus) |
| 12 | Repo Chemistry's three exam chapters (Ch5/Ch8/Ch9 equivalents) exist only as empty scaffold files with zero questions. | Repository (direct file inspection) | HIGH | Content change |
| 13 | Chemistry has no entry in the curriculum-quality gateway's `EXPECTED` map — no automated FAIL/WARN coverage exists for this subject today. | Repository (`scripts/src/curriculumGateway.ts`) | HIGH | Architecture change (governance, not content) |
| 14 | Biology has zero files, zero wiring into `index.ts`/`ALL_CHAPTERS`/`ALL_QUESTIONS`, and zero gateway registration. | Repository (direct file/import inspection) | HIGH | Architecture change |
| 15 | Biology is already exposed as a selectable subject in the Practice UI (`ALL_SUBJECTS` in `Practice.tsx`, full `SubjectConfig` in `subjects.ts`) despite having no backing data — a live dead-end, not a hidden gap. | Repository (direct file inspection) | HIGH | Architecture change (UX gating needed regardless of content timeline) |
| 16 | Estimated question deficits (~225 for Chemistry, ~320 for Biology) are derived from the repository's own authoring conventions and the Biology blueprint's `targetTotal: 80`, not from any official CBSE minimum-question standard. | Repository (blueprint + existing chapter sizes); no CBSE/NCERT source states a minimum question count | LOW | Content change (targets are internal estimates, not compliance requirements) |
| 17 | This finding set resolves a standing internal dispute: `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` said Gravitation was "not exam" while `GATEWAY_CHANGE_APPROVAL.md` disputed it as an active competency — the audit's direct CBSE PDF fetch shows both were reasoning from outdated/incomplete chapter framing; the correct 2026-27 answer is that Gravitation isn't a chapter at all. | CBSE (curriculum PDF) vs. Repository (two conflicting internal docs) | HIGH | Metadata change (supersedes both prior docs) |

---

## SECTION 1 — Findings that are definitely actionable now

These are HIGH-confidence, directly sourced from the official CBSE curriculum document, and require no further evidence-gathering before a decision can be made. None require code changes to execute the decision itself — they are documentation/governance actions.

1. **Adopt the 2026-27 chapter structure as ground truth** (Finding 1). Supersede any internal document still describing the pre-2026-27 chapter framing.
2. **Resolve the Gravitation dispute** (Findings 2, 17): Gravitation is confirmed not to be an official 2026-27 chapter. `GATEWAY_CHANGE_APPROVAL.md`'s open dispute on this point is closed — no further debate needed.
3. **Lock the official chapter lists** for Physics (4), Chemistry (3), and Biology (4) as the new basis for all future gateway registration and content planning (Findings 3, 4, 5).
4. **Confirm Chapter 1 and Chapter 14 are out of scope for exam assessment** (Finding 6) — no ambiguity remains here per the official Course Structure table.
5. **Recognize that Physics is the only subject close to launch-ready** (Finding 7) — 3 of 4 chapters fully match with no changes needed.
6. **Register Chemistry and Biology in the curriculum gateway** (Findings 13, 14) is a pure governance/architecture action with no content dependency — it can happen immediately and independently of any authoring work.
7. **Gate or relabel the Biology subject in the Practice UI** (Finding 15) is actionable immediately as a UX/architecture decision, independent of when Biology content ships — the current state (selectable, empty) is worse than either hiding it or clearly marking it "Coming Soon."

## SECTION 2 — Findings that require more official evidence

These are MEDIUM/LOW-confidence findings where the audit itself flagged ambiguity, or where the "target" figures are internal estimates rather than sourced requirements. No new research is being performed here — this section simply flags where the existing audit's confidence was already limited.

1. **Uniform circular motion coverage in "Motion"** (Finding 9): the audit could not confirm whether this required key concept is actually taught within the existing topics, only that no topic is explicitly named for it. This needs a **content review of the existing 25 Motion questions**, not new curriculum research, before deciding if this is a real gap.
2. **Exact scope of the "Simple Machines" gap** (Finding 8): the audit confirms this sub-topic is not represented, but did not produce a required-question-count for it, since the official PDF does not specify per-sub-topic question minimums — only period counts (13 periods for Ch4 Motion, no explicit period split for Ch7 given).
3. **Question-count targets (~225 Chemistry, ~320 Biology deficit)** (Finding 16) are internal repo-convention estimates. There is no official minimum-question-count standard in any source the audit cites. Any resourcing/timeline decision built on these numbers should be labeled as "internal estimate," not "CBSE requirement."
4. **Chemistry Ch5's new content composition** — the audit notes official Ch5 ("Exploring Mixtures and their Separation") adds concentration-calculation content (mass/mass %, mass/volume %, volume/volume %) not present in the repo's current planned topic list for that chapter. This is confirmed at the curriculum level, but no repo-side estimate of how much new authoring this specifically requires exists yet.

## SECTION 3 — Findings that contradict previous audits

1. **Gravitation status reversal.** `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` claimed Gravitation was "not exam," and `GATEWAY_CHANGE_APPROVAL.md` disputed this, citing competency C 2.2 as evidence it was active. The current audit's direct fetch of the official 2026-27 course structure and full per-chapter breakdown shows **neither prior document had the full picture**: Gravitation is not a chapter in 2026-27 at all — it's not "excluded content," it's "restructured out of chapter form entirely and absorbed into a competency that lives inside other physics chapters." Both prior positions are superseded.
2. **Chapter numbering contradiction.** Prior repo documentation (e.g., comments in `class9-chemistry.ts` referencing "2025-26 syllabus" and "old / rationalized syllabus, Chapter 2/3/4") assumed the pre-2026-27 numbering was still current. The official 2026-27 course structure renumbers and regroups chapters entirely differently (e.g., what was "Chapter 2: Is Matter Around Us Pure?" is now folded into "Chapter 5: Exploring Mixtures and their Separation" with different scope). Any prior document treating the old NCERT chapter numbers as current for 2026-27 planning purposes is now known to be stale.
3. **Chemistry Ch1 assumed exam-relevant.** The fact that 100% of authored Chemistry content exists in "Matter in Our Surroundings" implies a prior planning assumption that this chapter was in scope. The official structure directly contradicts that — it is explicitly outside every assessed unit.
4. **Gateway completeness assumption.** Any prior status report treating the curriculum gateway as a complete safety net (e.g., `PROJECT_MASTER_STATUS_2026_27.md`, which reports the gateway as "PASS" with 0 failures) did not account for the fact that Chemistry and Biology are entirely unregistered — a "PASS" result covers only Mathematics, Economics, and Physics. This is not a contradiction of a specific claim so much as a scope limitation that should be made explicit going forward: **gateway PASS ≠ full-subject coverage** until Chemistry and Biology are registered.

## SECTION 4 — Launch-critical blockers

Carried forward directly from the audit's Section E, re-confirmed here as launch-blocking with source/confidence attached:

| Blocker | Evidence source | Confidence | Product impact | Launch status |
|---|---|---|---|---|
| Biology: zero content, zero wiring, zero gateway registration, yet live-selectable in UI | Repository | HIGH | Architecture + Content change | **BLOCKED** |
| Chemistry: all 3 official exam chapters are empty scaffolds | Repository + CBSE | HIGH | Content change | **BLOCKED** |
| Chemistry: 100% of authored content is in a non-exam chapter | Repository + CBSE | HIGH | Content change (reallocation) | **BLOCKED** |
| Chemistry & Biology: no gateway registration → no automated quality safety net | Repository | HIGH | Architecture change | **BLOCKED** (governance gap) |
| Physics: "Gravitation" presented as if exam-relevant | Repository + CBSE | HIGH | Metadata change | **PARTIAL** (misleading, not broken) |
| Physics: "Simple Machines" sub-topic missing from Ch7 equivalent | Repository + CBSE | MEDIUM | Content change | **PARTIAL** |
| Internal documentation still reflects pre-2026-27 chapter framing | Repository vs. CBSE | HIGH | Metadata change | **BLOCKED** (ground-truth drift risk for all future decisions) |

**Overall Class 9 Science status: BLOCKED for launch.**
- Physics: closest to ready (PARTIAL — 3 of 4 chapters solid).
- Chemistry: BLOCKED — 0 of 3 exam chapters have content.
- Biology: BLOCKED — subject does not exist below the UI layer.

## SECTION 5 — Recommended next implementation task

Per the audit's own Section F, sequencing should start with the lowest-risk, highest-leverage action rather than jumping straight to content authoring. Applying the confidence/impact scoring above, the single most defensible next task is:

**Next task: Documentation + gateway registration pass (metadata/architecture only, zero content authoring).**

Specifically, in one bounded unit of work:
1. Update the internal curriculum ground-truth documents (e.g., `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`) to reflect the confirmed 2026-27 chapter structure (Findings 1, 2, 3, 4, 5, 6, 17) — this is HIGH confidence, sourced directly from CBSE, and closes the standing Gravitation dispute for good.
2. Register `9-Chemistry` and `9-Biology` in `scripts/src/curriculumGateway.ts`'s `EXPECTED` map using the confirmed official chapter lists (Findings 13, 14) — pure governance, no content dependency, and it ensures every future content commit for these subjects is automatically checked.
3. As part of the same pass, correct the record that "curriculum gateway PASS" currently only covers 3 of 5 Class 9 subjects, so status reports don't overstate coverage (Section 3, Finding 4 in that section).

This task is recommended first because:
- It requires no new content authoring or research (satisfies "do not author content").
- It is 100% HIGH-confidence, CBSE-sourced, and already fully evidenced in the audit — no additional evidence-gathering needed.
- It unblocks safe, validated authoring for Chemistry and Biology afterward, rather than authoring content against a gateway that can't check it.
- It directly resolves a contradiction between two existing internal documents (Section 3), reducing the risk of future decisions being made on stale chapter assumptions.

Content authoring for Chemistry's 3 exam chapters and Biology's 4 exam chapters, along with the Biology UI gating decision and the Physics Simple Machines gap-fill, should follow as separate, subsequent tasks — each is a larger, independently schedulable body of work (per audit Section F, items 3–7) and should not be bundled into this first governance-only pass.
