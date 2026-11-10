import { useMemo } from "react";
import "./ClothesRain.css";

const CLOTHES = [
  "👕", "👗", "👖", "🧥", "👚", "🧣", "👙", "🩱", "🩲", "👔", "🧢", "👒", "🎩",
  "👟", "👠", "👡", "👜", "🎒", "👓", "🕶️", "💄", "⌚", "🧦", "👘", "🥻"
];

export default function ClothesRain() {
  const items = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      emoji: CLOTHES[Math.floor(Math.random() * CLOTHES.length)],
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 5 + Math.random() * 6,
      size: 28 + Math.random() * 38,
      rotate: -30 + Math.random() * 60,
      sway: Math.random() * 40,
    }));
  }, []);

  return (
    <div className="clothes-stage">
      {items.map((it) => (
        <span
          key={it.id}
          className="falling-cloth"
          style={{
            left: `${it.left}%`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
            fontSize: `${it.size}px`,
            "--rotate": `${it.rotate}deg`,
            "--sway": `${it.sway}px`,
          }}
        >
          {it.emoji}
        </span>
      ))}
      {/* pile at bottom */}
      <div className="clothes-pile">
        <span>👕 👗 🧥 👖 🧢 👟 👜 👙 🩲 👚</span>
        <span>👠 🧣 👒 🎒 👔 🩱 🧦 👘 🕶️</span>
      </div>
      <div className="floor-glow" />
    </div>
  );
}