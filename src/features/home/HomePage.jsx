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
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import {
  createOrderRecord,
  subscribeOrdersForBuyer,
  subscribeOrdersForVendor,
  subscribeProducts,
  updateOrderStatus,
  upsertProduct,
} from '../../lib/firestore.js'
import VendorDashboard from '../vendor/VendorDashboard.jsx'

const categories = [
  'Fashion',
  'Home',
  'Beauty',
  'Craft',
  'Wellness',
  'Accessories',
  'Gifting',
]

const vendors = [
  {
    name: 'Amina Atelier',
    specialty: 'Tailored essentials',
    rating: 4.9,
    tag: 'New this week',
    accent: 'sunset',
  },
  {
    name: 'Nia Studio',
    specialty: 'Handmade décor',
    rating: 4.8,
    tag: 'Top rated',
    accent: 'forest',
  },
  {
    name: 'Lagos Rituals',
    specialty: 'Skin & scent',
    rating: 4.9,
    tag: 'Popular',
    accent: 'cocoa',
  },
]

const formatPrice = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)

const initialProducts = [
  {
    id: 'soft-stripe-tote',
    name: 'Soft Stripe Tote',
    vendor: 'Amina Atelier',
    vendorId: 'vendor-amina',
    category: 'Fashion',
    inventory: 24,
    vendorTag: 'Creator pick',
    price: 18500,
    tag: 'Bestseller',
    rating: 4.9,
    description:
      'A roomy everyday tote made with a soft woven finish, structured straps, and a clean stripe pattern that works from market runs to office days.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    variants: ['Sand', 'Ivory', 'Forest'],
    shipping: 'Ships in 24 hours',
  },
  {
    id: 'handwoven-basket',
    name: 'Handwoven Basket',
    vendor: 'Nia Studio',
    vendorId: 'vendor-nia',
    category: 'Home',
    inventory: 12,
    vendorTag: 'Slow craft',
    price: 12400,
    tag: 'Eco pick',
    rating: 4.8,
    description:
      'Natural fibers, soft texture, and a sculpted form that brings warmth to entryways, bedside corners, and coffee tables.',
    image:
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80',
    variants: ['Natural', 'Walnut', 'Cream'],
    shipping: 'Local pickup available',
  },
  {
    id: 'saffron-body-oil',
    name: 'Saffron Body Oil',
    vendor: 'Lagos Rituals',
    vendorId: 'vendor-lagos',
    category: 'Beauty',
    inventory: 32,
    vendorTag: 'Small batch',
    price: 9800,
    tag: 'Limited',
    rating: 5.0,
    description:
      'A lightweight oil blend with saffron, sweet almond, and shea for soft, luminous skin and a warm, grounding finish.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    variants: ['30ml', '60ml', '90ml'],
    shipping: 'Free delivery over ₦30,000',
  },
  {
    id: 'canvas-everyday-set',
    name: 'Canvas Everyday Set',
    vendor: 'Kehinde Home',
    vendorId: 'vendor-kehinde',
    category: 'Home',
    inventory: 9,
    vendorTag: 'Fresh drop',
    price: 22200,
    tag: 'Fresh',
    rating: 4.7,
    description:
      'A relaxed home set with neutral tones and soft-touch textures designed for slow mornings, hosting, and everyday comfort.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    variants: ['Stone', 'Charcoal', 'Terracotta'],
    shipping: 'Ships in 3 days',
  },
]

