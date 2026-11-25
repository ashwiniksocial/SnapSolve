/**
 * Socratic Engine — the Tutor Mode state machine.
 *
 * States:
 *  IDLE         — no active tutoring session
 *  EXPLAINING   — student is reading the explanation (before tutor asks)
 *  QUESTIONING  — tutor has asked a question, waiting for student response
 *  ASSESSING    — processing student response (loading)
 *  PRAISING     — student answered correctly
 *  RETEACHING   — misconception detected, tutor is reteaching
 *  HINTING      — student requested a hint
 *  MASTERED     — topic mastery demonstrated (session can end)
 *  REFLECTING   — end-of-session reflection
 *
 * The engine coordinates: dialogueEngine, conceptQuestionEngine,
 * masteryAssessment, misconceptionEngine, guidedHintEngine.
 */

import { generateConceptQuestion } from "./conceptQuestionEngine";
import { recordAnswer, getMasteryProgress } from "./masteryAssessment";
import { recordMisconception, markReteaught } from "./misconceptionEngine";
import { requestHint } from "./guidedHintEngine";
import {
  createSession, addMessage, completeSession, getSession,
  type SocraticSession, type DialogueMessage,
} from "./dialogueEngine";

const BASE_URL = import.meta.env?.BASE_URL ?? "/";

export type TutorState =
  | "idle" | "explaining" | "questioning" | "assessing"
  | "praising" | "reteaching" | "hinting" | "mastered" | "reflecting";

export interface TutorSessionState {
  session:        SocraticSession;
  state:          TutorState;
  currentQuestion: string;
  currentQuestionId: string;
  hintLevel:      number;       // 0 = no hints yet, 1–5 = current hint level
  questionStart:  number;       // timestamp when question was shown
  misconceptionId?: string;
}

// ── Active session (single-instance, per-topic) ───────────────────────────────

let _active: TutorSessionState | null = null;

export function getActiveTutorSession(): TutorSessionState | null {
  return _active;
}

export function setActiveTutorSession(s: TutorSessionState | null): void {
  _active = s;
}

// ── Session lifecycle ─────────────────────────────────────────────────────────

export function startTutorSession(opts: {
  topic:         string;
  subject:       string;
  initialMastery: number;
}): TutorSessionState {
  const session = createSession(opts.topic, opts.subject, opts.initialMastery);

  const intro = `Welcome to your personal tutoring session on **${opts.topic}** (${opts.subject}).\n\nI won't just explain — I'll check that you've actually understood. We'll work through this together, and you can ask for hints if you get stuck.\n\nLet's begin.`;
  addMessage(session, "tutor", "intro", intro);

  const state: TutorSessionState = {
    session,
    state:            "explaining",
    currentQuestion:  "",
    currentQuestionId: "",
    hintLevel:        0,
    questionStart:    Date.now(),
  };

  _active = state;
  return state;
}

/** Transition to QUESTIONING — ask the first (or next) conceptual question. */
export async function askNextQuestion(
  state: TutorSessionState,
  studentContext?: string,
  onUpdate?: (s: TutorSessionState) => void
): Promise<TutorSessionState> {
  const q = await generateConceptQuestion({
    topic:         state.session.topic,
    subject:       state.session.subject,
    masteryScore:  state.session.currentMastery,
    studentContext,
  });

  addMessage(state.session, "tutor", "question", q.content);
  state.currentQuestion   = q.content;
  state.currentQuestionId = q.id;
  state.hintLevel         = 0;
  state.questionStart     = Date.now();
  state.state             = "questioning";
  onUpdate?.(state);
  return state;
}

