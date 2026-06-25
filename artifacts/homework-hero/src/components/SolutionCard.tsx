import { useState } from "react";
import type { AIResponse } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";
import ConfidenceMeter    from "@/components/ConfidenceMeter";
import VerificationBadge  from "@/components/VerificationBadge";
import TeacherReviewPanel from "@/components/TeacherReviewPanel";

interface Props { solution: AIResponse }

// ─── Difficulty level ─────────────────────────────────────────────────────────

type Level = "basic" | "standard" | "advanced";
const LEVEL_KEY = "studyai-reading-level";

function getStoredLevel(): Level {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (v === "basic" || v === "standard" || v === "advanced") return v;
  } catch {}
  return "basic";
}

// For each section × level: "open" | "closed" | "hidden"
type Vis = "open" | "closed" | "hidden";

const SECTION_VIS: Record<string, Record<Level, Vis>> = {
  prereq:    { basic: "open",   standard: "closed", advanced: "closed" },
  understand:{ basic: "open",   standard: "open",   advanced: "hidden" },
  wordMath:  { basic: "open",   standard: "closed", advanced: "hidden" },
  steps:     { basic: "open",   standard: "open",   advanced: "open"   },
  mistakes:  { basic: "closed", standard: "closed", advanced: "closed" },
  verify:    { basic: "closed", standard: "closed", advanced: "hidden" },
  remember:  { basic: "closed", standard: "closed", advanced: "closed" },
  similar:   { basic: "closed", standard: "closed", advanced: "hidden" },
  check:     { basic: "closed", standard: "closed", advanced: "closed" },
  mcq:       { basic: "closed", standard: "closed", advanced: "hidden" },
  deeper:    { basic: "hidden", standard: "closed", advanced: "open"   },
};

// ─── Diff badge ────────────────────────────────────────────────────────────────

const DIFF_BADGE: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

// ─── AccordionCard ────────────────────────────────────────────────────────────

