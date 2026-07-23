import { Link } from "wouter";
import {
  AreaChart, Area,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useImprovementHistory } from "@/hooks/useImprovementHistory";
import { useProgress }           from "@/hooks/useProgress";
import { SUBJECTS }              from "@/data/subjects";
import type { Subject }          from "@/data/subjects";

// ─── Palette ──────────────────────────────────────────────────────────────────
const CLR = {
  science:    SUBJECTS.Science.color,
  maths:      SUBJECTS.Mathematics.color,
  overall:    "#4f46e5",
  confidence: "#7c3aed",
  practice:   "#0ea5e9",
  revision:   "#10b981",
};

// ─── Shared chart defaults ────────────────────────────────────────────────────
const GRID_PROPS = { strokeDasharray: "3 3", stroke: "#f1f5f9" };
const TICK_STYLE = { fontSize: 10, fill: "#94a3b8" };
const Y_AXIS    = { tick: TICK_STYLE, width: 30, domain: [0, 100] as [number, number] };
const X_INTERVAL = 4; // every 5th of 30 labels

interface TooltipEntry { name: string; value: number; color: string; unit?: string }
function ChartTip({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-lg text-xs min-w-[110px]">
      <p className="text-slate-500 mb-1.5 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}{p.unit ?? "%"}
        </p>
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({
  emoji, title, subtitle, children,
}: { emoji: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-0.5">
        <span>{emoji}</span>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <p className="text-[11px] text-slate-400 mb-4">{subtitle}</p>
      {children}
    </div>
  );
}

// ─── Topic bar row (horizontal, no recharts) ──────────────────────────────────
function TopicBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-700 font-medium truncate max-w-[70%]">{label}</p>
        <p className="text-xs font-bold" style={{ color }}>{pct}%</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const SUBJECTS_ARR: Subject[] = ["Mathematics", "Science"];

export default function Improvement() {
  const { snapshots, isSeeded, topPrediction, overallSlope } = useImprovementHistory();
  const { getSubjectStats } = useProgress();

  // Derived topic lists for all subjects
  const allTopicStats = SUBJECTS_ARR.flatMap((subj) => {
    const s = getSubjectStats(subj);
    return s.topicStats.map((t) => ({ ...t, subject: subj }));
  }).filter((t) => t.solved >= 2);

  const strongest = [...allTopicStats]
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);

  const weakest = [...allTopicStats]
    .filter((t) => t.accuracy < 80)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  // Trend label
  const trendLabel =
    overallSlope > 0.15
      ? "📈 Improving"
      : overallSlope < -0.15
      ? "📉 Declining"
      : "➡ Steady";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/progress">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors text-sm">
              ←
            </button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900">30-Day Dashboard</h1>
            <p className="text-xs text-slate-500">{trendLabel} · {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5 pb-24">

        {/* ── Seeded notice ───────────────────────────────────────────────── */}
        {isSeeded && (
          <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
            <span className="text-base mt-0.5">✦</span>
            <div>
              <p className="text-xs font-semibold text-indigo-700">Simulated preview</p>
              <p className="text-[11px] text-indigo-500 mt-0.5 leading-relaxed">
                Practice more questions to replace this with your real 30-day trend.
                Your actual data will populate over time.
              </p>
            </div>
          </div>
        )}

        {/* ── AI Prediction card ──────────────────────────────────────────── */}
        {topPrediction && (
          <div
            className="rounded-2xl p-5 text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">✦</span>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">AI Projection · 30 Days</p>
            </div>
            <p className="text-base font-semibold leading-snug mb-4">
              If you continue at this pace, your{" "}
              <span className="font-black">{topPrediction.topic}</span>{" "}
              accuracy may improve by{" "}
              <span className="font-black text-yellow-300">+{topPrediction.change}%</span>.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-white/20 rounded-full px-3 py-1 font-semibold">
                Now: {topPrediction.currentAccuracy}%
              </span>
              <span className="text-white/60 text-sm">→</span>
              <span className="text-xs bg-yellow-400/30 text-yellow-100 rounded-full px-3 py-1 font-semibold">
                Projected: {topPrediction.projectedAccuracy}%
              </span>
              <span className="text-[10px] bg-white/10 rounded-full px-2 py-1 text-white/70 ml-auto">
                {topPrediction.subject}
              </span>
            </div>
          </div>
        )}

        {/* ── 1. Marks Improvement ────────────────────────────────────────── */}
        <Section emoji="📈" title="Marks Improvement" subtitle="Overall accuracy trend across all subjects">
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={snapshots} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CLR.overall} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CLR.overall} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="label" tick={TICK_STYLE} interval={X_INTERVAL} />
              <YAxis {...Y_AXIS} tickFormatter={(v) => `${v}`} />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke={CLR.overall}
                strokeWidth={2.5}
                fill="url(#gradOverall)"
                dot={false}
                activeDot={{ r: 4, fill: CLR.overall }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Section>

        {/* ── 2. Accuracy by Subject ──────────────────────────────────────── */}
        <Section emoji="🎯" title="Accuracy by Subject" subtitle="30-day accuracy for Mathematics & Science">
          <ResponsiveContainer width="100%" height={185}>
            <LineChart
              data={snapshots.map((s) => ({
                ...s,
                scienceAcc: Math.round((s.physicsAcc + s.chemAcc) / 2),
              }))}
              margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
            >
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="label" tick={TICK_STYLE} interval={X_INTERVAL} />
              <YAxis {...Y_AXIS} tickFormatter={(v) => `${v}`} />
              <Tooltip content={<ChartTip />} />
              <Legend
                wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                iconType="circle"
                iconSize={7}
              />
              <Line type="monotone" dataKey="mathAcc"    name="Mathematics" stroke={CLR.maths}    strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
              <Line type="monotone" dataKey="scienceAcc" name="Science"     stroke={CLR.science}  strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Section>

        {/* ── 3. Practice Consistency ─────────────────────────────────────── */}
        <Section emoji="📊" title="Practice Consistency" subtitle="Problems attempted per day">
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={snapshots} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={6}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="label" tick={TICK_STYLE} interval={X_INTERVAL} />
              <YAxis tick={TICK_STYLE} width={30} allowDecimals={false} />
              <Tooltip content={<ChartTip />} />
              <Bar
                dataKey="solved"
                name="Problems"
                fill={CLR.practice}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          {isSeeded && (
            <p className="text-[10px] text-slate-400 mt-1 text-center">Simulated · tracks from today</p>
          )}
        </Section>

        {/* ── 4. Confidence Trend ─────────────────────────────────────────── */}
        <Section emoji="🧠" title="Confidence Trend" subtitle="How firmly you've mastered what you've practiced">
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={snapshots} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={CLR.confidence} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CLR.confidence} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="label" tick={TICK_STYLE} interval={X_INTERVAL} />
              <YAxis {...Y_AXIS} tickFormatter={(v) => `${v}`} />
              <Tooltip content={<ChartTip />} />
              <Area
                type="monotone"
                dataKey="confidence"
                name="Confidence"
                stroke={CLR.confidence}
                strokeWidth={2.5}
                fill="url(#gradConf)"
                dot={false}
                activeDot={{ r: 4, fill: CLR.confidence }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-slate-400 mt-1 text-center">
            Confidence = accuracy × practice depth · grows with consistent effort
          </p>
        </Section>

        {/* ── 5. Revision Completion Rate ─────────────────────────────────── */}
        <Section emoji="📅" title="Revision Completion Rate" subtitle="% of scheduled revision items completed each day">
          <ResponsiveContainer width="100%" height={165}>
            <BarChart data={snapshots} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={6}>
              <CartesianGrid {...GRID_PROPS} />
              <XAxis dataKey="label" tick={TICK_STYLE} interval={X_INTERVAL} />
              <YAxis tick={TICK_STYLE} width={30} domain={[0, 100]} tickFormatter={(v) => `${v}`} />
              <Tooltip content={<ChartTip />} />
              <Bar
                dataKey="revisionRate"
                name="Completion"
                fill={CLR.revision}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        {/* ── 6 & 7. Strongest & Weakest Topics ──────────────────────────── */}
        <div className="grid grid-cols-1 gap-5">

          {/* Strongest */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span>💪</span>
              <h2 className="text-sm font-semibold text-slate-700">Strongest Topics</h2>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Your highest-accuracy areas</p>
            {strongest.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                Solve 2+ questions per topic to see your strengths
              </p>
            ) : (
              <div className="space-y-3">
                {strongest.map((t) => (
                  <div key={`${t.subject}-${t.topic}`}>
                    <TopicBar
                      label={`${SUBJECTS[t.subject].icon} ${t.topic}`}
                      pct={t.accuracy}
                      color={SUBJECTS[t.subject].color}
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5 ml-0.5">{t.subject} · {t.solved} solved</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Weakest */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span>⚠️</span>
              <h2 className="text-sm font-semibold text-slate-700">Weakest Topics</h2>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Focus here for the biggest gains</p>
            {weakest.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-2xl mb-1">✦</p>
                <p className="text-xs font-semibold text-slate-600">No weak spots found yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All practised topics above 80% — great work!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {weakest.map((t) => (
                  <div key={`${t.subject}-${t.topic}`}>
                    <TopicBar
                      label={`${SUBJECTS[t.subject].icon} ${t.topic}`}
                      pct={t.accuracy}
                      color="#ef4444"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5 ml-0.5">{t.subject} · {t.solved} solved</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Summary footer ───────────────────────────────────────────────── */}
        <div className="text-center pt-2 pb-2">
          <p className="text-[11px] text-slate-400">
            Dashboard refreshes daily · Projections use 14-day linear trend
          </p>
          <Link href="/practice">
            <button className="mt-3 bg-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-2xl shadow-sm hover:bg-indigo-700 transition-colors">
              Continue Practising →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
