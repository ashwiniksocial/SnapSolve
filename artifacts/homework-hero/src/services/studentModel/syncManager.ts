/**
 * SyncManager — Firestore-ready localStorage persistence layer.
 *
 * Every key maps to a Firestore document path:
 *   PROFILE      → students/{id}
 *   MASTERY      → students/{id}/topicMastery/{topicId}
 *   SESSIONS     → students/{id}/sessions/{sessionId}
 *   MISTAKES     → students/{id}/mistakes/{topicId}
 *   PATTERNS     → students/{id}/studyPatterns
 *
 * To migrate to Firestore: replace read/write calls in each method
 * with the matching Firestore SDK call. The method signatures stay identical.
 */

const KEYS = {
  profile:  "studyai-v1-profile",
  mastery:  "studyai-v1-mastery",
  sessions: "studyai-v1-sessions",
  mistakes: "studyai-v1-mistakes",
  patterns: "studyai-v1-patterns",
  events:   "studyai-v1-events",
} as const;

function lsRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsWrite(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── Profile ─── students/{id} ────────────────────────────────────────────────

export interface StoredProfile {
  studentId:               string;
  createdAt:               number;
  updatedAt:               number;
  preferredDepth:          "basic" | "standard" | "advanced";
  totalQuestionsAnswered:  number;
  totalStudyTimeMs:        number;
  currentStreak:           number;
  longestStreak:           number;
  lastStudiedDate:         string;   // ISO date "YYYY-MM-DD"
  motivationScore:         number;   // 0–100
  consistencyScore:        number;   // 0–100
  sectionEngagement: Record<string, number>;  // sectionKey → open count
}

export function readProfile(): StoredProfile | null {
  return lsRead<StoredProfile | null>(KEYS.profile, null);
}

export function writeProfile(p: StoredProfile): void {
  lsWrite(KEYS.profile, p);
}

// ─── Topic Mastery ─── students/{id}/topicMastery ─────────────────────────────

export interface TopicMasteryEntry {
  topic:            string;
  subject:          string;
  masteryScore:     number;   // 0–100
  attempts:         number;
  correctCount:     number;
  lastPracticed:    number;   // timestamp ms
  firstSeen:        number;   // timestamp ms
  avgTimeMs:        number;   // avg time spent per session on this topic
  confusionPoints:  string[]; // sub-concepts that caused errors
  mistakeCount:     number;
  explanationDepth: "basic" | "standard" | "advanced";
  retentionScore:   number;   // 0–100, decays over time
}

export function readAllMastery(): Record<string, TopicMasteryEntry> {
  return lsRead<Record<string, TopicMasteryEntry>>(KEYS.mastery, {});
}

export function writeMasteryEntry(topicKey: string, entry: TopicMasteryEntry): void {
  const all = readAllMastery();
  all[topicKey] = entry;
  lsWrite(KEYS.mastery, all);
}

// ─── Sessions ─── students/{id}/sessions ──────────────────────────────────────

export interface SessionRecord {
  sessionId:         string;
  topic:             string;
  subject:           string;
  startTime:         number;
  endTime:           number;
  durationMs:        number;
  depthUsed:         "basic" | "standard" | "advanced";
  sectionsOpened:    string[];
  learningLoopDone:  boolean;
  conceptualCorrect: number;
  conceptualTotal:   number;
  confidenceBefore:  number;   // 1–5, if captured
  confidenceAfter:   number;
  source:            "bank" | "openai" | "fallback";
}

export function readSessions(): SessionRecord[] {
  return lsRead<SessionRecord[]>(KEYS.sessions, []);
}

export function appendSession(s: SessionRecord): void {
  const all = readSessions();
  all.push(s);
  if (all.length > 200) all.splice(0, all.length - 200);
  lsWrite(KEYS.sessions, all);
}

// ─── Mistakes ─── students/{id}/mistakes ──────────────────────────────────────

export interface MistakeRecord {
  mistakeId:    string;
  topic:        string;
  subject:      string;
  description:  string;   // from commonMistakes or examTrap field
  occurrences:  number;
  firstSeen:    number;
  lastSeen:     number;
  resolved:     boolean;
}

export function readAllMistakes(): Record<string, MistakeRecord[]> {
  return lsRead<Record<string, MistakeRecord[]>>(KEYS.mistakes, {});
}

export function recordMistake(topicKey: string, m: Omit<MistakeRecord, "occurrences" | "firstSeen" | "lastSeen">): void {
  const all = readAllMistakes();
  if (!all[topicKey]) all[topicKey] = [];
  const existing = all[topicKey].find((r) => r.description === m.description);
  if (existing) {
    existing.occurrences++;
    existing.lastSeen = Date.now();
  } else {
    all[topicKey].push({ ...m, occurrences: 1, firstSeen: Date.now(), lastSeen: Date.now() });
  }
  if (all[topicKey].length > 30) all[topicKey].splice(0, all[topicKey].length - 30);
  lsWrite(KEYS.mistakes, all);
}

// ─── Study Patterns ─── students/{id}/studyPatterns ──────────────────────────

export interface StudyPatternsRecord {
  hourFrequency:    number[];  // length 24, count of sessions per hour-of-day
  dayFrequency:     number[];  // length 7, count per day-of-week (0=Sun)
  avgSessionMs:     number;
  totalSessions:    number;
  subjectTime:      Record<string, number>;  // subject → total ms
  weeklyGoalMet:    boolean;
  lastUpdated:      number;
}

export function readPatterns(): StudyPatternsRecord {
  return lsRead<StudyPatternsRecord>(KEYS.patterns, {
    hourFrequency: Array(24).fill(0),
    dayFrequency:  Array(7).fill(0),
    avgSessionMs:  0,
    totalSessions: 0,
    subjectTime:   {},
    weeklyGoalMet: false,
    lastUpdated:   0,
  });
}

export function writePatterns(p: StudyPatternsRecord): void {
  lsWrite(KEYS.patterns, p);
}

// ─── Raw event log ─── for future analytics / ML ─────────────────────────────

export interface RawEvent {
  ts:      number;
  kind:    string;
  payload: Record<string, unknown>;
}

export function appendEvent(kind: string, payload: Record<string, unknown>): void {
  const all = lsRead<RawEvent[]>(KEYS.events, []);
  all.push({ ts: Date.now(), kind, payload });
  if (all.length > 1000) all.splice(0, all.length - 1000);
  lsWrite(KEYS.events, all);
}
