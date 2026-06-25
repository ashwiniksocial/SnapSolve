---
name: Student Model Architecture
description: 7-service localStorage-first student model under src/services/studentModel/; Firestore-ready data shapes
---

## Rule
The student model lives in `artifacts/homework-hero/src/services/studentModel/`. Import ONLY from the `index.ts` barrel — never import from individual files directly.

## Services
- `syncManager.ts` — raw read/write (localStorage now, Firestore later — same method signatures)
- `studentProfile.ts` — profile CRUD (createdAt, streak, depth, motivation score)
- `topicMastery.ts` — mastery score 0–100 + Ebbinghaus-style retention decay
- `mistakeEngine.ts` — fingerprints repeated mistakes; threshold = 3 occurrences = persistent
- `studyPatterns.ts` — hour/day frequency, learning velocity, session records
- `adaptationEngine.ts` — `buildStudentContext(subject, topic?)` and `getTutorInsights()`
- `index.ts` — public barrel

## localStorage keys (Firestore-ready paths)
| Key | Firestore path |
|-----|---------------|
| `studyai-v1-profile` | `students/{id}` |
| `studyai-v1-mastery` | `students/{id}/topicMastery` |
| `studyai-v1-sessions` | `students/{id}/sessions` |
| `studyai-v1-mistakes` | `students/{id}/mistakes` |
| `studyai-v1-patterns` | `students/{id}/studyPatterns` |

## UI
- `src/components/tutor/TutorInsightBanner.tsx` — 1-line personalised insight above every solution (hidden for new students with < 2 questions)
- `src/components/tutor/StudentProfileView.tsx` — full profile page
- `src/components/tutor/MasteryMapView.tsx` — topic mastery grid

## Entry points
- `SolutionCard.tsx` — calls `recordTopicVisit`, `recordMistakesFromResponse`, `recordSession`, `recordQuestionAnswered` on mount/unmount
- `Progress.tsx` — has tab switcher: "Analytics" | "AI Tutor Profile" (renders StudentProfileView)

**Why:** Firestore migration is a drop-in replacement — only `syncManager.ts` changes, all callers stay the same.
