export type BankAnswerComparison =
  | { status: "match"; method: "normalized" | "choice" | "rational" | "multipart" | "polynomial" }
  | { status: "mismatch"; method: "choice" | "rational" | "multipart" | "polynomial" }
  | { status: "indeterminate"; method: "unsupported" };

export interface BankAnswerFormatAssessment {
  format: "missing" | "choice" | "multipart" | "rational" | "polynomial" | "exact-text-only";
  support: "missing" | "structured" | "partial" | "exact-only";
  reason: string;
}

export type AnswerLastAssessment =
  | { status: "clear" }
  // offendingText is transient diagnostic context. Callers must not persist or
  // include it in request logs or student-facing error responses.
  | { status: "leak"; section: string; disclosure: string; reason: string; offendingText?: string }
  | { status: "review"; section: string; disclosure: string; reason: string; offendingText?: string };

export interface AnswerLastContext {
  canonicalQuestion?: string;
  intermediateText?: readonly string[];
  approvedCalculationText?: readonly string[];
}

export interface AnswerLastRepairResult {
  status: "clear" | "repaired" | "rejected";
  lesson: unknown;
  assessment: AnswerLastAssessment;
  initialAssessment?: AnswerLastAssessment;
  repairCount: number;
  reason?: string;
}

interface AnswerLastLesson {
  topic?: unknown;
  difficulty?: unknown;
  keyConcepts?: unknown;
  beforeWeStart?: unknown;
  prerequisites?: unknown;
  vocabulary?: unknown;
  intuition?: unknown;
  questionTranslation?: unknown;
  teacherThinking?: unknown;
  guidedReasoning?: unknown;
  confusionPoints?: unknown;
  commonMistakes?: unknown;
  examinerThinking?: unknown;
  finalAnswer?: { answer?: unknown };
}

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
  const match = value.match(/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:e([+-]?\d+))?$/i);
  if (!match) return null;

  const sign = match[1] === "-" ? -1n : 1n;
  const whole = match[2] ?? "0";
  const fraction = match[3] ?? match[4] ?? "";
  const exponent = BigInt(match[5] ?? "0");
  if (exponent > 128n || exponent < -128n) return null;
  let denominator = 10n ** BigInt(fraction.length);
  let numerator = BigInt(`${whole}${fraction}` || "0") * sign;
  if (exponent > 0n) numerator *= 10n ** exponent;
  else if (exponent < 0n) denominator *= 10n ** -exponent;
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
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)(?:\/([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?))?\s*([a-z°][a-z0-9°^/]*|%)?$/i,
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

type Polynomial = Map<string, bigint>;

function monomialKey(variables: Map<string, number>): string {
  const parts = [...variables.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([variable, power]) => power === 1 ? variable : `${variable}^${power}`);
  return parts.join("*") || "1";
}

function parsePolynomialTerm(value: string): { key: string; coefficient: bigint } | null {
  let term = value.replace(/\s+/g, "");
  if (!term) return null;

  let sign = 1n;
  if (term[0] === "+" || term[0] === "-") {
    if (term[0] === "-") sign = -1n;
    term = term.slice(1);
  }
  if (!term) return null;

  const coefficientMatch = term.match(/^\d+/);
  const coefficientText = coefficientMatch?.[0] ?? "";
  if (coefficientText.length > 24) return null;
  let coefficient = BigInt(coefficientText || "1") * sign;
  term = term.slice(coefficientText.length);

  if (!term) return { key: "1", coefficient };
  if (term.endsWith("*")) return null;

  const variables = new Map<string, number>();
  while (term) {
    if (term[0] === "*") term = term.slice(1);
    const match = term.match(/^([a-z])(?:\^(\d+))?/i);
    if (!match) return null;

    const variable = match[1].toLowerCase();
    const powerText = match[2] ?? "1";
    if (powerText.length > 2) return null;
    const power = Number(powerText);
    if (!Number.isInteger(power) || power < 0 || power > 16) return null;
    variables.set(variable, (variables.get(variable) ?? 0) + power);
    term = term.slice(match[0].length);

    // Adjacent letters can be a multi-character name or prose, not a proven
    // multiplication. Require an explicit * between variable factors.
    if (term && /^[a-z]/i.test(term)) return null;
  }

  return { key: monomialKey(variables), coefficient };
}

function parseExpandedPolynomial(value: string): Polynomial | null {
  const expression = stripRedundantOuterParentheses(value).replace(/\s+/g, "");
  if (
    !expression ||
    expression.length > 128 ||
    /[(),=<>]/.test(expression) ||
    /\d+e[+-]?\d+/i.test(expression)
  ) {
    return null;
  }

  const terms: string[] = [];
  let start = 0;
  for (let index = 1; index < expression.length; index += 1) {
    const character = expression[index];
    if (character === "+" || character === "-") {
      if (expression[index - 1] === "^") return null;
      terms.push(expression.slice(start, index));
      start = index;
    }
  }
  terms.push(expression.slice(start));
  if (terms.length > 32) return null;

  const polynomial: Polynomial = new Map();
  for (const term of terms) {
    const parsed = parsePolynomialTerm(term);
    if (!parsed) return null;
    polynomial.set(parsed.key, (polynomial.get(parsed.key) ?? 0n) + parsed.coefficient);
  }
  for (const [key, coefficient] of polynomial) {
    if (coefficient === 0n) polynomial.delete(key);
  }
  return polynomial;
}

function multiplyMonomialKeys(left: string, right: string): string | null {
  const powers = new Map<string, number>();
  for (const key of [left, right]) {
    if (key === "1") continue;
    for (const part of key.split("*")) {
      const match = part.match(/^([a-z])(?:\^(\d+))?$/i);
      if (!match) return null;
      const variable = match[1].toLowerCase();
      const power = Number(match[2] ?? "1");
      const combined = (powers.get(variable) ?? 0) + power;
      if (combined > 16) return null;
      powers.set(variable, combined);
    }
  }
  return monomialKey(powers);
}

function multiplyPolynomials(left: Polynomial, right: Polynomial): Polynomial | null {
  const product: Polynomial = new Map();
  for (const [leftKey, leftCoefficient] of left) {
    for (const [rightKey, rightCoefficient] of right) {
      const key = multiplyMonomialKeys(leftKey, rightKey);
      if (!key) return null;
      product.set(key, (product.get(key) ?? 0n) + leftCoefficient * rightCoefficient);
      if (product.size > 32) return null;
    }
  }
  for (const [key, coefficient] of product) {
    if (coefficient === 0n) product.delete(key);
  }
  return product;
}

/**
 * Intentionally small exact subset: sums/products of integer monomials and a
 * product of two binomials. Unsupported algebra stays indeterminate.
 */
function parseSupportedPolynomial(value: string): Polynomial | null {
  const expression = stripRedundantOuterParentheses(value);
  const expanded = parseExpandedPolynomial(expression);
  if (expanded) return expanded;

  const factors = expression.match(/^\(([^()]+)\)\s*\*?\s*\(([^()]+)\)$/);
  if (!factors) return null;
  const left = parseExpandedPolynomial(factors[1]);
  const right = parseExpandedPolynomial(factors[2]);
  if (!left || !right || left.size !== 2 || right.size !== 2) return null;
  return multiplyPolynomials(left, right);
}

function compareNormalizedValues(left: string, right: string): BankAnswerComparison {
  if (left === right) return { status: "match", method: "normalized" };

  const leftRational = parseRational(left);
  const rightRational = parseRational(right);
  if (leftRational && rightRational && leftRational.unit === rightRational.unit) {
    return leftRational.numerator * rightRational.denominator ===
      rightRational.numerator * leftRational.denominator
      ? { status: "match", method: "rational" }
      : { status: "mismatch", method: "rational" };
  }

  const leftPolynomial = parseSupportedPolynomial(left);
  const rightPolynomial = parseSupportedPolynomial(right);
  if (leftPolynomial && rightPolynomial) {
    const same =
      leftPolynomial.size === rightPolynomial.size &&
      [...leftPolynomial].every(([key, coefficient]) => rightPolynomial.get(key) === coefficient);
    return same
      ? { status: "match", method: "polynomial" }
      : { status: "mismatch", method: "polynomial" };
  }
  return { status: "indeterminate", method: "unsupported" };
}

function parseAnswerAssignment(value: string): { left: string; right: string } | null {
  const equalityIndex = value.indexOf("=");
  if (equalityIndex >= 0) {
    if (
      value.indexOf("=", equalityIndex + 1) >= 0 ||
      ["<", ">", "!"].includes(value[equalityIndex - 1] ?? "")
    ) {
      return null;
    }
    const left = value.slice(0, equalityIndex).trim();
    const right = value.slice(equalityIndex + 1).trim();
    return left && right ? { left, right } : null;
  }

  const prose = value.match(/^(.+?)\s+(?:is\s+equal\s+to|equals?|is)\s+(.+)$/i);
  return prose && prose[1].trim() && prose[2].trim()
    ? { left: prose[1].trim(), right: prose[2].trim() }
    : null;
}

function parseLabeledParts(value: string): Map<string, string> | null {
  const labelPattern = /\(\s*([a-h]|[ivxlcdm]+)\s*\)\s*/gi;
  const matches = [...value.matchAll(labelPattern)];
  if (matches.length === 0 || matches.length > 8) return null;

  const firstIndex = matches[0].index ?? 0;
  const prefix = value.slice(0, firstIndex).trim().replace(/[:;,.\s]+$/, "").trim();
  if (
    prefix &&
    !/^(?:(?:the\s+)?(?:final\s+)?answers?)(?:\s+(?:are|is))?$|^(?:the\s+)?values\s+are$/i.test(prefix)
  ) {
    return null;
  }

  const parts = new Map<string, string>();
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const label = current[1].toLowerCase();
    const contentStart = (current.index ?? 0) + current[0].length;
    const contentEnd = index + 1 < matches.length
      ? matches[index + 1].index ?? value.length
      : value.length;
    const part = value
      .slice(contentStart, contentEnd)
      .trim()
      .replace(/[;,]+\s*$/, "")
      .replace(/\s+(?:and|while|&)\s*$/i, "")
      .replace(/[;,]+\s*$/, "")
      .trim();
    if (!part || parts.has(label)) return null;
    parts.set(label, part);
  }
  return parts;
}

