/**
 * Analytics.tsx — Practice learning analytics.
 *
 * Sections:
 *  1. Practice Dashboard  — Questions Solved, Accuracy %, Strongest/Weakest Chapter
 *  2. Chapter Performance — per-chapter stats sorted weakest first
 *  3. Question Drilldown  — per-question correct/incorrect/lastAttempted when a chapter is selected
 *
 * Powered by pure functions in services/analytics.ts.
 * All data from localStorage (useProgress + useAttemptLog). No AI, no backend.
 */

import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useProfile }       from "@/hooks/useProfile";
import { useSession }       from "@/hooks/useSession";
import { useChapterStats }  from "@/hooks/useChapterStats";
import { useAttemptLog }    from "@/hooks/useAttemptLog";
import {
  overallAccuracy,
  chapterAccuracy,
  strongestChapter,
  weakestChapter,
  buildQuestionMap,
} from "@/services/analytics";
import { getQuestions, preloadQBank } from "@/services/questionService";
import { SUBJECTS, type Subject } from "@/data/subjects";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

function accColor(pct: number) {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 60) return "text-amber-600";
  return "text-red-600";
}

function accBarColor(pct: number) {
  if (pct >= 80) return "bg-emerald-400";
  if (pct >= 60) return "bg-amber-400";
  return "bg-red-400";
}

function relDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(diff / 3_600_000);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Analytics() {
  const { profile }        = useProfile();
  const { session }        = useSession();
  const { getChapterAttempts } = useAttemptLog();

  const classNum = profile.classLevel ?? 9;

  const [subject, setSubject]               = useState<Subject>(
    ["Physics", "Chemistry", "Biology"].includes(session.subject) ? "Science" : session.subject,
  );
  const [selectedChapterId, setSelected]    = useState<string | null>(null);
  const [seedDone, setSeedDone]             = useState(false);
  const [bankReady, setBankReady]           = useState(false);

  const chapterStats  = useChapterStats(subject, classNum, bankReady);
  const cfg           = SUBJECTS[subject];

  // Question map for difficulty-weighted weak area detection
  const questionMap = useMemo(() => {
    const qs = chapterStats.flatMap((ch) =>
      getQuestions({ classNum, subject, chapterId: ch.chapterId }),
    );
    return buildQuestionMap(qs);
  }, [chapterStats, classNum, subject]);

  // ── Dashboard metrics ──────────────────────────────────────────────────────
  const totalSolved = chapterStats.reduce((s, c) => s + c.solved, 0);
  const overallAcc  = overallAccuracy(chapterStats);
  const strongest   = strongestChapter(chapterStats, 3);
  const weakest     = weakestChapter(chapterStats, questionMap, 10);

  // ── Chapter performance table — sorted weakest first ──────────────────────
  const sortedChapters = useMemo(
    () =>
      [...chapterStats]
        .filter((c) => c.solved > 0)
        .sort((a, b) => chapterAccuracy(a) - chapterAccuracy(b)),
    [chapterStats],
  );

  // ── Question drilldown ─────────────────────────────────────────────────────
  const drilldownAttempts = useMemo(
    () =>
      selectedChapterId
        ? getChapterAttempts(selectedChapterId, classNum, subject).sort(
            (a, b) =>
              new Date(b.lastAttempted).getTime() -
              new Date(a.lastAttempted).getTime(),
          )
        : [],
    [selectedChapterId, classNum, subject, getChapterAttempts],
  );

  const selectedChapterName =
    chapterStats.find((c) => c.chapterId === selectedChapterId)?.chapterName ?? "";

  // ── Seed test data (dev/validation) ───────────────────────────────────────
  // Writes directly to localStorage (bypassing React state) so all hook
  // instances pick up the data on the next render cycle after reload.
  //
  // Chapter 0: 12 attempts, ~83% → Strongest
  // Chapter 1: 11 attempts, ~36% → Weakest (≥10 threshold met)
  // Chapter 2: 11 attempts, ~73%
  // Chapter 3: 10 attempts, ~70%
  function seedTestData() {
    const chapters = chapterStats.slice(0, 4);
    const plans: boolean[][] = [
      [true,true,true,true,false,true,true,true,true,false,true,true],
      [true,false,false,true,false,false,true,false,false,true,false],
      [true,true,true,false,true,true,true,false,true,true,true],
      [true,true,false,true,true,false,true,true,true,false],
    ];

    // Read existing data directly from localStorage
    const PROGRESS_KEY = "studyai-progress-v2";
    const ATTEMPT_KEY  = "studyai-attempt-log-v1";

    type TopicRec = { solved: number; correct: number; attempted: string[] };
    type ProgressStore = Record<string, Record<string, TopicRec>>;
    type AttemptStore  = Record<string, {
      questionId: string; questionText: string; correct: boolean;
      difficulty: string; chapterId: string; chapterName: string;
      subject: string; classNum: number; lastAttempted: string; attempts: number;
    }>;

    let progressStore: ProgressStore = {};
    let attemptStore:  AttemptStore  = {};
    try { progressStore = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}"); } catch {}
    try { attemptStore  = JSON.parse(localStorage.getItem(ATTEMPT_KEY)  ?? "{}"); } catch {}

    if (!progressStore[subject]) progressStore[subject] = {};

    chapters.forEach((ch, i) => {
      const outcomes  = plans[i] ?? [true, false, true];
      const questions = getQuestions({ classNum, subject, chapterId: ch.chapterId });
      outcomes.forEach((correct, qi) => {
        const q = questions[qi % Math.max(questions.length, 1)];
        if (!q) return;

        // Update topic-level progress
        const rec = progressStore[subject][q.topicName] ?? { solved: 0, correct: 0, attempted: [] };
        progressStore[subject][q.topicName] = {
          solved:    rec.solved + 1,
          correct:   rec.correct + (correct ? 1 : 0),
          attempted: rec.attempted.includes(q.id)
            ? rec.attempted
            : [...rec.attempted, q.id],
        };

        // Update per-question attempt log
        const existing = attemptStore[q.id];
        attemptStore[q.id] = {
          questionId:    q.id,
          questionText:  q.question,
          correct,
          difficulty:    q.difficulty,
          chapterId:     ch.chapterId,
          chapterName:   ch.chapterName,
          subject,
          classNum,
          lastAttempted: new Date().toISOString(),
          attempts:      (existing?.attempts ?? 0) + 1,
        };
      });
    });

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressStore));
    localStorage.setItem(ATTEMPT_KEY,  JSON.stringify(attemptStore));
    setSeedDone(true);
    // Reload so all hook instances pick up the fresh localStorage data
    window.location.reload();
  }

  // ── Preload question bank ─────────────────────────────────────────────────
  useEffect(() => {
    setBankReady(false);
    preloadQBank(classNum).then(() => setBankReady(true));
  }, [classNum]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!bankReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-2 px-6">
          <div
            className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
            style={{ borderColor: `${cfg.color}25`, borderTopColor: cfg.color }}
          />
          <p className="text-sm font-medium text-slate-500">Loading questions…</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Class {classNum} · {subject}
              </p>
            </div>
            <Link href="/practice">
              <button className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-all">
                ← Practice
              </button>
            </Link>
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
            {(["Mathematics", "Science"] as Subject[]).map((s) => {
              const c = SUBJECTS[s];
              return (
                <button
                  key={s}
                  onClick={() => { setSubject(s); setSelected(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex-shrink-0 ${
                    subject === s
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                  style={subject === s ? { backgroundColor: c.color } : {}}
                >
                  {c.icon} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6">

        {/* ── 1. Practice Dashboard ─────────────────────────────────────────── */}
        <section>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Practice Dashboard
          </p>

          {totalSolved === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-3">
              <p className="text-2xl">📊</p>
              <p className="text-sm font-semibold text-slate-600">No attempts yet</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice some questions from the{" "}
                <Link href="/practice">
                  <span className="text-indigo-500 font-semibold cursor-pointer">Practice</span>
                </Link>{" "}
                page to see your analytics here.
              </p>
              {import.meta.env.DEV && (
                <button
                  onClick={seedTestData}
                  disabled={seedDone}
                  className="mt-1 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 disabled:opacity-50 transition-all"
                >
                  {seedDone ? "✓ Test data seeded" : "⚙ Seed test data"}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {/* Questions Solved */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-2xl font-black" style={{ color: cfg.color }}>
                    {totalSolved}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Questions Solved
                  </p>
                </div>

                {/* Accuracy */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <p className={`text-2xl font-black ${accColor(overallAcc)}`}>
                    {overallAcc}%
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Overall Accuracy
                  </p>
                </div>

                {/* Strongest Chapter */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-sm font-bold text-emerald-700 leading-tight truncate">
                    {strongest ? strongest.chapterName : "—"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Strongest Chapter
                    {strongest && (
                      <span className="ml-1 text-emerald-600 font-bold">
                        {chapterAccuracy(strongest)}%
                      </span>
                    )}
                  </p>
                </div>

                {/* Weakest Chapter */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-sm font-bold text-red-700 leading-tight truncate">
                    {weakest ? weakest.chapterName : "—"}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Weakest Chapter
                    {weakest ? (
                      <span className="ml-1 text-red-600 font-bold">
                        {chapterAccuracy(weakest)}%
                      </span>
                    ) : (
                      <span className="ml-1 text-slate-400">(need 10+ attempts)</span>
                    )}
                  </p>
                </div>
              </div>

              {import.meta.env.DEV && (
                <div className="text-right mt-2">
                  <button
                    onClick={seedTestData}
                    disabled={seedDone}
                    className="text-[10px] font-semibold px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 disabled:opacity-40 transition-all"
                  >
                    {seedDone ? "✓ Seeded" : "⚙ Seed more test data"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── 2. Chapter Performance ────────────────────────────────────────── */}
        {sortedChapters.length > 0 && (
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Chapter Performance{" "}
              <span className="text-slate-400 font-normal normal-case">
                — weakest first, tap for drilldown
              </span>
            </p>

            <div className="space-y-2">
              {sortedChapters.map((ch) => {
                const acc        = chapterAccuracy(ch);
                const isSelected = selectedChapterId === ch.chapterId;
                return (
                  <button
                    key={ch.chapterId}
                    onClick={() => setSelected(isSelected ? null : ch.chapterId)}
                    className={`w-full text-left bg-white rounded-2xl border p-4 transition-all active:scale-[0.99] ${
                      isSelected
                        ? "border-indigo-300 ring-1 ring-inset ring-indigo-100 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-800 truncate pr-2">
                        {ch.chapterName}
                      </span>
                      <span className={`text-sm font-bold flex-shrink-0 ${accColor(acc)}`}>
                        {acc}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${accBarColor(acc)}`}
                          style={{ width: `${acc}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 tabular-nums">
                        {ch.solved} of {ch.totalQuestions} q
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 3. Question Drilldown ─────────────────────────────────────────── */}
        {selectedChapterId && (
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Drilldown ·{" "}
              <span className="text-indigo-600 font-bold normal-case">
                {selectedChapterName}
              </span>
            </p>

            {drilldownAttempts.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-sm text-slate-400">
                  No per-question data for this chapter yet.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Open questions from Practice to populate this view.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {drilldownAttempts.map((rec) => (
                  <div
                    key={rec.questionId}
                    className="bg-white rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-xs text-slate-700 leading-relaxed flex-1 line-clamp-2">
                        {rec.questionText}
                      </p>
                      <span
                        className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          rec.correct
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {rec.correct ? "✓ Correct" : "✗ Review"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          DIFF_BADGE[rec.difficulty] ??
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {rec.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Last attempted {relDate(rec.lastAttempted)}
                      </span>
                      {rec.attempts > 1 && (
                        <span className="text-[10px] text-slate-400">
                          · {rec.attempts}× total
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
