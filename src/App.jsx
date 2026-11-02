import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('home')
  const [vendors, setVendors] = useState([])
  const [authMode, setAuthMode] = useState('welcome')
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null))
    supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))
  }, [])

  useEffect(() => {
    if(!user) return
    loadData()
  }, [user])

  const loadData = async () => {
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(p)
    const { data: v } = await supabase.from('profiles').select('*').eq('is_vendor', true).order('created_at', {ascending:false})
    setVendors(v||[])
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div>
        <h1 className="text-2xl font-black mt-3 tracking-widest">FASTER SHOP</h1>
        <p className="text-[10px] text-zinc-500 mb-16">Nigeria's Shopping Social Media</p>
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
        <span className="text-[8px] font-black">FASTER<br/>SHOP</span>
        <input placeholder="Search vendors..." className="flex-1 mx-3 bg-zinc-900 rounded-full px-4 py-2 text-[11px] outline-none" />
        <button onClick={()=>setTab('messages')} className="text-sm">💬</button>
        <button onClick={()=>setTab('cart')} className="text-sm">🛒</button>
      </div>

      {tab==='home' && <Home vendors={vendors} onChat={(vendor)=>{setSelectedChat(vendor); setTab('chat')}} />}
      {tab==='shop' && <Shop vendors={vendors} onChat={(vendor)=>{setSelectedChat(vendor); setTab('chat')}} />}
      {tab==='search' && <Search />}
      {tab==='messages' && <MessagesList user={user} onSelect={(v)=>{setSelectedChat(v); setTab('chat')}} />}
      {tab==='chat' && <ChatRoom user={user} vendor={selectedChat} onBack={()=>setTab('messages')} />}
      {tab==='profile' && <Profile user={user} profile={profile} reload={loadData} />}
      {tab==='cart' && <Cart user={user} />}

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

function Home({ vendors, onChat }){
  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-3 overflow-x-auto">
        {vendors.map(v=>(
          <button key={v.id} onClick={()=>onChat(v)} className="flex flex-col items-center min-w-[56px]">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-12 h-12 rounded-full border border-[#39FF14]" />
            <span className="text-[8px] mt-1">{v.vendor_name?.split(' ')[0]}</span>
          </button>
        ))}
      </div>
      <div className="rounded-[24px] overflow-hidden relative h-56 bg-zinc-900 border border-zinc-800">
        <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="absolute bottom-5 left-5">
          <h2 className="font-black text-[18px] leading-tight">Nigeria's Fastest<br/>Fashion Market is Back</h2>
          <p className="text-[10px] text-zinc-300 mt-1">Buy from Faster Shop Store • Chat vendors inside app</p>
          <span className="bg-[#39FF14] text-black text-[9px] px-3 py-1.5 rounded-full font-bold mt-3 inline-block">Black & White Edition</span>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm">Vendors Today {vendors.length}/10</h3>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {vendors.map(v=>(
            <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-8 h-8 rounded-full" />
                <div><p className="text-[11px] font-bold">{v.vendor_name}</p><p className="text-[8px] text-zinc-500">{v.is_faster_shop ? 'FASTER SHOP STORE' : 'Vendor'}</p></div>
              </div>
              <button onClick={()=>onChat(v)} className="w-full mt-3 bg-white text-black text-[10px] font-bold py-2 rounded-full">Message Vendor</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Shop({ vendors, onChat }){
  return (
    <div className="p-4">
      <h2 className="font-black">Shop Vendors</h2>
      <p className="text-[10px] text-zinc-500 mb-4">Chat inside app. Only Faster Shop Store checkout inside app.</p>
      <div className="grid grid-cols-2 gap-3">
        {vendors.map(v=>(
          <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
            <img src={v.avatar_url || `https://i.pravatar.cc/100?u=${v.id}`} className="w-12 h-12 rounded-full mx-auto" />
            <p className="text-[11px] font-bold mt-2">{v.vendor_name}</p>
            <button onClick={()=>onChat(v)} className="mt-2 w-full bg-zinc-800 text-white text-[10px] py-2 rounded-full">Chat in App</button>
            {v.is_faster_shop && <span className="text-[8px] bg-[#39FF14] text-black px-2 py-1 rounded-full mt-2 inline-block font-bold">Pay Inside App</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Search(){
  const cats = ['Men','Hoodies','Caps','Perfumes','Shoes','Bags','Native','Streetwear']
  return (<div className="p-4"><h2 className="font-black">Explore</h2><div className="grid grid-cols-2 gap-3 mt-4">{cats.map(c=><div key={c} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-[12px] font-bold">{c}</div>)}</div></div>)
}

function MessagesList({ user, onSelect }){
  const [convos, setConvos] = useState([])
  useEffect(()=>{
    const load = async () => {
      const { data: conv } = await supabase.from('conversations').select('*').or(`buyer_id.eq.${user.id},vendor_id.eq.${user.id}`).order('created_at', {ascending:false})
      if(!conv) return
      const ids = conv.map(c=> c.buyer_id===user.id ? c.vendor_id : c.buyer_id)
      const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
      const map = {}
      profiles?.forEach(p=>map[p.id]=p)
      setConvos(conv.map(c=>({ ...c, other: map[c.buyer_id===user.id ? c.vendor_id : c.buyer_id] })))
    }
    load()
  },[])
  return (
    <div className="p-4">
      <h2 className="font-black mb-4">Messages — In-App Chat</h2>
      {convos.length===0 ? <p className="text-[11px] text-zinc-500">No chats yet. Go to Shop and Message a vendor. They reply here, no WhatsApp needed.</p> :
        convos.map(c=>(
          <button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3 mb-2 text-left">
            <img src={c.other?.avatar_url || `https://i.pravatar.cc/100?u=${c.other?.id}`} className="w-10 h-10 rounded-full" />
            <div><p className="text-[12px] font-bold">{c.other?.vendor_name}</p><p className="text-[10px] text-zinc-500">Tap to continue chat</p></div>
          </button>
        ))
      }
    </div>
  )
}

function ChatRoom({ user, vendor, onBack }){
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [convId, setConvId] = useState(null)
  const bottomRef = useRef()

  useEffect(()=>{
    const init = async () => {
      let { data: conv } = await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).single()
      if(!conv){
        const { data: newConv } = await supabase.from('conversations').insert({ buyer_id: user.id, vendor_id: vendor.id }).select().single()
        conv = newConv
      }
      setConvId(conv.id)
      const { data: m } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at')
      setMsgs(m||[])
      supabase.channel(`chat-${conv.id}`).on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${conv.id}` }, (payload)=>{ setMsgs(prev=>[...prev, payload.new]) }).subscribe()
    }
    init()
  },[])

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  const send = async () => {
    if(!text.trim() || !convId) return
    await supabase.from('messages').insert({ conversation_id: convId, sender_id: user.id, text })
    setText('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="p-4 border-b border-zinc-900 flex items-center gap-3">
        <button onClick={onBack}>←</button>
        <img src={vendor?.avatar_url || `https://i.pravatar.cc/100?u=${vendor?.id}`} className="w-8 h-8 rounded-full" />
        <div><p className="text-[12px] font-bold">{vendor?.vendor_name}</p><p className="text-[8px] text-zinc-500">{vendor?.is_faster_shop ? 'Faster Shop Store — Pay in App' : 'Vendor — Chat to order'}</p></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map(m=>(
          <div key={m.id} className={`max-w-[75%] p-3 rounded-2xl text-[11px] ${m.sender_id===user.id ? 'ml-auto bg-[#39FF14] text-black' : 'bg-zinc-900 border border-zinc-800'}`}>{m.text}</div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-3 border-t border-zinc-900 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder={`Message ${vendor?.vendor_name}...`} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px] outline-none" onKeyDown={e=>e.key==='Enter' && send()} />
        <button onClick={send} className="bg-white text-black font-bold px-5 rounded-full text-[11px]">Send</button>
      </div>
    </div>
  )
}

function Profile({ user, profile, reload }){
  const [view, setView] = useState('main')
  const [form, setForm] = useState({ vendor_name:'', location:'', bio:'' })
  const [address, setAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    supabase.from('saved_addresses').select('*').eq('user_id', user.id).then(({data})=>setAddresses(data||[]))
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', {ascending:false}).then(({data})=>setOrders(data||[]))
  },[])

  const becomeVendor = async (isFaster=false) => {
    const { error } = await supabase.from('profiles').upsert({ id:user.id, email:user.email, vendor_name: form.vendor_name || user.email.split('@')[0], is_vendor:true, is_faster_shop:isFaster, location: form.location, bio: form.bio })
    if(error) alert(error.message); else { alert(isFaster ? 'Faster Shop Store created!' : 'Vendor saved! You are now live'); reload(); setView('main') }
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
        {view==='orders' && <div><h2 className="font-black">My Orders & Delivery</h2>{orders.length===0 ? <p className="text-[11px] text-zinc-500 mt-3">No orders. Orders from Faster Shop Store only appear here.</p> : orders.map(o=><div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] mt-2">{o.total} — {o.status}</div>)}</div>}
        {view==='addresses' && <div><h2 className="font-black">Saved Shopping Address</h2><div className="flex gap-2 mt-3"><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g Lekki Phase 1, Lagos" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-[11px]" /><button onClick={saveAddress} className="bg-[#39FF14] text-black px-4 rounded-full text-[11px] font-bold">Save</button></div><div className="mt-4 space-y-2">{addresses.map(a=><div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px]">{a.address}</div>)}</div></div>}
        {view==='settings' && <div><h2 className="font-black">Account Settings</h2><p className="text-[11px] text-zinc-400 mt-3">Email: {user.email}</p><p className="text-[11px] text-zinc-400">Role: {profile?.is_faster_shop ? 'Faster Shop Store' : profile?.is_vendor ? 'Vendor' : 'Buyer'}</p><p className="text-[10px] text-zinc-500 mt-4">Faster Shop is middle man — helping vendors get customers across Nigeria. Only Faster Shop Store can collect payment inside app.</p></div>}
        {view==='become' && <div><h2 className="font-black">Become a Vendor — Real Profile Saved in App</h2><div className="space-y-3 mt-4"><input placeholder="Brand Name" value={form.vendor_name} onChange={e=>setForm({...form, vendor_name:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><input placeholder="Location" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Bio — what do you sell?" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-[11px]" /><button onClick={()=>becomeVendor(false)} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">Save Vendor Profile — You will appear live</button><button onClick={()=>becomeVendor(true)} className="w-full bg-white text-black font-bold py-3 rounded-full text-[11px]">Create Faster Shop Store (Only Store That Can Receive Payment In App)</button></div></div>}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-black">{user.email[0].toUpperCase()}</div>
        <div><p className="text-[12px] font-bold">{profile?.vendor_name || user.email.split('@')[0]}</p><p className="text-[10px] text-zinc-500">{user.email}</p><p className="text-[9px] text-[#39FF14]">{profile?.is_faster_shop ? 'FASTER SHOP STORE' : profile?.is_vendor ? 'VERIFIED VENDOR' : 'BUYER'}</p></div>
      </div>
      <button onClick={()=>setView('orders')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">My Orders & Delivery <span>→</span></button>
      <button onClick={()=>setView('addresses')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">Saved Shopping Address <span>→</span></button>
      <button onClick={()=>setView('settings')} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-left text-[12px] flex justify-between">Account Settings <span>→</span></button>
      <button onClick={()=>setView('become')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Become a Vendor - {profile?.is_vendor ? 'Edit Profile' : '5 Followers OK'} →</button>
      <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    </div>
  )
}

function Cart({ user }){
  const [orders, setOrders] = useState([])
  useEffect(()=>{ supabase.from('orders').select('*').eq('user_id', user.id).then(({data})=>setOrders(data||[])) },[])
  return (
    <div className="p-4">
      <h2 className="font-black">Shopping Bag</h2>
      <p className="text-[10px] text-zinc-500 mt-1">Only Faster Shop Store products can be paid here. Other vendors — order via in-app chat.</p>
      <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
        <p className="text-[12px] font-bold">Faster Shop Store</p>
        <p className="text-[10px] text-zinc-500 mt-2">Your store profile will have products here soon. For launch, chat vendors in Messages.</p>
      </div>
    </div>
  )
}

function AuthForm({ mode, setMode }){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [loading,setLoading]=useState(false)
  const handle=async(e)=>{e.preventDefault(); setLoading(true); try{ if(mode==='signup'){ const {error}=await supabase.auth.signUp({email,password:pass}); if(error)throw error; alert('Account created! Now login'); setMode('login')} else { const {error}=await supabase.auth.signInWithPassword({email,password:pass}); if(error)throw error } } catch(err){alert(err.message)} finally{setLoading(false)} }
  return (<form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-white text-sm" /><button disabled={loading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{loading?'Loading...':mode==='signup'?'Create Account':'Login'}</button><p className="text-xs text-center text-zinc-500">{mode==='signup'?'Have account? ':'No account? '}<span onClick={()=>setMode(mode==='signup'?'login':'signup')} className="text-[#39FF14] cursor-pointer">{mode==='signup'?'Login':'Create'}</span></p></form>)
}