const scrollTargets = {
  top: () => 0,
  middle: () => Math.max(0, (document.documentElement.scrollHeight - window.innerHeight) / 2),
  bottom: () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
};

export default function FloatingPageNavigation() {
  const scrollTo = (target: keyof typeof scrollTargets) => {
    window.scrollTo({ top: scrollTargets[target](), behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Page navigation"
      className="fixed right-3 bottom-20 sm:bottom-6 z-40 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur"
    >
      <button
        type="button"
        onClick={() => scrollTo("top")}
        className="min-h-10 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Scroll to top"
      >
        ↑ <span className="hidden sm:inline">Top</span>
      </button>
      <button
        type="button"
        onClick={() => scrollTo("middle")}
        className="min-h-10 border-y border-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Scroll to middle"
      >
        ↕ <span className="hidden sm:inline">Middle</span>
      </button>
      <button
        type="button"
        onClick={() => scrollTo("bottom")}
        className="min-h-10 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-label="Scroll to bottom"
      >
        ↓ <span className="hidden sm:inline">Bottom</span>
      </button>
    </nav>
  );
}