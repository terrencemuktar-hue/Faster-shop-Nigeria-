import React, { useState } from 'react';
import OrdersPage from './OrdersPage';
import AddressesPage from './AddressesPage';
import AccountSettingsPage from './AccountSettingsPage';
import { Package, MapPin, Settings, ChevronRight, User, LogOut } from 'lucide-react';

export default function ProfilePage({ showToast, onNavigateOrders }) {
  const [activeView, setActiveView] = useState('profile');

  if (activeView === 'orders') {
    return <OrdersPage onBack={() => setActiveView('profile')} />;
  }
  if (activeView === 'addresses') {
    return <AddressesPage onBack={() => setActiveView('profile')} showToast={showToast} />;
  }
  if (activeView === 'settings') {
    return <AccountSettingsPage onBack={() => setActiveView('profile')} showToast={showToast} />;
  }

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#121212] text-white flex flex-col p-4 pb-24 space-y-4">
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-lg">
        <div className="w-12 h-12 rounded-2xl bg-[#00D26A] text-black font-black flex items-center justify-center text-lg">
          F
        </div>
        <div>
          <h1 className="font-bold text-sm">Faster Shop User</h1>
          <p className="text-xs text-zinc-400">Nigeria Marketplace Member</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg divide-y divide-zinc-800">
        <button 
          onClick={() => setActiveView('orders')}
          className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-800/50 active:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-[#00D26A]" />
            <span className="text-xs font-semibold">My Orders & Deliveries</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button 
          onClick={() => setActiveView('addresses')}
          className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-800/50 active:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-[#FF2D78]" />
            <span className="text-xs font-semibold">Saved Shipping Addresses</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>

        <button 
          onClick={() => setActiveView('settings')}
          className="w-full text-left p-4 flex justify-between items-center hover:bg-zinc-800/50 active:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold">Account Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </button>
      </div>
    </div>
  );
}
