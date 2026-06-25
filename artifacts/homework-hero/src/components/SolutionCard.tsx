import { useState } from "react";
import type { AIResponse } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";
import ConfidenceMeter    from "@/components/ConfidenceMeter";
import VerificationBadge  from "@/components/VerificationBadge";
import TeacherReviewPanel from "@/components/TeacherReviewPanel";
import TeachingLayout     from "@/components/teaching/TeachingLayout";
import {
  getStoredLevel,
  setStoredLevel,
  LEVEL_META,
} from "@/services/explanation/readingModeEngine";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";

interface Props { solution: AIResponse }

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

export default function SolutionCard({ solution }: Props) {
  const [level, setLevel] = useState<ReadingLevel>(getStoredLevel);

  const cfg  = SUBJECTS[solution.subject as Subject];
  const isAI = solution.source === "openai";

  function changeLevel(l: ReadingLevel) {
    setLevel(l);
    setStoredLevel(l);
  }

  return (
    <div className="space-y-3">

      {/* ── Reading depth selector ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Explanation Depth
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(["basic", "standard", "advanced"] as const).map((key) => {
            const m = LEVEL_META[key];
            return (
              <button
                key={key}
                onClick={() => changeLevel(key)}
                className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                  level === key ? m.color : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div>{m.label}</div>
                <div className={`text-[9px] font-normal mt-0.5 leading-none ${level === key ? "opacity-80" : "opacity-50"}`}>
                  {m.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Topic + source chips ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {isAI && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
            ✦ AI Generated
          </span>
        )}
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
        >
          {cfg.icon} {solution.topic}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DIFF_BADGE[solution.difficulty]}`}>
          {solution.difficulty}
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

      {/* ── Verification + Confidence ─────────────────────────────────────── */}
      {solution.verificationResult  && <VerificationBadge result={solution.verificationResult} />}
      {solution.confidenceBreakdown && <ConfidenceMeter breakdown={solution.confidenceBreakdown} />}

      {/* ── Detected question ──────────────────────────────────────────────── */}
      {solution.detectedQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Question Detected
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.detectedQuestion}</p>
        </div>
      )}

      {/* ── Encouraging banner (Basic only) ──────────────────────────────── */}
      {level === "basic" && (
        <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2.5">
          <span className="text-base">🙌</span>
          <p className="text-xs text-indigo-700 leading-relaxed">
            <span className="font-bold">Take it one step at a time.</span>{" "}
            Don't worry if this looks difficult — we'll solve it together.
          </p>
        </div>
      )}

      {/* ── Teaching Engine ── all sections rendered here ────────────────── */}
      <TeachingLayout solution={solution} level={level} />

      {/* ── Teacher Review Panel ─────────────────────────────────────────── */}
      <TeacherReviewPanel solution={solution} />

    </div>
  );
}
