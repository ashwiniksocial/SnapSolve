---
name: Curriculum Gateway design
description: How the curriculum gateway validates question-bank chapter files; key parsing rules and the chapterName-sync requirement.
---

## Key rules

**V1 file parsing (parsV1Meta):**
- Use `[^{]*` (not `[^}]*`) to stop before topics block
- Use `[^"]+` (not `[^"']+`) for strings that may contain apostrophes
- Authoritative NCERT chapter list is hardcoded in the script EXPECTED map; chapterRegistry is incomplete and must not be used as the source of truth

**chapterName sync rule:**
- The gateway EXPECTED map (scripts/src/curriculumGateway.ts) entry `name:` must exactly match the `chapterName:` string used in the question-bank files (case-sensitive, trimmed)
- F7 fires ("Missing: 'X'") if the EXPECTED name is not found in any source file via `src.includes(\`chapterName: "\${exp.name}"\`)`
- Whenever you change or correct `chapterName` in a question file, update the EXPECTED entry in the gateway to match — in the same edit session

**Why:** F7 uses a literal string include search, not fuzzy matching. "Exploring Mixtures" will not match "Exploring Mixtures and Their Separation".

**How to apply:** After any chapterName rename (official title update, scope correction), grep `curriculumGateway.ts` for the old name and update it. Run `pnpm --filter @workspace/scripts run curriculum-check` to confirm no F7 for the affected subject.

## 9-Chemistry gateway output note
The gateway summary printout does not emit a `[PASS] 9-Chemistry` line even when chemistry is clean — it only prints per-class lines for subjects where there are chapters discovered via chapterRecord parsing. Clean chemistry = simply absent from the FAIL list.
