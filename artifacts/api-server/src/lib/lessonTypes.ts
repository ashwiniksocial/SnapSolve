/**
 * Shared lesson types and parsing utilities.
 * Used by solveQuestion route AND the teachingQuality service pipeline.
 */

export interface LessonStep {
  what:    string;
  why:     string;
  math:    string;
  result:  string;
  pause:   string;
}

export interface LessonResponse {
  topic:        string;
  difficulty:   "Easy" | "Medium" | "Hard";
  keyConcepts:  string[];
  aiConfidence: number;

  beforeWeStart: {
    motivator:      string;
    anxietyReducer: string;
    preview:        string;
  };

  prerequisites: string[];
  vocabulary:    { term: string; meaning: string }[];

  intuition: {
    story:    string;
    visual:   string;
    everyday: string;
  };

  questionTranslation: {
    plainEnglish: string;
    whatWeKnow:   string;
    whatWeFind:   string;
    wordToMath:   string;
  };

  teacherThinking: {
    firstNotice:   string;
    whyThisMethod: string;
    clues:         string;
  };

  guidedReasoning: LessonStep[];
  confusionPoints: string[];

  commonMistakes: {
    mistake:      string;
    whyItHappens: string;
    howToAvoid:   string;
  }[];

  examinerThinking: {
    whyAsked:      string;
    conceptTested: string;
    topperInsight: string;
    examTip:       string;
    examTrap:      string;
  };

  finalAnswer: {
    answer:       string;
    whyCorrect:   string;
    verification: string;
  };

  simplerExample: {
    problem:  string;
    solution: string;
  };

  practiceQuestion: {
    question: string;
    hints:    string[];
    solution: string;
  };

  confidenceCheck: {
    question:     string;
    options:      string[];
    correctIndex: number;
    explanation:  string;
  };

  retrievalPractice: string[];
  rememberThese:     string[];
  confidenceBuilder: string;
  cached?: boolean;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeStr(v: any): string {
  return typeof v === "string" ? v.trim() : "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseStep(s: any): LessonStep {
  return {
    what:   safeStr(s?.what),
    why:    safeStr(s?.why),
    math:   safeStr(s?.math),
    result: safeStr(s?.result),
    pause:  safeStr(s?.pause),
  };
}

/**
 * Parse a raw JSON object (from OpenAI) into a validated LessonResponse.
 * Never throws — fills missing fields with safe defaults.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseLessonResponse(p: any): LessonResponse {
  const difficulties = ["Easy", "Medium", "Hard"] as const;
  const difficulty: LessonResponse["difficulty"] =
    difficulties.includes(p?.difficulty) ? p.difficulty : "Medium";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bws: any = p?.beforeWeStart ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const it: any  = p?.intuition ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qt: any  = p?.questionTranslation ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tt: any  = p?.teacherThinking ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const et: any  = p?.examinerThinking ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fa: any  = p?.finalAnswer ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const se: any  = p?.simplerExample ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pq: any  = p?.practiceQuestion ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cc: any  = p?.confidenceCheck ?? {};

  return {
    topic:        safeStr(p?.topic) || "General",
    difficulty,
    keyConcepts:  Array.isArray(p?.keyConcepts)  ? p.keyConcepts.filter(Boolean)  : [],
    aiConfidence: typeof p?.aiConfidence === "number" ? p.aiConfidence : 0.8,

    beforeWeStart: {
      motivator:      safeStr(bws.motivator),
      anxietyReducer: safeStr(bws.anxietyReducer),
      preview:        safeStr(bws.preview),
    },

    prerequisites: Array.isArray(p?.prerequisites) ? p.prerequisites.filter(Boolean) : [],
    vocabulary: Array.isArray(p?.vocabulary)
      ? p.vocabulary
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((v: any) => v && typeof v.term === "string")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((v: any) => ({ term: v.term.trim(), meaning: safeStr(v.meaning) }))
      : [],

    intuition: {
      story:    safeStr(it.story),
      visual:   safeStr(it.visual),
      everyday: safeStr(it.everyday),
    },

    questionTranslation: {
      plainEnglish: safeStr(qt.plainEnglish),
      whatWeKnow:   safeStr(qt.whatWeKnow),
      whatWeFind:   safeStr(qt.whatWeFind),
      wordToMath:   safeStr(qt.wordToMath),
    },

    teacherThinking: {
      firstNotice:   safeStr(tt.firstNotice),
      whyThisMethod: safeStr(tt.whyThisMethod),
      clues:         safeStr(tt.clues),
    },

    guidedReasoning: Array.isArray(p?.guidedReasoning)
      ? p.guidedReasoning.map(parseStep)
      : [],

    confusionPoints: Array.isArray(p?.confusionPoints)
      ? p.confusionPoints.filter(Boolean)
      : [],

    commonMistakes: Array.isArray(p?.commonMistakes)
      ? p.commonMistakes
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((m: any) => m && typeof m.mistake === "string")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((m: any) => ({
            mistake:      safeStr(m.mistake),
            whyItHappens: safeStr(m.whyItHappens),
            howToAvoid:   safeStr(m.howToAvoid),
          }))
      : [],

    examinerThinking: {
      whyAsked:      safeStr(et.whyAsked),
      conceptTested: safeStr(et.conceptTested),
      topperInsight: safeStr(et.topperInsight),
      examTip:       safeStr(et.examTip),
      examTrap:      safeStr(et.examTrap),
    },

    finalAnswer: {
      answer:       safeStr(fa.answer) || "See guided reasoning above.",
      whyCorrect:   safeStr(fa.whyCorrect),
      verification: safeStr(fa.verification),
    },

    simplerExample: {
      problem:  safeStr(se.problem),
      solution: safeStr(se.solution),
    },

    practiceQuestion: {
      question: safeStr(pq.question),
      hints:    Array.isArray(pq.hints) ? pq.hints.filter(Boolean).slice(0, 3) : [],
      solution: safeStr(pq.solution),
    },

    confidenceCheck: {
      question:     safeStr(cc.question),
      options:      Array.isArray(cc.options) ? cc.options.slice(0, 4).map(safeStr) : [],
      correctIndex: typeof cc.correctIndex === "number" ? cc.correctIndex : 0,
      explanation:  safeStr(cc.explanation),
    },

    retrievalPractice: Array.isArray(p?.retrievalPractice) ? p.retrievalPractice.filter(Boolean) : [],
    rememberThese:     Array.isArray(p?.rememberThese)     ? p.rememberThese.filter(Boolean)     : [],
    confidenceBuilder: safeStr(p?.confidenceBuilder),
  };
}

/**
 * Optional translation and practice sections are stored as complete sections or
 * normalized empty. Apply the same rule before API completeness checks and
 * persistence so a partial optional section cannot block an otherwise complete
 * Detailed lesson or leak blank subfields to a student.
 */
export function normalizeOptionalDetailedLessonSections(
  lesson: LessonResponse,
): LessonResponse {
  const hasText = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;
  const translationFields = [
    lesson.questionTranslation.plainEnglish,
    lesson.questionTranslation.whatWeKnow,
    lesson.questionTranslation.whatWeFind,
    lesson.questionTranslation.wordToMath,
  ];
  const translationComplete = translationFields.every(hasText);

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
  };
}

