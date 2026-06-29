/**
 * Question Bank Blueprint — Economics
 *
 * Developer-only. Never imported by any runtime service.
 *
 * Note: Economics at Class 9 is part of Social Science (CBSE) and History/Civics/Economics
 * (ICSE). There are 4 chapters in the NCERT Economics textbook for Class 9.
 * Future expansion: Economic Geography (ICSE Class 9) and Economics Class 10.
 */

import type { SubjectBlueprint } from "../types";

export const ECONOMICS_BLUEPRINT: SubjectBlueprint = {
  subject:            "Economics",
  boardApplicability: "Both",

  categoryBlueprints: {

    major: {
      targetTotal: 70,
      byType: {
        concept:            10,
        ncert:              14,
        icse:                8,
        competency:         12,  // Economics strongly benefits from real-life scenario questions
        hots:               10,
        "previous-year":     8,
        "case-study":       10,  // Case study is the primary format in CBSE Social Science
        "assertion-reason":  6,
        olympiad:            2,  // NTSE Social Science level enrichment
      },
      byDifficulty: {
        Easy:      20,
        Medium:    28,
        Hard:      16,
        Olympiad:   6,
      },
      byBlooms: {
        remember:    8,
        understand: 16,
        apply:      20,
        analyse:    14,
        evaluate:    8,
        create:      4,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        true,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    standard: {
      targetTotal: 55,
      byType: {
        concept:            8,
        ncert:             12,
        icse:               6,
        competency:        10,
        hots:               8,
        "previous-year":    6,
        "case-study":        3,
        "assertion-reason":  2,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      16,
        Medium:    22,
        Hard:      14,
        Olympiad:   3,
      },
      byBlooms: {
        remember:    6,
        understand: 12,
        apply:      16,
        analyse:    12,
        evaluate:    7,
        create:      2,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        false,
      minHintsRequired:          1,
      minStepsRequired:          2,
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,
    },

    minor: {
      targetTotal: 35,
      byType: {
        concept:            6,
        ncert:              8,
        icse:               4,
        competency:         7,
        hots:               4,
        "previous-year":    4,
        "case-study":        2,
        "assertion-reason":  0,
        olympiad:            0,
      },
      byDifficulty: {
        Easy:      10,
        Medium:    14,
        Hard:       9,
        Olympiad:   2,
      },
      byBlooms: {
        remember:    4,
        understand:  8,
        apply:      10,
        analyse:     8,
        evaluate:    5,
        create:      0,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: false,
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

  mandatoryTags: ["real-life"],  // CMF-13: every Economics question must be grounded in a real situation

  authoringNotes: [
    "CMF-13 is mandatory for every Economics question: the everyday situation must precede the economic term or concept. No question should open with a textbook definition.",
    "Case-study is Economics' most powerful question format. CBSE Social Science papers increasingly use this format. Target 10 per standard/major chapter.",
    "Case-study passages should use real data: Census figures, NSSO data, government scheme statistics, newspaper reports, or village-level data (like Palampur). Avoid invented data.",
    "Competency questions should describe an economic scenario and ask the student to identify the concept, reason through the implications, or suggest a policy response.",
    "HOTS questions in Economics often work as 'what would happen if...' (policy analysis) or 'why does...' (causal reasoning): 'Why does disguised unemployment make GDP measurement difficult?'",
    "Assertion-Reason is effective for testing economic reasoning: the assertion states an economic fact; the reason states a causal mechanism. The most valuable questions test whether the stated reason is actually the correct explanation.",
    "ICSE Economics at Class 9 has some additional content on economic geography and consumer behaviour not in CBSE. Mark ICSE-specific questions with board: 'ICSE'.",
    "Ethical dimensions are especially natural in Economics: inequality, poverty, food security, labour rights, environmental economics — suitable for every chapter.",
    "Do not mix data from different years in the same question without noting the year. Economic statistics change rapidly.",
    "Avoid politically loaded questions on government policies. Frame questions around understanding the mechanism of a policy, not evaluating whether the government was right.",
    "Olympiad in Economics maps to NTSE Social Science level — include only conceptual enrichment, not advanced macroeconomics.",
  ],
};
