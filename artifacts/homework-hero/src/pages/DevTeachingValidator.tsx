/**
 * DevTeachingValidator — internal developer tool.
 *
 * Validates that the teaching pipeline produces distinctly different lessons
 * across Explanation Styles (Detailed / Standard / Compact).
 *
 * RULES:
 *  - Never imported by any student-facing page.
 *  - Never modifies the AI pipeline, prompts, or LessonRenderer.
 *  - Feedback stored in localStorage only (studyai-dev-feedback-v1).
 */

import { useState, useRef, useCallback } from "react";
import type { Subject }         from "@/data/subjects";
import type { AIResponse }      from "@/data/solutionBank";
import type { ReadingLevel }    from "@/services/explanation/readingModeEngine";
import { toAIResponse }         from "@/services/ai/openaiSolver";
import TeachingLayout           from "@/components/teaching/TeachingLayout";
import { saveFeedback }         from "@/services/devFeedback";
import type { DevFeedbackEntry, FeedbackVerdict } from "@/services/devFeedback";

// ─── Static curriculum map (validator-only, not runtime) ─────────────────────

type ClassNum = 6 | 7 | 8 | 9;

const CHAPTER_MAP: Record<Subject, Record<ClassNum, string[]>> = {
  Mathematics: {
    6: [
      "Knowing Our Numbers",
      "Whole Numbers",
      "Playing with Numbers",
      "Basic Geometrical Ideas",
      "Understanding Elementary Shapes",
      "Integers",
      "Fractions",
      "Decimals",
      "Data Handling",
      "Mensuration",
      "Algebra",
      "Ratio and Proportion",
    ],
    7: [
      "Integers",
      "Fractions and Decimals",
      "Data Handling",
      "Simple Equations",
      "Lines and Angles",
      "Triangle and Its Properties",
      "Congruence of Triangles",
      "Comparing Quantities",
      "Rational Numbers",
      "Practical Geometry",
      "Perimeter and Area",
      "Algebraic Expressions",
      "Exponents and Powers",
      "Symmetry",
      "Visualising Solid Shapes",
    ],
    8: [
      "Rational Numbers",
      "Linear Equations in One Variable",
      "Understanding Quadrilaterals",
      "Data Handling",
      "Squares and Square Roots",
      "Cubes and Cube Roots",
      "Comparing Quantities",
      "Algebraic Expressions and Identities",
      "Mensuration",
      "Exponents and Powers",
      "Direct and Inverse Proportions",
      "Factorisation",
      "Introduction to Graphs",
    ],
    9: [
      "Number Systems",
      "Polynomials",
      "Coordinate Geometry",
      "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry",
      "Lines and Angles",
      "Triangles",
      "Quadrilaterals",
      "Areas of Parallelograms and Triangles",
      "Circles",
      "Heron's Formula",
      "Surface Areas and Volumes",
      "Statistics",
    ],
  },
  Physics: {
    6: ["Motion and Measurement", "Light Shadows and Reflections", "Electricity and Circuits", "Magnets"],
    7: ["Heat", "Light", "Electric Current", "Motion and Time"],
    8: ["Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Light"],
    9: [
      "Motion",
      "Force and Laws of Motion",
      "Gravitation",
      "Work and Energy",
      "Sound",
    ],
  },
  Chemistry: {
    6: ["Sorting Materials", "Changes Around Us", "Water"],
    7: ["Acids, Bases and Salts", "Physical and Chemical Changes", "Fibres to Fabric"],
    8: ["Synthetic Fibres and Plastics", "Coal and Petroleum", "Combustion and Flame", "Pollution of Air and Water"],
    9: [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure",
      "Atoms and Molecules",
      "Structure of the Atom",
    ],
  },
  Biology: { 6: [], 7: [], 8: [], 9: [] },
  Economics: { 6: [], 7: [], 8: [], 9: [] },
  "Computer Science": { 6: [], 7: [], 8: [], 9: [] },
};

