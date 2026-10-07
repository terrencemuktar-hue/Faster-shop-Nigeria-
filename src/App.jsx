import React, { useState, useEffect } from 'react';
import StoryReels from './components/StoryReels';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CartDrawer from './CartDrawer';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import { getStoredVendors, getStoredProducts, getStoredWishlist, saveWishlist } from './lib/store';
import { Heart, ShoppingBag } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

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

  const totalCartCount = cart.reduce((a, b) => a + (b.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-[#00D26A] selection:text-black">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] text-black flex flex-col relative shadow-2xl border-x border-zinc-900">
        
        <Header 
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={totalCartCount}
          onGoHome={() => setActiveTab('home')}
          onOpenSettingsModal={() => setActiveTab('profile')}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 pb-28">
          {activeTab === 'home' && (
            <div className="space-y-4 pt-3">
              <StoryReels vendors={vendors} />
              
              <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base text-black">Featured Drops</h2>
                  <button onClick={() => setActiveTab('shop')} className="text-xs text-emerald-600 font-semibold cursor-pointer">See All</button>
                </div>

                {/* Hero / Rubian Girl Featured Card */}
                {products.length > 0 && (
                  <div 
                    onClick={() => setSelectedProduct(products[0])}
                    className="rounded-[24px] overflow-hidden relative shadow-lg cursor-pointer bg-zinc-900 aspect-[4/5] group"
                  >
                    <img 
                      src={products[0].image || products[0].img} 
                      alt="Rubian Girl" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 space-y-2 text-white">
                      <p className="text-zinc-300 text-xs font-medium">MODELS 20S, 20S</p>
                      <h3 className="text-2xl font-black tracking-tight">{products[0].name || 'RUBIAN GIRL - New Drop'}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(products[0]); }}
                        className="bg-white text-black font-bold py-3 px-6 rounded-full text-xs w-max mt-1 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
                      >
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'shop' && <ShopPage onAddToCart={handleAddToCart} onSelectProduct={(p) => setSelectedProduct(p)} />}
          {activeTab === 'search' && <ShopPage onAddToCart={handleAddToCart} onSelectProduct={(p) => setSelectedProduct(p)} />}
          {activeTab === 'wishlist' && (
            <div className="px-4 py-6 space-y-4">
              <h1 className="text-xl font-bold text-black">Saved Wishlist</h1>
              {wishlist.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 text-xs">No saved items yet. Tap the heart on any drop!</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {wishlist.map(p => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white p-3 rounded-2xl border border-zinc-200 space-y-2 cursor-pointer shadow-sm">
                      <img src={p.image || p.img} alt="" className="aspect-square object-cover rounded-xl" />
                      <h4 className="text-xs font-semibold truncate text-black">{p.name}</h4>
                      <span className="text-emerald-600 font-bold text-xs">₦{p.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'profile' && <ProfilePage showToast={triggerToast} onNavigateOrders={() => setActiveTab('orders')} />}
        </main>

        {selectedProduct && (
          <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} showToast={triggerToast} />
        )}

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      </div>
    </div>
  );
}
