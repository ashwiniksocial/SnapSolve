import { useState, useEffect } from "react";
import { getSecondsUntilMidnight } from "@/data/challenges";

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function useCountdown(): string {
  const [display, setDisplay] = useState(() => formatCountdown(getSecondsUntilMidnight()));

  useEffect(() => {
    const tick = () => setDisplay(formatCountdown(getSecondsUntilMidnight()));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}
