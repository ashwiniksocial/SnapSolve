/**
 * Student Profile — the persistent identity record of the learner.
 * Created once on first use. Updated incrementally on every interaction.
 */

import { readProfile, writeProfile } from "./syncManager";
import type { StoredProfile } from "./syncManager";

const TODAY = () => new Date().toISOString().slice(0, 10);

function makeId(): string {
  return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function defaultProfile(): StoredProfile {
  return {
    studentId:              makeId(),
    createdAt:              Date.now(),
    updatedAt:              Date.now(),
    preferredDepth:         "basic",
    totalQuestionsAnswered: 0,
    totalStudyTimeMs:       0,
    currentStreak:          0,
    longestStreak:          0,
    lastStudiedDate:        "",
    motivationScore:        50,
    consistencyScore:       50,
    sectionEngagement:      {},
  };
}

/** Returns existing profile or creates a new one on first call. */
export function getOrCreateProfile(): StoredProfile {
  return readProfile() ?? (() => { const p = defaultProfile(); writeProfile(p); return p; })();
}

/** Call whenever the student solves a question. */
export function recordQuestionAnswered(durationMs: number, depth: StoredProfile["preferredDepth"]): void {
  const p = getOrCreateProfile();

  p.totalQuestionsAnswered++;
  p.totalStudyTimeMs += durationMs;
  p.updatedAt = Date.now();

  // Update preferred depth towards the depth actually used
  // (weighted towards the most recent choice)
  if (depth !== p.preferredDepth) {
    // Only update if this depth has been used consistently
    // (simple majority tracking deferred to adaptation engine)
  }

  // Streak logic
  const today = TODAY();
  if (p.lastStudiedDate !== today) {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    if (p.lastStudiedDate === yesterday) {
      p.currentStreak = (p.currentStreak ?? 0) + 1;
    } else {
      p.currentStreak = 1;
    }
    p.longestStreak = Math.max(p.longestStreak, p.currentStreak);
    p.lastStudiedDate = today;
  }

  writeProfile(p);
}

/** Call whenever the student opens a section. Tracks engagement preferences. */
export function recordSectionOpened(sectionKey: string): void {
  const p = getOrCreateProfile();
  p.sectionEngagement[sectionKey] = (p.sectionEngagement[sectionKey] ?? 0) + 1;
  p.updatedAt = Date.now();
  writeProfile(p);
}

/** Update motivation and consistency scores (call after processing weekly sessions). */
export function updateMotivationScore(sessionCountLastWeek: number, goalPerWeek = 5): void {
  const p = getOrCreateProfile();
  const consistency = Math.min(100, Math.round((sessionCountLastWeek / goalPerWeek) * 100));
  // Smooth update: 80% old value + 20% new reading
  p.consistencyScore = Math.round(p.consistencyScore * 0.8 + consistency * 0.2);
  p.motivationScore  = Math.round(
    (p.consistencyScore * 0.5) +
    (Math.min(100, p.currentStreak * 10) * 0.3) +
    (Math.min(100, p.totalQuestionsAnswered * 2) * 0.2)
  );
  p.updatedAt = Date.now();
  writeProfile(p);
}

export function getStudentId(): string {
  return getOrCreateProfile().studentId;
}
