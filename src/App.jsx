import React, { useState, useEffect } from 'react';
import { supabase } from "./lib/supabase";

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
function HomePage({ onNavigate, setSelectedVendor, setSelectedProduct }) {
  const [stories, setStories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);

  useEffect(() => {
    fetchStories();
    fetchVendors();
    fetchFeatured();
  }, []);

  const fetchStories = async () => {
    const { data } = await supabase
      .from('vendor_stories')
      .select('*, vendors(shop_name, avatar)')
      .gt('expires_at', new Date().toISOString());
    setStories(data || []);
  };

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: true });
    if (data && data.length > 0) {
      setVendors(data);
    } else {
      // Ensure owner as first brand fallback if empty
      setVendors([{
        id: 'owner-brand',
        shop_name: 'Terrence Uche Store',
        avatar: '',
        bio: 'First brand on Faster Shop Nigeria',
        followers: 0,
        verified: true
      }]);
    }
  };

  const fetchFeatured = async () => {
    const { data } = await supabase
      .from('products')
      .select('*, vendors(shop_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    if (data && data.length > 0) {
      setFeaturedProduct(data[0]);
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen text-black">
      {/* Real Story Circles */}
      <div className="bg-black/90 py-3 px-4 flex gap-4 overflow-x-auto no-scrollbar">
        {stories.length === 0 ? (
          <div className="text-gray-400 text-xs py-1">No stories yet - Vendors post from their profile</div>
        ) : (
          stories.map(s => (
            <div key={s.id} onClick={() => { setSelectedVendor(s.vendors); onNavigate('vendor-detail'); }} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-emerald-600">
                <img src={s.vendors?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} alt="story" className="w-full h-full rounded-full object-cover border-2 border-black" />
              </div>
              <span className="text-white text-[11px] mt-1 truncate max-w-[70px]">{s.vendors?.shop_name || 'Vendor'}</span>
            </div>
          ))
        )}
      </div>

      {/* Featured Drops Carousel Section */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-black">Featured Drops</h2>
          <span className="text-green-600 text-sm font-semibold cursor-pointer" onClick={() => onNavigate('shop')}>See All</span>
        </div>

        {featuredProduct ? (
          <div className="bg-white rounded-[24px] overflow-hidden shadow-md relative">
            <div className="relative h-[380px] w-full">
              <img src={featuredProduct?.image || ""} alt={featuredProduct?.name || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full w-max mb-2">
                  {featuredProduct.category || 'Featured'}
                </span>
                <h3 className="text-white font-bold text-xl">{featuredProduct?.name || ""}</h3>
                <p className="text-green-400 font-black text-lg mt-1">₦{featuredProduct.price}</p>
                <button 
                  onClick={() => { setSelectedProduct(featuredProduct); onNavigate('product'); }}
                  className="mt-3 bg-[#22c55e] text-black font-bold py-2.5 rounded-full text-center cursor-pointer shadow-lg hover:bg-emerald-400 transition"
                >
                  View Product
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-[24px] text-center shadow-sm">
            <p className="text-gray-500 text-sm mb-3">No products yet - Be the first vendor to post</p>
            <button onClick={() => onNavigate('vendor')} className="bg-[#22c55e] text-black font-bold px-6 py-2 rounded-full text-sm cursor-pointer shadow">
              Become a Vendor
            </button>
          </div>
        )}
      </div>

      {/* New Brands Grid */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-lg text-black mb-3">New Brands</h2>
        <div className="grid grid-cols-2 gap-3">
          {vendors.map(v => (
            <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="bg-white p-3 rounded-[16px] shadow-sm flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-black text-white font-black flex items-center justify-center text-xs">
                  {v.avatar ? <img src={v.avatar} className="w-full h-full rounded-full object-cover" /> : (v.shop_name?.[0] || 'T')}
                </div>
                <div>
                  <p className="font-bold text-xs truncate max-w-[90px]">{v.shop_name}</p>
                  <p className="text-[10px] text-gray-500">{v.followers || 0} Followers OK</p>
                </div>
              </div>
              <button className="bg-black text-white text-[10px] px-3 py-1 rounded-full font-bold">Visit</button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#22c55e] text-black p-5 rounded-[20px] shadow-md text-center">
          <h3 className="font-black text-lg">0 Followers OK - Start Selling Today</h3>
          <p className="text-xs mt-1 font-medium">Join Nigeria's fastest growing vendor network instantly.</p>
          <button onClick={() => onNavigate('vendor')} className="mt-3 bg-black text-white font-bold px-6 py-2 rounded-full text-sm cursor-pointer shadow">
            Register as Vendor
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 2. SHOP TAB ---
function ShopPage({ onNavigate, setSelectedVendor }) {
  const [vendorsList, setVendorsList] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data } = await supabase.from('vendors').select('*').order('created_at', { ascending: true });
    if (data && data.length > 0) {
      setVendorsList(data);
    } else {
      setVendorsList([{
        id: 'owner-brand',
        shop_name: 'Terrence Uche Store',
        avatar: '',
        bio: 'First brand on Faster Shop Nigeria',
        followers: 0,
        verified: true
      }]);
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Shop Vendors</h2>
      <div className="grid grid-cols-2 gap-4">
        {vendorsList.map(v => (
          <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="bg-white p-4 rounded-[20px] shadow-sm cursor-pointer flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-black text-white font-black flex items-center justify-center text-lg mb-2 border-2 border-green-500 overflow-hidden">
              {v.avatar ? <img src={v.avatar} className="w-full h-full object-cover" /> : (v.shop_name?.[0] || 'T')}
            </div>
            <h3 className="font-bold text-sm flex items-center gap-1">{v.shop_name} {v.verified && '✓'}</h3>
            <p className="text-gray-500 text-[11px]">{v.followers || 0} Followers</p>
            <button className="mt-3 bg-black text-white text-xs px-4 py-1.5 rounded-full font-bold w-full">View Store</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. SEARCH TAB ---
function SearchPage({ onNavigate, setSelectedProduct }) {
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [products, setProducts] = useState([]);

  const categories = [
    { name: 'Hair', emoji: '💇‍♀️', bg: 'bg-pink-100' },
    { name: 'Hoodies', emoji: '🧥', bg: 'bg-yellow-100' },
    { name: 'Gowns', emoji: '👗', bg: 'bg-purple-100' },
    { name: 'Perfumes', emoji: '✨', bg: 'bg-blue-100' },
    { name: 'Shoes', emoji: '👟', bg: 'bg-green-100' },
    { name: 'Bags', emoji: '👜', bg: 'bg-orange-100' },
    { name: 'Native', emoji: '🧵', bg: 'bg-red-100' },
    { name: 'Streetwear', emoji: '🔥', bg: 'bg-indigo-100' }
  ];

  useEffect(() => {
    if (selectedCat) {
      fetchCategoryProducts(selectedCat);
    } else if (query) {
      searchProducts(query);
    }
  }, [selectedCat, query]);

  const fetchCategoryProducts = async (cat) => {
    const { data } = await supabase
      .from('products')
      .select('*, vendors(shop_name)')
      .eq('category', cat)
      .eq('status', 'active');
    setProducts(data || []);
  };

  const searchProducts = async (q) => {
    const { data } = await supabase
      .from('products')
      .select('*, vendors(shop_name)')
      .ilike('name', `%${q}%`)
      .eq('status', 'active');
    setProducts(data || []);
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-3">Explore Categories</h2>
      <input 
        value={query} 
        onChange={(e) => { setQuery(e.target.value); setSelectedCat(null); }} 
        placeholder="Search category, items..." 
        className="w-full bg-white px-4 py-3 rounded-full shadow-sm outline-none text-sm mb-5 border border-gray-200"
      />

      {selectedCat || query ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Results for {selectedCat || query}</h3>
            <button onClick={() => { setSelectedCat(null); setQuery(''); setProducts([]); }} className="text-xs text-green-600 font-bold">Clear Filter</button>
          </div>
          {products.length === 0 ? (
            <div className="bg-white p-6 rounded-[20px] text-center shadow-sm">
              <p className="text-gray-500 text-xs mb-3">No products in {selectedCat || query} yet - vendors posting soon</p>
              <button onClick={() => { setSelectedCat(null); setQuery(''); }} className="bg-black text-white text-xs px-4 py-2 rounded-full font-bold">Browse All</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map(p => (
                <div key={p.id} onClick={() => { setSelectedProduct(p); onNavigate('product'); }} className="bg-white p-3 rounded-[16px] shadow-sm cursor-pointer">
                  <img src={p?.image || ""} className="w-full h-36 object-cover rounded-[12px]" />
                  <h4 className="font-bold text-xs mt-2 truncate">{p?.name || ""}</h4>
                  <p className="text-green-600 font-black text-xs">₦{p.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((c, i) => (
            <div key={i} onClick={() => setSelectedCat(c?.name || "")} className={`${c.bg} p-4 rounded-[18px] flex items-center gap-3 cursor-pointer shadow-sm hover:scale-[1.02] transition`}>
              <span className="text-2xl">{c.emoji}</span>
              <span className="font-bold text-sm">{c?.name || ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 4. WISHLIST TAB ---
function WishlistPage({ onNavigate, setSelectedProduct }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load local or state wishlist
  }, []);

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl">🤍</span>
          <p className="text-gray-500 mt-2 text-sm">No wishlist items yet</p>
          <button onClick={() => onNavigate('shop')} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-bold text-xs">Browse Shop</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {wishlist.map(item => (
            <div key={item.id} onClick={() => { setSelectedProduct(item); onNavigate('product'); }} className="bg-white rounded-[16px] overflow-hidden shadow-sm p-3 relative cursor-pointer">
              <button className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow text-red-500">❤️</button>
              <img src={item?.image || ""} className="w-full h-36 object-cover rounded-[12px]" />
              <h3 className="font-bold text-xs mt-2 truncate">{item?.name || ""}</h3>
              <p className="text-green-600 font-black text-sm">₦{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 5. CART / CHECKOUT ---
function CartPage({ onNavigate }) {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Lekki Oversized Hoodie', price: 22000, quantity: 1, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2' }
  ]);
  const [address, setAddress] = useState("Lekki Phase 1, Lagos");
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('orders').insert({
        user_id: user.id,
        items: cartItems,
        total_amount: total,
        shipping_address: address,
        payment_method: paymentMethod,
        status: 'Pending'
      });
    }
    alert(`Order placed successfully via ${paymentMethod}! Total: ₦${total}`);
    onNavigate('orders');
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Shopping Bag 👜</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 py-20">Your bag is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-[16px] mb-3 flex items-center gap-3 shadow-sm">
              <img src={item?.image || ""} className="w-16 h-16 rounded-[10px] object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item?.name || ""}</h4>
                <p className="text-green-600 font-bold text-xs">₦{item.price}</p>
              </div>
            </div>
          ))}
          <div className="bg-white p-4 rounded-[20px] mt-4 shadow-sm">
            <h3 className="font-bold text-sm mb-2">Shipping Address</h3>
            <p className="text-xs text-gray-600 bg-gray-100 p-2.5 rounded-[10px] mb-3">{address}</p>
            <h3 className="font-bold text-sm mb-2">Payment Method</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs font-semibold mb-4 outline-none">
              <option value="Card">Card (Paystack)</option>
              <option value="Transfer">Bank Transfer</option>
              <option value="Delivery">Pay on Delivery</option>
            </select>
            <div className="flex justify-between font-black text-base mb-4">
              <span>Total:</span>
              <span className="text-green-600">₦{total}</span>
            </div>
            <button onClick={handleCheckout} className="w-full bg-[#22c55e] text-black font-black py-3 rounded-full shadow cursor-pointer">
              Place Order - Pay ₦{total}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 6. ORDERS & DELIVERIES ---
function OrdersPage({ onNavigate }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setOrders(data || []);
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">My Orders & Deliveries</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-xs">No orders placed yet.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} className="bg-white p-4 rounded-[20px] shadow-sm mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-gray-500">Order #{o.id.slice(0,6)}</span>
              <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">{o.status}</span>
            </div>
            <p className="text-sm font-black text-green-600">₦{o.total_amount}</p>
            <p className="text-[11px] text-gray-500 mt-1">Shipping: {o.shipping_address}</p>
          </div>
        ))
      )}
    </div>
  );
}

// --- 7. SAVED ADDRESSES ---
function AddressesPage({ onNavigate }) {
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Nwezeh Terrence', phone: '08012345678', street: 'Plot 12, Admiralty Way', city: 'Lagos', isDefault: true }
  ]);
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Saved Shipping Addresses</h2>
      {addresses.map(a => (
        <div key={a.id} className="bg-white p-4 rounded-[20px] shadow-sm mb-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-sm">{a?.name || ""}</h4>
            {a.isDefault && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Default</span>}
          </div>
          <p className="text-xs text-gray-600">{a.street}, {a.city}</p>
          <p className="text-xs text-gray-500 mt-1">Phone: {a.phone}</p>
        </div>
      ))}
      <button onClick={() => alert("Add address modal opened")} className="w-full mt-2 bg-black text-white font-bold py-3 rounded-full text-xs shadow">
        + Add New Address
      </button>
    </div>
  );
}

// --- 8. ACCOUNT SETTINGS ---
function SettingsPage({ onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Account Settings</h2>
      <div className="bg-white rounded-[20px] p-4 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500">Display Name</label>
          <input readOnly value="Nwezeh Terrence Uche" className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs font-semibold mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500">Email</label>
          <input readOnly value="terrence@fastersub.ng" className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs font-semibold mt-1" />
        </div>
        <div className="pt-2 border-t border-gray-100">
          <h4 className="font-bold text-xs text-black mb-1">Faster Shop Nigeria v1.0</h4>
          <p className="text-[11px] text-gray-500">Nigeria's Fastest Fashion Market. Buy and sell fashion with 0 Followers OK.</p>
        </div>
        <button onClick={async () => { await supabase.auth.signOut(); alert("Logged out successfully"); onNavigate('home'); }} className="w-full bg-red-600 text-white font-bold py-3 rounded-full text-xs shadow cursor-pointer">
          Log Out
        </button>
      </div>
    </div>
  );
}

// --- 9. CHAT TAB ---
function ChatPage({ onNavigate }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      setChats(data || []);
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Messages 💬</h2>
      <div className="bg-[#22c55e] text-black p-4 rounded-[16px] mb-4 text-xs font-bold shadow-sm">
        Welcome to Fastershop, start shopping today with vendors across Nigeria! 🎉
      </div>
      {chats.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-xs">No chats yet - message a vendor from their store</p>
      ) : (
        chats.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-[20px] shadow-sm mb-2">
            <p className="text-xs font-bold">{c.text}</p>
            <span className="text-[10px] text-gray-400">{new Date(c.created_at).toLocaleTimeString()}</span>
          </div>
        ))
      )}
    </div>
  );
}

// --- 10. NOTIFICATIONS ---
function NotificationsPage({ onNavigate }) {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setNotifs(data || []);
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Notifications 🔔</h2>
      {notifs.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-3xl">🔔</span>
          <p className="text-gray-500 mt-2 text-xs">No notifications yet</p>
        </div>
      ) : (
        notifs.map(n => (
          <div key={n.id} className="bg-white p-4 rounded-[16px] mb-3 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-bold text-xs">{n.title}</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">{new Date(n.created_at).toLocaleTimeString()}</p>
            </div>
            {!n.is_read && <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>}
          </div>
        ))
      )}
    </div>
  );
}

// --- VENDOR DETAILS, DASHBOARD & STORY POSTING ---
function VendorShopPage({ selectedVendor, onNavigate }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (selectedVendor?.id) {
      fetchVendorProducts();
    }
  }, [selectedVendor]);

  const fetchVendorProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('vendor_id', selectedVendor.id).eq('status', 'active');
    setProducts(data || []);
  };

  const messageVendor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && selectedVendor?.user_id) {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedVendor.user_id,
        text: 'Hello, I am interested in your store products!'
      });
      alert('Message sent to vendor!');
      onNavigate('chat');
    } else {
      alert('Please log in to message vendor.');
    }
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <button onClick={() => onNavigate('shop')} className="mb-3 text-xs font-bold text-gray-600">← Back to Shop</button>
      <div className="bg-white rounded-[24px] p-5 shadow-sm text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white font-black flex items-center justify-center text-2xl mx-auto border-4 border-green-500 mb-3 overflow-hidden">
          {selectedVendor?.avatar ? <img src={selectedVendor.avatar} className="w-full h-full object-cover" /> : (selectedVendor?.shop_name?.[0] || 'T')}
        </div>
        <h2 className="font-black text-xl">{selectedVendor?.shop_name || "Terrence Uche Store"}</h2>
        <p className="text-xs text-gray-500 mt-1">{selectedVendor?.followers || 0} Followers • Verified Vendor</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => alert("Following vendor!")} className="flex-1 bg-black text-white py-2 rounded-full font-bold text-xs">Follow</button>
          <button onClick={messageVendor} className="flex-1 bg-[#22c55e] text-black py-2 rounded-full font-bold text-xs">Message Vendor</button>
        </div>
      </div>
    </div>
  );
}

