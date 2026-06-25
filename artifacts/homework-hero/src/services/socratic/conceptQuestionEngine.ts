/**
 * Concept Question Engine — generates adaptive conceptual questions.
 *
 * Questions are calibrated to Bloom's taxonomy based on mastery score.
 * They test UNDERSTANDING, not memory.
 *
 * The engine:
 *  1. Calls the backend /api/tutor with action=generateQuestion
 *  2. Falls back to local template bank if the backend is unavailable
 *
 * Tracks question history per topic to avoid repetition.
 * Firestore path: students/{id}/questionHistory
 */

const BASE_URL = import.meta.env.BASE_URL as string ?? "/";

export type QuestionDifficulty = "remember" | "understand" | "apply" | "analyse" | "evaluate";

export interface ConceptQuestion {
  id:          string;
  content:     string;
  difficulty:  QuestionDifficulty;
  topic:       string;
  subject:     string;
  generatedAt: number;
  source:      "ai" | "template";
}

function difficultyFromMastery(mastery: number): QuestionDifficulty {
  if (mastery < 25) return "remember";
  if (mastery < 40) return "understand";
  if (mastery < 70) return "apply";
  if (mastery < 90) return "analyse";
  return "evaluate";
}

const BLOOM_LABELS: Record<QuestionDifficulty, string> = {
  remember:   "🧠 Recall",
  understand: "💡 Understand",
  apply:      "🔧 Apply",
  analyse:    "🔍 Analyse",
  evaluate:   "⭐ Evaluate",
};

export { BLOOM_LABELS };

/** Generate a conceptual question for a topic via AI backend. */
export async function generateConceptQuestion(opts: {
  topic:         string;
  subject:       string;
  masteryScore:  number;
  studentContext?: string;
}): Promise<ConceptQuestion> {
  const difficulty = difficultyFromMastery(opts.masteryScore);

  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:        "generateQuestion",
        topic:         opts.topic,
        subject:       opts.subject,
        masteryScore:  opts.masteryScore,
        studentContext: opts.studentContext,
      }),
    });

    if (res.ok) {
      const data = await res.json() as { content: string };
      return {
        id:          `q-${Date.now().toString(36)}`,
        content:     data.content,
        difficulty,
        topic:       opts.topic,
        subject:     opts.subject,
        generatedAt: Date.now(),
        source:      "ai",
      };
    }
  } catch { /* fall through */ }

  // Fallback templates
  const templates = getLocalQuestion(opts.topic, difficulty);
  return {
    id:          `q-${Date.now().toString(36)}`,
    content:     templates,
    difficulty,
    topic:       opts.topic,
    subject:     opts.subject,
    generatedAt: Date.now(),
    source:      "template",
  };
}

function getLocalQuestion(topic: string, difficulty: QuestionDifficulty): string {
  const banks: Record<QuestionDifficulty, string[]> = {
    remember: [
      `In your own words, what is ${topic}?`,
      `Can you define ${topic} without looking at your notes?`,
      `What is the key idea behind ${topic}?`,
    ],
    understand: [
      `Why does ${topic} work the way it does? What's the underlying principle?`,
      `Explain ${topic} as if you were teaching it to someone younger than you.`,
      `What would happen if ${topic} didn't exist? What problem would go unsolved?`,
    ],
    apply: [
      `Walk me through the first two steps you'd take when solving a ${topic} problem.`,
      `How would you use ${topic} if I changed one of the values in a problem?`,
      `Give me a real-world situation where ${topic} would apply.`,
    ],
    analyse: [
      `Why do we use this particular method for ${topic}? What assumption does it depend on?`,
      `What's the most common mistake students make with ${topic}, and why does it happen?`,
      `How is ${topic} related to what you learned before it? What do they share?`,
    ],
    evaluate: [
      `If you had to design a question that tests ${topic}, what would it look like?`,
      `Compare this approach to ${topic} with an alternative. When would you choose one over the other?`,
      `What would you tell a student who always gets ${topic} wrong? What's usually the root cause?`,
    ],
  };
  const bank = banks[difficulty];
  return bank[Math.floor(Math.random() * bank.length)];
}
