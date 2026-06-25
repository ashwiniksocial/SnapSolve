/**
 * Concept Search — find concepts by natural language query.
 *
 * Allows the AI and UI to search by concept rather than chapter.
 * Example: "Why do we divide here?" → matches Ratio, Fraction, Probability.
 *
 * Search layers (applied in order, merged by relevance score):
 *  1. Exact keyword match (highest weight)
 *  2. Fuzzy term match (stems, partial words)
 *  3. Misconception text match (catches common confusion queries)
 *  4. Chapter/topic text match
 *  5. Semantic synonym expansion (curated synonym map)
 *
 * All search is client-side (no API call needed).
 * Optional AI-enhanced search uses the backend for semantic expansion.
 *
 * Firestore path: students/{id}/conceptSearchHistory
 */

import { CONCEPT_NODES } from "./conceptGraph";
import type { ConceptNode, Subject } from "./conceptGraph";

const BASE_URL = import.meta.env.BASE_URL as string ?? "/";

export interface SearchResult {
  concept:       ConceptNode;
  score:         number;         // relevance score 0–1
  matchReasons:  string[];       // why this result matched
  rank:          number;
}

export interface ConceptSearchResponse {
  query:         string;
  expandedQuery: string;         // after synonym expansion
  results:       SearchResult[];
  totalFound:    number;
  searchedAt:    number;
}

// ── Synonym map for semantic expansion ────────────────────────────────────────

const SYNONYMS: Record<string, string[]> = {
  "divide":           ["division", "fraction", "ratio", "quotient", "denominator"],
  "multiply":         ["multiplication", "product", "times", "factor"],
  "add":              ["addition", "sum", "plus", "total"],
  "subtract":         ["subtraction", "difference", "minus", "take away"],
  "solve":            ["equation", "algebra", "find x", "unknown"],
  "area":             ["geometry", "surface", "square", "rectangle", "circle"],
  "slope":            ["gradient", "linear equation", "coordinate geometry"],
  "speed":            ["velocity", "motion", "distance", "rate"],
  "force":            ["newton", "push", "pull", "mass", "acceleration"],
  "current":          ["electricity", "circuit", "ohm", "ampere", "voltage"],
  "heat":             ["temperature", "thermodynamics", "energy", "thermal"],
  "element":          ["periodic table", "atomic structure", "metal", "nonmetal"],
  "bond":             ["chemical bonding", "ionic", "covalent", "valence"],
  "reaction":         ["chemical reaction", "equation", "reactant", "product"],
  "acid":             ["pH", "base", "neutralisation", "salt", "indicator"],
  "light":            ["reflection", "refraction", "optics", "lens", "mirror"],
  "probability":      ["chance", "likelihood", "event", "outcome", "random"],
  "average":          ["mean", "median", "mode", "statistics"],
  "triangle":         ["geometry", "angles", "pythagoras", "trigonometry"],
  "straight line":    ["linear", "gradient", "coordinate", "y=mx+c"],
  "parabola":         ["quadratic", "curve", "quadratic equation"],
  "roots":            ["zeros", "polynomial", "quadratic", "factor"],
  "sequence":         ["series", "arithmetic progression", "geometric progression"],
  "interest":         ["percentage", "principal", "rate", "simple interest", "compound interest"],
  "work":             ["energy", "force", "power", "joule"],
  "atom":             ["atomic structure", "electron", "proton", "neutron", "nucleus"],
  "why divide":       ["fraction", "ratio", "division", "proportion"],
  "why negative":     ["integer", "algebra", "number line"],
  "what is x":        ["algebra", "variable", "equation"],
};

