import {
  ArrowRight,
  BadgeCheck,
  Box,
  Boxes,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  Pencil,
  Plus,
  Store,
  Truck,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const statusLabels = {
  new: 'New order',
  processing: 'Accepted',
  packed: 'Packed',
  shipped: 'Dispatched',
  delivered: 'Delivered',
}

const nextStatus = {
  new: { value: 'processing', label: 'Accept order' },
  processing: { value: 'packed', label: 'Mark packed' },
  packed: { value: 'shipped', label: 'Mark dispatched' },
  shipped: { value: 'delivered', label: 'Mark delivered' },
}

const emptyProduct = {
  name: '',
  category: '',
  price: '',
  inventory: '',
  image: '',
  description: '',
}

const orderFilters = [
  { id: 'all', label: 'All orders' },
  { id: 'new', label: 'New' },
  { id: 'active', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]

export default function VendorDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  vendors,
  currentVendor,
  onVendorChange,
  onSaveProduct,
  onAdvanceOrder,
  formatPrice,
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [orderFilter, setOrderFilter] = useState('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState(emptyProduct)

  const vendorProducts = useMemo(
    () => products.filter((product) => product.vendor === currentVendor),
    [products, currentVendor],
  )
  const vendorOrders = useMemo(
    () => orders.filter((order) => order.vendor === currentVendor),
    [orders, currentVendor],
  )
  const lowStockProducts = vendorProducts.filter((product) => product.inventory <= 5)
  const openOrders = vendorOrders.filter((order) => order.status !== 'delivered')
  const grossSales = vendorOrders.reduce((sum, order) => sum + order.total, 0)
  const filteredOrders = vendorOrders.filter((order) => {
    if (orderFilter === 'new') return order.status === 'new'
    if (orderFilter === 'active') return order.status !== 'new' && order.status !== 'delivered'
    if (orderFilter === 'completed') return order.status === 'delivered'
    return true
  })

  function openProductEditor(product = null) {
    setEditingProductId(product?.id ?? null)
    setProductForm(product ? {
      name: product.name,
      category: product.category || '',
      price: String(product.price),
      inventory: String(product.inventory ?? 0),
      image: product.image || '',
      description: product.description || '',
    } : emptyProduct)
    setEditorOpen(true)
  }

  function saveProduct(event) {
    event.preventDefault()
    const existingProduct = products.find((product) => product.id === editingProductId)
    const product = {
      ...existingProduct,
      id: existingProduct?.id || `${productForm.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      name: productForm.name.trim(),
      vendor: currentVendor,
      category: productForm.category.trim(),
      price: Number(productForm.price),
      inventory: Number(productForm.inventory),
      image: productForm.image.trim() || vendorProducts[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      description: productForm.description.trim(),
      vendorTag: existingProduct?.vendorTag || 'New arrival',
      tag: existingProduct?.tag || 'New',
      rating: existingProduct?.rating || 4.8,
      variants: existingProduct?.variants || ['One size'],
      shipping: existingProduct?.shipping || 'Ships in 2-3 days',
    }

    setProducts((current) => existingProduct
      ? current.map((item) => item.id === existingProduct.id ? product : item)
      : [product, ...current])
    if (onSaveProduct) {
      onSaveProduct(product)
    }
    setEditorOpen(false)
  }

  function advanceOrder(orderId) {
    const nextStatusValue = nextStatus[orders.find((order) => order.id === orderId)?.status]?.value
    if (!nextStatusValue) return

    setOrders((current) => current.map((order) => {
      if (order.id !== orderId || !nextStatus[order.status]) return order
      return { ...order, status: nextStatus[order.status].value }
    }))

    if (onAdvanceOrder) {
      onAdvanceOrder(orderId, nextStatusValue)
    }
  }

  function renderOrder(order, compact = false) {
    const action = nextStatus[order.status]

    return (
      <article className={`vendor-order ${compact ? 'vendor-order--compact' : ''}`} key={order.id}>
        <div className="vendor-order__topline">
          <div>
            <strong>{order.id}</strong>
            <span>{order.placedAt}</span>
          </div>
          <span className={`vendor-status vendor-status--${order.status}`}>{statusLabels[order.status]}</span>
        </div>
        <div className="vendor-order__content">
          <div className="vendor-order__buyer">
            <strong>{order.customer}</strong>
            <span>{order.customerEmail}</span>
          </div>
          <div className="vendor-order__items">
            {order.items.map((item) => (
              <span key={`${order.id}-${item.name}`}>{item.quantity} × {item.name}{item.variant ? ` · ${item.variant}` : ''}</span>
            ))}
            {!compact && <span className="vendor-order__address">{order.address}</span>}
          </div>
          <div className="vendor-order__total">
            <span>Order total</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>
        {action && (
          <div className="vendor-order__actions">
            {!compact && <span><Clock3 size={14} /> Next: {action.label.toLowerCase()}</span>}
            <button className="vendor-action-button" type="button" onClick={() => advanceOrder(order.id)}>
              {action.label} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </article>
    )
  }

  return (
    <main className="vendor-dashboard">
      <header className="vendor-dashboard__header">
        <div>
          <span className="vendor-eyebrow"><Store size={14} /> Vendor workspace</span>
          <h1>{currentVendor}</h1>
          <p>Your shop at a glance. Manage listings, stock, and incoming orders.</p>
        </div>
        <label className="vendor-store-picker">
          <span>Active store</span>
          <select value={currentVendor} onChange={(event) => onVendorChange(event.target.value)}>
            {vendors.map((vendor) => <option key={vendor.name} value={vendor.name}>{vendor.name}</option>)}
          </select>
        </label>
      </header>

      <section className="vendor-stat-grid" aria-label="Store overview">
        <article className="vendor-stat">
          <span className="vendor-stat__icon"><CircleDollarSign size={18} /></span>
          <span className="vendor-stat__label">Demo gross sales</span>
          <strong>{formatPrice(grossSales)}</strong>
          <small>Across {vendorOrders.length} sample orders</small>
        </article>
        <article className="vendor-stat">
          <span className="vendor-stat__icon"><PackageCheck size={18} /></span>
          <span className="vendor-stat__label">To fulfill</span>
          <strong>{openOrders.length}</strong>
          <small>Orders not yet delivered</small>
        </article>
        <article className="vendor-stat">
          <span className="vendor-stat__icon"><Boxes size={18} /></span>
          <span className="vendor-stat__label">Active listings</span>
          <strong>{vendorProducts.length}</strong>
          <small>Products in your catalog</small>
        </article>
        <article className={`vendor-stat ${lowStockProducts.length ? 'vendor-stat--alert' : ''}`}>
          <span className="vendor-stat__icon"><Box size={18} /></span>
          <span className="vendor-stat__label">Low stock</span>
          <strong>{lowStockProducts.length}</strong>
          <small>5 units or fewer remaining</small>
        </article>
      </section>

      <nav className="vendor-tabs" aria-label="Vendor dashboard" role="tablist">
        {[
          { id: 'overview', label: 'Overview', icon: Store },
          { id: 'products', label: 'Products', icon: Boxes },
          { id: 'orders', label: 'Orders', icon: Truck, count: openOrders.length },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            className={`vendor-tab ${activeTab === id ? 'vendor-tab--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} /> {label}
            {count > 0 && <span className="vendor-tab__count">{count}</span>}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <section className="vendor-overview-grid" role="tabpanel">
          <div className="vendor-overview-block">
            <div className="vendor-block-heading">
              <div><span>FULFILLMENT</span><h2>Orders to action</h2></div>
              <button type="button" className="vendor-text-button" onClick={() => setActiveTab('orders')}>All orders <ArrowRight size={14} /></button>
            </div>
            {openOrders.length ? (
              <div className="vendor-order-list">{openOrders.slice(0, 3).map((order) => renderOrder(order, true))}</div>
            ) : (
              <p className="vendor-empty-state">You are all caught up. New orders will appear here.</p>
            )}
          </div>

          <div className="vendor-overview-block vendor-inventory-block">
            <div className="vendor-block-heading">
              <div><span>INVENTORY</span><h2>Stock watch</h2></div>
              <button type="button" className="vendor-text-button" onClick={() => setActiveTab('products')}>Manage stock <ArrowRight size={14} /></button>
            </div>
            {lowStockProducts.length ? (
              <ul className="vendor-stock-list">
                {lowStockProducts.slice(0, 4).map((product) => (
                  <li key={product.id}>
                    <span><strong>{product.name}</strong><small>{product.category || 'Uncategorised'}</small></span>
                    <b>{product.inventory} left</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vendor-empty-state">All listings have more than five units in stock.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'products' && (
        <section className="vendor-tab-panel" role="tabpanel">
          <div className="vendor-panel-heading">
            <div><span className="vendor-panel-kicker">CATALOG</span><h2>Product management</h2><p>Update pricing and available inventory for your listings.</p></div>
            <button className="vendor-primary-button" type="button" onClick={() => openProductEditor()}><Plus size={16} /> Add product</button>
          </div>
          {vendorProducts.length ? (
            <div className="vendor-product-table-wrap">
              <table className="vendor-product-table">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Inventory</th><th>Status</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
                <tbody>
                  {vendorProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="vendor-product-name"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.vendorTag || 'Shop listing'}</small></span></div>
                      </td>
                      <td>{product.category || 'Uncategorised'}</td>
                      <td className="vendor-product-price">{formatPrice(product.price)}</td>
                      <td><strong>{product.inventory}</strong> units</td>
                      <td><span className={`vendor-stock-status ${product.inventory <= 5 ? 'vendor-stock-status--low' : ''}`}>{product.inventory <= 5 ? 'Low stock' : 'In stock'}</span></td>
                      <td><button className="vendor-icon-action" type="button" aria-label={`Edit ${product.name}`} title={`Edit ${product.name}`} onClick={() => openProductEditor(product)}><Pencil size={15} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vendor-empty-panel"><Boxes size={24} /><p>No products yet. Add your first listing to get started.</p></div>
          )}
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="vendor-tab-panel" role="tabpanel">
          <div className="vendor-panel-heading vendor-panel-heading--orders">
            <div><span className="vendor-panel-kicker">FULFILLMENT</span><h2>Buyer orders</h2><p>Accept and move each order through delivery.</p></div>
            <span className="vendor-demo-label"><BadgeCheck size={14} /> Demo order data</span>
          </div>
          <div className="vendor-order-filters" role="group" aria-label="Filter orders">
            {orderFilters.map((filter) => (
              <button key={filter.id} type="button" className={orderFilter === filter.id ? 'vendor-filter vendor-filter--active' : 'vendor-filter'} onClick={() => setOrderFilter(filter.id)}>
                {filter.label}{filter.id === 'new' && vendorOrders.filter((order) => order.status === 'new').length > 0 && <span>{vendorOrders.filter((order) => order.status === 'new').length}</span>}
              </button>
            ))}
          </div>
          {filteredOrders.length ? (
            <div className="vendor-order-list vendor-order-list--full">{filteredOrders.map((order) => renderOrder(order))}</div>
          ) : (
            <div className="vendor-empty-panel"><PackageCheck size={24} /><p>No orders in this view.</p></div>
          )}
        </section>
      )}

      {editorOpen && (
        <div className="vendor-modal-backdrop" onClick={() => setEditorOpen(false)}>
          <section className="vendor-product-modal" role="dialog" aria-modal="true" aria-labelledby="vendor-product-title" onClick={(event) => event.stopPropagation()}>
            <header className="vendor-product-modal__header">
              <div><span className="vendor-panel-kicker">{editingProductId ? 'EDIT LISTING' : 'NEW LISTING'}</span><h2 id="vendor-product-title">{editingProductId ? 'Update product' : 'Add a product'}</h2></div>
              <button className="vendor-icon-action" type="button" aria-label="Close product form" onClick={() => setEditorOpen(false)}><X size={18} /></button>
            </header>
            <form className="vendor-product-form" onSubmit={saveProduct}>
              <label className="vendor-form-field vendor-form-field--wide">Product name
                <input autoFocus name="name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="e.g. Hand-dyed cotton shirt" required />
              </label>
              <label className="vendor-form-field">Category
                <input name="category" value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })} placeholder="Fashion, home, beauty..." required />
              </label>
              <label className="vendor-form-field">Price (NGN)
                <input name="price" type="number" min="1" step="100" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="18500" required />
              </label>
              <label className="vendor-form-field">Available units
                <input name="inventory" type="number" min="0" step="1" value={productForm.inventory} onChange={(event) => setProductForm({ ...productForm, inventory: event.target.value })} placeholder="20" required />
              </label>
              <label className="vendor-form-field vendor-form-field--wide">Product image URL
                <input name="image" type="url" value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })} placeholder="https://... (optional)" />
              </label>
              <label className="vendor-form-field vendor-form-field--wide">Description
                <textarea name="description" rows="3" value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="What makes this item special?" />
              </label>
              <div className="vendor-product-form__actions">
                <button className="vendor-cancel-button" type="button" onClick={() => setEditorOpen(false)}>Cancel</button>
                <button className="vendor-primary-button" type="submit">{editingProductId ? 'Save changes' : 'Add listing'} <ArrowRight size={15} /></button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}