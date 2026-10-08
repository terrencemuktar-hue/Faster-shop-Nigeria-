import React from "react";
import Header from "../components/Header";

export default function ProfilePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />

      {/* PROFILE CARD & SECTIONS */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white font-bold text-base">TN</div>
          <div>
            <h2 className="font-bold text-black text-base">Nwezeh Terrence Uche</h2>
            <p className="text-gray-500 text-xs">terrence@fastersub.ng</p>
          </div>
        </div>

        <h3 className="text-gray-500 text-[11px] font-bold tracking-wider pt-2 px-1">ACCOUNT & DELIVERIES</h3>

        <div className="space-y-3">
          <div onClick={() => onNavigate("orders")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <span className="font-semibold text-black text-sm">My Orders & Deliveries</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("addresses")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">📍</span>
              <span className="font-semibold text-black text-sm">Saved Shipping Addresses</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("settings")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-black text-sm">Account Settings</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("vendor")} className="bg-[#22c55e] rounded-[16px] p-4 flex justify-between items-center shadow-md cursor-pointer hover:opacity-95 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏪</span>
              <span className="font-bold text-black text-sm">Become a Vendor - 0 Followers OK</span>
            </div>
            <span className="text-black font-extrabold">{'>'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
