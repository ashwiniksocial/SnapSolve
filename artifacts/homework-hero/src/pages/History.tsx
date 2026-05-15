import { Link, useLocation }     from "wouter";
import { SUBJECTS }               from "@/data/subjects";
import { useScanHistory, relativeTime } from "@/hooks/useScanHistory";
import { useSession }              from "@/hooks/useSession";

export default function History() {
  const { history, removeRecord, clearHistory } = useScanHistory();
  const { update }  = useSession();
  const [, navigate] = useLocation();

  const revisit = (record: typeof history[number]) => {
    update({ subject: record.subject, question: record.questionText, practiceTopic: record.topic });
    navigate("/solution");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/scan">
              <button className="text-slate-500 hover:text-slate-700 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Scan History</h1>
          </div>
          <p className="text-sm text-slate-500">Your recent homework scans · last {history.length} records</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-3">

        {history.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📷</p>
            <p className="font-semibold text-slate-700 text-lg">No scans yet</p>
            <p className="text-sm text-slate-500 mt-2">Scan or type a question to get started.</p>
            <Link href="/scan">
              <button className="mt-5 px-6 py-3 rounded-2xl font-semibold text-sm text-white bg-indigo-600 active:scale-95 transition-all">
                Start Scanning
              </button>
            </Link>
          </div>
        ) : (
          <>
            {history.map((record) => {
              const cfg = SUBJECTS[record.subject];
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className="h-1" style={{ backgroundColor: cfg.color }} />

                  <div className="p-4">
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      {record.thumbnailUrl ? (
                        <img
                          src={record.thumbnailUrl}
                          alt="scan thumbnail"
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: cfg.light }}
                        >
                          {cfg.icon}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: cfg.light, color: cfg.color }}
                          >
                            {record.subject}
                          </span>
                          <span className="text-xs text-slate-400">{relativeTime(record.timestamp)}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">{record.topic}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(record.timestamp).toLocaleString(undefined, {
                            month: "short", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeRecord(record.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Detected question */}
                    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Question</p>
                      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                        {record.questionText}
                      </p>
                    </div>

                    {/* OCR detected text preview */}
                    {record.detectedText && record.detectedText !== record.questionText && (
                      <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-0.5">OCR Raw Text</p>
                        <p className="text-xs text-amber-800 leading-relaxed line-clamp-2">{record.detectedText}</p>
                      </div>
                    )}

                    {/* Action */}
                    <button
                      onClick={() => revisit(record)}
                      className="mt-3 w-full py-3 rounded-2xl text-sm font-semibold text-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                      style={{ backgroundColor: cfg.color }}
                    >
                      ✦ Revisit Workspace
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clear all */}
            <button
              onClick={() => { if (window.confirm("Clear all scan history?")) clearHistory(); }}
              className="w-full py-3 rounded-2xl text-sm font-semibold text-red-500 border border-red-200 bg-white hover:bg-red-50 active:scale-95 transition-all"
            >
              Clear All History
            </button>
          </>
        )}

      </div>
    </div>
  );
}
