import type { Subject } from "./subjects";

export interface SolutionStep {
  title: string;
  content: string;
  formula?: string;
}

export interface Solution {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  steps: SolutionStep[];
  answer: string;
  keyConcepts: string[];
  practiceQuestions: { question: string; answer: string }[];
}

const physicsSolutions: Record<string, Solution> = {
  kinematics: {
    topic: "Kinematics",
    difficulty: "Medium",
    steps: [
      {
        title: "Identify Given Information",
        content: "Extract all known quantities from the problem. Assign standard variable names.",
        formula: "u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement",
      },
      {
        title: "Choose the Right Equation of Motion",
        content: "Select from the three equations of motion based on what is given and what is asked.",
        formula: "v = u + at  |  s = ut + ½at²  |  v² = u² + 2as",
      },
      {
        title: "Substitute and Solve",
        content: "Plug in the known values into the selected equation and solve for the unknown variable.",
      },
      {
        title: "Check Units and Direction",
        content: "Verify that your answer has the correct SI units. For vector quantities, confirm the direction (positive = forward, negative = backward).",
      },
      {
        title: "State the Final Answer",
        content: "Write the answer clearly with the correct unit and, if applicable, direction.",
      },
    ],
    answer: "Apply the appropriate equation of motion with given values to find the required quantity.",
    keyConcepts: ["Uniform acceleration", "Equations of motion", "Vector vs scalar", "SI units"],
    practiceQuestions: [
      {
        question: "A car starts from rest and accelerates at 2 m/s² for 10 s. Find its final velocity.",
        answer: "v = 0 + 2×10 = 20 m/s",
      },
      {
        question: "A ball is thrown upward with 30 m/s. How long before it reaches maximum height? (g = 10 m/s²)",
        answer: "v = u − gt → 0 = 30 − 10t → t = 3 s",
      },
      {
        question: "A train traveling at 90 km/h brakes to rest in 100 m. Find the deceleration.",
        answer: "u = 25 m/s, v = 0; v² = u² + 2as → a = −3.125 m/s²",
      },
    ],
  },
  energy: {
    topic: "Work & Energy",
    difficulty: "Medium",
    steps: [
      {
        title: "Identify the Type of Energy",
        content: "Determine whether the problem involves kinetic energy (KE), potential energy (PE), or both.",
        formula: "KE = ½mv²    PE = mgh",
      },
      {
        title: "Apply the Work-Energy Theorem",
        content: "The net work done on an object equals the change in its kinetic energy.",
        formula: "W_net = ΔKE = ½mv² − ½mu²",
      },
      {
        title: "Use Conservation of Energy (if applicable)",
        content: "If no non-conservative forces act, total mechanical energy is conserved.",
        formula: "KE₁ + PE₁ = KE₂ + PE₂",
      },
      {
        title: "Solve for the Unknown",
        content: "Substitute the known values into the selected equation and isolate the required variable.",
      },
      {
        title: "Verify the Answer",
        content: "Check units (Joules for energy, Watts for power). Ensure physical reasonableness.",
      },
    ],
    answer: "Energy is conserved between kinetic and potential forms; use the relevant formula to find the unknown.",
    keyConcepts: ["Conservation of energy", "Work-energy theorem", "Non-conservative forces", "Power"],
    practiceQuestions: [
      {
        question: "A 2 kg ball is dropped from 5 m height. Find its KE just before hitting the ground. (g=10)",
        answer: "PE = mgh = 2×10×5 = 100 J = KE at bottom",
      },
      {
        question: "A 1000 kg car moving at 20 m/s brakes to 10 m/s. How much KE is lost?",
        answer: "ΔKE = ½×1000×(400−100) = 150,000 J = 150 kJ",
      },
      {
        question: "How much work is done lifting a 50 kg box to a shelf 2 m high?",
        answer: "W = mgh = 50×10×2 = 1000 J",
      },
    ],
  },
};

