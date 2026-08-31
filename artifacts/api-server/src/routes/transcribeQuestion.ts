/**
 * POST /api/transcribeQuestion
 *
 * Authenticated, beta-protected image-to-question transcription only.
 * This route must never solve, explain, or persist the photographed question.
 */

import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { retryFetch } from "../lib/retryFetch";

const router = Router();
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const OPENAI_TIMEOUT_MS = 30_000;
const MAX_IMAGE_DATA_URL_LENGTH = 6 * 1024 * 1024;
const MAX_DECODED_IMAGE_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = /^(?:image\/jpeg|image\/png|image\/webp)$/;

const TRANSCRIPTION_PROMPT = `Transcribe only the academic question visible in this image.

Do not solve it.
Do not explain it.
Do not answer it.

Preserve mathematical symbols and notation exactly where readable, including:
< >
=
+
-
fractions
roots
superscripts
equations

Ignore notebook lines, page numbers, margins and unrelated marks.

Do not guess missing words or symbols.

If the academic question cannot be read reliably, report it as unclear rather than inventing text.

Return only the required structured JSON.`;

interface TranscriptionBody {
  imageDataUrl: string;
  subject?: string;
}

function validateBody(body: unknown): { data: TranscriptionBody } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object." };
  }

  const source = body as Record<string, unknown>;
  if (typeof source.imageDataUrl !== "string" || source.imageDataUrl.length === 0) {
    return { error: "imageDataUrl is required." };
  }

  if (source.imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return { error: "Image payload is too large." };
  }

  if (source.subject !== undefined &&
      (typeof source.subject !== "string" || source.subject.trim().length > 100)) {
    return { error: "subject must be a short string." };
  }

  const match = source.imageDataUrl.match(/^data:([^;]+);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match || !ALLOWED_IMAGE_MIME.test(match[1])) {
    return { error: "imageDataUrl must be a valid JPEG, PNG, or WEBP data URL." };
  }

  const base64 = match[2];
  if (base64.length % 4 !== 0) {
    return { error: "imageDataUrl contains malformed base64 data." };
  }
  const decodedBytes = Math.floor((base64.length * 3) / 4) -
    (base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0);
  if (decodedBytes <= 0 || decodedBytes > MAX_DECODED_IMAGE_BYTES) {
    return { error: "Image payload is too large." };
  }

  return {
    data: {
      imageDataUrl: source.imageDataUrl,
      ...(typeof source.subject === "string" && source.subject.trim()
        ? { subject: source.subject.trim() }
        : {}),
    },
  };
}

function isApprovedBetaUser(userId: string): Promise<boolean> {
  const rawList = (process.env.APPROVED_BETA_EMAILS ?? "").trim();
  if (!rawList) return Promise.resolve(true);

  const approved = new Set(
    rawList.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean),
  );

  return clerkClient.users.getUser(userId).then((user) => {
    const primary = user.emailAddresses.find(
      (email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId,
    );
    return Boolean(primary && approved.has(primary.emailAddress.trim().toLowerCase()));
  });
}

function parseTranscription(content: unknown): { transcription: string; readable: boolean } {
  if (typeof content !== "string") {
    return { transcription: "", readable: false };
  }

  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (typeof parsed.transcription !== "string" || typeof parsed.readable !== "boolean") {
      return { transcription: "", readable: false };
    }

    const transcription = parsed.transcription.trim();
    const readable = parsed.readable && transcription.length > 0;
    return {
      transcription: readable ? transcription.slice(0, 5000) : "",
      readable,
    };
  } catch {
    return { transcription: "", readable: false };
  }
}

router.post("/transcribeQuestion", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "unauthenticated" });
    return;
  }

  try {
    if (!(await isApprovedBetaUser(userId))) {
      res.status(403).json({ error: "beta_access_required" });
      return;
    }
  } catch (err) {
    req.log.warn({ err }, "transcription beta eligibility check failed");
    res.status(403).json({ error: "beta_access_required" });
    return;
  }

  const validated = validateBody(req.body);
  if ("error" in validated) {
    res.status(400).json({ error: "validation_error", message: validated.error });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "no_key",
      message: "OPENAI_API_KEY is not configured on the server",
    });
    return;
  }

  const { imageDataUrl, subject } = validated.data;
  const subjectContext = subject
    ? `\nOptional subject context (do not classify or solve): ${subject}`
    : "";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const openaiResponse = await retryFetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        max_tokens: 200,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "question_transcription",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                transcription: { type: "string" },
                readable: { type: "boolean" },
              },
              required: ["transcription", "readable"],
            },
          },
        },
        messages: [
          { role: "system", content: TRANSCRIPTION_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: `Transcribe this image.${subjectContext}` },
              { type: "image_url", image_url: { url: imageDataUrl, detail: "high" } },
            ],
          },
        ],
      }),
    }, "transcription");

    if (openaiResponse.status === 429) {
      res.status(429).json({
        error: "openai_rate_limit",
        message: "High demand right now — please wait a moment and try again.",
      });
      return;
    }
    if (openaiResponse.status === 401) {
      res.status(503).json({ error: "invalid_key", message: "OPENAI_API_KEY is invalid" });
      return;
    }
    if (!openaiResponse.ok) {
      res.status(502).json({ error: "openai_error", message: "Vision transcription failed." });
      return;
    }

    const body = await openaiResponse.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const result = parseTranscription(body.choices?.[0]?.message?.content);
    res.json({ transcription: result.transcription, readable: result.readable });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    req.log.warn({ err: message }, "Vision transcription request failed");
    if (message.includes("AbortError") || message.includes("aborted")) {
      res.status(504).json({ error: "timeout", message: "Vision transcription timed out." });
      return;
    }
    res.status(502).json({ error: "openai_error", message: "Vision transcription failed." });
  } finally {
    clearTimeout(timer);
  }
});

export default router;