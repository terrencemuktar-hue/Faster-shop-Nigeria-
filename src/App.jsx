import React, { useState, useEffect } from 'react';
import StoryReels from './components/StoryReels';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import CartDrawer from './CartDrawer';
import Toast from './components/Toast';
import ProductDetail from './components/ProductDetail';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import VendorPage from './pages/VendorPage';
import { getStoredVendors, getStoredProducts, getStoredWishlist, saveWishlist } from './lib/store';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVendorRegOpen, setIsVendorRegOpen] = useState(false);

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

  const totalCartCount = cart.reduce((a, b) => a + (b.quantity || 1), 0);

  if (isVendorRegOpen) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center">
        <div className="w-full max-w-[430px] min-h-screen bg-black text-white relative shadow-2xl border-x border-zinc-900">
          <VendorPage onBack={() => setIsVendorRegOpen(false)} showToast={triggerToast} />
        </div>
      </div>
    );
  }

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

                {products.length === 0 ? (
                  <div className="w-full px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black">Verified drops coming soon</h3>
                      <p className="text-xs text-zinc-500 max-w-[260px]">We're onboarding real Nigerian vendors</p>
                    </div>
                    <button 
                      onClick={() => setIsVendorRegOpen(true)}
                      className="bg-black text-white font-bold text-xs px-6 py-3 rounded-full active:scale-[0.98] transition-all cursor-pointer shadow-md"
                    >
                      Become a Verified Vendor
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {products.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white rounded-[24px] overflow-hidden border border-zinc-200 shadow-sm cursor-pointer group"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                          <img 
                            src={product.image || product.img} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-bold text-black tracking-tight">{product.name}</h3>
                            <span className="text-emerald-600 font-extrabold text-xs">₦{product.price?.toLocaleString()}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-medium">{product.vendorName || 'Verified Nigerian Vendor'}</p>
                        </div>
                      </div>
                    ))}
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
          {activeTab === 'profile' && (
            <ProfilePage 
              showToast={triggerToast} 
              onNavigateOrders={() => setActiveTab('shop')} 
              onOpenVendorReg={() => setIsVendorRegOpen(true)} 
            />
          )}
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
