import { useState, useEffect } from "react";
import { getLoadingPhases } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";

interface Props {
  subject:      Subject;
  currentPhase: string;
  phaseIndex:   number;
  progressMsg?: string;
  progressPct?: number;
}

export default function LoadingSpinner({ subject, currentPhase, phaseIndex, progressMsg, progressPct = 0 }: Props) {
  const cfg = SUBJECTS[subject];
  const phases = getLoadingPhases();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Animated ring */}
      <div className="relative w-20 h-20 mb-8">
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{ borderTopColor: cfg.color, borderRightColor: cfg.color + "60" }}
        />
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: cfg.light }}
        >
          {cfg.icon}
        </div>
      </div>

      {/* Phase message */}
      <p className="text-base font-semibold text-slate-700 text-center mb-6 min-h-[1.5rem]">
        {currentPhase}
      </p>

      {/* Phase progress dots */}
      <div className="flex gap-2 mb-8">
        {phases.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= phaseIndex ? cfg.color : "#e2e8f0",
              transform: i === phaseIndex ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Skeleton cards */}
      <div className="w-full max-w-sm space-y-3">
        {[90, 70, 80, 60].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded-full animate-pulse"
            style={{
              width: `${w}%`,
              backgroundColor: i <= phaseIndex ? cfg.color + "25" : "#f1f5f9",
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>

      {/* Live backend progress bar — shown only when the AI pipeline is running */}
      {progressMsg && (
        <div className="w-full max-w-sm mt-6 space-y-2">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-slate-500 leading-tight">{progressMsg}</p>
            <p className="text-xs font-bold ml-3 shrink-0" style={{ color: cfg.color }}>{progressPct}%</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%`, backgroundColor: cfg.color }}
            />
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400 font-medium">
        AI is building your {subject} lesson…
      </p>
    </div>
  );
}
