---
name: Lazy lesson chunks
description: Runtime and tooling constraints for compressed, chapter-level pre-generated lesson assets.
---

Pre-generated lesson chunks are per-authoritative chapter and stored as gzip/base64 TypeScript modules so the browser only imports the selected chapter’s payload. The scripts validate and write the same format without model calls.

**Why:** Vite only code-splits a direct `import.meta.glob(...)` call. Optional chaining on `import.meta.glob` prevented its transform, which silently left the lessons unavailable at runtime.

**How to apply:** Keep the direct glob call in a `typeof import.meta.glob === "function"` branch (with the Vite client type reference). This keeps Node-based tooling safe while preserving Vite’s static chunk discovery. Derive the module path solely from class, subject, and chapter metadata.