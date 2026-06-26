import { useState } from "react";
import type { AIResponse, TeachingLesson, LessonStep } from "@/data/solutionBank";
import type { Subject }     from "@/data/subjects";
import { SUBJECTS }         from "@/data/subjects";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";

import TeachingSection    from "./TeachingSection";
import StepReasoningCard  from "./StepReasoningCard";
import MistakeCard        from "./MistakeCard";
import ExamTipCard        from "./ExamTipCard";
import MemoryCard         from "./MemoryCard";
import WorkedExampleCard  from "./WorkedExampleCard";
import PracticeQuestionCard from "./PracticeQuestionCard";
import UnderstandingCheck from "./UnderstandingCheck";
import ReflectionCard     from "./ReflectionCard";
import LearningSummary    from "./LearningSummary";
import ConceptCard        from "./ConceptCard";
import ThinkingCard       from "./ThinkingCard";
import VisualCard         from "./VisualCard";
import { buildSections, hasSectionContent } from "@/services/explanation/teachingEngine";

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

// ─── Vocabulary Chip ──────────────────────────────────────────────────────────

function VocabChip({ term, meaning }: { term: string; meaning: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors ${
          open ? "bg-indigo-600 text-white" : "bg-white text-slate-700 hover:bg-indigo-50"
        }`}
      >
        <span>{term}</span>
        <span className="opacity-60">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-2 bg-indigo-50 border-t border-indigo-100">
          <p className="text-xs text-indigo-800 leading-relaxed">{meaning}</p>
        </div>
      )}
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
  const [revealed, setRevealed]   = useState(0); // 0 = no hints shown
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="space-y-3">
      {/* The question */}
      <div className="bg-white border-2 rounded-xl px-4 py-3" style={{ borderColor }}>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Your Turn</p>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">{question}</p>
      </div>

      {/* Hint buttons */}
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

      {/* Show solution */}
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

// ─── Retrieval Practice (flash-card style) ────────────────────────────────────

function RetrievalPractice({ questions }: { questions: string[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setRevealed((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="space-y-2">
      <p className="text-xs text-violet-600 italic mb-1">
        Try to answer each question in your head before revealing it.
      </p>
      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-violet-200 overflow-hidden">
          <button
            onClick={() => toggle(i)}
            className="w-full text-left px-4 py-3 bg-white hover:bg-violet-50 transition-colors"
          >
            <p className="text-sm font-semibold text-slate-700 leading-snug">{q}</p>
          </button>
          {revealed.has(i) && (
            <div className="px-4 py-2.5 bg-violet-50 border-t border-violet-100">
              <p className="text-xs text-violet-500 italic">Think it through — there's no answer shown. This is a recall exercise.</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Confidence MCQ ───────────────────────────────────────────────────────────

function ConfidenceMCQ({ data }: {
  data: { question: string; options: string[]; correctIndex: number; explanation: string }
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct  = selected === data.correctIndex;
  const answered = selected !== null;

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-800 leading-relaxed">{data.question}</p>
      <div className="space-y-2">
        {data.options.map((opt, i) => {
          let cls = "w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ";
          if (!answered)                   cls += "bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50";
          else if (i === data.correctIndex) cls += "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold";
          else if (i === selected)          cls += "bg-red-50 border-red-300 text-red-700";
          else                              cls += "bg-slate-50 border-slate-200 text-slate-400";
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

// ─── Full Lesson Renderer ─────────────────────────────────────────────────────

function LessonRenderer({ lesson, level, cfg }: {
  lesson: TeachingLesson;
  level:  ReadingLevel;
  cfg:    { color: string; light: string; border: string; icon: string };
}) {
  const isBasic    = level === "basic";
  const isAdvanced = level === "advanced";

  return (
    <div className="space-y-3">

      {/* ── SECTION 1: Before We Start ─────────────────────────────────────── */}
      <TeachingSection
        id="lesson-before"
        num={1}
        icon="🌟"
        title="Before We Start"
        headerBg="#f0fdf4"
        headerText="#15803d"
        borderColor="#bbf7d0"
        bodyBg="#f0fdf4"
        defaultOpen={true}
        hidden={false}
        badge={<span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Read this first</span>}
      >
        <div className="space-y-3">
          {lesson.beforeWeStart.motivator && (
            <div>
              <Label>Why are we learning this?</Label>
              <P>{lesson.beforeWeStart.motivator}</P>
            </div>
          )}
          {lesson.beforeWeStart.anxietyReducer && (
            <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">
              <p className="text-sm text-emerald-800 leading-relaxed italic">{lesson.beforeWeStart.anxietyReducer}</p>
            </div>
          )}
          {lesson.beforeWeStart.preview && (
            <div className="flex items-start gap-2.5 bg-emerald-100 rounded-xl px-4 py-3">
              <span className="text-lg mt-0.5 shrink-0">🎯</span>
              <P>{lesson.beforeWeStart.preview}</P>
            </div>
          )}
        </div>
      </TeachingSection>

      {/* ── SECTION 2: Prerequisites + Vocabulary ─────────────────────────── */}
      {(lesson.prerequisites.length > 0 || lesson.vocabulary.length > 0) && (
        <TeachingSection
          id="lesson-prereq"
          num={2}
          icon="📋"
          title="What You Need To Know First"
          headerBg="#f0f9ff"
          headerText="#0369a1"
          borderColor="#bae6fd"
          bodyBg="#f0f9ff"
          defaultOpen={isBasic}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Start here</span>}
        >
          <div className="space-y-3">
            {lesson.prerequisites.length > 0 && (
              <div>
                <Label>Concepts you need</Label>
                <div className="flex flex-wrap gap-1.5">
                  {lesson.prerequisites.map((p, i) => (
                    <span key={i} className="text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {lesson.vocabulary.length > 0 && (
              <div>
                <Label>Key words explained — tap to expand</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {lesson.vocabulary.map((v, i) => (
                    <VocabChip key={i} term={v.term} meaning={v.meaning} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 3: Intuition ──────────────────────────────────────────── */}
      {(lesson.intuition.story || lesson.intuition.visual || lesson.intuition.everyday) && (
        <TeachingSection
          id="lesson-intuition"
          num={3}
          icon="💡"
          title="Build Your Intuition First"
          headerBg="#fdf4ff"
          headerText="#7e22ce"
          borderColor="#e9d5ff"
          bodyBg="#fdf4ff"
          defaultOpen={isBasic}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Understand before solving</span>}
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
                <Label>Picture this in your mind 🎨</Label>
                <P>{lesson.intuition.visual}</P>
              </div>
            )}
            {lesson.intuition.everyday && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <Label>You've already seen this in real life</Label>
                <P>{lesson.intuition.everyday}</P>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 4: Question Translation ──────────────────────────────── */}
      {lesson.questionTranslation.plainEnglish && (
        <TeachingSection
          id="lesson-translate"
          num={4}
          icon="🔍"
          title="What Is The Question Asking?"
          headerBg="#fff7ed"
          headerText="#c2410c"
          borderColor="#fed7aa"
          bodyBg="#fff7ed"
          defaultOpen={isBasic || !isAdvanced}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Plain English</span>}
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

      {/* ── SECTION 5: Teacher Thinking ───────────────────────────────────── */}
      {lesson.teacherThinking.firstNotice && (
        <TeachingSection
          id="lesson-thinking"
          num={5}
          icon="🧠"
          title="Think Like A Teacher"
          headerBg="#f0f9ff"
          headerText="#0369a1"
          borderColor="#bae6fd"
          bodyBg="#f0f9ff"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Before you write anything</span>}
        >
          <div className="space-y-3">
            {lesson.teacherThinking.firstNotice && (
              <div>
                <Label>What to notice first</Label>
                <P>{lesson.teacherThinking.firstNotice}</P>
              </div>
            )}
            {lesson.teacherThinking.clues && (
              <div className="bg-white border border-sky-200 rounded-xl px-4 py-3">
                <Label>Hidden clues in the question</Label>
                <P>{lesson.teacherThinking.clues}</P>
              </div>
            )}
            {lesson.teacherThinking.whyThisMethod && (
              <div className="bg-sky-100 rounded-xl px-4 py-3">
                <Label>Why this method (and not another)?</Label>
                <P>{lesson.teacherThinking.whyThisMethod}</P>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 6: Guided Reasoning ─────────────────────────────────── */}
      {lesson.guidedReasoning.length > 0 && (
        <TeachingSection
          id="lesson-reasoning"
          num={6}
          icon="⚙️"
          title="Guided Reasoning — Step By Step"
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
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-3 py-2 mb-2">
              <span className="text-xs">💭</span>
              <p className="text-xs text-violet-700">Tap <strong>"Why this step?"</strong> under each step to understand the reasoning.</p>
            </div>
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

      {/* ── CONFUSION POINTS (inline after reasoning) ────────────────────── */}
      {lesson.confusionPoints.length > 0 && (
        <TeachingSection
          id="lesson-confusion"
          num={7}
          icon="🤔"
          title="Common Confusions — Answered"
          headerBg="#fffbeb"
          headerText="#b45309"
          borderColor="#fde68a"
          bodyBg="#fffbeb"
          defaultOpen={isBasic}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Clear your doubts</span>}
        >
          <div className="space-y-3">
            {lesson.confusionPoints.map((point, i) => (
              <div key={i} className="bg-white border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm text-amber-900 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 8: Common Mistakes ────────────────────────────────────── */}
      {lesson.commonMistakes.length > 0 && (
        <TeachingSection
          id="lesson-mistakes"
          num={8}
          icon="❌"
          title="Students Often Make These Mistakes"
          headerBg="#fef2f2"
          headerText="#b91c1c"
          borderColor="#fecaca"
          bodyBg="#fef2f2"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Watch out!</span>}
        >
          <div className="space-y-3">
            {lesson.commonMistakes.map((m, i) => (
              <MistakeDetailCard key={i} mistake={m} index={i} />
            ))}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 9: Examiner Thinking ──────────────────────────────────── */}
      {lesson.examinerThinking.whyAsked && (
        <TeachingSection
          id="lesson-examiner"
          num={9}
          icon="🎓"
          title="Examiner's Mind — Why This Question?"
          headerBg="#fffbeb"
          headerText="#b45309"
          borderColor="#fde68a"
          bodyBg="#fffbeb"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Exam strategy</span>}
        >
          <div className="space-y-3">
            {lesson.examinerThinking.whyAsked && (
              <div>
                <Label>Why this question was set</Label>
                <P>{lesson.examinerThinking.whyAsked}</P>
              </div>
            )}
            {lesson.examinerThinking.conceptTested && (
              <div className="bg-white border border-amber-200 rounded-xl px-4 py-2.5">
                <Label>Concept being tested</Label>
                <P>{lesson.examinerThinking.conceptTested}</P>
              </div>
            )}
            {lesson.examinerThinking.topperInsight && (
              <div className="bg-amber-100 rounded-xl px-4 py-3">
                <Label>What top scorers notice instantly</Label>
                <P>{lesson.examinerThinking.topperInsight}</P>
              </div>
            )}
            {lesson.examinerThinking.examTip && (
              <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">⭐</span>
                <div>
                  <Label>Exam tip</Label>
                  <P>{lesson.examinerThinking.examTip}</P>
                </div>
              </div>
            )}
            {lesson.examinerThinking.examTrap && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <span className="text-red-500 shrink-0 mt-0.5">⚠️</span>
                <div>
                  <Label>The trap that costs marks</Label>
                  <P>{lesson.examinerThinking.examTrap}</P>
                </div>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 10: Final Answer ───────────────────────────────────────── */}
      {lesson.finalAnswer.answer && (
        <TeachingSection
          id="lesson-answer"
          num={10}
          icon="✅"
          title="The Final Answer"
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
            {lesson.finalAnswer.whyCorrect && (
              <div>
                <Label>Why this is correct</Label>
                <P>{lesson.finalAnswer.whyCorrect}</P>
              </div>
            )}
            {lesson.finalAnswer.verification && (
              <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">
                <Label>Verification — substitute and check</Label>
                <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap font-mono text-xs">{lesson.finalAnswer.verification}</p>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span>✓</span><span>Answer verified — both sides match.</span>
                </div>
              </div>
            )}
          </div>
        </TeachingSection>
      )}

      {/* ── SECTION 11: Simpler Example ───────────────────────────────────── */}
      {lesson.simplerExample.problem && (
        <TeachingSection
          id="lesson-simpler"
          num={11}
          icon="📐"
          title="One Simpler Example"
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

      {/* ── SECTION 12: Practice Question with hints ──────────────────────── */}
      {lesson.practiceQuestion.question && (
        <TeachingSection
          id="lesson-practice"
          num={12}
          icon="✏️"
          title="Now You Try"
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

      {/* ── MCQ: Confidence Check ─────────────────────────────────────────── */}
      {lesson.confidenceCheck.question && lesson.confidenceCheck.options.length === 4 && (
        <TeachingSection
          id="lesson-mcq"
          num={13}
          icon="🎯"
          title="Quick Check — Test Yourself"
          headerBg="#f5f3ff"
          headerText="#5b21b6"
          borderColor="#ddd6fe"
          bodyBg="#f5f3ff"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">MCQ</span>}
        >
          <ConfidenceMCQ data={lesson.confidenceCheck} />
        </TeachingSection>
      )}

      {/* ── SECTION 14: Retrieval Practice ───────────────────────────────── */}
      {lesson.retrievalPractice.length > 0 && (
        <TeachingSection
          id="lesson-retrieval"
          num={14}
          icon="🔄"
          title="Retrieval Practice"
          headerBg="#fdf4ff"
          headerText="#7e22ce"
          borderColor="#e9d5ff"
          bodyBg="#fdf4ff"
          defaultOpen={true}
          hidden={false}
          badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Strengthen memory</span>}
        >
          <RetrievalPractice questions={lesson.retrievalPractice} />
        </TeachingSection>
      )}

      {/* ── SECTION 15: Remember These ────────────────────────────────────── */}
      {lesson.rememberThese.length > 0 && (
        <TeachingSection
          id="lesson-remember"
          num={15}
          icon="🏆"
          title="Remember These"
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

      {/* ── SECTION 16: Confidence Builder ────────────────────────────────── */}
      {lesson.confidenceBuilder && (
        <div className="rounded-2xl overflow-hidden border border-emerald-300 shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center gap-2.5">
            <span className="text-xl">🎉</span>
            <p className="text-sm font-black text-white">Look What You've Learned!</p>
          </div>
          <div className="bg-emerald-50 px-4 py-4">
            <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap">{lesson.confidenceBuilder}</p>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Mistake Detail Card (for lesson's structured commonMistakes) ─────────────

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

// ─── Legacy Steps Renderer (bank / fallback entries) ─────────────────────────

function LegacyRenderer({ solution, level, cfg }: {
  solution: AIResponse;
  level:    ReadingLevel;
  cfg:      { color: string; light: string; border: string };
}) {
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

      {/* Prerequisites + concept + understanding */}
      {(() => {
        const s = sec("prereq");
        const hasContent =
          (solution.prerequisites?.length ?? 0) > 0 ||
          Boolean(solution.conceptExplanation) ||
          Boolean(solution.questionUnderstanding);
        if (!hasContent) return null;
        return (
          <TeachingSection
            id={`prereq-${level}`} num={s.num} icon="📋"
            title="What You Need To Know First"
            headerBg="#f0f9ff" headerText="#0369a1" borderColor="#bae6fd" bodyBg="#f0f9ff"
            defaultOpen={s.defaultOpen} hidden={s.hidden && !hasContent}
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

      {/* Thinking */}
      {solution.thinkingProcess && (() => {
        const s = sec("thinking");
        return (
          <TeachingSection
            id={`thinking-${level}`} num={s.num} icon="💭"
            title="How Should You Think?"
            headerBg="#fdf4ff" headerText="#7e22ce" borderColor="#e9d5ff" bodyBg="#fdf4ff"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Before you write anything</span>}
          >
            <ThinkingCard thinkingProcess={solution.thinkingProcess} wordToMath={solution.wordToMath} />
          </TeachingSection>
        );
      })()}

      {/* Visual */}
      {solution.visualThinking?.trim() && (() => {
        const s = sec("visual");
        return (
          <TeachingSection
            id={`visual-${level}`} num={s.num} icon="🎨"
            title="See It Visually"
            headerBg="#fff7ed" headerText="#c2410c" borderColor="#fed7aa" bodyBg="#fff7ed"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Mental picture</span>}
          >
            <VisualCard visualThinking={solution.visualThinking} />
          </TeachingSection>
        );
      })()}

      {/* Steps */}
      {(() => {
        const s = sec("steps");
        return (
          <TeachingSection
            id={`steps-${level}`} num={s.num} icon="⚙️"
            title="Step-by-Step Solution"
            headerBg={cfg.light} headerText={cfg.color} borderColor={cfg.border}
            defaultOpen={true} hidden={false}
            badge={
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.border, color: cfg.color }}>
                {solution.steps.length} steps
              </span>
            }
          >
            <StepReasoningCard
              steps={solution.steps}
              finalAnswer={solution.finalAnswer}
              color={cfg.color} light={cfg.light} border={cfg.border} level={level}
            />
          </TeachingSection>
        );
      })()}

      {/* Verification */}
      {solution.verification && (() => {
        const s = sec("verify");
        return (
          <TeachingSection
            id={`verify-${level}`} num={s.num} icon="✓"
            title="Let's Verify The Answer"
            headerBg="#f0fdf4" headerText="#15803d" borderColor="#bbf7d0" bodyBg="#f0fdf4"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
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

      {/* Mistakes */}
      {(solution.commonMistakes?.length ?? 0) > 0 && (() => {
        const s = sec("mistakes");
        return (
          <TeachingSection
            id={`mistakes-${level}`} num={s.num} icon="❌"
            title="Students Often Make These Mistakes"
            headerBg="#fef2f2" headerText="#b91c1c" borderColor="#fecaca" bodyBg="#fef2f2"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Watch out!</span>}
          >
            <MistakeCard commonMistakes={solution.commonMistakes!} examTrap={solution.examTrap} />
          </TeachingSection>
        );
      })()}

      {/* Exam tip */}
      {solution.examTip && (() => {
        const s = sec("remember");
        return (
          <TeachingSection
            id={`examtip-${level}`} num={s.num} icon="⭐"
            title="Exam Shortcut"
            headerBg="#fffbeb" headerText="#b45309" borderColor="#fde68a" bodyBg="#fffbeb"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Only after understanding</span>}
          >
            <ExamTipCard examTip={solution.examTip} confusionPoint={solution.confusionPoint} />
          </TeachingSection>
        );
      })()}

      {/* Similar example */}
      {solution.similarExample?.problem && (() => {
        const s = sec("similar");
        return (
          <TeachingSection
            id={`similar-${level}`} num={s.num} icon="📐"
            title="One Simpler Example"
            headerBg="#f0fdfa" headerText="#0f766e" borderColor="#99f6e4" bodyBg="#f0fdfa"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
          >
            <WorkedExampleCard
              problem={solution.similarExample.problem}
              solution={solution.similarExample.solution ?? ""}
              borderColor="#0f766e"
            />
          </TeachingSection>
        );
      })()}

      {/* Practice question */}
      {solution.checkUnderstanding?.question && (() => {
        const s = sec("practice");
        return (
          <TeachingSection
            id={`practice-${level}`} num={s.num} icon="✅"
            title="Now You Try"
            headerBg="#f0fdf4" headerText="#15803d" borderColor="#bbf7d0" bodyBg="#f0fdf4"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
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

      {/* Conceptual questions */}
      {(solution.conceptualQuestions?.length ?? 0) > 0 && (() => {
        const s = sec("conceptual");
        return (
          <TeachingSection
            id={`conceptual-${level}`} num={s.num} icon="🧠"
            title="Check Your Understanding"
            headerBg="#fdf4ff" headerText="#7e22ce" borderColor="#e9d5ff" bodyBg="#fdf4ff"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Think, don't calculate</span>}
          >
            <UnderstandingCheck questions={solution.conceptualQuestions!} topic={solution.topic} />
          </TeachingSection>
        );
      })()}

      {/* Learning summary */}
      {(solution.learningSummary?.length ?? 0) > 0 && (() => {
        const s = sec("summary");
        return (
          <TeachingSection
            id={`summary-${level}`} num={s.num} icon="📚"
            title="Learning Summary"
            headerBg="#f0f9ff" headerText="#0369a1" borderColor="#bae6fd" bodyBg="#f0f9ff"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Max 6 points</span>}
          >
            <LearningSummary learningSummary={solution.learningSummary!} />
          </TeachingSection>
        );
      })()}

      {/* Memory */}
      {(solution.rememberThis || (solution.memoryShortcut?.length ?? 0) > 0) && (() => {
        const s = sec("summary");
        return (
          <TeachingSection
            id={`memory-${level}`}
            num={s.num + ((solution.learningSummary?.length ?? 0) > 0 ? 1 : 0)}
            icon="🏆" title="Remember This"
            headerBg="#fffbeb" headerText="#b45309" borderColor="#fde68a" bodyBg="#fffbeb"
            defaultOpen={false} hidden={s.hidden}
          >
            <MemoryCard
              memoryShortcut={solution.memoryShortcut}
              examTip={solution.rememberThis ? undefined : solution.examTip}
              rememberThis={solution.rememberThis}
            />
          </TeachingSection>
        );
      })()}

      {/* MCQ */}
      {solution.confidenceCheck?.question && (() => {
        const s = sec("mcq");
        return (
          <TeachingSection
            id={`mcq-${level}`} num={s.num} icon="🎯"
            title="Quick Check — Test Yourself"
            headerBg="#f5f3ff" headerText="#5b21b6" borderColor="#ddd6fe" bodyBg="#f5f3ff"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
            badge={<span className="text-[9px] font-bold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">MCQ</span>}
          >
            <ConfidenceMCQ data={solution.confidenceCheck} />
          </TeachingSection>
        );
      })()}

      {/* Reflection (learning loop) */}
      {(solution.conceptualQuestions?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-violet-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-violet-600 flex items-center gap-2.5">
            <span className="text-base">🔄</span>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-100">Learning Loop</p>
            </div>
            <span className="text-[9px] font-bold bg-violet-500 text-violet-100 px-2 py-0.5 rounded-full">Track mastery</span>
          </div>
          <div className="px-4 pb-4 pt-3 bg-white border-t border-violet-100">
            <ReflectionCard questions={solution.conceptualQuestions!} topic={solution.topic} />
          </div>
        </div>
      )}

      {/* Deeper theory */}
      {solution.deeperExplanation && (() => {
        const s = sec("deeper");
        return (
          <TeachingSection
            id={`deeper-${level}`} num={s.num} icon="🔬"
            title="Deeper Theory"
            headerBg="#1e1b4b" headerText="#c7d2fe" borderColor="#4338ca" bodyBg="#1e1b4b"
            defaultOpen={s.defaultOpen} hidden={s.hidden}
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

// ─── Main export ──────────────────────────────────────────────────────────────

interface Props {
  solution: AIResponse;
  level:    ReadingLevel;
}

export default function TeachingLayout({ solution, level }: Props) {
  const cfg = SUBJECTS[solution.subject as Subject];

  // If the solution has a TeachingLesson, render the interactive lesson view
  if (solution.lesson) {
    console.log(
      `[PIPELINE:C1] RENDERER=LessonRenderer (new teaching pipeline) — source="${solution.source}" topic="${solution.lesson.topic}" keyConcepts=${solution.lesson.keyConcepts.length} guidedSteps=${solution.lesson.guidedReasoning.length}`
    );
    return (
      <LessonRenderer
        lesson={solution.lesson}
        level={level}
        cfg={cfg}
      />
    );
  }

  // Legacy fallback: bank / fallback entries still use the old steps[] renderer
  console.log(
    `[PIPELINE:C1] RENDERER=LegacyRenderer (legacy path) — source="${solution.source}" steps=${(solution as { steps?: unknown[] }).steps?.length ?? 0}`
  );
  return (
    <LegacyRenderer solution={solution} level={level} cfg={cfg} />
  );
}
