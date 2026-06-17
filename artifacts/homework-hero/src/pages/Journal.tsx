/**
 * Mistake Journal page  (/journal)
 *
 * Four sections:
 *  1. Mistakes made today
 *  2. Weekly activity bar chart
 *  3. Top 3 recurring mistakes
 *  4. Topics needing revision
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useMistakeJournal } from "@/hooks/useMistakeJournal";
import type { MistakeEvent, RecurringMistake, TopicRevisionItem } from "@/hooks/useMistakeJournal";

// ─── Date helpers ─────────────────────────────────────────────────────────────

function todayStr(): string { return new Date().toISOString().slice(0, 10); }

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
function dayLabel(dateStr: string) {
  return DAY_LABELS[new Date(dateStr + "T12:00:00").getDay()];
}

function friendlyDate(dateStr: string): string {
  const today = todayStr();
  const prev  = new Date();
  prev.setDate(prev.getDate() - 1);
  const yesterday = prev.toISOString().slice(0, 10);
  if (dateStr === today)     return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "short", month: "short", day: "numeric",
  });
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SubjectChip({ subject }: { subject: string }) {
  const cfg = SUBJECTS[subject as keyof typeof SUBJECTS];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0"
      style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
    >
      {cfg.icon} {subject}
    </span>
  );
}

function MistakeCard({ event, times = 1 }: { event: MistakeEvent; times?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-red-500 text-xs font-bold">✗</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <SubjectChip subject={event.subject} />
            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
              {event.topic}
            </span>
            {times > 1 && (
              <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                ×{times} today
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
            {event.question}
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5">{event.chapter}</p>
        </div>
      </div>
    </div>
  );
}

const RANK_COLORS = ["bg-red-500", "bg-orange-400", "bg-amber-400"] as const;

function RecurringCard({ item, rank }: { item: RecurringMistake; rank: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5 ${RANK_COLORS[rank] ?? "bg-slate-400"}`}
        >
          {rank + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <SubjectChip subject={item.subject} />
            <span className="ml-auto text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
              ×{item.count} wrong
            </span>
          </div>
          <p className="text-sm font-medium text-slate-700 leading-relaxed line-clamp-2">
            {item.question}
          </p>
          <p className="text-[10px] text-slate-400 mt-1.5">
            {item.topic} · {item.chapter}
          </p>
        </div>
      </div>
    </div>
  );
}

function RevisionTopicCard({ item }: { item: TopicRevisionItem }) {
  const cfg = SUBJECTS[item.subject as keyof typeof SUBJECTS];
  const pct = Math.min(item.wrongCount * 20, 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{item.topic}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {item.chapter} · {item.subject}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
            {item.wrongCount}✗
          </span>
          {item.solved ? (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Improving ✓
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              Needs Work
            </span>
          )}
        </div>
      </div>
      {/* Subject-coloured progress bar — more mistakes = fuller bar (capped at 100 %) */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: cfg?.color ?? "#6366f1" }}
        />
      </div>
    </div>
  );
}

// ─── Weekly bar chart ─────────────────────────────────────────────────────────

