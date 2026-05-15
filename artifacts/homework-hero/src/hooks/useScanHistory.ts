/**
 * useScanHistory — localStorage-backed scan history (most recent 10 entries).
 *
 * Thumbnails are stored as compressed data-URLs (≤ 20 KB each) to stay
 * within localStorage limits. Full-resolution images are not stored.
 */

import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScanRecord {
  id: string;           // unique scan id
  timestamp: number;    // Date.now()
  subject: Subject;
  topic: string;        // detected topic
  detectedText: string; // cleaned OCR text (first 500 chars)
  questionText: string; // final question sent to solution engine
  thumbnailUrl: string; // compressed data-url (may be empty for text-only scans)
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const KEY       = "studyai-scan-history";
const MAX_ITEMS = 10;

function load(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ScanRecord[];
  } catch {}
  return [];
}

function persist(records: ScanRecord[]) {
  // Keep only the MAX_ITEMS most recent
  const trimmed = records.slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // If localStorage is full, remove oldest entries and retry
    const shorter = trimmed.slice(0, Math.floor(MAX_ITEMS / 2));
    try { localStorage.setItem(KEY, JSON.stringify(shorter)); } catch {}
  }
}

// ─── Image compression ────────────────────────────────────────────────────────

/** Compress an image File to a tiny data-URL for thumbnail display. */
export function compressImageToThumbnail(
  file: File,
  maxPx = 120,
  quality = 0.5
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale  = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { resolve(""); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

/** Resize an image File to max 1200px for OCR (better Tesseract accuracy). */
export function resizeForOCR(file: File, maxPx = 1400): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale  = Math.min(1, maxPx / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        resolve(blob ?? file);
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.9);
    };
    img.onerror = () => { resolve(file); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScanHistory() {
  const [history, setHistory] = useState<ScanRecord[]>(load);

  const addRecord = useCallback((record: Omit<ScanRecord, "id" | "timestamp">) => {
    const next: ScanRecord = {
      ...record,
      id:        `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const updated = [next, ...prev].slice(0, MAX_ITEMS);
      persist(updated);
      return updated;
    });
    return next.id;
  }, []);

  const removeRecord = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(KEY);
    setHistory([]);
  }, []);

  return { history, addRecord, removeRecord, clearHistory };
}

// ─── Relative time helper ─────────────────────────────────────────────────────

export function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
