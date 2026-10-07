"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapPin, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: 'Lagos', state: 'Lagos', landmark: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAddresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('shipping_addresses').select('*').eq('user_id', user.id);
        if (data) setAddresses(data);
      } else {
        const local = JSON.parse(localStorage.getItem('faster_addresses') || '[]');
        setAddresses(local);
      }
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('faster_addresses') || '[]');
      setAddresses(local);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street) {
      setErrorMsg('Please fill in required fields.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        user_id: user ? user.id : 'guest',
        full_name: form.fullName,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        landmark: form.landmark,
        is_default: addresses.length === 0
      };

      const { error } = await supabase.from('shipping_addresses').insert([payload]);
      if (error) throw error;
      
      setShowAddForm(false);
      setForm({ fullName: '', phone: '', street: '', city: 'Lagos', state: 'Lagos', landmark: '' });
      fetchAddresses();
    } catch (err) {
      const local = JSON.parse(localStorage.getItem('faster_addresses') || '[]');
      const newLocal = [...local, { ...form, id: Date.now() }];
      localStorage.setItem('faster_addresses', JSON.stringify(newLocal));
      setAddresses(newLocal);
      setShowAddForm(false);
      setForm({ fullName: '', phone: '', street: '', city: 'Lagos', state: 'Lagos', landmark: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from('shipping_addresses').delete().eq('id', id);
    } catch (e) {}
    const local = JSON.parse(localStorage.getItem('faster_addresses') || '[]');
    const filtered = local.filter(a => a.id !== id);
    localStorage.setItem('faster_addresses', JSON.stringify(filtered));
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-[430px] min-h-screen bg-black text-white flex flex-col relative space-y-6 pb-24">
        
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 pt-2">
          <Link href="/" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">Shipping Addresses</h1>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2.5 rounded-xl bg-[#22c55e] text-black font-extrabold transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAddress} className="bg-zinc-950 border border-zinc-900 p-4 rounded-[16px] space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">New Shipping Address</h2>
            {errorMsg && <div className="text-red-400 text-[11px]">{errorMsg}</div>}
            
            <input 
              type="text" 
              placeholder="Full Name" 
              value={form.fullName} 
              onChange={e => setForm({...form, fullName: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white"
              required 
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={form.phone} 
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white"
              required 
            />
            <input 
              type="text" 
              placeholder="Street Address" 
              value={form.street} 
              onChange={e => setForm({...form, street: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white"
              required 
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="City" 
                value={form.city} 
                onChange={e => setForm({...form, city: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white" 
              />
              <input 
                type="text" 
                placeholder="State" 
                value={form.state} 
                onChange={e => setForm({...form, state: e.target.value})}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white" 
              />
            </div>
            <input 
              type="text" 
              placeholder="Landmark (Optional)" 
              value={form.landmark} 
              onChange={e => setForm({...form, landmark: e.target.value})}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white" 
            />

            <div className="flex gap-2 pt-1">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-[#22c55e] text-black font-extrabold py-3 rounded-xl text-xs active:scale-[0.98]"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 bg-zinc-900 text-zinc-400 font-semibold py-3 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 && !showAddForm ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4 py-20">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-[#22c55e] shadow-sm">
              <MapPin className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">No saved addresses</h3>
              <p className="text-xs text-zinc-400 max-w-[260px]">Add your delivery destination for seamless checkout</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#22c55e] text-black font-extrabold text-xs px-6 py-3.5 rounded-xl active:scale-[0.98] transition-all shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-[16px] flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{addr.full_name || addr.fullName}</span>
                    {addr.is_default && <span className="text-[10px] bg-[#22c55e]/10 text-[#22c55e] px-2 py-0.5 rounded-full font-semibold">Default</span>}
                  </div>
                  <p className="text-[11px] text-zinc-400">{addr.street}, {addr.city || 'Lagos'}</p>
                  <p className="text-[11px] text-zinc-500">Phone: {addr.phone}</p>
                </div>
                <button onClick={() => handleDelete(addr.id)} className="text-zinc-500 hover:text-red-400 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
