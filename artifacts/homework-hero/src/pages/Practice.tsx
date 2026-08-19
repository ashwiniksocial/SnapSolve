import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS, type SubjectConfig, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useChapterStats } from "@/hooks/useChapterStats";
import { useAttemptLog } from "@/hooks/useAttemptLog";
import { useProgress }      from "@/hooks/useProgress";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import {
  getChapters,
  getChapterDisplayNumber,
  getQuestionDisplayNumber,
  getStudentFacingSubject,
  getTopics,
  getQuestions,
  preloadQBank,
} from "@/services/questionService";
import type { Question, Difficulty, QuestionType, EffectiveQuestionType } from "@/services/questionService";
import {
  derivePracticeReadiness,
  getReadinessDrilldownQuestions,
  readinessDrilldownLabel,
  type ReadinessDrilldown,
} from "@/services/practiceReadiness";
import FloatingPageNavigation from "@/components/FloatingPageNavigation";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DIFFICULTIES: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const QUESTION_TYPES: (EffectiveQuestionType | "All")[] = ["All", "MCQ", "ShortAnswer", "LongAnswer", "HOTS", "PYQ", "Unclassified"];
const TYPE_LABELS: Record<string, string> = {
  All: "All Types", MCQ: "MCQ", ShortAnswer: "Short", LongAnswer: "Long", HOTS: "HOTS", PYQ: "PYQ", Unclassified: "Unclassified",
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
  MCQ:          "bg-blue-50   text-blue-700   border-blue-200",
  ShortAnswer:  "bg-teal-50   text-teal-700   border-teal-200",
  LongAnswer:   "bg-violet-50 text-violet-700 border-violet-200",
  HOTS:         "bg-orange-50 text-orange-700 border-orange-200",
  PYQ:          "bg-rose-50   text-rose-700   border-rose-200",
  Unclassified: "bg-slate-50  text-slate-500  border-slate-300",
};
const CLASS_OPTIONS = [6, 7, 8, 9];
const ALL_SUBJECTS: Subject[] = ["Mathematics", "Science", "Information Technology"];

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
function QuestionCard({
  q,
  cfg,
  onOpen,
  questionNumber,
}: {
  q: Question;
  cfg: SubjectConfig;
  onOpen: () => void;
  questionNumber: number | undefined;
}) {
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
              <span className="text-[11px] font-bold text-slate-400 mr-0.5">Q{questionNumber ?? "—"}.</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle[q.difficulty]}`}>
                {q.difficulty}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${typeStyle[q.questionType ?? "Unclassified"]}`}>
                {TYPE_LABELS[q.questionType ?? "Unclassified"]}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">{q.topicName}</p>
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
  const { getChapterAttempts }                 = useAttemptLog();
  const { progress }                           = useProgress();
  const { selfAssessments }                    = useRevisionPlanner();

  const [practiceClass, setPracticeClass] = useState<number>(profile.classLevel ?? 9);
  const [bankReady,       setBankReady]      = useState(false);
  // selectedSubject is the synchronous source of truth for all chapter
  // rendering and computation. It updates immediately in the event handler so
  // every memo and hook sees the new subject in the same render tick.
  // update({ subject }) keeps session / localStorage in sync asynchronously.
  const [selectedSubject, setSelectedSubject] = useState<Subject>(session.subject);

  const cfg = SUBJECTS[selectedSubject];

  const chapterStats = useChapterStats(selectedSubject, practiceClass, bankReady);

  const chapters = useMemo(
    () => bankReady ? getChapters(practiceClass, selectedSubject) : [],
    [bankReady, practiceClass, selectedSubject],
  );

  const activeReadinessQuestions = useMemo(
    () => bankReady ? getQuestions({ classNum: practiceClass, subject: selectedSubject }) : [],
    [bankReady, practiceClass, selectedSubject],
  );
  const readiness = useMemo(
    () => derivePracticeReadiness(activeReadinessQuestions, progress, selfAssessments, selectedSubject),
    [activeReadinessQuestions, progress, selfAssessments, selectedSubject],
  );

  // ── Chapter progress sorted ─────────────────────────────────────────────────
  // selectedSubject is explicit here so sortedChapters invalidates in the same
  // render tick as the subject change, before chapterStats re-runs.
  const sortedChapters = useMemo(
    () => [...chapterStats],
    [chapterStats, selectedSubject],
  );

  // ── Filter state ────────────────────────────────────────────────────────────
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id ?? "");
  const [drilldownOpen,     setDrilldownOpen]     = useState(false);
  const [selectedTopicId,   setSelectedTopicId]   = useState<string>("all");
  const [selectedDiff,      setSelectedDiff]      = useState<Difficulty | "All">("All");
  const [selectedType,      setSelectedType]      = useState<EffectiveQuestionType | "All">("All");
  const [searchQuery,       setSearchQuery]       = useState("");
  const [readinessDrilldown, setReadinessDrilldown] = useState<ReadinessDrilldown | null>(null);

  const topics = useMemo(() => getTopics(selectedChapterId), [selectedChapterId]);

  const questions = useMemo(
    () =>
      getQuestions({
        classNum:     practiceClass,
        subject:      selectedSubject,
        chapterId:    selectedChapterId,
        ...(selectedTopicId !== "all" ? { topicId: selectedTopicId } : {}),
        difficulty:   selectedDiff,
        questionType: selectedType,
      }),
    [practiceClass, selectedSubject, selectedChapterId, selectedTopicId, selectedDiff, selectedType],
  );

  const readinessQuestions = useMemo(
    () => readinessDrilldown
      ? getReadinessDrilldownQuestions(readiness, readinessDrilldown)
      : [],
    [readiness, readinessDrilldown],
  );
  const visibleQuestions = readinessDrilldown ? readinessQuestions : questions;

  // True when the currently visible chapter (and topic, if filtered) contains
  // at least one legacy question with no questionType metadata.
  // Used to conditionally show the "Unclassified" filter pill.
  const chapterHasUnclassified = useMemo(
    () =>
      bankReady &&
      getQuestions({
        classNum:  practiceClass,
        subject:   selectedSubject,
        chapterId: selectedChapterId || undefined,
        ...(selectedTopicId !== "all" ? { topicId: selectedTopicId } : {}),
      }).some((q) => q.questionType === undefined),
    [bankReady, practiceClass, selectedSubject, selectedChapterId, selectedTopicId],
  );

  // Only expose "Unclassified" pill when the chapter actually contains such
  // questions — keeps the filter row clean for fully-typed chapters.
  const visibleTypes = useMemo(
    () => (chapterHasUnclassified
      ? QUESTION_TYPES
      : QUESTION_TYPES.filter((qt) => qt !== "Unclassified")),
    [chapterHasUnclassified],
  );

  const drilldownAttempts = useMemo(
    () =>
      selectedChapterId
        ? getChapterAttempts(selectedChapterId, practiceClass, selectedSubject)
        : [],
    [selectedChapterId, practiceClass, selectedSubject, getChapterAttempts],
  );

  // ── Subject helpers ─────────────────────────────────────────────────────────
  const availableSubjects = useMemo(
    () => bankReady ? ALL_SUBJECTS.filter((s) => getChapters(practiceClass, s).length > 0) : [],
    [bankReady, practiceClass],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query || !bankReady) return [];
    const terms = query.split(/\s+/).filter(Boolean);
    const activeChapterIds = new Set(
      availableSubjects.flatMap((subject) =>
        getChapters(practiceClass, subject).map((chapter) => chapter.id),
      ),
    );
    const candidates = availableSubjects.flatMap((subject) =>
      getQuestions({ classNum: practiceClass, subject }),
    ).filter((question) => activeChapterIds.has(question.chapterId));

    return candidates.filter((question) => {
      const searchableText = [
        question.question,
        question.topicName,
        ...question.keyConcepts,
      ].join(" ").toLocaleLowerCase();
      return terms.every((term) => searchableText.includes(term));
    }).slice(0, 12);
  }, [availableSubjects, bankReady, practiceClass, searchQuery]);

  const handleSubjectChange = useCallback((s: Subject) => {
    setSelectedSubject(s);                    // sync — clears stale chapters immediately
    const next = getChapters(practiceClass, s);
    update({ subject: s });                   // async persist to session / localStorage
    setSelectedChapterId(next[0]?.id ?? "");
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
    setDrilldownOpen(false);
    setReadinessDrilldown(null);
  }, [practiceClass, update]);

  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(selectedSubject)) {
      handleSubjectChange(availableSubjects[0]);
    }
  }, [availableSubjects, selectedSubject, handleSubjectChange]);

  // Fires only when the bank loads or the class changes.
  // selectedSubject is intentionally excluded from deps — subject switches are
  // handled synchronously by handleSubjectChange. The closure captures the
  // latest selectedSubject at the time bankReady / practiceClass changes.
  //
  // If a ?chapter=X param is present (set by the Solution page "← Questions"
  // button), open that chapter's question list directly and scroll to it.
  useEffect(() => {
    if (!bankReady) return;

    const paramChapter = new URLSearchParams(window.location.search).get("chapter") ?? "";
    if (paramChapter) {
      // Find which Practice-level subject owns this chapter ID.
      const owningSubject = ALL_SUBJECTS.find((s) =>
        getChapters(practiceClass, s).some((ch) => ch.id === paramChapter),
      );
      if (owningSubject) {
        setSelectedSubject(owningSubject);
        setSelectedChapterId(paramChapter);
        setSelectedTopicId("all");
        setSelectedDiff("All");
        setSelectedType("All");
        setReadinessDrilldown(null);
        setDrilldownOpen(true);
        setTimeout(() => {
          document.getElementById("question-list")?.scrollIntoView({ behavior: "smooth" });
        }, 80);
        return;
      }
    }

    // Default: first chapter, no drilldown
    const next = getChapters(practiceClass, selectedSubject);
    setSelectedChapterId(next[0]?.id ?? "");
    setDrilldownOpen(false);
    setSelectedTopicId("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankReady, practiceClass]);

  // ── Preload question bank for the selected class ──────────────────────────
  useEffect(() => {
    setBankReady(false);
    preloadQBank(practiceClass).then(() => setBankReady(true));
  }, [practiceClass]);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const [, navigate] = useLocation();

  const handleOpenQuestion = useCallback((q: Question) => {
    update({
      // Use the question's native domain subject ("Physics", "Chemistry",
      // "Biology", "Mathematics") rather than the student-facing "Science"
      // umbrella so the backend API receives a subject it recognises.
      subject:               q.subject as Subject,
      question:              q.question,
      practiceTopic:         q.topicName,
      practiceQuestionId:    q.id,
      practiceQuestionDiff:  q.difficulty,
      practiceChapterId:     q.chapterId,
      practiceChapterName:   q.chapterName,
      practiceClassNum:      q.classNum,
    });
    // Keep the frozen bank ID in the route as well as session storage. This
    // makes a refreshed/new Solution mount deterministic even if React route
    // state has not observed the session update yet.
    navigate(`/solution?practiceMode=1&questionId=${encodeURIComponent(q.id)}`);
  }, [selectedSubject, update, navigate]);

  const handleReopenQuestion = useCallback((questionId: string) => {
    const found = chapters
      .flatMap((ch) => getQuestions({ classNum: practiceClass, subject: selectedSubject, chapterId: ch.id }))
      .find((q) => q.id === questionId);
    if (found) handleOpenQuestion(found);
  }, [chapters, practiceClass, selectedSubject, handleOpenQuestion]);

  const openChapter = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
    setReadinessDrilldown(null);
    setDrilldownOpen(true);
    setTimeout(() => {
      document.getElementById("question-list")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, []);

  const openReadinessDrilldown = (drilldown: ReadinessDrilldown) => {
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
    setDrilldownOpen(false);
    setReadinessDrilldown(drilldown);
    window.setTimeout(() => {
      document.getElementById("question-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleChapterRowClick = (chapterId: string) => {
    if (selectedChapterId === chapterId) {
      setDrilldownOpen((o) => !o);
    } else {
      setSelectedChapterId(chapterId);
      setSelectedTopicId("all");
      setReadinessDrilldown(null);
      setDrilldownOpen(true);
    }
  };

  const selectedStat = chapterStats.find((cs) => cs.chapterId === selectedChapterId);

  // Show spinner while the question bank loads for the first time this session
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
                Class {practiceClass} · {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} · {selectedSubject}
              </p>
            </div>
          </div>

          {/* Class selector */}
          <div className="flex gap-2 mb-3">
            {CLASS_OPTIONS.map((cn) => {
              const active     = practiceClass === cn;
              const hasContent = getChapters(cn, selectedSubject).length > 0;
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
              const active     = selectedSubject === s && hasContent;
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

          <div className="mt-4">
            <label htmlFor="practice-question-search" className="block text-xs font-bold text-slate-600 mb-1.5">
              Find a Question
            </label>
            <input
              id="practice-question-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by words, topic or part of a question..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
            />
            {searchQuery.trim() && (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((question) => {
                      const chapterNumber = getChapterDisplayNumber(
                        question.classNum,
                        question.subject,
                        question.chapterId,
                      );
                      const questionNumber = getQuestionDisplayNumber(question);
                      return (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => handleOpenQuestion(question)}
                          className="w-full px-3.5 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 truncate">
                            {getStudentFacingSubject(question.subject)} · Ch {chapterNumber ?? "—"} · {question.chapterName} · Q{questionNumber ?? "—"}
                          </p>
                          <p className="mt-1 text-sm font-medium leading-snug text-slate-700 line-clamp-2">
                            {question.question}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-3.5 py-3 text-sm text-slate-500">No active questions match that search.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">

        {/* ── Subject readiness — every count opens the canonical question list ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: cfg.color }}>{selectedSubject} readiness</p>
            <p className="text-xs text-slate-500 mt-1">Your practice coverage and your own check-ins.</p>
          </div>
          <button type="button" onClick={() => openReadinessDrilldown("PRACTISED")} className="block w-full rounded-xl text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Questions Practised</p>
                <p className="text-2xl font-black text-slate-800 mt-0.5">{readiness.questionsPractised.length} <span className="text-base text-slate-400">/ {activeReadinessQuestions.length}</span></p>
              </div>
              <p className="text-xs font-semibold text-slate-500">View questions →</p>
            </div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${activeReadinessQuestions.length ? (readiness.questionsPractised.length / activeReadinessQuestions.length) * 100 : 0}%`, backgroundColor: cfg.color }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Topics Practised: {readiness.topicsPractised} / {readiness.totalTopics}</p>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => openReadinessDrilldown("CONFIDENT")} className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-left transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">I Am Confident</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{readiness.confidentQuestions.length}</p>
              <p className="text-[10px] text-emerald-700/70 mt-1">View questions →</p>
            </button>
            <button type="button" onClick={() => openReadinessDrilldown("NEEDS_PRACTICE")} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-left transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
              <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Need More Practice</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{readiness.needsPracticeQuestions.length}</p>
              <p className="text-[10px] text-amber-700/70 mt-1">View questions →</p>
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Practice by Difficulty</p>
            <div className="space-y-2">
              {(["Easy", "Medium", "Hard"] as const).map((difficulty) => {
                const practised = readiness.practisedByDifficulty[difficulty].length;
                const total = activeReadinessQuestions.filter((question) => question.difficulty === difficulty).length;
                return (
                  <button key={difficulty} type="button" onClick={() => openReadinessDrilldown(difficulty)} className="flex w-full items-center gap-2 rounded-lg text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <span className={`w-16 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle[difficulty]}`}>{difficulty}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${total ? (practised / total) * 100 : 0}%`, backgroundColor: cfg.color }} /></div>
                    <span className="w-11 text-right text-[11px] font-semibold text-slate-600">{practised} / {total}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {readiness.legacyUnassessedQuestions.length > 0 && (
            <p className="text-[11px] text-slate-500">{readiness.legacyUnassessedQuestions.length} practised question{readiness.legacyUnassessedQuestions.length === 1 ? "" : "s"} {readiness.legacyUnassessedQuestions.length === 1 ? "is" : "are"} legacy/unassessed and excluded from both self-assessment counts.</p>
          )}
        </div>

        {/* ── 5. Chapter Progress ── */}
        {chapters.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Chapter Progress
            </p>
            <div className="space-y-2">
              {sortedChapters.map((cs) => {
                const isSelected = selectedChapterId === cs.chapterId;
                const isOpen     = isSelected && drilldownOpen;
                const chNum      = String(cs.displayChapterNumber ?? "—");
                const chLabel    = "Ch";

                return (
                  <div key={`${selectedSubject}-${practiceClass}-${cs.chapterId}`}>
                    <button
                      onClick={() => handleChapterRowClick(cs.chapterId)}
                      disabled={cs.totalQuestions === 0}
                      className={`w-full text-left rounded-2xl border p-3.5 bg-white shadow-sm transition-all ${
                        cs.totalQuestions === 0
                          ? "opacity-60 cursor-not-allowed border-slate-200"
                          : `hover:border-slate-300 ${isSelected ? "border-2 shadow-md" : "border-slate-200"}`
                      }`}
                      style={isSelected && cs.totalQuestions > 0 ? { borderColor: cfg.color } : {}}
                    >
                      {/* Row top */}
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cs.attempted > 0 ? cfg.color : "#cbd5e1" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            <span className="text-slate-400 font-normal text-xs mr-1">{chLabel} {chNum}.</span>
                            {cs.chapterName}
                          </p>
                        </div>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>

                      {/* Coverage bar */}
                      {cs.attempted > 0 ? (
                        <div className="mt-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">Practised</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${Math.min(cs.completionPct, 100)}%`, backgroundColor: cfg.color }}
                              />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 w-8 text-right">
                              {cs.attempted}/{cs.totalQuestions}
                            </span>
                          </div>
                        </div>
                      ) : cs.totalQuestions === 0 ? (
                        <p className="text-[11px] text-amber-500 font-medium mt-1.5 ml-5">Content being prepared</p>
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
                            View Questions
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

        {/* ── Question list ── */}
        {chapters.length > 0 && (
          <div id="question-list" className="space-y-3 scroll-mt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {readinessDrilldown
                  ? readinessDrilldownLabel(readinessDrilldown)
                  : <>Questions · {sortedChapters.find((cs) => cs.chapterId === selectedChapterId)?.chapterName ?? "Select a chapter"}</>}
              </p>
              {readinessDrilldown && (
                <button
                  type="button"
                  onClick={() => setReadinessDrilldown(null)}
                  className="flex-shrink-0 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Show chapter list
                </button>
              )}
            </div>

            {!readinessDrilldown && (
              <>
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

            {/* Question type filter — "Unclassified" pill only shown for legacy chapters */}
            <div className="flex gap-2 flex-wrap">
              {visibleTypes.map((qt) => {
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
              </>
            )}

            <p className="text-sm font-semibold text-slate-700">
              {visibleQuestions.length} question{visibleQuestions.length !== 1 ? "s" : ""}
            </p>

            {visibleQuestions.length > 0 ? (
              <div className="space-y-3 pb-4">
                {visibleQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    q={q}
                    cfg={cfg}
                    questionNumber={getQuestionDisplayNumber(q)}
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
              Class {practiceClass} {selectedSubject} content is coming soon.
            </p>
          </div>
        )}
      </div>
      <FloatingPageNavigation />
    </div>
  );
}
