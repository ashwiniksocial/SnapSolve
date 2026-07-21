/**
 * Smart Revision page  (/revision)
 *
 * Sections:
 *  1. Stats strip  (Due Now · Next 7 Days · Mastered)
 *  2. Due Now      (expandable review cards with hint + answer)
 *  3. Upcoming     (14-day schedule timeline)
 *  4. Mastered     (celebration card)
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { useMistakeJournal } from "@/hooks/useMistakeJournal";
import { getQuestionById, preloadQBank } from "@/services/questionService";
import { useSession }  from "@/hooks/useSession";
import { useProfile }  from "@/hooks/useProfile";
import type { RevisionItem, SRInterval } from "@/hooks/useRevisionPlanner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10); }

function relativeDate(dateStr: string): string {
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const target = new Date(dateStr + "T12:00:00");
  const diff   = Math.round((target.getTime() - now.getTime()) / 86_400_000);
  if (diff === 0)  return "Today";
  if (diff === 1)  return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0)   return `${Math.abs(diff)} days ago`;
  return target.toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
}

const NEXT_IV: Record<SRInterval, SRInterval> = { 1: 3, 3: 7, 7: 14, 14: 14 };

const diffStyle: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Review card ──────────────────────────────────────────────────────────────

interface CardProps {
  item:      RevisionItem;
  isOverdue: boolean;
  onReview:  (questionId: string, correct: boolean) => void;
}

function RevisionCard({ item, isOverdue, onReview }: CardProps) {
  const [open,     setOpen]     = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [result,   setResult]   = useState<"correct" | "incorrect" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { update } = useSession();
  const [, navigate] = useLocation();

  const fullQ      = getQuestionById(item.questionId);
  const isDone     = result !== null;
  const nextIv     = NEXT_IV[item.interval];
  const willMaster = result === "correct" && item.interval === 14;

  const handleMark = (correct: boolean) => {
    setResult(correct ? "correct" : "incorrect");
    // Give the student 1.4 s to see the feedback before the card leaves the queue
    timerRef.current = setTimeout(() => onReview(item.questionId, correct), 1400);
  };

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-colors duration-300 ${
        isDone
          ? result === "correct" ? "border-emerald-300" : "border-red-300"
          : isOverdue             ? "border-amber-300"   : "border-slate-200"
      }`}
    >
      {/* ── Header row ── */}
      <button
        className="w-full text-left p-4"
        onClick={() => { if (!isDone) setOpen((v) => !v); }}
      >
        <div className="flex items-start gap-3">

          {/* Status orb */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
            isDone
              ? result === "correct"
                ? "bg-emerald-500 text-white"
                : "bg-red-400 text-white"
              : isOverdue
                ? "bg-amber-100 border border-amber-300 text-amber-700"
                : "bg-slate-100 text-slate-500"
          }`}>
            {isDone
              ? result === "correct" ? "✓" : "✗"
              : isOverdue ? "!" : "↺"}
          </div>

          {/* Meta + question */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <SubjectChip subject={item.subject} />
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle[item.difficulty]}`}>
                {item.difficulty}
              </span>
              {item.timesWrong > 0 && !isDone && (
                <span className="text-[10px] text-red-500 font-semibold ml-auto">
                  ✗{item.timesWrong}× prev
                </span>
              )}
              {isOverdue && !isDone && (
                <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Overdue
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed line-clamp-2">
              {item.question}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{item.topic} · {item.chapter}</p>
          </div>

          {/* Chevron */}
          {!isDone && (
            <svg
              className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {/* ── Done feedback ── */}
      {isDone && (
        <div className={`px-4 pb-3 text-sm font-semibold ${
          result === "correct" ? "text-emerald-600" : "text-red-600"
        }`}>
          {result === "correct"
            ? willMaster
              ? "🌟 Mastered! Next check-in in 30 days."
              : `✓ Next review in ${nextIv} day${nextIv !== 1 ? "s" : ""}.`
            : "✗ Rescheduled — review again tomorrow."}
        </div>
      )}

      {/* ── Expanded: hint → reveal → mark ── */}
      {open && !isDone && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">

          {/* Hint (from question bank) */}
          {fullQ?.hint && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">💡 Hint</p>
              <p className="text-xs text-amber-800 leading-relaxed">{fullQ.hint}</p>
            </div>
          )}

          {/* Recall prompt → answer reveal */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              Recall your answer, then reveal →
            </button>
          ) : fullQ ? (
            <>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-indigo-700 mb-1">✦ Answer</p>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">{fullQ.answer}</p>
              </div>
              <button
                onClick={() => {
                  update({ question: item.question, practiceTopic: item.topic });
                  navigate("/solution?practiceMode=1");
                }}
                className="w-full py-2 rounded-xl border border-indigo-200 bg-white text-xs font-semibold text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
              >
                ✦ Get Full AI Lesson →
              </button>
            </>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500 leading-relaxed">
              This question was added from a scan. Check your notes for the answer.
            </div>
          )}

          {/* Grade buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleMark(true)}
              className="py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 active:scale-95 transition-all hover:bg-emerald-100"
            >
              ✓ Got it right
            </button>
            <button
              onClick={() => handleMark(false)}
              className="py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 active:scale-95 transition-all hover:bg-red-100"
            >
              ✗ Need to review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Upcoming schedule ────────────────────────────────────────────────────────

function ScheduleTimeline({
  schedule,
}: {
  schedule: Array<{ date: string; items: RevisionItem[] }>;
}) {
  if (schedule.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-3">
        No upcoming items in the next 14 days.
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {schedule.map(({ date, items: its }) => {
        // Collect unique subject colours for the dots
        const colors = [...new Set(
          its.map((i) => SUBJECTS[i.subject as keyof typeof SUBJECTS]?.color).filter(Boolean)
        )] as string[];

        return (
          <div key={date} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-slate-800">{relativeDate(date)}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
                    weekday: "short", month: "short", day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {colors.slice(0, 3).map((color) => (
                    <div
                      key={color}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {its.length}
                </span>
              </div>
            </div>

            {/* Topic pills */}
            <div className="flex flex-wrap gap-1.5">
              {its.slice(0, 5).map((item) => {
                const cfg = SUBJECTS[item.subject as keyof typeof SUBJECTS];
                return (
                  <span
                    key={item.questionId}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: cfg?.light,
                      color:           cfg?.color,
                      borderColor:     cfg?.border,
                    }}
                  >
                    {item.topic}
                  </span>
                );
              })}
              {its.length > 5 && (
                <span className="text-[10px] font-medium text-slate-400 self-center">
                  +{its.length - 5} more
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Revision() {
  const {
    completeReview,
    getDueItems,
    getUpcomingSchedule,
    dueCount,
    next7Count,
    masteredCount,
    totalScheduled,
  } = useRevisionPlanner();

  const { getTopicsNeedingRevision } = useMistakeJournal();
  const { profile }                  = useProfile();

  const weakTopics = useMemo(
    () => getTopicsNeedingRevision().map((t) => t.topic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []   // computed once at render; stable enough for a session
  );

  // Snapshot due items once per page mount — prevents cards from disappearing
  // mid-session when completeReview() updates the store.
  const sessionItemsRef = useRef<RevisionItem[] | null>(null);
  if (sessionItemsRef.current === null) {
    sessionItemsRef.current = getDueItems(weakTopics);
  }
  const sessionItems = sessionItemsRef.current;

  const upcoming = useMemo(() => getUpcomingSchedule(), [getUpcomingSchedule]);
  const today    = todayStr();

  // Track this session's results (for progress bar)
  const [sessionResults, setSessionResults] = useState<Record<string, "correct" | "incorrect">>({});
  const [bankReady, setBankReady]           = useState(false);

  const reviewedCount    = Object.keys(sessionResults).length;
  const sessionComplete  = sessionItems.length > 0 && reviewedCount === sessionItems.length;

  const handleReview = (questionId: string, correct: boolean) => {
    completeReview(questionId, correct);
    setSessionResults((prev) => ({
      ...prev,
      [questionId]: correct ? "correct" : "incorrect",
    }));
  };

  const hasAnything = totalScheduled > 0 || masteredCount > 0;

  // ── Preload question bank ─────────────────────────────────────────────────
  useEffect(() => {
    setBankReady(false);
    preloadQBank(profile.classLevel ?? 9).then(() => setBankReady(true));
  }, [profile.classLevel]);

  if (!bankReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2 px-6">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading questions…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Smart Revision</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Spaced repetition · 1 · 3 · 7 · 14 days
              </p>
            </div>
            {dueCount > 0 ? (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse block" />
                <span className="text-xs font-bold text-red-600">{dueCount} due now</span>
              </div>
            ) : hasAnything ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
                <span className="text-xs font-bold text-emerald-600">✓ All caught up</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6">

        {/* ── Empty state ── */}
        {!hasAnything && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl leading-none">↺</span>
            </div>
            <h2 className="text-base font-bold text-slate-800 mb-1.5">
              No revision items yet
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Every question you answer in Practice is automatically scheduled for spaced
              repetition — 1 day later, then 3, 7, and 14. Start practising to build
              your revision queue.
            </p>
            <Link href="/practice">
              <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold active:scale-95 transition-all shadow-sm">
                Start Practising
              </button>
            </Link>
          </div>
        )}

        {hasAnything && (
          <>
            {/* ── Stats strip ── */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label:  "Due Now",
                  value:  dueCount,
                  color:  dueCount > 0 ? "text-red-600" : "text-slate-400",
                  bg:     dueCount > 0 ? "bg-red-50"    : "bg-slate-50",
                  border: dueCount > 0 ? "border-red-200" : "border-slate-200",
                },
                {
                  label:  "Next 7 Days",
                  value:  next7Count,
                  color:  "text-amber-600",
                  bg:     "bg-amber-50",
                  border: "border-amber-200",
                },
                {
                  label:  "Mastered",
                  value:  masteredCount,
                  color:  "text-emerald-600",
                  bg:     "bg-emerald-50",
                  border: "border-emerald-200",
                },
              ].map(({ label, value, color, bg, border }) => (
                <div key={label} className={`rounded-2xl border p-3 text-center shadow-sm ${bg} ${border}`}>
                  <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-medium leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* ── Session progress bar ── */}
            {sessionItems.length > 0 && reviewedCount > 0 && (
              <div className="bg-white rounded-2xl border border-indigo-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">Session Progress</p>
                  <p className="text-sm font-bold text-indigo-600">
                    {reviewedCount} / {sessionItems.length} reviewed
                  </p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(reviewedCount / sessionItems.length) * 100}%` }}
                  />
                </div>
                {sessionComplete && (
                  <p className="text-sm font-bold text-emerald-600 text-center mt-3">
                    🎉 Session complete! All items reviewed.
                  </p>
                )}
              </div>
            )}

            {/* ── Due Now ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Due Now
                </p>
                {dueCount > 0 && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    {dueCount} item{dueCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {sessionItems.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">All caught up!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {upcoming.length > 0
                        ? `Next review: ${relativeDate(upcoming[0].date).toLowerCase()}.`
                        : "No reviews due soon. Keep practising."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sessionItems.map((item) => (
                    <RevisionCard
                      key={item.questionId}
                      item={item}
                      isOverdue={item.nextReview < today}
                      onReview={handleReview}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Upcoming 14-day schedule ── */}
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Upcoming — Next 14 Days
                </p>
                <ScheduleTimeline schedule={upcoming} />
              </div>
            )}

            {/* ── Mastered ── */}
            {masteredCount > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 text-center shadow-sm">
                <p className="text-2xl mb-1.5">🌟</p>
                <p className="text-sm font-bold text-emerald-700">
                  {masteredCount} question{masteredCount !== 1 ? "s" : ""} mastered
                </p>
                <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                  Answered correctly at 14-day spacing. These are in long-term memory!
                </p>
              </div>
            )}

            {/* ── CTA ── */}
            <div className="pb-2">
              <Link href="/practice">
                <button className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-300 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95">
                  ✎ Practise more to grow your revision queue →
                </button>
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
