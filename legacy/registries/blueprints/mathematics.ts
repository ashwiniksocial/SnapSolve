/**
 * Question Bank Blueprint — Mathematics
 *
 * Developer-only. Never imported by any runtime service.
 *
 * Defines quota targets and authoring constraints for every Mathematics chapter.
 * Chapter categories (major / standard / minor / brief) are set in chapterRegistry.ts.
 * This blueprint maps each category to specific question-count targets.
 */

import type { SubjectBlueprint } from "../types";

export const MATHEMATICS_BLUEPRINT: SubjectBlueprint = {
  subject:            "Mathematics",
  boardApplicability: "Both",

  // ── Per-category blueprints ─────────────────────────────────────────────────
  categoryBlueprints: {

    major: {
      targetTotal: 80,
      byType: {
        concept:            10,  // Foundation: WHAT is this, WHY does it work
        ncert:              16,  // Standard exam preparation (most numerous)
        icse:               10,  // ICSE-specific rigour
        competency:         12,  // NEP: method-selection required
        hots:               10,  // Analyse / Evaluate / Create
        "previous-year":    10,  // Real exam questions
        "case-study":        4,  // Data-based or real-world passage (4 × 5-mark blocks)
        "assertion-reason":  4,  // Logical evaluation
        olympiad:            4,  // Enrichment (optional for weak chapters)
      },
      byDifficulty: {
        Easy:      24,           // 30% — accessible to all
        Medium:    32,           // 40% — core exam level
        Hard:      18,           // 22% — discriminates strong students
        Olympiad:   6,           //  8% — optional enrichment
      },
      byBlooms: {
        remember:    8,
        understand: 16,
        apply:      24,
        analyse:    18,
        evaluate:   10,
        create:      4,
      },
      caseStudyApplicable:      true,
      assertionReasonApplicable: true,
      olympiadApplicable:        true,
      minHintsRequired:          1,   // All questions; Hard/HOTS require 3
      minStepsRequired:          3,   // LongAnswer minimum
      minConceptNodesTagged:     2,
      minCommonErrorsTagged:     1,   // Hard/HOTS/Olympiad minimum
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
        "case-study":        3,
        "assertion-reason":  3,
        olympiad:            0,   // Not required for standard chapters
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
        "previous-year":    6,
        "case-study":        2,
        "assertion-reason":  0,
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

  // ── Subject-wide exclusions ─────────────────────────────────────────────────
  // Case-study and assertion-reason are applicable for most Maths chapters
  // but must not be forced on geometry-construction or brief chapters.
  globallyExcludedTypes: [],

  // ── Mandatory tags ──────────────────────────────────────────────────────────
  mandatoryTags: [],   // No mandatory tags for Mathematics beyond schema defaults

  // ── Authoring notes ─────────────────────────────────────────────────────────
  authoringNotes: [
    "Every numerical answer must include a unit check when the answer has a physical meaning.",
    "For proof questions: every step must cite the theorem, axiom, or previous step it relies on.",
    "HOTS questions must avoid being 'hard computation' — they must require an insight, not just more steps.",
    "Assertion-Reason questions in Mathematics most commonly use option (B) — both A and R true but R doesn't explain A. Avoid trivial option (A) questions.",
    "Case-study passages should use real data sources: census tables, architectural measurements, sports statistics, engineering contexts.",
    "ICSE-style questions should follow the Selina/Frank difficulty level and include formal proof language where appropriate.",
    "Olympiad questions are optional for standard and minor chapters — include only if a genuinely elegant connection to competition mathematics exists.",
    "Competency questions must NOT specify which theorem, formula, or method to use in the question stem.",
    "For Class 6–8, keep arithmetic concrete and computational. Abstract proof questions are appropriate from Class 8 onwards.",
    "Previous-year questions: prefer questions from the last 5 years. Verify the marking scheme matches the steps in the solution.",
  ],
};
