import React, { useState } from 'react';
import Logo from './Logo';

export default function ProductDetail({ product, onBack, setSelectedVendor, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart({ ...product, selectedSize, selectedColor });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl relative">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white sticky top-0 z-40">
        <button onClick={onBack} className="text-sm font-bold text-neutral-300 hover:text-white">
          ← Back
        </button>
        <Logo size="sm" />
      </header>

      <div className="space-y-6">
        <div className="aspect-[4/5] bg-neutral-100 overflow-hidden relative shadow-md">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold">
            ★ 4.8 (124 reviews)
          </div>
        </div>

        <div className="px-6 space-y-5">
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedVendor(product.brand)}
              className="text-xs uppercase font-bold text-[#FF2D78] tracking-widest hover:underline"
            >
              {product.brand}
            </button>
            <h1 className="text-xl font-black text-neutral-900">{product.title}</h1>
            <p className="text-2xl font-black text-neutral-900 pt-1">₦{product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Select Size</label>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl font-bold text-xs transition shadow-sm ${
                    selectedSize === size 
                      ? 'bg-black text-white' 
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">Select Color</label>
            <div className="flex gap-3">
              {['Black', 'White', 'Olive'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition border ${
                    selectedColor === color 
                      ? 'border-black bg-black text-white' 
                      : 'border-neutral-200 bg-white text-neutral-800'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={handleAdd}
              className="w-full bg-[#00D26A] hover:bg-emerald-400 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
            >
              {added ? '✓ Added to Bag!' : 'ADD TO BAG'}
            </button>
            <button 
              onClick={() => alert('Searching for similar styles across Faster Shop vendors...')}
              className="w-full bg-white border border-neutral-300 text-neutral-900 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 transition"
            >
              FIND SIMILAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
