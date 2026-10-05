import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  MessageCircle, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';

const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Hand-Woven Aso-Oke Tote Bag',
    category: 'Textiles',
    price: 18100,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    maker: 'Amina Atelier',
    makerLocation: 'Surulere, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-2',
    name: 'Raw Unrefined Shea Body Butter Oil',
    category: 'Beauty',
    price: 12400,
    image: 'https://images.unsplash.com/photo-1608248597263-000799965d13?auto=format&fit=crop&w=800&q=80',
    maker: 'Nia Botanicals',
    makerLocation: 'Ikeja, Lagos',
    rating: 5.0,
  },
  {
    id: 'prod-3',
    name: 'Handcrafted Terracotta Coffee Mug',
    category: 'Craft',
    price: 8800,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    maker: 'Yaba Clay Studio',
    makerLocation: 'Yaba, Lagos',
    rating: 4.8,
  },
  {
    id: 'prod-4',
    name: 'Hand-woven Elephant Grass Basket',
    category: 'Home',
    price: 22200,
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    maker: 'Kano Crafts Collective',
    makerLocation: 'Lekki Phase 1, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-5',
    name: 'Adire Indigo Silk Table Runner',
    category: 'Textiles',
    price: 26500,
    image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    maker: 'Amina Atelier',
    makerLocation: 'Surulere, Lagos',
    rating: 5.0,
  },
  {
    id: 'prod-6',
    name: 'Botanical Hibiscus & Neem Facial Scrub',
    category: 'Beauty',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    maker: 'Nia Botanicals',
    makerLocation: 'Ikeja, Lagos',
    rating: 4.7,
  },
  {
    id: 'prod-7',
    name: 'Handmade Carved Teak Serving Bowl',
    category: 'Home',
    price: 19800,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    maker: 'Benin Woodwork Studio',
    makerLocation: 'Victoria Island, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-8',
    name: 'Custom Brass Pendant & Bead Necklace',
    category: 'Craft',
    price: 15200,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    maker: 'Eko Jewelry House',
    makerLocation: 'Ikoyi, Lagos',
    rating: 4.8,
  },
];

