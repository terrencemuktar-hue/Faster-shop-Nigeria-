import React from 'react';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';

export default function OrdersPage({ onBack }) {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#121212] text-white flex flex-col p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold">My Orders & Deliveries</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 space-y-3">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <p className="text-sm text-zinc-400">No orders yet - Your FSN-XXXX orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2 shadow-lg">
              <div className="flex justify-between items-center text-xs text-zinc-400">
                <span>ID: {order.id || `FSN-${Math.floor(1000 + Math.random() * 9000)}`}</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse"></span>
                  {order.status || 'Processing'}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{order.productName || 'Faster Shop Order'}</div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-800">
                <span className="text-[#00D26A] font-bold">₦{order.total?.toLocaleString() || '0'}</span>
                <span className="text-zinc-500">{order.date || 'Just now'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
