---
name: Model Benchmark Findings (Luna/Terra vs gpt-4o-mini)
description: API compatibility constraints, reliability results, and quality scores for gpt-5.6-luna and gpt-5.6-terra vs baseline; recommendation is to stay on gpt-4o-mini.
---

# Model Benchmark Findings

## API Compatibility Adjustments (both Luna and Terra)
Three parameters must change vs gpt-4o-mini:
1. `max_tokens` → `max_completion_tokens`
2. `temperature: 0.3` must be **omitted** (only default=1 accepted; 400 error otherwise)
3. `response_format: { type: "json_object" }` must be **omitted** (400 error); JSON comes from prompt instruction alone — add `extractJson` fence-stripping on the parse path
4. Luna/Terra are **reasoning models** — internal reasoning tokens count against `max_completion_tokens`

## Critical Reliability Problem (Standard mode, production budget 1200 tokens)
At 1200 `max_completion_tokens`, Luna's reasoning phase exhausts the budget on Hard/multi-step questions:
- **Luna**: 10/24 = 42% parse failures (empty content, status 200, finish_reason "stop")
- **Terra**: 2/24 = 8% parse failures
- **gpt-4o-mini**: 0/24 failures

Failure pattern: Hard-difficulty questions are disproportionately affected. Easy MCQs succeed.
Fix: increase to 4000 tokens (Standard) or 6000 tokens (Detailed) for Luna/Terra.

## Quality Scores (Detailed mode, 6 representative questions, adequate token budget)
All three models fail the 80/100 pass threshold. Scores:
- gpt-4o-mini: 69/100 avg (range 66–73)
- gpt-5.6-luna: 69/100 avg (range 66–79)
- gpt-5.6-terra: **72/100** avg (range 66–79)

Hard questions (M4 proof, P4 physics, B4 biology): ALL models score 50 on conceptTeaching and reasoning — this is a prompt bottleneck (CMF-1/CMF-2 failure), not a model gap.

Terra advantages: +4 on conceptTeaching/reasoning on Medium-difficulty questions; +8 on vocabulary and confidenceBuilding (due to ~78% more output tokens).

Luna advantages: slightly better on Chemistry conceptual and CS algorithmic Medium questions (+6 pts vs mini).

## Cost and Latency at Adequate Budget (Detailed mode)
- gpt-4o-mini: $0.002161/q, 18.9s
- gpt-5.6-luna: $0.003402/q (+57%), 25.6s
- gpt-5.6-terra: $0.003257/q (+51%), 31.1s

Terra's 31s latency exceeds the 15s Standard-mode AbortController budget — would require eliminating that guard.

## Recommendation (NOT YET IMPLEMENTED)
**Stay on gpt-4o-mini.** Luna fails 42% of production questions at current parameters. Terra is 51% more expensive with only +3 quality points.

**If escalation ever pursued:** Selective Terra-only escalation for Hard-difficulty questions (after prompt improvements lift Hard scores above 75). No Luna path.

## Benchmark artifacts
- Full report: `artifacts/api-server/benchmark_report.md`
- Raw results (Standard 24q): `artifacts/api-server/benchmark_results.json`
- Raw results (Detailed 6q): `artifacts/api-server/benchmark_results_detailed.json`
- Benchmark script: `artifacts/api-server/src/benchmark/modelBenchmark.ts`
