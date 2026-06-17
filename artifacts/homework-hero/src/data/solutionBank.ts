import type { Subject } from "./subjects";

/**
 * Per-answer confidence breakdown computed by the confidence engine.
 * All values are 0–100 integers.
 */
export interface ConfidenceBreakdown {
  /** 0–100 — Tesseract OCR confidence (100 for typed questions) */
  ocr:       number;
  /** 0–100 — Topic-detection pattern match strength */
  topic:     number;
  /** 0–100 — Keyword-density score against the question bank */
  bankMatch: number;
  /** 0–100 — Model-reported answer confidence (100 for bank solutions) */
  ai:        number;
  /** 0–100 — Composite score used for tier display */
  composite: number;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  result?: string;
}

export interface SimilarQuestion {
  id: string;
  question: string;
  hint: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface AIResponse {
  id: string;
  subject: Subject;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  detectedQuestion: string;
  steps: SolutionStep[];
  finalAnswer: string;
  keyConcepts: string[];
  similarQuestions: SimilarQuestion[];
  /** Origin of the solution — for badge display and analytics */
  source?: "bank" | "openai" | "fallback";
  /** Common mistakes to avoid — populated by OpenAI solutions */
  commonMistakes?: string[];
  /** 0–1 match confidence from the question bank scorer */
  confidence?: number;
  /** Full confidence breakdown (attached by the confidence engine after solving) */
  confidenceBreakdown?: ConfidenceBreakdown;
}

// ─── ALGEBRA: QUADRATIC EQUATIONS ──────────────────────────────────────────────
const quadraticEntry: AIResponse = {
  id: "alg-quadratic",
  subject: "Mathematics",
  topic: "Quadratic Equations",
  difficulty: "Medium",
  detectedQuestion: "Solve the quadratic equation.",
  steps: [
    {
      stepNumber: 1,
      title: "Write in Standard Form",
      explanation: "Rearrange all terms to one side so the equation reads ax² + bx + c = 0. Identify the coefficients a, b, and c.",
      formula: "ax² + bx + c = 0",
    },
    {
      stepNumber: 2,
      title: "Calculate the Discriminant",
      explanation: "The discriminant D = b² − 4ac tells us the nature of roots before we solve. D > 0 gives two real roots, D = 0 gives one repeated root, D < 0 means no real roots.",
      formula: "D = b² − 4ac",
      result: "Check sign of D to predict roots",
    },
    {
      stepNumber: 3,
      title: "Choose a Solution Method",
      explanation: "If the expression factors easily, use factoring. Otherwise apply the quadratic formula, which always works.",
      formula: "x = (−b ± √D) / 2a",
    },
    {
      stepNumber: 4,
      title: "Compute Both Roots",
      explanation: "Evaluate x₁ = (−b + √D) / 2a and x₂ = (−b − √D) / 2a separately. Simplify each fraction completely.",
      result: "x₁ and x₂ are the two solutions",
    },
    {
      stepNumber: 5,
      title: "Verify by Substitution",
      explanation: "Substitute each root back into the original equation. Both sides should equal zero, confirming correctness.",
    },
  ],
  finalAnswer: "The roots satisfy ax² + bx + c = 0. Use x = (−b ± √(b²−4ac)) / 2a to find x₁ and x₂.",
  keyConcepts: ["Standard form", "Discriminant", "Quadratic formula", "Factoring", "Nature of roots"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "Solve: x² − 5x + 6 = 0", hint: "Factor as (x − a)(x − b) where a + b = 5, ab = 6", answer: "(x−2)(x−3) = 0  →  x = 2 or x = 3" },
    { id: "q2", difficulty: "Easy", question: "Solve: x² − 7x + 12 = 0", hint: "Find two numbers that multiply to 12 and add to −7", answer: "(x−3)(x−4) = 0  →  x = 3 or x = 4" },
    { id: "q3", difficulty: "Medium", question: "Solve using the quadratic formula: 2x² + 3x − 2 = 0", hint: "a=2, b=3, c=−2. Compute D = 9 + 16", answer: "D = 25; x = (−3 ± 5)/4 → x = ½ or x = −2" },
    { id: "q4", difficulty: "Medium", question: "For what value of k does x² − kx + 9 = 0 have equal roots?", hint: "Equal roots → D = 0", answer: "D = k² − 36 = 0  →  k = ±6" },
    { id: "q5", difficulty: "Hard", question: "Solve: 3x² − 2x − 8 = 0", hint: "a=3, b=−2, c=−8. Compute D = 4 + 96", answer: "D = 100; x = (2 ± 10)/6 → x = 2 or x = −4/3" },
  ],
};

