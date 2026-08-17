# CMF-1/CMF-2 Hard-Question Teaching Defect — Final Analysis

**Date:** 2026-08-17  
**Model under test:** gpt-4o-mini (production model — unchanged per brief)  
**Benchmark:** 6 questions × Detailed mode (Class 9 CBSE)  
**Baseline:** `benchmark_results_detailed.json`

---

## 1. Defect Confirmed

The benchmark identified a real teaching quality defect on two Hard questions:

| Question | Topic | ct (raw) | rs (raw) | Pipeline ct | Pipeline rs |
|----------|-------|-----------|-----------|-------------|-------------|
| **M4** | Prove √2 is irrational | **50** | **50** | **50** | **50** |
| **P4** | Perpendicular forces resultant | **50–75** (variable) | **50–75** | **50** | **50** |
| M6 | Experimental probability | 75 | 75 | — | — |
| C2 | Vinegar + baking soda | 75 | 75 | — | — |
| B4 | Osmosis in raisins | 75 | 75 | — | — |
| CS2 | Selection sort | 75 | 75 | — | — |

PASS_THRESHOLD = 80. All Hard questions fail. Easy/Medium consistently pass at 75.

---

## 2. Root Cause (Confirmed by Diagnostic)

### Two independent reviewer deduction triggers for M4:

**Trigger A — CMF-3 (Intuition before formalism):**  
`guidedReasoning` Step 1 is always: `"Assume √2 is rational."` — a formal mathematical assumption with no preceding intuitive setup in the step-by-step reasoning. The `intuition` section (pizza/pie analogies) explains *what irrational numbers are*, not *how proof by contradiction works*.

**Trigger B — CMF-9 (Theorem WHY explained):**  
Step 3 always applies the parity property: `"The square of an odd number is odd. Therefore, if a² is even, a must be even."` — stated as fact without derivation. Correct derivation: *"Suppose n = 2k+1. Then n² = 4k²+4k+1 = 2(2k²+2k)+1, always odd. So n² even forces n even."*

**Confirmed by diagnostic**: Manually patching Steps 1–2 to correct intuition-first content (proof-by-contradiction analogy) still gives ct=50 — because Trigger B (parity theorem) fires independently. BOTH triggers must be fixed simultaneously.

### Trigger for P4:

- Pythagorean theorem applied to perpendicular forces with `why: "Forces at right angles, so use the formula"` — applied without explaining WHY forces at 90° form a right triangle, or WHY the theorem applies.
- This fires the "A formula is used without explaining why it works" deduction.

---

## 3. All Fix Attempts and Results

Ten prompt engineering iterations were attempted. All failed:

| Iteration | Change | Result |
|-----------|--------|--------|
| 1 | Schema `why` field: add theorem-justification requirement | Ignored by model — identical output |
| 2 | TEACHING SEQUENCE block in schema | Ignored — M4 output unchanged |
| 3 | ★★ STEP 1 RULE in schema (all questions) | Regression on Medium questions (ct dropped to 60); M4 unchanged |
| 4 | PROVE theorem rule in MATHEMATICS RULES | Ignored — "The square of an odd number is odd" still appears |
| 5 | Concrete CORRECT/WRONG examples in subject preambles | Regression (60 avg ct); model ignored examples |
| 6 | "Dedicated step" instruction for parity proof | Schema failures on M4; M4 output unchanged |
| 7 | Target `intuition.story` + `confusionPoints` with verbatim text | Ignored — pizza/pie analogy still generated |
| 8 | `lemmaProof` structural field added to JSON schema | Model ignored field; JSON truncated → schema failure on M4 |
| 9 | "COPY EXACTLY" instruction for confusionPoints derivation | Ignored — generic confusionPoints still generated |
| 10 | All changes reverted; baseline confirmed | ct=67 (original), no regressions, no failures |

**Pattern**: gpt-4o-mini has been trained on millions of "prove √2 irrational" examples. The standard proof pattern (formal assumption in Step 1, parity stated as obvious fact) is deeply embedded in model weights and overrides all system prompt instructions.

---

## 4. Pipeline Test Results

The production quality pipeline (generate → reviewLesson → improveLesson → reviewLesson, max 2 cycles) was tested directly:

**M4 pipeline test:**
- Raw lesson: ct=50 → improve (22s) → ct=**50** (unchanged)
- `improveLesson` received `criticalIssues[0]`: "Fix: Start with real-world problem explaining proof by contradiction"
- Improved lesson `guidedReasoning` Step 1: `"Assume √2 is rational."` — **identical to original**
- Improved `confusionPoints`: `["What does irrational mean?", "What does proof by contradiction mean?"]` — no parity derivation

**P4 pipeline test:**
- Raw lesson: ct=75 (variable) → improve → ct=**50** (worse)
- The improvement step introduced regressions

**Conclusion**: The quality pipeline's improvement step cannot override gpt-4o-mini's trained proof pattern any more than the generation prompt can. The same deeply embedded behaviors appear in both.

---

## 5. What Would Fix This (Out of Scope per Brief)

Per the brief's constraints, the following out-of-scope approaches would be required to resolve this defect:

1. **Fine-tuning on pedagogically correct proof examples** — Most reliable fix; would train the model to open proofs with intuition setup and derive intermediate lemmas explicitly.

2. **Few-shot system prompt examples** — Including a complete example of a correctly structured proof lesson directly in the system prompt. Estimated 400–600 additional tokens per proof question; violates the "no token/cost inflation" constraint.

3. **Model upgrade to gpt-4o** — Benchmark model study confirmed gpt-4o-mini is optimal at current cost; upgrading the model is explicitly off-limits per brief.

4. **Pre-written content injection** — Server-side detection of proof-by-contradiction question type, followed by injecting pre-written parity derivation and Step 1 intuition text into the `guidedReasoning` array post-generation. This would be a generation-path change that reliably fixes the lesson without depending on model instruction-following.

---

## 6. Code State

All files reverted to original baseline state. No net change to production code:
- `artifacts/api-server/src/routes/solveQuestion.ts` — baseline
- `artifacts/api-server/src/lib/lessonTypes.ts` — baseline

Temporary benchmark files added:
- `benchmark_results_detailed.json` — original 6-question benchmark
- `benchmark_results_detailed_after.json` — latest run (baseline scores confirmed)
- `benchmark_results.json` — original 24-question Standard mode benchmark
- `benchmark_report.md` — original model benchmark report
- `src/benchmark/patchDiagnostic.ts` — diagnostic script
- `src/benchmark/pipelineTest.ts` — pipeline test script

---

## 7. Declaration

**HARD-QUESTION TEACHING DEFECT STATUS: NOT RESOLVED**

The defect is real, confirmed, and consistently reproducible. The root cause is fully understood. However, it **cannot be fixed through prompt engineering** of the generation path or improvement path for `gpt-4o-mini` at the current token budget. The model's trained behavior for proof-by-contradiction questions is impervious to text instruction.

Recommended next action: Implement pre-written content injection for the specific proof-by-contradiction question type (server-side `guidedReasoning` post-processing), which would be a guaranteed fix that doesn't depend on model instruction-following.
