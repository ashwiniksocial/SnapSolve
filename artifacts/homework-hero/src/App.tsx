import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import Home from "@/pages/Home";
import Challenge from "@/pages/Challenge";
import Progress from "@/pages/Progress";

function Nav() {
  const [location] = useLocation();

  const links = [
    { to: "/", label: "🏠 Home" },
    { to: "/challenge", label: "⭐ Challenge" },
    { to: "/progress", label: "🔥 Progress" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-purple-300 shadow-lg">
      <div className="max-w-md mx-auto flex justify-around py-2">
        {links.map(({ to, label }) => (
          <Link key={to} href={to}>
            <button
              className={`flex flex-col items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
                ${location === to
                  ? "bg-purple-500 text-white scale-105 shadow-md"
                  : "text-purple-400 hover:bg-purple-100"}`}
            >
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
      <div className="pb-20">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/challenge" component={Challenge} />
          <Route path="/progress" component={Progress} />
        </Switch>
      </div>
      <Nav />
    </>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
