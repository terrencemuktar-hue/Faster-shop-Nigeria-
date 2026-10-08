import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck } from 'lucide-react';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full text-white shadow-2xl relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Banner */}
          <div className="bg-neutral-950 flex items-center justify-center min-h-[300px] p-6">
            <img
              src={product?.image || "" || 'https://via.placeholder.com/400'}
              alt={product?.name || ""}
              className="max-h-[320px] w-auto object-contain rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                {product.vendor || 'Featured Brand'}
              </span>
              <h2 className="text-2xl font-bold mt-1 text-white">{product?.name || ""}</h2>
              <p className="text-2xl font-bold text-white mt-3">
                ₦{Number(product.price).toLocaleString()}
              </p>

              {/* Size Selector (Farfetch Style) */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-neutral-300">Select Size</label>
                  <span className="text-xs text-neutral-500 cursor-pointer hover:underline">Size Guide</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-neutral-800 bg-neutral-800/50 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5">
                <label className="text-sm font-medium text-neutral-300 block mb-2">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="text-base font-semibold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action & Trust Badges */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Delivery</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Vendor</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