const SUBJECTS_LIST: Subject[] = ["Mathematics", "Physics", "Chemistry"];
const CLASSES: ClassNum[]      = [6, 7, 8, 9];

// ─── Explanation Style → ReadingLevel + studentContext fragment ───────────────

type ExplanationStyle = "detailed" | "standard" | "compact";

const STYLE_META: Record<ExplanationStyle, {
  label:    string;
  hint:     string;
  level:    ReadingLevel;
  depth:    string;
  color:    string;
  badge:    string;
}> = {
  detailed: {
    label: "Detailed",
    hint:  "Every step explained — for struggling students",
    level: "basic",
    depth: "BASIC",
    color: "border-emerald-500 bg-emerald-50 text-emerald-700",
    badge: "bg-emerald-500 text-white",
  },
  standard: {
    label: "Standard",
    hint:  "Core content — key steps with reasoning",
    level: "standard",
    depth: "STANDARD",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    badge: "bg-blue-500 text-white",
  },
  compact: {
    label: "Compact",
    hint:  "Exam-focused — concise, no hand-holding",
    level: "advanced",
    depth: "ADVANCED",
    color: "border-violet-500 bg-violet-50 text-violet-700",
    badge: "bg-violet-500 text-white",
  },
};

// ─── Backend call (mirrors openaiSolver.ts callBackend, no caching) ───────────

interface RawLesson {
  topic:              string;
  difficulty:         "Easy" | "Medium" | "Hard";
  keyConcepts:        string[];
  aiConfidence:       number;
  [key: string]:      unknown;
}

async function generateLesson(
  subject:          Subject,
  question:         string,
  explanationStyle: ExplanationStyle,
  onProgress:       (msg: string, pct: number) => void,
): Promise<{ response: AIResponse; generationMs: number }> {
  const requestId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `dev-${Date.now().toString(36)}`;

  const depth = STYLE_META[explanationStyle].depth;
  const studentContext =
    `[DEV VALIDATOR — explanation style test]\n` +
    `Preferred explanation depth: ${depth}\n` +
    `Learning speed: SLOW\n` +
    `This is a developer validation run. Produce a lesson appropriate for ` +
    `the "${depth}" explanation depth. Do not apply personalization.`;

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), 130_000);

  let pollAbort: AbortController | null = new AbortController();
  void (async () => {
    while (!pollAbort!.signal.aborted) {
      await new Promise<void>((r) => setTimeout(r, 1_500));
      if (pollAbort!.signal.aborted) break;
      try {
        const r = await fetch(`/api/solveQuestion/progress/${encodeURIComponent(requestId)}`, {
          signal: pollAbort!.signal,
        });
        if (r.ok) {
          const d = await r.json() as { message?: string; percent?: number };
          if (typeof d.message === "string" && typeof d.percent === "number") {
            onProgress(d.message, d.percent);
          }
        }
      } catch { /* non-fatal */ }
    }
  })();

  const t0 = Date.now();
  let res: Response;
  try {
    res = await fetch("/api/solveQuestion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      signal:  controller.signal,
      body:    JSON.stringify({ subject, question: question.trim(), studentContext, requestId }),
    });
  } finally {
    clearTimeout(timer);
    pollAbort.abort();
  }

  const generationMs = Date.now() - t0;

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const e = await res.json() as { message?: string }; if (e.message) msg = e.message; } catch {}
    throw new Error(msg);
  }

  const raw = (await res.json()) as unknown as Parameters<typeof toAIResponse>[0];
  const response = toAIResponse(raw, subject, question);
  return { response, generationMs };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelectorLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
      {children}
    </p>
  );
}

function MetaBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mt-0.5 ${color}`}>{value}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DevTeachingValidator() {
  const [classNum,  setClassNum]  = useState<ClassNum>(9);
  const [subject,   setSubject]   = useState<Subject>("Mathematics");
  const [chapter,   setChapter]   = useState<string>("");
  const [question,  setQuestion]  = useState<string>("");
  const [style,     setStyle]     = useState<ExplanationStyle>("standard");

  const [status,    setStatus]    = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress,  setProgress]  = useState<{ msg: string; pct: number }>({ msg: "", pct: 0 });
  const [result,    setResult]    = useState<AIResponse | null>(null);
  const [genMs,     setGenMs]     = useState<number>(0);
  const [error,     setError]     = useState<string>("");

  const [verdict,   setVerdict]   = useState<FeedbackVerdict>("pending");
  const [notes,     setNotes]     = useState<string>("");
  const [saved,     setSaved]     = useState<boolean>(false);

  const sessionId = useRef<string>(`dev-${Date.now().toString(36)}`);

  const chapters = CHAPTER_MAP[subject]?.[classNum] ?? [];

  const handleGenerate = useCallback(async () => {
    if (!question.trim() || question.trim().length < 10) {
      setError("Question must be at least 10 characters.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);
    setProgress({ msg: "Starting…", pct: 0 });
    setVerdict("pending");
    setNotes("");
    setSaved(false);
    sessionId.current = `dev-${Date.now().toString(36)}`;

    try {
      const { response, generationMs } = await generateLesson(
        subject,
        question,
        style,
        (msg, pct) => setProgress({ msg, pct }),
      );
      setResult(response);
      setGenMs(generationMs);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [subject, question, style]);

  const handleSaveFeedback = () => {
    if (!result) return;
    const entry: DevFeedbackEntry = {
      id:               sessionId.current,
      timestamp:        Date.now(),
      subject,
      classNum,
      chapterName:      chapter || "(not set)",
      question:         question.trim(),
      explanationStyle: style,
      generationMs:     genMs,
      aiConfidence:     result.lesson?.aiConfidence ?? 0,
      topic:            result.topic ?? "",
      difficulty:       result.difficulty ?? "Medium",
      verdict,
      notes,
    };
    saveFeedback(entry);
    setSaved(true);
  };

  const readingLevel = STYLE_META[style].level;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <span className="text-lg font-black tracking-tight text-indigo-400">⚙</span>
        <div>
          <h1 className="text-sm font-black text-white leading-none">AI Teaching Validator</h1>
          <p className="text-[10px] text-slate-500 mt-0.5">Developer-only · feedback stored locally · no student impact</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-slate-600 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
            DEV
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel: controls ──────────────────────────────────────────── */}
        <aside className="w-72 shrink-0 bg-slate-900 border-r border-slate-800 overflow-y-auto p-4 flex flex-col gap-5">

          {/* Class + Subject */}
          <div className="flex gap-3">
            <div className="flex-1">
              <SelectorLabel>Class</SelectorLabel>
              <select
                value={classNum}
                onChange={(e) => {
                  const c = Number(e.target.value) as ClassNum;
                  setClassNum(c);
                  setChapter("");
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <SelectorLabel>Subject</SelectorLabel>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value as Subject);
                  setChapter("");
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white"
              >
                {SUBJECTS_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapter */}
          <div>
            <SelectorLabel>Chapter (reference only)</SelectorLabel>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white"
            >
              <option value="">— select chapter —</option>
              {chapters.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          {/* Question */}
          <div>
            <SelectorLabel>Question</SelectorLabel>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type a question to validate (min 10 chars)…"
              rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Explanation Style */}
          <div>
            <SelectorLabel>Explanation Style</SelectorLabel>
            <div className="flex flex-col gap-2">
              {(Object.entries(STYLE_META) as [ExplanationStyle, typeof STYLE_META[ExplanationStyle]][]).map(
                ([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key)}
                    className={`flex flex-col text-left px-3 py-2 rounded-lg border-2 transition-all ${
                      style === key
                        ? meta.color
                        : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <span className="text-xs font-bold">{meta.label}</span>
                    <span className="text-[11px] opacity-80">{meta.hint}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={status === "loading" || !question.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
          >
            {status === "loading" ? "Generating…" : "Generate Lesson"}
          </button>

          {/* Progress */}
          {status === "loading" && (
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>{progress.msg}</span>
                <span>{progress.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="bg-red-950 border border-red-800 rounded-lg px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* ── Feedback panel (shown after generation) ───────────────────── */}
          {status === "done" && result && (
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <SelectorLabel>Developer Feedback</SelectorLabel>

              {/* Verdict buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setVerdict("approved")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                    verdict === "approved"
                      ? "bg-emerald-600 border-emerald-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:border-emerald-700"
                  }`}
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => setVerdict("needs_improvement")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                    verdict === "needs_improvement"
                      ? "bg-amber-600 border-amber-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:border-amber-700"
                  }`}
                >
                  ⚠ Needs Work
                </button>
              </div>

              {/* Notes */}
              <div>
                <SelectorLabel>Review Notes</SelectorLabel>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observations, issues, suggestions…"
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleSaveFeedback}
                disabled={verdict === "pending"}
                className="w-full py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors"
              >
                {saved ? "✓ Saved" : "Save Feedback"}
              </button>
            </div>
          )}
        </aside>

        {/* ── Right panel: results ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-50">

          {/* Idle state */}
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="text-5xl mb-4">🔬</div>
              <h2 className="text-xl font-bold text-slate-700">Teaching Validator</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Select a subject, enter a question, choose an explanation style, then generate a lesson
                to validate teaching quality and style differentiation.
              </p>
            </div>
          )}

          {/* Loading state */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-600">{progress.msg || "Generating lesson…"}</p>
              <p className="text-xs text-slate-400 mt-1">This takes 30–90 seconds</p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-sm font-semibold text-red-600">{error}</p>
              <p className="text-xs text-slate-500 mt-2">Check the backend is running and the API key is set.</p>
            </div>
          )}

          {/* Results */}
          {status === "done" && result && (
            <div>
              {/* Metadata bar */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap gap-4 items-center shadow-sm">
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${STYLE_META[style].badge}`}>
                  {STYLE_META[style].label}
                </div>

                <MetaBadge
                  label="Topic"
                  value={result.lesson?.topic ?? result.topic ?? "—"}
                  color="bg-slate-100 text-slate-700"
                />
                <MetaBadge
                  label="Difficulty"
                  value={result.lesson?.difficulty ?? result.difficulty ?? "—"}
                  color={
                    result.difficulty === "Easy"   ? "bg-emerald-100 text-emerald-700" :
                    result.difficulty === "Hard"   ? "bg-red-100 text-red-700"         :
                    "bg-amber-100 text-amber-700"
                  }
                />
                <MetaBadge
                  label="AI Confidence"
                  value={`${Math.round((result.lesson?.aiConfidence ?? result.confidence ?? 0) * 100)}%`}
                  color={
                    (result.lesson?.aiConfidence ?? 0) >= 0.9
                      ? "bg-emerald-100 text-emerald-700"
                      : (result.lesson?.aiConfidence ?? 0) >= 0.7
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }
                />
                <MetaBadge
                  label="Generation Time"
                  value={genMs >= 1000 ? `${(genMs / 1000).toFixed(1)}s` : `${genMs}ms`}
                  color="bg-slate-100 text-slate-700"
                />

                {verdict !== "pending" && (
                  <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${
                    verdict === "approved" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {verdict === "approved" ? "✓ Approved" : "⚠ Needs Work"}
                  </div>
                )}
              </div>

              {/* Key concepts */}
              {(result.lesson?.keyConcepts ?? []).length > 0 && (
                <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 flex flex-wrap gap-2">
                  {(result.lesson?.keyConcepts ?? []).map((kc) => (
                    <span key={kc} className="text-[11px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {kc}
                    </span>
                  ))}
                </div>
              )}

              {/* Lesson body */}
              <div className="p-4">
                <TeachingLayout solution={result} level={readingLevel} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