function WeeklyBarChart({
  dayData,
  maxCount,
  totalWeek,
}: {
  dayData: { date: string; label: string; count: number; isToday: boolean }[];
  maxCount: number;
  totalWeek: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-end justify-between gap-1.5 mb-3" style={{ height: 56 }}>
        {dayData.map(({ date, label, count, isToday }) => {
          const barPx = count > 0
            ? Math.max(8, Math.round((count / Math.max(maxCount, 1)) * 48))
            : 4;
          return (
            <div key={date} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex flex-col justify-end w-full" style={{ height: 48 }}>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: barPx,
                    backgroundColor: isToday
                      ? "#6366f1"
                      : count > 0 ? "#fca5a5" : "#e2e8f0",
                  }}
                />
              </div>
              <span
                className={`text-[10px] font-semibold ${isToday ? "text-indigo-600" : "text-slate-400"}`}
              >
                {label}
              </span>
              {count > 0 && (
                <span className="text-[9px] font-bold text-red-500 leading-none -mt-0.5">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 text-center border-t border-slate-100 pt-3">
        {totalWeek === 0
          ? "No mistakes in the last 7 days. Great work!"
          : `${totalWeek} mistake${totalWeek === 1 ? "" : "s"} in the last 7 days`}
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Journal() {
  const {
    getMistakesToday,
    getMistakesThisWeek,
    getTopRecurringMistakes,
    getTopicsNeedingRevision,
    getAvgAttemptsBeforeSolving,
    getMistakeStats,
    clearAll,
  } = useMistakeJournal();

  const [confirmClear, setConfirmClear] = useState(false);

  const todayMistakes  = getMistakesToday();
  const weekMistakes   = getMistakesThisWeek();
  const recurring      = getTopRecurringMistakes(3);
  const revisionTopics = getTopicsNeedingRevision();
  const avgAttempts    = getAvgAttemptsBeforeSolving();
  const stats          = getMistakeStats();

  // Deduplicate today's mistakes by questionId — show once with "×N" badge
  const todayDeduped = useMemo(() => {
    const map = new Map<string, MistakeEvent & { times: number }>();
    for (const e of todayMistakes) {
      if (map.has(e.questionId)) {
        map.get(e.questionId)!.times++;
      } else {
        map.set(e.questionId, { ...e, times: 1 });
      }
    }
    return [...map.values()];
  }, [todayMistakes]);

  // Weekly activity grid (last 7 days)
  const last7 = useMemo(() => getLast7Days(), []);
  const dayData = useMemo(
    () =>
      last7.map((date) => ({
        date,
        label:   dayLabel(date),
        count:   weekMistakes.filter((e) => e.date === date).length,
        isToday: date === todayStr(),
      })),
    [last7, weekMistakes]
  );
  const maxCount = Math.max(...dayData.map((d) => d.count), 1);

  const hasAnyData = stats.total > 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Mistake Journal</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track and overcome weak spots</p>
            </div>
            {stats.total > 0 && (
              <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-full px-3 py-1.5">
                <span className="text-xs font-bold text-red-600">{stats.total}</span>
                <span className="text-[10px] text-red-400 font-medium">recorded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6">

        {/* ── Empty state ── */}
        {!hasAnyData && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl leading-none">✓</span>
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-1.5">
              No mistakes tracked yet
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Practice questions in the Practice tab. When you mark an answer wrong,
              it appears here with patterns and revision suggestions.
            </p>
            <Link href="/practice">
              <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold active:scale-95 transition-all shadow-sm">
                Start Practising
              </button>
            </Link>
          </div>
        )}

        {hasAnyData && (
          <>
            {/* ── Stats strip ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Today",
                  value: stats.today,
                  color: "text-red-600",
                  bg: "bg-red-50",
                  border: "border-red-200",
                },
                {
                  label: "This Week",
                  value: stats.thisWeek,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "border-amber-200",
                },
                {
                  label: "Avg Attempts",
                  value: avgAttempts > 0 ? avgAttempts : "—",
                  color: "text-indigo-600",
                  bg: "bg-indigo-50",
                  border: "border-indigo-200",
                },
              ].map(({ label, value, color, bg, border }) => (
                <div
                  key={label}
                  className={`rounded-2xl border p-3 text-center shadow-sm ${bg} ${border}`}
                >
                  <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Today's mistakes ── */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Today's Mistakes
              </p>
              {todayDeduped.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Clean sheet today!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">No mistakes recorded so far today.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {todayDeduped.map((e) => (
                    <MistakeCard key={e.questionId} event={e} times={e.times} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Weekly activity ── */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Weekly Activity
              </p>
              <WeeklyBarChart
                dayData={dayData}
                maxCount={maxCount}
                totalWeek={stats.thisWeek}
              />
            </div>

            {/* ── Top 3 recurring mistakes ── */}
            {recurring.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Top Recurring Mistakes
                </p>
                <div className="space-y-2.5">
                  {recurring.map((item, i) => (
                    <RecurringCard key={item.questionId} item={item} rank={i} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Topics needing revision ── */}
            {revisionTopics.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Topics Needing Revision
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {revisionTopics.length} topic{revisionTopics.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {revisionTopics.slice(0, 8).map((item) => (
                    <RevisionTopicCard
                      key={`${item.subject}::${item.topic}`}
                      item={item}
                    />
                  ))}
                </div>
                <Link href="/practice">
                  <button className="w-full mt-3 py-3 rounded-2xl border-2 border-dashed border-indigo-300 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95">
                    ✎ Practise these topics →
                  </button>
                </Link>
              </div>
            )}

            {/* ── Clear journal ── */}
            <div className="pb-2">
              {!confirmClear ? (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full py-3 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors"
                >
                  Clear Journal
                </button>
              ) : (
                <div className="bg-white rounded-2xl border border-red-200 p-4 text-center space-y-3 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">
                    Clear all {stats.total} mistake records? This cannot be undone.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { clearAll(); setConfirmClear(false); }}
                      className="py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold active:scale-95 transition-all"
                    >
                      Yes, clear all
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
