import React from "react";
import { Package, ArrowRight } from "lucide-react";
export default function OrdersPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Orders & Deliveries</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-2xl">📦</div>
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-zinc-400 text-sm max-w-sm mx-auto">When you place orders, they will appear here to track deliveries in real time.</p>
        <button onClick={() => onNavigate("shop")} className="bg-[#22c55e] text-black font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition">
          Start Shopping <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
