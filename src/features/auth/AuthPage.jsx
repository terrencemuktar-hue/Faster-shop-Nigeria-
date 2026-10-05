import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Role & Vendor details state
  const [role, setRole] = useState('buyer'); // 'buyer' or 'vendor'
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (role === 'vendor' && !storeName.trim()) {
          throw new Error('Please enter your store name.');
        }

        // 1. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        });

        // 3. If vendor, create store entry in Firestore
        if (role === 'vendor') {
          await setDoc(doc(db, 'vendors', user.uid), {
            vendorId: user.uid,
            storeName: storeName.trim(),
            category: category,
            logoUrl: '',
            isVerified: false,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Sign in existing user
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '40px auto',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Faster App</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
        {isSignUp ? 'Create your account' : 'Welcome back! Sign in to continue'}
      </p>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '14px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isSignUp && (
          <div>
            <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
              Account Type
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: role === 'buyer' ? '2px solid #000' : '1px solid #ccc',
                  backgroundColor: role === 'buyer' ? '#f0f0f0' : '#fff',
                  fontWeight: role === 'buyer' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                🛍️ Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '6px',
                  border: role === 'vendor' ? '2px solid #000' : '1px solid #ccc',
                  backgroundColor: role === 'vendor' ? '#f0f0f0' : '#fff',
                  fontWeight: role === 'vendor' ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                🏪 Vendor / Seller
              </button>
            </div>
          </div>
        )}

        {isSignUp && role === 'vendor' && (
          <>
            <div>
              <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                Store Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rubian Girl, Kinging, House of Cupid"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                Store Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Footwear & Shoes">Footwear & Shoes</option>
                <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                <option value="Bags & Leather Goods">Bags & Leather Goods</option>
                <option value="Hair & Beauty Products">Hair & Beauty Products</option>
                <option value="Food & Delivery">Food & Delivery</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: '600', fontSize: '14px', display: 'block', marginBottom: '4px' }}>
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
