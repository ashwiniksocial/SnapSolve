/**
 * Question Bank — Tagging Taxonomy
 *
 * Developer-only. Never imported by any runtime service.
 *
 * This file defines every valid tag, code, and enumerated value used in the
 * question bank. It is the single source of truth for:
 *   • ID scheme and codes
 *   • Question type descriptions
 *   • Bloom's level descriptions
 *   • Concept node naming conventions
 *   • Tag vocabulary
 */

import type {
  QuestionType,
  QuestionFormat,
  Difficulty,
  BloomsLevel,
  QuestionSource,
  BoardApplicability,
  SupportedSubject,
} from "./types";

// ─── ID scheme ────────────────────────────────────────────────────────────────

/**
 * QUESTION ID FORMAT
 * {boardCode}-{subjectCode}-{classNum}-{chapterId}-{typeCode}-{seq3}
 *
 * Examples:
 *   bo-mth-9-ch01-hot-023   Both boards, Maths, Class 9, Ch1, HOTS, #23
 *   cb-phy-9-ch02-pyq-004   CBSE only, Physics, Class 9, Ch2, PreviousYear, #4
 *   ic-mth-8-ch05-con-001   ICSE only, Maths, Class 8, Ch5, Concept, #1
 */

export const BOARD_CODES: Record<BoardApplicability, string> = {
  Both: "bo",
  CBSE: "cb",
  ICSE: "ic",
};

export const SUBJECT_CODES: Record<SupportedSubject, string> = {
  Mathematics:       "mth",
  Physics:           "phy",
  Chemistry:         "chm",
  Biology:           "bio",
  "Computer Science": "csc",
  Economics:         "eco",
};

export const TYPE_CODES: Record<QuestionType, string> = {
  concept:            "con",
  ncert:              "nce",
  icse:               "ics",
  competency:         "cmp",
  hots:               "hot",
  "previous-year":    "pyq",
  "case-study":       "cst",
  "assertion-reason": "asr",
  olympiad:           "oly",
};

/**
 * Build a canonical question ID.
 * @param board  - e.g. "Both"
 * @param subject - e.g. "Mathematics"
 * @param classNum - e.g. 9
 * @param chapterId - e.g. "ch01"
 * @param type - e.g. "hots"
 * @param seq - 1-based sequence number within (chapter × type)
 */
export function buildQuestionId(
  board:     BoardApplicability,
  subject:   SupportedSubject,
  classNum:  number,
  chapterId: string,
  type:      QuestionType,
  seq:       number,
): string {
  const boardCode   = BOARD_CODES[board];
  const subjectCode = SUBJECT_CODES[subject];
  const typeCode    = TYPE_CODES[type];
  const seqStr      = String(seq).padStart(3, "0");
  return `${boardCode}-${subjectCode}-${classNum}-${chapterId}-${typeCode}-${seqStr}`;
}

// ─── Question type descriptions ───────────────────────────────────────────────

