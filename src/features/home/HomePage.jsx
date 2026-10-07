import React from 'react';

export default function HomePage({ onOpenCart, cartCount, onAddToCart }) {
  const vendorAds = [
    { id: 1, title: 'Amardedon Streetwear', badge: 'Featured Vendor', tag: 'Exclusive Drops', bg: 'bg-emerald-900/40 border-emerald-500/30' },
    { id: 2, title: 'Amina Atelier', badge: 'New Arrival', tag: 'Aso-Oke & Textiles', bg: 'bg-amber-900/30 border-amber-500/30' },
  ];

  const vendors = [
    { name: 'Amardedon', category: 'Menswear, Streetwear', avatar: 'A' },
    { name: 'Amina Atelier', category: 'Aso-Oke & Indigo Textiles', avatar: 'A' },
    { name: 'Nia Studio', category: 'Handmade Fashion & Acc...', avatar: 'N' },
    { name: 'Lagos Rituals', category: 'High-Street Fashion', avatar: 'L' },
  ];

  const products = [
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
    },
    {
      id: 3,
      name: 'Royal Stripe Summer Tee',
      vendor: 'Nia Studio',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d120f] text-[#f4efe6] font-sans pb-16">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0d120f]/90 backdrop-blur-md border-b border-emerald-900/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-emerald-400">FASTER SHOP</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">Nigeria</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-xs px-3 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 font-medium transition">
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
        {/* Vendor Ad Banners */}
        <section>
          <h2 className="text-xs font-semibold tracking-wider text-emerald-400/80 uppercase mb-3">Featured Vendor Spotlight</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {vendorAds.map((ad) => (
              <div key={ad.id} className={`p-5 rounded-2xl border ${ad.bg} flex flex-col justify-between space-y-4 shadow-lg backdrop-blur-sm`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {ad.badge}
                  </span>
                  <span className="text-xs text-[#d8cebe]">{ad.tag}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#f4efe6]">{ad.title}</h3>
                  <p className="text-xs text-[#b0a695] mt-1">Discover handcrafted African fashion direct from creators.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vendors Row */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-[#d8cebe] mb-4">People worth meeting</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vendors.map((v, i) => (
              <div key={i} className="bg-[#141c17] border border-emerald-900/30 p-4 rounded-xl text-center space-y-2 hover:border-emerald-600/40 transition cursor-pointer">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-900/50 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-700/40">
                  {v.avatar}
                </div>
                <h3 className="font-semibold text-sm text-[#f4efe6]">{v.name}</h3>
                <p className="text-[11px] text-[#9c9282] line-clamp-1">{v.category}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Catalog */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-[#d8cebe] mb-4">Fresh finds for today</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-[#141c17] border border-emerald-900/30 rounded-2xl overflow-hidden group hover:border-emerald-600/50 transition">
                <div className="aspect-square bg-neutral-900 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-[11px] px-2.5 py-1 rounded-md text-emerald-300 border border-emerald-800/40">
                    {p.vendor}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm text-[#f4efe6]">{p.name}</h3>
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
