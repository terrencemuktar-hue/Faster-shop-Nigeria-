import React from 'react'
export default function CartDrawer({ cart = [], setCart, onClose }) {
  const total = cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0)
  return (
    <div style={{padding:20}}>
      <h3>Cart ({cart.length})</h3>
      {cart.length === 0 ? <p>Your cart is empty</p> : cart.map((item, i) => (
        <div key={i}><p>{item.name} - ₦{item.price}</p></div>
      ))}
      <h3>Total: ₦{total}</h3>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
