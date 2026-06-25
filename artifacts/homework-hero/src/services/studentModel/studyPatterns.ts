/**
 * Study Patterns — tracks WHEN and HOW LONG the student studies.
 *
 * Derives:
 *  - Best study hour (0–23)
 *  - Best study day (0=Sun … 6=Sat)
 *  - Average session length
 *  - Preferred subject
 *  - Session frequency per week
 *  - Learning velocity (questions per hour)
 */

import { readPatterns, writePatterns, readSessions, appendSession } from "./syncManager";
import type { SessionRecord, StudyPatternsRecord } from "./syncManager";

export function recordSession(session: SessionRecord): void {
  appendSession(session);
  _updatePatterns(session);
}

function _updatePatterns(session: SessionRecord): void {
  const p = readPatterns();
  const start = new Date(session.startTime);

  p.hourFrequency[start.getHours()]++;
  p.dayFrequency[start.getDay()]++;

  const n = p.totalSessions;
  p.avgSessionMs = Math.round((p.avgSessionMs * n + session.durationMs) / (n + 1));
  p.totalSessions = n + 1;

  const subj = session.subject;
  p.subjectTime[subj] = (p.subjectTime[subj] ?? 0) + session.durationMs;

  // Weekly goal: ≥5 sessions in last 7 days
  const week = Date.now() - 7 * 86_400_000;
  const recentSessions = readSessions().filter((s) => s.startTime >= week);
  p.weeklyGoalMet = recentSessions.length >= 5;

  p.lastUpdated = Date.now();
  writePatterns(p);
}

export function getBestStudyHour(): number {
  const p = readPatterns();
  const max = Math.max(...p.hourFrequency);
  if (max === 0) return 18; // default: 6 PM
  return p.hourFrequency.indexOf(max);
}

export function getBestStudyTimeLabel(): string {
  const hour = getBestStudyHour();
  if (hour >= 5  && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getPreferredSubject(): string | null {
  const p = readPatterns();
  const entries = Object.entries(p.subjectTime);
  if (!entries.length) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

/** Sessions in the last N days. */
export function getRecentSessions(days = 7): SessionRecord[] {
  const cutoff = Date.now() - days * 86_400_000;
  return readSessions().filter((s) => s.startTime >= cutoff);
}

/** Average questions per hour across all sessions. */
export function getLearningVelocity(): "fast" | "medium" | "slow" {
  const sessions = readSessions();
  if (sessions.length < 3) return "medium"; // not enough data
  const avgMs = sessions.reduce((s, x) => s + x.durationMs, 0) / sessions.length;
  // Fast: < 3 min per question, Slow: > 8 min, Medium: in between
  if (avgMs < 3 * 60_000) return "fast";
  if (avgMs > 8 * 60_000) return "slow";
  return "medium";
}

/** How many days since last study session. */
export function getDaysSinceLastStudy(): number {
  const sessions = readSessions();
  if (!sessions.length) return 99;
  const last = Math.max(...sessions.map((s) => s.startTime));
  return Math.floor((Date.now() - last) / 86_400_000);
}