// ─── ALGEBRA: LINEAR EQUATIONS ─────────────────────────────────────────────────
const linearEntry: AIResponse = {
  id: "alg-linear",
  subject: "Mathematics",
  topic: "Linear Equations",
  difficulty: "Easy",
  detectedQuestion: "Solve the linear equation for x.",
  steps: [
    {
      stepNumber: 1,
      title: "Identify the Equation",
      explanation: "A linear equation has the form ax + b = c where the variable has degree 1. Identify all terms containing x and all constant terms.",
    },
    {
      stepNumber: 2,
      title: "Isolate the Variable",
      explanation: "Move all x-terms to one side using addition or subtraction. Apply the same operation to both sides to keep the equation balanced.",
      formula: "ax + b = c  →  ax = c − b",
    },
    {
      stepNumber: 3,
      title: "Divide by the Coefficient",
      explanation: "Divide both sides by the coefficient of x to find its value.",
      formula: "x = (c − b) / a",
      result: "x is now isolated",
    },
    {
      stepNumber: 4,
      title: "Verify the Solution",
      explanation: "Substitute the value of x back into the original equation. Left-hand side should equal right-hand side.",
    },
  ],
  finalAnswer: "Isolate x by performing inverse operations on both sides. x = (c − b) / a.",
  keyConcepts: ["Balance principle", "Inverse operations", "Variable isolation", "Verification"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "Solve: 3x + 7 = 22", hint: "Subtract 7 from both sides first", answer: "3x = 15  →  x = 5" },
    { id: "q2", difficulty: "Easy", question: "Solve: 5x − 3 = 17", hint: "Add 3 to both sides first", answer: "5x = 20  →  x = 4" },
    { id: "q3", difficulty: "Easy", question: "Solve: 2(x + 4) = 18", hint: "Expand the bracket first", answer: "2x + 8 = 18  →  2x = 10  →  x = 5" },
    { id: "q4", difficulty: "Medium", question: "Solve: (3x + 1)/4 = 5", hint: "Multiply both sides by 4 first", answer: "3x + 1 = 20  →  3x = 19  →  x = 19/3" },
    { id: "q5", difficulty: "Medium", question: "Solve: 4x + 5 = 2x + 13", hint: "Collect x-terms on one side", answer: "2x = 8  →  x = 4" },
  ],
};

