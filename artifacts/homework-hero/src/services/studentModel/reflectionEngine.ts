/**
 * Reflection Engine — generates post-session and weekly reflection summaries.
 *
 * What it does:
 *  - Generates a "Today I learned..." summary after each session
 *  - Produces a weekly learning narrative (what changed this week)
 *  - Tracks "I can now..." milestones (topic first mastered above 70)
 *  - Captures confusions and turns them into revision flags
 *  - Stores the student's own notes / journal entries per topic
 *
 * Firestore path: students/{id}/reflections
 */

import { getAllMasteryEntries }   from "./topicMastery";
import { getRecentSessions }      from "./studyPatterns";
import { getMasterySnapshot }     from "./masteryEngine";

const KEY_DAILY     = "studyai-v1-daily-reflections";
const KEY_MILESTONES = "studyai-v1-milestones";
const KEY_NOTES     = "studyai-v1-topic-notes";

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface DailyReflection {
  date:           string;  // "YYYY-MM-DD"
  learnedItems:   string[];   // "I learned that..."
  confusions:     string[];   // "I'm still confused about..."
  canNow:         string[];   // "I can now..."
  topicsStudied:  string[];
  questionsCount: number;
  studyMins:      number;
  moodScore:      number | null;  // 1–5, self-reported
}

export interface MilestoneMoment {
  milestoneId:  string;
  topic:        string;
  subject:      string;
  type:         "first_mastered" | "streak_7" | "bloom_level_up" | "gap_closed" | "perfect_session";
  description:  string;
  achievedAt:   number;
}

export interface TopicNote {
  topicKey:   string;
  topic:      string;
  subject:    string;
  notes:      string[];   // student's own notes
  savedAt:    number;
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(key: string, val: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Daily Reflections ─────────────────────────────────────────────────────────

export function getTodayReflection(): DailyReflection | null {
  const today = new Date().toISOString().slice(0, 10);
  const all   = lsRead<DailyReflection[]>(KEY_DAILY, []);
  return all.find((r) => r.date === today) ?? null;
}

export function getAllReflections(): DailyReflection[] {
  return lsRead<DailyReflection[]>(KEY_DAILY, []);
}

/** Auto-generate today's reflection from session data. */
export function generateDailyReflection(): DailyReflection {
  const today    = new Date().toISOString().slice(0, 10);
  const sessions = getRecentSessions(1);
  const entries  = getAllMasteryEntries();
  const snap     = getMasterySnapshot();

  const topicsStudied = [...new Set(sessions.map((s) => s.topic))];
  const questionsCount = sessions.length;
  const studyMins = Math.round(sessions.reduce((s, x) => s + x.durationMs, 0) / 60_000);

  // "Learned that..." — from topics with improving mastery
  const learnedItems: string[] = topicsStudied.map((topic) => {
    const entry = entries.find((e) => e.topic === topic);
    if (!entry) return `Explored ${topic}`;
    if (entry.masteryScore >= 70) return `Mastered the key ideas in ${topic}`;
    if (entry.masteryScore >= 50) return `Made solid progress on ${topic}`;
    return `Started building understanding of ${topic}`;
  }).slice(0, 4);

  // "I can now..." — from high-mastery topics studied today
  const canNow: string[] = topicsStudied
    .filter((topic) => {
      const e = entries.find((en) => en.topic === topic);
      return e && e.masteryScore >= 65;
    })
    .map((topic) => `Solve ${topic} problems independently`)
    .slice(0, 3);

  // Confusions — topics with low mastery despite multiple attempts
  const confusions: string[] = entries
    .filter((e) => topicsStudied.includes(e.topic) && e.masteryScore < 45 && e.attempts >= 2)
    .map((e) => `Still working on understanding ${e.topic}`)
    .slice(0, 2);

  const existing = getAllReflections();
  const updated  = existing.filter((r) => r.date !== today);
  const reflection: DailyReflection = {
    date: today, learnedItems, confusions, canNow,
    topicsStudied, questionsCount, studyMins, moodScore: null,
  };
  updated.push(reflection);
  if (updated.length > 30) updated.splice(0, updated.length - 30); // keep 30 days
  lsWrite(KEY_DAILY, updated);
  return reflection;
}

export function saveMoodScore(score: number): void {
  const today = new Date().toISOString().slice(0, 10);
  const all   = lsRead<DailyReflection[]>(KEY_DAILY, []);
  const entry = all.find((r) => r.date === today);
  if (entry) { entry.moodScore = score; lsWrite(KEY_DAILY, all); }
}

// ── Weekly Narrative ──────────────────────────────────────────────────────────

export function generateWeeklyNarrative(): string {
  const reflections = getAllReflections().slice(-7);
  if (reflections.length === 0) return "No activity this week yet.";

  const totalMins     = reflections.reduce((s, r) => s + r.studyMins, 0);
  const totalQ        = reflections.reduce((s, r) => s + r.questionsCount, 0);
  const topicsAll     = [...new Set(reflections.flatMap((r) => r.topicsStudied))];
  const canNowAll     = [...new Set(reflections.flatMap((r) => r.canNow))];
  const confusionsAll = [...new Set(reflections.flatMap((r) => r.confusions))];

  const lines: string[] = [];
  lines.push(`This week you studied for ${totalMins} minutes across ${reflections.length} session${reflections.length !== 1 ? "s" : ""} and solved ${totalQ} question${totalQ !== 1 ? "s" : ""}.`);
  if (topicsAll.length > 0) lines.push(`Topics covered: ${topicsAll.join(", ")}.`);
  if (canNowAll.length > 0) lines.push(`New skills unlocked: ${canNowAll.join("; ")}.`);
  if (confusionsAll.length > 0) lines.push(`Still needs work: ${confusionsAll.join("; ")}.`);
  return lines.join(" ");
}

// ── Milestones ────────────────────────────────────────────────────────────────

export function getMilestones(): MilestoneMoment[] {
  return lsRead<MilestoneMoment[]>(KEY_MILESTONES, []);
}

export function recordMilestone(m: Omit<MilestoneMoment, "milestoneId" | "achievedAt">): void {
  const all = getMilestones();
  // Don't duplicate milestones of the same type for same topic
  const dup = all.find((x) => x.topic === m.topic && x.type === m.type);
  if (dup) return;
  all.push({ ...m, milestoneId: `ms-${Date.now().toString(36)}`, achievedAt: Date.now() });
  if (all.length > 50) all.splice(0, all.length - 50);
  lsWrite(KEY_MILESTONES, all);
}

export function getLatestMilestone(): MilestoneMoment | null {
  const all = getMilestones();
  return all.length ? all[all.length - 1] : null;
}

// ── Topic Notes ───────────────────────────────────────────────────────────────

export function getTopicNotes(topicKey: string): TopicNote | null {
  const all = lsRead<TopicNote[]>(KEY_NOTES, []);
  return all.find((n) => n.topicKey === topicKey) ?? null;
}

export function saveTopicNote(topicKey: string, topic: string, subject: string, note: string): void {
  const all     = lsRead<TopicNote[]>(KEY_NOTES, []);
  const existing = all.find((n) => n.topicKey === topicKey);
  if (existing) {
    existing.notes = [...existing.notes, note].slice(-20);
    existing.savedAt = Date.now();
  } else {
    all.push({ topicKey, topic, subject, notes: [note], savedAt: Date.now() });
  }
  lsWrite(KEY_NOTES, all);
}
