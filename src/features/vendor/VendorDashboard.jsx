import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ShoppingBag, Store, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { subscribeProducts, createOrderRecord } from '../../lib/firestore.js';
import VendorDashboard from '../vendor/VendorDashboard';

export default function HomePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('shop');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderMessage, setOrderMessage] = useState('');

  // Fetch live products from Firestore
  useEffect(() => {
    try {
      const unsubscribe = subscribeProducts((liveProducts) => {
        setProducts(liveProducts || []);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (err) {
      console.error("Error subscribing to products:", err);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const orderData = {
        buyerUid: user?.uid || 'guest',
        buyerEmail: user?.email || 'guest@fasterapp.com',
        items: cart,
        totalAmount: calculateTotal(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      await createOrderRecord(orderData);
      setOrderMessage('🎉 Order placed successfully!');
      setCart([]);
    } catch (err) {
      setOrderMessage(`Checkout failed: ${err.message}`);
    }
  };

  return (
    <div className="marketplace-shell" style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header className="market-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
        <div className="brand brand--market" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px' }}>
          <ShoppingBag size={22} />
          <span>faster<span style={{ color: '#0066cc' }}>shop</span></span>
        </div>

        <div className="market-mode-switcher" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setMode('shop')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: mode === 'shop' ? '#000' : '#fff', color: mode === 'shop' ? '#fff' : '#000', fontWeight: 'bold' }}
          >
            <ShoppingBag size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Shop
          </button>
          
          <button 
            onClick={() => setMode('vendor')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: mode === 'vendor' ? '#000' : '#fff', color: mode === 'vendor' ? '#fff' : '#000', fontWeight: 'bold' }}
          >
            <Store size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Vendor
          </button>

          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Log Out
          </button>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
        {mode === 'vendor' ? (
          <VendorDashboard />
        ) : (
          <div>
            {orderMessage && (
              <div style={{ padding: '12px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                {orderMessage}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '2fr 1fr' : '1fr', gap: '24px' }}>
              <div>
                <h2 style={{ marginBottom: '16px' }}>🛍️ Marketplace Products</h2>
                {products.length === 0 ? (
                  <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center', border: '1px solid #eee' }}>
                    <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>No products published yet.</p>
                    <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>Switch to the <strong>Vendor</strong> tab to add your first item!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {products.map((item) => (
                      <div key={item.id || Math.random()} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '16px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <img 
                            src={item.imageUrl || 'https://via.placeholder.com/200'} 
                            alt={item?.name || "" || 'Product'} 
                            style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} 
                          />
                          <h4 style={{ margin: '0 0 6px 0' }}>{item?.name || ""}</h4>
                          <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#0066cc' }}>₦{Number(item.price || 0).toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => addToCart(item)}
                          style={{ width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #e0e0e0', height: 'fit-content' }}>
                  <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={20} /> Cart ({cart.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item?.name || ""}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>₦{Number(item.price || 0).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)} 
                          style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total:</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