const initialOrders = [
  {
    id: 'FS-20481',
    vendor: 'Amina Atelier',
    customer: 'Tomi Adebayo',
    customerEmail: 'tomi.a@example.com',
    placedAt: 'Today, 9:42 AM',
    items: [{ name: 'Soft Stripe Tote', variant: 'Ivory', quantity: 1 }],
    total: 18500,
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
    status: 'new',
  },
  {
    id: 'FS-20473',
    vendor: 'Amina Atelier',
    customer: 'Feyi Okafor',
    customerEmail: 'feyi.o@example.com',
    placedAt: 'Today, 8:16 AM',
    items: [{ name: 'Soft Stripe Tote', variant: 'Sand', quantity: 2 }],
    total: 37000,
    address: '20 Allen Avenue, Ikeja, Lagos',
    status: 'processing',
  },
  {
    id: 'FS-20468',
    vendor: 'Nia Studio',
    customer: 'Bolu James',
    customerEmail: 'bolu.j@example.com',
    placedAt: 'Today, 7:58 AM',
    items: [{ name: 'Handwoven Basket', variant: 'Natural', quantity: 1 }],
    total: 12400,
    address: '8 Bode Thomas Street, Surulere, Lagos',
    status: 'new',
  },
  {
    id: 'FS-20462',
    vendor: 'Lagos Rituals',
    customer: 'Nneka Obi',
    customerEmail: 'nneka.o@example.com',
    placedAt: 'Yesterday, 4:31 PM',
    items: [{ name: 'Saffron Body Oil', variant: '60ml', quantity: 2 }],
    total: 19600,
    address: '4 Akin Olugbade Street, Victoria Island, Lagos',
    status: 'packed',
  },
  {
    id: 'FS-20455',
    vendor: 'Kehinde Home',
    customer: 'Seyi Martins',
    customerEmail: 'seyi.m@example.com',
    placedAt: 'Yesterday, 2:05 PM',
    items: [{ name: 'Canvas Everyday Set', variant: 'Stone', quantity: 1 }],
    total: 22200,
    address: '17 Ogunlana Drive, Surulere, Lagos',
    status: 'shipped',
  },
]

