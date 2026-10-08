import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";
import AddressesPage from "./pages/AddressesPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-black flex flex-col justify-between selection:bg-[#22c55e] selection:text-black font-sans">
      <main className="flex-1">
        {activeTab === "home" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "shop" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "search" && <HomePage onNavigate={setActiveTab} />}
        {activeTab === "wishlist" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 text-center text-gray-500 pt-20">Your wishlist is empty.</div>
        )}
        {activeTab === "cart" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 text-center text-gray-500 pt-20 space-y-4">
            <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
            <p>Your cart is empty.</p>
            <button onClick={() => setActiveTab("shop")} className="bg-[#22c55e] text-black font-bold px-6 py-2.5 rounded-[16px] text-xs">Start Shopping</button>
          </div>
        )}
        {activeTab === "profile" && <ProfilePage onNavigate={setActiveTab} />}
        {activeTab === "chat" && <ChatPage onNavigate={setActiveTab} />}
        {activeTab === "notifications" && <NotificationsPage onNavigate={setActiveTab} />}
        {activeTab === "addresses" && <AddressesPage onNavigate={setActiveTab} />}
        {activeTab === "settings" && <SettingsPage onNavigate={setActiveTab} />}
        {activeTab === "vendor" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 space-y-4 pt-10">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4 max-w-xl mx-auto">
              <h2 className="text-xl font-bold text-black">Vendor Registration (0 Followers OK)</h2>
              <p className="text-gray-500 text-sm">Open your store on Faster Shop Nigeria instantly.</p>
              <button onClick={() => { alert("Store registered successfully!"); setActiveTab("profile"); }} className="w-full bg-[#22c55e] text-black font-bold py-3.5 rounded-[16px]">
                Submit Store Details
              </button>
              <button onClick={() => setActiveTab("profile")} className="w-full bg-gray-100 text-black font-semibold py-2.5 rounded-[16px] text-xs">
                Back to Profile
              </button>
            </div>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 space-y-4 pt-10">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4 max-w-xl mx-auto">
              <h2 className="text-xl font-bold text-black">My Orders & Deliveries</h2>
              <p className="text-gray-500 text-sm">You have no active orders yet.</p>
              <button onClick={() => setActiveTab("profile")} className="w-full bg-black text-white font-bold py-3 rounded-[16px] text-xs">
                Back to Profile
              </button>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAV - BLACK FIXED */}
      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-black rounded-t-[24px] flex justify-around items-center px-4 z-50 shadow-2xl">
        <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${activeTab === "home" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => setActiveTab("shop")} className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${activeTab === "shop" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">👜</span>
          <span className="text-[10px]">Shop</span>
        </button>
        <button onClick={() => setActiveTab("search")} className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${activeTab === "search" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">🔍</span>
          <span className="text-[10px]">Search</span>
        </button>
        <button onClick={() => setActiveTab("wishlist")} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "wishlist" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-lg">♡</span>
          <span className="text-[10px]">Wishlist</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center gap-0.5 transition cursor-pointer ${activeTab === "profile" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
