interface RememberThis {
  examTips:     string[];
  memoryTricks: string[];
  observations: string[];
}

interface Props {
  memoryShortcut?: string[];
  examTip?:        string;
  rememberThis?:   RememberThis;
}

function TripletList({ items, color, bg, border }: { items: string[]; color: string; bg: string; border: string }) {
  return (
    <ul className="space-y-2 mt-1.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 rounded-xl border px-3 py-2 text-sm"
          style={{ backgroundColor: bg, borderColor: border, color }}
        >
          <span className="flex-shrink-0 font-bold text-[11px] mt-0.5">{i + 1}.</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MemoryCard({ memoryShortcut, examTip, rememberThis }: Props) {
  return (
    <div className="space-y-4">
      {rememberThis ? (
        <>
          {rememberThis.examTips.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">📝 Exam Tips</p>
              <TripletList items={rememberThis.examTips} color="#92400e" bg="#fffbeb" border="#fde68a" />
            </div>
          )}
          {rememberThis.memoryTricks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">🧠 Memory Tricks</p>
              <TripletList items={rememberThis.memoryTricks} color="#6b21a8" bg="#fdf4ff" border="#e9d5ff" />
            </div>
          )}
          {rememberThis.observations.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">🔍 Important Observations</p>
              <TripletList items={rememberThis.observations} color="#1e40af" bg="#eff6ff" border="#bfdbfe" />
            </div>
          )}
        </>
      ) : (
        <>
          {(memoryShortcut?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {memoryShortcut!.map((s, i) => (
                <span key={i} className="text-xs font-bold bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl">
                  {s}
                </span>
              ))}
            </div>
          )}
          {examTip && (
            <p className="text-sm text-amber-900 leading-relaxed">{examTip}</p>
          )}
        </>
      )}
    </div>
  );
}