function VendorDashboardPage({ onNavigate }) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Hoodies');
  const [productImage, setProductImage] = useState('');

  const postStory = async () => {
    if (!mediaUrl) return alert('Enter media URL');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Log in required');

    const { data: vendor } = await supabase.from('vendors').select('id').eq('user_id', user.id).single();
    if (!vendor) return alert('Register as vendor first');

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('vendor_stories').insert({
      vendor_id: vendor.id,
      media_url: mediaUrl,
      media_type: mediaType,
      expires_at: expires
    });
    alert('Story posted successfully!');
    setMediaUrl('');
  };

  const postProduct = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Log in required');

    const { data: vendor } = await supabase.from('vendors').select('id').eq('user_id', user.id).single();
    if (!vendor) return alert('Register as vendor first');

    await supabase.from('products').insert({
      vendor_id: vendor.id,
      name: productName,
      price: parseFloat(productPrice),
      category: productCategory,
      image: productImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      status: 'active'
    });
    alert('Product posted successfully to category ' + productCategory);
    setProductName('');
    setProductPrice('');
    setProductImage('');
  };

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Vendor Dashboard 🚀</h2>
      
      <div className="bg-white p-5 rounded-[24px] shadow-sm mb-4">
        <h3 className="font-bold text-sm mb-3">Post to Story (24h)</h3>
        <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Image/Video URL" className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs mb-3 outline-none" />
        <button onClick={postStory} className="w-full bg-black text-white font-bold py-2.5 rounded-full text-xs">Post Story</button>
      </div>

      <div className="bg-white p-5 rounded-[24px] shadow-sm">
        <h3 className="font-bold text-sm mb-3">Post New Product</h3>
        <form onSubmit={postProduct} className="space-y-3">
          <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product Name" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <input type="number" value={productPrice} onChange={e => setProductPrice(e.target.value)} placeholder="Price (₦)" required className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none font-semibold">
            <option value="Hair">Hair</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Gowns">Gowns</option>
            <option value="Perfumes">Perfumes</option>
            <option value="Shoes">Shoes</option>
            <option value="Bags">Bags</option>
            <option value="Native">Native</option>
            <option value="Streetwear">Streetwear</option>
          </select>
          <input value={productImage} onChange={e => setProductImage(e.target.value)} placeholder="Image URL" className="w-full bg-gray-100 p-2.5 rounded-[10px] text-xs outline-none" />
          <button type="submit" className="w-full bg-[#22c55e] text-black font-black py-3 rounded-full text-xs shadow">Post Product</button>
        </form>
      </div>
    </div>
  );
}