const chemistrySolutions: Record<string, Solution> = {
  balancing: {
    topic: "Stoichiometry",
    difficulty: "Easy",
    steps: [
      {
        title: "Write the Unbalanced Equation",
        content: "Write all reactants on the left and products on the right using correct chemical formulae.",
      },
      {
        title: "Count Atoms on Each Side",
        content: "Tally the number of atoms of each element on both sides of the equation.",
      },
      {
        title: "Apply Coefficients to Balance",
        content: "Add whole-number coefficients in front of formulae to make atom counts equal on both sides. Start with the most complex molecule.",
      },
      {
        title: "Verify the Balance",
        content: "Recount all atoms on both sides to confirm the equation is balanced. Coefficients must be the simplest whole-number ratio.",
      },
      {
        title: "Apply Mole Ratios for Calculations",
        content: "Use the balanced equation's mole ratios for any quantitative calculations (mass, volume, moles).",
        formula: "moles = mass (g) ÷ molar mass (g/mol)",
      },
    ],
    answer: "The balanced equation obeys the Law of Conservation of Mass — atom count is equal on both sides.",
    keyConcepts: ["Law of Conservation of Mass", "Mole concept", "Molar ratios", "Limiting reagent"],
    practiceQuestions: [
      {
        question: "Balance: Fe + O₂ → Fe₂O₃",
        answer: "4Fe + 3O₂ → 2Fe₂O₃",
      },
      {
        question: "Balance: CH₄ + O₂ → CO₂ + H₂O",
        answer: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      },
      {
        question: "Balance: Al + HCl → AlCl₃ + H₂",
        answer: "2Al + 6HCl → 2AlCl₃ + 3H₂",
      },
    ],
  },
  bonding: {
    topic: "Chemical Bonding",
    difficulty: "Medium",
    steps: [
      {
        title: "Determine Valence Electrons",
        content: "Find the group number for each element — this gives the number of valence electrons available for bonding.",
      },
      {
        title: "Identify Bond Type",
        content: "Compare electronegativity values. If ΔEN > 1.7 → Ionic; 0.4–1.7 → Polar covalent; < 0.4 → Nonpolar covalent.",
      },
      {
        title: "Draw the Lewis Structure",
        content: "Place the least electronegative atom in the center. Connect atoms with shared electron pairs. Fill octets (H uses 2 electrons).",
      },
      {
        title: "Determine Molecular Geometry",
        content: "Apply VSEPR theory: count bonding pairs + lone pairs around the central atom to determine shape.",
        formula: "2 pairs → Linear | 3 → Trigonal planar | 4 → Tetrahedral | With lone pairs → bent/pyramidal",
      },
      {
        title: "Assess Polarity",
        content: "If bond dipoles cancel by symmetry → nonpolar molecule. If they don't cancel → polar molecule.",
      },
    ],
    answer: "Molecular properties (polarity, shape, reactivity) arise directly from the bonding and geometry determined above.",
    keyConcepts: ["Electronegativity", "VSEPR theory", "Lewis structures", "Hybridization"],
    practiceQuestions: [
      {
        question: "What type of bond forms between Na and Cl? Explain.",
        answer: "Ionic bond — Na loses 1e⁻ (ΔEN ≈ 2.1), Cl gains 1e⁻, forming Na⁺Cl⁻",
      },
      {
        question: "Predict the shape of NH₃ using VSEPR.",
        answer: "Trigonal pyramidal — 3 bonding pairs + 1 lone pair on N",
      },
      {
        question: "Is CO₂ polar or nonpolar? Why?",
        answer: "Nonpolar — linear geometry causes the two C=O bond dipoles to cancel exactly",
      },
    ],
  },
};

