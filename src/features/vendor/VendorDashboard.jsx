import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [message, setMessage] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName || !price) {
      setMessage('Please fill in product name and price.');
      return;
    }
    setMessage(`Success! Added "${productName}" for ₦${price}.`);
    setProductName('');
    setPrice('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '4px' }}>🏪 Vendor Dashboard</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Logged in vendor: <strong>{user?.email || 'Vendor'}</strong>
      </p>

      {message && (
        <div style={{ padding: '10px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      <h3>Add New Product</h3>
      <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Product Name</label>
          <input
            type="text"
            placeholder="e.g. Classic Designer Jacket"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Price (₦)</label>
          <input
            type="number"
            placeholder="e.g. 25000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
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
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          Add Product to Shop
        </button>
      </form>
    </div>
  );
}
