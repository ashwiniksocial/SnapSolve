import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const HISTORY_STORAGE_KEY = "snapsolve:student-navigation:v1";
const HISTORY_STATE_KEY = "__snapsolveStudentHistoryId";

export interface RouteEntry {
  id: number;
  href: string;
  scrollY: number;
}

export interface RouteHistory {
  entries: RouteEntry[];
  index: number;
  nextId: number;
}

export function canTravelHistory(history: RouteHistory, direction: "back" | "forward"): boolean {
  return direction === "back"
    ? history.index > 0
    : history.index < history.entries.length - 1;
}

export function resolveHistoryTargetIndex(
  history: RouteHistory,
  targetId: unknown,
  targetHref: string,
): number {
  const exact = history.entries.findIndex((entry) => entry.id === targetId);
  if (exact >= 0) return exact;
  if (history.index > 0 && history.entries[history.index - 1].href === targetHref) return history.index - 1;
  if (
    history.index < history.entries.length - 1 &&
    history.entries[history.index + 1].href === targetHref
  ) return history.index + 1;
  return -1;
}

let historyTraversalPending: string | null = null;

export function consumeHistoryTraversal(pathname: string): boolean {
  const pendingPath = historyTraversalPending;
  historyTraversalPending = null;
  return pendingPath === pathname ||
    (pathname !== "/" && pendingPath?.endsWith(`/${pathname.replace(/^\//, "")}`) === true);
}

