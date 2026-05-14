export interface Challenge {
  id: number;
  title: string;
  category: string;
  emoji: string;
  description: string;
  items: string[];
  color: string;
  shadowColor: string;
}

export const challenges: Challenge[] = [
  {
    id: 0,
    title: "Shape Hunter",
    category: "Observation",
    emoji: "⭕",
    description: "Find 3 objects in your room shaped like circles.",
    items: ["Circle object 1", "Circle object 2", "Circle object 3"],
    color: "#e05d10",
    shadowColor: "#fb923c",
  },
  {
    id: 1,
    title: "Color Quest",
    category: "Art & Colors",
    emoji: "🌈",
    description: "Find something in every color of the rainbow: red, orange, yellow, green, blue, and purple.",
    items: ["Red object", "Orange object", "Yellow object", "Green object", "Blue object", "Purple object"],
    color: "#9333ea",
    shadowColor: "#c084fc",
  },
  {
    id: 2,
    title: "Nature Detective",
    category: "Science",
    emoji: "🌿",
    description: "Go outside and find 3 different types of leaves.",
    items: ["Leaf 1 (small)", "Leaf 2 (big)", "Leaf 3 (different shape)"],
    color: "#16a34a",
    shadowColor: "#4ade80",
  },
  {
    id: 3,
    title: "Number Explorer",
    category: "Math",
    emoji: "🔢",
    description: "Find 4 things around your home that have numbers on them.",
    items: ["Number thing 1", "Number thing 2", "Number thing 3", "Number thing 4"],
    color: "#2563eb",
    shadowColor: "#60a5fa",
  },
  {
    id: 4,
    title: "Sound Safari",
    category: "Music & Senses",
    emoji: "🎵",
    description: "Find 3 objects you can tap or shake to make a sound.",
    items: ["Tapping sound", "Shaking sound", "Another cool sound"],
    color: "#db2777",
    shadowColor: "#f472b6",
  },
  {
    id: 5,
    title: "Texture Explorer",
    category: "Science",
    emoji: "🤲",
    description: "Find something rough, something smooth, and something soft.",
    items: ["Rough object", "Smooth object", "Soft object"],
    color: "#b45309",
    shadowColor: "#fbbf24",
  },
  {
    id: 6,
    title: "Alphabet Hunt",
    category: "Reading",
    emoji: "📚",
    description: "Find a book, a sign, or a label for each of these letters: A, B, and C.",
    items: ["Something with the letter A", "Something with the letter B", "Something with the letter C"],
    color: "#0891b2",
    shadowColor: "#22d3ee",
  },
];

export function getTodaysChallenge(): Challenge {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return challenges[dayOfYear % challenges.length];
}
