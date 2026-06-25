/**
 * TutorInsightBanner — one personalised sentence shown above every solution.
 * Disappears if there's no data yet (new student).
 */

import { useMemo } from "react";
import { getTutorInsights } from "@/services/studentModel";

interface Props {
  topic:   string;
  subject: string;
}

export default function TutorInsightBanner({ topic, subject }: Props) {
  const insights = useMemo(() => getTutorInsights(), []);

  const profile = (() => {
    try {
      const raw = localStorage.getItem("studyai-v1-profile");
      if (!raw) return null;
      return JSON.parse(raw) as { totalQuestionsAnswered: number };
    } catch { return null; }
  })();

  if (!profile || profile.totalQuestionsAnswered < 2) return null;

  let message = "";
  let icon    = "🎓";
  let bg      = "bg-indigo-50 border-indigo-100";
  let text    = "text-indigo-800";

  if (insights.revisionDue.includes(topic)) {
    icon    = "🔄";
    bg      = "bg-amber-50 border-amber-100";
    text    = "text-amber-800";
    message = `Your tutor noticed you haven't practiced ${topic} in a while. Let's refresh it carefully.`;
  } else if (insights.persistentMistakes.length > 0 && insights.weakTopics.includes(topic)) {
    icon    = "⚠️";
    bg      = "bg-red-50 border-red-100";
    text    = "text-red-800";
    message = `Your tutor remembers you've struggled with ${topic} before. Pay extra attention to the WHY in each step.`;
  } else if (insights.readyForAdvanced.includes(topic)) {
    icon    = "🚀";
    bg      = "bg-emerald-50 border-emerald-100";
    text    = "text-emerald-800";
    message = `Your mastery on ${topic} is strong — your tutor will push you a little further today.`;
  } else if (insights.daysSinceLastStudy > 4) {
    icon    = "👋";
    bg      = "bg-violet-50 border-violet-100";
    text    = "text-violet-800";
    message = `Welcome back! It's been ${insights.daysSinceLastStudy} days. Your tutor will recap the essentials first.`;
  } else if (insights.learningVelocity === "slow") {
    icon    = "🐢";
    bg      = "bg-sky-50 border-sky-100";
    text    = "text-sky-800";
    message = "Your tutor knows you prefer detailed explanations. Every step is fully explained below.";
  } else if (insights.currentStreak >= 3) {
    icon    = "🔥";
    bg      = "bg-orange-50 border-orange-100";
    text    = "text-orange-800";
    message = `${insights.currentStreak}-day streak! Your tutor is impressed with your consistency.`;
  } else if (subject !== insights.preferredSubject && insights.preferredSubject) {
    icon    = "📖";
    message = `Exploring ${subject} today — your tutor will make the connection to what you already know.`;
  } else {
    return null;
  }

  return (
    <div className={`flex items-start gap-2.5 border rounded-2xl px-4 py-2.5 ${bg}`}>
      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
      <p className={`text-xs leading-relaxed font-medium ${text}`}>
        <span className="font-bold">Your tutor says: </span>{message}
      </p>
    </div>
  );
}
