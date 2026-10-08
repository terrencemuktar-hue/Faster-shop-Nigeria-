import React from "react";
import Header from "../components/Header";

export default function NotificationsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-[24px] p-6 text-center shadow-sm border border-gray-100 space-y-3">
          <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto text-xl">🔔</div>
          <h2 className="text-xl font-bold text-black">Notifications</h2>
          <p className="text-gray-500 text-sm">You have no new notifications right now.</p>
          <button onClick={() => onNavigate("home")} className="bg-black text-white font-bold px-6 py-2.5 rounded-[16px] text-xs">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
