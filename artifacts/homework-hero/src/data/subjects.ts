export type Subject =
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology"
  | "Economics"
  | "Computer Science";

export interface SubjectConfig {
  icon: string;
  color: string;
  light: string;
  border: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
  topics: string[];
}

export const SUBJECTS: Record<Subject, SubjectConfig> = {
  Mathematics: {
    icon: "📐",
    color: "#d97706",
    light: "#fffbeb",
    border: "#fde68a",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    topics: [
      "Sets & Relations",
      "Algebra",
      "Quadratic Equations",
      "Trigonometry",
      "Coordinate Geometry",
      "Calculus",
      "Matrices & Determinants",
      "Probability",
      "Vectors",
      "Statistics",
    ],
  },
  Physics: {
    icon: "⚡",
    color: "#6366f1",
    light: "#eef2ff",
    border: "#c7d2fe",
    textClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
    topics: [
      "Kinematics",
      "Newton's Laws",
      "Work & Energy",
      "Gravitation",
      "Thermodynamics",
      "Electrostatics",
      "Current Electricity",
      "Magnetism",
      "Optics",
      "Modern Physics",
    ],
  },
  Chemistry: {
    icon: "🧪",
    color: "#059669",
    light: "#ecfdf5",
    border: "#a7f3d0",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    topics: [
      "Atomic Structure",
      "Periodic Table",
      "Chemical Bonding",
      "Stoichiometry",
      "Thermochemistry",
      "Electrochemistry",
      "Organic Basics",
      "Reaction Mechanisms",
      "Coordination Compounds",
      "Polymers",
    ],
  },
  Biology: {
    icon: "🧬",
    color: "#16a34a",
    light: "#f0fdf4",
    border: "#bbf7d0",
    textClass: "text-green-700",
    bgClass: "bg-green-50",
    borderClass: "border-green-200",
    topics: [
      "Cell Biology",
      "Genetics",
      "Human Physiology",
      "Plant Physiology",
      "Ecology",
      "Evolution",
      "Biotechnology",
      "Reproduction",
      "Diversity of Life",
      "Biomolecules",
    ],
  },
  Economics: {
    icon: "📊",
    color: "#0284c7",
    light: "#f0f9ff",
    border: "#bae6fd",
    textClass: "text-sky-700",
    bgClass: "bg-sky-50",
    borderClass: "border-sky-200",
    topics: [
      "Microeconomics",
      "Macroeconomics",
      "Supply & Demand",
      "Market Structures",
      "GDP & Growth",
      "Inflation",
      "Money & Banking",
      "International Trade",
      "Public Finance",
      "Indian Economy",
    ],
  },
  "Computer Science": {
    icon: "💻",
    color: "#7c3aed",
    light: "#f5f3ff",
    border: "#ddd6fe",
    textClass: "text-violet-700",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-200",
    topics: [
      "Programming Basics",
      "Data Structures",
      "Algorithms",
      "Databases",
      "Networking",
      "Operating Systems",
      "Object-Oriented Programming",
      "Web Technologies",
      "Python",
      "Digital Logic",
    ],
  },
};