const VENDORS = [
  {
    id: 'v-1',
    name: 'Amina Atelier',
    specialty: 'Aso-Oke & Indigo Textiles',
    location: 'Surulere, Lagos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'v-2',
    name: 'Nia Botanicals',
    specialty: 'Organic Shea & Oils',
    location: 'Ikeja, Lagos',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'v-3',
    name: 'Yaba Clay Studio',
    specialty: 'Handthrown Ceramics',
    location: 'Yaba, Lagos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'v-4',
    name: 'Kano Crafts Co.',
    specialty: 'Natural Fiber Weaving',
    location: 'Lekki Phase 1, Lagos',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.maker.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const generateWhatsAppLink = (productName, price) => {
    const text = encodeURIComponent(`Hi! I want to buy the "${productName}" (₦${price.toLocaleString()}) on Faster Shop Nigeria.`);
    return `https://wa.me/2348123456789?text=${text}`;
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FDF6EC', color: '#111827', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#14332E', color: '#FDF6EC', borderBottom: '1px solid rgba(15, 45, 45, 0.5)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '16px', backgroundColor: '#FDF6EC', color: '#14332E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
              ⚡
            </div>
            <div>
              <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#FDF6EC', letterSpacing: '-0.5px' }}>
                Faster Shop
              </span>
              <span style={{ display: 'block', fontSize: '10px', color: '#A8C3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Lagos Edition
              </span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '32px', fontSize: '14px', fontWeight: '500', color: '#E2EFEB' }}>
            <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop Collections</a>
            <a href="#vendors" style={{ color: 'inherit', textDecoration: 'none' }}>Makers & Artisans</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isSearchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#0F2D2D', borderRadius: '16px', padding: '6px 12px', border: '1px solid #234D46' }}>
                <Search size={16} color="#A8C3B8" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14px', width: '160px' }}
                  autoFocus
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: '#A8C3B8', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} style={{ background: 'none', border: 'none', color: '#E2EFEB', cursor: 'pointer', padding: '8px' }}>
                <Search size={20} />
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', padding: '10px 14px', borderRadius: '16px', backgroundColor: '#0F2D2D', color: '#E2EFEB', border: '1px solid #234D46', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <ShoppingBag size={20} />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>Bag</span>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: '#E11D48', color: '#fff', fontSize: '11px', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button onClick={handleLogout} style={{ padding: '10px 16px', borderRadius: '16px', backgroundColor: '#0F2D2D', color: '#ef4444', border: '1px solid #3b1d22', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                Log Out
              </button>
            ) : (
              <button style={{ padding: '10px 18px', borderRadius: '16px', backgroundColor: '#FDF6EC', color: '#14332E', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ backgroundColor: '#14332E', color: '#FDF6EC', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: '#0F2D2D', border: '1px solid #234D46', fontSize: '12px', color: '#A8C3B8', marginBottom: '24px' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>Direct from independent makers in Lagos</span>
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '48px', fontWeight: 'normal', lineHeight: '1.15', margin: '0 0 20px 0' }}>
              Shop what feels local, <br />
              <span style={{ fontStyle: 'italic', fontWeight: '300', color: '#D1E3DB' }}>made with heart.</span>
            </h1>

            <p style={{ color: '#B3CEBF', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '500px' }}>
              Discover verified local artisans across Surulere, Yaba, Ikeja, and Lekki. Everyday bags, pottery, oils, and textiles crafted in small batches.
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#shop" style={{ padding: '14px 24px', borderRadius: '16px', backgroundColor: '#FDF6EC', color: '#14332E', fontWeight: '600', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Browse collections</span>
                <ArrowRight size={16} />
              </a>
              <a href="#vendors" style={{ padding: '14px 24px', borderRadius: '16px', border: '1px solid #2e5e55', color: '#E2EFEB', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
                Meet the makers
              </a>
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: '#FDF6EC', color: '#111827', borderRadius: '24px', padding: '24px', border: '1px solid #E8DCCB', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" alt="Amina" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#14332E', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '20px' }}>
                  Vendor Pick of the Week
                </div>
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#14332E' }}>Amina Atelier</h3>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Surulere, Lagos • Master Aso-Oke Weaver</p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" style={{ padding: '48px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid #E8DCCB', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#14332E' }}>Small Batch Drops</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 'bold', color: '#14332E', margin: '4px 0 0 0' }}>Fresh finds for today</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Textiles', 'Home', 'Beauty', 'Craft'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  border: '1px solid #E8DCCB',
                  backgroundColor: selectedCategory === category ? '#14332E' : '#fff',
                  color: selectedCategory === category ? '#FDF6EC' : '#374151',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E8DCCB', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(253, 246, 236, 0.9)', color: '#14332E', fontSize: '10px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                    {product.category}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>By {product.maker}</div>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 'bold', color: '#14332E', margin: '4px 0 8px 0' }}>{product.name}</h3>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#14332E' }}>₦{product.price.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => addToCart(product)}
                  style={{ flex: 1, padding: '10px', borderRadius: '12px', backgroundColor: '#FDF6EC', color: '#14332E', border: '1px solid #E8DCCB', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                >
                  Add to Bag
                </button>
                <a
                  href={generateWhatsAppLink(product.name, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '10px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#FDF6EC', height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E8DCCB', paddingBottom: '12px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#14332E' }}>Your Bag ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>Your bag is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '12px', border: '1px solid #E8DCCB', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#14332E' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#14332E' }}>₦{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #E8DCCB', paddingTop: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', color: '#14332E' }}>
                  <span>Total:</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <button style={{ width: '100%', padding: '14px', backgroundColor: '#14332E', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Pay via Paystack
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#14332E', color: '#FDF6EC', padding: '48px 24px 24px 24px', borderTop: '1px solid #0F2D2D' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#A8C3B8', margin: 0 }}>© 2026 Faster Shop Nigeria. Built for Lagos Makers.</p>
        </div>
      </footer>

    </div>
  );
}
