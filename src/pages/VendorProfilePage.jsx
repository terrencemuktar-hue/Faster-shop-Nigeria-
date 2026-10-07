import React from 'react';
import Logo from '../components/Logo';

export default function VendorProfilePage({ vendorName, onBack, setSelectedProduct }) {
  const vendorData = {
    'RUBIAN GIRL': {
      bio: 'Lagos-based luxury high-street fashion & silk creations. Direct vendor drop.',
      avatar: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=300&q=80',
      followers: '14.2K',
      posts: '48',
    },
    'RINGING': {
      bio: 'Bold streetwear, premium hoodies & urban outerwear designed in Nigeria.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      followers: '9.8K',
      posts: '32',
    }
  };

  const currentVendor = vendorData[vendorName] || {
    bio: 'Verified Nigerian creator & independent fashion brand on Faster Shop.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    followers: '4.5K',
    posts: '19',
  };

  const vendorProducts = [
    { id: 101, title: `${vendorName} Signature Piece 1`, brand: vendorName, price: 95000, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { id: 102, title: `${vendorName} Urban Drop 2`, brand: vendorName, price: 120000, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' },
    { id: 103, title: `${vendorName} Collection 3`, brand: vendorName, price: 85000, image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80' },
    { id: 104, title: `${vendorName} Collection 4`, brand: vendorName, price: 110000, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
    { id: 105, title: `${vendorName} Collection 5`, brand: vendorName, price: 65000, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' },
    { id: 106, title: `${vendorName} Collection 6`, brand: vendorName, price: 150000, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl relative">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white sticky top-0 z-40">
        <button onClick={onBack} className="text-sm font-bold flex items-center gap-1 text-neutral-300 hover:text-white">
          ← Back
        </button>
        <span className="font-bold text-sm tracking-wider uppercase">{vendorName}</span>
        <Logo size="sm" />
      </header>

      <div className="p-6 border-b border-neutral-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#FF2D78] p-0.5 shadow-md">
            <img src={currentVendor.avatar} alt={vendorName} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <span className="block font-black text-base text-neutral-900">{currentVendor.posts}</span>
              <span className="text-[11px] text-neutral-500">Posts</span>
            </div>
            <div>
              <span className="block font-black text-base text-neutral-900">{currentVendor.followers}</span>
              <span className="text-[11px] text-neutral-500">Followers</span>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-black text-base text-neutral-900">{vendorName}</h1>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{currentVendor.bio}</p>
        </div>

        <div className="flex gap-3 pt-1">
          <button className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-neutral-800 transition">
            Follow Store
          </button>
          <button 
            onClick={() => alert(`Direct WhatsApp order link opened for ${vendorName}`)}
            className="flex-1 bg-[#00D26A] text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-emerald-400 transition"
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>

      <div className="p-1">
        <div className="grid grid-cols-3 gap-1">
          {vendorProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="aspect-square bg-neutral-100 overflow-hidden relative cursor-pointer group"
            >
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-end p-2 text-white text-[10px] font-bold">
                ₦{product.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