function compareMultipartPart(candidate: string, canonical: string): BankAnswerComparison {
  const canonicalAssignment = parseAnswerAssignment(canonical);
  const candidateAssignment = parseAnswerAssignment(candidate);

  if (canonicalAssignment) {
    if (!candidateAssignment) {
      return compareNormalizedValues(candidate, canonicalAssignment.right);
    }
    const leftComparison = compareNormalizedValues(candidateAssignment.left, canonicalAssignment.left);
    if (leftComparison.status !== "match") {
      // A different left side could be a reversed or unsupported equivalent
      // equation. Do not call it correct or wrong without a complete proof.
      return { status: "indeterminate", method: "unsupported" };
    }
    return compareNormalizedValues(candidateAssignment.right, canonicalAssignment.right);
  }

  if (candidateAssignment) return { status: "indeterminate", method: "unsupported" };
  return compareNormalizedValues(candidate, canonical);
}

function compareMultipartAnswers(candidate: string, canonical: string): BankAnswerComparison | null {
  const canonicalParts = parseLabeledParts(canonical);
  if (!canonicalParts || canonicalParts.size < 2) return null;

  const candidateParts = parseLabeledParts(candidate);
  if (!candidateParts) return { status: "indeterminate", method: "unsupported" };
  if (
    candidateParts.size !== canonicalParts.size ||
    [...canonicalParts.keys()].some((label) => !candidateParts.has(label))
  ) {
    return { status: "mismatch", method: "multipart" };
  }

  for (const [label, canonicalPart] of canonicalParts) {
    const comparison = compareMultipartPart(candidateParts.get(label)!, canonicalPart);
    if (comparison.status === "mismatch") return { status: "mismatch", method: "multipart" };
    if (comparison.status === "indeterminate") return comparison;
  }
  return { status: "match", method: "multipart" };
}

/**
 * Describes which existing deterministic comparison rules can inspect a
 * canonical answer's format. This is an inventory aid, not an academic review.
 */
