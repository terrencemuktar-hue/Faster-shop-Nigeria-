import React from "react";

export default function Header({ onNavigate }) {
  return (
    <header className="bg-black px-4 pt-3 pb-4 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center shadow-md">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white font-black text-xs">F</div>
          </div>
          <div>
            <h1 className="text-white font-black text-[15px] tracking-widest leading-none">FASTER</h1>
            <p className="text-gray-400 text-[9px] tracking-[3px]">SHOP NIGERIA</p>
          </div>
        </div>
        <div className="flex gap-4 items-center text-white text-lg">
          <button onClick={() => onNavigate("chat")} className="relative hover:opacity-80 transition cursor-pointer">
            <span className="text-2xl">💬</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-black"></span>
          </button>
          <button onClick={() => onNavigate("notifications")} className="text-yellow-400 hover:opacity-80 transition cursor-pointer text-2xl">
            🔔
          </button>
          <button onClick={() => onNavigate("settings")} className="hover:opacity-80 transition cursor-pointer text-2xl">
            ⚙️
          </button>
          <button onClick={() => onNavigate("cart")} className="hover:opacity-80 transition cursor-pointer text-2xl">
            👜
          </button>
        </div>
      </div>
      <div className="mt-3.5 bg-white rounded-full flex items-center px-4 py-2.5 shadow-sm">
        <span className="text-gray-400 mr-2">🔍</span>
        <input placeholder="Search" className="bg-transparent outline-none w-full text-sm text-black placeholder-gray-400" />
      </div>
    </header>
  );
}
