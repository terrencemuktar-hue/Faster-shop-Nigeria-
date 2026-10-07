"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Store, ShoppingBag, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80"
];

const CATEGORIES = [
  { name: "Streetwear", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&auto=format&fit=crop&q=80" },
  { name: "Native / Ankara", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80" },
  { name: "Gowns & Dresses", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80" },
  { name: "Shoes & Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80" },
  { name: "Bags & Purses", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pb-24">
      <div className="w-full max-w-[430px] min-h-screen bg-black flex flex-col relative px-4 space-y-6">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pt-4 pb-2 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#22c55e] text-black font-black flex items-center justify-center text-xs shadow-md">
              FS
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-white">Faster Shop</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/shop" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all">
              <ShoppingBag className="w-4 h-4" />
            </Link>
            <Link href="/profile" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Hero Carousel Section */}
        <div className="relative w-full h-[380px] rounded-[20px] overflow-hidden border border-zinc-900 shadow-2xl">
          {CAROUSEL_IMAGES.map((img, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
              <img src={img} alt="Fashion Slide" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
          ))}

          {/* Carousel Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e] text-[10px] font-extrabold w-max backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> Nigeria's Fastest Fashion Market
            </div>
            
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Direct Vendor Drops</h1>
              <p className="text-xs text-zinc-300">Be the first vendor. 0 followers OK.</p>
            </div>

            <div className="flex gap-2 pt-1">
              <Link 
                href="/vendor"
                className="flex-1 bg-[#22c55e] text-black font-extrabold py-3 rounded-xl text-xs text-center active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-1"
              >
                Become a Vendor Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link 
                href="/shop"
                className="px-5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-white font-bold py-3 rounded-xl text-xs text-center active:scale-[0.98] transition-all"
              >
                Shop Now
              </Link>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-1.5 pt-1">
              {CAROUSEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-[#22c55e]' : 'w-1.5 bg-zinc-700'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Conditional Sections */}
        {loading ? (
          <div className="text-center py-12 text-xs text-zinc-500">Loading marketplace...</div>
        ) : products.length === 0 ? (
          <>
            {/* First Vendors Get Banner */}
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-4 rounded-[16px] flex items-center justify-between shadow-md">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> First Vendors Get Perks
                </div>
                <p className="text-[11px] text-zinc-400">Verified Badge + Homepage Feature</p>
              </div>
              <Link href="/vendor" className="bg-[#22c55e] text-black text-[11px] font-extrabold px-3.5 py-2 rounded-xl">
                Claim
              </Link>
            </div>

            {/* How it Works */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-400">How It Works</h2>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-[16px] space-y-2 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#22c55e]/10 text-[#22c55e] font-black text-xs flex items-center justify-center">1</div>
                  <div className="text-[11px] font-bold text-white">Register Store</div>
                  <div className="text-[10px] text-zinc-400">0 followers required</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-[16px] space-y-2 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#22c55e]/10 text-[#22c55e] font-black text-xs flex items-center justify-center">2</div>
                  <div className="text-[11px] font-bold text-white">Post Outfits</div>
                  <div className="text-[10px] text-zinc-400">Upload in seconds</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-[16px] space-y-2 text-center">
                  <div className="w-7 h-7 mx-auto rounded-full bg-[#22c55e]/10 text-[#22c55e] font-black text-xs flex items-center justify-center">3</div>
                  <div className="text-[11px] font-bold text-white">WhatsApp Orders</div>
                  <div className="text-[10px] text-zinc-400">Direct buyer chat</div>
                </div>
              </div>
            </div>

            {/* Categories to Explore */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-400">Categories to Explore</h2>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat, idx) => (
                  <Link key={idx} href="/shop" className="relative h-28 rounded-[16px] overflow-hidden border border-zinc-900 group block">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-xs font-extrabold text-white">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Featured Drops when real products exist */
          <div className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-400">Featured Drops</h2>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <div key={product.id} className="bg-zinc-950 border border-zinc-900 rounded-[16px] overflow-hidden space-y-2 pb-3">
                  <div className="h-36 bg-zinc-900 relative">
                    <img src={product.image_url || CAROUSEL_IMAGES[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="px-3 space-y-1">
                    <div className="text-xs font-bold text-white truncate">{product.name}</div>
                    <div className="text-xs font-extrabold text-[#22c55e]">₦{product.price?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
