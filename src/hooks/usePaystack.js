import { useState, useEffect } from 'react';

export function usePaystack() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.PaystackPop) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, []);

  const payWithPaystack = ({ publicKey, email, amount, currency = 'NGN', ref, onSuccess, onClose }) => {
    if (!window.PaystackPop) {
      alert('Paystack SDK not loaded yet. Please try again.');
      return;
    }
    const handler = window.PaystackPop.setup({
      key: publicKey || 'pk_live_placeholder',
      email,
      amount,
      currency,
      ref: ref || `FSN_${Math.floor(Math.random() * 1000000000)}`,
      callback: (response) => {
        if (onSuccess) onSuccess(response);
      },
      onClose: () => {
        if (onClose) onClose();
      },
    });
    handler.openIframe();
  };

  return { isLoaded, payWithPaystack };
}
