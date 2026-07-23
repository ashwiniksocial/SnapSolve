# Question Bank — Authoring Guide

**Developer and content author reference. Never deployed to students.**

This guide tells you exactly what a well-formed question looks like, how to write each question type, and what the quality bar is before a question can be added to the bank.

---

## 1. Before You Write — Five Pre-flight Checks

Before drafting any question, confirm:

1. **Chapter and topic are registered** — the chapter exists in `chapterRegistry.ts` and the topic is listed in the chapter's `topics` array.
2. **The question type is permitted for this chapter** — check `applicableTypes` in the chapter record.
3. **The question does not duplicate an existing question** — search by concept node and question format before writing. Paraphrasing a question that already exists is not acceptable.
4. **The Bloom's level and question type are consistent** — use `tagging.ts:QUESTION_TYPE_DESCRIPTIONS` to verify.
5. **The answer is definitely correct** — check it independently. Errors in the answer are the most damaging quality failure.

---

## 2. The ID Contract

Every question has a stable, permanent ID. Once published, IDs are **never reassigned, never reused, never changed** — even if the question is edited or deleted. Deleted questions are archived, not removed.

**Format:** `{boardCode}-{subjectCode}-{classNum}-{chapterId}-{typeCode}-{seq3}`

Use `buildQuestionId()` from `tagging.ts`. Do not construct IDs by hand.

| Component | Source |
|---|---|
| `boardCode` | `BOARD_CODES[board]` — `bo`, `cb`, or `ic` |
| `subjectCode` | `SUBJECT_CODES[subject]` — `mth`, `phy`, `chm`, `bio`, `csc`, `eco` |
| `classNum` | 6, 7, 8, or 9 |
| `chapterId` | `"ch01"` through `"ch15"` (zero-padded) |
| `typeCode` | `TYPE_CODES[questionType]` — `con`, `nce`, `ics`, `cmp`, `hot`, `pyq`, `cst`, `asr`, `oly` |
| `seq3` | Sequence within (chapter × type), starting at 001 |

Sequence numbers are per (chapter × type) — not global. So `bo-mth-9-ch01-hot-001` and `bo-mth-9-ch01-con-001` can coexist.

---

## 3. Writing Each Question Type

### 3.1 Concept Questions (`concept`)

**Purpose:** Does the student understand WHAT this concept is and WHY it exists?

**Do:**
- Target one concept per question
- Ask for explanation, classification, or justification — not computation
- Use True/False with justification, MCQ, or ShortAnswer formats
- Write at Easy or Medium difficulty

**Avoid:**
- Multi-concept questions
- "What is the formula for..." — this is recall, not concept understanding
- Questions where the answer is a single number

**Example (good):**
> True or False: A rational number must have a terminating decimal expansion. Justify your answer.

**Example (bad):**
> What is the definition of a rational number? ← This is pure recall; one sentence from the textbook. Not concept understanding.

---

### 3.2 NCERT-Style Questions (`ncert`)

**Purpose:** Builds readiness for the NCERT exercise standard — what most students are preparing for.

**Do:**
- Match the question style, phrasing, and mark allocation of real NCERT exercises
- Include full worked solutions matching NCERT solution manuals
- Write at Medium difficulty

**Avoid:**
- Verbatim NCERT questions — these must be fresh questions in the NCERT style
- Questions that NCERT would classify as "examples" (solved in the textbook)

**NCERT question style markers:**
- "Find...", "Calculate...", "Simplify...", "Express..."
- Multi-step working expected
- Units required in Physics/Chemistry answers

---

### 3.3 ICSE-Style Questions (`icse`)

**Purpose:** Matches ICSE paper rigour — often more formal, proof-heavy, or computational.

**Do:**
- Write at Medium or Hard difficulty
- Mark with `board: "ICSE"` unless genuinely applicable to both boards
- Expect full working — "answer only" is never acceptable in ICSE style
- For Mathematics: favour algebraic manipulation, constructions, and proofs
- For Science: favour longer-mark questions with explanation of principles

**ICSE question style markers:**
- "Show that...", "Prove that...", "Derive an expression for..."
- More formal register than CBSE
- Expects units, significant figures, and directional components in Physics

---

### 3.4 Competency-Based Questions (`competency`)

**Purpose:** NEP 2020 aligned. Tests the ability to select and apply, not just execute.

**Key requirement:** The student must make at least one decision not made for them in the question stem. The question must not state which formula, method, or concept to use.

**Do:**
- Use an unfamiliar real-world context
- Ask the student to figure out which concept is relevant
- Accept multiple valid approaches in the answer
- Include in commonErrors: "applied [wrong method] because the surface form looked like [other problem type]"

**Avoid:**
- "Using F = ma, calculate the force..."  ← method given; not competency-based
- "Apply Newton's Second Law to find..."  ← same problem

