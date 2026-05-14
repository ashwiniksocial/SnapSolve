import { useState, useEffect } from "react";
import { getLoadingPhases } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";

interface Props {
  subject: Subject;
  currentPhase: string;
  phaseIndex: number;
}

export default function LoadingSpinner({ subject, currentPhase, phaseIndex }: Props) {
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

      <p className="mt-8 text-xs text-slate-400 font-medium">
        AI is analysing your {subject} question…
      </p>
    </div>
  );
}
