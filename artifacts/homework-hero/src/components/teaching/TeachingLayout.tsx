import { useState } from "react";
import type { AIResponse, TeachingLesson, LessonStep } from "@/data/solutionBank";
import type { Subject }     from "@/data/subjects";
import { SUBJECTS }         from "@/data/subjects";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";

import TeachingSection    from "./TeachingSection";
import StepReasoningCard  from "./StepReasoningCard";
import MistakeCard        from "./MistakeCard";
import MemoryCard         from "./MemoryCard";
import WorkedExampleCard  from "./WorkedExampleCard";
import PracticeQuestionCard from "./PracticeQuestionCard";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-700 leading-relaxed">{children}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
      {children}
    </p>
  );
}

// ─── Guided Step Card ─────────────────────────────────────────────────────────

function GuidedStepCard({
  step,
  index,
  color,
  light,
  border,
}: {
  step:   LessonStep;
  index:  number;
  color:  string;
  light:  string;
  border: string;
}) {
  const [whyOpen,   setWhyOpen]   = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Step header */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: light, borderBottom: `1px solid ${border}` }}>
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </span>
        <p className="text-sm font-semibold text-slate-800 leading-snug">{step.what}</p>
      </div>

      <div className="px-4 py-3 bg-white space-y-2">

        {/* Math formula */}
        {step.math && (
          <div className="bg-slate-900 rounded-xl px-4 py-2.5">
            <p className="text-xs text-slate-300 mb-0.5 font-mono uppercase tracking-wider">Formula / Calculation</p>
            <p className="text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">{step.math}</p>
          </div>
        )}

        {/* Result */}
        {step.result && (
          <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
            <span className="text-emerald-500 mt-0.5 shrink-0 text-sm">✓</span>
            <p className="text-sm font-semibold text-emerald-800 leading-snug">{step.result}</p>
          </div>
        )}

        {/* Why this step — collapsible reveal */}
        <button
          onClick={() => setWhyOpen((o) => !o)}
          className="w-full flex items-center justify-between text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 hover:bg-violet-100 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <span>💭</span>
            <span>Why this step?</span>
          </span>
          <span className="text-violet-400">{whyOpen ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {whyOpen && (
          <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <p className="text-sm text-violet-800 leading-relaxed whitespace-pre-wrap">{step.why}</p>
          </div>
        )}

        {/* Pause and think */}
        {step.pause && (
          <>
            <button
              onClick={() => setPauseOpen((o) => !o)}
              className="w-full flex items-center justify-between text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 hover:bg-amber-100 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span>🤔</span>
                <span>Pause &amp; Think</span>
              </span>
              <span className="text-amber-500">{pauseOpen ? "▲" : "▼ Try it"}</span>
            </button>
            {pauseOpen && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-800 italic leading-relaxed">{step.pause}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Practice Question with progressive hints ─────────────────────────────────

function PracticeWithHints({
  question,
  hints,
  solution,
  borderColor,
}: {
  question:    string;
  hints:       string[];
  solution:    string;
  borderColor: string;
}) {
  const [revealed, setRevealed]   = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-3">
      <div className="bg-white border-2 rounded-xl px-4 py-3" style={{ borderColor }}>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Your Turn</p>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question}</p>
      </div>

      {hints.length > 0 && (
        <div className="space-y-2">
          {hints.map((hint, i) => (
            <div key={i}>
              {revealed > i ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 mb-1">Hint {i + 1}</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{hint}</p>
                </div>
              ) : revealed === i ? (
                <button
                  onClick={() => setRevealed(i + 1)}
                  className="w-full py-2.5 rounded-xl border-2 border-dashed border-amber-300 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  💡 Reveal Hint {i + 1}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {!showSolution ? (
        <button
          onClick={() => setShowSolution(true)}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Show Full Solution
        </button>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500 mb-1.5">Full Solution</p>
          <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">{solution}</p>
        </div>
      )}
    </div>
  );
}

// ─── Mistake Detail Card ──────────────────────────────────────────────────────

function MistakeDetailCard({
  mistake,
  index,
}: {
  mistake: { mistake: string; whyItHappens: string; howToAvoid: string };
  index:   number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-red-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-3 bg-white hover:bg-red-50 transition-colors flex items-start gap-2"
      >
        <span className="text-red-500 shrink-0 mt-0.5 text-sm">❌</span>
        <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{mistake.mistake}</p>
        <span className="text-xs text-slate-400 shrink-0">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 bg-red-50 border-t border-red-100 space-y-2">
          {mistake.whyItHappens && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-red-500 mb-0.5">Why this happens</p>
              <p className="text-xs text-red-800 leading-relaxed">{mistake.whyItHappens}</p>
            </div>
          )}
          {mistake.howToAvoid && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-0.5">How to avoid it</p>
              <p className="text-xs text-emerald-800 leading-relaxed">{mistake.howToAvoid}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Suppress unused-var lint for index on MistakeDetailCard
void ((_: number) => _);

// ─── Full Lesson Renderer ─────────────────────────────────────────────────────
//
// Mode section counts (exact — enforced by unconditional show flags below)
//   Detailed (basic)  → 8: Key Concept, Build Intuition, Understand Question,
//                        Step-by-Step, Common Mistakes, Final Answer,
//                        One Similar Example, Practice Question
//   Standard          → 5: Key Concept, Understand Question, Step-by-Step,
//                        Final Answer, Practice Question
//   Compact (advanced)→ 3: Step-by-Step, Final Answer, Remember This

function LessonRenderer({ lesson, level, cfg }: {
  lesson: TeachingLesson;
  level:  ReadingLevel;
  cfg:    { color: string; light: string; border: string; icon: string };
}) {
  const isDetailed = level === "basic";
  const isCompact  = level === "advanced";

  // Section visibility is mode-only (not data-dependent).
  // Fallback content is guaranteed by toAIResponse normalisation so no section
  // ever renders empty.  Counts: Detailed=8, Standard=5, Compact=3.
  const show = {
    concept:   !isCompact,
    intuition: isDetailed,
    translate: !isCompact,
    steps:     true,
    mistakes:  isDetailed,
    answer:    true,
    similar:   isDetailed,
    practice:  !isCompact,
    remember:  isCompact,
  };

  let _n = 0;
  const num = {
    concept:   show.concept   ? ++_n : _n,
    intuition: show.intuition ? ++_n : _n,
    translate: show.translate ? ++_n : _n,
    steps:     show.steps     ? ++_n : _n,
    mistakes:  show.mistakes  ? ++_n : _n,
    answer:    show.answer    ? ++_n : _n,
    similar:   show.similar   ? ++_n : _n,
    practice:  show.practice  ? ++_n : _n,
    remember:  show.remember  ? ++_n : _n,
  };

  return (
    <div className="space-y-3">

      {/* ── Key Concept — all modes ─────────────────────────────────────── */}
      {show.concept && (
        <TeachingSection
          id="lesson-concept"
          num={num.concept}
          icon="💡"
          title="Key Concept"
          headerBg={cfg.light}
          headerText={cfg.color}
          borderColor={cfg.border}
          defaultOpen={true}
          hidden={false}
        >
          <div className="flex flex-wrap gap-2">
            {lesson.keyConcepts.map((c, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ background: cfg.light, color: cfg.color, borderColor: cfg.border }}
              >
                {c}
              </span>
            ))}
          </div>
        </TeachingSection>
      )}

      {/* ── Build Intuition — Detailed only ────────────────────────────── */}
      {show.intuition && (
        <TeachingSection
          id="lesson-intuition"
          num={num.intuition}
          icon="🌱"
          title="Build Intuition"
          headerBg="#fdf4ff"
          headerText="#7e22ce"
          borderColor="#e9d5ff"
          bodyBg="#fdf4ff"
          defaultOpen={true}
          hidden={false}
        >
          <div className="space-y-3">
            {lesson.intuition.story && (
              <div className="bg-white border border-purple-200 rounded-xl px-4 py-3">
                <Label>The story that makes it click</Label>
                <P>{lesson.intuition.story}</P>
              </div>
            )}
            {lesson.intuition.visual && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3">
                <Label>Picture this</Label>
                <P>{lesson.intuition.visual}</P>
              </div>
            )}
            {lesson.intuition.everyday && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Label>In real life</Label>
                <P>{lesson.intuition.everyday}</P>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── Understand the Question — Standard + Detailed ──────────────── */}
      {show.translate && (
        <TeachingSection
          id="lesson-translate"
          num={num.translate}
          icon="🔍"
          title="Understand the Question"
          headerBg="#fff7ed"
          headerText="#c2410c"
          borderColor="#fed7aa"
          bodyBg="#fff7ed"
          defaultOpen={true}
          hidden={false}
        >
          <div className="space-y-3">
            <div className="bg-white border border-orange-200 rounded-xl px-4 py-3">
              <Label>In simple words</Label>
              <P>{lesson.questionTranslation.plainEnglish}</P>
            </div>
            {lesson.questionTranslation.whatWeKnow && (
              <div>
                <Label>What we are told</Label>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{lesson.questionTranslation.whatWeKnow}</p>
              </div>
            )}
            {lesson.questionTranslation.whatWeFind && (
              <div className="flex items-start gap-2.5 bg-orange-100 rounded-xl px-3 py-2.5">
                <span className="text-orange-500 shrink-0 mt-0.5">→</span>
                <div>
                  <Label>Our goal</Label>
                  <P>{lesson.questionTranslation.whatWeFind}</P>
                </div>
              </div>
            )}
            {lesson.questionTranslation.wordToMath && (
              <div>
                <Label>Translating words into maths</Label>
                <div className="bg-slate-900 rounded-xl px-4 py-3">
                  <p className="text-sm font-mono text-orange-300 leading-relaxed whitespace-pre-wrap">{lesson.questionTranslation.wordToMath}</p>
                </div>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── Step-by-Step Solution — all modes ──────────────────────────── */}
      {show.steps && (
        <TeachingSection
          id="lesson-reasoning"
          num={num.steps}
          icon="⚙️"
          title="Step-by-Step Solution"
          headerBg={cfg.light}
          headerText={cfg.color}
          borderColor={cfg.border}
          defaultOpen={true}
          hidden={false}
          badge={
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.border, color: cfg.color }}>
              {lesson.guidedReasoning.length} steps
            </span>
          }
        >
          <div className="space-y-2.5">
            {lesson.guidedReasoning.map((step, i) => (
              <GuidedStepCard
                key={i}
                step={step}
                index={i}
                color={cfg.color}
                light={cfg.light}
                border={cfg.border}
              />
            ))}
          </div>
        </TeachingSection>
      )}

      {/* ── Common Mistakes — Detailed (all) / Standard (first 1) ──────── */}
      {show.mistakes && (
        <TeachingSection
          id="lesson-mistakes"
          num={num.mistakes}
          icon="❌"
          title="Common Mistakes"
          headerBg="#fef2f2"
          headerText="#b91c1c"
          borderColor="#fecaca"
          bodyBg="#fef2f2"
          defaultOpen={false}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Watch out!</span>}
        >
          <div className="space-y-3">
            {(isDetailed ? lesson.commonMistakes : lesson.commonMistakes.slice(0, 1)).map((m, i) => (
              <MistakeDetailCard key={i} mistake={m} index={i} />
            ))}
          </div>
        </TeachingSection>
      )}

      {/* ── Final Answer — all modes (no verification shown) ───────────── */}
      {show.answer && (
        <TeachingSection
          id="lesson-answer"
          num={num.answer}
          icon="✅"
          title="Final Answer"
          headerBg="#f0fdf4"
          headerText="#15803d"
          borderColor="#bbf7d0"
          bodyBg="#f0fdf4"
          defaultOpen={true}
          hidden={false}
        >
          <div className="space-y-3">
            <div className="bg-emerald-600 rounded-xl px-4 py-3.5 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-200 mb-1">Answer</p>
              <p className="text-sm font-bold text-white leading-relaxed">{lesson.finalAnswer.answer}</p>
            </div>
            {!isCompact && lesson.finalAnswer.whyCorrect && (
              <div>
                <Label>Why this is correct</Label>
                <P>{lesson.finalAnswer.whyCorrect}</P>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── One Similar Example — Standard + Detailed ──────────────────── */}
      {show.similar && (
        <TeachingSection
          id="lesson-simpler"
          num={num.similar}
          icon="📐"
          title="One Similar Example"
          headerBg="#f0fdfa"
          headerText="#0f766e"
          borderColor="#99f6e4"
          bodyBg="#f0fdfa"
          defaultOpen={true}
          hidden={false}
        >
          <WorkedExampleCard
            problem={lesson.simplerExample.problem}
            solution={lesson.simplerExample.solution}
            borderColor="#0f766e"
          />
        </TeachingSection>
      )}

      {/* ── Practice Question — Standard + Detailed ────────────────────── */}
      {show.practice && (
        <TeachingSection
          id="lesson-practice"
          num={num.practice}
          icon="✏️"
          title="Practice Question"
          headerBg="#f0fdf4"
          headerText="#15803d"
          borderColor="#bbf7d0"
          bodyBg="#f0fdf4"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Your turn</span>}
        >
          <PracticeWithHints
            question={lesson.practiceQuestion.question}
            hints={lesson.practiceQuestion.hints}
            solution={lesson.practiceQuestion.solution}
            borderColor="#15803d"
          />
        </TeachingSection>
      )}

      {/* ── Remember This — Compact + Detailed ─────────────────────────── */}
      {show.remember && (
        <TeachingSection
          id="lesson-remember"
          num={num.remember}
          icon="🏆"
          title="Remember This"
          headerBg="#fffbeb"
          headerText="#b45309"
          borderColor="#fde68a"
          bodyBg="#fffbeb"
          defaultOpen={true}
          hidden={false}
        >
          <div className="space-y-2">
            {lesson.rememberThese.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-white border border-amber-200 rounded-xl px-4 py-2.5">
                <span className="text-amber-500 shrink-0 mt-0.5 font-bold">✓</span>
                <p className="text-sm font-semibold text-amber-900 leading-snug">{point}</p>
              </div>
            ))}
          </div>
        </TeachingSection>
      )}

    </div>
  );
}

// ─── Legacy Steps Renderer (bank / fallback entries) ─────────────────────────
//
// Applies the same 3-mode section spec to the older data shape.

function LegacyRenderer({ solution, level, cfg }: {
  solution: AIResponse;
  level:    ReadingLevel;
  cfg:      { color: string; light: string; border: string };
}) {
  const isDetailed = level === "basic";
  const isCompact  = level === "advanced";

  const show = {
    concept:  !isCompact && (solution.keyConcepts?.length ?? 0) > 0,
    steps:    true,
    mistakes: isDetailed && (solution.commonMistakes?.length ?? 0) > 0,
    similar:  isDetailed && !!solution.similarExample?.problem,
    practice: !isCompact && !!solution.checkUnderstanding?.question,
    remember: (isCompact || isDetailed) && !!(solution.rememberThis || (solution.memoryShortcut?.length ?? 0) > 0),
  };

  let _n = 0;
  const num = {
    concept:  show.concept  ? ++_n : _n,
    steps:    show.steps    ? ++_n : _n,
    mistakes: show.mistakes ? ++_n : _n,
    similar:  show.similar  ? ++_n : _n,
    practice: show.practice ? ++_n : _n,
    remember: show.remember ? ++_n : _n,
  };

  return (
    <div className="space-y-3">

      {/* Key Concept */}
      {show.concept && (
        <TeachingSection
          id={`concept-${level}`}
          num={num.concept}
          icon="💡"
          title="Key Concept"
          headerBg={cfg.light}
          headerText={cfg.color}
          borderColor={cfg.border}
          defaultOpen={true}
          hidden={false}
        >
          <div className="flex flex-wrap gap-2">
            {solution.keyConcepts!.map((c, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ background: cfg.light, color: cfg.color, borderColor: cfg.border }}
              >
                {c}
              </span>
            ))}
          </div>
        </TeachingSection>
      )}

      {/* Step-by-Step Solution — always shown */}
      <TeachingSection
        id={`steps-${level}`}
        num={num.steps}
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

      {/* Common Mistakes — Detailed (all) / Standard (first 1) */}
      {show.mistakes && (
        <TeachingSection
          id={`mistakes-${level}`}
          num={num.mistakes}
          icon="❌"
          title="Common Mistakes"
          headerBg="#fef2f2"
          headerText="#b91c1c"
          borderColor="#fecaca"
          bodyBg="#fef2f2"
          defaultOpen={false}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Watch out!</span>}
        >
          <MistakeCard
            commonMistakes={isDetailed ? solution.commonMistakes! : solution.commonMistakes!.slice(0, 1)}
            examTrap={isDetailed ? solution.examTrap : undefined}
          />
        </TeachingSection>
      )}

      {/* Similar Example — Standard + Detailed */}
      {show.similar && (
        <TeachingSection
          id={`similar-${level}`}
          num={num.similar}
          icon="📐"
          title="One Similar Example"
          headerBg="#f0fdfa"
          headerText="#0f766e"
          borderColor="#99f6e4"
          bodyBg="#f0fdfa"
          defaultOpen={true}
          hidden={false}
        >
          <WorkedExampleCard
            problem={solution.similarExample!.problem}
            solution={solution.similarExample!.solution ?? ""}
            borderColor="#0f766e"
          />
        </TeachingSection>
      )}

      {/* Practice Question — Standard + Detailed */}
      {show.practice && (
        <TeachingSection
          id={`practice-${level}`}
          num={num.practice}
          icon="✏️"
          title="Practice Question"
          headerBg="#f0fdf4"
          headerText="#15803d"
          borderColor="#bbf7d0"
          bodyBg="#f0fdf4"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Your turn</span>}
        >
          <PracticeQuestionCard
            question={solution.checkUnderstanding!.question}
            answer={solution.checkUnderstanding!.answer ?? ""}
            borderColor="#15803d"
          />
        </TeachingSection>
      )}

      {/* Remember This — Compact + Detailed */}
      {show.remember && (
        <TeachingSection
          id={`memory-${level}`}
          num={num.remember}
          icon="🏆"
          title="Remember This"
          headerBg="#fffbeb"
          headerText="#b45309"
          borderColor="#fde68a"
          bodyBg="#fffbeb"
          defaultOpen={true}
          hidden={false}
        >
          <MemoryCard
            memoryShortcut={solution.memoryShortcut}
            examTip={solution.rememberThis ? undefined : solution.examTip}
            rememberThis={solution.rememberThis}
          />
        </TeachingSection>
      )}

    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  solution: AIResponse;
  level:    ReadingLevel;
}

export default function TeachingLayout({ solution, level }: Props) {
  const cfg = SUBJECTS[solution.subject as Subject];

  if (solution.lesson) {
    return (
      <LessonRenderer
        lesson={solution.lesson}
        level={level}
        cfg={cfg}
      />
    );
  }

  return (
    <LegacyRenderer solution={solution} level={level} cfg={cfg} />
  );
}
