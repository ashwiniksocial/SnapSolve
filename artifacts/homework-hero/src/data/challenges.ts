export type Category = "Logic" | "Creativity" | "Movement" | "Observation" | "Speaking";

export interface Challenge {
  id: number;
  title: string;
  category: Category;
  emoji: string;
  description: string;
  items: string[];
}

export const CATEGORY_STYLES: Record<Category, { bg: string; text: string; border: string; color: string; shadow: string }> = {
  Logic:       { bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-400",   color: "#2563eb", shadow: "#60a5fa" },
  Creativity:  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-400", color: "#7c3aed", shadow: "#c084fc" },
  Movement:    { bg: "bg-green-100",  text: "text-green-700",  border: "border-green-400",  color: "#16a34a", shadow: "#4ade80" },
  Observation: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-400", color: "#ea580c", shadow: "#fb923c" },
  Speaking:    { bg: "bg-pink-100",   text: "text-pink-700",   border: "border-pink-400",   color: "#db2777", shadow: "#f472b6" },
};

export const challenges: Challenge[] = [
  // --- LOGIC ---
  {
    id: 0,
    title: "Pattern Finder",
    category: "Logic",
    emoji: "🔢",
    description: "Find 3 patterns around your home — stripes, dots, or repeating shapes. Tell someone what the pattern is!",
    items: ["Pattern 1 (describe it)", "Pattern 2 (describe it)", "Pattern 3 (describe it)"],
  },
  {
    id: 1,
    title: "Sorting Master",
    category: "Logic",
    emoji: "📦",
    description: "Pick any drawer or shelf and sort everything into 3 groups. Think about what makes each group special.",
    items: ["Group 1 (name it)", "Group 2 (name it)", "Group 3 (name it)"],
  },
  {
    id: 2,
    title: "True or False?",
    category: "Logic",
    emoji: "🤔",
    description: 'Make up 3 "true or false" statements about your house and quiz a family member!',
    items: ["Statement 1 written", "Statement 2 written", "Statement 3 written"],
  },
  {
    id: 3,
    title: "Biggest to Smallest",
    category: "Logic",
    emoji: "📏",
    description: "Find 5 objects and line them up from biggest to smallest. Can you find one smaller than your thumb?",
    items: ["5 objects collected", "Lined up biggest to smallest", "Found one smaller than thumb"],
  },
  {
    id: 4,
    title: "Odd One Out",
    category: "Logic",
    emoji: "🧩",
    description: "Collect 4 objects that belong together and 1 that doesn't. Ask someone to guess the odd one out!",
    items: ["4 matching objects found", "1 odd object chosen", "Quiz given to someone"],
  },
  {
    id: 5,
    title: "Secret Code",
    category: "Logic",
    emoji: "🔐",
    description: "Create a secret code where each letter becomes a number (A=1, B=2…). Encode your name!",
    items: ["Code key written", "Your name encoded", "Decoded a friend's name"],
  },
  {
    id: 6,
    title: "Shape Counter",
    category: "Logic",
    emoji: "🔷",
    description: "Count how many triangles, squares, and circles you can find in one room. Which shape wins?",
    items: ["Triangles counted", "Squares counted", "Circles counted"],
  },

  // --- CREATIVITY ---
  {
    id: 7,
    title: "Silly Inventor",
    category: "Creativity",
    emoji: "💡",
    description: "Draw or describe a silly invention that solves a made-up problem (e.g., a machine that puts away toys).",
    items: ["Problem chosen", "Invention named", "Drawing or description done"],
  },
  {
    id: 8,
    title: "Story Starter",
    category: "Creativity",
    emoji: "📖",
    description: 'Make up a 3-sentence story that starts with "One day, a tiny robot found a giant cookie…"',
    items: ["Sentence 1", "Sentence 2", "Sentence 3"],
  },
  {
    id: 9,
    title: "Name That Character",
    category: "Creativity",
    emoji: "🎭",
    description: "Pick any object in your room and give it a name, a job, and a superpower. Introduce it to someone!",
    items: ["Object chosen & named", "Job decided", "Superpower assigned & introduced"],
  },
  {
    id: 10,
    title: "Doodle Zoo",
    category: "Creativity",
    emoji: "🖍️",
    description: "Draw 3 made-up animals by mixing two real animals together (e.g., a catfish that's actually a cat + fish).",
    items: ["Animal 1 drawn & named", "Animal 2 drawn & named", "Animal 3 drawn & named"],
  },
  {
    id: 11,
    title: "Emotion Faces",
    category: "Creativity",
    emoji: "😄",
    description: "Draw 4 emotion faces: happy, surprised, confused, and one you make up yourself.",
    items: ["Happy face", "Surprised face", "Confused face", "Made-up emotion face"],
  },
  {
    id: 12,
    title: "Color Poem",
    category: "Creativity",
    emoji: "🎨",
    description: 'Write a 4-line poem about your favorite color. Each line starts with "My favorite color is…"',
    items: ["Line 1 written", "Line 2 written", "Line 3 written", "Line 4 written"],
  },
  {
    id: 13,
    title: "Silly Menu",
    category: "Creativity",
    emoji: "🍽️",
    description: "Design a menu for a restaurant on the moon. Think of 3 space-themed foods and give them fun names.",
    items: ["Food 1 named", "Food 2 named", "Food 3 named"],
  },

  // --- MOVEMENT ---
  {
    id: 14,
    title: "Animal Parade",
    category: "Movement",
    emoji: "🐘",
    description: "Move like 4 different animals for 30 seconds each: hop like a frog, slither like a snake, gallop like a horse, waddle like a penguin.",
    items: ["Frog hop (30 sec)", "Snake slither (30 sec)", "Horse gallop (30 sec)", "Penguin waddle (30 sec)"],
  },
  {
    id: 15,
    title: "Freeze Dance",
    category: "Movement",
    emoji: "🎵",
    description: "Play music and dance! Every time the music stops (or you pause), freeze in a funny pose for 5 seconds. Do 5 rounds!",
    items: ["Round 1 frozen pose", "Round 2 frozen pose", "Round 3 frozen pose", "Round 4 frozen pose", "Round 5 frozen pose"],
  },
  {
    id: 16,
    title: "Balloon Bop",
    category: "Movement",
    emoji: "🎈",
    description: "Blow up a balloon and try to keep it in the air for 1 minute using only your breath or one finger at a time.",
    items: ["Balloon blown up", "30 seconds in the air", "1 full minute in the air"],
  },
  {
    id: 17,
    title: "Balance Challenge",
    category: "Movement",
    emoji: "🧘",
    description: "Balance on one foot for 10 seconds, then the other foot, then try it with your eyes closed!",
    items: ["Left foot (10 sec)", "Right foot (10 sec)", "Eyes closed balance attempted"],
  },
  {
    id: 18,
    title: "Indoor Obstacle",
    category: "Movement",
    emoji: "🏃",
    description: "Use pillows, chairs, and books to build a mini obstacle course in your room and complete it 3 times!",
    items: ["Obstacle course built", "Run 1 complete", "Run 2 complete", "Run 3 complete"],
  },
  {
    id: 19,
    title: "Jumping Patterns",
    category: "Movement",
    emoji: "🦘",
    description: "Create a jumping pattern: 2 big jumps, 3 small hops, 1 spin. Repeat the pattern 5 times!",
    items: ["Pattern created", "Rounds 1–2 done", "Rounds 3–4 done", "Round 5 done"],
  },
  {
    id: 20,
    title: "Slow Motion",
    category: "Movement",
    emoji: "🐢",
    description: "Walk in super slow motion from one end of a room to the other 3 times. How slow can you go?",
    items: ["Slow walk 1", "Slow walk 2", "Slow walk 3"],
  },

  // --- OBSERVATION ---
  {
    id: 21,
    title: "Shape Hunter",
    category: "Observation",
    emoji: "⭕",
    description: "Find 3 objects shaped like circles, 3 like rectangles, and 2 like triangles.",
    items: ["3 circles found", "3 rectangles found", "2 triangles found"],
  },
  {
    id: 22,
    title: "Color Quest",
    category: "Observation",
    emoji: "🌈",
    description: "Find something in every color of the rainbow: red, orange, yellow, green, blue, and purple.",
    items: ["Red object", "Orange object", "Yellow object", "Green object", "Blue object", "Purple object"],
  },
  {
    id: 23,
    title: "Texture Explorer",
    category: "Observation",
    emoji: "🤲",
    description: "Find something rough, something smooth, something soft, and something hard.",
    items: ["Rough object", "Smooth object", "Soft object", "Hard object"],
  },
  {
    id: 24,
    title: "Nature Detective",
    category: "Observation",
    emoji: "🌿",
    description: "Go outside or look through a window. Find 3 things that are alive and 2 things that are not.",
    items: ["Living thing 1", "Living thing 2", "Living thing 3", "Non-living thing 1", "Non-living thing 2"],
  },
  {
    id: 25,
    title: "Mirror Mirror",
    category: "Observation",
    emoji: "🪞",
    description: "Find 4 objects that are symmetrical (same on both sides). Hint: try your own face!",
    items: ["Symmetrical object 1", "Symmetrical object 2", "Symmetrical object 3", "Symmetrical object 4"],
  },
  {
    id: 26,
    title: "Counting Windows",
    category: "Observation",
    emoji: "🔍",
    description: "Count every window, door, and light switch in your home. Write down your totals!",
    items: ["Windows counted", "Doors counted", "Light switches counted"],
  },
  {
    id: 27,
    title: "Sound Map",
    category: "Observation",
    emoji: "👂",
    description: "Sit still for 2 minutes and listen. Write down or remember every sound you hear. Can you find 6?",
    items: ["Sound 1 noted", "Sound 2 noted", "Sound 3 noted", "Sound 4 noted", "Sound 5 noted", "Sound 6 noted"],
  },

  // --- SPEAKING ---
  {
    id: 28,
    title: "Teach It!",
    category: "Speaking",
    emoji: "📢",
    description: "Pick something you know how to do (like tying shoes or making a sandwich) and teach it to someone else step by step.",
    items: ["Topic chosen", "3+ steps explained", "Person taught!"],
  },
  {
    id: 29,
    title: "Weather Reporter",
    category: "Speaking",
    emoji: "⛅",
    description: "Look outside and give a 30-second weather report like a TV presenter. Use your best reporter voice!",
    items: ["Weather observed", "Report written or memorized", "30-second report delivered"],
  },
  {
    id: 30,
    title: "Compliment Machine",
    category: "Speaking",
    emoji: "💬",
    description: "Give 3 genuine compliments to 3 different people today. Make each one unique and specific!",
    items: ["Compliment 1 given", "Compliment 2 given", "Compliment 3 given"],
  },
  {
    id: 31,
    title: "Two Truths One Lie",
    category: "Speaking",
    emoji: "🤫",
    description: "Tell someone 2 true facts about yourself and 1 made-up one. Can they spot the lie?",
    items: ["2 truths chosen", "1 lie chosen", "Game played with someone"],
  },
  {
    id: 32,
    title: "Favourite Thing Speech",
    category: "Speaking",
    emoji: "🌟",
    description: 'Give a 1-minute speech about your favourite book, movie, or game. Tell someone WHY you love it.',
    items: ["Topic picked", "3 reasons ready", "1-minute speech given"],
  },
];

export function getTodaysChallenge(): Challenge {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const cycle = challenges.length;
  return challenges[dayOfYear % cycle];
}

export function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}
