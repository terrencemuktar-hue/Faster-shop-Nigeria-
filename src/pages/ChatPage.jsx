import React from "react";
import Header from "../components/Header";

export default function ChatPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="bg-white rounded-[24px] p-6 text-center shadow-sm border border-gray-100 space-y-3">
          <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">💬</div>
          <h2 className="text-xl font-bold text-black">Messages</h2>
          <p className="text-gray-500 text-sm">No messages yet. Chat with vendors directly from product pages.</p>
          <button onClick={() => onNavigate("shop")} className="bg-[#22c55e] text-black font-bold px-6 py-2.5 rounded-[16px] text-xs">
            Explore Shop
          </button>
        </div>
      </div>
    </div>
  );
}
