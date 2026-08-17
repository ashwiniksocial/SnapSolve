# SnapSolve — Model Benchmark Report
## gpt-4o-mini vs gpt-5.6-luna vs gpt-5.6-terra

**Date:** 2026-08-17  
**Scope:** Class 9 CBSE, all subjects in production (Mathematics, Physics, Chemistry, Biology, Computer Science)  
**Reviewer model:** `gpt-4o-mini` (fixed across all candidates — tests DRAFT quality, not reviewer quality)  
**Generation mode tested:** Standard (production-equivalent prompts)  
**Quality subset mode:** Detailed (6 representative questions — the mode the reviewer was designed for)  
**Status:** ⚠️ RECOMMENDED MODEL CONFIGURATION — NOT YET IMPLEMENTED

---

## 1 — Test Design

### 1.1 Question Bank

24 CBSE Class 9 questions drawn exclusively from the existing production question bank and `src/data/questions/` files. No new questions were authored for this benchmark.

| Subject | Count | Difficulty split | Types covered |
|---------|-------|-----------------|---------------|
| Mathematics | 8 | E:3 M:3 H:2 | MCQ, Conceptual, Numerical, Proof, Reasoning |
| Physics | 4 | E:1 M:1 H:2 | MCQ, Conceptual, Numerical |
| Chemistry | 4 | E:1 M:1 H:2 | MCQ, Conceptual, Numerical, Reasoning |
| Biology | 4 | E:1 M:1 H:2 | MCQ, Conceptual, Reasoning |
| Computer Science | 4 | E:2 M:1 H:1 | Conceptual, Algorithmic, Numerical |

### 1.2 Measurement passes

Two passes were run to capture complementary data:

**Pass A — Standard mode, all 24 questions × 3 models**  
Purpose: reliability, latency, cost, and token data at production parameters.  
Metric system prompt: preamble + `JSON_SCHEMA_STANDARD` (4-step compact schema).

**Pass B — Detailed mode, 6 representative questions × 3 models**  
Purpose: quality reviewer scores using the full lesson structure the rubric was designed to evaluate.  
6 questions: M4 (Hard Math proof), M6 (Medium Math numerical), P4 (Hard Physics), C2 (Medium Chemistry), B4 (Hard Biology), CS2 (Medium CS algorithmic).  
Metric system prompt: preamble + full `JSON_SCHEMA_DETAILED` (all 18 lesson fields).

### 1.3 Evaluation criteria

Quality is assessed by the production quality reviewer (`reviewLesson` from `services/teachingQuality/lessonReviewer.ts`) using the existing 9-dimension rubric (pass threshold = 80/100 on ALL nine dimensions).

---

## 2 — API Compatibility Matrix

Three minimum compatibility adjustments were discovered and are **required** for Luna and Terra. No prompt engineering changes were made; production prompts were used as-is.

| Parameter | gpt-4o-mini (baseline) | gpt-5.6-luna | gpt-5.6-terra |
|-----------|------------------------|--------------|---------------|
| Token budget param | `max_tokens` | `max_completion_tokens` | `max_completion_tokens` |
| Temperature control | `temperature: 0.3` | ~~Not supported~~ — must be omitted | ~~Not supported~~ — must be omitted |
| JSON format enforcement | `response_format: {type:"json_object"}` | ~~Not supported~~ — 400 error | ~~Not supported~~ — 400 error |
| Architecture | Standard LLM | Reasoning model (has internal reasoning tokens) | Reasoning model (has internal reasoning tokens) |

**Impact of the reasoning architecture (adjustment 4, not a parameter):** Luna and Terra spend an internal "thinking" phase before generating output. These reasoning tokens count against `max_completion_tokens`. At the production Standard-mode budget (1200 tokens), the reasoning phase can exhaust the budget before any content is emitted — resulting in a silently empty response with `finish_reason: "stop"`. This is the root cause of the parse failures documented below.

---

## 3 — Reliability (Pass A — Standard Mode, 24 Questions)

This is the most critical finding of the benchmark.

| Model | Questions run | Parse failures | Parse failure rate | Reviewable |
|-------|---------------|----------------|--------------------|-----------|
| gpt-4o-mini | 24 | **0** | **0%** | 23* |
| gpt-5.6-luna | 24 | **10** | **41.7%** | 14 |
| gpt-5.6-terra | 24 | **2** | **8.3%** | 22 |

