/**
 * Mistake Engine — fingerprints repeated mistakes.
 *
 * Every time the AI returns `commonMistakes` or `examTrap` for a topic,
 * this engine records them. When the same mistake description appears
 * multiple times across sessions, it marks it as a "persistent pattern."
 *
 * Persistent patterns are surfaced to the AI as student context so the
 * tutor can pro-actively address them in the next explanation.
 */

import { readAllMistakes, recordMistake } from "./syncManager";
import type { MistakeRecord } from "./syncManager";

const PERSISTENT_THRESHOLD = 3; // seen ≥ 3 times = persistent pattern

/** Record mistakes from an AI response (called after each solve). */
export function recordMistakesFromResponse(
  subject: string,
  topic:   string,
  commonMistakes: string[],
  examTrap?: string,
): void {
  const key = `${subject}::${topic}`.toLowerCase().replace(/\s+/g, "_");

  for (const desc of commonMistakes) {
    recordMistake(key, {
      mistakeId: `m-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      topic,
      subject,
      description: desc,
      resolved: false,
    });
  }

  if (examTrap) {
    recordMistake(key, {
      mistakeId: `t-${Date.now()}`,
      topic,
      subject,
      description: `[EXAM TRAP] ${examTrap}`,
      resolved: false,
    });
  }
}

/** Returns all mistakes for a given topic, sorted by frequency. */
export function getTopicMistakes(subject: string, topic: string): MistakeRecord[] {
  const all = readAllMistakes();
  const key = `${subject}::${topic}`.toLowerCase().replace(/\s+/g, "_");
  return (all[key] ?? []).sort((a, b) => b.occurrences - a.occurrences);
}

/** Returns persistent mistake patterns (recurring across sessions). */
export function getPersistentMistakes(subject: string, topic: string): MistakeRecord[] {
  return getTopicMistakes(subject, topic).filter((m) => m.occurrences >= PERSISTENT_THRESHOLD);
}

/** Returns all persistent mistakes across all topics (for global student profile). */
export function getAllPersistentMistakes(): MistakeRecord[] {
  const all = readAllMistakes();
  return Object.values(all)
    .flat()
    .filter((m) => m.occurrences >= PERSISTENT_THRESHOLD)
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 10);
}

/** Mark a mistake as resolved (e.g., student answered a conceptual question correctly). */
export function resolveMistake(subject: string, topic: string, description: string): void {
  const all = readAllMistakes();
  const key = `${subject}::${topic}`.toLowerCase().replace(/\s+/g, "_");
  const entry = (all[key] ?? []).find((m) => m.description === description);
  if (entry) {
    entry.resolved = true;
    try { localStorage.setItem("studyai-v1-mistakes", JSON.stringify(all)); } catch {}
  }
}
