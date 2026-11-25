/**
 * The shared structural contract for generated and persisted Detailed lessons.
 * API responses and browser TeachingLessons must use this same definition.
 */
export interface DetailedLessonContractShape {
  keyConcepts: readonly string[];
  intuition: {
    story: string;
    visual: string;
    everyday: string;
  };
  questionTranslation: {
    plainEnglish: string;
    whatWeKnow: string;
    whatWeFind: string;
    wordToMath: string;
  };
  guidedReasoning: readonly { what: string; why: string }[];
  commonMistakes: readonly {
    mistake: string;
    whyItHappens: string;
    howToAvoid: string;
  }[];
  finalAnswer: { answer: string; whyCorrect: string };
  simplerExample: { problem: string; solution: string };
  practiceQuestion: { question: string; hints: readonly string[]; solution: string };
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Translation and practice are optional sections. Keep each either complete
 * or empty so no renderer receives a partly populated optional section.
 */
export function normalizeOptionalDetailedLessonSections<
  T extends DetailedLessonContractShape,
>(lesson: T): T {
  const translationValues = [
    lesson.questionTranslation.plainEnglish,
    lesson.questionTranslation.whatWeKnow,
    lesson.questionTranslation.whatWeFind,
    lesson.questionTranslation.wordToMath,
  ];
  const translationComplete = translationValues.every(hasText);

  const practice = lesson.practiceQuestion;
  const practiceComplete =
    hasText(practice.question) &&
    hasText(practice.solution) &&
    practice.hints.length > 0 &&
    practice.hints.every(hasText);

  return {
    ...lesson,
    questionTranslation: translationComplete
      ? lesson.questionTranslation
      : { plainEnglish: "", whatWeKnow: "", whatWeFind: "", wordToMath: "" },
    practiceQuestion: practiceComplete
      ? practice
      : { question: "", hints: [], solution: "" },
  } as T;
}

/**
 * Returns exact missing paths for required fields and partially present
 * optional sections. Call normalization before this check for generated
 * candidates; stored assets are expected to already follow the same contract.
 */
export function getIncompleteDetailedLessonFields(
  lesson: DetailedLessonContractShape,
): string[] {
  const missing: string[] = [];
  const translationFields = [
    "plainEnglish",
    "whatWeKnow",
    "whatWeFind",
    "wordToMath",
  ] as const;
  const translationValues = translationFields.map(
    (field) => lesson.questionTranslation[field],
  );
  const hasNoTranslation = translationValues.every((value) => !hasText(value));
  const hasFullTranslation = translationValues.every(hasText);

  const practice = lesson.practiceQuestion;
  const hasNoPractice =
    !hasText(practice.question) &&
    !hasText(practice.solution) &&
    practice.hints.every((hint) => !hasText(hint));
  const hasFullPractice =
    hasText(practice.question) &&
    hasText(practice.solution) &&
    practice.hints.length > 0 &&
    practice.hints.every(hasText);

  if (lesson.keyConcepts.length === 0) {
    missing.push("keyConcepts");
  } else {
    lesson.keyConcepts.forEach((concept, index) => {
      if (!hasText(concept)) missing.push(`keyConcepts[${index}]`);
    });
  }

  for (const field of ["story", "visual", "everyday"] as const) {
    if (!hasText(lesson.intuition[field])) missing.push(`intuition.${field}`);
  }

  if (!hasNoTranslation && !hasFullTranslation) {
    for (const field of translationFields) {
      if (!hasText(lesson.questionTranslation[field])) {
        missing.push(`questionTranslation.${field}`);
      }
    }
  }

  if (lesson.guidedReasoning.length === 0) {
    missing.push("guidedReasoning");
  } else {
    lesson.guidedReasoning.forEach((step, index) => {
      if (!hasText(step.what)) missing.push(`guidedReasoning[${index}].what`);
      if (!hasText(step.why)) missing.push(`guidedReasoning[${index}].why`);
    });
  }

  if (lesson.commonMistakes.length === 0) {
    missing.push("commonMistakes");
  } else {
    lesson.commonMistakes.forEach((mistake, index) => {
      if (!hasText(mistake.mistake)) {
        missing.push(`commonMistakes[${index}].mistake`);
      }
      if (!hasText(mistake.whyItHappens)) {
        missing.push(`commonMistakes[${index}].whyItHappens`);
      }
      if (!hasText(mistake.howToAvoid)) {
        missing.push(`commonMistakes[${index}].howToAvoid`);
      }
    });
  }

  if (!hasText(lesson.finalAnswer.answer)) missing.push("finalAnswer.answer");
  if (!hasText(lesson.finalAnswer.whyCorrect)) {
    missing.push("finalAnswer.whyCorrect");
  }
  if (!hasText(lesson.simplerExample.problem)) {
    missing.push("simplerExample.problem");
  }
  if (!hasText(lesson.simplerExample.solution)) {
    missing.push("simplerExample.solution");
  }

  if (!hasNoPractice && !hasFullPractice) {
    if (!hasText(practice.question)) missing.push("practiceQuestion.question");
    if (practice.hints.length === 0) {
      missing.push("practiceQuestion.hints");
    } else {
      practice.hints.forEach((hint, index) => {
        if (!hasText(hint)) {
          missing.push(`practiceQuestion.hints[${index}]`);
        }
      });
    }
    if (!hasText(practice.solution)) {
      missing.push("practiceQuestion.solution");
    }
  }

  return missing;
}

export function isCompleteDetailedLessonContract(
  lesson: DetailedLessonContractShape,
): boolean {
  return getIncompleteDetailedLessonFields(lesson).length === 0;
}
