/**
 * LessonStreamExtractor — incremental JSON field extractor for SSE streaming.
 *
 * Receives accumulated JSON text (not individual deltas — caller must concat
 * chunks before feeding) and detects when each Standard-mode lesson field has
 * been fully written to the buffer.  Emits each field exactly once.
 *
 * Safety guarantee: a field is only emitted after JSON.parse succeeds on its
 * isolated value string — no malformed partial data ever leaves this class.
 *
 * Pure logic, no I/O, no state beyond the buffer and emitted set.
 */

export type SectionField =
  | "topic"
  | "difficulty"
  | "keyConcepts"
  | "aiConfidence"
  | "questionTranslation"
  | "step"
  | "finalAnswer";

export interface StreamSection {
  field:  SectionField;
  index?: number;    // present only when field === "step"
  value:  unknown;
}

export class LessonStreamExtractor {
  private buffer   = "";
  private emitted  = new Set<string>();  // keys already emitted
  private nextStep = 0;                  // next step index to look for

  /** Append a content chunk and return any newly completed sections. */
  feed(chunk: string): StreamSection[] {
    this.buffer += chunk;
    return this.scan();
  }

  private scan(): StreamSection[] {
    const out: StreamSection[] = [];

    // ── Scalar top-level fields ───────────────────────────────────────────────
    for (const f of ["topic", "difficulty", "aiConfidence"] as const) {
      if (!this.emitted.has(f)) {
        const v = this.tryScalar(f);
        if (v !== undefined) {
          this.emitted.add(f);
          out.push({ field: f, value: v });
        }
      }
    }

    // ── keyConcepts array ─────────────────────────────────────────────────────
    if (!this.emitted.has("keyConcepts")) {
      const v = this.tryArray("keyConcepts");
      if (v) {
        this.emitted.add("keyConcepts");
        out.push({ field: "keyConcepts", value: v });
      }
    }

    // ── questionTranslation object ────────────────────────────────────────────
    if (!this.emitted.has("questionTranslation")) {
      const v = this.tryObject("questionTranslation");
      if (v) {
        this.emitted.add("questionTranslation");
        out.push({ field: "questionTranslation", value: v });
      }
    }

    // ── guidedReasoning steps — sequentially 0 → 3 ───────────────────────────
    // Stop as soon as a step is incomplete so we never skip ahead.
    while (this.nextStep < 4) {
      const key = `step_${this.nextStep}`;
      if (this.emitted.has(key)) { this.nextStep++; continue; }
      const v = this.tryStep(this.nextStep);
      if (!v) break;
      this.emitted.add(key);
      out.push({ field: "step", index: this.nextStep, value: v });
      this.nextStep++;
    }

    // ── finalAnswer object ────────────────────────────────────────────────────
    if (!this.emitted.has("finalAnswer")) {
      const v = this.tryObject("finalAnswer");
      if (v) {
        this.emitted.add("finalAnswer");
        out.push({ field: "finalAnswer", value: v });
      }
    }

    return out;
  }

  // ─── Field extractors ──────────────────────────────────────────────────────

  /** Extract a primitive value (string, number, boolean, null) for a key. */
  private tryScalar(key: string): unknown {
    const buf = this.buffer;
    const ki  = buf.indexOf(`"${key}"`);
    if (ki < 0) return undefined;

    // Advance past the key to find the colon then the value
    let ci = ki + key.length + 2;  // skip past closing quote
    while (ci < buf.length && " \t\n\r:".includes(buf[ci])) ci++;
    if (ci >= buf.length) return undefined;

    if (buf[ci] === '"') {
      // String: scan to closing unescaped quote
      let i = ci + 1;
      while (i < buf.length) {
        if (buf[i] === '\\') { i += 2; continue; }
        if (buf[i] === '"') {
          try { return JSON.parse(buf.slice(ci, i + 1)); } catch { return undefined; }
        }
        i++;
      }
      return undefined;
    } else {
      // Number / boolean / null: end at , } ] or newline
      let i = ci;
      while (i < buf.length && !",[]{}\n\r".includes(buf[i])) i++;
      const raw = buf.slice(ci, i).trim();
      if (!raw) return undefined;
      try { return JSON.parse(raw); } catch { return undefined; }
    }
  }