export function classifyBankAnswerFormat(answer: string): BankAnswerFormatAssessment {
  if (typeof answer !== "string" || !answer.trim()) {
    return {
      format: "missing",
      support: "missing",
      reason: "No canonical answer text is present.",
    };
  }

  const normalized = normalizeAnswer(answer);
  const choice = parseChoice(normalized);
  if (choice) {
    return {
      format: "choice",
      support: "structured",
      reason: "Explicit option labels and answer text can be checked without guessing.",
    };
  }

  const parts = parseLabeledParts(normalized);
  if (parts && parts.size > 1) {
    const parsedParts = [...parts.values()].map((part) => {
      const assignment = parseAnswerAssignment(part);
      if (!assignment) {
        return {
          structured: Boolean(parseRational(part) || parseSupportedPolynomial(part)),
          partiallyStructured: false,
        };
      }
      const rightIsSupported = Boolean(
        parseRational(assignment.right) || parseSupportedPolynomial(assignment.right)
      );
      return {
        structured:
          rightIsSupported &&
          Boolean(parseSupportedPolynomial(assignment.left) || parseRational(assignment.left)),
        partiallyStructured: rightIsSupported,
      };
    });
    const allStructured = parsedParts.every((part) => part.structured);
    const allAtLeastPartial = parsedParts.every(
      (part) => part.structured || part.partiallyStructured
    );
    return {
      format: "multipart",
      support: allStructured ? "structured" : allAtLeastPartial ? "partial" : "exact-only",
      reason: allStructured
        ? "All labeled parts have deterministic numeric or restricted-polynomial structure."
        : allAtLeastPartial
          ? "Every part has a checkable value; some symbolic left sides are verified only by exact text."
          : "Part boundaries are visible, but at least one part is outside the supported exact subset.",
    };
  }
  if (parts) {
    return {
      format: "multipart",
      support: "exact-only",
      reason: "A labeled answer is present, but a complete multi-part mapping is not established.",
    };
  }

  if (parseRational(normalized)) {
    return {
      format: "rational",
      support: "structured",
      reason: "Exact rational arithmetic is supported; unit conversion is not inferred.",
    };
  }
  if (parseSupportedPolynomial(normalized)) {
    return {
      format: "polynomial",
      support: "structured",
      reason: "The expression is within the bounded exact integer-polynomial subset.",
    };
  }
  return {
    format: "exact-text-only",
    support: "exact-only",
    reason: "Only formatting-normalized text equality is established; alternatives remain unverified.",
  };
}

/**
 * Conservatively compares a generated answer with the frozen bank answer.
 * It proves matches only for formatting-normalized text, explicit MCQ choices,
 * exact rational scalars, fully mapped multipart values, and a bounded exact
 * integer-polynomial subset. Other symbolic or prose differences stay unknown.
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

  const multipartComparison = compareMultipartAnswers(normalizedCandidate, normalizedCanonical);
  if (multipartComparison) return multipartComparison;

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

const ANSWER_STOP_WORDS = new Set([
  "a", "an", "and", "as", "at", "be", "by", "for", "from", "in", "into",
  "is", "it", "of", "on", "or", "the", "to", "was", "were", "with",
]);

const NUMBER_WORDS: Readonly<Record<string, string>> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  eleven: "11", twelve: "12", thirteen: "13", fourteen: "14",
  fifteen: "15", sixteen: "16", seventeen: "17", eighteen: "18",
  nineteen: "19", twenty: "20",
};

const ANSWER_SYNONYM_GROUPS = [
  ["coordinate plane", "xy plane", "plane of coordinates"],
] as const;

const ANSWER_UNIT_WORDS = new Set([
  "ampere", "amperes", "centimeter", "centimeters", "cm", "degree", "degrees",
  "dollar", "dollars", "gram", "grams", "g", "hour", "hours", "hr", "hrs",
  "joule", "joules", "kg", "kilogram", "kilograms", "km", "kilometer",
  "kilometers", "liter", "liters", "litre", "litres", "m", "meter", "meters",
  "metre", "metres", "mg", "milligram", "milligrams", "milliliter",
  "milliliters", "millilitre", "millilitres", "minute", "minutes", "ml",
  "mm", "millimeter", "millimeters", "month", "months", "mol", "mole", "moles",
  "newton", "newtons", "n", "pascal", "pascals", "pa", "percent", "percentage",
  "person", "people", "point", "points", "rupee", "rupees", "second", "seconds",
  "sec", "secs", "species", "student", "students", "year", "years", "°c", "°f",
]);

function normalizeSpelledQuantities(value: string): string {
  const wordPattern = new RegExp(`\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`, "gi");
  return value.replace(wordPattern, (word, _capture, offset: number, source: string) => {
    const tail = source.slice(offset + word.length, offset + word.length + 32);
    return /\b(?:to\s+(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\s+)?(?:thousand|million|billion|trillion|species|students?|people|years?|meters?|metres?|kilometers?|kilometres?|centimeters?|centimetres?|degrees?|points?|items?|apples?)\b/i.test(tail)
      ? NUMBER_WORDS[word.toLowerCase()] ?? word
      : word;
  });
}

function normalizeAnswerLastText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, " square root of $1 ")
    .replace(/√\s*(\([^()]*\)|[\p{L}\p{N}]+)/gu, " square root of $1 ")
    .replace(/\bsquare\s+root\s+of\b/g, " square root ")
    .replace(/\bplane\s+of\s+coordinates\b/g, " coordinate plane ")
    .replace(/\bxy[\s-]*plane\b/g, " xy plane ")
    .replace(/[−–—]/g, "-")
    .replace(/,/g, "")
    .replace(/[^\p{L}\p{N}%°.+*/=-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenAnswerLastText(value: unknown, prefix: string, result: Array<{ section: string; text: string }>): void {
  if (typeof value === "string") {
    if (value.trim()) result.push({ section: prefix, text: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenAnswerLastText(item, `${prefix}[${index + 1}]`, result));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      flattenAnswerLastText(child, `${prefix}.${key}`, result);
    }
  }
}

function precedingAnswerSections(lesson: AnswerLastLesson): Array<{ section: string; text: string }> {
  const result: Array<{ section: string; text: string }> = [];
  const fields: Array<[string, unknown]> = [
    ["topic", lesson.topic],
    ["difficulty", lesson.difficulty],
    ["keyConcepts", lesson.keyConcepts],
    ["beforeWeStart", lesson.beforeWeStart],
    ["prerequisites", lesson.prerequisites],
    ["vocabulary", lesson.vocabulary],
    ["intuition", lesson.intuition],
    ["questionTranslation", lesson.questionTranslation],
    ["teacherThinking", lesson.teacherThinking],
    ["guidedReasoning", lesson.guidedReasoning],
    ["confusionPoints", lesson.confusionPoints],
    ["commonMistakes", lesson.commonMistakes],
    ["examinerThinking", lesson.examinerThinking],
  ];
  for (const [name, value] of fields) flattenAnswerLastText(value, name, result);
  return result;
}

