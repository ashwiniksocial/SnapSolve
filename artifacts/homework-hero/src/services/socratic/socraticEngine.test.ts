import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  askNextQuestion,
  endSession,
  getTutorMasteryProgress,
  processStudentAnswer,
  requestNextHint,
  restoreTutorSession,
  startTutorSession,
  setActiveTutorSession,
} from "./socraticEngine";
import { generateConceptQuestion } from "./conceptQuestionEngine";
import {
  getAllSessions,
  getSession,
  getTutorStats,
} from "./dialogueEngine";
import { getTopicAssessment } from "./masteryAssessment";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)); }
  entries() { return [...this.values.entries()]; }
}

type RequestBody = Record<string, unknown>;
type MockReply = { status?: number; payload: unknown };

let storage: MemoryStorage;
let requests: RequestBody[] = [];
let replyFor: (body: RequestBody) => MockReply;
let originalFetch: typeof fetch;
let originalStorage: Storage | undefined;

beforeEach(() => {
  storage = new MemoryStorage();
  requests = [];
  replyFor = (body) => {
    switch (body.action) {
      case "generateQuestion":
        return {
          payload: { content: "How do the x-axis and y-axis locate a point on the Cartesian Plane?" },
        };
      case "assessAnswer":
        return {
          payload: {
            classification: "correct",
            isCorrect: true,
            masteryDelta: 10,
            content: "Correct. Explain how the ordered pair identifies that point.",
          },
        };
      case "generateHint":
        return { payload: { content: "Start with the horizontal coordinate." } };
      case "generateReflection":
        return { payload: { content: "You practised identifying points using the two axes." } };
      default:
        return { status: 400, payload: { error: "Unexpected mocked action" } };
    }
  };

  originalFetch = globalThis.fetch;
  originalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as RequestBody;
    requests.push(body);
    const reply = replyFor(body);
    return new Response(JSON.stringify(reply.payload), {
      status: reply.status ?? 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalStorage) {
    Object.defineProperty(globalThis, "localStorage", { configurable: true, value: originalStorage });
  } else {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
});

test("opening Cartesian Plane tutor asks a relevant question without changing Practice or grading records", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  await askNextQuestion(state);

  const generation = requests.find((request) => request.action === "generateQuestion");
  assert.equal(generation?.topic, "Cartesian Plane");
  assert.equal(generation?.subject, "Mathematics");
  assert.match(state.currentQuestion, /Cartesian Plane|x-axis|y-axis/i);
  assert.equal(state.session.questionsAsked, 1);
  assert.equal(state.session.correctAnswers, 0);
  assert.equal(getTutorStats().totalAnswered, 0);
  assert.equal(getTutorStats().avgAccuracy, null);
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 0);
  assert.equal(storage.entries().some(([key]) => key.startsWith("studyai-progress-v3")), false);
  assert.equal(storage.entries().some(([key]) => key.startsWith("studyai-v1-mastery-assessments")), false);
});

test("local question fallback keeps the selected Cartesian Plane topic", async () => {
  replyFor = () => ({ status: 503, payload: { error: "mock unavailable" } });
  const question = await generateConceptQuestion({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    masteryScore: 20,
  });

  assert.equal(question.source, "template");
  assert.equal(question.topic, "Cartesian Plane");
  assert.equal(question.subject, "Mathematics");
  assert.match(question.content, /Cartesian Plane/i);
});

test("correct answers increment accuracy and mastery once, then survive a session reload", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 20,
  });
  let current = await askNextQuestion(state);
  for (let index = 1; index <= 3; index++) {
    current.currentQuestionId = `cartesian-correct-${index}`;
    current = await processStudentAnswer(current, "The ordered pair gives the x and y coordinates.");
    if (index < 3) current = await askNextQuestion(current);
  }

  assert.equal(current.state, "mastered");
  assert.equal(current.session.questionsAsked, 3);
  assert.equal(current.session.correctAnswers, 3);
  assert.equal(current.session.currentMastery, 50);
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").masteryValidated, true);
  assert.equal(getTutorMasteryProgress(current), 1);

  await endSession(current);
  setActiveTutorSession(null);
  const reloaded = getSession(current.session.sessionId);
  assert.ok(reloaded);
  assert.equal(reloaded.completed, true);
  assert.equal(reloaded.correctAnswers, 3);
  assert.equal(reloaded.currentMastery, 50);
  assert.equal(getAllSessions().length, 1);
  assert.equal(getTutorStats().totalAnswered, 3);
  assert.equal(getTutorStats().avgAccuracy, 100);
  assert.equal(restoreTutorSession({ topic: "Cartesian Plane", subject: "Mathematics" }), null);
  const reflectionRequest = requests.find((request) => request.action === "generateReflection");
  const summary = reflectionRequest?.sessionSummary as Record<string, number> | undefined;
  assert.equal(summary?.questionsAnswered, 3);
  assert.equal(summary?.correctAnswers, 3);
});

test("incorrect misconception answers are scored once and persist as incorrect", async () => {
  replyFor = (body) => body.action === "assessAnswer"
    ? {
        payload: {
          classification: "misconception",
          isCorrect: false,
          misconception: "Confuses the order of x and y coordinates.",
          masteryDelta: -5,
          content: "Check which coordinate is horizontal and which is vertical.",
        },
      }
    : { payload: { content: "How does an ordered pair locate a point?" } };

  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  current.currentQuestionId = "cartesian-incorrect-1";
  const updated = await processStudentAnswer(current, "The first number is y.");

  assert.equal(updated.state, "reteaching");
  assert.equal(updated.session.correctAnswers, 0);
  assert.equal(updated.session.currentMastery, 35);
  assert.equal(updated.session.misconceptionCount, 1);
  const assessment = getTopicAssessment("Cartesian Plane", "Mathematics");
  assert.equal(assessment.totalAttempts, 1);
  assert.equal(assessment.totalCorrect, 0);
  assert.equal(assessment.consecutiveCorrect, 0);
  assert.equal(getTutorStats().totalAnswered, 1);
  assert.equal(getTutorStats().avgAccuracy, 0);
});

