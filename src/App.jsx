import React, { useState } from "react";
import { Home, ShoppingBag, Search, Heart, User, Store } from "lucide-react";
import HomePage from "./pages/HomePage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-[#22c55e] selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur border-b border-[#222222] px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-9 h-9 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-center text-[#22c55e] font-black shadow-md">
              🛍️
            </div>
            <div>
              <span className="font-black tracking-wider text-base text-white block">FASTER</span>
              <span className="text-[10px] text-zinc-400 font-semibold tracking-widest block -mt-1">SHOP NIGERIA</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("vendor")}
              className="bg-[#22c55e] text-black text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#22c55e]/10 hover:opacity-90 transition"
            >
              <Store size={14} /> Vendor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "home" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "shop" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "vendor" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "search" && (
          <div className="max-w-6xl mx-auto p-6 text-center text-zinc-400">Search marketplace coming soon...</div>
        )}
        {activeTab === "wishlist" && (
          <div className="max-w-6xl mx-auto p-6 text-center text-zinc-400">Your wishlist is empty.</div>
        )}
        {activeTab === "profile" && (
          <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="bg-[#111111] border border-[#222222] p-5 rounded-2xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-black border border-[#222222] flex items-center justify-center font-bold text-lg text-[#22c55e]">
                NT
              </div>
              <div>
                <h2 className="font-bold text-lg">Nwezeh Terrence Uche</h2>
                <p className="text-xs text-zinc-400">terrencemuktar@gmail.com</p>
                <span className="inline-block mt-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  VIP SHOPPER & CREATOR
                </span>
              </div>
            </div>
            <div className="bg-[#111111] border border-[#222222] rounded-2xl p-4 space-y-3">
              <div className="bg-black border border-[#222222] p-4 rounded-xl space-y-2">
                <span className="bg-pink-500/20 text-pink-400 text-[10px] font-bold px-2 py-0.5 rounded">PARTNER PROGRAM</span>
                <h3 className="font-bold text-base">Are you a fashion designer or vendor in Nigeria?</h3>
                <p className="text-xs text-zinc-400">Open your Instagram-style storefront on Faster Shop. List your products and get direct WhatsApp orders.</p>
                <button
                  onClick={() => setActiveTab("vendor")}
                  className="w-full bg-[#22c55e] text-black font-bold py-2.5 rounded-xl text-xs mt-2"
                >
                  REGISTER YOUR BRAND
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#000000]/95 backdrop-blur border-t border-[#222222] py-2.5 px-6">
        <div className="max-w-md mx-auto flex justify-between items-center text-xs font-medium">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "home" ? "text-[#22c55e]" : "text-zinc-400 hover:text-white"}`}
          >
            <Home size={18} /> Home
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "shop" ? "text-[#22c55e]" : "text-zinc-400 hover:text-white"}`}
          >
            <ShoppingBag size={18} /> Shop
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "search" ? "text-[#22c55e]" : "text-zinc-400 hover:text-white"}`}
          >
            <Search size={18} /> Search
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "wishlist" ? "text-[#22c55e]" : "text-zinc-400 hover:text-white"}`}
          >
            <Heart size={18} /> Wishlist
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 transition ${activeTab === "profile" ? "text-[#22c55e]" : "text-zinc-400 hover:text-white"}`}
          >
            <User size={18} /> Profile
          </button>
        </div>
      </nav>
    </div>
  );
}
