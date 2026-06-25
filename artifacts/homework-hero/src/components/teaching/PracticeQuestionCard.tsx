import { useState } from "react";

interface Props {
  question:    string;
  answer:      string;
  borderColor: string;
}

export default function PracticeQuestionCard({ question, answer, borderColor }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-3">
      <p className="text-xs text-emerald-700 italic">
        Now you try. Read the question, attempt it on paper, then reveal the solution.
      </p>
      <div className="rounded-xl border p-3 bg-white" style={{ borderColor }}>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question}</p>
      </div>

      {!revealed && (
        <p className="text-xs text-slate-400 text-center italic">Give it a genuine attempt first.</p>
      )}

      {revealed ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Solution</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{answer}</p>
          <button
            onClick={() => setRevealed(false)}
            className="text-xs text-emerald-600 hover:underline mt-1"
          >
            Hide ↑
          </button>
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 rounded-xl border text-xs font-bold transition-all hover:brightness-95"
          style={{ borderColor, color: borderColor }}
        >
          Reveal Solution ↓
        </button>
      )}
    </div>
  );
}
