import type { Subject } from "@/data/subjects";

export interface TranscriptionResult {
  transcription: string;
  readable: boolean;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not prepare image."));
    };
    reader.onerror = () => reject(new Error("Could not prepare image."));
    reader.readAsDataURL(blob);
  });
}

export async function transcribeQuestion(
  image: Blob,
  subject: Subject,
  getToken: () => Promise<string | null>,
): Promise<TranscriptionResult> {
  const token = await getToken();
  if (!token) throw new Error("Please sign in again before scanning.");

  const imageDataUrl = await blobToDataUrl(image);
  const response = await fetch("/api/transcribeQuestion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageDataUrl, subject }),
  });

  const body = await response.json() as Partial<TranscriptionResult> & { message?: string };
  if (!response.ok) {
    throw new Error(body.message ?? "The photo could not be read. Please try again.");
  }
  if (typeof body.transcription !== "string" || typeof body.readable !== "boolean") {
    throw new Error("The photo transcription response was invalid.");
  }

  return {
    transcription: body.transcription,
    readable: body.readable,
  };
}