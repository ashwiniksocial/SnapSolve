import { useEffect, useRef } from "react";
import type { AIResponse } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";
import TeachingLayout     from "@/components/teaching/TeachingLayout";
import TutorInsightBanner from "@/components/tutor/TutorInsightBanner";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";
import {
  recordQuestionAnswered,
  recordTopicVisit,
  recordMistakesFromResponse,
  recordSession,
} from "@/services/studentModel";

interface Props {
  solution: AIResponse;
  initialLevel?: ReadingLevel; // kept for API compat; ignored — Beta 1 always Detailed
}

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

// Beta 1: Detailed-only mode — always "basic", no mode selector shown.
const BETA1_LEVEL: ReadingLevel = "basic";

export default function SolutionCard({ solution }: Props) {
  const level = BETA1_LEVEL;

  const cfg  = SUBJECTS[solution.subject as Subject];
  const isAI = solution.source === "openai";

  // ── Student model: session tracking ──────────────────────────────────────
  const sessionStart = useRef<number>(Date.now());
  const sessionId    = useRef<string>(`s-${Date.now().toString(36)}`);
  const sectionsOpened = useRef<string[]>([]);
  const levelRef = useRef<ReadingLevel>(level);

  // Record topic visit + mistakes on mount (once per solution render)
  useEffect(() => {
    sessionStart.current = Date.now();
    recordTopicVisit(solution.subject, solution.topic, 0, levelRef.current);
    if (solution.commonMistakes?.length) {
      recordMistakesFromResponse(
        solution.subject,
        solution.topic,
        solution.commonMistakes,
        solution.examTrap,
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution.id]);

  // Record full session on unmount
  useEffect(() => {
    return () => {
      const durationMs = Date.now() - sessionStart.current;
      if (durationMs < 3000) return; // ignore accidental mounts < 3 s
      recordQuestionAnswered(durationMs, levelRef.current);
      recordSession({
        sessionId:         sessionId.current,
        topic:             solution.topic,
        subject:           solution.subject,
        startTime:         sessionStart.current,
        endTime:           Date.now(),
        durationMs,
        depthUsed:         levelRef.current,
        sectionsOpened:    sectionsOpened.current,
        learningLoopDone:  false,
        conceptualCorrect: 0,
        conceptualTotal:   0,
        confidenceBefore:  3,
        confidenceAfter:   3,
        source:            solution.source ?? "fallback",
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solution.id]);

  return (
    <div className="space-y-3">

      {/* ── Personalised tutor insight ───────────────────────────────────── */}
      <TutorInsightBanner topic={solution.topic} subject={solution.subject} />

      {/* ── Topic + source chips ─────────────────────────────────────────── */}
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
      </div>

      {/* ── Detected question ───────────────────────────────────────────── */}
      {solution.detectedQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Question Detected
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.detectedQuestion}</p>
        </div>
      )}

      {/* ── Teaching Engine ─────────────────────────────────────────────── */}
      <TeachingLayout solution={solution} level={level} />

    </div>
  );
}