// ─── ALGEBRA: SIMULTANEOUS EQUATIONS ───────────────────────────────────────────
const simultaneousEntry: AIResponse = {
  id: "alg-simultaneous",
  subject: "Mathematics",
  topic: "Simultaneous Equations",
  difficulty: "Medium",
  detectedQuestion: "Solve the pair of simultaneous equations.",
  steps: [
    {
      stepNumber: 1,
      title: "Label the Equations",
      explanation: "Label the two equations as (1) and (2). Identify which method is easiest: substitution (one variable has coefficient 1) or elimination (coefficients can be matched).",
    },
    {
      stepNumber: 2,
      title: "Eliminate One Variable",
      explanation: "Multiply equations by appropriate constants so the coefficient of one variable becomes equal in both equations. Subtract (or add) one equation from the other.",
      formula: "If eq (1) × k₁ − eq (2) × k₂ cancels y → solve for x",
    },
    {
      stepNumber: 3,
      title: "Solve for the First Variable",
      explanation: "After elimination, one variable disappears. Solve the resulting single-variable equation.",
      result: "x = [value]",
    },
    {
      stepNumber: 4,
      title: "Back-Substitute for the Second Variable",
      explanation: "Substitute the found value back into either original equation and solve for the remaining variable.",
      result: "y = [value]",
    },
    {
      stepNumber: 5,
      title: "Verify in Both Equations",
      explanation: "Substitute both x and y into each original equation to confirm both are satisfied.",
    },
  ],
  finalAnswer: "The solution (x, y) satisfies both equations simultaneously. Verify by substituting into both equations.",
  keyConcepts: ["Elimination method", "Substitution method", "Consistent systems", "Unique solution"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "Solve: x + y = 7 and x − y = 3", hint: "Add the two equations to eliminate y", answer: "2x = 10 → x = 5, y = 2" },
    { id: "q2", difficulty: "Easy", question: "Solve: 2x + y = 11 and x + y = 7", hint: "Subtract equation 2 from equation 1", answer: "x = 4, y = 3" },
    { id: "q3", difficulty: "Medium", question: "Solve: 3x + 2y = 16 and 2x − y = 6", hint: "Multiply eq 2 by 2 and add to eq 1", answer: "7x = 28 → x = 4, y = 2" },
    { id: "q4", difficulty: "Medium", question: "Solve: 5x − 3y = 11 and 2x + y = 8", hint: "Substitute y = 8−2x from eq 2 into eq 1", answer: "y = 8−2x → 5x−3(8−2x)=11 → 11x=35 → x=35/11, y=18/11" },
    { id: "q5", difficulty: "Hard", question: "Solve: x/2 + y/3 = 4 and x/3 + y/2 = 4", hint: "Multiply both equations to clear fractions first", answer: "Multiply eq1 by 6: 3x+2y=24; eq2 by 6: 2x+3y=24; solve → x=24/5, y=24/5" },
  ],
};

// ─── PHYSICS: KINEMATICS ───────────────────────────────────────────────────────
const kinematicsEntry: AIResponse = {
  id: "phy-kinematics",
  subject: "Physics",
  topic: "Kinematics",
  difficulty: "Medium",
  detectedQuestion: "Solve this kinematics / equations of motion problem.",
  steps: [
    {
      stepNumber: 1,
      title: "List All Given Values",
      explanation: "Extract every known quantity and assign standard symbols. Write units explicitly.",
      formula: "u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement",
    },
    {
      stepNumber: 2,
      title: "Identify the Unknown",
      explanation: "Determine what you need to find. This guides which equation of motion to use.",
    },
    {
      stepNumber: 3,
      title: "Select the Correct Equation",
      explanation: "Choose the equation that connects your knowns to your unknown. All three equations together describe uniformly accelerated motion.",
      formula: "① v = u + at   ② s = ut + ½at²   ③ v² = u² + 2as",
    },
    {
      stepNumber: 4,
      title: "Substitute and Solve",
      explanation: "Plug in the known values and solve algebraically for the unknown. Keep track of signs — deceleration means negative a.",
      result: "Calculate numerical answer",
    },
    {
      stepNumber: 5,
      title: "Check Units and Direction",
      explanation: "Verify SI units: velocity in m/s, acceleration in m/s², displacement in m, time in s. For vectors, state direction explicitly.",
    },
  ],
  finalAnswer: "Apply the relevant equation of motion with the given values to find the unknown quantity with correct units.",
  keyConcepts: ["Uniform acceleration", "Equations of motion", "Scalar vs vector", "SI units", "Sign convention"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "A car starts from rest and accelerates uniformly at 3 m/s² for 8 s. Find its final velocity.", hint: "Use v = u + at with u = 0", answer: "v = 0 + 3×8 = 24 m/s" },
    { id: "q2", difficulty: "Easy", question: "A train travels at 20 m/s for 30 s. Find the distance covered.", hint: "Use s = ut (no acceleration)", answer: "s = 20 × 30 = 600 m" },
    { id: "q3", difficulty: "Medium", question: "A ball is thrown upward with 40 m/s. Find: (a) time to reach max height (b) max height. (g = 10 m/s²)", hint: "At max height v = 0. Use v = u − gt and s = ut − ½gt²", answer: "(a) t = 40/10 = 4 s  (b) s = 40×4 − ½×10×16 = 80 m" },
    { id: "q4", difficulty: "Medium", question: "A vehicle decelerates from 90 km/h to rest in 5 s. Find the deceleration and stopping distance.", hint: "Convert 90 km/h to m/s first (÷3.6)", answer: "u = 25 m/s, v=0, t=5s. a = −5 m/s², s = 62.5 m" },
    { id: "q5", difficulty: "Hard", question: "Two trains A (40 m/s) and B (25 m/s) approach each other on parallel tracks 1500 m apart. When will they meet?", hint: "Relative speed = sum of speeds. Time = Distance / Relative speed", answer: "Relative speed = 65 m/s. t = 1500/65 ≈ 23.1 s" },
  ],
};

