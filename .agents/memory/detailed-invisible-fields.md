---
name: Detailed invisible fields
description: Detailed lesson generation excludes hidden fields while compatibility parsing retains safe empty defaults.
---

## Rule
Keep invisible Detailed fields out of every OpenAI output schema involved in Detailed generation, including the quality improver. The shared parser and types may retain empty defaults for backwards compatibility.

**Why:** The renderer does not display these fields, but the model previously spent a substantial share of completion tokens producing them. `parseLessonResponse` reconstructs absent legacy fields as empty defaults, so returned object property presence cannot prove the model generated content.

**How to apply:** When auditing generation cost, use OpenAI completion telemetry and inspect the active prompt/schema—not the parsed lesson object's keys. Preserve the visible lesson fields and do not remove compatibility defaults unless a separate migration is approved.