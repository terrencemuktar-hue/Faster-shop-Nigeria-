import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// --- HEADER COMPONENT ---
function Header({ onNavigate, searchVal, setSearchVal }) {
  return (
    <header className="bg-black px-4 pt-3 pb-4 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-md overflow-hidden p-1.5">
            <span className="text-black font-black text-xl">F</span>
          </div>
          <div>
            <h1 className="text-white font-black text-[15px] tracking-[2px] leading-none">FASTER</h1>
            <p className="text-gray-400 text-[8px] tracking-[3px] font-semibold mt-0.5">SHOP NIGERIA</p>
          </div>
        </div>
        <div className="flex gap-3.5 items-center text-white">
          <button onClick={() => onNavigate("chat")} className="relative hover:opacity-80 transition cursor-pointer p-1 text-xl">
            💬
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-black"></span>
          </button>
          <button onClick={() => onNavigate("notifications")} className="text-yellow-400 hover:opacity-80 transition cursor-pointer text-xl p-1">
            🔔
          </button>
          <button onClick={() => onNavigate("settings")} className="hover:opacity-80 transition cursor-pointer text-xl p-1">
            ⚙️
          </button>
          <button onClick={() => onNavigate("cart")} className="hover:opacity-80 transition cursor-pointer text-xl p-1">
            👜
          </button>
        </div>
      </div>
      <div className="mt-3.5 bg-white rounded-full flex items-center px-4 py-2.5 shadow-inner">
        <span className="text-gray-400 mr-2 text-sm">🔍</span>
        <input 
          value={searchVal || ""} 
          onChange={(e) => setSearchVal(e.target.value)} 
          placeholder="Search products, vendors..." 
          className="bg-transparent outline-none w-full text-sm text-black placeholder-gray-400 font-medium" 
        />
      </div>
    </header>
  );
}

