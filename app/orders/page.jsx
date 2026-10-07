"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (!error && data) setOrders(data);
        }
      } catch (err) {
        // Fallback to local storage if offline or unauthenticated
        const local = JSON.parse(localStorage.getItem('faster_orders') || '[]');
        setOrders(local);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-[430px] min-h-screen bg-black text-white flex flex-col relative space-y-6 pb-24">
        
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 pt-2">
          <Link href="/" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">My Orders</h1>
          <div className="w-8"></div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4 py-20">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-[#22c55e] shadow-sm">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No orders yet</h3>
              <p className="text-xs text-zinc-400 max-w-[260px]">When you place orders, they will appear here</p>
            </div>
            <Link 
              href="/shop"
              className="bg-[#22c55e] text-black font-extrabold text-xs px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all shadow-lg inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, idx) => (
              <div key={order.id || idx} className="bg-zinc-950 border border-zinc-900 p-4 rounded-[16px] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Order #{order.id?.slice(0, 8) || idx + 1}</span>
                  <span className="text-[#22c55e] font-semibold">{order.status || 'Processing'}</span>
                </div>
                <p className="text-[11px] text-zinc-400">Total: ₦{order.total?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
