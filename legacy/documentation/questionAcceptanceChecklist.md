# Question Acceptance Checklist — SnapSolve

**Mandatory gate before any chapter is marked complete.**
Every question in the chapter must pass every applicable check.
A chapter is accepted only when the chapter-level score is **100%**.

---

## How to use this checklist

1. Work through each section in order.
2. Mark every item **PASS**, **FAIL**, or **N/A** (only where the item genuinely does not apply).
3. Record failures with the question ID and a one-line description of the defect.
4. Fix all failures and re-run the full checklist from the start.
5. When all items are PASS or N/A, sign off the chapter at the bottom.

N/A is not a shortcut. If in doubt, mark FAIL and investigate.

---

## Section 1 — Mathematical / Scientific Correctness

These checks are the highest priority. A single mathematical error invalidates a question.

- [ ] **1.1** Every numerical answer is independently verified by hand (not copy-pasted from the question itself).
- [ ] **1.2** Every intermediate step produces the value stated — no silent jumps or omissions.
- [ ] **1.3** All arithmetic operations (addition, subtraction, multiplication, division) are verified.
- [ ] **1.4** All unit conversions are correct (e.g. 1 crore = 10 million; 1 billion = 100 crore; 1 lakh = 1,00,000).
- [ ] **1.5** Place-value claims are correct — every named digit is in the position asserted.
- [ ] **1.6** Rounding is applied to the correct digit (one position to the right of the target place), and the direction (up/down) is correct.
- [ ] **1.7** Estimated values and exact values are both computed and both stated correctly.
- [ ] **1.8** Ratios and comparisons are checked numerically — no off-by-factor-of-10 errors.
- [ ] **1.9** True/False answers state the verdict cleanly from the first sentence — no self-contradictions or mid-answer reversals.
- [ ] **1.10** For MCQ questions, exactly one option is correct; the three distractors are plausibly wrong (not trivially wrong and not accidentally correct).
- [ ] **1.11** No answer text contains internal reasoning artifacts (e.g. "Wait —", "Let me try", "? No —", crossed-out working).
- [ ] **1.12** For science questions: all physical laws, formulae, and constants are correctly stated and applied.

---

## Section 2 — NCERT Correctness

Applies to all questions tagged `source: "ncert-textbook"` and to any question drawing on NCERT examples.

- [ ] **2.1** The question matches the NCERT textbook problem exactly — wording, numbers, and context are not altered unless deliberately adapted (adaptation must be noted).
- [ ] **2.2** The answer matches the official NCERT answer key or Teacher's Manual.
- [ ] **2.3** The `sourceReference` field (e.g. "NCERT Class 6 Maths Ch 1, Exercise 1.3") is present and correct.
- [ ] **2.4** NCERT terminology is used exactly — no paraphrased definitions that subtly change meaning.
- [ ] **2.5** If the NCERT question is multi-part, all parts are present and answered.

---

## Section 3 — CBSE Alignment

- [ ] **3.1** Questions tagged `source: "cbse-board"` reflect actual CBSE examination patterns (question style, marks allocation, expected answer depth).
- [ ] **3.2** Mark allocation matches CBSE norms for the question type and class level (e.g. 1-mark MCQ, 2-mark short answer, 3-mark application).
- [ ] **3.3** `estimatedTimeMinutes` is consistent with CBSE examination pace (~1 minute per mark as a baseline).
- [ ] **3.4** `examTip` fields reference CBSE marking schemes accurately — no fabricated marking advice.
- [ ] **3.5** CBSE-tagged questions do not include topics outside the CBSE syllabus for that class and chapter.

---

## Section 4 — ICSE Alignment

- [ ] **4.1** If the chapter targets ICSE (`board: "ICSE"` or `board: "Both"`), ICSE-specific terminology and syllabus scope are respected.
- [ ] **4.2** Questions marked `board: "Both"` are genuinely common to CBSE and ICSE — differences in terminology or scope are noted in the `examTip`.
- [ ] **4.3** ICSE questions requiring formal proof or extended justification have appropriate `marks` and `estimatedTimeMinutes`.

---

## Section 5 — NEP 2020 Alignment

Applies to all questions tagged `STANDARD_TAGS.NEP_COMPETENCY`.

- [ ] **5.1** The question tests a real-world competency, not just rote recall.
- [ ] **5.2** The context is age-appropriate and relatable for Class 6–12 students in India.
- [ ] **5.3** The question requires the student to *apply* or *reason*, not merely reproduce a formula.
- [ ] **5.4** If tagged `STANDARD_TAGS.INTERDISCIPLINARY`, the cross-subject link is genuine and explicitly stated in the question or answer.
- [ ] **5.5** If tagged `STANDARD_TAGS.REAL_LIFE`, the scenario is realistic — not contrived or implausible.
- [ ] **5.6** NEP competency questions avoid cultural, regional, or gender bias.

