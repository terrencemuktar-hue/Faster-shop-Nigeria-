import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [showAuth, setShowAuth] = useState('welcome')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl mb-4">F</div>
        <h1 className="text-2xl font-black tracking-wider">FASTER SHOP</h1>
        <p className="text-xs text-gray-400 mb-16">Nigeria's Premier Fashion Marketplace</p>
        {showAuth === 'welcome' ? (
          <>
            <button onClick={() => setShowAuth('signup')} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-full mb-3">Create Account</button>
            <button onClick={() => setShowAuth('login')} className="w-full bg-[#2a2a2a] text-white py-4 rounded-full">Login</button>
          </>
        ) : <AuthForm type={showAuth} setType={setShowAuth} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="bg-black text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold rounded">F</div>
        <span className="text-[10px] font-bold tracking-widest">FASTER<br/>SHOP</span>
        <div className="flex-1 mx-3"><input placeholder="Search products..." className="w-full rounded-full px-4 py-2 text-xs text-black" /></div>
        <button onClick={() => setActiveTab('notifications')} className="text-lg">🔔</button>
        <button onClick={() => setActiveTab('cart')} className="text-lg">🛒</button>
      </div>

      {activeTab === 'home' && <HomeTab />}
      {activeTab === 'shop' && <ShopTab />}
      {activeTab === 'search' && <SearchTab />}
      {activeTab === 'wishlist' && <WishlistTab />}
      {activeTab === 'profile' && <ProfileTab user={user} setTab={setActiveTab} />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'cart' && <CartTab />}
      {activeTab === 'messages' && <MessagesTab />}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        {[
          { id: 'home', label: 'Home' },
          { id: 'shop', label: 'Shop' },
          { id: 'search', label: 'Search' },
          { id: 'wishlist', label: 'Wishlist' },
          { id: 'profile', label: 'Profile' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`text-[10px] ${activeTab===t.id?'font-bold text-black':'text-gray-400'}`}>{t.label}</button>
        ))}
      </div>
    </div>
  )
}

function HomeTab(){return(<div className="p-3"><div className="bg-white rounded-2xl p-4 h-48 flex flex-col justify-end bg-gradient-to-br from-blue-50 to-yellow-100"><span className="bg-black text-white text-[8px] px-2 py-1 rounded-full w-fit">UP TO 30% OFF</span><h2 className="font-black mt-2">Nigeria's Fastest Fashion Market is Back</h2><button className="mt-2 bg-[#39FF14] text-black text-xs font-bold px-4 py-2 rounded-full w-fit">Become a Vendor</button></div></div>)}
function ShopTab(){return(<div className="p-4"><h2 className="font-bold">Shop Vendors</h2><div className="grid grid-cols-2 gap-3 mt-3">{['Ranti Lagos','Kamsi Crafts','Lekki Threads'].map(v=><div key={v} className="bg-white rounded-xl p-4 text-center"><div className="w-10 h-10 bg-gray-300 rounded-full mx-auto"></div><p className="text-xs font-bold mt-2">{v}</p></div>)}</div></div>)}
function SearchTab(){return(<div className="p-4"><h2 className="font-bold">Explore Categories</h2><div className="grid grid-cols-2 gap-2 mt-3">{['Men','Hoodies','Caps','Perfumes','Shoes','Bags','Native','Streetwear'].map(n=><div key={n} className="bg-white rounded-lg p-3 text-xs">{n}</div>)}</div></div>)}
function WishlistTab(){return(<div className="p-4"><h2 className="font-bold">My Wishlist</h2><div className="bg-white rounded-xl p-3 mt-3 flex gap-3"><div className="w-16 h-16 bg-gray-200 rounded-lg"></div><div><p className="text-xs font-bold">Lekki Hoodie</p><p className="text-xs">₦22,000</p></div></div></div>)}
function ProfileTab({user,setTab}){return(<div className="p-4"><p className="text-sm font-bold">{user.email}</p><div className="mt-4 space-y-2"><button onClick={()=>setTab('messages')} className="w-full bg-white p-3 rounded-xl text-xs text-left">Messages →</button><button onClick={()=>setTab('notifications')} className="w-full bg-white p-3 rounded-xl text-xs text-left">Notifications →</button><button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-xs mt-4">Become a Vendor - 5 Followers OK →</button><button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-100 text-red-600 py-2 rounded-full text-xs mt-2">Log Out</button></div></div>)}
function NotificationsTab(){return(<div className="p-4"><h2 className="font-bold">Notifications</h2><div className="bg-white rounded-xl p-3 text-xs mt-2">Your order is out for delivery — 10m ago</div><div className="bg-white rounded-xl p-3 text-xs mt-2">New vendor Aura Lagos joined — 2h ago</div></div>)}
function CartTab(){return(<div className="p-4"><h2 className="font-bold">Shopping Bag</h2><div className="bg-white rounded-xl p-3 mt-3 flex gap-3"><div className="w-16 h-16 bg-gray-200 rounded-lg"></div><div><p className="text-xs font-bold">Lekki Oversized Hoodie</p><p className="text-xs">₦22,000</p></div></div><button className="w-full bg-black text-white py-3 rounded-full text-xs font-bold mt-4">Place Order — ₦22,000</button></div>)}
function MessagesTab(){return(<div className="p-4"><h2 className="font-bold">Messages</h2><div className="bg-[#39FF14] rounded-xl p-3 text-xs mt-2">Welcome to FasterShop, start shopping today</div></div>)}

function AuthForm({ type, setType }) {
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [loading, setLoading] = useState(false);
  const handle = async (e) => { e.preventDefault(); setLoading(true); try { if (type==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Account created! Now login'); setType('login'); } else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error; } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-[#1a1a1a] text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-[#1a1a1a] text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':type==='signup'?'Create Account':'Login'}</button><p className="text-xs text-center text-gray-400">{type==='signup'?'Already have account? ':'No account? '}<span onClick={()=>setType(type==='signup'?'login':'signup')} className="text-[#39FF14] cursor-pointer">{type==='signup'?'Login':'Create'}</span></p></form>)
}