/** Process student's answer. Returns updated state. */
export async function processStudentAnswer(
  state: TutorSessionState,
  answer: string,
  onUpdate?: (s: TutorSessionState) => void
): Promise<TutorSessionState> {
  state.state = "assessing";
  onUpdate?.(state);

  // Record student's message
  addMessage(state.session, "student", "response", answer);

  // Call backend assessment
  let classification = "partial";
  let isCorrect      = false;
  let masteryDelta   = 0;
  let responseText   = "";
  let misconception: string | undefined;
  let assessmentVerified = false;

  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:         "assessAnswer",
        topic:          state.session.topic,
        subject:        state.session.subject,
        question:       state.currentQuestion,
        studentAnswer:  answer,
        masteryScore:   state.session.currentMastery,
      }),
    });
    if (res.ok) {
      const data = await res.json() as {
        classification?: unknown;
        isCorrect?: unknown;
        misconception?: unknown;
        masteryDelta?: unknown;
        content?: unknown;
      };
      const validClassifications = ["correct", "partial", "misconception", "guess", "copied"];
      if (
        typeof data.classification === "string" &&
        validClassifications.includes(data.classification) &&
        typeof data.isCorrect === "boolean" &&
        typeof data.masteryDelta === "number" &&
        Number.isFinite(data.masteryDelta) &&
        typeof data.content === "string" &&
        data.content.trim().length > 0
      ) {
        classification = data.classification;
        isCorrect = data.isCorrect;
        masteryDelta = Math.max(-10, Math.min(20, data.masteryDelta));
        responseText = data.content;
        misconception = typeof data.misconception === "string" ? data.misconception : undefined;
        assessmentVerified = true;
      } else {
        responseText = "I couldn't reliably assess that answer. It hasn't been scored; please try again or rephrase it.";
      }
    } else {
      responseText = "I couldn't assess that answer just now. It hasn't been scored; please try again.";
    }
  } catch {
    responseText = "I couldn't assess that answer just now. It hasn't been scored; please try again.";
  }

  if (!assessmentVerified) {
    addMessage(state.session, "tutor", "assessment", responseText, {
      classification: "unverified",
    });
    state.state = "questioning";
    onUpdate?.(state);
    return state;
  }

  // Update mastery assessment record
  const { masteryJustValidated } = recordAnswer({
    topic:        state.session.topic,
    subject:      state.session.subject,
    questionId:   state.currentQuestionId,
    questionType: "conceptual",
    isCorrect,
    hintUsed:     state.hintLevel > 0,
    masteryDelta,
  });

  // Record misconception if detected
  if (!isCorrect && misconception) {
    const mc = recordMisconception({
      topic:       state.session.topic,
      subject:     state.session.subject,
      description: misconception,
    });
    state.misconceptionId = mc.id;
  }

  // Add tutor response message
  const msgType = isCorrect
    ? (masteryJustValidated ? "milestone" : "praise")
    : (classification === "misconception" ? "reteach" : "assessment");

  addMessage(state.session, "tutor", msgType, responseText, {
    classification,
    isCorrect,
    misconception,
    masteryDelta,
  });

  // Update state machine
  if (masteryJustValidated) {
    state.state = "mastered";
  } else if (!isCorrect && classification === "misconception") {
    state.state = "reteaching";
    if (state.misconceptionId) markReteaught(state.misconceptionId);
  } else if (isCorrect) {
    state.state = "praising";
  } else {
    state.state = "questioning"; // stay in questioning, let them try again
  }

  onUpdate?.(state);
  return state;
}

/** Student requests a hint. */
export async function requestNextHint(
  state: TutorSessionState,
  onUpdate?: (s: TutorSessionState) => void
): Promise<TutorSessionState> {
  state.hintLevel++;
  state.state = "hinting";
  onUpdate?.(state);

  const timeElapsed = Date.now() - state.questionStart;
  const { content, level } = await requestHint({
    sessionId:     state.session.sessionId,
    topic:         state.session.topic,
    subject:       state.session.subject,
    question:      state.currentQuestion,
    currentLevel:  state.hintLevel,
    timeElapsedMs: timeElapsed,
    masteryScore:  state.session.currentMastery,
  });

  addMessage(state.session, "tutor", "hint", content, { hintLevel: level });
  state.hintLevel = level;
  state.state     = "questioning"; // return to questioning after hint
  onUpdate?.(state);
  return state;
}

/** Generate end-of-session reflection and complete the session. */
export async function endSession(
  state: TutorSessionState,
  onUpdate?: (s: TutorSessionState) => void
): Promise<{ state: TutorSessionState; reflection: string }> {
  state.state = "reflecting";
  onUpdate?.(state);

  let reflection = "";
  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:       "generateReflection",
        topic:        state.session.topic,
        subject:      state.session.subject,
        masteryScore: state.session.currentMastery,
        sessionSummary: {
          questionsAnswered:   state.session.questionsAsked,
          correctAnswers:      state.session.correctAnswers,
          hintsUsed:           state.session.hintsUsed,
          misconceptionsFixed: state.session.misconceptionCount,
          topicsCovered:       [state.session.topic],
        },
      }),
    });
    if (res.ok) {
      const data = await res.json() as { content: string };
      reflection = data.content;
    }
  } catch { /* fallback below */ }

  if (!reflection) {
    const acc = state.session.questionsAsked > 0
      ? Math.round((state.session.correctAnswers / state.session.questionsAsked) * 100)
      : 0;
    reflection = [
      `✦ Today you understood: Key aspects of ${state.session.topic}`,
      `✦ Today you struggled with: ${acc < 60 ? "Applying the concept without help" : "The deeper analytical questions"}`,
      `✦ One thing to revise tomorrow: Re-explain ${state.session.topic} from scratch without any notes`,
      `✦ Estimated mastery improvement: ${Math.max(0, state.session.currentMastery - 10)} → ${state.session.currentMastery} out of 100`,
      `✦ Great effort today — every question you tackle makes the next one easier.`,
    ].join("\n");
  }

  addMessage(state.session, "tutor", "reflection", reflection);
  completeSession(state.session);
  _active = null;

  return { state, reflection };
}

/** Mastery progress as fraction 0–1. */
export function getTutorMasteryProgress(state: TutorSessionState): number {
  return getMasteryProgress(state.session.topic, state.session.subject);
}