function answerPhraseCandidates(answer: string): string[] {
  const candidates = new Set<string>();
  const normalizedAnswer = normalizeAnswerLastText(answer);
  if (normalizedAnswer) candidates.add(normalizedAnswer);
  const rationalAnswer = parseRational(normalizeAnswer(answer));
  if (rationalAnswer) {
    let remainingDenominator = rationalAnswer.denominator;
    while (remainingDenominator % 2n === 0n) remainingDenominator /= 2n;
    while (remainingDenominator % 5n === 0n) remainingDenominator /= 5n;
    const numerator = Number(rationalAnswer.numerator);
    const denominator = Number(rationalAnswer.denominator);
    const decimal = numerator / denominator;
    if (
      remainingDenominator === 1n &&
      Number.isFinite(decimal) &&
      Number.isSafeInteger(numerator) &&
      Number.isSafeInteger(denominator)
    ) {
      candidates.add(normalizeAnswerLastText(`${decimal} ${rationalAnswer.unit}`));
    }
  }
  const choice = answer.match(/^\s*(?:option\s+)?\(?([a-d])\)?\s*[:.)-]\s*(.+)$/i);
  if (choice) {
    candidates.add(`option ${choice[1]}`);
    const choiceValue = normalizeAnswerLastText(choice[2]);
    if (choiceValue) candidates.add(choiceValue);
  }

  const equivalencePatterns = [
    /\b(?:also\s+)?called\s+(?:the|a|an)?\s*([^.!?;]+)/gi,
    /\bknown\s+as\s+(?:the|a|an)?\s*([^.!?;]+)/gi,
    /\breferred\s+to\s+as\s+(?:the|a|an)?\s*([^.!?;]+)/gi,
    /\bdefined\s+as\s+([^.!?;]+)/gi,
    /\b(?:means|refers\s+to)\s+([^.!?;]+)/gi,
  ];
  for (const pattern of equivalencePatterns) {
    for (const match of answer.matchAll(pattern)) {
      for (const alternative of (match[1] ?? "").split(/\s+(?:or|and)\s+/i)) {
        const candidate = normalizeAnswerLastText(alternative)
          .replace(/^(?:the|a|an)\s+/, "")
          .trim();
        if (candidate) candidates.add(candidate);
      }
    }
  }

  for (const group of ANSWER_SYNONYM_GROUPS) {
    const normalizedGroup = group.map(normalizeAnswerLastText);
    if (normalizedGroup.some((alias) => candidates.has(alias))) {
      normalizedGroup.forEach((alias) => candidates.add(alias));
    }
  }
  return [...candidates].filter((candidate) => candidate.length > 0);
}

interface NumericAnswerCandidate {
  display: string;
  normalizedValue: string;
  strongUnit: boolean;
  conciseAnswer: boolean;
}

function canonicalNumber(value: string, scaleWord?: string): string | null {
  const parsed = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(parsed)) return null;
  const scale = scaleWord?.toLowerCase();
  const multiplier = scale === "thousand" ? 1e3
    : scale === "million" ? 1e6
      : scale === "billion" ? 1e9
        : scale === "trillion" ? 1e12
          : 1;
  const scaled = parsed * multiplier;
  return Number.isFinite(scaled) ? String(Number(scaled.toPrecision(12))) : null;
}

function numericAnswerCandidates(
  answer: string,
  includeUncuedContextNumbers = false,
): NumericAnswerCandidate[] {
  const candidates: NumericAnswerCandidate[] = [];
  const normalizedAnswer = normalizeAnswerLastText(answer);
  const conciseAnswer = normalizedAnswer.split(" ").length <= 6 &&
    !/[√=^+*/]|\\sqrt|[a-z]\s*\(/i.test(answer);
  const normalizedForNumbers = normalizeSpelledQuantities(answer.normalize("NFKC"));
  const pattern = /(?<![\p{L}\p{N}])([+-]?\d[\d,]*(?:\.\d+)?)(?:\s*(?:to|[-–—])\s*([+-]?\d[\d,]*(?:\.\d+)?))?(?:\s*(thousand|million|billion|trillion))?(?:\s+([a-z°%]+))?/giu;
  for (const match of normalizedForNumbers.matchAll(pattern)) {
    const first = match[1];
    const second = match[2];
    const scale = match[3];
    const unit = match[4]?.toLowerCase();
    const firstValue = canonicalNumber(first, scale);
    const secondValue = second ? canonicalNumber(second, scale) : null;
    if (!firstValue) continue;

    const strongUnit = Boolean(scale || (unit && ANSWER_UNIT_WORDS.has(unit)));
    const beforeNumber = normalizedForNumbers.slice(Math.max(0, (match.index ?? 0) - 48), match.index ?? 0);
    const answerCue = /\b(?:answer|therefore|thus|hence|final\s+result|we\s+get|equals?|is)\b[^.!?;]*$/i.test(beforeNumber);
    if (!includeUncuedContextNumbers && !strongUnit && !conciseAnswer && !answerCue) continue;

    const normalizedValue = [
      firstValue,
      ...(secondValue ? [secondValue] : []),
      unit && ANSWER_UNIT_WORDS.has(unit) ? unit.replace(/s$/, "") : "",
    ].filter(Boolean).join("..");
    const display = match[0].trim();
    if (!candidates.some((candidate) => candidate.normalizedValue === normalizedValue)) {
      candidates.push({ display, normalizedValue, strongUnit, conciseAnswer });
    }
  }
  return candidates;
}

function phraseTokens(value: string): string[] {
  return normalizeAnswerLastText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !ANSWER_STOP_WORDS.has(token));
}

function quantityMatches(value: string, candidate: NumericAnswerCandidate): boolean {
  return numericAnswerCandidates(value).some(
    (match) => match.normalizedValue === candidate.normalizedValue,
  );
}

function hasAnswerCue(text: string, candidate: string): boolean {
  const normalized = normalizeAnswerLastText(text);
  const value = normalizeAnswerLastText(candidate);
  const index = normalized.indexOf(value);
  if (index < 0) return false;
  const nearby = normalized.slice(Math.max(0, index - 48), Math.min(normalized.length, index + value.length + 12));
  return /\b(?:answer|therefore|thus|hence|final\s+result|we\s+get|equals?|is)\b/.test(nearby);
}

