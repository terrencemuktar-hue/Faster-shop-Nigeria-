import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

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
        {activeTab === "profile" && <ProfilePage onNavigate={setActiveTab} />}
        {activeTab === "vendor" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 space-y-4 pt-10">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-black">Vendor Registration</h2>
              <p className="text-gray-500 text-sm">Open your store on Faster Shop Nigeria with zero followers required.</p>
              <button onClick={() => alert("Vendor application submitted successfully!")} className="w-full bg-[#22c55e] text-black font-bold py-3.5 rounded-[16px]">
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
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-black">My Orders & Deliveries</h2>
              <p className="text-gray-500 text-sm">You have no active orders yet. When you buy from vendors, your delivery status will appear here.</p>
              <button onClick={() => setActiveTab("profile")} className="w-full bg-black text-white font-bold py-3 rounded-[16px] text-xs">
                Back to Profile
              </button>
            </div>
          </div>
        )}
        {activeTab === "addresses" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 space-y-4 pt-10">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-black">Saved Shipping Addresses</h2>
              <p className="text-gray-500 text-sm">No saved addresses yet.</p>
              <button onClick={() => setActiveTab("profile")} className="w-full bg-black text-white font-bold py-3 rounded-[16px] text-xs">
                Back to Profile
              </button>
            </div>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="min-h-screen bg-[#f5f5f7] p-6 space-y-4 pt-10">
            <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-black">Account Settings</h2>
              <p className="text-gray-500 text-sm">Nwezeh Terrence Uche (terrence@fastersub.ng)</p>
              <button onClick={() => setActiveTab("profile")} className="w-full bg-black text-white font-bold py-3 rounded-[16px] text-xs">
                Back to Profile
              </button>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM NAV - BLACK FIXED */}
      <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-black rounded-t-[24px] flex justify-around items-center px-4 z-50 shadow-2xl">
        <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center gap-0.5 transition ${activeTab === "home" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => setActiveTab("shop")} className={`flex flex-col items-center gap-0.5 transition ${activeTab === "shop" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">👜</span>
          <span className="text-[10px]">Shop</span>
        </button>
        <button onClick={() => setActiveTab("search")} className={`flex flex-col items-center gap-0.5 transition ${activeTab === "search" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">🔍</span>
          <span className="text-[10px]">Search</span>
        </button>
        <button onClick={() => setActiveTab("wishlist")} className={`flex flex-col items-center gap-1 transition ${activeTab === "wishlist" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-lg">♡</span>
          <span className="text-[10px]">Wishlist</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center gap-0.5 transition ${activeTab === "profile" ? "text-white" : "text-gray-400 hover:text-white"}`}>
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
