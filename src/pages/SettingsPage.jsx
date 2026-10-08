import React, { useState } from "react";
export default function SettingsPage() {
  const [name, setName] = useState("Terrence Nwezeh");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <div>
          <label className="text-xs text-zinc-400">Email Address</label>
          <input type="email" disabled value="terrencemukhtar@gmail.com" className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-500 mt-1 cursor-not-allowed" />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Display Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white mt-1" />
        </div>
        {saved && <p className="text-xs text-[#22c55e]">Settings saved successfully!</p>}
        <button type="submit" className="bg-[#22c55e] text-black font-semibold px-6 py-2.5 rounded-xl text-sm">Save Changes</button>
      </form>
    </div>
  );
}
