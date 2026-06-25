/**
 * SocraticTutor — the main interactive Socratic tutoring UI.
 *
 * Renders a chat-like conversation between the AI tutor and the student.
 * Handles the full session lifecycle:
 *   intro → question → student answer → assessment → (praise / reteach / hint) → repeat
 *   → mastery confirmed → reflection → done
 *
 * Props:
 *   topic          — the topic to tutor (from the solution)
 *   subject        — subject (Mathematics / Physics / Chemistry)
 *   initialMastery — current mastery score from studentModel (0–100)
 *   onClose        — callback to dismiss the tutor panel
 */
import { useState, useRef, useEffect, useCallback } from "react";
import type { TutorSessionState }  from "@/services/socratic/socraticEngine";
import {
  startTutorSession,
  askNextQuestion,
  processStudentAnswer,
  requestNextHint,
  endSession,
  getTutorMasteryProgress,
} from "@/services/socratic/socraticEngine";
import { hintLevelWarning, hintLevelLabel } from "@/services/socratic/guidedHintEngine";
import { getMasteryProgressLabel }            from "@/services/socratic/masteryAssessment";
import { buildStudentContext }                from "@/services/studentModel";
import TutorMessage                           from "./TutorMessage";

interface Props {
  topic:          string;
  subject:        string;
  initialMastery: number;
  onClose:        () => void;
}

type InputMode = "answering" | "waiting" | "done";

const STATE_BANNERS: Partial<Record<string, { text: string; color: string }>> = {
  assessing:  { text: "Analysing your answer…",         color: "text-slate-500" },
  praising:   { text: "Great answer — well done!",      color: "text-emerald-600" },
  reteaching: { text: "Let's revisit this concept…",    color: "text-orange-600" },
  hinting:    { text: "Generating hint…",               color: "text-amber-600" },
  mastered:   { text: "🏆 Mastery confirmed!",          color: "text-violet-600" },
  reflecting: { text: "Generating your session report…",color: "text-slate-500" },
};