function hasExplicitAnswerCue(text: string, candidate: string): boolean {
  const normalized = normalizeAnswerLastText(text);
  const value = normalizeAnswerLastText(candidate);
  if (!value) return false;
  let index = normalized.indexOf(value);
  while (index >= 0) {
    const end = index + value.length;
    const before = index > 0 ? normalized[index - 1] : "";
    const after = end < normalized.length ? normalized[end] : "";
    const wholePhrase =
      (!before || !/[\p{L}\p{N}]/u.test(before)) &&
      (!after || !/[\p{L}\p{N}]/u.test(after));
    if (wholePhrase) {
      const nearby = normalized.slice(
        Math.max(0, index - 56),
        Math.min(normalized.length, end + 48),
      );
      const givenContext =
        /\b(?:intermediate|temporary|given|known)\b/.test(nearby) &&
        !/\bfinal\s+(?:answer|result|value)\b/.test(nearby);
      if (
        !givenContext &&
        /\b(?:answer|(?:correct|irrational|right|valid)\s+(?:option|choice|answer)|option\s+[a-d]\s+(?:is|contains|shows)|therefore|thus|hence|so\s+(?:this|that)\s+(?:gives|means|shows|proves)|(?:this|that)\s+(?:gives|means|shows|proves)|we\s+(?:get|find|calculate|compute|determine|solve|obtain)|(?:we\s+are\s+)?asked\s+to\s+(?:find|identify|calculate|compute|determine|solve)|asking\s+us\s+to\s+(?:find|identify|calculate|compute|determine|solve)|final\s+(?:(?:numeric(?:al)?)\s+)?(?:result|value)|(?:required|target)\s+(?:result|value|answer|option|choice)|result\s+(?:is|becomes|equals?|comes\s+to))\b/.test(nearby)
      ) {
        return true;
      }
    }
    index = normalized.indexOf(value, index + 1);
  }
  return false;
}

function answerLastContextTexts(context?: AnswerLastContext): string[] {
  return [
    context?.canonicalQuestion,
    ...(context?.intermediateText ?? []),
  ].filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}

function normalizeCalculationText(value: string): string {
  const withoutLatexWrappers = value.replace(
    /\\(?:mathrm|operatorname|text)\s*\{([^{}]*)\}/gi,
    "$1",
  );
  return normalizeAnswer(withoutLatexWrappers).replace(/\s+/g, "");
}

function calculationSignature(value: string): string | null {
  const normalized = normalizeCalculationText(value);
  const equalsIndex = normalized.lastIndexOf("=");
  if (equalsIndex <= 0 || equalsIndex === normalized.length - 1) return null;

  const priorEqualsIndex = normalized.lastIndexOf("=", equalsIndex - 1);
  const left = normalized.slice(priorEqualsIndex + 1, equalsIndex);
  const right = normalized.slice(equalsIndex + 1);
  if (
    !/\d/.test(left) ||
    !/\d/.test(right) ||
    !/[+*/-]/.test(left)
  ) {
    return null;
  }
  return `${left}=${right}`;
}

function calculationExpressionParts(value: string): string[] {
  return normalizeCalculationText(value)
    .split("=")
    .map((part) => part.trim())
    .filter((part) => /\d/.test(part) && /[+*/-]/.test(part));
}

function isSupportedCalculationAssignment(
  text: string,
  approvedCalculations: readonly string[],
): boolean {
  const parts = normalizeCalculationText(text).split("=");
  if (parts.length !== 2) return false;
  const [label, expression] = parts;
  if (
    /\d/.test(label) ||
    !/^[a-z\s]+$/.test(label) ||
    !/\d/.test(expression) ||
    !/[+*/-]/.test(expression)
  ) {
    return false;
  }
  return approvedCalculations.some((calculation) =>
    calculationExpressionParts(calculation).includes(expression)
  );
}

function guidedReasoningField(section: string): boolean {
  return /^guidedReasoning\[\d+\]\.[\w]+$/.test(section);
}

function isExplicitAnswerAnnouncement(text: string, answer: string): boolean {
  const normalized = normalizeAnswerLastText(text);
  if (
    /\b(?:final\s+(?:(?:numeric(?:al)?)\s+)?(?:answer|result|value)|correct\s+answer|answer)\b[^.!?;]{0,80}(?:\bis\b|\bequals?\b|:|=)/i.test(normalized) ||
    /\b(?:the\s+)?(?:result|value)\s+(?:is|equals?|:|=)\b/i.test(normalized) ||
    /\b(?:correct|right)\s+(?:option|choice)\b/i.test(normalized) ||
    /\b(?:option|choice)\s+[a-d]\b[^.!?;]{0,32}\b(?:is\s+)?(?:correct|right)\b/i.test(normalized)
  ) {
    return true;
  }

  if (!isChoiceAnswer(answer)) return false;
  return /\b(?:option|choice)\s*[\[(]?[a-d][)\]]?\b/i.test(normalized);
}

function approvedCalculationOutputs(context?: AnswerLastContext): Set<string> {
  const outputs = new Set<string>();
  for (const calculation of context?.approvedCalculationText ?? []) {
    const signature = calculationSignature(calculation);
    if (!signature) continue;
    const rightSide = signature.slice(signature.lastIndexOf("=") + 1);
    for (const candidate of numericAnswerCandidates(rightSide, true)) {
      outputs.add(candidate.normalizedValue);
    }
  }
  return outputs;
}

