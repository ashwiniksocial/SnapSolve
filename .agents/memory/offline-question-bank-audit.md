---
name: Offline question-bank audit
description: Node validation must use the source discovery reader rather than directly importing the browser question-bank aggregator.
---

For offline scripts, obtain student-visible questions through the project’s source-discovery reader instead of importing the frontend question-bank aggregator directly.

**Why:** The mixed legacy question-bank modules can load successfully through Vite in the browser but fail under the Node/tsx module loader because of a legacy named-export mismatch. That is a validation-runtime difference, not a reason to change frozen question content.

**How to apply:** New Node audits and deterministic scripts should use the existing source-discovery path, then cast only the narrow shared question shape they need. Keep browser query behavior validated through the web build and UI smoke tests.