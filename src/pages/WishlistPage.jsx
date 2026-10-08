import React from 'react';
import Logo from '../components/Logo';

export default function WishlistPage({ wishlist, toggleWishlist, setSelectedProduct }) {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white">
        <Logo size="sm" />
        <h1 className="text-sm font-bold tracking-wider uppercase text-neutral-300">My Wishlist</h1>
      </header>

      <div className="p-5">
        {wishlist.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <span className="text-5xl">🤍</span>
            <h3 className="font-bold text-lg text-neutral-800">Your wishlist is empty</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">Tap the heart icon on any product while shopping to save your favorite items here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-[18px] p-3 shadow-sm border border-neutral-100 cursor-pointer group relative"
              >
                <div className="aspect-[4/5] rounded-[14px] overflow-hidden bg-neutral-100 mb-3 relative">
                  <img src={product?.image || ""} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md text-sm text-[#FF2D78]"
                  >
                    ❤️
                  </button>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#FF2D78] tracking-wider">{product.brand}</span>
                <h4 className="font-semibold text-xs text-neutral-900 truncate mt-0.5">{product.title}</h4>
                <p className="font-black text-sm text-neutral-900 mt-1">₦{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
