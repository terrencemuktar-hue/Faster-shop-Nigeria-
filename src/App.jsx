import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const CATEGORIES = [
  { name: 'All', icon: '🛍️' }, { name: 'Men', icon: '👕' }, { name: 'Hoodies', icon: '🧥' },
  { name: 'Caps', icon: '🧢' }, { name: 'Perfumes', icon: '🧴' },
  { name: 'Shoes', icon: '👟' }, { name: 'Bags', icon: '👜' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('home')
  const [vendors, setVendors] = useState([])
  const [fasterShop, setFasterShop] = useState(null)
  const [products, setProducts] = useState([])
  const [stories, setStories] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [authMode, setAuthMode] = useState('welcome')
  const [activeStory, setActiveStory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null))
    supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))
  }, [])
  useEffect(() => { if(user) loadAll() }, [user])

  const loadAll = async () => {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(p)
    const { data: fs } = await supabase.from('profiles').select('*').eq('is_faster_shop', true).maybeSingle()
    setFasterShop(fs||null)
    const { data: v } = await supabase.from('profiles').select('*').eq('is_vendor', true).eq('is_faster_shop', false).order('created_at',{ascending:false})
    setVendors(v||[])
    const { data: prods } = await supabase.from('products').select('*, profiles!products_vendor_id_fkey(vendor_name, is_faster_shop, avatar_url)').order('created_at',{ascending:false})
    setProducts(prods||[])
    const { data: s } = await supabase.from('stories').select('*, profiles!stories_vendor_id_fkey(vendor_name, avatar_url)').gt('expires_at', new Date().toISOString()).order('created_at',{ascending:false})
    setStories(s||[])
  }

  const addToCart = (product) => {
    if(!product.profiles?.is_faster_shop){ alert('This vendor sells via chat only. Tap Message.'); return }
    setCart(prev=> [...prev, product]); alert('Added to cart')
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

  const filteredProducts = selectedCategory==='All' ? products : products.filter(p=>p.category===selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-900 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-white text-black font-black flex items-center justify-center rounded-lg">F</div>
        <span className="text-[8px] font-black leading-none">FASTER<br/>SHOP<br/>NIGERIA</span>
        <input placeholder="Search vendors..." className="flex-1 mx-3 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('cart')} className="relative text-sm">🛒 {cart.length>0 && <span className="absolute -top-2 -right-2 bg-[#39FF14] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.length}</span>}</button>
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
      </div>

      {activeStory && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="p-4 flex items-center gap-3"><img src={activeStory.profiles?.avatar_url} className="w-8 h-8 rounded-full" alt="" /><p className="text-[11px] font-bold">{activeStory.profiles?.vendor_name}</p><button onClick={()=>setActiveStory(null)} className="ml-auto">✕</button></div>
          <img src={activeStory.image_url} className="flex-1 object-contain" alt="" />
        </div>
      )}

      {tab==='home' && <Home fasterShop={fasterShop} vendors={vendors} products={filteredProducts} stories={stories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} onAddCart={addToCart} onStoryClick={setActiveStory} />}
      {tab==='shop' && <Shop fasterShop={fasterShop} products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} onAddCart={addToCart} />}
      {tab==='vendor' && <VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} stories={stories.filter(s=>s.vendor_id===selectedVendor?.id)} onBack={()=>setTab('home')} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} onAddCart={addToCart} reload={loadAll} onStoryClick={setActiveStory} />}
      {tab==='messages' && <MessagesList user={user} onSelect={(v)=>{setSelectedChat(v); setTab('chat')}} />}
      {tab==='chat' && <ChatRoom user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')} />}
      {tab==='cart' && <Cart cart={cart} setCart={setCart} />}
      {tab==='profile' && <Profile user={user} profile={profile} fasterShop={fasterShop} reload={loadAll} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} />}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3">
        <button onClick={()=>setTab('home')} className={`text-[11px] ${tab==='home' ? 'text-white font-black' : 'text-zinc-500'}`}>Home</button>
        <button onClick={()=>setTab('shop')} className={`text-[11px] ${tab==='shop' ? 'text-white font-black' : 'text-zinc-500'}`}>Shop</button>
        <button onClick={()=>setTab('cart')} className={`text-[11px] ${tab==='cart' ? 'text-white font-black' : 'text-zinc-500'}`}>Cart</button>
        <button onClick={()=>setTab('messages')} className={`text-[11px] ${tab==='messages' ? 'text-white font-black' : 'text-zinc-500'}`}>Messages</button>
        <button onClick={()=>setTab('profile')} className={`text-[11px] ${tab==='profile' ? 'text-white font-black' : 'text-zinc-500'}`}>Profile</button>
      </div>
    </div>
  )
}

