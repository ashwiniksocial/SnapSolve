/**
 * Question Bank Blueprint — Biology
 *
 * Developer-only. Never imported by any runtime service.
 */

import type { SubjectBlueprint } from "../types";

export const BIOLOGY_BLUEPRINT: SubjectBlueprint = {
  subject:            "Biology",
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
        "case-study":        8,   // Biology especially suited to case studies (medical, ecological, agricultural)
        "assertion-reason":  4,
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
        understand: 16,
        apply:      20,
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

  mandatoryTags: ["process-based"],  // Biology is story-driven; every process question carries this

  authoringNotes: [
    "Every biological process question must follow the CMF-11 rule: teach as a flowing story from start to end, not as a list of facts.",
    "Diagram-based questions must describe the diagram in words (since the bank is text-based). Include 'with reference to a labelled diagram' in the question and describe what the diagram should show in the solution.",
    "Case-study passages are Biology's strongest question type. Medical scenarios (disease outbreaks, nutrition deficiencies, surgical contexts), ecological data, and agricultural situations all work well.",
    "ICSE Biology (Classes 9–10) requires more detail on tissue types, organ systems, and biochemistry than CBSE.",
    "Competency questions should describe a biological situation (symptoms, observations, experimental results) and ask students to reason — not 'name the organelle' but 'explain why this cell type would have more mitochondria than the other'.",
    "HOTS questions in Biology often work as counterexamples or 'what would happen if...' scenarios: 'What would happen to a plant cell if the cell wall were absent?'",
    "Assertion-Reason is particularly effective in Biology for testing whether students understand WHY a biological fact is true, not just THAT it is true.",
    "Ethical dimensions: GMO crops, antibiotic resistance, organ donation, and vaccine development are suitable NEP-ETH topics.",
    "For Class 9 Biology, ensure questions distinguish between prokaryotes and eukaryotes consistently — this is a foundational distinction throughout the curriculum.",
    "Process sequences (digestion, photosynthesis, respiration) are best tested as sequence-ordering or 'explain step X in the process' rather than 'list all steps'.",
  ],
};
