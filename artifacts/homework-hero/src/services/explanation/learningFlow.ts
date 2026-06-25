const MASTERY_KEY    = "studyai-mastery";
const ANALYTICS_KEY  = "studyai-analytics";

// ─── Mastery ──────────────────────────────────────────────────────────────────

export interface MasteryEntry {
  topic:       string;
  score:       number;   // 0–100
  attempts:    number;
  lastSeen:    number;
}

function readMastery(): Record<string, MasteryEntry> {
  try { return JSON.parse(localStorage.getItem(MASTERY_KEY) ?? "{}") as Record<string, MasteryEntry>; }
  catch { return {}; }
}

export function getMastery(topic: string): MasteryEntry {
  return readMastery()[topic] ?? { topic, score: 0, attempts: 0, lastSeen: 0 };
}

export function updateMastery(topic: string, correct: boolean): MasteryEntry {
  try {
    const store = readMastery();
    const prev  = store[topic] ?? { topic, score: 0, attempts: 0, lastSeen: 0 };
    const score = correct
      ? Math.min(100, prev.score + 20)
      : Math.max(0,   prev.score - 10);
    const next: MasteryEntry = { topic, score, attempts: prev.attempts + 1, lastSeen: Date.now() };
    store[topic] = next;
    localStorage.setItem(MASTERY_KEY, JSON.stringify(store));
    return next;
  } catch {
    return { topic, score: correct ? 20 : 0, attempts: 1, lastSeen: Date.now() };
  }
}

// ─── Session analytics ────────────────────────────────────────────────────────

export interface SessionRecord {
  topic:              string;
  subject:            string;
  startTime:          number;
  endTime?:           number;
  confidenceBefore:   number;   // 1–5
  confidenceAfter?:   number;   // 1–5
  hintsUsed:          number;
  retryCount:         number;
  conceptualCorrect:  number;
  conceptualTotal:    number;
}

function readAnalytics(): SessionRecord[] {
  try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY) ?? "[]") as SessionRecord[]; }
  catch { return []; }
}

export function startSession(topic: string, subject: string, confidenceBefore: number): string {
  const id = `${Date.now()}`;
  const sessions = readAnalytics();
  sessions.push({ topic, subject, startTime: Date.now(), confidenceBefore, hintsUsed: 0, retryCount: 0, conceptualCorrect: 0, conceptualTotal: 0 });
  // Keep last 50 sessions
  if (sessions.length > 50) sessions.splice(0, sessions.length - 50);
  try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(sessions)); } catch {}
  return id;
}

export function finaliseSession(topic: string, confidenceAfter: number, conceptualCorrect: number, conceptualTotal: number): void {
  try {
    const sessions = readAnalytics();
    const last = sessions.findLast((s) => s.topic === topic);
    if (last) {
      last.endTime         = Date.now();
      last.confidenceAfter = confidenceAfter;
      last.conceptualCorrect = conceptualCorrect;
      last.conceptualTotal   = conceptualTotal;
    }
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(sessions));
  } catch {}
}

export function getAllSessions(): SessionRecord[] {
  return readAnalytics();
}
