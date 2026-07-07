import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useAttemptLog } from "@/hooks/useAttemptLog";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { solve, type AIResponse } from "@/services/aiSolver";
import { callDevLesson, toAIResponse } from "@/services/ai/openaiSolver";
import { useCelebration } from "@/hooks/useCelebration";
import type { Difficulty } from "@/services/questionService";
import SolutionCard from "@/components/SolutionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimilarQuestions from "@/components/SimilarQuestions";
import StarBurst from "@/components/StarBurst";
import SocraticTutor from "@/components/socratic/SocraticTutor";
import { getMasteryEntry } from "@/services/studentModel";

type PageState = "loading" | "done" | "error";

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
  // practiceMode result: null = not yet rated, true = got it, false = needs review
  const [practiceResult, setPracticeResult] = useState<boolean | null>(null);

  // Practice mode: ?practiceMode=1 forces full AI pipeline (skipBank + requireLesson).
  const practiceMode = new URLSearchParams(window.location.search).get("practiceMode") === "1";

  const runSolver = useCallback(async () => {
    setPageState("loading");
    setSolution(null);
    setSolveError(null);
    setShowSimilar(false);

    // ── Dev audit mode: ?audit=1 bypasses session/OpenAI, loads fixture direct ──
    const auditMode = new URLSearchParams(window.location.search).get("audit") === "1";
    if (auditMode) {
      console.log("[AUDIT-PAGE] audit=1 detected → calling GET /api/devLesson");
      const raw = await callDevLesson();
      const mapped = toAIResponse(raw, "Mathematics", "Proof that √2 is Irrational");
      console.log(`[AUDIT-PAGE] fixture mapped: topic="${mapped.topic}" lesson=${!!mapped.lesson} steps=${mapped.lesson?.guidedReasoning.length}`);
      setSolution(mapped);
      setPageState("done");
      return;
    }

    if (practiceMode) {
      console.log(`[PRACTICE:PIPELINE] practiceMode=1 detected — calling solve() with skipBank=true requireLesson=true`);
      console.log(`[PRACTICE:PIPELINE] subject="${session.subject}" q="${session.question.slice(0, 80)}"`);
    }

    try {
      const result = await solve(
        session.subject,
        session.question,
        session.ocrConfidence ?? 1,
        (msg, idx) => { setPhaseMsg(msg); setPhaseIdx(idx); },
        practiceMode ? { skipBank: true, requireLesson: true } : undefined,
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
  }, [session.subject, session.question, practiceMode]);

  useEffect(() => { runSolver(); }, []);

  const handleMark = () => {
    completeToday();
    setMarked(true);
    celebrate();
    setBurst(true);
    setTimeout(() => setBurst(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StarBurst active={burst} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Solution</h1>
            <p className="text-sm mt-0.5" style={{ color: cfg.color }}>
              {cfg.icon} {session.subject}
              {solution && <> · {solution.topic}</>}
            </p>
          </div>
          {pageState === "done" && (
            <button
              onClick={runSolver}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all"
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
              <p className="font-bold text-red-700 text-base">Teaching lesson generation failed.</p>
              <p className="text-xs text-red-600 leading-relaxed font-mono break-all">
                {solveError ?? "Unknown error"}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                The AI teaching pipeline could not generate a lesson for this question.
                {practiceMode && " No fallback is shown — this failure is intentional and visible."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={runSolver}
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

            <SolutionCard solution={solution} />

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

            {/* ── Action buttons: 2 × 2 grid ─────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowTutor((v) => !v)}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 active:scale-95 ${
                  showTutor
                    ? "text-white border-transparent bg-gradient-to-r from-indigo-600 to-violet-600"
                    : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
              >
                🎓 {showTutor ? "Close Tutor" : "Ask AI"}
              </button>

              <button
                onClick={() => setShowSimilar((v) => !v)}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 active:scale-95 ${
                  showSimilar
                    ? "text-white border-transparent"
                    : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
                style={showSimilar ? { backgroundColor: cfg.color } : {}}
              >
                ✎ {showSimilar ? "Hide Similar" : "Practice Similar"}
              </button>

              <button
                onClick={handleMark}
                disabled={isTodayCompleted || marked}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  isTodayCompleted || marked
                    ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
                    : "text-white shadow-sm"
                }`}
                style={!(isTodayCompleted || marked) ? { backgroundColor: cfg.color } : {}}
              >
                {isTodayCompleted || marked ? "✓ Marked Done" : "✓ Mark Solved"}
              </button>

              <Link href="/scan">
                <button className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  ← New Question
                </button>
              </Link>
            </div>

            {/* Similar questions panel */}
            {showSimilar && solution.similarQuestions.length > 0 && (
              <div className="slide-in">
                <SimilarQuestions
                  questions={solution.similarQuestions}
                  topic={solution.topic}
                  subject={session.subject}
                />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