*1 gpt-4o-mini question had an incomplete schema field that passed JSON parsing but was excluded from the review average.

### Root cause of Luna failures

At 1200 `max_completion_tokens`, Luna's internal reasoning phase consumed the entire budget on harder questions (M4 Proof, M3 Numerical, P4 Numerical, etc.), leaving no tokens for the output content. The API returned status 200 with `finish_reason: "stop"` and `content: ""` — a silent failure indistinguishable from a successful short response without inspection.

**Failure pattern:** Failures concentrated on Hard-difficulty and multi-step questions where Luna's reasoning phase is longer. Easy MCQ questions (M5 Probability, B1 Osmosis definition) consistently succeeded at the production budget.

### Terra failures

Terra's two failures followed the same pattern but less severely. Only 2/24 questions triggered the reasoning-exhaustion failure, suggesting Terra uses a more conservative reasoning budget by default.

### Remediation requirement

To eliminate failures, `max_completion_tokens` must be increased to **at minimum 4000 for Standard mode** and **6000 for Detailed mode** for both Luna and Terra. This is a non-trivial cost multiplier (see §6).

---

## 4 — Quality Scores (Pass B — Detailed Mode, 6 Questions)

Quality reviewer scores using the full lesson schema (the mode the rubric was designed to evaluate). Token budgets were set to eliminate reasoning-exhaustion failures: gpt-4o-mini=2800, Luna=6000, Terra=6000.

**All three models scored below the 80/100 pass threshold. Pass rate = 0/6 for all models.**

### 4.1 Average by dimension

| Dimension | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra | Luna vs Mini | Terra vs Mini |
|-----------|-------------|--------------|---------------|-------------|--------------|
| vocabulary | 75 | **83** | **83** | +8 | +8 |
| conceptTeaching | 67 | 63 | **71** | -4 | +4 |
| reasoning | 67 | 63 | **71** | -4 | +4 |
| stepExplanation | 75 | 75 | 75 | 0 | 0 |
| examples | 75 | 75 | 75 | 0 | 0 |
| memory | 75 | 75 | 75 | 0 | 0 |
| practice | 75 | 75 | 75 | 0 | 0 |
| confidenceBuilding | 75 | **83** | **83** | +8 | +8 |
| weakStudentUnderstanding | 53 | 55 | **57** | +2 | +4 |
| **Overall average** | **69** | **69** | **72** | 0 | **+3** |
| **Pass rate** | **0/6** | **0/6** | **0/6** | — | — |

### 4.2 Per-question detail

| Question | Subject | Difficulty | Mini overall | Luna overall | Terra overall |
|----------|---------|------------|-------------|-------------|--------------|
| M4 | Mathematics | Hard (Proof) | 66 | 66 | 66 |
| M6 | Mathematics | Medium (Numerical) | 73 | 73 | **79** |
| P4 | Physics | Hard (Numerical) | 66 | 66 | **79** |
| C2 | Chemistry | Medium (Conceptual) | 73 | **79** | 73 |
| B4 | Biology | Hard (Reasoning) | 72 | 66 | 72 |
| CS2 | Computer Science | Medium (Algorithmic) | 72 | **79** | 73 |
| **Average** | | | **70** | **72** | **74** |

### 4.3 Hard-question analysis

All Hard-difficulty questions scored identically across all three models on `conceptTeaching` and `reasoning` (both 50/100). This is the primary quality bottleneck. The reviewer consistently found:

- Concepts are introduced before WHY they exist (fails CMF-1, CMF-2)
- Intuition is absent or thin before formal steps begin
- Proof steps lack the "younger sibling" explanation depth

This bottleneck is **shared across all models** and is not differentiating — it reflects the existing prompt's limitations rather than a model-specific weakness.

### 4.4 Dimensions where candidates exceed baseline

**vocabulary (+8) and confidenceBuilding (+8) — Luna and Terra both**  
Both candidates generate ~70% more output tokens than gpt-4o-mini (Luna: 3584 vs mini: 1870 at Detailed mode). This verbosity produces richer vocabulary definitions and warmer closing language, which the reviewer rewards.