---

## Section 6 — Bloom's Taxonomy Correctness

- [ ] **6.1** The `bloomsLevel` field matches the actual cognitive demand of the question:
  - `remember` — pure recall of a fact, name, or definition
  - `understand` — explain or paraphrase a concept
  - `apply` — use a rule or procedure in a new context
  - `analyse` — break a problem into parts, compare, or classify
  - `evaluate` — judge, justify, or critique
  - `create` — generate, design, or construct
- [ ] **6.2** The `bloomsLevel` is not inflated — a question that asks for a memorised procedure is `apply`, not `evaluate`.
- [ ] **6.3** The `bloomsLevel` is not deflated — a question that requires reasoning about two competing claims is at minimum `analyse`.
- [ ] **6.4** The mark allocation is proportional to the Bloom's level (higher-order questions merit more marks).

---

## Section 7 — Difficulty Grading

- [ ] **7.1** `difficulty: "Easy"` questions are solvable by a student who has read the chapter once, with no multi-step reasoning.
- [ ] **7.2** `difficulty: "Medium"` questions require two or more steps, or application of a concept in an unfamiliar context.
- [ ] **7.3** `difficulty: "Hard"` questions require synthesis, evaluation, or extended multi-step reasoning.
- [ ] **7.4** Difficulty is calibrated for the **target class level** — not for the subject as a whole.
- [ ] **7.5** No Easy question has `bloomsLevel` of `analyse`, `evaluate`, or `create`.
- [ ] **7.6** No Hard question has `bloomsLevel` of `remember` or `understand` (hard questions must demand higher-order thinking).
- [ ] **7.7** Across the chapter, the difficulty distribution is reasonable: a majority of questions are Easy or Medium; no more than 20–25% are Hard.

---

## Section 8 — Language Clarity for Weak Students

These checks ensure the question is accessible to a student who struggles with English or with the subject.

- [ ] **8.1** Every sentence in the `question` field is grammatically complete and unambiguous.
- [ ] **8.2** Technical terms introduced in the question are either defined in the question itself or are terms already established in the chapter.
- [ ] **8.3** The question does not use double negatives.
- [ ] **8.4** For multi-part questions, each part is labelled clearly (a), (b), (c), …
- [ ] **8.5** Numbers are formatted consistently — either Indian or international commas, not mixed, unless the mixing is intentional and the question explicitly notes it.
- [ ] **8.6** The answer does not assume the student already knows the answer (no circular reasoning in the explanation).
- [ ] **8.7** Jargon unique to a specific board (e.g. ICSE terminology unfamiliar to CBSE students) is avoided in questions tagged `board: "Both"`, or is explained inline.

---

## Section 9 — Step-by-Step Solution Quality

- [ ] **9.1** Every step has a meaningful `title` that names what is being done, not just "Step 1" or "Calculate".
- [ ] **9.2** Every step has an `explanation` that a student could follow without prior knowledge of the solution.
- [ ] **9.3** Steps are in the correct logical order — no step depends on a result that appears later.
- [ ] **9.4** No step is skipped. Every non-trivial arithmetic or logical transition is made explicit.
- [ ] **9.5** The `result` field (where used) states the outcome of that step in a compact, correct form.
- [ ] **9.6** The final step explicitly states the answer that the question asked for.
- [ ] **9.7** Steps do not contain internal reasoning artifacts, false starts, or hedge phrases ("I think", "probably", "let me check").
- [ ] **9.8** For TrueOrFalse questions, the steps include: (a) the rule being tested, (b) the application of the rule to the specific case, and (c) the verdict.
- [ ] **9.9** Total step count is appropriate — not so few that reasoning is skipped, not so many that trivial sub-steps are listed separately.

---

## Section 10 — Hint Quality

- [ ] **10.1** `hint` (primary) gives a directional nudge — it reduces cognitive load without revealing the answer or the key step.
- [ ] **10.2** `hint2` (if present) is more specific than `hint` — it can be shown after the student has tried with `hint`.
- [ ] **10.3** `hint3` (if present) is the most explicit — it can be shown as a last resort and should make the solution path obvious.
- [ ] **10.4** No hint reveals the final numerical answer.
- [ ] **10.5** Hints are written in second person ("Look at the tens digit…"), not third person.
- [ ] **10.6** Each hint is distinct — `hint2` and `hint3` do not merely reword `hint`.

---

## Section 11 — Common Mistakes Quality

