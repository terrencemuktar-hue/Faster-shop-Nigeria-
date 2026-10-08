import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, setCart, onCheckout }) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const deliveryFee = 1500; // Standard flat delivery fee in NGN
  const total = subtotal + (cart.length > 0 ? deliveryFee : 0);

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const handleWhatsAppCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Format order items for WhatsApp
    const itemsList = cart.map(item => `• ${item?.name || ""} (x${item.quantity || 1}) - ₦${(item.price * (item.quantity || 1)).toLocaleString()}`).join('\n');
    
    const message = `*NEW ORDER FROM FASTER SHOP*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${buyerName || 'Guest Customer'}\n` +
      `Phone: ${buyerPhone || 'Not provided'}\n` +
      `Address: ${deliveryAddress || 'Standard Pickup/Delivery'}\n\n` +
      `*Order Items:*\n${itemsList}\n\n` +
      `*Subtotal:* ₦${subtotal.toLocaleString()}\n` +
      `*Delivery:* ₦${deliveryFee.toLocaleString()}\n` +
      `*Total Amount:* ₦${total.toLocaleString()}\n\n` +
      `Please confirm availability and delivery timeline!`;

    // Default business WhatsApp number or fallback to vendor line
    const vendorWhatsApp = "2348000000000"; 
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${vendorWhatsApp}?text=${encodedMessage}`;

    // Open WhatsApp checkout
    window.open(whatsappUrl, '_blank');
    onCheckout && onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-zinc-900 h-full flex flex-col shadow-2xl border-l border-zinc-800 text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg">Your Bag ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto stroke-1" />
              <p className="text-zinc-400 font-medium">Your bag is empty</p>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto">Explore vendor collections and add your favorite items to get started.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-xl border border-zinc-800">
                <img src={item?.image || "" || item.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={item?.name || ""} className="w-16 h-16 object-cover rounded-lg bg-zinc-800" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item?.name || ""}</h4>
                  <p className="text-emerald-400 font-semibold text-sm mt-0.5">₦{item.price?.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden bg-zinc-900">
                      <button onClick={() => updateQuantity(idx, -1)} className="px-2 py-0.5 hover:bg-zinc-800 text-zinc-400 text-xs">-</button>
                      <span className="px-3 text-xs font-medium">{item.quantity || 1}</span>
                      <button onClick={() => updateQuantity(idx, 1)} className="px-2 py-0.5 hover:bg-zinc-800 text-zinc-400 text-xs">+</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => updateQuantity(idx, -(item.quantity || 1))} className="text-zinc-500 hover:text-red-400 p-2 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Form & Summary Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900/90 space-y-4">
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Your Full Name" 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <input 
                type="tel" 
                placeholder="WhatsApp Phone Number" 
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
              <input 
                type="text" 
                placeholder="Delivery Address / Landmark" 
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Delivery</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-1">
                <span>Total</span>
                <span className="text-emerald-400">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Checkout via WhatsApp
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
