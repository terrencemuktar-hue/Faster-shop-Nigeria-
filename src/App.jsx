import React, { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Faster Shop</h1>
        <p className="text-neutral-400 text-sm mb-6">High-end marketplace checkout preview.</p>

        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition"
        >
          View Cart ({cartItems.length})
        </button>
      </div>

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