export default function HomePage() {
  const { user, profile } = useAuth()
  const [mode, setMode] = useState('shop')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState('Sand')
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState('idle')
  const [deliveryAddress, setDeliveryAddress] = useState('home')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '' })
  const [orderReference, setOrderReference] = useState('')
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState(initialOrders)
  const [currentVendor, setCurrentVendor] = useState(profile?.storeName || 'Amina Atelier')
  const [cartItems, setCartItems] = useState([
    {
      id: 'soft-stripe-tote',
      name: 'Soft Stripe Tote',
      vendor: 'Amina Atelier',
      price: 18500,
      variant: 'Ivory',
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'saffron-body-oil',
      name: 'Saffron Body Oil',
      vendor: 'Lagos Rituals',
      price: 9800,
      variant: '60ml',
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    },
  ])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )
  const shipping = subtotal === 0 ? 0 : subtotal >= 30000 ? 0 : 1500
  const total = subtotal + shipping
  const isVendor = profile?.role === 'vendor' && profile.vendorStatus === 'approved'
  const vendorOptions = [...new Set([...vendors.map((vendor) => vendor.name), ...products.map((product) => product.vendor)])]
    .map((name) => ({ name }))

  useEffect(() => {
    const unsubscribeProducts = subscribeProducts((nextProducts) => {
      if (nextProducts.length > 0) {
        setProducts(nextProducts)
      }
    })

    return () => unsubscribeProducts()
  }, [])

  useEffect(() => {
    if (!user) {
      setOrders(initialOrders)
      return undefined
    }

    if (isVendor) {
      return subscribeOrdersForVendor(user.uid, (nextOrders) => {
        setOrders(nextOrders.length > 0 ? nextOrders : initialOrders)
      })
    }

    return subscribeOrdersForBuyer(user.uid, (nextOrders) => {
      setOrders(nextOrders.length > 0 ? nextOrders : initialOrders)
    })
  }, [isVendor, user])

  useEffect(() => {
    if (profile?.storeName) {
      setCurrentVendor(profile.storeName)
    }
  }, [profile])

  function openProductModal(product) {
    setSelectedProduct(product)
    setSelectedVariant(product.variants[0])
  }

  function addToCart(product, variant = product.variants[0]) {
    const quantityInCart = cartItems
      .filter((item) => item.id === product.id)
      .reduce((sum, item) => sum + item.quantity, 0)
    if (product.inventory === 0 || quantityInCart >= product.inventory) return

    const productKey = `${product.id}-${variant}`

    setCartItems((current) => {
      const existingItem = current.find((item) => `${item.id}-${item.variant}` === productKey)

      if (existingItem) {
        return current.map((item) =>
          `${item.id}-${item.variant}` === productKey
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [
        {
          id: product.id,
          name: product.name,
          vendor: product.vendor,
          price: product.price,
          variant,
          quantity: 1,
          image: product.image,
        },
        ...current,
      ]
    })

    setSelectedProduct(null)
    setCartOpen(true)
  }

  function changeQuantity(productKey, delta) {
    if (delta > 0) {
      const cartItem = cartItems.find((item) => `${item.id}-${item.variant}` === productKey)
      const product = products.find((item) => item.id === cartItem?.id)
      const quantityInCart = cartItems
        .filter((item) => item.id === cartItem?.id)
        .reduce((sum, item) => sum + item.quantity, 0)
      if (product && quantityInCart >= product.inventory) return
    }

    setCartItems((current) =>
      current
        .map((item) => {
          const key = `${item.id}-${item.variant}`
          if (key !== productKey) return item

          const nextQuantity = item.quantity + delta
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null
        })
        .filter(Boolean),
    )
  }

  function startCheckout() {
    setCartOpen(false)
    setCheckoutStatus('idle')
    setCheckoutOpen(true)
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault()
    setCheckoutStatus('processing')

    const paymentResult = await new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          status: 'approved',
          reference: `FS-${Date.now().toString().slice(-8)}`,
          amount: total,
          method: paymentMethod,
        })
      }, 900)
    })

    if (paymentResult.status === 'approved') {
      setOrderReference(paymentResult.reference)
      setCheckoutStatus('success')
      const itemsByVendor = cartItems.reduce((groupedItems, item) => {
        const vendor = products.find((product) => product.id === item.id)?.vendor || item.vendor
        groupedItems[vendor] = [...(groupedItems[vendor] || []), {
          productId: item.id,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
        }]
        return groupedItems
      }, {})
      const customerAddress = deliveryAddress === 'home'
        ? '12 Admiralty Way, Lekki Phase 1, Lagos'
        : deliveryAddress === 'office'
          ? '20 Allen Avenue, Ikeja, Lagos'
          : `${newAddress.street}, ${newAddress.city}, ${newAddress.state}`

      setOrders((current) => [
        ...Object.entries(itemsByVendor).map(([vendor, items], index) => ({
          id: `${paymentResult.reference}-${index + 1}`,
          vendor,
          customer: customer.name.trim(),
          customerEmail: customer.email,
          placedAt: 'Just now',
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          address: customerAddress,
          status: 'new',
        })),
        ...current,
      ])
      setProducts((current) => current.map((product) => {
        const purchasedQuantity = cartItems
          .filter((item) => item.id === product.id)
          .reduce((sum, item) => sum + item.quantity, 0)
        return purchasedQuantity
          ? { ...product, inventory: Math.max(0, product.inventory - purchasedQuantity) }
          : product
      }))
      setCartItems([])
      if (user) {
        void handleCheckoutSuccess()
      }
    }
  }

  function closeCheckout() {
    if (checkoutStatus === 'processing') return
    setCheckoutOpen(false)
    if (checkoutStatus === 'success') setCheckoutStatus('idle')
  }

  async function handleSaveProduct(product) {
    if (!user || !isVendor) return
    await upsertProduct({
      ...product,
      vendorId: user.uid,
      vendor: profile?.storeName || currentVendor,
      updatedAt: new Date(),
    })
  }

  async function handleAdvanceOrder(orderId, nextOrderStatus) {
    if (!user || !isVendor) return
    await updateOrderStatus(orderId, nextOrderStatus)
    setOrders((current) => current.map((order) =>
      order.id === orderId ? { ...order, status: nextOrderStatus } : order,
    ))
  }

  async function handleCheckoutSuccess() {
    if (!user) return

    const vendorOrders = Object.entries(
      cartItems.reduce((groupedItems, item) => {
        const product = products.find((entry) => entry.id === item.id)
        const vendor = product?.vendor || item.vendor
        const vendorId = product?.vendorId || 'vendor-amina'
        if (!groupedItems[vendor]) groupedItems[vendor] = { vendorId, items: [] }
        groupedItems[vendor].items.push({
          productId: item.id,
          name: item.name,
          variant: item.variant,
          quantity: item.quantity,
          price: item.price,
        })
        return groupedItems
      }, {}),
    )

    await Promise.all(vendorOrders.map(async ([vendor, payload], index) => {
      const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const orderPayload = {
        buyerId: user.uid,
        buyerName: customer.name.trim(),
        buyerEmail: customer.email,
        vendorId: payload.vendorId,
        vendor,
        items: payload.items,
        total,
        status: 'new',
        address: deliveryAddress === 'home'
          ? '12 Admiralty Way, Lekki Phase 1, Lagos'
          : deliveryAddress === 'office'
            ? '20 Allen Avenue, Ikeja, Lagos'
            : `${newAddress.street}, ${newAddress.city}, ${newAddress.state}`,
      }

      await createOrderRecord(orderPayload)
      setOrders((current) => [{
        id: `${orderReference || `FS-${Date.now()}`}-${index + 1}`,
        vendor,
        customer: customer.name.trim(),
        customerEmail: customer.email,
        placedAt: 'Just now',
        items: payload.items,
        total,
        address: orderPayload.address,
        status: 'new',
      }, ...current])
    }))
  }

  return (
    <div className="marketplace-shell">
      <header className="market-header">
        <div className="brand brand--market">
          <span className="brand__mark"><ShoppingBag size={18} /></span>
          <span>faster<span className="brand__shop">shop</span></span>
        </div>

        <div className="market-mode-switcher" role="group" aria-label="Choose marketplace mode">
          <button className={mode === 'shop' ? 'market-mode-switcher__button market-mode-switcher__button--active' : 'market-mode-switcher__button'} type="button" aria-pressed={mode === 'shop'} onClick={() => setMode('shop')}>
            <ShoppingBag size={15} /> Shop
          </button>
          <button className={mode === 'vendor' ? 'market-mode-switcher__button market-mode-switcher__button--active' : 'market-mode-switcher__button'} type="button" aria-pressed={mode === 'vendor'} onClick={() => setMode('vendor')}>
            <Store size={15} /> Vendor
          </button>
        </div>

        {mode === 'shop' && (
          <>
            <nav className="market-nav" aria-label="Main navigation">
              <a href="#">Home</a>
              <a href="#">New arrivals</a>
              <a href="#">Vendors</a>
              <a href="#">Markets</a>
            </nav>
            <div className="market-actions">
              <button className="icon-button" aria-label="Search products">
                <Search size={18} />
              </button>
              <button className="icon-button" aria-label="Open menu">
                <Menu size={18} />
              </button>
              <button className="button button--primary button--compact" type="button" onClick={() => setCartOpen(true)}>
                Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </button>
            </div>
          </>
        )}
      </header>

      {mode === 'vendor' ? (
        <VendorDashboard
          products={products}
          setProducts={setProducts}
          orders={orders}
          setOrders={setOrders}
          vendors={vendorOptions}
          currentVendor={currentVendor}
          onVendorChange={setCurrentVendor}
          onSaveProduct={handleSaveProduct}
          onAdvanceOrder={handleAdvanceOrder}
          formatPrice={formatPrice}
        />
      ) : (
      <main className="market-page">
        <section className="hero-card">
          <div className="hero-card__content">
            <span className="section-label">Fresh from Lagos</span>
            <h1>Shop what feels local, made with heart.</h1>
            <p>
              Discover original pieces from makers, studios, and boutique sellers across the city.
            </p>

            <div className="hero-card__actions">
              <button className="button button--primary" type="button">
                Shop now <ArrowRight size={16} />
              </button>
              <button className="button button--secondary" type="button">Explore vendors</button>
            </div>

            <div className="hero-card__meta">
              <div>
                <strong>1.2k+</strong>
                <span>curated items</span>
              </div>
              <div>
                <strong>186</strong>
                <span>local makers</span>
              </div>
            </div>
          </div>

          <div className="spotlight-card">
            <div className="spotlight-card__image" aria-hidden="true" />
            <div className="spotlight-card__body">
              <div className="spotlight-badge">Vendor pick</div>
              <h2>Weekend market edit</h2>
              <div className="spotlight-card__row">
                <span><MapPin size={14} /> Lekki Phase 1</span>
                <span><TrendingUp size={14} /> +23% this week</span>
              </div>
            </div>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label section-label--dark">Featured vendors</span>
              <h2>People worth meeting</h2>
            </div>
            <a href="#">See all</a>
          </div>

          <div className="vendor-row">
            {vendors.map((vendor) => (
              <article key={vendor.name} className={`vendor-card vendor-card--${vendor.accent}`}>
                <div className="vendor-card__avatar" aria-hidden="true">
                  {vendor.name.slice(0, 1)}
                </div>
                <div className="vendor-card__body">
                  <span className="vendor-card__tag">{vendor.tag}</span>
                  <h3>{vendor.name}</h3>
                  <p>{vendor.specialty}</p>
                  <div className="vendor-card__meta">
                    <span><Star size={13} fill="currentColor" /> {vendor.rating}</span>
                    <span><Users size={13} /> 120+ sales</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label section-label--dark">Browse</span>
              <h2>Shop by category</h2>
            </div>
            <a href="#">View all</a>
          </div>

          <div className="category-scroller" aria-label="Product categories">
            {categories.map((category, index) => (
              <button key={category} className={`category-pill ${index === 0 ? 'category-pill--active' : ''}`} type="button">
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <span className="section-label section-label--dark">Trending now</span>
              <h2>Fresh finds for today</h2>
            </div>
            <a href="#">More picks</a>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article
                key={product.id}
                className="product-card"
                onClick={() => openProductModal(product)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openProductModal(product)
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="product-card__image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-card__tag">{product.tag}</span>
                </div>
                <div className="product-card__body">
                  <div className="product-card__meta">
                    <span>{product.vendor}</span>
                    <span>
                      <Star size={13} fill="currentColor" /> {product.rating}
                    </span>
                  </div>
                  <h3>{product.name}</h3>
                  <div className="product-card__footer">
                    <strong>{formatPrice(product.price)}</strong>
                    <button
                      type="button"
                      disabled={product.inventory === 0}
                      onClick={(event) => {
                        event.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      {product.inventory === 0 ? 'Sold out' : 'Add'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      )}

      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close product details" onClick={() => setSelectedProduct(null)}>
              <X size={18} />
            </button>

            <div className="product-modal__image-wrap">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <span className="product-card__tag">{selectedProduct.tag}</span>
            </div>

            <div className="product-modal__body">
              <div className="product-modal__topline">
                <span className="vendor-pill">{selectedProduct.vendorTag}</span>
                <span className="rating-pill"><Star size={12} fill="currentColor" /> {selectedProduct.rating}</span>
              </div>

              <h3>{selectedProduct.name}</h3>
              <div className="product-modal__vendor">
                <span>{selectedProduct.vendor}</span>
                <span>{selectedProduct.shipping}</span>
              </div>

              <p>{selectedProduct.description}</p>

              <div className="option-block">
                <label>Colour / size</label>
                <div className="variant-row">
                  {selectedProduct.variants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      className={selectedVariant === variant ? 'variant-chip variant-chip--active' : 'variant-chip'}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {selectedVariant === variant && <Check size={12} />}
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-modal__meta">
                <div>
                  <Truck size={16} />
                  <span>Fast local dispatch</span>
                </div>
                <div>
                  <ShieldCheck size={16} />
                  <span>Secure checkout</span>
                </div>
              </div>

              <div className="product-modal__footer">
                <div>
                  <small>Total</small>
                  <strong>{formatPrice(selectedProduct.price)}</strong>
                </div>
                <button type="button" className="button button--primary" disabled={selectedProduct.inventory === 0} onClick={() => addToCart(selectedProduct, selectedVariant)}>
                  {selectedProduct.inventory === 0 ? 'Sold out' : 'Add to cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className={`cart-drawer ${cartOpen ? 'cart-drawer--open' : ''}`} aria-label="Shopping cart">
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)} />
        <div className="drawer-panel">
          <div className="drawer-header">
            <div>
              <span className="section-label section-label--dark">Your cart</span>
              <h3>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</h3>
            </div>
            <button className="modal-close" type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={28} />
              <p>Your basket is empty.</p>
            </div>
          ) : (
            <>
              <div className="drawer-items">
                {cartItems.map((item) => {
                  const itemKey = `${item.id}-${item.variant}`

                  return (
                    <div key={itemKey} className="drawer-item">
                      <img src={item.image} alt={item.name} />
                      <div className="drawer-item__body">
                        <div className="drawer-item__topline">
                          <h4>{item.name}</h4>
                          <strong>{formatPrice(item.price * item.quantity)}</strong>
                        </div>
                        <p>{item.vendor}</p>
                        <div className="drawer-item__bottomline">
                          <span>{item.variant}</span>
                          <div className="quantity-stepper">
                            <button type="button" aria-label={`Decrease quantity for ${item.name}`} onClick={() => changeQuantity(itemKey, -1)}>
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" aria-label={`Increase quantity for ${item.name}`} onClick={() => changeQuantity(itemKey, 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="drawer-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong>
                </div>
                <div className="drawer-summary__total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <button type="button" className="button button--primary checkout-button" onClick={startCheckout}>
                Checkout securely
              </button>
            </>
          )}
        </div>
      </aside>

      {checkoutOpen && (
        <div className="checkout-backdrop" onClick={closeCheckout}>
          <section
            className="checkout-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="checkout-header">
              <div>
                <span className="checkout-kicker"><ShieldCheck size={14} /> Secure checkout</span>
                <h2 id="checkout-title">{checkoutStatus === 'success' ? 'Order confirmed' : 'Complete your order'}</h2>
              </div>
              <button className="modal-close" type="button" aria-label="Close checkout" onClick={closeCheckout} disabled={checkoutStatus === 'processing'}>
                <X size={18} />
              </button>
            </header>

            {checkoutStatus === 'success' ? (
              <div className="checkout-success" role="status">
                <span className="checkout-success__icon"><CheckCircle2 size={28} /></span>
                <p className="checkout-success__eyebrow">
                  Demo checkout complete · {paymentMethod === 'delivery' ? 'pay on delivery selected' : 'payment simulated'}
                </p>
                <h3>Thank you, {customer.name.trim().split(/\s+/)[0]}.</h3>
                <p>Your order is being prepared. A confirmation will be sent to {customer.email}.</p>
                <div className="checkout-reference">
                  <span>Order reference</span>
                  <strong>{orderReference}</strong>
                </div>
                <button type="button" className="button button--primary" onClick={closeCheckout}>Continue shopping</button>
              </div>
            ) : (
              <form className="checkout-layout" onSubmit={handleCheckoutSubmit}>
                <div className="checkout-details">
                  <section className="checkout-section">
                    <div className="checkout-section__heading">
                      <span>01</span>
                      <div><h3>Contact details</h3><p>Where should we send your updates?</p></div>
                    </div>
                    <div className="checkout-fields">
                      <label className="checkout-field checkout-field--wide">
                        Full name
                        <input autoComplete="name" name="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Your name" required />
                      </label>
                      <label className="checkout-field">
                        Email address
                        <input autoComplete="email" name="email" type="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} placeholder="you@example.com" required />
                      </label>
                      <label className="checkout-field">
                        Phone number
                        <input autoComplete="tel" name="phone" type="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} placeholder="080 1234 5678" required />
                      </label>
                    </div>
                  </section>

                  <section className="checkout-section">
                    <div className="checkout-section__heading">
                      <span>02</span>
                      <div><h3>Delivery address</h3><p>Choose where your order should arrive.</p></div>
                    </div>
                    <div className="address-options">
                      <label className={`address-option ${deliveryAddress === 'home' ? 'address-option--selected' : ''}`}>
                        <input type="radio" name="deliveryAddress" value="home" checked={deliveryAddress === 'home'} onChange={() => setDeliveryAddress('home')} />
                        <span className="address-option__icon"><MapPin size={17} /></span>
                        <span><strong>Home</strong><small>12 Admiralty Way, Lekki Phase 1, Lagos</small></span>
                      </label>
                      <label className={`address-option ${deliveryAddress === 'office' ? 'address-option--selected' : ''}`}>
                        <input type="radio" name="deliveryAddress" value="office" checked={deliveryAddress === 'office'} onChange={() => setDeliveryAddress('office')} />
                        <span className="address-option__icon"><Building2 size={17} /></span>
                        <span><strong>Office</strong><small>20 Allen Avenue, Ikeja, Lagos</small></span>
                      </label>
                      <label className={`address-option address-option--new ${deliveryAddress === 'new' ? 'address-option--selected' : ''}`}>
                        <input type="radio" name="deliveryAddress" value="new" checked={deliveryAddress === 'new'} onChange={() => setDeliveryAddress('new')} />
                        <span><strong>Use a new address</strong></span>
                      </label>
                    </div>
                    {deliveryAddress === 'new' && (
                      <div className="checkout-fields checkout-fields--address">
                        <label className="checkout-field checkout-field--wide">
                          Street address
                          <input autoComplete="street-address" name="street" value={newAddress.street} onChange={(event) => setNewAddress({ ...newAddress, street: event.target.value })} placeholder="House number and street" required />
                        </label>
                        <label className="checkout-field">
                          City
                          <input autoComplete="address-level2" name="city" value={newAddress.city} onChange={(event) => setNewAddress({ ...newAddress, city: event.target.value })} placeholder="City" required />
                        </label>
                        <label className="checkout-field">
                          State
                          <input autoComplete="address-level1" name="state" value={newAddress.state} onChange={(event) => setNewAddress({ ...newAddress, state: event.target.value })} placeholder="State" required />
                        </label>
                      </div>
                    )}
                  </section>

                  <section className="checkout-section checkout-section--payment">
                    <div className="checkout-section__heading">
                      <span>03</span>
                      <div><h3>Payment method</h3><p>Demo checkout · no real charge will be made.</p></div>
                    </div>
                    <div className="payment-options">
                      <label className={`payment-option ${paymentMethod === 'card' ? 'payment-option--selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <CreditCard size={17} />
                        <span><strong>Card</strong><small>Mock payment gateway</small></span>
                      </label>
                      <label className={`payment-option ${paymentMethod === 'transfer' ? 'payment-option--selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                        <Building2 size={17} />
                        <span><strong>Bank transfer</strong><small>Simulated confirmation</small></span>
                      </label>
                      <label className={`payment-option ${paymentMethod === 'delivery' ? 'payment-option--selected' : ''}`}>
                        <input type="radio" name="paymentMethod" value="delivery" checked={paymentMethod === 'delivery'} onChange={() => setPaymentMethod('delivery')} />
                        <ShoppingBag size={17} />
                        <span><strong>Pay on delivery</strong><small>Simulated order only</small></span>
                      </label>
                    </div>
                  </section>
                </div>

                <aside className="checkout-summary">
                  <div className="checkout-summary__heading">
                    <h3>Order summary</h3>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  </div>
                  <div className="checkout-summary__items">
                    {cartItems.map((item) => (
                      <div className="checkout-summary__item" key={`${item.id}-${item.variant}`}>
                        <img src={item.image} alt="" />
                        <div><strong>{item.name}</strong><span>{item.variant} · Qty {item.quantity}</span></div>
                        <b>{formatPrice(item.price * item.quantity)}</b>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-summary__totals">
                    <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                    <div><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
                    <div className="checkout-summary__total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
                  </div>
                  <button type="submit" className="button button--primary checkout-submit" disabled={checkoutStatus === 'processing'}>
                    {checkoutStatus === 'processing' ? <><LoaderCircle size={17} className="checkout-spinner" /> Processing demo payment</> : <>Place order · {formatPrice(total)} <ArrowRight size={16} /></>}
                  </button>
                  <p className="checkout-demo-note"><ShieldCheck size={14} /> This is a mock gateway. No payment details are collected.</p>
                </aside>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
