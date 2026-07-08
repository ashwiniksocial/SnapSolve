# GATEWAY_CHANGE_APPROVAL.md

**Document type:** Governance Validation Audit + Change Approval Record  
**Audit date:** 2026-07-08  
**Auditor:** Agent (no code changes made)  
**Source hierarchy enforced:**
1. Repository facts (code, comments, documentation in this repo)
2. Official NCERT — ncert.nic.in
3. Official CBSE Academic — cbseacademic.nic.in

**Scope:** Five claims about exam-exclusion status of specific chapters, as they exist (or do not exist) in the gateway and in documentation.

---

## PART 1 — CLAIM VERDICTS

---

### CLAIM A1 — Class 9 Maths Ch5 "Introduction to Euclid's Geometry" marked `cbseDeleted: true`

#### Repository location

```
scripts/src/curriculumGateway.ts  line 104
{ name: "Introduction to Euclid's Geometry", slug: "euclids-geometry", cbseDeleted: true }
```

Supporting comment at line 45:
```
// cbseDeleted: present in NCERT textbook but excluded from CBSE board exam since 2022-23.
```

#### Rule currently enforced

The gateway treats Ch5 as a non-exam chapter. It is not validated against the minimum question-count floor (20 questions). Any question tagged to this chapter is silently flagged as exam-inactive.

#### Official NCERT evidence

The chapter exists in the standard NCERT Class 9 Mathematics textbook (acknowledged by the gateway comment). NCERT evidence is not the controlling source for this claim because the claim is about CBSE exam inclusion, not textbook presence.

#### Official CBSE evidence

**Source 1 — CBSE Class 9 Mathematics Syllabus 2022-23**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain23/Sec/Maths_Sec_2022-23.pdf`  
Status: Successfully fetched.

UNIT IV: GEOMETRY — exact text from document:

> **1. INTRODUCTION TO EUCLID'S GEOMETRY**  
> **(7) Periods**  
> History – Geometry in India and Euclid's geometry. Euclid's method of formalizing observed phenomenon into rigorous Mathematics with definitions, common/obvious notions, axioms/postulates and theorems. The five postulates of Euclid. Showing the relationship between axiom and theorem…

The chapter appears with a full topic description and allocated periods. It is **not marked as deleted, not listed in a deleted-portions section, and not described as non-assessable**.

**Source 2 — CBSE Class 9 Mathematics Syllabus 2026-27**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf`  
Status: Successfully fetched.

Course Structure table — Unit IV Geometry chapters listed:

| Chapter Name | Unit |
|---|---|
| Introduction to Euclid's Geometry: Axioms and Postulates | IV |
| Lines and Angles | IV |
| Triangles-Congruence Theorems | IV |
| 4-gons (Quadrilaterals) | IV |
| Circles | IV |

Additionally, in the Curricular Goals section:
- **CG-4.2:** "Proves theorems using Euclid's axioms and postulates for triangles and quadrilaterals, and applies them to solve geometric problems."
- **CG-7.3:** "Proves theorems using Euclid's axioms and postulates for angles, triangles, quadrilaterals, circles, area-related theorems for parallelograms."

The chapter is listed as an active exam chapter in the 2026-27 course structure.

#### VERDICT: ❌ CONTRADICTED

The `cbseDeleted: true` flag is **incorrect**. Both the 2022-23 and the 2026-27 official CBSE exam syllabi explicitly include "Introduction to Euclid's Geometry" as a full, assessable chapter in Unit IV Geometry with allocated periods and learning outcomes. There is no deletion notice, reduced-portions notice, or non-assessment footnote for this chapter in either document.

---

### CLAIM A2 — Class 9 Maths Ch11 "Constructions" marked `cbseDeleted: true`

#### Repository location

```
scripts/src/curriculumGateway.ts  line 110
{ name: "Constructions", slug: "constructions", cbseDeleted: true }
```

Same comment at line 45 as above applies.

#### Rule currently enforced

The gateway treats Ch11 as a non-exam chapter. Not validated against the 20-question floor. Questions tagged to this chapter are exam-inactive.

#### Official NCERT evidence

The chapter exists in the NCERT Class 9 Mathematics textbook as a standalone chapter (acknowledged by the gateway comment). NCERT retention in the textbook is separate from CBSE exam assessment.

