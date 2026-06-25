/**
 * MasteryMapView — visual grid of all topics the student has studied,
 * coloured by mastery score.
 */

import { getAllMasteryEntries } from "@/services/studentModel";
import type { TopicMasteryEntry } from "@/services/studentModel";

function scoreColor(score: number): { bg: string; text: string; border: string } {
  if (score >= 80) return { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" };
  if (score >= 60) return { bg: "#fffbeb", text: "#b45309", border: "#fde68a" };
  if (score >= 40) return { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" };
  return { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" };
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Developing";
  return "Needs Work";
}

function daysSince(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 86_400_000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7)  return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

interface TopicTileProps { entry: TopicMasteryEntry }

function TopicTile({ entry }: TopicTileProps) {
  const c = scoreColor(entry.masteryScore);
  return (
    <div
      className="rounded-2xl border p-3 flex flex-col gap-1"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-xs font-bold leading-snug" style={{ color: c.text }}>
          {entry.topic}
        </p>
        <span
          className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: c.border, color: c.text }}
        >
          {entry.masteryScore}
        </span>
      </div>
      <p className="text-[10px] font-semibold" style={{ color: c.text }}>{scoreLabel(entry.masteryScore)}</p>
      <div className="w-full bg-white bg-opacity-60 rounded-full h-1.5 mt-0.5">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${entry.masteryScore}%`, backgroundColor: c.text }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-[9px] text-slate-500">{entry.subject}</p>
        <p className="text-[9px] text-slate-400">{daysSince(entry.lastPracticed)}</p>
      </div>
    </div>
  );
}

export default function MasteryMapView() {
  const entries = getAllMasteryEntries()
    .sort((a, b) => a.masteryScore - b.masteryScore);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-8 text-center">
        <p className="text-2xl mb-2">🗺️</p>
        <p className="text-sm font-semibold text-slate-700">No topics studied yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Solve your first question to start building your mastery map.
        </p>
      </div>
    );
  }

  const strong    = entries.filter((e) => e.masteryScore >= 80);
  const good      = entries.filter((e) => e.masteryScore >= 60 && e.masteryScore < 80);
  const weak      = entries.filter((e) => e.masteryScore < 60);

  return (
    <div className="space-y-4">
      {weak.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">
            ❌ Needs More Practice ({weak.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {weak.map((e) => <TopicTile key={`${e.subject}-${e.topic}`} entry={e} />)}
          </div>
        </div>
      )}

      {good.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
            🟡 Getting There ({good.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {good.map((e) => <TopicTile key={`${e.subject}-${e.topic}`} entry={e} />)}
          </div>
        </div>
      )}

      {strong.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
            ✅ Strong ({strong.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {strong.map((e) => <TopicTile key={`${e.subject}-${e.topic}`} entry={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}
