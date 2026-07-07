import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useExamMode, getUrgency, urgencyColors } from "@/hooks/useExamMode";
import type { ExamConfig, ExamSubject, ExamTask } from "@/hooks/useExamMode";
import { useProgress } from "@/hooks/useProgress";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { useChapterStats } from "@/hooks/useChapterStats";
import { SUBJECTS } from "@/data/subjects";
import type { Subject } from "@/data/subjects";

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_SUBJECTS: Subject[] = ["Physics", "Chemistry", "Mathematics"];

const MIN_DATE = new Date().toISOString().slice(0, 10);

function fmtDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Circular progress ring ───────────────────────────────────────────────────

function Ring({
  pct,
  color,
  size = 56,
  stroke = 5,
  children,
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(100, Math.max(0, pct)) / 100) * circ;

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#e2e8f0" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      {children && (
        <foreignObject x={0} y={0} width={size} height={size}>
          <div
            style={{
              width: size,
              height: size,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

// ─── Task card ────────────────────────────────────────────────────────────────

const TYPE_META = {
  revision: { label: "Revision",  icon: "↺", color: "#6366f1", bg: "#eef2ff" },
  practice: { label: "Practice",  icon: "✎", color: "#d97706", bg: "#fffbeb" },
  chapter:  { label: "New Topic", icon: "📖", color: "#059669", bg: "#ecfdf5" },
};

const PRIORITY_DOT: Record<string, string> = {
  critical: "#dc2626",
  high:     "#d97706",
  medium:   "#6366f1",
};

function TaskCard({
  task,
  onDone,
}: {
  task: ExamTask;
  onDone: (id: string) => void;
}) {
  const meta    = TYPE_META[task.type];
  const subjCfg = SUBJECTS[task.subject];

  return (
    <div
      className={`bg-white rounded-2xl border p-4 shadow-sm flex items-start gap-3 transition-opacity ${
        task.completedToday ? "opacity-50" : ""
      }`}
      style={{ borderColor: task.completedToday ? "#e2e8f0" : "#e2e8f0" }}
    >
      {/* Priority dot */}
      <div
        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: PRIORITY_DOT[task.priority] }}
      />

      <div className="flex-1 min-w-0">
        {/* Type + subject badges */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.icon} {meta.label}
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: subjCfg.light, color: subjCfg.color }}
          >
            {subjCfg.icon} {task.subject}
          </span>
          <span className="text-[10px] text-slate-400 ml-auto">~{task.estimatedMin} min</span>
        </div>

        <p className="text-sm font-semibold text-slate-800 leading-snug">{task.topic}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{task.description}</p>

        <div className="flex items-center gap-2 mt-3">
          {task.completedToday ? (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              ✓ Done today
            </span>
          ) : (
            <>
              <Link
                href={task.href}
                className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Start →
              </Link>
              <button
                onClick={() => onDone(task.id)}
                className="text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
              >
                Mark done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Task builder ─────────────────────────────────────────────────────────────

function buildTasks(
  targetSubjects: Subject[],
  weakTopicsMap:  Record<Subject, string[]>,
  accuracyMap:    Record<Subject, Record<string, number>>,
  dueItems:       ReturnType<ReturnType<typeof useRevisionPlanner>["getDueItems"]>,
  chapterMap:     Record<Subject, ReturnType<typeof useChapterStats>>,
  daysRemaining:  number,
  completedIds:   Set<string>,
): ExamTask[] {
  const tasks: ExamTask[] = [];

  // Budget: more tasks when exam is close
  const revCap  = daysRemaining <= 7 ? 4 : 3;
  const weakCap = 3;
  const chapCap = 2;

  // ── 1. Revision backlog (overdue SR items) ─────────────────────────────────
  const filtered = dueItems.filter((item) => targetSubjects.includes(item.subject));
  filtered.slice(0, revCap).forEach((item) => {
    const id = `rev-${item.questionId}`;
    tasks.push({
      id,
      type:           "revision",
      subject:        item.subject,
      topic:          item.topic,
      chapter:        item.chapter,
      label:          item.topic,
      description:    `SR card overdue — ${item.timesWrong > 0 ? `got it wrong ${item.timesWrong}× before` : "scheduled for review"}. 5 min revisit.`,
      estimatedMin:   5,
      priority:       daysRemaining <= 14 ? "critical" : "high",
      href:           "/revision",
      completedToday: completedIds.has(id),
    });
  });

  // ── 2. Weak topics (accuracy < 60 %) ──────────────────────────────────────
  let weakAdded = 0;
  for (const subj of targetSubjects) {
    if (weakAdded >= weakCap) break;
    const weak = weakTopicsMap[subj] ?? [];
    for (const topic of weak) {
      if (weakAdded >= weakCap) break;
      const acc = accuracyMap[subj]?.[topic] ?? 0;
      const id  = `weak-${subj}-${topic}`;
      if (tasks.some((t) => t.id === id)) continue;
      tasks.push({
        id,
        type:           "practice",
        subject:        subj,
        topic,
        label:          topic,
        description:    `Accuracy ${acc}% — below 60%. Practice 5–8 questions to strengthen this topic.`,
        estimatedMin:   10,
        priority:       acc < 40 ? "critical" : "high",
        href:           "/practice",
        completedToday: completedIds.has(id),
      });
      weakAdded++;
    }
  }

  // ── 3. Incomplete chapters / topics (< 60 % done) ─────────────────────────
  let chapAdded = 0;
  // Collect all incomplete topics across subjects, sorted by completionPct asc
  const candidates: Array<{ subj: Subject; chName: string; tName: string; pct: number }> = [];
  for (const subj of targetSubjects) {
    const chapters = chapterMap[subj] ?? [];
    for (const ch of chapters) {
      for (const t of ch.topics) {
        if (t.completionPct < 60) {
          candidates.push({ subj, chName: ch.chapterName, tName: t.topicName, pct: t.completionPct });
        }
      }
    }
  }
  candidates.sort((a, b) => a.pct - b.pct);

  for (const c of candidates) {
    if (chapAdded >= chapCap) break;
    const id = `chap-${c.subj}-${c.tName}`;
    if (tasks.some((t) => t.id === id)) continue;
    tasks.push({
      id,
      type:           "chapter",
      subject:        c.subj,
      topic:          c.tName,
      chapter:        c.chName,
      label:          c.tName,
      description:    `${c.chName} — only ${c.pct}% of questions attempted. Work through new questions to complete coverage.`,
      estimatedMin:   15,
      priority:       "medium",
      href:           "/practice",
      completedToday: completedIds.has(id),
    });
    chapAdded++;
  }

  // If nothing generated yet, add generic tasks per subject
  if (tasks.length === 0) {
    targetSubjects.slice(0, 2).forEach((subj, i) => {
      const id = `general-${subj}`;
      tasks.push({
        id,
        type:           "practice",
        subject:        subj,
        topic:          "General Practice",
        label:          `${subj} — General Practice`,
        description:    "Attempt mixed questions across topics to build speed and accuracy.",
        estimatedMin:   15,
        priority:       i === 0 ? "high" : "medium",
        href:           "/practice",
        completedToday: completedIds.has(id),
      });
    });
  }

  return tasks;
}

// ─── Setup form ───────────────────────────────────────────────────────────────

function SetupView({ onSave }: { onSave: (cfg: ExamConfig) => void }) {
  const [examName, setExamName] = useState("");
  const [subject,  setSubject]  = useState<ExamSubject>("All");
  const [examDate, setExamDate] = useState("");
  const [error,    setError]    = useState("");

  function handleSubmit() {
    if (!examName.trim()) { setError("Please enter an exam name."); return; }
    if (!examDate)        { setError("Please pick your exam date."); return; }
    if (examDate <= MIN_DATE) { setError("Exam date must be in the future."); return; }
    setError("");
    onSave({ examName: examName.trim(), subject, examDate, createdAt: new Date().toISOString() });
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-lg mx-auto px-5 pt-14 pb-6">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-slate-900">Exam Mode</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Set your exam date and get a smart daily study plan built around
            your weak spots, revision backlog, and unfinished chapters.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">

          {/* Exam name */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Exam name
            </label>
            <input
              type="text"
              placeholder="e.g. CBSE Board Class 10, JEE Mains…"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              Subjects to include
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["All", ...ALL_SUBJECTS] as ExamSubject[]).map((s) => {
                const cfg = s === "All" ? null : SUBJECTS[s];
                return (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      subject === s
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {cfg ? `${cfg.icon} ${s}` : "🌐 All Subjects"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exam date */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Exam date
            </label>
            <input
              type="date"
              min={MIN_DATE}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white font-bold text-sm py-3 rounded-xl"
          >
            🚀 Start Countdown
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({
  config,
  daysRemaining,
  tasks,
  subjectCompletion,
  onMarkDone,
  onClear,
}: {
  config:             ExamConfig;
  daysRemaining:      number;
  tasks:              ExamTask[];
  subjectCompletion:  Record<Subject, number>;
  onMarkDone:         (id: string) => void;
  onClear:            () => void;
}) {
  const urgency = getUrgency(daysRemaining);
  const uc      = urgencyColors(urgency);

  const done  = tasks.filter((t) => t.completedToday).length;
  const total = tasks.length;
  const allDone = done === total && total > 0;

  const totalMin = tasks
    .filter((t) => !t.completedToday)
    .reduce((s, t) => s + t.estimatedMin, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">EXAM MODE</p>
            <h1 className="text-lg font-bold text-slate-900 leading-snug mt-0.5 truncate">
              {config.examName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{fmtDate(config.examDate)}</p>
          </div>
          <button
            onClick={onClear}
            className="flex-shrink-0 text-[10px] font-semibold text-slate-400 border border-slate-200 rounded-xl px-2.5 py-1.5 hover:bg-slate-50 active:scale-95 transition-all mt-1"
          >
            ✕ Change
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">

        {/* ── Countdown hero ── */}
        <div
          className="rounded-2xl p-5 border text-center"
          style={{ background: uc.bg, borderColor: uc.border }}
        >
          <div
            className={`text-6xl font-black leading-none mb-1 ${urgency === "danger" ? "animate-pulse" : ""}`}
            style={{ color: uc.text }}
          >
            {daysRemaining}
          </div>
          <p className="text-sm font-bold" style={{ color: uc.text }}>
            {daysRemaining === 1 ? "Day remaining" : "Days remaining"}
          </p>
          <p className="text-xs mt-2 text-slate-600">{uc.label}</p>
        </div>

        {/* ── Subject progress rings ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
            Subject Coverage
          </p>
          <div className="flex justify-around">
            {ALL_SUBJECTS.map((subj) => {
              const cfg = SUBJECTS[subj];
              const pct = subjectCompletion[subj] ?? 0;
              return (
                <div key={subj} className="flex flex-col items-center gap-2">
                  <Ring pct={pct} color={cfg.color} size={64} stroke={6}>
                    <p className="text-xs font-bold" style={{ color: cfg.color }}>{pct}%</p>
                  </Ring>
                  <span className="text-[10px] font-semibold text-slate-500">{cfg.icon} {subj.slice(0, 4)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Today's Exam Tasks ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-slate-800">Today's Exam Tasks</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {done}/{total} done
                {totalMin > 0 ? ` · ~${totalMin} min remaining` : ""}
              </p>
            </div>
            <div
              className="text-xs font-semibold px-2.5 py-1 rounded-xl"
              style={
                allDone
                  ? { background: "#f0fdf4", color: "#16a34a" }
                  : { background: "#eef2ff", color: "#4f46e5" }
              }
            >
              {allDone ? "✓ All done!" : `${total - done} left`}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-3 mb-3 flex-wrap">
            {(["revision", "practice", "chapter"] as const).map((t) => {
              const m = TYPE_META[t];
              return (
                <span key={t} className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                  {m.label}
                </span>
              );
            })}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> High
            </span>
          </div>

          {allDone ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-sm font-bold text-emerald-700">All tasks done for today!</p>
              <p className="text-xs text-emerald-600 mt-1">Come back tomorrow for tomorrow's plan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onDone={onMarkDone} />
              ))}
            </div>
          )}
        </div>

        {/* ── Study tips by urgency ── */}
        {urgency !== "far" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Exam Strategy
            </p>
            <ul className="space-y-2">
              {urgency === "danger" && (
                <>
                  <li className="text-xs text-slate-600 flex gap-2"><span>🔴</span> Focus only on revision backlog and weak topics — no new material.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>⏱</span> Do 3 timed mock tests this week to build exam stamina.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>😴</span> Sleep 7–8 hours — memory consolidates during sleep.</li>
                </>
              )}
              {urgency === "warning" && (
                <>
                  <li className="text-xs text-slate-600 flex gap-2"><span>📋</span> Finish all weak topics first, then do revision cycles.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>📝</span> Attempt 1 past paper per week to track readiness.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>🔁</span> Use the Revision page daily for spaced repetition.</li>
                </>
              )}
              {urgency === "ok" && (
                <>
                  <li className="text-xs text-slate-600 flex gap-2"><span>🌱</span> Build strong foundations — focus on conceptual clarity first.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>📖</span> Cover 1–2 new topics per day alongside revision.</li>
                  <li className="text-xs text-slate-600 flex gap-2"><span>📊</span> Track progress weekly and adjust your plan accordingly.</li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExamMode() {
  const { config, saveConfig, clearConfig, daysRemaining, completedIds, markDone } = useExamMode();

  // Always call hooks (rules of hooks)
  const { getSubjectStats } = useProgress();
  const { getDueItems }     = useRevisionPlanner();
  const physChapters  = useChapterStats("Physics");
  const chemChapters  = useChapterStats("Chemistry");
  const mathChapters  = useChapterStats("Mathematics");

  const chapterMap: Record<Subject, ReturnType<typeof useChapterStats>> = {
    Physics:           physChapters,
    Chemistry:         chemChapters,
    Mathematics:       mathChapters,
    Biology:           [],
    Economics:         [],
    "Computer Science": [],
  };

  const targetSubjects: Subject[] = useMemo(() =>
    config?.subject === "All" || !config
      ? ALL_SUBJECTS
      : [config.subject as Subject],
    [config]
  );

  // Weak topics and accuracy maps per subject
  const weakTopicsMap  = useMemo(() => {
    const out: Record<Subject, string[]> = { Physics: [], Chemistry: [], Mathematics: [], Biology: [], Economics: [], "Computer Science": [] };
    for (const s of ALL_SUBJECTS) {
      out[s] = getSubjectStats(s).weakTopics;
    }
    return out;
  }, [getSubjectStats]);

  const accuracyMap = useMemo(() => {
    const out: Record<Subject, Record<string, number>> = { Physics: {}, Chemistry: {}, Mathematics: {}, Biology: {}, Economics: {}, "Computer Science": {} };
    for (const s of ALL_SUBJECTS) {
      const stats = getSubjectStats(s);
      for (const ts of stats.topicStats) {
        out[s][ts.topic] = ts.accuracy;
      }
    }
    return out;
  }, [getSubjectStats]);

  // Due revision items
  const dueItems = useMemo(() => getDueItems(
    ALL_SUBJECTS.flatMap((s) => weakTopicsMap[s])
  ), [getDueItems, weakTopicsMap]);

  // Subject completion pct (avg chapter completion)
  const subjectCompletion = useMemo(() => {
    const out: Record<Subject, number> = { Physics: 0, Chemistry: 0, Mathematics: 0, Biology: 0, Economics: 0, "Computer Science": 0 };
    for (const s of ALL_SUBJECTS) {
      const chapters = chapterMap[s];
      if (!chapters.length) { out[s] = 0; continue; }
      out[s] = Math.round(
        chapters.reduce((sum, ch) => sum + ch.completionPct, 0) / chapters.length
      );
    }
    return out;
  }, [physChapters, chemChapters, mathChapters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build today's task plan
  const tasks = useMemo(() => {
    if (!config) return [];
    return buildTasks(
      targetSubjects,
      weakTopicsMap,
      accuracyMap,
      dueItems,
      chapterMap,
      daysRemaining ?? 30,
      completedIds,
    );
  }, [config, targetSubjects, weakTopicsMap, accuracyMap, dueItems, daysRemaining, completedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) {
    return <SetupView onSave={saveConfig} />;
  }

  return (
    <Dashboard
      config={config}
      daysRemaining={daysRemaining ?? 0}
      tasks={tasks}
      subjectCompletion={subjectCompletion}
      onMarkDone={markDone}
      onClear={clearConfig}
    />
  );
}
