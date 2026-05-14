export type Subject = "Physics" | "Chemistry" | "Mathematics";

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
};
