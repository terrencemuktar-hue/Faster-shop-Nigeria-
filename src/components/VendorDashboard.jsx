import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function VendorDashboard({ onNavigate }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [sizes, setSizes] = useState('S, M, L, XL')
  const [category, setCategory] = useState('Fashion')
  const [story, setStory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [myProducts, setMyProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVendorProducts()
  }, [])

  const loadVendorProducts = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })
      
      if (!error) {
        setMyProducts(data || [])
      }
    }
    setLoading(false)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!name || !price) {
      alert('Please provide product name and price.')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in as a vendor.')
      return
    }

    const sizesArray = typeof sizes === 'string' 
      ? sizes.split(',').map(s => s.trim()).filter(Boolean) 
      : (Array.isArray(sizes) ? sizes : ['Standard'])

    const { error } = await supabase.from('products').insert({
      vendor_id: user.id,
      name,
      price: parseFloat(price),
      sizes: sizesArray,
      category,
      story,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
      created_at: new Date().toISOString()
    })

    if (error) {
      alert('Error adding product: ' + error.message)
    } else {
      alert('Product added successfully!')
      setName('')
      setPrice('')
      setStory('')
      setImageUrl('')
      loadVendorProducts()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (!error) {
        loadVendorProducts()
      } else {
        alert('Error deleting: ' + error.message)
      }
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Vendor Dashboard 🚀</h2>
        <button onClick={() => onNavigate('home')} style={{ padding: '6px 12px', cursor: 'pointer' }}>Home</button>
      </div>

      <form onSubmit={handleAddProduct} style={{ background: '#f9f9f9', padding: 20, borderRadius: 12, marginBottom: 20, border: '1px solid #eee' }}>
        <h3>Add New Product</h3>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Price (₦)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Sizes (comma separated)</label>
          <input type="text" value={sizes} onChange={e => setSizes(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }}>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Beauty">Beauty</option>
            <option value="Food">Food</option>
            <option value="Home">Home</option>
          </select>
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Story</label>
          <textarea value={story} onChange={e => setStory(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 'bold' }}>Image URL</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: 8, marginTop: 4 }} />
        </div>
        <button type="submit" style={{ background: '#22c55e', color: '#000', border: 'none', padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer', borderRadius: 8 }}>Add Product</button>
      </form>

      <h3>My Products ({myProducts.length})</h3>
      {loading ? (
        <p>Loading products...</p>
      ) : myProducts.length === 0 ? (
        <p style={{ color: '#666', fontSize: 14 }}>No products added yet.</p>
      ) : (
        myProducts.map(p => (
          <div key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'center', background: '#fff', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #eee' }}>
            <img src={p.image_url || p.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>{p.name}</p>
              <p style={{ color: '#16a34a', margin: 0, fontWeight: 'bold' }}>₦{p.price}</p>
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {Array.isArray(p.sizes) && p.sizes.map((s, idx) => (
                  <span key={idx} style={{ background: '#f3f4f6', padding: '1px 6px', fontSize: 10, borderRadius: 4 }}>{s}</span>
                ))}
              </div>
            </div>
            <button onClick={() => handleDelete(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
          </div>
        ))
      )}
    </div>
  )
}
