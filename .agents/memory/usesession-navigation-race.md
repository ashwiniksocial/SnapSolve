---
name: useSession navigation race fix
description: React 18 automatic batching causes session.question to be empty when navigating from Practice to Solution; fix pattern documented here.
---

## The Rule
Never rely on `setSession(fn)` with a side-effect (`save()`) inside the updater when the same event handler calls `navigate()` immediately after.

## Why
React 18 automatic batching defers functional updaters until after the event handler completes. If `navigate()` causes a new component to mount in the same batch, that component's `useState(load)` reads localStorage **before** the updater has run — so `session.question` is the stale (empty) default.

This produced a consistent `backend_400` error: Practice page click → `update({question:...})` → `navigate("/solution?practiceMode=1")` → Solution.tsx loads → `session.question === ""` → API returns 400 (`invalid_question`).

## How to Apply
In `useSession.ts`, write localStorage **synchronously before** queuing the React state update:

```typescript
const update = useCallback((patch: Partial<SessionData>) => {
  // Eagerly write — runs before navigate() sees the new page
  const next = { ...load(), ...patch };
  save(next);
  setSession(next);  // NOT a functional updater
}, []);
```

Do NOT use `setSession((prev) => { save(next); return next; })` if navigation immediately follows. The functional updater is deferred; the direct call is not.
