import { useState, useCallback } from "react";
import { Link } from "wouter";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { SOLUTION_BANK, type AIResponse } from "@/data/solutionBank";
import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import { computeConfidenceBreakdown } from "@/services/confidenceEngine";
import ConfidenceMeter from "@/components/ConfidenceMeter";

// ─── Per-topic academic metadata ───────────────────────────────────────────────
const TOPIC_META: Record<string, {
  shortExplanation: string;
  chapter: string;
  commonMistakes: string[];
  practiceTips: string[];
}> = {
  "Quadratic Equations": {
    chapter: "Algebra — Class 10",
    shortExplanation:
      "A quadratic is a degree-2 polynomial ax² + bx + c = 0. The discriminant b²−4ac determines whether roots are real, repeated, or complex. The quadratic formula is universal; factoring is faster when coefficients are small integers.",
    commonMistakes: [
      "Dropping the ± in the quadratic formula — both roots must be computed.",
      "Writing b²−4c instead of b²−4ac for the discriminant.",
      "Not rearranging to standard form before applying the formula.",
    ],
    practiceTips: [
      "Compute the discriminant first to predict the nature of roots.",
      "For integer coefficients, attempt factoring before using the formula.",
      "Always verify both roots by substituting back into the equation.",
    ],
  },
  "Linear Equations": {
    chapter: "Algebra — Class 6–8",
    shortExplanation:
      "A linear equation has degree 1. The strategy is to isolate the variable by applying inverse operations equally to both sides. Every valid step preserves the balance of the equation.",
    commonMistakes: [
      "Adding to only one side when moving a term across the equals sign.",
      "Forgetting to distribute when expanding brackets before isolating x.",
      "Dividing by the coefficient before clearing constants from the variable side.",
    ],
    practiceTips: [
      "Clear fractions by multiplying through by the LCD before anything else.",
      "Expand all brackets and collect like terms on each side first.",
      "A quick check: substitute your answer back and confirm both sides are equal.",
    ],
  },
  "Simultaneous Equations": {
    chapter: "Algebra — Class 9–10",
    shortExplanation:
      "Two equations with two unknowns. Elimination multiplies equations to make one variable's coefficient equal then cancels it. Substitution expresses one variable in terms of the other and substitutes into the second equation.",
    commonMistakes: [
      "Subtracting equations incorrectly — sign errors are the most common failure.",
      "Using the wrong equation for back-substitution after finding the first variable.",
      "Not verifying the solution in both original equations.",
    ],
    practiceTips: [
      "Label equations (1) and (2) clearly before starting — it prevents confusion.",
      "Prefer elimination when coefficients are easy to match; substitution otherwise.",
      "The solution is a coordinate pair (x, y) — always present it as such.",
    ],
  },
  "Kinematics": {
    chapter: "Motion — Class 9–11",
    shortExplanation:
      "Kinematics describes motion under uniform acceleration using three equations of motion. The key is identifying which of the five quantities (u, v, a, t, s) are known and which is required, then selecting the equation that links them.",
    commonMistakes: [
      "Using km/h instead of m/s — always convert to SI units before substituting.",
      "Ignoring sign convention: deceleration is negative acceleration.",
      "Confusing scalar speed with vector velocity when direction matters.",
    ],
    practiceTips: [
      "Write a given/find table before choosing an equation — it prevents guessing.",
      "For free-fall problems, take downward as positive to keep signs consistent.",
      "Double-check units in the final answer; m/s² for acceleration, m for displacement.",
    ],
  },
  "Newton's Laws of Motion": {
    chapter: "Force & Laws of Motion — Class 9–11",
    shortExplanation:
      "Newton's Second Law F_net = ma connects net force to acceleration. Draw a free-body diagram first to identify all forces. Resolve forces along each axis separately and apply ΣF = ma per axis.",
    commonMistakes: [
      "Including reaction forces from Newton's Third Law in the same FBD — they act on different bodies.",
      "Forgetting friction acts opposite to the direction of motion.",
      "Using total force instead of net force in F = ma.",
    ],
    practiceTips: [
      "Always draw the free-body diagram before writing any equations.",
      "Choose an axis along the direction of acceleration to simplify resolution.",
      "For connected bodies, treat them as a system first to find acceleration, then isolate to find tension.",
    ],
  },
  "Work, Power & Energy": {
    chapter: "Work & Energy — Class 9–11",
    shortExplanation:
      "Work W = Fd cosθ; only the force component along displacement does work. Kinetic energy KE = ½mv² and potential energy PE = mgh. Conservation of energy holds when only conservative forces act; friction converts mechanical energy to heat.",
    commonMistakes: [
      "Using the full force F instead of F cosθ when force is not parallel to displacement.",
      "Forgetting the direction of work — negative work means force opposes displacement.",
      "Applying conservation of energy to systems with friction without subtracting energy lost.",
    ],
    practiceTips: [
      "Check whether non-conservative forces exist before applying simple conservation of energy.",
      "Power = Work / Time in watts; check that time is in seconds.",
      "For height problems, set the reference level for PE at the lowest point to avoid negatives.",
    ],
  },
  "Balancing Chemical Equations": {
    chapter: "Chemical Reactions — Class 9–10",
    shortExplanation:
      "Balancing applies the Law of Conservation of Mass: atoms cannot be created or destroyed. Adjust integer coefficients in front of formulae only — never alter subscripts inside a formula.",
    commonMistakes: [
      "Changing subscripts inside a formula (e.g., H₂O to H₃O) instead of adjusting coefficients.",
      "Not checking every element after balancing — one overlooked element breaks the equation.",
      "Leaving coefficients in a non-simplified ratio (e.g., 2:4 instead of 1:2).",
    ],
    practiceTips: [
      "Balance the most complex or least common element first.",
      "Leave hydrogen and oxygen until last in combustion equations.",
      "Build an atom-count table as you go — it catches errors immediately.",
    ],
  },
  "Stoichiometry & Mole Concept": {
    chapter: "Mole Concept — Class 11",
    shortExplanation:
      "One mole = 6.022×10²³ particles. Convert mass → moles → (via ratio) → moles of product → mass or volume. The limiting reagent is the one that runs out first and sets the maximum yield.",
    commonMistakes: [
      "Using an unbalanced equation for the mole ratio — always balance first.",
      "Confusing molar mass (g/mol) with number of moles (mol).",
      "Forgetting to identify the limiting reagent when two reactant masses are given.",
    ],
    practiceTips: [
      "The mole ratio comes directly from the coefficients of the balanced equation.",
      "At STP, 1 mol of any gas occupies 22.4 L — memorise this.",
      "Percentage yield = (actual yield / theoretical yield) × 100%.",
    ],
  },
};

