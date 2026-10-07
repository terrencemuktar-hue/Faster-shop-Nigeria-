import React, { useState, useEffect } from 'react';
import StoryReels from './components/StoryReels';
import TopHeader from './components/TopHeader';
import CartDrawer from './CartDrawer';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import { getStoredVendors, getStoredProducts, getStoredWishlist, saveWishlist } from './lib/store';
import { Home, ShoppingBag, Search, Heart, User, Store, X, Send, MapPin, Globe, ShieldCheck, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: 'Hello! Welcome to Faster Shop Nigeria. How can we assist your order today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const vendors = getStoredVendors();
  const products = getStoredProducts();

  useEffect(() => {
    setWishlist(getStoredWishlist());
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    triggerToast(`Added ${product.name} to bag!`, 'bag');
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
      triggerToast('Removed from wishlist', 'wishlist');
    } else {
      updated = [...wishlist, product];
      triggerToast('You will be notified when new collections drop', 'wishlist');
    }
    setWishlist(updated);
    saveWishlist(updated);
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsgs = [...chatMessages, { sender: 'user', text: inputMsg }];
    setChatMessages(newMsgs);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'support', text: 'Thanks for reaching out! A vendor or support agent will reply via WhatsApp shortly.' }]);
    }, 1000);
  };

  const totalCartCount = cart.reduce((a, b) => a + (b.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-[430px] min-h-screen bg-zinc-950 flex flex-col relative shadow-2xl border-x border-zinc-900">
        
        <TopHeader 
          onOpenChat={() => setIsChatOpen(true)}
          onOpenNotif={() => setIsNotifOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          onGoHome={() => setActiveTab('home')}
        />

        <main className="flex-1">
          {activeTab === 'home' && (
            <div className="space-y-4 pb-24">
              <StoryReels vendors={vendors} />
              <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base">Featured Drops</h2>
                  <button onClick={() => setActiveTab('shop')} className="text-xs text-emerald-400 font-semibold">See All</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div 
                      key={p.id} 
                      onClick={() => setSelectedProduct(p)}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                    >
                      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                        <img src={p.image || p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-semibold text-xs truncate">{p.name}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-bold text-xs">₦{p.price?.toLocaleString()}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(p); }}
                            className="text-zinc-400 hover:text-pink-500 transition"
                          >
                            <Heart className={`w-4 h-4 ${wishlist.some(w => w.id === p.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shop' && <ShopPage onAddToCart={handleAddToCart} onSelectProduct={(p) => setSelectedProduct(p)} />}
          {activeTab === 'search' && <ShopPage onAddToCart={handleAddToCart} onSelectProduct={(p) => setSelectedProduct(p)} />}
          {activeTab === 'wishlist' && (
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 pb-24">
              <h1 className="text-xl font-bold">Saved Wishlist</h1>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 text-xs">No saved items yet. Tap the heart on any drop!</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {wishlist.map(p => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-zinc-900 p-3 rounded-2xl border border-zinc-800 space-y-2 cursor-pointer">
                      <img src={p.image || p.img} alt="" className="aspect-square object-cover rounded-xl" />
                      <h4 className="text-xs font-semibold truncate">{p.name}</h4>
                      <span className="text-emerald-400 font-bold text-xs">₦{p.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'orders' && <OrdersPage />}
          {activeTab === 'profile' && <ProfilePage showToast={triggerToast} onNavigateOrders={() => setActiveTab('orders')} />}
        </main>

        {/* MODALS */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl text-white h-[80vh] sm:h-[500px] flex flex-col">
              <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-sm">Faster Shop Support & Vendor Chat</h3>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendChatMessage} className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message to vendor..." 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {isNotifOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm">Notifications</h3>
                </div>
                <button onClick={() => setIsNotifOpen(false)} className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-zinc-800/60 p-3 rounded-2xl border border-zinc-700/50 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span className="text-emerald-400 font-bold">New Drop</span>
                    <span>10m ago</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200">RUBIAN GIRL Winter Collection Live!</h4>
                  <p className="text-[11px] text-zinc-400">Explore oversized hoodies and limited streetwear drops now.</p>
                </div>
                <div className="bg-zinc-800/60 p-3 rounded-2xl border border-zinc-700/50 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400">
                    <span className="text-amber-400 font-bold">Order Update</span>
                    <span>2h ago</span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-200">Order #FSN-7892 Dispatched</h4>
                  <p className="text-[11px] text-zinc-400">Your order has been dispatched via rider delivery.</p>
                </div>
              </div>
              <button onClick={() => setIsNotifOpen(false)} className="w-full bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl text-xs font-semibold cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}

        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm">Account Settings</h3>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-2xl text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Currency & Region</span>
                  </div>
                  <span className="font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">NGN (₦)</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-2xl text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-500" />
                    <span>Default Shipping</span>
                  </div>
                  <span className="text-zinc-400 font-semibold">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center justify-between bg-zinc-800/50 p-3 rounded-2xl text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Verified Vendor Mode</span>
                  </div>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsSettingsOpen(false); setActiveTab('profile'); }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Open Full Profile & Dashboard
              </button>
            </div>
          </div>
        )}

        {selectedProduct && (
          <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} showToast={triggerToast} />
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <nav className="fixed bottom-0 w-full max-w-[430px] bg-[#121212] border-t border-zinc-800 py-3 px-6 flex items-center justify-between z-40 shadow-2xl">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Home className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Store className="w-5 h-5" /><span className="text-[10px] font-medium">Shop</span>
          </button>
          <button onClick={() => setActiveTab('search')} className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Search className="w-5 h-5" /><span className="text-[10px] font-medium">Search</span>
          </button>
          <button onClick={() => setActiveTab('wishlist')} className={`flex flex-col items-center gap-1 ${activeTab === 'wishlist' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Heart className="w-5 h-5" /><span className="text-[10px] font-medium">Wishlist</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <User className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