export const QUESTION_TYPE_DESCRIPTIONS: Record<QuestionType, {
  label:         string;
  purpose:       string;
  bloomsRange:   BloomsLevel[];
  typicalFormat: QuestionFormat[];
  typicalMarks:  number[];
  guideline:     string;
}> = {

  concept: {
    label:       "Concept Question",
    purpose:     "Tests foundational understanding of a single, specific concept. Student must demonstrate they understand WHAT and WHY — not just HOW to compute.",
    bloomsRange: ["remember", "understand"],
    typicalFormat: ["MCQ", "ShortAnswer", "TrueOrFalse", "FillInTheBlanks"],
    typicalMarks: [1, 2],
    guideline:   "One concept per question. Clear, direct language. Suitable for a student who just read the concept for the first time. The answer must require genuine understanding, not rote recall.",
  },

  ncert: {
    label:       "NCERT-Style",
    purpose:     "Follows NCERT exercise patterns — the standard most students are prepared for. Builds the core of exam readiness.",
    bloomsRange: ["understand", "apply"],
    typicalFormat: ["ShortAnswer", "LongAnswer", "Numerical"],
    typicalMarks: [2, 3],
    guideline:   "Match the question style, mark allocation, and phrasing of actual NCERT exercises. The question must not appear in the NCERT textbook verbatim — it should be a fresh question in the NCERT style.",
  },

  icse: {
    label:       "ICSE-Style",
    purpose:     "Matches the style, rigour, and format of ICSE question papers. Often more computational or proof-based than CBSE.",
    bloomsRange: ["apply", "analyse"],
    typicalFormat: ["LongAnswer", "Numerical", "Proof"],
    typicalMarks: [3, 4, 5],
    guideline:   "ICSE papers tend to ask for full working, not just answers. Phrasing tends to be more formal. Include multi-step problems. Mark these with board: ICSE unless the content is genuinely board-neutral.",
  },

  competency: {
    label:       "Competency-Based",
    purpose:     "NEP 2020 aligned. Tests whether the student can apply the concept in a new context — not just repeat a procedure seen in class. Requires selecting the correct method, not just executing it.",
    bloomsRange: ["apply", "analyse"],
    typicalFormat: ["ShortAnswer", "LongAnswer", "Numerical"],
    typicalMarks: [2, 3],
    guideline:   "The context must be unfamiliar from the student's textbook. The student must make at least one decision not made for them. Do NOT state which formula or method to use in the question. The question must not be solvable by formula-plugging without understanding.",
  },

  hots: {
    label:       "Higher-Order Thinking (HOTS)",
    purpose:     "Engages Bloom's Analyse, Evaluate, or Create. Requires the student to break down, judge, compare, or produce — not just apply a known procedure.",
    bloomsRange: ["analyse", "evaluate", "create"],
    typicalFormat: ["LongAnswer", "Proof", "ShortAnswer"],
    typicalMarks: [3, 4, 5],
    guideline:   "The solution must require more than one conceptual insight. 'Hard' difficulty is not sufficient for HOTS — the question must engage a higher cognitive level. Ideal HOTS questions have a surprising or counterintuitive answer that rewards careful thinking. Always include 3 hints.",
  },

  "previous-year": {
    label:       "Previous Year Question (PYQ)",
    purpose:     "Directly from or closely modelled on actual past CBSE/ICSE board exam questions. Trains students on real exam patterns.",
    bloomsRange: ["remember", "understand", "apply", "analyse"],
    typicalFormat: ["MCQ", "ShortAnswer", "LongAnswer", "Numerical", "AssertionReason"],
    typicalMarks: [1, 2, 3, 4, 5],
    guideline:   "If sourced from an actual paper, record the year and board in yearIfPreviousYear and boardIfPreviousYear. If 'modelled on', use source: 'original' but still tag as questionType: 'previous-year'. Match the exact mark allocation and format of the original paper.",
  },

  "case-study": {
    label:       "Case Study",
    purpose:     "A short passage or scenario followed by 3–5 sub-questions. Tests the ability to extract information, apply concepts to real contexts, and reason from evidence.",
    bloomsRange: ["apply", "analyse", "evaluate"],
    typicalFormat: ["CaseStudy"],
    typicalMarks: [4, 5],
    guideline:   "The passage should be a real or realistic context — a news snippet, a science scenario, a data table, a historical account, or an economic situation. Sub-questions should mix MCQ (1 mark) and ShortAnswer (2 marks). The passage must not restate the textbook definition — it should describe a situation that requires the student to apply the concept, not recall it. CBSE Class 9–10 boards have made case-study a standard question type; model the format accordingly.",
  },

  "assertion-reason": {
    label:       "Assertion–Reason",
    purpose:     "Tests the student's ability to evaluate whether a claim is true and whether a given reason correctly explains it. Develops logical rigour.",
    bloomsRange: ["understand", "analyse", "evaluate"],
    typicalFormat: ["AssertionReason"],
    typicalMarks: [1, 2],
    guideline:   "The four standard options must always be: (A) Both A and R true, R is correct explanation; (B) Both A and R true, R is NOT correct explanation; (C) A is true, R is false; (D) A is false, R is true. Do not invent other options. The correct answer must be precisely one of A, B, C, or D. The most pedagogically valuable questions use option B — where both are true but R doesn't actually explain A — because this requires genuine understanding. Avoid trivially obvious assertions.",
  },

  olympiad: {
    label:       "Olympiad Enrichment",
    purpose:     "Competition-level problems (IMO, NSO, NTSE, SOF) for students who want to go beyond the syllabus. Optional — not required for every chapter.",
    bloomsRange: ["analyse", "evaluate", "create"],
    typicalFormat: ["MCQ", "LongAnswer", "Proof"],
    typicalMarks: [4, 5],
    guideline:   "These questions may go slightly beyond the chapter syllabus but must remain connected to the chapter's core concepts. They should be solvable by a dedicated Class 9 student with extra effort. Do not require university-level mathematics. Always tag difficulty as 'Olympiad'. Include a full solution — olympiad solutions are often non-obvious and must be explained completely.",
  },
};

