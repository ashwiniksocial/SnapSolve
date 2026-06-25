interface Props {
  visualThinking: string;
}

export default function VisualCard({ visualThinking }: Props) {
  return (
    <div>
      <p className="text-xs text-orange-700 mb-3 italic">
        Close your eyes and picture this. Visualising the problem makes it much easier to solve.
      </p>
      <div className="bg-white border border-orange-200 rounded-xl px-4 py-3.5">
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-[12px]">
          {visualThinking}
        </p>
      </div>
    </div>
  );
}
