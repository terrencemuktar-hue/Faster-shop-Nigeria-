import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [showAuth, setShowAuth] = useState('welcome') // welcome, login, signup

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  // AUTH PAGE - KEEP YOUR COOL DESIGN
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl mb-4">F</div>
        <h1 className="text-2xl font-black tracking-wider">FASTER SHOP</h1>
        <p className="text-xs text-gray-400 mb-16">Nigeria's Premier Vendor-Focused Fashion Marketplace</p>
        
        {showAuth === 'welcome' && (
          <>
            <button onClick={() => setShowAuth('signup')} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-full mb-3">Create Account</button>
            <button onClick={() => setShowAuth('login')} className="w-full bg-[#2a2a2a] text-white py-4 rounded-full">Login</button>
          </>
        )}
        {showAuth !== 'welcome' && <AuthForm type={showAuth} setType={setShowAuth} />}
      </div>
    )
  }

  // MAIN APP - YOUR ORIGINAL DESIGN FROM VIDEO
  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Header */}
      <div className="bg-black text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded">F</div>
        <span className="text-xs font-bold tracking-widest">FASTER<br/>SHOP NIGERIA</span>
        <div className="flex-1 mx-3">
          <input placeholder="Search products, vendors..." className="w-full rounded-full px-4 py-2 text-xs text-black" />
        </div>
        <div className="flex gap-2 text-sm">🔔 🛒</div>
      </div>

      {/* CONTENT */}
      {activeTab === 'home' && <HomeTab />}
      {activeTab === 'shop' && <ShopTab />}
      {activeTab === 'search' && <SearchTab />}
      {activeTab === 'wishlist' && <WishlistTab />}
      {activeTab === 'profile' && <ProfileTab user={user} />}
      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'notifications' && <NotificationsTab />}

      {/* Bottom Nav - EXACT FROM VIDEO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 px-2">
        {[
          { id: 'home', label: 'Home', icon: '⌂' },
          { id: 'shop', label: 'Shop', icon: '◧' },
          { id: 'search', label: 'Search', icon: '⌕' },
          { id: 'wishlist', label: 'Wishlist', icon: '♡' },
          { id: 'profile', label: 'Profile', icon: '☺' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center text-[10px] ${activeTab === t.id ? 'text-black font-bold' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// --- TABS ---
function HomeTab() {
  return (
    <div className="p-3 space-y-4">
      <div className="flex gap-3">
        {['Ranti Lagos', 'Kamsi Crafts', 'Little Threads'].map(n => (
          <div key={n} className="flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-gray-300"></div><span className="text-[9px] mt-1">{n}</span></div>
        ))}
      </div>
      <div>
        <div className="flex justify-between"><h3 className="font-bold text-sm">Featured Drops</h3><span className="text-[10px] text-green-600">See All</span></div>
        <div className="mt-2 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-yellow-100 p-4 relative h-48">
          <span className="bg-black text-white text-[8px] px-2 py-1 rounded-full">UP TO 30% OFF</span>
          <h2 className="font-black text-lg mt-2 leading-tight">Nigeria's Fastest Fashion Market is Back</h2>
          <button className="mt-3 bg-[#39FF14] text-black text-xs font-bold px-4 py-2 rounded-full">Become a Vendor</button>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm mb-2">New Brands</h3>
        <div className="flex gap-2">
          {['Lekki Threads', 'Kamsi Crafts'].map(b => (
            <div key={b} className="bg-white rounded-xl p-2 flex items-center gap-2 flex-1"><div className="w-8 h-8 bg-gray-200 rounded-full"></div><div><p className="text-xs font-bold">{b}</p><span className="text-[9px] bg-black text-white px-2 rounded-full">View Store</span></div></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ShopTab() {
  return (
    <div className="p-4">
      <h2 className="font-bold mb-4">Shop Vendors</h2>
      <div className="grid grid-cols-2 gap-3">
        {['Ranti Lagos', 'Kamsi Crafts', 'Lekki Threads'].map(v => (
          <div key={v} className="bg-white rounded-xl p-4 text-center"><div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div><p className="text-xs font-bold mt-2">{v} ✓</p><span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full">View Store</span></div>
        ))}
      </div>
    </div>
  )
}

function SearchTab() {
  return (
    <div className="p-4">
      <h2 className="font-bold">Explore Categories</h2>
      <p className="text-xs text-gray-500 mb-3">Search for category or items</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['Men','👕'], ['Hoodies','🧥'], ['Caps','🧢'], ['Perfumes','🧴'],
          ['Shoes','👟'], ['Bags','👜'], ['Native','👘'], ['Streetwear','🔥']
        ].map(([name, icon]) => (
          <div key={name} className="bg-white rounded-lg p-3 flex items-center gap-2"><span>{icon}</span><span className="text-xs">{name}</span></div>
        ))}
      </div>
    </div>
  )
}

function WishlistTab() {
  return (
    <div className="p-4">
      <h2 className="font-bold">My Wishlist</h2>
      <div className="bg-white rounded-xl p-3 mt-3 flex gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div><p className="text-xs font-bold">Lekki Oversized Hoodie</p><p className="text-xs">₦22,000</p></div>
      </div>
    </div>
  )
}

function ProfileTab({ user }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xs">TN</div>
        <div><p className="text-sm font-bold">{user?.email?.split('@')[0] || 'Terrence Uche'}</p><p className="text-[10px] text-gray-500">{user?.email}</p></div>
      </div>
      <div className="space-y-3">
        <div className="bg-white rounded-xl p-3 text-xs">My Orders & Deliveries →</div>
        <div className="bg-white rounded-xl p-3 text-xs">Saved Shipping Addresses →</div>
        <div className="bg-white rounded-xl p-3 text-xs">Account Settings →</div>
        <button onClick={async () => { await supabase.auth.signOut(); location.reload() }} className="w-full mt-4 bg-[#39FF14] text-black text-xs font-bold py-3 rounded-full">Become a Vendor - 5 Followers OK →</button>
        <button onClick={async () => { await supabase.auth.signOut(); location.reload() }} className="w-full bg-red-100 text-red-600 text-xs py-2 rounded-full mt-2">Log Out</button>
      </div>
    </div>
  )
}

function MessagesTab() {
  return (
    <div className="p-4">
      <h2 className="font-bold text-sm">Messages</h2>
      <div className="bg-[#39FF14] rounded-xl p-3 text-xs mt-2">Welcome to FasterShop, start shopping today and support Nigerian designers</div>
      <div className="bg-white rounded-xl p-3 mt-2 flex gap-2"><div className="w-8 h-8 bg-gray-300 rounded-full"></div><div><p className="text-xs font-bold">Aura Lagos</p><p className="text-[10px] text-gray-500">Hello, your order is being packed</p></div></div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="p-4">
      <h2 className="font-bold text-sm">Notifications</h2>
      <div className="space-y-2 mt-2">
        <div className="bg-white rounded-xl p-3 text-xs">Your order is out for delivery <span className="float-right text-[9px]">10m ago</span></div>
        <div className="bg-white rounded-xl p-3 text-xs">New vendor Aura Lagos joined Faster Shop <span className="float-right text-[9px]">2h ago</span></div>
      </div>
    </div>
  )
}

function AuthForm({ type, setType }) {
  const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const handle = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        alert('Account created! Check Supabase Auth - now login');
        setType('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      }
    } catch (err) { alert(err.message) } finally { setLoading(false) }
  }
  return (
    <form onSubmit={handle} className="w-full space-y-3 mt-6">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-[#1a1a1a] text-white text-sm" />
      <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-[#1a1a1a] text-white text-sm" />
      <button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading ? 'Loading...' : type === 'signup' ? 'Create Account' : 'Login'}</button>
      <p className="text-xs text-center text-gray-400"> {type === 'signup' ? 'Already have account? ' : 'No account? '}<span onClick={() => setType(type === 'signup' ? 'login' : 'signup')} className="text-[#39FF14] cursor-pointer">{type === 'signup' ? 'Login' : 'Create Account'}</span></p>
    </form>
  )
}