// ─── Format descriptions ──────────────────────────────────────────────────────

export const FORMAT_DESCRIPTIONS: Record<QuestionFormat, {
  label:       string;
  marksRange:  number[];
  expectation: string;
}> = {
  MCQ: {
    label:       "Multiple Choice Question",
    marksRange:  [1],
    expectation: "4 options labelled (a), (b), (c), (d). Exactly one correct answer. Distractors must be plausible — wrong options should reflect common errors, not random values.",
  },
  ShortAnswer: {
    label:       "Short Answer",
    marksRange:  [1, 2],
    expectation: "Answer in 2–4 sentences or 2–4 lines of working. No introduction required. Direct and precise.",
  },
  LongAnswer: {
    label:       "Long Answer",
    marksRange:  [3, 4, 5],
    expectation: "Full working shown. Each step numbered. Diagrams referenced where applicable. Answer clearly marked. Conclusion stated.",
  },
  Numerical: {
    label:       "Numerical",
    marksRange:  [2, 3, 4],
    expectation: "All given data identified first. Formula stated. Values substituted explicitly. Arithmetic shown. Unit included in final answer. Answer box marked.",
  },
  AssertionReason: {
    label:       "Assertion–Reason",
    marksRange:  [1, 2],
    expectation: "See QUESTION_TYPE_DESCRIPTIONS['assertion-reason'].guideline for option format. Both assertion and reason must be clearly distinct statements.",
  },
  CaseStudy: {
    label:       "Case Study",
    marksRange:  [4, 5],
    expectation: "Passage of 80–150 words. 3–5 sub-questions. Total marks = sum of sub-question marks. Sub-questions increase in difficulty: comprehension → application → analysis.",
  },
  MatchTheFollowing: {
    label:       "Match the Following",
    marksRange:  [2, 3],
    expectation: "Column A (4–6 items) matched to Column B (4–6 items). No item in Column A should have an obvious match from surface reading alone.",
  },
  FillInTheBlanks: {
    label:       "Fill in the Blanks",
    marksRange:  [1],
    expectation: "One blank per statement. The blank should be the key concept, not a peripheral word. Accept minor spelling variations in the answer.",
  },
  TrueOrFalse: {
    label:       "True or False",
    marksRange:  [1, 2],
    expectation: "Statement must be unambiguously true or false. Justification MUST be required — True/False without justification tests recall, not understanding. '2 marks: 1 for answer, 1 for correct justification' is the standard.",
  },
  Proof: {
    label:       "Mathematical Proof",
    marksRange:  [3, 4, 5],
    expectation: "Each step of the proof on its own line. Each step justified (theorem, axiom, or previous step). QED or ∎ at the end. No steps skipped.",
  },
};

// ─── Bloom's taxonomy descriptions ───────────────────────────────────────────

