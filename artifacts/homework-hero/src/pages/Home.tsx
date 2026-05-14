import { Link } from "wouter";
import { getTodaysChallenge } from "@/data/challenges";

export default function Home() {
  const challenge = getTodaysChallenge();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #ffe8f7 40%, #e8f4ff 100%)" }}>

      <div className="pop-in flex flex-col items-center gap-6 max-w-sm w-full">

        <div className="bounce-slow text-8xl select-none">🦸</div>

        <div className="text-center">
          <h1 className="text-5xl font-black tracking-tight"
            style={{ color: "#8b2fdc", textShadow: "3px 3px 0px #e0b0ff" }}>
            Snap Solve
          </h1>
          <p className="mt-2 text-lg font-bold text-purple-400">Your daily learning adventure!</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-lg border-4 border-yellow-300 p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{challenge.emoji}</span>
            <div>
              <p className="font-black text-purple-700 text-base leading-tight">{challenge.title}</p>
              <span className="text-xs font-bold text-purple-400 bg-purple-100 px-2 py-0.5 rounded-full">
                {challenge.category}
              </span>
            </div>
          </div>
          <p className="text-purple-600 font-bold text-sm mt-1">{challenge.description}</p>
        </div>

        <Link href="/challenge" className="w-full">
          <button
            className="w-full py-5 rounded-3xl text-xl font-black text-white shadow-lg active:scale-95 transition-all duration-150"
            style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              boxShadow: "0 6px 0 #7c3aed",
            }}
          >
            🚀 Start Today's Challenge
          </button>
        </Link>

        <div className="flex gap-4 w-full">
          <Link href="/progress" className="flex-1">
            <button
              className="w-full py-3 rounded-2xl text-base font-black text-white shadow-md active:scale-95 transition-all duration-150"
              style={{
                background: "linear-gradient(135deg, #f97316, #facc15)",
                boxShadow: "0 4px 0 #c2410c",
              }}
            >
              🔥 My Streak
            </button>
          </Link>
          <div
            className="flex-1 py-3 rounded-2xl text-base font-black text-white shadow-md text-center"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #6366f1)",
              boxShadow: "0 4px 0 #0e7490",
            }}
          >
            ⭐ Level 3
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          {["🌟", "🏅", "🎯", "💡", "🎉"].map((emoji, i) => (
            <span key={i} className="text-2xl" style={{ animationDelay: `${i * 0.3}s` }}>
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
