/**
 * Topic Mastery — tracks how well the student understands each topic.
 *
 * Mastery score (0–100):
 *   +20 per correct conceptual answer
 *   -10 per incorrect
 *   Decays towards 50 over time (forgetting curve)
 *
 * Retention score (0–100):
 *   Simulates the Ebbinghaus forgetting curve.
 *   Decays by ~20% per day after 7 days of no practice.
 */

import { readAllMastery, writeMasteryEntry } from "./syncManager";
import type { TopicMasteryEntry } from "./syncManager";

const DECAY_START_DAYS = 7;    // retention starts decaying after 7 days
const DECAY_PER_DAY    = 0.15; // 15% retention lost per day after the grace period

function topicKey(subject: string, topic: string): string {
  return `${subject}::${topic}`.toLowerCase().replace(/\s+/g, "_");
}

function computeRetention(entry: TopicMasteryEntry): number {
  const daysSince = (Date.now() - entry.lastPracticed) / 86_400_000;
  if (daysSince <= DECAY_START_DAYS) return entry.retentionScore;
  const decayDays = daysSince - DECAY_START_DAYS;
  return Math.max(10, Math.round(entry.retentionScore * Math.pow(1 - DECAY_PER_DAY, decayDays)));
}

export function getMasteryEntry(subject: string, topic: string): TopicMasteryEntry | null {
  const all = readAllMastery();
  return all[topicKey(subject, topic)] ?? null;
}

export function getAllMasteryEntries(): TopicMasteryEntry[] {
  return Object.values(readAllMastery()).map((e) => ({
    ...e,
    retentionScore: computeRetention(e),
  }));
}

/** Called after a learning loop question is answered. */
export function updateMasteryAfterAnswer(
  subject:   string,
  topic:     string,
  correct:   boolean,
  timeMs:    number,
  depth:     "basic" | "standard" | "advanced",
): TopicMasteryEntry {
  const all = readAllMastery();
  const key = topicKey(subject, topic);
  const now = Date.now();

  const existing = all[key];
  const prev: TopicMasteryEntry = existing ?? {
    topic,
    subject,
    masteryScore:     50,
    attempts:         0,
    correctCount:     0,
    lastPracticed:    now,
    firstSeen:        now,
    avgTimeMs:        timeMs,
    confusionPoints:  [],
    mistakeCount:     0,
    explanationDepth: depth,
    retentionScore:   50,
  };

  const delta = correct ? 20 : -10;
  const newScore = Math.min(100, Math.max(0, prev.masteryScore + delta));
  const newCorrect = prev.correctCount + (correct ? 1 : 0);
  const newAttempts = prev.attempts + 1;

  const updated: TopicMasteryEntry = {
    ...prev,
    masteryScore:     newScore,
    attempts:         newAttempts,
    correctCount:     newCorrect,
    lastPracticed:    now,
    avgTimeMs:        Math.round((prev.avgTimeMs * (newAttempts - 1) + timeMs) / newAttempts),
    explanationDepth: depth,
    retentionScore:   Math.min(100, newScore + 10), // reset retention on practice
  };

  writeMasteryEntry(key, updated);
  return updated;
}

/** Called after a question is solved (not necessarily answered correctly). */
export function recordTopicVisit(
  subject: string,
  topic:   string,
  timeMs:  number,
  depth:   "basic" | "standard" | "advanced",
): void {
  const all = readAllMastery();
  const key = topicKey(subject, topic);
  const now = Date.now();

  const existing = all[key];
  if (!existing) {
    writeMasteryEntry(key, {
      topic, subject,
      masteryScore: 50, attempts: 1, correctCount: 0,
      lastPracticed: now, firstSeen: now,
      avgTimeMs: timeMs, confusionPoints: [], mistakeCount: 0,
      explanationDepth: depth, retentionScore: 50,
    });
  } else {
    const newAttempts = existing.attempts + 1;
    writeMasteryEntry(key, {
      ...existing,
      attempts:         newAttempts,
      lastPracticed:    now,
      avgTimeMs:        Math.round((existing.avgTimeMs * (newAttempts - 1) + timeMs) / newAttempts),
      explanationDepth: depth,
    });
  }
}

export function addConfusionPoint(subject: string, topic: string, point: string): void {
  const all = readAllMastery();
  const key = topicKey(subject, topic);
  const entry = all[key];
  if (!entry) return;
  if (!entry.confusionPoints.includes(point)) {
    entry.confusionPoints = [...entry.confusionPoints.slice(-9), point];
    writeMasteryEntry(key, { ...entry, mistakeCount: entry.mistakeCount + 1 });
  }
}

/** Returns topics with retention score below threshold (need revision). */
export function getTopicsNeedingRevision(threshold = 60): TopicMasteryEntry[] {
  return getAllMasteryEntries().filter((e) => e.retentionScore < threshold && e.attempts >= 2);
}

/** Returns topics ready to go deeper (high mastery, practiced recently). */
export function getTopicsReadyForAdvanced(threshold = 80): TopicMasteryEntry[] {
  const cutoff = Date.now() - 14 * 86_400_000; // practiced in last 14 days
  return getAllMasteryEntries().filter(
    (e) => e.masteryScore >= threshold && e.lastPracticed >= cutoff
  );
}

/** Returns the student's weakest topics. */
export function getWeakTopics(n = 5): TopicMasteryEntry[] {
  return getAllMasteryEntries()
    .filter((e) => e.attempts >= 2)
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, n);
}
