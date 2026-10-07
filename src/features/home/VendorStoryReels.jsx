import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

export default function VendorStoryReels({ vendors = [] }) {
  const [activeVendorIndex, setActiveVendorIndex] = useState(null);

  if (!vendors.length) return null;

  const activeVendor = activeVendorIndex !== null ? vendors[activeVendorIndex] : null;

  const handleNext = () => {
    if (activeVendorIndex < vendors.length - 1) {
      setActiveVendorIndex(activeVendorIndex + 1);
    } else {
      setActiveVendorIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeVendorIndex > 0) {
      setActiveVendorIndex(activeVendorIndex - 1);
    }
  };

  const openWhatsApp = (phone, vendorName) => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const message = encodeURIComponent(`Hi ${vendorName}, I saw your store reel on Faster Shop!`);
    window.open(`https://wa.me/${cleanPhone || '2348000000000'}?text=${message}`, '_blank');
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-neutral-200 mb-4">Vendor Stories</h2>
      
      {/* Story Rings */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none">
        {vendors.map((vendor, idx) => (
          <button
            key={vendor.id || idx}
            onClick={() => setActiveVendorIndex(idx)}
            className="flex flex-col items-center space-y-2 group focus:outline-none flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 group-hover:scale-105 transition">
              <div className="w-full h-full rounded-full bg-neutral-900 border-2 border-black flex items-center justify-center font-bold text-lg text-emerald-400 overflow-hidden">
                {vendor.logo ? (
                  <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  vendor.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <span className="text-xs text-neutral-300 font-medium truncate w-16 text-center">
              {vendor.name}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Story Viewer */}
      {activeVendor && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm h-[600px] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-between p-6 shadow-2xl">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
                  {activeVendor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{activeVendor.name}</h3>
                  <p className="text-[11px] text-neutral-400">{activeVendor.category || 'Verified Vendor'}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveVendorIndex(null)}
                className="p-2 rounded-full bg-neutral-800/80 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Content Card */}
            <div className="my-auto text-center space-y-4 px-4">
              <div className="w-24 h-24 bg-neutral-800 rounded-full mx-auto flex items-center justify-center text-3xl font-extrabold text-emerald-400 border-2 border-emerald-500/30">
                {activeVendor.name.charAt(0)}
              </div>
              <h4 className="text-xl font-extrabold text-white">{activeVendor.name}</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {activeVendor.bio || activeVendor.description || 'Welcome to our store! Tap below to chat directly with us on WhatsApp for custom orders and inquiries.'}
              </p>
            </div>

            {/* Navigation & WhatsApp CTA */}
            <div className="space-y-4 z-10">
              <button
                onClick={() => openWhatsApp(activeVendor.phone, activeVendor.name)}
                className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20"
              >
                <MessageCircle className="w-5 h-5 fill-black" />
                <span>Chat on WhatsApp</span>
              </button>

              <div className="flex justify-between items-center text-xs text-neutral-400 px-2">
                <button
                  onClick={handlePrev}
                  disabled={activeVendorIndex === 0}
                  className="flex items-center space-x-1 disabled:opacity-30 hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <span>{activeVendorIndex + 1} of {vendors.length}</span>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1 hover:text-white"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
