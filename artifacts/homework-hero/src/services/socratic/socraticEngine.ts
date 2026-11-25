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
  createSession, addMessage, completeSession, getAllSessions, getSessionAnswerStats,
  type SocraticSession,
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
const pendingQuestionRequests = new Map<string, Promise<TutorSessionState>>();
const pendingAnswerRequests = new Map<string, Promise<TutorSessionState>>();

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

/** Restore the latest unfinished session for this exact topic and subject. */
export function restoreTutorSession(opts: {
  topic: string;
  subject: string;
}): TutorSessionState | null {
  const activeSession = _active?.session;
  const session = activeSession &&
    !activeSession.completed &&
    activeSession.topic === opts.topic &&
    activeSession.subject === opts.subject
    ? activeSession
    : getAllSessions()
        .filter((candidate) =>
          !candidate.completed &&
          candidate.topic === opts.topic &&
          candidate.subject === opts.subject
        )
        .sort((left, right) => right.startTime - left.startTime)[0];

  if (!session || !Array.isArray(session.messages)) return null;

  let questionIndex = -1;
  for (let index = session.messages.length - 1; index >= 0; index--) {
    const message = session.messages[index];
    if (message.role === "tutor" && message.type === "question") {
      questionIndex = index;
      break;
    }
  }

  const questionMessage = questionIndex >= 0 ? session.messages[questionIndex] : null;
  const messagesAfterQuestion = questionIndex >= 0 ? session.messages.slice(questionIndex + 1) : [];
  let lastStudentIndex = -1;
  messagesAfterQuestion.forEach((message, index) => {
    if (message.role === "student" && message.type === "response") lastStudentIndex = index;
  });

  let lastTutorReply: typeof session.messages[number] | undefined;
  if (lastStudentIndex >= 0) {
    for (let index = messagesAfterQuestion.length - 1; index > lastStudentIndex; index--) {
      const message = messagesAfterQuestion[index];
      if (message.role === "tutor" && message.type !== "question" && message.type !== "hint") {
        lastTutorReply = message;
        break;
      }
    }
  }

  const reachedMastery = lastTutorReply?.type === "milestone" && lastTutorReply.isCorrect === true;
  const needsNextQuestion = !reachedMastery && (
    lastTutorReply?.isCorrect === true || lastTutorReply?.type === "reteach"
  );
  const currentQuestion = needsNextQuestion ? "" : questionMessage?.content ?? "";
  const latestHint = needsNextQuestion
    ? undefined
    : [...messagesAfterQuestion].reverse().find(
        (message) => message.role === "tutor" && message.type === "hint",
      );

  const restored: TutorSessionState = {
    session,
    state: reachedMastery ? "mastered" : currentQuestion ? "questioning" : "explaining",
    currentQuestion,
    currentQuestionId: currentQuestionMessageId(questionMessage),
    hintLevel: latestHint?.hintLevel ?? 0,
    questionStart: questionMessage?.timestamp ?? Date.now(),
  };
  _active = restored;
  return restored;
}

function currentQuestionMessageId(
  message: SocraticSession["messages"][number] | null,
): string {
  return message?.questionId ?? message?.id ?? "";
}

/** Transition to QUESTIONING — ask the first (or next) conceptual question. */
export async function askNextQuestion(
  state: TutorSessionState,
  studentContext?: string,
  onUpdate?: (s: TutorSessionState) => void
): Promise<TutorSessionState> {
  const sessionId = state.session.sessionId;
  const pending = pendingQuestionRequests.get(sessionId);
  if (pending) {
    const resolved = await pending;
    onUpdate?.(resolved);
    return resolved;
  }

  const request = generateConceptQuestion({
    topic:         state.session.topic,
    subject:       state.session.subject,
    masteryScore:  state.session.currentMastery,
    studentContext,
  }).then((question) => {
    addMessage(state.session, "tutor", "question", question.content, {
      questionId: question.id,
    });
    state.currentQuestion   = question.content;
    state.currentQuestionId = question.id;
    state.hintLevel         = 0;
    state.questionStart     = Date.now();
    state.state             = "questioning";
    _active = state;
    onUpdate?.(state);
    return state;
  });
  pendingQuestionRequests.set(sessionId, request);
  try {
    return await request;
  } finally {
    if (pendingQuestionRequests.get(sessionId) === request) {
      pendingQuestionRequests.delete(sessionId);
    }
  }
}

/** Process student's answer. Returns updated state. */
export async function processStudentAnswer(
  state: TutorSessionState,
  answer: string,
  onUpdate?: (s: TutorSessionState) => void
): Promise<TutorSessionState> {
  const questionKey = state.currentQuestionId || state.currentQuestion;
  const requestKey = `${state.session.sessionId}:${questionKey}`;
  const pending = pendingAnswerRequests.get(requestKey);
  if (pending) return pending;

  const request = processStudentAnswerOnce(state, answer, onUpdate);
  pendingAnswerRequests.set(requestKey, request);
  try {
    return await request;
  } finally {
    if (pendingAnswerRequests.get(requestKey) === request) {
      pendingAnswerRequests.delete(requestKey);
    }
  }
}

async function processStudentAnswerOnce(
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
  const answerStats = getSessionAnswerStats(state.session);
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
          questionsAnswered:   answerStats.answered,
          correctAnswers:      answerStats.correct,
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
    const acc = answerStats.answered > 0
      ? Math.round((answerStats.correct / answerStats.answered) * 100)
      : null;
    reflection = [
      `✦ Today you explored: ${state.session.topic}`,
      acc === null
        ? "✦ No tutor answers were graded in this session."
        : `✦ Graded-answer accuracy: ${acc}% (${answerStats.correct}/${answerStats.answered}).`,
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
