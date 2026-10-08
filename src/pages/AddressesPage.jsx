import React, { useState } from "react";
import Header from "../components/Header";

export default function AddressesPage({ onNavigate }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "Nwezeh Terrence Uche", phone: "", street: "", city: "Lagos", state: "Lagos", landmark: "" });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.street) return;
    setAddresses([...addresses, form]);
    setShowForm(false);
    setForm({ fullName: "Nwezeh Terrence Uche", phone: "", street: "", city: "Lagos", state: "Lagos", landmark: "" });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-black">Saved Shipping Addresses</h2>
          <button onClick={() => setShowForm(!showForm)} className="bg-[#22c55e] text-black text-xs font-bold px-4 py-2 rounded-[16px]">
            {showForm ? "Cancel" : "+ Add New"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-bold text-sm text-black">Add Address</h3>
            <input placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-sm outline-none" required />
            <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-sm outline-none" required />
            <input placeholder="Street Address" value={form.street} onChange={e => setForm({...form, street: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-sm outline-none" required />
            <input placeholder="City / Landmark" value={form.landmark} onChange={e => setForm({...form, landmark: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-sm outline-none" />
            <button type="submit" className="w-full bg-[#22c55e] text-black font-bold py-3 rounded-[16px] text-xs">Save Address</button>
          </form>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-[24px] p-6 text-center shadow-sm border border-gray-100 space-y-3">
            <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto text-xl">📍</div>
            <p className="text-gray-500 text-sm">No saved shipping addresses yet.</p>
            <button onClick={() => setShowForm(true)} className="bg-black text-white font-bold px-6 py-2.5 rounded-[16px] text-xs">
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((addr, idx) => (
            <div key={idx} className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 space-y-1">
              <h4 className="font-bold text-black text-sm">{addr.fullName}</h4>
              <p className="text-gray-600 text-xs">{addr.street}, {addr.city}, {addr.state}</p>
              <p className="text-gray-400 text-xs">{addr.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
