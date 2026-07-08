---
name: Curriculum Authority Rule
description: Project governance rule — all curriculum decisions require official-source verification from ncert.nic.in or cbseacademic.nic.in; blocks authoring until verified.
---

## The Rule

All curriculum decisions (chapter authoring, audits, compliance checks, migrations, rationalization reviews, gap analyses) require official-source evidence before any implementation may proceed.

**Why:** The previous delta audit used third-party coaching sites (Educart, Oswaal, Competishun, myCBSEguide) as evidence. Those sites produced at least two material errors: (a) claimed Exploration has 13 chapters — official NCERT confirms 15; (b) claimed "Matter in Our Surroundings" was removed in 2026-27 — it had already been removed from CBSE exam syllabus since 2022-23 rationalization. These errors would have driven incorrect product decisions.

## Authoritative Sources (evidence-grade)

- **ncert.nic.in** — textbook listings, chapter PDFs, notifications
- **cbseacademic.nic.in** — curriculum PDFs, syllabus PDFs, circulars
- Official NCERT/CBSE PDFs fetched directly from the above domains
- Ministry of Education publications

## Non-Authoritative Sources (never evidence, discovery only)

Educart, Oswaal, Competishun, myCBSEguide, coaching institutes, blogs, YouTube, media summaries, third-party syllabus sites, exam-prep portals, AI-generated summaries.

## How to Apply

Before any curriculum authoring or structural change:
1. Identify the claim (chapter added/removed/renamed/restructured/textbook changed).
2. Fetch directly from ncert.nic.in or cbseacademic.nic.in.
3. Record: official URL · publication date · exact document title · direct chapter evidence.
4. If all four are present → VERIFIED → may proceed.
5. If any are missing → UNVERIFIED → freeze and request official verification.

## Implementation Gate

No authoring, deletion, migration, remapping, or restructuring proceeds without VERIFIED status. Default on insufficient evidence: **FREEZE**.

## Rule File Location

`.local/governance/CURRICULUM_AUTHORITY.md`