export default function SocraticTutor({ topic, subject, initialMastery, onClose }: Props) {
  const [sessionState, setSessionState] = useState<TutorSessionState | null>(null);
  const [inputValue,   setInputValue]   = useState("");
  const [inputMode,    setInputMode]    = useState<InputMode>("waiting");
  const [sessionDone,  setSessionDone]  = useState(false);
  const [hintLevel,    setHintLevel]    = useState(0);
  const [isLoading,    setIsLoading]    = useState(false);
  const [masteryPct,   setMasteryPct]   = useState(initialMastery);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  // Sync state helper — avoids stale closures
  const update = useCallback((s: TutorSessionState) => {
    setSessionState({ ...s });
    setMasteryPct(s.session.currentMastery);
    setHintLevel(s.hintLevel);
  }, []);

  // ── Session start ────────────────────────────────────────────────────────
  useEffect(() => {
    const state = startTutorSession({ topic, subject, initialMastery });
    update(state);
    setIsLoading(true);

    const ctx = buildStudentContext(subject, topic);
    askNextQuestion(state, ctx ?? undefined, update).then((s) => {
      update(s);
      setInputMode("answering");
      setIsLoading(false);
      inputRef.current?.focus();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-scroll to bottom ────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sessionState?.session.messages.length]);

  // ── Submit answer ────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!sessionState || !inputValue.trim() || isLoading) return;
    const answer = inputValue.trim();
    setInputValue("");
    setInputMode("waiting");
    setIsLoading(true);

    const updated = await processStudentAnswer(sessionState, answer, update);

    if (updated.state === "mastered") {
      setInputMode("done");
      setIsLoading(false);
      return;
    }

    // After praise or reteach, ask next question
    if (updated.state === "praising" || updated.state === "reteaching") {
      const next = await askNextQuestion(updated, undefined, update);
      update(next);
      setHintLevel(0);
    }
    setInputMode("answering");
    setIsLoading(false);
    inputRef.current?.focus();
  }

  // ── Request hint ─────────────────────────────────────────────────────────
  async function handleHint() {
    if (!sessionState || isLoading) return;
    setIsLoading(true);
    const updated = await requestNextHint(sessionState, update);
    update(updated);
    setIsLoading(false);
    inputRef.current?.focus();
  }

  // ── End session ──────────────────────────────────────────────────────────
  async function handleEndSession() {
    if (!sessionState || isLoading) return;
    setIsLoading(true);
    setInputMode("done");
    const { state: finalState } = await endSession(sessionState, update);
    update(finalState);
    setSessionDone(true);
    setIsLoading(false);
  }

  // ── Key handler ──────────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const messages  = sessionState?.session.messages ?? [];
  const state     = sessionState?.state ?? "idle";
  const banner    = STATE_BANNERS[state];
  const progress  = sessionState ? getTutorMasteryProgress(sessionState) : 0;
  const nextHint  = hintLevel + 1;
  const canHint   = !isLoading && inputMode === "answering" && nextHint <= 5;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-indigo-200 shadow-lg overflow-hidden"
      style={{ maxHeight: "80vh", minHeight: "400px" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-white font-bold text-sm">🎓 AI Socratic Tutor</p>
          <p className="text-indigo-200 text-xs">{topic} · {subject}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-lg leading-none w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
        >
          ✕
        </button>
      </div>

      {/* ── Mastery progress bar ─────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {getMasteryProgressLabel(topic, subject)}
          </span>
          <span className="text-[10px] font-bold text-indigo-600">{masteryPct}/100</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: progress >= 1 ? "#10b981" : "#4f46e5",
            }}
          />
        </div>
        {/* Mini stats */}
        {sessionState && (
          <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-medium">
            <span>❓ {sessionState.session.questionsAsked} asked</span>
            <span>✓ {sessionState.session.correctAnswers} correct</span>
            <span>💡 {sessionState.session.hintsUsed} hints</span>
          </div>
        )}
      </div>

      {/* ── State banner ─────────────────────────────────────────────────── */}
      {banner && (
        <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <p className={`text-xs font-semibold ${banner.color}`}>{banner.text}</p>
        </div>
      )}

      {/* ── Messages ─────────────────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg) => (
          <TutorMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Input area ───────────────────────────────────────────────────── */}
      {!sessionDone && (
        <div className="border-t border-slate-200 px-4 py-3 flex-shrink-0 space-y-2">

          {/* Hint button row */}
          {canHint && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleHint}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition-all"
              >
                💡 {hintLevelLabel(nextHint)}
                {nextHint >= 2 && <span className="text-[9px] opacity-70">Level {nextHint}</span>}
              </button>
              {hintLevelWarning(nextHint) && (
                <span className="text-[10px] text-amber-600 opacity-80">{hintLevelWarning(nextHint)}</span>
              )}
            </div>
          )}

          {inputMode === "answering" && (
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Type your answer… (Enter to submit)"
                className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all placeholder-slate-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                className="h-10 px-4 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              >
                →
              </button>
            </div>
          )}

          {inputMode === "waiting" && !isLoading && (
            <div className="text-center py-1">
              <p className="text-xs text-slate-400">Preparing next question…</p>
            </div>
          )}

          {inputMode === "done" && !sessionDone && (
            <div className="flex gap-2">
              <button
                onClick={handleEndSession}
                disabled={isLoading}
                className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {isLoading ? "Generating report…" : "✓ Finish Session & Get Report"}
              </button>
            </div>
          )}

          {/* End session early */}
          {inputMode === "answering" && !isLoading && sessionState && sessionState.session.questionsAsked >= 2 && (
            <div className="text-center">
              <button
                onClick={handleEndSession}
                className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
              >
                End session early & get summary
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Done state ───────────────────────────────────────────────────── */}
      {sessionDone && (
        <div className="border-t border-slate-200 px-4 py-4 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all"
            >
              ✓ Done — back to solution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
