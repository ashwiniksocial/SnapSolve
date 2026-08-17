---
name: Bank Question Teaching Modes
description: How bank questions are converted to TeachingLesson for mode-differentiated rendering
---

## The Problem (fixed)
Bank fast-path in Solution.tsx was building `bankResult` with NO `lesson` field.
TeachingLayout routed to LegacyRenderer. LegacyRenderer gated sections on fields
never populated by bank fast-path (`commonMistakes`, `similarExample`, etc.) → all hidden.
StepReasoningCard uses `step.whyThisStep` but bank SolutionStep only has `explanation` → WHY box never appeared.
Net: Detailed = Standard = Compact for all bank questions.

## The Fix
1. **Solution.tsx bank fast-path**: Build `bankLesson: TeachingLesson` from Question fields:
   - `hint` → `questionTranslation.plainEnglish` (shown in Detailed+Standard, hidden Compact)
   - `steps[].title` → `guidedReasoning[].what`
   - `steps[].explanation` → `guidedReasoning[].why` (rendered differently per mode)
   - `steps[].formula` → `guidedReasoning[].math`
   - `steps[].result` → `guidedReasoning[].result`
   - All other fields (commonMistakes, simplerExample, rememberThese): empty → sections hidden
   - Set `lesson: bankLesson` on bankResult → routes through LessonRenderer

2. **TeachingLayout.tsx GuidedStepCard**: Now accepts `level: ReadingLevel`:
   - Detailed: `why` always-visible inline prose block ("Why this step" label)
   - Standard: `why` collapsible toggle (closed by default)
   - Compact: `why` hidden entirely; pause also hidden

3. **LessonRenderer empty-section guards** (prevent hollow section headers):
   - `show.intuition`: also requires story|visual|everyday to be non-empty
   - `show.mistakes`: also requires `lesson.commonMistakes.length > 0`
   - `show.similar`: also requires `!!lesson.simplerExample?.problem`
   - `show.remember`: also requires `lesson.rememberThese.length > 0`

## Result per mode for bank questions
| Section | Detailed | Standard | Compact |
|---------|----------|----------|---------|
| Key Concept | ✅ | ✅ | ❌ |
| Understand Question (hint) | ✅ | ✅ | ❌ |
| Steps: title+math+result+**why inline** | ✅ | — | — |
| Steps: title+math+result+**why toggle** | — | ✅ | — |
| Steps: title+math+result only | — | — | ✅ |
| Final Answer | ✅ | ✅ | ✅ |

**Why:** `explanation` is the step's pedagogical justification — showing it always in Detailed
gives comprehensive teaching; toggling in Standard gives clean method with optional depth;
hiding in Compact gives exam-speed review.
