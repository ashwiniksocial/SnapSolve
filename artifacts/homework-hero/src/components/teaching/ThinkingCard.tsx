interface Props {
  thinkingProcess: string;
  wordToMath?:     string;
}

export default function ThinkingCard({ thinkingProcess, wordToMath }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-purple-700 mb-2 italic">
          Before touching a pen — this is what should be going on in your mind.
        </p>
        <div className="bg-white border border-purple-200 rounded-xl px-4 py-3.5 space-y-2">
          {thinkingProcess.split("\n").filter(Boolean).map((line, i) => (
            <p key={i} className="text-sm text-slate-700 leading-relaxed">{line}</p>
          ))}
        </div>
      </div>

      {wordToMath?.trim() && (
        <div>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
            Translate words into mathematics:
          </p>
          <div className="bg-white border border-indigo-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-[12px]">
              {wordToMath}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
