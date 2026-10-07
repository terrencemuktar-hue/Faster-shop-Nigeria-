import React, { useState, useEffect } from 'react';
import StoryReels from './components/StoryReels';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CartDrawer from './CartDrawer';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import VendorPage from './pages/VendorPage';
import { getStoredVendors, getStoredProducts, getStoredWishlist } from './lib/store';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVendorRegOpen, setIsVendorRegOpen] = useState(false);

  const vendors = getStoredVendors();
  const products = getStoredProducts();

  useEffect(() => {
    setWishlist(getStoredWishlist());
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    triggerToast(`Added ${product.name} to bag!`, 'bag');
  };

  const totalCartCount = cart.reduce((a, b) => a + (b.quantity || 1), 0);

  if (isVendorRegOpen) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center">
        <div className="w-full max-w-[430px] min-h-screen bg-black text-white relative shadow-2xl border-x border-zinc-900">
          <VendorPage onBack={() => setIsVendorRegOpen(false)} showToast={triggerToast} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-[#00D26A] selection:text-black">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] text-black flex flex-col relative shadow-2xl border-x border-zinc-900">
        
        <Header 
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          onGoHome={() => setActiveTab('home')}
          onOpenSettingsModal={() => setActiveTab('profile')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 pb-28">
          {activeTab === 'home' && (
            <div className="space-y-4 pt-3">
              <StoryReels vendors={vendors} />
              
              <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base text-black">Featured Drops</h2>
                  <button onClick={() => setActiveTab('shop')} className="text-xs text-emerald-600 font-semibold cursor-pointer">See All</button>
                </div>

                {products.length === 0 ? (
                  <div className="w-full px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black">Verified drops coming soon</h3>
                      <p className="text-xs text-zinc-500 max-w-[260px]">We're onboarding real Nigerian vendors</p>
                    </div>
                    <button 
                      onClick={() => setIsVendorRegOpen(true)}
                      className="bg-black text-white font-bold text-xs px-6 py-3 rounded-full active:scale-[0.98] transition-all cursor-pointer shadow-md"
                    >
                      Become a Verified Vendor
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                      <div 

# 1. Clean up incorrect Vite/src files
rm -rf src/pages/VendorPage.jsx src/pages/ProfilePage.jsx

# 2. Create correct Next.js App Router vendor page
mkdir -p app/vendor
cat << 'EOF' > app/vendor/page.jsx
"use client";

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Store, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VendorRegistrationPage() {
  const [form, setForm] = useState({ fullName: '', phone: '', shopName: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.shopName) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('vendors').insert([
        {
          full_name: form.fullName,
          phone: form.phone,
          shop_name: form.shopName,
          followers_count: 0,
          is_verified: false
        }
      ]);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('faster_vendors') || '[]');
      localStorage.setItem('faster_vendors', JSON.stringify([...existing, { ...form, followers_count: 0, is_verified: false }]));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[430px] bg-zinc-950 border border-zinc-900 p-6 rounded-[24px] space-y-6 shadow-2xl relative">
        
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <Link href="/" className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">Faster Shop Nigeria</h1>
          <div className="w-8"></div>
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Application Received</h2>
              <p className="text-xs text-[#22c55e] font-semibold">✅ Registered with 0 followers</p>
            </div>
            <Link 
              href="/"
              className="inline-block w-full bg-[#22c55e] text-black font-extrabold py-3 rounded-xl text-xs mt-4 active:scale-[0.98] transition-all cursor-pointer text-center"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                <Store className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Become a Vendor</h2>
                <p className="text-[11px] text-zinc-400">Start selling with 0 followers</p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Terrence Nwezeh"
                value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Phone / WhatsApp</label>
              <input 
                type="text" 
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Shop Name</label>
              <input 
                type="text" 
                placeholder="e.g. Lagos Streetwear Co."
                value={form.shopName}
                onChange={e => setForm({...form, shopName: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#22c55e] text-black font-extrabold py-3.5 rounded-xl text-xs mt-2 active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center"
            >
              {loading ? 'Submitting...' : 'Register Vendor Store'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
