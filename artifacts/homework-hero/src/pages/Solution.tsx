import { useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProfile } from "@/hooks/useProfile";
import { normalizeBoardId } from "@/data/questions/academicContext";
import { useProgress } from "@/hooks/useProgress";
import { useRevisionPlanner, type SelfAssessmentStatus } from "@/hooks/useRevisionPlanner";
import { solve, type AIResponse } from "@/services/aiSolver";
import {
  callDevLesson,
  clearBankFailureMarker,
  createImmediatePracticeBankFallback,
  getBankCachedLesson,
  isValidFrozenBankSolution,
  logBankLessonTiming,
  resolveBankFailureFallback,
  toAIResponse,
  type BankQuestionContext,
} from "@/services/ai/openaiSolver";
import {
  getChapterDisplayNumber,
  getQuestionById,
  getQuestionDisplayNumber,
  getStudentFacingSubject,
  preloadQBank,
  type Difficulty,
} from "@/services/questionService";
import type { Subject } from "@/data/subjects";
import { hashQuestionContent, resolvePreGeneratedBankLesson } from "@/data/preGeneratedLessons";
import {
  applyCanonicalBankMetadata,
  getCanonicalPracticeMetadata,
} from "@/services/canonicalPracticeMetadata";
import { getSolutionScrollTarget } from "@/services/solutionPageKeyboardScroll";
import { useStreak } from "@/hooks/useStreak";
import SolutionCard from "@/components/SolutionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import SimilarQuestions from "@/components/SimilarQuestions";
import SocraticTutor from "@/components/socratic/SocraticTutor";
import { getMasteryEntry } from "@/services/studentModel";

type PageState = "loading" | "done" | "error";

