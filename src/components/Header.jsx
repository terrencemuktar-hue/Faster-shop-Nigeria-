import React from "react";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur border-b border-[#222222] p-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("home")}>
        <div className="w-8 h-8 bg-[#22c55e] rounded-full flex items-center justify-center font-black text-black shadow-md shadow-[#22c55e]/20">
          F
        </div>
        <h1 className="font-black text-lg md:text-xl tracking-tight text-white">
          FASTER SHOP <span className="text-[#22c55e]">NIGERIA</span>
        </h1>
      </div>
      <div className="flex gap-4 items-center text-white">
        <button 
          onClick={() => setActiveTab("shop")} 
          className={`text-sm font-medium hover:text-[#22c55e] transition ${activeTab === "shop" ? "text-[#22c55e]" : "text-zinc-300"}`}
        >
          Shop
        </button>
        <button 
          onClick={() => setActiveTab("cart")} 
          className="text-sm font-medium hover:text-[#22c55e] transition"
        >
          🛒
        </button>
        <button 
          onClick={() => setActiveTab("profile")} 
          className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${activeTab === "profile" ? "bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]" : "bg-[#111111] border-[#222222] text-zinc-300 hover:text-white"}`}
        >
          👤
        </button>
      </div>
    </header>
  );
}
