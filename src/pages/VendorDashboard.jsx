import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, ShieldAlert, Package, Users, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VendorDashboard({ onBack, showToast }) {
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage or Supabase for vendor status
    const storedVendor = JSON.parse(localStorage.getItem('currentVendor') || 'null');
    if (storedVendor) {
      setVendor(storedVendor);
      setProducts(storedVendor.products || []);
      setLoading(false);
    } else {
      // Default demo unverified state if not logged in as vendor
      setVendor({ shop_name: 'My New Shop', is_verified: false, followers_count: 0 });
      setLoading(false);
    }
  }, []);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct?.name || "" || !newProduct.price) return;

    const prod = {
      id: Date.now(),
      name: newProduct?.name || "",
      price: Number(newProduct.price),
      image: newProduct.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
      isVerifiedProduct: vendor?.is_verified || false
    };

    const updatedProducts = [prod, ...products];
    setProducts(updatedProducts);
    const updatedVendor = { ...vendor, products: updatedProducts };
    setVendor(updatedVendor);
    localStorage.setItem('currentVendor', JSON.stringify(updatedVendor));
    setNewProduct({ name: '', price: '', imageUrl: '' });
    if (showToast) showToast('Product added successfully', 'success');
  };

  if (!vendor?.is_verified) {
    return (
      <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] text-black flex flex-col p-4 pb-24 space-y-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-bold">Vendor Dashboard</h1>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-[24px] text-center space-y-4 shadow-sm my-auto">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-500 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-black">Pending Verification</h2>
            <p className="text-xs text-zinc-500">Your store is currently under review by Faster Shop administrators. You will be able to manage drops once verified.</p>
          </div>
          <button 
            onClick={onBack}
            className="w-full bg-black text-white font-bold py-3 rounded-xl text-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] text-black flex flex-col p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-bold">{vendor.shop_name}</h1>
        </div>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Verified</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center shadow-sm">
          <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <div className="text-sm font-black">{vendor.followers_count || 0}</div>
          <div className="text-[10px] text-zinc-500">Followers</div>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center shadow-sm">
          <Package className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <div className="text-sm font-black">{products.length}</div>
          <div className="text-[10px] text-zinc-500">Products</div>
        </div>
        <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-center shadow-sm">
          <DollarSign className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <div className="text-sm font-black">₦0</div>
          <div className="text-[10px] text-zinc-500">Sales</div>
        </div>
      </div>

      <form onSubmit={handleAddProduct} className="bg-white border border-zinc-200 p-4 rounded-[24px] space-y-3 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Add New Product</h2>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={newProduct?.name || ""} 
          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
          className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs text-black focus:outline-none focus:border-black"
          required
        />
        <input 
          type="number" 
          placeholder="Price (₦)" 
          value={newProduct.price} 
          onChange={e => setNewProduct({...newProduct, price: e.target.value})}
          className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs text-black focus:outline-none focus:border-black"
          required
        />
        <input 
          type="url" 
          placeholder="Image URL" 
          value={newProduct.imageUrl} 
          onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
          className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs text-black focus:outline-none focus:border-black"
        />
        <button 
          type="submit" 
          className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" /> Publish Product
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">My Catalog</h2>
        {products.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-6">No products listed yet.</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="bg-white border border-zinc-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img src={p?.image || ""} alt="" className="w-10 h-10 object-cover rounded-xl" />
                <div>
                  <h4 className="text-xs font-bold text-black">{p?.name || ""}</h4>
                  <span className="text-[11px] font-extrabold text-emerald-600">₦{p.price?.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">Verified</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