export default function Solution() {
  const { session, update } = useSession();
  const { profile } = useProfile();
  const boardId = normalizeBoardId(profile.board);
  const classNum = session.practiceClassNum ?? profile.classLevel ?? undefined;
  const { recordSolve, recordPractice } = useProgress(classNum);
  const { setSelfAssessment, selfAssessments } = useRevisionPlanner(classNum);
  const { completeToday } = useStreak();
  const cfg = SUBJECTS[session.subject];

  const [pageState, setPageState]   = useState<PageState>("loading");
  const [solution, setSolution]     = useState<AIResponse | null>(null);
  const [solveError, setSolveError] = useState<string | null>(null);
  const [integrityNotice, setIntegrityNotice] = useState<string | null>(null);
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
  const [visibleChapterName, setVisibleChapterName] = useState<string | null>(null);
  const [visiblePracticeSubject, setVisiblePracticeSubject] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target instanceof HTMLElement ? event.target : null;
      if (
        target?.closest(
          'input, textarea, select, [contenteditable="true"], [contenteditable="plaintext-only"], ' +
          '[role="textbox"], [role="combobox"], [role="listbox"], [role="option"], [role="slider"], ' +
          '[role="spinbutton"], [role="menu"], [role="menuitem"], [role="tablist"], [role="tab"], ' +
          '[role="radio"], [role="tree"], [role="treeitem"]',
        )
      ) {
        return;
      }

      let ancestor = target;
      while (ancestor && ancestor !== document.body && ancestor !== document.documentElement) {
        const style = window.getComputedStyle(ancestor);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          ancestor.scrollHeight > ancestor.clientHeight
        ) {
          return;
        }
        ancestor = ancestor.parentElement;
      }

      const scroller = document.scrollingElement ?? document.documentElement;
      const nextTop = getSolutionScrollTarget(event.key, {
        scrollTop: scroller.scrollTop,
        scrollHeight: scroller.scrollHeight,
        clientHeight: window.innerHeight || scroller.clientHeight,
      });
      if (nextTop === null || Math.abs(nextTop - scroller.scrollTop) < 1) return;

      event.preventDefault();
      window.scrollTo({ top: nextTop, behavior: "auto" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const solutionParams = new URLSearchParams(window.location.search);
  // Practice mode preserves a question ID in the URL so a direct load or
  // immediate route transition can still resolve the frozen bank question.
  const practiceMode = solutionParams.get("practiceMode") === "1";
  const savedAnswerMode = practiceMode && solutionParams.get("savedAnswer") === "1";
  const returnToExam = practiceMode && solutionParams.get("returnTo") === "/exam";
  const practiceQuestionId = solutionParams.get("questionId") ?? session.practiceQuestionId;

  // ── In-flight guard ──────────────────────────────────────────────────────────
  // Serializes solver runs for THIS component instance. Under wouter's
  // `key={location}` remount and React's lazy/Suspense resolution, useEffect can
  // fire runSolver() more than once before the first run's async pre-generated
  // lookup resolves. Without a guard, a second concurrent run can slip past the
  // pre-generated return and initiate a paid streaming POST for a question whose
  // valid static lesson is still being awaited. This ref lets a run bail out
  // immediately if another run is already resolving.
  const solveInFlight = useRef(false);

  const runSolver = useCallback(async () => {
    // A run is already resolving for this instance — do not start a second one.
    // Prevents concurrent runs from independently reaching the streaming
    // fallback while the pre-generated lookup is still PENDING.
    if (solveInFlight.current) return;
    solveInFlight.current = true;
    try {
      await runSolverInner();
    } finally {
      solveInFlight.current = false;
    }
  }, [session.subject, session.question, session.ocrConfidence, practiceMode, savedAnswerMode, practiceQuestionId]);

  const runSolverInner = useCallback(async () => {
    setPageState("loading");
    setSolution(null);
    setSolveError(null);
    setIntegrityNotice(null);
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
    // ── Bank question path: saved full lesson or frozen explanation ───────────
      // Practice always serves local approved content. It never starts a paid
      // generation request when a valid question-bank explanation is available.
      if (practiceMode && practiceQuestionId) {
        await preloadQBank();
        const bankQ = getQuestionById(practiceQuestionId, boardId ?? undefined, classNum);
        if (!bankQ || !isValidFrozenBankSolution(bankQ)) {
          throw new Error("bank_solution_unavailable");
        }
        if (bankQ) {
          setVisibleQuestionNumber(getQuestionDisplayNumber(bankQ) ?? null);
          setVisibleChapterName(bankQ.chapterName ?? null);
          setVisibleChapterNumber(
            getChapterDisplayNumber(bankQ.classNum, bankQ.subject, bankQ.chapterId, bankQ.boardId) ?? null,
          );
          setVisiblePracticeSubject(getStudentFacingSubject(bankQ.subject));
          update({ practiceTopic: bankQ.topicName });

          // Explicit saved-answer view: render the complete bank steps and
          // canonical answer immediately, without resolving a generated lesson.
          if (savedAnswerMode) {
            const fallback = createImmediatePracticeBankFallback(bankQ);
            if (!fallback) throw new Error("bank_solution_unavailable");
            setSolution(applyCanonicalBankMetadata(fallback, bankQ));
            setPageState("done");
            return;
          }

          const sourceHash = hashQuestionContent(bankQ);
          const bankContext: BankQuestionContext = {
            questionId:  bankQ.id,
            sourceHash,
            boardId:     bankQ.boardId!,
            classNum:    bankQ.classNum,
            subject:     bankQ.subject,
            canonicalChapterId: bankQ.canonicalChapterId ?? null,
            academicSession: bankQ.academicSession,
            answer:      bankQ.answer,
            hint:        bankQ.hint,
            steps:       bankQ.steps,
            keyConcepts: bankQ.keyConcepts,
          };

          // Lesson viewing alone is not a practice outcome. The explicit
          // self-assessment controls below record genuine, deduplicated practice.
          // ── Persistent derived lesson: instant display, 0 AI calls ──────────
          // GUARANTEED INVARIANT (Prompt #027 P0-A): the pre-generated lookup is
          // awaited to a DEFINITIVE resolution before any fallback is reachable.
          // resolvePreGeneratedBankLesson() waits for the lazy chapter chunk
          // and validates its source fingerprint before returning a full lesson.
          const preGeneratedStartedAt = performance.now();
          const resolution = await resolvePreGeneratedBankLesson(bankQ);
          logBankLessonTiming(
            "pre-generated",
            resolution.status === "VALID" ? "hit" : "miss",
            performance.now() - preGeneratedStartedAt,
          );
          if (resolution.status === "VALID") {
            clearBankFailureMarker(bankQ.id);
            logBankLessonTiming("final-ready", "pre-generated", performance.now() - preGeneratedStartedAt);
            setSolution(applyCanonicalBankMetadata(resolution.response, bankQ));
            setPageState("done");
            return;
          }

          // ── Secondary browser cache: instant display, 0 AI calls ────────────
          const browserCacheStartedAt = performance.now();
          const cached = getBankCachedLesson(bankQ.id, bankContext, bankQ.question);
          logBankLessonTiming(
            "browser-cache",
            cached ? "hit" : "miss",
            performance.now() - browserCacheStartedAt,
          );
          if (cached) {
            clearBankFailureMarker(bankQ.id);
            logBankLessonTiming("final-ready", "browser-cache", performance.now() - browserCacheStartedAt);
            setSolution(applyCanonicalBankMetadata(cached, bankQ));
            setPageState("done");
            return;
          }

          const priorFailure = resolveBankFailureFallback(bankQ, sourceHash);
          if (priorFailure) {
            setIntegrityNotice(priorFailure.notice);
            setSolution(applyCanonicalBankMetadata(priorFailure.response, bankQ));
            setPageState("done");
            return;
          }

          // All bank questions that pass the validity check above have a saved
          // explanation. Use it immediately when no complete saved lesson exists.
          const fallback = createImmediatePracticeBankFallback(bankQ);
          if (!fallback) throw new Error("bank_solution_unavailable");
          logBankLessonTiming("final-ready", "frozen-bank-explanation", performance.now() - preGeneratedStartedAt);
          setSolution(applyCanonicalBankMetadata(fallback, bankQ));
          setPageState("done");
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
  }, [session.subject, session.question, session.ocrConfidence, practiceMode, savedAnswerMode, practiceQuestionId]);

  useEffect(() => { runSolver(); }, []);

  const practiceAssessment = practiceQuestionId
    ? selfAssessments[practiceQuestionId]?.status ?? "UNSET"
    : "UNSET";

  const setPracticeAssessment = (status: Exclude<SelfAssessmentStatus, "UNSET">) => {
    if (!practiceQuestionId) return;
    const bankQuestion = getQuestionById(practiceQuestionId, boardId ?? undefined, classNum);
    if (!bankQuestion) return;
    const metadata = getCanonicalPracticeMetadata(bankQuestion);

    recordPractice(metadata.subject, metadata.topicName, metadata.questionId);
    completeToday();
    setSelfAssessment(
      {
        questionId: metadata.questionId,
        question: metadata.question,
        subject: metadata.subject,
        topic: metadata.topicName,
        chapter: metadata.chapterName,
        difficulty: metadata.difficulty,
      },
      status,
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          {returnToExam && (
            <div className="mb-3">
              <Link
                href="/exam"
                data-testid="button-return-to-exam"
                className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                ← Return to Exam
              </Link>
            </div>
          )}
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
            {visibleChapterName && (
              <p className="mt-0.5 truncate text-xs text-slate-500" title={visibleChapterName}>
                {visibleChapterName}
              </p>
            )}
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
            {savedAnswerMode && (
              <div
                role="note"
                data-testid="status-saved-answer-mode"
                className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950"
              >
                <p className="font-semibold">Saved question-bank explanation · no AI generation</p>
                <p className="mt-1 text-xs leading-relaxed">
                  This uses the approved question-bank steps and answer in the same lesson layout.
                </p>
              </div>
            )}
            {integrityNotice && (
              <div
                role="status"
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              >
                {integrityNotice}
              </div>
            )}
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
            {practiceMode && practiceQuestionId && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
                  How did you do?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPracticeAssessment("CONFIDENT")}
                    data-testid={`button-self-assessment-confident-${practiceQuestionId}`}
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
                    data-testid={`button-self-assessment-needs-practice-${practiceQuestionId}`}
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
    </div>
  );
}
