import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { solve, type AIResponse } from "@/services/aiSolver";
import { useCelebration } from "@/hooks/useCelebration";
import SolutionCard from "@/components/SolutionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimilarQuestions from "@/components/SimilarQuestions";
import StarBurst from "@/components/StarBurst";

type PageState = "loading" | "done";

export default function Solution() {
  const { session, update } = useSession();
  const { completeToday, isTodayCompleted } = useStreak();
  const { recordSolve } = useProgress();
  const celebrate = useCelebration();
  const cfg = SUBJECTS[session.subject];

  const [pageState, setPageState] = useState<PageState>("loading");
  const [solution, setSolution]   = useState<AIResponse | null>(null);
  const [phaseMsg, setPhaseMsg]   = useState("");
  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [marked,   setMarked]     = useState(false);
  const [burst,    setBurst]      = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  const runSolver = useCallback(async () => {
    setPageState("loading");
    setSolution(null);
    setShowSimilar(false);

    const result = await solve(
      session.subject,
      session.question,
      undefined,
      (msg, idx) => { setPhaseMsg(msg); setPhaseIdx(idx); }
    );

    setSolution(result);
    update({ practiceTopic: result.topic });
    recordSolve(session.subject, result.topic, true);
    setPageState("done");
  }, [session.subject, session.question]);

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
          />
        )}

        {/* Solution content */}
        {pageState === "done" && solution && (
          <div className="space-y-5 fade-up">

            <SolutionCard solution={solution} />

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSimilar((v) => !v)}
                className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border-2 active:scale-95 ${
                  showSimilar
                    ? "text-white border-transparent"
                    : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
                style={showSimilar ? { backgroundColor: cfg.color } : {}}
              >
                ✎ {showSimilar ? "Hide Similar" : "5 Similar Problems"}
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

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/scan">
                <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  ← New Question
                </button>
              </Link>
              <Link href="/progress">
                <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  View Progress →
                </button>
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
