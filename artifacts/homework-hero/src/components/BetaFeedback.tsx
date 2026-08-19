import { useState } from "react";
import { useAuth } from "@clerk/react";

type TesterType = "student" | "parent";

const RATING_LABELS = ["Very poor", "Poor", "Okay", "Good", "Excellent"];

export default function BetaFeedback() {
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [testerType, setTesterType] = useState<TesterType>("student");
  const [rating, setRating] = useState<number | null>(null);
  const [issueText, setIssueText] = useState("");
  const [likedText, setLikedText] = useState("");
  const [contextReference, setContextReference] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function close() {
    if (status === "submitting") return;
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Please sign in again before sending feedback.");
      const response = await fetch("/api/beta/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          testerType,
          experienceRating: rating,
          issueText,
          likedText,
          contextReference,
        }),
      });
      const body = await response.json() as { message?: string };
      if (!response.ok) throw new Error(body.message ?? "Feedback could not be sent.");
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Feedback could not be sent.");
      setStatus("error");
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-4">
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-700">Help improve the beta</p>
            <p className="text-xs text-slate-500 mt-0.5">Share a quick note about your experience.</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            Give feedback
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="beta-feedback-title"
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[92vh] overflow-y-auto"
          >
            <div className="p-5">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl">✓</div>
                  <h2 id="beta-feedback-title" className="text-lg font-bold text-slate-900">Thank you</h2>
                  <p className="text-sm text-slate-500 mt-2">Your beta feedback has been saved.</p>
                  <button
                    onClick={close}
                    className="mt-6 w-full py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 id="beta-feedback-title" className="text-lg font-bold text-slate-900">Beta feedback</h2>
                      <p className="text-xs text-slate-500 mt-1">A few details help us improve SnapSolve for students and parents.</p>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close feedback form"
                      className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </div>

                  <fieldset className="mb-5">
                    <legend className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">I am a</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(["student", "parent"] as TesterType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTesterType(type)}
                          className={`py-2.5 rounded-xl border text-sm font-semibold capitalize transition-colors ${
                            testerType === type
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mb-5">
                    <legend className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Overall experience *</legend>
                    <div className="grid grid-cols-5 gap-2">
                      {RATING_LABELS.map((label, index) => {
                        const value = index + 1;
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setRating(value)}
                            aria-label={`${value} out of 5 — ${label}`}
                            className={`h-10 rounded-xl border text-sm font-bold transition-colors ${
                              rating === value
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-200 text-slate-600 hover:border-indigo-300"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                    {rating && <p className="text-xs text-indigo-600 mt-2">{RATING_LABELS[rating - 1]}</p>}
                  </fieldset>

                  <label className="block mb-4">
                    <span className="text-xs font-bold text-slate-600">What went wrong or was confusing?</span>
                    <textarea
                      value={issueText}
                      onChange={(event) => setIssueText(event.target.value)}
                      maxLength={2000}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-y"
                    />
                  </label>

                  <label className="block mb-4">
                    <span className="text-xs font-bold text-slate-600">What did you like?</span>
                    <textarea
                      value={likedText}
                      onChange={(event) => setLikedText(event.target.value)}
                      maxLength={2000}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-y"
                    />
                  </label>

                  <label className="block mb-5">
                    <span className="text-xs font-bold text-slate-600">Screen or question used <span className="font-normal text-slate-400">(optional)</span></span>
                    <input
                      value={contextReference}
                      onChange={(event) => setContextReference(event.target.value)}
                      maxLength={300}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      placeholder="For example: Practice → Maths → Q10"
                    />
                  </label>

                  {errorMessage && <p role="alert" className="mb-4 text-xs font-medium text-red-600">{errorMessage}</p>}
                  <button
                    type="submit"
                    disabled={!rating || status === "submitting"}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Sending…" : "Send feedback"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}