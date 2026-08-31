import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, Link }                         from "wouter";
import { useAuth }                                   from "@clerk/react";
import { SUBJECTS, type Subject }                    from "@/data/subjects";
import { useSession }                                from "@/hooks/useSession";
import { useScanHistory, compressImageToThumbnail, resizeForOCR, relativeTime } from "@/hooks/useScanHistory";
import { cleanOcrText, detectBestTopic } from "@/services/ai/topicMatcher";
import { transcribeQuestion } from "@/services/ai/transcriptionService";
import type { OcrProgress } from "@/services/ai/ocrService";
import type { OcrTrustState } from "@/services/ai/ocrTrustGate";
import CameraCapture from "@/components/CameraCapture";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "idle"        // upload area shown
  | "camera"      // live device-camera capture (Take Photo)
  | "preview"     // image selected, ready to scan
  | "processing"  // OCR in progress
  | "review"      // OCR done, user can edit detected text
  | "solving";    // generating solution, navigating

type InputTab = "photo" | "type";

const SUBJECTS_LIST: Subject[] = ["Mathematics", "Science", "Information Technology"];

// ─── Loading bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs font-bold text-slate-500">{pct}%</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "var(--scan-color, #6366f1)" }}
        />
      </div>
    </div>
  );
}

// ─── Compact scan history card ────────────────────────────────────────────────
function HistoryCard({ record, onRevisit }: {
  record: ReturnType<typeof useScanHistory>["history"][number];
  onRevisit: () => void;
}) {
  const cfg = SUBJECTS[record.subject];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
      {record.thumbnailUrl ? (
        <img
          src={record.thumbnailUrl}
          alt="scan"
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-100"
        />
      ) : (
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: cfg.light }}
        >
          {cfg.icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: cfg.light, color: cfg.color }}
          >
            {record.subject}
          </span>
          <span className="text-[10px] text-slate-400">{relativeTime(record.timestamp)}</span>
        </div>
        <p className="text-xs font-medium text-slate-700 truncate">{record.topic}</p>
        <p className="text-[11px] text-slate-500 truncate">{record.questionText.slice(0, 60)}</p>
      </div>
      <button
        onClick={onRevisit}
        className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
      >
        Revisit
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Scan() {
  const { session, update } = useSession();
  const { getToken }        = useAuth();
  const [, navigate]        = useLocation();
  const { history, addRecord } = useScanHistory();

  const cfg = SUBJECTS[session.subject];

  // ── State ──
  const [tab,           setTab]           = useState<InputTab>("photo");
  const [phase,         setPhase]         = useState<Phase>("idle");
  const [imageFile,     setImageFile]     = useState<File | null>(null);
  const [imageUrl,      setImageUrl]      = useState<string>("");
  const [ocrProgress,   setOcrProgress]   = useState<OcrProgress>({ phase: "", percent: 0 });
  const [detectedText,  setDetectedText]  = useState("");
  const [editedQ,       setEditedQ]       = useState("");
  const [detectedTopic, setDetectedTopic] = useState("");
  const [typedQ,        setTypedQ]        = useState("");
  const [isDragging,    setIsDragging]    = useState(false);
  const [ocrError,      setOcrError]      = useState("");

  // ── OCR trust gate state (Prompt #032) ──
  const [ocrTrustState,    setOcrTrustState]    = useState<OcrTrustState>("OCR_NEEDS_REVIEW");
  // NEEDS_REVIEW requires the student to tick a confirmation box before solving
  const [reviewConfirmed,  setReviewConfirmed]  = useState(false);

  // ── Refs ──
  const fileRef    = useRef<HTMLInputElement>(null);
  const cameraRef  = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string>("");

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => { if (previewRef.current) URL.revokeObjectURL(previewRef.current); };
  }, []);

  // ── Take Photo: open the live camera on supported devices ──
  const openCamera = useCallback(() => {
    const canUseLiveCamera =
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function";
    if (canUseLiveCamera) {
      setPhase("camera");
    } else {
      cameraRef.current?.click();
    }
  }, []);

  // ── Image selection ──
  const handleFile = useCallback((file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setImageFile(file);
    setImageUrl(url);
    setPhase("preview");
    setOcrError("");
    setDetectedText("");
    setEditedQ("");
    setReviewConfirmed(false);
  }, []);

  // ── Drag-and-drop ──
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // ── Retake / reset helper ──
  const resetToIdle = useCallback(() => {
    setPhase("idle");
    setImageFile(null);
    setImageUrl("");
    setOcrError("");
    setDetectedText("");
    setEditedQ("");
    setReviewConfirmed(false);
  }, []);

  // ── OCR pipeline ──
  const runOcr = useCallback(async () => {
    if (!imageFile) return;
    setPhase("processing");
    setOcrError("");
    setReviewConfirmed(false);
    setOcrProgress({ phase: "Preparing image…", percent: 5 });

    try {
      // Step 1 — compress for OCR
      const resized = await resizeForOCR(imageFile);
      setOcrProgress({ phase: "Extracting question text…", percent: 20 });

      // Photo Scan uses server-side Vision directly. Tesseract remains available
      // for legacy code but is intentionally not run in this student path.
      const visionResult = await transcribeQuestion(resized, session.subject, getToken);
      setOcrProgress({ phase: "Checking scan quality…", percent: 90 });

      const cleaned = visionResult.readable ? cleanOcrText(visionResult.transcription) : "";
      const trust = visionResult.readable && cleaned
        ? { state: "OCR_NEEDS_REVIEW" as const }
        : { state: "OCR_FAILED" as const };
      setOcrTrustState(trust.state);
      update({ ocrConfidence: visionResult.readable ? 0.5 : 0 });

      // Vision is never promoted to HIGH_CONFIDENCE during the first beta.
      const topic = "";

      setOcrProgress({ phase: "Done!", percent: 100 });
      await new Promise((r) => setTimeout(r, 400));

      setDetectedText(cleaned);
      setEditedQ(cleaned);
      setDetectedTopic(topic);
      setPhase("review");
    } catch {
      setOcrError("OCR failed. Please type the question manually below.");
      setOcrTrustState("OCR_FAILED");
      setPhase("review");
      setDetectedText("");
      setEditedQ("");
    }
  }, [imageFile, session.subject, update, getToken]);

  // ── Solution generation ──
  // Structurally enforces the trust gate: FAILED never reaches this function
  // because the button is absent in that branch; NEEDS_REVIEW requires
  // reviewConfirmed to be true.
  const handleSolve = useCallback(async (questionOverride?: string) => {
    const question = (questionOverride ?? editedQ).trim();
    if (!question) return;
    if (
      ocrTrustState === "OCR_FAILED" ||
      (ocrTrustState === "OCR_NEEDS_REVIEW" && !reviewConfirmed)
    ) return;

    setPhase("solving");

    const match = detectBestTopic(question, session.subject) ?? {
      subject:    session.subject,
      topic:      detectedTopic || "General",
      confidence: 0.1,
    };

    update({
      question:      question,
      practiceTopic: match.topic,
    });

    const thumbnail = imageFile ? await compressImageToThumbnail(imageFile) : "";
    addRecord({
      subject:      session.subject,
      topic:        match.topic,
      detectedText: detectedText.slice(0, 500),
      questionText: question,
      thumbnailUrl: thumbnail,
    });

    navigate("/solution");
  }, [editedQ, ocrTrustState, reviewConfirmed, session.subject, detectedTopic, detectedText, imageFile, update, addRecord, navigate]);

  // ── Typed question solve — unchanged ──
  const handleTypedSolve = useCallback(() => {
    if (typedQ.trim().length < 5) return;
    setPhase("solving");
    update({ question: typedQ, practiceTopic: "", ocrConfidence: 1 });
    addRecord({
      subject:      session.subject,
      topic:        detectBestTopic(typedQ, session.subject)?.topic ?? "General",
      detectedText: typedQ,
      questionText: typedQ,
      thumbnailUrl: "",
    });
    navigate("/solution");
  }, [typedQ, session.subject, update, addRecord, navigate]);

  // ── Revisit history ──
  const revisitRecord = useCallback((record: ReturnType<typeof useScanHistory>["history"][number]) => {
    update({ subject: record.subject, question: record.questionText, practiceTopic: record.topic, ocrConfidence: 1 });
    navigate("/solution");
  }, [update, navigate]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────────

  const scanColor = cfg.color;

  // ── Trust-gate review section (three branches) ─────────────────────────────

  function renderReviewSection() {
    // ── FAILED: garbage / blank OCR ─────────────────────────────────────────
    if (ocrTrustState === "OCR_FAILED" || ocrError) {
      return (
        <div className="space-y-3">
          {/* Image thumbnail (if available) */}
          {imageUrl && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <img
                src={imageUrl}
                alt="Scanned"
                className="w-full max-h-40 object-contain bg-slate-50"
              />
            </div>
          )}

          {/* Failure card */}
          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📵</span>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-snug">
                  We couldn't read this question clearly.
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The photo may be blurry, too dark, or contain handwriting that
                  the scanner can't recognise. Please try again or type your question.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={resetToIdle}
                className="w-full py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
                style={{ backgroundColor: scanColor }}
              >
                📷 Retake Photo
              </button>
              <button
                onClick={() => { resetToIdle(); setTimeout(() => fileRef.current?.click(), 50); }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-700 border-2 border-slate-200 bg-white active:scale-95 transition-all"
              >
                🖼 Choose Photo
              </button>
              <button
                onClick={() => { resetToIdle(); setTab("type"); }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-700 border-2 border-slate-200 bg-white active:scale-95 transition-all"
              >
                ✏️ Type the Question Instead
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ── NEEDS_REVIEW: uncertain OCR; student must confirm ───────────────────
    if (ocrTrustState === "OCR_NEEDS_REVIEW") {
      return (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Scanned"
                className="w-full max-h-40 object-contain bg-slate-50 border-b border-slate-100"
              />
            )}
            <div className="p-4 space-y-3">

              {/* Amber warning banner */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5">
                <span className="text-amber-500 text-base mt-0.5">⚠</span>
                <div>
                  <p className="text-xs font-bold text-amber-800">
                    Please check the detected question before solving.
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    The scan quality is uncertain. Review the text below and correct
                    any mistakes before getting a solution.
                  </p>
                </div>
              </div>

              {/* Editable question */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Detected Question — edit if needed
                </p>
                <textarea
                  value={editedQ}
                  onChange={(e) => { setEditedQ(e.target.value); setReviewConfirmed(false); }}
                  placeholder="Edit to correct any mistakes before solving…"
                  rows={5}
                  className="w-full text-sm text-slate-800 border border-amber-200 rounded-xl p-3 resize-none outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Explicit confirmation tick */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={reviewConfirmed}
                  onChange={(e) => setReviewConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  I've checked the question — it's correct
                </span>
              </label>
            </div>
          </div>

          {/* Solve button — only active after explicit confirmation */}
          <button
            onClick={() => handleSolve()}
            disabled={!editedQ.trim() || !reviewConfirmed}
            className={`w-full py-4 rounded-2xl font-bold text-white text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
              editedQ.trim() && reviewConfirmed ? "active:scale-95" : "opacity-40 cursor-not-allowed"
            }`}
            style={{ backgroundColor: scanColor }}
          >
            <span>✦</span> Get AI Solution
          </button>

          <button
            onClick={resetToIdle}
            className="w-full py-3 rounded-2xl font-semibold text-sm text-slate-600 border-2 border-slate-200 bg-white active:scale-95 transition-all"
          >
            ← Scan Another Image
          </button>
        </div>
      );
    }

    // ── HIGH_CONFIDENCE: current green success experience ───────────────────
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Scanned"
              className="w-full max-h-40 object-contain bg-slate-50 border-b border-slate-100"
            />
          )}
          <div className="p-4 space-y-3">

            {/* Green success banner */}
            <div
              className="rounded-xl border p-2.5 flex items-center gap-2"
              style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
            >
              <span className="text-sm">✓</span>
              <p className="text-xs font-semibold" style={{ color: scanColor }}>
                Text extracted successfully
                {detectedTopic ? ` · Topic: ${detectedTopic}` : ""}
              </p>
            </div>

            {/* Editable question */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Detected Question — edit if needed
              </p>
              <textarea
                value={editedQ}
                onChange={(e) => setEditedQ(e.target.value)}
                placeholder="OCR extracted text appears here. Edit to correct any mistakes…"
                rows={5}
                className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl p-3 resize-none outline-none focus:border-indigo-300 leading-relaxed"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSolve()}
          disabled={!editedQ.trim()}
          className={`w-full py-4 rounded-2xl font-bold text-white text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
            editedQ.trim() ? "active:scale-95" : "opacity-40 cursor-not-allowed"
          }`}
          style={{ backgroundColor: scanColor }}
        >
          <span>✦</span> Get AI Solution
        </button>

        <button
          onClick={resetToIdle}
          className="w-full py-3 rounded-2xl font-semibold text-sm text-slate-600 border-2 border-slate-200 bg-white active:scale-95 transition-all"
        >
          ← Scan Another Image
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Main render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50" style={{ "--scan-color": scanColor } as React.CSSProperties}>

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Scan & Solve</h1>
              <p className="text-sm text-slate-500 mt-0.5">AI step-by-step solution</p>
            </div>
            {history.length > 0 && (
              <Link href="/history">
                <button className="text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl px-3 py-2 bg-white hover:bg-slate-50 active:scale-95 transition-all">
                  History ({history.length})
                </button>
              </Link>
            )}
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUBJECTS_LIST.map((s) => {
              const c      = SUBJECTS[s];
              const active = session.subject === s;
              return (
                <button
                  key={s}
                  onClick={() => update({ subject: s })}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={active ? { backgroundColor: c.color } : {}}
                >
                  {c.icon} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-lg mx-auto px-5 py-5 space-y-4">

        {/* ── Input method tabs (only in idle / preview) ── */}
        {(phase === "idle" || phase === "preview") && (
          <div className="flex rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {(["photo", "type"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === "photo" && phase !== "preview") setPhase("idle"); }}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t ? "border-b-2" : "text-slate-400 hover:text-slate-600"
                }`}
                style={tab === t ? { color: scanColor, borderColor: scanColor } : {}}
              >
                {t === "photo" ? "📷 Photo Scan" : "✏️ Type Question"}
              </button>
            ))}
          </div>
        )}

        {/* ══ PHOTO TAB ══════════════════════════════════════════════════════════ */}
        {tab === "photo" && (

          <>
            {/* ── idle: upload area ── */}
            {phase === "idle" && (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`bg-white rounded-2xl border-2 border-dashed transition-all shadow-sm flex flex-col items-center justify-center py-12 px-5 gap-4 ${
                  isDragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300"
                }`}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                  style={{ backgroundColor: cfg.light }}
                >
                  📷
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 text-base">Scan your homework</p>
                  <p className="text-sm text-slate-500 mt-1">Photo, drag-and-drop, or choose from gallery</p>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-xs">
                  {/* Fallback camera input — used only when getUserMedia is
                      unsupported. capture="environment" hints the OS to prefer
                      the rear camera on the file-picker path. */}
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    onClick={openCamera}
                    className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: scanColor }}
                  >
                    <span className="text-base">📷</span> Take Photo
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full py-3 rounded-2xl text-sm font-semibold text-slate-600 border-2 border-slate-200 bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>🖼</span> Choose from Gallery
                  </button>
                </div>

                <p className="text-xs text-slate-400">JPG · PNG · WEBP · up to any size</p>
              </div>
            )}

            {/* ── camera: live device-camera capture ── */}
            {phase === "camera" && (
              <CameraCapture
                accentColor={scanColor}
                onCapture={(file) => handleFile(file)}
                onCancel={() => setPhase("idle")}
                onChoosePhoto={() => { setPhase("idle"); fileRef.current?.click(); }}
              />
            )}

            {/* ── preview: image selected ── */}
            {phase === "preview" && imageUrl && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Selected"
                    className="w-full max-h-72 object-contain bg-slate-50"
                  />
                  <button
                    onClick={() => { setPhase("idle"); setImageFile(null); setImageUrl(""); }}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-white active:scale-95 transition-all"
                  >
                    ✕ Change
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 mb-4">
                     Image ready. Tap below to extract the question text.
                  </p>
                  <button
                    onClick={runOcr}
                    className="w-full py-4 rounded-2xl font-bold text-white text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: scanColor }}
                  >
                    <span>🔍</span> Extract & Review Text
                  </button>
                </div>
              </div>
            )}

            {/* ── processing: Vision transcription in progress ── */}
            {phase === "processing" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {imageUrl && (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Scanning"
                      className="w-full max-h-52 object-contain bg-slate-50 opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
                            style={{ borderColor: `${scanColor}40`, borderTopColor: scanColor }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xl">🔍</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <ProgressBar
                    pct={ocrProgress.percent}
                    label={ocrProgress.phase || "Scanning image…"}
                  />
                  <p className="text-xs text-slate-400 text-center">
                     The image is securely transcribed for review before any solution is generated.
                  </p>
                </div>
              </div>
            )}

            {/* ── review: trust-gate branches (FAILED / NEEDS_REVIEW / HIGH_CONFIDENCE) ── */}
            {phase === "review" && renderReviewSection()}

            {/* ── solving: brief loading ── */}
            {phase === "solving" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: `${scanColor}40`, borderTopColor: scanColor }}
                />
                <div className="text-center">
                  <p className="font-semibold text-slate-800">Generating solution…</p>
                  <p className="text-sm text-slate-500 mt-1">Building your step-by-step answer</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ TYPE TAB — unchanged ═══════════════════════════════════════════════ */}
        {tab === "type" && phase !== "solving" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Question</p>
                <textarea
                  value={typedQ}
                  onChange={(e) => setTypedQ(e.target.value)}
                  placeholder={`Type your ${session.subject} question here…\n\ne.g. "Solve x² − 5x + 6 = 0 by factoring."`}
                  rows={6}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 resize-none outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tips for best results</p>
              <ul className="space-y-1.5">
                {[
                  "Include all given values and units",
                  "State clearly what you need to find",
                  "Use × for multiplication, √ for square root",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-600">
                    <span style={{ color: scanColor }} className="mt-0.5 font-bold">•</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleTypedSolve}
              disabled={typedQ.trim().length < 5}
              className={`w-full py-4 rounded-2xl font-bold text-white text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                typedQ.trim().length >= 5 ? "active:scale-95" : "opacity-40 cursor-not-allowed"
              }`}
              style={{ backgroundColor: scanColor }}
            >
              <span>✦</span> Get AI Solution
            </button>
          </div>
        )}

        {tab === "type" && phase === "solving" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: `${scanColor}40`, borderTopColor: scanColor }}
            />
            <p className="font-semibold text-slate-800">Generating solution…</p>
          </div>
        )}

        {/* ── Recent scans strip ── */}
        {history.length > 0 && phase === "idle" && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Scans</p>
              <Link href="/history">
                <button className="text-xs font-semibold" style={{ color: scanColor }}>
                  View all →
                </button>
              </Link>
            </div>
            {history.slice(0, 3).map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                onRevisit={() => revisitRecord(record)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
