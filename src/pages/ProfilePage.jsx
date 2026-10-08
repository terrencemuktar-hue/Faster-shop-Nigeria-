export default function ProfilePage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] pb-[100px]">
      {/* HEADER - BLACK */}
      <header className="bg-black px-4 pt-3 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center shadow-md">
              <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white font-black text-xs">F</div>
            </div>
            <div>
              <h1 className="text-white font-black text-[15px] tracking-widest leading-none">FASTER</h1>
              <p className="text-gray-400 text-[9px] tracking-[3px]">SHOP NIGERIA</p>
            </div>
          </div>
          <div className="flex gap-4 items-center text-white text-lg">
            <button className="hover:opacity-80">💬</button>
            <button className="text-yellow-400 hover:opacity-80">🔔</button>
            <button className="hover:opacity-80">⚙️</button>
            <button className="hover:opacity-80">👜</button>
          </div>
        </div>
        <div className="mt-3.5 bg-white rounded-full flex items-center px-4 py-2.5 shadow-sm">
          <span className="text-gray-400 mr-2">🔍</span>
          <input placeholder="Search" className="bg-transparent outline-none w-full text-sm text-black placeholder-gray-400" />
        </div>
      </header>

      {/* PROFILE CARD & SECTIONS */}
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-[24px] p-5 flex items-center gap-4 shadow-sm border border-gray-100">
          <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white font-bold text-base">TN</div>
          <div>
            <h2 className="font-bold text-black text-base">Nwezeh Terrence Uche</h2>
            <p className="text-gray-500 text-xs">terrence@fastersub.ng</p>
          </div>
        </div>

        <h3 className="text-gray-500 text-[11px] font-bold tracking-wider pt-2 px-1">ACCOUNT & DELIVERIES</h3>

        <div className="space-y-3">
          <div onClick={() => onNavigate("orders")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <span className="font-semibold text-black text-sm">My Orders & Deliveries</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("addresses")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">📍</span>
              <span className="font-semibold text-black text-sm">Saved Shipping Addresses</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("settings")} className="bg-white rounded-[16px] p-4 flex justify-between items-center shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <span className="font-semibold text-black text-sm">Account Settings</span>
            </div>
            <span className="text-gray-400 font-semibold">{'>'}</span>
          </div>

          <div onClick={() => onNavigate("vendor")} className="bg-[#22c55e] rounded-[16px] p-4 flex justify-between items-center shadow-md cursor-pointer hover:opacity-95 transition">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏪</span>
              <span className="font-bold text-black text-sm">Become a Vendor - 0 Followers OK</span>
            </div>
            <span className="text-black font-extrabold">{'>'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
