---
name: Hard-Question Proof Teaching Defect
description: CMF-1/CMF-2 defect on proof/vector Hard questions — root cause, all failed fixes, and recommended approach.
---

## The defect
M4 (prove √2 irrational) and P4 (perpendicular forces) consistently score conceptTeaching=50, reasoning=50.
Easy/Medium questions score 75. PASS_THRESHOLD=80. MAX_REVIEW_CYCLES=2.

## Root cause (confirmed)
Two independent CMF deduction triggers for M4:
1. **CMF-3**: guidedReasoning Step 1 always = "Assume √2 is rational." — formal before intuition.
2. **CMF-9**: Parity theorem ("square of odd is odd") applied without derivation. Correct form:
   "Suppose n=2k+1. Then n²=4k²+4k+1=2(2k²+2k)+1, always odd. So n² even → n even."
BOTH must be fixed simultaneously (each independently triggers deduction to 50).

For P4: Pythagorean theorem applied to perpendicular forces without explaining WHY forces at 90° form a right triangle.

## What was tried (all failed)
- Schema-level `why` field instructions (all variants) — model ignores
- Step 1 structure rules in schema — caused regressions on Medium questions
- "PROVE every theorem" in MATHEMATICS RULES — ignored
- Concrete CORRECT/WRONG examples in preamble — caused regressions
- "Dedicated step" instruction — schema failures
- Target `intuition.story` + `confusionPoints` with verbatim text — ignored
- `lemmaProof` structural field added to JSON schema — model ignored field, JSON truncated
- "COPY EXACTLY" instructions — ignored

**Why all fail**: gpt-4o-mini has seen millions of "prove √2 irrational" examples in training.
The proof pattern (formal assumption first, parity as obvious fact) is baked into model weights
and overrides ALL system prompt instructions — no matter how specific or directive.

## Pipeline also fails
Production pipeline (generate → reviewLesson → improveLesson → reviewLesson) also cannot fix it.
Even with specific criticalIssues + suggestedFix, improveLesson generates the same Step 1 = "Assume √2 is rational."
P4 actually gets WORSE after improvement (75→50).

## What would fix it
1. **Pre-written content injection** (recommended): server-side detect proof-by-contradiction type,
   inject pre-written parity derivation and intuition Step 1 into guidedReasoning post-generation.
   Guaranteed fix, no model instruction dependency.
2. Fine-tuning on pedagogically correct proof examples.
3. Few-shot system prompt (too expensive — violates token/cost constraint).
4. Model upgrade (off-limits per brief).

## Code state
All changes reverted to original baseline. No net change to solveQuestion.ts or lessonTypes.ts.
Temp files: benchmark_results_detailed.json, src/benchmark/patchDiagnostic.ts, src/benchmark/pipelineTest.ts
Analysis: artifacts/api-server/benchmark_report_defect_analysis.md

**Why:** gpt-4o-mini's proof pattern is deterministic and impervious — do not re-attempt via prompt engineering.
**How to apply:** If re-engaging with this defect, skip all prompt approaches and go directly to post-generation content injection.