function containsOnlyApprovedCalculationContent(
  text: string,
  approvedCalculations: readonly string[],
): boolean {
  let residual = normalizeCalculationText(text);
  let matchedCalculation = false;

  for (const calculation of approvedCalculations) {
    const signature = calculationSignature(calculation);
    if (!signature) continue;

    let index = residual.indexOf(signature);
    while (index >= 0) {
      const end = index + signature.length;
      const before = index > 0 ? residual[index - 1] : "";
      const after = end < residual.length ? residual[end] : "";
      const wholeExpression =
        (!before || !/[a-z0-9]/i.test(before)) &&
        (!after || !/[a-z0-9]/i.test(after));
      if (wholeExpression) {
        residual = `${residual.slice(0, index)}${residual.slice(end)}`;
        matchedCalculation = true;
        index = residual.indexOf(signature);
        continue;
      }
      index = residual.indexOf(signature, index + 1);
    }
  }

  // Plain explanatory words may surround a supported equation. Any remaining
  // number or operator signals additional working that must be checked.
  return matchedCalculation && /^[a-z,;:'"()_-]*=?$/i.test(residual);
}

function isSupportedGuidedCalculation(
  section: string,
  text: string,
  canonicalAnswer: string,
  context?: AnswerLastContext,
): boolean {
  if (!guidedReasoningField(section) || isExplicitAnswerAnnouncement(text, canonicalAnswer)) {
    return false;
  }

  const approvedCalculations = context?.approvedCalculationText ?? [];
  if (containsOnlyApprovedCalculationContent(text, approvedCalculations)) return true;

  const candidateSignature = calculationSignature(text);
  const normalizedCandidate = normalizeCalculationText(text);
  if (
    approvedCalculations.some(
      (calculation) => normalizeCalculationText(calculation) === normalizedCandidate,
    )
  ) {
    return true;
  }
  if (
    candidateSignature &&
    approvedCalculations.some((calculation) => calculationSignature(calculation) === candidateSignature)
  ) {
    return true;
  }
  if (isSupportedCalculationAssignment(text, approvedCalculations)) return true;

  if (!section.endsWith(".result")) return false;
  const textValues = numericAnswerCandidates(text, true);
  if (textValues.length === 0) return false;
  const approvedOutputs = approvedCalculationOutputs(context);
  return textValues.every((value) => approvedOutputs.has(value.normalizedValue));
}

function hasNumericGuidedCalculation(text: string): boolean {
  const normalized = normalizeCalculationText(text);
  return /\d/.test(normalized) && /=/.test(normalized) && /[+*/-]/.test(normalized);
}

function containsWholePhrase(text: string, phrase: string): boolean {
  if (!phrase) return false;
  let start = text.indexOf(phrase);
  while (start >= 0) {
    const end = start + phrase.length;
    const before = start > 0 ? text[start - 1] : "";
    const after = end < text.length ? text[end] : "";
    const hasWordBoundaryBefore = !before || !/[\p{L}\p{N}]/u.test(before);
    const hasWordBoundaryAfter = !after || !/[\p{L}\p{N}]/u.test(after);
    if (hasWordBoundaryBefore && hasWordBoundaryAfter) return true;
    start = text.indexOf(phrase, start + 1);
  }
  return false;
}

function contextContainsPhrase(
  phrase: string,
  contextTexts: readonly string[],
): boolean {
  const normalizedPhrase = normalizeAnswerLastText(phrase);
  if (!normalizedPhrase) return false;
  return contextTexts.some((text) => {
    const normalizedText = normalizeAnswerLastText(text);
    return containsWholePhrase(normalizedText, normalizedPhrase);
  });
}

function contextContainsQuantity(
  quantity: NumericAnswerCandidate,
  contextTexts: readonly string[],
): boolean {
  // Context is authoritative question/given text, not a candidate answer.
  // Recognize every number there (including unitless values in long questions)
  // so a given like "mechanical advantage of 3" is not mistaken for a leak.
  return contextTexts.some((text) =>
    numericAnswerCandidates(text, true).some(
      (match) => match.normalizedValue === quantity.normalizedValue,
    ),
  );
}

function isFaithfulWordToMathGiven(
  section: string,
  text: string,
  quantity: NumericAnswerCandidate,
  answer: string,
  contextTexts: readonly string[],
): boolean {
  return section === "questionTranslation.wordToMath" &&
    contextContainsQuantity(quantity, contextTexts) &&
    !isExplicitAnswerAnnouncement(text, answer) &&
    compareBankAnswers(quantity.display, answer).status !== "match";
}

function sameCanonicalAnswerOrDisclosure(
  candidate: string,
  canonicalAnswer: string,
  disclosure: string,
): boolean {
  const normalizedCandidate = normalizeAnswerLastText(candidate);
  const normalizedDisclosure = normalizeAnswerLastText(disclosure);
  return compareBankAnswers(candidate, canonicalAnswer).status === "match" ||
    (!!normalizedDisclosure && normalizedCandidate === normalizedDisclosure);
}

function isChoiceAnswer(answer: string): boolean {
  return /^\s*(?:(?:option)\s+)?\(?[a-d]\)?\s*[:.)-]/i.test(answer);
}

function correctedIntroSentence(
  text: string,
  canonicalAnswer: string,
  disclosure: string,
): string | null {
  // Keep the delimiters so every unflagged sentence and line remains byte-for-byte
  // unchanged. Decimal points are not separators unless followed by sentence text.
  const parts = text.split(/(\n+|(?<=[.!?])\s+(?=\p{Lu}))/u);
  const answerAssertion =
    /^\s*(?:therefore[,;:]?\s*)?(?:(?:the|our)\s+)?(?:(?:final\s+(?:(?:numeric(?:al)?)\s+)?)|(?:correct\s+))?(?:answer|result|value)\s*(?:is|equals?|:|=)\s*(.+?)\s*([.!?]?)\s*$/i;
  const requestedValue =
    /^(\s*(?:the examiner is asking us to|the question asks us to|we are asked to|we need to)\s+(?:find|identify|calculate|compute|determine|solve)\s+)(.+?)([.!?]?\s*)$/i;

  for (let index = 0; index < parts.length; index += 2) {
    const sentence = parts[index];
    const assertion = sentence.match(answerAssertion);
    if (assertion && sameCanonicalAnswerOrDisclosure(assertion[1], canonicalAnswer, disclosure)) {
      parts[index] = "We will establish the result after working through the steps.";
      return parts.join("");
    }

    const request = sentence.match(requestedValue);
    if (request && sameCanonicalAnswerOrDisclosure(request[2], canonicalAnswer, disclosure)) {
      const replacement = isChoiceAnswer(canonicalAnswer) ? "the correct option" : "the requested value";
      parts[index] = `${request[1]}${replacement}${request[3]}`;
      return parts.join("");
    }

    const conclusion =
      sentence.match(/^\s*(?:therefore|thus|hence|so)\s*[,;:]?\s*(.+?)\s*([.!?]?)\s*$/i);
    if (conclusion && sameCanonicalAnswerOrDisclosure(conclusion[1], canonicalAnswer, disclosure)) {
      parts[index] = "We will establish the result after working through the steps.";
      return parts.join("");
    }
  }
  return null;
}

function replaceIntroField(
  lessonValue: unknown,
  section: string,
  replacement: string,
): unknown | null {
  const match = section.match(/^questionTranslation\.(plainEnglish|whatWeKnow)$/);
  if (!match || !lessonValue || typeof lessonValue !== "object") return null;

  const lesson = lessonValue as Record<string, unknown>;
  const translation = lesson.questionTranslation;
  if (!translation || typeof translation !== "object") return null;
  const field = match[1];
  const previous = (translation as Record<string, unknown>)[field];
  if (typeof previous !== "string" || previous === replacement) return null;

  return {
    ...lesson,
    questionTranslation: {
      ...(translation as Record<string, unknown>),
      [field]: replacement,
    },
  };
}

function requestedTarget(question: string | undefined): string | null {
  if (!question) return null;
  const match = question.match(
    /\b(?:calculate|compute|determine|find|work\s+out)\s+(?:(?:the|its|their)\s+)?(.+?)(?:[?.!]|$)/i,
  );
  return match?.[1]
    ? normalizeAnswerLastText(match[1]).replace(/^(?:the|its|their)\s+/, "")
    : null;
}

function requestedTargetClaim(
  text: string,
  canonicalQuestion?: string,
): { subject: string; value: string } | null {
  const target = requestedTarget(canonicalQuestion);
  if (!target) return null;
  const match = text.match(
    /^\s*(?:(?:therefore|thus|hence|so)[,;:]?\s*)?(?:the\s+)?([a-z][a-z -]{1,48}?)\s+(?:is|equals?|:|=)\s*(.+?)\s*[.!?]?\s*$/i,
  );
  if (!match) return null;
  const subject = normalizeAnswerLastText(match[1]).replace(/^(?:the|its|their)\s+/, "");
  return subject === target ? { subject, value: match[2] } : null;
}

