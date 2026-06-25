/**
 * Dialogue Engine — manages the Socratic tutoring conversation.
 *
 * Each message in the conversation has a role, type, and metadata.
 * The engine stores conversation history per topic in localStorage.
 * Firestore path: students/{id}/socraticSessions/{sessionId}
 */

const KEY_PREFIX = "studyai-v1-socratic-";

export type MessageRole = "tutor" | "student" | "system";
export type MessageType =
  | "question"       // tutor's conceptual question
  | "response"       // student's answer
  | "assessment"     // tutor's assessment of the student's answer
  | "hint"           // hint given
  | "reteach"        // reteaching after misconception
  | "praise"         // positive reinforcement
  | "reflection"     // end-of-session reflection
  | "milestone"      // mastery achieved
  | "intro";         // session opening message

export interface DialogueMessage {
  id:              string;
  role:            MessageRole;
  type:            MessageType;
  content:         string;
  timestamp:       number;
  classification?: string;   // for assessments
  misconception?:  string;
  hintLevel?:      number;
  isCorrect?:      boolean;
  masteryDelta?:   number;
}

export interface SocraticSession {
  sessionId:    string;
  topic:        string;
  subject:      string;
  startTime:    number;
  endTime?:     number;
  messages:     DialogueMessage[];
  questionsAsked:    number;
  correctAnswers:    number;
  hintsUsed:         number;
  misconceptionCount: number;
  currentMastery:    number;
  completed:         boolean;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(key: string, val: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createSession(topic: string, subject: string, initialMastery: number): SocraticSession {
  const session: SocraticSession = {
    sessionId: `ss-${makeId()}`,
    topic, subject,
    startTime: Date.now(),
    messages: [],
    questionsAsked: 0,
    correctAnswers: 0,
    hintsUsed: 0,
    misconceptionCount: 0,
    currentMastery: initialMastery,
    completed: false,
  };
  saveSession(session);
  return session;
}

export function saveSession(session: SocraticSession): void {
  lsWrite(`${KEY_PREFIX}session-${session.sessionId}`, session);
  // Update session list index
  const index = lsRead<string[]>(`${KEY_PREFIX}index`, []);
  if (!index.includes(session.sessionId)) {
    index.push(session.sessionId);
    if (index.length > 20) index.splice(0, index.length - 20);
    lsWrite(`${KEY_PREFIX}index`, index);
  }
}

export function getSession(sessionId: string): SocraticSession | null {
  return lsRead<SocraticSession | null>(`${KEY_PREFIX}session-${sessionId}`, null);
}

export function getAllSessions(): SocraticSession[] {
  const index = lsRead<string[]>(`${KEY_PREFIX}index`, []);
  return index
    .map((id) => lsRead<SocraticSession | null>(`${KEY_PREFIX}session-${id}`, null))
    .filter(Boolean) as SocraticSession[];
}

export function addMessage(
  session: SocraticSession,
  role: MessageRole,
  type: MessageType,
  content: string,
  meta?: Partial<DialogueMessage>,
): DialogueMessage {
  const msg: DialogueMessage = {
    id: makeId(),
    role, type, content,
    timestamp: Date.now(),
    ...meta,
  };
  session.messages.push(msg);

  // Update session stats
  if (role === "tutor" && type === "question") session.questionsAsked++;
  if (type === "assessment" && meta?.isCorrect) session.correctAnswers++;
  if (type === "hint") session.hintsUsed++;
  if (type === "assessment" && meta?.classification === "misconception") session.misconceptionCount++;
  if (meta?.masteryDelta) {
    session.currentMastery = Math.min(100, Math.max(0, session.currentMastery + meta.masteryDelta));
  }

  saveSession(session);
  return msg;
}

export function completeSession(session: SocraticSession): void {
  session.completed = true;
  session.endTime   = Date.now();
  saveSession(session);
}

/** Recent sessions across all topics (for dashboard). */
export function getRecentSocraticSessions(limit = 5): SocraticSession[] {
  return getAllSessions()
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, limit);
}

/** Stats aggregated across all sessions. */
export function getTutorStats(): {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  avgAccuracy: number;
  totalHints: number;
  misconceptionsFixed: number;
  topicsStudied: string[];
} {
  const sessions = getAllSessions();
  const total    = sessions.length;
  const totalQ   = sessions.reduce((s, x) => s + x.questionsAsked, 0);
  const totalC   = sessions.reduce((s, x) => s + x.correctAnswers, 0);
  const totalH   = sessions.reduce((s, x) => s + x.hintsUsed, 0);
  const totalM   = sessions.reduce((s, x) => s + x.misconceptionCount, 0);
  const topics   = [...new Set(sessions.map((s) => s.topic))];
  return {
    totalSessions: total,
    totalQuestions: totalQ,
    totalCorrect: totalC,
    avgAccuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
    totalHints: totalH,
    misconceptionsFixed: totalM,
    topicsStudied: topics,
  };
}
