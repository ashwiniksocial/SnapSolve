import { Link } from "wouter";
import { Show, useUser } from "@clerk/react";
import {
  ArrowRight,
  BookOpen,
  Camera,
  ChartNoAxesColumnIncreasing,
  Check,
  ClipboardCheck,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import DailyFocus from "@/components/DailyFocus";
import DailyMission from "@/components/DailyMission";
import StudyScoreCard from "@/components/StudyScoreCard";

function HeaderAuth() {
  const { user } = useUser();
  const initial = (
    user?.firstName?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0] ??
    "U"
  ).toUpperCase();

  return (
    <>
      <Show when="signed-in">
        <Link
          href="/profile"
          data-testid="link-profile"
          aria-label="Open your profile"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#344b40] text-sm font-bold text-white transition-transform hover:scale-105"
        >
          {initial}
        </Link>
      </Show>
      <Show when="signed-out">
        <Link
          href="/sign-in"
          data-testid="link-sign-in"
          className="rounded-full border border-[#d8ded6] px-4 py-2 text-xs font-semibold text-[#344b40] transition-colors hover:bg-[#f1f3ed]"
        >
          Sign in
        </Link>
      </Show>
    </>
  );
}

const subjects: Subject[] = ["Mathematics", "Science", "Information Technology"];
const subjectMarks: Record<Subject, string> = {
  Mathematics: "M",
  Science: "S",
  Physics: "P",
  Chemistry: "C",
  Biology: "B",
  Economics: "E",
  "Computer Science": "CS",
  "Information Technology": "IT",
};

const studentActions = [
  {
    title: "Scan",
    detail: "Scan a question to get started",
    href: "/scan",
    icon: ScanLine,
    number: "01",
    tone: "bg-[#e6eee7] text-[#315746]",
  },
  {
    title: "Practice",
    detail: "Build skill, one question at a time",
    href: "/practice",
    icon: BookOpen,
    number: "02",
    tone: "bg-[#f5ead8] text-[#8d6027]",
  },
  {
    title: "Revision",
    detail: "Return to topics that need work",
    href: "/revision",
    icon: RotateCcw,
    number: "03",
    tone: "bg-[#e5edf0] text-[#3f6978]",
  },
  {
    title: "Exam",
    detail: "Put your learning to the test",
    href: "/exam",
    icon: ClipboardCheck,
    number: "04",
    tone: "bg-[#eee8f1] text-[#66516f]",
  },
  {
    title: "Report Card",
    detail: "See your progress across subjects",
    href: "/progress",
    icon: ChartNoAxesColumnIncreasing,
    number: "05",
    tone: "bg-[#f2e9e3] text-[#885e49]",
  },
];

export default function Home() {
  const { session, update } = useSession();
  const { streak, isTodayCompleted } = useStreak();
  const { totalSolved } = useProgress();

  return (
    <main className="min-h-[100dvh] bg-[#f5f4ef] pb-8 text-[#26362e]">
      <header className="border-b border-[#e3e4dc] bg-[#f9f8f3] px-5 pb-5 pt-8">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#718074]">Your study space</p>
            <h1 className="mt-1 font-serif text-[30px] font-semibold leading-none tracking-[-0.04em]">SnapSolve</h1>
            <p className="mt-2 text-xs text-[#718074]">Class 9 · Mathematics · Science · IT</p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div
                className="flex items-center gap-2 rounded-full border border-[#e0d7bd] bg-[#f2ead7] px-3 py-2"
                data-testid="status-home-streak"
                aria-label={`${streak} day study streak`}
              >
                <span className="text-xs font-bold tabular-nums text-[#8d6027]">{streak}</span>
                <span className="text-[10px] font-medium text-[#8d6027]">day streak</span>
              </div>
            )}
            <HeaderAuth />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-7 px-5 py-6">
        <section aria-label="Your study activity" className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Day streak", value: String(streak), note: "days", tone: "text-[#9a6a32]" },
            { label: "Questions", value: String(totalSolved), note: "solved", tone: "text-[#3d6954]" },
            { label: "Today", value: isTodayCompleted ? "Done" : "Not yet", note: "daily goal", tone: "text-[#52717c]" },
          ].map(({ label, value, note, tone }) => (
            <div
              key={label}
              data-testid={`metric-home-${label.toLowerCase().replaceAll(" ", "-")}`}
              className="rounded-2xl border border-[#e3e4dc] bg-[#fbfaf6] px-3 py-3.5"
            >
              <p className={`font-serif text-[23px] font-semibold leading-none tabular-nums ${tone}`}>{value}</p>
              <p className="mt-2 text-[11px] font-semibold text-[#39483f]">{label}</p>
              <p className="mt-0.5 text-[10px] text-[#8a9288]">{note}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="home-actions-heading">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79857a]">Pick up where you are</p>
              <h2 id="home-actions-heading" className="mt-1 font-serif text-[25px] font-semibold tracking-[-0.03em]">What are we working on?</h2>
            </div>
            <Camera aria-hidden="true" className="mb-1 h-5 w-5 text-[#8a968b]" strokeWidth={1.7} />
          </div>
          <div className="overflow-hidden rounded-[22px] border border-[#e0e2d9] bg-[#fbfaf6]">
            {studentActions.map(({ title, detail, href, icon: Icon, number, tone }, index) => (
              <Link
                key={title}
                href={href}
                data-testid={`link-action-${title.toLowerCase().replaceAll(" ", "-")}`}
                aria-label={`${title}: ${detail}`}
                className={`group flex min-h-[76px] items-center gap-3.5 px-4 py-3 transition-colors hover:bg-[#f2f3ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#557664] ${index < studentActions.length - 1 ? "border-b border-[#e8e9e2]" : ""}`}
              >
                <span className="w-6 font-mono text-[10px] text-[#9aa197]">{number}</span>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[14px] ${tone}`}>
                  <Icon aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#2c3c32]">{title}</span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#7b877d]">{detail}</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#a1a99f] transition-transform group-hover:translate-x-1 group-hover:text-[#42634f]" />
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="subject-heading">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79857a]">Set your focus</p>
              <h2 id="subject-heading" className="mt-1 font-serif text-[22px] font-semibold tracking-[-0.03em]">Choose a subject</h2>
            </div>
            <span className="text-[10px] font-medium text-[#889188]">Current session</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {subjects.map((subject) => {
              const config = SUBJECTS[subject];
              const isActive = session.subject === subject;
              return (
                <button
                  key={subject}
                  type="button"
                  data-testid={`button-subject-${subject.toLowerCase().replaceAll(" ", "-")}`}
                  aria-pressed={isActive}
                  onClick={() => update({ subject })}
                  className={`relative min-h-[92px] rounded-2xl border px-3 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664] ${isActive ? "bg-[#e8eee7] shadow-sm" : "border-[#e1e3db] bg-[#fbfaf6] hover:bg-white"}`}
                  style={isActive ? { borderColor: config.color } : {}}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 min-w-8 w-fit place-items-center rounded-[10px] px-1.5 font-mono text-[10px] font-bold"
                    style={{ color: config.color, backgroundColor: config.light }}
                  >
                    {subjectMarks[subject]}
                  </span>
                  <span className="mt-2 block text-[11px] font-semibold leading-tight text-[#39483f]">{subject}</span>
                  {isActive && <Check aria-hidden="true" className="absolute right-2.5 top-2.5 h-3.5 w-3.5" style={{ color: config.color }} />}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-label="Study overview" className="space-y-4">
          <DailyMission />
          <StudyScoreCard />
          <DailyFocus />
        </section>
      </div>
    </main>
  );
}
