import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

const VENDORS = [
  { name: 'Ranti Lagos', verified: true, img: 'https://i.pravatar.cc/100?img=5' },
  { name: 'Kamsi Crafts', verified: true, img: 'https://i.pravatar.cc/100?img=9' },
  { name: 'Lekki Threads', verified: true, img: 'https://i.pravatar.cc/100?img=12' },
  { name: 'Aura Lagos', verified: true, img: 'https://i.pravatar.cc/100?img=16' },
]

const PRODUCTS = [
  { name: 'Lekki Oversized Hoodie', price: '₦22,000', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300' },
  { name: 'Lagos Street Tee', price: '₦15,000', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [showAuth, setShowAuth] = useState('welcome')
  const [cart, setCart] = useState([PRODUCTS[0]])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-4">F</div>
        <h1 className="text-3xl font-black tracking-widest">FASTER SHOP</h1>
        <p className="text-[11px] text-gray-400 tracking-wide mb-20">Nigeria's Premier Vendor-Focused Fashion Marketplace</p>
        {showAuth === 'welcome' ? (
          <div className="w-full max-w-sm space-y-3">
            <button onClick={() => setShowAuth('signup')} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-full">Create Account</button>
            <button onClick={() => setShowAuth('login')} className="w-full bg-[#222] border border-[#333] text-white py-4 rounded-full">Login</button>
          </div>
        ) : <AuthForm type={showAuth} setType={setShowAuth} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-24 font-sans">
      {/* HEADER - BLACK */}
      <div className="bg-black text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black rounded-lg text-sm">F</div>
          <span className="text-[9px] font-black leading-tight tracking-widest">FASTER<br/>SHOP<br/>NIGERIA</span>
        </div>
        <div className="flex-1 mx-3">
          <input placeholder="Search products, vendors..." className="w-full rounded-full px-4 py-2.5 text-[11px] bg-white text-black placeholder-gray-400 outline-none" />
        </div>
        <button onClick={() => setActiveTab('notifications')} className="text-[18px]">🔔</button>
        <button onClick={() => setActiveTab('cart')} className="relative text-[18px]">🛒{cart.length>0 && <span className="absolute -top-1 -right-1 bg-[#39FF14] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}</button>
      </div>

      {/* CONTENT */}
      {activeTab === 'home' && <Home setTab={setActiveTab} />}
      {activeTab === 'shop' && <Shop />}
      {activeTab === 'search' && <Search />}
      {activeTab === 'wishlist' && <Wishlist />}
      {activeTab === 'profile' && <Profile user={user} setTab={setActiveTab} />}
      {activeTab === 'notifications' && <Notifications setTab={setActiveTab} />}
      {activeTab === 'cart' && <Cart cart={cart} setCart={setCart} />}
      {activeTab === 'messages' && <Messages />}

      {/* BOTTOM NAV - EXACT FROM VIDEO */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2.5 px-1 z-50">
        {[
          { id: 'home', label: 'Home', icon: '⌂' },
          { id: 'shop', label: 'Shop', icon: '◧' },
          { id: 'search', label: 'Search', icon: '⌕' },
          { id: 'wishlist', label: 'Wishlist', icon: '♡' },
          { id: 'profile', label: 'Profile', icon: '☺' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center text-[10px] ${activeTab===t.id ? 'text-black font-bold' : 'text-gray-400'}`}>
            <span className="text-[18px] leading-none mb-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Home({ setTab }){
  return (
    <div className="p-4 space-y-5">
      {/* Stories */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {VENDORS.map(v=>(
          <div key={v.name} className="flex flex-col items-center min-w-[60px]">
            <img src={v.img} className="w-14 h-14 rounded-full border-2 border-[#39FF14] object-cover" />
            <span className="text-[9px] mt-1 text-center leading-tight">{v.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Featured Drops */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-[14px]">Featured Drops</h3>
          <button onClick={()=>setTab('shop')} className="text-[11px] text-green-600 font-bold">See All</button>
        </div>
        <div className="rounded-[20px] overflow-hidden h-56 relative bg-gray-900">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 to-yellow-200/30"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-black text-white text-[8px] px-2.5 py-1 rounded-full font-bold">UP TO 30% OFF</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-black text-[18px] leading-tight text-black drop-shadow-sm">Nigeria's Fastest<br/>Fashion Market is Back</h2>
            <button onClick={()=>setTab('shop')} className="mt-3 bg-[#39FF14] text-black text-[11px] font-black px-5 py-2.5 rounded-full">Become a Vendor</button>
          </div>
        </div>
      </div>

      {/* New Brands */}
      <div>
        <h3 className="font-black text-[14px] mb-2">New Brands</h3>
        <div className="flex gap-3">
          {VENDORS.slice(0,2).map(b=>(
            <div key={b.name} className="bg-white rounded-2xl p-3 flex items-center gap-3 flex-1 shadow-sm">
              <img src={b.img} className="w-10 h-10 rounded-full" />
              <div className="flex-1"><p className="text-[11px] font-bold">{b.name}</p><span className="text-[9px] bg-black text-white px-2.5 py-1 rounded-full mt-1 inline-block">View Store</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Shop(){
  return (
    <div className="p-4">
      <h2 className="font-black text-[16px] mb-4">Shop Vendors</h2>
      <div className="grid grid-cols-2 gap-3">
        {VENDORS.map(v=>(
          <div key={v.name} className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <img src={v.img} className="w-12 h-12 rounded-full mx-auto" />
            <p className="text-[12px] font-bold mt-2">{v.name} ✓</p>
            <span className="text-[10px] bg-gray-100 px-4 py-1.5 rounded-full mt-2 inline-block">View Store</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Search(){
  const cats = [['Men','👕'],['Hoodies','🧥'],['Caps','🧢'],['Perfumes','🧴'],['Shoes','👟'],['Bags','👜'],['Native','👘'],['Streetwear','🔥']]
  return (
    <div className="p-4">
      <h2 className="font-black text-[16px]">Explore Categories</h2>
      <p className="text-[11px] text-gray-500 mb-3">Search for category or items</p>
      <div className="grid grid-cols-2 gap-3">
        {cats.map(([name,icon])=>(
          <div key={name} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <span className="text-xl">{icon}</span><span className="text-[12px] font-bold">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Wishlist(){
  return (
    <div className="p-4">
      <h2 className="font-black">My Wishlist</h2>
      <div className="bg-white rounded-2xl p-3 mt-4 flex gap-3 shadow-sm">
        <img src={PRODUCTS[0].img} className="w-16 h-16 rounded-xl object-cover" />
        <div><p className="text-[12px] font-bold">{PRODUCTS[0].name}</p><p className="text-[11px] mt-1">{PRODUCTS[0].price}</p><span className="text-[10px] bg-black text-white px-3 py-1 rounded-full mt-2 inline-block">Add to Bag</span></div>
      </div>
    </div>
  )
}

function Profile({ user, setTab }){
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
        <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-bold">TU</div>
        <div><p className="text-[13px] font-black">{user.email?.split('@')[0] || 'Terrence Uche'}</p><p className="text-[10px] text-gray-500">{user.email}</p></div>
      </div>
      <button onClick={()=>setTab('messages')} className="w-full bg-white rounded-2xl p-4 text-left text-[12px] font-bold shadow-sm">My Orders & Deliveries →</button>
      <button className="w-full bg-white rounded-2xl p-4 text-left text-[12px] font-bold shadow-sm">Saved Shipping Addresses →</button>
      <button className="w-full bg-white rounded-2xl p-4 text-left text-[12px] font-bold shadow-sm">Account Settings →</button>
      <button onClick={()=>setTab('shop')} className="w-full mt-2 bg-[#39FF14] text-black font-black py-4 rounded-full text-[12px]">Become a Vendor - 5 Followers OK →</button>
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-[#ffeaea] text-red-500 font-bold py-3 rounded-full text-[12px]">Log Out</button>
    </div>
  )
}

function Notifications({ setTab }){
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4"><button onClick={()=>setTab('home')} className="text-xl">←</button><h2 className="font-black">Notifications</h2></div>
      <div className="space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-3"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">📦</div><div><p className="text-[12px] font-bold">Your order is out for delivery</p><p className="text-[10px] text-gray-500">Ranti Lagos • 10m ago</p></div></div>
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-3"><div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">✨</div><div><p className="text-[12px] font-bold">New vendor Aura Lagos joined</p><p className="text-[10px] text-gray-500">Check their drops • 2h ago</p></div></div>
      </div>
    </div>
  )
}

function Cart({ cart }){
  return (
    <div className="p-4">
      <h2 className="font-black">Shopping Bag</h2>
      {cart.map((p,i)=>(
        <div key={i} className="bg-white rounded-2xl p-3 mt-3 flex gap-3 shadow-sm">
          <img src={p.img} className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1"><p className="text-[12px] font-bold">{p.name}</p><p className="text-[11px]">{p.price}</p></div>
        </div>
      ))}
      <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm space-y-2">
        <div className="flex justify-between text-[11px]"><span>Subtotal</span><span>₦22,000</span></div>
        <div className="flex justify-between text-[12px] font-black"><span>Total</span><span>₦22,000</span></div>
      </div>
      <button className="w-full bg-black text-white py-4 rounded-full text-[12px] font-black mt-4">Place Order — ₦22,000</button>
    </div>
  )
}

function Messages(){
  return (
    <div className="p-4">
      <h2 className="font-black mb-4">Messages</h2>
      <div className="bg-[#39FF14] rounded-2xl p-4 text-[12px] font-bold">Welcome to FasterShop, start shopping today and support Nigerian designers 🇳🇬</div>
      <div className="bg-white rounded-2xl p-4 mt-3 flex gap-3 shadow-sm"><img src={VENDORS[3].img} className="w-10 h-10 rounded-full" /><div><p className="text-[12px] font-bold">Aura Lagos</p><p className="text-[11px] text-gray-500">Hello, your order is being packed...</p></div><span className="ml-auto text-[9px] text-gray-400">10m</span></div>
    </div>
  )
}

function AuthForm({ type, setType }) {
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [loading, setLoading] = useState(false);
  const handle = async (e) => { e.preventDefault(); setLoading(true); try { if (type==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Account created! Now login'); setType('login'); } else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error; } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm outline-none" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm outline-none" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-black py-3.5 rounded-full text-sm">{loading?'Loading...':type==='signup'?'Create Account':'Login'}</button><p className="text-xs text-center text-gray-400">{type==='signup'?'Already have account? ':'No account? '}<span onClick={()=>setType(type==='signup'?'login':'signup')} className="text-[#39FF14] cursor-pointer font-bold">{type==='signup'?'Login':'Create Account'}</span></p></form>)
}