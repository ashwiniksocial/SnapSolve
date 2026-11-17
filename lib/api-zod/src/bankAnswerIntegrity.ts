export type BankAnswerComparison =
  | { status: "match"; method: "normalized" | "choice" | "rational" }
  | { status: "mismatch"; method: "choice" | "rational" }
  | { status: "indeterminate"; method: "unsupported" };

interface RationalAnswer {
  numerator: bigint;
  denominator: bigint;
  unit: string;
}

interface ChoiceAnswer {
  letter: string;
  body: string;
}

const superscripts: Record<string, string> = {
  "⁰": "^0",
  "¹": "^1",
  "²": "^2",
  "³": "^3",
  "⁴": "^4",
  "⁵": "^5",
  "⁶": "^6",
  "⁷": "^7",
  "⁸": "^8",
  "⁹": "^9",
  "⁻": "^-",
};

function stripRedundantOuterParentheses(value: string): string {
  let result = value;
  while (result.startsWith("(") && result.endsWith(")")) {
    let depth = 0;
    let enclosesWholeValue = true;
    for (let index = 0; index < result.length; index += 1) {
      if (result[index] === "(") depth += 1;
      if (result[index] === ")") depth -= 1;
      if (depth === 0 && index < result.length - 1) {
        enclosesWholeValue = false;
        break;
      }
    }
    if (!enclosesWholeValue || depth !== 0) break;
    result = result.slice(1, -1).trim();
  }
  return result;
}

function normalizeAnswer(value: string): string {
  const normalized = value
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, (character) => superscripts[character] ?? character)
    .normalize("NFKC")
    .replace(/\\(?:left|right|displaystyle|textstyle)\b/g, "")
    .replace(/\\(?:times|cdot)\b/g, "*")
    .replace(/\\div\b/g, "/")
    .replace(/\\pi\b/gi, "pi")
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)")
    .replace(/√\s*(\([^()]*\)|[a-z0-9]+)/gi, "sqrt($1)")
    .replace(/\\(?:d?frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_whole, numerator: string, denominator: string) => {
      const left = /^[a-z0-9]+$/i.test(numerator) ? numerator : `(${numerator})`;
      const right = /^[a-z0-9]+$/i.test(denominator) ? denominator : `(${denominator})`;
      return `${left}/${right}`;
    })
    .replace(/\\text\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\(?:,|;|!|quad|qquad)\s*/g, " ")
    .replace(/\\[()[\]]/g, "")
    .replace(/[$]/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/[×·⋅]/g, "*")
    .replace(/÷/g, "/")
    .replace(/⁄/g, "/")
    .replace(/π/g, "pi")
    .trim()
    .toLowerCase()
    .replace(/^(?:(?:the\s+)?final\s+answer|(?:the\s+)?answer)(?::\s*|\s+is\s*:?\s*)/, "")
    .replace(/^(?:therefore|thus|so)\s*[,;:]\s*/, "")
    .replace(/[.!?,;:]+$/, "")
    .replace(/\s*([=+\-*/^<>])\s*/g, "$1")
    .replace(/\s*,\s*/g, ",")
    .replace(/\s+/g, " ")
    .trim();
  return stripRedundantOuterParentheses(normalized);
}

function parseChoice(value: string): ChoiceAnswer | null {
  const patterns: RegExp[] = [
    /^(?:option\s+)?\(\s*([a-d])\s*\)\s*(.*)$/i,
    /^option\s+([a-d])\s*[:.)-]\s*(.*)$/i,
    /^([a-d])\.\s+(.+)$/i,
    /^([a-d])\)\s*(.*)$/i,
    /^([a-d])$/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return { letter: match[1].toLowerCase(), body: (match[2] ?? "").trim() };
  }
  return null;
}

function decimalRational(value: string): { numerator: bigint; denominator: bigint } | null {
  if (value.length > 64) return null;
  const match = value.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))$/);
  if (!match) return null;

  const sign = match[1] === "-" ? -1n : 1n;
  const whole = match[2] ?? "0";
  const fraction = match[3] ?? match[4] ?? "";
  const denominator = 10n ** BigInt(fraction.length);
  const numerator = BigInt(`${whole}${fraction}` || "0") * sign;
  return { numerator, denominator };
}

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left || 1n;
}