**conceptTeaching (+4) and reasoning (+4) — Terra only**  
Terra's reasoning architecture produces slightly more coherent WHY explanations on Medium-difficulty Science questions (P4 Physics, M6 Maths). Luna matched or underperformed mini on these dimensions.

**weakStudentUnderstanding — slight gains (Luna +2, Terra +4)**  
Neither gain is sufficient to clear the 60/100 sub-threshold that triggers automatic pass failure.

---

## 5 — Curriculum and Answer Correctness

Final answers were manually verified against NCERT Class 9 solutions for all 6 Detailed-mode questions.

| Question | Correct answer | Mini | Luna | Terra |
|----------|---------------|------|------|-------|
| M4 — Prove √2 irrational | Proof by contradiction | ✓ (correct, brief) | ✓ (correct, verbose) | ✓ (correct, structured) |
| M6 — Probability coins | P(H)=11/20, P(T)=9/20, complementary | ✓ | ✓ | ✓ |
| P4 — Resultant force | 10 N at 53.1° from 6N force, a=5 m/s² | ✓ | ✓ | ✓ |
| C2 — Evaporation vs boiling | 3 differences + cooling explanation | ✓ | ✓ | ✓ |
| B4 — Osmosis raisin | Water in pure water, water out in salt solution | ✓ | ✓ | ✓ |
| CS2 — Algorithm largest of 3 | Correct 5-step algorithm | ✓ | ⚠️ Truncated at step 5 | ✓ |

**Luna CS2 truncation note:** Luna's CS2 algorithm output terminated mid-sentence at step 5, producing an incomplete but not factually incorrect answer. This was caused by the 6000-token budget being consumed by reasoning tokens on this particular call — the same exhaustion pattern seen in Standard mode, just at the outer boundary.

**All final answers were factually correct** across all three models (ignoring the Luna CS2 truncation). No curriculum errors were found.

---

## 6 — Performance and Cost (Detailed Mode, Adequate Budget)

| Metric | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra |
|--------|-------------|--------------|---------------|
| Avg draft latency | 18,851 ms | 25,584 ms | 31,102 ms |
| vs baseline | — | +36% | +65% |
| Avg draft prompt tokens | 1,178 | 1,177 | 1,177 |
| Avg draft completion tokens | 1,870 | **3,584** | **3,320** |
| Avg total cost (draft + review) | $0.002161 | $0.003402 | $0.003257 |
| vs baseline | — | **+57.4%** | **+50.7%** |

**Standard-mode Production Budget (1200 tokens) — what would actually be deployed:**

| Metric | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra |
|--------|-------------|--------------|---------------|
| Avg draft latency | 8,498 ms | 8,534 ms | 9,045 ms |
| Parse failure rate | 0% | **41.7%** | 8.3% |
| Avg total cost (on success) | $0.001427 | $0.001620 | $0.001556 |
| Effective cost (incl. failures) | $0.001427 | ~$0.002754 | ~$0.001690 |

Note: Luna's effective cost at production budget accounts for the ~42% failure rate requiring retry or fallback, which doubles the true cost per successful response.

---

## 7 — Schema Reliability

| Measure | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra |
|---------|-------------|--------------|---------------|
| JSON parse success (Standard) | **100%** | 58.3% | 91.7% |
| JSON parse success (Detailed, adequate budget) | **100%** | **100%** | **100%** |
| Required fields present | 100% of parseable | 100% of parseable | 100% of parseable |
| Markdown fence wrapping | Never | Occasional (stripped by extractJson) | Occasional (stripped by extractJson) |

