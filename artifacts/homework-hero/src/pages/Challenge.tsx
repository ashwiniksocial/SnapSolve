import { useState } from "react";
import { Link } from "wouter";

export default function Challenge() {
  const [done, setDone] = useState(false);
  const [found, setFound] = useState<boolean[]>([false, false, false]);

  const toggleItem = (i: number) => {
    const next = [...found];
    next[i] = !next[i];
    setFound(next);
    if (next.every(Boolean)) setDone(true);
  };

  const allFound = found.every(Boolean);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{ background: "linear-gradient(135deg, #fff7e6 0%, #ffe4e1 50%, #e6f3ff 100%)" }}
    >
      <div className="pop-in w-full max-w-sm flex flex-col gap-6">

        <div className="text-center">
          <div className="text-6xl mb-2 wiggle inline-block">🔍</div>
          <h1 className="text-4xl font-black" style={{ color: "#e05d10", textShadow: "2px 2px 0px #ffd6b0" }}>
            Today's Challenge
          </h1>
          <div className="mt-1 inline-block bg-orange-100 text-orange-600 font-bold px-4 py-1 rounded-full text-sm border-2 border-orange-300">
            Wednesday · Day 3
          </div>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-orange-300 p-6 text-center shadow-lg"
          style={{ boxShadow: "0 6px 0 #fb923c" }}
        >
          <div className="text-5xl mb-3">⭕</div>
          <p className="text-xl font-black text-orange-700 leading-snug">
            Find 3 objects in your room shaped like circles.
          </p>
        </div>

        <div className="bg-white rounded-3xl border-4 border-yellow-300 p-4 shadow-md">
          <p className="text-center font-black text-yellow-700 mb-3 text-base">Tap each one when you find it!</p>
          <div className="flex flex-col gap-2">
            {["Circle object 1", "Circle object 2", "Circle object 3"].map((label, i) => (
              <button
                key={i}
                onClick={() => toggleItem(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-left text-base transition-all duration-200 active:scale-95 border-2
                  ${found[i]
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-yellow-50 hover:border-yellow-300"}`}
              >
                <span className="text-2xl">{found[i] ? "✅" : "⭕"}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {allFound && !done && (
          <div className="pop-in bg-green-100 rounded-3xl border-4 border-green-400 p-4 text-center">
            <div className="text-4xl mb-1">🎉</div>
            <p className="font-black text-green-700 text-lg">All found! Great job!</p>
          </div>
        )}

        {done && (
          <div
            className="pop-in text-center rounded-3xl p-6 border-4 border-purple-400"
            style={{ background: "linear-gradient(135deg, #f0e6ff, #ffe6f9)" }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-black text-purple-700 text-xl">Challenge Complete!</p>
            <p className="text-purple-500 font-bold mt-1">You earned +10 XP!</p>
            <Link href="/progress">
              <button
                className="mt-4 px-6 py-3 rounded-2xl font-black text-white text-base active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 4px 0 #7c3aed" }}
              >
                See My Progress 🔥
              </button>
            </Link>
          </div>
        )}

        {!done && (
          <button
            onClick={() => { setFound([true, true, true]); setDone(true); }}
            className="w-full py-4 rounded-3xl font-black text-white text-lg active:scale-95 transition-all"
            style={{
              background: allFound
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : "linear-gradient(135deg, #a855f7, #ec4899)",
              boxShadow: allFound ? "0 5px 0 #15803d" : "0 5px 0 #7c3aed",
            }}
          >
            {allFound ? "✅ Mark as Done!" : "🌟 I Found Them All!"}
          </button>
        )}

        <div className="flex justify-center gap-2 text-2xl">
          {["⭐", "🎯", "💪", "🌈"].map((e, i) => <span key={i}>{e}</span>)}
        </div>
      </div>
    </div>
  );
}
