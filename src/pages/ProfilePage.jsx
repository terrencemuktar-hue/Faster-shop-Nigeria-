import React from 'react';
import { Package, MapPin, Settings, Store, ChevronRight, User, ShieldCheck } from 'lucide-react';

export default function ProfilePage({ showToast, onNavigateOrders, onOpenVendorReg }) {
  return (
    <div className="px-4 py-6 space-y-4">
      <div className="flex items-center gap-3 bg-white p-4 rounded-[24px] border border-zinc-200 shadow-sm">
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-base">
          TN
        </div>
        <div>
          <h2 className="text-sm font-bold text-black">Nwezeh Terrence Uche</h2>
          <p className="text-[11px] text-zinc-500">terrence@fastersub.ng</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 px-1">Account & Deliveries</h3>
        
        <div 
          onClick={onNavigateOrders}
          className="bg-white p-4 rounded-[16px] border border-zinc-200 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-zinc-700" />
            <span className="text-xs font-bold text-black">My Orders & Deliveries</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>

        <div 
          onClick={() => showToast && showToast('Saved shipping addresses updated', 'success')}
          className="bg-white p-4 rounded-[16px] border border-zinc-200 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-zinc-700" />
            <span className="text-xs font-bold text-black">Saved Shipping Addresses</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>

        <div 
          onClick={() => showToast && showToast('Account settings opened', 'success')}
          className="bg-white p-4 rounded-[16px] border border-zinc-200 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-zinc-700" />
            <span className="text-xs font-bold text-black">Account Settings</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>

        {/* Vendor Registration Button Card */}
        <div 
          onClick={onOpenVendorReg}
          className="w-full bg-[#22c55e] text-black font-bold p-4 rounded-[12px] flex items-center justify-between shadow-md active:scale-[0.98] transition-all cursor-pointer mt-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🏪</span>
            <span className="text-xs font-extrabold tracking-tight">Become a Vendor - 0 Followers OK</span>
          </div>
          <ChevronRight className="w-4 h-4 text-black stroke-[3]" />
        </div>
      </div>
    </div>
  );
}
