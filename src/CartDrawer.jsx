import React from 'react';

export default function CartDrawer({ isOpen, onClose, cartItems, totalAmount, onProceedToCheckout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 h-full p-6 text-white flex flex-col justify-between border-l border-neutral-800">
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-white">✕</button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-neutral-500 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-neutral-800 pb-3">
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-400">Size: {item.selectedSize || 'Standard'} | Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="text-sm font-bold">₦{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-neutral-800 pt-4 space-y-4">
          <div className="flex justify-between text-base font-bold">
            <span>Total:</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          <button
            onClick={onProceedToCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition disabled:opacity-50"
          >
            Proceed to Paystack Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
