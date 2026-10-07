import React, { useState } from 'react';
import Logo from '../components/Logo';

export default function ShopPage({ setSelectedVendor, setSelectedProduct, wishlist, toggleWishlist }) {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('RUBIAN GIRL.');

  const products = [
    { id: 1, title: 'Rubian Girl Silk Blouse', brand: 'RUBIAN GIRL.', price: 90000, image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Kinging Bomber Jacket', brand: 'RINGING', price: 180000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Rubian Girl Denim Jacket', brand: 'RUBIAN GIRL.', price: 75000, image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Kinging Graphic Hoodie', brand: 'RINGING', price: 135000, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
    { id: 5, title: 'Amardedon Streetwear Tee', brand: 'Amardedon', price: 25000, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
    { id: 6, title: 'Amina Woven Tote', brand: 'Amina Atelier', price: 45000, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  ];

  const filteredProducts = selectedBrandFilter === 'ALL' 
    ? products 
    : products.filter(p => p.brand.toLowerCase().includes(selectedBrandFilter.toLowerCase().replace('.', '')));

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white">
        <Logo size="sm" />
        <div className="flex items-center gap-4 text-xl">
          <button>🔍</button>
        </div>
      </header>

      <div className="bg-black px-5 pb-5 pt-2">
        <h2 className="text-white text-xs font-semibold uppercase tracking-widest mb-3 opacity-80">EXPLORE BRANDS</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['RUBIAN GIRL.', 'RINGING', 'Amardedon', 'Amina Atelier'].map((brand) => {
            const isActive = selectedBrandFilter === brand;
            return (
              <button
                key={brand}
                onClick={() => setSelectedBrandFilter(isActive ? 'ALL' : brand)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition whitespace-nowrap shadow-md ${
                  isActive 
                    ? 'bg-[#FF2D78] text-white shadow-[#FF2D78]/30' 
                    : 'bg-neutral-800 text-white border border-neutral-700'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const isLiked = wishlist.some(item => item.id === product.id);
            return (
              <div 
                key={product.id}
                className="bg-white rounded-[18px] p-3 shadow-sm border border-neutral-100 flex flex-col justify-between group relative"
              >
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="aspect-[4/5] rounded-[14px] overflow-hidden bg-neutral-100 relative cursor-pointer"
                >
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md text-sm hover:scale-110 transition"
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <button 
                    onClick={() => setSelectedVendor(product.brand)}
                    className="text-[10px] uppercase font-bold text-[#FF2D78] tracking-wider hover:underline block text-left"
                  >
                    {product.brand}
                  </button>
                  <h3 
                    onClick={() => setSelectedProduct(product)}
                    className="font-semibold text-xs text-neutral-900 truncate cursor-pointer hover:text-[#FF2D78]"
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-sm text-neutral-900">₦{product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
