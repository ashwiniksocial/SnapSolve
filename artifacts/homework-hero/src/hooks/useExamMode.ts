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

export type ExamConfigSaveResult =
  | { ok: true; config: ExamConfig }
  | { ok: false; reason: "missing-academic-context" | "storage-unavailable" };

export type TaskType     = "revision" | "practice" | "chapter";
export type TaskPriority = "critical" | "high" | "medium";

export interface ExamTask {
  id:             string;
  type:           TaskType;
  subject:        Subject;
  topic:          string;
  chapter?:       string;
  chapterId?:     string;
  questionId?:    string;
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

export function loadConfig(key: string | null): ExamConfig | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ExamConfig) : null;
  } catch { return null; }
}

export function saveExamConfig(
  key: string | null,
  context: ReturnType<typeof makeAcademicContext>,
  config: ExamConfig,
): ExamConfigSaveResult {
  if (!key || !context) return { ok: false, reason: "missing-academic-context" };

  const scopedConfig = { ...config, boardId: context.boardId, classNum: context.classNum };
  try {
    localStorage.setItem(key, JSON.stringify(scopedConfig));
    return { ok: true, config: scopedConfig };
  } catch {
    return { ok: false, reason: "storage-unavailable" };
  }
}

function loadDone(key: string | null): Set<string> {
  if (!key) return new Set();
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

export function loadCompletedTasks(key: string | null): ExamTask[] {
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((task): task is ExamTask =>
      !!task &&
      typeof task === "object" &&
      typeof task.id === "string" &&
      typeof task.topic === "string" &&
      typeof task.href === "string",
    ).map((task) => ({ ...task, completedToday: true }));
  } catch {
    return [];
  }
}

export function mergeCompletedTasks(
  currentTasks: ExamTask[],
  completedTasks: ExamTask[],
  completedIds: Set<string>,
): ExamTask[] {
  const merged = new Map<string, ExamTask>();
  for (const task of currentTasks) {
    merged.set(task.id, { ...task, completedToday: task.completedToday || completedIds.has(task.id) });
  }
  for (const task of completedTasks) {
    if (!merged.has(task.id)) merged.set(task.id, { ...task, completedToday: true });
  }
  return [...merged.values()];
}

export function persistCompletedExamTask(
  completionKey: string | null,
  tasksKey: string | null,
  task: ExamTask,
): { completedIds: Set<string>; completedTasks: ExamTask[] } | null {
  if (!completionKey || !tasksKey) return null;
  const completedIds = loadDone(completionKey);
  completedIds.add(task.id);
  const completedTasks = new Map(loadCompletedTasks(tasksKey).map((item) => [item.id, item]));
  completedTasks.set(task.id, { ...task, completedToday: true });
  const snapshots = [...completedTasks.values()];
  try {
    localStorage.setItem(tasksKey, JSON.stringify(snapshots));
    localStorage.setItem(completionKey, JSON.stringify([...completedIds]));
    return { completedIds, completedTasks: snapshots };
  } catch {
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useExamMode() {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, profile.classLevel);
  const storageKey = scopedStorageKey(CONFIG_PREFIX, context);
  const completionKey = storageKey ? `${storageKey}:done:${todayStr()}` : null;
  const completedTasksKey = completionKey ? `${completionKey}:tasks` : null;
  const [stored, setStored] = useState(() => ({
    key: storageKey,
    completionKey,
    completedTasksKey,
    config: loadConfig(storageKey),
    completedIds: loadDone(completionKey),
    completedTasks: loadCompletedTasks(completedTasksKey),
  }));

  useEffect(() => {
    setStored({
      key: storageKey,
      completionKey,
      completedTasksKey,
      config: loadConfig(storageKey),
      completedIds: loadDone(completionKey),
      completedTasks: loadCompletedTasks(completedTasksKey),
    });
  }, [storageKey, completionKey, completedTasksKey]);

  const sameScope = stored.key === storageKey &&
    stored.completionKey === completionKey &&
    stored.completedTasksKey === completedTasksKey;
  const config = sameScope ? stored.config : null;
  const completedIds = sameScope ? stored.completedIds : new Set<string>();
  const completedTasks = sameScope ? stored.completedTasks : [];

  const saveConfig = useCallback((cfg: ExamConfig): ExamConfigSaveResult => {
    const result = saveExamConfig(storageKey, context, cfg);
    if (!result.ok || !completionKey || !storageKey) return result;
    setStored((prev) => ({
      key: storageKey,
      completionKey,
      completedTasksKey,
      config: result.config,
      completedIds: prev.completionKey === completionKey ? prev.completedIds : loadDone(completionKey),
      completedTasks: prev.completedTasksKey === completedTasksKey
        ? prev.completedTasks
        : loadCompletedTasks(completedTasksKey),
    }));
    return result;
  }, [completedTasksKey, completionKey, context?.boardId, context?.classNum, storageKey]);

  const clearConfig = useCallback(() => {
    if (!storageKey) return;
    localStorage.removeItem(storageKey);
    setStored((prev) => ({ ...prev, key: storageKey, config: null }));
  }, [storageKey]);

  const markDone = useCallback((task: ExamTask) => {
    const persisted = persistCompletedExamTask(completionKey, completedTasksKey, task);
    if (!persisted) return;
    setStored((prev) => ({
      ...prev,
      key: storageKey,
      completionKey,
      completedTasksKey,
      completedIds: persisted.completedIds,
      completedTasks: persisted.completedTasks,
    }));
  }, [completedTasksKey, completionKey, storageKey]);

  const daysRemaining = useMemo((): number | null => {
    if (!config) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(config.examDate + "T00:00:00");
    return Math.max(0, Math.ceil((exam.getTime() - today.getTime()) / 86_400_000));
  }, [config]);

  return { config, saveConfig, clearConfig, daysRemaining, completedIds, completedTasks, markDone };
}