function Home({ fasterShop, vendors, products, stories, selectedCategory, setSelectedCategory, onOpenVendor, onDM, onAddCart, onStoryClick }){
  const storyMap = {}; stories.forEach(s=>{ storyMap[s.vendor_id]=s })
  return (
    <div className="p-4 space-y-5">
      <div className="flex gap-4 overflow-x-auto pb-1">
        {fasterShop && (
          <button onClick={()=> storyMap[fasterShop.id] ? onStoryClick(storyMap[fasterShop.id]) : onOpenVendor(fasterShop)} className="flex flex-col items-center min-w-[60px]">
            <div className={`w-14 h-14 rounded-full p-[2px] ${storyMap[fasterShop.id] ? 'bg-gradient-to-tr from-[#39FF14] to-yellow-400' : 'bg-[#39FF14]'}`}><img src={fasterShop.avatar_url || `https://i.pravatar.cc/100?u=${fasterShop.id}`} className="w-full h-full rounded-full border-2 border-black object-cover" alt="" /></div>
            <span className="text-[9px] mt-1 font-black">FASTER</span>
          </button>
        )}
        {vendors.map(v=>(
          <button key={v.id} onClick={()=> storyMap[v.id] ? onStoryClick(storyMap[v.id]) : onOpenVendor(v)} className="flex flex-col items-center min-w-[60px]">
            <div className={`w-14 h-14 rounded-full p-[2px] ${storyMap[v.id] ? 'bg-gradient-to-tr from-pink-500 to-yellow-400' : 'bg-zinc-700'}`}><img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-full h-full rounded-full border-2 border-black object-cover" alt="" /></div>
            <span className="text-[9px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-[20px] overflow-hidden h-56 relative bg-zinc-900 border border-[#39FF14]/30">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute top-4 left-4"><span className="bg-[#39FF14] text-black text-[8px] px-2.5 py-1 rounded-full font-black">OFFICIAL STORE — ALWAYS HERE</span></div>
        <div className="absolute bottom-4 left-4 right-4"><h2 className="font-black text-[18px] leading-tight">Nigeria&apos;s Fastest<br/>Fashion Market is Back</h2>{fasterShop && <button onClick={()=>onOpenVendor(fasterShop)} className="mt-3 bg-[#39FF14] text-black text-[11px] font-black px-5 py-2.5 rounded-full">Shop Faster Shop →</button>}</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat=>(
          <button key={cat.name} onClick={()=>setSelectedCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold border ${selectedCategory===cat.name ? 'bg-[#39FF14] text-black border-[#39FF14]' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}><span>{cat.icon}</span>{cat.name}</button>
        ))}
      </div>

      <div className="space-y-3">
        {products.length===0 ? <p className="text-[11px] text-zinc-600 text-center py-10">No posts in {selectedCategory}. Upload in Profile → shows in IG profile + Home + Categories</p> : products.map(prod=>{
          const isFaster = prod.profiles?.is_faster_shop
          return (
            <div key={prod.id} className={`border rounded-2xl overflow-hidden ${isFaster ? 'bg-zinc-900 border-[#39FF14]/20' : 'bg-zinc-900 border-zinc-800'}`}>
              <div className="p-3 flex items-center gap-2">
                <button onClick={()=>onOpenVendor({id: prod.vendor_id, ...prod.profiles})} className="flex items-center gap-2"><img src={prod.profiles?.avatar_url} className="w-8 h-8 rounded-full" alt="" /><p className="text-[11px] font-bold">{prod.profiles?.vendor_name} {isFaster && <span className="text-[#39FF14] text-[8px]">● OFFICIAL</span>}</p></button>
                <div className="ml-auto flex gap-2">{isFaster && <button onClick={()=>onAddCart(prod)} className="bg-[#39FF14] text-black text-[9px] font-black px-3 py-1.5 rounded-full">Add to Cart</button>}<button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="bg-white text-black text-[9px] font-bold px-3 py-1.5 rounded-full">Message</button></div>
              </div>
              <img src={prod.images?.[0]} className="w-full h-64 object-cover" alt="" />
              <div className="p-3"><p className="text-[11px] font-bold">{prod.title || prod.name} - {prod.price}</p><p className="text-[9px] text-zinc-500 mt-1">{prod.category} • {isFaster ? 'Cart checkout' : 'Chat vendor'}</p></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Shop({ fasterShop, products, selectedCategory, setSelectedCategory, onOpenVendor, onDM, onAddCart }){
  const filtered = selectedCategory==='All' ? products : products.filter(p=>p.category===selectedCategory)
  return (
    <div className="p-4">
      {fasterShop && <button onClick={()=>onOpenVendor(fasterShop)} className="w-full bg-[#39FF14] rounded-2xl p-4 flex items-center gap-3 text-left mb-4"><img src={fasterShop.avatar_url} className="w-12 h-12 rounded-full" alt="" /><div><p className="text-[13px] font-black text-black">{fasterShop.vendor_name} — Official</p><p className="text-[10px] text-black/70">Only you can edit — always visible</p></div></button>}
      <div className="flex gap-2 overflow-x-auto pb-3">
        {CATEGORIES.map(cat=>(
          <button key={cat.name} onClick={()=>setSelectedCategory(cat.name)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold border ${selectedCategory===cat.name ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}><span>{cat.icon}</span>{cat.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(p=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <img src={p.images?.[0]} className="w-full h-32 object-cover" alt="" />
            <div className="p-2"><p className="text-[10px] font-bold truncate">{p.title || p.name}</p><p className="text-[9px] text-zinc-400">{p.price} • {p.category}</p><div className="flex gap-1 mt-2">{p.profiles?.is_faster_shop && <button onClick={()=>onAddCart(p)} className="flex-1 bg-[#39FF14] text-black text-[8px] font-black py-1 rounded-full">Cart</button>}<button onClick={()=>onDM({id:p.vendor_id, vendor_name:p.profiles?.vendor_name}, p)} className="flex-1 bg-white text-black text-[8px] font-bold py-1 rounded-full">Message</button></div></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cart({ cart, setCart }){ return (<div className="p-4"><h2 className="font-black">Cart — Faster Shop Only</h2>{cart.length===0 ? <p className="text-[11px] text-zinc-500 mt-6 text-center">Cart empty</p> : cart.map((p,i)=><div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex gap-3 mt-2"><img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" /><div className="flex-1"><p className="text-[11px] font-bold">{p.title || p.name}</p><p className="text-[10px]">{p.price}</p></div><button onClick={()=>setCart(cart.filter((_,idx)=>idx!==i))} className="text-[10px] text-red-400">Remove</button></div>)}</div>) }

function VendorProfile({ vendor, currentUser, products, stories, onBack, onDM, onAddCart, reload, onStoryClick }){
  const [followers, setFollowers] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [bio, setBio] = useState(vendor?.bio||'')
  const [name, setName] = useState(vendor?.vendor_name||'')
  const [location, setLocation] = useState(vendor?.location||'')
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)

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
    if(currentUser.id!==vendor.id){ alert('Only owner can edit Faster Shop — only your email/password'); return }
    setSaving(true)
    let avatarUrl = vendor.avatar_url
    if(avatarFile){
      const fname=`${vendor.id}/avatar-${Date.now()}-${avatarFile.name}`
      const { error } = await supabase.storage.from('product-images').upload(fname, avatarFile, { upsert:true })
      if(!error){ const { data } = supabase.storage.from('product-images').getPublicUrl(fname); avatarUrl=data.publicUrl }
    }
    const { error } = await supabase.from('profiles').update({ vendor_name: name, bio, location, avatar_url: avatarUrl }).eq('id', vendor.id)
    setSaving(false)
    if(error) alert(error.message); else { alert('Profile saved — only you can edit'); setEditMode(false); reload() }
  }

  if(!vendor) return null
  const isOwn = currentUser.id === vendor.id
  const isFaster = vendor.is_faster_shop
  const hasStory = stories.length>0

  return (
    <div>
      <div className="p-4 flex items-center gap-3 border-b border-zinc-900"><button onClick={onBack}>Back</button><p className="font-black">{vendor.vendor_name} {isFaster && <span className="bg-[#39FF14] text-black text-[8px] px-2 py-1 rounded-full ml-2">{isOwn ? 'OFFICIAL — YOU ONLY' : 'OFFICIAL'}</span>}</p></div>
      <div className="p-4">
        <div className="flex gap-6 items-center">
          <button onClick={()=> hasStory && onStoryClick(stories[0])} className={`w-20 h-20 rounded-full p-[2px] ${hasStory ? 'bg-gradient-to-tr from-[#39FF14] to-yellow-400' : 'bg-zinc-700'}`}><img src={vendor.avatar_url || `https://i.pravatar.cc/150?u=${vendor.id}`} className="w-full h-full rounded-full border-2 border-black object-cover" alt="" /></button>
          <div className="flex flex-1 justify-around text-center"><div><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><div><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div><div><p className="font-black">0</p><p className="text-[10px] text-zinc-500">Following</p></div></div>
        </div>
        <div className="mt-4"><p className="text-[13px] font-bold">{vendor.vendor_name}</p><p className="text-[11px] text-zinc-400 mt-1">{vendor.bio || 'Vendor bio'}</p><p className="text-[10px] text-zinc-500">{vendor.location || 'Lagos'}</p></div>
        <div className="flex gap-2 mt-4">
          {isOwn ? <button onClick={()=>setEditMode(!editMode)} className="flex-1 bg-white text-black py-2 rounded-lg text-[11px] font-black">{editMode ? 'Cancel' : isFaster ? 'Edit Faster Shop (You Only)' : 'Edit Profile'}</button> :
          <><button onClick={toggleFollow} className={`flex-1 py-2 rounded-lg text-[11px] font-bold ${isFollowing ? 'bg-zinc-900 border border-zinc-800' : 'bg-white text-black'}`}>{isFollowing ? 'Following' : 'Follow'}</button><button onClick={()=>onDM(vendor,null)} className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold">Message</button></>}
        </div>
        {editMode && isOwn && (
          <div className="mt-4 space-y-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-[10px] font-black">Edit IG Profile — Only you</p>
            <input type="file" accept="image/*" onChange={e=>setAvatarFile(e.target.files?.[0]||null)} className="w-full text-[11px] bg-black p-2 rounded-xl" />
            {avatarFile && <img src={URL.createObjectURL(avatarFile)} className="w-20 h-20 rounded-full object-cover" alt="" />}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Store Name" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-2 text-[11px] h-20" />
            <button onClick={saveEdit} disabled={saving} className="w-full bg-[#39FF14] text-black font-bold py-2 rounded-full text-[11px]">{saving ? 'Saving...' : 'Save IG Profile'}</button>
          </div>
        )}
      </div>
      <div className="border-t border-zinc-900 flex">
        <button onClick={()=>setActiveTab('posts')} className={`flex-1 py-3 text-[11px] font-black border-t ${activeTab==='posts' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}>POSTS</button>
        <button onClick={()=>setActiveTab('tagged')} className={`flex-1 py-3 text-[11px] font-black border-t ${activeTab==='tagged' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}>TAGGED</button>
      </div>
      {activeTab==='posts' && <div className="grid grid-cols-3 gap-0.5">{products.length===0 ? <p className="col-span-3 text-center text-[11px] text-zinc-600 py-10">No posts yet — upload in Profile</p> : products.map(p=><button key={p.id} onClick={()=> p.profiles?.is_faster_shop ? onAddCart(p) : onDM(vendor,p)} className="aspect-square bg-zinc-900 overflow-hidden relative"><img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />{p.images?.length>1 && <span className="absolute top-1 right-1 text-[10px]">⊡</span>}</button>)}</div>}
      {activeTab==='tagged' && <p className="text-center text-[11px] text-zinc-600 py-10">No tagged</p>}
    </div>
  )
}

function MessagesList({ user, onSelect }){
  const [convos, setConvos] = useState([])
  useEffect(()=>{ const load = async () => { const { data: conv } = await supabase.from('conversations').select('*').or(`buyer_id.eq.${user.id},vendor_id.eq.${user.id}`).order('created_at',{ascending:false}); if(!conv) return; const ids = conv.map(c=> c.buyer_id===user.id ? c.vendor_id : c.buyer_id); const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids); const map={}; profiles?.forEach(p=>{ map[p.id]=p }); setConvos(conv.map(c=>({ ...c, other: map[c.buyer_id===user.id ? c.vendor_id : c.buyer_id] })))}; load() },[user.id])
  return (<div className="p-4"><h2 className="font-black">Messages</h2><p className="text-[10px] text-zinc-500 mb-3">Tap vendor to message — Faster Shop + all vendors active</p>{convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats yet. Go to vendor profile → Message</p> : convos.map(c=><button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left"><img src={c.other?.avatar_url} className="w-10 h-10 rounded-full" alt="" /><div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to message</p></div></button>)}</div>)
}
function ChatRoom({ user, vendor, product, onBack }){
  const [msgs, setMsgs] = useState([]); const [text, setText] = useState(''); const [convId, setConvId] = useState(null); const bottomRef = useRef()
  useEffect(()=>{ const init = async () => { let { data: conv } = await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).maybeSingle(); if(!conv){ const { data: newConv } = await supabase.from('conversations').insert({ buyer_id: user.id, vendor_id: vendor.id }).select().single(); conv=newConv } setConvId(conv.id); const { data: m } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at'); setMsgs(m||[]); if(product && (m||[]).length===0){ await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: user.id, text: `Hi, interested in ${product.title || product.name} - ${product.price}` }) } }; init() },[user.id, vendor.id, product])
  useEffect(()=>{ if(!convId) return; const ch = supabase.channel(`chat-${convId}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${convId}` }, (p)=>setMsgs(prev=>[...prev,p.new])).subscribe(); return ()=>supabase.removeChannel(ch) },[convId])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])
  const send = async () => { if(!text.trim() || !convId) return; await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, text }); setText('') }
  return (<div className="flex flex-col h-[calc(100vh-112px)]"><div className="p-4 border-b border-zinc-900 flex items-center gap-3"><button onClick={onBack}>Back</button><img src={vendor?.avatar_url} className="w-8 h-8 rounded-full" alt="" /><p className="text-[12px] font-bold">{vendor?.vendor_name}</p></div><div className="flex-1 overflow-y-auto p-4 space-y-3">{msgs.map(m=><div key={m.id} className={`max-w-[75%] p-3 rounded-2xl text-[11px] ${m.sender_id===user.id ? 'ml-auto bg-[#39FF14] text-black' : 'bg-zinc-900 border border-zinc-800'}`}>{m.text}</div>)}<div ref={bottomRef}></div></div><div className="p-3 border-t border-zinc-900 flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${vendor?.vendor_name}...`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px] outline-none" onKeyDown={e=>e.key==='Enter' && send()} /><button onClick={send} className="bg-white text-black font-bold px-5 rounded-full text-[11px]">Send</button></div></div>)
}

function Profile({ user, profile, fasterShop, reload, onOpenVendor }){
  const [view, setView] = useState('main')
  const [productForm, setProductForm] = useState({ title:'', price:'', category:'Shoes' })
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [storyFile, setStoryFile] = useState(null)
  const isFasterOwner = profile?.is_faster_shop || (fasterShop && fasterShop.id===user.id)

  const uploadProduct = async () => {
    if(!productForm.title || files.length===0) return alert('Add title and select images')
    setUploading(true); setStatus(`Uploading ${files.length} pics...`)
    const urls=[]
    for(let i=0;i<Math.min(files.length,10);i++){
      const f = files[i]
      const name=`${user.id}/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
      setStatus(`Uploading ${i+1}/${Math.min(files.length,10)}...`)
      const { error } = await supabase.storage.from('product-images').upload(name, f, { upsert:true, contentType: f.type })
      if(error){ alert(error.message); continue }
      const { data } = supabase.storage.from('product-images').getPublicUrl(name)
      urls.push(data.publicUrl)
    }
    if(urls.length===0){ setUploading(false); return alert('Upload failed') }
    // FIX: Insert BOTH name and title to satisfy NOT NULL constraint
    const cleanTitle = String(productForm.title)
    const cleanPrice = productForm.price ? String(productForm.price) : '₦25000'
    const { error } = await supabase.from('products').insert({ vendor_id: user.id, title: cleanTitle, name: cleanTitle, price: cleanPrice, category: productForm.category, images: urls, description: '' })
    setUploading(false); setStatus('')
    if(error) alert('DB Error: '+error.message); else { alert(`Success! ${urls.length} pics posted — IG profile + Home + Categories + Messageable`); setFiles([]); setProductForm({ title:'', price:'', category:'Shoes' }); reload(); setView('main') }
  }

  const uploadStory = async () => {
    if(!storyFile) return alert('Select image')
    const name=`${user.id}/story-${Date.now()}-${storyFile.name}`
    const { error } = await supabase.storage.from('product-images').upload(name, storyFile, { upsert:true })
    if(error) return alert(error.message)
    const { data } = supabase.storage.from('product-images').getPublicUrl(name)
    await supabase.from('stories').insert({ vendor_id: user.id, image_url: data.publicUrl })
    alert('Story posted — 24h ring'); setStoryFile(null); reload(); setView('main')
  }

  const becomeVendor = async () => {
    if(isFasterOwner) return
    const { error } = await supabase.from('profiles').upsert({ id:user.id, email:user.email, is_vendor:true, vendor_name: user.email.split('@')[0], is_faster_shop:false })
    if(error) alert(error.message); else { alert('You are now vendor — IG profile active, others can message you'); reload() }
  }

  if(view!=='main'){
    return (
      <div className="p-4"><button onClick={()=>setView('main')} className="mb-4">Back</button>
        {view==='upload' && (<div><h2 className="font-black">Upload Post — IG + Home + Categories + Messageable</h2><div className="space-y-3 mt-4"><input placeholder="Title e.g Yellow Cargo Pants" value={productForm.title} onChange={e=>setProductForm({...productForm, title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><div className="flex gap-2"><input placeholder="Price e.g 20000" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATEGORIES.slice(1).map(c=><option key={c.name}>{c.name}</option>)}</select></div><input type="file" multiple accept="image/*" onChange={e=>setFiles(Array.from(e.target.files||[]))} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl" />{files.length>0 && <div className="grid grid-cols-3 gap-2">{files.slice(0,10).map((f,i)=><img key={i} src={URL.createObjectURL(f)} className="w-full h-20 object-cover rounded-xl" alt="" />)}</div>}<p className="text-[10px] text-[#39FF14]">{files.length} selected — {status}</p><button onClick={uploadProduct} disabled={uploading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">{uploading ? status : `Post ${files.length} Pictures`}</button></div></div>)}
        {view==='story' && (<div><h2 className="font-black">Upload Story — 24h</h2><div className="space-y-3 mt-4"><input type="file" accept="image/*" onChange={e=>setStoryFile(e.target.files?.[0]||null)} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl" />{storyFile && <img src={URL.createObjectURL(storyFile)} className="w-full h-64 object-cover rounded-2xl" alt="" />}<button onClick={uploadStory} className="w-full bg-white text-black font-bold py-3 rounded-full text-[11px]">Post Story</button></div></div>)}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <button onClick={()=>onOpenVendor(profile)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]} {profile?.is_faster_shop && <span className="bg-[#39FF14] text-black text-[7px] px-2 py-1 rounded-full ml-1">OFFICIAL — YOU ONLY</span>} {profile?.is_vendor && !profile?.is_faster_shop && <span className="bg-white text-black text-[7px] px-2 py-1 rounded-full ml-1">VENDOR IG</span>} {!profile?.is_vendor && <span className="bg-zinc-700 text-white text-[7px] px-2 py-1 rounded-full ml-1">BUYER</span>}</p><p className="text-[10px] text-zinc-500">Tap for IG profile — Posts + Follow + Story + Messageable</p></div>
      </button>

      {isFasterOwner ? (
        <>
          <button onClick={()=>setView('upload')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Upload to Faster Shop Official — IG + Home + Categories</button>
          <button onClick={()=>setView('story')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Story — Faster Shop Official →</button>
        </>
      ) : (
        <>
          <button onClick={()=>setView('upload')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Post — IG + Home + Categories + Messageable →</button>
          <button onClick={()=>setView('story')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Story →</button>
          {!profile?.is_vendor && <button onClick={becomeVendor} className="w-full bg-white text-black font-black py-4 rounded-full text-[11px]">Become Vendor — Get IG Profile + Be Messageable</button>}
        </>
      )}
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    </div>
  )
}

function AuthForm({ mode, setMode }){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [loading,setLoading]=useState(false)
  const handle=async(e)=>{e.preventDefault(); setLoading(true); try{ if(mode==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Created! Buyer by default — tap Become Vendor to post + be messageable'); setMode('login')} else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':mode==='signup'?'Create Account':'Login'}</button></form>)
}