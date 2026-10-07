import React, { useState, useEffect } from 'react';
import StoryReels from './components/StoryReels';
import CartDrawer from './CartDrawer';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import { getStoredVendors, getStoredProducts, getStoredWishlist, saveWishlist } from './lib/store';
import { Home, ShoppingBag, Search, Heart, User, Store, MessageSquare, Bell, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center selection:bg-emerald-500 selection:text-black">
      <div className="w-full max-w-[430px] min-h-screen bg-zinc-950 flex flex-col relative shadow-2xl border-x border-zinc-900">
        
        <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md px-4 py-3.5 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-zinc-950 text-lg shadow-lg shadow-emerald-950/50">
              F
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white">Faster Shop</h1>
              <p className="text-[10px] text-zinc-400">Nigeria Marketplace</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.open('https://wa.me/2348000000000?text=Hello%20Faster%20Shop%20Support', '_blank')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Support Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button 
              onClick={() => triggerToast('No new notifications', 'info')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + (b.quantity || 1), 0)}
                </span>
              )}
            </button>
          </div>
        </header>

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