// --- BOTTOM NAVIGATION ---
function BottomNav({ currentTab, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'wishlist', label: 'Wishlist', icon: '🤍' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 px-6 flex justify-between items-center z-50 border-t border-white/10 max-w-md mx-auto">
      {tabs.map((tab) => (
        <button 
          key={tab.id} 
          onClick={() => onNavigate(tab.id)} 
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${currentTab === tab.id ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[10px] tracking-wide">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

// --- 1. HOME PAGE ---
function HomePage({ onNavigate, setSelectedVendor, setSelectedProduct, addToCart }) {
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchFeed();
    fetchVendors();
  }, []);

  const fetchFeed = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, vendors(shop_name, avatar_url)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: true });
    setVendors(data || []);
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen text-black">
      {/* Vendors Horizontal Bar */}
      <div className="bg-black/90 py-3 px-4 flex gap-4 overflow-x-auto no-scrollbar">
        {vendors.length === 0 ? (
          <div className="text-gray-400 text-xs py-1">No vendors yet</div>
        ) : (
          vendors.map(v => (
            <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center bg-black text-white font-bold">
                {v.avatar_url ? <img src={v.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover border-2 border-black" /> : (v.shop_name?.[0] || 'V')}
              </div>
              <span className="text-white text-[11px] mt-1 truncate max-w-[70px]">{v.shop_name || 'Vendor'}</span>
            </div>
          ))
        )}
      </div>

      {/* Real Products Feed */}
      <div className="px-4 mt-4">
        <h2 className="font-bold text-lg text-black mb-3">Live Marketplace Feed</h2>
        {products.length === 0 ? (
          <div className="bg-white p-6 rounded-[24px] text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-3">No products yet - Vendors add your first product</p>
            <button onClick={() => onNavigate('vendor-dashboard')} className="bg-[#22c55e] text-black font-bold px-6 py-2 rounded-full text-sm cursor-pointer shadow">
              Vendor Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {p.vendors?.avatar_url ? <img src={p.vendors.avatar_url} className="w-full h-full object-cover" /> : (p.vendors?.shop_name?.[0] || 'V')}
                  </div>
                  <span className="font-bold text-xs">{p.vendors?.shop_name || 'Faster Vendor'}</span>
                </div>
                <div onClick={() => { setSelectedProduct(p); onNavigate('product'); }} className="relative h-64 w-full cursor-pointer">
                  <img src={p.image_url || p.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"} alt={p.name} className="w-full h-full object-cover rounded-[16px]" />
                </div>
                <div className="mt-3">
                  <h3 className="font-bold text-sm">{p.name || ""}</h3>
                  <p className="text-green-600 font-black text-base mt-0.5">₦{p.price || 0}</p>
                  {p.story && <p className="text-gray-600 text-xs mt-1 italic">"{p.story}"</p>}
                  {p.sizes && p.sizes.length > 0 && (
                    <div className="flex gap-1.5 mt-2">
                      {p.sizes.map((s, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={() => addToCart(p, p.sizes?.[0] || 'Standard')}
                    className="mt-3 w-full bg-[#22c55e] text-black font-bold py-2.5 rounded-full text-xs cursor-pointer shadow hover:bg-emerald-400 transition"
                  >
                    Add to Cart 👜
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 2. SHOP VENDORS PAGE ---
function ShopPage({ onNavigate, setSelectedVendor }) {
  const [vendorsList, setVendorsList] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: true });
    setVendorsList(data || []);
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Shop Vendors</h2>
      {vendorsList.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-xs">No vendors yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {vendorsList.map(v => (
            <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="bg-white p-4 rounded-[20px] shadow-sm cursor-pointer flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-black text-white font-black flex items-center justify-center text-lg mb-2 border-2 border-green-500 overflow-hidden">
                {v.avatar_url ? <img src={v.avatar_url} className="w-full h-full object-cover" /> : (v.shop_name?.[0] || 'V')}
              </div>
              <h3 className="font-bold text-sm truncate max-w-[120px]">{v.shop_name || ""}</h3>
              <p className="text-gray-500 text-[11px] mt-0.5">Verified Vendor</p>
              <button className="mt-3 bg-black text-white text-xs px-4 py-1.5 rounded-full font-bold w-full">View Store</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 3. VENDOR PROFILE PAGE ---
function VendorDetailPage({ selectedVendor, onNavigate, addToCart }) {
  const [vendorData, setVendorData] = useState(selectedVendor);
  const [products, setProducts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bioEdit, setBioEdit] = useState(selectedVendor?.bio || '');
  const [avatarEdit, setAvatarEdit] = useState(selectedVendor?.avatar_url || '');

  useEffect(() => {
    if (selectedVendor?.id) {
      loadVendorDetails();
    }
  }, [selectedVendor]);

  const loadVendorDetails = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);

    const { data: v } = await supabase.from('vendors').select('*').eq('id', selectedVendor.id).single();
    if (v) {
      setVendorData(v);
      setBioEdit(v.bio || '');
      setAvatarEdit(v.avatar_url || '');
    }

    const { count } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('vendor_id', selectedVendor.id);
    setFollowersCount(count || 0);

    const { data: prods } = await supabase.from('products').select('*').eq('vendor_id', selectedVendor.id);
    setProducts(prods || []);

    if (user) {
      const { data: f } = await supabase.from('follows').select('*').eq('vendor_id', selectedVendor.id).eq('follower_id', user.id).maybeSingle();
      setIsFollowing(!!f);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) return alert('Please log in to follow vendors');
    if (isFollowing) {
      await supabase.from('follows').delete().eq('vendor_id', vendorData.id).eq('follower_id', currentUser.id);
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      await supabase.from('follows').insert({ vendor_id: vendorData.id, follower_id: currentUser.id });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleUpdateProfile = async () => {
    await supabase.from('vendors').update({ bio: bioEdit, avatar_url: avatarEdit }).eq('id', vendorData.id);
    setVendorData(prev => ({ ...prev, bio: bioEdit, avatar_url: avatarEdit }));
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (!vendorData) return <div className="p-6 text-center">Loading vendor...</div>;

  const isOwner = currentUser?.id === vendorData.id;

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <button onClick={() => onNavigate('shop')} className="mb-3 text-xs font-bold text-gray-600">← Back to Shop</button>
      <div className="bg-white rounded-[24px] p-5 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white font-black flex items-center justify-center text-2xl mx-auto border-4 border-green-500 mb-3 overflow-hidden">
          {vendorData.avatar_url ? <img src={vendorData.avatar_url} className="w-full h-full object-cover" /> : (vendorData.shop_name?.[0] || 'V')}
        </div>
        <h2 className="font-black text-xl">{vendorData.shop_name || ""}</h2>
        <p className="text-xs text-gray-500 mt-1">{followersCount} Followers • Verified Vendor</p>
        <p className="text-xs text-gray-700 mt-2 italic">{vendorData.bio || "Welcome to my store!"}</p>

        <div className="flex gap-2 mt-4">
          <button onClick={handleFollowToggle} className={`flex-1 py-2 rounded-full font-bold text-xs ${isFollowing ? 'bg-gray-200 text-black' : 'bg-black text-white'}`}>
            {isFollowing ? 'Following ✓' : 'Follow'}
          </button>
          {isOwner && (
            <button onClick={() => setIsEditing(!isEditing)} className="flex-1 bg-green-100 text-green-800 py-2 rounded-full font-bold text-xs">
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mt-4 p-4 bg-gray-50 rounded-[16px] text-left space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500">Avatar URL</label>
              <input value={avatarEdit} onChange={e => setAvatarEdit(e.target.value)} className="w-full bg-white p-2 rounded text-xs border outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500">Bio</label>
              <textarea value={bioEdit} onChange={e => setBioEdit(e.target.value)} className="w-full bg-white p-2 rounded text-xs border outline-none" />
            </div>
            <button onClick={handleUpdateProfile} className="w-full bg-[#22c55e] text-black font-bold py-2 rounded-full text-xs">Save Profile</button>
          </div>
        )}
      </div>

      <h3 className="font-black text-lg mt-6 mb-3">Store Products</h3>
      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-xs">No products posted yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-[16px] shadow-sm">
              <img src={p.image_url || p.image || ""} className="w-full h-36 object-cover rounded-[12px]" />
              <h4 className="font-bold text-xs mt-2 truncate">{p.name || ""}</h4>
              <p className="text-green-600 font-black text-xs">₦{p.price || 0}</p>
              <button onClick={() => addToCart(p, p.sizes?.[0] || 'Standard')} className="mt-2 w-full bg-black text-white text-[10px] py-1.5 rounded-full font-bold">Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 4. VENDOR DASHBOARD ---
function VendorDashboardPage({ onNavigate }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState('S,M,L,XL');
  const [category, setCategory] = useState('Fashion');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [userVendorId, setUserVendorId] = useState(null);

  useEffect(() => {
    loadVendorProducts();
  }, []);

  const loadVendorProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserVendorId(user.id);
      const { data } = await supabase.from('products').select('*').eq('vendor_id', user.id);
      setMyProducts(data || []);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Please log in as a vendor.');

    const sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
    const { error } = await supabase.from('products').insert({
      vendor_id: user.id,
      name,
      price: parseFloat(price),
      sizes: sizesArray,
      category,
      story,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'
    });

    if (error) {
      alert('Error adding product: ' + error.message);
    } else {
      alert('Product added successfully!');
      setName('');
      setPrice('');
      setStory('');
      setImageUrl('');
      loadVendorProducts();
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    loadVendorProducts();
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Vendor Dashboard 🚀</h2>
      
      <div className="bg-white p-5 rounded-[24px] shadow-sm mb-6">
        <h3 className="font-bold text-sm mb-3">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (₦)" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="Sizes (comma separated e.g. S,M,L)" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none font-semibold">
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Beauty">Beauty</option>
            <option value="Food">Food</option>
            <option value="Home">Home</option>
          </select>
          <textarea value={story} onChange={e => setStory(e.target.value)} placeholder="Why you love this product / Story..." className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <button type="submit" className="w-full bg-[#22c55e] text-black font-black py-3 rounded-full text-xs shadow">Add Product</button>
        </form>
      </div>

      <h3 className="font-bold text-base mb-3">My Products</h3>
      {myProducts.length === 0 ? (
        <p className="text-gray-500 text-xs text-center py-6">No products posted yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myProducts.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-[16px] shadow-sm">
              <img src={p.image_url || p.image || ""} className="w-full h-32 object-cover rounded-[10px]" />
              <h4 className="font-bold text-xs mt-2 truncate">{p.name || ""}</h4>
              <p className="text-green-600 font-black text-xs">₦{p.price || 0}</p>
              <button onClick={() => handleDelete(p.id)} className="mt-2 w-full bg-red-100 text-red-600 text-[10px] py-1 rounded-full font-bold">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 5. SEARCH TAB ---
function SearchPage({ onNavigate, setSelectedProduct, addToCart }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (query) {
      searchProducts(query);
    } else {
      fetchAll();
    }
  }, [query]);

  const fetchAll = async () => {
    const { data } = await supabase.from('products').select('*, vendors(shop_name)').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const searchProducts = async (q) => {
    const { data } = await supabase.from('products').select('*, vendors(shop_name)').ilike('name', `%${q}%`);
    setProducts(data || []);
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-3">Search Products</h2>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search name, category..." 
        className="w-full bg-white px-4 py-3 rounded-full shadow-sm outline-none text-sm mb-4 border border-gray-200"
      />
      <div className="grid grid-cols-2 gap-3">
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-[16px] shadow-sm">
            <div onClick={() => { setSelectedProduct(p); onNavigate('product'); }} className="cursor-pointer">
              <img src={p.image_url || p.image || ""} className="w-full h-36 object-cover rounded-[12px]" />
              <h4 className="font-bold text-xs mt-2 truncate">{p.name || ""}</h4>
              <p className="text-green-600 font-black text-xs">₦{p.price || 0}</p>
            </div>
            <button onClick={() => addToCart(p, p.sizes?.[0] || 'Standard')} className="mt-2 w-full bg-[#22c55e] text-black text-[10px] py-1.5 rounded-full font-bold">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. CART & CHECKOUT ---
function CartPage({ cart, updateCartQty, removeFromCart, clearCart, onNavigate }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [orderComplete, setOrderComplete] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    await supabase.from('orders').insert({
      buyer_email: email,
      items: cart,
      total_amount: total,
      shipping_address: address,
      payment_method: paymentMethod,
      status: 'Pending'
    });
    setOrderComplete(true);
    clearCart();
  };

  if (orderComplete) {
    return (
      <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-10 text-black text-center">
        <div className="bg-white p-6 rounded-[24px] shadow-sm">
          <span className="text-4xl">🎉</span>
          <h2 className="font-black text-xl mt-3">Order Placed Successfully!</h2>
          {paymentMethod === 'Bank Transfer' ? (
            <div className="mt-4 bg-gray-50 p-4 rounded-[16px] text-left">
              <p className="text-xs font-bold text-gray-700 mb-1">Transfer to:</p>
              <p className="font-black text-sm text-black">0123456789 - Faster Shop - Wema Bank</p>
              <button onClick={() => { navigator.clipboard.writeText('0123456789'); alert('Account number copied!'); }} className="mt-2 bg-black text-white text-[10px] px-3 py-1.5 rounded-full font-bold">Copy Account Number</button>
            </div>
          ) : (
            <p className="text-xs text-gray-600 mt-2">Order saved, pay on delivery or contact vendor.</p>
          )}
          <button onClick={() => { setOrderComplete(false); onNavigate('home'); }} className="mt-6 w-full bg-[#22c55e] text-black font-bold py-3 rounded-full text-xs">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Shopping Bag 👜</h2>
      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xs">Your bag is empty.</p>
          <button onClick={() => onNavigate('home')} className="mt-4 bg-black text-white text-xs px-6 py-2 rounded-full font-bold">Browse Shop</button>
        </div>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-[16px] mb-3 flex items-center gap-3 shadow-sm">
              <img src={item.image_url || item.image || ""} className="w-16 h-16 rounded-[10px] object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name || ""}</h4>
                <p className="text-gray-500 text-[10px]">Size: {item.selectedSize}</p>
                <p className="text-green-600 font-bold text-xs">₦{item.price || 0}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateCartQty(idx, item.quantity - 1)} className="w-6 h-6 bg-gray-100 rounded-full font-bold text-xs">-</button>
                <span className="text-xs font-bold">{item.quantity}</span>
                <button onClick={() => updateCartQty(idx, item.quantity + 1)} className="w-6 h-6 bg-gray-100 rounded-full font-bold text-xs">+</button>
                <button onClick={() => removeFromCart(idx)} className="text-red-500 text-xs ml-2">🗑️</button>
              </div>
            </div>
          ))}

          <div className="bg-white p-4 rounded-[20px] mt-4 shadow-sm">
            <div className="flex justify-between font-black text-base mb-4">
              <span>Total:</span>
              <span className="text-green-600">₦{total}</span>
            </div>
            {!showCheckout ? (
              <button onClick={() => setShowCheckout(true)} className="w-full bg-[#22c55e] text-black font-black py-3 rounded-full shadow cursor-pointer text-xs">
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-3 pt-2 border-t">
                <h3 className="font-bold text-xs">Checkout Details</h3>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Buyer Email" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
                <textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery Address" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
                <div className="space-y-1 text-xs font-medium">
                  <label className="block text-gray-500 text-[10px] font-bold">Payment Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pay" checked={paymentMethod === 'Bank Transfer'} onChange={() => setPaymentMethod('Bank Transfer')} /> Bank Transfer</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pay" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} /> Card</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="pay" checked={paymentMethod === 'Pay on Delivery'} onChange={() => setPaymentMethod('Pay on Delivery')} /> POD</label>
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white font-black py-3 rounded-full shadow cursor-pointer text-xs">
                  Confirm & Place Order ₦{total}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- PROFILE / SETTINGS / EXTRAS ---
function ProfilePage({ onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <div className="bg-white rounded-[24px] p-5 shadow-sm flex items-center gap-4 mb-5">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white font-black text-xl shadow">
          TN
        </div>
        <div>
          <h2 className="font-black text-base">Nwezeh Terrence Uche</h2>
          <p className="text-xs text-gray-500 mt-0.5">terrence@fastersub.ng</p>
        </div>
      </div>
      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden divide-y divide-gray-100">
        <div onClick={() => onNavigate('vendor-dashboard')} className="p-4 flex justify-between items-center cursor-pointer">
          <span className="font-bold text-sm">🚀 Vendor Dashboard</span>
          <span>→</span>
        </div>
        <div onClick={async () => { await supabase.auth.signOut(); alert('Logged out'); onNavigate('home'); }} className="p-4 flex justify-between items-center cursor-pointer text-red-600">
          <span className="font-bold text-sm">Log Out</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [tab, setTab] = useState('home');
  const [searchVal, setSearchVal] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedSize) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id && item.selectedSize === selectedSize);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { ...product, selectedSize, quantity: 1 }];
    });
    alert('Added to cart successfully!');
  };

  const updateCartQty = (index, qty) => {
    setCart(prev => {
      if (qty <= 0) return prev.filter((_, i) => i !== index);
      const copy = [...prev];
      copy[index].quantity = qty;
      return copy;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const navigate = (newTab) => {
    setTab(newTab);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f5f5f7] relative shadow-2xl overflow-hidden font-sans">
      <Header onNavigate={navigate} searchVal={searchVal} setSearchVal={setSearchVal} />
      
      <main>
        {tab === 'home' && <HomePage onNavigate={navigate} setSelectedVendor={setSelectedVendor} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />}
        {tab === 'shop' && <ShopPage onNavigate={navigate} setSelectedVendor={setSelectedVendor} />}
        {tab === 'search' && <SearchPage onNavigate={navigate} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />}
        {tab === 'profile' && <ProfilePage onNavigate={navigate} />}
        {tab === 'cart' && <CartPage cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} clearCart={clearCart} onNavigate={navigate} />}
        {tab === 'vendor-dashboard' && <VendorDashboardPage onNavigate={navigate} />}
        {tab === 'vendor-detail' && <VendorDetailPage selectedVendor={selectedVendor} onNavigate={navigate} addToCart={addToCart} />}
        {tab === 'product' && (
          <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
            <button onClick={() => navigate('home')} className="mb-3 text-xs font-bold text-gray-600">← Back</button>
            <div className="bg-white p-5 rounded-[24px] shadow-sm">
              <img src={selectedProduct?.image_url || selectedProduct?.image || ""} className="w-full h-72 object-cover rounded-[16px] mb-3" />
              <h2 className="font-black text-lg">{selectedProduct?.name || ""}</h2>
              <p className="text-green-600 font-black text-xl mt-1">₦{selectedProduct?.price || 0}</p>
              {selectedProduct?.story && <p className="text-gray-600 text-xs mt-2 italic">"{selectedProduct.story}"</p>}
              <button onClick={() => addToCart(selectedProduct, selectedProduct?.sizes?.[0] || 'Standard')} className="w-full mt-4 bg-[#22c55e] text-black font-black py-3 rounded-full shadow cursor-pointer text-xs">
                Add to Cart 👜
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav currentTab={tab} onNavigate={navigate} />
    </div>
  );
}
