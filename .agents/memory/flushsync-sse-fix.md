---
name: flushSync SSE fix
description: React 18 batching defers setState inside async SSE loop until stream completes — requires flushSync for immediate renders.
---

## Rule
Any `setState` call inside an async SSE reading loop (Promise chain with `await reader.read()`) must be wrapped in `flushSync(() => { ... })` from `react-dom`. Without it, React 18 automatic batching defers all updates until the full stream completes — showing a spinner for 20+ seconds instead of progressive content.

**Why:** React 18 automatic batching applies to async contexts. `setSolution`/`setPageState` calls inside `onPartial` (called from `solveBankWithStream` → `callBankStream`'s SSE loop) are batched. React's scheduler uses `MessageChannel` (macrotask) to flush updates. Between consecutive `await reader.read()` microtask resolutions, the MessageChannel macrotask may never fire if data arrives faster than the scheduler tick. Result: spinner for full stream duration (~20s), then complete solution at once.

**How to apply:** In Solution.tsx, every `onPartial` callback (bank path and standard-mode path) must wrap `setSolution` + `setPageState("done")` in `flushSync`. Import: `import { flushSync } from "react-dom"`.

## Measured result (after fix)
- step_0 visible in browser: ~2.7–2.9 s (Maths/Physics/IT)
- Before fix: solution visible only after full stream completes (20–22 s)
- Cached repeat: 2–5 ms (server in-memory) / <50 ms (localStorage)
