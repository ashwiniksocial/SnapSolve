/**
 * useExamMode — Exam countdown + smart daily task tracking.
 *
 * Stores exam config and daily completions in board/class-scoped localStorage.
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import type { Subject } from "@/data/subjects";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import { useProfile } from "@/hooks/useProfile";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExamSubject = "All" | Subject;

export interface ExamConfig {
  boardId?: string;
  classNum?: number;
  examName:  string;
  subject:   ExamSubject;
  examDate:  string;   // YYYY-MM-DD
  createdAt: string;
}

export type TaskType     = "revision" | "practice" | "chapter";
export type TaskPriority = "critical" | "high" | "medium";

export interface ExamTask {
  id:             string;
  type:           TaskType;
  subject:        Subject;
  topic:          string;
  chapter?:       string;
  label:          string;
  description:    string;
  estimatedMin:   number;
  priority:       TaskPriority;
  href:           string;
  completedToday: boolean;
}

// ─── Urgency helpers ──────────────────────────────────────────────────────────

export type Urgency = "danger" | "warning" | "ok" | "far";

export function getUrgency(days: number | null): Urgency {
  if (days === null) return "far";
  if (days <= 7)  return "danger";
  if (days <= 21) return "warning";
  if (days <= 45) return "ok";
  return "far";
}

export function urgencyColors(u: Urgency) {
  switch (u) {
    case "danger":  return { text: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "🔴 Exam very soon! Focus hard every day." };
    case "warning": return { text: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "🟡 3 weeks left — stay consistent." };
    case "ok":      return { text: "#059669", bg: "#ecfdf5", border: "#a7f3d0", label: "🟢 Good runway — build steady habits." };
    default:        return { text: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "📅 Exam far away — start building foundation." };
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const CONFIG_PREFIX = "studyai-exam-v2";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadConfig(key: string | null): ExamConfig | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ExamConfig) : null;
  } catch { return null; }
}

function loadDone(key: string | null): Set<string> {
  if (!key) return new Set();
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExamMode() {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, profile.classLevel);
  const storageKey = scopedStorageKey(CONFIG_PREFIX, context);
  const completionKey = storageKey ? `${storageKey}:done:${todayStr()}` : null;
  const [stored, setStored] = useState(() => ({
    key: storageKey,
    completionKey,
    config: loadConfig(storageKey),
    completedIds: loadDone(completionKey),
  }));

  useEffect(() => {
    setStored({
      key: storageKey,
      completionKey,
      config: loadConfig(storageKey),
      completedIds: loadDone(completionKey),
    });
  }, [storageKey, completionKey]);

  const sameScope = stored.key === storageKey && stored.completionKey === completionKey;
  const config = sameScope ? stored.config : null;
  const completedIds = sameScope ? stored.completedIds : new Set<string>();

  const saveConfig = useCallback((cfg: ExamConfig) => {
    if (!storageKey || !context) return;
    const scopedConfig = { ...cfg, boardId: context.boardId, classNum: context.classNum };
    localStorage.setItem(storageKey, JSON.stringify(scopedConfig));
    setStored((prev) => ({
      ...prev,
      key: storageKey,
      config: scopedConfig,
    }));
  }, [context?.boardId, context?.classNum, storageKey]);

  const clearConfig = useCallback(() => {
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
    setStored((prev) => ({ ...prev, key: storageKey, config: null }));
  }, [storageKey]);

  const markDone = useCallback((taskId: string) => {
    if (!completionKey) return;
    setStored((prev) => {
      const current = prev.completionKey === completionKey ? prev.completedIds : loadDone(completionKey);
      const next = new Set(current);
      next.add(taskId);
      localStorage.setItem(completionKey, JSON.stringify([...next]));
      return { ...prev, key: storageKey, completionKey, completedIds: next };
    });
  }, [completionKey, storageKey]);

  const daysRemaining = useMemo((): number | null => {
    if (!config) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(config.examDate + "T00:00:00");
    return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / 86_400_000));
  }, [config]);

  return { config, saveConfig, clearConfig, daysRemaining, completedIds, markDone };
}
