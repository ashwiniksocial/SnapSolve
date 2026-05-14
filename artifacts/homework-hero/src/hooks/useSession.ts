import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

interface SessionData {
  subject: Subject;
  question: string;
  practiceTopic: string;
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
    setSession((prev) => {
      const next = { ...prev, ...patch };
      save(next);
      return next;
    });
  }, []);

  return { session, update };
}