- [ ] **11.1** Every entry in `commonErrors` describes a mistake a real student could plausibly make — not a trivially absurd error.
- [ ] **11.2** Every entry explains *why* the error occurs, not just *what* the error is.
- [ ] **11.3** At least one `commonErrors` entry is present for every question of type `ncert`, `competency`, or `previous-year`.
- [ ] **11.4** No `commonErrors` entry is phrased so vaguely that it applies to every question in the chapter ("not reading carefully").
- [ ] **11.5** `commonErrors` entries do not overlap with each other — each describes a distinct mistake.

---

## Section 12 — Examiner Tips

- [ ] **12.1** `examTip` (where present) reflects a genuine examiner expectation or marking-scheme nuance — not generic advice.
- [ ] **12.2** `examTip` does not contradict the answer or the steps.
- [ ] **12.3** For board-exam questions (`source: "cbse-board"` or `source: "icse-board"`), an `examTip` is strongly recommended.
- [ ] **12.4** `examTip` is written from the student's perspective ("Always show…", "Write the deciding digit to earn the second mark…").

---

## Section 13 — Metadata Completeness

Every question must have all required fields populated and valid.

- [ ] **13.1** `id` — present, unique across all files, follows convention `bo-{subject}-{class}-{chapter}-{type}-{NNN}`.
- [ ] **13.2** `schemaVersion` — set to 2.
- [ ] **13.3** `classNum` — correct integer for the target class.
- [ ] **13.4** `subject` — correct and consistent (e.g. "Mathematics", "Physics", "Chemistry").
- [ ] **13.5** `board` — one of `"CBSE"`, `"ICSE"`, `"Both"`.
- [ ] **13.6** `chapterId` — matches the chapter file naming convention.
- [ ] **13.7** `chapterName` — exact official chapter name, not paraphrased.
- [ ] **13.8** `topicId` — references a valid topic defined in the chapter blueprint.
- [ ] **13.9** `topicName` — exact name matching the blueprint.
- [ ] **13.10** `questionType` — one of `"concept"`, `"ncert"`, `"competency"`, `"previous-year"`.
- [ ] **13.11** `questionFormat` — one of `"MCQ"`, `"TrueOrFalse"`, `"ShortAnswer"`, `"LongAnswer"`.
- [ ] **13.12** `difficulty` — one of `"Easy"`, `"Medium"`, `"Hard"`.
- [ ] **13.13** `bloomsLevel` — one of `"remember"`, `"understand"`, `"apply"`, `"analyse"`, `"evaluate"`, `"create"`.
- [ ] **13.14** `marks` — positive integer consistent with question type and difficulty.
- [ ] **13.15** `estimatedTimeMinutes` — positive integer; cross-checked against marks (~1 min/mark baseline).
- [ ] **13.16** `question` — non-empty string.
- [ ] **13.17** `answer` — non-empty string.
- [ ] **13.18** `steps` — non-empty array; each element has `stepNumber`, `title`, `explanation`.
- [ ] **13.19** `hint` — non-empty string.
- [ ] **13.20** `keyConcepts` — non-empty array of strings.
- [ ] **13.21** `conceptsCovered` — non-empty array; all entries reference valid concept nodes defined in the blueprint.
- [ ] **13.22** `prerequisites` — array present (may be empty for foundational questions); all entries reference valid concept nodes.
- [ ] **13.23** `commonErrors` — non-empty array.
- [ ] **13.24** `tags` — non-empty array using only constants from `STANDARD_TAGS`.
- [ ] **13.25** `source` — one of `"original"`, `"ncert-textbook"`, `"cbse-board"`, `"icse-board"`.
- [ ] **13.26** `sourceReference` — present when `source` is `"ncert-textbook"`, `"cbse-board"`, or `"icse-board"`.
- [ ] **13.27** `options` — present and has exactly 4 entries for MCQ questions; absent for all other formats.

---

## Section 14 — Duplicate Detection

- [ ] **14.1** No two questions in the chapter share the same `id`.
- [ ] **14.2** No two questions ask the identical question in different wording (near-duplicates within the same topic and difficulty).
- [ ] **14.3** No question duplicates an NCERT exercise question while being tagged `source: "original"`.
- [ ] **14.4** NCERT-sourced questions are not counted twice (once as `ncert` type and once reworded as `competency` type) unless the competency version genuinely adds a new cognitive layer.

Verification method: run a grep for duplicate `id` values; manually cross-check questions within the same `topicId` and `difficulty` pairing.

---

## Section 15 — Grammar and Spelling

