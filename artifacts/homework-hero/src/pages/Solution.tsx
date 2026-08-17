import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptLog } from "@/hooks/useAttemptLog";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { solve, type AIResponse, type SolveIntent } from "@/services/aiSolver";
import { callDevLesson, toAIResponse } from "@/services/ai/openaiSolver";
import { useCelebration } from "@/hooks/useCelebration";
import type { Difficulty } from "@/services/questionService";
import SolutionCard from "@/components/SolutionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimilarQuestions from "@/components/SimilarQuestions";
import StarBurst from "@/components/StarBurst";
import SocraticTutor from "@/components/socratic/SocraticTutor";
import { PracticeWithHints } from "@/components/teaching/TeachingLayout";
import { getMasteryEntry } from "@/services/studentModel";

type PageState = "loading" | "done" | "error";
type LearningAction = "visual" | "revision" | "practice";

function nonEmpty(values: string[] | undefined): string[] {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

export default function Solution() {
  const { session, update } = useSession();
  const { completeToday, isTodayCompleted } = useStreak();
  const { recordSolve } = useProgress();
  const { logAttempt } = useAttemptLog();
  const { recordAttempt } = useRevisionPlanner();
  const celebrate = useCelebration();
  const cfg = SUBJECTS[session.subject];

  const [pageState, setPageState]   = useState<PageState>("loading");
  const [solution, setSolution]     = useState<AIResponse | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [phaseMsg, setPhaseMsg]     = useState("");
  const [phaseIdx, setPhaseIdx]     = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [marked,      setMarked]      = useState(false);
  const [burst,       setBurst]       = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [showTutor,   setShowTutor]   = useState(false);
  const [learningAction, setLearningAction] = useState<LearningAction | null>(null);
  // null = not yet rated, false = got it, true = needs review (reveals 4 help actions)
  const [needsReview, setNeedsReview] = useState<boolean | null>(null);
  const [revisionChoice, setRevisionChoice] = useState<number | null>(null);
  const [simplifiedView, setSimplifiedView] = useState(false);
  // practiceMode result: null = not yet rated, true = got it, false = needs review
  const [practiceResult, setPracticeResult] = useState<boolean | null>(null);

  // Practice mode: ?practiceMode=1 forces full AI pipeline (skipBank + requireLesson).
  const practiceMode = new URLSearchParams(window.location.search).get("practiceMode") === "1";

  const runSolver = useCallback(async (intent?: SolveIntent) => {
    setPageState("loading");
    setSolution(null);
    setSolveError(null);
    setShowSimilar(false);
    setLearningAction(null);
    setRevisionChoice(null);
    setNeedsReview(null);
    setSimplifiedView(intent === "simplify");

    // ── Dev audit mode: ?audit=1 bypasses session/OpenAI, loads fixture direct ──
    const auditMode = new URLSearchParams(window.location.search).get("audit") === "1";
    if (auditMode) {
      const raw = await callDevLesson();
      const mapped = toAIResponse(raw, "Mathematics", "Proof that √2 is Irrational");
      setSolution(mapped);
      setPageState("done");
      return;
    }

    try {
      const result = await solve(
        session.subject,
        session.question,
        session.ocrConfidence ?? 1,
        (msg, idx) => { setPhaseMsg(msg); setPhaseIdx(idx); },
        intent === "simplify"
          ? { skipBank: true, requireLesson: true, intent }
          : practiceMode
            ? { skipBank: true, requireLesson: true }
            : undefined,
        (msg, pct) => { setProgressMsg(msg); setProgressPct(pct); }
      );

      setSolution(result);
      // Use the predefined topic name from the question bank (session.practiceTopic) so
      // useChapterStats can match it by key.  Fall back to the AI-inferred name for
      // Scan / typed-question flows where no bank topic name is available.
      // Also pass the question ID so the `attempted[]` array is populated and chapter
      // completion percentages compute correctly.
      const topicKey = (practiceMode && session.practiceTopic)
        ? session.practiceTopic
        : result.topic;
      recordSolve(
        session.subject,
        topicKey,
        true,
        practiceMode ? session.practiceQuestionId : undefined,
      );
      update({ practiceTopic: result.topic });

      // Log to attempt detail log when we have question context from practice mode
      if (
        practiceMode &&
        session.practiceQuestionId &&
        session.practiceChapterId
      ) {
        logAttempt(
          session.practiceQuestionId,
          session.question,
          true, // default correct on view; student can override below
          session.practiceQuestionDiff ?? "Medium",
          session.practiceChapterId,
          session.practiceChapterName ?? "",
          session.subject,
          session.practiceClassNum ?? 9,
        );
      }

      setPageState("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[PRACTICE:PIPELINE] ✗ Pipeline failed — "${msg}"`);
      setSolveError(msg);
      setPageState("error");
    }
  }, [session.subject, session.question, session.ocrConfidence, practiceMode]);

  useEffect(() => { runSolver(); }, []);

  const handleMark = () => {
    completeToday();
    setMarked(true);
    celebrate();
    setBurst(true);
    setTimeout(() => setBurst(false), 2500);
  };

  function selectLearningAction(action: LearningAction) {
    setRevisionChoice(null);
    setLearningAction((current) => current === action ? null : action);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StarBurst active={burst} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {practiceMode && session.practiceChapterId && (
              <Link href="/practice">
                <button className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all">
                  ← Chapter
                </button>
              </Link>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900">Solution</h1>
              <p className="text-sm mt-0.5 truncate" style={{ color: cfg.color }}>
                {cfg.icon} {session.subject}
                {solution && <> · {solution.topic}</>}
              </p>
            </div>
          </div>
          {pageState === "done" && (
            <button
               onClick={() => void runSolver()}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all"
            >
              ↻ Re-solve
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">

        {/* Loading state */}
        {pageState === "loading" && (
          <LoadingSpinner
            subject={session.subject}
            currentPhase={phaseMsg}
            phaseIndex={phaseIdx}
            progressMsg={progressMsg}
            progressPct={progressPct}
          />
        )}

        {/* Error state */}
        {pageState === "error" && (
          <div className="fade-up space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-3">
              <p className="text-3xl">⚠️</p>
              <p className="font-bold text-red-700 text-base">Couldn't generate a solution</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Something went wrong on our end. Please try again — if the problem continues, try a different question.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                 onClick={() => void runSolver()}
                className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all"
              >
                ↻ Retry
              </button>
              <Link href="/practice">
                <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  ← Practice
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Solution content */}
        {pageState === "done" && solution && (
          <div className="space-y-5 fade-up">

            <SolutionCard
              key={solution.id}
              solution={solution}
              initialLevel={simplifiedView ? "basic" : undefined}
            />

            {/* ── Socratic Tutor Panel ───────────────────────────────────── */}
            {showTutor && solution && (
              <SocraticTutor
                topic={solution.topic}
                subject={session.subject}
                initialMastery={getMasteryEntry(solution.topic, session.subject)?.masteryScore ?? 40}
                onClose={() => setShowTutor(false)}
              />
            )}

            {/* ── Practice mode self-assessment ──────────────────────────── */}
            {practiceMode && session.practiceQuestionId && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
                  How did you do?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setNeedsReview(false);
                      if (practiceResult !== true) {
                        setPracticeResult(true);
                        logAttempt(
                          session.practiceQuestionId!,
                          session.question,
                          true,
                          session.practiceQuestionDiff ?? "Medium",
                          session.practiceChapterId ?? "",
                          session.practiceChapterName ?? "",
                          session.subject,
                          session.practiceClassNum ?? 9,
                        );
                        recordAttempt(
                          session.practiceQuestionId!,
                          session.question,
                          session.subject,
                          session.practiceTopic ?? "",
                          session.practiceChapterName ?? "",
                          (session.practiceQuestionDiff ?? "Medium") as Difficulty,
                          true,
                        );
                      }
                    }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 ${
                      practiceResult === true
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    ✓ Got it
                  </button>
                  <button
                    onClick={() => {
                      setNeedsReview(true);
                      if (practiceResult !== false) {
                        setPracticeResult(false);
                        logAttempt(
                          session.practiceQuestionId!,
                          session.question,
                          false,
                          session.practiceQuestionDiff ?? "Medium",
                          session.practiceChapterId ?? "",
                          session.practiceChapterName ?? "",
                          session.subject,
                          session.practiceClassNum ?? 9,
                        );
                        recordAttempt(
                          session.practiceQuestionId!,
                          session.question,
                          session.subject,
                          session.practiceTopic ?? "",
                          session.practiceChapterName ?? "",
                          (session.practiceQuestionDiff ?? "Medium") as Difficulty,
                          false,
                        );
                        recordSolve(session.subject, session.practiceTopic, false);
                      }
                    }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 ${
                      practiceResult === false
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                    }`}
                  >
                    ✗ Needs Review
                  </button>
                </div>
                {practiceResult !== null && (
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    {practiceResult
                      ? "Recorded as correct — great work!"
                      : "Marked for review — keep practising!"}
                  </p>
                )}
              </div>
            )}

            {/* ── Got it / Needs Review — shown for non-practiceMode flows ── */}
            {!practiceMode && needsReview === null && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-3 text-center">How did you find this?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNeedsReview(false)}
                    className="py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all"
                  >
                    ✓ Got it
                  </button>
                  <button
                    onClick={() => setNeedsReview(true)}
                    className="py-2.5 rounded-xl text-sm font-semibold border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
                  >
                    ✗ Needs Review
                  </button>
                </div>
              </div>
            )}

            {/* ── Four help actions — revealed only after Needs Review ─────── */}
            {needsReview === true && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm fade-up">
                <p className="text-xs font-bold text-slate-500 mb-3">Still confused?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => void runSolver("simplify")}
                    className="w-full min-h-14 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-left text-xs font-bold text-indigo-800 hover:bg-indigo-100 active:scale-95 transition-all"
                  >
                    <span className="block text-base mb-0.5">🧩</span>
                    Explain it more simply
                  </button>
                  <button
                    onClick={() => selectLearningAction("visual")}
                    className={`w-full min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-xs font-bold active:scale-95 transition-all ${
                      learningAction === "visual"
                        ? "border-sky-500 bg-sky-500 text-white"
                        : "border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100"
                    }`}
                  >
                    <span className="block text-base mb-0.5">👀</span>
                    Show me visually
                  </button>
                  <button
                    onClick={() => selectLearningAction("revision")}
                    className={`w-full min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-xs font-bold active:scale-95 transition-all ${
                      learningAction === "revision"
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    <span className="block text-base mb-0.5">⚡</span>
                    Quick revision
                  </button>
                  <button
                    onClick={() => selectLearningAction("practice")}
                    className={`w-full min-h-14 rounded-2xl border-2 px-3 py-2 text-left text-xs font-bold active:scale-95 transition-all ${
                      learningAction === "practice"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    <span className="block text-base mb-0.5">✏️</span>
                    Practise
                  </button>
                </div>
              </div>
            )}

            {/* ── Action-specific presentation panels — no AI calls ───────── */}
            {learningAction === "visual" && (
              <div className="fade-up bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">Picture this</p>
                {(
                  solution.lesson?.intuition.visual ||
                  solution.visualThinking ||
                  ""
                ).trim() ? (
                  <p className="text-sm text-sky-950 leading-relaxed whitespace-pre-wrap">
                    {solution.lesson?.intuition.visual || solution.visualThinking}
                  </p>
                ) : (
                  <p className="text-sm text-sky-800 leading-relaxed">
                    This lesson does not include a visual explanation yet. Try “Explain it more simply” for another explanation.
                  </p>
                )}
              </div>
            )}

            {learningAction === "revision" && (() => {
              const lesson = solution.lesson;
              const memory = nonEmpty(lesson?.rememberThese ?? solution.memoryShortcut);
              const retrieval = nonEmpty(lesson?.retrievalPractice);
              const confidenceCheck = lesson?.confidenceCheck ?? solution.confidenceCheck;
              const options = nonEmpty(confidenceCheck?.options);
              const hasCheck = Boolean(confidenceCheck?.question?.trim() && options.length > 0);
              const hasRevision = memory.length > 0 || retrieval.length > 0 || hasCheck ||
                Boolean(lesson?.confidenceBuilder?.trim());

              return (
                <div className="fade-up bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Quick revision</p>
                    {lesson?.confidenceBuilder?.trim() && (
                      <p className="text-sm text-amber-950 leading-relaxed mt-1">
                        {lesson.confidenceBuilder.trim()}
                      </p>
                    )}
                  </div>

                  {memory.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1.5">Remember these</p>
                      <ul className="space-y-1.5">
                        {memory.map((item, index) => (
                          <li key={index} className="text-sm text-amber-950 leading-relaxed flex gap-2">
                            <span className="text-amber-500 shrink-0">✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {retrieval.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1.5">Try to recall</p>
                      <ol className="space-y-1.5 list-decimal list-inside">
                        {retrieval.map((item, index) => (
                          <li key={index} className="text-sm text-amber-950 leading-relaxed">{item}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {hasCheck && confidenceCheck && (
                    <div className="bg-white/70 border border-amber-200 rounded-xl p-3 space-y-2">
                      <p className="text-xs font-bold text-amber-900">{confidenceCheck.question}</p>
                      <div className="grid gap-1.5">
                        {options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setRevisionChoice(index)}
                            className={`text-left text-xs rounded-lg border px-3 py-2 transition-colors ${
                              revisionChoice === index
                                ? index === confidenceCheck.correctIndex
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                  : "border-red-300 bg-red-50 text-red-800"
                                : "border-amber-200 bg-white text-slate-700 hover:bg-amber-50"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {revisionChoice !== null && (
                        <p className="text-xs text-amber-900 leading-relaxed">
                          {revisionChoice === confidenceCheck.correctIndex
                            ? "Correct — nice recall!"
                            : confidenceCheck.explanation || "Review the lesson once more, then try again."}
                        </p>
                      )}
                    </div>
                  )}

                  {!hasRevision && (
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Revision points are not available for this lesson yet.
                    </p>
                  )}
                </div>
              );
            })()}

            {learningAction === "practice" && (() => {
              const pq = solution.lesson?.practiceQuestion;
              const hasPractice = Boolean(pq?.question?.trim());
              return (
                <div className="fade-up bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Your turn</p>
                  {hasPractice ? (
                    <PracticeWithHints
                      question={pq!.question}
                      hints={pq!.hints ?? []}
                      solution={pq!.solution}
                      borderColor={cfg.color}
                    />
                  ) : (
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      No practice question is available for this lesson yet.
                      {solution.similarQuestions.length > 0 && (
                        <> Similar questions are listed below.</>
                      )}
                    </p>
                  )}
                </div>
              );
            })()}

            {/* ── Utility controls ─────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleMark}
                disabled={isTodayCompleted || marked}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  isTodayCompleted || marked
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "text-white shadow-sm"
                }`}
                style={!(isTodayCompleted || marked) ? { backgroundColor: cfg.color } : {}}
              >
                {isTodayCompleted || marked ? "✓ Marked Done" : "✓ Mark Solved"}
              </button>
              <Link href={practiceMode && session.practiceChapterId ? "/practice" : "/scan"}>
                <button className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  {practiceMode && session.practiceChapterId ? "← Questions" : "← New Question"}
                </button>
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
