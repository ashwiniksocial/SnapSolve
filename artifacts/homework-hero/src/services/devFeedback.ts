/**
 * Developer Feedback Store — internal only, never affects student UI.
 *
 * Stores developer review results for Teaching Validation sessions in
 * localStorage under `studyai-dev-feedback-v1`. No data leaves the browser.
 */

export type FeedbackVerdict = "approved" | "needs_improvement" | "pending";

export interface DevFeedbackEntry {
  id:               string;
  timestamp:        number;
  subject:          string;
  classNum:         number;
  chapterName:      string;
  question:         string;
  explanationStyle: "detailed" | "standard" | "compact";
  generationMs:     number;
  aiConfidence:     number;
  topic:            string;
  difficulty:       "Easy" | "Medium" | "Hard";
  verdict:          FeedbackVerdict;
  notes:            string;
}

const STORE_KEY = "studyai-dev-feedback-v1";

function readAll(): DevFeedbackEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]") as DevFeedbackEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: DevFeedbackEntry[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries));
  } catch {}
}

export function saveFeedback(entry: DevFeedbackEntry): void {
  const all = readAll();
  const idx = all.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.unshift(entry);
  }
  writeAll(all);
}

export function getFeedbackById(id: string): DevFeedbackEntry | null {
  return readAll().find((e) => e.id === id) ?? null;
}

export function getAllFeedback(): DevFeedbackEntry[] {
  return readAll();
}

export function clearAllFeedback(): void {
  localStorage.removeItem(STORE_KEY);
}
