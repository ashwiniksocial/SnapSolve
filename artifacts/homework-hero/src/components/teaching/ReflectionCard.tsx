import { useState } from "react";
import { updateMastery, finaliseSession } from "@/services/explanation/learningFlow";

interface Props {
  questions: string[];
  topic:     string;
}

export default function ReflectionCard({ questions, topic }: Props) {
  const [current,   setCurrent]   = useState(0);
  const [confirmed, setConfirmed] = useState<boolean[]>(Array(questions.length).fill(false));
  const [done,      setDone]      = useState(false);
  const [mastery,   setMastery]   = useState<number | null>(null);

  const allDone = questions.length > 0 && confirmed.every(Boolean);

  function handleConfirm(i: number) {
    const next = [...confirmed];
    next[i] = true;
    setConfirmed(next);
    const m = updateMastery(topic, true);
    if (next.every(Boolean)) {
      finaliseSession(topic, 4, next.filter(Boolean).length, questions.length);
      setMastery(m.score);
      setDone(true);
    } else {
      setCurrent(i + 1);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-5 text-center space-y-2">
        <p className="text-2xl">🎉</p>
        <p className="text-sm font-bold text-emerald-800">Learning Loop Complete!</p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          You reflected on all {questions.length} conceptual questions.
        </p>
        {mastery !== null && (
          <div className="mt-3 inline-flex items-center gap-2 bg-white border border-emerald-300 rounded-xl px-4 py-2">
            <span className="text-xs font-bold text-emerald-700">Topic Mastery</span>
            <span className="text-sm font-black text-emerald-900">{mastery}%</span>
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic text-center py-2">
        No reflection questions available for this solution.
      </p>
    );
  }

  const q = questions[current];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              confirmed[i] ? "bg-emerald-400" : i === current ? "bg-violet-400" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">
        Question {current + 1} of {questions.length}
      </p>

      <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-4">
        <p className="text-sm font-semibold text-violet-900 leading-relaxed">{q}</p>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Think about your answer. You don't need to write it — just hold the answer in your mind for a few seconds.
        When you're confident you can explain it, press the button below.
      </p>

      <button
        onClick={() => handleConfirm(current)}
        className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors"
      >
        I Can Explain This ✓
      </button>

      {current > 0 && (
        <button
          onClick={() => setCurrent((v) => Math.max(0, v - 1))}
          className="w-full py-2 rounded-xl border border-violet-200 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors"
        >
          ← Review Previous
        </button>
      )}

      {allDone && !done && (
        <button
          onClick={() => {
            finaliseSession(topic, 4, confirmed.filter(Boolean).length, questions.length);
            setDone(true);
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
        >
          Complete Learning Loop 🎉
        </button>
      )}
    </div>
  );
}
