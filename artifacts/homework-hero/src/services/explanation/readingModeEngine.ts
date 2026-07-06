export type ReadingLevel = "basic" | "standard" | "advanced";

const LEVEL_KEY = "studyai-reading-level";

export function getStoredLevel(): ReadingLevel {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (v === "basic" || v === "standard" || v === "advanced") return v;
  } catch {}
  return "standard";
}

export function setStoredLevel(level: ReadingLevel): void {
  try { localStorage.setItem(LEVEL_KEY, level); } catch {}
}

export const LEVEL_META: Record<ReadingLevel, { label: string; hint: string; color: string }> = {
  basic:    { label: "Detailed",  hint: "8 sections · Full lesson",  color: "bg-indigo-600 text-white border-indigo-600" },
  standard: { label: "Standard",  hint: "5 sections · Core content", color: "bg-blue-500 text-white border-blue-500"    },
  advanced: { label: "Compact",   hint: "3 sections · Steps only",   color: "bg-slate-600 text-white border-slate-600"  },
};
