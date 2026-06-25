/**
 * Concept Graph — the node schema and full static concept dataset.
 *
 * Every concept in SnapSolve is a node in this graph.
 * Nodes have dependencies (prerequisites) and successors,
 * forming a directed acyclic graph of learning relationships.
 *
 * Coverage: Mathematics, Physics, Chemistry — Classes 6–12 (CBSE/ICSE)
 */

export type Subject    = "Mathematics" | "Physics" | "Chemistry";
export type Board      = "CBSE" | "ICSE" | "Both";
export type Difficulty = 1 | 2 | 3 | 4 | 5;   // 1 = easiest, 5 = hardest
export type Importance = 1 | 2 | 3 | 4 | 5;   // 1 = minor, 5 = critical
export type ExamFrequency   = "rare" | "occasional" | "frequent" | "very_frequent";
export type RevisionPriority = "low" | "medium" | "high" | "critical";

export interface ConceptNode {
  id:                         string;       // unique slug, e.g. "math-quadratic-eqns"
  subject:                    Subject;
  board:                      Board;
  class:                      number;       // 6–12
  chapter:                    string;
  topic:                      string;
  concept:                    string;       // specific concept within the topic
  difficulty:                 Difficulty;
  importance:                 Importance;
  estimatedLearningTimeMinutes: number;
  commonMisconceptions:       string[];
  prerequisites:              string[];     // concept IDs this one depends on
  successors:                 string[];     // concept IDs that depend on this one
  relatedConcepts:            string[];     // sibling/adjacent concept IDs
  examFrequency:              ExamFrequency;
  ncertReferences:            string[];     // e.g. "Class 9 Maths Ch.2 Ex.2.1"
  questionIds:                string[];     // links into question bank
  revisionPriority:           RevisionPriority;
  keywords:                   string[];     // for concept search
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONCEPT DATASET
// ═══════════════════════════════════════════════════════════════════════════════

export const CONCEPT_NODES: ConceptNode[] = [

  // ── MATHEMATICS ─────────────────────────────────────────────────────────────

  {
    id: "math-integers", subject: "Mathematics", board: "Both", class: 6,
    chapter: "Integers", topic: "Integers", concept: "Integer number line and operations",
    difficulty: 1, importance: 4, estimatedLearningTimeMinutes: 30,
    commonMisconceptions: [
      "Adding a negative number increases the value",
      "Multiplying two negatives gives a negative",
    ],
    prerequisites: [], successors: ["math-fractions", "math-hcf-lcm"],
    relatedConcepts: ["math-number-systems"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 6 Maths Ch.6", "Class 7 Maths Ch.1"],
    questionIds: [], keywords: ["integer", "negative number", "number line", "absolute value", "additive inverse"],
  },

  {
    id: "math-fractions", subject: "Mathematics", board: "Both", class: 6,
    chapter: "Fractions and Decimals", topic: "Fractions", concept: "Fractions: operations and equivalence",
    difficulty: 1, importance: 4, estimatedLearningTimeMinutes: 45,
    commonMisconceptions: [
      "Adding fractions by adding numerators and denominators separately",
      "Larger denominator means larger fraction",
    ],
    prerequisites: ["math-integers"], successors: ["math-ratios", "math-percentages", "math-algebra-basics"],
    relatedConcepts: ["math-decimals"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 6 Maths Ch.7", "Class 7 Maths Ch.2"],
    questionIds: [], keywords: ["fraction", "numerator", "denominator", "equivalent", "simplify", "proper", "improper", "mixed"],
  },

  {
    id: "math-ratios", subject: "Mathematics", board: "Both", class: 6,
    chapter: "Ratio and Proportion", topic: "Ratio", concept: "Ratio, proportion and unitary method",
    difficulty: 2, importance: 4, estimatedLearningTimeMinutes: 40,
    commonMisconceptions: [
      "Ratios must always be whole numbers",
      "Reversing a ratio gives the same relationship",
    ],
    prerequisites: ["math-fractions"], successors: ["math-percentages", "math-probability"],
    relatedConcepts: ["math-percentages"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 6 Maths Ch.12"],
    questionIds: [], keywords: ["ratio", "proportion", "unitary method", "direct proportion", "inverse proportion"],
  },

  {
    id: "math-percentages", subject: "Mathematics", board: "Both", class: 7,
    chapter: "Comparing Quantities", topic: "Percentage", concept: "Percentage, profit, loss and interest",
    difficulty: 2, importance: 5, estimatedLearningTimeMinutes: 50,
    commonMisconceptions: [
      "Percentage increase and decrease are symmetric (20% up then 20% down ≠ same value)",
      "Simple interest and compound interest give the same result",
    ],
    prerequisites: ["math-fractions", "math-ratios"],
    successors: ["math-simple-interest", "math-compound-interest"],
    relatedConcepts: ["math-ratios"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 7 Maths Ch.8", "Class 8 Maths Ch.8"],
    questionIds: [], keywords: ["percentage", "percent", "profit", "loss", "discount", "cost price", "selling price"],
  },

  {
    id: "math-algebra-basics", subject: "Mathematics", board: "Both", class: 6,
    chapter: "Introduction to Algebra", topic: "Algebra", concept: "Variables, expressions and identities",
    difficulty: 2, importance: 5, estimatedLearningTimeMinutes: 45,
    commonMisconceptions: [
      "x + x = x²",
      "Variables can only represent whole numbers",
      "2x means 2 multiplied by an unknown called x — not that they are separate",
    ],
    prerequisites: ["math-integers", "math-fractions"],
    successors: ["math-linear-equations", "math-polynomials", "math-linear-inequalities"],
    relatedConcepts: ["math-number-systems"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 6 Maths Ch.11", "Class 7 Maths Ch.12"],
    questionIds: [], keywords: ["algebra", "variable", "expression", "term", "coefficient", "constant", "identity", "like terms"],
  },

  {
    id: "math-linear-equations", subject: "Mathematics", board: "Both", class: 8,
    chapter: "Linear Equations in One Variable", topic: "Linear Equations", concept: "Solving linear equations and word problems",
    difficulty: 2, importance: 5, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "Transposing changes the operation on the same side",
      "A linear equation can have two solutions",
    ],
    prerequisites: ["math-algebra-basics"],
    successors: ["math-linear-equations-two-var", "math-polynomials", "math-geometry-coordinate"],
    relatedConcepts: ["math-linear-inequalities"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 8 Maths Ch.2", "Class 9 Maths Ch.4"],
    questionIds: [], keywords: ["linear equation", "solve", "transposition", "balance method", "word problem", "one variable"],
  },

  {
    id: "math-linear-equations-two-var", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Linear Equations in Two Variables", topic: "Linear Equations", concept: "Linear equations in two variables and their graphs",
    difficulty: 3, importance: 4, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "A linear equation in two variables has exactly one solution",
      "The graph of a linear equation is always a curve",
    ],
    prerequisites: ["math-linear-equations", "math-geometry-coordinate"],
    successors: ["math-pair-linear-equations"],
    relatedConcepts: ["math-functions"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 9 Maths Ch.4"],
    questionIds: [], keywords: ["linear equation", "two variables", "graph", "x-axis", "y-axis", "solution", "infinite"],
  },

  {
    id: "math-pair-linear-equations", subject: "Mathematics", board: "Both", class: 10,
    chapter: "Pair of Linear Equations", topic: "Systems of Equations", concept: "Solving pairs of linear equations",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "Substitution and elimination always give the same intermediate steps",
      "Inconsistent system means one equation is wrong",
    ],
    prerequisites: ["math-linear-equations-two-var"],
    successors: ["math-quadratic-equations", "math-matrices"],
    relatedConcepts: ["math-determinants"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Maths Ch.3"],
    questionIds: [], keywords: ["simultaneous equations", "substitution", "elimination", "graphical method", "consistent", "inconsistent", "dependent"],
  },

  {
    id: "math-polynomials", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Polynomials", topic: "Polynomials", concept: "Polynomials: degree, zeros and factor theorem",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "A polynomial of degree n always has n distinct real roots",
      "The zero of a polynomial is the value of the polynomial at 0",
    ],
    prerequisites: ["math-algebra-basics", "math-linear-equations"],
    successors: ["math-quadratic-equations", "math-factorisation"],
    relatedConcepts: ["math-functions"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Maths Ch.2", "Class 10 Maths Ch.2"],
    questionIds: [], keywords: ["polynomial", "degree", "zero", "root", "remainder theorem", "factor theorem", "monomial", "binomial", "trinomial"],
  },

  {
    id: "math-factorisation", subject: "Mathematics", board: "Both", class: 8,
    chapter: "Factorisation", topic: "Factorisation", concept: "Factorisation methods and algebraic identities",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "(a + b)² = a² + b²",
      "Every expression can be factorised over integers",
    ],
    prerequisites: ["math-algebra-basics"],
    successors: ["math-polynomials", "math-quadratic-equations"],
    relatedConcepts: ["math-hcf-lcm"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 8 Maths Ch.14"],
    questionIds: [], keywords: ["factorisation", "factor", "common factor", "identity", "a²-b²", "middle term", "grouping"],
  },

  {
    id: "math-quadratic-equations", subject: "Mathematics", board: "Both", class: 10,
    chapter: "Quadratic Equations", topic: "Quadratic Equations", concept: "Quadratic formula, discriminant and nature of roots",
    difficulty: 4, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Discriminant > 0 means irrational roots",
      "Completing the square always produces integer values",
      "A quadratic always has two different roots",
    ],
    prerequisites: ["math-polynomials", "math-factorisation", "math-algebra-basics"],
    successors: ["math-arithmetic-progressions", "math-functions", "math-complex-numbers"],
    relatedConcepts: ["math-pair-linear-equations"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Maths Ch.4"],
    questionIds: [], keywords: ["quadratic", "quadratic formula", "discriminant", "roots", "completing the square", "nature of roots", "sum of roots", "product of roots"],
  },

  {
    id: "math-arithmetic-progressions", subject: "Mathematics", board: "Both", class: 10,
    chapter: "Arithmetic Progressions", topic: "Sequences and Series", concept: "AP: nth term and sum of n terms",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "The common difference can be zero",
      "Sum formula and term formula can be confused",
    ],
    prerequisites: ["math-algebra-basics", "math-linear-equations"],
    successors: ["math-geometric-progressions", "math-series"],
    relatedConcepts: ["math-geometric-progressions"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Maths Ch.5"],
    questionIds: [], keywords: ["arithmetic progression", "AP", "common difference", "nth term", "sum of n terms", "arithmetic mean"],
  },

  {
    id: "math-trigonometry-basics", subject: "Mathematics", board: "Both", class: 10,
    chapter: "Introduction to Trigonometry", topic: "Trigonometry", concept: "Trigonometric ratios and identities",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "sin(A + B) = sinA + sinB",
      "tan θ = sinθ / cosθ is only valid for acute angles",
    ],
    prerequisites: ["math-pythagoras", "math-geometry-triangles", "math-ratios"],
    successors: ["math-trigonometry-heights", "math-trigonometry-advanced"],
    relatedConcepts: ["math-coordinate-geometry"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Maths Ch.8"],
    questionIds: [], keywords: ["trigonometry", "sin", "cos", "tan", "cosec", "sec", "cot", "right triangle", "opposite", "adjacent", "hypotenuse", "identity"],
  },

  {
    id: "math-pythagoras", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Triangles", topic: "Pythagoras Theorem", concept: "Pythagoras theorem and its converse",
    difficulty: 2, importance: 5, estimatedLearningTimeMinutes: 45,
    commonMisconceptions: [
      "Pythagoras theorem works for all triangles",
      "Hypotenuse can be any side of a right triangle",
    ],
    prerequisites: ["math-geometry-triangles", "math-integers"],
    successors: ["math-trigonometry-basics", "math-coordinate-geometry"],
    relatedConcepts: ["math-geometry-circles"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Maths Ch.6", "Class 10 Maths Ch.6"],
    questionIds: [], keywords: ["pythagoras", "right angle", "hypotenuse", "right triangle", "pythagorean triple"],
  },

  {
    id: "math-geometry-triangles", subject: "Mathematics", board: "Both", class: 7,
    chapter: "The Triangle and Its Properties", topic: "Geometry", concept: "Triangle properties, congruence and similarity",
    difficulty: 2, importance: 4, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "Similar triangles are always congruent",
      "The sum of angles can vary in different types of triangles",
    ],
    prerequisites: ["math-integers"],
    successors: ["math-pythagoras", "math-geometry-circles", "math-trigonometry-basics"],
    relatedConcepts: ["math-geometry-quadrilaterals"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 7 Maths Ch.6", "Class 9 Maths Ch.6"],
    questionIds: [], keywords: ["triangle", "congruence", "similarity", "angle sum", "equilateral", "isosceles", "scalene", "altitude", "median"],
  },

  {
    id: "math-probability", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Probability", topic: "Probability", concept: "Basic probability and experimental probability",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "Probability can be greater than 1",
      "If event A didn't happen many times, it's more likely to happen next time (gambler's fallacy)",
    ],
    prerequisites: ["math-fractions", "math-ratios"],
    successors: ["math-statistics", "math-permcomb"],
    relatedConcepts: ["math-statistics"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Maths Ch.15", "Class 10 Maths Ch.15"],
    questionIds: [], keywords: ["probability", "event", "sample space", "outcome", "equally likely", "experimental", "theoretical", "complementary"],
  },

  {
    id: "math-statistics", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Statistics", topic: "Statistics", concept: "Mean, median, mode and data representation",
    difficulty: 2, importance: 4, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "The mean is always the middle value",
      "Mode is always unique",
    ],
    prerequisites: ["math-fractions", "math-algebra-basics"],
    successors: ["math-probability", "math-statistics-advanced"],
    relatedConcepts: ["math-probability"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Maths Ch.14", "Class 10 Maths Ch.14"],
    questionIds: [], keywords: ["mean", "median", "mode", "range", "histogram", "bar graph", "frequency", "class interval", "cumulative frequency"],
  },

  {
    id: "math-coordinate-geometry", subject: "Mathematics", board: "Both", class: 9,
    chapter: "Coordinate Geometry", topic: "Coordinate Geometry", concept: "Cartesian plane, distance and section formula",
    difficulty: 3, importance: 4, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "Distance formula gives a negative value for some points",
      "The midpoint formula requires a specific ordering of points",
    ],
    prerequisites: ["math-integers", "math-pythagoras"],
    successors: ["math-linear-equations-two-var", "math-geometry-coordinate"],
    relatedConcepts: ["math-trigonometry-basics"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 9 Maths Ch.3", "Class 10 Maths Ch.7"],
    questionIds: [], keywords: ["coordinate geometry", "cartesian", "x-axis", "y-axis", "distance formula", "section formula", "midpoint", "quadrant"],
  },

  // ── PHYSICS ───────────────────────────────────────────────────────────────

  {
    id: "phys-motion-basics", subject: "Physics", board: "CBSE", class: 9,
    chapter: "Motion", topic: "Motion", concept: "Distance, displacement, speed and velocity",
    difficulty: 2, importance: 5, estimatedLearningTimeMinutes: 60,
    commonMisconceptions: [
      "Speed and velocity are the same thing",
      "Distance and displacement are always equal",
      "An object at rest has no velocity but may have acceleration",
    ],
    prerequisites: [], successors: ["phys-equations-of-motion", "phys-forces", "phys-vectors"],
    relatedConcepts: ["phys-work-energy"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Science Ch.8"],
    questionIds: [], keywords: ["motion", "distance", "displacement", "speed", "velocity", "scalar", "vector", "uniform motion", "non-uniform"],
  },

  {
    id: "phys-equations-of-motion", subject: "Physics", board: "CBSE", class: 9,
    chapter: "Motion", topic: "Equations of Motion", concept: "Three equations of motion under uniform acceleration",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "v = u + at applies even when acceleration changes",
      "s = ut + ½at² uses the final velocity, not initial",
    ],
    prerequisites: ["phys-motion-basics", "math-algebra-basics"],
    successors: ["phys-forces", "phys-projectile-motion"],
    relatedConcepts: ["phys-vectors"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Science Ch.8"],
    questionIds: [], keywords: ["equations of motion", "v=u+at", "s=ut+½at²", "v²=u²+2as", "acceleration", "uniform acceleration"],
  },

  {
    id: "phys-forces", subject: "Physics", board: "CBSE", class: 9,
    chapter: "Force and Laws of Motion", topic: "Newton's Laws", concept: "Newton's three laws of motion",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "A heavier object falls faster",
      "An object needs a continuous force to keep moving",
      "Action and reaction forces cancel each other out",
    ],
    prerequisites: ["phys-motion-basics", "phys-equations-of-motion"],
    successors: ["phys-work-energy", "phys-gravitation", "phys-friction"],
    relatedConcepts: ["phys-vectors"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Science Ch.9"],
    questionIds: [], keywords: ["newton", "force", "inertia", "momentum", "action reaction", "F=ma", "law of motion", "mass", "net force"],
  },

  {
    id: "phys-work-energy", subject: "Physics", board: "CBSE", class: 9,
    chapter: "Work and Energy", topic: "Work, Energy and Power", concept: "Work, energy, power and conservation",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "Work is done whenever a force is applied",
      "Potential energy and kinetic energy cannot exist simultaneously in an object",
    ],
    prerequisites: ["phys-forces", "math-trigonometry-basics"],
    successors: ["phys-thermodynamics", "phys-simple-machines"],
    relatedConcepts: ["phys-gravitation"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Science Ch.11"],
    questionIds: [], keywords: ["work", "energy", "power", "joule", "watt", "kinetic energy", "potential energy", "conservation of energy", "mechanical energy"],
  },

  {
    id: "phys-electricity-basics", subject: "Physics", board: "CBSE", class: 10,
    chapter: "Electricity", topic: "Electric Current", concept: "Current, voltage, resistance and Ohm's Law",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Current is consumed as it flows through a circuit",
      "Voltage is the amount of current",
      "A thicker wire has more resistance",
    ],
    prerequisites: ["phys-forces", "math-ratios"],
    successors: ["phys-electricity-circuits", "phys-magnetic-effects"],
    relatedConcepts: ["phys-magnetic-effects"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.12"],
    questionIds: [], keywords: ["current", "voltage", "resistance", "ohm", "ohm's law", "potential difference", "ampere", "volt", "conductor", "insulator"],
  },

  {
    id: "phys-electricity-circuits", subject: "Physics", board: "CBSE", class: 10,
    chapter: "Electricity", topic: "Electric Circuits", concept: "Series and parallel circuits, power and heating",
    difficulty: 4, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "In a parallel circuit, voltage is divided across branches",
      "Adding more bulbs in series makes them brighter",
    ],
    prerequisites: ["phys-electricity-basics"],
    successors: ["phys-magnetic-effects", "phys-electromagnetic-induction"],
    relatedConcepts: [],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.12"],
    questionIds: [], keywords: ["series circuit", "parallel circuit", "resistor", "equivalent resistance", "power", "joule heating", "fuse", "earthing"],
  },

  {
    id: "phys-light-reflection", subject: "Physics", board: "CBSE", class: 10,
    chapter: "Light — Reflection and Refraction", topic: "Light", concept: "Reflection of light and mirror formula",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "Virtual images can be projected on a screen",
      "Concave mirrors always form real images",
    ],
    prerequisites: ["math-geometry-triangles"],
    successors: ["phys-light-refraction", "phys-human-eye"],
    relatedConcepts: ["phys-light-refraction"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.10"],
    questionIds: [], keywords: ["reflection", "mirror", "concave", "convex", "plane mirror", "focal length", "radius of curvature", "mirror formula", "magnification"],
  },

  {
    id: "phys-light-refraction", subject: "Physics", board: "CBSE", class: 10,
    chapter: "Light — Reflection and Refraction", topic: "Light", concept: "Refraction, Snell's law and lenses",
    difficulty: 4, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Light always bends toward the normal when entering a denser medium",
      "The power of a lens is its magnification",
    ],
    prerequisites: ["phys-light-reflection"],
    successors: ["phys-human-eye", "phys-wave-optics"],
    relatedConcepts: ["phys-light-reflection"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.10"],
    questionIds: [], keywords: ["refraction", "snell's law", "lens", "convex lens", "concave lens", "refractive index", "lens formula", "power of lens", "prism"],
  },

  // ── CHEMISTRY ─────────────────────────────────────────────────────────────

  {
    id: "chem-matter-basics", subject: "Chemistry", board: "CBSE", class: 9,
    chapter: "Matter in Our Surroundings", topic: "States of Matter", concept: "States of matter and change of state",
    difficulty: 1, importance: 4, estimatedLearningTimeMinutes: 45,
    commonMisconceptions: [
      "Evaporation and boiling are the same process",
      "Ice melting absorbs no heat",
    ],
    prerequisites: [],
    successors: ["chem-atomic-structure", "chem-pure-substances"],
    relatedConcepts: ["chem-pure-substances"],
    examFrequency: "frequent", revisionPriority: "high",
    ncertReferences: ["Class 9 Science Ch.1"],
    questionIds: [], keywords: ["matter", "solid", "liquid", "gas", "evaporation", "condensation", "melting", "boiling", "sublimation", "latent heat"],
  },

  {
    id: "chem-atomic-structure", subject: "Chemistry", board: "Both", class: 9,
    chapter: "Structure of the Atom", topic: "Atomic Structure", concept: "Atomic models, subatomic particles and electron configuration",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Electrons orbit the nucleus like planets",
      "Protons and neutrons have the same mass",
      "Atomic number and mass number are the same",
    ],
    prerequisites: ["chem-matter-basics"],
    successors: ["chem-periodic-table", "chem-chemical-bonding", "chem-isotopes"],
    relatedConcepts: ["chem-periodic-table"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 9 Science Ch.4"],
    questionIds: [], keywords: ["atom", "electron", "proton", "neutron", "nucleus", "shell", "orbit", "valence", "atomic number", "mass number", "Bohr", "Rutherford", "Thomson"],
  },

  {
    id: "chem-periodic-table", subject: "Chemistry", board: "Both", class: 10,
    chapter: "Periodic Classification of Elements", topic: "Periodic Table", concept: "Periodic law, groups and periods",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Elements in the same group have the same number of electrons",
      "Atomic size increases across a period",
    ],
    prerequisites: ["chem-atomic-structure"],
    successors: ["chem-chemical-bonding", "chem-metals-nonmetals"],
    relatedConcepts: ["chem-chemical-bonding"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.5"],
    questionIds: [], keywords: ["periodic table", "period", "group", "Mendeleev", "atomic radius", "ionisation energy", "electronegativity", "Dobereiner", "Newlands"],
  },

  {
    id: "chem-chemical-bonding", subject: "Chemistry", board: "Both", class: 10,
    chapter: "Carbon and Its Compounds", topic: "Chemical Bonding", concept: "Ionic, covalent and metallic bonding",
    difficulty: 4, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "Covalent compounds always have low melting points",
      "Ionic compounds conduct electricity in all states",
    ],
    prerequisites: ["chem-atomic-structure", "chem-periodic-table"],
    successors: ["chem-chemical-reactions", "chem-organic-chemistry"],
    relatedConcepts: ["chem-periodic-table"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.4"],
    questionIds: [], keywords: ["bonding", "ionic bond", "covalent bond", "electron transfer", "electron sharing", "electrovalent", "valence electron", "octet rule"],
  },

  {
    id: "chem-acids-bases", subject: "Chemistry", board: "Both", class: 10,
    chapter: "Acids, Bases and Salts", topic: "Acids and Bases", concept: "pH scale, neutralisation and salt formation",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "Acids are always corrosive liquids",
      "pH 7 always means pure water",
      "Neutralisation produces water only",
    ],
    prerequisites: ["chem-chemical-bonding"],
    successors: ["chem-chemical-reactions", "chem-electrochemistry"],
    relatedConcepts: ["chem-salts"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.2"],
    questionIds: [], keywords: ["acid", "base", "pH", "neutral", "salt", "neutralisation", "indicator", "litmus", "strong acid", "weak acid", "hydronium"],
  },

  {
    id: "chem-chemical-reactions", subject: "Chemistry", board: "Both", class: 10,
    chapter: "Chemical Reactions and Equations", topic: "Chemical Reactions", concept: "Types of reactions and balancing equations",
    difficulty: 3, importance: 5, estimatedLearningTimeMinutes: 75,
    commonMisconceptions: [
      "Balancing equations changes what products are formed",
      "Decomposition and displacement are the same",
    ],
    prerequisites: ["chem-chemical-bonding", "math-algebra-basics"],
    successors: ["chem-redox-reactions", "chem-electrochemistry"],
    relatedConcepts: ["chem-acids-bases"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.1"],
    questionIds: [], keywords: ["chemical reaction", "reactant", "product", "equation", "balancing", "combination", "decomposition", "displacement", "double displacement", "redox"],
  },

  {
    id: "chem-carbon-compounds", subject: "Chemistry", board: "CBSE", class: 10,
    chapter: "Carbon and Its Compounds", topic: "Organic Chemistry", concept: "Carbon bonding, hydrocarbons and functional groups",
    difficulty: 4, importance: 5, estimatedLearningTimeMinutes: 90,
    commonMisconceptions: [
      "All organic compounds contain oxygen",
      "Saturated compounds cannot react",
    ],
    prerequisites: ["chem-chemical-bonding"],
    successors: ["chem-organic-chemistry"],
    relatedConcepts: ["chem-chemical-reactions"],
    examFrequency: "very_frequent", revisionPriority: "critical",
    ncertReferences: ["Class 10 Science Ch.4"],
    questionIds: [], keywords: ["carbon", "organic", "hydrocarbon", "alkane", "alkene", "alkyne", "functional group", "catenation", "tetravalent", "saturated", "unsaturated"],
  },
];

// ── Index for fast lookups ────────────────────────────────────────────────────

export const CONCEPT_INDEX: Map<string, ConceptNode> = new Map(
  CONCEPT_NODES.map((n) => [n.id, n])
);

/** All concept IDs for a given subject. */
export function getConceptsBySubject(subject: Subject): ConceptNode[] {
  return CONCEPT_NODES.filter((n) => n.subject === subject);
}

/** All concept IDs for a given class. */
export function getConceptsByClass(cls: number): ConceptNode[] {
  return CONCEPT_NODES.filter((n) => n.class === cls);
}