**Example (good):**
> A car decelerates uniformly from 72 km/h to a stop in 8 seconds. What braking force acts on the 1200 kg car?
> (Student must: convert units, identify this as a Newton's Second Law problem, find acceleration first, then force)

---

### 3.5 HOTS Questions (`hots`)

**Purpose:** Bloom's Analyse, Evaluate, or Create. Not just "hard computation" — a different cognitive task.

**The HOTS test:** If the question can be solved by applying a memorised procedure (even a complex one), it is NOT HOTS. HOTS requires breaking something down, judging something, or producing something new.

**Do:**
- Include 3 hints (hint, hint2, hint3) — each one gets closer without revealing the solution
- Write commonErrors for every HOTS question
- Use bloomsLevel: "analyse", "evaluate", or "create"
- Difficulty: "Hard" minimum

**HOTS question patterns:**
- Counter-example questions: "Is the following statement always true? Prove or disprove."
- Error-analysis: "A student solved this problem as follows. Find and explain the error."
- Comparison: "Which of these two methods is more efficient for this type of problem? Justify."
- Extension: "If [condition] is changed to [new condition], does the result still hold?"
- Synthesis: "Can you find a general rule for all cases of [pattern]?"

---

### 3.6 Previous-Year Questions (`previous-year`)

**Purpose:** Direct exam preparation using real or real-pattern questions.

**Do:**
- If sourced from an actual paper: record `yearIfPreviousYear` and `boardIfPreviousYear`
- If modelled (not verbatim): `source: "original"` but `questionType: "previous-year"`
- Match the exact mark allocation and format of the original
- Include `sourceReference` e.g. `"CBSE Board 2023, Section B, Q4"`

**Avoid:**
- Questions from papers more than 10 years old (syllabus may have changed)
- Questions from deleted syllabus chapters (tag with `STANDARD_TAGS.DELETED_SYLLABUS` if added in error)

---

### 3.7 Case-Study Questions (`case-study`)

**Purpose:** Tests reading comprehension + concept application in a real-world context.

**Structure:**
```
Passage: 80–150 words describing a real situation.
Sub-question (a): 1 mark — Comprehension (MCQ)
Sub-question (b): 1 mark — Identification (MCQ or FillInTheBlanks)
Sub-question (c): 2 marks — Application (ShortAnswer)
Sub-question (d): 2 marks — Analysis (ShortAnswer)
```

**Do:**
- Use a genuinely real or realistic context — a news event, a scientific observation, data from a report
- Make the passage self-contained — the student must not need textbook knowledge to understand the passage
- Sub-questions must increase in cognitive demand: comprehension → application → analysis
- The passage must NOT define the concept — it must APPLY it

**Avoid:**
- Passages that are textbook definitions rewritten as paragraphs
- Sub-questions that can be answered without reading the passage
- Passages longer than 150 words

---

### 3.8 Assertion–Reason Questions (`assertion-reason`)

**Purpose:** Tests logical thinking — can the student evaluate two statements and their relationship?

**The four options are always:**
```
(A) Both Assertion (A) and Reason (R) are true and Reason is the correct explanation of Assertion.
(B) Both Assertion (A) and Reason (R) are true, but Reason is NOT the correct explanation of Assertion.
(C) Assertion (A) is true, but Reason (R) is false.
(D) Assertion (A) is false, but Reason (R) is true.
```

**Do:**
- The most pedagogically valuable option is (B) — where both are true but R doesn't explain A
- Write assertions that are clear, testable claims
- Write reasons that are clearly related to the assertion's subject
- Make the answer non-obvious — if any student can guess the answer from the wording alone, the question fails

**Avoid:**
- (D) answers where R is trivially unrelated to A — too easy
- Assertions that are definitions ("All mammals are warm-blooded") — too easy to evaluate
- Both A and R being false — check the CBSE standard options; this isn't one of them

---

### 3.9 Olympiad Questions (`olympiad`)

**Purpose:** Stretch and enrich students who have mastered the chapter content.

**Do:**
- Tag `difficulty: "Olympiad"`
- Connect to the chapter's core concepts — don't go completely off-syllabus
- Provide a full, explained solution — olympiad solutions are non-obvious and must be justified
- Use `source: "olympiad"` and note the competition in `sourceReference` if sourced

**Avoid:**
- Questions requiring university-level techniques
- Questions where the "insight" cannot be reasonably discovered by a motivated Class 9 student

---

## 4. Solution Quality Standards

Every question must have a worked solution meeting these standards:

### Steps
- Every `SolutionStep` has a title, explanation, and (where applicable) formula and result
- No step can be skipped — "simplifying" is not a step; showing the simplification is
- Every arithmetic operation written out explicitly (4 × 9 = 36, not "= 36")
- Every sign change, cancellation, and substitution narrated

### Hints
All three hints must be present for Hard, HOTS, and Olympiad questions:
- `hint` — directional; points towards the approach without revealing it
  - Example: "Think about what 'coprime' means for p/q to be in lowest terms."
- `hint2` — one step closer; reveals the strategy
  - Example: "Try assuming √2 is rational and writing it as p/q in lowest terms. What does squaring both sides give you?"
- `hint3` — reveals the first step only
  - Example: "Start by writing p² = 2q² from squaring both sides of √2 = p/q."

### Exam tips
Include `examTip` for:
- Previous-year questions (how examiners mark this)
- HOTS questions (what distinguishes a full-mark answer)
- Any question with a common trap

### Common errors
Include at least one `commonErrors` entry for every Hard, HOTS, and Olympiad question. Write the error as it appears in student work — not as an abstract description.

Good: `"Writing √2 + √3 = √5 (students incorrectly add under the radical)"`
Bad: `"Incorrect addition of surds"`

---

## 5. Tagging Completeness Checklist

Before submitting any question, verify:

```
☐ id           — unique, follows the ID format, not previously used
☐ schemaVersion — 2
☐ classNum     — 6, 7, 8, or 9
☐ subject      — exact match to SupportedSubject
☐ board        — correct board applicability
☐ chapterId    — matches a chapter in chapterRegistry.ts
☐ topicId      — matches a topic in the chapter's topics array
☐ questionType — from the allowed applicableTypes for this chapter
☐ questionFormat — consistent with questionType (see tagging.ts)
☐ difficulty   — appropriate to the Bloom's level
☐ bloomsLevel  — consistent with questionType and the question's cognitive demand
☐ marks        — consistent with questionFormat and difficulty
☐ estimatedTimeMinutes — honest estimate; scale with difficulty
☐ answer       — verified independently; not just "seems right"
☐ steps        — every step present; arithmetic explicit; no skips
☐ hint         — present for all questions
☐ hint2, hint3 — present for Hard, HOTS, Olympiad
☐ keyConcepts  — at least 2 entries; these are what appears in the student's lesson card
☐ conceptsCovered — at least 1 concept node in {code}:{class}:{chapter}:{kebab} format
☐ prerequisites — list any concept nodes from prior topics that this question requires
☐ commonErrors — at least 1 for Hard/HOTS/Olympiad
☐ source       — accurate
☐ tags         — at least 1 standard tag from tagging.ts:STANDARD_TAGS
```

---

## 6. Quota Targets

Every chapter has a `category` (major / standard / minor / brief) and a subject blueprint.
The blueprint maps each category to target question counts per type and difficulty.

**Do not exceed the quota for any single type** — a chapter with 80% HOTS questions is not a good chapter; it's missing the foundational concept and NCERT layers that weak students need.

The rough distribution for a Standard chapter (60 questions):

| Type | Target | Rationale |
|---|---|---|
| concept | 8 | Foundation — every student must have these |
| ncert | 12 | Core exam preparation |
| icse | 8 | ICSE-board-specific exam prep |
| competency | 10 | NEP alignment |
| hots | 8 | Higher-order thinking |
| previous-year | 8 | Direct exam training |
| case-study | 3 | CBSE Class 9 board format |
| assertion-reason | 3 | CBSE Class 9 board format |
| olympiad | 0 | Optional enrichment |
| **Total** | **60** | |

See the subject blueprint files for exact numbers.

---

## 7. Anti-duplication Policy

A question is a **duplicate** if it tests the **same concept** using the **same cognitive operation** in the **same surface form**. Changing only the numbers is not sufficient to avoid duplication.

A question is **NOT** a duplicate if it:
- Tests the same concept but uses a different Bloom's level
- Tests the same concept but in a different real-world context
- Tests the same concept but requires the student to notice it themselves (competency) vs. having it labelled for them (NCERT)
- Is the same calculation but phrased as an error-analysis question

Before submitting, search by `conceptsCovered` nodes. If 3 or more existing questions share the same primary concept node and the same Bloom's level, the new question is likely a duplicate.

---

## 8. Maintenance

### Editing existing questions
- May edit `question`, `answer`, `steps`, `hint*`, `examTip`, `commonErrors`, `tags`, `source`, `sourceReference`
- Must NOT change `id`, `classNum`, `subject`, `chapterId`, `topicId`, `questionType`, `questionFormat`, `bloomsLevel`
- If a structural change is needed (different type or format), archive the old question and create a new one with a new ID

### Archiving
- Questions are archived, not deleted
- Archived questions move to a `/question-bank/archived/` folder
- The ID is marked as retired in a separate `retired-ids.ts` file to prevent accidental reuse

### Version history
- Track changes in a comment block at the top of each chapter file
- Format: `// v2 2026-01-15 — Added 8 HOTS questions for topics t3, t4 (author: [name])`
