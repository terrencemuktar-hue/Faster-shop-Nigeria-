import React, { useState, useEffect } from 'react';
import { supabase } from './firebase'; // using configured client

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
  const [vendors, setVendors] = useState([
    { id: 1, shop_name: 'Aura Lagos', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
    { id: 2, shop_name: 'Kano Crafts', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { id: 3, shop_name: 'Lekki Threads', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9' }
  ]);
  const [featured, setFeatured] = useState({
    id: 1,
    name: "Nigeria's Fastest Fashion Market",
    price: "₦25,000",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    tag: "MODELS 20S, 20S"
  });

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen text-black">
      {/* Vendor Story Circles */}
      <div className="bg-black/90 py-3 px-4 flex gap-4 overflow-x-auto no-scrollbar">
        {vendors.map(v => (
          <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-green-400 to-emerald-600">
              <img src={v.avatar} alt={v.shop_name} className="w-full h-full rounded-full object-cover border-2 border-black" />
            </div>
            <span className="text-white text-[11px] mt-1 truncate max-w-[70px]">{v.shop_name}</span>
          </div>
        ))}
      </div>

      {/* Featured Drops Carousel Section */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-black">Featured Drops</h2>
          <span className="text-green-600 text-sm font-semibold cursor-pointer" onClick={() => onNavigate('shop')}>See All</span>
        </div>

        <div className="bg-white rounded-[24px] overflow-hidden shadow-md relative">
          <div className="relative h-[380px] w-full">
            <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
              <span className="bg-[#22c55e] text-black text-xs font-bold px-3 py-1 rounded-full w-max mb-2">
                {featured.tag}
              </span>
              <h3 className="text-white font-bold text-xl">{featured.name}</h3>
              <p className="text-green-400 font-black text-lg mt-1">{featured.price}</p>
              <button 
                onClick={() => { setSelectedProduct(featured); onNavigate('product'); }}
                className="mt-3 bg-[#22c55e] text-black font-bold py-2.5 rounded-full text-center cursor-pointer shadow-lg hover:bg-emerald-400 transition"
              >
                Become a Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Brands & Ads Banner */}
      <div className="px-4 mt-6">
        <h2 className="font-bold text-lg text-black mb-3">New Brands</h2>
        <div className="grid grid-cols-2 gap-3">
          {vendors.map(v => (
            <div key={v.id} className="bg-white p-3 rounded-[16px] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={v.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-xs">{v.shop_name}</p>
                  <p className="text-[10px] text-gray-500">0 Followers OK</p>
                </div>
              </div>
              <button onClick={() => alert(`Following ${v.shop_name}!`)} className="bg-black text-white text-[10px] px-3 py-1 rounded-full font-bold">Follow</button>
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
  const vendorsList = [
    { id: 1, shop_name: 'Aura Lagos', full_name: 'Aura Style', followers: 1240, verified: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
    { id: 2, shop_name: 'Kano Crafts', full_name: 'Ibrahim Kano', followers: 850, verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { id: 3, shop_name: 'Lekki Threads', full_name: 'Chidi Lekki', followers: 3200, verified: true, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9' }
  ];

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Shop Vendors</h2>
      <div className="grid grid-cols-2 gap-4">
        {vendorsList.map(v => (
          <div key={v.id} onClick={() => { setSelectedVendor(v); onNavigate('vendor-detail'); }} className="bg-white p-4 rounded-[20px] shadow-sm cursor-pointer flex flex-col items-center text-center">
            <img src={v.avatar} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-green-500" />
            <h3 className="font-bold text-sm flex items-center gap-1">{v.shop_name} {v.verified && '✓'}</h3>
            <p className="text-gray-500 text-[11px]">{v.followers} Followers</p>
            <button className="mt-3 bg-black text-white text-xs px-4 py-1.5 rounded-full font-bold w-full">View Store</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 3. SEARCH TAB ---
function SearchPage({ onNavigate }) {
  const [query, setQuery] = useState("");
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

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-3">Explore Categories</h2>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search category, items..." 
        className="w-full bg-white px-4 py-3 rounded-full shadow-sm outline-none text-sm mb-5 border border-gray-200"
      />
      <div className="grid grid-cols-2 gap-3">
        {categories.map((c, i) => (
          <div key={i} className={`${c.bg} p-4 rounded-[18px] flex items-center gap-3 cursor-pointer shadow-sm hover:scale-[1.02] transition`}>
            <span className="text-2xl">{c.emoji}</span>
            <span className="font-bold text-sm">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. WISHLIST TAB ---
function WishlistPage({ onNavigate }) {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Lekki Oversized Hoodie', price: '₦22,000', vendor: 'Lekki Threads', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2' }
  ]);

  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl">🤍</span>
          <p className="text-gray-500 mt-2 text-sm">No wishlist yet</p>
          <button onClick={() => onNavigate('shop')} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-bold text-xs">Browse Shop</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm p-3 relative">
              <button className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow text-red-500">❤️</button>
              <img src={item.image} className="w-full h-36 object-cover rounded-[12px]" />
              <h3 className="font-bold text-xs mt-2 truncate">{item.name}</h3>
              <p className="text-green-600 font-black text-sm">{item.price}</p>
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

  const handleCheckout = () => {
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
              <img src={item.image} className="w-16 h-16 rounded-[10px] object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
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
  const orders = [
    { id: 101, name: 'Lekki Oversized Hoodie', price: '₦22,000', status: 'On Bike', date: 'Oct 8, 2026', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2' }
  ];
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">My Orders & Deliveries</h2>
      {orders.map(o => (
        <div key={o.id} className="bg-white p-4 rounded-[20px] shadow-sm mb-3 flex gap-3 items-center">
          <img src={o.image} className="w-16 h-16 rounded-[12px] object-cover" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">{o.name}</h4>
            <p className="text-xs text-gray-500">{o.price}</p>
            <span className="inline-block mt-1 bg-yellow-100 text-yellow-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              Status: {o.status}
            </span>
          </div>
        </div>
      ))}
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
            <h4 className="font-bold text-sm">{a.name}</h4>
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
        <button onClick={() => { alert("Logged out successfully"); onNavigate('home'); }} className="w-full bg-red-600 text-white font-bold py-3 rounded-full text-xs shadow cursor-pointer">
          Log Out
        </button>
      </div>
    </div>
  );
}

// --- 9. CHAT TAB ---
function ChatPage({ onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Messages 💬</h2>
      <div className="bg-[#22c55e] text-black p-4 rounded-[16px] mb-4 text-xs font-bold shadow-sm">
        🎉 Welcome to Fastershop, start shopping today with vendors across Nigeria!
      </div>
      <div className="bg-white p-4 rounded-[20px] shadow-sm flex items-center gap-3 cursor-pointer">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <h4 className="font-bold text-sm">Aura Lagos</h4>
          <p className="text-xs text-gray-500 truncate">Hello! Your order is being packed.</p>
        </div>
      </div>
    </div>
  );
}

// --- 10. NOTIFICATIONS ---
function NotificationsPage({ onNavigate }) {
  const notifs = [
    { id: 1, title: "Your order is out for delivery", time: "10m ago", type: "delivery" },
    { id: 2, title: "New vendor Aura Lagos joined Faster Shop", time: "2h ago", type: "vendor" }
  ];
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Notifications 🔔</h2>
      {notifs.map(n => (
        <div key={n.id} className="bg-white p-4 rounded-[16px] mb-3 shadow-sm flex justify-between items-center">
          <div>
            <h4 className="font-bold text-xs">{n.title}</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
          </div>
          <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
        </div>
      ))}
    </div>
  );
}

// --- VENDOR DETAIL & ONBOARDING ---
function VendorShopPage({ selectedVendor, onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <button onClick={() => onNavigate('shop')} className="mb-3 text-xs font-bold text-gray-600">← Back to Shop</button>
      <div className="bg-white rounded-[24px] p-5 shadow-sm text-center">
        <img src={selectedVendor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"} className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-green-500 mb-3" />
        <h2 className="font-black text-xl">{selectedVendor?.shop_name || "Aura Lagos"}</h2>
        <p className="text-xs text-gray-500 mt-1">0 Followers OK • Verified Vendor</p>
        <button onClick={() => alert("Following vendor!")} className="mt-4 bg-black text-white px-6 py-2 rounded-full font-bold text-xs">Follow Vendor</button>
      </div>
    </div>
  );
}

function VendorOnboardingPage({ onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      <h2 className="font-black text-xl mb-4">Become a Vendor 🚀</h2>
      <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-4">
        <p className="text-xs text-gray-600 font-medium">Start selling your fashion products instantly across Nigeria with 0 Followers OK.</p>
        <button onClick={() => { alert("Vendor registered successfully!"); onNavigate('home'); }} className="w-full bg-[#22c55e] text-black font-black py-3 rounded-full shadow">
          Launch My Store Now
        </button>
      </div>
    </div>
  );
}

// --- PROFILE PAGE (Matching your exact screenshot) ---
function ProfilePage({ onNavigate }) {
  return (
    <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
      {/* Profile Card */}
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

      {/* Navigation Cards */}
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

        <div onClick={() => onNavigate('settings')} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="font-bold text-sm">Account Settings</span>
          </div>
          <span className="text-gray-400 font-bold">→</span>
        </div>
      </div>

      {/* Become a Vendor Button */}
      <div onClick={() => onNavigate('vendor')} className="mt-5 bg-[#22c55e] text-black p-4 rounded-[20px] shadow-sm flex justify-between items-center cursor-pointer hover:bg-emerald-400 transition">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏬</span>
          <span className="font-black text-sm">Become a Vendor - 0 Followers OK</span>
        </div>
        <span className="font-black text-lg">→</span>
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
        {tab === 'search' && <SearchPage onNavigate={navigate} />}
        {tab === 'wishlist' && <WishlistPage onNavigate={navigate} />}
        {tab === 'profile' && <ProfilePage onNavigate={navigate} />}
        {tab === 'cart' && <CartPage onNavigate={navigate} />}
        {tab === 'orders' && <OrdersPage onNavigate={navigate} />}
        {tab === 'addresses' && <AddressesPage onNavigate={navigate} />}
        {tab === 'settings' && <SettingsPage onNavigate={navigate} />}
        {tab === 'chat' && <ChatPage onNavigate={navigate} />}
        {tab === 'notifications' && <NotificationsPage onNavigate={navigate} />}
        {tab === 'vendor' && <VendorOnboardingPage onNavigate={navigate} />}
        {tab === 'vendor-detail' && <VendorShopPage selectedVendor={selectedVendor} onNavigate={navigate} />}
        {tab === 'product' && (
          <div className="pb-24 bg-[#f5f5f7] min-h-screen px-4 pt-4 text-black">
            <button onClick={() => navigate('home')} className="mb-3 text-xs font-bold text-gray-600">← Back</button>
            <div className="bg-white p-5 rounded-[24px] shadow-sm">
              <img src={selectedProduct?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"} className="w-full h-72 object-cover rounded-[16px] mb-3" />
              <h2 className="font-black text-lg">{selectedProduct?.name || "Nigeria's Fastest Fashion Market"}</h2>
              <p className="text-green-600 font-black text-xl mt-1">{selectedProduct?.price || "₦25,000"}</p>
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
