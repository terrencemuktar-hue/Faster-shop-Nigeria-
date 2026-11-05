import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  // Navigation & View States
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'shop' | 'search' | 'wishlist' | 'profile' | 'messages' | 'notifications' | 'vendor_dashboard'
  const [authScreen, setAuthScreen] = useState('welcome'); // 'welcome' | 'signup' | 'login'
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Auth Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' | 'vendor'
  const [authError, setAuthError] = useState('');

  // Data States
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Vendor Upload Form States
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Hair');
  const [prodFile, setProdFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Exact Category Colors and Emojis
  const categories = [
    { name: 'Hair', emoji: '👩‍🦱', bg: 'bg-[#FDF0F6]' },
    { name: 'Hoodies', emoji: '🧥', bg: 'bg-[#FEF9C3]' },
    { name: 'Gowns', emoji: '👗', bg: 'bg-[#F3E8FF]' },
    { name: 'Perfumes', emoji: '✨', bg: 'bg-[#E0F2FE]' },
    { name: 'Shoes', emoji: '👟', bg: 'bg-[#DCFCE7]' },
    { name: 'Bags', emoji: '👜', bg: 'bg-[#FFEDD5]' },
    { name: 'Native', emoji: '🧵', bg: 'bg-[#FFE4E6]' },
    { name: 'Streetwear', emoji: '🔥', bg: 'bg-[#EEF2FF]' }
  ];

  // Initialize Session & Auth Listeners
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
        setAuthScreen('welcome');
      }
    });

    fetchProducts();
    fetchVendors();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } catch (err) {
      console.error('Products fetch error:', err);
    }
  };

  const fetchVendors = async () => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('role', 'vendor');
      if (data) setVendors(data);
    } catch (err) {
      console.error('Vendors fetch error:', err);
    }
  };

  // Auth Handlers
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').insert([
        { id: data.user.id, email, full_name: fullName, role, created_at: new Date() }
      ]);
      fetchProfile(data.user.id);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setAuthScreen('welcome');
  };

  // Product Upload Handler for Vendors
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!profile || profile.role !== 'vendor') return;

    setUploading(true);
    let imageUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500';

    if (prodFile) {
      const fileExt = prodFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, prodFile);

      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        if (data) imageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from('products').insert([
      {
        title: prodTitle,
        price: parseFloat(prodPrice),
        category: prodCategory,
        image_url: imageUrl,
        vendor_id: profile.id,
        created_at: new Date()
      }
    ]);

    setUploading(false);
    if (!error) {
      alert('Product published successfully!');
      setProdTitle('');
      setProdPrice('');
      setProdFile(null);
      fetchProducts();
      setActiveTab('home');
    } else {
      alert('Error uploading product: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00C950] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // AUTHENTICATION SCREENS (WELCOME / SIGNUP / LOGIN)
  if (!session) {
    if (authScreen === 'welcome') {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 text-center">
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center font-black text-black text-3xl">
              F
            </div>
            <h1 className="text-3xl font-black tracking-wider">FASTER SHOP</h1>
            <p className="text-gray-400 text-sm max-w-xs">Nigeria's Premier Vendor-Focused Fashion Marketplace</p>
          </div>
          <div className="space-y-3 pb-8">
            <button
              onClick={() => setAuthScreen('signup')}
              className="w-full py-4 bg-[#00C950] hover:bg-emerald-600 font-bold text-black rounded-2xl shadow-lg transition"
            >
              Create Account
            </button>
            <button
              onClick={() => setAuthScreen('login')}
              className="w-full py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition"
            >
              Login
            </button>
          </div>
        </div>
      );
    }

    if (authScreen === 'signup') {
      return (
        <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto text-white font-black text-xl">F</div>
              <h2 className="text-2xl font-bold">Join Faster Shop</h2>
            </div>

            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">{authError}</div>}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nwezeh Terrence Uche"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C950]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="terrence@fastersub.ng"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C950]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C950]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-3 rounded-xl text-xs font-bold border transition ${role === 'buyer' ? 'bg-[#00C950] text-black border-[#00C950]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    Buyer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`py-3 rounded-xl text-xs font-bold border transition ${role === 'vendor' ? 'bg-[#00C950] text-black border-[#00C950]' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                  >
                    Vendor
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#00C950] hover:bg-emerald-600 font-bold text-black rounded-2xl shadow-md transition">
                Create Account
              </button>
            </form>

            <p className="text-center text-xs text-gray-500">
              Already registered? <button onClick={() => setAuthScreen('login')} className="font-bold text-black underline">Login</button>
            </p>
          </div>
        </div>
      );
    }

    if (authScreen === 'login') {
      return (
        <div className="min-h-screen bg-[#F5F5F5] text-black flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto text-white font-black text-xl">F</div>
              <h2 className="text-2xl font-bold">Welcome Back</h2>
            </div>

            {authError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">{authError}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="terrence@fastersub.ng"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C950]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#00C950]"
                />
              </div>

              <button type="submit" className="w-full py-4 bg-[#00C950] hover:bg-emerald-600 font-bold text-black rounded-2xl shadow-md transition">
                Login
              </button>
            </form>

            <p className="text-center text-xs text-gray-500">
              Need an account? <button onClick={() => setAuthScreen('signup')} className="font-bold text-black underline">Sign Up</button>
            </p>
          </div>
        </div>
      );
    }
  }

  // MAIN MARKETPLACE APP UI
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title ? p.title.toLowerCase().includes(globalSearch.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  const getInitials = (name) => {
    if (!name) return 'TN';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black pb-24 font-sans">
      {/* 1. TOP BLACK HEADER */}
      <header className="bg-black text-white p-4 space-y-3 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-white text-black font-black text-xl rounded-lg flex items-center justify-center">
              F
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wider leading-none">FASTER</h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-0.5">SHOP NIGERIA</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('messages')} className="relative text-xl">
              💬
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>
            <button onClick={() => setActiveTab('notifications')} className="text-xl">🔔</button>
            <button onClick={() => setActiveTab('profile')} className="text-xl">⚙️</button>
            <button onClick={() => setActiveTab('wishlist')} className="text-xl">👜</button>
          </div>
        </div>

        {/* Global Search Pill Bar */}
        <div className="relative">
          <span className="absolute left-4 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search products, vendors..."
            className="w-full bg-white text-black rounded-full py-2 pl-10 pr-4 text-xs font-medium placeholder-gray-400 focus:outline-none"
          />
        </div>
      </header>

      {/* 2. TAB CONTENT VIEW SWITCHER */}
      <main className="p-4 max-w-md mx-auto space-y-6">

        {/* --- HOME TAB --- */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] text-gray-300 text-xs py-2.5 px-4 rounded-xl text-center font-medium">
              No stories yet - Vendors post from their profile
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black">Featured Drops</h2>
              <button onClick={() => setActiveTab('search')} className="text-[#00C950] font-bold text-sm">See All</button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white p-3 rounded-2xl shadow-sm space-y-2">
                    <img src={p.image_url} alt={p.title} className="w-full h-36 object-cover rounded-xl" />
                    <span className="text-[10px] font-bold uppercase text-[#00C950]">{p.category}</span>
                    <h4 className="font-bold text-xs truncate">{p.title}</h4>
                    <p className="font-black text-sm">₦{p.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm space-y-4">
                <p className="text-gray-500 font-medium text-sm">No products yet - Be the first vendor to post</p>
                <button
                  onClick={() => {
                    if (profile?.role === 'vendor') setActiveTab('vendor_dashboard');
                    else setAuthScreen('signup');
                  }}
                  className="bg-[#00C950] hover:bg-emerald-600 font-bold text-black text-xs px-6 py-3 rounded-full shadow-sm transition"
                >
                  Become a Vendor
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xl font-black">New Brands</h2>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
                {vendors.length > 0 ? (
                  vendors.map((v) => (
                    <div key={v.id} className="bg-white p-3 rounded-2xl flex items-center space-x-3 shrink-0 shadow-sm">
                      <div className="w-10 h-10 bg-black text-white font-black rounded-full flex items-center justify-center text-xs">
                        {getInitials(v.full_name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">{v.full_name} Store</h4>
                        <p className="text-[10px] text-gray-400">0 Followers OK</p>
                      </div>
                      <button onClick={() => setActiveTab('shop')} className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Visit</button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-3 rounded-2xl flex items-center space-x-3 shrink-0 shadow-sm">
                    <div className="w-10 h-10 bg-black text-white font-black rounded-full flex items-center justify-center text-xs">T</div>
                    <div>
                      <h4 className="font-bold text-xs">Terrence Uche...</h4>
                      <p className="text-[10px] text-gray-400">0 Followers OK</p>
                    </div>
                    <button onClick={() => setActiveTab('shop')} className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full">Visit</button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#00C950] rounded-3xl p-6 text-center space-y-4">
              <h3 className="text-xl font-black text-black">0 Followers OK - Start Selling Today</h3>
              <p className="text-black/80 font-semibold text-xs max-w-xs mx-auto">
                Join Nigeria's fastest growing vendor network instantly.
              </p>
              <button
                onClick={() => {
                  if (profile?.role === 'vendor') setActiveTab('vendor_dashboard');
                  else setAuthScreen('signup');
                }}
                className="bg-black text-white font-bold text-xs px-6 py-3 rounded-full shadow-md hover:bg-zinc-800 transition"
              >
                Register as Vendor
              </button>
            </div>
          </div>
        )}

        {/* --- SEARCH / EXPLORE CATEGORIES TAB --- */}
        {activeTab === 'search' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black">Explore Categories</h2>

            <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search category, items..."
                className="w-full bg-transparent text-xs font-medium placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories
                .filter((c) => c.name.toLowerCase().includes(categorySearch.toLowerCase()))
                .map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setActiveTab('home');
                    }}
                    className={`${cat.bg} p-4 rounded-2xl flex items-center space-x-3 cursor-pointer shadow-sm hover:opacity-90 transition`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="font-black text-sm text-black">{cat.name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- SHOP VENDORS TAB --- */}
        {activeTab === 'shop' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black">Shop Vendors</h2>

            <div className="bg-white p-6 rounded-3xl text-center space-y-3 shadow-sm border border-gray-100 max-w-xs mx-auto">
              <div className="w-16 h-16 bg-black text-white font-black rounded-full flex items-center justify-center text-xl mx-auto border-2 border-[#00C950]">
                {getInitials(profile?.full_name)}
              </div>
              <div>
                <h3 className="font-black text-base flex items-center justify-center space-x-1">
                  <span>{profile?.full_name || 'Terrence Uche Store'}</span>
                  <span className="text-black text-xs">✓</span>
                </h3>
                <p className="text-xs text-gray-400 font-medium">0 Followers</p>
              </div>
              <button
                onClick={() => {
                  if (profile?.role === 'vendor') setActiveTab('vendor_dashboard');
                  else alert('Store details & inventory preview');
                }}
                className="w-full bg-black text-white font-bold text-xs py-3 rounded-full hover:bg-zinc-800 transition"
              >
                View Store
              </button>
            </div>
          </div>
        )}

        {/* --- WISHLIST TAB --- */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 text-center py-12">
            <h2 className="text-2xl font-black text-left">My Wishlist</h2>
            <div className="space-y-4 pt-8">
              <span className="text-6xl block">🤍</span>
              <p className="text-gray-400 font-medium text-sm">No wishlist items yet</p>
              <button onClick={() => setActiveTab('home')} className="bg-black text-white font-bold text-xs px-8 py-3.5 rounded-full hover:bg-zinc-800 transition">
                Browse Shop
              </button>
            </div>
          </div>
        )}

        {/* --- PROFILE TAB --- */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl flex items-center space-x-4 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-black text-white font-black rounded-full flex items-center justify-center text-lg shrink-0">
                {getInitials(profile?.full_name)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-black text-base truncate">{profile?.full_name || 'Nwezeh Terrence Uche'}</h3>
                <p className="text-xs text-gray-400 truncate">{profile?.email || 'terrence@fastersub.ng'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider px-1">ACCOUNT & DELIVERIES</h4>
              
              <div className="bg-white rounded-3xl divide-y divide-gray-100 shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📦</span>
                    <span className="font-bold text-xs">My Orders & Deliveries</span>
                  </div>
                  <span className="text-gray-400 text-xs">→</span>
                </div>

                <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📍</span>
                    <span className="font-bold text-xs">Saved Shipping Addresses</span>
                  </div>
                  <span className="text-gray-400 text-xs">→</span>
                </div>

                <div
                  onClick={() => {
                    if (profile?.role === 'vendor') setActiveTab('vendor_dashboard');
                    else alert('Only registered vendors can access stories & vendor controls.');
                  }}
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🚀</span>
                    <span className="font-bold text-xs">Vendor Dashboard & Stories</span>
                  </div>
                  <span className="text-gray-400 text-xs">→</span>
                </div>

                <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">⚙️</span>
                    <span className="font-bold text-xs">Account Settings</span>
                  </div>
                  <span className="text-gray-400 text-xs">→</span>
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="w-full py-3.5 bg-red-50 text-red-600 font-bold text-xs rounded-2xl hover:bg-red-100 transition">
              Sign Out
            </button>
          </div>
        )}

        {/* --- MESSAGES SCREEN --- */}
        {activeTab === 'messages' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black flex items-center space-x-2">
              <span>Messages</span>
              <span className="text-xl">💬</span>
            </h2>
            <div className="bg-[#00C950] text-black font-bold text-xs p-4 rounded-2xl shadow-sm">
              Welcome to Fastershop, start shopping today with vendors across Nigeria! 🎉
            </div>
            <p className="text-center text-xs text-gray-400 pt-8">No chats yet - message a vendor from their store</p>
          </div>
        )}

        {/* --- NOTIFICATIONS SCREEN --- */}
        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-black flex items-center space-x-2">
              <span>Notifications</span>
              <span className="text-xl">🔔</span>
            </h2>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl flex justify-between items-start shadow-sm border border-gray-100">
                <div>
                  <h4 className="font-bold text-xs">Your order is out for delivery</h4>
                  <p className="text-[10px] text-gray-400 mt-1">10m ago</p>
                </div>
                <span className="w-2 h-2 bg-pink-500 rounded-full mt-1"></span>
              </div>
              <div className="bg-white p-4 rounded-2xl flex justify-between items-start shadow-sm border border-gray-100">
                <div>
                  <h4 className="font-bold text-xs">New vendor Aura Lagos joined Faster Shop</h4>
                  <p className="text-[10px] text-gray-400 mt-1">2h ago</p>
                </div>
                <span className="w-2 h-2 bg-pink-500 rounded-full mt-1"></span>
              </div>
            </div>
          </div>
        )}

        {/* --- VENDOR DASHBOARD PAGE --- */}
        {activeTab === 'vendor_dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black">Vendor Portal</h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-gray-100">
              <h3 className="font-bold text-sm">Upload New Item</h3>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    placeholder="e.g. Vintage Silk Shirt"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Product Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProdFile(e.target.files[0])}
                    className="w-full text-xs text-gray-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-3 bg-[#00C950] text-black font-bold text-xs rounded-xl shadow-md transition hover:bg-emerald-600"
                >
                  {uploading ? 'Publishing...' : 'Publish to Marketplace'}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* 3. BOTTOM NAVIGATION (5 TABS) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black text-white py-2 px-4 flex justify-around items-center border-t border-zinc-900 z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center text-[10px] font-bold ${activeTab === 'home' ? 'text-[#00C950]' : 'text-gray-400'}`}>
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </button>

        <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center text-[10px] font-bold ${activeTab === 'shop' ? 'text-[#00C950]' : 'text-gray-400'}`}>
          <span className="text-lg">🛍️</span>
          <span>Shop</span>
        </button>

        <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center text-[10px] font-bold ${activeTab === 'search' ? 'text-[#00C950]' : 'text-gray-400'}`}>
          <span className="text-lg">🔍</span>
          <span>Search</span>
        </button>

        <button onClick={() => setActiveTab('wishlist')} className={`flex flex-col items-center text-[10px] font-bold ${activeTab === 'wishlist' ? 'text-[#00C950]' : 'text-gray-400'}`}>
          <span className="text-lg">🤍</span>
          <span>Wishlist</span>
        </button>

        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center text-[10px] font-bold ${activeTab === 'profile' ? 'text-[#00C950]' : 'text-gray-400'}`}>
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}