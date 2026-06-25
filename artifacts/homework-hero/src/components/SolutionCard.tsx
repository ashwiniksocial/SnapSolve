import { useState } from "react";
import type { AIResponse } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";
import ConfidenceMeter from "@/components/ConfidenceMeter";

interface Props {
  solution: AIResponse;
}

// ─── Reading level ─────────────────────────────────────────────────────────────

type Level = "basic" | "standard" | "advanced";
const LEVEL_KEY = "studyai-reading-level";

function getStoredLevel(): Level {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (v === "basic" || v === "standard" || v === "advanced") return v;
  } catch {}
  return "basic";
}

const LEVEL_CONFIG: Record<Level, { label: string; hint: string; active: string }> = {
  basic:    { label: "Basic",    hint: "Explain everything", active: "bg-emerald-500 text-white border-emerald-500" },
  standard: { label: "Standard", hint: "Key content",        active: "bg-blue-500 text-white border-blue-500"       },
  advanced: { label: "Advanced", hint: "Direct solution",    active: "bg-violet-500 text-white border-violet-500"   },
};

// ─── Badge styles ──────────────────────────────────────────────────────────────

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

const DIFF_DETAIL: Record<string, string> = {
  Easy:   "Very Detailed",
  Medium: "Standard",
  Hard:   "Concise",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SolutionCard({ solution }: Props) {
  const [level, setLevel]           = useState<Level>(getStoredLevel);
  const [showExSolution, setShowEx] = useState(false);
  const [showCheckAnswer, setShowA] = useState(false);
  const [showMore, setShowMore]     = useState(false);

  const cfg  = SUBJECTS[solution.subject as Subject];
  const isAI = solution.source === "openai";

  function changeLevel(l: Level) {
    setLevel(l);
    try { localStorage.setItem(LEVEL_KEY, l); } catch {}
  }

  const hasMore =
    !!solution.deeperExplanation ||
    (solution.additionalExamples?.length ?? 0) > 0 ||
    (solution.commonMistakes?.length ?? 0) > 0;

  return (
    <div className="space-y-5">

      {/* ── Reading level selector ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Reading Level
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["basic", "standard", "advanced"] as Level[]).map((l) => (
            <button
              key={l}
              onClick={() => changeLevel(l)}
              className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                level === l
                  ? LEVEL_CONFIG[l].active
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>{LEVEL_CONFIG[l].label}</div>
              <div className={`text-[9px] font-normal mt-0.5 leading-none ${level === l ? "opacity-80" : "opacity-50"}`}>
                {LEVEL_CONFIG[l].hint}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── AI Generated badge ────────────────────────────────────────────── */}
      {isAI && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-200">
          <span className="text-base">✦</span>
          <div>
            <p className="text-xs font-bold text-indigo-700 leading-none">AI Generated Solution</p>
            <p className="text-[10px] text-indigo-500 mt-0.5 leading-none">Powered by OpenAI · gpt-4o-mini</p>
          </div>
          <span className="ml-auto text-[10px] font-semibold text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
            AI
          </span>
        </div>
      )}

      {/* ── Confidence Meter ──────────────────────────────────────────────── */}
      {solution.confidenceBreakdown && (
        <ConfidenceMeter breakdown={solution.confidenceBreakdown} />
      )}

      {/* ── Topic + difficulty chips ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
        >
          {cfg.icon} {solution.topic}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DIFF_BADGE[solution.difficulty]}`}>
          {solution.difficulty}
          <span className="font-normal opacity-70"> · {DIFF_DETAIL[solution.difficulty]}</span>
        </span>
        {solution.source === "bank" && (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            Question Bank
          </span>
        )}
        {solution.source === "fallback" && (
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            General Guide
          </span>
        )}
      </div>

      {/* ── Detected question ─────────────────────────────────────────────── */}
      {solution.detectedQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Question Detected
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.detectedQuestion}</p>
        </div>
      )}

      {/* ══ What You Need to Know First — Basic only ══════════════════════════ */}
      {level === "basic" && solution.prerequisites && solution.prerequisites.length > 0 && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📋</span>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              What You Need to Know First
            </p>
          </div>
          <ul className="space-y-2">
            {solution.prerequisites.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sky-200 border border-sky-300 flex items-center justify-center text-[9px] font-bold text-sky-700 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ══ Concept Explanation — Basic + Standard ════════════════════════════ */}
      {level !== "advanced" && solution.conceptExplanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💡</span>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Concept</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.conceptExplanation}</p>
        </div>
      )}

      {/* ══ Step-by-Step Reasoning — all levels ══════════════════════════════ */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Step-by-Step Reasoning
        </p>
        <div className="space-y-3">
          {solution.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.color }}
                >
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.explanation}</p>

                  {/* WHY badge — hidden in Advanced mode */}
                  {level !== "advanced" && step.whyThisStep && (
                    <div className="mt-2.5 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                      <span className="text-[10px] font-bold text-indigo-500 flex-shrink-0 mt-0.5 tracking-wider">WHY</span>
                      <p className="text-xs text-indigo-700 leading-relaxed">{step.whyThisStep}</p>
                    </div>
                  )}

                  {step.formula && (
                    <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {step.formula}
                      </p>
                    </div>
                  )}

                  {step.result && (
                    <div
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5"
                      style={{ backgroundColor: cfg.light, color: cfg.color }}
                    >
                      <span>→</span>
                      <span>{step.result}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Why Students Get Confused Here — Basic + Standard ════════════════ */}
      {level !== "advanced" && solution.confusionPoint && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">😕</span>
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
              Why Students Get Confused Here
            </p>
          </div>
          <p className="text-sm text-orange-900 leading-relaxed">{solution.confusionPoint}</p>
        </div>
      )}

      {/* ══ Final Answer — all levels ═════════════════════════════════════════ */}
      <div
        className="rounded-2xl border p-5 shadow-sm"
        style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
      >
        <p
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: cfg.color }}
        >
          ✦ Final Answer
        </p>
        <p className="text-[15px] font-bold text-slate-900 leading-relaxed">
          {solution.finalAnswer}
        </p>
      </div>

      {/* ══ Common Exam Trap — all levels ════════════════════════════════════ */}
      {solution.examTrap && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">🪤</span>
            <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Common Exam Trap</p>
          </div>
          <p className="text-sm text-red-900 leading-relaxed">{solution.examTrap}</p>
        </div>
      )}

      {/* ══ One Similar Example — Basic only ══════════════════════════════════ */}
      {level === "basic" && solution.similarExample?.problem && (
        <div className="bg-white rounded-2xl border border-teal-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📐</span>
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">One Similar Example</p>
          </div>
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-3">
            <p className="text-sm text-slate-700 leading-relaxed">{solution.similarExample.problem}</p>
          </div>
          {solution.similarExample.solution && (
            showExSolution ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Solution</p>
                <p className="text-sm text-slate-700 leading-relaxed">{solution.similarExample.solution}</p>
                <button
                  onClick={() => setShowEx(false)}
                  className="mt-2.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Hide ↑
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEx(true)}
                className="w-full py-2.5 rounded-xl border border-teal-200 text-xs font-semibold text-teal-700 hover:bg-teal-50 active:bg-teal-100 transition-colors"
              >
                See Solution ↓
              </button>
            )
          )}
        </div>
      )}

      {/* ══ Remember This — Basic + Standard ═════════════════════════════════ */}
      {level !== "advanced" && solution.examTip && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">⭐</span>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Remember This</p>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">{solution.examTip}</p>
        </div>
      )}

      {/* ── Key Concepts — all levels ─────────────────────────────────────── */}
      {solution.keyConcepts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Key Concepts
          </p>
          <div className="flex flex-wrap gap-2">
            {solution.keyConcepts.map((c) => (
              <span
                key={c}
                className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ══ Check Your Understanding — all levels ════════════════════════════ */}
      {solution.checkUnderstanding?.question && (
        <div className="bg-white rounded-2xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✅</span>
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
              Check Your Understanding
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">
            <p className="text-sm font-medium text-slate-800 leading-relaxed">
              {solution.checkUnderstanding.question}
            </p>
          </div>
          {solution.checkUnderstanding.answer && (
            showCheckAnswer ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Answer</p>
                <p className="text-sm text-slate-700 leading-relaxed">{solution.checkUnderstanding.answer}</p>
                <button
                  onClick={() => setShowA(false)}
                  className="mt-2.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Hide ↑
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowA(true)}
                className="w-full py-2.5 rounded-xl border border-green-200 text-xs font-semibold text-green-700 hover:bg-green-50 active:bg-green-100 transition-colors"
              >
                Reveal Answer ↓
              </button>
            )
          )}
        </div>
      )}

      {/* ══ Explain More ══════════════════════════════════════════════════════ */}
      {hasMore && (
        <>
          <button
            onClick={() => setShowMore((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-indigo-200 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            <span>{showMore ? "Show Less" : "Explain More"}</span>
            <span className="text-base leading-none">{showMore ? "↑" : "↓"}</span>
          </button>

          {showMore && (
            <div className="space-y-4">

              {solution.deeperExplanation && (
                <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🔬</span>
                    <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">Deeper Explanation</p>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{solution.deeperExplanation}</p>
                </div>
              )}

              {solution.additionalExamples && solution.additionalExamples.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    📝 Additional Examples
                  </p>
                  <div className="space-y-2.5">
                    {solution.additionalExamples.map((ex, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                        <p className="text-sm text-slate-700 leading-relaxed">{ex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {solution.commonMistakes && solution.commonMistakes.length > 0 && (
                <div className="bg-white rounded-2xl border border-red-100 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
                    ⚠ Common Mistakes to Avoid
                  </p>
                  <ul className="space-y-2">
                    {solution.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[10px] font-bold text-red-500 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
}
