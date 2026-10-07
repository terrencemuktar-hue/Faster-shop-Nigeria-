import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import VendorProfilePage from './pages/VendorProfilePage';
import ProductDetail from './components/ProductDetail';
import BottomNav from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center selection:bg-[#FF2D78] selection:text-white">
      <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] relative shadow-2xl flex flex-col justify-between">
        {selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            setSelectedVendor={setSelectedVendor}
            onAddToCart={handleAddToCart}
          />
        ) : selectedVendor ? (
          <VendorProfilePage 
            vendorName={selectedVendor} 
            onBack={() => setSelectedVendor(null)} 
            setSelectedProduct={setSelectedProduct}
          />
        ) : (
          <div className="flex-1">
            {activeTab === 'home' && (
              <HomePage 
                setActiveTab={setActiveTab} 
                setSelectedVendor={setSelectedVendor} 
                setSelectedProduct={setSelectedProduct} 
              />
            )}
            {activeTab === 'shop' && (
              <ShopPage 
                setSelectedVendor={setSelectedVendor} 
                setSelectedProduct={setSelectedProduct} 
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            )}
            {activeTab === 'search' && (
              <SearchPage 
                setSelectedVendor={setSelectedVendor} 
                setSelectedProduct={setSelectedProduct} 
              />
            )}
            {activeTab === 'wishlist' && (
              <WishlistPage 
                wishlist={wishlist} 
                toggleWishlist={toggleWishlist} 
                setSelectedProduct={setSelectedProduct} 
              />
            )}
            {activeTab === 'profile' && <ProfilePage />}
          </div>
        )}

        {!selectedProduct && !selectedVendor && (
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}
