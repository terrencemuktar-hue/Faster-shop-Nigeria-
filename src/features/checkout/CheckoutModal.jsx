import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

export default function CheckoutModal({ isOpen, onClose, cartItems = [], totalAmount = 0, vendorPhone = '' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const config = {
    reference: `FS_${new Date().getTime()}`,
    email: email || 'customer@fasterapp.ng',
    amount: Math.round(totalAmount * 100),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_sample_key',
  };

  const onSuccess = (reference) => {
    const itemDetails = cartItems
      .map((item) => `- ${item.name} (${item.selectedSize || 'Standard'}) x${item.quantity || 1}`)
      .join('\n');

    const message = encodeURIComponent(
      `*New Order via Faster Shop*\n\n` +
      `*Payment Ref:* ${reference.reference}\n` +
      `*Customer Name:* ${name}\n` +
      `*Customer Phone:* ${phone}\n\n` +
      `*Items Ordered:*\n${itemDetails}\n\n` +
      `*Total Paid:* ₦${totalAmount.toLocaleString()}`
    );

    const whatsappUrl = `https://wa.me/${vendorPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const onClosePaystack = () => {
    alert('Payment process canceled.');
  };

  const initializePayment = usePaystackPayment(config);

  if (!isOpen) return null;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!email || !phone || !name) {
      alert('Please fill out all contact fields.');
      return;
    }
    initializePayment(onSuccess, onClosePaystack);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-sm">✕</button>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
              placeholder="08012345678"
              required
            />
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-400 text-sm">Total Amount:</span>
            <span className="text-xl font-bold">₦{totalAmount?.toLocaleString()}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 text-sm transition"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
