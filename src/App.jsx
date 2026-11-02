import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const CATEGORIES = [
  { name: 'Men', icon: '👕' }, { name: 'Hoodies', icon: '🧥' },
  { name: 'Caps', icon: '🧢' }, { name: 'Perfumes', icon: '🧴' },
  { name: 'Shoes', icon: '👟' }, { name: 'Bags', icon: '👜' },
  { name: 'Native', icon: '👘' }, { name: 'Streetwear', icon: '🔥' },
  { name: 'Gym Wears', icon: '💪' }, { name: 'Jewelry', icon: '💍' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('home')
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [authMode, setAuthMode] = useState('welcome')

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null))
    supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))
  }, [])

  useEffect(() => { if(user) loadAll() }, [user])

  const loadAll = async () => {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(p)
    const { data: v } = await supabase.from('profiles').select('*').eq('is_vendor', true).order('is_faster_shop',{ascending:false}).order('created_at',{ascending:false})
    setVendors(v||[])
    const { data: prods } = await supabase.from('products').select('*, profiles!products_vendor_id_fkey(vendor_name, is_faster_shop, avatar_url, bio, location)').order('created_at',{ascending:false})
    setProducts(prods||[])
  }

  const fasterShopVendor = vendors.find(v=>v.is_faster_shop) || {
    id: '00000000-0000-0000-0000-000000000001',
    vendor_name: 'FASTER SHOP',
    is_faster_shop: true,
    is_vendor: true,
    bio: 'Official Faster Shop merch & clothes. Nigeria Fastest Fashion Market.',
    location: 'Lagos, Nigeria',
    avatar_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'
  }

  const addToCart = (product) => {
    const isFaster = product.profiles?.is_faster_shop || product.vendor_id===fasterShopVendor.id
    if(!isFaster){
      alert('This vendor sells via chat only. Tap Message to discuss price in Messages.')
      return
    }
    setCart(prev=> [...prev, product])
    alert('Added to cart — Faster Shop only store with cart checkout')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div>
        <h1 className="text-2xl font-black mt-3 tracking-widest">FASTER SHOP</h1>
        <p className="text-[10px] text-zinc-500 mb-16">Nigeria's Premier Vendor-Focused Fashion Marketplace</p>
        {authMode==='welcome' ? (
          <div className="w-full max-w-sm space-y-3">
            <button onClick={()=>setAuthMode('signup')} className="w-full bg-[#39FF14] text-black font-bold py-4 rounded-full">Create Account</button>
            <button onClick={()=>setAuthMode('login')} className="w-full bg-zinc-900 border border-zinc-800 py-4 rounded-full">Login</button>
          </div>
        ) : <AuthForm mode={authMode} setMode={setAuthMode} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-white text-black font-black flex items-center justify-center rounded-lg">F</div>
        <span className="text-[8px] font-black leading-none">FASTER<br/>SHOP<br/>NIGERIA</span>
        <input placeholder="Search vendors..." className="flex-1 mx-3 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('cart')} className="relative text-sm">🛒 {cart.length>0 && <span className="absolute -top-2 -right-2 bg-[#39FF14] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}</button>
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
      </div>

      {tab==='home' && <Home fasterShop={fasterShopVendor} vendors={vendors} products={products} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} onAddCart={addToCart} />}
      {tab==='shop' && <Shop fasterShop={fasterShopVendor} vendors={vendors} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} />}
      {tab==='vendor' && <VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} onBack={()=>setTab('home')} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} onAddCart={addToCart} reload={loadAll} />}
      {tab==='messages' && <MessagesList user={user} onSelect={(v)=>{setSelectedChat(v); setTab('chat')}} />}
      {tab==='chat' && <ChatRoom user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')} />}
      {tab==='cart' && <Cart cart={cart} setCart={setCart} />}
      {tab==='profile' && <Profile user={user} profile={profile} reload={loadAll} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} />}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3">
        <button onClick={()=>setTab('home')} className={`text-[11px] ${tab==='home' ? 'text-white font-black' : 'text-zinc-500'}`}>Home</button>
        <button onClick={()=>setTab('shop')} className={`text-[11px] ${tab==='shop' ? 'text-white font-black' : 'text-zinc-500'}`}>Shop</button>
        <button onClick={()=>setTab('cart')} className={`text-[11px] ${tab==='cart' ? 'text-white font-black' : 'text-zinc-500'}`}>Cart</button>
        <button onClick={()=>setTab('messages')} className={`text-[11px] ${tab==='messages' || tab==='chat' ? 'text-white font-black' : 'text-zinc-500'}`}>Messages</button>
        <button onClick={()=>setTab('profile')} className={`text-[11px] ${tab==='profile' ? 'text-white font-black' : 'text-zinc-500'}`}>Profile</button>
      </div>
    </div>
  )
}

