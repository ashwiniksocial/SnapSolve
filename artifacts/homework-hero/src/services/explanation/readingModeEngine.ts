export type ReadingLevel = "basic" | "standard" | "advanced";

const LEVEL_KEY = "studyai-reading-level";

export function getStoredLevel(): ReadingLevel {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (v === "basic" || v === "standard" || v === "advanced") return v;
  } catch {}
  return "basic";
}

export function setStoredLevel(level: ReadingLevel): void {
  try { localStorage.setItem(LEVEL_KEY, level); } catch {}
}

export const LEVEL_META: Record<ReadingLevel, { label: string; hint: string; color: string }> = {
  basic:    { label: "Basic",    hint: "Every tiny step",  color: "bg-emerald-500 text-white border-emerald-500" },
  standard: { label: "Standard", hint: "Key content",       color: "bg-blue-500 text-white border-blue-500" },
  advanced: { label: "Advanced", hint: "Exam-focused",      color: "bg-violet-500 text-white border-violet-500" },
};
