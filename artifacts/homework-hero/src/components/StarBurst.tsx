import { useEffect, useState } from "react";

interface Star {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

const EMOJIS = ["⭐", "🌟", "✨", "💫", "🎉", "🏆", "🎊", "❤️"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function StarBurst({ active }: { active: boolean }) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!active) return;

    const generated: Star[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      x: randomBetween(5, 95),
      delay: randomBetween(0, 0.6),
      size: randomBetween(1.2, 2.4),
      duration: randomBetween(1.2, 2.2),
    }));

    setStars(generated);

    const timer = setTimeout(() => setStars([]), 2500);
    return () => clearTimeout(timer);
  }, [active]);

  if (stars.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute bottom-20"
          style={{
            left: `${s.x}%`,
            fontSize: `${s.size}rem`,
            animation: `star-fly ${s.duration}s ease-out ${s.delay}s forwards`,
            opacity: 0,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  );
}