function Home({ fasterShop, vendors, products, onOpenVendor, onDM, onAddCart }){
  const otherVendors = vendors.filter(v=>!v.is_faster_shop)
  return (
    <div className="p-4 space-y-5">
      <div className="flex gap-4 overflow-x-auto pb-1">
        <button onClick={()=>onOpenVendor(fasterShop)} className="flex flex-col items-center min-w-[60px]">
          <img src={fasterShop.avatar_url} className="w-14 h-14 rounded-full border-2 border-[#39FF14] object-cover" alt="" />
          <span className="text-[9px] mt-1 font-black">FASTER</span>
        </button>
        {otherVendors.map(v=>(
          <button key={v.id} onClick={()=>onOpenVendor(v)} className="flex flex-col items-center min-w-[60px]">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-14 h-14 rounded-full border border-zinc-700 object-cover" alt="" />
            <span className="text-[9px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div>
        <h3 className="font-black text-[14px] mb-2">Featured Drops — Faster Shop</h3>
        <div className="rounded-[20px] overflow-hidden h-56 relative bg-zinc-900 border border-[#39FF14]/30">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#39FF14] text-black text-[8px] px-2.5 py-1 rounded-full font-black">OFFICIAL STORE</span>
            <span className="bg-white text-black text-[8px] px-2.5 py-1 rounded-full font-black">CART ONLY</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-black text-[18px] leading-tight">Nigeria&apos;s Fastest<br/>Fashion Market is Back</h2>
            <p className="text-[10px] text-zinc-300 mt-1">Faster Shop merch — only store with cart checkout</p>
            <button onClick={()=>onOpenVendor(fasterShop)} className="mt-3 bg-[#39FF14] text-black text-[11px] font-black px-5 py-2.5 rounded-full">Shop Faster Shop →</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-black text-[14px] mb-2">New Brands</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          <button onClick={()=>onOpenVendor(fasterShop)} className="bg-[#39FF14] border border-[#39FF14] rounded-2xl p-3 flex items-center gap-3 min-w-[200px] text-left">
            <img src={fasterShop.avatar_url} className="w-10 h-10 rounded-full" alt="" />
            <div><p className="text-[11px] font-black text-black">FASTER SHOP</p><span className="text-[9px] bg-black text-[#39FF14] px-2.5 py-1 rounded-full mt-1 inline-block font-bold">Official — Cart</span></div>
          </button>
          {otherVendors.map(b=>(
            <button key={b.id} onClick={()=>onOpenVendor(b)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 min-w-[180px] text-left">
              <img src={b.avatar_url || `https://i.pravatar.cc/100?u=${b.id}`} className="w-10 h-10 rounded-full" alt="" />
              <div><p className="text-[11px] font-bold">{b.vendor_name}</p><span className="text-[9px] bg-zinc-800 px-2.5 py-1 rounded-full mt-1 inline-block">Chat to buy</span></div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {products.map(prod=>{
          const isFaster = prod.profiles?.is_faster_shop || prod.vendor_id===fasterShop.id
          return (
            <div key={prod.id} className={`border rounded-2xl overflow-hidden ${isFaster ? 'bg-zinc-900 border-[#39FF14]/20' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="p-3 flex items-center gap-2">
                <button onClick={()=>onOpenVendor({id: prod.vendor_id, ...prod.profiles})} className="flex items-center gap-2">
                  <img src={prod.profiles?.avatar_url || `https://i.pravatar.cc/100?u=${prod.vendor_id}`} className="w-8 h-8 rounded-full" alt="" />
                  <p className="text-[11px] font-bold">{prod.profiles?.vendor_name} {isFaster && <span className="text-[#39FF14] text-[8px]">● CART</span>}</p>
                </button>
                <div className="ml-auto flex gap-2">
                  {isFaster && <button onClick={()=>onAddCart(prod)} className="bg-[#39FF14] text-black text-[9px] font-black px-3 py-1.5 rounded-full">Add to Cart</button>}
                  <button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="bg-white text-black text-[9px] font-bold px-3 py-1.5 rounded-full">Message</button>
                </div>
              </div>
              <img src={prod.images?.[0]} className="w-full h-64 object-cover" alt="" />
              <div className="p-3"><p className="text-[11px] font-bold">{prod.title} - {prod.price}</p><p className="text-[9px] text-zinc-500 mt-1">{isFaster ? 'Pay in app via cart' : 'Chat vendor in Messages to buy'}</p></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Cart({ cart, setCart }){
  const total = cart.length * 25000
  return (
    <div className="p-4">
      <h2 className="font-black">Cart — Faster Shop Only</h2>
      <p className="text-[10px] text-zinc-500 mt-1">Only Faster Shop products use cart. Other vendors = chat in Messages</p>
      {cart.length===0 ? <p className="text-[11px] text-zinc-500 mt-6 text-center">Cart empty. Add from Faster Shop official store.</p> : (
        <>
          <div className="mt-4 space-y-2">
            {cart.map((p,i)=>(
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex gap-3">
                <img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
                <div className="flex-1"><p className="text-[11px] font-bold">{p.title}</p><p className="text-[10px] text-zinc-400">{p.price}</p></div>
                <button onClick={()=>setCart(cart.filter((_,idx)=>idx!==i))} className="text-[10px] text-red-400">Remove</button>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white text-black rounded-2xl p-4">
            <p className="text-[11px] font-bold">Total: ₦{total.toLocaleString()}</p>
            <button onClick={()=>alert('Checkout — integrate Paystack here for Faster Shop only')} className="w-full mt-3 bg-black text-white font-black py-3 rounded-full text-[11px]">Checkout — Pay for Faster Shop</button>
          </div>
        </>
      )}
    </div>
  )
}

function Shop({ fasterShop, vendors, onOpenVendor }){
  return (
    <div className="p-4">
      <button onClick={()=>onOpenVendor(fasterShop)} className="w-full bg-[#39FF14] rounded-2xl p-4 flex items-center gap-3 text-left mb-4">
        <img src={fasterShop.avatar_url} className="w-12 h-12 rounded-full" alt="" />
        <div><p className="text-[13px] font-black text-black">FASTER SHOP — Official</p><p className="text-[10px] text-black/70">Only store with cart checkout</p></div>
      </button>
      <h2 className="font-black text-[16px]">Shop Categories</h2>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {CATEGORIES.map(cat=>(
          <div key={cat.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-3">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-[13px] font-bold">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function VendorProfile({ vendor, currentUser, products, onBack, onDM, onAddCart, reload }){
  const [followers, setFollowers] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [bio, setBio] = useState(vendor?.bio||'')
  const [name, setName] = useState(vendor?.vendor_name||'')
  const [location, setLocation] = useState(vendor?.location||'')

  useEffect(()=>{
    if(!vendor) return
    setBio(vendor.bio||''); setName(vendor.vendor_name||''); setLocation(vendor.location||'')
    const load = async () => {
      const { count } = await supabase.from('vendor_followers').select('*', {count:'exact', head:true}).eq('vendor_id', vendor.id)
      const { data } = await supabase.from('vendor_followers').select('*').eq('vendor_id', vendor.id).eq('follower_id', currentUser.id).maybeSingle()
      setFollowers(count||0); setIsFollowing(!!data)
    }
    load()
  },[vendor, currentUser.id])

  const toggleFollow = async () => {
    if(isFollowing){ await supabase.from('vendor_followers').delete().eq('vendor_id', vendor.id).eq('follower_id', currentUser.id); setIsFollowing(false); setFollowers(c=>c-1) }
    else { await supabase.from('vendor_followers').insert({ vendor_id: vendor.id, follower_id: currentUser.id }); setIsFollowing(true); setFollowers(c=>c+1) }
  }

  const saveEdit = async () => {
    const { error } = await supabase.from('profiles').update({ vendor_name: name, bio, location }).eq('id', vendor.id)
    if(error) alert(error.message); else { alert('Profile saved'); setEditMode(false); reload() }
  }

  if(!vendor) return null
  const isOwn = currentUser.id === vendor.id
  const isFaster = vendor.is_faster_shop

  return (
    <div>
      <div className="p-4 flex items-center gap-3 border-b border-zinc-900"><button onClick={onBack}>Back</button><p className="font-black">{vendor.vendor_name} {isFaster && <span className="bg-[#39FF14] text-black text-[8px] px-2 py-1 rounded-full ml-2">OFFICIAL</span>}</p></div>
      <div className="p-4">
        <div className="flex gap-6 items-center">
          <img src={vendor.avatar_url || `https://i.pravatar.cc/150?u=${vendor.id}`} className="w-20 h-20 rounded-full" alt="" />
          <div className="flex flex-1 justify-around text-center">
            <div><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div>
            <div><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div>
            <div><p className="font-black">0</p><p className="text-[10px] text-zinc-500">Following</p></div>
          </div>
        </div>
        <div className="mt-4"><p className="text-[13px] font-bold">{vendor.vendor_name}</p><p className="text-[11px] text-zinc-400 mt-1">{vendor.bio}</p><p className="text-[10px] text-zinc-500">{vendor.location}</p><p className="text-[9px] text-[#39FF14] mt-2">{isFaster ? 'Cart checkout enabled — only store with in-app payment' : 'Chat in Messages to buy'}</p></div>
        <div className="flex gap-2 mt-4">
          {isOwn ? <button onClick={()=>setEditMode(!editMode)} className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold">{editMode ? 'Cancel' : 'Edit Profile'}</button> :
          <><button onClick={toggleFollow} className={`flex-1 py-2 rounded-lg text-[11px] font-bold ${isFollowing ? 'bg-zinc-900 border border-zinc-800' : 'bg-white text-black'}`}>{isFollowing ? 'Following' : 'Follow'}</button><button onClick={()=>onDM(vendor,null)} className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold">Message</button></>}
        </div>
        {editMode && isOwn && (
          <div className="mt-4 space-y-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Store Name" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio about store" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-2 text-[11px] h-20" />
            <button onClick={saveEdit} className="w-full bg-[#39FF14] text-black font-bold py-2 rounded-full text-[11px]">Save Bio</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-0.5 border-t border-zinc-900">
        {products.map(p=>(
          <button key={p.id} onClick={()=> isFaster ? onAddCart(p) : onDM(vendor,p)} className="aspect-square bg-zinc-900 overflow-hidden relative">
            <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
            {isFaster && <span className="absolute bottom-1 right-1 bg-[#39FF14] text-black text-[7px] px-1.5 py-0.5 rounded-full font-black">CART</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessagesList({ user, onSelect }){
  const [convos, setConvos] = useState([])
  useEffect(()=>{
    const load = async () => {
      const { data: conv } = await supabase.from('conversations').select('*').or(`buyer_id.eq.${user.id},vendor_id.eq.${user.id}`).order('created_at',{ascending:false})
      if(!conv || conv.length===0) return
      const ids = conv.map(c=> c.buyer_id===user.id ? c.vendor_id : c.buyer_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
      const map={}; profiles?.forEach(p=>{ map[p.id]=p })
      setConvos(conv.map(c=>({ ...c, other: map[c.buyer_id===user.id ? c.vendor_id : c.buyer_id] })))
    }
    load()
  },[user.id])
  return (
    <div className="p-4">
      <h2 className="font-black mb-1">Messages</h2>
      <p className="text-[10px] text-zinc-500 mb-4">Chat vendors to buy. Faster Shop uses cart, not chat.</p>
      {convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats yet. Open vendor IG profile and tap Message.</p> : convos.map(c=>(
        <button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left">
          <img src={c.other?.avatar_url || `https://i.pravatar.cc/100?u=${c.other?.id}`} className="w-10 h-10 rounded-full" alt="" />
          <div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to chat</p></div>
        </button>
      ))}
    </div>
  )
}

function ChatRoom({ user, vendor, product, onBack }){
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [convId, setConvId] = useState(null)
  const bottomRef = useRef()
  useEffect(()=>{
    const init = async () => {
      let { data: conv } = await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).maybeSingle()
      if(!conv){ const { data: newConv } = await supabase.from('conversations').insert({ buyer_id: user.id, vendor_id: vendor.id }).select().single(); conv=newConv }
      setConvId(conv.id)
      const { data: m } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at')
      setMsgs(m||[])
      if(product && (m||[]).length===0){ await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: user.id, text: `Hi, interested in ${product.title} - ${product.price}` }) }
    }
    init()
  },[user.id, vendor.id, product])
  useEffect(()=>{ if(!convId) return; const ch = supabase.channel(`chat-${convId}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${convId}` }, (p)=>setMsgs(prev=>[...prev,p.new])).subscribe(); return ()=>supabase.removeChannel(ch) },[convId])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])
  const send = async () => { if(!text.trim() || !convId) return; await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, text }); setText('') }
  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-3"><button onClick={onBack}>Back</button><img src={vendor?.avatar_url || `https://i.pravatar.cc/100?u=${vendor?.id}`} className="w-8 h-8 rounded-full" alt="" /><div><p className="text-[12px] font-bold">{vendor?.vendor_name}</p>{product && <p className="text-[8px] text-zinc-500">About: {product.title}</p>}</div></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">{msgs.map(m=><div key={m.id} className={`max-w-[75%] p-3 rounded-2xl text-[11px] ${m.sender_id===user.id ? 'ml-auto bg-[#39FF14] text-black' : 'bg-zinc-900 border border-zinc-800'}`}>{m.text}</div>)}<div ref={bottomRef}></div></div>
      <div className="p-3 border-t border-zinc-900 flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${vendor?.vendor_name}...`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px] outline-none" onKeyDown={e=>e.key==='Enter' && send()} /><button onClick={send} className="bg-white text-black font-bold px-5 rounded-full text-[11px]">Send</button></div>
    </div>
  )
}

function Profile({ user, profile, reload, onOpenVendor }){
  const [view, setView] = useState('main')
  const [form, setForm] = useState({ vendor_name:'', location:'', bio:'' })
  const [productForm, setProductForm] = useState({ title:'', description:'', price:'', category:'Shoes' })
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(()=>{ if(profile){ setForm({ vendor_name: profile.vendor_name||'', location: profile.location||'', bio: profile.bio||'' }) } },[profile])

  const becomeVendor = async (isFaster=false) => {
    const { error } = await supabase.from('profiles').upsert({ id:user.id, email:user.email, vendor_name: form.vendor_name || user.email.split('@')[0], is_vendor:true, is_faster_shop:isFaster, location: form.location, bio: form.bio })
    if(error) alert(error.message); else { alert(isFaster ? 'Faster Shop Official Store set!' : 'Vendor saved'); reload(); setView('main') }
  }

  const uploadProduct = async () => {
    if(!productForm.title || files.length===0) return alert('Add title and select images (up to 10)')
    setUploading(true); setStatus(`Uploading ${files.length} pics...`)
    const urls=[]
    for(let i=0;i<Math.min(files.length,10);i++){
      const f = files[i]
      const name=`${user.id}/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
      setStatus(`Uploading ${i+1}/${Math.min(files.length,10)}...`)
      const { error } = await supabase.storage.from('product-images').upload(name, f, { upsert:true, contentType: f.type })
      if(error){ console.log(error); continue }
      const { data } = supabase.storage.from('product-images').getPublicUrl(name)
      urls.push(data.publicUrl)
    }
    if(urls.length===0){ setUploading(false); setStatus(''); return alert('Upload failed — check bucket policies but you already fixed it, retry') }
    const { error } = await supabase.from('products').insert({ vendor_id: user.id, title: productForm.title, description: productForm.description, price: productForm.price || '₦25000', category: productForm.category, images: urls })
    setUploading(false); setStatus('')
    if(error) alert(error.message); else { alert(`Success! ${urls.length} pictures uploaded`); setFiles([]); setProductForm({ title:'', description:'', price:'', category:'Shoes' }); reload(); setView('main') }
  }

  if(view!=='main'){
    return (
      <div className="p-4">
        <button onClick={()=>setView('main')} className="mb-4">Back</button>
        {view==='upload' && (
          <div><h2 className="font-black">Upload — Faster Shop Fix</h2><p className="text-[10px] text-zinc-500 mt-1">{profile?.is_faster_shop ? 'Your products will have Add to Cart' : 'Your products will be Message to buy'}</p>
            <div className="space-y-3 mt-4">
              <input placeholder="Title e.g Yellow Cargo Pants" value={productForm.title} onChange={e=>setProductForm({...productForm, title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" />
              <textarea placeholder="Description" value={productForm.description} onChange={e=>setProductForm({...productForm, description:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" />
              <div className="flex gap-2"><input placeholder="Price e.g ₦25,000" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select></div>
              <input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files||[]))} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl" />
              <p className="text-[10px] text-[#39FF14]">{files.length} selected — max 10 {status && `— ${status}`}</p>
              <button onClick={uploadProduct} disabled={uploading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">{uploading ? status : `Upload ${files.length} Pictures`}</button>
            </div>
          </div>
        )}
        {view==='become' && <div><h2 className="font-black">Become Vendor — Faster Shop</h2><div className="space-y-3 mt-4"><input placeholder="Brand Name e.g FASTER SHOP" value={form.vendor_name} onChange={e=>setForm({...form, vendor_name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Bio about store" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><button onClick={()=>becomeVendor(false)} className="w-full bg-zinc-900 border border-zinc-800 font-bold py-3 rounded-full text-[11px]">Save as Normal Vendor (Chat only)</button><button onClick={()=>becomeVendor(true)} className="w-full bg-[#39FF14] text-black font-black py-3 rounded-full text-[11px]">Save as FASTER SHOP — Official Cart Store</button></div></div>}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <button onClick={()=>onOpenVendor(profile)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]} {profile?.is_faster_shop && <span className="bg-[#39FF14] text-black text-[7px] px-2 py-1 rounded-full ml-1">OFFICIAL</span>}</p><p className="text-[10px] text-zinc-500">Tap for IG profile — edit bio</p></div>
      </button>
      <button onClick={()=>setView('upload')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Product — Fix: 10 pics now works →</button>
      <button onClick={()=>setView('become')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">{profile?.is_faster_shop ? 'You are Faster Shop — Edit Bio' : 'Become Vendor / Become Faster Shop Store →'}</button>
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    </div>
  )
}

function AuthForm({ mode, setMode }){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [loading,setLoading]=useState(false)
  const handle=async(e)=>{e.preventDefault(); setLoading(true); try{ if(mode==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Created! Login'); setMode('login')} else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':mode==='signup'?'Create':'Login'}</button></form>)
}