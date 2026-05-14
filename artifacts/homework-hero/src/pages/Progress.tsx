export default function Progress() {
  const streak = 3;
  const totalXP = 130;
  const badges = [
    { emoji: "🔍", label: "Explorer", earned: true },
    { emoji: "🌟", label: "Star", earned: true },
    { emoji: "🎯", label: "Sharp Eye", earned: true },
    { emoji: "🏆", label: "Champion", earned: false },
    { emoji: "🚀", label: "Rocket", earned: false },
    { emoji: "🦸", label: "Hero", earned: false },
  ];

  const history = [
    { day: "Mon", done: true },
    { day: "Tue", done: true },
    { day: "Wed", done: true },
    { day: "Thu", done: false },
    { day: "Fri", done: false },
    { day: "Sat", done: false },
    { day: "Sun", done: false },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-10"
      style={{ background: "linear-gradient(135deg, #fff0f9 0%, #f0f4ff 60%, #fffde6 100%)" }}
    >
      <div className="pop-in w-full max-w-sm flex flex-col gap-6">

        <div className="text-center">
          <div className="text-6xl mb-2 bounce-slow inline-block">🔥</div>
          <h1 className="text-4xl font-black" style={{ color: "#d97706", textShadow: "2px 2px 0px #fde68a" }}>
            My Progress
          </h1>
          <p className="text-amber-500 font-bold mt-1">Keep it up, hero!</p>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-amber-300 p-6 text-center shadow-lg"
          style={{ boxShadow: "0 6px 0 #f59e0b" }}
        >
          <p className="text-lg font-black text-amber-600 uppercase tracking-wide mb-1">Current Streak</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-7xl font-black" style={{ color: "#ef4444" }}>{streak}</span>
            <div className="text-left">
              <div className="text-4xl leading-none">🔥</div>
              <div className="font-black text-amber-500 text-lg">days</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all
                  ${i < streak ? "bg-orange-400 text-white shadow-md scale-105" : "bg-gray-100 text-gray-300"}`}
              >
                {i < streak ? "🔥" : "○"}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-amber-400 font-bold">4 more days to unlock a badge!</p>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-purple-300 p-5 shadow-lg"
          style={{ boxShadow: "0 6px 0 #a855f7" }}
        >
          <p className="text-center font-black text-purple-600 text-lg mb-3">This Week</p>
          <div className="flex justify-between gap-1">
            {history.map(({ day, done }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border-2 transition-all
                    ${done
                      ? "bg-green-400 border-green-500 text-white shadow-md"
                      : "bg-gray-100 border-gray-200 text-gray-400"}`}
                >
                  {done ? "✓" : "·"}
                </div>
                <span className="text-xs font-bold text-gray-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-blue-300 p-5 shadow-lg"
          style={{ boxShadow: "0 6px 0 #3b82f6" }}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-black text-blue-600 text-lg">Total XP</p>
            <span className="font-black text-blue-500 text-2xl">{totalXP} ⚡</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-4 border-2 border-blue-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(totalXP / 200) * 100}%`,
                background: "linear-gradient(90deg, #60a5fa, #a855f7)",
              }}
            />
          </div>
          <p className="text-xs font-bold text-blue-400 mt-1 text-right">{totalXP}/200 XP to Level 4</p>
        </div>

        <div
          className="bg-white rounded-3xl border-4 border-pink-300 p-5 shadow-lg"
          style={{ boxShadow: "0 6px 0 #ec4899" }}
        >
          <p className="text-center font-black text-pink-600 text-lg mb-3">My Badges</p>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(({ emoji, label, earned }) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all
                  ${earned
                    ? "bg-gradient-to-b from-yellow-50 to-orange-50 border-yellow-300 shadow-md"
                    : "bg-gray-50 border-gray-200 opacity-40"}`}
              >
                <span className={`text-3xl ${!earned ? "grayscale" : ""}`}>{emoji}</span>
                <span className={`text-xs font-black ${earned ? "text-amber-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-2xl font-black text-purple-400">You're amazing! 🌈</p>
        </div>
      </div>
    </div>
  );
}
