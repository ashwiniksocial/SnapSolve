---
name: Master Teacher Engine
description: Planning layer that builds a TeachingBlueprint before lesson generation — concept dependency order, per-concept confusions, analogies, checkpoints, pacing.
---

## Location
`artifacts/api-server/src/services/masterTeacher/` — 10 files

## Role in the pipeline
```
buildTeachingBlueprint(subject, question, apiKey)  [planning call — 1 OpenAI call]
    ↓ BlueprintInjection { systemSuffix, userPrefix, conceptCount, planningUsed }
generateDraft(subject, question, ctx, blueprint)   [generation call — uses blueprint]
    ↓ draft lesson
runQualityPipeline(draft, apiKey)                  [quality review/improve]
    ↓ final lesson
return to client
```

## Files and their roles

| File | Role |
|---|---|
| `teacherMindset.ts` | Core teacher philosophy as a prompt constant (no AI calls) |
| `confusionPredictor.ts` | Types + prompt rules for per-concept confusion prediction |
| `analogySelector.ts` | Types + rules for choosing real-life analogies |
| `microTeachingEngine.ts` | One-idea-per-paragraph rule (prompt constant) |
| `scaffoldingEngine.ts` | Observe→recall→teach→example→think→confirm→connect stages |
| `studentCheckpointEngine.ts` | Tiny checkpoint questions after each concept |
| `lessonPacingEngine.ts` | Cognitive load levels (low/medium/high) + split rules |
| `teacherDialogueEngine.ts` | Before/after examples, forbidden phrases, dialogue starters |
| `lessonPlanner.ts` | The ONE OpenAI planning call → TeachingBlueprint JSON |
| `index.ts` | Orchestrator: calls planner, formats blueprint for injection |

## Blueprint injection
- `systemSuffix`: appended to SYSTEM_PROMPTS[subject] — universal rules for every lesson
- `userPrefix`: prepended to user message — question-specific concept order, confusions, analogies, checkpoints, pacing notes, dialogue tips
- Injection happens ONLY inside `generateDraft()` in `solveQuestion.ts`

## Planning call details
- Model: gpt-4o-mini, temp 0.2, max_tokens 2000, timeout 20s
- Returns: conceptOrder[] (dependency-ordered), teachingApproach, pacingNotes, dialogueTips
- Each concept has: cognitiveLoad, confusions[], analogy, checkpoint, teachingNote

## Graceful degradation
`buildTeachingBlueprint` never throws. If the planning call fails, it returns `{ systemSuffix, userPrefix: "", conceptCount: 0, planningUsed: false }`. The lesson generation continues with the universal system suffix (teacher mindset + dialogue rules) but no question-specific blueprint.

## Logging
- `"solveQuestion: teaching blueprint built"` — logs concepts count + planningUsed flag
- `"solveQuestion: blueprint build failed"` — WARN if planning call errors

## Why
**Why:** "The lesson should be planned before it is written." A teacher who plans concept dependency order first writes a lesson that never assumes knowledge out of order. The blueprint makes the AI teach intentionally, not improvise.

**How to apply:** Any new teaching module (e.g. example selector, diagram describer) should be added to `masterTeacher/` as a pure prompt fragment, then assembled into the blueprint in `index.ts`. Never make the teaching modules stateful or add new OpenAI calls without reading this file first.
