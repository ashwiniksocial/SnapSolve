interface Props {
  examTip:      string;
  confusionPoint?: string;
}

export default function ExamTipCard({ examTip, confusionPoint }: Props) {
  return (
    <div className="space-y-3">
      {confusionPoint && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
            ⚠️ Where Students Get Confused
          </p>
          <p className="text-sm text-amber-900 leading-relaxed">{confusionPoint}</p>
        </div>
      )}
      <div className="bg-white border border-amber-300 rounded-xl px-4 py-3">
        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">
          💡 Exam Shortcut
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">{examTip}</p>
      </div>
    </div>
  );
}
