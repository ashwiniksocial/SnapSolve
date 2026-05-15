/**
 * OCR Service — wraps Tesseract.js for browser-based text extraction.
 *
 * Tesseract.js downloads ~4 MB of language data on first use.
 * Progress is surfaced via the `onProgress` callback so the UI
 * can show meaningful loading phases.
 *
 * LLM migration: replace `recognizeImage` with a call to
 * OpenAI Vision / Gemini Vision — the rest of the pipeline is unchanged.
 */

import Tesseract from "tesseract.js";

export interface OcrProgress {
  phase:   string;   // human-readable status
  percent: number;   // 0–100
}

/**
 * Extract text from an image Blob/File using Tesseract.js.
 * Returns the raw extracted text string.
 */
export async function recognizeImage(
  image: Blob | File | string,
  onProgress?: (p: OcrProgress) => void
): Promise<string> {
  const result = await Tesseract.recognize(image, "eng", {
    logger: (info) => {
      if (!onProgress) return;

      switch (info.status) {
        case "loading tesseract core":
          onProgress({ phase: "Loading OCR engine…", percent: 8 });
          break;
        case "initializing tesseract":
          onProgress({ phase: "Initializing OCR engine…", percent: 15 });
          break;
        case "loading language traineddata":
          onProgress({ phase: "Loading language model…", percent: 25 });
          break;
        case "initializing api":
          onProgress({ phase: "Starting recognition…", percent: 35 });
          break;
        case "recognizing text":
          onProgress({
            phase:   "Extracting text from image…",
            percent: 40 + Math.round((info.progress ?? 0) * 50),
          });
          break;
        default:
          break;
      }
    },
  });

  return result.data.text ?? "";
}

/** Silently attempt OCR; return empty string on any error. */
export async function safeRecognize(
  image: Blob | File | string,
  onProgress?: (p: OcrProgress) => void
): Promise<string> {
  try {
    return await recognizeImage(image, onProgress);
  } catch {
    return "";
  }
}