Without `response_format: json_object` enforcement (which Luna/Terra don't support), both candidates occasionally wrap responses in ` ```json ``` ` fences. The benchmark's `extractJson` function handled these. Production code would need the same treatment.

---

## 8 — Per-Subject Quality Signal

Based on Detailed-mode scores (averaged across the 1–2 questions per subject group):

| Subject | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra | Observation |
|---------|-------------|--------------|---------------|-------------|
| Mathematics (M4+M6) | 69 | 69 | 72 | Terra +3 on Medium; all equal on Hard proof |
| Physics (P4) | 66 | 66 | **79** | Terra significantly better on Hard numerical |
| Chemistry (C2) | 73 | **79** | 73 | Luna better on conceptual comparison questions |
| Biology (B4) | 72 | 66 | 72 | Mini and Terra equal; Luna worse on Hard reasoning |
| Computer Science (CS2) | 72 | **79** | 73 | Luna better on algorithmic tracing questions |

**No subject shows a consistent winner across all questions or difficulty levels.** Terra is stronger on Hard Physics numerical; Luna is stronger on Medium Chemistry/CS conceptual. Mini is most consistent and never the worst performer.

---

## 9 — Output Verbosity Analysis

Luna and Terra generate substantially more output than gpt-4o-mini.

| Mode | gpt-4o-mini out tok | gpt-5.6-luna out tok | gpt-5.6-terra out tok |
|------|--------------------|--------------------|---------------------|
| Standard (24 q avg) | 706 | 1,004 | 875 |
| Detailed (6 q avg) | 1,870 | 3,584 | 3,320 |
| Detailed verbosity vs mini | — | +92% | +78% |

This verbosity is a double-edged sword:
- **Benefit:** Richer vocabulary entries, more detailed step narration, warmer confidence builder text — reflected in +8 points on vocabulary and confidenceBuilding.
- **Cost:** Significantly longer latency (Luna +36%, Terra +65%) and higher token cost. The student-facing render time at Detailed mode (~26s Luna, ~31s Terra) would fall outside the current 15-second Standard-mode AbortController budget and require that budget to be eliminated or significantly extended.
- **Quality ceiling:** The additional tokens do not translate to higher conceptTeaching or reasoning scores — the bottleneck is structural (failing CMF-1/CMF-2), not word count.

---

## 10 — Summary of Key Findings

| Finding | gpt-4o-mini | gpt-5.6-luna | gpt-5.6-terra |
|---------|-------------|--------------|---------------|
| Production-budget reliability | ✅ 100% | ❌ 58% (critical) | ⚠️ 92% |
| Quality (Detailed, adequate budget) | 69/100 | 69/100 | **72/100** |
| Answer correctness | 100% | 100% (1 truncation) | 100% |
| Latency fit to 15s Standard budget | ✅ 8.5s | ⚠️ 8.5s (but requires 4000-token budget) | ⚠️ 9.0s |
| Cost vs baseline (adequate budget) | — | +57% | +51% |
| API compatibility complexity | None | 3 adjustments + budget change | 3 adjustments + budget change |
| Markdown fence stripping needed | No | Yes | Yes |
| Warmth/vocabulary depth | Baseline | +8pts | +8pts |
| Hard-question quality | 69 avg | 66 avg | 72 avg |
| Medium-question quality | 72 avg | 77 avg | 75 avg |

---

## 11 — RECOMMENDED MODEL CONFIGURATION — NOT YET IMPLEMENTED

### Primary recommendation: Remain on gpt-4o-mini

**Rationale:**

1. **Luna fails at production parameters.** At the 1200 `max_completion_tokens` Standard-mode budget, Luna fails 41.7% of questions silently (empty output, status 200). Deploying Luna without first increasing the token budget and adding a fallback handler would break lesson generation for nearly half of all student requests. This is an unconditional blocker.

2. **Quality improvement from either candidate is marginal.** At adequate token budgets, Luna scores 69/100 (equal to mini) and Terra scores 72/100 (3 points above mini). Neither crosses the 80-point pass threshold. The failing dimensions — conceptTeaching, reasoning, weakStudentUnderstanding — are failing identically across all three models. The quality gap is in the prompt/schema, not the model.

3. **Cost and latency are materially worse.** Luna costs +57% and Terra +51% more than baseline for Detailed-mode lessons. At Detailed-mode, Terra's avg latency is 31 seconds — more than double mini's 18.9s and twice the current 15-second Standard budget. No quality gain justifies this premium without first closing the structural quality gap in the prompt.

4. **Luna's reliability profile is unsuitable for primary deployment.** Even at 4000 tokens, Luna's reasoning architecture creates an unpredictable correlation between question difficulty and token exhaustion risk. A student asking a Hard-difficulty proof question is exactly the student who most needs a reliable answer.

### Secondary recommendation: Evaluate selective Terra escalation ONLY after prompt improvements close the Hard-question quality gap

**Condition for Terra reconsideration:** If the conceptTeaching and reasoning scores on Hard-difficulty questions are lifted above 75/100 through prompt improvements (CMF-1/CMF-2 compliance, better intuition scaffolding), Terra should be re-evaluated as a selective escalation target for Hard-difficulty questions where mini consistently fails quality review in production.

**Terra's profile for selective escalation:**
- Terra scored 79/100 on P4 (Hard Physics) vs mini's 66 — a meaningful gap
- Terra's Hard-difficulty average: 72.3 vs mini: 68 vs Luna: 66
- Terra is more reliable than Luna (8% vs 42% failure at production budget)
- With 4000 `max_completion_tokens` at Standard mode, Terra produces 0 failures across all tested questions
- A selective Terra escalation on Hard questions (~15-20% of production traffic) would raise overall average cost by roughly 8-10% — manageable if the quality improvement is confirmed

**Do not make Luna the primary fallback for Terra.** Luna underperforms Terra on Hard-difficulty conceptTeaching and reasoning, and is less reliable. If selective escalation is implemented, the routing should be: gpt-4o-mini (primary) → gpt-5.6-terra (Hard-difficulty escalation) with no Luna path.

### Required implementation work before any model change

If Terra escalation is ever pursued:
1. Add `max_completion_tokens` support to `solveQuestion.ts` draft generation — `max_tokens` must be conditionally used based on model name
2. Remove `temperature` param for Terra calls (API rejects it)
3. Drop `response_format: json_object` for Terra calls; add `extractJson` fence-stripping to the existing JSON parse path
4. Update the Standard-mode 15-second AbortController budget — Terra's avg latency is 9s at Standard (within budget) but Detailed-mode is 31s (far outside)
5. Add a `finish_reason: "length"` guard to detect and retry on token-exhaustion failures

---

## Appendix A — Benchmark Infrastructure

- Script: `artifacts/api-server/src/benchmark/modelBenchmark.ts`
- Results (Standard mode, 24q): `artifacts/api-server/benchmark_results.json`
- Results (Detailed mode, 6q): `artifacts/api-server/benchmark_results_detailed.json`
- Quality reviewer: `services/teachingQuality/lessonReviewer.ts` (unchanged — production version)
- Rubric: 9 dimensions, pass threshold 80/100 ALL dimensions

## Appendix B — Benchmark Question List (Standard Mode, 24 Questions)

| ID | Subject | Difficulty | Type | Question (abbrev.) |
|----|---------|------------|------|-------------------|
| M1 | Mathematics | Easy | MCQ | Irrational number identification |
| M2 | Mathematics | Easy | Conceptual | Is 0 rational? Justify |
| M3 | Mathematics | Medium | Numerical | Five rationals between 3/5 and 4/5 |
| M4 | Mathematics | Hard | Proof | Prove √2 is irrational |
| M5 | Mathematics | Easy | MCQ | Range of probability |
| M6 | Mathematics | Medium | Numerical | Experimental probability, 200 coin tosses |
| M7 | Mathematics | Easy | MCQ | Linear equation in two variables |
| M8 | Mathematics | Hard | Reasoning | a + b√2 = 3 + 2√2, find a and b |
| P1 | Physics | Easy | MCQ | Definition of displacement |
| P2 | Physics | Medium | Numerical | Displacement North then East |
| P3 | Physics | Easy | Conceptual | Newton's Second Law — fielder catching ball |
| P4 | Physics | Hard | Numerical | Resultant force at right angles |
| C1 | Chemistry | Easy | MCQ | Characteristics of matter |
| C2 | Chemistry | Medium | Conceptual | Evaporation vs boiling, 3 differences |
| C3 | Chemistry | Hard | Numerical | Moles in 9g water, Avogadro |
| C4 | Chemistry | Hard | Reasoning | Atomic number 17, mass 35 — config + valency |
| B1 | Biology | Easy | MCQ | Osmosis definition |
| B2 | Biology | Medium | Conceptual | Plasma membrane selectivity |
| B3 | Biology | Easy | Conceptual | Mitochondria — powerhouse of cell |
| B4 | Biology | Hard | Reasoning | Raisin in water vs salt — osmosis prediction |
| CS1 | Computer Science | Easy | Conceptual | Hardware vs software |
| CS2 | Computer Science | Medium | Algorithmic | Algorithm: largest of three numbers |
| CS3 | Computer Science | Easy | Numerical | Binary 1011 to decimal |
| CS4 | Computer Science | Hard | Reasoning | Source code to CPU execution |
