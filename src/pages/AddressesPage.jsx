import React, { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", street: "", city: "Lagos", state: "Lagos", landmark: "" });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.street) return;
    setAddresses([...addresses, { ...form, id: Date.now() }]);
    setForm({ fullName: "", phone: "", street: "", city: "Lagos", state: "Lagos", landmark: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shipping Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#22c55e] text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-lg">Add Delivery Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white" required />
            <input type="text" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white" required />
            <input type="text" placeholder="Street Address" value={form.street} onChange={e => setForm({...form, street: e.target.value})} className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white md:col-span-2" required />
            <input type="text" placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white" />
            <input type="text" placeholder="State (e.g. Lagos)" value={form.state} onChange={e => setForm({...form, state: e.target.value})} className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400">Cancel</button>
            <button type="submit" className="bg-[#22c55e] text-black font-semibold px-6 py-2 rounded-xl text-sm">Save Address</button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <MapPin className="mx-auto text-zinc-500" size={32} />
          <p className="text-zinc-400 text-sm">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-semibold text-white">{addr.fullName}</p>
                <p className="text-xs text-zinc-400">{addr.phone}</p>
                <p className="text-xs text-zinc-300">{addr.street}, {addr.city}, {addr.state}</p>
              </div>
              <button onClick={() => setAddresses(addresses.filter(a => a.id !== addr.id))} className="text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
