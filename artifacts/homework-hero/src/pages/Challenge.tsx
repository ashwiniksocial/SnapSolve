import { useState } from "react";
import { Link } from "wouter";
import { getTodaysChallenge } from "@/data/challenges";
import { useStreak } from "@/hooks/useStreak";

export default function Challenge() {
  const challenge = getTodaysChallenge();
  const { streak, isTodayCompleted, completeToday } = useStreak();

  const [found, setFound] = useState<boolean[]>(() =>
    Array(challenge.items.length).fill(isTodayCompleted)
  );
  const [justCompleted, setJustCompleted] = useState(false);

  const done = isTodayCompleted || justCompleted;

  const toggleItem = (i: number) => {
    if (done) return;
    const next = [...found];
    next[i] = !next[i];
    setFound(next);
  };

  const allFound = found.every(Boolean);

  const handleMarkDone = () => {
    setFound(Array(challenge.items.length).fill(true));
    completeToday();
    setJustCompleted(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{ background: "linear-gradient(135deg, #fff7e6 0%, #ffe4e1 50%, #e6f3ff 100%)" }}
    >
      <div className="pop-in w-full max-w-sm flex flex-col gap-6">

        <div className="text-center">
          <div className="text-6xl mb-2 wiggle inline-block">{challenge.emoji}</div>
          <div className="mb-1">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{ background: challenge.color }}
            >
              {challenge.category}
            </span>
          </div>
          <h1 className="text-4xl font-black mt-2" style={{ color: challenge.color, textShadow: `2px 2px 0px ${challenge.shadowColor}` }}>
            {challenge.title}
          </h1>
          <div className="mt-1 inline-block bg-orange-100 text-orange-600 font-bold px-4 py-1 rounded-full text-sm border-2 border-orange-300">
            Today's Challenge
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center justify-center gap-2 bg-white rounded-2xl border-2 border-amber-300 px-4 py-2 shadow-sm">
            <span className="text-2xl">🔥</span>
            <span className="font-black text-amber-600">{streak} day streak!</span>
          </div>
        )}

        <div
          className="bg-white rounded-3xl border-4 p-6 text-center shadow-lg"
          style={{ borderColor: challenge.shadowColor, boxShadow: `0 6px 0 ${challenge.shadowColor}` }}
        >
          <div className="text-5xl mb-3">{challenge.emoji}</div>
          <p className="text-xl font-black leading-snug" style={{ color: challenge.color }}>
            {challenge.description}
          </p>
        </div>

        {done && !justCompleted && (
          <div className="bg-green-100 rounded-3xl border-4 border-green-400 p-4 text-center">
            <div className="text-3xl mb-1">✅</div>
            <p className="font-black text-green-700 text-lg">Already done today!</p>
            <p className="text-green-600 font-bold text-sm mt-1">Come back tomorrow for a new challenge.</p>
          </div>
        )}

        {!done && (
          <div className="bg-white rounded-3xl border-4 border-yellow-300 p-4 shadow-md">
            <p className="text-center font-black text-yellow-700 mb-3 text-base">Tap each one when you find it!</p>
            <div className="flex flex-col gap-2">
              {challenge.items.map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleItem(i)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-left text-base transition-all duration-200 active:scale-95 border-2
                    ${found[i]
                      ? "bg-green-100 border-green-400 text-green-700"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-yellow-50 hover:border-yellow-300"}`}
                >
                  <span className="text-2xl">{found[i] ? "✅" : challenge.emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {justCompleted && (
          <div
            className="pop-in text-center rounded-3xl p-6 border-4 border-purple-400"
            style={{ background: "linear-gradient(135deg, #f0e6ff, #ffe6f9)" }}
          >
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-black text-purple-700 text-xl">Challenge Complete!</p>
            <p className="text-purple-500 font-bold mt-1">
              🔥 Streak: {streak} {streak === 1 ? "day" : "days"}! +10 XP earned!
            </p>
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
            onClick={handleMarkDone}
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
