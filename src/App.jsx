import React, { useState } from 'react';
import HomePage from './features/home/HomePage';
import CartDrawer from './CartDrawer';
import CheckoutModal from './features/checkout/CheckoutModal';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Oversized Dark Tee', selectedSize: 'L', quantity: 1, price: 25000 }
  ]);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const vendorPhone = '2348012345678';

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <HomePage 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cartItems.length}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={totalAmount}
        vendorPhone={vendorPhone}
      />
    </div>
  );
}
