import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Users,
  X,
} from 'lucide-react';

import { useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import {
  createOrderRecord,
  subscribeOrdersForBuyer,
  subscribeOrdersForVendor,
  subscribeProducts,
  updateOrderStatus,
  upsertProduct,
} from '../../lib/firestore.js';
import VendorDashboard from '../vendor/VendorDashboard';

export default function HomePage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('shop'); // 'shop' or 'vendor'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="marketplace-shell">
      <header className="market-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #eee' }}>
        <div className="brand brand--market" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '20px' }}>
          <ShoppingBag size={22} />
          <span>faster<span style={{ color: '#0066cc' }}>shop</span></span>
        </div>

        <div className="market-mode-switcher" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className={mode === 'shop' ? 'market-mode-switch-btn market-mode-switch-btn--active' : 'market-mode-switch-btn'} 
            onClick={() => setMode('shop')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: mode === 'shop' ? '#000' : '#fff', color: mode === 'shop' ? '#fff' : '#000' }}
          >
            <ShoppingBag size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Shop
          </button>
          
          <button 
            className={mode === 'vendor' ? 'market-mode-switch-btn market-mode-switch-btn--active' : 'market-mode-switch-btn'} 
            onClick={() => setMode('vendor')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: mode === 'vendor' ? '#000' : '#fff', color: mode === 'vendor' ? '#fff' : '#000' }}
          >
            <Store size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Vendor
          </button>

          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      <main style={{ padding: '24px' }}>
        {mode === 'vendor' ? (
          <VendorDashboard />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2>Welcome to Faster Shop</h2>
            <p style={{ color: '#666' }}>Logged in as: <strong>{user?.email || 'User'}</strong></p>
            <p style={{ marginTop: '20px' }}>Select <strong>Vendor</strong> tab above to manage your products, or stay in <strong>Shop</strong> to browse stores.</p>
          </div>
        )}
      </main>
    </div>
  );
}
