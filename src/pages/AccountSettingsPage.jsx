import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Bell, Shield } from 'lucide-react';

export default function AccountSettingsPage({ onBack, showToast }) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('accountSettings') || '{}');
    if (settings.email) setEmail(settings.email);
    if (settings.whatsapp) setWhatsapp(settings.whatsapp);
    if (settings.notifications !== undefined) setNotifications(settings.notifications);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = { email, whatsapp, notifications };
    localStorage.setItem('accountSettings', JSON.stringify(settings));
    if (showToast) showToast('Settings Saved', 'success');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to clear your local data and reset account?')) {
      localStorage.clear();
      window.location.reload();
    }
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
        <h1 className="text-lg font-bold">Account Settings</h1>
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] text-zinc-400 font-semibold">Email Address</label>
          <input 
            type="email" 
            placeholder="your@email.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-zinc-400 font-semibold">WhatsApp Number</label>
          <input 
            type="text" 
            placeholder="+234..." 
            value={whatsapp} 
            onChange={e => setWhatsapp(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00D26A]"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#00D26A]" />
            <span className="text-xs font-semibold">Push Notifications</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications} 
            onChange={e => setNotifications(e.target.checked)}
            className="w-4 h-4 accent-[#00D26A] cursor-pointer"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#00D26A] text-black font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </form>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
        <h2 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-[11px] text-zinc-400">Permanently delete local app storage, wishlist, and user data.</p>
        <button 
          onClick={handleDeleteAccount}
          className="w-full bg-pink-600/20 border border-pink-500/50 hover:bg-pink-600 text-pink-400 hover:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Delete Local Account Data
        </button>
      </div>
    </div>
  );
}
