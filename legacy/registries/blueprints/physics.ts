/**
 * Question Bank Blueprint — Physics
 *
 * Developer-only. Never imported by any runtime service.
 */

import type { SubjectBlueprint } from "../types";

export const PHYSICS_BLUEPRINT: SubjectBlueprint = {
  subject:            "Physics",
  boardApplicability: "Both",

  categoryBlueprints: {

    major: {
      targetTotal: 80,
      byType: {
        concept:            10,
        ncert:              14,
        icse:               10,
        competency:         12,
        hots:               10,
        "previous-year":    10,
        "case-study":        6,   // Physics data scenarios, real-world applications
        "assertion-reason":  6,   // Very common in CBSE Science
        olympiad:            2,
      },
      byDifficulty: {
        Easy:      24,
        Medium:    30,
        Hard:      18,
        Olympiad:   8,
      },
      byBlooms: {
        remember:    8,
        understand: 14,
        apply:      24,
        analyse:    18,
        evaluate:   12,
        create:      4,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        true,
      minHintsRequired:          1,
      minStepsRequired:          3,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    standard: {
      targetTotal: 60,
      byType: {
        concept:            8,
        ncert:             12,
        icse:               8,
        competency:        10,
        hots:               8,
        "previous-year":    8,
        "case-study":        4,
        "assertion-reason":  2,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      18,
        Medium:    24,
        Hard:      14,
        Olympiad:   4,
      },
      byBlooms: {
        remember:    6,
        understand: 12,
        apply:      18,
        analyse:    14,
        evaluate:    8,
        create:      2,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          3,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    minor: {
      targetTotal: 36,
      byType: {
        concept:            6,
        ncert:              8,
        icse:               4,
        competency:         6,
        hots:               4,
        "previous-year":    4,
        "case-study":        2,
        "assertion-reason":  2,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      12,
        Medium:    14,
        Hard:       8,
        Olympiad:   2,
      },
      byBlooms: {
        remember:    4,
        understand:  8,
        apply:      12,
        analyse:     8,
        evaluate:    4,
        create:      0,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     1,
      minCommonErrorsTagged:     1,
    },

    brief: {
      targetTotal: 20,
      byType: {
        concept:            4,
        ncert:              6,
        icse:               2,
        competency:         4,
        hots:               2,
        "previous-year":    2,
        "case-study":        0,
        "assertion-reason":  0,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:       8,
        Medium:     8,
        Hard:       4,
        Olympiad:   0,
      },
      byBlooms: {
        remember:    4,
        understand:  6,
        apply:       6,
        analyse:     4,
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

  globallyExcludedTypes: [],

  mandatoryTags: ["numericals"],  // Every Physics question with calculation must carry this tag

  authoringNotes: [
    "Every numerical question must follow: Given → Find → Formula → Substitution → Calculation → Answer with unit.",
    "Units are mandatory in every answer that has a physical quantity.",
    "Competency questions should describe a real situation without labelling it (e.g. do not say 'using Newton's Second Law'). The student must identify which law applies.",
    "Case-study passages should use real scientific contexts: space missions, sports physics, engineering feats, natural phenomena.",
    "Assertion-Reason questions are very common in CBSE Science papers. Target 6 per major chapter.",
    "ICSE-style questions often require derivation of formulas — include at least 2 derivation questions per major chapter.",
    "For Classes 6–8, Physics is integrated with Science. Ensure questions do not require knowledge from later Science chapters.",
    "Direction and sign convention must be stated explicitly in every motion/force numerical.",
    "Free body diagrams: every force-problem solution must describe the free body diagram, even in text form.",
    "Verification: where applicable, solutions should verify the answer has physical meaning (e.g. velocity cannot be negative in a speed problem).",
  ],
};
