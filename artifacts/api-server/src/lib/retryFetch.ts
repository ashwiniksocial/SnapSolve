/**
 * retryFetch — smart fetch wrapper for OpenAI 429 rate-limit errors.
 *
 * Strategy:
 *   1. On 429, read the `Retry-After` header (in seconds).
 *   2. If the wait is ≤ MAX_RETRY_WAIT_MS, sleep and retry.
 *   3. If the wait is too long, return the 429 immediately (caller handles it).
 *   4. All non-429 responses are returned as-is without retrying.
 *   5. Network errors and AbortErrors propagate immediately — never retried.
 *
 * The AbortController signal in `init` is passed through unchanged.
 * If the signal fires during a sleep delay, the next `fetch` call
 * throws an AbortError which propagates to the caller naturally.
 */

import { logger } from "./logger";

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

/** Maximum Retry-After we are willing to honour (ms). Longer waits give up immediately. */
const MAX_RETRY_WAIT_MS = 8_000;

/**
 * @param url        Target URL (OpenAI endpoint)
 * @param init       Standard RequestInit (headers, body, signal, …)
 * @param label      Short name used in log lines, e.g. "planner" | "draft" | "review" | "improve"
 * @param maxRetries Maximum 429-retry attempts (default 2)
 */
export async function retryFetch(
  url:        string,
  init:       RequestInit,
  label:      string,
  maxRetries  = 2,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Network errors / AbortError throw here — let them propagate
    const res = await fetch(url, init);

    // Not rate-limited — success or other error handled by caller
    if (res.status !== 429) return res;

    // Retries exhausted — return 429 to caller
    if (attempt === maxRetries) {
      logger.warn(
        { label, attempt, retriesExhausted: true },
        `[RETRY:${label}] 429 rate limit — all ${maxRetries} retries exhausted`,
      );
      return res;
    }

    // Determine how long to wait before next attempt
    const ra     = res.headers.get("Retry-After") ?? res.headers.get("x-ratelimit-reset-requests");
    const waitMs = ra ? Math.round(parseFloat(ra) * 1000) : 1_000 * 2 ** attempt;

    if (waitMs > MAX_RETRY_WAIT_MS) {
      // Wait too long — give up and return the 429
      logger.warn(
        { label, attempt, waitMs, maxWait: MAX_RETRY_WAIT_MS },
        `[RETRY:${label}] 429 rate limit — Retry-After ${waitMs} ms exceeds ${MAX_RETRY_WAIT_MS} ms; giving up`,
      );
      return res;
    }

    logger.warn(
      { label, attempt: attempt + 1, of: maxRetries, waitMs },
      `[RETRY:${label}] 429 rate limit — waiting ${waitMs} ms then retrying (attempt ${attempt + 1}/${maxRetries})`,
    );
    await sleep(waitMs);
  }

  // TypeScript requires a return; never actually reached
  throw new Error(`${label}_rate_limit_unreachable`);
}
