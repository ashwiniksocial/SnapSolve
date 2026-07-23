/**
 * Shared OpenAI chat-completions helper.
 *
 * Centralises the fetch pattern so every service (academicReviewer,
 * answerGenerator, etc.) reuses the same retryFetch wrapper and JSON
 * parsing logic instead of duplicating it.
 *
 * solveQuestion.ts has its own inline fetch loop — this helper is for
 * the new generation pipeline only and does NOT modify that route.
 */

import { retryFetch } from "./retryFetch";

export const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
export const MODEL      = "gpt-4o-mini";

export interface OpenAICallOptions {
  apiKey:    string;
  system:    string;
  user:      string;
  maxTokens: number;
  label:     string;
  signal?:   AbortSignal;
}

/**
 * Make one chat-completions call with json_object response_format.
 * Parses and returns the inner JSON. Throws on HTTP error or empty content.
 */
export async function callOpenAI<T = unknown>(opts: OpenAICallOptions): Promise<T> {
  const res = await retryFetch(
    OPENAI_URL,
    {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        model:           MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: opts.system },
          { role: "user",   content: opts.user   },
        ],
        max_tokens: opts.maxTokens,
      }),
      signal: opts.signal,
    },
    opts.label,
  );

  if (!res.ok) {
    const status = res.status;
    if (status === 401) throw new Error("invalid_key");
    if (status === 429) throw new Error("openai_429");
    throw new Error(`openai_${status}`);
  }

  const json = await res.json() as { choices?: { message?: { content?: string } }[] };
  const raw  = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("openai_empty_response");

  return JSON.parse(raw) as T;
}
