import React, { useState } from 'react';
import Logo from '../components/Logo';

export function ProfilePage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegisterVendor = (e) => {
    e.preventDefault();
    if (!brandName || !whatsappNumber) {
      alert('Please fill in your brand name and WhatsApp number.');
      return;
    }
    setSuccessMsg(`Successfully registered "${brandName}"! Your vendor store is now live.`);
    setBrandName('');
    setInstagramHandle('');
    setWhatsappNumber('');
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto shadow-2xl">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white">
        <Logo size="sm" />
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-300">My Profile</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-neutral-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-black text-white font-black text-xl flex items-center justify-center shadow-md">
            NT
          </div>
          <div>
            <h2 className="font-bold text-base text-neutral-900">Nwezeh Terrence Uche</h2>
            <p className="text-xs text-neutral-500">terrencemuktar@gmail.com</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FF2D78]/10 text-[#FF2D78]">
              VIP Shopper & Creator
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-black to-neutral-900 text-white rounded-[24px] p-6 shadow-xl space-y-4">
          <span className="text-[10px] font-bold tracking-widest uppercase bg-[#FF2D78] px-3 py-1 rounded-full text-white">
            Partner Program
          </span>
          <h3 className="text-lg font-black tracking-wide">Are you a fashion designer or vendor in Nigeria?</h3>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Open your own Instagram-style storefront on Faster Shop. List your products, get direct WhatsApp customer orders, and scale your brand.
          </p>
          <button
            onClick={() => setIsRegistering(true)}
            className="w-full bg-[#00D26A] text-black py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-emerald-400 transition"
          >
            Register Your Brand
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold text-center">
            {successMsg}
          </div>
        )}

        <div className="bg-white rounded-[20px] p-2 shadow-sm border border-neutral-100 divide-y divide-neutral-100 text-xs font-semibold">
          <button className="w-full py-3.5 px-4 text-left flex justify-between items-center hover:bg-neutral-50 rounded-xl">
            <span>📦 My Orders & Deliveries</span>
            <span className="text-neutral-400">→</span>
          </button>
          <button className="w-full py-3.5 px-4 text-left flex justify-between items-center hover:bg-neutral-50 rounded-xl">
            <span>📍 Saved Shipping Addresses</span>
            <span className="text-neutral-400">→</span>
          </button>
          <button className="w-full py-3.5 px-4 text-left flex justify-between items-center hover:bg-neutral-50 rounded-xl">
            <span>⚙️ Account Settings</span>
            <span className="text-neutral-400">→</span>
          </button>
        </div>
      </div>

      {isRegistering && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-5">
          <div className="bg-white rounded-[24px] p-6 max-w-sm w-full space-y-5 text-neutral-900 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base">Register Your Brand</h3>
              <button onClick={() => setIsRegistering(false)} className="text-neutral-400 hover:text-black font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleRegisterVendor} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-neutral-500 uppercase tracking-wider text-[10px]">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amardedon"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-neutral-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D78]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 uppercase tracking-wider text-[10px]">Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@yourbrand"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full bg-neutral-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D78]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
                <input
                  type="text"
                  placeholder="2348012345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-neutral-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF2D78]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 uppercase tracking-wider text-[10px]">Logo / Store Image</label>
                <input
                  type="file"
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00D26A] text-black py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-emerald-400 transition mt-2"
              >
                Launch Storefront
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
