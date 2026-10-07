import React, { useState } from 'react';
import { MessageSquare, Bell, Settings, ShoppingBag, X } from 'lucide-react';

export default function TopHeader({ onOpenCart, cartCount, onGoHome, onOpenSettingsModal }) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const handleChatClick = (showToast) => {
    // Toast notification handled if passed, or standard alert/toast
    alert('Messages coming soon - Vendors will chat you via WhatsApp for now');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121212]/95 backdrop-blur-md px-4 py-3.5 border-b border-zinc-900 flex items-center justify-between w-full">
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onGoHome}>
        <div className="w-9 h-9 bg-[#00D26A] rounded-xl flex items-center justify-center font-black text-black text-lg shadow-lg">
          F
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight text-white">Faster Shop</h1>
          <p className="text-[10px] text-zinc-400">Nigeria Marketplace</p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Chat Icon */}
        <button 
          type="button"
          onClick={() => alert('Messages coming soon - Vendors will chat you via WhatsApp for now')}
          className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
          title="Messages & Support"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="absolute -top-1 -right-1 bg-[#FF2D78] w-2.5 h-2.5 rounded-full animate-pulse"></span>
        </button>

        {/* Bell Icon with Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-amber-400 fill-amber-400/20" />
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
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-zinc-300" />
        </button>

        {/* Cart Button */}
        <button 
          type="button"
          onClick={onOpenCart}
          className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-[#00D26A]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#00D26A] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
