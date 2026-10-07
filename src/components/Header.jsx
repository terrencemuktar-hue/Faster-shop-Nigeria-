import React, { useState } from 'react';
import { MessageSquare, Bell, Settings, ShoppingBag, Search, X } from 'lucide-react';

export default function Header({ onOpenCart, cartCount, onGoHome, onOpenSettingsModal, searchQuery, setSearchQuery }) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#000000] border-b border-zinc-900 px-4 py-3 space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={onGoHome}>
          <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 7H19L20 20H4L5 7Z" fill="black"/>
              <path d="M8 7C8 4 9.5 3 12 3C14.5 3 16 4 16 7" stroke="black" strokeWidth="1.5" fill="none"/>
              <text x="7" y="16" fontSize="11" fontWeight="900" fill="white" fontFamily="sans-serif">F</text>
            </svg>
          </div>
          <div>
            <div className="font-black text-white tracking-[0.15em] text-[15px] leading-none">FASTER</div>
            <div className="text-[10px] tracking-[0.2em] text-gray-400 leading-none mt-1">SHOP NIGERIA</div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Chat Icon with Pink Dot */}
          <button 
            type="button"
            onClick={() => alert('Messages coming soon - Vendors will chat you via WhatsApp for now')}
            className="relative text-white hover:text-zinc-300 transition-all cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-[22px] h-[22px]" />
            <span className="absolute -top-1 -right-1 bg-[#FF2D78] w-2.5 h-2.5 rounded-full animate-pulse"></span>
          </button>

          {/* Bell Icon */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="text-white hover:text-zinc-300 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-[22px] h-[22px] text-amber-400" />
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2 text-white">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="text-xs font-bold">Notifications</span>
                  <button onClick={() => setShowNotifDropdown(false)} className="p-1 rounded-lg hover:bg-zinc-800 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-300">
                  <div className="bg-zinc-800/60 p-2 rounded-xl">No new notifications</div>
                  <div className="bg-zinc-800/60 p-2 rounded-xl text-emerald-400 font-medium">You will be notified when RUBIAN GIRL drops</div>
                </div>
              </div>
            )}
          </div>

          {/* Gear Icon */}
          <button 
            type="button"
            onClick={onOpenSettingsModal}
            className="text-white hover:text-zinc-300 transition-all cursor-pointer"
            title="Settings"
          >
            <Settings className="w-[22px] h-[22px]" />
          </button>

          {/* Cart Bag */}
          <button 
            type="button"
            onClick={onOpenCart}
            className="relative text-white hover:text-zinc-300 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-[22px] h-[22px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#00D26A] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Pill */}
      <div className="bg-white rounded-full h-10 px-4 flex items-center gap-2 shadow-md">
        <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Search" 
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-black text-xs focus:outline-none placeholder-zinc-400"
        />
      </div>
    </header>
  );
}
