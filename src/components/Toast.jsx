import React, { useEffect } from 'react';
import { CheckCircle, X, ShoppingBag, Heart } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-zinc-700 text-white px-4 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      {type === 'bag' ? (
        <ShoppingBag className="w-5 h-5 text-emerald-400" />
      ) : type === 'wishlist' ? (
        <Heart className="w-5 h-5 text-pink-400 fill-current" />
      ) : (
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      )}
      <span className="text-sm font-medium pr-2">{message}</span>
      <button onClick={onClose} className="text-zinc-400 hover:text-white transition">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
