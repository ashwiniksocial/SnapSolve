import { useEffect, useState } from "react";

function getScrollMetrics() {
  const root = document.scrollingElement ?? document.documentElement;
  return {
    maxScrollTop: Math.max(0, root.scrollHeight - root.clientHeight),
  };
}

function hasMeaningfulPageOverflow(root: Element) {
  const shell = document.querySelector<HTMLElement>("[data-page-scroll-content]");
  if (!shell) return root.scrollHeight > root.clientHeight + 1;

  const styles = window.getComputedStyle(shell);
  const layoutReserve = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const contentHeight = Math.max(shell.scrollHeight, root.scrollHeight) - layoutReserve;
  return contentHeight > root.clientHeight + 1;
}

export default function FloatingPageNavigation() {
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const root = document.scrollingElement ?? document.documentElement;
    const updateScrollability = () => {
      setIsScrollable(hasMeaningfulPageOverflow(root));
    };
    const observer = new ResizeObserver(updateScrollability);
    const mutationObserver = new MutationObserver(updateScrollability);
    const shell = document.querySelector<HTMLElement>("[data-page-scroll-content]");

    observer.observe(root);
    if (document.body !== root) observer.observe(document.body);
    if (shell && shell !== root && shell !== document.body) observer.observe(shell);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updateScrollability);
    const initialFrame = window.requestAnimationFrame(updateScrollability);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateScrollability);
      window.cancelAnimationFrame(initialFrame);
    };
  }, []);

  const scrollTo = (target: "top" | "middle" | "bottom") => {
    const { maxScrollTop } = getScrollMetrics();
    const top = target === "top"
      ? 0
      : target === "middle"
        ? maxScrollTop / 2
        : maxScrollTop;

    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!isScrollable) return null;

  return (
    <nav
      aria-label="Page navigation"
      className="fixed right-3 bottom-[4.75rem] z-[100] flex min-w-[76px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur"
    >
      <button
        type="button"
        onClick={() => scrollTo("top")}
        className="min-h-10 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label="Scroll to top"
      >
        ↑ Top
      </button>
      <button
        type="button"
        onClick={() => scrollTo("middle")}
        className="min-h-10 border-y border-slate-700 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label="Scroll to middle"
      >
        ↕ Middle
      </button>
      <button
        type="button"
        onClick={() => scrollTo("bottom")}
        className="min-h-10 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label="Scroll to bottom"
      >
        ↓ Bottom
      </button>
    </nav>
  );
}