---
name: Offline question-bank audit
description: Node validation must use the source discovery reader rather than directly importing the browser question-bank aggregator.
---

For offline scripts, obtain student-visible questions through the project’s source-discovery reader instead of importing the frontend question-bank aggregator directly. Its mixed science-placeholder module is a special case: include its active Biology subset, but never its Earth Science subset, when mirroring the Beta student gateway.

**Why:** The mixed legacy question-bank modules can load successfully through Vite in the browser but fail under the Node/tsx module loader because of a legacy named-export mismatch. The science-placeholder module also exports a named array rather than the usual question-array name; excluding it wholesale silently removes the active 75-question Biology chapter, while including it wholesale incorrectly adds 85 Earth Science questions outside Beta scope. That is a validation-runtime difference, not a reason to change frozen question content.

**How to apply:** New Node audits and deterministic scripts should use the existing source-discovery path, then cast only the narrow shared question shape they need. When calculating Beta scope, explicitly load the active Biology subset of the special module and exclude Earth Science; this keeps the audit aligned with the frontend’s 1,375-question gateway. Keep browser query behavior validated through the web build and UI smoke tests.