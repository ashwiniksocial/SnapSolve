/**
 * The 18-point teaching quality checklist.
 * Each item maps to one of the 9 scored dimensions.
 * Pure data — no AI calls.
 */

export interface ChecklistItem {
  id:       string;
  category: DimensionKey;
  question: string;
}

export type DimensionKey =
  | "vocabulary"
  | "conceptTeaching"
  | "reasoning"
  | "stepExplanation"
  | "examples"
  | "memory"
  | "practice"
  | "confidenceBuilding"
  | "weakStudentUnderstanding";

export const CHECKLIST: ChecklistItem[] = [
  // Vocabulary
  { id: "vocab_words",   category: "vocabulary",              question: "Did we explain every difficult word in plain language?" },
  { id: "vocab_symbols", category: "vocabulary",              question: "Did we explain every mathematical symbol used?" },

  // Concept Teaching
  { id: "concept_first", category: "conceptTeaching",         question: "Did we explain every concept BEFORE using it?" },
  { id: "formula_why",   category: "conceptTeaching",         question: "Did we explain WHY this specific formula/method is chosen?" },
  { id: "no_prior",      category: "conceptTeaching",         question: "Did we avoid assuming any prior knowledge?" },

  // Reasoning
  { id: "step_why",      category: "reasoning",               question: "Did we explain WHY every step happens?" },
  { id: "no_jumps",      category: "reasoning",               question: "Did we avoid all hidden logical jumps?" },
  { id: "analogy",       category: "reasoning",               question: "Did we use an analogy or story to build intuition?" },

  // Step Explanation
  { id: "all_algebra",   category: "stepExplanation",         question: "Did we show every single algebra step separately?" },
  { id: "all_arith",     category: "stepExplanation",         question: "Did we show every arithmetic calculation (e.g. 18+22=40)?" },

  // Examples
  { id: "simpler_eg",    category: "examples",                question: "Did we include a simpler worked example of the same concept?" },
  { id: "confusion_ans", category: "examples",                question: "Did we predict and immediately answer likely confusion?" },

  // Memory
  { id: "takeaways",     category: "memory",                  question: "Did we summarise the key takeaways clearly?" },
  { id: "exam_intent",   category: "memory",                  question: "Did we explain what the examiner is testing and why?" },

  // Practice
  { id: "practice_q",    category: "practice",                question: "Did we generate a meaningful practice question?" },
  { id: "hints_guide",   category: "practice",                question: "Do the hints guide without solving the question?" },

  // Confidence Building
  { id: "encourage",     category: "confidenceBuilding",      question: "Did we genuinely encourage the student throughout?" },

  // Weak Student Understanding — the master criterion
  { id: "20pct_pass",    category: "weakStudentUnderstanding", question: "Could a student scoring 20/100 read this and independently solve a similar problem?" },
];

/**
 * Weighted contribution of each dimension to the overall score.
 * Must sum to 100.
 */
export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  vocabulary:               8,
  conceptTeaching:         18,
  reasoning:               20,
  stepExplanation:         14,
  examples:                10,
  memory:                   5,
  practice:                 5,
  confidenceBuilding:       5,
  weakStudentUnderstanding: 15,
};
