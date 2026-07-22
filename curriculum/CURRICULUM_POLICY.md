# SnapSolve Curriculum Policy

**Effective immediately. Binding on all agents, contributors, and automated processes.**

---

## Rule 1 — Sole Authority

Uploaded official NCERT/CBSE curriculum files stored in `curriculum/sources/` are the **ONLY** curriculum authority for this project.

No other source has curriculum authority. This includes:
- Agent training data
- Internet knowledge
- Prior NCERT editions not explicitly uploaded
- Memory of any prior curriculum standard
- Screenshots, paraphrases, or summaries not traced to an uploaded source file

---

## Rule 2 — Legacy Curriculum Has Zero Authority

Legacy curriculum knowledge — meaning any curriculum information not derived from an uploaded official file in `curriculum/sources/` — has **zero authority** in this project.

Legacy chapter numberings, topic lists, textbook content, and exam patterns from any source other than the uploaded PDFs must not be used, cited, or assumed.

---

## Rule 3 — Legacy Question Banks Are Candidates Only

Existing question bank files in `artifacts/homework-hero/src/data/questions/` are **candidate repositories only**.

Questions in those files may not be treated as verified or compliant until each question has been individually checked against the official curriculum source file for its chapter (as listed in `manifest.json`).

---

## Rule 4 — Verification Before Reuse

A question from a legacy question bank may only be marked as verified and retained if:

1. The chapter's `sourceStatus` in `manifest.json` is `"available"`.
2. The source file named in `sourceFile` is present and readable in `curriculum/sources/`.
3. Every topic and concept tested by the question can be traced to a specific section of that source file.
4. The trace is recorded explicitly — not assumed or inferred from memory.

---

## Rule 5 — Halt Conditions

If any of the following is true, **STOP immediately**:

- The official source file for the chapter being worked on is absent from `curriculum/sources/`
- The chapter's `sourceStatus` in `manifest.json` is `"pending"` or `null`
- The source file is present but unreadable (e.g., scanned image PDF with no text layer)

When halted:

- Do **not** generate any new questions
- Do **not** verify any questions
- Do **not** assume topic coverage from memory or training data
- Do **not** fetch or download anything from the internet
- **Report the halt condition** and wait for the official source file to be provided

---

## Enforcement

Any curriculum work produced without compliance with Rules 1–5 must be quarantined and re-verified before it can be included in the question bank. Work produced in violation of this policy is not compliant regardless of its apparent accuracy.
