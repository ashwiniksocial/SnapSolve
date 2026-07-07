import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS, type SubjectConfig, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { useChapterStats } from "@/hooks/useChapterStats";
import { useAttemptLog } from "@/hooks/useAttemptLog";
import {
  getChapters,
  getTopics,
  getQuestions,
} from "@/services/questionService";
import type { Question, Difficulty, QuestionType } from "@/services/questionService";
import {
  overallAccuracy,
  strongestChapter,
  weakestChapter,
  buildQuestionMap,
} from "@/services/analytics";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DIFFICULTIES: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const QUESTION_TYPES: (QuestionType | "All")[] = ["All", "MCQ", "ShortAnswer", "LongAnswer", "HOTS", "PYQ"];
const TYPE_LABELS: Record<string, string> = {
  All: "All Types", MCQ: "MCQ", ShortAnswer: "Short", LongAnswer: "Long", HOTS: "HOTS", PYQ: "PYQ",
};
const ADAPTIVE_TIER_STYLE: Record<string, string> = {
  Easy:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium:    "bg-amber-50   text-amber-700   border-amber-200",
  Hard:      "bg-red-50     text-red-700     border-red-200",
  Challenge: "bg-purple-50  text-purple-700  border-purple-200",
};
const diffStyle: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};
const typeStyle: Record<string, string> = {
  MCQ:         "bg-blue-50   text-blue-700   border-blue-200",
  ShortAnswer: "bg-teal-50   text-teal-700   border-teal-200",
  LongAnswer:  "bg-violet-50 text-violet-700 border-violet-200",
  HOTS:        "bg-orange-50 text-orange-700 border-orange-200",
  PYQ:         "bg-rose-50   text-rose-700   border-rose-200",
};
const CLASS_OPTIONS = [6, 7, 8, 9];
const ALL_SUBJECTS: Subject[] = ["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"];

// ─── Chapter status ───────────────────────────────────────────────────────────
type ChapterStatus = "weak" | "improving" | "strong" | "new";

function getChapterStatus(accuracy: number, attempted: number): ChapterStatus {
  if (attempted === 0) return "new";
  if (accuracy < 50)   return "weak";
  if (accuracy < 75)   return "improving";
  return "strong";
}

const STATUS_ORDER: Record<ChapterStatus, number> = { weak: 0, improving: 1, strong: 2, new: 3 };

const STATUS_DOT: Record<ChapterStatus, string> = {
  weak:      "bg-red-500",
  improving: "bg-amber-400",
  strong:    "bg-emerald-500",
  new:       "bg-slate-300",
};
const STATUS_ROW_BG: Record<ChapterStatus, string> = {
  weak:      "border-red-200   bg-red-50",
  improving: "border-amber-200 bg-amber-50",
  strong:    "border-emerald-100 bg-emerald-50",
  new:       "border-slate-200 bg-white",
};
const STATUS_BAR: Record<ChapterStatus, string> = {
  weak:      "bg-red-400",
  improving: "bg-amber-400",
  strong:    "bg-emerald-500",
  new:       "bg-slate-200",
};
const STATUS_ACC: Record<ChapterStatus, string> = {
  weak:      "text-red-600",
  improving: "text-amber-600",
  strong:    "text-emerald-600",
  new:       "text-slate-400",
};

function ctaLabel(status: ChapterStatus, completionPct: number): string {
  if (status === "weak")                     return "Practice Weak Areas";
  if (status === "new" || completionPct < 80) return "Continue Practice";
  return "Revise";
}

