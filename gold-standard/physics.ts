/**
 * Gold Standard Lesson Library — Physics
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Physics.
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

export const PHYSICS_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "physics-newtons-second-law-class9",
    concept: "Newton's Second Law of Motion (F = ma)",
    class:   9,
    board:   "Both",
    subject: "Physics",

    whyGoldStandard: `
This lesson is gold standard because it builds F = ma from a physical observation the student
can test in imagination before writing a single symbol. The student first notices that
pushing a heavy trolley and a light trolley with the same effort produces different accelerations
— and that doubling the push on the same trolley roughly doubles the acceleration.
From those two observations alone, F = ma is the inevitable conclusion, not an imposed formula.
The lesson distinguishes force from velocity (the most dangerous misconception in mechanics),
explains every symbol and its SI unit before substitution, and tracks sign/direction for every
vector quantity. It never allows a calculation without a free body diagram.
    `.trim(),

    teachingTechniques: [
      "Observation-first sequencing — two thought experiments (same force, different masses; same mass, different forces) lead to the proportionality",
      "Proportionality argument — 'if doubling force doubles acceleration, and doubling mass halves acceleration, what equation captures both?'",
      "Free body diagram requirement — every force drawn and labelled before any equation is written",
      "Symbol-unit pairing — F (newtons, N), m (kilograms, kg), a (metres per second squared, m/s²) defined together",
      "Unit derivation — 1 N = 1 kg·m/s² derived from F = ma, not stated as a definition",
      "Direction tracking — sign convention stated and applied explicitly at every step",
      "Force-vs-velocity misconception inoculation — 'force does not produce velocity; force produces CHANGE in velocity (acceleration)'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'Push an empty shopping cart and a full one with the same effort. Which accelerates more? Why does mass matter?'",
      "Establishes two proportionalities in words before any symbols: 'acceleration is proportional to force' and 'acceleration is inversely proportional to mass'",
      "Combines them: 'If a ∝ F and a ∝ 1/m, then a ∝ F/m, which means F = ma when we choose the right unit for force'",
      "Derives the newton: 'We define 1 newton as the force that gives 1 kg an acceleration of 1 m/s². So from F = ma: 1 N = 1 kg × 1 m/s².'",
      "Draws a described free body diagram for every example: 'A 2 kg block. Arrow pointing right labelled F = 10 N. Arrow pointing left labelled friction = 4 N. Net force = 10 − 4 = 6 N to the right.'",
      "States sign convention before every problem: 'We take rightward as positive. Any force pointing left is negative.'",
      "Names the force-velocity confusion explicitly: 'Newton's First Law already tells us: an object can have a large velocity with zero net force. Force is not what keeps things moving — it is what changes their motion.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'Newton's Second Law states that Force = mass × acceleration'",
      "Not explaining why the formula takes this particular form",
      "Not drawing a free body diagram before writing F = ma",
      "Not defining SI units before substituting values",
      "Not addressing the force-velocity misconception",
      "Treating F, m, and a as scalars without discussing direction",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "Physical Observation — The Two Trolleys",
        mustContain: [
          "Scenario 1: same force, different mass → different acceleration",
          "Scenario 2: same mass, different force → different acceleration",
          "The question: 'What single relationship captures both of these observations?'",
        ],
        typicalFailures: ["Stating the law without establishing the physical motivation"],
      },
      {
        name: "Building the Formula from Proportionalities",
        mustContain: [
          "a ∝ F (at constant mass): doubling F doubles a",
          "a ∝ 1/m (at constant F): doubling m halves a",
          "Combining: a ∝ F/m → F = ma with appropriate unit",
        ],
        typicalFailures: ["Stating F = ma without showing it arises from proportionality"],
      },
      {
        name: "Units and the Newton",
        mustContain: [
          "Each symbol defined with its SI unit",
          "The newton derived from F = ma, not defined independently",
          "Unit check: kg × m/s² = N confirmed",
        ],
        typicalFailures: ["Defining the newton without connecting it to the formula"],
      },
      {
        name: "Free Body Diagram and Worked Example",
        mustContain: [
          "Free body diagram described in words before writing any equation",
          "Net force calculated with sign convention stated",
          "F = ma applied with explicit substitution: F = [value] N, m = [value] kg, therefore a = F/m = [value] m/s²",
          "Physical meaning of the answer stated: 'this means the object accelerates at X m/s² in the [direction] direction'",
        ],
        typicalFailures: [
          "Writing F = ma without a free body diagram",
          "Not stating direction of acceleration",
          "Not explaining the sign convention",
        ],
      },
      {
        name: "Misconception Block",
        mustContain: [
          "'Force produces acceleration, not velocity' — with Newton's First Law as the proof",
          "'Net force, not individual forces, determines acceleration'",
          "'A = 0 does not mean no forces — it means the forces are balanced'",
        ],
        typicalFailures: ["Not addressing the force-velocity confusion"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "physics-pressure-in-fluids-class8",
    concept: "Pressure in Fluids (Liquids and Gases)",
    class:   8,
    board:   "Both",
    subject: "Physics",

    whyGoldStandard: `
This lesson is gold standard because it builds the concept of pressure from an everyday pain:
why does a stiletto heel hurt more than a flat shoe even if the person weighs the same?
That single question motivates the definition of pressure as force per unit area.
The lesson then extends pressure to fluids through a physical argument about why water
exerts pressure in all directions equally — using the particle model to explain what
would happen if it didn't. The depth-pressure relationship is derived, not stated,
by thinking about the weight of a column of water above a point.
    `.trim(),

    teachingTechniques: [
      "Stiletto-heel thought experiment — identical force, drastically different area, different experience → pressure = force/area",
      "Particle model for fluid pressure — particles move in all directions; they push on every surface they contact",
      "Column-of-water derivation — pressure at depth h = weight of water column above ÷ base area = ρgh",
      "All-directions inoculation — demonstrate that fluid pressure acts sideways and upward, not just downward",
      "Atmospheric pressure connection — the air above us is also a fluid column; the atmosphere has weight",
      "Unit derivation — 1 Pa = 1 N/m² derived from the definition, not stated",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'Why does a stiletto heel hurt your foot if someone steps on you, but a flat shoe doesn't — even if the person weighs the same?'",
      "Derives P = F/A from the stiletto question: 'the pain depends not just on the force but on how concentrated it is over an area'",
      "Defines the pascal: '1 pascal = 1 newton of force spread over 1 square metre of area'",
      "Uses the particle model: 'In a liquid, particles are densely packed and constantly moving. They push on every surface they touch — left, right, up, down — not just downward.'",
      "Derives P = ρgh: 'The pressure at depth h is the weight of liquid above a unit area. Weight of column = ρ × g × h × A. Divide by area A: P = ρgh.'",
      "Demonstrates all-directions pressure: 'A balloon submerged underwater is squeezed from all sides, not just from above — proof that pressure acts in every direction.'",
      "Connects to real life: dams thicker at the bottom (pressure increases with depth), submarines designed for deep-sea pressure",
    ],

    commonNonGoldFailures: [
      "Opening with 'Pressure is defined as force per unit area'",
      "Not explaining why pressure acts in all directions in a fluid",
      "Stating P = ρgh without deriving it from the weight of a fluid column",
      "Not distinguishing between fluid pressure and the everyday sense of 'pressure'",
      "No real-world applications after the formula",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — The Stiletto Heel Problem",
        mustContain: [
          "The observation: same force, different areas, different pain",
          "The conclusion: the spread of force over area determines its effect",
          "The definition emerging naturally: pressure = force / area",
        ],
        typicalFailures: ["Defining pressure without motivation"],
      },
      {
        name: "Pressure in Fluids — The Particle Model",
        mustContain: [
          "Why fluids exert pressure: particles collide with surfaces in all directions",
          "Why pressure acts in all directions equally at a given depth",
          "The balloon-underwater demonstration in words",
        ],
        typicalFailures: ["Saying 'fluids exert pressure in all directions' without explaining why"],
      },
      {
        name: "Pressure at Depth — The Column Derivation",
        mustContain: [
          "Visualise a vertical column of fluid above a horizontal surface",
          "Weight of column = density × volume × g = ρ × (h × A) × g",
          "Pressure = weight / area = ρgh (area cancels)",
          "Therefore: deeper → more fluid above → more pressure",
        ],
        typicalFailures: ["Stating P = ρgh without the column derivation"],
      },
      {
        name: "Real-World Connections",
        mustContain: [
          "Dam design: thicker at the base because pressure increases with depth",
          "Submarines: designed to withstand extreme pressure at ocean depths",
          "Atmospheric pressure: the air above is a fluid column too",
        ],
        typicalFailures: ["No applications after the formula derivation"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "physics-ohms-law-class8",
    concept: "Ohm's Law and Electrical Resistance",
    class:   8,
    board:   "Both",
    subject: "Physics",

    whyGoldStandard: `
This lesson is gold standard because it treats electrical current, voltage, and resistance
as physical phenomena before they are quantities. The water-pipe analogy is used precisely
and then explicitly broken where it fails, preventing the common misapplication.
Ohm's Law is presented as an experimental finding (not a universal truth), with the
important caveat that some materials are non-ohmic. Resistance is derived from the ratio V/I,
not defined as a material property in isolation, so the student sees how it is measured.
Every circuit calculation includes a described circuit diagram.
    `.trim(),

    teachingTechniques: [
      "Water-pipe analogy — voltage as water pressure, current as flow rate, resistance as pipe narrowness — used precisely then bounded",
      "Experimental framing — Ohm's Law presented as Georg Ohm's observation, not an axiom",
      "Non-ohmic materials — filament bulbs, diodes introduced to establish the law's limits",
      "V/I ratio definition of resistance — resistance is measured by this ratio, not defined independently",
      "Circuit diagram requirement — every calculation preceded by a described schematic",
      "Unit derivation — 1 Ω = 1 V/A derived from R = V/I",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'Why does a thick copper wire carry electricity easily while a thin wire from the same material gets hot? What determines how easily current flows?'",
      "Uses the water analogy carefully: 'Voltage is like water pressure — it pushes charges. Current is the flow of charges, like water flow rate. Resistance is like a narrow pipe — it opposes flow.'",
      "States the analogy's limit: 'This analogy breaks down for non-linear resistors. It is a model, not reality.'",
      "States Ohm's Law as an experimental finding: 'Ohm found that for many materials, the ratio V/I is constant regardless of the value of V. We call this constant the resistance R.'",
      "Derives: 'R = V/I, so V = IR and I = V/R — all three rearrangements from one ratio'",
      "Names non-ohmic devices: 'Filament bulbs and diodes do NOT obey Ohm's Law — their resistance changes with temperature or voltage. Always check whether Ohm's Law applies.'",
      "Calculates with a described circuit: 'A simple circuit: a 6 V battery connected to a resistor. The current measured is 2 A. Resistance: R = V/I = 6/2 = 3 Ω.'",
    ],

    commonNonGoldFailures: [
      "Stating 'Ohm's Law: V = IR' as the opening line with no physical motivation",
      "Using the water analogy without stating its limitations",
      "Not mentioning non-ohmic materials at all",
      "Not deriving the unit of resistance from R = V/I",
      "No circuit diagram for worked examples",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — Why Do Some Materials Resist More?",
        mustContain: [
          "Observation: different materials and different thicknesses carry different amounts of current for the same voltage",
          "The concept of resistance as opposition to current flow",
          "Physical picture: electrons colliding with atoms as they drift through the material",
        ],
        typicalFailures: ["Opening with V = IR"],
      },
      {
        name: "Ohm's Experimental Finding",
        mustContain: [
          "Historical context: Ohm measured V and I for many materials",
          "The observation: V/I = constant for many materials",
          "The definition: this constant is called resistance (R = V/I)",
        ],
        typicalFailures: ["Stating Ohm's Law as a fundamental truth rather than an experimental observation"],
      },
      {
        name: "The Three Forms and Units",
        mustContain: [
          "V = IR, I = V/R, R = V/I — all derived from the single ratio",
          "Unit of R: 1 Ω = 1 V / 1 A",
          "Practical meaning: a 1 Ω resistor allows 1 A when 1 V is applied",
        ],
        typicalFailures: ["Giving only V = IR without the rearrangements"],
      },
      {
        name: "The Analogy and Its Limit",
        mustContain: [
          "Water-pipe analogy stated precisely",
          "Explicit statement of where the analogy breaks down",
          "Non-ohmic devices named with physical reason",
        ],
        typicalFailures: ["Using the analogy without bounding it"],
      },
    ],
  },
];
