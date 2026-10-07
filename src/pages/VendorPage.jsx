import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Store, ArrowLeft, CheckCircle2 } from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VendorPage({ onBack, showToast }) {
  const [form, setForm] = useState({ fullName: '', phone: '', shopName: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.shopName) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.from('vendors').insert([
        {
          full_name: form.fullName,
          phone: form.phone,
          shop_name: form.shopName,
          followers_count: 0,
          is_verified: false
        }
      ]);

      if (error) throw error;
      setSuccess(true);
      if (showToast) showToast('✅ Registered with 0 followers', 'success');
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('faster_vendors') || '[]');
      localStorage.setItem('faster_vendors', JSON.stringify([...existing, { ...form, followers_count: 0, is_verified: false }]));
      setSuccess(true);
      if (showToast) showToast('✅ Registered with 0 followers (Saved locally)', 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-black text-white flex flex-col p-4 pb-24 space-y-4 mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-[0.98] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-sm font-bold tracking-wider uppercase text-white">Faster Shop Nigeria</h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-[24px] space-y-6 shadow-2xl">
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Application Received</h2>
              <p className="text-xs text-[#22c55e] font-semibold">✅ Registered with 0 followers</p>
            </div>
            <button 
              onClick={onBack}
              className="w-full bg-[#22c55e] text-black font-extrabold py-3.5 rounded-xl text-xs mt-4 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
            >
              Return to Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                <Store className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Become a Vendor</h2>
                <p className="text-[11px] text-zinc-400">Start selling with 0 followers</p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Terrence Nwezeh"
                value={form.fullName}
                onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Phone / WhatsApp</label>
              <input 
                type="text" 
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400">Shop Name</label>
              <input 
                type="text" 
                placeholder="e.g. Lagos Streetwear Co."
                value={form.shopName}
                onChange={e => setForm({...form, shopName: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-700"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#22c55e] text-black font-extrabold py-3.5 rounded-xl text-xs mt-2 active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center"
            >
              {loading ? 'Submitting...' : 'Register Vendor Store'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