#### Official CBSE evidence

**Source 1 — CBSE Class 9 Mathematics Syllabus 2022-23**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain23/Sec/Maths_Sec_2022-23.pdf`  
Status: Successfully fetched. Full geometry unit content retrieved.

The 2022-23 UNIT IV: GEOMETRY chapter sequence as it appears in the document:
1. Introduction to Euclid's Geometry (7 periods)
2. Lines and Angles (15 periods)
3. Triangles (22 periods)
4. Quadrilaterals (13 periods)
5. Circles (17 periods)
→ Syllabus proceeds directly to UNIT V: MENSURATION

The word "construction" does **not appear anywhere** in this syllabus document. There is no "Constructions" chapter in the 2022-23 CBSE Class 9 Maths exam syllabus.

**Source 2 — CBSE Class 9 Mathematics Syllabus 2026-27**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf`  
Status: Successfully fetched.

Course structure Unit IV Geometry lists: Euclid's Geometry, Lines and Angles, Triangles-Congruence Theorems, 4-gons (Quadrilaterals), Circles. **"Constructions" is not listed as a chapter.**

Note: CG-7.4 reads "Constructs different geometrical shapes like bisectors of line segments, angles and their bisectors, triangles, and other polygons, satisfying given constraints." This embeds construction as a *skill/competency*, not a standalone exam chapter. This is a material distinction from the old Chapter 11 standalone treatment.

#### VERDICT: ✅ VERIFIED

The `cbseDeleted: true` flag is **correct**. Constructions does not appear in the 2022-23 or 2026-27 CBSE Class 9 Maths exam chapter list. The chapter was dropped as a standalone exam unit from the rationalized syllabus and its skills were redistributed as competencies.

---

### CLAIM B — Class 9 Physics "Gravitation" claimed non-exam / cbseDeleted

#### Repository location

The **gateway does NOT contain this claim.** The gateway entry is:

```
scripts/src/curriculumGateway.ts  line 125
{ name: "Gravitation", slug: "gravitation" }     ← no cbseDeleted flag
```

The claim that Gravitation is "non-exam" or "not in 2026-27" originates from `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` (produced in a prior session, not from the gateway logic). The **gateway currently enforces no restriction on Gravitation.**

#### Rule currently enforced

None. Gravitation is treated as a full exam chapter in the gateway. The question count (questions/ch03 in the Physics bank) is subject to the 15-question minimum floor.

#### Official NCERT evidence

Not the controlling source for a claim about CBSE exam inclusion.

#### Official CBSE evidence

**Source 1 — CBSE Class 9 Science Syllabus 2022-23**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain23/Sec/Science_Sec_2022-23.pdf`  
Status: Successfully fetched.

Unit III: Motion, Force and Work — exact text from document:

> **Gravitation:** Gravitation; Universal Law of Gravitation, Force of Gravitation of the earth (gravity), Acceleration due to Gravity; Mass and Weight; Free fall.

Gravitation is explicitly listed under the exam-assessed portion of Unit III with full topic content. No footnote marks it as non-assessable.

**Source 2 — CBSE Class 9 Science Syllabus 2026-27**  
URL: `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf`  
Status: Successfully fetched.

From the Competencies section:

> **C 2.2** – Explains the relationship between mass and weight using universal law of gravitation, and connect it to the laws of motion

Gravitation is an active, assessed competency in the 2026-27 Science syllabus.

#### VERDICT: ❌ CONTRADICTED

The claim that Gravitation is non-exam is **factually wrong** per both the 2022-23 and 2026-27 official CBSE Science syllabi. Gravitation is a full exam topic in both years. The gateway is **correctly not flagging** Gravitation as deleted. The error is in the documentary record only, not in the code.

---

### CLAIM C1 — Class 7 Maths Ch10 "Practical Geometry" claimed non-exam / cbseDeleted

#### Repository location

The **gateway does NOT contain this claim.** The gateway entry is:

```
scripts/src/curriculumGateway.ts  line 76
{ name: "Practical Geometry", slug: "practical-geometry" }     ← no cbseDeleted flag
```

The claim originates from prior documentation only. The gateway currently treats Ch10 as a full active chapter.

#### Rule currently enforced

None. Practical Geometry is treated as a full active chapter, subject to the 50-question minimum floor for Class 7 Maths.

#### Official NCERT evidence

**Source — NCERT Class 7 Rationalized Content Booklet**  
URL: `https://ncert.nic.in/pdf/BookletClass7.pdf`  
Status: Successfully fetched.

