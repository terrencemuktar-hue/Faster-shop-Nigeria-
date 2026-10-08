import React, { useState } from "react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function SettingsPage({ onNavigate }) {
  const [displayName, setDisplayName] = useState("Nwezeh Terrence Uche");
  const [message, setMessage] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    alert("Logged out successfully.");
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      <Header onNavigate={onNavigate} />
      <div className="p-6 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-black">Account Settings</h2>

        {message && <div className="bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 p-3 rounded-[12px] text-xs font-semibold">{message}</div>}

        <form onSubmit={handleUpdate} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500">Email Address (Read-only)</label>
            <input type="email" value="terrence@fastersub.ng" readOnly className="w-full bg-gray-100 border border-gray-200 rounded-[12px] p-3 text-sm text-gray-600 outline-none cursor-not-allowed" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500">Display Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[12px] p-3 text-sm text-black outline-none font-medium" />
          </div>

          <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-[16px] text-xs">
            Save Changes
          </button>
        </form>

        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-bold text-sm text-black">Session & Security</h3>
          <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-[16px] text-xs hover:bg-red-100 transition">
            Log Out of Faster Shop
          </button>
        </div>
      </div>
    </div>
  );
}