// --- PROFILE PAGE ---
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

      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Account & Deliveries</p>

      <div className="bg-white rounded-[24px] shadow-sm overflow-hidden divide-y divide-gray-100">
        <div onClick={() => onNavigate('orders')} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">📦</span>
            <span className="font-bold text-sm">My Orders & Deliveries</span>
          </div>
          <span className="text-gray-400 font-bold">→</span>
        </div>

        <div onClick={() => onNavigate('addresses')} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">📍</span>
            <span className="font-bold text-sm">Saved Shipping Addresses</span>
          </div>
          <span className="text-gray-400 font-bold">→</span>
        </div>

        <div onClick={() => onNavigate('vendor-dashboard')} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <span className="font-bold text-sm">Vendor Dashboard & Stories</span>
          </div>
          <span className="text-gray-400 font-bold">→</span>
        </div>

        <div onClick={() => onNavigate('settings')} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-sm">Account Settings</span>
          </div>
          <span className="text-gray-400 font-bold">→</span>
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

  const navigate = (newTab) => {
    setTab(newTab);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f5f5f7] relative shadow-2xl overflow-hidden font-sans">
      <Header onNavigate={navigate} searchVal={searchVal} setSearchVal={setSearchVal} />
      
      <main>
        {tab === 'home' && <HomePage onNavigate={navigate} setSelectedVendor={setSelectedVendor} setSelectedProduct={setSelectedProduct} />}
        {tab === 'shop' && <ShopPage onNavigate={navigate} setSelectedVendor={setSelectedVendor} />}
        {tab === 'search' && <SearchPage onNavigate={navigate} setSelectedProduct={setSelectedProduct} />}
        {tab === 'wishlist' && <WishlistPage onNavigate={navigate} setSelectedProduct={setSelectedProduct} />}
        {tab === 'profile' && <ProfilePage onNavigate={navigate} />}
        {tab === 'cart' && <CartPage onNavigate={navigate} />}
        {tab === 'orders' && <OrdersPage onNavigate={navigate} />}
        {tab === 'addresses' && <AddressesPage onNavigate={navigate} />}
        {tab === 'settings' && <SettingsPage onNavigate={navigate} />}
        {tab === 'chat' && <ChatPage onNavigate={navigate} />}
        {tab === 'notifications' && <NotificationsPage onNavigate={navigate} />}
        {tab === 'vendor-dashboard' && <VendorDashboardPage onNavigate={navigate} />}
        {tab === 'vendor-detail' && <VendorShopPage selectedVendor={selectedVendor} onNavigate={navigate} />}
        {tab === 'product' && (
          <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
            <button onClick={() => navigate('home')} className="mb-3 text-xs font-bold text-gray-600">← Back</button>
            <div className="bg-white p-5 rounded-[24px] shadow-sm">
              <img src={selectedProduct?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"} className="w-full h-72 object-cover rounded-[16px] mb-3" />
              <h2 className="font-black text-lg">{selectedProduct?.name || "Product Item"}</h2>
              <p className="text-green-600 font-black text-xl mt-1">₦{selectedProduct?.price || "25,000"}</p>
              <button onClick={() => alert("Added to cart!")} className="w-full mt-4 bg-[#22c55e] text-black font-black py-3 rounded-full shadow cursor-pointer">
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