function AccordionCard({
  id, num, icon, title,
  headerBg, headerText, borderColor, bodyBg,
  vis, badge, children,
}: {
  id:          string;
  num:         number;
  icon:        string;
  title:       string;
  headerBg:    string;
  headerText:  string;
  borderColor: string;
  bodyBg?:     string;
  vis:         Vis;
  badge?:      React.ReactNode;
  children:    React.ReactNode;
}) {
  const [open, setOpen] = useState(vis === "open");
  if (vis === "hidden") return null;

  return (
    <div
      key={id}
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{ borderColor }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:brightness-95"
        style={{ background: headerBg }}
      >
        <span className="text-base flex-shrink-0 leading-none">{icon}</span>
        <div className="flex-1 min-w-0">
          <p
            className="text-[10px] font-black uppercase tracking-wider leading-none"
            style={{ color: headerText }}
          >
            {num}. {title}
          </p>
        </div>
        {badge && <span className="flex-shrink-0 mr-1">{badge}</span>}
        <span className="text-[10px] font-bold flex-shrink-0" style={{ color: headerText }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="px-4 pb-4 pt-3 border-t"
          style={{ background: bodyBg ?? "#ffffff", borderColor }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── StepCard ─────────────────────────────────────────────────────────────────

function StepCard({
  step, color, light, border, level,
}: {
  step:   NonNullable<AIResponse["steps"]>[0];
  color:  string;
  light:  string;
  border: string;
  level:  Level;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
          style={{ backgroundColor: color }}
        >
          {step.stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug">{step.title}</p>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{step.explanation}</p>

          {level !== "advanced" && step.whyThisStep && (
            <div className="mt-2.5 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
              <span className="text-[10px] font-black text-indigo-500 flex-shrink-0 mt-0.5 tracking-widest">WHY</span>
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
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: light, color, borderColor: border }}
            >
              <span>→</span>
              <span>{step.result}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ConfidenceMCQ ────────────────────────────────────────────────────────────

function ConfidenceMCQ({
  data,
}: {
  data: NonNullable<AIResponse["confidenceCheck"]>;
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
          if (!answered) {
            cls += "bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50";
          } else if (i === data.correctIndex) {
            cls += "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold";
          } else if (i === selected) {
            cls += "bg-red-50 border-red-300 text-red-700";
          } else {
            cls += "bg-slate-50 border-slate-200 text-slate-400";
          }
          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              className={cls}
              disabled={answered}
            >
              <span className="font-bold mr-2">{["A", "B", "C", "D"][i]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`rounded-xl px-4 py-3 border ${
            correct
              ? "bg-emerald-50 border-emerald-200"
              : "bg-amber-50 border-amber-200"
          }`}
        >
          <p
            className={`text-xs font-bold mb-1 ${
              correct ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            {correct ? "✓ Correct! Well done." : "Not quite — but that's okay."}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{data.explanation}</p>
          {!correct && (
            <button
              onClick={() => setSelected(null)}
              className="mt-2 text-xs font-semibold text-violet-600 hover:underline"
            >
              Try again →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RevealBlock ──────────────────────────────────────────────────────────────

function RevealBlock({
  prompt, revealLabel, content, borderColor,
}: {
  prompt:      string;
  revealLabel: string;
  content:     string;
  borderColor: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border p-3 bg-white"
        style={{ borderColor }}
      >
        <p className="text-sm text-slate-700 leading-relaxed">{prompt}</p>
      </div>
      {!revealed && (
        <p className="text-xs text-slate-400 text-center italic">
          Try solving this yourself first.
        </p>
      )}
      {revealed ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Solution
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{content}</p>
          <button
            onClick={() => setRevealed(false)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hide ↑
          </button>
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 rounded-xl border text-xs font-bold transition-all"
          style={{ borderColor, color: borderColor }}
        >
          {revealLabel} ↓
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SolutionCard({ solution }: Props) {
  const [level, setLevel] = useState<Level>(getStoredLevel);

  const cfg   = SUBJECTS[solution.subject as Subject];
  const isAI  = solution.source === "openai";

  function changeLevel(l: Level) {
    setLevel(l);
    try { localStorage.setItem(LEVEL_KEY, l); } catch {}
  }

  // Helper to get visibility for a section
  const vis = (key: string) => SECTION_VIS[key]?.[level] ?? "closed";

  // Section numbering — only count sections that aren't hidden
  const sections = [
    "prereq", "understand", "wordMath", "steps",
    "mistakes", "verify", "remember", "similar",
    "check", "mcq", "deeper",
  ];
  let sectionNum = 0;
  const numOf = (key: string) => {
    let n = 0;
    for (const k of sections) {
      if (vis(k) !== "hidden") n++;
      if (k === key) return n;
    }
    return n;
  };

  void sectionNum; // suppresses unused warning

  return (
    <div className="space-y-3">

      {/* ── Difficulty mode selector ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Explanation Depth
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {([
            { key: "basic",    label: "Basic",    hint: "Every tiny step",  color: "bg-emerald-500 text-white border-emerald-500" },
            { key: "standard", label: "Standard", hint: "Key content",       color: "bg-blue-500 text-white border-blue-500" },
            { key: "advanced", label: "Advanced", hint: "Exam-focused",      color: "bg-violet-500 text-white border-violet-500" },
          ] as const).map(({ key, label, hint, color }) => (
            <button
              key={key}
              onClick={() => changeLevel(key)}
              className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                level === key
                  ? color
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div>{label}</div>
              <div className={`text-[9px] font-normal mt-0.5 leading-none ${level === key ? "opacity-80" : "opacity-50"}`}>
                {hint}
              </div>
            </button>
          ))}
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

      {/* ── Detected question ─────────────────────────────────────────────── */}
      {solution.detectedQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Question Detected
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.detectedQuestion}</p>
        </div>
      )}

      {/* ── Encouraging banner ────────────────────────────────────────────── */}
      {level === "basic" && (
        <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2.5">
          <span className="text-base">🙌</span>
          <p className="text-xs text-indigo-700 leading-relaxed">
            <span className="font-bold">Take it one step at a time.</span>{" "}
            Don't worry if this looks difficult — we'll solve it together.
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — What You Need To Know First                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(solution.prerequisites?.length ?? 0) > 0 && (
        <AccordionCard
          id={`prereq-${level}`}
          num={numOf("prereq")}
          icon="📋"
          title="What You Need To Know First"
          headerBg="#f0f9ff"
          headerText="#0369a1"
          borderColor="#bae6fd"
          bodyBg="#f0f9ff"
          vis={vis("prereq")}
        >
          <p className="text-xs text-sky-700 mb-3 italic">
            Assume you've forgotten the chapter — here's the bare minimum you need before we solve this.
          </p>
          <ul className="space-y-2.5">
            {solution.prerequisites!.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-200 border border-sky-300 flex items-center justify-center text-[9px] font-bold text-sky-800 mt-0.5"
                >
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — Understanding The Question                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.questionUnderstanding && (
        <AccordionCard
          id={`understand-${level}`}
          num={numOf("understand")}
          icon="🤔"
          title="Understanding The Question"
          headerBg="#eff6ff"
          headerText="#1d4ed8"
          borderColor="#bfdbfe"
          bodyBg="#eff6ff"
          vis={vis("understand")}
          badge={
            <span className="text-[9px] font-bold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
              Remove fear first
            </span>
          }
        >
          {solution.conceptExplanation && (
            <div className="mb-3 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                Concept
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{solution.conceptExplanation}</p>
            </div>
          )}
          <p className="text-sm text-slate-700 leading-relaxed">{solution.questionUnderstanding}</p>
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — Translate Words Into Mathematics                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.wordToMath && (
        <AccordionCard
          id={`wordMath-${level}`}
          num={numOf("wordMath")}
          icon="🔢"
          title="Translate Words Into Mathematics"
          headerBg="#eef2ff"
          headerText="#3730a3"
          borderColor="#c7d2fe"
          bodyBg="#eef2ff"
          vis={vis("wordMath")}
        >
          <p className="text-xs text-indigo-600 mb-3 italic">
            Never jump straight to equations. Let's convert each sentence into maths first.
          </p>
          <div className="bg-white border border-indigo-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-mono text-[12px]">
              {solution.wordToMath}
            </p>
          </div>
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — Step-by-Step Solution (always visible)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AccordionCard
        id={`steps-${level}`}
        num={numOf("steps")}
        icon="⚙️"
        title="Step-by-Step Solution"
        headerBg={cfg.light}
        headerText={cfg.color}
        borderColor={cfg.border}
        vis="open"
        badge={
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: cfg.border, color: cfg.color }}
          >
            {solution.steps.length} steps
          </span>
        }
      >
        <div className="space-y-3">
          {solution.steps.map((step) => (
            <StepCard
              key={step.stepNumber}
              step={step}
              color={cfg.color}
              light={cfg.light}
              border={cfg.border}
              level={level}
            />
          ))}
        </div>

        {/* Final Answer inside Section 4 */}
        <div
          className="mt-4 rounded-2xl border p-4"
          style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
        >
          <p className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color: cfg.color }}>
            ✦ Final Answer
          </p>
          <p className="text-[15px] font-bold text-slate-900 leading-relaxed">
            {solution.finalAnswer}
          </p>
        </div>
      </AccordionCard>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — Common Mistakes                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(solution.commonMistakes?.length ?? 0) > 0 && (
        <AccordionCard
          id={`mistakes-${level}`}
          num={numOf("mistakes")}
          icon="❌"
          title="Students Often Make These Mistakes"
          headerBg="#fef2f2"
          headerText="#b91c1c"
          borderColor="#fecaca"
          bodyBg="#fef2f2"
          vis={vis("mistakes")}
          badge={
            <span className="text-[9px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
              Watch out!
            </span>
          }
        >
          <ul className="space-y-2.5">
            {solution.commonMistakes!.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="flex-shrink-0 mt-0.5 text-red-500 font-bold leading-none">✗</span>
                <span className="leading-relaxed">{m}</span>
              </li>
            ))}
          </ul>
          {solution.examTrap && (
            <div className="mt-3 bg-red-100 border border-red-200 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
                🪤 Common Exam Trap
              </p>
              <p className="text-xs text-red-900 leading-relaxed">{solution.examTrap}</p>
            </div>
          )}
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — Verify The Answer                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.verification && (
        <AccordionCard
          id={`verify-${level}`}
          num={numOf("verify")}
          icon="✓"
          title="Let's Verify The Answer"
          headerBg="#f0fdf4"
          headerText="#15803d"
          borderColor="#bbf7d0"
          bodyBg="#f0fdf4"
          vis={vis("verify")}
        >
          <p className="text-xs text-emerald-700 mb-3 italic">
            Every solution must verify itself. Let's substitute the answer back in.
          </p>
          <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {solution.verification}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span>✓</span>
            <span>Answer verified — both sides match.</span>
          </div>
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — Remember This                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {((solution.memoryShortcut?.length ?? 0) > 0 || solution.examTip) && (
        <AccordionCard
          id={`remember-${level}`}
          num={numOf("remember")}
          icon="⭐"
          title="Remember This"
          headerBg="#fffbeb"
          headerText="#b45309"
          borderColor="#fde68a"
          bodyBg="#fffbeb"
          vis={vis("remember")}
        >
          {solution.memoryShortcut && solution.memoryShortcut.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {solution.memoryShortcut.map((s, i) => (
                <span
                  key={i}
                  className="text-xs font-bold bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          {solution.examTip && (
            <p className="text-sm text-amber-900 leading-relaxed">{solution.examTip}</p>
          )}
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 8 — One Similar Example                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.similarExample?.problem && (
        <AccordionCard
          id={`similar-${level}`}
          num={numOf("similar")}
          icon="📐"
          title="One Similar Example"
          headerBg="#f0fdfa"
          headerText="#0f766e"
          borderColor="#99f6e4"
          bodyBg="#f0fdfa"
          vis={vis("similar")}
        >
          <p className="text-xs text-teal-700 mb-3 italic">
            A different question, same idea — reinforces the concept.
          </p>
          <RevealBlock
            prompt={solution.similarExample.problem}
            revealLabel="Reveal Solution"
            content={solution.similarExample.solution ?? ""}
            borderColor="#0f766e"
          />
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 9 — Check Your Understanding                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.checkUnderstanding?.question && (
        <AccordionCard
          id={`check-${level}`}
          num={numOf("check")}
          icon="✅"
          title="Check Your Understanding"
          headerBg="#f0fdf4"
          headerText="#15803d"
          borderColor="#86efac"
          bodyBg="#f0fdf4"
          vis={vis("check")}
        >
          <p className="text-xs text-green-700 mb-3 italic">
            Try solving this new question on your own before revealing the answer.
          </p>
          <RevealBlock
            prompt={solution.checkUnderstanding.question}
            revealLabel="Reveal Answer"
            content={solution.checkUnderstanding.answer ?? ""}
            borderColor="#15803d"
          />
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 10 — Confidence Check (MCQ)                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {solution.confidenceCheck && (
        <AccordionCard
          id={`mcq-${level}`}
          num={numOf("mcq")}
          icon="🎯"
          title="Confidence Check"
          headerBg="#faf5ff"
          headerText="#6d28d9"
          borderColor="#ddd6fe"
          bodyBg="#faf5ff"
          vis={vis("mcq")}
          badge={
            <span className="text-[9px] font-bold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">
              MCQ
            </span>
          }
        >
          <p className="text-xs text-violet-700 mb-3 italic">
            Test your conceptual understanding — not just the answer.
          </p>
          <ConfidenceMCQ data={solution.confidenceCheck} />
        </AccordionCard>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 11 — Deeper Explanation                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {(solution.deeperExplanation || (solution.additionalExamples?.length ?? 0) > 0) && (
        <AccordionCard
          id={`deeper-${level}`}
          num={numOf("deeper")}
          icon="🔬"
          title="Deeper Explanation"
          headerBg="#faf5ff"
          headerText="#7c3aed"
          borderColor="#e9d5ff"
          bodyBg="#faf5ff"
          vis={vis("deeper")}
          badge={
            <span className="text-[9px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
              Class 11–12
            </span>
          }
        >
          {solution.deeperExplanation && (
            <p className="text-sm text-slate-700 leading-relaxed">{solution.deeperExplanation}</p>
          )}
          {(solution.additionalExamples?.length ?? 0) > 0 && (
            <div className={solution.deeperExplanation ? "mt-4" : ""}>
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2.5">
                Additional Examples
              </p>
              <div className="space-y-2">
                {solution.additionalExamples!.map((ex, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                    <p className="text-sm text-slate-700 leading-relaxed">{ex}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionCard>
      )}

      {/* ── Teacher Review ────────────────────────────────────────────────── */}
      <TeacherReviewPanel solution={solution} />

    </div>
  );
}