function correctedGuidedAnnouncement(
  text: string,
  canonicalAnswer: string,
  disclosure: string,
  canonicalQuestion?: string,
): string | null {
  const parts = text.split(/(\n+|(?<=[.!?])\s+(?=\p{Lu}))/u);
  const directAnswerClaim =
    /^\s*(?:(?:therefore|thus|hence|so)[,;:]?\s*)?(?:(?:the|our)\s+)?(?:(?:final\s+(?:(?:numeric(?:al)?)\s+)?)|(?:correct\s+))?(?:answer|result|value)\s*(?:is|equals?|:|=)\s*(.+?)\s*([.!?]?)\s*$/i;
  for (let index = 0; index < parts.length; index += 2) {
    const sentence = parts[index];
    const direct = sentence.match(directAnswerClaim);
    if (direct && sameCanonicalAnswerOrDisclosure(direct[1], canonicalAnswer, disclosure)) {
      parts[index] = "We will confirm the result after working through the steps.";
      return parts.join("");
    }

    const requested = requestedTargetClaim(sentence, canonicalQuestion);
    if (requested && sameCanonicalAnswerOrDisclosure(requested.value, canonicalAnswer, disclosure)) {
      parts[index] = `This establishes the ${requested.subject} requested.`;
      return parts.join("");
    }
  }
  return null;
}

function replaceGuidedField(
  lessonValue: unknown,
  section: string,
  replacement: string,
): unknown | null {
  const match = section.match(/^guidedReasoning\[(\d+)\]\.([\w]+)$/);
  if (!match || !lessonValue || typeof lessonValue !== "object") return null;

  const lesson = lessonValue as Record<string, unknown>;
  if (!Array.isArray(lesson.guidedReasoning)) return null;
  const index = Number(match[1]) - 1;
  const step = lesson.guidedReasoning[index];
  if (!step || typeof step !== "object" || Array.isArray(step)) return null;
  const field = match[2];
  const previous = (step as Record<string, unknown>)[field];
  if (typeof previous !== "string" || previous === replacement) return null;

  const steps = [...lesson.guidedReasoning];
  steps[index] = { ...(step as Record<string, unknown>), [field]: replacement };
  return { ...lesson, guidedReasoning: steps };
}

/**
 * Checks the lesson sections rendered before finalAnswer. Definite answer
 * disclosures fail; close but uncertain matches are marked for human review.
 * Repeated source givens and earlier intermediate values are considered only
 * when the canonical question or verified prior-work context establishes them.
 */
export function assessTeachingLessonAnswerLast(
  lessonValue: unknown,
  canonicalAnswer?: string,
  context?: AnswerLastContext,
): AnswerLastAssessment {
  if (!lessonValue || typeof lessonValue !== "object") {
    return { status: "review", section: "lesson", disclosure: "", reason: "Lesson shape is unavailable for answer-last review." };
  }
  const lesson = lessonValue as AnswerLastLesson;
  const answer = typeof canonicalAnswer === "string" && canonicalAnswer.trim()
    ? canonicalAnswer
    : typeof lesson.finalAnswer?.answer === "string" ? lesson.finalAnswer.answer : "";
  if (!answer.trim()) {
    return { status: "review", section: "finalAnswer", disclosure: "", reason: "Canonical final answer is unavailable for answer-last review." };
  }

  const sections = precedingAnswerSections(lesson);
  const phrases = answerPhraseCandidates(answer);
  const quantities = numericAnswerCandidates(answer);
  const contextTexts = answerLastContextTexts(context);
  let review: AnswerLastAssessment | null = null;

  for (const item of sections) {
    const normalizedText = normalizeAnswerLastText(item.text);
    if (!normalizedText) continue;

    if (isSupportedGuidedCalculation(item.section, item.text, answer, context)) {
      continue;
    }

    const requestedClaim = guidedReasoningField(item.section)
      ? requestedTargetClaim(item.text, context?.canonicalQuestion)
      : null;
    if (requestedClaim) {
      const approvedOutputs = approvedCalculationOutputs(context);
      const unsupportedValue = numericAnswerCandidates(requestedClaim.value, true).find(
        (value) =>
          !contextContainsQuantity(value, contextTexts) &&
          !approvedOutputs.has(value.normalizedValue),
      );
      if (unsupportedValue) {
        review ??= {
          status: "review",
          section: item.section,
          disclosure: unsupportedValue.display,
          reason: `A numerical conclusion in ${item.section} is not established by the approved source calculations.`,
          offendingText: item.text,
        };
      } else if (numericAnswerCandidates(requestedClaim.value, true).length > 0) {
        const disclosedValue = numericAnswerCandidates(requestedClaim.value, true)[0];
        return {
          status: "leak",
          section: item.section,
          disclosure: disclosedValue.display,
          reason: `The requested numerical result is announced before finalAnswer in ${item.section}.`,
          offendingText: item.text,
        };
      }
    }

    const hasApprovedCalculationContext = Boolean(context?.approvedCalculationText?.length);
    const isUnverifiedGuidedCalculation =
      hasApprovedCalculationContext &&
      guidedReasoningField(item.section) &&
      hasNumericGuidedCalculation(item.text);
    if (isUnverifiedGuidedCalculation) {
      review ??= {
        status: "review",
        section: item.section,
        disclosure: item.text.slice(0, 120),
        reason: `A guided calculation in ${item.section} is not supported by the approved source calculations.`,
        offendingText: item.text,
      };
    }

    const isUnsupportedGuidedResult =
      hasApprovedCalculationContext &&
      guidedReasoningField(item.section) &&
      item.section.endsWith(".result") &&
      numericAnswerCandidates(item.text, true).some((value) =>
        quantities.some((answerQuantity) => answerQuantity.normalizedValue === value.normalizedValue)
      );
    if (isUnsupportedGuidedResult) {
      review ??= {
        status: "review",
        section: item.section,
        disclosure: item.text.slice(0, 120),
        reason: `A guided result in ${item.section} is not established by an approved source calculation.`,
        offendingText: item.text,
      };
    }

    for (const phrase of phrases) {
      if (phrase.length < 3) {
        if (
          numericAnswerCandidates(phrase).length === 0 &&
          containsWholePhrase(normalizedText, phrase) &&
          hasExplicitAnswerCue(item.text, phrase)
        ) {
          return {
            status: "review",
            section: item.section,
            disclosure: phrase,
            reason: `A short answer term appears before finalAnswer in ${item.section}; explicit answer wording requires deterministic correction or review.`,
            offendingText: item.text,
          };
        }
        continue;
      }
      if (
        contextContainsPhrase(phrase, contextTexts) &&
        !hasExplicitAnswerCue(item.text, phrase)
      ) {
        continue;
      }
      if (containsWholePhrase(normalizedText, phrase)) {
        const tokenCount = phraseTokens(phrase).length;
        if (tokenCount >= 2) {
          return {
            status: "leak",
            section: item.section,
            disclosure: phrase,
            reason: `Answer-equivalent wording appears before finalAnswer in ${item.section}.`,
            offendingText: item.text,
          };
        }
        review ??= {
          status: "review",
          section: item.section,
          disclosure: phrase,
          reason: `A short answer term appears before finalAnswer in ${item.section}; context needs review.`,
          offendingText: item.text,
        };
        continue;
      }

      const tokens = [...new Set(phraseTokens(phrase))];
      if (tokens.length < 2) continue;
      const sentences = item.text.split(/[.!?;\n]+/);
      for (const sentence of sentences) {
        const sentenceTokens = new Set(phraseTokens(sentence));
        const overlap = tokens.filter((token) => sentenceTokens.has(token)).length / tokens.length;
        if (overlap >= 0.8) {
          review ??= {
            status: "review",
            section: item.section,
            disclosure: phrase,
            reason: `Wording closely overlaps the final answer before finalAnswer in ${item.section}; review required.`,
            offendingText: item.text,
          };
        }
      }
    }

    for (const quantity of quantities) {
      if (!quantityMatches(item.text, quantity)) continue;
      if (
        (contextContainsQuantity(quantity, contextTexts) &&
          !hasExplicitAnswerCue(item.text, quantity.display)) ||
        isFaithfulWordToMathGiven(item.section, item.text, quantity, answer, contextTexts)
      ) {
        continue;
      }
      const isMathField = /\.math$/.test(item.section);
      if (isMathField || (!quantity.strongUnit && !quantity.conciseAnswer && !hasAnswerCue(item.text, quantity.display))) {
        review ??= {
          status: "review",
          section: item.section,
          disclosure: quantity.display,
          reason: `A possible final numerical result appears before finalAnswer in ${item.section}; it may be an intermediate value.`,
          offendingText: item.text,
        };
      } else {
        return {
          status: "leak",
          section: item.section,
          disclosure: quantity.display,
          reason: `Final numerical result appears before finalAnswer in ${item.section}.`,
          offendingText: item.text,
        };
      }
    }
  }

  return review ?? { status: "clear" };
}