function currentHref() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function normalizeHref(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const url = new URL(value, window.location.origin);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

function loadHistory(): RouteHistory | null {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(HISTORY_STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<RouteHistory>;
    if (
      !Array.isArray(candidate.entries) ||
      !Number.isInteger(candidate.index) ||
      !Number.isInteger(candidate.nextId) ||
      candidate.index! < 0 ||
      candidate.index! >= candidate.entries.length
    ) return null;
    const entries = candidate.entries.filter((entry): entry is RouteEntry =>
      !!entry &&
      Number.isInteger(entry.id) &&
      typeof entry.href === "string" &&
      Number.isFinite(entry.scrollY),
    );
    if (entries.length !== candidate.entries.length || entries.length === 0) return null;
    return { entries, index: candidate.index!, nextId: candidate.nextId! };
  } catch {
    return null;
  }
}

function saveHistory(history: RouteHistory) {
  try {
    sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Browser history remains usable if session storage is unavailable.
  }
}

function writeHistoryId(id: number) {
  try {
    const oldState = window.history.state;
    const state = oldState && typeof oldState === "object" ? oldState : {};
    window.history.replaceState(
      { ...state, [HISTORY_STATE_KEY]: id },
      "",
      currentHref(),
    );
  } catch {
    // Browser Back/Forward continues to work; buttons stay guarded by the tracked stack.
  }
}

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

export function isStudentFlow(path: string) {
  return /^\/(scan|practice|revision|exam|progress)(\/|$)/.test(path) ||
    path.startsWith("/solution");
}

export function shouldShowScrollControls(path: string, isScrollable: boolean) {
  return isScrollable && (path.startsWith("/practice") || path.startsWith("/solution"));
}

export default function FloatingPageNavigation() {
  const [location] = useLocation();
  const [isScrollable, setIsScrollable] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const historyRef = useRef<RouteHistory | null>(null);
  const scrollWriteTimer = useRef<number | null>(null);

  useEffect(() => {
    const route = currentHref();
    const saved = loadHistory();
    const stateId = (window.history.state as Record<string, unknown> | null)?.[HISTORY_STATE_KEY];
    const matchingSavedIndex = saved?.entries.findIndex((entry) => entry.id === stateId) ?? -1;
    let history: RouteHistory;

    if (saved && matchingSavedIndex >= 0 && saved.entries[matchingSavedIndex].href === route) {
      history = { ...saved, index: matchingSavedIndex };
    } else {
      history = { entries: [{ id: 1, href: route, scrollY: window.scrollY }], index: 0, nextId: 2 };
    }

    historyRef.current = history;
    saveHistory(history);
    writeHistoryId(history.entries[history.index].id);
    setCanGoBack(canTravelHistory(history, "back"));
    setCanGoForward(canTravelHistory(history, "forward"));

    const updateScrollPosition = () => {
      const current = historyRef.current;
      if (!current) return;
      current.entries[current.index].scrollY = window.scrollY;
      if (scrollWriteTimer.current !== null) window.clearTimeout(scrollWriteTimer.current);
      scrollWriteTimer.current = window.setTimeout(() => {
        if (historyRef.current) saveHistory(historyRef.current);
      }, 120);
    };

    const onPushState = (event: Event) => {
      const navigationEvent = event as Event & { arguments?: IArguments };
      const destination = normalizeHref(navigationEvent.arguments?.[2]) ?? currentHref();
      const current = historyRef.current;
      if (!current) return;

      current.entries[current.index].scrollY = window.scrollY;
      const entries = current.entries.slice(0, current.index + 1);
      const entry = { id: current.nextId, href: destination, scrollY: 0 };
      const next: RouteHistory = {
        entries: [...entries, entry],
        index: entries.length,
        nextId: current.nextId + 1,
      };
      historyRef.current = next;
      saveHistory(next);
      writeHistoryId(entry.id);
      setCanGoBack(next.index > 0);
      setCanGoForward(false);
    };

    const onReplaceState = (event: Event) => {
      const navigationEvent = event as Event & { arguments?: IArguments };
      const destination = normalizeHref(navigationEvent.arguments?.[2]) ?? currentHref();
      const current = historyRef.current;
      if (!current) return;
      current.entries[current.index].href = destination;
      saveHistory(current);
    };

    const onPopState = (event: PopStateEvent) => {
      historyTraversalPending = window.location.pathname;
      const current = historyRef.current;
      if (!current) return;
      const targetHref = currentHref();
      const targetId = (event.state as Record<string, unknown> | null)?.[HISTORY_STATE_KEY];
      const targetIndex = resolveHistoryTargetIndex(current, targetId, targetHref);

      if (targetIndex < 0) {
        const reset: RouteHistory = {
          entries: [{ id: current.nextId, href: targetHref, scrollY: 0 }],
          index: 0,
          nextId: current.nextId + 1,
        };
        historyRef.current = reset;
        saveHistory(reset);
        setCanGoBack(false);
        setCanGoForward(false);
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
        return;
      }

      current.index = targetIndex;
      historyRef.current = current;
      saveHistory(current);
      setCanGoBack(targetIndex > 0);
      setCanGoForward(targetIndex < current.entries.length - 1);
      const targetScrollY = current.entries[targetIndex].scrollY;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => window.scrollTo({ top: targetScrollY, behavior: "auto" }));
      });
    };

    const root = document.scrollingElement ?? document.documentElement;
    const updateScrollability = () => setIsScrollable(hasMeaningfulPageOverflow(root));
    const observer = new ResizeObserver(updateScrollability);
    const mutationObserver = new MutationObserver(updateScrollability);
    const shell = document.querySelector<HTMLElement>("[data-page-scroll-content]");

    observer.observe(root);
    if (document.body !== root) observer.observe(document.body);
    if (shell && shell !== root && shell !== document.body) observer.observe(shell);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updateScrollability);
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    window.addEventListener("pushState", onPushState);
    window.addEventListener("replaceState", onReplaceState);
    window.addEventListener("popstate", onPopState);
    const initialFrame = window.requestAnimationFrame(updateScrollability);
    const oldScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateScrollability);
      window.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("pushState", onPushState);
      window.removeEventListener("replaceState", onReplaceState);
      window.removeEventListener("popstate", onPopState);
      window.cancelAnimationFrame(initialFrame);
      if (scrollWriteTimer.current !== null) window.clearTimeout(scrollWriteTimer.current);
      window.history.scrollRestoration = oldScrollRestoration;
    };
  }, []);

  const scrollTo = (target: "top" | "middle" | "bottom") => {
    const { maxScrollTop } = getScrollMetrics();
    const top = target === "top" ? 0 : target === "middle" ? maxScrollTop / 2 : maxScrollTop;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (!isStudentFlow(location)) return null;

  return (
    <>
      <nav
        aria-label="Student history navigation"
        className="fixed right-3 bottom-[4.75rem] z-[100] flex min-w-[88px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur max-[360px]:right-1"
      >
        <div className="grid grid-cols-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={!canGoBack}
            aria-label="Go back"
            title="Go back in your in-app history"
            className="min-h-10 border-r border-slate-700 px-2 py-1.5 text-[10px] font-bold text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 max-[360px]:px-1"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => window.history.forward()}
            disabled={!canGoForward}
            aria-label="Go forward"
            title="Go forward in your in-app history"
            className="min-h-10 px-2 py-1.5 text-[10px] font-bold text-white transition enabled:hover:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 max-[360px]:px-1"
          >
            Forward →
          </button>
        </div>
      </nav>
      {shouldShowScrollControls(location, isScrollable) && (
        <nav
          aria-label="Page scroll controls"
          className="fixed left-3 bottom-[4.75rem] z-[100] grid grid-cols-3 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur max-[360px]:left-1"
        >
          <button
            type="button"
            onClick={() => scrollTo("top")}
            className="min-h-10 border-r border-slate-700 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 max-[360px]:px-1"
            aria-label="Scroll to top"
          >
            ↑ Top
          </button>
          <button
            type="button"
            onClick={() => scrollTo("middle")}
            className="min-h-10 border-r border-slate-700 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 max-[360px]:px-1"
            aria-label="Scroll to middle"
          >
            ↕ Middle
          </button>
          <button
            type="button"
            onClick={() => scrollTo("bottom")}
            className="min-h-10 px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 max-[360px]:px-1"
            aria-label="Scroll to bottom"
          >
            ↓ Bottom
          </button>
        </nav>
      )}
    </>
  );
}
