import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const CATEGORIES = [
  { name: 'Men', icon: '👕' },
  { name: 'Hoodies', icon: '🧥' },
  { name: 'Caps', icon: '🧢' },
  { name: 'Perfumes', icon: '🧴' },
  { name: 'Shoes', icon: '👟' },
  { name: 'Bags', icon: '👜' },
  { name: 'Native', icon: '👘' },
  { name: 'Streetwear', icon: '🔥' },
  { name: 'Gym Wears', icon: '💪' },
  { name: 'Jewelry', icon: '💍' },
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
  const [authMode, setAuthMode] = useState('welcome')

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null))
    supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))
  }, [])

  useEffect(() => { if(user) loadAll() }, [user])

  const loadAll = async () => {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(p)
    const { data: v } = await supabase.from('profiles').select('*').eq('is_vendor', true).order('created_at',{ascending:false})
    setVendors(v||[])
    const { data: prods } = await supabase.from('products').select('*, profiles!products_vendor_id_fkey(vendor_name, is_faster_shop, avatar_url, bio, location)').order('created_at',{ascending:false})
    setProducts(prods||[])
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
        <input placeholder="Search vendors, products..." className="flex-1 mx-3 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
      </div>

      {tab==='home' && <Home vendors={vendors} products={products} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} />}
      {tab==='shop' && <Shop onSelectCat={(cat)=>{setTab('home')}} vendors={vendors} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} />}
      {tab==='vendor' && <VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} onBack={()=>setTab('home')} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} reload={loadAll} />}
      {tab==='messages' && <MessagesList user={user} onSelect={(v)=>{setSelectedChat(v); setTab('chat')}} />}
      {tab==='chat' && <ChatRoom user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')} />}
      {tab==='profile' && <Profile user={user} profile={profile} reload={loadAll} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} />}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3">
        {[
          {id:'home', l:'Home'},
          {id:'shop', l:'Shop'},
          {id:'messages', l:'Messages'},
          {id:'profile', l:'Profile'},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`text-[11px] ${tab===t.id || (tab==='chat' && t.id==='messages') || (tab==='vendor' && t.id==='home') ? 'text-white font-black' : 'text-zinc-500'}`}>{t.l}</button>
        ))}
      </div>
    </div>
  )
}

