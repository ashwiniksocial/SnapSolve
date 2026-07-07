import { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS, type SubjectConfig, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { useProgress } from "@/hooks/useProgress";
import { useMistakeJournal } from "@/hooks/useMistakeJournal";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { useAdaptiveLearning } from "@/hooks/useAdaptiveLearning";
import { useChapterStats } from "@/hooks/useChapterStats";
import {
  getChapters,
  getTopics,
  getQuestions,
} from "@/services/questionService";
import type { Question, Difficulty, ChapterMeta, QuestionType } from "@/services/questionService";

// ─── Filter options ────────────────────────────────────────────────────────────
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
  MCQ:         "bg-blue-50  text-blue-700  border-blue-200",
  ShortAnswer: "bg-teal-50  text-teal-700  border-teal-200",
  LongAnswer:  "bg-violet-50 text-violet-700 border-violet-200",
  HOTS:        "bg-orange-50 text-orange-700 border-orange-200",
  PYQ:         "bg-rose-50  text-rose-700  border-rose-200",
};

// ─── Single question card — navigates to AI Teaching Lesson ──────────────────
// Clicking ANY question opens the full AI tutor pipeline:
//   POST /api/solveQuestion → Master Teacher → Blueprint → Lesson → LessonRenderer
// No hint/steps/answer are ever shown here. Legacy expand-in-place is removed.
function QuestionCard({
  q,
  cfg,
  onOpen,
}: {
  q: Question;
  cfg: SubjectConfig;
  onOpen: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <button
        className="w-full text-left p-4 active:bg-slate-50 transition-colors"
        onClick={onOpen}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 font-bold"
            style={{ backgroundColor: cfg.light, color: cfg.color }}
          >
            ✦
          </div>
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

// ─── Chapter selector row with completion bar ─────────────────────────────────
function ChapterButton({
  ch,
  active,
  completionPct,
  cfg,
  onClick,
}: {
  ch: ChapterMeta;
  active: boolean;
  completionPct: number;
  cfg: SubjectConfig;
  onClick: () => void;
}) {
  const chNum = ch.id.replace("ch", "");
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
        active
          ? "text-white border-transparent shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
      }`}
      style={active ? { backgroundColor: cfg.color } : {}}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="opacity-60 mr-1.5">Ch {chNum}.</span>
          <span className="truncate">{ch.name}</span>
        </div>
        {completionPct > 0 && (
          <span className={`text-[10px] font-bold flex-shrink-0 ${active ? "text-white/80" : ""}`}
            style={!active ? { color: cfg.color } : {}}>
            {completionPct}%
          </span>
        )}
      </div>
      {/* Completion bar */}
      {completionPct > 0 && (
        <div className={`mt-2 h-1 rounded-full overflow-hidden ${active ? "bg-white/30" : "bg-slate-100"}`}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${completionPct}%`,
              backgroundColor: active ? "rgba(255,255,255,0.8)" : cfg.color,
            }}
          />
        </div>
      )}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Practice() {
  const { session, update } = useSession();
  const { getSubjectStats, recordSolve } = useProgress();
  const { recordMistake, recordResolution } = useMistakeJournal();
  const { recordAttempt: scheduleRevision } = useRevisionPlanner();
  const { getSubjectTier, getSubjectMastery } = useAdaptiveLearning();

  const { profile } = useProfile();
  const classNum = profile.classLevel ?? 9;

  const cfg             = SUBJECTS[session.subject];
  const adaptiveTier    = getSubjectTier(session.subject);
  const adaptiveMastery = getSubjectMastery(session.subject);

  const chapterStats = useChapterStats(session.subject);

  // Chapter / topic / difficulty / type filters
  const chapters = useMemo(
    () => getChapters(classNum, session.subject),
    [classNum, session.subject]
  );

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    chapters[0]?.id ?? ""
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [selectedDiff,    setSelectedDiff]    = useState<Difficulty | "All">("All");
  const [selectedType,    setSelectedType]    = useState<QuestionType | "All">("All");

  const topics = useMemo(() => getTopics(selectedChapterId), [selectedChapterId]);

  // Questions matching current filters
  const questions = useMemo(
    () =>
      getQuestions({
        classNum:     classNum,
        subject:      session.subject,
        chapterId:    selectedChapterId,
        ...(selectedTopicId !== "all" ? { topicId: selectedTopicId } : {}),
        difficulty:   selectedDiff,
        questionType: selectedType,
      }),
    [classNum, session.subject, selectedChapterId, selectedTopicId, selectedDiff, selectedType]
  );

  // Analytics
  const stats = getSubjectStats(session.subject);

  // Handlers
  const handleSubjectChange = (s: typeof session.subject) => {
    const newChapters = getChapters(classNum, s);
    update({ subject: s });
    setSelectedChapterId(newChapters[0]?.id ?? "");
    setSelectedTopicId("all");
    setSelectedDiff("All");
    setSelectedType("All");
  };

  const handleChapterChange = (id: string) => {
    setSelectedChapterId(id);
    setSelectedTopicId("all");
  };

  const [, navigate] = useLocation();

  // Opens a question in the full AI teaching pipeline.
  // Stores question in session and navigates to /solution?practiceMode=1.
  // Solution.tsx calls solve() with { skipBank: true, requireLesson: true } —
  // forcing POST /api/solveQuestion → Master Teacher → Blueprint → Lesson → LessonRenderer.
  // No hint/steps/answer are ever rendered. Failure is visible, never silently hidden.
  const handleOpenQuestion = useCallback((q: Question) => {
    console.log(`[PRACTICE:NAV] Question clicked → opening AI teaching lesson`);
    console.log(`[PRACTICE:NAV] id="${q.id}" topic="${q.topicName}" difficulty="${q.difficulty}"`);
    console.log(`[PRACTICE:NAV] question="${q.question.slice(0, 100)}"`);
    console.log(`[PRACTICE:NAV] → storing in session, navigating to /solution?practiceMode=1`);
    console.log(`[PRACTICE:NAV] → Pipeline: skipBank=true requireLesson=true → POST /api/solveQuestion REQUIRED`);
    update({ subject: session.subject, question: q.question, practiceTopic: q.topicName });
    navigate('/solution?practiceMode=1');
  }, [session.subject, update, navigate]);

  // All subjects — show all tabs; "Coming Soon" for those without content
  const ALL_SUBJECTS: Subject[] = [
    "Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science",
  ];
  const availableSubjects = useMemo(
    () => ALL_SUBJECTS.filter((s) => getChapters(classNum, s).length > 0),
    [classNum]
  );

  // Auto-switch if current subject has no content for this class
  useEffect(() => {
    if (availableSubjects.length > 0 && !availableSubjects.includes(session.subject)) {
      handleSubjectChange(availableSubjects[0]);
    }
  }, [availableSubjects, session.subject]);

  // Visibility card data — static counts per class (Mathematics)
  const CLASS_CARDS = [
    { classNum: 6, chapters: 14, questions: 1091 },
    { classNum: 7, chapters: 13, questions: 975  },
    { classNum: 8, chapters: 13, questions: 975  },
    { classNum: 9, chapters: 15, questions: 397  },
  ];

  // Current chapter completion
  const currentChapterCompletion = chapterStats.find((cs) => cs.chapterId === selectedChapterId);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Practice</h1>
              <p className="text-sm text-slate-500 mt-0.5">Class {classNum} · {chapters.length} chapter{chapters.length !== 1 ? "s" : ""} · {session.subject}</p>
            </div>
            <Link href="/challenge">
              <button className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-all flex-shrink-0 mt-1">
                ✦ Workspace
              </button>
            </Link>
          </div>

          {/* Subject tabs — all 6 subjects; Coming Soon for those without content */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {ALL_SUBJECTS.map((s) => {
              const c = SUBJECTS[s];
              const hasContent = availableSubjects.includes(s);
              const active = session.subject === s && hasContent;
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

          {/* ── AI adaptive difficulty recommendation ── */}
          {adaptiveMastery > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-slate-400">✦ AI Recommends:</span>
              <button
                onClick={() =>
                  setSelectedDiff(adaptiveTier === "Challenge" ? "Hard" : adaptiveTier)
                }
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${ADAPTIVE_TIER_STYLE[adaptiveTier]}`}
              >
                {adaptiveTier === "Challenge"
                  ? "⚡ Challenge (Hard)"
                  : `${adaptiveTier} questions`}
              </button>
              <span className="text-[11px] text-slate-400">
                {adaptiveMastery}% avg mastery
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4">

        {/* ── Analytics strip ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Solved",    value: stats.totalSolved },
            { label: "Accuracy",  value: stats.totalSolved > 0 ? `${stats.accuracy}%` : "—" },
            { label: "Strengths", value: stats.strongTopics.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-3 text-center shadow-sm">
              <p className="text-lg font-bold" style={{ color: cfg.color }}>{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Content visibility cards ── */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Content</p>
          <div className="grid grid-cols-4 gap-2">
            {CLASS_CARDS.map((card) => {
              const isActive = card.classNum === classNum;
              return (
                <div
                  key={card.classNum}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    isActive
                      ? "border-amber-300 bg-amber-50 shadow-sm"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className={`text-sm font-bold ${isActive ? "text-amber-700" : "text-slate-700"}`}>
                    Class {card.classNum}
                  </p>
                  <p className={`text-xs mt-1 font-semibold ${isActive ? "text-amber-600" : "text-slate-500"}`}>
                    {card.chapters} ch
                  </p>
                  <p className={`text-[11px] mt-0.5 ${isActive ? "text-amber-500" : "text-slate-400"}`}>
                    {card.questions} q
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recommendations ── */}
        {stats.recommendations.length > 0 && (
          <div className="space-y-2">
            {stats.recommendations.slice(0, 2).map((r) => (
              <div
                key={r.topic}
                className={`rounded-2xl border p-3 flex items-start gap-2.5 ${
                  r.priority === "high"
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <span className="text-lg mt-0.5">{r.priority === "high" ? "⚠️" : "💡"}</span>
                <div>
                  <p className={`text-xs font-semibold ${r.priority === "high" ? "text-red-700" : "text-amber-700"}`}>
                    {r.topic}
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${r.priority === "high" ? "text-red-600" : "text-amber-600"}`}>
                    {r.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Chapter selector ── */}
        {chapters.length > 0 ? (
          <>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Chapter</p>
              <div className="flex flex-col gap-2">
                {chapters.map((ch: ChapterMeta) => {
                  const chStat = chapterStats.find((cs) => cs.chapterId === ch.id);
                  return (
                    <ChapterButton
                      key={ch.id}
                      ch={ch}
                      active={selectedChapterId === ch.id}
                      completionPct={chStat?.completionPct ?? 0}
                      cfg={cfg}
                      onClick={() => handleChapterChange(ch.id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* ── Chapter stats bar ── */}
            {currentChapterCompletion && currentChapterCompletion.totalQuestions > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-700">Chapter Progress</p>
                  <p className="text-xs font-bold" style={{ color: cfg.color }}>
                    {currentChapterCompletion.attempted}/{currentChapterCompletion.totalQuestions} questions
                  </p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${currentChapterCompletion.completionPct}%`, backgroundColor: cfg.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] text-slate-500">
                    {currentChapterCompletion.completionPct}% complete
                    {currentChapterCompletion.solved > 0 && ` · ${currentChapterCompletion.accuracy}% accuracy`}
                  </p>
                  <p className="text-[11px] font-semibold" style={{ color: cfg.color }}>
                    {currentChapterCompletion.totalQuestions} total
                  </p>
                </div>
              </div>
            )}

            {/* ── Topic filter ── */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Topic</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopicId("all")}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTopicId === "all"
                      ? "text-white border-transparent"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={selectedTopicId === "all" ? { backgroundColor: cfg.color } : {}}
                >
                  All Topics
                </button>
                {topics.map((t) => {
                  const active = selectedTopicId === t.id;
                  const stat   = stats.topicStats.find((s) => s.topic === t.name);
                  const isWeak = stats.weakTopics.includes(t.name);
                  // Chapter stats for this topic
                  const topicCompletion = currentChapterCompletion?.topics.find((tc) => tc.topicId === t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                        active
                          ? "text-white border-transparent"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                      style={active ? { backgroundColor: cfg.color } : {}}
                    >
                      {t.name}
                      {isWeak && !active && <span className="text-red-400 ml-0.5">⚠</span>}
                      {stat && !active && (
                        <span className="text-[10px] opacity-70 ml-0.5">{stat.accuracy}%</span>
                      )}
                      {topicCompletion && topicCompletion.completionPct > 0 && !active && (
                        <span className="text-[10px] opacity-60">({topicCompletion.completionPct}%)</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Question Type filter ── */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Question Type
              </p>
              <div className="flex gap-2 flex-wrap">
                {QUESTION_TYPES.map((qt) => {
                  const active = selectedType === qt;
                  return (
                    <button
                      key={qt}
                      onClick={() => setSelectedType(qt)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? qt === "All"
                            ? "text-white border-transparent"
                            : (typeStyle[qt] ?? "") + " border-2"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                      style={active && qt === "All" ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                    >
                      {TYPE_LABELS[qt]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Difficulty filter ── */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Difficulty
              </p>
              <div className="flex gap-2 flex-wrap">
                {DIFFICULTIES.map((d) => {
                  const active = selectedDiff === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDiff(d)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? d === "All"
                            ? "text-white border-transparent"
                            : diffStyle[d] + " border-2"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                      style={active && d === "All" ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Question count + topic mastery ── */}
            <div className="flex items-center justify-between py-1">
              <p className="text-sm font-semibold text-slate-700">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </p>
              {selectedTopicId !== "all" && (() => {
                const topicName = topics.find((t) => t.id === selectedTopicId)?.name ?? "";
                const stat = stats.topicStats.find((s) => s.topic === topicName);
                return stat ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${stat.masteryPct}%`, backgroundColor: cfg.color }}
                      />
                    </div>
                    <p className="text-xs font-bold" style={{ color: cfg.color }}>
                      {stat.masteryPct}% mastery
                    </p>
                  </div>
                ) : null;
              })()}
            </div>

            {/* ── Question list ── */}
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
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-semibold text-slate-700">No questions match this filter</p>
                <p className="text-sm text-slate-500 mt-1">Try changing the topic, type, or difficulty.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📚</p>
            <p className="font-semibold text-slate-700">No chapters available yet</p>
            <p className="text-sm text-slate-500 mt-1">Class 9 {session.subject} content is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
