import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const CATEGORIES = ['All','Shoes','Bags','Gym Wears','Jewelry','Hoodies','Caps','Perfumes','Native','Streetwear']

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
        <input placeholder="Search vendors..." className="flex-1 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
      </div>

      {tab==='home' && <Home products={products} vendors={vendors} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} />}
      {tab==='shop' && <Shop products={products} vendors={vendors} onOpenVendor={(v)=>{setSelectedVendor(v); setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} />}
      {tab==='vendor' && <VendorProfile vendor={selectedVendor} currentUser={user} currentProfile={profile} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} onBack={()=>setTab('home')} onDM={(v,p)=>{setSelectedChat(v); setSelectedProduct(p); setTab('chat')}} reload={loadAll} />}
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

// IG STYLE VENDOR PROFILE - like you asked
function VendorProfile({ vendor, currentUser, currentProfile, products, onBack, onDM, reload }){
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [bio, setBio] = useState(vendor?.bio||'')
  const [name, setName] = useState(vendor?.vendor_name||'')
  const [location, setLocation] = useState(vendor?.location||'')

  useEffect(()=>{
    if(!vendor) return
    const loadFollow = async () => {
      const { count: fCount } = await supabase.from('vendor_followers').select('*', {count:'exact', head:true}).eq('vendor_id', vendor.id)
      const { count: foCount } = await supabase.from('vendor_followers').select('*', {count:'exact', head:true}).eq('follower_id', vendor.id)
      const { data: isF } = await supabase.from('vendor_followers').select('*').eq('vendor_id', vendor.id).eq('follower_id', currentUser.id).single()
      setFollowers(fCount||0); setFollowing(foCount||0); setIsFollowing(!!isF)
    }
    loadFollow()
  },[vendor])

  const toggleFollow = async () => {
    if(isFollowing){
      await supabase.from('vendor_followers').delete().eq('vendor_id', vendor.id).eq('follower_id', currentUser.id)
      setIsFollowing(false); setFollowers(c=>c-1)
    } else {
      await supabase.from('vendor_followers').insert({ vendor_id: vendor.id, follower_id: currentUser.id })
      setIsFollowing(true); setFollowers(c=>c+1)
    }
  }

  const saveEdit = async () => {
    await supabase.from('profiles').update({ vendor_name: name, bio, location }).eq('id', vendor.id)
    alert('Profile updated — bio, name saved'); setEditMode(false); reload()
  }

  if(!vendor) return <div className="p-4">Loading vendor...</div>

  const isOwn = currentUser.id === vendor.id

  return (
    <div className="p-0">
      <div className="p-4 flex items-center gap-3 border-b border-zinc-900">
        <button onClick={onBack}>←</button>
        <p className="font-black text-[14px]">{vendor.vendor_name}</p>
        {vendor.is_faster_shop && <span className="bg-[#39FF14] text-black text-[8px] px-2 py-1 rounded-full font-bold">FASTER SHOP STORE</span>}
      </div>

      <div className="p-4">
        <div className="flex gap-6 items-center">
          <img src={vendor.avatar_url || `https://i.pravatar.cc/150?u=${vendor.id}`} className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover" />
          <div className="flex flex-1 justify-around text-center">
            <div><p className="font-black text-[14px]">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div>
            <div><p className="font-black text-[14px]">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div>
            <div><p className="font-black text-[14px]">{following}</p><p className="text-[10px] text-zinc-500">Following</p></div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-bold">{vendor.vendor_name}</p>
          <p className="text-[11px] text-zinc-400 mt-1">{editMode ? '' : (vendor.bio || 'No bio yet — tap Edit Profile to add about your store')}</p>
          <p className="text-[10px] text-zinc-500 mt-1">{vendor.location || 'Lagos, Nigeria'}</p>
        </div>

        <div className="flex gap-2 mt-4">
          {isOwn ? (
            <button onClick={()=>setEditMode(!editMode)} className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold">{editMode ? 'Cancel' : 'Edit Profile'}</button>
          ) : (
            <>
              <button onClick={toggleFollow} className={`flex-1 py-2 rounded-lg text-[11px] font-bold ${isFollowing ? 'bg-zinc-900 border border-zinc-800' : 'bg-white text-black'}`}>{isFollowing ? 'Following' : 'Follow'}</button>
              <button onClick={()=>onDM(vendor,null)} className="flex-1 bg-zinc-900 border border-zinc-800 py-2 rounded-lg text-[11px] font-bold">Message</button>
            </>
          )}
        </div>

        {editMode && isOwn && (
          <div className="mt-4 space-y-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-[11px] font-bold">Edit your store bio — like IG</p>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Store Name" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location e.g Lekki, Lagos" className="w-full bg-black border border-zinc-800 rounded-full px-4 py-2 text-[11px]" />
            <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio — tell buyers about your store, what you sell" className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-2 text-[11px] h-20" />
            <button onClick={saveEdit} className="w-full bg-[#39FF14] text-black font-bold py-2 rounded-full text-[11px]">Save Bio & Profile</button>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-900">
        <div className="grid grid-cols-3 gap-0.5">
          {products.map(p=>(
            <button key={p.id} onClick={()=>onDM(vendor,p)} className="aspect-square bg-zinc-900 overflow-hidden">
              <img src={p.images?.[0]} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        {products.length===0 && <p className="text-center text-[11px] text-zinc-500 p-8">No posts yet — vendor can upload up to 10 pictures per post</p>}
      </div>
    </div>
  )
}

function Home({ products, vendors, onOpenVendor, onDM }){
  return (
    <div className="p-0">
      <div className="p-4 flex gap-3 overflow-x-auto border-b border-zinc-900">
        {vendors.map(v=>(
          <button key={v.id} onClick={()=>onOpenVendor(v)} className="flex flex-col items-center min-w-[56px]">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-12 h-12 rounded-full border border-[#39FF14]" />
            <span className="text-[8px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>
      {products.map(prod=> <ProductCard key={prod.id} prod={prod} onOpenVendor={onOpenVendor} onDM={onDM} />)}
    </div>
  )
}

function ProductCard({ prod, onOpenVendor, onDM }){
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
        <button onClick={()=>onOpenVendor({id: prod.vendor_id, vendor_name: prod.profiles?.vendor_name, avatar_url: prod.profiles?.avatar_url, bio: prod.profiles?.bio, location: prod.profiles?.location, is_faster_shop: prod.profiles?.is_faster_shop})} className="flex items-center gap-2">
          <img src={prod.profiles?.avatar_url || `https://i.pravatar.cc/100?u=${prod.vendor_id}`} className="w-8 h-8 rounded-full" />
          <div className="text-left"><p className="text-[11px] font-bold">{prod.profiles?.vendor_name}</p><p className="text-[8px] text-zinc-500">{prod.category}</p></div>
        </button>
        <button onClick={()=>onDM({id:prod.vendor_id, vendor_name:prod.profiles?.vendor_name}, prod)} className="ml-auto bg-white text-black text-[10px] font-bold px-3 py-1.5 rounded-full">Message</button>
      </div>
      <div className="relative h-96 bg-black overflow-hidden">
        <img src={prod.images?.[idx]} className="w-full h-full object-cover" />
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
            {comments.map(c=><div key={c.id} className="text-[10px] text-zinc-300 mt-1">{c.text}</div>)}
            <div className="flex gap-2 mt-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Drop comment..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-2 text-[10px]" /><button onClick={addComment} className="bg-white text-black text-[10px] font-bold px-3 rounded-full">Post</button></div>
          </div>
        )}
      </div>
    </div>
  )
}

function Shop({ products, vendors, onOpenVendor, onDM }){
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
        {vendors.slice(0,6).map(v=>(
          <button key={v.id} onClick={()=>onOpenVendor(v)} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2"><img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-8 h-8 rounded-full" /><p className="text-[11px] font-bold">{v.vendor_name}</p></div>
            <p className="text-[9px] text-zinc-500 mt-2">Tap to view IG-style profile</p>
          </button>
        ))}
      </div>
      <h3 className="font-bold mt-6 text-sm">{cat} — {filtered.length} posts</h3>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {filtered.map(p=>(
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <img src={p.images?.[0]} className="w-full h-32 object-cover" />
            <div className="p-2"><p className="text-[10px] font-bold truncate">{p.title}</p><button onClick={()=>onDM({id:p.vendor_id, vendor_name:p.profiles?.vendor_name}, p)} className="w-full mt-2 bg-white text-black text-[9px] font-bold py-1.5 rounded-full">DM Vendor</button></div>
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
      <h2 className="font-black mb-4">Messages — In-App</h2>
      {convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats. Tap vendor profile > Message to start.</p> :
        convos.map(c=>(
          <button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left">
            <img src={c.other?.avatar_url || `https://i.pravatar.cc/100?u=${c.other?.id}`} className="w-10 h-10 rounded-full" />
            <div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to chat</p></div>
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
      if(product && m?.length===0){ await supabase.from('messages').insert({ conversation_id: conv.id, sender_id: user.id, text: `Hi, I'm interested in ${product.title} — ${product.price}` }) }
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
        <input value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${vendor?.vendor_name}...`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px] outline-none" onKeyDown={e=>e.key==='Enter' && send()} />
        <button onClick={send} className="bg-white text-black font-bold px-5 rounded-full text-[11px]">Send</button>
      </div>
    </div>
  )
}

function Profile({ user, profile, reload, onOpenVendor }){
  const [view, setView] = useState('main')
  const [form, setForm] = useState({ vendor_name:'', location:'', bio:'' })
  const [productForm, setProductForm] = useState({ title:'', description:'', price:'', category:'Shoes' })
  const [files, setFiles] = useState([])
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    supabase.from('saved_addresses').select('*').eq('user_id', user.id).then(({data})=>setAddresses(data||[]))
    supabase.from('orders').select('*').eq('user_id', user.id).then(({data})=>setOrders(data||[]))
  },[])

  const becomeVendor = async (isFaster=false) => {
    const { error } = await supabase.from('profiles').upsert({ id:user.id, email:user.email, vendor_name: form.vendor_name || user.email.split('@')[0], is_vendor:true, is_faster_shop:isFaster, location: form.location, bio: form.bio })
    if(error) alert(error.message); else { alert('Saved'); reload(); setView('main') }
  }

  const uploadProduct = async () => {
    if(!productForm.title || files.length===0) return alert('Add title and images (up to 10)')
    const urls=[]
    for(let f of files.slice(0,10)){
      const name=`${user.id}/${Date.now()}-${f.name}`
      const { error } = await supabase.storage.from('product-images').upload(name, f)
      if(error) continue
      const { data } = supabase.storage.from('product-images').getPublicUrl(name)
      urls.push(data.publicUrl)
    }
    await supabase.from('products').insert({ vendor_id: user.id, title: productForm.title, description: productForm.description, price: productForm.price, category: productForm.category, images: urls })
    alert(`Uploaded ${urls.length} pictures!`); setFiles([]); reload(); setView('main')
  }

  if(view!=='main'){
    return (
      <div className="p-4">
        <button onClick={()=>setView('main')} className="mb-4">← Back</button>
        {view==='upload' && <div><h2 className="font-black">Upload Product — 10 Pics Slide</h2><div className="space-y-3 mt-4"><input placeholder="Title" value={productForm.title} onChange={e=>setProductForm({...productForm, title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Price" value={productForm.price} onChange={e=>setProductForm({...productForm, price:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={productForm.category} onChange={e=>setProductForm({...productForm, category:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select><input type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])} className="text-[11px]" /><button onClick={uploadProduct} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Upload</button></div></div>}
        {view==='become' && <div><h2 className="font-black">Become Vendor</h2><div className="space-y-3 mt-4"><input placeholder="Brand Name" value={form.vendor_name} onChange={e=>setForm({...form, vendor_name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Bio about your store" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><button onClick={()=>becomeVendor(false)} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Save Profile</button><button onClick={()=>becomeVendor(true)} className="w-full bg-white text-black font-bold py-3 rounded-full text-[11px]">Create Faster Shop Store</button></div></div>}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <button onClick={()=>onOpenVendor(profile)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3 text-left">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]}</p><p className="text-[10px] text-zinc-500">Tap to view your IG-style profile</p></div>
      </button>
      <button onClick={()=>setView('upload')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px]">Upload Product — 10 pics →</button>
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