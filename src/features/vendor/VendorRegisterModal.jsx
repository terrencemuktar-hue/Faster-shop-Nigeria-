import React, { useState } from 'react';
import { X, Store, Plus, CheckCircle } from 'lucide-react';
import { saveVendor, saveProduct } from '../../lib/store';

export default function VendorRegisterModal({ isOpen, onClose, onRefresh }) {
  const [step, setStep] = useState(1);
  const [vendor, setVendor] = useState({ name: '', category: '', location: 'Lagos', avatar: '' });
  const [product, setProduct] = useState({ name: '', price: '', category: 'Fashion', image: '', sizes: ['M', 'L', 'XL'] });
  const [currentVendor, setCurrentVendor] = useState(null);

  if (!isOpen) return null;

  const handleRegisterVendor = (e) => {
    e.preventDefault();
    if (!vendor?.name || "" || !vendor.category) return;
    
    const avatarUrl = vendor.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
    const saved = saveVendor({ ...vendor, avatar: avatarUrl });
    setCurrentVendor(saved);
    setStep(2);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!product?.name || "" || !product.price) return;

    const imageUrl = product?.image || "" || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
    saveProduct({
      ...product,
      vendorId: currentVendor.id,
      brand: currentVendor?.name || "",
      image: imageUrl,
      tag: 'Fresh Drop'
    });

    onRefresh();
    setStep(3);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
      <div style={{ backgroundColor: '#FDF6EC', color: '#111827', width: '100%', maxWidth: '480px', borderRadius: '16px', border: '1px solid #111827', padding: '24px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {step === 1 && (
          <form onSubmit={handleRegisterVendor}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Store size={22} />
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Register Your Store</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Store Name</label>
                <input required type="text" placeholder="e.g. House of Elegance" value={vendor?.name || ""} onChange={e => setVendor({ ...vendor, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Category</label>
                <input required type="text" placeholder="e.g. Luxury Menswear, Streetwear" value={vendor.category} onChange={e => setVendor({ ...vendor, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Location in Lagos</label>
                <input required type="text" placeholder="e.g. Lekki Phase 1, Ikeja" value={vendor.location} onChange={e => setVendor({ ...vendor, location: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Logo / Avatar Image URL (Optional)</label>
                <input type="url" placeholder="https://..." value={vendor.avatar} onChange={e => setVendor({ ...vendor, avatar: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <button type="submit" style={{ marginTop: '12px', backgroundColor: '#111827', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                Create Vendor Profile & Continue
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleAddProduct}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Plus size={22} />
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Upload First Product</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Product Title</label>
                <input required type="text" placeholder="e.g. Velvet Embroidered Agbada" value={product?.name || ""} onChange={e => setProduct({ ...product, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Price (₦)</label>
                <input required type="number" placeholder="25000" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Product Image URL (Optional)</label>
                <input type="url" placeholder="https://..." value={product?.image || ""} onChange={e => setProduct({ ...product, image: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }} />
              </div>

              <button type="submit" style={{ marginTop: '12px', backgroundColor: '#10B981', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                Publish Product to Homepage
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} style={{ color: '#10B981', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' }}>You're Live on Faster Shop!</h2>
            <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '20px' }}>Your vendor store and product are now displayed in real-time on the homepage feed.</p>
            <button onClick={onClose} style={{ backgroundColor: '#111827', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
              View Storefront
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
