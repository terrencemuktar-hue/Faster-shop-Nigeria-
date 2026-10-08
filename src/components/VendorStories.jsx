import React from 'react';

export default function VendorStories({ vendors = [], onSelectVendor }) {
  const displayVendors = vendors.filter(v => v.isVerified === true);

  if (displayVendors.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 py-2 overflow-x-auto scrollbar-none flex gap-4">
      {displayVendors.map((vendor, index) => (
        <div 
          key={vendor.id || index}
          onClick={() => onSelectVendor && onSelectVendor(vendor)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full p-[2px] border-2 border-white bg-zinc-900 overflow-hidden shadow-md">
            <img 
              src={vendor.avatar || vendor?.image || "" || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt={vendor?.name || ""} 
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-all"
            />
          </div>
          <span className="text-[11px] font-semibold text-zinc-800 tracking-tight max-w-[64px] truncate text-center">
            {vendor?.name || ""}
          </span>
        </div>
      ))}
    </div>
  );
}
