// @ts-nocheck
/**
 * Question Bank — Chemistry, Class 9, Chapter 2 (file) / Official Ch5: Exploring Mixtures
 *
 * 31 questions — types: concept (5), ncert (11), competency (5), hots (4),
 *                        previous-year (3), assertion-reason (2), case-study (1)
 * Board: Both (CBSE + ICSE) | Category: standard | Schema: QuestionV2
 * CBSE 2026-27 Science (Code 086), Chapter 5 — Exploring Mixtures
 *
 * Difficulty distribution: Easy 9 · Medium 16 · Hard 6
 *
 * Topic coverage:
 *   t1  Types of Mixtures and Solutions   — 10 q
 *   t2  Colloids and Suspensions          —  8 q
 *   t3  Separation Techniques             — 10 q
 *   t4  Physical and Chemical Changes     —  3 q
 *
 * Concept nodes:
 *   chm:9:ch02:mixture-types
 *   chm:9:ch02:solution-properties
 *   chm:9:ch02:concentration-calculation
 *   chm:9:ch02:solubility
 *   chm:9:ch02:suspension-properties
 *   chm:9:ch02:colloid-properties
 *   chm:9:ch02:tyndall-effect
 *   chm:9:ch02:filtration
 *   chm:9:ch02:evaporation
 *   chm:9:ch02:distillation
 *   chm:9:ch02:crystallisation
 *   chm:9:ch02:sublimation
 *   chm:9:ch02:centrifugation
 *   chm:9:ch02:chromatography
 *   chm:9:ch02:physical-chemical-change
 *
 * Note: File identifier preserved as ch02 / CH02_IS_MATTER_AROUND_US_PURE to avoid
 * adapter import changes (architecture freeze). chapterName field updated to
 * "Exploring Mixtures" to match the official 2026-27 CBSE Chapter 5 name.
 *
 * v1 2026-07-09 — Initial authoring (StudyAI authoring team)
 */

import type { QuestionV2 } from "../../../types";
import { STANDARD_TAGS } from "../../../tagging";

