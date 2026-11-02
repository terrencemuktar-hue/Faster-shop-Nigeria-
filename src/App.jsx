import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const CATEGORIES = ['All','Shoes','Bags','Gym Wears','Jewelry','Hoodies','Caps','Perfumes','Native','Streetwear']

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('home')
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
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
    const { data: prods } = await supabase.from('products').select('*, profiles!products_vendor_id_fkey(vendor_name, is_faster_shop)').order('created_at',{ascending:false})
    setProducts(prods||[])
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div>
        <h1 className="text-2xl font-black mt-3 tracking-widest">FASTER SHOP</h1>
        <p className="text-[10px] text-zinc-500 mb-16">Shopping Social Media</p>
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
        <input placeholder="Search vendors, products..." className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
      </div>

      {tab==='home' && <Home products={products} vendors={vendors} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} reload={loadAll} />}
      {tab==='shop' && <Shop products={products} vendors={vendors} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} />}
      {tab==='messages' && <MessagesList user={user} onSelect={(v)=>{setSelectedChat(v); setTab('chat')}} />}
      {tab==='chat' && <ChatRoom user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')} />}
      {tab==='profile' && <Profile user={user} profile={profile} reload={loadAll} />}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3">
        {[
          {id:'home', l:'Home'},
          {id:'shop', l:'Shop'},
          {id:'messages', l:'Messages'},
          {id:'profile', l:'Profile'},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`text-[11px] ${tab===t.id || (tab==='chat' && t.id==='messages') ? 'text-white font-black' : 'text-zinc-500'}`}>{t.l}</button>
        ))}
      </div>
    </div>
  )
}

