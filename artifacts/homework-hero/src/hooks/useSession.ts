import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

interface SessionData {
  subject:        Subject;
  question:       string;
  practiceTopic:  string;
  /** Tesseract OCR confidence (0–1). Undefined / missing = 1.0 (typed question). */
  ocrConfidence?: number;
  /** Set by Practice page when opening a question — used by Solution + Analytics */
  practiceQuestionId?:   string;
  practiceQuestionDiff?: string;
  practiceChapterId?:    string;
  practiceChapterName?:  string;
  practiceClassNum?:     number;
}

const KEY = "studyai-session";

function load(): SessionData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as SessionData;
  } catch {}
  return { subject: "Mathematics", question: "", practiceTopic: "" };
}

function save(data: SessionData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useSession() {
  const [session, setSession] = useState<SessionData>(load);

  const update = useCallback((patch: Partial<SessionData>) => {
    // Eagerly write to localStorage synchronously so that any component mounting
    // in the same event cycle (e.g. after navigate()) reads the updated data.
    // React 18 automatic batching defers the setSession updater until after the
    // event handler completes, so relying solely on save() inside the updater
    // causes a race: the next page's useState(load) runs before the batch flushes.
    const next = { ...load(), ...patch };
    save(next);
    setSession(next);
  }, []);

  return { session, update };
}
