import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS, type SubjectConfig, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { useChapterStats } from "@/hooks/useChapterStats";
import { useAttemptLog }   from "@/hooks/useAttemptLog";
import { useStreak }        from "@/hooks/useStreak";
import { useMasteryScore }  from "@/hooks/useMasteryScore";
import { useProgress }      from "@/hooks/useProgress";
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
const ALL_SUBJECTS: Subject[] = ["Mathematics", "Science", "Economics"];

// ─── Chapter status (5 tiers) ──────────────────────────────────────────────────
type ChapterStatus = "new" | "learning" | "improving" | "strong" | "mastered";

function getChapterStatus(accuracy: number, attempted: number, completionPct: number): ChapterStatus {
  if (attempted === 0) return "new";
  if (accuracy < 40)   return "learning";
  if (accuracy < 65)   return "improving";
  if (accuracy >= 85 && completionPct >= 50) return "mastered";
  return "strong";
}

const STATUS_ORDER: Record<ChapterStatus, number> = {
  learning: 0, improving: 1, new: 2, strong: 3, mastered: 4,
};

const STATUS_LABEL: Record<ChapterStatus, string> = {
  new:       "New",
  learning:  "Learning",
  improving: "Improving",
  strong:    "Strong",
  mastered:  "Mastered",
};

const STATUS_DOT: Record<ChapterStatus, string> = {
  new:       "bg-slate-300",
  learning:  "bg-red-500",
  improving: "bg-amber-400",
  strong:    "bg-blue-500",
  mastered:  "bg-emerald-500",
};

const STATUS_BADGE: Record<ChapterStatus, string> = {
  new:       "bg-slate-100 text-slate-500",
  learning:  "bg-red-50 text-red-600",
  improving: "bg-amber-50 text-amber-700",
  strong:    "bg-blue-50 text-blue-700",
  mastered:  "bg-emerald-50 text-emerald-700",
};

const STATUS_BAR: Record<ChapterStatus, string> = {
  new:       "bg-slate-200",
  learning:  "bg-red-400",
  improving: "bg-amber-400",
  strong:    "bg-blue-500",
  mastered:  "bg-emerald-500",
};

const STATUS_ACC: Record<ChapterStatus, string> = {
  new:       "text-slate-400",
  learning:  "text-red-600",
  improving: "text-amber-600",
  strong:    "text-blue-600",
  mastered:  "text-emerald-600",
};