const mathSolutions: Record<string, Solution> = {
  quadratic: {
    topic: "Quadratic Equations",
    difficulty: "Easy",
    steps: [
      {
        title: "Write in Standard Form",
        content: "Rearrange the equation so all terms are on one side: ax² + bx + c = 0. Identify a, b, and c.",
      },
      {
        title: "Choose a Solution Method",
        content: "Three methods: (1) Factoring — quick if factors are obvious. (2) Completing the square. (3) Quadratic formula — always works.",
        formula: "x = (−b ± √(b² − 4ac)) / 2a",
      },
      {
        title: "Calculate the Discriminant",
        content: "D = b² − 4ac. This tells you the nature of roots before solving.",
        formula: "D > 0 → two real roots  |  D = 0 → one repeated root  |  D < 0 → no real roots",
      },
      {
        title: "Find the Roots",
        content: "Apply the chosen method. For the quadratic formula, substitute a, b, c and evaluate both ± cases.",
      },
      {
        title: "Verify Your Answers",
        content: "Substitute each root back into the original equation. Both sides should equal zero.",
      },
    ],
    answer: "Use the quadratic formula or factoring to find the values of x that satisfy the equation.",
    keyConcepts: ["Standard form", "Discriminant", "Quadratic formula", "Nature of roots", "Factoring"],
    practiceQuestions: [
      {
        question: "Solve: x² − 7x + 12 = 0",
        answer: "Factor: (x−3)(x−4) = 0 → x = 3 or x = 4",
      },
      {
        question: "Solve using the quadratic formula: 2x² + 3x − 2 = 0",
        answer: "D = 9+16 = 25; x = (−3 ± 5)/4 → x = ½ or x = −2",
      },
      {
        question: "For what value of k does x² − kx + 9 = 0 have equal roots?",
        answer: "D = 0 → k² − 36 = 0 → k = ±6",
      },
    ],
  },
  calculus: {
    topic: "Calculus",
    difficulty: "Hard",
    steps: [
      {
        title: "Identify the Type of Problem",
        content: "Determine whether differentiation (rate of change, slope, maxima/minima) or integration (area, accumulation) is required.",
      },
      {
        title: "Apply Differentiation Rules",
        content: "Use the appropriate rule: power rule, product rule, quotient rule, or chain rule.",
        formula: "d/dx(xⁿ) = nxⁿ⁻¹  |  Product: (uv)' = u'v + uv'  |  Chain: d/dx[f(g(x))] = f'(g(x))·g'(x)",
      },
      {
        title: "Or Apply Integration Rules",
        content: "Reverse of differentiation. Identify the integral type and apply the correct technique.",
        formula: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C  |  ∫eˣ dx = eˣ + C  |  ∫(1/x) dx = ln|x| + C",
      },
      {
        title: "Evaluate at Limits (Definite Integral)",
        content: "For definite integrals, apply the Fundamental Theorem: substitute upper and lower limits and subtract.",
        formula: "∫[a to b] f(x)dx = F(b) − F(a)",
      },
      {
        title: "Interpret the Result",
        content: "State whether the result represents a rate, area, maximum/minimum value, or the anti-derivative function with constant C.",
      },
    ],
    answer: "Apply the relevant differentiation or integration technique and interpret the result in context.",
    keyConcepts: ["Limits", "Continuity", "Derivatives", "Integration", "Fundamental theorem"],
    practiceQuestions: [
      {
        question: "Differentiate f(x) = 3x⁴ − 2x² + 5x − 1",
        answer: "f'(x) = 12x³ − 4x + 5",
      },
      {
        question: "Find ∫(2x + 3)dx",
        answer: "x² + 3x + C",
      },
      {
        question: "Evaluate ∫[0 to 2] x² dx",
        answer: "[x³/3] from 0 to 2 = 8/3 − 0 = 8/3",
      },
    ],
  },
};

function getKeywords(question: string): string {
  return question.toLowerCase();
}

export function getSolution(subject: Subject, question: string): Solution {
  const q = getKeywords(question);

  if (subject === "Physics") {
    if (q.match(/velocit|accelerat|kinematic|distance|displacement|speed|motion/)) {
      return physicsSolutions.kinematics;
    }
    return physicsSolutions.energy;
  }

  if (subject === "Chemistry") {
    if (q.match(/bond|covalent|ionic|polar|lewis|vsepr|molecule|electronegativi/)) {
      return chemistrySolutions.bonding;
    }
    return chemistrySolutions.balancing;
  }

  if (subject === "Mathematics") {
    if (q.match(/differentiat|integrat|derivativ|calculus|∫|d\/dx|limit/)) {
      return mathSolutions.calculus;
    }
    return mathSolutions.quadratic;
  }

  return mathSolutions.quadratic;
}