From the English-language table of rationalized (dropped) content for Class 7 Mathematics:

| Chapter | Page No. | Dropped Topics/Chapters |
|---|---|---|
| Chapter 10: Practical Geometry | 193–204 | 10.1 Introduction · 10.2 Construction of a line parallel to a given line, through a point not on the line · 10.3 Construction of triangles · 10.4 Constructing a triangle when lengths of its three sides are known (SSS criterion) · 10.5 Constructing a triangle when the lengths of two sides and the measure of the angle between them are known (SAS criterion) · 10.6 Constructing a triangle when the measures of two of its angles and the length of the side included between them is given (ASA criterion) · 10.7 Constructing a right-angled triangle when the length of one leg and its hypotenuse are given (RHS criterion) |

The **entire chapter** (all sections) is listed as dropped content in the official NCERT rationalization. Pages 193–204 are removed from the Class 7 Maths textbook.

#### Official CBSE evidence

A dedicated Class 7 Maths exam syllabus document from cbseacademic.nic.in was not successfully fetched (Class 7 is not a board-examination class; CBSE does not publish a standalone exam syllabus for it at the same tier as Classes 9–12). The NCERT rationalization is the authoritative source for what content exists in the NCERT textbooks used by CBSE-affiliated schools.

#### VERDICT: ✅ VERIFIED (NCERT official source)

The NCERT official rationalization booklet confirms that Chapter 10: Practical Geometry was dropped in full from the Class 7 Mathematics textbook. The chapter no longer exists in the textbook used by CBSE schools, making it effectively non-assessable. The claim is **verified by an official NCERT source.**

Note: A direct CBSE Academic exam-syllabus confirmation from cbseacademic.nic.in was not obtained (not available for non-board classes). The NCERT evidence is considered sufficient given Class 7 uses NCERT textbooks as the sole curriculum source.

---

### CLAIM C2 — Class 7 Maths Ch15 "Visualising Solid Shapes" claimed non-exam / cbseDeleted

#### Repository location

The **gateway does NOT contain this claim.** The gateway entry is:

```
scripts/src/curriculumGateway.ts  line 81
{ name: "Visualising Solid Shapes", slug: "visualising-solid-shapes" }     ← no cbseDeleted flag
```

The claim originates from prior documentation only. The gateway currently treats Ch15 as a full active chapter.

#### Rule currently enforced

None. Visualising Solid Shapes is treated as a full active chapter, subject to the 50-question minimum floor for Class 7 Maths.

#### Official NCERT evidence

**Source — NCERT Class 7 Rationalized Content Booklet**  
URL: `https://ncert.nic.in/pdf/BookletClass7.pdf`  
Status: Successfully fetched.

The string "visualising" **does not appear anywhere** in this document. Chapter 15: Visualising Solid Shapes is **not listed** in the official NCERT Class 7 rationalization table. The visible English-language section covers dropped content through Chapter 11; the chapter numbering and table layout confirm Ch15 is not in the dropped list.

#### Official CBSE evidence

No CBSE Academic document was fetched that supports the claim that Ch15 was removed or made non-assessable.

#### VERDICT: ❌ NOT VERIFIED

No official NCERT or CBSE source supports the claim that Chapter 15: Visualising Solid Shapes was dropped from the Class 7 curriculum. The NCERT rationalization booklet, which lists Ch10 explicitly, does not list Ch15. The claim is **unsubstantiated by any source in the required hierarchy**.

---

## PART 2 — GATEWAY CHANGE APPROVAL TABLE

The following proposed changes to `scripts/src/curriculumGateway.ts` are evaluated against the verdict evidence above. No changes have been made. Each entry requires explicit implementation authorization.

