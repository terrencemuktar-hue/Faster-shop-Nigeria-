import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [view, setView] = useState('welcome') // 'welcome' | 'login' | 'signup' | 'main'
  const [loading, setLoading] = useState(true)

  // Auth form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('buyer') // 'buyer' | 'vendor'
  const [authError, setAuthError] = useState('')

  // Main app states
  const [activeTab, setActiveTab] = useState('feed') // buyer: feed, search, messages, notifications, profile
  const [products, setProducts] = useState([])
  const [categories] = useState(['All', 'Men', 'Women', 'Shoes', 'Bags', 'Accessories', 'Traditional', 'Kids'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Vendor Form States
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: 'Men', description: '', image_url: '' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
        setView('welcome')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
        setView('main')
      } else if (error) {
        console.error('Error fetching profile:', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setAuthError('')
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Insert into profiles table
      await supabase.from('profiles').insert([
        { id: data.user.id, email, full_name: fullName, role, created_at: new Date() }
      ])
      // Insert welcome notification
      await supabase.from('notifications').insert([
        { user_id: data.user.id, text: 'Welcome to FasterShopNG 🎉', created_at: new Date() }
      ]).catch(() => {}) // Graceful fallback if table doesn't exist yet
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
    setView('welcome')
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!profile) return

    const { error } = await supabase.from('products').insert([
      { ...newProduct, vendor_id: profile.id, created_at: new Date() }
    ])

    if (!error) {
      alert('Product published successfully!')
      setNewProduct({ title: '', price: '', category: 'Men', description: '', image_url: '' })
    } else {
      alert('Error adding product: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
      </div>
    )
  }

  // 1. WELCOME SCREEN
  if (view === 'welcome' && !session) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
        <div className="absolute inset-0 opacity-40 bg-cover bg-center filter blur-sm scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop')` }} />
        
        <div className="relative z-20 text-center max-w-md mx-auto space-y-6">
          <div className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
            <span className="text-3xl font-bold tracking-widest text-amber-400">FS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome to Faster Shop</h1>
          <p className="text-gray-300 text-lg">Nigeria's Premier Fashion Marketplace</p>
          
          <div className="pt-6 space-y-3 w-full">
            <button onClick={() => setView('signup')} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl shadow-lg transition-transform transform active:scale-95">
              Create Account
            </button>
            <button onClick={() => setView('login')} className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-md transition">
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 2. SIGN UP / REGISTER SCREEN
  if (view === 'signup' && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 py-12">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Join Faster Shop</h2>
            <p className="text-gray-400 text-sm mt-1">Create your fashion account</p>
          </div>

          {authError && <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-lg">{authError}</div>}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="Nwezeh Terrence" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="terrence@example.com" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">I want to join as a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('buyer')} className={`py-3 rounded-xl border text-sm font-semibold transition ${role === 'buyer' ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'}`}>Buyer</button>
                <button type="button" onClick={() => setRole('vendor')} className={`py-3 rounded-xl border text-sm font-semibold transition ${role === 'vendor' ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-800 text-gray-300 border-zinc-700'}`}>Vendor</button>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl shadow-lg transition">Sign Up</button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account? <button onClick={() => setView('login')} className="text-amber-400 font-semibold hover:underline">Login</button>
          </p>
        </div>
      </div>
    )
  }

  // 3. LOGIN SCREEN
  if (view === 'login' && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4 py-12">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to your Faster Shop account</p>
          </div>

          {authError && <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-lg">{authError}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="terrence@example.com" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl shadow-lg transition">Login</button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account? <button onClick={() => setView('signup')} className="text-amber-400 font-semibold hover:underline">Sign Up</button>
          </p>
        </div>
      </div>
    )
  }

  // 4. MAIN DASHBOARD (ROLE-BASED: VENDOR or BUYER)
  const isVendor = profile?.role === 'vendor'

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold tracking-wider text-amber-400">FASTER SHOP NG</h1>
        <div className="flex items-center space-x-3">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium uppercase">
            {profile?.role || 'User'}
          </span>
        </div>
      </header>

      {/* Main Content Area based on Role and Active Tab */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {isVendor ? (
          // VENDOR DASHBOARD
          <div>
            {activeTab === 'feed' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Total Products</p>
                    <h3 className="text-3xl font-bold mt-1 text-amber-400">0</h3>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Active Orders</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">0</h3>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <h3 className="text-3xl font-bold mt-1 text-emerald-400">₦0</h3>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold mb-4">Add New Fashion Item</h3>
                  <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-1">Product Title</label>
                      <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white" placeholder="Ankara Silk Blazer" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-1">Price (₦)</label>
                      <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white" placeholder="45000" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                      <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white">
                        {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-gray-400 mb-1">Image URL</label>
                      <input type="url" required value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs uppercase text-gray-400 mb-1">Description</label>
                      <textarea rows="3" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white" placeholder="Handcrafted Nigerian fashion item..." />
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition">Publish Product</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg mx-auto space-y-6">
                <h3 className="text-2xl font-bold">Vendor Profile</h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong className="text-white">Name:</strong> {profile?.full_name}</p>
                  <p><strong className="text-white">Email:</strong> {profile?.email}</p>
                  <p><strong className="text-white">Role:</strong> Vendor Storefront</p>
                </div>
                <button onClick={handleLogout} className="w-full py-3 bg-red-600/20 border border-red-600 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 transition">Logout</button>
              </div>
            )}
          </div>
        ) : (
          // BUYER HOME
          <div>
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Category Chips */}
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-gray-300 border border-zinc-800'}`}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
                    <div className="h-48 bg-zinc-800 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&auto=format&fit=crop')` }} />
                    <div className="p-4 space-y-1">
                      <span className="text-xs text-amber-400 font-semibold">Women</span>
                      <h4 className="font-bold truncate">Ankara Elegance Dress</h4>
                      <p className="text-sm font-extrabold text-white">₦35,000</p>
                    </div>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
                    <div className="h-48 bg-zinc-800 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop')` }} />
                    <div className="p-4 space-y-1">
                      <span className="text-xs text-amber-400 font-semibold">Men</span>
                      <h4 className="font-bold truncate">Modern Agbada Set</h4>
                      <p className="text-sm font-extrabold text-white">₦75,000</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-4">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search dresses, traditional wear, shoes..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500" />
                <p className="text-gray-400 text-sm">Showing categories & search results...</p>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="text-xl font-bold">Messages</h3>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-400">FS</div>
                  <div>
                    <h4 className="font-semibold">Faster Shop Support</h4>
                    <p className="text-xs text-gray-400">Welcome to Faster Shop Nigeria! How can we assist?</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4 max-w-lg mx-auto">
                <h3 className="text-xl font-bold">Notifications</h3>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start space-x-3">
                  <span className="text-amber-400 text-lg">🎉</span>
                  <div>
                    <h4 className="font-semibold text-sm">Welcome to FasterShopNG 🎉</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Your account was successfully created.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-lg mx-auto space-y-6">
                <h3 className="text-2xl font-bold">Buyer Profile</h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong className="text-white">Name:</strong> {profile?.full_name}</p>
                  <p><strong className="text-white">Email:</strong> {profile?.email}</p>
                  <p><strong className="text-white">Role:</strong> Buyer Account</p>
                </div>
                <button onClick={handleLogout} className="w-full py-3 bg-red-600/20 border border-red-600 text-red-400 font-semibold rounded-xl hover:bg-red-600/30 transition">Logout</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 py-3 px-6 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('feed')} className={`text-xs flex flex-col items-center ${activeTab === 'feed' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>Feed</button>
        {!isVendor && <button onClick={() => setActiveTab('search')} className={`text-xs flex flex-col items-center ${activeTab === 'search' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>Search</button>}
        {!isVendor && <button onClick={() => setActiveTab('messages')} className={`text-xs flex flex-col items-center ${activeTab === 'messages' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>Messages</button>}
        {!isVendor && <button onClick={() => setActiveTab('notifications')} className={`text-xs flex flex-col items-center ${activeTab === 'notifications' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>Notifications</button>}
        <button onClick={() => setActiveTab('profile')} className={`text-xs flex flex-col items-center ${activeTab === 'profile' ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>Profile</button>
      </nav>
    </div>
  )
}