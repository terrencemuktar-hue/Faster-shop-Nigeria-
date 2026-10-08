import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

const storyReels = [
  { name: "Aura Lagos", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
  { name: "Kano Crafts", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400" },
  { name: "Lekki Thr...", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400" }
];

const carouselImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=800",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800",
  "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800"
];

export default function HomePage({ onNavigate }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />

      {/* Vendor Story Reels */}
      <div className="bg-[#262626] py-3 px-4 border-b border-zinc-800">
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {storyReels.map((reel, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer" onClick={() => onNavigate("shop")}>
              <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-emerald-400">
                <img src={reel.img} alt={reel.name} className="w-full h-full object-cover rounded-full border-2 border-black" />
              </div>
              <span className="text-[11px] text-zinc-300 font-medium truncate max-w-[64px]">{reel.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Drops Carousel */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-black text-base">Featured Drops</h2>
          <button onClick={() => onNavigate("shop")} className="text-xs text-[#22c55e] font-bold hover:underline">
            See All
          </button>
        </div>

        <div className="relative h-[380px] rounded-[24px] overflow-hidden border border-gray-200 bg-white shadow-sm">
          <img
            src={carouselImages[currentIdx]}
            alt="Outfit"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 space-y-2">
            <span className="bg-[#22c55e] text-black font-extrabold px-3 py-1 rounded-full text-xs w-max">
              MODELS 20S, 20S
            </span>
            <h3 className="text-white text-xl font-bold">Nigeria's Fastest Fashion Market</h3>
            <div className="flex gap-2 pt-1">
              <button onClick={() => onNavigate("vendor")} className="bg-[#22c55e] text-black font-bold px-4 py-2.5 rounded-[16px] text-xs cursor-pointer">
                Become a Vendor
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 right-5 flex gap-1.5">
            {carouselImages.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentIdx ? "bg-[#22c55e] w-5" : "bg-white/50"} transition-all`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
