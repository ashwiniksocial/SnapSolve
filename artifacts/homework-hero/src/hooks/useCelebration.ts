import { useCallback } from "react";
import confetti from "canvas-confetti";

function playSuccessSound() {
  try {
    const ctx = new AudioContext();

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    });

    setTimeout(() => ctx.close(), 2000);
  } catch {
  }
}

function fireConfetti() {
  const defaults = {
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    ticks: 180,
    zIndex: 9999,
    colors: ["#a855f7", "#ec4899", "#f97316", "#facc15", "#22d3ee", "#4ade80"],
  };

  confetti({ ...defaults, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, origin: { x: 0.7, y: 0.6 } });

  setTimeout(() => {
    confetti({ ...defaults, particleCount: 30, origin: { x: 0.5, y: 0.5 }, startVelocity: 20 });
  }, 300);
}

export function useCelebration() {
  return useCallback(() => {
    fireConfetti();
    playSuccessSound();
  }, []);
}
