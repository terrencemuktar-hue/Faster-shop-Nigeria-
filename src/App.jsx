import React, { useState } from "react";
import { Package, MapPin, Settings, Store, Home } from "lucide-react";
import HomePage from "./pages/HomePage";
import OrdersPage from "./pages/OrdersPage";
import AddressesPage from "./pages/AddressesPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-[#22c55e] selection:text-black">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center text-black font-black">FS</div>
            <span className="font-bold tracking-tight text-lg">FASTER SHOP NIGERIA</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab("vendor")} className="bg-[#22c55e] text-black text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
              <Store size={14} /> Become Vendor
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {activeTab === "home" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "shop" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "vendor" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "orders" && <OrdersPage onNavigate={setActiveTab} />}
        {activeTab === "addresses" && <AddressesPage />}
        {activeTab === "settings" && <SettingsPage />}
      </main>

      <nav className="sticky bottom-0 z-50 bg-black/90 backdrop-blur border-t border-zinc-800 py-3 px-6">
        <div className="max-w-md mx-auto flex justify-between items-center text-xs">
          <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-[#22c55e]" : "text-zinc-400"}`}>
            <Home size={18} /> Home
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex flex-col items-center gap-1 ${activeTab === "orders" ? "text-[#22c55e]" : "text-zinc-400"}`}>
            <Package size={18} /> Orders
          </button>
          <button onClick={() => setActiveTab("addresses")} className={`flex flex-col items-center gap-1 ${activeTab === "addresses" ? "text-[#22c55e]" : "text-zinc-400"}`}>
            <MapPin size={18} /> Addresses
          </button>
          <button onClick={() => setActiveTab("settings")} className={`flex flex-col items-center gap-1 ${activeTab === "settings" ? "text-[#22c55e]" : "text-zinc-400"}`}>
            <Settings size={18} /> Settings
          </button>
        </div>
      </nav>
    </div>
  );
}
