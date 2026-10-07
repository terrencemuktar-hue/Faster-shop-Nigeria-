import React, { useState } from 'react';
import Logo from '../components/Logo';

export default function SearchPage({ setSelectedVendor, setSelectedProduct }) {
  const [searchQuery, setSearchQuery] = useState('');

  const brands = [
    { name: 'RUBIAN GIRL', avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=200&q=80' },
    { name: 'RINGING', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Amardedon', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { name: 'Amina Atelier', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  ];

  const allItems = [
    { id: 1, title: 'Rubian Girl Silk Blouse', brand: 'RUBIAN GIRL', price: 90000, image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=600&q=80' },
    { id: 2, title: 'Kinging Bomber Jacket', brand: 'RINGING', price: 180000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
    { id: 3, title: 'Rubian Girl Denim Jacket', brand: 'RUBIAN GIRL', price: 75000, image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80' },
    { id: 4, title: 'Kinging Graphic Hoodie', brand: 'RINGING', price: 135000, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
  ];

  const results = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white">
        <Logo size="sm" />
      </header>

      <div className="p-5 space-y-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">🔍</span>
          <input
            type="text"
            placeholder="Search brands, products, styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F1F1F1] text-neutral-900 rounded-full pl-11 pr-4 py-3 text-sm focus:outline-none shadow-inner"
            autoFocus
          />
        </div>

        {!searchQuery && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Popular Stores</h3>
            <div className="grid grid-cols-4 gap-3">
              {brands.map((b, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedVendor(b.name)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF2D78] p-0.5 shadow-md group-hover:scale-105 transition">
                    <img src={b.avatar} alt={b.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-800 mt-1.5 text-center truncate w-full">{b.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'Trending Results'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {results.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-[18px] p-3 shadow-sm border border-neutral-100 cursor-pointer group"
              >
                <div className="aspect-[4/5] rounded-[14px] overflow-hidden bg-neutral-100 mb-3">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FF2D78] tracking-wider">{product.brand}</span>
                <h4 className="font-semibold text-xs text-neutral-900 truncate mt-0.5">{product.title}</h4>
                <p className="font-black text-sm text-neutral-900 mt-1">₦{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