// ─── PHYSICS: NEWTON'S LAWS ────────────────────────────────────────────────────
const newtonEntry: AIResponse = {
  id: "phy-newton",
  subject: "Physics",
  topic: "Newton's Laws of Motion",
  difficulty: "Medium",
  detectedQuestion: "Solve this force / Newton's laws problem.",
  steps: [
    {
      stepNumber: 1,
      title: "Draw a Free Body Diagram",
      explanation: "Sketch the object and draw all forces acting on it: weight (mg downward), normal force (N upward), applied force (F), friction (f opposing motion), and any tension (T).",
    },
    {
      stepNumber: 2,
      title: "Apply Newton's Second Law",
      explanation: "The net force on an object equals mass times acceleration. Sum all force components along each axis separately.",
      formula: "ΣF = ma   →   F_net = ma",
    },
    {
      stepNumber: 3,
      title: "Resolve Forces into Components",
      explanation: "For inclined planes or multi-direction forces, resolve into x (horizontal) and y (vertical) components. Apply ΣFₓ = maₓ and ΣFᵧ = maᵧ.",
      formula: "Fₓ = F cosθ    Fᵧ = F sinθ",
    },
    {
      stepNumber: 4,
      title: "Solve for the Unknown",
      explanation: "With the equations set up, solve for the required quantity: acceleration a, force F, tension T, or normal force N.",
      result: "a = F_net / m   or   F = ma",
    },
    {
      stepNumber: 5,
      title: "Check Newton's Third Law",
      explanation: "Every action has an equal and opposite reaction. Verify that reaction pairs are identified correctly and don't cancel each other in the same diagram.",
    },
  ],
  finalAnswer: "Net force = ma. Identify all forces, sum them along each axis, and solve for the unknown using F_net = ma.",
  keyConcepts: ["Free body diagram", "Net force", "F = ma", "Friction force", "Normal force", "Newton's Third Law"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "A 10 kg box is pushed with a force of 50 N on a frictionless surface. Find its acceleration.", hint: "Apply F = ma directly", answer: "a = F/m = 50/10 = 5 m/s²" },
    { id: "q2", difficulty: "Easy", question: "Find the weight of a 60 kg person on Earth. (g = 10 m/s²)", hint: "Weight = mass × gravitational acceleration", answer: "W = 60 × 10 = 600 N" },
    { id: "q3", difficulty: "Medium", question: "A 5 kg object is on a surface with friction coefficient μ = 0.3. Find friction force and acceleration when pushed with 30 N. (g = 10)", hint: "f = μN = μmg. Then a = (F−f)/m", answer: "f = 0.3×50 = 15 N. a = (30−15)/5 = 3 m/s²" },
    { id: "q4", difficulty: "Medium", question: "Two blocks of 3 kg and 5 kg are connected by a string on a frictionless surface. A force of 16 N is applied to the 5 kg block. Find acceleration and tension.", hint: "Total mass = 8 kg. Then find T using the 3 kg block alone.", answer: "a = 16/8 = 2 m/s². T = 3×2 = 6 N" },
    { id: "q5", difficulty: "Hard", question: "A 20 kg block is on a 30° incline with μ = 0.2. Find whether it slides and if so, the acceleration. (g = 10)", hint: "Compare mg sinθ with maximum static friction μmg cosθ", answer: "mg sin30° = 100 N, f_max = 0.2×20×10×cos30° ≈ 34.6 N. Net force = 65.4 N, a = 3.27 m/s²" },
  ],
};

