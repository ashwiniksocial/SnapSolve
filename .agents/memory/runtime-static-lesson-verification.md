---
name: Runtime static lesson verification
description: Why valid pre-generated assets still require a browser-level no-stream test.
---

A passing static-asset validator is not sufficient evidence that a pre-generated lesson avoids the runtime streaming fallback.

**Why:** The validator can confirm hashes, lesson completeness, and chunk contents while the live browser path still attempts the streaming endpoint. This creates an avoidable AI-cost risk despite apparently valid pilot assets.

**How to apply:** Before declaring any instant lesson ready, use an authenticated browser test that intercepts the streaming route at the browser boundary, opens the exact Practice-originated Solution URL, waits after the lesson renders, and asserts that the intercepted request count remains zero.