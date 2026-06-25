/**
 * TutorMessage — a single message bubble in the Socratic tutor chat.
 */
import type { DialogueMessage } from "@/services/socratic/dialogueEngine";

interface Props {
  message: DialogueMessage;
}

const TYPE_STYLES: Record<string, string> = {
  question:   "bg-indigo-50 border-indigo-200 text-indigo-900",
  assessment: "bg-slate-50 border-slate-200 text-slate-800",
  hint:       "bg-amber-50 border-amber-200 text-amber-900",
  reteach:    "bg-orange-50 border-orange-200 text-orange-900",
  praise:     "bg-emerald-50 border-emerald-200 text-emerald-900",
  milestone:  "bg-violet-50 border-violet-200 text-violet-900",
  reflection: "bg-slate-50 border-slate-200 text-slate-800",
  response:   "bg-white border-slate-200 text-slate-800",
  intro:      "bg-indigo-50 border-indigo-200 text-indigo-900",
};

const TYPE_ICONS: Record<string, string> = {
  question:   "✦",
  assessment: "→",
  hint:       "💡",
  reteach:    "↩",
  praise:     "✓",
  milestone:  "🏆",
  reflection: "📋",
  response:   "",
  intro:      "🎓",
};

const TYPE_LABELS: Record<string, string> = {
  question:   "Tutor Question",
  hint:       "Hint",
  reteach:    "Let's revisit this",
  praise:     "Correct",
  milestone:  "Mastery Achieved",
  reflection: "Session Reflection",
  assessment: "Tutor",
  intro:      "Your AI Tutor",
};

/** Parse basic **bold** and \n → paragraphs from tutor content. */
function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return <p key={i} className={i > 0 ? "mt-1.5" : ""}>{parts}</p>;
  });
}

export default function TutorMessage({ message }: Props) {
  const isStudent = message.role === "student";
  const style     = TYPE_STYLES[message.type] ?? TYPE_STYLES.assessment;
  const icon      = TYPE_ICONS[message.type]  ?? "→";
  const label     = TYPE_LABELS[message.type] ?? "Tutor";

  if (isStudent) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] bg-indigo-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className={`max-w-[88%] rounded-2xl rounded-bl-md px-4 py-3 border shadow-sm ${style}`}>
        {/* Label row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs font-bold opacity-70">{icon} {label}</span>
          {message.hintLevel !== undefined && (
            <span className="text-[10px] font-semibold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">
              Level {message.hintLevel}
            </span>
          )}
        </div>
        <div className="text-sm leading-relaxed">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}
