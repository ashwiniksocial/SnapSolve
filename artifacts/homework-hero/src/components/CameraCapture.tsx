import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Real device-camera capture for the Scan flow (Prompt #027 P0-B).
 *
 * "Take Photo" must genuinely open a live camera — not the gallery/file picker.
 * The reliable cross-device path is getUserMedia() with a live <video> preview
 * and an in-app shutter, preferring the rear/environment camera. The captured
 * frame is turned into a File and handed to the EXISTING Scan/OCR pipeline via
 * onCapture — this component never does OCR or image processing itself.
 *
 * Graceful degradation is mandatory:
 *   - getUserMedia unsupported            → onUnsupported() so Scan can offer upload
 *   - permission denied / no camera / error → clear message + a "Choose Photo" action
 * Desktop machines without a camera therefore never see a broken page.
 */

type CameraState = "initialising" | "streaming" | "denied" | "error" | "unsupported";

interface CameraCaptureProps {
  /** Receives the captured photo as a File, fed to the existing OCR pipeline. */
  onCapture: (file: File) => void;
  /** Closes the camera without capturing. */
  onCancel: () => void;
  /** Fallback: let the student pick from the gallery instead. */
  onChoosePhoto: () => void;
  /** Accent colour matched to the current subject. */
  accentColor: string;
}

function supportsCamera(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  );
}

export default function CameraCapture({
  onCapture,
  onCancel,
  onChoosePhoto,
  accentColor,
}: CameraCaptureProps) {
  const [state, setState]       = useState<CameraState>("initialising");
  const [errorMsg, setErrorMsg] = useState("");
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Acquire the camera on mount. Prefer the rear/environment camera; fall back
  // to any available camera if the environment facing mode is not offered.
  useEffect(() => {
    let cancelled = false;

    if (!supportsCamera()) {
      setState("unsupported");
      return;
    }

    (async () => {
      setState("initialising");
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          });
        } catch {
          // Retry without the environment constraint (e.g. laptops with only a
          // front camera) before giving up.
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setState("streaming");
      } catch (err) {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") {
          setState("denied");
          setErrorMsg("Camera permission was blocked. Allow camera access in your browser, or choose a photo from your gallery.");
        } else if (name === "NotFoundError" || name === "OverconstrainedError" || name === "DevicesNotFoundError") {
          setState("error");
          setErrorMsg("No camera was found on this device. You can choose a photo from your gallery instead.");
        } else {
          setState("error");
          setErrorMsg("Couldn't start the camera. You can choose a photo from your gallery instead.");
        }
      }
    })();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [stopStream]);

  const handleShutter = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || state !== "streaming") return;

    const width  = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    canvas.width  = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        stopStream();
        onCapture(file); // → existing handleFile → resizeForOCR → OCR pipeline
      },
      "image/jpeg",
      0.92,
    );
  }, [state, stopStream, onCapture]);

  const handleCancel = useCallback(() => {
    stopStream();
    onCancel();
  }, [stopStream, onCancel]);

  const handleChoose = useCallback(() => {
    stopStream();
    onChoosePhoto();
  }, [stopStream, onChoosePhoto]);

  // ── Unsupported / denied / error: graceful fallback panel ──────────────────
  if (state === "unsupported" || state === "denied" || state === "error") {
    const heading =
      state === "unsupported"
        ? "Camera not available here"
        : state === "denied"
        ? "Camera access needed"
        : "Camera couldn't start";
    const body =
      state === "unsupported"
        ? "This device or browser can't open the camera directly. Choose a photo from your gallery to continue."
        : errorMsg;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
          📷
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">{heading}</p>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{body}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleChoose}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: accentColor }}
          >
            <span>🖼</span> Choose Photo
          </button>
          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-2xl text-sm font-semibold text-slate-600 border-2 border-slate-200 bg-white active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ── Live camera preview + shutter ──────────────────────────────────────────
  return (
    <div className="bg-black rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      <div className="relative aspect-[3/4] w-full bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />
        {state === "initialising" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
            <div
              className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: `${accentColor}55`, borderTopColor: accentColor }}
            />
            <p className="text-xs text-white/80 font-medium">Starting camera…</p>
          </div>
        )}
        {/* Framing guide */}
        {state === "streaming" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[85%] h-[70%] border-2 border-white/40 rounded-2xl" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-black px-5 py-4 flex items-center justify-between">
        <button
          onClick={handleChoose}
          className="text-xs font-semibold text-white/80 px-3 py-2 rounded-xl border border-white/20 active:scale-95 transition-all"
        >
          🖼 Gallery
        </button>

        <button
          onClick={handleShutter}
          disabled={state !== "streaming"}
          aria-label="Capture photo"
          className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${
            state === "streaming" ? "active:scale-90" : "opacity-40"
          }`}
        >
          <span className="w-12 h-12 rounded-full block" style={{ backgroundColor: accentColor }} />
        </button>

        <button
          onClick={handleCancel}
          className="text-xs font-semibold text-white/80 px-3 py-2 rounded-xl border border-white/20 active:scale-95 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
