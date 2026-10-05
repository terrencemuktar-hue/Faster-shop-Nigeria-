import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { 
  ShoppingBag, 
  Store, 
  ShoppingCart, 
  Trash2, 
  Search, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  LogOut, 
  Tag, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { subscribeProducts, createOrderRecord, upsertProduct } from '../../lib/firestore.js';

export default function HomePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('shop'); // 'shop' or 'vendor'
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  // Vendor Form State
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [brandTag, setBrandTag] = useState('RUBIAN GIRL');
  const [imageFile, setImageFile] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorMessage, setVendorMessage] = useState('');

  // Real-time Firestore Feed
  useEffect(() => {
    try {
      const unsubscribe = subscribeProducts((liveProducts) => {
        setProducts(liveProducts || []);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    } catch (err) {
      console.error("Error loading products:", err);
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
      setOrderMessage('🎉 Order placed successfully! Your order has been dispatched to vendor.');
      setCart([]);
    } catch (err) {
      setOrderMessage(`Checkout failed: ${err.message}`);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productName || !price) {
      setVendorMessage('Error: Please specify product title and price.');
      return;
    }

    setVendorLoading(true);
    setVendorMessage('');

    try {
      const productData = {
        name: productName,
        price: Number(price),
        category: category,
        brandTag: brandTag,
        imageUrl: imageFile || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
        vendorId: user?.uid || 'anonymous',
        vendorEmail: user?.email || 'Vendor',
        createdAt: new Date().toISOString()
      };

      await upsertProduct(productData);
      setVendorMessage(`✨ "${productName}" is now live on the Faster marketplace!`);
      setProductName('');
      setPrice('');
      setImageFile(null);
    } catch (err) {
      setVendorMessage(`Error publishing item: ${err.message}`);
    } finally {
      setVendorLoading(false);
    }
  };

  const categories = ['All', 'Fashion & Apparel', 'Footwear & Shoes', 'Jewelry & Accessories', 'Bags & Leather Goods', 'Hair & Beauty Products'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brandTag || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#0f0f11', color: '#f3f4f6', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* BRAND HEADER */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: 'rgba(15, 15, 17, 0.95)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid #22222a', 
        padding: '14px 28px',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#e11d48', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            FASTER<span style={{ color: '#e11d48' }}>.SHOP</span>
          </span>
        </div>

        {/* MODE SWITCHER & USER CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#1a1a22', padding: '4px', borderRadius: '10px', display: 'flex', border: '1px solid #2e2e3a' }}>
            <button 
              onClick={() => setMode('shop')}
              style={{ 
                padding: '8px 18px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '13px',
                backgroundColor: mode === 'shop' ? '#e11d48' : 'transparent', 
                color: mode === 'shop' ? '#fff' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              <ShoppingBag size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Shop
            </button>
            <button 
              onClick={() => setMode('vendor')}
              style={{ 
                padding: '8px 18px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: '700', 
                fontSize: '13px',
                backgroundColor: mode === 'vendor' ? '#e11d48' : 'transparent', 
                color: mode === 'vendor' ? '#fff' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              <Store size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Vendor Studio
            </button>
          </div>

          <button 
            onClick={handleLogout}
            title="Log Out"
            style={{ 
              backgroundColor: '#1a1a22', 
              color: '#ef4444', 
              border: '1px solid #3b1d22', 
              borderRadius: '10px', 
              padding: '10px 14px', 
              cursor: 'pointer', 
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={15} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px' }}>
        
        {mode === 'vendor' ? (
          /* HIGH-END VENDOR STUDIO DASHBOARD */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ 
              backgroundColor: '#16161a', 
              borderRadius: '20px', 
              border: '1px solid #2a2a36', 
              padding: '32px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Sparkles size={24} color="#e11d48" />
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>Vendor Studio</h2>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: 0, marginBottom: '24px' }}>
                Store Owner: <span style={{ color: '#fff', fontWeight: '600' }}>{user?.email || 'Logged Vendor'}</span>
              </p>

              {vendorMessage && (
                <div style={{ 
                  padding: '14px 16px', 
                  borderRadius: '10px', 
                  marginBottom: '20px', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  backgroundColor: vendorMessage.startsWith('Error') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  border: vendorMessage.startsWith('Error') ? '1px solid #7f1d1d' : '1px solid #14532d',
                  color: vendorMessage.startsWith('Error') ? '#fca5a5' : '#86efac'
                }}>
                  {vendorMessage}
                </div>
              )}

              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#d1d5db', marginBottom: '6px' }}>PRODUCT TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Blossom Dress, Urban Cargo Pants"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#0f0f11', border: '1px solid #2e2e3a', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#d1d5db', marginBottom: '6px' }}>PRICE (₦ NAIRA)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#0f0f11', border: '1px solid #2e2e3a', color: '#fff', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#d1d5db', marginBottom: '6px' }}>BRAND TAG</label>
                    <select
                      value={brandTag}
                      onChange={(e) => setBrandTag(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#0f0f11', border: '1px solid #2e2e3a', color: '#fff', fontSize: '14px', outline: 'none' }}
                    >
                      <option value="RUBIAN GIRL">RUBIAN GIRL</option>
                      <option value="KINGING">KINGING</option>
                      <option value="HOUSE OF CUPID">HOUSE OF CUPID</option>
                      <option value="INDEPENDENT VENDOR">INDEPENDENT VENDOR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#d1d5db', marginBottom: '6px' }}>CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#0f0f11', border: '1px solid #2e2e3a', color: '#fff', fontSize: '14px', outline: 'none' }}
                  >
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#d1d5db', marginBottom: '6px' }}>PRODUCT PHOTO</label>
                  <label style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '24px', 
                    borderRadius: '12px', 
                    border: '2px dashed #2e2e3a', 
                    cursor: 'pointer',
                    backgroundColor: '#0f0f11',
                    transition: 'all 0.2s'
                  }}>
                    <UploadCloud size={28} color="#9ca3af" />
                    <span style={{ marginTop: '8px', fontSize: '13px', color: '#9ca3af' }}>Click to select photo from iPad / Camera Roll</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>

                  {imageFile && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={imageFile} alt="Preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2e2e3a' }} />
                      <span style={{ fontSize: '12px', color: '#86efac', fontWeight: '600' }}>✓ Image loaded cleanly</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={vendorLoading}
                  style={{ 
                    marginTop: '10px', 
                    padding: '14px', 
                    backgroundColor: '#e11d48', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontWeight: '800', 
                    fontSize: '15px', 
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)'
                  }}
                >
                  {vendorLoading ? 'Publishing Drop...' : 'Publish Product Live'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* BUYER STOREFRONT & DROP FEED */
          <div>
            
            {/* HERO PROMOTIONAL BANNER */}
            <div style={{ 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, #1e1b4b 0%, #111827 50%, #0f0f11 100%)', 
              border: '1px solid #312e81', 
              padding: '36px', 
              marginBottom: '32px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}>
              <div style={{ maxWidth: '550px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(225, 29, 72, 0.2)', border: '1px solid rgba(225, 29, 72, 0.4)', padding: '6px 12px', borderRadius: '20px', color: '#f43f5e', fontSize: '12px', fontWeight: '800', marginBottom: '14px' }}>
                  <Flame size={14} /> NEW SEASON DROPS LIVE
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 12px 0', letterSpacing: '-0.8px', lineHeight: '1.1' }}>
                  Curated Nigerian Fashion & Streetwear Engine
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>
                  Discover direct-from-vendor high street apparel, footwear, and accessories with instant delivery across Nigeria.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '700', letterSpacing: '1px' }}>FEATURED HOUSES</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ backgroundColor: '#be185d', color: '#fff', fontWeight: '800', padding: '6px 12px', borderRadius: '6px', fontSize: '11px' }}>RUBIAN GIRL</span>
                  <span style={{ backgroundColor: '#15803d', color: '#fff', fontWeight: '800', padding: '6px 12px', borderRadius: '6px', fontSize: '11px' }}>KINGING</span>
                </div>
              </div>
            </div>

            {/* SEARCH & CATEGORY FILTER BAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={18} color="#6b7280" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search collections, brands (Rubian Girl, Kinging), or items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', backgroundColor: '#16161a', border: '1px solid #2a2a36', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              {/* CATEGORY PILLS */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: selectedCategory === cat ? '1px solid #e11d48' : '1px solid #27272a',
                      backgroundColor: selectedCategory === cat ? '#e11d48' : '#16161a',
                      color: selectedCategory === cat ? '#fff' : '#9ca3af',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer',
                      whitespace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {orderMessage && (
              <div style={{ padding: '16px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #15803d', color: '#86efac', borderRadius: '12px', marginBottom: '24px', fontWeight: '700', textAlign: 'center' }}>
                {orderMessage}
              </div>
            )}

            {/* PRODUCT GRID & CART DRAWER */}
            <div style={{ display: 'grid', gridTemplateColumns: cart.length > 0 ? '1fr 340px' : '1fr', gap: '28px' }}>
              
              <div>
                {filteredProducts.length === 0 ? (
                  <div style={{ backgroundColor: '#16161a', borderRadius: '16px', border: '1px solid #2a2a36', padding: '48px', textAlign: 'center' }}>
                    <p style={{ color: '#9ca3af', fontSize: '16px', margin: 0, fontWeight: '600' }}>No active drops in this category right now.</p>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '8px' }}>Switch to <strong>Vendor Studio</strong> to publish the first item!</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {filteredProducts.map((item) => (
                      <div key={item.id || Math.random()} style={{ 
                        backgroundColor: '#16161a', 
                        border: '1px solid #2a2a36', 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justify: 'space-between',
                        transition: 'transform 0.2s, boxShadow 0.2s'
                      }}>
                        <div>
                          <div style={{ position: 'relative', height: '220px', backgroundColor: '#000' }}>
                            <img 
                              src={item.imageUrl || 'https://via.placeholder.com/300'} 
                              alt={item.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            {item.brandTag && (
                              <span style={{ 
                                position: 'absolute', 
                                top: '12px', 
                                left: '12px', 
                                backgroundColor: item.brandTag === 'RUBIAN GIRL' ? '#be185d' : '#15803d', 
                                color: '#fff', 
                                fontWeight: '800', 
                                fontSize: '10px', 
                                padding: '4px 8px', 
                                borderRadius: '4px',
                                letterSpacing: '0.5px'
                              }}>
                                {item.brandTag}
                              </span>
                            )}
                          </div>

                          <div style={{ padding: '16px' }}>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '800', color: '#f3f4f6' }}>{item.name}</h4>
                            <div style={{ fontSize: '18px', fontWeight: '900', color: '#e11d48' }}>
                              ₦{Number(item.price || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ padding: '0 16px 16px 16px' }}>
                          <button 
                            onClick={() => addToCart(item)}
                            style={{ 
                              width: '100%', 
                              padding: '12px', 
                              backgroundColor: '#fff', 
                              color: '#000', 
                              border: 'none', 
                              borderRadius: '10px', 
                              fontWeight: '800', 
                              fontSize: '13px', 
                              cursor: 'pointer' 
                            }}
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CART CHECKOUT DRAWER */}
              {cart.length > 0 && (
                <div style={{ backgroundColor: '#16161a', borderRadius: '16px', border: '1px solid #2a2a36', padding: '24px', height: 'fit-content', position: 'sticky', top: '90px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #2a2a36', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '16px' }}>
                      <ShoppingCart size={18} color="#e11d48" />
                      <span>Shopping Bag ({cart.length})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f0f11', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '13px' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#e11d48', fontWeight: '700', marginTop: '2px' }}>₦{Number(item.price || 0).toLocaleString()}</div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(index)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #2a2a36', paddingTop: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px' }}>
                      <span>Total:</span>
                      <span style={{ color: '#e11d48' }}>₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      backgroundColor: '#22c55e', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: '900', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      boxShadow: '0 8px 20px rgba(34, 197, 94, 0.25)'
                    }}
                  >
                    Complete Checkout
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
