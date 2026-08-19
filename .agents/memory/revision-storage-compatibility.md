---
name: Revision storage compatibility
description: Backward-compatible access to the existing revision planner persistence key.
---

The existing revision planner key can contain either the historical flat question-ID map or the Beta envelope that also holds self-assessments. Any consumer that reads revision items directly must unwrap both shapes before iterating items.

**Why:** Self-assessment belongs at the established revision-planner persistence boundary, but legacy learning, mission, and history features already consume its revision records.

**How to apply:** Preserve the envelope when adding planner-level data and use the shared compatibility reader for every direct revision-key consumer until a deliberate versioned migration retires the flat form.