export const BLOOMS_DESCRIPTIONS: Record<BloomsLevel, {
  label:        string;
  verbs:        string[];
  questionCues: string[];
  typical:      QuestionType[];
}> = {
  remember: {
    label:       "Remember",
    verbs:       ["define", "list", "recall", "name", "state", "identify"],
    questionCues: ["What is...", "Which of the following...", "Define...", "Name..."],
    typical:     ["concept", "ncert"],
  },
  understand: {
    label:       "Understand",
    verbs:       ["explain", "describe", "classify", "summarise", "compare", "paraphrase"],
    questionCues: ["Explain in your own words...", "What is the difference between...", "Why does..."],
    typical:     ["concept", "ncert", "assertion-reason"],
  },
  apply: {
    label:       "Apply",
    verbs:       ["calculate", "solve", "use", "apply", "demonstrate", "find"],
    questionCues: ["Calculate...", "Find...", "Using [formula], determine...", "A student observes..."],
    typical:     ["ncert", "icse", "competency", "previous-year"],
  },
  analyse: {
    label:       "Analyse",
    verbs:       ["compare", "differentiate", "examine", "break down", "distinguish", "investigate"],
    questionCues: ["Why does [A] happen but not [B]?", "What is the relationship between...", "Analyse..."],
    typical:     ["hots", "case-study", "competency"],
  },
  evaluate: {
    label:       "Evaluate",
    verbs:       ["judge", "assess", "critique", "justify", "verify", "defend"],
    questionCues: ["Is this approach correct? Justify.", "A student claims... Is this right?", "Which method is better and why?"],
    typical:     ["hots", "assertion-reason", "case-study"],
  },
  create: {
    label:       "Create",
    verbs:       ["design", "construct", "formulate", "produce", "compose", "derive"],
    questionCues: ["Derive a formula for...", "Construct an example where...", "Design a method to..."],
    typical:     ["hots", "olympiad"],
  },
};

// ─── Difficulty descriptions ──────────────────────────────────────────────────

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, {
  label:       string;
  timeRange:   [number, number]; // minutes
  description: string;
  percentile:  string;          // roughly, what percentile student can solve it
}> = {
  Easy: {
    label:       "Easy",
    timeRange:   [2, 5],
    description: "A student who has read the chapter once and understood the core concept can solve this without difficulty. Direct application or recall.",
    percentile:  "Top 80% of students in the class",
  },
  Medium: {
    label:       "Medium",
    timeRange:   [5, 12],
    description: "Requires combining two concepts, applying a formula in a slightly unfamiliar context, or showing a two-to-three-step working. A student who has practised is expected to solve this.",
    percentile:  "Top 60% of students in the class",
  },
  Hard: {
    label:       "Hard",
    timeRange:   [10, 20],
    description: "Requires multi-step reasoning, recognising a non-obvious connection, or applying concepts in a novel context. Typically discriminates between 'good' and 'excellent' students.",
    percentile:  "Top 30% of students in the class",
  },
  Olympiad: {
    label:       "Olympiad",
    timeRange:   [15, 40],
    description: "Competition-level. May require insights not directly taught in the chapter but logically connected. A dedicated student with extra effort should be able to solve it, but it will not be easy.",
    percentile:  "Top 5% of students nationally",
  },
};

// ─── Concept node naming convention ──────────────────────────────────────────

/**
 * CONCEPT NODE NAMING CONVENTION
 *
 * Concept nodes are the fine-grained identifiers of specific ideas within a topic.
 * They are used in:
 *   - conceptsCovered: which concepts this question requires the student to use
 *   - prerequisites: which concepts must be understood before attempting this question
 *
 * Format: {subject-code}:{class}:{chapter-code}:{kebab-concept-name}
 *
 * Examples:
 *   mth:9:ch01:irrational-number-definition
 *   mth:9:ch01:proof-by-contradiction
 *   mth:9:ch01:rationalisation
 *   phy:9:ch01:velocity-vs-speed-distinction
 *   chm:9:ch03:avogadro-constant
 *   bio:9:ch05:cell-membrane-function
 *
 * Rules:
 *   1. Kebab-case only. No spaces, underscores, or capitals.
 *   2. As specific as possible — not "triangles" but "congruence-sas-rule".
 *   3. One concept per node. If a question uses two concepts, list both separately.
 *   4. Concept nodes are defined by authors when first used — not pre-approved from a fixed list.
 *      However, once defined, the exact string must be reused consistently.
 *   5. Do not create a concept node for a topic-level concept (too broad).
 *      "number-systems" is a chapter, not a concept node.
 *      "p-over-q-form-of-rational-number" is a concept node.
 */
