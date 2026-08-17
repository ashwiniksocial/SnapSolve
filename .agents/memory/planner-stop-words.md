---
name: Planner Stop Words
description: How deterministicPlanner.ts prevents wrong-chapter blueprint injection via PLANNER_STOP_WORDS and a raised score threshold.
---

## Root cause of wrong-chapter routing

`tokenise()` includes 3-char words ("the", "law") and all longer words including generic academic terms.
"theorem" (7 chars) appeared in ch02 Polynomials subtopic names ("Remainder Theorem" +2, "Factor Theorem" +2), giving any "…theorem" question a spurious ch02 score of ~11.
"Pythagoras theorem" had zero registry entries for "pythagoras" but "theorem" alone drove the match → ch02 won.

## Fix applied

**`PLANNER_STOP_WORDS`** — filtered from *question* token set only (not from chapter text scoring):

- Generic academic category nouns: `theorem`, `law`, `principle`, `property`, `formula`, `concept`, `rule`, `equation`, `definition`
- Generic instruction verbs: `find`, `explain`, `state`, `define`, `prove`, `show`, `calculate`, `compute`, `determine`, `evaluate`, `describe`, `write`, `derive`
- Short English function words surviving 3-char filter: `the`, `and`, `are`, `not`, `its`, `for`, `has`, `was`, `can`, `with`, `that`, `this`, `will`, `from`, `when`, `does`, `did`, `via`, `use`, `per`, `any`

**`questionTokens(question)`** — applies stop words to the question; `scoreChapter` still receives full chapter text tokens.

**Threshold raised 2 → 4** — a score of 1–3 from coincidental word overlap is rejected; genuine matches reliably score ≥ 5.

## Validation result

- "Pythagoras theorem" → no blueprint (correct — model uses own knowledge) ✅
- "Newton's first law" → ch02 Force and Laws of Motion ✅ (via "newton", "first", "motion")
- "Car accelerates from 0 to 60 km/h" → ch01 Motion ✅

## What NOT to do

Do not add new AI calls, embedding systems, or LLM-based classification to the planner. The rule is: weak deterministic evidence → return null (no blueprint), never inject guessed context.
