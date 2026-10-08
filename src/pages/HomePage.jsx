import React, { useState, useEffect } from "react";
import { ArrowRight, Store, ShieldCheck, Sparkles, ShoppingBag } from "lucide-react";

const carouselImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
];

const categories = [
  { name: "Streetwear", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
  { name: "Native", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
  { name: "Gowns", img: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc" },
  { name: "Shoes", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c" },
  { name: "Bags", img: "https://images.unsplash.com/photo-1551232864-3f0890e580d9" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b" }
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
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-6xl mx-auto p-4 pt-6">
        <div className="relative h-[380px] rounded-2xl overflow-hidden border border-zinc-800">
          <img src={carouselImages[currentIdx]} alt="Fashion Outfit" className="w-full h-full object-cover transition-all duration-700 brightness-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 space-y-3">
            <span className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 px-3 py-1 rounded-full text-xs font-semibold w-max">
              🔥 Nigeria's Fastest Fashion Market
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Be the first vendor. 0 followers needed</h1>
            <p className="text-zinc-300 text-sm max-w-lg">List your fashion items instantly and receive direct orders on WhatsApp with zero stress.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => onNavigate("vendor")} className="bg-[#22c55e] text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition">
                <Store size={18} /> Become a Vendor Now
              </button>
              <button onClick={() => onNavigate("shop")} className="border border-white/20 bg-white/10 backdrop-blur font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
                Shop Now
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {carouselImages.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentIdx ? "bg-[#22c55e] w-6" : "bg-white/40"} transition-all duration-300`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">How Faster Shop Works</h2>
          <p className="text-zinc-400 text-sm">Start selling or shopping in 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center font-bold">1</div>
            <h3 className="font-semibold text-lg">Register as Vendor</h3>
            <p className="text-zinc-400 text-sm">Zero follower requirement. Quick signup gets your digital store ready instantly.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center font-bold">2</div>
            <h3 className="font-semibold text-lg">Post Your Outfits</h3>
            <p className="text-zinc-400 text-sm">Upload photos, set prices, and categorize your clothing items with ease.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center font-bold">3</div>
            <h3 className="font-semibold text-lg">Get Orders on WhatsApp</h3>
            <p className="text-zinc-400 text-sm">Buyers order directly through WhatsApp with delivery and payment secured.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-6 space-y-6">
        <h2 className="text-xl font-bold">Categories to Explore</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div key={i} onClick={() => onNavigate("shop")} className="group relative h-40 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-75" />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <span className="font-semibold text-sm">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
