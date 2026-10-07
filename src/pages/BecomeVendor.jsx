import React, { useState } from 'react';
import { ArrowLeft, Store, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BecomeVendor({ onBack, showToast }) {
  const [form, setForm] = useState({ shopName: '', email: '', phone: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopName || !form.email) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('vendors').insert([
        {
          shop_name: form.shopName,
          email: form.email,
          phone: form.phone,
          whatsapp: form.whatsapp,
          is_verified: false,
          followers_count: 0
        }
      ]);

      if (error) throw error;
      if (showToast) showToast('Application sent - admin will verify in 24hrs', 'success');
      if (onBack) onBack();
    } catch (err) {
      // Fallback local storage for offline/demo resilience if Supabase keys aren't set yet
      const existing = JSON.parse(localStorage.getItem('pendingVendors') || '[]');
      localStorage.setItem('pendingVendors', JSON.stringify([...existing, { ...form, is_verified: false, followers_count: 0 }]));
      if (showToast) showToast('Application submitted (Saved locally)', 'success');
      if (onBack) onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#F9F9F9] text-black flex flex-col p-4 pb-24 space-y-4">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold">Become a Verified Vendor</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-5 rounded-[24px] space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-2 border-b border-zinc-100">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
            <Store className="w-5 h-5 text-[#00D26A]" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider">Vendor Onboarding</h2>
            <p className="text-[11px] text-zinc-500">Sell on Faster Shop Nigeria</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-600">Shop Name</label>
          <input 
            type="text" 
            placeholder="e.g. Lagos Streetwear Co." 
            value={form.shopName} 
            onChange={e => setForm({...form, shopName: e.target.value})}
            className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-zinc-600">Business Email</label>
          <input 
            type="email" 
            placeholder="vendor@domain.com" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-600">Phone</label>
            <input 
              type="text" 
              placeholder="+234..." 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-zinc-600">WhatsApp</label>
            <input 
              type="text" 
              placeholder="+234..." 
              value={form.whatsapp} 
              onChange={e => setForm({...form, whatsapp: e.target.value})}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          {loading ? 'Submitting...' : 'Submit Vendor Application'}
        </button>
      </form>
    </div>
  );
}
