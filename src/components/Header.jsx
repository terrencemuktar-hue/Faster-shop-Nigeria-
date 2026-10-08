import React from "react";

export default function Header({ onNavigate }) {
  return (
    <header className="bg-black px-4 pt-3 pb-4 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center">
        {/* EXACT BRAND LOGO */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-10 h-10 bg-black rounded-[10px] border border-white/20 flex items-center justify-center shadow-md overflow-hidden p-1 bg-white">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <rect x="0" y="0" width="300" height="300" rx="45" fill="#000000"/>
              <rect x="10" y="10" width="280" height="280" rx="38" fill="none" stroke="#ffffff" stroke-width="4"/>
              <path d="M 65 75 L 210 75 C 220 75 225 82 220 92 C 210 115 190 145 165 160 C 185 160 215 155 235 150 C 242 148 248 155 245 162 C 235 185 210 210 190 220 C 185 222 180 218 182 212 C 190 190 200 160 185 145 C 160 145 130 145 115 145 L 115 225 C 115 235 105 240 95 235 C 80 225 70 200 65 175 L 65 75 Z" fill="#ffffff"/>
              <path d="M 190 115 C 180 100 200 85 215 95 C 225 102 222 118 210 120" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
              <path d="M 160 140 L 260 140 L 245 225 L 175 225 Z" fill="#ffffff"/>
              <g transform="translate(182, 170) scale(0.5)">
                <path d="M0 0 h6 l6 18 h22 l5 -14 h-27" fill="none" stroke="#000000" stroke-width="3"/>
                <circle cx="15" cy="25" r="3" fill="#000000"/>
                <circle cx="30" cy="25" r="3" fill="#000000"/>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-black text-[15px] tracking-[2px] leading-none">FASTER</h1>
            <p className="text-gray-400 text-[8px] tracking-[3px] font-semibold mt-0.5">SHOP NIGERIA</p>
          </div>
        </div>

        {/* HEADER ACTION ICONS */}
        <div className="flex gap-4 items-center text-white">
          <button onClick={() => onNavigate("chat")} className="relative hover:opacity-80 transition cursor-pointer p-1">
            <span className="text-xl">💬</span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-black"></span>
          </button>
          <button onClick={() => onNavigate("notifications")} className="text-yellow-400 hover:opacity-80 transition cursor-pointer text-xl p-1">
            🔔
          </button>
          <button onClick={() => onNavigate("settings")} className="hover:opacity-80 transition cursor-pointer text-xl p-1">
            ⚙️
          </button>
          <button onClick={() => onNavigate("cart")} className="hover:opacity-80 transition cursor-pointer text-xl p-1">
            👜
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mt-3.5 bg-white rounded-full flex items-center px-4 py-2.5 shadow-inner">
        <span className="text-gray-400 mr-2 text-sm">🔍</span>
        <input placeholder="Search products, vendors..." className="bg-transparent outline-none w-full text-sm text-black placeholder-gray-400 font-medium" />
      </div>
    </header>
  );
}
