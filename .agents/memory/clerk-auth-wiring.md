---
name: Clerk Auth wiring
description: Critical import paths and wiring rules for Clerk in this monorepo
---

## Frontend (homework-hero)
- `publishableKeyFromHost` must be imported from `@clerk/react/internal`, NOT `@clerk/shared/keys`
  - `@clerk/shared/keys` is only accessible from server packages where `@clerk/shared` is a direct dep
  - `@clerk/react/internal` works because `@clerk/react` is a direct frontend dep
- `clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL` — unconditional, empty in dev is correct
- Tailwind v4: add `@layer theme, base, clerk, components, utilities;` BEFORE `@import "tailwindcss"` in index.css
- Tailwind v4: `tailwindcss({ optimize: false })` in vite.config.ts (prevents prod CSS layer reordering)
- Route wildcards must be exactly `/sign-in/*?` and `/sign-up/*?` (wouter syntax, no substitutes)

## Server (api-server)
- `publishableKeyFromHost` imported from `@clerk/shared/keys` (direct dep installed)
- Clerk proxy middleware must mount BEFORE body parsers: `app.use(CLERK_PROXY_PATH, clerkProxyMiddleware())`
- `clerkMiddleware` mounts AFTER body parsers but BEFORE routes

**Why:** Frontend can't resolve @clerk/shared/keys typings (transitive dep only); backend installs it directly.
