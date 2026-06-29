/**
 * Gold Standard Lesson Library — Chemistry
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Chemistry.
 */

import type { GoldStandardLesson } from "./types";

const ALL_CMF_TRUE = {
  cmf1_whyBeforeWhat:            true,
  cmf2_problemFirst:             true,
  cmf3_intuitionBeforeFormalism: true,
  cmf4_sixQuestionsAnswered:     true,
  cmf5_confusionsPreEmpted:      true,
  cmf6_nextQuestionAnswered:     true,
  cmf7_noSkippedSteps:           true,
  cmf8_formulaDerivation:        true,
  cmf9_theoremWhyExplained:      true,
  cmf10_lawIntuitionFirst:       true,
  cmf11_biologyFlowingStory:     true, // N/A
  cmf12_csAlgorithmFirst:        true, // N/A
  cmf13_economicsEverydayFirst:  true, // N/A
  cmf14_threeExplanations:       true,
  cmf15_youngerSiblingTest:      true,
};

export const CHEMISTRY_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "chemistry-balancing-equations-class8",
    concept: "Balancing Chemical Equations",
    class:   8,
    board:   "Both",
    subject: "Chemistry",

    whyGoldStandard: `
This lesson is gold standard because it establishes the law of conservation of mass
as the physical reason for balancing before touching any equation.
The student understands that atoms are never created or destroyed — they are rearranged —
and that a balanced equation is the only honest symbolic representation of this fact.
The lesson makes the critical distinction between subscripts (fixed, describe the molecule)
and coefficients (adjustable, describe quantities) explicit before any balancing begins,
preventing the most common and damaging error in all of school Chemistry.
Every balancing step counts atoms explicitly, element by element, on both sides.
    `.trim(),

    teachingTechniques: [
      "Conservation of mass as the WHY — 'if 10 g of reactants go in, 10 g of products must come out; atoms are just rearranged'",
      "Atom-counting ritual — count every element on left side, then right side, before any adjustment",
      "Subscript-vs-coefficient distinction — shown with a visual: H₂O means one molecule of exactly 2H and 1O; 2H₂O means two such molecules",
      "Systematic balancing order — balance metals first, then non-metals, then hydrogen, then oxygen (for combustion)",
      "Fraction coefficient intermediate step — allowed as a working tool, then doubled to clear fractions at the end",
      "State symbols introduced as physical information, not decoration",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'If you burn a piece of magnesium ribbon in air, where does the white powder (magnesium oxide) come from? The magnesium was solid, the oxygen was gas — did atoms appear from nowhere?'",
      "States the law of conservation of mass: 'In any chemical reaction, the total mass of reactants equals the total mass of products. Atoms are never created or destroyed — only rearranged.'",
      "Defines subscript vs coefficient explicitly with examples before any equation is balanced",
      "Shows the unbalanced equation first: Mg + O₂ → MgO. 'Count the atoms: Left: 1 Mg, 2 O. Right: 1 Mg, 1 O. Oxygen is unbalanced — we have 2 on the left and 1 on the right.'",
      "Names the forbidden move: 'We CANNOT write MgO₂ to fix this. Changing subscripts changes the substance — MgO₂ is not magnesium oxide.'",
      "Balances using coefficients: '2Mg + O₂ → 2MgO. Left: 2 Mg, 2 O. Right: 2 Mg, 2 O. Balanced. ✓'",
      "Includes state symbols with explanation: '(s) = solid, (l) = liquid, (g) = gas, (aq) = dissolved in water. They tell us the physical state of each substance.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'To balance an equation, adjust the coefficients until the number of atoms on both sides is equal'",
      "Not establishing the law of conservation of mass before balancing",
      "Not explaining the difference between subscripts and coefficients before demonstrating",
      "Skipping atom counts — just showing the balanced equation without showing the counting process",
      "Not including state symbols or explaining what they mean",
      "Not naming the forbidden error (changing subscripts)",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — Where Do the Atoms Go?",
        mustContain: [
          "A physical observation about a chemical reaction (burning, rusting, dissolving)",
          "The question: do atoms appear or disappear?",
          "The law of conservation of mass stated and grounded in the observation",
        ],
        typicalFailures: ["Starting with how to balance, not why balancing is necessary"],
      },
      {
        name: "Subscripts vs Coefficients",
        mustContain: [
          "Visual distinction: H₂O (molecule structure) vs 2H₂O (two molecules)",
          "The rule: subscripts cannot be changed; only coefficients can be added",
          "Physical meaning: changing subscripts changes what substance you are describing",
        ],
        typicalFailures: ["Never distinguishing the two before students start balancing"],
      },
      {
        name: "Atom-Counting Method",
        mustContain: [
          "Step 1: Write the unbalanced equation",
          "Step 2: Count each element on both sides and record",
          "Step 3: Identify which elements are unbalanced",
          "Step 4: Adjust coefficients one element at a time",
          "Step 5: Recount all elements to verify",
        ],
        typicalFailures: ["Showing the answer without the counting steps"],
      },
      {
        name: "State Symbols",
        mustContain: [
          "All four state symbols defined with physical meaning",
          "Applied to the worked example equation",
          "Explanation of why they matter (same substance can have different properties in different states)",
        ],
        typicalFailures: ["Omitting state symbols or adding them without explanation"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "chemistry-acids-bases-class7",
    concept: "Acids, Bases, and Neutralisation",
    class:   7,
    board:   "Both",
    subject: "Chemistry",

    whyGoldStandard: `
This lesson is gold standard because it begins with the student's direct sensory experience
of acids (lemon juice, vinegar) and bases (soap, baking soda) before introducing any
chemical definition. The definitions that follow emerge from what these substances do,
not from what they are at the particle level (which is established later, after intuition).
The lesson explains WHY indicators change colour using the particle model of H⁺ ions,
and WHY neutralisation produces a salt and water by tracing the H⁺ and OH⁻ ions
combining. The pH scale is presented as a convenience tool, not an arbitrary number.
    `.trim(),

    teachingTechniques: [
      "Sensory experience first — lemon juice, vinegar, soap, baking soda all identified before any chemical definition",
      "Property-based definition — acids and bases defined by what they do (taste sour, feel slippery, react with metals) before what they are",
      "Indicator observation — colour changes observed and then explained through the particle model",
      "Proton-transfer model — H⁺ ion as the signature of acids; OH⁻ as the signature of bases, introduced after macroscopic properties",
      "Neutralisation particle story — H⁺ + OH⁻ → H₂O told as a particle event, then translated to the ionic equation",
      "pH as a compression tool — 'scientists needed a single number to represent the H⁺ concentration over a huge range, so the pH scale was invented'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'Think of lemon juice and vinegar — what do they have in common? They taste sour. Now think of soap and baking soda — they feel slippery. These are two families of substances.'",
      "Lists macroscopic properties before any particle-level definition",
      "Introduces the indicator: 'Litmus is a natural dye from lichens. It changes colour in the presence of acids and bases. Why? Because its molecules change shape when H⁺ ions are present.'",
      "Defines acid at the particle level: 'An acid is a substance that releases H⁺ ions when dissolved in water. HCl → H⁺ + Cl⁻.'",
      "Defines base: 'A base releases OH⁻ ions. NaOH → Na⁺ + OH⁻.'",
      "Neutralisation particle story: 'When acid meets base, the H⁺ ions and OH⁻ ions find each other and combine: H⁺ + OH⁻ → H₂O. The result is neither acidic nor basic — neutral water. The remaining ions (Na⁺ and Cl⁻) form the salt.'",
      "pH scale introduced as a convenience: 'The concentration of H⁺ ions can range from 1 to 0.0000001 mol/L — a huge range. Scientists invented the pH scale to compress this into 0–14.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'Acids are substances that release H⁺ ions' — particle definition before macroscopic experience",
      "Not explaining why litmus or indicators change colour",
      "Stating the neutralisation equation without explaining the H⁺ + OH⁻ → H₂O particle event",
      "Presenting the pH scale as a given without explaining why it was invented",
      "Not connecting everyday substances (lemon, soap) to the concepts throughout the lesson",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "Sensory Experience — Two Families",
        mustContain: [
          "Acid family: lemon, vinegar, tamarind — sour taste, react with metals, turn litmus red",
          "Base family: soap, baking soda, ammonia — feel slippery, turn litmus blue",
          "The observation that these are two distinct groups of substances",
        ],
        typicalFailures: ["Starting with particle-level definitions"],
      },
      {
        name: "Indicators and Why They Work",
        mustContain: [
          "Litmus observation: red in acid, blue in base",
          "Explanation: indicator molecules change shape in presence of H⁺ or OH⁻ ions",
          "Other indicators: phenolphthalein, universal indicator, turmeric",
        ],
        typicalFailures: ["Listing colour changes without explaining the particle-level reason"],
      },
      {
        name: "Particle-Level Definitions",
        mustContain: [
          "Acid: releases H⁺ in water — with example dissociation equation",
          "Base: releases OH⁻ in water — with example dissociation equation",
          "Why the macroscopic properties (sour taste, slippery feel) follow from the ions",
        ],
        typicalFailures: ["Giving particle definitions without connecting to macroscopic properties"],
      },
      {
        name: "Neutralisation as a Particle Story",
        mustContain: [
          "H⁺ + OH⁻ → H₂O told as the core event",
          "The remaining ions forming the salt",
          "The full ionic equation for one example (HCl + NaOH)",
          "Application: indigestion tablets neutralise excess stomach acid",
        ],
        typicalFailures: ["Showing the balanced equation without the ionic story"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "chemistry-atomic-structure-class9",
    concept: "Structure of the Atom (Bohr Model)",
    class:   9,
    board:   "Both",
    subject: "Chemistry",

    whyGoldStandard: `
This lesson is gold standard because it builds the atom model historically —
the student travels from Thomson's plum pudding, through Rutherford's gold foil experiment
(the particle that came back changed everything), to Bohr's planetary model with quantised shells.
Each model is introduced as the best available explanation at the time,
with its specific experimental evidence, and then shown to be superseded when new evidence
arrived. This approach teaches the nature of scientific models — provisional, evidence-based,
improved — while making each concept deeply memorable through the story of its discovery.
    `.trim(),

    teachingTechniques: [
      "Historical narrative — Thomson → Rutherford → Bohr, each model introduced by the experiment that inspired it",
      "Rutherford's surprise as the hook — 'as if you fired artillery shells at tissue paper and some bounced back'",
      "Model limitations — each model's specific failure is stated before the next is introduced",
      "Electron shell rule derivation — 2n² rule for maximum electrons per shell shown to be consistent with the periodic table's structure",
      "Atomic number as identity — 'the number of protons defines which element something is; change a proton and you change the element'",
      "Isotope concept as a consequence — same protons (same element), different neutrons (different mass)",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'If you wanted to understand the inside of something you can never see or touch, how would you go about it? Scientists faced exactly this problem with the atom.'",
      "Thomson model: 'Thomson knew atoms contained negative charges (electrons). He thought the positive charge was spread uniformly, like plums in a pudding, with electrons embedded throughout.'",
      "Rutherford's experiment: 'He fired positively charged particles at a thin gold foil. He expected them to pass straight through. Most did. But some bounced back. Rutherford said: it was as if you fired artillery shells at tissue paper and some came back at you.'",
      "Rutherford's conclusion: 'The atom is mostly empty space. The positive charge (and most of the mass) is concentrated in a tiny, dense nucleus at the centre.'",
      "Bohr's modification: 'But Rutherford's model had a problem — electrons spiralling around a nucleus would lose energy and crash into it in nanoseconds. Bohr proposed that electrons can only occupy certain fixed orbits (shells) where they don't radiate energy.'",
      "Shell configuration: 'The first shell holds at most 2 electrons. The second holds at most 8. The third holds at most 18 (though it usually fills to 8 first). This is why the periodic table has rows of 2, 8, 8, 18...'",
    ],

    commonNonGoldFailures: [
      "Stating 'The atom consists of protons, neutrons and electrons' with no historical narrative",
      "Not explaining Rutherford's gold foil experiment or its surprising result",
      "Not explaining WHY Bohr introduced shells (to fix the problem with Rutherford's model)",
      "Stating the 2, 8, 8 shell configuration as a rule without deriving or motivating it",
      "Not connecting the atom's structure to periodic table patterns",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The Problem — How to Study Something Invisible",
        mustContain: [
          "The challenge: atoms are far too small to see; we must infer structure from experiments",
          "The method: fire things at atoms and observe what happens to the thing we fired",
          "Thomson's cathode ray discovery as the starting point",
        ],
        typicalFailures: ["Starting with the answer (atom structure) rather than the problem (how do we know?)"],
      },
      {
        name: "Rutherford's Gold Foil Experiment",
        mustContain: [
          "What was fired (alpha particles), at what (gold foil), and what was observed (most pass through, a few deflect, very few bounce back)",
          "Why the result was surprising — the expected outcome was passage through a diffuse cloud of charge",
          "Rutherford's model: tiny dense positive nucleus, electrons somewhere around it",
        ],
        typicalFailures: ["Describing the experiment without conveying Rutherford's surprise"],
      },
      {
        name: "The Problem with Rutherford's Model",
        mustContain: [
          "Classical physics prediction: orbiting electrons radiate energy and spiral inward",
          "The consequence: atoms would collapse in nanoseconds — but they don't",
          "Bohr's solution: quantised electron orbits where radiation is forbidden",
        ],
        typicalFailures: ["Jumping from Rutherford to Bohr without stating what was wrong with Rutherford"],
      },
      {
        name: "The Bohr Model — Shells and Configuration",
        mustContain: [
          "Electron shells as fixed orbits with specific energy levels",
          "Maximum electrons per shell (2, 8, 18...)",
          "Writing electronic configurations for the first 20 elements",
          "Connection to periodic table: elements in the same group have the same number of outer electrons",
        ],
        typicalFailures: ["Stating configurations without connecting to the reason for shells"],
      },
    ],
  },
];