test("unverified assessment responses are not recorded as wrong or scored", async () => {
  replyFor = (body) => body.action === "assessAnswer"
    ? {
        payload: {
          classification: "unverified",
          content: "I couldn't reliably assess that response. It hasn't been scored; please try again.",
        },
      }
    : { payload: { content: "How do the axes locate a point?" } };

  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  current.currentQuestionId = "cartesian-unverified-1";
  const updated = await processStudentAnswer(current, "I am not sure.");

  assert.equal(updated.state, "questioning");
  assert.equal(updated.session.currentMastery, 40);
  assert.equal(updated.session.correctAnswers, 0);
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 0);
  assert.equal(getTutorStats().totalAnswered, 0);
  assert.equal(getTutorStats().avgAccuracy, null);
  assert.match(updated.session.messages.at(-1)?.content ?? "", /hasn't been scored/i);
});

test("concurrent duplicate answer submissions share one tutor assessment and one score", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  current.currentQuestionId = "cartesian-double-submit";

  let resolveAssessment: ((response: Response) => void) | undefined;
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as RequestBody;
    requests.push(body);
    if (body.action === "assessAnswer") {
      return new Promise<Response>((resolve) => { resolveAssessment = resolve; });
    }
    return new Response(JSON.stringify({ content: "How do the axes locate a point?" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  const first = processStudentAnswer(current, "The ordered pair gives x and y.");
  const duplicate = processStudentAnswer(current, "The ordered pair gives x and y.");
  assert.equal(requests.filter((request) => request.action === "assessAnswer").length, 1);

  resolveAssessment?.(new Response(JSON.stringify({
    classification: "correct",
    isCorrect: true,
    masteryDelta: 5,
    content: "Correct.",
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  }));
  await Promise.all([first, duplicate]);

  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 1);
  assert.equal(getTutorStats().totalAnswered, 1);
});

test("hints persist in the session and hint history without changing mastery or Practice coverage", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  const updated = await requestNextHint(current);
  const saved = getSession(current.session.sessionId);
  const hintHistory = JSON.parse(storage.getItem("studyai-v1-hint-history") ?? "{}") as {
    totalHints?: number;
    records?: Array<{ topic: string; hintLevel: number }>;
  };

  assert.equal(updated.hintLevel, 1);
  assert.equal(updated.session.hintsUsed, 1);
  assert.equal(updated.session.currentMastery, 40);
  assert.equal(hintHistory.totalHints, 1);
  assert.equal(hintHistory.records?.[0]?.topic, "Cartesian Plane");
  assert.equal(saved?.hintsUsed, 1);
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 0);
  assert.equal(storage.entries().some(([key]) => key.startsWith("studyai-progress-v3")), false);
});

test("an unfinished tutor conversation restores its exact question and hint without another generation", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  const originalQuestion = current.currentQuestion;
  const originalQuestionId = current.currentQuestionId;
  await requestNextHint(current);
  const questionRequestsBeforeRestore = requests.filter((request) => request.action === "generateQuestion").length;

  setActiveTutorSession(null);
  const restored = restoreTutorSession({ topic: "Cartesian Plane", subject: "Mathematics" });

  assert.ok(restored);
  assert.equal(restored.session.sessionId, current.session.sessionId);
  assert.equal(restored.currentQuestion, originalQuestion);
  assert.equal(restored.currentQuestionId, originalQuestionId);
  assert.equal(restored.hintLevel, 1);
  assert.equal(restored.state, "questioning");
  assert.equal(
    requests.filter((request) => request.action === "generateQuestion").length,
    questionRequestsBeforeRestore,
  );
});

test("restoring after a graded response asks the next question without grading the answer twice", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  current.currentQuestionId = "cartesian-restore-after-grade";
  await processStudentAnswer(current, "The pair gives horizontal and vertical coordinates.");
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 1);

  setActiveTutorSession(null);
  const restored = restoreTutorSession({ topic: "Cartesian Plane", subject: "Mathematics" });
  assert.ok(restored);
  assert.equal(restored.currentQuestion, "");
  assert.equal(restored.state, "explaining");

  await askNextQuestion(restored);
  assert.equal(getTopicAssessment("Cartesian Plane", "Mathematics").totalAttempts, 1);
  assert.equal(requests.filter((request) => request.action === "assessAnswer").length, 1);
  assert.equal(requests.filter((request) => request.action === "generateQuestion").length, 2);
});

test("ending with no graded answers records no fabricated answer accuracy", async () => {
  const state = startTutorSession({
    topic: "Cartesian Plane",
    subject: "Mathematics",
    initialMastery: 40,
  });
  const current = await askNextQuestion(state);
  replyFor = (body) => body.action === "generateReflection"
    ? { status: 503, payload: { error: "mock unavailable" } }
    : { payload: { content: "How does an ordered pair locate a point?" } };

  const result = await endSession(current);
  const reflectionRequest = requests.find((request) => request.action === "generateReflection");
  const summary = reflectionRequest?.sessionSummary as Record<string, number> | undefined;

  assert.equal(summary?.questionsAnswered, 0);
  assert.equal(summary?.correctAnswers, 0);
  assert.match(result.reflection, /No tutor answers were graded/);
  assert.doesNotMatch(result.reflection, /struggled with/i);
});
