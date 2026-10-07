import React from 'react';
import { Home, ShoppingBag, Search, Heart, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-[#121212] h-[72px] rounded-t-[24px] border-t border-zinc-800 px-6 flex items-center justify-between z-40 shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-[0.95] ${
              isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {isActive ? (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black shadow-md">
                <Icon className="w-4 h-4 stroke-[2.5]" />
              </div>
            ) : (
              <Icon className="w-5 h-5" />
            )}
            <span className={`text-[10px] ${isActive ? 'font-bold text-white' : 'font-medium text-zinc-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
