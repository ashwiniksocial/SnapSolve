/**
 * Question Bank Blueprint — Computer Science
 *
 * Developer-only. Never imported by any runtime service.
 */

import type { SubjectBlueprint } from "../types";

export const COMPUTER_SCIENCE_BLUEPRINT: SubjectBlueprint = {
  subject:            "Computer Science",
  boardApplicability: "Both",

  categoryBlueprints: {

    major: {
      targetTotal: 70,
      byType: {
        concept:            10,  // Algorithmic thinking, not syntax
        ncert:              12,
        icse:                8,
        competency:         14,  // CS especially benefits from method-selection questions
        hots:               12,  // Trace, debug, optimise — all HOTS patterns
        "previous-year":     8,
        "case-study":        4,  // Real-world algorithm or system analysis
        "assertion-reason":  2,
        olympiad:            0,  // CS olympiad scope differs; excluded for standard bank
      },
      byDifficulty: {
        Easy:      20,
        Medium:    26,
        Hard:      18,
        Olympiad:   6,
      },
      byBlooms: {
        remember:    6,
        understand: 12,
        apply:      20,
        analyse:    18,
        evaluate:   10,
        create:      4,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          3,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    standard: {
      targetTotal: 50,
      byType: {
        concept:            8,
        ncert:             10,
        icse:               6,
        competency:        10,
        hots:               8,
        "previous-year":    6,
        "case-study":        2,
        "assertion-reason":  0,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      15,
        Medium:    20,
        Hard:      12,
        Olympiad:   3,
      },
      byBlooms: {
        remember:    4,
        understand:  8,
        apply:      16,
        analyse:    14,
        evaluate:    6,
        create:      2,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: false,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    minor: {
      targetTotal: 30,
      byType: {
        concept:            6,
        ncert:              8,
        icse:               4,
        competency:         6,
        hots:               4,
        "previous-year":    2,
        "case-study":        0,
        "assertion-reason":  0,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      10,
        Medium:    12,
        Hard:       6,
        Olympiad:   2,
      },
      byBlooms: {
        remember:    4,
        understand:  6,
        apply:      10,
        analyse:     8,
        evaluate:    2,
        create:      0,
      },
      caseStudyApplicable:      false,
      assertionReasonApplicable: false,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     1,
      minCommonErrorsTagged:     0,
    },

    brief: {
      targetTotal: 18,
      byType: {
        concept:            4,
        ncert:              6,
        icse:               2,
        competency:         4,
        hots:               2,
        "previous-year":    0,
        "case-study":        0,
        "assertion-reason":  0,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:       8,
        Medium:     7,
        Hard:       3,
        Olympiad:   0,
      },
      byBlooms: {
        remember:    4,
        understand:  5,
        apply:       6,
        analyse:     3,
        evaluate:    0,
        create:      0,
      },
      caseStudyApplicable:      false,
      assertionReasonApplicable: false,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     1,
      minCommonErrorsTagged:     0,
    },
  },

  // Olympiad in CS means competitive programming — not relevant for Classes 6–9 general bank
  globallyExcludedTypes: ["olympiad"],

  mandatoryTags: ["algorithm"],  // Every CS question involving a procedure or program carries this

  authoringNotes: [
    "CMF-12 is mandatory for every CS question: the algorithm or logic in plain English must precede any code.",
    "Trace-the-code questions (given a code snippet, trace the output with specific inputs) are one of the highest-value HOTS question types in CS. Include at least 3 per major chapter.",
    "Debug questions (find the error in this code) are excellent for Evaluate-level Bloom's. The error should reflect a common student mistake, not an arbitrary bug.",
    "All code must be in Python (CBSE standard for Classes 8–9). For Classes 6–7, code-based questions use pseudocode or flowcharts.",
    "MCQ questions in CS should test understanding, not syntax memorisation: 'Which of the following outputs does this code produce?' not 'What is the keyword for a function?'",
    "Competency questions should describe a real-world task and ask the student to design an algorithm or identify the correct approach — without telling them which programming construct to use.",
    "For Class 6–7 (pre-Python): questions should focus on algorithm design, flowcharts, and logical reasoning. No syntax-dependent questions.",
    "Case-study passages can describe a real algorithm in action (recommendation systems, search engines, GPS navigation) and ask students to reason about its logic.",
    "Common errors to document: off-by-one in loops, incorrect operator precedence, confusing = with ==, infinite loop from missing update, type mismatch, return vs print.",
    "Ethical dimensions: algorithm bias, privacy in data collection, cyberbullying, digital addiction — suitable for NEP-ETH notes in CS questions.",
    "ICSE CS (Class 9) includes BlueJ/Java in some schools. Mark any Java-specific questions with board: 'ICSE'.",
  ],
};
