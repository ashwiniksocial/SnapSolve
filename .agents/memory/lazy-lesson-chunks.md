---
name: Lazy lesson chunks
description: Runtime and tooling constraints for compressed, chapter-level pre-generated lesson assets.
---

Pre-generated lesson chunks are per-authoritative chapter and stored as gzip/base64 TypeScript modules so the browser only imports the selected chapter's payload. The scripts validate and write the same format without model calls.

**Why:** `import.meta.glob` is a COMPILE-TIME Vite transform, not a runtime function. A runtime guard like `typeof import.meta.glob === "function"` evaluates to `"undefined"` in the browser, so a ternary guard silently discards the transformed glob object — every chapter lookup misses and valid pre-generated questions fall through to the paid streaming fallback. This shipped as a real P0 and was only caught by real-browser network tracing.

**How to apply:** Call `import.meta.glob(...)` unconditionally inside a try/catch IIFE — under Vite the transformed object is returned; in Node tooling (deterministic validator imports this module) the call throws and the catch returns `{}`. Never gate the call behind a runtime `typeof` check. Derive the module path solely from class, subject, and chapter metadata.

**Filename rule:** chunk filenames must be URL-safe WITHOUT percent-encoding. A literal `%20` in a filename breaks browser dynamic import (dev server percent-decodes the request URL to a path with a real space → 404 → silent fallback to paid streaming; observed on Information Technology). Both `chunkPath()` in preGeneratedLessons.ts and `chunkFileToken()` in the generator script replace non `[A-Za-z0-9_-]` runs with `_` and must stay in lockstep.

**Failure caching:** a transient decode/import failure must not be cached as a permanent miss — `loadChunk` deletes the cached rejection so a later attempt retries.