function Home({ products, vendors, onDM, reload }){
  return (
    <div className="p-0">
      <div className="p-4 flex gap-3 overflow-x-auto border-b border-zinc-900">
        {vendors.map(v=>(
          <button key={v.id} onClick={()=>onDM(v,null)} className="flex flex-col items-center min-w-[56px]">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-12 h-12 rounded-full border border-[#39FF14]" />
            <span className="text-[8px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>
      {products.length===0 ? <p className="p-4 text-[11px] text-zinc-500">No products yet. Vendors upload up to 10 pictures — buyers comment and DM.</p> :
        products.map(prod=> <ProductCard key={prod.id} prod={prod} onDM={onDM} reload={reload} />)
      }
    </div>
  )
}

function ProductCard({ prod, onDM, reload }){
  const [idx, setIdx] = useState(0)
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [text, setText] = useState('')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
    supabase.from('product_comments').select('*').eq('product_id', prod.id).order('created_at').then(({data})=>setComments(data||[]))
  },[])

  const addComment = async () => {
    if(!text.trim()) return
    await supabase.from('product_comments').insert({ product_id: prod.id, user_id: user.id, text })
    setText(''); const {data}=await supabase.from('product_comments').select('*').eq('product_id', prod.id).order('created_at'); setComments(data||[])
  }

  return (
    <div className="border-b border-zinc-900 bg-zinc-950">
      <div className="p-3 flex items-center gap-2">
        <img src={prod.profiles?.avatar_url || `https://i.pravatar.cc/100?u=${prod.vendor_id}`} className="w-8 h-8 rounded-full" />
        <div className="flex-1"><p className="text-[11px] font-bold">{prod.profiles?.vendor_name || 'Vendor'}</p><p className="text-[8px] text-zinc-500">{prod.category} • {prod.profiles?.is_faster_shop ? 'Faster Shop Store — Pay in App' : 'Chat to order'}</p></div>
        <button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full">Message</button>
      </div>
      <div className="relative h-96 bg-black overflow-hidden">
        <img src={prod.images?.[idx] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" />
        {prod.images?.length>1 && <>
          <button onClick={()=>setIdx(i=> (i-1+prod.images.length)%prod.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 rounded-full w-8 h-8">‹</button>
          <button onClick={()=>setIdx(i=> (i+1)%prod.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 rounded-full w-8 h-8">›</button>
          <span className="absolute bottom-2 right-2 bg-black/70 text-[9px] px-2 py-1 rounded-full">{idx+1}/{prod.images.length}</span>
        </>}
      </div>
      <div className="p-3">
        <p className="text-[12px] font-bold">{prod.title} — {prod.price}</p>
        <p className="text-[10px] text-zinc-400 mt-1">{prod.description}</p>
        <div className="flex gap-4 mt-3">
          <button onClick={()=>setShowComments(!showComments)} className="text-[11px] text-zinc-400">💬 {comments.length} Comments</button>
          <button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="text-[11px] text-[#39FF14] font-bold">DM to discuss price →</button>
        </div>
        {showComments && (
          <div className="mt-3">
            {comments.map(c=><div key={c.id} className="text-[10px] text-zinc-300 mt-1"><span className="font-bold">{c.user_id.slice(0,5)}:</span> {c.text}</div>)}
            <div className="flex gap-2 mt-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Drop comment..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2 text-[10px]" /><button onClick={addComment} className="bg-white text-black text-[10px] font-bold px-3 rounded-full">Post</button></div>
          </div>
        )}
      </div>
    </div>
  )
}

function Shop({ products, vendors, onDM }){
  const [cat, setCat] = useState('All')
  const filtered = cat==='All' ? products : products.filter(p=>p.category===cat)
  return (
    <div className="p-4">
      <h2 className="font-black">Shop Categories</h2>
      <div className="flex gap-2 overflow-x-auto mt-3 pb-2">
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={`px-4 py-2 rounded-full text-[10px] font-bold whitespace-nowrap ${cat===c ? 'bg-white text-black' : 'bg-zinc-900 border border-zinc-800'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {CATEGORIES.filter(c=>c!=='All').map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left"><p className="text-[12px] font-bold">{c}</p><p className="text-[9px] text-zinc-500">{products.filter(p=>p.category===c).length} products</p></button>
        ))}
      </div>
      <h3 className="font-bold mt-6 text-sm">{cat} Products — {filtered.length}</h3>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {filtered.map(p=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <img src={p.images?.[0]} className="w-full h-32 object-cover" />
            <div className="p-2"><p className="text-[10px] font-bold truncate">{p.title}</p><p className="text-[9px] text-zinc-400">{p.price}</p><button onClick={()=>onDM({id:p.vendor_id, vendor_name:p.profiles?.vendor_name}, p)} className="w-full mt-2 bg-white text-black text-[9px] font-bold py-1.5 rounded-full">DM Vendor</button></div>
          </div>
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
      if(!conv) return
      const ids = conv.map(c=> c.buyer_id===user.id ? c.vendor_id : c.buyer_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
      const map={}; profiles?.forEach(p=>map[p.id]=p)
      setConvos(conv.map(c=>({ ...c, other: map[c.buyer_id===user.id ? c.vendor_id : c.buyer_id] })))
    }
    load()
  },[])
  return (
    <div className="p-4">
      <h2 className="font-black mb-4">Messages — Buyer & Vendor Chat In-App</h2>
      {convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats yet. Buyer registers, vendor registers, buyer taps Message on product — they chat here and discuss price. No WhatsApp.</p> :
        convos.map(c=>(
          <button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left">
            <img src={c.other?.avatar_url || `https://i.pravatar.cc/100?u=${c.other?.id}`} className="w-10 h-10 rounded-full" />
            <div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to open chat & discuss order</p></div>
          </button>
        ))
      }
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
      let { data: conv } = await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).single()
      if(!conv){ const { data: newConv } = await supabase.from('conversations').insert({ buyer_id: user.id, vendor_id: vendor.id }).select().single(); conv=newConv }
      setConvId(conv.id)
      const { data: m } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at')
      setMsgs(m||[])
      if(product){ await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: user.id, text: `Hi, I'm interested in ${product.title} — ${product.price}. Can we discuss?` }) }
      supabase.channel(`chat-${conv.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${conv.id}` }, (payload)=>{ setMsgs(prev=>[...prev, payload.new]) }).subscribe()
    }
    init()
  },[])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  const send = async () => {
    if(!text.trim() || !convId) return
    await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, text }); setText('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <img src={vendor?.avatar_url || `https://i.pravatar.cc/100?u=${vendor?.id}`} className="w-8 h-8 rounded-full" />
        <div><p className="text-[12px] font-bold">{vendor?.vendor_name}</p>{product && <p className="text-[8px] text-zinc-500">About: {product.title}</p>}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map(m=><div key={m.id} className={`max-w-[75%] p-3 rounded-2xl text-[11px] ${m.sender_id===user.id ? 'ml-auto bg-[#39FF14] text-black' : 'bg-zinc-900 border border-zinc-800'}`}>{m.text}</div>)}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-3 border-t border-zinc-900 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${vendor?.vendor_name}... discuss price`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px] outline-none" onKeyDown={e=>e.key==='Enter' && send()} />
        <button onClick={send} className="bg-white text-black font-bold px-5 rounded-full text-[11px]">Send</button>
      </div>
    </div>
  )
}

function Profile({ user, profile, reload }){
  const [view, setView] = useState('main')
  const [form, setForm] = useState({ vendor_name:'', location:'', bio:'' })
  const [productForm, setProductForm] = useState({ title:'', description:'', price:'', category:'Shoes' })
  const [files, setFiles] = useState([])
  const [address, setAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    supabase.from('saved_addresses').select('*').eq('user_id', user.id).then(({data})=>setAddresses(data||[]))
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at',{ascending:false}).then(({data})=>setOrders(data||[]))
  },[])

  const becomeVendor = async (isFaster=false) => {
    const { error } = await supabase.from('profiles').upsert({ id:user.id, email:user.email, vendor_name: form.vendor_name || user.email.split('@')[0], is_vendor:true, is_faster_shop:isFaster, location: form.location, bio: form.bio })
    if(error) alert(error.message); else { alert(isFaster ? 'Faster Shop Store created!' : 'Vendor saved!'); reload(); setView('main') }
  }

  const uploadProduct = async () => {
    if(!productForm.title || files.length===0) return alert('Add title and at least 1 image (up to 10)')
    const urls=[]
    for(let f of files.slice(0,10)){
      const name=`${user.id}/${Date.now()}-${f.name}`
      const { error } = await supabase.storage.from('product-images').upload(name, f)
      if(error) continue
      const { data } = supabase.storage.from('product-images').getPublicUrl(name)
      urls.push(data.publicUrl)
    }
    const { error } = await supabase.from('products').insert({ vendor_id: user.id, title: productForm.title, description: productForm.description, price: productForm.price, category: productForm.category, images: urls })
    if(error) alert(error.message); else { alert(`Product uploaded with ${urls.length} pictures! Buyers can comment and DM you.`); setProductForm({ title:'', description:'', price:'', category:'Shoes' }); setFiles([]); reload(); setView('main') }
  }

  const saveAddress = async () => {
    if(!address) return
    await supabase.from('saved_addresses').insert({ user_id:user.id, address })
    setAddress(''); const {data}=await supabase.from('saved_addresses').select('*').eq('user_id', user.id); setAddresses(data||[])
  }

  if(view!=='main'){
    return (
      <div className="p-4">
        <button onClick={()=>setView('main')} className="mb-4">← Back</button>
        {view==='orders' && <div><h2 className="font-black">My Orders & Delivery</h2>{orders.length===0 ? <p className="text-[11px] text-zinc-500 mt-3">No orders. Faster Shop Store orders appear here.</p> : orders.map(o=><div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] mt-2">{o.total} — {o.status}</div>)}</div>}
        {view==='addresses' && <div><h2 className="font-black">Saved Shopping Address</h2><div className="flex gap-2 mt-3"><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Lekki Phase 1, Lagos" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-[11px]" /><button onClick={saveAddress} className="bg-[#39FF14] text-black px-4 rounded-full text-[11px] font-bold">Save</button></div><div className="mt-4 space-y-2">{addresses.map(a=><div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px]">{a.address}</div>)}</div></div>}
        {view==='upload' && <div><h2 className="font-black">Upload Product — Up to 10 Pictures in One Slide</h2><div className="space-y-3 mt-4"><input placeholder="Title e.g Yellow Cargo Pants" value={productForm.title} onChange={e=>setProductForm({...productForm, title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Description" value={productForm.description} onChange={e=>setProductForm({...productForm, description:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><div className="flex gap-2"><input placeholder="Price e.g ₦25,000" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div><input type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])} className="w-full text-[11px]" /><p className="text-[10px] text-zinc-500">{files.length} selected — max 10 in one slide, buyers can comment and DM you directly</p><button onClick={uploadProduct} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Upload Product</button></div></div>}
        {view==='become' && <div><h2 className="font-black">Become a Vendor — Real Profile Saved</h2><div className="space-y-3 mt-4"><input placeholder="Brand Name" value={form.vendor_name} onChange={e=>setForm({...form, vendor_name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><button onClick={()=>becomeVendor(false)} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Save Vendor Profile</button><button onClick={()=>becomeVendor(true)} className="w-full bg-white text-black font-bold py-3 rounded-full text-[11px]">Create Faster Shop Store (Only Pay In App)</button></div></div>}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]}</p><p className="text-[10px] text-zinc-500">{user.email}</p></div>
      </div>
      <button onClick={()=>setView('orders')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">My Orders & Delivery <span>→</span></button>
      <button onClick={()=>setView('addresses')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">Saved Shopping Address <span>→</span></button>
      <button onClick={()=>setView('upload')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">Upload Product — 10 pictures slide <span>→</span></button>
      <button onClick={()=>setView('become')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Become a Vendor - {profile?.is_vendor ? 'Edit Profile' : '5 Followers OK'} →</button>
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    </div>
  )
}

function AuthForm({ mode, setMode }){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [loading,setLoading]=useState(false)
  const handle=async(e)=>{e.preventDefault(); setLoading(true); try{ if(mode==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Account created! Login'); setMode('login')} else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':mode==='signup'?'Create Account':'Login'}</button></form>)
}