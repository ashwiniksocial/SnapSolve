export type BankAnswerComparison =
  | { status: "match"; method: "normalized" | "choice" | "rational" | "multipart" | "polynomial" }
  | { status: "mismatch"; method: "choice" | "rational" | "multipart" | "polynomial" }
  | { status: "indeterminate"; method: "unsupported" };

export interface BankAnswerFormatAssessment {
  format: "missing" | "choice" | "multipart" | "rational" | "polynomial" | "exact-text-only";
  support: "missing" | "structured" | "partial" | "exact-only";
  reason: string;
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
