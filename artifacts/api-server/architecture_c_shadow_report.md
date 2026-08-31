# Architecture C Shadow Validation Report

## Scope and isolation

Architecture C was implemented as a diagnostic-only path:

1. Inspect raw Detailed JSON with a deterministic structural gate.
2. Stop immediately on structural failure.
3. For structurally complete lessons only, call a compact material-safety classifier.
4. Classify only; never repair, rewrite, cache, stream, or route the result to students.

The production `solveQuestion` route and the existing Option-F reviewer/improver pipeline were not changed. The diagnostic is available through `POST /api/dev/architectureCShadow` only when the server is non-production and `ENABLE_ARCHITECTURE_C_SHADOW=true` is explicitly set. Otherwise it returns 403. The retained benchmark runner imports the shadow service directly and does not call the production solve route.

## Files

- `src/services/architectureCShadow/structuralGate.ts`
  - Reads raw output before parser defaults.
  - Reports exact missing, invalid, empty, and cardinality reasons.
  - Records every path that `parseLessonResponse` would otherwise default.
- `src/services/architectureCShadow/materialValidator.ts`
  - Uses the existing OpenAI retry and usage/cost infrastructure.
  - Checks only correctness, reasoning, curriculum fit, weak-student sufficiency, hallucination, prerequisites, contradictions, and TeachingLesson completeness.
  - Separates optional polish from material issues.
- `src/services/architectureCShadow/index.ts`
  - Enforces structural-first execution and classification-only behavior.
- `src/routes/devArchitectureCShadow.ts`
  - Development-only diagnostic endpoint.
- `src/benchmark/architectureCShadowBenchmark.ts`
  - Reuses retained Detailed primary metrics and retained reviewer evidence.
  - Limits execution to three retained cases.
- `architecture_c_shadow_results.json`
  - Raw output from the retained shadow benchmark run.

## Benchmark selection

The retained Detailed artifact contains no Easy case. Substituting a Standard-mode lesson would invalidate the comparison, so the retained set was:

| Case | Coverage |
|---|---|
| M4 | Hard Mathematics proof |
| M6 | Medium Mathematics numerical |
| C2 | Medium Chemistry conceptual |

This is a declared evidence limitation, not silently broadened benchmarking.

## Results

| Case | Retained primary | Structural gate | Material validator | Manual safety decision | Classification |
|---|---:|---:|---:|---|---|
| M4 | 16,560 ms; 3,065 tokens; $0.0012456 | `STRUCTURAL_FAIL`, 1 ms | Not run | Fail | Correct fail |
| M6 | 17,346 ms; 3,210 tokens; $0.0013068 | `STRUCTURAL_PASS`, 1 ms | `MATERIAL_FAIL`, 3,370 ms; 2,279 tokens; $0.0004098 | Pass | **False fail** |
| C2 | 16,666 ms; 3,044 tokens; $0.0012249 | `STRUCTURAL_PASS`, 1 ms | `MATERIAL_PASS`, 1,648 ms; 2,075 tokens; $0.0003468 | Pass | Correct pass |

Totals for the retained run:

- Primary cost represented: **$0.0037773**
- New validator cost: **$0.0007566**
- Structural passes: **2/3**
- Structural failures: **1/3**
- Material passes: **1/2 eligible**
- Material failures: **1/2 eligible**
- Validator errors: **0**
- False passes: **0**
- False fails: **1**
- Average eligible shadow-path latency: **2,510 ms**
- M6 primary plus shadow latency: **20,717 ms**
- C2 primary plus shadow latency: **18,315 ms**

## Structural evidence

M4 failed deterministically before any semantic spend:

- `examinerThinking` and all five of its raw subfields were absent.
- `guidedReasoning[2].pause` was absent.
- `commonMistakes[3]` was malformed.
- `commonMistakes` had four items instead of the required three.

The missing paths were also reported as defaulted paths. This proves the gate does not mistake production parser defaults for generated content.

## Material-safety and false-pass/false-fail analysis

### M6 — confirmed false fail

The validator cited `P(Tails) = 90 / 200` as an incorrect calculation. That fraction is correct. The next lesson step explicitly simplifies it to `9/20`, the final answer uses `9/20`, and verification shows `11/20 + 9/20 = 1`.

This is a real Architecture C false fail caused by evaluating an intermediate representation as if it were the final result. It is not a production defect because the shadow result is not routed anywhere.

### C2 — correctly ignored enhancement issues

The broad retained reviewer failed C2 at 73 because its contract scores extensive teaching quality. The material validator passed it because:

- all three requested differences are present and correct;
- cooling is correctly linked to heat taken from the surroundings;
- sweat is supplied as the requested daily-life example.

The validator suggested more examples, a diagram, and a recap as optional polish. Those are valid enhancements but not material safety defects. This is the intended distinction Architecture C is trying to make.

### M4 — correct structural rejection

M4 was rejected without semantic inference because the raw TeachingLesson contract was incomplete and malformed. This avoids both semantic spend and the risk of parser defaults hiding missing generated content.

## Comparison with retained Option-F reviewer evidence

The existing reviewer was not rerun. Retained reviewer evidence was reused:

- M4: fail, overall 66, 5 issues.
- M6: fail, overall 73, 5 issues.
- C2: fail, overall 73, 5 issues.

Reviewer failure is not treated as material-safety ground truth because its threshold includes optional teaching enhancements. C2 demonstrates the desired divergence. M6 demonstrates that the new narrow validator is not yet reliable enough for production gating.

## Verification

- API TypeScript check: passed.
- API build: passed.
- Structural gate exercised against all three retained raw lessons.
- Production isolation confirmed by import search: `solveQuestion.ts` and `services/teachingQuality/*` do not import Architecture C.
- No section repair, Detailed streaming, production A/B routing, curriculum changes, auth changes, or deployment was added.

## Decision

Architecture C is useful as a shadow diagnostic but is **not ready to replace Option F or gate student responses**. The retained sample found no false pass, one correct material pass that the broad reviewer rejected for quality reasons, and one semantic false fail on mathematically equivalent intermediate notation.

ARCHITECTURE C SHADOW VALIDATION COMPLETE — AWAITING FOUNDER DECISION