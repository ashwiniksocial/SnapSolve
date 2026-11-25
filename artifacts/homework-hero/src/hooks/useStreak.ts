import { useState, useCallback } from "react";

export interface StreakData {
  streak: number;
  lastCompletedDate: string | null;
  completedDates: string[];
}

export function applyDailyCompletion(
  previous: StreakData,
  today: string,
  yesterday: string,
): StreakData {
  if (previous.lastCompletedDate === today) return previous;

  const streak = previous.lastCompletedDate === yesterday ? previous.streak + 1 : 1;
  const completedDates = previous.completedDates.includes(today)
    ? previous.completedDates
    : [...previous.completedDates, today];
  return { streak, lastCompletedDate: today, completedDates };
}

const STORAGE_KEY = "homework-hero-streak";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {
  }
  return { streak: 0, lastCompletedDate: null, completedDates: [] };
}

function saveData(data: StreakData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export interface UseStreakReturn {
  streak: number;
  isTodayCompleted: boolean;
  completedDates: string[];
  completeToday: () => void;
}

export function useStreak(): UseStreakReturn {
  const [data, setData] = useState<StreakData>(() => {
    const stored = loadData();
    const today = todayStr();
    const yesterday = yesterdayStr();

    if (
      stored.lastCompletedDate !== today &&
      stored.lastCompletedDate !== yesterday &&
      stored.lastCompletedDate !== null
    ) {
      const reset = { ...stored, streak: 0 };
      saveData(reset);
      return reset;
    }
    return stored;
  });

  const isTodayCompleted = data.lastCompletedDate === todayStr();

  const completeToday = useCallback(() => {
    const today = todayStr();
    const yesterday = yesterdayStr();

    setData((prev) => {
      const next = applyDailyCompletion(prev, today, yesterday);
      if (next === prev) return prev;
      saveData(next);
      return next;
    });
  }, []);

  return { streak: data.streak, isTodayCompleted, completedDates: data.completedDates, completeToday };
}