// ─── PHYSICS: WORK & ENERGY ────────────────────────────────────────────────────
const energyEntry: AIResponse = {
  id: "phy-energy",
  subject: "Physics",
  topic: "Work, Power & Energy",
  difficulty: "Medium",
  detectedQuestion: "Solve this work, power, or energy problem.",
  steps: [
    {
      stepNumber: 1,
      title: "Identify Energy Types Involved",
      explanation: "Determine whether the problem involves kinetic energy (KE = ½mv²), gravitational potential energy (PE = mgh), work done (W = Fd cosθ), or power (P = W/t).",
      formula: "KE = ½mv²   |   PE = mgh   |   W = Fd cosθ",
    },
    {
      stepNumber: 2,
      title: "Apply the Work-Energy Theorem",
      explanation: "The net work done on an object equals the change in its kinetic energy. This connects forces to motion directly.",
      formula: "W_net = ΔKE = ½mv₂² − ½mv₁²",
    },
    {
      stepNumber: 3,
      title: "Apply Conservation of Energy",
      explanation: "If only conservative forces act (no friction), total mechanical energy is conserved. Energy transfers between KE and PE but total stays constant.",
      formula: "KE₁ + PE₁ = KE₂ + PE₂   (no non-conservative forces)",
    },
    {
      stepNumber: 4,
      title: "Account for Non-Conservative Forces",
      explanation: "If friction or air resistance is present, energy is lost as heat: W_nc = ΔKE + ΔPE = ΔE_mech.",
      formula: "E_initial − W_friction = E_final",
    },
    {
      stepNumber: 5,
      title: "Calculate Power if Required",
      explanation: "Power is the rate of doing work. Average power P = W/t or instantaneous power P = Fv.",
      formula: "P = W/t = Fv cosθ   (unit: Watt = J/s)",
    },
  ],
  finalAnswer: "Use KE = ½mv², PE = mgh, W = Fd cosθ, and conservation of energy to find the required quantity in Joules or Watts.",
  keyConcepts: ["Kinetic energy", "Potential energy", "Conservation of energy", "Work-energy theorem", "Power"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "A 3 kg ball is dropped from 20 m. Find its KE just before hitting the ground. (g = 10)", hint: "All PE converts to KE with no friction", answer: "KE = mgh = 3×10×20 = 600 J" },
    { id: "q2", difficulty: "Easy", question: "How much work is done lifting a 40 kg box to a height of 3 m? (g = 10)", hint: "W = force × distance = mgh", answer: "W = 40×10×3 = 1200 J" },
    { id: "q3", difficulty: "Medium", question: "A 1200 kg car moving at 30 m/s brakes to 10 m/s. Find the KE lost.", hint: "ΔKE = ½m(v₁² − v₂²)", answer: "ΔKE = ½×1200×(900−100) = 480,000 J = 480 kJ" },
    { id: "q4", difficulty: "Medium", question: "A machine does 9000 J of work in 3 minutes. Find its power output.", hint: "Convert 3 min to seconds first", answer: "P = W/t = 9000/180 = 50 W" },
    { id: "q5", difficulty: "Hard", question: "A 0.5 kg ball is released from the top of a 10 m frictionless ramp. What is its velocity at the bottom? (g = 10)", hint: "PE at top = KE at bottom", answer: "mgh = ½mv² → v = √(2gh) = √200 ≈ 14.1 m/s" },
  ],
};

