/**
 * GET /api/devLesson
 *
 * Development-only endpoint. Returns a complete hardcoded TeachingLesson fixture
 * so the rendering pipeline can be audited without an OPENAI_API_KEY.
 *
 * Disabled in production (NODE_ENV === "production").
 */

import { Router } from "express";

const router = Router();

const FIXTURE = {
  topic:        "Proof that √2 is Irrational",
  difficulty:   "Hard" as const,
  keyConcepts:  ["Rational numbers", "Irrational numbers", "Proof by contradiction", "Prime factorisation"],
  aiConfidence: 0.95,

  beforeWeStart: {
    motivator:      "This proof is one of the oldest in mathematics — Greek mathematicians discovered it 2,500 years ago. Once you understand it, you'll see why mathematicians love contradiction proofs.",
    anxietyReducer: "This looks scary but uses only one big idea: if something leads to a contradiction, our original assumption must have been wrong.",
    preview:        "We'll assume √2 IS rational, chase that assumption until it contradicts itself, then conclude it must be irrational.",
  },

  prerequisites: ["What a rational number is (p/q form)", "What prime factorisation means", "Basic algebra"],

  vocabulary: [
    { term: "Rational",     meaning: "Can be written as p/q where p, q are integers and q ≠ 0" },
    { term: "Irrational",   meaning: "Cannot be written as p/q in any form" },
    { term: "Contradiction", meaning: "Two statements that cannot both be true at once" },
    { term: "Coprime",      meaning: "Two integers that share no common factor except 1" },
    { term: "Even integer", meaning: "An integer divisible by 2 — always of the form 2k" },
  ],

  intuition: {
    story:    "Imagine you're a detective. Someone claims √2 can be written as a fraction. You say: 'Fine, show me.' They write p/q. You start checking... and within minutes you find their story contradicts itself. They claimed p and q share no common factor — but you prove both must be even. Two even numbers always share a factor of 2. Caught!",
    visual:   "Picture a fraction p/q reduced to its lowest terms (like 3/4, not 6/8). Now imagine squaring it. If √2 = p/q, then 2 = p²/q², meaning p² = 2q². We'll show this forces both p and q to be even — impossible in a reduced fraction.",
    everyday: "When you say a fraction is 'in lowest terms', you mean top and bottom share no common factor. Like 1/2 is in lowest terms, but 2/4 is not. This proof shows that no matter what fraction you try, it can never equal √2 exactly.",
  },

  questionTranslation: {
    plainEnglish: "Show that √2 cannot be written as a fraction of two integers in any form.",
    whatWeKnow:   "A rational number is one expressed as p/q where p, q are integers, q ≠ 0, and HCF(p,q) = 1",
    whatWeFind:   "Prove that no such p and q exist for √2",
    wordToMath:   "Assume √2 = p/q (lowest terms)\n→ 2 = p²/q²\n→ p² = 2q²\n→ (derive contradiction)",
  },

  teacherThinking: {
    firstNotice:   "The moment you see 'prove irrational', your brain should say: proof by contradiction. Assume it IS rational, then derive a contradiction.",
    whyThisMethod: "Direct proof is impossible for irrational numbers — you can't list them as p/q. But contradiction proof only needs you to show that assuming it's rational leads to nonsense.",
    clues:         "The key clue: if p² is even, then p itself must be even. This is the engine of the whole proof (odd × odd = odd, never even).",
  },

  guidedReasoning: [
    {
      what:   "Assume √2 is rational",
      why:    "We use contradiction — assume the opposite of what we want to prove",
      math:   "Assume √2 = p/q where p, q ∈ ℤ, q ≠ 0, and HCF(p, q) = 1",
      result: "We now have a fraction in its lowest terms",
      pause:  "Why do we need HCF(p,q) = 1? Because every fraction can be reduced to lowest terms. If even the reduced form leads to contradiction, we're done.",
    },
    {
      what:   "Square both sides",
      why:    "Squaring removes the square root so we can work with whole numbers",
      math:   "2 = p²/q²  →  p² = 2q²",
      result: "p² equals 2 times q², meaning p² is even",
      pause:  "If p² = 2q², what do we know about p²? It equals 2 × (something), so it must be divisible by 2, meaning it's even.",
    },
    {
      what:   "Conclude p is even",
      why:    "Key lemma: if p² is even, then p is even. Proof: if p were odd, p² would be odd (odd×odd=odd). So p must be even.",
      math:   "p is even  →  p = 2m  for some integer m",
      result: "We can write p as twice some integer m",
      pause:  "Convince yourself: try p=3 (odd), p²=9 (odd). Try p=4 (even), p²=16 (even). Even squares only come from even bases.",
    },
    {
      what:   "Substitute p = 2m back into p² = 2q²",
      why:    "We want to find out what this tells us about q",
      math:   "(2m)² = 2q²  →  4m² = 2q²  →  q² = 2m²",
      result: "q² = 2m², which means q² is even",
      pause:  "We used exactly the same algebra as step 2. The symmetry is the beauty of this proof.",
    },
    {
      what:   "Conclude q is even",
      why:    "By the same lemma: if q² is even, then q is even",
      math:   "q is even  →  q = 2n  for some integer n",
      result: "Both p and q are even — both divisible by 2",
      pause:  "Stop. We said HCF(p,q) = 1. But now both p and q are divisible by 2. That means HCF(p,q) ≥ 2. CONTRADICTION.",
    },
    {
      what:   "State the contradiction",
      why:    "Our assumption that √2 = p/q (in lowest terms) led to p and q both being even, contradicting HCF(p,q) = 1",
      math:   "HCF(p,q) = 1  AND  2|p  AND  2|q  →  CONTRADICTION",
      result: "Our original assumption was false",
      pause:  "In proof by contradiction: if assuming X leads to a false statement, then X itself must be false.",
    },
    {
      what:   "Conclude √2 is irrational",
      why:    "The assumption that √2 is rational has been disproved by contradiction",
      math:   "Therefore √2 ∉ ℚ  →  √2 is irrational  ∎",
      result: "√2 is irrational — proven!",
      pause:  "The ∎ symbol means QED — quod erat demonstrandum, Latin for 'which was to be demonstrated.'",
    },
  ],

  confusionPoints: [
    "Why do we assume HCF(p,q) = 1? Because we can always simplify a fraction. If √2 = 6/4, we'd write it as 3/2. We start with the simplest form — if even that leads to contradiction, any other form will too.",
    "Why does p² even imply p even? Try: odd×odd=odd (3×3=9, 5×5=25). So if p² is even, p cannot be odd, therefore p must be even.",
    "Why is this a contradiction? We started with 'p and q have no common factor.' But we proved both are divisible by 2, meaning 2 IS a common factor. A statement and its opposite cannot both be true.",
  ],

  commonMistakes: [
    {
      mistake:      "Not stating HCF(p,q) = 1 at the start",
      whyItHappens: "Students skip the lowest-terms assumption, making the contradiction unclear",
      howToAvoid:   "Always write: 'Let √2 = p/q where HCF(p, q) = 1'. This is the key assumption.",
    },
    {
      mistake:      "Forgetting to prove 'p² even → p even' explicitly",
      whyItHappens: "It feels obvious, but examiners want the explicit reasoning",
      howToAvoid:   "Write: 'If p were odd, p² = (2k+1)² = 4k²+4k+1 which is odd. Since p² is even, p must be even.'",
    },
    {
      mistake:      "Stopping after showing p is even without continuing to q",
      whyItHappens: "Students think they've done enough. But showing only p is even is not yet a contradiction.",
      howToAvoid:   "Always continue to q. The contradiction only appears when BOTH p and q are even.",
    },
  ],

  examinerThinking: {
    whyAsked:      "Tests understanding of number theory, proof techniques, and logical reasoning — three skills examiners care about most in Class 10 mathematics.",
    conceptTested: "Proof by contradiction; properties of rational and irrational numbers; the lemma 'if n² is even then n is even'",
    topperInsight: "Top scorers write this proof in exactly 7 lines: assumption → squaring → p even → p=2m → substitute → q even → contradiction. No words wasted.",
    examTip:       "In a 3-mark question, you need: (1) the assumption with HCF=1, (2) the full algebraic chain, (3) the explicit contradiction statement. Missing any one costs a mark.",
    examTrap:      "The most common trap: proving p is even and stopping. You MUST continue to show q is even and then name the contradiction explicitly.",
  },

  finalAnswer: {
    answer:       "√2 is irrational. Proof: Assume √2 = p/q with HCF(p,q)=1. Then p²=2q², so p is even; write p=2m. Then 4m²=2q², so q²=2m², so q is even. But then HCF(p,q)≥2, contradicting HCF=1. ∴ √2 is irrational. ∎",
    whyCorrect:   "Every step follows from the previous by valid algebra and logic. The contradiction is genuine — a fully-reduced fraction cannot have both numerator and denominator divisible by 2.",
    verification: "Check: if √2 = p/q, then p² = 2q².\np=1 → p²=1, q²=0.5 — not integer ✗\np=2 → p²=4, q²=2, q=√2 — not integer ✗\np=3 → p²=9, q²=4.5 — not integer ✗\nNo integer solution exists. ✓",
  },

  simplerExample: {
    problem:  "Prove that √3 is irrational.",
    solution: "Assume √3 = p/q with HCF(p,q)=1. Then p²=3q². So 3|p², which means 3|p (if a prime divides n², it divides n). Write p=3m. Then 9m²=3q², so q²=3m², so 3|q. Both p and q divisible by 3, contradicting HCF(p,q)=1. ∴ √3 is irrational. ∎",
  },

  practiceQuestion: {
    question: "Prove that √5 is irrational.",
    hints: [
      "Assume √5 = p/q with HCF(p,q)=1 and derive p² = 5q²",
      "If 5|p², then 5|p — write p = 5m and substitute into the equation",
      "Show q is also divisible by 5, then state the explicit contradiction",
    ],
    solution: "Assume √5 = p/q, HCF(p,q)=1. Then p²=5q². So 5|p², meaning 5|p. Write p=5m. Then 25m²=5q², so q²=5m², so 5|q. Both p and q divisible by 5, contradicting HCF=1. ∴ √5 is irrational. ∎",
  },

  confidenceCheck: {
    question:     "In the proof that √2 is irrational, why do we need HCF(p, q) = 1?",
    options: [
      "To make the fraction look nice",
      "So the contradiction is genuine — a reduced fraction cannot have both parts even",
      "To ensure q ≠ 0",
      "So that p² = 2q² holds",
    ],
    correctIndex: 1,
    explanation:  "If we don't specify HCF(p,q)=1, someone could say 'OK both are even, just simplify'. By starting with the fully reduced fraction, we show even the simplest form leads to contradiction — proving no fraction can equal √2.",
  },

  retrievalPractice: [
    "What is the very first assumption we make in the proof that √2 is irrational?",
    "What does it mean for two numbers to be coprime?",
    "Why does p² being even imply p is even?",
    "After writing p = 2m and substituting into p² = 2q², what equation do we get for q²?",
    "State the contradiction in one sentence.",
  ],

  rememberThese: [
    "Proof by contradiction: assume opposite → derive nonsense → conclude original is true",
    "If p² is even, then p is even — the key lemma for ALL irrational number proofs",
    "Always start with HCF(p,q) = 1 (fraction in lowest terms)",
    "The contradiction: both p and q divisible by 2, but we said HCF = 1",
  ],

  confidenceBuilder: "You just understood one of the most beautiful proofs in all of mathematics — the same one that shocked the ancient Greeks when Hippassus of Metapontum discovered it 2,500 years ago.\n\nEvery year, thousands of Class 10 students get full marks on this question. The proof has exactly 6 logical steps. You know all 6. You can write this from memory.",
};

router.get("/devLesson", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ error: "not_found" });
    return;
  }
  res.json(FIXTURE);
});

export default router;
