/**
 * useExamMode — Exam countdown + smart daily task tracking.
 *
 * Stores exam config in localStorage under `studyai-exam-v1`.
 * Per-day completed tasks stored under `studyai-exam-done-YYYY-MM-DD`.
 */

import { useState, useCallback, useMemo } from "react";
import type { Subject } from "@/data/subjects";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExamSubject = "All" | Subject;

export interface ExamConfig {
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

const CONFIG_KEY = "studyai-exam-v1";
const doneKey = (date: string) => `studyai-exam-done-${date}`;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadConfig(): ExamConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? (JSON.parse(raw) as ExamConfig) : null;
  } catch { return null; }
}

function loadDone(date: string): Set<string> {
  try {
    const raw = localStorage.getItem(doneKey(date));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExamMode() {
  const [config, setConfig] = useState<ExamConfig | null>(loadConfig);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => loadDone(todayStr()));

  const saveConfig = useCallback((cfg: ExamConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    setConfig(cfg);
  }, []);

  const clearConfig = useCallback(() => {
    localStorage.removeItem(CONFIG_KEY);
    setConfig(null);
  }, []);

  const markDone = useCallback((taskId: string) => {
    const today = todayStr();
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(taskId);
      localStorage.setItem(doneKey(today), JSON.stringify([...next]));
      return next;
    });
  }, []);

  const daysRemaining = useMemo((): number | null => {
    if (!config) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(config.examDate + "T00:00:00");
    return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / 86_400_000));
  }, [config]);

  return { config, saveConfig, clearConfig, daysRemaining, completedIds, markDone };
}
