import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react';

export default function AddressesPage({ onBack, showToast }) {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ fullName: '', phone: '', address: '', city: 'Lagos', state: 'Lagos State' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
    setAddresses(saved);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.address) return;
    const updated = [...addresses, form];
    setAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
    setForm({ fullName: '', phone: '', address: '', city: 'Lagos', state: 'Lagos State' });
    if (showToast) showToast('Address Saved', 'success');
  };

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
    if (showToast) showToast('Address Removed', 'info');
  };

  return (
    <div className="w-full max-w-[430px] min-h-screen bg-[#121212] text-white flex flex-col p-4 pb-24 space-y-4">
      <div className="flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold">Saved Shipping Addresses</h1>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Add New Address</h2>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={form.fullName} 
          onChange={e => setForm({...form, fullName: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          required
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={form.phone} 
          onChange={e => setForm({...form, phone: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
        />
        <input 
          type="text" 
          placeholder="Street Address" 
          value={form.address} 
          onChange={e => setForm({...form, address: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <select 
            value={form.city} 
            onChange={e => setForm({...form, city: e.target.value})}
            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          >
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
          </select>
          <input 
            type="text" 
            placeholder="State" 
            value={form.state} 
            onChange={e => setForm({...form, state: e.target.value})}
            className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#00D26A] text-black font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Save Address
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Saved Locations</h2>
        {addresses.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No saved addresses yet.</p>
        ) : (
          addresses.map((addr, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF2D78]" /> {addr.fullName}
                </div>
                <div className="text-[11px] text-zinc-400">{addr.address}, {addr.city}</div>
                <div className="text-[10px] text-zinc-500">{addr.phone}</div>
              </div>
              <button 
                onClick={() => handleDelete(idx)}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-pink-500 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
