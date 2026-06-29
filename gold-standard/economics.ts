/**
 * Gold Standard Lesson Library — Economics
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Economics.
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
  cmf13_economicsEverydayFirst:  true,
  cmf14_threeExplanations:       true,
  cmf15_youngerSiblingTest:      true,
};

export const ECONOMICS_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "economics-demand-supply-class9",
    concept: "Demand, Supply, and Market Equilibrium",
    class:   9,
    board:   "Both",
    subject: "Economics",

    whyGoldStandard: `
This lesson is gold standard because every economic concept emerges from a real market
scenario the student recognises. The mango market in peak summer heat is the opening
scene — not a definition of demand. The student intuitively knows that when mangoes
become expensive, they buy fewer; the lesson then names that intuition 'the law of demand'.
The supply curve emerges from asking 'what would a mango seller do if prices rise?'
Equilibrium is shown as the one price where no one is frustrated — buyers can find
sellers, and sellers can find buyers. Every diagram is described in words so the student
can visualise it while reading. Movement along a curve vs a shift of the curve
is the most common exam trap and is therefore given its own extended treatment.
    `.trim(),

    teachingTechniques: [
      "Everyday market first — the mango stall in summer heat as the opening scenario, not a textbook definition",
      "Intuition naming — 'you already know the law of demand; you've obeyed it every time you've chosen not to buy something because it was too expensive'",
      "Diagram built incrementally — price axis, quantity axis, one point, a second point, the curve, the label — never shown complete without being built step by step",
      "Movement vs shift distinction — given extended treatment as the most common exam error",
      "Equilibrium as frustration resolution — 'at any other price, either buyers or sellers are frustrated; equilibrium is the one price where both get what they want'",
      "Incentive language throughout — 'why would a seller do this? because it is more profitable'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'It is June. You are at a fruit market. Mangoes cost ₹200 per kg. You buy 1 kg. The next week, the price drops to ₹80 per kg. You buy 3 kg. What just happened, economically?'",
      "Names the intuition: 'When the price of something goes up, you buy less. When it goes down, you buy more. Economists call this the Law of Demand.'",
      "Builds the demand curve in words: 'On a graph, put price on the vertical axis and quantity on the horizontal axis. Mark the point (₹200, 1 kg). Mark the point (₹80, 3 kg). Connect them — the line slopes downward. That downward slope IS the Law of Demand.'",
      "Introduces supply from the seller's perspective: 'Now think like the mango farmer. At ₹200 per kg, you work extra shifts to bring as much to market as possible. At ₹80 per kg, it barely covers your costs — you bring less.'",
      "Equilibrium as frustration resolution: 'At ₹200, buyers want 1 kg and sellers bring 5 kg — sellers are left with unsold fruit and lower the price. At ₹80, buyers want 5 kg but sellers only bring 1 kg — buyers outbid each other and the price rises. The price settles where supply equals demand.'",
      "Movement vs shift taught explicitly: 'A price change causes MOVEMENT along the curve — you slide up or down the same demand curve. A change in income, taste, or the price of a substitute SHIFTS the entire curve — a new demand curve appears.'",
      "Names the common error: 'Students write: demand increased because price fell. This is backwards. The price fell because something changed the supply or demand. Then the new price caused buyers to buy more — that is movement, not a shift.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'Demand is defined as the quantity of a good a consumer is willing and able to buy at different prices'",
      "Drawing the complete demand-supply diagram without building it incrementally",
      "Not distinguishing between movement along a curve and a shift of the curve",
      "Not explaining equilibrium as the price where both buyers and sellers are satisfied",
      "Not using a specific, named everyday market (mango, vegetable, cricket tickets) throughout",
      "Not approaching demand and supply from both the buyer's and seller's perspectives",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "Everyday Market — The Mango Scenario",
        mustContain: [
          "A specific market situation: a named product, a named location, a specific price",
          "The student's own behaviour described: what do you buy at high price? At low price?",
          "The observation: price and quantity demanded move in opposite directions",
        ],
        typicalFailures: ["Opening with a definition or formula"],
      },
      {
        name: "Demand — Naming the Intuition",
        mustContain: [
          "The Law of Demand stated as the formalisation of what the student just observed",
          "Demand schedule: a table of price-quantity pairs",
          "The demand curve built incrementally from the table",
          "Why the curve slopes downward: three reasons (income effect, substitution effect, diminishing marginal utility)",
        ],
        typicalFailures: ["Stating the law before grounding it in the student's experience"],
      },
      {
        name: "Supply — The Seller's Perspective",
        mustContain: [
          "The same market from the seller's view: 'what would you do if prices rose?'",
          "The Law of Supply: higher price → more supplied (more profitable)",
          "The supply schedule and curve built in the same incremental way",
          "Why the curve slopes upward: higher price covers costs; more producers enter",
        ],
        typicalFailures: ["Not approaching supply from the seller's incentive perspective"],
      },
      {
        name: "Equilibrium — Where Both are Satisfied",
        mustContain: [
          "What happens at price above equilibrium: surplus, sellers lower prices",
          "What happens at price below equilibrium: shortage, buyers bid prices up",
          "Equilibrium as the self-correcting outcome: no external force needed",
          "Diagram: supply and demand curves crossing, equilibrium price and quantity labelled",
        ],
        typicalFailures: ["Showing equilibrium without the surplus/shortage dynamics"],
      },
      {
        name: "Movement vs Shift — The Critical Distinction",
        mustContain: [
          "Movement along the demand curve: ONLY caused by a change in the good's own price",
          "Shift of the demand curve: caused by income, taste, related goods' prices, expectations",
          "Worked examples of each type",
          "The common exam error: 'demand increased because price fell' — identified and corrected",
        ],
        typicalFailures: ["Not giving this distinction its own section", "Not naming the exam error explicitly"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "economics-money-barter-class9",
    concept: "Money — From Barter to Modern Currency",
    class:   9,
    board:   "Both",
    subject: "Economics",

    whyGoldStandard: `
This lesson is gold standard because it starts from the practical impossibility of
bartering — a farmer who wants to buy shoes but has only rice — and lets the student
feel exactly why money had to be invented. Every property of money (divisibility,
portability, durability, acceptability) is introduced as the solution to a specific
failure of the barter system, not as a list to memorise. The evolution from commodity
money to fiat money is shown as a logical progression where each step solves a problem
with the previous system. The student can deduce every property of good money
from the failures of barter alone.
    `.trim(),

    teachingTechniques: [
      "Barter problem as the opening scenario — 'you have rice and want shoes; the cobbler wants cloth, not rice'",
      "Double coincidence of wants as the central failure — named from the student's experience",
      "Property-by-property derivation — each property of money derived from a specific barter failure",
      "Historical progression — shells → gold coins → paper backed by gold → fiat currency — each step shown as solving a problem",
      "Fiat money trust question — 'why does a piece of paper have value? because everyone agrees it does — and the government guarantees it'",
      "Inflation connection — 'if there is too much money chasing too few goods, each unit of money buys less'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'You are a farmer with 50 kg of rice. You need a pair of shoes. You go to the cobbler. He says: I don't need rice — I need cloth. What do you do?'",
      "Names the problem: 'For a barter exchange to happen, both parties must want exactly what the other has. Economists call this the double coincidence of wants. It is surprisingly hard to achieve.'",
      "Derives divisibility: 'What if you want to buy only half a pair of shoes? You can't cut a goat in half. Money solves this: you can pay any amount in small coins.'",
      "Derives durability: 'Rice rots. Fish rots. Livestock dies. Good money must not deteriorate — so we use metals, then paper, then digital records.'",
      "Derives portability: 'If money is too heavy to carry (like large stones), trade becomes impossible. Good money must be easily transportable.'",
      "Derives acceptability: 'Everyone must agree it has value. This is why governments declare legal tender — they enforce universal acceptability.'",
      "Traces the evolution: 'Commodity money (gold) was heavy and hard to divide. Paper money (backed by gold) solved portability. Fiat money (not backed by any commodity) solved scarcity of precious metals — but requires trust in the issuing institution.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'Money is defined as anything that is generally accepted as a medium of exchange'",
      "Listing the functions of money (medium of exchange, store of value, unit of account) without deriving them from barter failures",
      "Listing the properties of money as items to memorise rather than as solutions to specific problems",
      "Not tracing the historical evolution from barter to fiat currency",
      "Not explaining why fiat money has value (the trust/government guarantee argument)",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The Barter Problem",
        mustContain: [
          "A concrete barter scenario that fails due to double coincidence of wants",
          "The term 'double coincidence of wants' introduced after the student experiences the problem",
          "Other barter failures: indivisibility, perishability, lack of portability",
        ],
        typicalFailures: ["Defining barter and its problems without the scenario"],
      },
      {
        name: "Properties of Money — Derived from Barter Failures",
        mustContain: [
          "Each property introduced as: 'Barter failed because X → money must therefore have property Y'",
          "Divisibility, durability, portability, acceptability, homogeneity — each derived, not listed",
        ],
        typicalFailures: ["Listing properties as a table to memorise without the derivation"],
      },
      {
        name: "Functions of Money",
        mustContain: [
          "Medium of exchange: 'solves the double coincidence problem'",
          "Store of value: 'rice rots; money can be saved'",
          "Unit of account: 'we price everything in rupees — a common measuring stick'",
          "Standard of deferred payment: 'we can agree on a price now, pay later'",
        ],
        typicalFailures: ["Listing functions without connecting each to a specific barter failure"],
      },
      {
        name: "The Evolution of Money",
        mustContain: [
          "Commodity money: used because the good has intrinsic value (gold, silver)",
          "Representative money: paper backed by gold — solves portability",
          "Fiat money: no backing — relies on government decree and public trust",
          "Digital money: the latest step in the same progression",
        ],
        typicalFailures: ["Jumping to modern currency without the historical narrative"],
      },
    ],
  },
];
