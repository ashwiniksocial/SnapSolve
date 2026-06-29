/**
 * Gold Standard Lesson Library — Biology
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Biology.
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
  cmf11_biologyFlowingStory:     true,
  cmf12_csAlgorithmFirst:        true, // N/A
  cmf13_economicsEverydayFirst:  true, // N/A
  cmf14_threeExplanations:       true,
  cmf15_youngerSiblingTest:      true,
};

export const BIOLOGY_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "biology-photosynthesis-class7",
    concept: "Photosynthesis",
    class:   7,
    board:   "Both",
    subject: "Biology",

    whyGoldStandard: `
This lesson is gold standard because it follows a single molecule of carbon dioxide
from the air outside a leaf, through the stomata, into the mesophyll cell, through
the chloroplast, and out the other side as glucose and oxygen. The student experiences
photosynthesis as a continuous story, not a list of inputs and outputs.
The lesson establishes WHY plants need photosynthesis — to make food from scratch
since they cannot move to find it — before explaining HOW it works.
The equation is introduced as a compression of the story, not as the story itself.
The three-explanation rule is applied to the concept of energy transformation (light energy → chemical energy).
    `.trim(),

    teachingTechniques: [
      "Single-molecule story — follow one CO₂ molecule through the entire photosynthesis journey",
      "Function-before-structure — WHY the plant needs to make food is established before the mechanism is shown",
      "Leaf anatomy in function order — stomata, mesophyll, chloroplast introduced as each becomes necessary in the story",
      "Equation as summary — 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂ introduced after the story, as its compression",
      "Energy transformation emphasis — light energy is captured and stored as chemical energy in glucose bonds",
      "Van Helmont's willow experiment — historical evidence that plants gain mass from something other than soil",
      "Three-way explanation of energy storage: visual (sun's rays hitting a leaf), logical (light excites electrons which drive reactions), real-life (eating a biscuit is releasing energy originally captured from sunlight)",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'A tiny seedling grows into a massive tree. Where does all that mass come from? It doesn't come from the soil — Jan Baptist van Helmont proved this 400 years ago by growing a willow tree in a pot of soil and finding the soil barely lost any weight.'",
      "Establishes the purpose: 'Plants cannot move to find food. So they make it themselves, from scratch, using three ingredients they can obtain without moving: water from the soil, carbon dioxide from the air, and light from the sun.'",
      "Follows a CO₂ molecule: 'Our CO₂ molecule is floating in the air near a leaf. It enters through a tiny pore called a stoma (plural: stomata). These open during the day to let CO₂ in — and yes, water vapour also escapes through them, which is why plants can wilt in the sun.'",
      "Traces to the chloroplast: 'Inside the leaf cells, there are green organelles called chloroplasts. The green colour comes from a pigment called chlorophyll, which is specifically tuned to absorb red and blue light.'",
      "Narrates the transformation: 'Chlorophyll captures light energy and uses it to split water molecules: 2H₂O → 4H⁺ + 4e⁻ + O₂. The oxygen is released as a waste product — the oxygen we breathe comes from water, not CO₂.'",
      "Follows to glucose: 'The hydrogen ions and energy are used to combine six CO₂ molecules into one glucose molecule: C₆H₁₂O₆. This glucose is the plant's food — it is stored energy from sunlight, locked inside a sugar molecule.'",
      "Introduces the equation last: 'The entire story can be compressed into one equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Every term in this equation refers to something in the story we just followed.'",
    ],

    commonNonGoldFailures: [
      "Opening with the equation 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ without any story",
      "Listing the 'raw materials' and 'products' without tracing the journey through the cell",
      "Not explaining that the oxygen released comes from water, not CO₂",
      "Introducing chloroplast and chlorophyll as isolated vocabulary items rather than as story elements",
      "Not explaining what the plant does with the glucose it makes",
      "Not connecting the equation's terms back to the biological narrative",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — The Problem of Making Food Without Moving",
        mustContain: [
          "Van Helmont's experiment or similar — mass comes from air, not soil",
          "Plants cannot hunt or forage — they must synthesise their own food",
          "The three available ingredients: CO₂ (air), H₂O (soil), light (sun)",
        ],
        typicalFailures: ["Starting with inputs and outputs without establishing the problem photosynthesis solves"],
      },
      {
        name: "The Journey — CO₂ Enters the Leaf",
        mustContain: [
          "Stomata: function (gas exchange), location (underside of leaf), mechanism (opens in light)",
          "Why stomata are a trade-off: CO₂ in, water vapour out → wilting risk",
          "The CO₂ molecule dissolves in cell fluid and reaches the chloroplast",
        ],
        typicalFailures: ["Listing stomata as a vocabulary item rather than as the entry point of the story"],
      },
      {
        name: "Inside the Chloroplast",
        mustContain: [
          "Chlorophyll: what it is, why it is green (absorbs red and blue, reflects green)",
          "Light energy absorbed and used to split water molecules",
          "Oxygen released as a by-product of water splitting — not CO₂ → O₂",
        ],
        typicalFailures: ["Saying 'CO₂ is converted to O₂' — a factually incorrect simplification"],
      },
      {
        name: "Glucose Formation and the Equation",
        mustContain: [
          "Hydrogen ions and energy used to build glucose from CO₂",
          "Glucose as stored chemical energy — the plant's food",
          "The equation introduced as a summary of the story",
          "Every term in the equation connected back to a step in the story",
        ],
        typicalFailures: ["Introducing the equation before the story", "Not explaining what glucose is used for"],
      },
      {
        name: "Three Explanations for Energy Transformation",
        mustContain: [
          "Visual: sun rays hitting a leaf surface, absorbed by the green pigment",
          "Logical: light excites electrons, which drive chemical reactions that build glucose bonds",
          "Real-life: a biscuit contains energy originally captured from sunlight by a wheat plant",
        ],
        typicalFailures: ["Not providing three distinct explanation routes for the energy concept"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "biology-cell-structure-class9",
    concept: "Cell Structure — Animal and Plant Cells",
    class:   9,
    board:   "Both",
    subject: "Biology",

    whyGoldStandard: `
This lesson is gold standard because every organelle is introduced by its function
before its name and structure. The student first understands what job needs to be done
inside a cell, then meets the organelle built to do that job.
The comparison between animal and plant cells is taught through the question
'what extra jobs does a plant cell need to do that an animal cell doesn't?'
rather than as a list of differences to memorise. This transforms a memorisation exercise
into a logical deduction — the student can reconstruct the comparison from first principles.
    `.trim(),

    teachingTechniques: [
      "Function-before-name — 'A cell needs a power source. Meet the mitochondrion.'",
      "City analogy — used carefully: nucleus as city hall, mitochondria as power plants, cell membrane as city wall — then bounded where the analogy fails",
      "Why-plant-cells-differ derivation — plants need to photosynthesise, store water, and maintain rigidity without a skeleton → chloroplasts, central vacuole, cell wall emerge as logical requirements",
      "Organelle elimination test — 'If we removed the mitochondria, what would the cell lose? Could it survive?'",
      "Prokaryote vs eukaryote distinction — 'some organisms have no nucleus at all, and yet they thrived for 2 billion years before we appeared'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'A single cell must do everything a living thing needs to do: get energy, use that energy to build and repair itself, receive and respond to signals, reproduce, and manage waste. How does something smaller than a full stop manage all of this?'",
      "Introduces each organelle as a solution to a job: 'Every cell needs instructions for how to build proteins. Those instructions are stored in DNA. The organelle that contains and protects the DNA is called the nucleus.'",
      "For each organelle: function first, name second, structure third",
      "Plant vs animal comparison as a logical deduction: 'A plant cannot run to a food source — it must make food. What does it need that an animal doesn't? A chloroplast. A plant must stand upright without bones — it needs structural rigidity. What provides this? A cell wall.'",
      "Names the most common confusion: 'Cell membrane vs cell wall — every cell has a membrane (a flexible, selective barrier). Plant cells ALSO have a cell wall outside the membrane (rigid, made of cellulose). Animal cells have only the membrane.'",
      "The city analogy bounded: 'Unlike a city, the cell has no single garbage truck — waste management is distributed. And the cell can copy itself, which cities cannot.'",
    ],

    commonNonGoldFailures: [
      "Listing organelles with definitions: 'The nucleus is the control centre of the cell'",
      "Not explaining what each organelle does before naming it",
      "Presenting animal vs plant differences as a list to memorise rather than a logical consequence",
      "Not naming the cell membrane vs cell wall confusion",
      "Not explaining why plant cells need chloroplasts and cell walls",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — What Problems Must a Cell Solve?",
        mustContain: [
          "The seven life processes: nutrition, respiration, growth, reproduction, excretion, movement, sensitivity",
          "The challenge: a microscopic structure must manage all of these",
          "The solution: specialised internal compartments, each with one job",
        ],
        typicalFailures: ["Starting with organelle definitions without establishing the problem they solve"],
      },
      {
        name: "Organelles — Function First, Name Second",
        mustContain: [
          "For each organelle: the job → the name → the structure",
          "Organelles covered: cell membrane, nucleus, cytoplasm, mitochondria, ribosomes, endoplasmic reticulum, Golgi apparatus",
          "The 'what would happen without it?' test applied to at least two organelles",
        ],
        typicalFailures: ["Giving names and definitions without the function-first framing"],
      },
      {
        name: "Animal vs Plant — Logical Deduction",
        mustContain: [
          "Start with the question: 'What extra jobs must a plant cell do that an animal cell doesn't?'",
          "Photosynthesis → chloroplasts",
          "Structural rigidity without skeleton → cell wall (cellulose)",
          "Water storage for turgor pressure → central vacuole",
          "Result: the comparison table falls out of reasoning, not memorisation",
        ],
        typicalFailures: ["Presenting a pre-made comparison table without the logical derivation"],
      },
      {
        name: "Misconception Block",
        mustContain: [
          "Cell membrane vs cell wall — every cell has a membrane; plant cells additionally have a wall",
          "Mitochondria vs chloroplasts — animals have only mitochondria; plants have both",
          "Nucleus vs nucleoid — eukaryotes have a membrane-bound nucleus; prokaryotes have a nucleoid region",
        ],
        typicalFailures: ["Not addressing the membrane/wall confusion explicitly"],
      },
    ],
  },
];
