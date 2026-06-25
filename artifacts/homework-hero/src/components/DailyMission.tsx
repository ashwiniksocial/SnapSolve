/**
 * DailyMission
 *
 * Shows the student's 3 personalised daily tasks with:
 *   · Estimated total time
 *   · Per-task checkbox (manual completion)
 *   · Progress bar
 *   · Celebration state when all tasks are done
 */

import { Link } from "wouter";
import { useDailyMission } from "@/hooks/useDailyMission";
import type { MissionTask } from "@/hooks/useDailyMission";
import { SUBJECTS } from "@/data/subjects";

// ─── Task type styling ────────────────────────────────────────────────────────
const TYPE_STYLE = {
  practice:  { bg: "bg-indigo-50",  border: "border-indigo-100",  badge: "bg-indigo-100 text-indigo-700",  dot: "#4f46e5" },
  revision:  { bg: "bg-emerald-50", border: "border-emerald-100", badge: "bg-emerald-100 text-emerald-700", dot: "#10b981" },
  challenge: { bg: "bg-amber-50",   border: "border-amber-100",   badge: "bg-amber-100 text-amber-700",    dot: "#f59e0b" },
} as const;

const TYPE_LABEL = {
  practice:  "Practice",
  revision:  "Revision",
  challenge: "Challenge",
} as const;

// ─── Link target per task type ────────────────────────────────────────────────
function taskHref(task: MissionTask): string {
  if (task.type === "revision") return "/revision";
  return "/practice";
}

// ─── Date badge ───────────────────────────────────────────────────────────────
function todayLabel(): string {
  return new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

// ─── Individual task row ──────────────────────────────────────────────────────
function TaskRow({
  task,
  done,
  onToggle,
}: {
  task: MissionTask;
  done: boolean;
  onToggle: () => void;
}) {
  const style = TYPE_STYLE[task.type];
  const subjectCfg = SUBJECTS[task.subject as keyof typeof SUBJECTS];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200
        ${done
          ? "bg-slate-50 border-slate-100 opacity-60"
          : `${style.bg} ${style.border}`}`}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all
          ${done
            ? "border-transparent bg-indigo-500"
            : "border-slate-300 bg-white hover:border-indigo-400"}`}
      >
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug ${done ? "line-through text-slate-400" : "text-slate-800"}`}>
            {task.icon} {task.title}
          </p>
          <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 mt-0.5">
            {task.estimateMins}m
          </span>
        </div>
        <p className={`text-xs mt-0.5 leading-relaxed ${done ? "text-slate-400" : "text-slate-500"}`}>
          {task.subtitle}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
            {TYPE_LABEL[task.type]}
          </span>
          {subjectCfg && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: subjectCfg.light, color: subjectCfg.color }}
            >
              {subjectCfg.icon} {task.subject}
            </span>
          )}
        </div>
      </div>

      {/* Go arrow (only when not done) */}
      {!done && (
        <Link href={taskHref(task)}>
          <span className="text-slate-300 hover:text-indigo-500 transition-colors text-base mt-0.5 flex-shrink-0 cursor-pointer">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DailyMission() {
  const { tasks, doneIds, totalMins, completedCount, allDone, toggleDone } = useDailyMission();

  const progressPct = tasks.length > 0
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🎯</span>
              <h2 className="text-sm font-bold text-slate-800">Today's Mission</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 ml-6">Daily learning goals</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
              {todayLabel()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">⏱ Est. {totalMins} mins</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: allDone
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : "linear-gradient(90deg, #4f46e5, #7c3aed)",
              }}
            />
          </div>
          <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">
            {completedCount}/{tasks.length}
          </span>
        </div>
      </div>

      {/* ── Task list ───────────────────────────────────────────────────── */}
      <div className="px-4 pb-4 space-y-2.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            done={doneIds.includes(task.id)}
            onToggle={() => toggleDone(task.id)}
          />
        ))}
      </div>

      {/* ── Completion celebration ──────────────────────────────────────── */}
      {allDone && (
        <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 text-center">
          <p className="text-xl mb-1">🎉</p>
          <p className="text-sm font-bold text-emerald-700">Mission Complete!</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">
            Outstanding work today. Your Study Score will reflect this.
          </p>
        </div>
      )}

      {/* ── Footer tip ──────────────────────────────────────────────────── */}
      {!allDone && (
        <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            {completedCount === 0
              ? "Tap a task to get started"
              : `${tasks.length - completedCount} task${tasks.length - completedCount > 1 ? "s" : ""} left — keep going!`}
          </p>
          <span className="text-[11px] text-indigo-500 font-semibold">
            {progressPct}% done
          </span>
        </div>
      )}
    </div>
  );
}