/**
 * Detailed bank lessons are cached only when their unconditional teaching
 * sections are complete. Vocabulary and memory takeaways remain encouraged
 * and reviewed but are not structural prerequisites. Optional question
 * translation and practice sections remain all-or-nothing.
 */
export function isCompleteDetailedLessonResponse(lesson: LessonResponse): boolean {
  const hasText = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;
  return getIncompleteDetailedLessonFields(lesson, hasText).length === 0;
}

/**
 * Name mandatory Detailed completeness failures so a bounded stream recovery
 * can request those sections. Reviewer-assessed optional fields are excluded.
 */
export function getIncompleteDetailedLessonFields(
  lesson: LessonResponse,
  hasText: (value: unknown) => value is string = (value): value is string =>
    typeof value === "string" && value.trim().length > 0,
): string[] {
  const missing: string[] = [];
  const translationFields = [
    "plainEnglish",
    "whatWeKnow",
    "whatWeFind",
    "wordToMath",
  ] as const;
  const translationValues = translationFields.map((field) => lesson.questionTranslation[field]);
  const hasNoTranslation = translationValues.every((value) => !hasText(value));
  const hasFullTranslation = translationValues.every(hasText);
  const practice = lesson.practiceQuestion;
  const hasNoPractice = !hasText(practice.question);
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
      if (!hasText(mistake.mistake)) missing.push(`commonMistakes[${index}].mistake`);
      if (!hasText(mistake.whyItHappens)) {
        missing.push(`commonMistakes[${index}].whyItHappens`);
      }
      if (!hasText(mistake.howToAvoid)) {
        missing.push(`commonMistakes[${index}].howToAvoid`);
      }
    });
  }

  if (!hasText(lesson.finalAnswer.answer)) missing.push("finalAnswer.answer");
  if (!hasText(lesson.finalAnswer.whyCorrect)) missing.push("finalAnswer.whyCorrect");
  if (!hasText(lesson.simplerExample.problem)) missing.push("simplerExample.problem");
  if (!hasText(lesson.simplerExample.solution)) missing.push("simplerExample.solution");

  if (!hasNoPractice && !hasFullPractice) {
    if (!hasText(practice.question)) missing.push("practiceQuestion.question");
    if (practice.hints.length === 0) {
      missing.push("practiceQuestion.hints");
    } else {
      practice.hints.forEach((hint, index) => {
        if (!hasText(hint)) missing.push(`practiceQuestion.hints[${index}]`);
      });
    }
    if (!hasText(practice.solution)) missing.push("practiceQuestion.solution");
  }

  return missing;
}