/**
 * Repairs only a standalone, unambiguous answer claim in introductory fields
 * or a guided sentence that directly announces the requested target. All other
 * leaks and all uncertain reviews fail closed.
 * The source object is never mutated; every successful change is revalidated.
 */
export function repairTeachingLessonAnswerLeakage(
  lessonValue: unknown,
  canonicalAnswer: string,
  context?: AnswerLastContext,
): AnswerLastRepairResult {
  let lesson = lessonValue;
  let assessment = assessTeachingLessonAnswerLast(lesson, canonicalAnswer, context);
  const initialAssessment = assessment;
  if (compareBankAnswers(
    typeof (lesson as AnswerLastLesson | null)?.finalAnswer?.answer === "string"
      ? (lesson as AnswerLastLesson).finalAnswer!.answer as string
      : "",
    canonicalAnswer,
  ).status !== "match") {
    return {
      status: "rejected",
      lesson: lessonValue,
      assessment,
      repairCount: 0,
      reason: "The lesson's final answer does not match the canonical answer.",
    };
  }
  if (assessment.status === "clear") {
    return { status: "clear", lesson: lessonValue, assessment, repairCount: 0 };
  }
  if (
    assessment.status === "review" &&
    assessment.section !== "questionTranslation.plainEnglish" &&
    assessment.section !== "questionTranslation.whatWeKnow"
  ) {
    return {
      status: "rejected",
      lesson: lessonValue,
      assessment,
      repairCount: 0,
      reason: "The answer-last result is uncertain and cannot be repaired deterministically.",
    };
  }

  let repairCount = 0;
  while (
    repairCount < 2 &&
    (assessment.status === "leak" || assessment.status === "review")
  ) {
    const isGuidedLeak = assessment.status === "leak" &&
      guidedReasoningField(assessment.section);
    const isIntroField =
      assessment.section === "questionTranslation.plainEnglish" ||
      assessment.section === "questionTranslation.whatWeKnow";
    if (!isIntroField && !isGuidedLeak) {
      return {
        status: "rejected",
        lesson: lessonValue,
        assessment,
        repairCount,
        reason: `The disclosure is outside the safe repair fields (${assessment.section}).`,
      };
    }

    const text = "offendingText" in assessment ? assessment.offendingText : undefined;
    if (typeof text !== "string") {
      return {
        status: "rejected",
        lesson: lessonValue,
        assessment,
        repairCount,
        reason: "The flagged field is not available as plain text.",
      };
    }
    const corrected = isGuidedLeak
      ? correctedGuidedAnnouncement(
        text,
        canonicalAnswer,
        assessment.disclosure,
        context?.canonicalQuestion,
      )
      : correctedIntroSentence(text, canonicalAnswer, assessment.disclosure);
    if (!corrected) {
      return {
        status: "rejected",
        lesson: lessonValue,
        assessment,
        repairCount,
        reason: "No standalone answer announcement could be changed without risking given values or reasoning.",
      };
    }

    const nextLesson = isGuidedLeak
      ? replaceGuidedField(lesson, assessment.section, corrected)
      : replaceIntroField(lesson, assessment.section, corrected);
    if (!nextLesson) {
      return {
        status: "rejected",
        lesson: lessonValue,
        assessment,
        repairCount,
        reason: "The flagged field could not be safely replaced.",
      };
    }
    lesson = nextLesson;
    repairCount += 1;
    assessment = assessTeachingLessonAnswerLast(lesson, canonicalAnswer, context);
    if (assessment.status === "clear") {
      return { status: "repaired", lesson, assessment, initialAssessment, repairCount };
    }
    if (assessment.status !== "leak") {
      return {
        status: "rejected",
        lesson: lessonValue,
        assessment,
        repairCount,
        reason: "The corrected lesson still requires human answer-last review.",
      };
    }
  }

  return {
    status: "rejected",
    lesson: lessonValue,
    assessment,
    repairCount,
    reason: assessment.status === "leak"
      ? "The lesson still contains an answer disclosure after deterministic correction."
      : "The lesson still requires answer-last review after deterministic correction.",
  };
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
