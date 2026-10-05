import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { upsertProduct } from '../../lib/firestore.js';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productName || !price) {
      setMessage('Please enter a product name and price.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const productData = {
        name: productName,
        price: Number(price),
        category: category,
        imageUrl: imageUrl || 'https://via.placeholder.com/300',
        vendorId: user?.uid || 'anonymous',
        createdAt: new Date().toISOString()
      };

      await upsertProduct(productData);
      setMessage(`Success! "${productName}" is now live in the store.`);
      setProductName('');
      setPrice('');
      setImageUrl('');
    } catch (err) {
      setMessage(`Error saving product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ marginBottom: '4px' }}>🏪 Vendor Dashboard</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
        Store Owner: <strong>{user?.email || 'Vendor'}</strong>
      </p>

      {message && (
        <div style={{
          padding: '12px',
          backgroundColor: message.startsWith('Error') ? '#ffebee' : '#e8f5e9',
          color: message.startsWith('Error') ? '#c62828' : '#2e7d32',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      <h3>Add Product to Store</h3>
      <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Product Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Designer Jacket, Leather Bag, Shoes"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Price (₦)</label>
          <input
            type="number"
            required
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
            <option value="Food & Delivery">Food & Delivery</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Image URL (Optional)</label>
          <input
            type="url"
            placeholder="https://example.com/item.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
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
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '8px'
          }}
        >
          {loading ? 'Publishing Item...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
}
