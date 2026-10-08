import React, { useState } from 'react';
import { X, Star, ShoppingBag, MessageCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { usePaystack } from '../hooks/usePaystack';

export default function ProductDetail({ product, onClose, onAddToCart, showToast }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Chioma A.', rating: 5, text: 'Love the quality - fast delivery!' },
    { id: 2, name: 'Tunde O.', rating: 5, text: 'Fits perfectly, luxury feel.' }
  ]);
  const [newReviewText, setNewReviewText] = useState('');
  const { payWithPaystack } = usePaystack();

  if (!product) return null;

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Emerald'];

  const handlePaystackCheckout = () => {
    const email = prompt('Enter your email address for payment receipt:', 'customer@fastershopng.com');
    if (!email) return;

    const amountInKobo = (product.price || 45000) * 100;
    const randomOrderId = 'FSN-' + Math.floor(1000 + Math.random() * 9000);

    payWithPaystack({
      email,
      amount: amountInKobo,
      onSuccessfulPayment: (res) => {
        showToast(`Payment Successful! Order ID #${randomOrderId} - Details sent via WhatsApp`, 'success');
        
        // Save order to LocalStorage
        try {
          const existing = JSON.parse(localStorage.getItem('faster_shop_orders') || '[]');
          const newOrder = {
            id: randomOrderId,
            productName: product?.name || "",
            price: product.price,
            size: selectedSize,
            color: selectedColor,
            status: 'Paid via Paystack',
            date: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
          localStorage.setItem('faster_shop_orders', JSON.stringify([newOrder, ...existing]));
        } catch (e) {}

        // Open WhatsApp with details
        const waMsg = `*PAID ORDER #${randomOrderId}*\nProduct: ${product?.name || ""}\nSize: ${selectedSize}\nColor: ${selectedColor}\nPrice: ₦${product.price?.toLocaleString()}\nEmail: ${email}`;
        window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(waMsg)}`, '_blank');
        onClose();
      }
    });
  };

  const handleWhatsAppOrder = () => {
    const waMsg = `*NEW WHATSAPP ORDER*\nProduct: ${product?.name || ""}\nSize: ${selectedSize}\nColor: ${selectedColor}\nPrice: ₦${product.price?.toLocaleString()}\nPlease confirm availability!`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(waMsg)}`, '_blank');
  };

  const addReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const updated = [{ id: Date.now(), name: 'You (Verified Buyer)', rating: 5, text: newReviewText }, ...reviews];
    setReviews(updated);
    setNewReviewText('');
    showToast('Review submitted successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col my-auto">
        
        {/* Header Image */}
        <div className="relative h-64 bg-zinc-800">
          <img src={product?.image || "" || product.img} alt={product?.name || ""} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition">
            <X className="w-5 h-5" />
          </button>
          <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {product.vendor || 'Verified Store'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{product?.name || ""}</h2>
              <div className="flex items-center gap-1.5 text-amber-400 text-sm mt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">4.8</span>
                <span className="text-zinc-400">(128 reviews)</span>
              </div>
            </div>
            <span className="text-xl font-extrabold text-emerald-400">₦{product.price?.toLocaleString()}</span>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Select Size</label>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${selectedSize === s ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Select Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${selectedColor === c ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Checkout & WhatsApp Buttons */}
          <div className="space-y-3 pt-2">
            <button 
              onClick={handlePaystackCheckout}
              className="w-full bg-[#00D26A] hover:bg-[#00bc5d] text-zinc-950 font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
            >
              <CreditCard className="w-5 h-5" />
              PAY WITH PAYSTACK
            </button>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full bg-zinc-900 border border-white text-white hover:bg-zinc-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              ORDER VIA WHATSAPP
            </button>
          </div>

          {/* Ratings & Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-200">Customer Reviews</h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-zinc-800/40 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300">{r?.name || ""}</span>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">{r.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={addReview} className="space-y-2 pt-2">
              <input 
                type="text" 
                placeholder="Write your review..." 
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2 rounded-xl transition">
                Submit Review
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