// ─── CHEMISTRY: BALANCING EQUATIONS ───────────────────────────────────────────
const balancingEntry: AIResponse = {
  id: "chem-balancing",
  subject: "Chemistry",
  topic: "Balancing Chemical Equations",
  difficulty: "Easy",
  detectedQuestion: "Balance this chemical equation.",
  steps: [
    {
      stepNumber: 1,
      title: "Write the Unbalanced Equation",
      explanation: "List all reactants on the left and products on the right using correct chemical formulae. Do not change any formulae — only coefficients (numbers in front) can be adjusted.",
    },
    {
      stepNumber: 2,
      title: "Count Atoms on Each Side",
      explanation: "Make a table listing each element and count how many atoms appear on the left (reactants) vs right (products).",
    },
    {
      stepNumber: 3,
      title: "Balance the Most Complex Molecule First",
      explanation: "Start with the element that appears in the fewest formulae. Add coefficients in front of entire formulae — never change subscripts inside formulae.",
      formula: "Coefficient × subscript = total atoms of that element",
    },
    {
      stepNumber: 4,
      title: "Balance Remaining Elements",
      explanation: "Work through remaining elements one by one. Adjust coefficients systematically. Leave O and H for last in combustion reactions.",
    },
    {
      stepNumber: 5,
      title: "Verify and Simplify",
      explanation: "Recount all atoms on both sides. Ensure coefficients are the lowest whole-number ratio (divide all by GCD if needed). Check the Law of Conservation of Mass.",
    },
  ],
  finalAnswer: "The balanced equation has equal atom counts for each element on both sides, satisfying the Law of Conservation of Mass.",
  keyConcepts: ["Conservation of mass", "Coefficients vs subscripts", "Mole ratios", "Atom counting"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "Balance: H₂ + O₂ → H₂O", hint: "Start by balancing H, then O", answer: "2H₂ + O₂ → 2H₂O" },
    { id: "q2", difficulty: "Easy", question: "Balance: Fe + O₂ → Fe₂O₃", hint: "Balance Fe first, then oxygen", answer: "4Fe + 3O₂ → 2Fe₂O₃" },
    { id: "q3", difficulty: "Medium", question: "Balance: CH₄ + O₂ → CO₂ + H₂O", hint: "Balance C, then H, then O last", answer: "CH₄ + 2O₂ → CO₂ + 2H₂O" },
    { id: "q4", difficulty: "Medium", question: "Balance: Al + HCl → AlCl₃ + H₂", hint: "Balance Al, then Cl, then H", answer: "2Al + 6HCl → 2AlCl₃ + 3H₂" },
    { id: "q5", difficulty: "Hard", question: "Balance: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂", hint: "This is a redox reaction — balance by oxidation state change method or trial", answer: "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 8H₂O + 5Cl₂" },
  ],
};

// ─── CHEMISTRY: STOICHIOMETRY ──────────────────────────────────────────────────
const stoichiometryEntry: AIResponse = {
  id: "chem-stoichiometry",
  subject: "Chemistry",
  topic: "Stoichiometry & Mole Concept",
  difficulty: "Medium",
  detectedQuestion: "Solve this stoichiometry or mole calculation.",
  steps: [
    {
      stepNumber: 1,
      title: "Write and Balance the Equation",
      explanation: "Ensure the chemical equation is fully balanced. The coefficients represent mole ratios between all species.",
    },
    {
      stepNumber: 2,
      title: "Convert Mass to Moles",
      explanation: "Divide the given mass by the molar mass of the substance (found from the periodic table by adding atomic masses).",
      formula: "n = m / M   where n = moles, m = mass (g), M = molar mass (g/mol)",
    },
    {
      stepNumber: 3,
      title: "Apply Mole Ratio from Balanced Equation",
      explanation: "Use the stoichiometric coefficients as a ratio to convert moles of the given substance to moles of the required substance.",
      formula: "n(required) = n(given) × (coefficient of required / coefficient of given)",
    },
    {
      stepNumber: 4,
      title: "Convert Moles to Required Units",
      explanation: "Convert moles of the required substance to mass, volume (for gases at STP: 1 mol = 22.4 L), or number of particles (multiply by Avogadro's number 6.022 × 10²³).",
      formula: "m = n × M   |   V (at STP) = n × 22.4 L   |   N = n × 6.022×10²³",
    },
    {
      stepNumber: 5,
      title: "Identify Limiting Reagent (if two reactants given)",
      explanation: "Calculate moles of each reactant. Convert both to moles of product — whichever gives less product is the limiting reagent. Use it for your final answer.",
    },
  ],
  finalAnswer: "n = m/M → apply mole ratio → convert back to required units. The limiting reagent determines the maximum yield.",
  keyConcepts: ["Mole concept", "Molar mass", "Mole ratio", "Limiting reagent", "Avogadro's number", "Percentage yield"],
  similarQuestions: [
    { id: "q1", difficulty: "Easy", question: "How many moles are in 44 g of CO₂? (C=12, O=16)", hint: "M(CO₂) = 12 + 32 = 44 g/mol", answer: "n = 44/44 = 1 mol" },
    { id: "q2", difficulty: "Easy", question: "Find the mass of 2 moles of H₂O. (H=1, O=16)", hint: "M(H₂O) = 2 + 16 = 18 g/mol", answer: "m = 2 × 18 = 36 g" },
    { id: "q3", difficulty: "Medium", question: "2H₂ + O₂ → 2H₂O. How many grams of water form from 4 g of H₂? (H=1, O=16)", hint: "n(H₂) = 4/2 = 2 mol. Ratio H₂:H₂O = 1:1", answer: "n(H₂O) = 2 mol → m = 2×18 = 36 g" },
    { id: "q4", difficulty: "Medium", question: "What volume of CO₂ is produced at STP when 12 g of carbon burns completely? (C=12)", hint: "n(C) = 12/12 = 1 mol. C + O₂ → CO₂ (1:1 ratio)", answer: "n(CO₂) = 1 mol → V = 1 × 22.4 = 22.4 L" },
    { id: "q5", difficulty: "Hard", question: "N₂ + 3H₂ → 2NH₃. If 14 g N₂ and 6 g H₂ react, find limiting reagent and mass of NH₃ produced. (N=14, H=1)", hint: "n(N₂)=0.5 mol needs 1.5 mol H₂; n(H₂)=3 mol available. Check which runs out first.", answer: "N₂ is limiting (needs 1.5 mol H₂, only 3 available but N₂ runs out). n(NH₃) = 2×0.5 = 1 mol → m = 17 g" },
  ],
};

