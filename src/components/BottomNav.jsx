import React from 'react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'shop', label: 'Shop', icon: '🛒' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'wishlist', label: 'Wishlist', icon: '🤍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] rounded-t-[28px] pt-3 pb-2 px-6 border-t border-neutral-800 shadow-2xl max-w-[430px] mx-auto">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center relative py-1 px-3 transition-all"
            >
              {isActive ? (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-md -translate-y-1 transition-all">
                  <span className="text-base">{tab.icon}</span>
                </div>
              ) : (
                <div className="w-10 h-10 flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all">
                  <span className="text-xl">{tab.icon}</span>
                </div>
              )}
              <span className={`text-[10px] mt-0.5 font-medium tracking-tight ${isActive ? 'text-white font-bold' : 'text-[#8A8A8A]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="w-32 h-1 bg-white mx-auto rounded-full mt-3 opacity-80"></div>
    </div>
  );
}
