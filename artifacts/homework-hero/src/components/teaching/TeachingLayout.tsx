import { useState } from "react";
import type { AIResponse } from "@/data/solutionBank";
import type { Subject }     from "@/data/subjects";
import { SUBJECTS }         from "@/data/subjects";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";
import { buildSections, hasSectionContent } from "@/services/explanation/teachingEngine";

import TeachingSection    from "./TeachingSection";
import ConceptCard        from "./ConceptCard";
import ThinkingCard       from "./ThinkingCard";
import VisualCard         from "./VisualCard";
import StepReasoningCard  from "./StepReasoningCard";
import MistakeCard        from "./MistakeCard";
import ExamTipCard        from "./ExamTipCard";
import MemoryCard         from "./MemoryCard";
import WorkedExampleCard  from "./WorkedExampleCard";
import PracticeQuestionCard from "./PracticeQuestionCard";
import UnderstandingCheck from "./UnderstandingCheck";
import ReflectionCard     from "./ReflectionCard";
import LearningSummary    from "./LearningSummary";

interface ConfidenceMCQData {
  question:     string;
  options:      string[];
  correctIndex: number;
  explanation:  string;
}

function ConfidenceMCQ({ data }: { data: ConfidenceMCQData }) {
  const [selected, setSelected] = useState<number | null>(null);

  const correct  = selected === data.correctIndex;
  const answered = selected !== null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-800 leading-relaxed">{data.question}</p>
      <div className="space-y-2">
        {data.options.map((opt, i) => {
          let cls = "w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ";
          if (!answered)              cls += "bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50";
          else if (i === data.correctIndex) cls += "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold";
          else if (i === selected)    cls += "bg-red-50 border-red-300 text-red-700";
          else                        cls += "bg-slate-50 border-slate-200 text-slate-400";
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} className={cls} disabled={answered}>
              <span className="font-bold mr-2">{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`rounded-xl px-4 py-3 border ${correct ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-xs font-bold mb-1 ${correct ? "text-emerald-700" : "text-amber-700"}`}>
            {correct ? "✓ Correct! Well done." : "Not quite — but that's okay."}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{data.explanation}</p>
          {!correct && (
            <button onClick={() => setSelected(null)} className="mt-2 text-xs font-semibold text-violet-600 hover:underline">
              Try again →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  solution: AIResponse;
  level:    ReadingLevel;
}

export default function TeachingLayout({ solution, level }: Props) {
  const cfg      = SUBJECTS[solution.subject as Subject];
  const sections = buildSections(level);

  function sec(key: string) {
    const s = sections[key];
    return {
      num:         s.sectionNumber,
      hidden:      s.vis === "hidden" || !hasSectionContent(key, solution),
      defaultOpen: s.defaultOpen,
    };
  }

  return (
    <div className="space-y-3">

      {/* ── SECTION 1+2+3 — Prerequisites, concept, question understanding ── */}
      {(() => {
        const s = sec("prereq");
        const hasContent =
          (solution.prerequisites?.length ?? 0) > 0 ||
          Boolean(solution.conceptExplanation) ||
          Boolean(solution.questionUnderstanding);
        if (!hasContent) return null;
        return (
          <TeachingSection
            id={`prereq-${level}`}
            num={s.num}
            icon="📋"
            title="What You Need To Know First"
            headerBg="#f0f9ff"
            headerText="#0369a1"
            borderColor="#bae6fd"
            bodyBg="#f0f9ff"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden && !hasContent}
            badge={<span className="text-[9px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Start here</span>}
          >
            <ConceptCard
              prerequisites={solution.prerequisites}
              conceptExplanation={solution.conceptExplanation}
              questionUnderstanding={solution.questionUnderstanding}
            />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 4 — Build the thinking (wordToMath + thinkingProcess) ─── */}
      {solution.thinkingProcess && (() => {
        const s = sec("thinking");
        return (
          <TeachingSection
            id={`thinking-${level}`}
            num={s.num}
            icon="💭"
            title="How Should You Think?"
            headerBg="#fdf4ff"
            headerText="#7e22ce"
            borderColor="#e9d5ff"
            bodyBg="#fdf4ff"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Before you write anything</span>}
          >
            <ThinkingCard thinkingProcess={solution.thinkingProcess} wordToMath={solution.wordToMath} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 5 — Visualise ─────────────────────────────────────────── */}
      {solution.visualThinking?.trim() && (() => {
        const s = sec("visual");
        return (
          <TeachingSection
            id={`visual-${level}`}
            num={s.num}
            icon="🎨"
            title="See It Visually"
            headerBg="#fff7ed"
            headerText="#c2410c"
            borderColor="#fed7aa"
            bodyBg="#fff7ed"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Mental picture</span>}
          >
            <VisualCard visualThinking={solution.visualThinking} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 6 — Step-by-Step Solution (always visible) ──────────── */}
      {(() => {
        const s = sec("steps");
        return (
          <TeachingSection
            id={`steps-${level}`}
            num={s.num}
            icon="⚙️"
            title="Step-by-Step Solution"
            headerBg={cfg.light}
            headerText={cfg.color}
            borderColor={cfg.border}
            defaultOpen={true}
            hidden={false}
            badge={
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.border, color: cfg.color }}>
                {solution.steps.length} steps
              </span>
            }
          >
            <StepReasoningCard
              steps={solution.steps}
              finalAnswer={solution.finalAnswer}
              color={cfg.color}
              light={cfg.light}
              border={cfg.border}
              level={level}
            />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 7 — Self Check / Verify ─────────────────────────────── */}
      {solution.verification && (() => {
        const s = sec("verify");
        return (
          <TeachingSection
            id={`verify-${level}`}
            num={s.num}
            icon="✓"
            title="Let's Verify The Answer"
            headerBg="#f0fdf4"
            headerText="#15803d"
            borderColor="#bbf7d0"
            bodyBg="#f0fdf4"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
          >
            <p className="text-xs text-emerald-700 mb-3 italic">
              Every solution must verify itself. Let's substitute the answer back in.
            </p>
            <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{solution.verification}</p>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <span>✓</span><span>Answer verified — both sides match.</span>
            </div>
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 8 — Common Mistakes ──────────────────────────────────── */}
      {(solution.commonMistakes?.length ?? 0) > 0 && (() => {
        const s = sec("mistakes");
        return (
          <TeachingSection
            id={`mistakes-${level}`}
            num={s.num}
            icon="❌"
            title="Students Often Make These Mistakes"
            headerBg="#fef2f2"
            headerText="#b91c1c"
            borderColor="#fecaca"
            bodyBg="#fef2f2"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Watch out!</span>}
          >
            <MistakeCard commonMistakes={solution.commonMistakes!} examTrap={solution.examTrap} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 9 — Exam Shortcut ────────────────────────────────────── */}
      {solution.examTip && (() => {
        const s = sec("remember");
        return (
          <TeachingSection
            id={`examtip-${level}`}
            num={s.num}
            icon="⭐"
            title="Exam Shortcut"
            headerBg="#fffbeb"
            headerText="#b45309"
            borderColor="#fde68a"
            bodyBg="#fffbeb"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Only after understanding</span>}
          >
            <ExamTipCard examTip={solution.examTip} confusionPoint={solution.confusionPoint} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 10 — One Simpler Example ────────────────────────────── */}
      {solution.similarExample?.problem && (() => {
        const s = sec("similar");
        return (
          <TeachingSection
            id={`similar-${level}`}
            num={s.num}
            icon="📐"
            title="One Simpler Example"
            headerBg="#f0fdfa"
            headerText="#0f766e"
            borderColor="#99f6e4"
            bodyBg="#f0fdfa"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
          >
            <WorkedExampleCard
              problem={solution.similarExample.problem}
              solution={solution.similarExample.solution ?? ""}
              borderColor="#0f766e"
            />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 11 — Now You Try ─────────────────────────────────────── */}
      {solution.checkUnderstanding?.question && (() => {
        const s = sec("practice");
        return (
          <TeachingSection
            id={`practice-${level}`}
            num={s.num}
            icon="✅"
            title="Now You Try"
            headerBg="#f0fdf4"
            headerText="#15803d"
            borderColor="#bbf7d0"
            bodyBg="#f0fdf4"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Your turn</span>}
          >
            <PracticeQuestionCard
              question={solution.checkUnderstanding.question}
              answer={solution.checkUnderstanding.answer ?? ""}
              borderColor="#15803d"
            />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 12 — Check Your Understanding (conceptual questions) ─── */}
      {(solution.conceptualQuestions?.length ?? 0) > 0 && (() => {
        const s = sec("conceptual");
        return (
          <TeachingSection
            id={`conceptual-${level}`}
            num={s.num}
            icon="🧠"
            title="Check Your Understanding"
            headerBg="#fdf4ff"
            headerText="#7e22ce"
            borderColor="#e9d5ff"
            bodyBg="#fdf4ff"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Think, don't calculate</span>}
          >
            <UnderstandingCheck questions={solution.conceptualQuestions!} topic={solution.topic} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 13 — Learning Summary ───────────────────────────────── */}
      {(solution.learningSummary?.length ?? 0) > 0 && (() => {
        const s = sec("summary");
        return (
          <TeachingSection
            id={`summary-${level}`}
            num={s.num}
            icon="📚"
            title="Learning Summary"
            headerBg="#f0f9ff"
            headerText="#0369a1"
            borderColor="#bae6fd"
            bodyBg="#f0f9ff"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Max 6 points</span>}
          >
            <LearningSummary learningSummary={solution.learningSummary!} />
          </TeachingSection>
        );
      })()}

      {/* ── SECTION 14 — Remember This (structured rememberThis or legacy) ─ */}
      {(solution.rememberThis || (solution.memoryShortcut?.length ?? 0) > 0) && (() => {
        const s = sec("summary");
        return (
          <TeachingSection
            id={`memory-${level}`}
            num={s.num + ((solution.learningSummary?.length ?? 0) > 0 ? 1 : 0)}
            icon="🏆"
            title="Remember This"
            headerBg="#fffbeb"
            headerText="#b45309"
            borderColor="#fde68a"
            bodyBg="#fffbeb"
            defaultOpen={false}
            hidden={s.hidden}
          >
            <MemoryCard
              memoryShortcut={solution.memoryShortcut}
              examTip={solution.rememberThis ? undefined : solution.examTip}
              rememberThis={solution.rememberThis}
            />
          </TeachingSection>
        );
      })()}

      {/* ── MCQ — Confidence Check ───────────────────────────────────────── */}
      {solution.confidenceCheck?.question && (() => {
        const s = sec("mcq");
        return (
          <TeachingSection
            id={`mcq-${level}`}
            num={s.num}
            icon="🎯"
            title="Quick Check — Test Yourself"
            headerBg="#f5f3ff"
            headerText="#5b21b6"
            borderColor="#ddd6fe"
            bodyBg="#f5f3ff"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">MCQ</span>}
          >
            <ConfidenceMCQ data={solution.confidenceCheck} />
          </TeachingSection>
        );
      })()}

      {/* ── Learning Loop — Reflection ───────────────────────────────────── */}
      {(solution.conceptualQuestions?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-violet-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-violet-600 flex items-center gap-2.5">
            <span className="text-base">🔄</span>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-100">
                Learning Loop
              </p>
            </div>
            <span className="text-[9px] font-bold bg-violet-500 text-violet-100 px-2 py-0.5 rounded-full">
              Track mastery
            </span>
          </div>
          <div className="px-4 pb-4 pt-3 bg-white border-t border-violet-100">
            <ReflectionCard questions={solution.conceptualQuestions!} topic={solution.topic} />
          </div>
        </div>
      )}

      {/* ── Deeper Theory (Advanced only) ───────────────────────────────── */}
      {solution.deeperExplanation && (() => {
        const s = sec("deeper");
        return (
          <TeachingSection
            id={`deeper-${level}`}
            num={s.num}
            icon="🔬"
            title="Deeper Theory"
            headerBg="#1e1b4b"
            headerText="#c7d2fe"
            borderColor="#4338ca"
            bodyBg="#1e1b4b"
            defaultOpen={s.defaultOpen}
            hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full">Class 11–12</span>}
          >
            <p className="text-sm text-indigo-100 leading-relaxed">{solution.deeperExplanation}</p>
            {(solution.additionalExamples?.length ?? 0) > 0 && (
              <ul className="mt-3 space-y-1.5">
                {solution.additionalExamples!.map((ex, i) => (
                  <li key={i} className="text-xs text-indigo-200 leading-relaxed font-mono bg-indigo-900 rounded-lg px-3 py-2">
                    {ex}
                  </li>
                ))}
              </ul>
            )}
          </TeachingSection>
        );
      })()}

    </div>
  );
}