function Home({ vendors, products, onOpenVendor, onDM }){
  return (
    <div className="p-4 space-y-5">
      {/* Vendor Stories */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {vendors.length===0 ? <p className="text-[11px] text-zinc-500">No vendors yet — be first</p> : vendors.map(v=>(
          <button key={v.id} onClick={()=>onOpenVendor(v)} className="flex flex-col items-center min-w-[60px]">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-14 h-14 rounded-full border-2 border-[#39FF14] object-cover" />
            <span className="text-[9px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* FEATURED DROP - RESTORED LIKE YOU WANT */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-[14px]">Featured Drops</h3>
          <button className="text-[11px] text-[#39FF14] font-bold">See All</button>
        </div>
        <div className="rounded-[20px] overflow-hidden h-56 relative bg-zinc-900 border border-zinc-800">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-[#39FF14] text-black text-[8px] px-2.5 py-1 rounded-full font-black">UP TO 30% OFF</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-black text-[18px] leading-tight">Nigeria's Fastest<br/>Fashion Market is Back</h2>
            <p className="text-[10px] text-zinc-300 mt-1">Buy from Faster Shop Store - Chat vendors in app</p>
            <button className="mt-3 bg-white text-black text-[11px] font-black px-5 py-2.5 rounded-full">Explore Drops</button>
          </div>
        </div>
      </div>

      {/* NEW BRANDS - LIVE WHEN VENDORS REGISTER */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-[14px]">New Brands</h3>
          <span className="text-[10px] text-zinc-500">{vendors.length} today</span>
        </div>
        {vendors.length===0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
            <p className="text-[11px] text-zinc-500">No brands yet — when vendors register, they appear here live</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {vendors.map(b=>(
              <button key={b.id} onClick={()=>onOpenVendor(b)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center gap-3 min-w-[180px] text-left">
                <img src={b.avatar_url || `https://i.pravatar.cc/100?u=${b.id}`} className="w-10 h-10 rounded-full" />
                <div className="flex-1"><p className="text-[11px] font-bold">{b.vendor_name}</p><span className="text-[9px] bg-white text-black px-2.5 py-1 rounded-full mt-1 inline-block font-bold">View Store</span></div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Feed */}
      <div className="space-y-3">
        {products.slice(0,5).map(prod=>(
          <div key={prod.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-3 flex items-center gap-2">
              <img src={prod.profiles?.avatar_url || `https://i.pravatar.cc/100?u=${prod.vendor_id}`} className="w-8 h-8 rounded-full" />
              <p className="text-[11px] font-bold">{prod.profiles?.vendor_name}</p>
              <button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="ml-auto bg-white text-black text-[9px] font-bold px-3 py-1 rounded-full">Message</button>
            </div>
            <img src={prod.images?.[0]} className="w-full h-64 object-cover" />
            <div className="p-3"><p className="text-[11px] font-bold">{prod.title} — {prod.price}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Shop({ vendors, onOpenVendor }){
  return (
    <div className="p-4">
      <h2 className="font-black text-[16px]">Shop Categories</h2>
      <p className="text-[11px] text-zinc-500 mb-4">Browse by what you need — easy navigation</p>
      {/* OLD DESIGN - ICONS GRID, NO NUMBERS */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat=>(
          <button key={cat.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-3 text-left">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-[13px] font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      <h3 className="font-bold text-sm mt-8">Featured Vendors</h3>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {vendors.map(v=>(
          <button key={v.id} onClick={()=>onOpenVendor(v)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-12 h-12 rounded-full mx-auto" />
            <p className="text-[11px] font-bold mt-2">{v.vendor_name}</p>
            <p className="text-[9px] text-zinc-500 mt-1">Tap to view IG profile</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function VendorProfile({ vendor, currentUser, products, onBack, onDM, reload }){
  const [followers, setFollowers] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [bio, setBio] = useState(vendor?.bio||'')
  const [name, setName] = useState(vendor?.vendor_name||'')
  const [location, setLocation] = useState(vendor?.location||'')

  useEffect(()=>{
    if(!vendor) return
    const load = async () => {
      const { count } = await supabase.from('vendor_followers').select('*', {count:'exact', head:true}).eq('vendor_id', vendor.id)
      const { data } = await supabase.from('vendor_followers').select('*').eq('vendor_id', vendor.id).eq('follower_id', currentUser.id).single()
      setFollowers(count||0); setIsFollowing(!!data)
    }
    load()
  },[vendor])

  const toggleFollow = async () => {
    if(isFollowing){ await supabase.from('vendor_followers').delete().eq('vendor_id', vendor.id).eq('follower_id', currentUser.id); setIsFollowing(false); setFollowers(c=>c-1) }
    else { await supabase.from('vendor_followers').insert({ vendor_id: vendor.id, follower_id: currentUser.id }); setIsFollowing(true); setFollowers(c=>c+1) }
  }

  const saveEdit = async () => {
    await supabase.from('profiles').update({ vendor_name: name, bio, location }).eq('id', vendor.id)
    alert('Profile saved'); setEditMode(false); reload()
  }

  if(!vendor) return null
  const isOwn = currentUser.id === vendor.id

  return (
    <div>
      <div className="p-4 flex items-center gap-3 border-b border-zinc-900"><button onClick={onBack}>←</button><p className="font-black">{vendor.vendor_name}</p></div>
      <div className="p-4">
        <div className="flex gap-6 items-center">
          <img src={vendor.avatar_url || `https://i.pravatar.cc/150?u=${vendor.id}`} className="w-20 h-20 rounded-full" />
          <div className="flex flex-1 justify-around text-center">
            <div><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div>
            <div><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div>
            <div><p className="font-black">0</p><p className="text-[10px] text-zinc-500">Following</p></div>
          </div>
        </div>
        <div className="mt-4"><p className="text-[13px] font-bold">{vendor.vendor_name}</p><p className="text-[11px] text-zinc-400 mt-1">{vendor.bio || 'Tap Edit Profile to add bio about your store'}</p><p className="text-[10px] text-zinc-500">{vendor.location || 'Lagos, Nigeria'}</p></div>
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
        {products.map(p=><button key={p.id} onClick={()=>onDM(vendor,p)} className="aspect-square bg-zinc-900 overflow-hidden"><img src={p.images?.[0]} className="w-full h-full object-cover" /></button>)}
      </div>
    </div>
  )
}

function MessagesList({ user, onSelect }){
  const [convos, setConvos] = useState([])
  useEffect(()=>{
    const load = async () => {
      const { data: conv } = await supabase.from('conversations').select('*').or(`buyer_id.eq.${user.id},vendor_id.eq.${user.id}`).order('created_at',{ascending:false})
      if(!conv) return
      const ids = conv.map(c=> c.buyer_id===user.id ? c.vendor_id : c.buyer_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
      const map={}; profiles?.forEach(p=>map[p.id]=p)
      setConvos(conv.map(c=>({ ...c, other: map[c.buyer_id===user.id ? c.vendor_id : c.buyer_id] })))
    }
    load()
  },[])
  return (<div className="p-4"><h2 className="font-black mb-4">Messages</h2>{convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats yet. Open vendor profile > Message to discuss price.</p> : convos.map(c=><button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left"><img src={c.other?.avatar_url || `https://i.pravatar.cc/100?u=${c.other?.id}`} className="w-10 h-10 rounded-full" /><div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to chat</p></div></button>))}</div>)
}

function ChatRoom({ user, vendor, product, onBack }){
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [convId, setConvId] = useState(null)
  const bottomRef = useRef()
  useEffect(()=>{
    const init = async () => {
      let { data: conv } = await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).single()
      if(!conv){ const { data: newConv } = await supabase.from('conversations').insert({ buyer_id: user.id, vendor_id: vendor.id }).select().single(); conv=newConv }
      setConvId(conv.id)
      const { data: m } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at')
      setMsgs(m||[])
      if(product && m?.length===0){ await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: user.id, text: `Hi, interested in ${product.title} — ${product.price}` }) }
      supabase.channel(`chat-${conv.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${conv.id}` }, (p)=>{ setMsgs(prev=>[...prev, p.new]) }).subscribe()
    }
    init()
  },[])
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])
  const send = async () => { if(!text.trim() || !convId) return; await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, text }); setText('') }
  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-3"><button onClick={onBack}>←</button><img src={vendor?.avatar_url || `https://i.pravatar.cc/100?u=${vendor?.id}`} className="w-8 h-8 rounded-full" /><div><p className="text-[12px] font-bold">{vendor?.vendor_name}</p>{product && <p className="text-[8px] text-zinc-500">About: {product.title}</p>}</div></div>
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
  useEffect(()=>{ if(profile){ setForm({ vendor_name: profile.vendor_name||'', location: profile.location||'', bio: profile.bio||'' }) } },[profile])
  const becomeVendor = async (isFaster=false) => {
    await supabase.from('profiles').upsert({ id:user.id, email:user.email, vendor_name: form.vendor_name || user.email.split('@')[0], is_vendor:true, is_faster_shop:isFaster, location: form.location, bio: form.bio })
    reload(); setView('main')
  }
  const uploadProduct = async () => {
    if(!productForm.title || files.length===0) return alert('Add title and images')
    const urls=[]
    for(let f of files.slice(0,10)){
      const name=`${user.id}/${Date.now()}-${f.name}`
      await supabase.storage.from('product-images').upload(name, f)
      const { data } = supabase.storage.from('product-images').getPublicUrl(name)
      urls.push(data.publicUrl)
    }
    await supabase.from('products').insert({ vendor_id: user.id, title: productForm.title, description: productForm.description, price: productForm.price, category: productForm.category, images: urls })
    alert(`Uploaded ${urls.length} pics — buyers can comment & DM`); setFiles([]); reload(); setView('main')
  }
  if(view!=='main'){
    return (
      <div className="p-4">
        <button onClick={()=>setView('main')} className="mb-4">← Back</button>
        {view==='upload' && <div><h2 className="font-black">Upload — Up to 10 Pictures</h2><div className="space-y-3 mt-4"><input placeholder="Title" value={productForm.title} onChange={e=>setProductForm({...productForm, title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Price ₦25,000" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATEGORIES.map(c=><option key={c.name}>{c.name}</option>)}</select><input type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])} className="text-[11px]" /><p className="text-[10px] text-zinc-500">{files.length} pics selected</p><button onClick={uploadProduct} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Upload Product</button></div></div>}
        {view==='become' && <div><h2 className="font-black">Become Vendor — Edit Bio</h2><div className="space-y-3 mt-4"><input placeholder="Brand Name" value={form.vendor_name} onChange={e=>setForm({...form, vendor_name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Bio about store" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><button onClick={()=>becomeVendor(false)} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Save Vendor Profile</button></div></div>}
      </div>
    )
  }
  return (
    <div className="p-4 space-y-3">
      <button onClick={()=>onOpenVendor(profile)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]}</p><p className="text-[10px] text-zinc-500">Tap for IG profile — edit bio</p></div>
      </button>
      <button onClick={()=>setView('upload')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Product — 10 pics slide →</button>
      <button onClick={()=>setView('become')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Become Vendor / Edit Bio →</button>
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    </div>
  )
}

function AuthForm({ mode, setMode }){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [loading,setLoading]=useState(false)
  const handle=async(e)=>{e.preventDefault(); setLoading(true); try{ if(mode==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Created! Login'); setMode('login')} else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':mode==='signup'?'Create':'Login'}</button></form>)
}