- [ ] **15.1** All question text is free of spelling errors.
- [ ] **15.2** All answer text, steps, hints, and examTip fields are free of spelling errors.
- [ ] **15.3** Indian English conventions are used consistently (e.g. "lakh" not "lac"; "crore" not "crore's").
- [ ] **15.4** Punctuation is correct — no missing full stops at the end of sentences, no orphaned question marks.
- [ ] **15.5** Numbers in prose are formatted consistently with their context (numerals for quantities, words for ordinals where conventional).
- [ ] **15.6** All mathematical expressions use correct symbols — multiplication is × (not x or *); subtraction is − (not -).

---

## Section 16 — Internal Consistency

- [ ] **16.1** The `answer` field and the final step of `steps` are consistent — they reach the same conclusion.
- [ ] **16.2** Values stated in the `question` match values used in the `steps` — no silent substitutions.
- [ ] **16.3** The `difficulty` and `marks` are mutually consistent (Easy = 1–2 marks; Medium = 2–3 marks; Hard = 3+ marks, as a guide).
- [ ] **16.4** The `bloomsLevel` is consistent with the `questionType` — `concept` questions should not be `evaluate` or `create`; `competency` questions should not be `remember`.
- [ ] **16.5** `conceptsCovered` is a superset of `prerequisites` — a question cannot cover a concept it also lists as a prerequisite.
- [ ] **16.6** The `hint` does not give away information that makes the `steps` redundant for an attentive student.
- [ ] **16.7** `commonErrors` do not describe the correct approach by accident (e.g. "Students often correctly identify the tens digit" is not a common error).
- [ ] **16.8** For TrueOrFalse questions: the `answer` opens with "True." or "False." (the verdict), not with a calculation.

---

## Section 17 — Concept Coverage Against Chapter Blueprint

- [ ] **17.1** Every concept node listed in the chapter blueprint has at least one question with that node in `conceptsCovered`.
- [ ] **17.2** Every concept node listed as a prerequisite somewhere in the chapter is itself the primary `conceptsCovered` target of at least one `concept`-type question.
- [ ] **17.3** No `conceptsCovered` entry references a concept node that does not exist in the chapter blueprint.
- [ ] **17.4** High-priority concept nodes (as marked in the blueprint) are covered by at least one `ncert` or `previous-year` question.
- [ ] **17.5** The concept coverage map is documented in the chapter's accompanying `BLUEPRINT.md` (if one exists) and matches the actual questions.

---

## Section 18 — Blueprint Quota Compliance

Each chapter must meet the following minimum quotas. Verify the actual counts before sign-off.

| Question type | Minimum count |
|---------------|---------------|
| `concept` | ≥ 10 |
| `ncert` | ≥ 15 |
| `competency` | ≥ 15 |
| `previous-year` | ≥ 10 |
| **Total** | **≥ 60** |

Difficulty distribution within each type:

| Difficulty | Minimum share |
|------------|---------------|
| Easy | ≥ 30% |
| Medium | ≥ 40% |
| Hard | ≤ 30% |

- [ ] **18.1** `concept` count ≥ 10.
- [ ] **18.2** `ncert` count ≥ 15.
- [ ] **18.3** `competency` count ≥ 15.
- [ ] **18.4** `previous-year` count ≥ 10.
- [ ] **18.5** Total question count ≥ 60.
- [ ] **18.6** Easy questions ≥ 30% of total.
- [ ] **18.7** Medium questions ≥ 40% of total.
- [ ] **18.8** Hard questions ≤ 30% of total.
- [ ] **18.9** At least one NCERT-tagged question exists for every NCERT exercise in the chapter.
- [ ] **18.10** At least one `previous-year` question exists for every topic (`topicId`) in the chapter.
- [ ] **18.11** At least one `competency` question tagged `NEP_COMPETENCY` exists for every topic in the chapter.

---

## Failure Log

Record all failures below before fixing them. Do not delete entries; mark them **RESOLVED** after fixing.

| # | Question ID | Section | Check # | Description | Status |
|---|-------------|---------|---------|-------------|--------|
| — | — | — | — | — | — |

---

## Chapter Sign-Off

Complete this block only when every check above is PASS or N/A and the Failure Log contains no open items.

```
Chapter:          ___________________________
Class:            ___________________________
Subject:          ___________________________
File path:        ___________________________

Total questions:  ___
  concept:        ___
  ncert:          ___
  competency:     ___
  previous-year:  ___

Audited by:       ___________________________
Date:             ___________________________

All 18 sections:  PASS / FAIL (circle one)
Open failures:    ___ (must be 0 to accept)

ACCEPTED:         YES / NO
```

---

*This checklist is a permanent developer document. It must not be modified to reduce the number of checks or lower the pass threshold. Any proposed changes must be reviewed and agreed by the lead developer before taking effect.*
