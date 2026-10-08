import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function VendorDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({ name: '', price: '', sizes: '', image_url: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('vendor_id', user?.id).order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return alert('Name and price required')
    setLoading(true)
    const sizesArray = typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : formData.sizes
    const { error } = await supabase.from('products').insert([{
      name: formData.name,
      price: parseFloat(formData.price),
      sizes: sizesArray,
      image_url: formData.image_url,
      vendor_id: user?.id
    }])
    setLoading(false)
    if (error) return alert(error.message)
    setFormData({ name: '', price: '', sizes: '', image_url: '' })
    fetchProducts()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      alert(error.message)
    } else {
      fetchProducts()
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Vendor Dashboard</h2>
      <form onSubmit={handleAddProduct} style={{display:'grid',gap:10,maxWidth:400}}>
        <input placeholder="Product name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} />
        <input placeholder="Price" type="number" value={formData.price} onChange={e=>setFormData({...formData,price:e.target.value})} />
        <input placeholder="Sizes comma separated e.g S,M,L" value={formData.sizes} onChange={e=>setFormData({...formData,sizes:e.target.value})} />
        <input placeholder="Image URL" value={formData.image_url} onChange={e=>setFormData({...formData,image_url:e.target.value})} />
        <button type="submit" disabled={loading}>{loading?'Adding...':'Add Product'}</button>
      </form>
      <div style={{marginTop:20}}>
        {products.map(p => (
          <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #eee',padding:10}}>
            <span>{p.name} - ₦{p.price}</span>
            <button onClick={() => handleDelete(p.id)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'4px 8px',cursor:'pointer'}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
