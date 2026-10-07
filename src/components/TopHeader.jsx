import React from 'react';
import { MessageSquare, Bell, Settings, ShoppingBag } from 'lucide-react';

export default function TopHeader({ onOpenChat, onOpenNotif, onOpenSettings, onOpenCart, cartCount, onGoHome }) {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md px-4 py-3.5 border-b border-zinc-900 flex items-center justify-between w-full">
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={onGoHome}>
        <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-zinc-950 text-lg shadow-lg shadow-emerald-950/50">
          F
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-tight text-white">Faster Shop</h1>
          <p className="text-[10px] text-zinc-400">Nigeria Marketplace</p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative z-50">
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenChat(); }}
          className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
          title="Messages & Support"
        >
          <MessageSquare className="w-4 h-4 text-white pointer-events-none" />
          <span className="absolute -top-1 -right-1 bg-pink-500 w-2.5 h-2.5 rounded-full animate-pulse pointer-events-none"></span>
        </button>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenNotif(); }}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-amber-400 fill-amber-400/20 pointer-events-none" />
        </button>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenSettings(); }}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-zinc-300 pointer-events-none" />
        </button>

        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenCart(); }}
          className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 active:scale-95 transition cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-emerald-400 pointer-events-none" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center pointer-events-none">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
