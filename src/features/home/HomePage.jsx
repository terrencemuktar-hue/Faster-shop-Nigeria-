import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, PlusCircle } from 'lucide-react';
import { getVendors, getProducts } from '../../lib/store';
import VendorRegisterModal from '../vendor/VendorRegisterModal';
import ProductDetailModal from './ProductDetailModal';

export default function HomePage() {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loadData = () => {
    setVendors(getVendors());
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddToCart = (item) => {
    setCartCount((prev) => prev + (item.quantity || 1));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-30">
        <h1 className="text-xl font-bold tracking-tight">Faster Shop</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center space-x-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded-lg text-neutral-200 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Register Vendor</span>
          </button>
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-neutral-300 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Vendors Section */}
        <section>
          <h2 className="text-lg font-bold text-neutral-200 mb-4">People worth meeting</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="flex-shrink-0 bg-neutral-900 border border-neutral-800 p-4 rounded-xl w-48 text-center hover:border-neutral-700 transition"
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full mx-auto mb-3 flex items-center justify-center text-xl font-bold text-neutral-400">
                  {v.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-sm truncate">{v.name}</h3>
                <p className="text-xs text-neutral-500 truncate">{v.category || 'Vendor'}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="text-lg font-bold text-neutral-200 mb-4">Fresh finds for today</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 cursor-pointer hover:border-neutral-700 transition group"
              >
                <div className="aspect-square bg-neutral-950 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  <img
                    src={p.image || 'https://via.placeholder.com/300'}
                    alt={p.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="text-xs text-neutral-500">{p.vendor || 'Faster Vendor'}</p>
                <h3 className="font-medium text-sm text-neutral-200 truncate">{p.name}</h3>
                <p className="font-bold text-sm mt-1 text-white">
                  ₦{Number(p.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modals */}
      {isRegisterOpen && (
        <VendorRegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSuccess={loadData}
        />
      )}

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