/** Expand a query with synonyms. Returns the enriched term set. */
function expandQuery(query: string): Set<string> {
  const terms = new Set<string>(
    query.toLowerCase().split(/\s+/).filter((t) => t.length >= 3)
  );

  for (const [trigger, expansions] of Object.entries(SYNONYMS)) {
    if (query.toLowerCase().includes(trigger)) {
      for (const exp of expansions) terms.add(exp.toLowerCase());
    }
  }
  return terms;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

function scoreNode(node: ConceptNode, terms: Set<string>): { score: number; reasons: string[] } {
  let score    = 0;
  const reasons: string[] = [];

  for (const term of terms) {
    // Keyword exact match (highest)
    if (node.keywords.some((k) => k.toLowerCase() === term)) {
      score += 0.40; reasons.push(`keyword: "${term}"`);
    }
    // Keyword partial match
    else if (node.keywords.some((k) => k.toLowerCase().includes(term))) {
      score += 0.25; reasons.push(`keyword contains "${term}"`);
    }

    // Concept name match
    if (node.concept.toLowerCase().includes(term)) {
      score += 0.30; reasons.push(`concept name: "${term}"`);
    }
    // Topic match
    if (node.topic.toLowerCase().includes(term)) {
      score += 0.20; reasons.push(`topic: "${term}"`);
    }
    // Chapter match
    if (node.chapter.toLowerCase().includes(term)) {
      score += 0.10; reasons.push(`chapter: "${term}"`);
    }
    // Misconception match (catches "why don't we..." questions)
    if (node.commonMisconceptions.some((m) => m.toLowerCase().includes(term))) {
      score += 0.20; reasons.push(`addresses misconception about "${term}"`);
    }
    // NCERT reference match
    if (node.ncertReferences.some((r) => r.toLowerCase().includes(term))) {
      score += 0.10; reasons.push(`NCERT reference: "${term}"`);
    }
  }

  // Boost by importance and exam frequency
  score *= 0.7 + (node.importance / 5) * 0.3;

  return { score: Math.min(1, score), reasons: [...new Set(reasons)] };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Search concepts by natural language query (synchronous, no API call). */
export function searchConcepts(opts: {
  query:        string;
  subject?:     Subject;
  limit?:       number;
  minScore?:    number;
}): ConceptSearchResponse {
  const { query, subject, limit = 10, minScore = 0.1 } = opts;
  const terms = expandQuery(query);
  const expandedQuery = [...terms].join(", ");

  const candidates = subject
    ? CONCEPT_NODES.filter((n) => n.subject === subject)
    : CONCEPT_NODES;

  const scored: SearchResult[] = candidates
    .map((concept, _) => {
      const { score, reasons } = scoreNode(concept, terms);
      return { concept, score, matchReasons: reasons, rank: 0 };
    })
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const history = _lsRead<SearchHistoryEntry[]>(HISTORY_KEY, []);
  history.push({ query, resultCount: scored.length, searchedAt: Date.now(), subject });
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-50))); } catch {}

  return {
    query,
    expandedQuery,
    results:    scored,
    totalFound: scored.length,
    searchedAt: Date.now(),
  };
}

/**
 * AI-enhanced search: uses the backend to semantically expand the query,
 * then runs the local search on the expansion.
 */
export async function searchConceptsWithAI(opts: {
  query:    string;
  subject?: Subject;
  limit?:   number;
}): Promise<ConceptSearchResponse> {
  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generateQuestion",
        topic:  "concept search",
        subject: opts.subject ?? "Mathematics",
        masteryScore: 50,
        studentContext: `A student asked: "${opts.query}". List 5–8 specific mathematical or scientific concept keywords that this question is about. Return a JSON array of strings only: ["concept1", "concept2", ...]`,
      }),
    });

    if (res.ok) {
      const data = await res.json() as { content: string };
      const parsed = JSON.parse(data.content) as string[];
      if (Array.isArray(parsed)) {
        const aiExpanded = parsed.join(" ") + " " + opts.query;
        return searchConcepts({ ...opts, query: aiExpanded });
      }
    }
  } catch { /* fallback to local */ }

  return searchConcepts(opts);
}

/** Find the single most relevant concept for a query (for tutor context injection). */
export function findBestMatchingConcept(query: string, subject?: Subject): ConceptNode | null {
  const results = searchConcepts({ query, subject, limit: 1, minScore: 0.15 });
  return results.results[0]?.concept ?? null;
}

/** Find all concepts related to a given concept (for "also look at" suggestions). */
export function findRelatedConcepts(conceptId: string, limit = 5): ConceptNode[] {
  const node = CONCEPT_NODES.find((n) => n.id === conceptId);
  if (!node) return [];
  const query = [node.concept, node.topic, ...node.keywords.slice(0, 3)].join(" ");
  const results = searchConcepts({ query, subject: node.subject, limit: limit + 1 });
  return results.results.filter((r) => r.concept.id !== conceptId).slice(0, limit).map((r) => r.concept);
}

// ── History ───────────────────────────────────────────────────────────────────

interface SearchHistoryEntry {
  query:        string;
  subject?:     Subject;
  resultCount:  number;
  searchedAt:   number;
}

const HISTORY_KEY = "studyai-v1-concept-search-history";

function _lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}

export function getSearchHistory(): SearchHistoryEntry[] {
  return _lsRead<SearchHistoryEntry[]>(HISTORY_KEY, []);
}

export function getFrequentSearchTerms(): string[] {
  const history = getSearchHistory();
  const freq    = new Map<string, number>();
  for (const entry of history) {
    for (const term of entry.query.toLowerCase().split(/\s+/)) {
      if (term.length >= 4) freq.set(term, (freq.get(term) ?? 0) + 1);
    }
  }
  return [...freq.entries()].sort(([, a], [, b]) => b - a).slice(0, 10).map(([t]) => t);
}
