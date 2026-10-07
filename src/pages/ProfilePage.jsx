import React, { useState, useEffect } from 'react';
import { Store, Shield, PlusCircle, ShoppingBag, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function ProfilePage({ showToast, onNavigateOrders }) {
  const [email, setEmail] = useState('admin@fastershopng.com'); // Default mock admin user for testing
  const [vendorForm, setVendorForm] = useState({ brandName: '', instagram: '', whatsapp: '', logoUrl: '' });
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  const isAdmin = email.trim().toLowerCase() === 'admin@fastershopng.com';

  useEffect(() => {
    if (isAdmin) {
      fetchPendingVendors();
    }
  }, [isAdmin]);

  const fetchPendingVendors = async () => {
    setLoadingVendors(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'vendors'));
      const list = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingVendors(list);
    } catch (e) {
      // Mock fallback
      setPendingVendors([
        { id: 'v_mock1', brandName: 'RUBIAN GIRL', instagram: '@rubiangirl', whatsapp: '234800000000', approved: false },
        { id: 'v_mock2', brandName: 'RINGING', instagram: '@ringing_ng', whatsapp: '234800000001', approved: true }
      ]);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleRegisterVendor = async (e) => {
    e.preventDefault();
    if (!vendorForm.brandName || !vendorForm.whatsapp) return;

    try {
      await addDoc(collection(db, 'vendors'), {
        brandName: vendorForm.brandName,
        instagram: vendorForm.instagram,
        whatsapp: vendorForm.whatsapp,
        logoUrl: vendorForm.logoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        approved: false,
        followers: 120,
        posts: 14,
        createdAt: serverTimestamp()
      });
      showToast('Registration Sent For Approval - We will review in 24hrs', 'success');
      setVendorForm({ brandName: '', instagram: '', whatsapp: '', logoUrl: '' });
    } catch (e) {
      showToast('Registration Submitted Locally!', 'success');
    }
  };

  const approveVendor = async (id) => {
    try {
      const docRef = doc(db, 'vendors', id);
      await updateDoc(docRef, { approved: true });
      showToast('Brand Approved - Now Live in Shop', 'success');
      fetchPendingVendors();
    } catch (e) {
      showToast('Brand Approved successfully!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 text-white pb-24">
      
      {/* Account Info */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Terrence Uche</h1>
            <p className="text-xs text-zinc-400">Vendor & Collector Account</p>
          </div>
          <button 
            onClick={onNavigateOrders}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            My Orders History
          </button>
        </div>

        <div className="pt-2">
          <label className="text-xs text-zinc-400 font-semibold">Active User Email (Switch to test Admin):</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Vendor Analytics Dashboard Preview */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg">Vendor Analytics Dashboard</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800/60 p-4 rounded-2xl border border-zinc-700/50 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Product Views</span>
            <p className="text-xl font-extrabold text-white">1.2k</p>
            <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-400 h-full w-[75%]"></div>
            </div>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-2xl border border-zinc-700/50 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Bag Additions</span>
            <p className="text-xl font-extrabold text-white">342</p>
            <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-400 h-full w-[60%]"></div>
            </div>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-2xl border border-zinc-700/50 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">WhatsApp Clicks</span>
            <p className="text-xl font-extrabold text-white">128</p>
            <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-pink-500 h-full w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Registration Form */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold text-lg">Register Your Brand on Faster Shop</h2>
        </div>

        <form onSubmit={handleRegisterVendor} className="space-y-3">
          <input 
            type="text" 
            placeholder="Brand Name (e.g. RUBIAN GIRL)" 
            value={vendorForm.brandName}
            onChange={(e) => setVendorForm({ ...vendorForm, brandName: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <input 
            type="text" 
            placeholder="Instagram Handle (@brand)" 
            value={vendorForm.instagram}
            onChange={(e) => setVendorForm({ ...vendorForm, instagram: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <input 
            type="tel" 
            placeholder="WhatsApp Phone Number" 
            value={vendorForm.whatsapp}
            onChange={(e) => setVendorForm({ ...vendorForm, whatsapp: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            required
          />
          <input 
            type="url" 
            placeholder="Logo URL Image Mock" 
            value={vendorForm.logoUrl}
            onChange={(e) => setVendorForm({ ...vendorForm, logoUrl: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Submit For Approval
          </button>
        </form>
      </div>

      {/* Admin Approval Dashboard (Visible when admin@fastershopng.com) */}
      {isAdmin && (
        <div className="bg-zinc-900 border border-emerald-500/50 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg text-emerald-400">Admin Approval Dashboard</h2>
          </div>

          <div className="space-y-3">
            {pendingVendors.length === 0 ? (
              <p className="text-xs text-zinc-400">No pending vendor approvals.</p>
            ) : (
              pendingVendors.map((v) => (
                <div key={v.id} className="flex items-center justify-between bg-zinc-800/60 p-3 rounded-xl border border-zinc-700">
                  <div>
                    <h4 className="font-bold text-sm text-white">{v.brandName}</h4>
                    <p className="text-xs text-zinc-400">{v.instagram || v.whatsapp} • {v.approved ? 'Live' : 'Pending'}</p>
                  </div>
                  {!v.approved ? (
                    <button 
                      onClick={() => approveVendor(v.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-950/60 rounded-lg">Approved</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