export const CONCEPT_NODE_CONVENTION = {
  format:   "{subject-code}:{class}:{chapter-code}:{kebab-concept-name}",
  example:  "mth:9:ch01:proof-by-contradiction",
  rules: [
    "Kebab-case only — no spaces, underscores, or capitals",
    "Specific enough to identify one teachable idea",
    "Reuse the exact string consistently across all questions",
    "Never create a node at chapter-level granularity — always at concept level",
    "Include prerequisite chains: if concept B requires concept A, list A in prerequisites",
  ],
};

// ─── Tag vocabulary ───────────────────────────────────────────────────────────

/**
 * STANDARD FREE-FORM TAGS
 *
 * The `tags` array in QuestionV2 accepts any string, but authors should prefer
 * these standardised tags for consistent filtering. Non-standard tags are allowed
 * but must be added to this list when first used.
 */
export const STANDARD_TAGS = {

  // Exam relevance
  BOARD_IMPORTANT:    "board-important",    // Appears frequently in board exams
  FREQUENTLY_ASKED:   "frequently-asked",   // Appears 3+ times in past 5 years
  TRICKY:             "tricky",             // Has a common wrong approach
  CLASSIC:            "classic",            // A well-known landmark problem for this topic

  // Concept relationships
  CONCEPTUAL:         "conceptual",         // Tests understanding over computation
  COMPUTATIONAL:      "computational",      // Heavy on arithmetic/algebra
  PROOF_BASED:        "proof-based",        // Requires a formal proof
  THEOREM_APPLICATION: "theorem-application", // Requires applying a named theorem
  FORMULA_DERIVATION: "formula-derivation", // Student must derive (not just use) a formula

  // Syllabus scope
  NCERT_DIRECT:       "ncert-direct",       // Answer is directly in NCERT text
  BEYOND_NCERT:       "beyond-ncert",       // Goes slightly beyond NCERT scope
  DELETED_SYLLABUS:   "deleted-syllabus",   // In old syllabus; mark if added by mistake
  COMMON_BOTH_BOARDS: "common-both-boards", // Tested by both CBSE and ICSE

  // NEP alignment
  NEP_COMPETENCY:     "nep-competency",     // Aligns with NEP 2020 competency focus
  REAL_LIFE:          "real-life",          // Grounded in a real-world situation
  INTERDISCIPLINARY:  "interdisciplinary",  // Connects to another subject
  ETHICAL_DIMENSION:  "ethical-dimension",  // Has an ethical or social dimension

  // Subject-specific (Mathematics)
  PROOF_BY_CONTRADICTION: "proof-by-contradiction",
  CONSTRUCTION:       "construction",
  DATA_INTERPRETATION: "data-interpretation",

  // Subject-specific (Physics)
  NUMERICALS:         "numericals",         // Numerical with given data and calculation
  DERIVATION:         "derivation",         // Derives a physics formula or law

  // Subject-specific (Chemistry)
  EQUATION_BALANCING: "equation-balancing",
  STOICHIOMETRY:      "stoichiometry",

  // Subject-specific (Biology)
  DIAGRAM_BASED:      "diagram-based",      // Requires labelling or interpreting a diagram
  PROCESS_BASED:      "process-based",      // Tests a sequential biological process

  // Subject-specific (Computer Science)
  ALGORITHM:          "algorithm",
  TRACE_THE_CODE:     "trace-the-code",     // Trace execution with specific values
  DEBUG:              "debug",              // Find the error in given code

  // Subject-specific (Economics)
  DATA_ANALYSIS:      "data-analysis",      // Interpret economic data
  POLICY_BASED:       "policy-based",       // About government policies or schemes
} as const;

export type StandardTag = typeof STANDARD_TAGS[keyof typeof STANDARD_TAGS];