export const CH02_IS_MATTER_AROUND_US_PURE: QuestionV2[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC t1 — Types of Mixtures and Solutions
  // ═══════════════════════════════════════════════════════════════════════════

  // ── CONCEPT (4 questions) ────────────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-con-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "concept", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 2,
    question: "Which of the following BEST describes a homogeneous mixture?\n(A) A mixture in which the components are uniformly distributed throughout and cannot be distinguished visually.\n(B) A mixture in which different components can be seen with the naked eye.\n(C) A mixture that contains only one type of atom.\n(D) A mixture that cannot be separated by any physical method.",
    answer: "A. In a homogeneous mixture (solution), the composition is uniform throughout — the solute particles are dispersed uniformly among solvent particles. No boundary between components is visible even under a microscope. Options B–D are all incorrect: B describes a heterogeneous mixture; C describes an element; D is wrong because solutions CAN be separated (e.g. by evaporation).",
    options: [
      "A) Uniformly distributed; cannot be distinguished visually",
      "B) Different components visible to the naked eye",
      "C) Contains only one type of atom",
      "D) Cannot be separated by any physical method",
    ],
    correctOption: "A",
    steps: [
      { stepNumber: 1, title: "Define homogeneous", explanation: "Homo = same. Every small portion sampled has the same composition. The mixture looks like a single phase." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "B → heterogeneous. C → pure element, not a mixture. D → wrong: solutions can be separated by evaporation." },
    ],
    hint: "The prefix 'homo' means 'same'. What is the same throughout the mixture?",
    keyConcepts: ["homogeneous mixture", "solution", "uniform composition"],
    conceptsCovered: ["chm:9:ch02:mixture-types"],
    prerequisites: [],
    commonErrors: ["Confusing 'homogeneous' with 'pure substance' — a solution is a mixture even though it looks uniform."],
    tags: [STANDARD_TAGS.CONCEPTUAL, "class9", "ch02", "mixture-types", "homogeneous"],
    source: "concept",
  },

  {
    id: "bo-chm-9-ch02-con-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "concept", questionFormat: "TrueOrFalse",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 2,
    question: "True or False: A compound is a type of mixture because it contains more than one kind of atom.",
    answer: "False. A compound is a pure substance, not a mixture. Atoms of different elements are chemically combined in a fixed, definite ratio by mass; this bonding creates a new substance with properties entirely different from the constituent elements. A mixture, by contrast, has no chemical bonding between components, variable composition, and components that retain their individual properties.",
    steps: [
      { stepNumber: 1, title: "Define pure substance", explanation: "Both elements and compounds are pure substances — fixed composition, cannot be separated by physical methods." },
      { stepNumber: 2, title: "Define compound", explanation: "Chemical combination in fixed ratio. Water: H:O = 1:8 by mass always. This fixed ratio + bonding = pure substance." },
      { stepNumber: 3, title: "Contrast with mixture", explanation: "In a salt solution, the ratio of salt to water can vary. No new substance forms. Components keep their properties." },
    ],
    hint: "Can the ratio of components vary? If yes → mixture. If the ratio is always fixed → compound (pure substance).",
    keyConcepts: ["pure substance", "compound", "mixture", "fixed composition"],
    conceptsCovered: ["chm:9:ch02:mixture-types"],
    prerequisites: [],
    commonErrors: ["Thinking 'more than one element = mixture' — compounds have more than one type of atom but are pure substances."],
    tags: [STANDARD_TAGS.CONCEPTUAL, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "element-compound-mixture"],
    source: "concept",
  },

  {
    id: "bo-chm-9-ch02-con-003",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "concept", questionFormat: "ShortAnswer",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 2, estimatedTimeMinutes: 3,
    question: "State THREE properties of a true solution that distinguish it from a suspension.",
    answer: "(1) Particle size: Solution particles (ions or molecules) are < 1 nm in diameter; suspension particles are > 100 nm and visible to the naked eye or under a microscope.\n(2) Stability: A solution is stable indefinitely — solute does not settle on standing. A suspension is unstable — particles settle over time.\n(3) Filterability: A solution cannot be filtered through ordinary filter paper (particles are too small to be retained). A suspension can be filtered — particles are trapped on the filter paper.",
    steps: [
      { stepNumber: 1, title: "Particle size", explanation: "Solution: < 1 nm (ions/molecules). Suspension: > 100 nm (visible on settling)." },
      { stepNumber: 2, title: "Stability", explanation: "Solution: no settling. Suspension: particles settle on standing." },
      { stepNumber: 3, title: "Filterability", explanation: "Solution: passes completely through filter paper. Suspension: particles retained on filter paper." },
    ],
    hint: "Think about particle size, whether particles settle, and whether they pass through filter paper.",
    keyConcepts: ["solution", "suspension", "particle size", "stability", "filterability"],
    conceptsCovered: ["chm:9:ch02:solution-properties", "chm:9:ch02:suspension-properties"],
    prerequisites: [],
    commonErrors: ["Saying solutions can be filtered — they cannot. Only suspensions (and coarse colloids with special membranes) are separated by filtration."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "solution-vs-suspension"],
    source: "concept",
  },

  {
    id: "bo-chm-9-ch02-con-004",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "concept", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "remember",
    marks: 1, estimatedTimeMinutes: 1,
    question: "Which of the following is a correct example of a solid dissolved in a liquid (true solution)?\n(A) Fog\n(B) Sugar dissolved in water\n(C) Oil and water shaken together\n(D) Sand in water",
    answer: "B. Sugar dissolved in water is a true solution — solid (sugar) dissolved in liquid (water), homogeneous, particle size < 1 nm. Fog is a colloid (liquid in gas). Oil + water is a heterogeneous mixture (two immiscible liquid phases). Sand in water is a suspension (undissolved solid settles).",
    options: ["A) Fog", "B) Sugar dissolved in water", "C) Oil and water shaken together", "D) Sand in water"],
    correctOption: "B",
    steps: [
      { stepNumber: 1, title: "Check each option", explanation: "A: fog = colloid. B: sugar in water = true solution ✓. C: oil + water = heterogeneous/emulsion. D: sand = suspension." },
    ],
    hint: "A true solution is transparent and uniform — you cannot see the solute particles.",
    keyConcepts: ["solution", "solute", "solvent"],
    conceptsCovered: ["chm:9:ch02:solution-properties"],
    prerequisites: [],
    commonErrors: ["Choosing D — sand does not dissolve; it forms a suspension, not a solution."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, "class9", "ch02", "solution-examples"],
    source: "concept",
  },

  // ── NCERT-STYLE (4 questions, t1) ───────────────────────────────────────

  {
    id: "bo-chm-9-ch02-nce-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "Differentiate between a homogeneous mixture and a heterogeneous mixture. Give two examples of each.",
    answer: "Homogeneous mixture: Uniform composition throughout; components cannot be distinguished by the naked eye; appears as a single phase. Examples: (1) Salt dissolved in water (brine). (2) Air — a uniform mixture of N₂, O₂, Ar, CO₂, and other gases.\n\nHeterogeneous mixture: Non-uniform composition; components are visually distinguishable; more than one phase present. Examples: (1) Sand and gravel. (2) Oil and water (two visible layers).",
    steps: [
      { stepNumber: 1, title: "Define homogeneous", explanation: "Uniform; any portion sampled has same composition; appears as one phase." },
      { stepNumber: 2, title: "Examples of homogeneous", explanation: "Salt water, air, vinegar, copper sulphate solution." },
      { stepNumber: 3, title: "Define heterogeneous", explanation: "Non-uniform; components distinguishable; more than one phase." },
      { stepNumber: 4, title: "Examples of heterogeneous", explanation: "Sand + gravel, oil + water, soil, muddy water." },
    ],
    hint: "Homogeneous = 1 phase throughout. Heterogeneous = multiple phases visible.",
    keyConcepts: ["homogeneous mixture", "heterogeneous mixture", "uniform composition"],
    conceptsCovered: ["chm:9:ch02:mixture-types"],
    prerequisites: [],
    commonErrors: ["Giving air as an example of heterogeneous — air is homogeneous (gases mix uniformly)."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "mixture-classification"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "ncert", questionFormat: "Numerical",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: 4,
    question: "Calculate the mass by mass percentage (w/w%) of a solution prepared by dissolving 10 g of common salt (NaCl) in 90 g of water.",
    answer: "Mass of solute (NaCl) = 10 g\nMass of solvent (water) = 90 g\nMass of solution = 10 + 90 = 100 g\n\nw/w% = (mass of solute ÷ mass of solution) × 100\n= (10 ÷ 100) × 100\n= 10%\n\nThe solution is 10% (w/w) NaCl.",
    steps: [
      { stepNumber: 1, title: "Identify given quantities", explanation: "Mass of solute (NaCl) = 10 g; mass of solvent (water) = 90 g.", formula: "w/w% = (mass of solute / mass of solution) × 100" },
      { stepNumber: 2, title: "Calculate mass of solution", explanation: "Mass of solution = 10 + 90 = 100 g." },
      { stepNumber: 3, title: "Apply formula", explanation: "w/w% = (10 / 100) × 100 = 10%.", result: "10% (w/w) NaCl solution" },
    ],
    hint: "First add the masses to get total mass of solution, then: (mass of solute ÷ mass of solution) × 100.",
    keyConcepts: ["concentration", "mass percentage", "w/w percent"],
    conceptsCovered: ["chm:9:ch02:concentration-calculation"],
    prerequisites: [],
    commonErrors: ["Dividing mass of solute by mass of SOLVENT instead of mass of SOLUTION — gives (10/90) × 100 = 11.1%, which is wrong."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.NUMERICALS, "class9", "ch02", "concentration"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-003",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "What is meant by a saturated solution? How does an unsaturated solution differ from a supersaturated solution? State one way to convert an unsaturated solution into a saturated one.",
    answer: "Saturated solution: Contains the maximum amount of solute that can dissolve at a given temperature. If excess solute is added, it settles undissolved.\n\nUnsaturated solution: Contains less solute than the maximum that can dissolve at that temperature — more solute can be added and it will dissolve.\n\nSupersaturated solution: Contains more dissolved solute than a saturated solution at the same temperature. Prepared by dissolving solute at high temperature then cooling slowly — the excess stays dissolved in an unstable equilibrium and crystallises out on disturbance.\n\nConverting unsaturated to saturated: Add more solute with stirring at constant temperature until no more dissolves (excess solute remains at the bottom).",
    steps: [
      { stepNumber: 1, title: "Saturated solution", explanation: "Maximum dissolved solute at given T. Adding more: it settles undissolved." },
      { stepNumber: 2, title: "Unsaturated vs supersaturated", explanation: "Unsaturated: below max capacity. Supersaturated: above normal max (metastable, crystallises on disturbance)." },
      { stepNumber: 3, title: "Converting unsaturated → saturated", explanation: "Add solute with stirring at constant T until no more dissolves." },
    ],
    hint: "Think of saturation like a glass filled to the brim. Saturated = full; unsaturated = not full; supersaturated = temporarily overflowing.",
    keyConcepts: ["saturated solution", "unsaturated solution", "supersaturated solution", "solubility"],
    conceptsCovered: ["chm:9:ch02:solubility"],
    prerequisites: [],
    commonErrors: ["Confusing supersaturated with saturated — supersaturated has MORE solute than saturated at that temperature."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "solubility"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-004",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "ncert", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 2,
    question: "Which of the following is NOT a mixture?\n(A) Air\n(B) Brass\n(C) Distilled water\n(D) Salt solution",
    answer: "C. Distilled water is a pure substance (compound, H₂O) with fixed composition — 2 H atoms bonded to 1 O atom, always. Air is a mixture of gases. Brass is an alloy (Cu + Zn, variable proportions). Salt solution is NaCl + water in variable ratio.",
    options: ["A) Air", "B) Brass", "C) Distilled water", "D) Salt solution"],
    correctOption: "C",
    steps: [
      { stepNumber: 1, title: "Check each option", explanation: "Air: N₂ + O₂ + others = mixture. Brass: Cu + Zn = mixture. Distilled water: pure H₂O, fixed formula = pure substance ✓. Salt solution: variable composition = mixture." },
    ],
    hint: "A pure substance has a fixed, invariable chemical composition. Which option has a fixed chemical formula?",
    examTip: "Distilled water is the classic trap — students associate 'water' with 'mixture' because they drink impure water daily.",
    keyConcepts: ["mixture", "pure substance", "compound"],
    conceptsCovered: ["chm:9:ch02:mixture-types"],
    prerequisites: [],
    commonErrors: ["Choosing A (air) — air IS a mixture so it does not fit the 'not a mixture' criterion."],
    tags: [STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "mixture-identification"],
    source: "original",
  },

  // ── COMPETENCY (2 questions, t1) ─────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-cmp-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 3, estimatedTimeMinutes: 5,
    question: "A student dissolves 25 g of glucose in 200 g of water. The student claims the resulting solution is a pure substance because 'it is transparent and uniform throughout.' Evaluate this claim. Give two reasons for your answer.",
    answer: "The student is INCORRECT. A solution is a homogeneous MIXTURE — not a pure substance.\n\nReason 1 (Variable composition): A pure substance has a fixed, invariable composition. The student's 25 g:200 g ratio was arbitrary — they could dissolve 10 g or 50 g instead. No fixed ratio exists, so it cannot be a pure substance.\n\nReason 2 (Components retain identities): Glucose molecules remain chemically unchanged in solution. The glucose can be recovered unchanged by evaporation — it was never chemically transformed. In a compound (true pure substance), components are bonded and cannot be recovered by simple physical means.",
    steps: [
      { stepNumber: 1, title: "Identify the error", explanation: "'Transparent + uniform' describes homogeneous mixtures, not exclusively pure substances." },
      { stepNumber: 2, title: "Reason 1 — variable composition", explanation: "The 25 g:200 g ratio was chosen arbitrarily. Pure substances have fixed composition." },
      { stepNumber: 3, title: "Reason 2 — components retain identities", explanation: "Glucose is recoverable unchanged by evaporation. In a compound, components are bonded." },
    ],
    hint: "Ask: can the amount of glucose dissolved vary while still making the 'same substance'? What does that tell you about purity?",
    keyConcepts: ["pure substance", "mixture", "variable composition", "homogeneous mixture"],
    conceptsCovered: ["chm:9:ch02:mixture-types", "chm:9:ch02:solution-properties"],
    prerequisites: [],
    commonErrors: ["Accepting the claim because solutions look uniform — uniformity of appearance does NOT guarantee a pure substance."],
    tags: [STANDARD_TAGS.CONCEPTUAL, STANDARD_TAGS.NEP_COMPETENCY, "class9", "ch02", "pure-substance-vs-mixture"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-cmp-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t1", topicName: "Types of Mixtures and Solutions",
    questionType: "competency", questionFormat: "Numerical",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 3, estimatedTimeMinutes: 5,
    question: "A pharmacist must prepare a standard saline solution containing exactly 0.9% (w/v) NaCl for intravenous use. How many grams of NaCl are needed to prepare 500 mL of this solution?",
    answer: "Formula: w/v% = (mass of solute in g / volume of solution in mL) × 100\n\nRearranging: mass of solute = (w/v% × volume) ÷ 100\n= (0.9 × 500) ÷ 100\n= 450 ÷ 100\n= 4.5 g\n\n4.5 g of NaCl dissolved in water, made up to 500 mL, gives a 0.9% (w/v) saline solution.",
    steps: [
      { stepNumber: 1, title: "Identify the formula", explanation: "w/v% = (mass of solute / volume of solution) × 100. Mass in grams; volume in mL.", formula: "w/v% = (m / V) × 100" },
      { stepNumber: 2, title: "Rearrange for mass", explanation: "m = (w/v% × V) ÷ 100 = (0.9 × 500) ÷ 100." },
      { stepNumber: 3, title: "Calculate", explanation: "m = 450 ÷ 100 = 4.5 g NaCl.", result: "4.5 g NaCl" },
    ],
    hint: "Rearrange w/v% = (mass/volume) × 100 to get mass = (w/v% × volume) ÷ 100.",
    keyConcepts: ["concentration", "w/v percentage", "saline solution"],
    conceptsCovered: ["chm:9:ch02:concentration-calculation"],
    prerequisites: [],
    commonErrors: ["Using w/w formula (dividing by total mass) instead of w/v (dividing by volume in mL)."],
    tags: [STANDARD_TAGS.NUMERICALS, STANDARD_TAGS.REAL_LIFE, "class9", "ch02", "concentration", "w-v-percent"],
    source: "original",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC t2 — Colloids and Suspensions
  // ═══════════════════════════════════════════════════════════════════════════

  // ── CONCEPT (1 question) ─────────────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-con-005",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "concept", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "What is the Tyndall effect? Why is it shown by colloids but not by true solutions? Give one everyday example where you can observe it.",
    answer: "Tyndall effect: The scattering of a beam of light when it passes through a colloid, making the path of the light beam visible as a bright cone or streak.\n\nWhy colloids show it: Colloid particles (1–100 nm diameter) are large enough to scatter visible light. When light hits these particles, it is scattered in all directions, making the beam path visible.\n\nWhy true solutions do not show it: In a true solution, solute particles (ions/molecules, < 1 nm) are far too small to scatter visible light. The beam passes through unscattered and the path is invisible.\n\nEveryday example: Sunlight streaming through a dusty room or into fog — the beam is clearly visible because dust/fog particles (colloid) scatter the light.",
    steps: [
      { stepNumber: 1, title: "Define Tyndall effect", explanation: "Scattering of light by colloidal particles; makes the light path visible as a glowing beam." },
      { stepNumber: 2, title: "Why colloids scatter light", explanation: "Colloid particles (1–100 nm) are large enough to interact with visible light wavelengths." },
      { stepNumber: 3, title: "Why solutions do not scatter light", explanation: "Dissolved particles (< 1 nm) are much smaller than light wavelengths — they cannot scatter visible light." },
      { stepNumber: 4, title: "Everyday example", explanation: "Sunlight in a dusty room; car headlights in fog; projector beam in a smoky hall." },
    ],
    hint: "The key is particle size — compare colloid particles to dissolved particles, and to the wavelength of visible light.",
    keyConcepts: ["Tyndall effect", "colloid", "light scattering", "particle size"],
    conceptsCovered: ["chm:9:ch02:tyndall-effect", "chm:9:ch02:colloid-properties"],
    prerequisites: [],
    commonErrors: ["Saying solutions show a 'faint' Tyndall effect — true solutions show NO Tyndall effect. Any scattering indicates colloidal particles."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "tyndall-effect"],
    source: "concept",
  },

  // ── NCERT-STYLE (3 questions, t2) ────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-nce-005",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "Classify the following as solution, colloid, or suspension, giving a reason for each: (a) blood, (b) fog, (c) muddy river water, (d) ink.",
    answer: "(a) Blood — Colloid. Blood plasma contains dissolved salts and proteins dispersed in the colloidal size range. It shows the Tyndall effect and does not settle on standing at rest.\n(b) Fog — Colloid (aerosol). Tiny water droplets dispersed in air; classified as a colloidal aerosol in NCERT. Visible as a Tyndall cone in car headlights.\n(c) Muddy river water — Suspension. Contains large clay and silt particles (> 100 nm) that settle on standing and are retained on filter paper.\n(d) Ink — Colloid (sol). Pigment particles dispersed in water in the colloidal size range. Fresh ink shows the Tyndall effect and is stable.",
    steps: [
      { stepNumber: 1, title: "Particle size criterion", explanation: "Solution: < 1 nm. Colloid: 1–100 nm. Suspension: > 100 nm." },
      { stepNumber: 2, title: "Blood", explanation: "Colloidal dispersion of proteins and cells — stable, shows Tyndall effect." },
      { stepNumber: 3, title: "Fog", explanation: "Aerosol (liquid in gas) — tiny water droplets dispersed in air, classified as a colloidal aerosol by NCERT." },
      { stepNumber: 4, title: "Muddy water", explanation: "Suspension — large soil particles settle on standing, can be filtered." },
      { stepNumber: 5, title: "Ink", explanation: "Sol (solid in liquid) — colloidal pigment in water, stable." },
    ],
    hint: "Ask three questions: Do particles settle? Can it be filtered? Does it show the Tyndall effect?",
    keyConcepts: ["colloid", "suspension", "solution", "Tyndall effect", "particle size"],
    conceptsCovered: ["chm:9:ch02:colloid-properties", "chm:9:ch02:suspension-properties"],
    prerequisites: [],
    commonErrors: ["Classifying blood as a solution because it looks uniform — blood is a complex colloidal system."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "colloid-suspension-classification"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-006",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 3, estimatedTimeMinutes: 4,
    question: "How would you distinguish between a colloid and a suspension in the laboratory? Describe the expected result of each test for both types.",
    answer: "Test 1 — Filtration: Pass both through ordinary filter paper.\nColloid: passes completely through (colloidal particles, 1–100 nm, are smaller than filter paper pores of ~1 µm).\nSuspension: particles retained on filter paper (suspension particles > 100 nm, often > 1 µm).\n\nTest 2 — Standing test: Allow both to stand undisturbed for several hours.\nColloid: remains stable — no visible settling.\nSuspension: particles settle at the bottom, leaving clearer liquid above.\n\nConclusion: Use both tests together. A colloid passes filter paper AND shows no settling. A suspension is filtered AND settles.",
    steps: [
      { stepNumber: 1, title: "Filtration test", explanation: "Colloid passes through; suspension is retained. Filter paper pores ~1 µm." },
      { stepNumber: 2, title: "Settling test", explanation: "Colloid is stable (no settling); suspension settles on standing." },
    ],
    hint: "Two tests together give a definitive answer: filterability + stability on standing.",
    keyConcepts: ["colloid", "suspension", "filtration", "stability", "settling"],
    conceptsCovered: ["chm:9:ch02:colloid-properties", "chm:9:ch02:suspension-properties"],
    prerequisites: [],
    commonErrors: ["Using Tyndall effect alone — both colloids and suspensions scatter light. Stability and filterability are more definitive distinguishers."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, "class9", "ch02", "colloid-vs-suspension"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-007",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "ncert", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 1, estimatedTimeMinutes: 2,
    question: "Which of the following shows the Tyndall effect?\n(A) Salt solution\n(B) Sugar solution\n(C) Milk\n(D) Vinegar",
    answer: "C. Milk is a colloid — fat and protein particles (colloidal size range) scatter light and show the Tyndall effect. Salt solution, sugar solution, and vinegar (acetic acid in water) are all true solutions with particles < 1 nm — they do not show the Tyndall effect.",
    options: ["A) Salt solution", "B) Sugar solution", "C) Milk", "D) Vinegar"],
    correctOption: "C",
    steps: [
      { stepNumber: 1, title: "Apply criterion", explanation: "Only colloids show the Tyndall effect. Classify each: NaCl solution = true solution; sugar solution = true solution; milk = colloid ✓; vinegar = true solution." },
    ],
    examTip: "Milk is the most frequently tested colloid in CBSE Tyndall effect questions. Always remember: milk = colloid.",
    keyConcepts: ["Tyndall effect", "colloid", "true solution", "milk"],
    conceptsCovered: ["chm:9:ch02:tyndall-effect"],
    prerequisites: [],
    commonErrors: ["Choosing vinegar because it is 'cloudy' — commercial vinegar is a clear true solution (5% acetic acid in water)."],
    tags: [STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "tyndall-effect"],
    source: "original",
  },

  // ── COMPETENCY (1 question, t2) ─────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-cmp-003",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 3, estimatedTimeMinutes: 5,
    question: "Meera shines her phone's torch through a glass of warm fresh milk in a dark room and sees a visible glowing beam. The same torch shone through filtered mineral water shows no such beam. Explain what type of mixture each liquid is, and identify the principle responsible for the observation.",
    answer: "Fresh milk — Colloid: Milk is a colloidal dispersion of fat globules and casein protein micelles in water. These particles are in the colloidal size range (1–100 nm per NCERT definition).\n\nFiltered mineral water — True solution: Dissolved mineral salts (Ca²⁺, Mg²⁺, Na⁺, Cl⁻, etc.) are ionic — particle size < 1 nm. Far too small to scatter visible light.\n\nPrinciple — Tyndall effect: When light passes through milk, the colloidal fat and protein particles scatter the light in all directions, making the beam path visible. The mineral water's dissolved ions are too small to scatter visible light, so no beam appears.",
    steps: [
      { stepNumber: 1, title: "Classify milk", explanation: "Milk = colloid (fat + protein particles, colloidal size range) → scatters light → Tyndall beam visible." },
      { stepNumber: 2, title: "Classify mineral water", explanation: "Filtered mineral water = true solution (dissolved ions, < 1 nm) → no light scattering → no visible beam." },
      { stepNumber: 3, title: "Name the principle", explanation: "Tyndall effect — scattering of light by colloidal particles makes the beam visible." },
    ],
    hint: "The glowing beam only appears in mixtures with particles large enough to scatter light.",
    keyConcepts: ["Tyndall effect", "colloid", "true solution"],
    conceptsCovered: ["chm:9:ch02:tyndall-effect", "chm:9:ch02:colloid-properties"],
    prerequisites: [],
    commonErrors: ["Saying mineral water shows no beam because it is 'purer' — the real reason is particle size, not purity per se."],
    tags: [STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.REAL_LIFE, STANDARD_TAGS.NEP_COMPETENCY, "class9", "ch02", "tyndall-effect"],
    source: "original",
  },

  // ── ASSERTION-REASON (1 question, t2) ────────────────────────────────────

  {
    id: "bo-chm-9-ch02-asr-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "assertion-reason", questionFormat: "AssertionReason",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 1, estimatedTimeMinutes: 3,
    question: "Assertion (A): Fog shows the Tyndall effect when a beam of light is passed through it.\nReason (R): Fog is a type of solution in which tiny water droplets are dissolved in air.\n\n(A) Both A and R are true and R is the correct explanation of A.\n(B) Both A and R are true but R is NOT the correct explanation of A.\n(C) A is true but R is false.\n(D) A is false but R is true.",
    answer: "C — A is true but R is false.\n\nA is TRUE: Fog does show the Tyndall effect — car headlights in fog show a visible light cone.\n\nR is FALSE: Fog is NOT a solution. Fog is a colloid (aerosol — tiny liquid water droplets dispersed in air). In a solution, one substance dissolves at molecular/ionic level. Water droplets in fog are not dissolved in air; they are dispersed as separate liquid particles. Classifying fog as a solution is incorrect.",
    options: [
      "A) Both A and R true; R explains A",
      "B) Both A and R true; R does not explain A",
      "C) A true; R false",
      "D) A false; R true",
    ],
    correctOption: "C",
    steps: [
      { stepNumber: 1, title: "Evaluate Assertion", explanation: "Fog scatters light — Tyndall effect confirmed. A is TRUE." },
      { stepNumber: 2, title: "Evaluate Reason", explanation: "Fog = colloid (aerosol), NOT a solution. Water droplets are dispersed, not dissolved. R is FALSE." },
    ],
    hint: "Evaluate A and R independently. Does fog show the Tyndall effect (A)? Is fog a solution or something else (R)?",
    keyConcepts: ["Tyndall effect", "colloid", "aerosol", "fog", "solution"],
    conceptsCovered: ["chm:9:ch02:tyndall-effect", "chm:9:ch02:colloid-properties"],
    prerequisites: [],
    commonErrors: ["Choosing A — students may think R sounds right because fog 'mixes' water and air, without distinguishing 'dissolved' from 'dispersed'."],
    tags: [STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "tyndall-effect", "assertion-reason"],
    source: "original",
  },

  // ── HOTS (1 question, t2) ────────────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-hot-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t2", topicName: "Colloids and Suspensions",
    questionType: "hots", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 3, estimatedTimeMinutes: 6,
    question: "A student claims that observing a visible glowing beam when a laser is shone through a liquid is sufficient to prove the liquid is a colloid. Evaluate this claim. Is the Tyndall effect alone sufficient to classify a mixture as a colloid? Suggest one additional test to make the classification definitive.",
    answer: "The claim is PARTIALLY correct but not sufficient on its own.\n\nLimitation: A suspension also scatters light and produces a visible beam — suspension particles (> 100 nm) scatter even more intensely than colloidal particles. So a glowing beam alone cannot distinguish a colloid from a suspension.\n\nWhat the Tyndall effect proves: The mixture is NOT a true solution (particles > 1 nm present). It does NOT prove the mixture is a colloid rather than a suspension.\n\nAdditional definitive test — Stability/settling test: Allow the mixture to stand undisturbed for several hours or days. A colloid remains stable — no visible settling. A suspension settles — particles collect at the bottom, leaving a clearer liquid above. If the beam disappears after settling, it was a suspension; if the beam persists, it is a colloid.",
    steps: [
      { stepNumber: 1, title: "Does a suspension also produce a visible beam?", explanation: "Yes. Suspension particles are larger and scatter light strongly. Tyndall effect alone ≠ colloid." },
      { stepNumber: 2, title: "What does the Tyndall effect prove?", explanation: "Only that the mixture is NOT a true solution. It does not distinguish colloid from suspension." },
      { stepNumber: 3, title: "Additional test — stability/settling", explanation: "Colloid: stable, no settling. Suspension: particles settle. This definitively separates them." },
    ],
    hint: "Does only a colloid scatter light? What other type of dispersion could produce a visible beam?",
    hint2: "What is the key physical difference between a colloid (stable) and a suspension (unstable) over time?",
    hint3: "Let the mixture stand. If particles settle, it was a suspension, not a colloid.",
    keyConcepts: ["Tyndall effect", "colloid", "suspension", "stability", "classification"],
    conceptsCovered: ["chm:9:ch02:tyndall-effect", "chm:9:ch02:colloid-properties", "chm:9:ch02:suspension-properties"],
    prerequisites: [],
    commonErrors: ["Saying 'Tyndall effect confirms colloid' — it only rules out a true solution, not a suspension."],
    tags: [STANDARD_TAGS.TRICKY, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "tyndall-effect", "hots"],
    source: "original",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC t3 — Separation Techniques
  // ═══════════════════════════════════════════════════════════════════════════

  // ── NCERT-STYLE (4 questions, t3) ────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-nce-008",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Easy", bloomsLevel: "understand",
    marks: 2, estimatedTimeMinutes: 3,
    question: "Why is crystallisation preferred over simple evaporation to dryness for obtaining pure copper sulphate crystals from an impure solution?",
    answer: "Crystallisation is preferred for two reasons:\n(1) Preserves the product: Copper sulphate exists as CuSO₄·5H₂O (blue hydrated crystals). If heated to dryness, the high temperature drives off the water of crystallisation, converting it to anhydrous CuSO₄ (white powder) — the product is degraded. Crystallisation uses controlled moderate cooling (not excess heat), preserving the hydrated crystals.\n(2) Better purity: During crystallisation, the pure solute crystallises out while impurities (present in smaller amounts) remain dissolved in the mother liquor (residual solution). Simple evaporation to dryness deposits everything together — impure product.",
    steps: [
      { stepNumber: 1, title: "Problem with evaporation", explanation: "High heat destroys water of crystallisation in CuSO₄·5H₂O → white anhydrous CuSO₄. Product form changed." },
      { stepNumber: 2, title: "Advantage 1 — preserves hydrated form", explanation: "Moderate cooling crystallises the blue CuSO₄·5H₂O crystals intact." },
      { stepNumber: 3, title: "Advantage 2 — better purity", explanation: "Impurities remain in mother liquor; crystals themselves are purer." },
    ],
    hint: "Think about what happens to the water in CuSO₄·5H₂O if you apply strong heat. Then think about what crystallisation does instead.",
    keyConcepts: ["crystallisation", "evaporation", "water of crystallisation", "purity"],
    conceptsCovered: ["chm:9:ch02:crystallisation"],
    prerequisites: [],
    commonErrors: ["Saying 'evaporation is faster' as a reason for crystallisation — purity and product integrity are the criteria, not speed."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "crystallisation"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-009",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "Name the separation technique used in each of the following and state its underlying principle:\n(a) Separating cream from milk.\n(b) Separating a mixture of camphor and sand.\n(c) Separating different coloured dyes in black ink.",
    answer: "(a) Centrifugation — Principle: Rapid spinning creates a high centrifugal force. Denser components move to the outer edge (bottom of the tube), while lighter components (cream) concentrate towards the top/centre. Used because milk is a colloid — normal filtration does not work.\n\n(b) Sublimation — Principle: Camphor converts directly from solid to vapour on gentle heating (sublimes) without passing through a liquid phase. Sand does not sublime. Camphor vapour rises and is collected on a cooled surface, leaving sand behind.\n\n(c) Chromatography — Principle: Different dye molecules have different degrees of adsorption on the paper (stationary phase) and different solubilities in the solvent (mobile phase). Solvent travels up the paper; dyes travel at different rates and separate into distinct coloured bands.",
    steps: [
      { stepNumber: 1, title: "Cream from milk", explanation: "Centrifugation — uses centrifugal force to separate components of different densities in a colloidal system." },
      { stepNumber: 2, title: "Camphor from sand", explanation: "Sublimation — camphor sublimes; sand does not. Gentle heat separates them." },
      { stepNumber: 3, title: "Dyes in ink", explanation: "Chromatography — different adsorption and solubility cause different travel rates on paper." },
    ],
    hint: "Match the situation: spinning → centrifugation; solid vaporises directly → sublimation; components travel different distances on paper → chromatography.",
    keyConcepts: ["centrifugation", "sublimation", "chromatography", "separation techniques"],
    conceptsCovered: ["chm:9:ch02:centrifugation", "chm:9:ch02:sublimation", "chm:9:ch02:chromatography"],
    prerequisites: [],
    commonErrors: ["Saying 'filtration' for cream from milk — milk is a colloid; cream particles pass through filter paper. Centrifugation is required."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "separation-techniques"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-010",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "ncert", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "apply",
    marks: 1, estimatedTimeMinutes: 2,
    question: "Which separation technique would be MOST appropriate to separate iron filings from a mixture of iron filings and sulfur powder?\n(A) Filtration\n(B) Distillation\n(C) Magnetic separation\n(D) Centrifugation",
    answer: "C. Magnetic separation. Iron is a magnetic material — a magnet attracts iron filings, leaving the non-magnetic sulfur powder behind. Filtration cannot separate two dry solids of similar particle size. Distillation and centrifugation require liquids and are not applicable here.",
    options: ["A) Filtration", "B) Distillation", "C) Magnetic separation", "D) Centrifugation"],
    correctOption: "C",
    steps: [
      { stepNumber: 1, title: "Property of iron", explanation: "Iron is magnetic; sulfur is not. Magnetic separation exploits this difference." },
      { stepNumber: 2, title: "Eliminate others", explanation: "Filtration: separates insoluble solid from liquid — not two dry solids. Distillation/centrifugation: require liquids." },
    ],
    hint: "Iron has a unique property that sulfur does not — it is attracted to magnets.",
    keyConcepts: ["magnetic separation", "iron", "sulfur"],
    conceptsCovered: ["chm:9:ch02:filtration"],
    prerequisites: [],
    commonErrors: ["Choosing filtration — you cannot filter two dry solid powders by size using a filter."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, "class9", "ch02", "magnetic-separation"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-nce-011",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "ncert", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "understand",
    marks: 3, estimatedTimeMinutes: 4,
    question: "Explain the principle of chromatography. How is it used to separate coloured dyes in a mixture of inks? Describe the expected observation if the ink contains three distinct dyes.",
    answer: "Principle: Chromatography separates components based on their different tendencies to be adsorbed (retained) on a stationary phase versus their different solubilities in the mobile phase (solvent). Components that adsorb strongly travel slowly; those with greater solubility in the solvent travel faster.\n\nProcedure: Place an ink spot on a pencil baseline on chromatography paper (ABOVE the solvent level). Dip the bottom of the strip in solvent. Solvent rises by capillary action, carrying dyes upward at different rates. After the solvent front nears the top, remove and dry the strip.\n\nExpected observation (3 dyes): Three distinct coloured bands (spots) appear at different heights. Each band represents one dye. The dye most soluble in the solvent travels furthest; the dye most adsorbed on paper travels least. The Rf value of each band (distance by dye ÷ distance by solvent) identifies the dye.",
    steps: [
      { stepNumber: 1, title: "Principle", explanation: "Differential adsorption on stationary phase + differential solubility in mobile phase → components travel at different speeds." },
      { stepNumber: 2, title: "Key procedural point", explanation: "Ink spot must be ABOVE the solvent level to avoid direct dissolution into the bulk solvent." },
      { stepNumber: 3, title: "Expected result", explanation: "Three separate coloured bands at different heights, one per dye. Rf = component distance / solvent distance." },
    ],
    hint: "Remember: spot must be above solvent level — this is a commonly penalised omission in board exams.",
    examTip: "Mentioning that the ink spot must be above the solvent level is frequently tested in CBSE and earns a dedicated mark.",
    keyConcepts: ["chromatography", "stationary phase", "mobile phase", "Rf value", "adsorption"],
    conceptsCovered: ["chm:9:ch02:chromatography"],
    prerequisites: [],
    commonErrors: ["Forgetting to state that the ink spot must be ABOVE the solvent level — this is the most frequently penalised omission."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "chromatography"],
    source: "original",
  },

  // ── COMPETENCY (2 questions, t3) ─────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-cmp-004",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "apply",
    marks: 4, estimatedTimeMinutes: 6,
    question: "A food scientist has a mixture of water, common salt (NaCl) dissolved in the water, and fine sand particles suspended in the water. She wants to recover (a) clean sand free of salt, and (b) pure dry NaCl crystals. Describe, in the correct order, the steps she should take, naming the separation technique at each step.",
    answer: "Step 1 — Filtration: Filter the mixture through filter paper. Sand particles (insoluble, large) are retained on the filter paper. The filtrate is brine (salt water).\n\nStep 2 — Wash the sand: Wash the sand on the filter paper with a small amount of distilled water to remove any NaCl clinging to the sand grains. Dry in an oven. → Result: (a) Clean, salt-free sand.\n\nStep 3 — Crystallisation of brine: Gently heat the brine filtrate until it is nearly saturated, then allow to cool slowly. NaCl crystals form (impurities remain in solution). Filter to collect the crystals and dry. → Result: (b) Pure dry NaCl crystals.\n\nOrder matters: Filtration must come first (sand must be removed before evaporation, or it would contaminate the salt product).",
    steps: [
      { stepNumber: 1, title: "Identify the separation problem", explanation: "Three components: sand (insoluble solid), NaCl (dissolved), water (solvent). Remove insoluble solid first; then recover dissolved solid." },
      { stepNumber: 2, title: "Step 1: Filtration", explanation: "Sand retained on filter paper; filtrate = brine." },
      { stepNumber: 3, title: "Step 2: Wash and dry sand", explanation: "Remove residual NaCl from sand surface; dry to yield clean sand." },
      { stepNumber: 4, title: "Step 3: Crystallisation from brine", explanation: "Heat to near saturation; cool slowly; NaCl crystals form; filter and dry." },
    ],
    hint: "You have two goals — recovering sand AND salt. Do you need two separate processes? Which must come first?",
    hint2: "Which component cannot pass through filter paper? Remove it first, then deal with what remains in the filtrate.",
    hint3: "After filtration you have brine. To get solid salt, remove the water — evaporation or crystallisation.",
    keyConcepts: ["filtration", "crystallisation", "evaporation", "multi-step separation"],
    conceptsCovered: ["chm:9:ch02:filtration", "chm:9:ch02:crystallisation", "chm:9:ch02:evaporation"],
    prerequisites: [],
    commonErrors: [
      "Attempting to evaporate before filtering — sand would contaminate the salt.",
      "Forgetting to wash the sand — unwashed sand has NaCl coating it.",
    ],
    tags: [STANDARD_TAGS.BOARD_IMPORTANT, STANDARD_TAGS.NEP_COMPETENCY, STANDARD_TAGS.REAL_LIFE, "class9", "ch02", "separation-techniques", "multi-step"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-cmp-005",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "competency", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: 4,
    question: "A forensic chemist needs to identify the individual dyes in a blue pen ink. She has chromatography paper, a suitable solvent, and a capillary tube. Describe the procedure and what she would expect to observe if the ink contains three dyes.",
    answer: "Procedure:\n1. Draw a pencil baseline about 3 cm from the bottom of the chromatography strip.\n2. Use the capillary tube to apply a small, concentrated spot of ink on the baseline. Allow to dry and re-spot to concentrate.\n3. Place the strip in a closed container with solvent — the solvent level must be BELOW the ink spot.\n4. Allow solvent to travel up by capillary action until near the top.\n5. Remove, mark the solvent front immediately, and allow to dry.\n\nExpected observation: Three distinct coloured bands at different heights — one per dye. The dye most soluble in the solvent reaches the highest position. The dye most adsorbed on paper stays lowest. The Rf value of each band identifies the dye.",
    steps: [
      { stepNumber: 1, title: "Setup", explanation: "Pencil baseline; ink spot above solvent level; covered container to prevent solvent evaporation." },
      { stepNumber: 2, title: "Separation", explanation: "Solvent rises by capillary action. Each dye carried at a rate determined by its solubility and adsorption." },
      { stepNumber: 3, title: "Result", explanation: "Three coloured bands at different heights; Rf values identify each dye." },
    ],
    hint: "The ink spot must be above the solvent level, and the container should be closed to prevent solvent evaporation during the run.",
    keyConcepts: ["chromatography", "Rf value", "forensic application", "dye separation"],
    conceptsCovered: ["chm:9:ch02:chromatography"],
    prerequisites: [],
    commonErrors: ["Placing the ink spot at or below the solvent level — the dye dissolves directly into bulk solvent and cannot separate into bands."],
    tags: [STANDARD_TAGS.REAL_LIFE, STANDARD_TAGS.NEP_COMPETENCY, "class9", "ch02", "chromatography", "forensic"],
    source: "original",
  },

  // ── HOTS (2 questions, t3) ───────────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-hot-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "hots", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "analyse",
    marks: 3, estimatedTimeMinutes: 6,
    question: "Crude petroleum is a mixture of hydrocarbons with boiling points ranging from below 0°C to above 400°C. Explain why simple distillation CANNOT efficiently separate crude petroleum into useful fractions, and describe what technique is used instead and why it is effective.",
    answer: "Why simple distillation fails: Simple distillation works well when two liquids have a large difference in boiling points (generally > 25°C). Crude petroleum contains hundreds of hydrocarbon components with a continuous range of boiling points — no single clean separation point exists. Simple distillation would collect mixed fractions of many close-boiling components, giving neither pure substances nor well-defined useful products.\n\nTechnique used — Fractional distillation:\nCrude oil is heated in a furnace and its vapours enter a tall fractionating column. The column maintains a temperature gradient: very hot at the bottom (> 400°C) and cool at the top (< 40°C). As vapours rise, components with higher boiling points (heavier hydrocarbons: fuel oil, bitumen) condense at lower levels. Lighter fractions (petrol, LPG) rise to higher, cooler levels before condensing. Each level (tray) collects a fraction with a defined boiling point range. The multiple condensation–re-evaporation steps in the column produce far purer fractions than a single distillation pass.",
    steps: [
      { stepNumber: 1, title: "Why simple distillation fails", explanation: "Crude oil = hundreds of components with continuous boiling point range. No clean separation. Mixed condensates result." },
      { stepNumber: 2, title: "Fractional distillation setup", explanation: "Heated vapour enters a tall fractionating column with hot bottom and cool top." },
      { stepNumber: 3, title: "Separation mechanism", explanation: "Higher BP components condense low; lower BP components rise higher. Each tray collects a fraction with a defined BP range." },
    ],
    hint: "Think about what makes simple distillation effective, and why crude oil's composition prevents those conditions.",
    hint2: "What is special about a fractionating column that a simple distillation flask does not have?",
    hint3: "A temperature gradient along the column provides multiple condensation–re-evaporation steps — each step enriches the fraction.",
    keyConcepts: ["fractional distillation", "crude petroleum", "boiling point", "fractionating column"],
    conceptsCovered: ["chm:9:ch02:distillation"],
    prerequisites: [],
    commonErrors: ["Saying 'simple distillation works but is just slower' — it does not produce the same quality of separation regardless of time."],
    tags: [STANDARD_TAGS.TRICKY, STANDARD_TAGS.REAL_LIFE, "class9", "ch02", "fractional-distillation", "crude-oil"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-hot-003",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "hots", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 3, estimatedTimeMinutes: 5,
    question: "A student wants to separate a mixture of common salt (NaCl) and ammonium chloride (NH₄Cl). One classmate suggests sublimation; another suggests evaporation from aqueous solution. Who is correct? Justify your answer with the relevant properties of each component.",
    answer: "The first classmate (sublimation) is correct.\n\nAmmonium chloride (NH₄Cl) sublimes — it converts directly from solid to vapour on gentle heating without passing through a liquid phase. Common salt (NaCl) does NOT sublime — it melts at 801°C and boils at 1413°C, far above any sublimation temperature used in the lab.\n\nProcedure: Heat the mixture gently. NH₄Cl vapours rise and are collected on a cooled surface (inverted funnel) above the mixture, condensing back as pure solid NH₄Cl. NaCl remains as solid residue, unaffected.\n\nWhy evaporation fails: Both NaCl and NH₄Cl dissolve in water. If both are dissolved and the solution evaporated, both crystallise out together — no separation is achieved. Evaporation is not a valid method when both components are similarly soluble.",
    steps: [
      { stepNumber: 1, title: "Property of NH₄Cl", explanation: "Ammonium chloride sublimes on gentle heating — collected pure on a cold surface." },
      { stepNumber: 2, title: "Property of NaCl", explanation: "Sodium chloride melts at 801°C and boils at 1413°C — does not sublime at lab temperatures. Remains as residue." },
      { stepNumber: 3, title: "Why evaporation fails", explanation: "Both NaCl and NH₄Cl are water-soluble. Evaporation from solution deposits both simultaneously — no separation." },
    ],
    hint: "Check which compound sublimes. Then check whether evaporation can separate two similarly soluble solids.",
    hint2: "NH₄Cl is called 'sal ammoniac' and is famous for sublimation. What does NaCl's melting point tell you about its behaviour at lab temperatures?",
    hint3: "If you dissolved both in water and evaporated, both would crystallise out together. That means evaporation cannot separate them.",
    keyConcepts: ["sublimation", "ammonium chloride", "sodium chloride", "separation techniques", "comparison"],
    conceptsCovered: ["chm:9:ch02:sublimation"],
    prerequisites: [],
    commonErrors: ["Choosing evaporation because 'salt is separated from water by evaporation' — true, but both salts would co-crystallise when dissolved together."],
    tags: [STANDARD_TAGS.TRICKY, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "sublimation", "hots"],
    source: "original",
  },

  // ── PREVIOUS-YEAR (1 question, t3) ───────────────────────────────────────

  {
    id: "bo-chm-9-ch02-pyq-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "previous-year", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 3, estimatedTimeMinutes: 5,
    question: "A paper chromatography experiment is performed on a mixture of two dyes, X and Y. The chromatography strip is 15 cm long. After the experiment:\n• The solvent front travels 12 cm from the baseline.\n• Dye X forms a spot 9 cm from the baseline.\n• Dye Y forms a spot 3 cm from the baseline.\n\n(a) Calculate the Rf value for each dye. [1 mark]\n(b) Which dye is more strongly adsorbed on the chromatography paper? Justify. [1 mark]\n(c) A pure sample of a known dye Z has Rf = 0.85 under the same conditions. Can dye X or dye Y be dye Z? [1 mark]",
    answer: "(a) Rf = distance moved by dye / distance moved by solvent front\nRf(X) = 9 / 12 = 0.75\nRf(Y) = 3 / 12 = 0.25\n\n(b) Dye Y is more strongly adsorbed on the paper. A strongly adsorbed component spends more time bound to the stationary phase and less time moving with the solvent, so it travels a shorter distance. Dye Y (Rf = 0.25, 3 cm) barely moved compared to Dye X (Rf = 0.75, 9 cm), indicating Y has a much greater affinity for the paper (stationary phase).\n\n(c) Neither X nor Y is dye Z. Dye X has Rf = 0.75 and dye Y has Rf = 0.25, while dye Z has Rf = 0.85. Since Rf is a characteristic property of a substance under fixed conditions (same solvent, same paper, same temperature), a dye with a different Rf value is a different substance.",
    steps: [
      { stepNumber: 1, title: "Apply Rf formula", explanation: "Rf = (distance moved by component) / (distance moved by solvent). X: 9/12 = 0.75. Y: 3/12 = 0.25." },
      { stepNumber: 2, title: "Interpret Rf for adsorption", explanation: "Lower Rf → less distance → more time on paper → more strongly adsorbed. Dye Y is more strongly adsorbed." },
      { stepNumber: 3, title: "Identify using Rf", explanation: "Rf is a fingerprint for each substance under fixed conditions. X(0.75) ≠ 0.85 and Y(0.25) ≠ 0.85 → neither is Z." },
    ],
    examTip: "CBSE frequently asks Rf calculation and interpretation. Rf is always between 0 and 1; Rf close to 1 = weakly adsorbed/highly soluble in solvent; Rf close to 0 = strongly adsorbed/less soluble in solvent.",
    keyConcepts: ["Rf value", "chromatography", "adsorption", "identification of substance"],
    conceptsCovered: ["chm:9:ch02:chromatography"],
    prerequisites: [],
    commonErrors: [
      "Dividing solvent distance by dye distance (inverting the Rf formula).",
      "Thinking higher Rf means more strongly adsorbed — it is the opposite.",
    ],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.BOARD_IMPORTANT, STANDARD_TAGS.NUMERICALS, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "chromatography", "Rf-value", "previous-year"],
    source: "original",
    yearIfPreviousYear: 2023,
    boardIfPreviousYear: "CBSE",
    sourceReference: "CBSE Class 9 Science — Rf value calculation, standard board examination type",
  },

  // ── ASSERTION-REASON (1 question, t3) ────────────────────────────────────

  {
    id: "bo-chm-9-ch02-asr-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "assertion-reason", questionFormat: "AssertionReason",
    difficulty: "Medium", bloomsLevel: "analyse",
    marks: 1, estimatedTimeMinutes: 3,
    question: "Assertion (A): The ink spot in a paper chromatography experiment must be placed ABOVE the level of the solvent.\nReason (R): If the spot is at or below the solvent level, the dye components dissolve directly into the bulk solvent rather than being carried by the rising solvent front, and no separation occurs.\n\n(A) Both A and R are true and R is the correct explanation of A.\n(B) Both A and R are true but R is NOT the correct explanation of A.\n(C) A is true but R is false.\n(D) A is false but R is true.",
    answer: "A — Both A and R are true and R is the correct explanation of A.\n\nA is TRUE: The spot must be above the solvent level — standard experimental procedure.\n\nR is TRUE and EXPLAINS A: If the spot were immersed in the solvent, the dye would dissolve into the bulk solvent uniformly. The separation mechanism requires the dye to be carried by the travelling solvent front through the paper — not dissolved in a stationary pool. R correctly and fully explains the procedural requirement in A.",
    options: [
      "A) Both A and R true; R explains A",
      "B) Both A and R true; R does not explain A",
      "C) A true; R false",
      "D) A false; R true",
    ],
    correctOption: "A",
    steps: [
      { stepNumber: 1, title: "Evaluate Assertion", explanation: "Spot must be above solvent — correct procedure. A is TRUE." },
      { stepNumber: 2, title: "Evaluate Reason", explanation: "Spot below solvent → dye dissolves in bulk, no separation. R is TRUE." },
      { stepNumber: 3, title: "Does R explain A?", explanation: "Yes — R gives exactly the correct scientific reason for A. Answer is A." },
    ],
    hint: "Does R give a correct scientific reason for the procedural rule in A?",
    keyConcepts: ["chromatography", "experimental procedure", "solvent level"],
    conceptsCovered: ["chm:9:ch02:chromatography"],
    prerequisites: [],
    commonErrors: ["Choosing C (A true, R false) — R is true; dissolution into bulk solvent is exactly what prevents separation."],
    tags: [STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "chromatography", "assertion-reason"],
    source: "original",
  },

  // ── CASE-STUDY (1 question, t3) ───────────────────────────────────────────

  {
    id: "bo-chm-9-ch02-cst-001",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t3", topicName: "Separation Techniques",
    questionType: "case-study", questionFormat: "CaseStudy",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 4, estimatedTimeMinutes: 8,
    question: "Read the passage and answer the questions below.\n\nMunicipal water treatment plants receive river water containing: suspended sand, clay, and silt particles; dissolved salts (chloride, sulphate, bicarbonate ions); microscopic algae dispersed in the colloidal range; and harmful bacteria. Treatment involves four stages: (1) Coagulation — alum (a chemical) is added to make suspended particles clump together into larger flocs. (2) Sedimentation — flocs settle under gravity. (3) Filtration — water passes through layers of sand and gravel. (4) Disinfection — chlorine kills bacteria.\n\n(a) Which component of the river water forms a suspension? [1 mark]\n(b) What separation principle operates in Stage 3 (sand and gravel filtration)? [1 mark]\n(c) After Stage 4, is the treated water a pure substance or a mixture? Justify. [1 mark]\n(d) A resident says the treated water is 'chemically pure' because it is safe to drink. Is this correct? Explain. [1 mark]",
    answer: "(a) Sand, clay, and silt particles form a suspension. Their particle size is > 100 nm; they settle on standing and can be removed by filtration.\n\n(b) Filtration — the sand and gravel bed physically traps particles larger than its pore size, while water and dissolved substances pass through.\n\n(c) Treated water is a MIXTURE. Dissolved salts (chloride, sulphate, bicarbonate ions) remain dissolved even after all four stages. Additionally, residual chlorine may be present. A pure substance has a single, fixed chemical composition — treated water does not.\n\n(d) NOT correct. In chemistry, 'pure' means a single substance with fixed composition (element or compound). Treated tap water is a mixture of water with dissolved mineral ions and traces of chlorine — it is safe from a health standpoint but is chemically a mixture. Only distilled water (or deionised water) approaches chemical purity.",
    steps: [
      { stepNumber: 1, title: "Suspension component", explanation: "Sand, clay, silt: large particles (> 100 nm) that settle. These are suspended." },
      { stepNumber: 2, title: "Stage 3 principle", explanation: "Sand-gravel bed = physical filter. Particles above pore size are trapped; water and dissolved species pass through." },
      { stepNumber: 3, title: "Is treated water pure?", explanation: "No — dissolved salts remain. Variable composition = mixture, not pure substance." },
      { stepNumber: 4, title: "Chemical vs colloquial 'pure'", explanation: "'Safe to drink' ≠ chemically pure. Scientific purity requires a single fixed-composition substance." },
    ],
    hint: "For (d): remember the scientific definition of 'pure' — single substance with fixed composition — not simply 'clean' or 'safe'.",
    keyConcepts: ["suspension", "filtration", "pure substance", "mixture", "water treatment"],
    conceptsCovered: ["chm:9:ch02:filtration", "chm:9:ch02:suspension-properties", "chm:9:ch02:mixture-types"],
    prerequisites: [],
    commonErrors: ["Saying treated water is pure because it is clean — chemical purity requires fixed, single-substance composition."],
    tags: [STANDARD_TAGS.BOARD_IMPORTANT, STANDARD_TAGS.REAL_LIFE, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "water-treatment", "case-study"],
    source: "original",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOPIC t4 — Physical and Chemical Changes
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "bo-chm-9-ch02-nce-012",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t4", topicName: "Physical and Chemical Changes",
    questionType: "ncert", questionFormat: "MCQ",
    difficulty: "Easy", bloomsLevel: "apply",
    marks: 1, estimatedTimeMinutes: 2,
    question: "Which of the following is an example of a CHEMICAL change?\n(A) Melting of ice\n(B) Dissolution of sugar in water\n(C) Rusting of iron\n(D) Stretching of a rubber band",
    answer: "C. Rusting of iron is a chemical change — iron reacts with oxygen and water to form iron(III) oxide (Fe₂O₃·xH₂O), a new substance with entirely different properties. The change is irreversible by simple physical means. Options A, B, and D are physical changes: no new substance is formed, and the original material can be recovered.",
    options: ["A) Melting of ice", "B) Dissolution of sugar in water", "C) Rusting of iron", "D) Stretching of a rubber band"],
    correctOption: "C",
    steps: [
      { stepNumber: 1, title: "Chemical change criterion", explanation: "A new substance with different properties is formed; typically irreversible." },
      { stepNumber: 2, title: "Rusting of iron", explanation: "Iron + O₂ + H₂O → iron oxide (rust). New substance formed. Irreversible. ✓ Chemical change." },
      { stepNumber: 3, title: "Others are physical", explanation: "Ice → water: reversible, same substance. Sugar solution: reversible by evaporation. Rubber stretching: reversible, no new substance." },
    ],
    hint: "A chemical change always produces a new substance with different properties. Ask: 'Is a new substance formed?'",
    keyConcepts: ["chemical change", "physical change", "rusting", "irreversibility"],
    conceptsCovered: ["chm:9:ch02:physical-chemical-change"],
    prerequisites: [],
    commonErrors: ["Choosing B — dissolving sugar is physical: sugar is recoverable unchanged by evaporation; no new substance forms."],
    tags: [STANDARD_TAGS.NCERT_DIRECT, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "physical-chemical-change"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-hot-004",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "Both",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t4", topicName: "Physical and Chemical Changes",
    questionType: "hots", questionFormat: "ShortAnswer",
    difficulty: "Hard", bloomsLevel: "evaluate",
    marks: 3, estimatedTimeMinutes: 5,
    question: "A student claims: 'Dissolving sugar in water is a chemical change because the sugar disappears and you can no longer see it as a solid.' Evaluate this claim using the characteristics of chemical changes, and classify the actual type of change.",
    answer: "The student's claim is INCORRECT. Dissolving sugar in water is a PHYSICAL change.\n\n(1) No new substance formed: Sucrose molecules (C₁₂H₂₂O₁₁) remain chemically unchanged in solution. No bonds within sucrose are broken; the molecules are simply dispersed among water molecules. The solution still tastes sweet — sucrose is present.\n\n(2) Reversible by physical means: Evaporate the water from the sugar solution and solid sugar is recovered with the same properties (white, sweet, same melting point). A true chemical change cannot be reversed this simply.\n\n(3) No characteristic energy change of a chemical reaction: Only a negligible enthalpy change occurs on dissolving sugar — no dramatic heat, light, or sound release.\n\nThe 'disappearance' of visible sugar is due to molecular-scale dispersal among water molecules — not to chemical transformation. Visibility is not evidence of chemical change.",
    steps: [
      { stepNumber: 1, title: "Identify the student's error", explanation: "'Invisible' ≠ 'chemically changed'. Dispersal at molecular scale looks the same as disappearance." },
      { stepNumber: 2, title: "Test 1 — new substance?", explanation: "No. Sucrose still present (solution tastes sweet); molecules unchanged." },
      { stepNumber: 3, title: "Test 2 — reversibility?", explanation: "Evaporate water → white sugar crystals recovered unchanged. Cannot reverse a true chemical change this easily." },
      { stepNumber: 4, title: "Conclusion", explanation: "Dissolution = physical change. Disappearance from sight = dispersal, not chemical transformation." },
    ],
    hint: "The key test: can you recover the original substance unchanged by a simple physical method? If yes → physical change.",
    hint2: "Does the sugar water taste sweet? What does that tell you about whether the sugar molecules are still present?",
    hint3: "Evaporate the water from sugar solution. What do you get back? If the same substance returns, it was never chemically changed.",
    keyConcepts: ["physical change", "chemical change", "dissolution", "reversibility"],
    conceptsCovered: ["chm:9:ch02:physical-chemical-change"],
    prerequisites: [],
    commonErrors: ["Agreeing with the student — visual disappearance of a solid is NOT sufficient evidence of a chemical change."],
    tags: [STANDARD_TAGS.TRICKY, STANDARD_TAGS.FREQUENTLY_ASKED, "class9", "ch02", "physical-chemical-change", "dissolution"],
    source: "original",
  },

  {
    id: "bo-chm-9-ch02-pyq-002",
    schemaVersion: 2, classNum: 9, subject: "Chemistry", board: "CBSE",
    chapterId: "ch02", chapterName: "Exploring Mixtures",
    topicId: "t4", topicName: "Physical and Chemical Changes",
    questionType: "previous-year", questionFormat: "ShortAnswer",
    difficulty: "Medium", bloomsLevel: "apply",
    marks: 2, estimatedTimeMinutes: 3,
    question: "Is making curd from milk a physical change or a chemical change? Give two reasons to support your answer.",
    answer: "Making curd from milk is a CHEMICAL change.\n\nReason 1 (New substance formed): The protein casein in milk is coagulated and reorganised by lactic acid produced by bacteria. Curd has a different taste (sour vs mildly sweet), different texture (semi-solid vs liquid), and different chemical composition from milk — a new substance is formed.\n\nReason 2 (Irreversible): Curd cannot be converted back to fresh milk by any simple physical process (cooling, heating, filtering, etc.). Irreversibility confirms a chemical change.",
    steps: [
      { stepNumber: 1, title: "Type of change", explanation: "Milk → curd involves bacterial action and protein denaturation → new substance with different properties → chemical change." },
      { stepNumber: 2, title: "Reason 1: New substance", explanation: "Curd has sour taste, different texture, different protein structure from milk." },
      { stepNumber: 3, title: "Reason 2: Irreversibility", explanation: "Cannot convert curd back to milk by simple physical means." },
    ],
    examTip: "CBSE expects both 'new substance formed' (with evidence: different taste/texture/properties) and 'irreversibility'. Both reasons are needed for full marks.",
    keyConcepts: ["chemical change", "irreversibility", "milk to curd", "new substance"],
    conceptsCovered: ["chm:9:ch02:physical-chemical-change"],
    prerequisites: [],
    commonErrors: ["Saying milk to curd is physical because 'milk and curd are both dairy products' — the type of product is irrelevant; formation of a new chemical substance is the criterion."],
    tags: [STANDARD_TAGS.FREQUENTLY_ASKED, STANDARD_TAGS.BOARD_IMPORTANT, "class9", "ch02", "chemical-change", "previous-year"],
    source: "original",
    yearIfPreviousYear: 2023,
    boardIfPreviousYear: "CBSE",
    sourceReference: "CBSE Class 9 Science board examination — recurring question type",
  },

];
