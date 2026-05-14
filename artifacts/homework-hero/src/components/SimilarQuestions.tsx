import { useState } from "react";
import type { SimilarQuestion } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";
import { useProgress } from "@/hooks/useProgress";

interface Props {
  questions: SimilarQuestion[];
  topic: string;
  subject: Subject;
}

const diffBadge: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

export default function SimilarQuestions({ questions, topic, subject }: Props) {
  const cfg = SUBJECTS[subject];
  const { recordSolve } = useProgress();

  const [expanded, setExpanded]   = useState<string | null>(null);
  const [revealed, setRevealed]   = useState<Set<string>>(new Set());
  const [correct,  setCorrect]    = useState<Set<string>>(new Set());
  const [incorrect, setIncorrect] = useState<Set<string>>(new Set());

  const solved = (id: string) => correct.has(id) || incorrect.has(id);

  const handleMark = (id: string, isCorrect: boolean) => {
    if (solved(id)) return;
    recordSolve(subject, topic, isCorrect);
    if (isCorrect) setCorrect((s) => new Set(s).add(id));
    else           setIncorrect((s) => new Set(s).add(id));
  };

  const solvedCount = correct.size + incorrect.size;
  const accuracy    = solvedCount > 0 ? Math.round((correct.size / solvedCount) * 100) : null;

  return (
    <div className="space-y-4">

      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Similar Practice Problems
          </p>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">{topic}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: cfg.color }}>
            {solvedCount}/{questions.length}
          </p>
          {accuracy !== null && (
            <p className="text-xs text-slate-500">{accuracy}% accuracy</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(solvedCount / questions.length) * 100}%`, backgroundColor: cfg.color }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isExpanded  = expanded === q.id;
          const isRevealed  = revealed.has(q.id);
          const isCorrect   = correct.has(q.id);
          const isIncorrect = incorrect.has(q.id);
          const isDone      = solved(q.id);

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${
                isCorrect   ? "border-emerald-300" :
                isIncorrect ? "border-red-300"     : "border-slate-200"
              }`}
            >
              {/* Question row */}
              <button
                className="w-full text-left p-4"
                onClick={() => setExpanded(isExpanded ? null : q.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all ${
                      isCorrect   ? "bg-emerald-500 text-white" :
                      isIncorrect ? "bg-red-400 text-white"     : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCorrect ? "✓" : isIncorrect ? "✗" : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${diffBadge[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.question}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 space-y-3 pt-3">

                  {/* Hint */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-700 mb-1">💡 Hint</p>
                    <p className="text-xs text-amber-800 leading-relaxed">{q.hint}</p>
                  </div>

                  {/* Reveal answer */}
                  {!isRevealed ? (
                    <button
                      onClick={() => setRevealed((s) => new Set(s).add(q.id))}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      Show Answer
                    </button>
                  ) : (
                    <div
                      className="rounded-xl border p-3 text-sm font-semibold leading-relaxed"
                      style={{ backgroundColor: cfg.light, borderColor: cfg.border, color: cfg.color }}
                    >
                      {q.answer}
                    </div>
                  )}

                  {/* Mark correct / incorrect */}
                  {!isDone ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleMark(q.id, true)}
                        className="py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 active:scale-95 transition-all hover:bg-emerald-100"
                      >
                        ✓ Got it right
                      </button>
                      <button
                        onClick={() => handleMark(q.id, false)}
                        className="py-2.5 rounded-xl text-sm font-semibold text-red-600 bg-red-50 border border-red-200 active:scale-95 transition-all hover:bg-red-100"
                      >
                        ✗ Got it wrong
                      </button>
                    </div>
                  ) : (
                    <p className={`text-center text-sm font-semibold py-2 rounded-xl ${
                      isCorrect ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                    }`}>
                      {isCorrect ? "✓ Marked correct · +10 XP" : "✗ Marked for revision"}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {solvedCount === questions.length && (
        <div
          className="rounded-2xl border p-4 text-center"
          style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
        >
          <p className="text-2xl mb-1">🎯</p>
          <p className="font-bold text-slate-800">Set Complete!</p>
          <p className="text-sm mt-1" style={{ color: cfg.color }}>
            Accuracy: {accuracy}% · {correct.size} correct, {incorrect.size} to review
          </p>
        </div>
      )}
    </div>
  );
}