| ID | Proposed Change | Current State | Decision | Basis |
|---|---|---|---|---|
| GC-01 | Remove `cbseDeleted: true` from Class 9 Maths Ch5 (Euclid's Geometry) | `cbseDeleted: true` at line 104 | **APPROVED** | Two independent official CBSE syllabi (2022-23, 2026-27) list the chapter as an active exam chapter. The current flag is demonstrably wrong. |
| GC-02 | Keep `cbseDeleted: true` on Class 9 Maths Ch11 (Constructions) — no action needed | `cbseDeleted: true` at line 110 | **APPROVED (no change required)** | Two independent official CBSE syllabi (2022-23, 2026-27) confirm Constructions is absent as a standalone chapter. Current flag is correct. |
| GC-03 | Add `cbseDeleted: true` to Class 9 Physics Gravitation | No flag at line 125 | **REJECTED** | Two independent official CBSE syllabi (2022-23, 2026-27) explicitly include Gravitation as an exam topic. Adding the flag would be incorrect. The documentary claim that it is non-exam is wrong. |
| GC-04 | Add `cbseDeleted: true` to Class 7 Maths Ch10 (Practical Geometry) | No flag at line 76 | **APPROVED** | Official NCERT rationalization booklet (ncert.nic.in) lists the entire chapter as dropped content. The chapter no longer exists in the textbook. |
| GC-05 | Add `cbseDeleted: true` to Class 7 Maths Ch15 (Visualising Solid Shapes) | No flag at line 81 | **NEEDS OFFICIAL EVIDENCE** | The NCERT Class 7 rationalization booklet does not list this chapter as dropped. No official CBSE source found supporting the claim. Requires a verifiable official source before any gateway change. |

---

## PART 3 — IMPLEMENTATION PREREQUISITES

Before any approved change is implemented in `curriculumGateway.ts`:

1. **GC-01 (remove Euclid's Geometry deletion flag):**
   - Confirm the question bank has adequate Class 9 Maths Ch5 questions (≥20) to meet the re-activated floor.
   - Current count in the bank must be verified before re-enabling the minimum check.

2. **GC-04 (add Practical Geometry deletion flag):**
   - Confirm whether existing Class 7 Ch10 questions should be retained (for NCERT completeness) or removed.
   - The gateway comment convention says `cbseDeleted` means "present in NCERT textbook but excluded from CBSE board exam" — in this case the chapter was removed from the NCERT textbook entirely, which is a stronger condition. The comment at line 45 should be updated to clarify this distinction.

3. **GC-05 (Visualising Solid Shapes):**
   - Must locate and cite an official NCERT or CBSE source before any gateway change is made.
   - Acceptable sources: ncert.nic.in/pdf/BookletClass7.pdf (confirm the chapter is listed as dropped, or a newer edition booklet), or cbseacademic.nic.in curriculum page for Class 7.

---

## PART 4 — DOCUMENTARY ERRORS TO CORRECT

The following errors exist in repository documents (not in code). They should be corrected in the next documentation update:

| Document | Error | Correct Fact |
|---|---|---|
| `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` | States Gravitation is "NOT exam in 2026-27" | Gravitation IS in the 2026-27 CBSE Science exam syllabus (C 2.2) |
| `PROJECT_LAUNCH_READINESS.md` | Likely inherits the Gravitation non-exam claim | Same correction needed |
| Gateway comment, line 45 | "excluded from CBSE board exam since 2022-23" is cited for Ch5 Euclid's Geometry | Ch5 is NOT excluded — the comment is wrong for Ch5 (correct only for Ch11) |

---

## SIGNATURES / AUTHORIZATIONS REQUIRED

| Change | Status | Authorized by | Date |
|---|---|---|---|
| GC-01: Remove `cbseDeleted` from Euclid's Geometry | Awaiting authorization | — | — |
| GC-02: Keep `cbseDeleted` on Constructions | No action needed | — | — |
| GC-03: Do NOT add `cbseDeleted` to Gravitation | Awaiting acknowledgment | — | — |
| GC-04: Add `cbseDeleted` to Cl7 Ch10 Practical Geometry | Awaiting authorization | — | — |
| GC-05: Cl7 Ch15 Visualising Solid Shapes | Blocked — needs official evidence | — | — |

---

*No code was modified in producing this document. All verdicts are based solely on repository facts and official sources at ncert.nic.in and cbseacademic.nic.in as fetched on 2026-07-08.*