const FALLBACK_META = {
  chapter: "Academic Question",
  shortExplanation: "Follow the step-by-step solution carefully. Understand each step before moving to the next.",
  commonMistakes: [
    "Rushing through steps without understanding the reasoning behind each one.",
    "Not checking the final answer by substituting back into the original problem.",
  ],
  practiceTips: [
    "Read the question twice before starting to ensure you know what is being asked.",
    "Attempt the problem independently before revealing the full solution.",
  ],
};

// ─── Collapsible section component ─────────────────────────────────────────────
function Section({
  title,
  icon,
  defaultOpen = false,
  accentColor,
  children,
}: {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  accentColor: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-sm font-semibold text-slate-800">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Save for Revision hook ─────────────────────────────────────────────────────
const SAVED_KEY = "studyai-saved-topics";
function loadSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]")); } catch { return new Set(); }
}
function persistSaved(s: Set<string>) {
  localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
}

// ─── Main page ─────────────────────────────────────────────────────────────────
const SUBJECTS_LIST: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function QuestionWorkspace() {
  const { getSubjectStats, recordSolve, progress } = useProgress();
  const { streak } = useStreak();

  const [subject, setSubject]       = useState<Subject>("Mathematics");
  const [entryIdx, setEntryIdx]     = useState(0);
  const [understood, setUnderstood] = useState<Set<string>>(new Set());
  const [saved, setSaved]           = useState<Set<string>>(loadSaved);
  const [justUnderstood, setJustUnderstood] = useState(false);

  const cfg          = SUBJECTS[subject];
  const bankEntries  = SOLUTION_BANK.filter((e) => e.subject === subject);
  const entry: AIResponse = bankEntries[entryIdx % bankEntries.length] ?? SOLUTION_BANK[0];
  const meta         = TOPIC_META[entry.topic] ?? FALLBACK_META;
  const formulaSteps = entry.steps.filter((s) => s.formula);

  // Per-topic mastery from progress
  const subjectData = progress[subject] ?? {};
  const topicRecord = subjectData[entry.topic];
  const masteryPct  = topicRecord
    ? Math.round((topicRecord.correct / topicRecord.solved) * 100)
    : null;

  const topicKey = `${subject}::${entry.topic}`;
  const isUnderstood = understood.has(topicKey);
  const isSaved      = saved.has(topicKey);

  const handleSubjectChange = (s: Subject) => {
    setSubject(s);
    setEntryIdx(0);
    setJustUnderstood(false);
  };

  const handleTryAnother = () => {
    setEntryIdx((i) => i + 1);
    setJustUnderstood(false);
  };

  const handleMarkUnderstood = () => {
    if (isUnderstood) return;
    recordSolve(subject, entry.topic, true);
    setUnderstood((s) => new Set(s).add(topicKey));
    setJustUnderstood(true);
  };

  const handleSave = () => {
    setSaved((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(topicKey) : next.add(topicKey);
      persistSaved(next);
      return next;
    });
  };

  const stats = getSubjectStats(subject);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Question Workspace</h1>
              <p className="text-sm text-slate-500 mt-0.5">Deep-dive academic study</p>
            </div>
            {/* Subtle streak */}
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-semibold text-amber-700">{streak} day streak</span>
              </div>
            )}
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUBJECTS_LIST.map((s) => {
              const c = SUBJECTS[s];
              const active = s === subject;
              return (
                <button
                  key={s}
                  onClick={() => handleSubjectChange(s)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active ? "text-white border-transparent shadow-sm" : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={active ? { backgroundColor: c.color } : {}}
                >
                  {c.icon} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4">

        {/* ── Question card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Accent bar */}
          <div className="h-1" style={{ backgroundColor: cfg.color }} />
          <div className="p-5">
            {/* Chapter + difficulty row */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
              >
                {cfg.icon} {meta.chapter}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                entry.difficulty === "Easy"   ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                entry.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-red-50 text-red-700 border-red-200"
              }`}>
                {entry.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto">{entry.topic}</span>
            </div>

            {/* Question display */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Question</p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{entry.detectedQuestion}</p>
            </div>

            {/* Topic mastery bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-slate-500 font-medium">Topic Mastery: {entry.topic}</p>
                <p className="text-xs font-bold" style={{ color: cfg.color }}>
                  {masteryPct !== null ? `${masteryPct}%` : "Not attempted"}
                </p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${masteryPct ?? 0}%`, backgroundColor: cfg.color }}
                />
              </div>
              {stats.totalSolved > 0 && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {stats.totalSolved} solved this subject · {stats.accuracy}% accuracy overall
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Confidence Meter ── */}
        {(() => {
          const bd = computeConfidenceBreakdown({
            ocrConf:   1,
            topicConf: 1,
            bankScore: 40,
            aiConf:    1,
            source:    "bank",
          });
          return (
            <Section title="Answer Confidence" icon="◎" defaultOpen accentColor={cfg.color}>
              <ConfidenceMeter breakdown={bd} />
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                This is a verified question-bank entry. All four confidence signals are at 100%
                because the question, topic, and solution are curated by academic reviewers.
              </p>
            </Section>
          );
        })()}

        {/* ── Quick Explanation ── */}
        <Section title="Quick Explanation" icon="◎" defaultOpen accentColor={cfg.color}>
          <p className="text-sm text-slate-700 leading-relaxed">{meta.shortExplanation}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {entry.keyConcepts.map((c) => (
              <span
                key={c}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200"
              >
                {c}
              </span>
            ))}
          </div>
        </Section>

        {/* ── Full Solution ── */}
        <Section title="Full Step-by-Step Solution" icon="⊟" defaultOpen accentColor={cfg.color}>
          <div className="space-y-3">
            {entry.steps.map((step) => (
              <div key={step.stepNumber} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.color }}
                >
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.explanation}</p>
                  {step.formula && (
                    <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">{step.formula}</p>
                    </div>
                  )}
                  {step.result && (
                    <div
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5"
                      style={{ backgroundColor: cfg.light, color: cfg.color }}
                    >
                      → {step.result}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Final answer */}
          <div
            className="mt-5 rounded-2xl border p-4"
            style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: cfg.color }}>
              ✦ Final Answer
            </p>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">{entry.finalAnswer}</p>
          </div>
        </Section>

        {/* ── Formula Reference ── */}
        {formulaSteps.length > 0 && (
          <Section title="Formula Reference" icon="ƒ" accentColor={cfg.color}>
            <div className="space-y-2.5">
              {formulaSteps.map((step) => (
                <div key={step.stepNumber} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">{step.title}</p>
                  <p className="text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {step.formula}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Common Mistakes ── */}
        <Section title="Common Mistakes to Avoid" icon="⚠" accentColor={cfg.color}>
          <div className="space-y-2.5">
            {meta.commonMistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3">
                <span className="text-red-400 font-bold text-sm flex-shrink-0 mt-0.5">✗</span>
                <p className="text-sm text-red-700 leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Practice Tips ── */}
        <Section title="Practice Tips" icon="✦" accentColor={cfg.color}>
          <div className="space-y-2.5">
            {meta.practiceTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.color }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Action buttons ── */}
        <div className="space-y-3 pt-1 pb-4">

          {/* Mark as Understood */}
          <button
            onClick={handleMarkUnderstood}
            disabled={isUnderstood}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isUnderstood
                ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                : "text-white shadow-sm"
            }`}
            style={!isUnderstood ? { backgroundColor: cfg.color } : {}}
          >
            {isUnderstood ? (
              <><span>✓</span> Marked as Understood{justUnderstood ? " — well done!" : ""}</>
            ) : (
              <><span>✓</span> Mark as Understood</>
            )}
          </button>

          {/* Secondary row */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/practice">
              <button
                className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-95 transition-all text-center"
              >
                ✎ Practice Similar
              </button>
            </Link>
            <button
              onClick={handleTryAnother}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-95 transition-all"
            >
              ↻ Try Another
            </button>
          </div>

          {/* Save for revision */}
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm border-2 transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isSaved
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <span>{isSaved ? "★" : "☆"}</span>
            {isSaved ? "Saved for Revision" : "Save for Revision"}
          </button>
        </div>

      </div>
    </div>
  );
}
