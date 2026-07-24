# Curriculum Authority — SnapSolve

This folder is the **permanent curriculum authority** for the SnapSolve project.

## Purpose

All curriculum decisions — chapter scope, topic coverage, question authoring, and compliance verification — must be grounded exclusively in the official source files stored in this folder. No external knowledge, training data, internet searches, or assumptions about curriculum standards are permitted as a substitute.

## Folder Contents

| File / Folder | Purpose |
|---|---|
| `README.md` | This file — explains the authority structure |
| `CURRICULUM_POLICY.md` | Binding policy governing all curriculum work in this project |
| `sources/` | Official NCERT/CBSE PDFs, one subfolder per class and subject |
| `generated/` | Machine-generated outputs derived exclusively from `sources/` — do not edit manually |
| `scripts/` | Extraction and graph-building scripts that produce the generated outputs |

## Authoritative Sources

| Question | Authoritative source |
|---|---|
| Which official PDFs are in the repository and what do they contain? | `curriculum/generated/master-curriculum-index.json` |
| Full 109-chapter manifest with titles and section arrays? | `curriculum/generated/curriculum-manifest.json` |
| Class 9 question-bank curriculum status and bookId mapping? | `scripts/src/canonicalCurriculum.ts` |
| Extraction validation and SHA-256 lock evidence? | `curriculum/generated/curriculum-lock.json` and `curriculum/generated/validation-report.md` |

## Chapter Availability Rules

A chapter's official source is **available** when:

1. Its PDF is present in `curriculum/sources/` under the correct class and subject subfolder.
2. It appears in `curriculum/generated/master-curriculum-index.json` with `"is_chapter": true`.
3. Its entry in `scripts/src/canonicalCurriculum.ts` carries status `"ACTIVE"`.

A chapter's official source is **not available** when its entry in `scripts/src/canonicalCurriculum.ts` carries status `"SOURCE_UNRESOLVED"`, `"SOURCE_PENDING"`, or `"OFFICIALLY_DELETED"`. No question authoring or verification may proceed for such a chapter.

**Ganita Manjari Part II (Class 9 Mathematics)** has not yet been officially released by NCERT/Government of India. It must never be described as missing or requested for upload. Its status is `SOURCE_UNRESOLVED` in the canonical contract and it remains blocked from academic review and freeze until an official release occurs.

## How to Use

1. Before authoring or verifying any questions for a chapter, locate the chapter's entry in `scripts/src/canonicalCurriculum.ts`.
2. Confirm the entry's `status` is `"ACTIVE"`. If it is anything else, **stop** — do not proceed.
3. Confirm the PDF named in the entry's `sourcePath` exists and is readable in `curriculum/sources/`.
4. All verification and authoring must cite specific sections from that PDF — no paraphrasing from memory.

## Adding a New Chapter

1. Upload the official NCERT/CBSE PDF into the correct `curriculum/sources/cbse/classN/subject/` subfolder.
2. Re-run `curriculum/scripts/build_curriculum_db.py` to regenerate the master index and curriculum manifest.
3. Add the chapter's `internalId → bookId` mapping to `INTERNAL_TO_CANONICAL` in `scripts/src/canonicalCurriculum.ts` with status `"ACTIVE"`.
4. Run `pnpm --filter @workspace/scripts run generate-canonical-registry` to regenerate the browser registry.
5. Only then may question authoring or compliance verification begin for that chapter.
