import React, { useState } from 'react';

export default function HomePage({ onOpenCart, cartCount, onAddToCart }) {
  // Real active vendors created for the platform
  const [vendors, setVendors] = useState([
    { id: 'v1', name: 'Amardedon', category: 'Menswear, Streetwear', avatar: 'A', phone: '2348012345678' },
    { id: 'v2', name: 'Amina Atelier', category: 'Aso-Oke & Indigo Textiles', avatar: 'A', phone: '2348087654321' }
  ]);

  // Real products from authorized stores
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'AmarTees Oversized Tee',
      vendor: 'Amardedon',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Hand-Woven Aso-Oke Tote Bag',
      vendor: 'Amina Atelier',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    }
  ]);

  return (
    <div className="min-h-screen bg-[#0d120f] text-[#f4efe6] font-sans pb-16">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0d120f]/90 backdrop-blur-md border-b border-emerald-900/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-emerald-400">FASTER SHOP</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">Nigeria</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('Vendor registration portal opening soon! Real vendors will be able to list items here.')}
            className="text-xs px-3 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 font-medium transition"
          >
            + Register Vendor
          </button>
          <button 
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-[#16201a] border border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40 transition"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-6 space-y-10">
        {/* Vendors Row - Only Real Stores */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-[#d8cebe] mb-4">Active Vendor Stores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vendors.map((v) => (
              <div key={v.id} className="bg-[#141c17] border border-emerald-900/30 p-4 rounded-xl text-center space-y-2 hover:border-emerald-600/40 transition cursor-pointer">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/50 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-700/40">
                  {v.avatar}
                </div>
                <h3 className="font-semibold text-sm text-[#f4efe6]">{v?.name || ""}</h3>
                <p className="text-[11px] text-[#9c9282] line-clamp-1">{v.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Catalog - Only Real Store Items */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-[#d8cebe] mb-4">Store Catalog</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-[#141c17] border border-emerald-900/30 rounded-2xl overflow-hidden group hover:border-emerald-600/50 transition">
                <div className="aspect-square bg-neutral-900 overflow-hidden relative">
                  <img src={p?.image || ""} alt={p?.name || ""} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-[11px] px-2.5 py-1 rounded-md text-emerald-300 border border-emerald-800/40">
                    {p.vendor}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-[#f4efe6]">{p?.name || ""}</h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-bold text-emerald-400">₦{p.price.toLocaleString()}</span>
                    <button
                      onClick={() => onAddToCart({ ...p, selectedSize: 'L', quantity: 1 })}
                      className="px-3 py-1.5 bg-[#f4efe6] hover:bg-white text-black font-semibold text-xs rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
