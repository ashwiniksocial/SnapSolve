# Curriculum Authority — SnapSolve

This folder is the **permanent curriculum authority** for the SnapSolve project.

## Purpose

All curriculum decisions — chapter scope, topic coverage, question authoring, and compliance verification — must be grounded exclusively in the official source files stored in this folder. No external knowledge, training data, internet searches, or assumptions about curriculum standards are permitted as a substitute.

## Folder Contents

| File | Purpose |
|---|---|
| `README.md` | This file — explains the authority structure |
| `manifest.json` | Registry of every official curriculum source file adopted by this project |
| `CURRICULUM_POLICY.md` | Binding policy governing all curriculum work in this project |
| `sources/` | Folder where official PDFs, extracted text, or verified chapter content is stored |

## How to Use

1. Before authoring or verifying any questions for a chapter, locate the entry for that chapter in `manifest.json`.
2. Confirm `sourceStatus` is `"available"` and the file named in `sourceFile` exists and is readable.
3. If `sourceStatus` is `"pending"`, **stop**. Do not proceed. Upload the official source file first.
4. All verification and authoring must cite specific sections from the source file — no paraphrasing from memory.

## Adding a New Chapter

1. Upload the official NCERT/CBSE PDF or its extracted text into `curriculum/sources/`.
2. Add a new entry to `manifest.json` with all fields populated.
3. Set `sourceStatus` to `"available"` and record `lastVerified`.
4. Only then may question authoring or compliance verification begin for that chapter.
