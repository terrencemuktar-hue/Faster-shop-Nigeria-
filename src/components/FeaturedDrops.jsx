import React from 'react';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

export default function FeaturedDrops({ products = [], onSelectProduct, onBecomeVendor }) {
  const verifiedProducts = products.filter(p => p.isVerifiedProduct === true || p.vendorVerified === true);

  if (verifiedProducts.length === 0) {
    return (
      <div className="w-full px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-black">Verified drops coming soon</h3>
          <p className="text-xs text-zinc-500 max-w-[260px]">We're onboarding real Nigerian vendors</p>
        </div>
        <button 
          onClick={onBecomeVendor}
          className="bg-black text-white font-bold text-xs px-6 py-3 rounded-full active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          Become a Verified Vendor
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base text-black">Featured Drops</h2>
        <span className="text-xs text-emerald-600 font-semibold">Verified</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {verifiedProducts.map((product) => (
          <div 
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-[24px] overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
              <img 
                src={product.image || product.img} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-4 space-y-1.5">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-black tracking-tight">{product.name}</h3>
                <span className="text-emerald-600 font-extrabold text-xs">₦{product.price?.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">{product.vendorName || 'Verified Nigerian Vendor'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