  /** Extract a complete array value for a named key. */
  private tryArray(key: string): unknown[] | undefined {
    const start = this.findValueStart(key, '[');
    if (start < 0) return undefined;
    const end = this.matchBracket(start, '[', ']');
    if (end < 0) return undefined;
    try { return JSON.parse(this.buffer.slice(start, end + 1)) as unknown[]; }
    catch { return undefined; }
  }

  /** Extract a complete object value for a named key. */
  private tryObject(key: string): Record<string, unknown> | undefined {
    const start = this.findValueStart(key, '{');
    if (start < 0) return undefined;
    const end = this.matchBracket(start, '{', '}');
    if (end < 0) return undefined;
    try { return JSON.parse(this.buffer.slice(start, end + 1)) as Record<string, unknown>; }
    catch { return undefined; }
  }

  /**
   * Extract the Nth complete element object from the guidedReasoning array.
   * Scans from the opening `[` of the array and counts `{...}` at depth 1.
   */
  private tryStep(index: number): Record<string, unknown> | undefined {
    const arrayStart = this.findValueStart('guidedReasoning', '[');
    if (arrayStart < 0) return undefined;

    const buf   = this.buffer;
    let depth   = 0;
    let inStr   = false;
    let esc     = false;
    let elemIdx = -1;   // index of the current element being scanned
    let elemStart = -1; // start position of the target element

    for (let i = arrayStart; i < buf.length; i++) {
      const ch = buf[i];
      if (esc)   { esc = false; continue; }
      if (inStr) {
        if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') { inStr = true; continue; }

      if (ch === '[' || ch === '{') {
        if (ch === '{' && depth === 1) {
          // Entering a new element object inside the guidedReasoning array
          elemIdx++;
          if (elemIdx === index) elemStart = i;
        }
        depth++;
      } else if (ch === ']' || ch === '}') {
        depth--;
        if (ch === '}' && depth === 1 && elemIdx === index && elemStart >= 0) {
          // Just closed the target element
          try { return JSON.parse(buf.slice(elemStart, i + 1)) as Record<string, unknown>; }
          catch { return undefined; }
        }
        if (depth === 0) return undefined; // array closed before finding target
      }
    }
    return undefined;
  }

  // ─── Internal helpers ──────────────────────────────────────────────────────

  /**
   * Find the index of the opening bracket ([ or {) of a named key's value.
   * Returns -1 if the key or its opening bracket is not yet in the buffer.
   */
  private findValueStart(key: string, openChar: string): number {
    const buf = this.buffer;
    const ki  = buf.indexOf(`"${key}"`);
    if (ki < 0) return -1;
    let i = ki + key.length + 2;  // just past the closing quote of the key
    // Advance past whitespace and colon; stop at first bracket or another quote
    while (i < buf.length && buf[i] !== openChar && buf[i] !== '"') i++;
    if (i >= buf.length || buf[i] !== openChar) return -1;
    return i;
  }

  /**
   * Find the matching closing bracket for the bracket at `start`, respecting
   * JSON string escaping so brackets inside strings are ignored.
   * Returns -1 if the closing bracket is not yet in the buffer.
   */
  private matchBracket(start: number, open: string, close: string): number {
    const buf  = this.buffer;
    let depth  = 0;
    let inStr  = false;
    let esc    = false;
    for (let i = start; i < buf.length; i++) {
      const ch = buf[i];
      if (esc)   { esc = false; continue; }
      if (inStr) {
        if (ch === '\\') esc = true;
        else if (ch === '"') inStr = false;
        continue;
      }
      if (ch === '"') { inStr = true; continue; }
      if (ch === open)  { depth++; }
      else if (ch === close) { depth--; if (depth === 0) return i; }
    }
    return -1;
  }
}
