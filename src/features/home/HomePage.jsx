import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, PlusCircle } from 'lucide-react';
import { getVendors, getProducts } from '../../lib/store';
import VendorRegisterModal from '../vendor/VendorRegisterModal';



export default function HomePage() {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const loadData = () => {
    setVendors(getVendors());
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ backgroundColor: '#FDF6EC', minHeight: '100vh', color: '#111827', fontFamily: 'Georgia, serif' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid #E5E7EB', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FDF6EC', sticky: 'top', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#111827', color: '#FDF6EC', fontWeight: '900', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            F
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Faster Shop</h1>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6B7280' }}>LAGOS EDITION</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setIsRegisterOpen(true)} 
            style={{ backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <PlusCircle size={16} /> Register Vendor
          </button>

          <button style={{ backgroundColor: '#111827', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <ShoppingBag size={16} />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ backgroundColor: '#111827', color: '#FDF6EC', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <span style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
              Direct from Independent Makers in Lagos
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1.1, margin: '16px 0' }}>
              Shop what feels local, made with heart.
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0 0 24px 0' }}>
              Discover verified local artisans across Surulere, Yaba, Ikeja, and Lekki. Everyday bags, streetwear, and textiles crafted in small batches.
            </p>
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '280px' }}>
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* VENDORS SECTION */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 16px 0' }}>People worth meeting</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {vendors.map(v => (
              <div key={v.id} style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={v.avatar} alt={v.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }}>{v.tag}</span>
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>{v.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{v.category}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS FEED */}
        <section>
          <h3 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 16px 0' }}>Fresh finds for today</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {products.map(p => (
              <div key={p.id} style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>By {p.brand}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', margin: '4px 0 8px 0' }}>{p.name}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900' }}>₦{p.price.toLocaleString()}</span>
                    <button onClick={() => setCartCount(c => c + 1)} style={{ backgroundColor: '#111827', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <VendorRegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onRefresh={loadData} 
      />

    </div>
  );
}