// ─── Mastery Progress Bar ──────────────────────────────────────────────────────
function MasteryProgressBar({ score, label, color }: { score: number; label: string; color: string }) {
  const tiers = [
    { min: 0,  max: 35,  name: "Beginner",   fill: "#94a3b8" },
    { min: 35, max: 55,  name: "Developing", fill: "#f59e0b" },
    { min: 55, max: 70,  name: "Proficient", fill: "#3b82f6" },
    { min: 70, max: 85,  name: "Advanced",   fill: "#10b981" },
    { min: 85, max: 100, name: "Expert",     fill: "#8b5cf6" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mastery Score</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black" style={{ color: score > 0 ? color : "#94a3b8" }}>
              {score > 0 ? score : "—"}
            </span>
            {score > 0 && <span className="text-xs font-bold text-slate-500">/ 100</span>}
          </div>
        </div>
        {score > 0 && (
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Bar track */}
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: score > 0
              ? `linear-gradient(90deg, #94a3b8 0%, #f59e0b 35%, #3b82f6 55%, #10b981 70%, #8b5cf6 85%)`
              : "#e2e8f0",
            backgroundSize: "100vw 100%",
            backgroundPosition: "left center",
          }}
        />
        {/* Tier markers */}
        {[35, 55, 70, 85].map((v) => (
          <div
            key={v}
            className="absolute top-0 bottom-0 w-px bg-white/60"
            style={{ left: `${v}%` }}
          />
        ))}
      </div>

      {/* Tier labels */}
      <div className="flex justify-between mt-1.5">
        {tiers.map((t) => (
          <span
            key={t.name}
            className="text-[9px] font-semibold"
            style={{ color: score >= t.min ? t.fill : "#cbd5e1" }}
          >
            {t.name}
          </span>
        ))}
      </div>

      {/* Score breakdown */}
      {score > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100">
          {[
            { label: "Accuracy",    pct: Math.round((score * 0.40 / 0.40)) },
            { label: "Difficulty",  pct: Math.round((score * 0.30 / 0.30)) },
            { label: "Consistency", pct: Math.round((score * 0.20 / 0.20)) },
            { label: "Recency",     pct: Math.round((score * 0.10 / 0.10)) },
          ].map((d) => (
            <div key={d.label} className="text-center">
              <p className="text-[9px] font-semibold text-slate-400 uppercase">{d.label}</p>
              <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
  const { log, getChapterAttempts }            = useAttemptLog();
  const { streak }                             = useStreak();
  const { getSubjectStats }                    = useProgress();

  const [practiceClass, setPracticeClass] = useState<number>(profile.classLevel ?? 9);

  const mastery      = useMasteryScore(session.subject, practiceClass);
  const cfg          = SUBJECTS[session.subject];
  const adaptiveTier = getSubjectTier(session.subject);
  const adaptiveMastery = getSubjectMastery(session.subject);

  const chapterStats = useChapterStats(session.subject, practiceClass);

  const chapters = useMemo(
    () => getChapters(practiceClass, session.subject),
    [practiceClass, session.subject],
  );

  const questionMap = useMemo(() => {
    const all = chapters.flatMap((ch) =>
      getQuestions({ classNum: practiceClass, subject: session.subject, chapterId: ch.id })
    );
    return buildQuestionMap(all);
  }, [chapters, practiceClass, session.subject]);

  // ── Metrics ─────────────────────────────────────────────────────────────────
  const totalSolved = chapterStats.reduce((s, ch) => s + ch.solved, 0);
  const overallAcc  = overallAccuracy(chapterStats);

  const studyMinutes = useMemo(() => {
    const relevant = Object.values(log).filter(
      (r) => r.subject === session.subject && r.classNum === practiceClass,
    );
    return relevant.reduce((sum, r) => sum + Math.min(5 + (r.attempts - 1) * 2, 12), 0);
  }, [log, session.subject, practiceClass]);

  // ── Topic stats from useProgress ────────────────────────────────────────────
  const subjectStats = useMemo(
    () => getSubjectStats(session.subject),
    [getSubjectStats, session.subject],
  );

  const strongTopicsList = useMemo(
    () =>
      subjectStats.topicStats
        .filter((t) => t.solved >= 3 && t.accuracy >= 70)
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 5),
    [subjectStats],
  );

  // ── Weak CHAPTERS (chapter-level) ───────────────────────────────────────────
  const weakChapters = useMemo(
    () =>
      chapterStats
        .filter((cs) => cs.attempted > 0 && cs.accuracy < 65)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 3),
    [chapterStats],
  );

  // ── Recommended chapter ─────────────────────────────────────────────────────
  const recommendedChapter = useMemo(() => {
    // 1. Weakest chapter being practised
    const weakChs = chapterStats
      .filter((cs) => cs.attempted > 0 && cs.accuracy < 65)
      .sort((a, b) => a.accuracy - b.accuracy);
    if (weakChs.length > 0)
      return { chapter: weakChs[0], reason: `Only ${weakChs[0].accuracy}% accuracy — needs improvement`, cta: "Practice Weak Chapter" };

    // 2. Never started chapter
    const newChs = chapterStats.filter((cs) => cs.attempted === 0);
    if (newChs.length > 0)
      return { chapter: newChs[0], reason: "Not started yet — build your foundation", cta: "Start Chapter" };

    // 3. Lowest completion
    const incomplete = [...chapterStats]
      .filter((cs) => cs.completionPct < 80)
      .sort((a, b) => a.completionPct - b.completionPct);
    if (incomplete.length > 0)
      return { chapter: incomplete[0], reason: `${incomplete[0].completionPct}% done — keep going`, cta: "Continue Chapter" };

    return null;
  }, [chapterStats]);

  // ── Chapter progress sorted ─────────────────────────────────────────────────
  const sortedChapters = useMemo(
    () =>
      [...chapterStats].sort((a, b) => {
        const sa = getChapterStatus(a.accuracy, a.attempted, a.completionPct);
        const sb = getChapterStatus(b.accuracy, b.attempted, b.completionPct);
        if (STATUS_ORDER[sa] !== STATUS_ORDER[sb]) return STATUS_ORDER[sa] - STATUS_ORDER[sb];
        return a.accuracy - b.accuracy;
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

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(session.subject)) {
      handleSubjectChange(availableSubjects[0]);
    }
  }, [availableSubjects, session.subject, handleSubjectChange]);

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

  const openChapter = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
    setDrilldownOpen(true);
    setTimeout(() => {
      document.getElementById("question-list")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, []);

  const handleChapterRowClick = (chapterId: string) => {
    if (selectedChapterId === chapterId) {
      setDrilldownOpen((o) => !o);
    } else {
      setSelectedChapterId(chapterId);
      setSelectedTopicId("all");
      setDrilldownOpen(true);
    }
  };

  const selectedStat = chapterStats.find((cs) => cs.chapterId === selectedChapterId);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
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

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">

        {/* ── 1. Mastery Progress Bar ── */}
        <MasteryProgressBar score={mastery.score} label={mastery.label} color={mastery.color} />

        {/* ── 2. Four metric cards ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Questions Solved */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Questions Solved</p>
            <p className="text-2xl font-black" style={{ color: cfg.color }}>
              {totalSolved > 0 ? totalSolved : "—"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalSolved > 0 ? "attempts logged" : "Start practicing"}
            </p>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Accuracy</p>
            <p className="text-2xl font-black" style={{ color: cfg.color }}>
              {totalSolved > 0 ? `${overallAcc}%` : "—"}
            </p>
            {totalSolved > 0 && (
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${overallAcc}%`, backgroundColor: cfg.color }}
                />
              </div>
            )}
            {totalSolved === 0 && <p className="text-[11px] text-slate-400 mt-0.5">No data yet</p>}
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Streak</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-black text-amber-500">
                {streak > 0 ? streak : "—"}
              </p>
              {streak > 0 && <span className="text-sm font-bold text-amber-400">🔥</span>}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {streak === 1 ? "day streak" : streak > 1 ? "day streak" : "Start today"}
            </p>
          </div>

          {/* Study Time */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Study Time</p>
            <p className="text-2xl font-black text-blue-500">
              {studyMinutes > 0
                ? studyMinutes < 60
                  ? `${studyMinutes}m`
                  : `${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m`
                : "—"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">estimated total</p>
          </div>
        </div>

        {/* ── 3. Weak Areas (chapter-level) ── */}
        {weakChapters.length > 0 && (
          <div className="bg-white rounded-2xl border border-red-200 overflow-hidden shadow-sm">
            <div className="px-4 pt-4 pb-2 border-b border-red-100">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                🎯 Weak Areas — needs attention
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {weakChapters.map((cs) => {
                const chNum = cs.chapterId.replace(/\D/g, "").replace(/^0+/, "");
                return (
                  <div key={cs.chapterId} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        <span className="text-slate-400 font-normal text-xs mr-1">Ch {chNum}.</span>
                        {cs.chapterName}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-20 h-1.5 bg-red-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-400 rounded-full"
                              style={{ width: `${cs.accuracy}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-red-600">{cs.accuracy}%</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{cs.attempted} attempt{cs.attempted !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => openChapter(cs.chapterId)}
                      className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-xl text-white shadow-sm transition-all"
                      style={{ backgroundColor: cfg.color }}
                    >
                      Practice Now →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 4. Recommended Next Action ── */}
        {recommendedChapter ? (
          <div
            className="rounded-2xl border p-4"
            style={{ backgroundColor: `${cfg.color}08`, borderColor: `${cfg.color}25` }}
          >
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: cfg.color }}>
              ✦ Recommended Next Action
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
              {recommendedChapter.chapter.chapterName}
            </p>
            <p className="text-[12px] text-slate-500 mt-0.5">{recommendedChapter.reason}</p>
            <button
              onClick={() => openChapter(recommendedChapter.chapter.chapterId)}
              className="mt-3 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm transition-all"
              style={{ backgroundColor: cfg.color }}
            >
              {recommendedChapter.cta} →
            </button>
          </div>
        ) : (
          <div
            className="rounded-2xl border p-4"
            style={{ backgroundColor: `${cfg.color}08`, borderColor: `${cfg.color}25` }}
          >
            <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: cfg.color }}>
              ✦ Recommended Next Action
            </p>
            {totalSolved === 0 ? (
              <>
                <p className="text-sm text-slate-700 mt-1">Start with Chapter 1 — build your foundation step by step.</p>
                <button
                  onClick={() => openChapter(chapters[0]?.id ?? "")}
                  className="mt-3 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: cfg.color }}
                >
                  Start Chapter 1 →
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-700 mt-1">
                {mastery.consistency < 40
                  ? "Explore more chapters to build breadth across topics."
                  : overallAcc >= 80 && totalSolved >= 10
                  ? "Challenge yourself with Hard & HOTS questions to level up!"
                  : "Great progress — keep practicing consistently!"}
              </p>
            )}
          </div>
        )}

        {/* ── 5. Chapter Progress ── */}
        {chapters.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Chapter Progress
            </p>
            <div className="space-y-2">
              {sortedChapters.map((cs) => {
                const status     = getChapterStatus(cs.accuracy, cs.attempted, cs.completionPct);
                const isSelected = selectedChapterId === cs.chapterId;
                const isOpen     = isSelected && drilldownOpen;
                const chNum      = cs.chapterId.replace(/\D/g, "").replace(/^0+/, "");

                return (
                  <div key={cs.chapterId}>
                    <button
                      onClick={() => handleChapterRowClick(cs.chapterId)}
                      className={`w-full text-left rounded-2xl border p-3.5 bg-white shadow-sm transition-all hover:border-slate-300 ${
                        isSelected ? "border-2 shadow-md" : "border-slate-200"
                      }`}
                      style={isSelected ? { borderColor: cfg.color } : {}}
                    >
                      {/* Row top */}
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[status]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            <span className="text-slate-400 font-normal text-xs mr-1">Ch {chNum}.</span>
                            {cs.chapterName}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[status]}`}>
                          {STATUS_LABEL[status]}
                        </span>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Row stats + bars */}
                      {cs.attempted > 0 ? (
                        <div className="mt-2.5 space-y-1.5">
                          {/* Completion bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">Completion</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-slate-400 transition-all"
                                style={{ width: `${Math.min(cs.completionPct, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 w-8 text-right">
                              {Math.round(cs.completionPct)}%
                            </span>
                          </div>
                          {/* Accuracy bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">Accuracy</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${STATUS_BAR[status]}`}
                                style={{ width: `${cs.accuracy}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-bold w-8 text-right ${STATUS_ACC[status]}`}>
                              {cs.accuracy}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-5">Not started yet</p>
                      )}
                    </button>

                    {/* ── Drilldown panel ── */}
                    {isOpen && (
                      <div className="mt-1 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
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
                            {status === "learning" ? "Practice Weak Areas" : status === "new" ? "Start Practicing" : status === "mastered" ? "Revise" : "Continue Practice"}
                          </button>
                        </div>

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
                            <p className="text-xs text-slate-400 mt-0.5">Use the button above to start practicing.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 6. Strongest Topics ── */}
        {strongTopicsList.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-3">
              💪 Strongest Topics
            </p>
            <div className="space-y-2.5">
              {strongTopicsList.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{t.topic}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.solved} solved</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-20 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${t.accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 w-8 text-right">{t.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Question list ── */}
        {chapters.length > 0 && (
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

            <p className="text-sm font-semibold text-slate-700">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>

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
        )}

        {chapters.length === 0 && (
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
