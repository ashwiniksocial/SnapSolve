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
import { getQuestionById, type Difficulty } from "@/services/questionService";
import type { Subject } from "@/data/subjects";
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
  // null = not yet rated, false = got it, true = needs review
  const [needsReview, setNeedsReview] = useState<boolean | null>(null);
  // practiceMode result: null = not yet rated, true = got it, false = needs review
  const [practiceResult, setPracticeResult] = useState<boolean | null>(null);

  // Practice mode: ?practiceMode=1 forces full AI pipeline (skipBank + requireLesson).
  const practiceMode = new URLSearchParams(window.location.search).get("practiceMode") === "1";

  const runSolver = useCallback(async () => {
    setPageState("loading");
    setSolution(null);
    setSolveError(null);
    setShowSimilar(false);
    setNeedsReview(null);

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
      // ── Fast path: frozen bank question — 0 AI calls, near-instant ──────────
      // When a student opens a Practice question we already have the question ID.
      // Look it up directly in the curriculum bank (preloaded by the Practice page)
      // and build an AIResponse from the frozen Gold Standard data.
      // This replaces the 50–60 s AI pipeline that practiceMode=1 previously forced.
      if (practiceMode && session.practiceQuestionId) {
        const bankQ = getQuestionById(session.practiceQuestionId);
        if (bankQ) {
          const bankResult: AIResponse = {
            id:               bankQ.id,
            subject:          bankQ.subject as Subject,
            topic:            bankQ.topicName,
            difficulty:       bankQ.difficulty,
            detectedQuestion: bankQ.question,
            keyConcepts:      bankQ.keyConcepts,
            steps:            bankQ.steps,
            finalAnswer:      bankQ.answer,
            similarQuestions: [],
            source:           "bank",
          };
          setSolution(bankResult);
          recordSolve(session.subject, session.practiceTopic ?? bankQ.topicName, true, bankQ.id);
          update({ practiceTopic: bankQ.topicName });
          if (session.practiceChapterId) {
            logAttempt(
              bankQ.id,
              bankQ.question,
              true,
              bankQ.difficulty,
              session.practiceChapterId,
              session.practiceChapterName ?? "",
              bankQ.subject as Subject,
              session.practiceClassNum ?? 9,
            );
          }
          setPageState("done");
          return;
        }
      }

      // ── AI path: new or unmatched question — full pipeline ───────────────────
      const result = await solve(
        session.subject,
        session.question,
        session.ocrConfidence ?? 1,
        (msg, idx) => { setPhaseMsg(msg); setPhaseIdx(idx); },
        practiceMode ? { requireLesson: true } : undefined,
        (msg, pct) => { setProgressMsg(msg); setProgressPct(pct); }
      );

      setSolution(result);
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

      if (
        practiceMode &&
        session.practiceQuestionId &&
        session.practiceChapterId
      ) {
        logAttempt(
          session.practiceQuestionId,
          session.question,
          true,
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
  }, [session.subject, session.question, session.ocrConfidence, practiceMode, session.practiceQuestionId]);

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

            {/* ── Needs Review confirmation — no action panel ───────────── */}
            {needsReview === true && (
              <p className="text-center text-xs text-slate-500 fade-up py-1">
                Marked for review — we'll help you practise this again.
              </p>
            )}

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
