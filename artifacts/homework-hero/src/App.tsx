import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import Home from "@/pages/Home";
import Scan from "@/pages/Scan";
import Solution from "@/pages/Solution";
import Practice from "@/pages/Practice";
import Progress from "@/pages/Progress";
import QuestionWorkspace from "@/pages/Challenge";
import History from "@/pages/History";
import Journal from "@/pages/Journal";
import Revision from "@/pages/Revision";

const NAV = [
  { to: "/",          icon: "⊞",  label: "Home"     },
  { to: "/scan",      icon: "⊕",  label: "Scan"     },
  { to: "/revision",  icon: "↺",  label: "Revision" },
  { to: "/practice",  icon: "✎",  label: "Practice" },
  { to: "/progress",  icon: "◈",  label: "Progress" },
  { to: "/journal",   icon: "✗",  label: "Journal"  },
];

function BottomNav() {
  const [location] = useLocation();
  const active = (path: string) =>
    path === "/" ? location === "/" : location.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-sm">
      <div className="max-w-lg mx-auto flex justify-around py-1.5">
        {NAV.map(({ to, icon, label }) => (
          <Link key={to} href={to}>
            <button
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-semibold transition-all
                ${active(to)
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"}`}
            >
              <span className={`text-lg leading-none mb-0.5 ${active(to) ? "scale-110" : ""} transition-transform`}>
                {icon}
              </span>
              {label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <div className="pb-20 min-h-screen">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/scan" component={Scan} />
          <Route path="/solution" component={Solution} />
          <Route path="/challenge" component={QuestionWorkspace} />
          <Route path="/practice" component={Practice} />
          <Route path="/progress" component={Progress} />
          <Route path="/history" component={History} />
          <Route path="/journal" component={Journal} />
          <Route path="/revision" component={Revision} />
        </Switch>
      </div>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}
