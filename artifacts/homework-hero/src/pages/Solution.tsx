import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProgress } from "@/hooks/useProgress";
import { useRevisionPlanner, type SelfAssessmentStatus } from "@/hooks/useRevisionPlanner";
import { solve, type AIResponse } from "@/services/aiSolver";
import { callDevLesson, toAIResponse, solveBankWithStream, getBankCachedLesson, type BankQuestionContext } from "@/services/ai/openaiSolver";
import {
  getChapterDisplayNumber,
  getQuestionById,
  getQuestionDisplayNumber,
  getStudentFacingSubject,
  preloadQBank,
  type Difficulty,
} from "@/services/questionService";
import type { Subject } from "@/data/subjects";
import { getPreGeneratedBankLesson } from "@/data/preGeneratedLessons";
import SolutionCard from "@/components/SolutionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimilarQuestions from "@/components/SimilarQuestions";
import SocraticTutor from "@/components/socratic/SocraticTutor";
import FloatingPageNavigation from "@/components/FloatingPageNavigation";
import { getMasteryEntry } from "@/services/studentModel";

type PageState = "loading" | "done" | "error";

export default function Solution() {
  const { session, update } = useSession();
  const { recordSolve, recordPractice } = useProgress();
  const { setSelfAssessment, selfAssessments } = useRevisionPlanner();
  const cfg = SUBJECTS[session.subject];

  const [pageState, setPageState]   = useState<PageState>("loading");
  const [solution, setSolution]     = useState<AIResponse | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [phaseMsg, setPhaseMsg]     = useState("");
  const [phaseIdx, setPhaseIdx]     = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);
  const [showSimilar, setShowSimilar] = useState(false);
  const [showTutor,   setShowTutor]   = useState(false);
  // null = not yet rated, false = got it, true = needs review
  const [needsReview, setNeedsReview] = useState<boolean | null>(null);
  const [visibleQuestionNumber, setVisibleQuestionNumber] = useState<number | null>(null);
  const [visibleChapterNumber, setVisibleChapterNumber] = useState<number | null>(null);
  const [visiblePracticeSubject, setVisiblePracticeSubject] = useState<string | null>(null);

  const solutionParams = new URLSearchParams(window.location.search);
  // Practice mode preserves a question ID in the URL so a direct load or
  // immediate route transition can still resolve the frozen bank question.
  const practiceMode = solutionParams.get("practiceMode") === "1";
  const practiceQuestionId = solutionParams.get("questionId") ?? session.practiceQuestionId;

  const runSolver = useCallback(async () => {
    setPageState("loading");
    setSolution(null);
    setSolveError(null);
    setShowSimilar(false);
    setNeedsReview(null);

    // ── Dev audit mode: ?audit=1 bypasses session/OpenAI, loads fixture direct ──
    const auditMode = new URLSearchParams(window.location.search).get("audit") === "1";
    if (auditMode) {
      const raw = await callDevLesson();
      const mapped = toAIResponse(raw, "Mathematics", "Proof that √2 is Irrational");
      setSolution(mapped);
      setPageState("done");
      return;
    }

    try {
    // ── Bank question path: streaming TeachingLesson grounded in frozen answer ─
      // Step 1: check localStorage cache by questionId (7-day TTL) — 0 AI calls.
      // Step 2: cache miss → stream full Detailed lesson grounded in frozen bank
      //         answer via POST /api/solveQuestion/stream with bankContext.
      //         First content ≤2 s target; onPartial renders progressively.
      // Step 3: on completion, cache lesson by questionId for future instant loads.
      // One lesson serves all 3 teaching modes — switching is instant, 0 AI calls.
      if (practiceMode && practiceQuestionId) {
        await preloadQBank();
        const bankQ = getQuestionById(practiceQuestionId);
        if (bankQ) {
          setVisibleQuestionNumber(getQuestionDisplayNumber(bankQ) ?? null);
          setVisibleChapterNumber(
            getChapterDisplayNumber(bankQ.classNum, bankQ.subject, bankQ.chapterId) ?? null,
          );
          setVisiblePracticeSubject(getStudentFacingSubject(bankQ.subject));
          const bankContext: BankQuestionContext = {
            questionId:  bankQ.id,
            answer:      bankQ.answer,
            hint:        bankQ.hint,
            steps:       bankQ.steps,
            keyConcepts: bankQ.keyConcepts,
          };

          // Lesson viewing alone is not a practice outcome. The explicit
          // self-assessment controls below record genuine, deduplicated practice.
          update({ practiceTopic: bankQ.topicName });

          // ── Persistent derived lesson: instant display, 0 AI calls ──────────
          // This is validated against the current frozen question source on every
          // lookup. Missing/stale entries intentionally continue to the existing
          // secondary localStorage cache and then the unchanged SSE path.
          const preGenerated = await getPreGeneratedBankLesson(bankQ);
          if (preGenerated) {
            setSolution(preGenerated);
            setPageState("done");
            return;
          }

          // ── Secondary browser cache: instant display, 0 AI calls ────────────
          const cached = getBankCachedLesson(bankQ.id);
          if (cached) {
            setSolution(cached);
            setPageState("done");
            return;
          }

          // ── Cache miss: stream a full TeachingLesson anchored to frozen answer ─
          // onPartial fires on first keyConcepts or step (≤2 s) → switches from
          // loading spinner to solution card while remaining sections arrive.
          // flushSync forces an immediate React re-render on each partial so the
          // student sees content within 2–3 s instead of waiting for the full
          // 20-22 s stream. Without flushSync, React 18 automatic batching defers
          // all setSolution/setPageState updates inside the async SSE reading loop
          // until the stream completes — causing the spinner to spin for 20+ s.
          try {
            const result = await solveBankWithStream(
              bankQ.subject as Subject,
              bankQ.question,
              bankContext,
              (partial) => {
                flushSync(() => {
                  setSolution(partial);
                  setPageState("done"); // switch from spinner to card on first content
                });
              },
            );
            setSolution(result);
            setPageState("done");
          } catch (err) {
            // Streaming failed — show the minimal bank entry so student isn't stuck
            console.warn("[BANK:STREAM] TeachingLesson generation failed:", String(err));
            setSolution({
              id:               `bank-${bankQ.id}`,
              subject:          bankQ.subject as Subject,
              topic:            bankQ.topicName,
              difficulty:       bankQ.difficulty,
              detectedQuestion: bankQ.question,
              keyConcepts:      bankQ.keyConcepts,
              steps:            bankQ.steps,
              finalAnswer:      bankQ.answer,
              similarQuestions: [],
              source:           "bank",
            });
            setPageState("done");
          }
          return;
        }
      }

      // ── AI path: new or unmatched question — full pipeline ───────────────────
      // onPartial fires progressively during Standard-mode SSE streaming:
      // show the card immediately with whatever content has arrived so far,
      // then replace it with the complete lesson when solve() resolves.
      // flushSync: same reason as bank path — force immediate re-render so
      // content appears within seconds, not at stream completion.
      const onPartial = (partial: AIResponse) => {
        flushSync(() => {
          setSolution(partial);
          setPageState("done");
        });
      };

      const result = await solve(
        session.subject,
        session.question,
        session.ocrConfidence ?? 1,
        (msg, idx) => { setPhaseMsg(msg); setPhaseIdx(idx); },
        practiceMode ? { requireLesson: true } : undefined,
        (msg, pct) => { setProgressMsg(msg); setProgressPct(pct); },
        onPartial,
      );

      setSolution(result);
      const topicKey = (practiceMode && session.practiceTopic)
        ? session.practiceTopic
        : result.topic;
      if (!practiceMode) {
        recordSolve(session.subject, topicKey, true);
      }
      update({ practiceTopic: result.topic });

      setPageState("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[PRACTICE:PIPELINE] ✗ Pipeline failed — "${msg}"`);
      setSolveError(msg);
      setPageState("error");
    }
  }, [session.subject, session.question, session.ocrConfidence, practiceMode, practiceQuestionId]);

  useEffect(() => { runSolver(); }, []);

  const practiceAssessment = practiceQuestionId
    ? selfAssessments[practiceQuestionId]?.status ?? "UNSET"
    : "UNSET";

  const setPracticeAssessment = (status: Exclude<SelfAssessmentStatus, "UNSET">) => {
    if (!practiceQuestionId) return;
    const bankQuestion = getQuestionById(practiceQuestionId);
    if (!bankQuestion) return;

    recordPractice(bankQuestion.subject as Subject, bankQuestion.topicName, bankQuestion.id);
    setSelfAssessment(
      {
        questionId: bankQuestion.id,
        question: bankQuestion.question,
        subject: bankQuestion.subject as Subject,
        topic: bankQuestion.topicName,
        chapter: bankQuestion.chapterName,
        difficulty: bankQuestion.difficulty,
      },
      status,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          {/* Top navigation — Chapter + Questions (practice mode only) */}
          {practiceMode && session.practiceChapterId && (
            <div className="flex items-center gap-2 mb-3">
              <Link href="/practice">
                <button className="flex items-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all">
                  ← Chapter
                </button>
              </Link>
              <Link href={`/practice?chapter=${encodeURIComponent(session.practiceChapterId)}`}>
                <button className="flex items-center gap-1 text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all">
                  ← Questions
                </button>
              </Link>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900">Solution</h1>
            <p className="text-sm mt-0.5 truncate" style={{ color: cfg.color }}>
              {cfg.icon} {visiblePracticeSubject ?? session.subject}
              {visibleChapterNumber !== null && <> · Ch {visibleChapterNumber}</>}
              {solution && <> · {solution.topic}</>}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">

        {/* Loading state */}
        {pageState === "loading" && (
          <LoadingSpinner
            subject={session.subject}
            currentPhase={phaseMsg}
            phaseIndex={phaseIdx}
            progressMsg={progressMsg}
            progressPct={progressPct}
          />
        )}

        {/* Error state */}
        {pageState === "error" && (
          <div className="fade-up space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-3">
              <p className="text-3xl">⚠️</p>
              <p className="font-bold text-red-700 text-base">Couldn't generate a solution</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Something went wrong on our end. Please try again — if the problem continues, try a different question.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                 onClick={() => void runSolver()}
                className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all"
              >
                ↻ Retry
              </button>
              <Link href="/practice">
                <button className="w-full py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                  ← Practice
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Solution content */}
        {pageState === "done" && solution && (
          <div className="space-y-5 fade-up">
            {practiceMode && visibleQuestionNumber !== null && (
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Question detected · Q{visibleQuestionNumber}
              </p>
            )}

            <SolutionCard
              key={solution.id}
              solution={solution}
            />

            {/* ── Socratic Tutor Panel ───────────────────────────────────── */}
            {showTutor && solution && (
              <SocraticTutor
                topic={solution.topic}
                subject={session.subject}
                initialMastery={getMasteryEntry(solution.topic, session.subject)?.masteryScore ?? 40}
                onClose={() => setShowTutor(false)}
              />
            )}

            {/* ── Practice mode self-assessment ──────────────────────────── */}
            {practiceMode && session.practiceQuestionId && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
                  How did you do?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPracticeAssessment("CONFIDENT")}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 ${
                      practiceAssessment === "CONFIDENT"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    ✓ I Am Confident
                  </button>
                  <button
                    onClick={() => setPracticeAssessment("NEEDS_PRACTICE")}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all active:scale-95 ${
                      practiceAssessment === "NEEDS_PRACTICE"
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100"
                    }`}
                  >
                    ↻ Need More Practice
                  </button>
                </div>
                {practiceAssessment !== "UNSET" && (
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    {practiceAssessment === "CONFIDENT"
                      ? "Saved as your confidence check-in."
                      : "Saved for your revision practice."}
                  </p>
                )}
              </div>
            )}

            {/* ── Self-assessment wording for non-bank solution flows ───────── */}
            {!practiceMode && needsReview === null && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-3 text-center">How did you find this?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNeedsReview(false)}
                    className="py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all"
                  >
                    ✓ I Am Confident
                  </button>
                  <button
                    onClick={() => setNeedsReview(true)}
                    className="py-2.5 rounded-xl text-sm font-semibold border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 active:scale-95 transition-all"
                  >
                    ↻ Need More Practice
                  </button>
                </div>
              </div>
            )}

            {/* ── Need More Practice confirmation — no action panel ─────── */}
            {needsReview === true && (
              <p className="text-center text-xs text-slate-500 fade-up py-1">
                We’ll help you practise this again.
              </p>
            )}

            {!practiceMode && (
              <div className="flex items-center justify-end">
                <Link href="/scan">
                  <button className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                    ← New Question
                  </button>
                </Link>
              </div>
            )}

            {/* ── Bottom navigation — Chapter + Questions (practice mode only) ── */}
            {practiceMode && session.practiceChapterId && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/practice">
                  <button className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                    ← Chapter
                  </button>
                </Link>
                <Link href={`/practice?chapter=${encodeURIComponent(session.practiceChapterId)}`}>
                  <button className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all text-center">
                    ← Questions
                  </button>
                </Link>
              </div>
            )}

          </div>
        )}
      </div>
      <FloatingPageNavigation />
    </div>
  );
}