// ─── SOLUTION BANK & MATCHER ───────────────────────────────────────────────────
export const SOLUTION_BANK: AIResponse[] = [
  quadraticEntry,
  linearEntry,
  simultaneousEntry,
  kinematicsEntry,
  newtonEntry,
  energyEntry,
  balancingEntry,
  stoichiometryEntry,
];

interface MatchRule {
  entry: AIResponse;
  keywords: string[];
  weight: number;
}

const MATCH_RULES: MatchRule[] = [
  { entry: quadraticEntry,    keywords: ["quadratic", "x²", "x^2", "roots", "discriminant", "factor", "ax²"], weight: 10 },
  { entry: linearEntry,       keywords: ["linear", "solve for x", "find x", "simple equation"], weight: 8 },
  { entry: simultaneousEntry, keywords: ["simultaneous", "two equation", "system", "elimination", "substitution", "pair"], weight: 10 },
  { entry: kinematicsEntry,   keywords: ["velocity", "acceleration", "distance", "displacement", "speed", "kinematics", "motion", "initial velocity", "final velocity"], weight: 10 },
  { entry: newtonEntry,       keywords: ["force", "newton", "f=ma", "friction", "tension", "incline", "mass", "inertia", "free body"], weight: 10 },
  { entry: energyEntry,       keywords: ["energy", "work", "power", "kinetic", "potential", "joule", "watt", "conservation", "ramp", "height"], weight: 10 },
  { entry: balancingEntry,    keywords: ["balance", "equation", "reactant", "product", "→", "h₂o", "o₂", "co₂", "chemical", "compound"], weight: 10 },
  { entry: stoichiometryEntry, keywords: ["mole", "stoichiometry", "molar mass", "gram", "yield", "limiting", "avogadro"], weight: 10 },
];

/** Returns the best matching solution and the raw keyword score (0 = no match). */
export function matchSolutionWithScore(
  subject: string,
  question: string
): { response: AIResponse; score: number } {
  const q = question.toLowerCase();
  let bestMatch: AIResponse | null = null;
  let bestScore = 0;

  for (const rule of MATCH_RULES) {
    if (rule.entry.subject !== subject) continue;
    const score = rule.keywords.reduce(
      (s, kw) => s + (q.includes(kw.toLowerCase()) ? rule.weight : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.entry;
    }
  }

  if (bestMatch) return { response: bestMatch, score: bestScore };

  const subjectDefaults: Record<string, AIResponse> = {
    Mathematics: quadraticEntry,
    Physics:     kinematicsEntry,
    Chemistry:   balancingEntry,
  };
  return { response: subjectDefaults[subject] ?? quadraticEntry, score: 0 };
}

/** Convenience wrapper — returns the response only (backward-compatible). */
export function matchSolution(subject: string, question: string): AIResponse {
  return matchSolutionWithScore(subject, question).response;
}
