---
name: Script diagnostic module mode
description: Use the correct module mode for one-off TypeScript diagnostics that import scripts tied to canonical curriculum paths.
---

For inline diagnostics that import `scripts/src/canonicalCurriculum.ts` (directly or through `academicReview.ts`), run under Node ESM with the `tsx/esm` loader. `tsx -e` evaluates as CommonJS in this workspace, so `import.meta.dirname` is unavailable and path initialization fails before the diagnostic reaches its target code.

**Why:** The canonical curriculum script derives repository-relative file paths from `import.meta.dirname`; a CommonJS-evaluated snippet cannot supply that value.

**How to apply:** Prefer a normal ESM script file, or use `node --import tsx/esm --input-type=module -e` for a short inline diagnostic.
