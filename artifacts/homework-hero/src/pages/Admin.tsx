import { useState, useRef, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ImportResult {
  imported:  number;
  skipped:   number;
  totalRows: number;
  errors:    { row: number; message: string }[];
}

interface Stats {
  total:        number;
  byChapter:    { chapter: string; subject: string; count: number }[];
  byTopic:      { topic: string; count: number }[];
  byDifficulty: { difficulty: string; count: number }[];
  byBoard:      { board: string; count: number }[];
  bySubject:    { subject: string; count: number }[];
}

interface Question {
  id:           string;
  board:        string;
  classLevel:   number;
  subject:      string;
  chapter:      string;
  topic:        string;
  difficulty:   string;
  questionText: string;
  answer:       string | null;
  source:       string | null;
  createdAt:    string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SAMPLE_CSV = [
  "board,class,subject,chapter,chapter_number,topic,difficulty,question_text,answer,source,tags",
  `CBSE,9,Mathematics,Polynomials,2,Zeros of Polynomial,Easy,"Find the zeros of x²-5x+6","x=2 and x=3",NCERT,"algebra,polynomials"`,
  `CBSE,9,Physics,Motion,8,Uniform Motion,Medium,"A car travels 150 km in 3 hours. Find average speed.","50 km/h",NCERT,"speed,motion"`,
  `ICSE,10,Chemistry,Atoms and Molecules,3,Mole Concept,Hard,"Calculate moles in 44 g of CO₂ (M = 44 g/mol)","1 mole",NCERT,"moles"`,
].join("\n");

const COLUMNS = [
  ["board",          "✓", "CBSE / ICSE / State",                "CBSE"],
  ["class",          "✓", "6 – 12",                             "9"],
  ["subject",        "✓", "Mathematics / Physics / Chemistry",  "Mathematics"],
  ["chapter",        "✓", "Any string",                         "Polynomials"],
  ["chapter_number", "",  "Integer",                            "2"],
  ["topic",          "✓", "Any string",                         "Zeros of Polynomial"],
  ["difficulty",     "✓", "Easy / Medium / Hard",               "Easy"],
  ["question_text",  "✓", "Min 5 characters",                   "Find zeros of x²−5x+6"],
  ["answer",         "",  "Any string",                         "x=2 and x=3"],
  ["source",         "",  "NCERT / Past Paper / Custom",        "NCERT"],
  ["tags",           "",  "Comma-separated",                    "algebra,polynomials"],
] as const;

const DIFF_STYLE: Record<string, string> = {
  Easy:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100   text-amber-700   border-amber-200",
  Hard:   "bg-red-100     text-red-700     border-red-200",
};

const DIFF_BAR: Record<string, string> = {
  Easy: "bg-emerald-400", Medium: "bg-amber-400", Hard: "bg-red-400",
};

type Tab = "import" | "stats" | "questions";

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Admin() {
  // Import state
  const [csvText, setCsvText]       = useState("");
  const [fileName, setFileName]     = useState("");
  const [rowCount, setRowCount]     = useState(0);
  const [importing, setImporting]   = useState(false);
  const [result, setResult]         = useState<ImportResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats state
  const [stats, setStats]             = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError]   = useState("");

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qTotal, setQTotal]       = useState(0);
  const [qPage, setQPage]         = useState(1);
  const [loadingQ, setLoadingQ]   = useState(false);

  const [tab, setTab] = useState<Tab>("import");

  // ── File handling ───────────────────────────────────────────────────────────

  function countDataRows(text: string): number {
    return text.split("\n").slice(1).filter(l => l.trim()).length;
  }

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      setCsvText(text);
      setFileName(file.name);
      setRowCount(countDataRows(text));
      setResult(null);
    };
    reader.readAsText(file);
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  function downloadSampleCSV() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "sample_questions.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Import ──────────────────────────────────────────────────────────────────

  async function handleImport() {
    if (!csvText || importing) return;
    setImporting(true);
    setResult(null);
    try {
      const res  = await fetch("/api/admin/import", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ csv: csvText }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.message as string) ?? `HTTP ${res.status}`);
      setResult(data as unknown as ImportResult);
    } catch (err) {
      setResult({ imported: 0, skipped: 0, totalRows: 0, errors: [{ row: 0, message: String(err) }] });
    } finally {
      setImporting(false);
    }
  }

  // ── Stats ───────────────────────────────────────────────────────────────────

  async function fetchStats() {
    setLoadingStats(true);
    setStatsError("");
    try {
      const res  = await fetch("/api/admin/stats");
      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.message as string) ?? `HTTP ${res.status}`);
      setStats(data as unknown as Stats);
    } catch (err) {
      setStatsError(String(err));
    } finally {
      setLoadingStats(false);
    }
  }

  // ── Questions ───────────────────────────────────────────────────────────────

  async function fetchQuestions(page: number) {
    setLoadingQ(true);
    try {
      const res  = await fetch(`/api/admin/questions?page=${page}&limit=20`);
      const data = await res.json() as { questions: Question[]; total: number };
      if (page === 1) setQuestions(data.questions);
      else setQuestions(prev => [...prev, ...data.questions]);
      setQTotal(data.total);
      setQPage(page);
    } catch { /* silent */ }
    finally { setLoadingQ(false); }
  }

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (tab === "stats"     && !stats)               fetchStats();
    if (tab === "questions" && questions.length === 0) fetchQuestions(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-12">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest text-white bg-slate-700 px-2 py-0.5 rounded-full">
              ADMIN
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Content Management</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Content Import</h1>
          <p className="text-sm text-slate-500 mt-0.5">Upload CSV · Auto-deduplicate · Firestore-ready</p>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-3 bg-white rounded-2xl border border-slate-200 p-1 mb-5 shadow-sm gap-1">
          {(["import", "stats", "questions"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {t === "import" ? "📤 Upload" : t === "stats" ? "📊 Statistics" : "📝 Questions"}
            </button>
          ))}
        </div>

        {/* ══ IMPORT TAB ═══════════════════════════════════════════════════════ */}
        {tab === "import" && (
          <div className="space-y-4">

            {/* Format guide */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowFormat(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>📄</span>
                  <span>CSV Format Reference</span>
                </span>
                <span className="text-slate-400 text-xs">{showFormat ? "▲" : "▼"}</span>
              </button>

              {showFormat && (
                <div className="border-t border-slate-100 p-4 space-y-3">
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="text-[10px] w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          {["Column", "Req", "Values", "Example"].map(h => (
                            <th key={h} className="text-left px-2.5 py-2 font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {COLUMNS.map(([col, req, vals, ex]) => (
                          <tr key={col} className="hover:bg-slate-50">
                            <td className="px-2.5 py-2 font-mono font-semibold text-slate-700 whitespace-nowrap">{col}</td>
                            <td className="px-2.5 py-2 text-center text-emerald-600">{req}</td>
                            <td className="px-2.5 py-2 text-slate-500">{vals}</td>
                            <td className="px-2.5 py-2 text-slate-400 truncate max-w-[90px]">{ex}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={downloadSampleCSV}
                    className="w-full py-2.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
                  >
                    ↓ Download Sample CSV (3 rows)
                  </button>
                </div>
              )}
            </div>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDrop}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all p-10 text-center select-none ${
                isDragOver
                  ? "border-indigo-400 bg-indigo-50"
                  : csvText
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFileInput}
              />
              {csvText ? (
                <>
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm font-bold text-emerald-700">{fileName}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    {rowCount} question{rowCount !== 1 ? "s" : ""} detected
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">Click to replace file</p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">📂</div>
                  <p className="text-sm font-semibold text-slate-700">Drop your CSV file here</p>
                  <p className="text-xs text-slate-400 mt-1">or click to browse · .csv files only</p>
                </>
              )}
            </div>

            {/* Import button */}
            <button
              onClick={handleImport}
              disabled={!csvText || importing}
              className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
                !csvText || importing
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900 shadow-sm"
              }`}
            >
              {importing
                ? "⏳ Importing…"
                : csvText
                ? `Import ${rowCount} Question${rowCount !== 1 ? "s" : ""}`
                : "Select a CSV file first"
              }
            </button>

            {/* Dedup note */}
            {csvText && !result && (
              <p className="text-center text-[10px] text-slate-400">
                🔁 Duplicate questions are detected automatically and skipped
              </p>
            )}

            {/* Result summary */}
            {result && (
              <div className={`rounded-2xl border p-4 shadow-sm ${
                result.errors.length > 0 && result.imported === 0
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-slate-200"
              }`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Import Summary
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">{result.imported}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Added</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-500">{result.skipped}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Skipped (dups)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-500">{result.errors.length}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Errors</p>
                  </div>
                </div>

                {result.imported > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-3 text-xs text-emerald-700 font-medium">
                    ✓ {result.imported} question{result.imported !== 1 ? "s" : ""} added to the database
                  </div>
                )}
                {result.skipped > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 text-xs text-amber-700">
                    {result.skipped} duplicate{result.skipped !== 1 ? "s" : ""} detected and skipped (same question text already exists)
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Row Errors</p>
                    {result.errors.slice(0, 8).map((e, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        <span className="text-[10px] font-bold text-red-500">Row {e.row}</span>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{e.message}</p>
                      </div>
                    ))}
                    {result.errors.length > 8 && (
                      <p className="text-[10px] text-slate-400 text-center">
                        +{result.errors.length - 8} more errors
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ STATISTICS TAB ═══════════════════════════════════════════════════ */}
        {tab === "stats" && (
          <div className="space-y-4">
            {loadingStats && (
              <div className="text-center py-16">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-sm text-slate-400">Loading statistics…</p>
              </div>
            )}

            {statsError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Error</p>
                <p className="text-sm text-red-700">{statsError}</p>
                <button onClick={fetchStats} className="mt-3 text-xs font-semibold text-red-600 underline">
                  Try again
                </button>
              </div>
            )}

            {!loadingStats && !statsError && stats && (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Questions", value: stats.total,               color: "text-indigo-600"  },
                    { label: "Chapters",         value: stats.byChapter.length,   color: "text-violet-600"  },
                    { label: "Topics",           value: stats.byTopic.length,     color: "text-emerald-600" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-200 p-3.5 text-center shadow-sm">
                      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-tight font-medium">{label}</p>
                    </div>
                  ))}
                </div>

                {stats.total === 0 && (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-3">📊</div>
                    <p className="text-sm font-semibold text-slate-600">No questions yet</p>
                    <p className="text-xs text-slate-400 mt-1">Upload a CSV to see statistics</p>
                  </div>
                )}

                {/* Board distribution */}
                {stats.byBoard.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">By Board</p>
                    <div className="space-y-2.5">
                      {stats.byBoard.map(({ board, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={board}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-700">{board}</span>
                              <span className="text-slate-400">{count} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subject distribution */}
                {stats.bySubject.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">By Subject</p>
                    <div className="space-y-2.5">
                      {stats.bySubject.map(({ subject, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        const barColor = subject === "Mathematics" ? "bg-amber-400" : subject === "Physics" ? "bg-sky-400" : "bg-emerald-400";
                        return (
                          <div key={subject}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-700">{subject}</span>
                              <span className="text-slate-400">{count} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Difficulty distribution */}
                {stats.byDifficulty.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">By Difficulty</p>
                    <div className="space-y-2.5">
                      {stats.byDifficulty.map(({ difficulty, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={difficulty}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-700">{difficulty}</span>
                              <span className="text-slate-400">{count} · {pct}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${DIFF_BAR[difficulty] ?? "bg-slate-400"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chapter breakdown */}
                {stats.byChapter.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions per Chapter</p>
                      <span className="text-[10px] text-slate-400">{stats.byChapter.length} chapters</span>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {stats.byChapter.map(({ chapter, subject, count }) => (
                        <div key={chapter + subject} className="flex items-center justify-between px-4 py-2.5">
                          <div className="min-w-0 flex-1 mr-3">
                            <p className="text-xs font-medium text-slate-800 truncate">{chapter}</p>
                            <p className="text-[10px] text-slate-400">{subject}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic breakdown */}
                {stats.byTopic.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions per Topic</p>
                      <span className="text-[10px] text-slate-400">Top 20</span>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                      {stats.byTopic.map(({ topic, count }) => (
                        <div key={topic} className="flex items-center justify-between px-4 py-2.5">
                          <p className="text-xs text-slate-700 truncate flex-1 mr-3">{topic}</p>
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => window.open("/api/admin/export/firestore", "_blank")}
                    className="w-full py-3.5 rounded-2xl border border-orange-200 text-sm font-semibold text-orange-700 hover:bg-orange-50 active:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🔥</span>
                    <span>Export as Firestore JSON</span>
                  </button>
                  <button
                    onClick={fetchStats}
                    className="w-full py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    ↺ Refresh Statistics
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ QUESTIONS TAB ════════════════════════════════════════════════════ */}
        {tab === "questions" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-slate-700">
                {qTotal.toLocaleString()} question{qTotal !== 1 ? "s" : ""} in database
              </p>
              <button
                onClick={() => fetchQuestions(1)}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
              >
                ↺ Refresh
              </button>
            </div>

            {questions.length === 0 && !loadingQ && (
              <div className="text-center py-16">
                <div className="text-3xl mb-3">📝</div>
                <p className="text-sm font-semibold text-slate-600">No questions yet</p>
                <p className="text-xs text-slate-400 mt-1">Upload a CSV on the Upload tab</p>
              </div>
            )}

            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                      {q.board}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                      Class {q.classLevel}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFF_STYLE[q.difficulty] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {q.difficulty}
                    </span>
                    {q.source && (
                      <span className="text-[10px] text-slate-400 font-medium">{q.source}</span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1.5">
                    {q.subject} · {q.chapter} · {q.topic}
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed">{q.questionText}</p>
                  {q.answer && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 leading-relaxed">
                        <span className="font-semibold text-slate-600">Answer:</span> {q.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {questions.length < qTotal && (
              <button
                onClick={() => fetchQuestions(qPage + 1)}
                disabled={loadingQ}
                className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {loadingQ ? "Loading…" : `Load More · ${(qTotal - questions.length).toLocaleString()} remaining`}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
