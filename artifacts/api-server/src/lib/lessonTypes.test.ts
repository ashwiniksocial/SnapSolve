import assert from "node:assert/strict";
import test from "node:test";
import {
  getIncompleteDetailedLessonFields,
  isCompleteDetailedLessonResponse,
  parseLessonResponse,
} from "./lessonTypes";

function detailedLesson(overrides: Record<string, unknown> = {}) {
  return parseLessonResponse({
    topic: "Simple Machines",
    difficulty: "Easy",
    keyConcepts: ["Mechanical advantage compares load with effort."],
    vocabulary: [{ term: "Load", meaning: "The force the machine moves." }],
    intuition: {
      story: "A machine helps us move a load.",
      visual: "Picture a pulley lifting a box.",
      everyday: "A ramp helps move a heavy object.",
    },
    questionTranslation: {
      plainEnglish: "",
      whatWeKnow: "",
      whatWeFind: "",
      wordToMath: "",
    },
    guidedReasoning: [
      { what: "Identify the load.", why: "The load is what the machine moves." },
      { what: "Identify the effort.", why: "The effort is the force applied." },
    ],
    commonMistakes: [{
      mistake: "Reverse the ratio.",
      whyItHappens: "The two forces can be confused.",
      howToAvoid: "Write load over effort first.",
    }],
    finalAnswer: {
      answer: "Mechanical advantage = 4.",
      whyCorrect: "The load divided by the effort gives four.",
    },
    simplerExample: {
      problem: "A 20 N load is lifted with 10 N effort.",
      solution: "Divide 20 N by 10 N to get 2.",
    },
    practiceQuestion: { question: "", hints: [], solution: "" },
    rememberThese: [
      "Mechanical advantage compares load with effort.",
      "Check that the answer uses load divided by effort.",
    ],
    ...overrides,
  });
}

test("complete Detailed lesson is eligible for bank caching", () => {
  assert.equal(isCompleteDetailedLessonResponse(detailedLesson()), true);
});

test("missing required teaching content is rejected before bank caching", () => {
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      intuition: { story: "", visual: "", everyday: "" },
    })),
    false,
  );
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      commonMistakes: [],
    })),
    false,
  );
});

test("missing vocabulary or usable memory takeaways is rejected before bank caching", () => {
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({ vocabulary: [] })),
    false,
  );
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      vocabulary: [{ term: "Load", meaning: "" }],
    })),
    false,
  );
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({ rememberThese: [] })),
    false,
  );
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      rememberThese: ["A useful takeaway.", "   "],
    })),
    false,
  );
});

test("partially populated optional sections are rejected", () => {
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      questionTranslation: {
        plainEnglish: "The question gives two forces.",
        whatWeKnow: "",
        whatWeFind: "",
        wordToMath: "",
      },
    })),
    false,
  );
  assert.equal(
    isCompleteDetailedLessonResponse(detailedLesson({
      practiceQuestion: {
        question: "Find the mechanical advantage.",
        hints: [],
        solution: "",
      },
    })),
    false,
  );
});

test("incomplete Detailed diagnostics name sections without changing the save gate", () => {
  const missingIntuition = detailedLesson({
    intuition: { story: "A story.", visual: "", everyday: "An everyday link." },
  });
  assert.deepEqual(getIncompleteDetailedLessonFields(missingIntuition), ["intuition"]);
  assert.equal(isCompleteDetailedLessonResponse(missingIntuition), false);

  const partialOptionalSection = detailedLesson({
    practiceQuestion: {
      question: "Find the mechanical advantage.",
      hints: ["Use load divided by effort."],
      solution: "",
    },
  });
  assert.deepEqual(getIncompleteDetailedLessonFields(partialOptionalSection), ["practiceQuestion"]);
  assert.equal(isCompleteDetailedLessonResponse(partialOptionalSection), false);

  assert.deepEqual(getIncompleteDetailedLessonFields(detailedLesson()), []);
  assert.equal(isCompleteDetailedLessonResponse(detailedLesson()), true);
});