function parseRational(value: string): RationalAnswer | null {
  const match = value.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\/([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?\s*([a-z°][a-z0-9°^/]*|%)?$/i,
  );
  if (!match) return null;

  const left = decimalRational(match[1]);
  const right = match[2] ? decimalRational(match[2]) : { numerator: 1n, denominator: 1n };
  if (!left || !right || right.numerator === 0n) return null;

  let numerator = left.numerator * right.denominator;
  let denominator = left.denominator * right.numerator;
  if (denominator < 0n) {
    numerator *= -1n;
    denominator *= -1n;
  }

  let unit = (match[3] ?? "").toLowerCase();
  if (unit === "%") {
    denominator *= 100n;
    unit = "";
  }
  const divisor = gcd(numerator, denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
    unit,
  };
}

function compareNormalizedValues(left: string, right: string): BankAnswerComparison {
  if (left === right) return { status: "match", method: "normalized" };

  const leftRational = parseRational(left);
  const rightRational = parseRational(right);
  if (!leftRational || !rightRational || leftRational.unit !== rightRational.unit) {
    return { status: "indeterminate", method: "unsupported" };
  }

  return leftRational.numerator * rightRational.denominator ===
    rightRational.numerator * leftRational.denominator
    ? { status: "match", method: "rational" }
    : { status: "mismatch", method: "rational" };
}

/**
 * Conservatively compares a generated answer with the frozen bank answer.
 * It proves matches only for formatting-normalized text, explicit MCQ choices,
 * and exact rational scalars (including simple fractions and percentages).
 * Unhandled symbolic or prose differences are indeterminate, never guessed.
 */
export function compareBankAnswers(candidate: string, canonical: string): BankAnswerComparison {
  if (typeof candidate !== "string" || typeof canonical !== "string") {
    return { status: "indeterminate", method: "unsupported" };
  }

  const normalizedCandidate = normalizeAnswer(candidate);
  const normalizedCanonical = normalizeAnswer(canonical);
  if (!normalizedCandidate || !normalizedCanonical) {
    return { status: "indeterminate", method: "unsupported" };
  }

  if (normalizedCandidate === normalizedCanonical) {
    return { status: "match", method: "normalized" };
  }

  const candidateChoice = parseChoice(normalizedCandidate);
  const canonicalChoice = parseChoice(normalizedCanonical);

  if (candidateChoice && canonicalChoice) {
    if (candidateChoice.letter !== canonicalChoice.letter) {
      return { status: "mismatch", method: "choice" };
    }
    if (!candidateChoice.body || !canonicalChoice.body) {
      return { status: "match", method: "choice" };
    }
    const bodyComparison = compareNormalizedValues(candidateChoice.body, canonicalChoice.body);
    return bodyComparison.status === "match"
      ? { ...bodyComparison, method: "choice" }
      : bodyComparison;
  }

  if (candidateChoice) {
    if (!candidateChoice.body) {
      return { status: "indeterminate", method: "unsupported" };
    }
    return compareNormalizedValues(candidateChoice.body, normalizedCanonical);
  }

  if (canonicalChoice) {
    if (!canonicalChoice.body) {
      return { status: "indeterminate", method: "unsupported" };
    }
    return compareNormalizedValues(normalizedCandidate, canonicalChoice.body);
  }

  return compareNormalizedValues(normalizedCandidate, normalizedCanonical);
}

/**
 * Cache/static assets are reusable only when they match the exact source
 * revision as well as a deterministically verified canonical answer.
 */
export function isBankLessonAnswerSafe(
  candidate: string,
  canonical: string,
  candidateSourceHash: string | undefined,
  expectedSourceHash: string | undefined,
): boolean {
  return Boolean(candidateSourceHash) &&
    Boolean(expectedSourceHash) &&
    candidateSourceHash === expectedSourceHash &&
    compareBankAnswers(candidate, canonical).status === "match";
}