// ─── Question card ────────────────────────────────────────────────────────────
function QuestionCard({ q, cfg, onOpen }: { q: Question; cfg: SubjectConfig; onOpen: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <button className="w-full text-left p-4 active:bg-slate-50 transition-colors" onClick={onOpen}>
        <div className="flex items-start gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 font-bold"
            style={{ backgroundColor: cfg.light, color: cfg.color }}
          >✦</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle[q.difficulty]}`}>
                {q.difficulty}
              </span>
              {q.questionType && (
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeStyle[q.questionType] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                  {TYPE_LABELS[q.questionType] ?? q.questionType}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.question}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0 mt-1 ml-2">
            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: cfg.color }}>
              AI Lesson
            </span>
            <svg className="w-4 h-4" style={{ color: cfg.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Practice() {
  const { session, update }                    = useSession();
  const { profile }                            = useProfile();
  const { getSubjectTier, getSubjectMastery }  = useAdaptiveLearning();
  const { getChapterAttempts }                 = useAttemptLog();

  // Class state — local, defaults to profile; lets student switch without leaving Practice
  const [practiceClass, setPracticeClass] = useState<number>(profile.classLevel ?? 9);

  const cfg             = SUBJECTS[session.subject];
  const adaptiveTier    = getSubjectTier(session.subject);
  const adaptiveMastery = getSubjectMastery(session.subject);

  const chapterStats = useChapterStats(session.subject, practiceClass);

  const chapters = useMemo(
    () => getChapters(practiceClass, session.subject),
    [practiceClass, session.subject],
  );

  // Build question map once for weighted analytics (weakestChapter)
  const questionMap = useMemo(() => {
    const all = chapters.flatMap((ch) =>
      getQuestions({ classNum: practiceClass, subject: session.subject, chapterId: ch.id })
    );
    return buildQuestionMap(all);
  }, [chapters, practiceClass, session.subject]);

  // ── Dashboard metrics ───────────────────────────────────────────────────────
  const totalSolved = chapterStats.reduce((s, ch) => s + ch.solved, 0);
  const overallAcc  = overallAccuracy(chapterStats);
  const strongestCh = strongestChapter(chapterStats, 3);
  const weakestCh   = weakestChapter(chapterStats, questionMap, 5);

  // ── Chapter performance: weak-first sort ───────────────────────────────────
  const sortedChapters = useMemo(
    () =>
      [...chapterStats].sort((a, b) => {
        const sa = getChapterStatus(a.accuracy, a.attempted);
        const sb = getChapterStatus(b.accuracy, b.attempted);
        if (STATUS_ORDER[sa] !== STATUS_ORDER[sb]) return STATUS_ORDER[sa] - STATUS_ORDER[sb];
        return a.accuracy - b.accuracy; // lowest accuracy first within same tier
      }),
    [chapterStats],
  );

  // ── Filter state ────────────────────────────────────────────────────────────
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id ?? "");
  const [drilldownOpen,     setDrilldownOpen]     = useState(false);
  const [selectedTopicId,   setSelectedTopicId]   = useState<string>("all");
  const [selectedDiff,      setSelectedDiff]      = useState<Difficulty | "All">("All");
  const [selectedType,      setSelectedType]      = useState<QuestionType | "All">("All");

  const topics = useMemo(() => getTopics(selectedChapterId), [selectedChapterId]);

  const questions = useMemo(
    () =>
      getQuestions({
        classNum:     practiceClass,
        subject:      session.subject,
        chapterId:    selectedChapterId,
        ...(selectedTopicId !== "all" ? { topicId: selectedTopicId } : {}),
        difficulty:   selectedDiff,
        questionType: selectedType,
      }),
    [practiceClass, session.subject, selectedChapterId, selectedTopicId, selectedDiff, selectedType],
  );

  const drilldownAttempts = useMemo(
    () =>
      selectedChapterId
        ? getChapterAttempts(selectedChapterId, practiceClass, session.subject)
        : [],
    [selectedChapterId, practiceClass, session.subject, getChapterAttempts],
  );

  // ── Subject helpers ─────────────────────────────────────────────────────────
  const availableSubjects = useMemo(
    () => ALL_SUBJECTS.filter((s) => getChapters(practiceClass, s).length > 0),
    [practiceClass],
  );

  const handleSubjectChange = useCallback((s: Subject) => {
    const next = getChapters(practiceClass, s);
    update({ subject: s });
    setSelectedChapterId(next[0]?.id ?? "");
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
    setDrilldownOpen(false);
  }, [practiceClass, update]);

  // Auto-switch if current subject has no content for this class
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(session.subject)) {
      handleSubjectChange(availableSubjects[0]);
    }
  }, [availableSubjects, session.subject, handleSubjectChange]);

  // Reset chapter when class changes
  useEffect(() => {
    const next = getChapters(practiceClass, session.subject);
    setSelectedChapterId(next[0]?.id ?? "");
    setDrilldownOpen(false);
    setSelectedTopicId("all");
  }, [practiceClass, session.subject]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [, navigate] = useLocation();

  const handleOpenQuestion = useCallback((q: Question) => {
    update({
      subject:               session.subject,
      question:              q.question,
      practiceTopic:         q.topicName,
      practiceQuestionId:    q.id,
      practiceQuestionDiff:  q.difficulty,
      practiceChapterId:     q.chapterId,
      practiceChapterName:   q.chapterName,
      practiceClassNum:      q.classNum,
    });
    navigate("/solution?practiceMode=1");
  }, [session.subject, update, navigate]);

  const handleReopenQuestion = useCallback((questionId: string) => {
    const found = chapters
      .flatMap((ch) => getQuestions({ classNum: practiceClass, subject: session.subject, chapterId: ch.id }))
      .find((q) => q.id === questionId);
    if (found) handleOpenQuestion(found);
  }, [chapters, practiceClass, session.subject, handleOpenQuestion]);

  const handleChapterRowClick = (chapterId: string) => {
    if (selectedChapterId === chapterId) {
      setDrilldownOpen((o) => !o);
    } else {
      setSelectedChapterId(chapterId);
      setSelectedTopicId("all");
      setDrilldownOpen(true);
    }
  };

  const selectedStat   = chapterStats.find((cs) => cs.chapterId === selectedChapterId);
  const selectedStatus = selectedStat ? getChapterStatus(selectedStat.accuracy, selectedStat.attempted) : "new";
  const cta            = selectedStat ? ctaLabel(selectedStatus, selectedStat.completionPct) : "Continue Practice";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">

          {/* Title row */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Practice</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Class {practiceClass} · {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} · {session.subject}
              </p>
            </div>
            <Link href="/challenge">
              <button className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-all mt-1">
                ✦ Workspace
              </button>
            </Link>
          </div>

          {/* Class selector */}
          <div className="flex gap-2 mb-3">
            {CLASS_OPTIONS.map((cn) => {
              const active     = practiceClass === cn;
              const hasContent = getChapters(cn, session.subject).length > 0;
              return (
                <button
                  key={cn}
                  onClick={() => hasContent ? setPracticeClass(cn) : undefined}
                  disabled={!hasContent}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    active
                      ? "text-white border-transparent shadow-sm"
                      : hasContent
                        ? "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        : "bg-slate-50 text-slate-400 border-slate-200 cursor-default"
                  }`}
                  style={active ? { backgroundColor: cfg.color } : {}}
                >
                  Class {cn}
                </button>
              );
            })}
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {ALL_SUBJECTS.map((s) => {
              const c          = SUBJECTS[s];
              const hasContent = availableSubjects.includes(s);
              const active     = session.subject === s && hasContent;
              return (
                <button
                  key={s}
                  onClick={() => hasContent ? handleSubjectChange(s) : undefined}
                  disabled={!hasContent}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active
                      ? "text-white border-transparent shadow-sm"
                      : hasContent
                        ? "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        : "bg-slate-50 text-slate-400 border-slate-200 cursor-default"
                  }`}
                  style={active ? { backgroundColor: c.color } : {}}
                >
                  <span>{c.icon}</span>
                  <span>{s}</span>
                  {!hasContent && (
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full ml-0.5">
                      SOON
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI adaptive recommendation */}
          {adaptiveMastery > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-slate-400">✦ AI Recommends:</span>
              <button
                onClick={() => setSelectedDiff(adaptiveTier === "Challenge" ? "Hard" : adaptiveTier)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${ADAPTIVE_TIER_STYLE[adaptiveTier]}`}
              >
                {adaptiveTier === "Challenge" ? "⚡ Challenge (Hard)" : `${adaptiveTier} questions`}
              </button>
              <span className="text-[11px] text-slate-400">{adaptiveMastery}% avg mastery</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4">

        {/* ── Dashboard metrics (4 cards) ── */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Questions Solved</p>
            <p className="text-2xl font-black" style={{ color: cfg.color }}>
              {totalSolved > 0 ? totalSolved : "—"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalSolved > 0 ? "attempts logged" : "Start practicing"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Overall Accuracy</p>
            <p className="text-2xl font-black" style={{ color: cfg.color }}>
              {totalSolved > 0 ? `${overallAcc}%` : "—"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalSolved > 0 ? "of answers correct" : "No data yet"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Strongest Chapter</p>
            <p className="text-sm font-bold text-slate-800 leading-tight truncate">
              {strongestCh?.chapterName ?? "—"}
            </p>
            <p className="text-[11px] mt-0.5 font-semibold text-emerald-600">
              {strongestCh ? `${strongestCh.accuracy}% accuracy` : "≥3 attempts needed"}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Weakest Chapter</p>
            <p className="text-sm font-bold text-slate-800 leading-tight truncate">
              {weakestCh?.chapterName ?? "—"}
            </p>
            <p className="text-[11px] mt-0.5 font-semibold text-red-500">
              {weakestCh ? `${weakestCh.accuracy}% accuracy` : "≥5 attempts needed"}
            </p>
          </div>
        </div>

        {/* ── Chapter performance table ── */}
        {chapters.length > 0 ? (
          <>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Chapter Performance
              </p>
              <div className="space-y-1.5">
                {sortedChapters.map((cs) => {
                  const status     = getChapterStatus(cs.accuracy, cs.attempted);
                  const isSelected = selectedChapterId === cs.chapterId;
                  const isOpen     = isSelected && drilldownOpen;
                  const chNum      = cs.chapterId.replace("ch", "");

                  return (
                    <div key={cs.chapterId}>
                      {/* Chapter row */}
                      <button
                        onClick={() => handleChapterRowClick(cs.chapterId)}
                        className={`w-full text-left rounded-2xl border p-3 transition-all ${
                          isSelected ? "border-2 bg-white shadow-sm" : STATUS_ROW_BG[status]
                        }`}
                        style={isSelected ? { borderColor: cfg.color } : {}}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Status dot */}
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />

                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              <span className="text-slate-400 font-normal text-xs mr-1">Ch {chNum}.</span>
                              {cs.chapterName}
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-3 flex-shrink-0 text-right">
                            <span className="text-[11px] text-slate-500">{cs.attempted} q</span>
                            {cs.attempted > 0 && (
                              <span className={`text-[12px] font-bold min-w-[32px] text-right ${STATUS_ACC[status]}`}>
                                {cs.accuracy}%
                              </span>
                            )}
                            <svg
                              className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {cs.attempted > 0 && (
                          <div className="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${STATUS_BAR[status]}`}
                              style={{ width: `${cs.accuracy}%` }}
                            />
                          </div>
                        )}
                      </button>

                      {/* ── Drilldown panel ── */}
                      {isOpen && (
                        <div className="mt-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                          {/* CTA bar */}
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-slate-500 truncate">{cs.chapterName}</p>
                            <button
                              onClick={() => {
                                setDrilldownOpen(false);
                                setTimeout(() => {
                                  document.getElementById("question-list")?.scrollIntoView({ behavior: "smooth" });
                                }, 50);
                              }}
                              className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-sm transition-all"
                              style={{ backgroundColor: cfg.color }}
                            >
                              {cta}
                            </button>
                          </div>

                          {/* Per-question attempt records */}
                          {drilldownAttempts.length > 0 ? (
                            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                              {drilldownAttempts.map((rec) => (
                                <div key={rec.questionId} className="px-4 py-3 flex items-start gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                                      {rec.questionText}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${diffStyle[rec.difficulty] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>
                                        {rec.difficulty}
                                      </span>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                                        rec.correct
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          : "bg-red-50 text-red-700 border-red-200"
                                      }`}>
                                        {rec.correct ? "✓ Correct" : "✗ Needs Review"}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(rec.lastAttempted).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleReopenQuestion(rec.questionId)}
                                    className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                  >
                                    Reopen
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-5 text-center">
                              <p className="text-sm text-slate-500">No questions attempted yet.</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Use the button above to start practicing.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Question list ── */}
            <div id="question-list" className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Questions · {sortedChapters.find((cs) => cs.chapterId === selectedChapterId)?.chapterName ?? "Select a chapter"}
              </p>

              {/* Topic filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopicId("all")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTopicId === "all" ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={selectedTopicId === "all" ? { backgroundColor: cfg.color } : {}}
                >
                  All Topics
                </button>
                {topics.map((t) => {
                  const active = selectedTopicId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                      }`}
                      style={active ? { backgroundColor: cfg.color } : {}}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty filter */}
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => {
                  const active = selectedDiff === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDiff(d)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? d === "All" ? "text-white border-transparent" : `${diffStyle[d]} border-2`
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                      style={active && d === "All" ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {/* Question type filter */}
              <div className="flex gap-2 flex-wrap">
                {QUESTION_TYPES.map((qt) => {
                  const active = selectedType === qt;
                  return (
                    <button
                      key={qt}
                      onClick={() => setSelectedType(qt)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? qt === "All" ? "text-white border-transparent" : `${typeStyle[qt] ?? ""} border-2`
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                      style={active && qt === "All" ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                    >
                      {TYPE_LABELS[qt]}
                    </button>
                  );
                })}
              </div>

              {/* Count */}
              <p className="text-sm font-semibold text-slate-700">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>

              {/* Question cards */}
              {questions.length > 0 ? (
                <div className="space-y-3 pb-4">
                  {questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      cfg={cfg}
                      onOpen={() => handleOpenQuestion(q)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-semibold text-slate-700">No questions match this filter</p>
                  <p className="text-sm text-slate-500 mt-1">Try changing the topic, type, or difficulty.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-semibold text-slate-700">No chapters available yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Class {practiceClass} {session.subject} content is coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
