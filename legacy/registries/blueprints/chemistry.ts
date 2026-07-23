/**
 * Question Bank Blueprint — Chemistry
 *
 * Developer-only. Never imported by any runtime service.
 */

import type { SubjectBlueprint } from "../types";

export const CHEMISTRY_BLUEPRINT: SubjectBlueprint = {
  subject:            "Chemistry",
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
        "case-study":        6,   // Industrial processes, environmental chemistry
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
        apply:      22,
        analyse:    18,
        evaluate:   14,
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
      minStepsRequired:          2,
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

  mandatoryTags: ["equation-balancing"],  // Every question involving a chemical reaction must carry this tag if balancing is required

  authoringNotes: [
    "Every balanced chemical equation must be verified: count atoms of each element on both sides.",
    "State symbols (s), (l), (g), (aq) are mandatory in every chemical equation.",
    "Mole concept calculations must show: given → molar mass calculation → moles → final answer. No steps skipped.",
    "ICSE Chemistry expects correct IUPAC-adjacent naming and more formal equation writing than CBSE.",
    "Case-study passages should use industrial chemistry, environmental chemistry, or everyday chemistry contexts (e.g. water treatment, food preservation, alloys).",
    "Assertion-Reason questions are very effective for testing whether students understand WHY a chemical fact is true — not just THAT it is true.",
    "For Classes 6–8, Chemistry is integrated with Science. Do not require knowledge from later Science chapters.",
    "Competency questions should describe a real-world chemical situation without naming the concept (e.g. describe a rusting scenario without saying 'write the chemical equation for rusting').",
    "Ethical dimensions: industrial pollution, water contamination, and drug chemistry are suitable topics for NEP-ETH notes.",
    "Every question about acids/bases must state whether the context is aqueous solution — Arrhenius definitions apply to Class 9 only.",
  ],
};
