import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('faster_shop_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        // Default initial sample order
        const initial = [
          {
            id: 'FSN-7892',
            productName: 'Velvet Oversized Hoodie',
            price: 45000,
            size: 'L',
            color: 'Black',
            status: 'Sent via WhatsApp',
            date: '2026-10-07 14:30'
          }
        ];
        localStorage.setItem('faster_shop_orders', JSON.stringify(initial));
        setOrders(initial);
      }
    } catch (e) {
      setOrders([]);
    }
  }, []);

  const trackViaWhatsApp = (order) => {
    const msg = `Hello! I would like to track my order *#${order.id}* (${order.productName} - Size: ${order.size}, Color: ${order.color}). Please provide an update!`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-white pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Orders & Receipts</h1>
        <span className="text-xs bg-zinc-800 text-emerald-400 px-3 py-1.5 rounded-full font-semibold">
          {orders.length} Active Orders
        </span>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto stroke-1" />
            <p className="text-zinc-400 font-medium">No order history yet</p>
            <p className="text-xs text-zinc-600">Completed Paystack payments and WhatsApp orders will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-xs text-emerald-400 font-bold">Order #{order.id}</span>
                  <p className="text-xs text-zinc-400">{order.date}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{order.status || 'Confirmed'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-semibold text-zinc-200">{order.productName}</h4>
                  <p className="text-xs text-zinc-400">Size: {order.size || 'M'} | Color: {order.color || 'Black'}</p>
                </div>
                <span className="font-bold text-emerald-400">₦{order.price?.toLocaleString()}</span>
              </div>

              <button 
                onClick={() => trackViaWhatsApp(order)}
                className="w-full bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Track via WhatsApp
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
