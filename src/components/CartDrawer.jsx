import React from 'react'

export default function CartDrawer({ cart = [], setCart, onClose }) {
  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)

  const updateQty = (i, delta) => {
    const newCart = [...cart]
    newCart[i].qty = (newCart[i].qty || 1) + delta
    if (newCart[i].qty <= 0) newCart.splice(i, 1)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeItem = (i) => {
    const newCart = cart.filter((_, idx) => idx !== i)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Cart</h3>
        <p>Your cart is empty</p>
        <button onClick={onClose} style={{ padding: '8px 16px', cursor: 'pointer', marginTop: 10 }}>Continue Shopping</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Cart ({cart.length})</h3>
      {cart.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
          <img src={item.image_url || item.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name}</p>
            {item.selectedSize && (
              <p style={{ fontSize: 11, color: '#555', margin: '2px 0' }}>Size: <b>{item.selectedSize}</b></p>
            )}
            <p style={{ color: '#16a34a', fontWeight: 'bold', margin: '2px 0' }}>₦{item.price} x {item.qty || 1}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
              <button onClick={() => updateQty(i, -1)} style={{ padding: '2px 8px' }}>-</button>
              <span>{item.qty || 1}</span>
              <button onClick={() => updateQty(i, 1)} style={{ padding: '2px 8px' }}>+</button>
              <button onClick={() => removeItem(i)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>Remove</button>
            </div>
          </div>
        </div>
      ))}
      <h3 style={{ marginTop: 15 }}>Total: ₦{total}</h3>
      <button onClick={onClose} style={{ width: '100%', padding: '10px', background: '#22c55e', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: 6, marginTop: 10 }}>Close Cart</button>
    </div>
  )
}
