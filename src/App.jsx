import EventsList from './components/EventsList';
import FasterFinds from './components/FasterFinds';
import AdminPanel from './components/AdminPanel';
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './lib/supabase'
import ClothesRain from "./components/ClothesRain";
const CATS=['All','Men','Hoodies','Caps','Perfumes','Shoes','Bags']
const ADMIN_EMAILS=['terrence@faster.shop','terrence@fastersub.ng','terrence@fastershop.ng']

function useFollowerCounts(userId){
  const [counts,setCounts]=useState({followers:0,following:0})
  const refresh=useCallback(async()=>{
    if(!userId)return
    const [followersResult,followingResult]=await Promise.all([
      supabase.from('vendor_followers').select('*',{count:'exact',head:true}).eq('vendor_id',userId),
      supabase.from('vendor_followers').select('*',{count:'exact',head:true}).eq('follower_id',userId)
    ])
    if(followersResult.error||followingResult.error){console.error('Failed to load vendor follower counts',followersResult.error||followingResult.error);return}
    setCounts({followers:followersResult.count??0,following:followingResult.count??0})
  },[userId])
  useEffect(()=>{
    if(!userId)return
    const channel=supabase.channel(`vendor-followers-${userId}`)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'vendor_followers',filter:`vendor_id=eq.${userId}`},refresh)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'vendor_followers',filter:`follower_id=eq.${userId}`},refresh)
      .on('postgres_changes',{event:'DELETE',schema:'public',table:'vendor_followers'},refresh)
      .subscribe()
    refresh()
    return()=>supabase.removeChannel(channel)
  },[userId,refresh])
  return {...counts,refresh}
}

// ===== UCHE - FASTER SHOP SUPPORT CHAT - FIXED SPOT =====
function UcheChat({ user, profile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'uche', text: "Hi! I'm Uche, your Faster Shop helper 👋 What is wrong? I go sort am quick." }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);
  const quickButtons = ["My order never arrived","Wrong item / wrong size","Vendor is not replying","I want refund / return","How to buy?","How to sell?","Report a vendor","Delivery wahala"];
  const getUcheReply = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("never arrived") || m.includes("order never") || m.includes("no delivery")) return "Sorry about that, I go sort am. Send me: 1. Vendor name 2. What you ordered 3. When you paid. If e don pass 3 days, I go freeze payment so your money safe and send to Faster Shop team.";
    if (m.includes("wrong") || m.includes("size") || m.includes("different")) return "No wahala. Send photo of what you received + what you ordered. I go contact vendor now. You fit get refund or replacement. No go pay again outside app.";
    if (m.includes("not replying") || m.includes("no reply") || m.includes("vendor no")) return "I don enter am. I go message vendor now. If vendor no reply in 24 hours, we go refund you or find another vendor for you. What is vendor name?";
    if (m.includes("refund") || m.includes("return")) return "Okay for refund: I need 1. Order / vendor name 2. Photo of item 3. Reason. Send them here, I don send this to Faster Shop team, dem go contact you in 30 mins.";
    if (m.includes("how to buy") || m.includes("buy")) return "To buy: 1. Find your fit - browse drops 2. Chat vendor - ask price, size, delivery 3. Pay INSIDE Faster Shop - never pay outside, so we fit protect you 4. Receive your package. If vendor asks to pay outside, report am!";
    if (m.includes("how to sell") || m.includes("sell") || m.includes("vendor")) return "To sell: 1. Sign up as vendor on website 2. Post product - clear photo, price, size 3. Reply fast to buyers 4. Sell & Grow - become Top Seller. You want vendor signup link?";
    if (m.includes("report") || m.includes("scam") || m.includes("fraud") || m.includes("fake")) return "Thank you for reporting, you dey protect everybody. Tell me vendor name + what dem do + screenshot if you get. I go send to Faster Shop team now and hide their store if e serious.";
    if (m.includes("delivery") || m.includes("deliver") || m.includes("rider")) return "Delivery for Lagos is usually 1-3 days. If e don pass 3 days, tell me vendor name + what you ordered, I go track am for you.";
    if (m.includes("hi") || m.includes("hello") || m.includes("good morning") || m.includes("good evening")) return "Hi my guy! Welcome to Faster Shop. You wan buy or sell today? Or you get complaint? Tap one button below.";
    if (m.includes("price") || m.includes("cost") || m.includes("how much")) return "Price dey on each product. If price no clear, chat vendor inside app and ask. Never agree price for WhatsApp, keep am for Faster Shop so we fit help you if wahala.";
    if (m.includes("thank") || m.includes("thanks")) return "You welcome! Anytime you need help, I dey here. Lagos shops here, Faster Shop dey for you ⚡";
    return "I hear you. Tell me small more: Is it about order, vendor, refund or delivery? Or tap one quick button below, I go help you sharp sharp.";
  };
  const saveToSupabase = async (text, sender) => {
    try {
      await supabase.from('uche_chats').insert({ user_id: user?.id || null, user_email: user?.email || profile?.email || 'guest', user_name: profile?.vendor_name || user?.email?.split('@')[0] || 'Guest', message: text, sender, topic: 'general', status: 'open' });
    } catch (e) { console.log('Uche save failed', e); }
  };
  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    const clean = text.trim();
    setMessages(prev => [...prev, { sender: 'user', text: clean }]);
    setInput(""); setSending(true); saveToSupabase(clean, 'user');
    setTimeout(async () => {
      const reply = getUcheReply(clean);
      setMessages(prev => [...prev, { sender: 'uche', text: reply }]);
      saveToSupabase(reply, 'uche');
      if (clean.toLowerCase().includes('refund') || clean.toLowerCase().includes('report') || clean.toLowerCase().includes('scam') || clean.toLowerCase().includes('never arrived')) {
        setMessages(prev => [...prev, { sender: 'uche', text: "I don send this to Faster Shop team. Dem go check am. Keep your chat here, no delete am." }]);
      }
      setSending(false);
    }, 700);
  };
  return (
    <>
      {!open && (<button onClick={() => setOpen(true)} className="fixed bottom-[84px] right-4 z-[9999] w-[56px] h-[56px] rounded-full bg-white text-black font-black text-[24px] shadow-2xl border-4 border-[#39FF14] flex items-center justify-center active:scale-95 transition">💬</button>)}
      {open && (
        <div className="fixed z-[9999] overflow-hidden bg-white text-black rounded-[20px] shadow-2xl flex flex-col border border-zinc-200 bottom-[84px] right-3 left-auto w-[calc(100vw-24px)] max-w-[360px] h-[520px] max-h-[calc(100vh-170px)] sm:right-4 sm:w-[360px]">
          <div className="bg-black text-white p-3 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2"><div className="w-9 h-9 bg-[#39FF14] rounded-full flex items-center justify-center text-[20px]">🤖</div><div><p className="font-black text-[13px] leading-none">Uche - Faster Shop</p><p className="text-[10px] text-[#39FF14] mt-1">● Online - Replies instantly</p></div></div>
            <button onClick={() => setOpen(false)} className="text-[18px] px-2">✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 bg-zinc-100 space-y-2">
            {messages.map((msg, i) => (<div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${msg.sender === 'user' ? 'ml-auto bg-black text-white rounded-br-md' : 'mr-auto bg-white border border-zinc-200 rounded-bl-md'}`}>{msg.text}</div>))}
            {sending && <div className="mr-auto bg-white border px-3 py-2 rounded-2xl text-[12px] text-zinc-500">Uche dey type...</div>}
            {messages.length <= 2 && (<div className="flex flex-wrap gap-1.5 pt-2">{quickButtons.map(btn => (<button key={btn} onClick={() => sendMessage(btn)} className="bg-white border border-zinc-300 rounded-full px-3 py-1.5 text-[11px] font-bold">{btn}</button>))}</div>)}
          </div>
          <div className="flex gap-2 p-2 border-t bg-white shrink-0"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} placeholder="Ask Uche anything..." className="flex-1 bg-zinc-100 rounded-full px-4 py-2.5 text-[13px] outline-none" /><button onClick={() => sendMessage(input)} className="bg-black text-white w-10 h-10 rounded-full font-black shrink-0">➤</button></div>
          <p className="text-center text-[9px] text-zinc-400 pb-2 bg-white">Uche saves your complaint for Faster Shop team • Never pay outside app</p>
        </div>
      )}
    </>
  );
}

// ===== MESSAGES - FIXED - WAS MISSING BEFORE =====
function MessagesListWithActions({ user, vendors, fasterShop, profile, onSelect, onViewProfile }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(200);
        if (!error && data && data.length > 0) {
          const map = {};
          data.forEach(m => {
            const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
            if (!map[otherId]) map[otherId] = { id: otherId, lastMessage: m.text || m.message || m.content || '', lastAt: m.created_at, unread: 0 };
            if (m.receiver_id === user.id && !m.is_read) map[otherId].unread += 1;
          });
          const { data: profs } = await supabase.from('profiles').select('*').in('id', Object.keys(map));
          const list = Object.values(map).map(c => {
            const p = (profs || []).find(x => x.id === c.id) || (vendors || []).find(x => x.id === c.id) || (fasterShop?.id === c.id ? fasterShop : null);
            return { ...c, vendor: p || { id: c.id, vendor_name: 'User', avatar_url: '' } };
          });
          setChats(list);
        } else {
          setChats([]);
        }
      } catch (e) { setChats([]); }
      setLoading(false);
    };
    load();
  }, [user?.id]);
  const allVendors = [...(fasterShop ? [fasterShop] : []), ...(vendors || [])].filter(v => v.id !== user.id);
  const filteredChats = chats.filter(c => !search || (c.vendor?.vendor_name || '').toLowerCase().includes(search.toLowerCase()));
  const filteredVendors = allVendors.filter(v => !search || (v.vendor_name || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4">
      <h2 className="font-black text-[18px]">Messages 💬</h2>
      <p className="text-[11px] text-zinc-500 mt-1">Chat vendors inside Faster Shop — never pay outside app</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..." className="w-full mt-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[12px] outline-none" />
      {loading && <p className="text-[11px] text-zinc-500 text-center mt-8">Loading chats...</p>}
      {!loading && filteredChats.length === 0 && (
        <div className="mt-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center"><p className="text-[28px]">💬</p><p className="text-[12px] font-bold mt-2">No chats yet</p><p className="text-[11px] text-zinc-500 mt-1">Tap a vendor below to start chatting. Your chats will show here.</p></div>
          <p className="text-[12px] font-black mt-5 mb-2">Start a chat — Vendors</p>
          <div className="space-y-2">{filteredVendors.length === 0 ? <p className="text-[11px] text-zinc-500">No vendors found</p> : filteredVendors.slice(0, 20).map(v => (
            <button key={v.id} onClick={() => onSelect(v)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex gap-3 items-center text-left"><img src={v.avatar_url || ''} className="w-11 h-11 rounded-full object-cover bg-zinc-800" alt="" /><div className="flex-1 min-w-0"><p className="text-[12px] font-bold truncate">{v.vendor_name}</p><p className="text-[10px] text-zinc-400 truncate">{v.bio || 'Tap to chat'}</p></div><span className="text-[10px] bg-[#39FF14] text-black px-3 py-1.5 rounded-full font-black">Chat →</span></button>
          ))}</div>
        </div>
      )}
      {!loading && filteredChats.length > 0 && (
        <div className="mt-4 space-y-2">
          {filteredChats.map(c => (
            <button key={c.id} onClick={() => onSelect(c.vendor)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex gap-3 items-center text-left"><img src={c.vendor?.avatar_url || ''} className="w-11 h-11 rounded-full object-cover bg-zinc-800" alt="" /><div className="flex-1 min-w-0"><div className="flex justify-between"><p className="text-[12px] font-bold truncate">{c.vendor?.vendor_name || 'User'}</p>{c.lastAt && <span className="text-[9px] text-zinc-500 shrink-0 ml-2">{new Date(c.lastAt).toLocaleDateString()}</span>}</div><p className="text-[11px] text-zinc-400 truncate mt-0.5">{c.lastMessage || 'Tap to chat'}</p></div>{c.unread > 0 && <span className="bg-[#39FF14] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">{c.unread}</span>}</button>
          ))}
          <p className="text-[11px] font-black mt-5 mb-1">All vendors</p>
          {filteredVendors.slice(0, 10).map(v => (
            <button key={v.id} onClick={() => onSelect(v)} className="w-full bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-2xl flex gap-3 items-center text-left opacity-80"><img src={v.avatar_url || ''} className="w-9 h-9 rounded-full object-cover bg-zinc-800" alt="" /><p className="text-[12px] font-bold">{v.vendor_name}</p><span className="ml-auto text-[10px] text-zinc-500">New chat →</span></button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatRoomWithActions({ user, vendor, product, onBack, onViewProfile, profile }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs]);
  useEffect(() => {
    if (!vendor?.id) return;
    const load = async () => {
      try {
        const { data, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${vendor.id}),and(sender_id.eq.${vendor.id},receiver_id.eq.${user.id})`).order('created_at', { ascending: true });
        if (!error && data) setMsgs(data.map(m => ({ id: m.id, sender_id: m.sender_id, text: m.text || m.message || m.content || '', created_at: m.created_at })));
        else setMsgs([]);
      } catch (e) { setMsgs([]); }
    };
    load();
    const ch = supabase.channel(`chat-${user.id}-${vendor.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => {
      const m = p.new;
      const isThisChat = (m.sender_id === user.id && m.receiver_id === vendor.id) || (m.sender_id === vendor.id && m.receiver_id === user.id);
      if (isThisChat) setMsgs(prev => [...prev, { id: m.id, sender_id: m.sender_id, text: m.text || m.message || m.content || '', created_at: m.created_at }]);
    }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [vendor?.id, user?.id]);
  const send = async () => {
    if (!text.trim() || sending) return;
    const clean = text.trim();
    const tempId = 'temp-' + Date.now();
    setMsgs(prev => [...prev, { id: tempId, sender_id: user.id, text: clean, created_at: new Date().toISOString() }]);
    setText(''); setSending(true);
    try {
      const { data, error } = await supabase.from('messages').insert({ sender_id: user.id, receiver_id: vendor.id, text: clean, message: clean, content: clean, product_id: product?.id || null }).select().single();
      if (error) {
        const { error: e2 } = await supabase.from('messages').insert({ sender_id: user.id, receiver_id: vendor.id, text: clean }).select().single();
        if (e2) console.log('Send failed, showing locally only', e2);
      }
      try { await supabase.from('notifications').insert({ user_id: vendor.id, actor_id: user.id, actor_name: profile?.vendor_name || user.email?.split('@')[0] || 'User', type: 'message', title: 'New message', message: clean, product_id: product?.id || null }); } catch (e) {}
    } catch (e) { console.log('Send error', e); }
    setSending(false);
  };
  if (!vendor) return <div className="p-6 text-center"><p className="text-[12px]">No vendor selected</p><button onClick={onBack} className="mt-3 bg-white text-black px-5 py-2 rounded-full text-[11px] font-bold">Back to Messages</button></div>;
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="p-3 flex items-center gap-3 border-b border-zinc-900 bg-black sticky top-0">
        <button onClick={onBack} className="text-[14px]">←</button>
        <button onClick={() => onViewProfile && onViewProfile(vendor)} className="flex items-center gap-2 flex-1 text-left"><img src={vendor.avatar_url || ''} className="w-9 h-9 rounded-full object-cover bg-zinc-800" alt="" /><div><p className="text-[12px] font-black leading-none">{vendor.vendor_name}</p><p className="text-[10px] text-[#39FF14] mt-1">● Online • Replies fast</p></div></button>
        <button onClick={() => onViewProfile && onViewProfile(vendor)} className="text-[11px] bg-zinc-900 px-3 py-2 rounded-full">View Shop</button>
      </div>
      {product && (<div className="mx-3 mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 flex gap-3 items-center"><img src={product.images?.[0] || ''} className="w-12 h-12 rounded-xl object-cover bg-zinc-800" alt="" /><div className="flex-1 min-w-0"><p className="text-[11px] font-bold truncate">{product.title || product.name}</p><p className="text-[10px] text-[#39FF14] font-black">₦{product.price} {product.size ? `• Size: ${product.size}` : ''}</p></div></div>)}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.length === 0 && (<div className="text-center mt-10 px-6"><p className="text-[28px]">👋</p><p className="text-[12px] font-bold mt-2">Say hi to {vendor.vendor_name}</p><p className="text-[11px] text-zinc-500 mt-1">Ask about price, size, delivery. Pay INSIDE Faster Shop only — never pay outside app.</p><div className="flex flex-wrap gap-2 justify-center mt-4">{['Is this available?', 'What sizes do you have?', 'How much is delivery to Lagos?', 'Can I see more photos?'].map(q => (<button key={q} onClick={() => setText(q)} className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-full text-[11px]">{q}</button>))}</div></div>)}
        {msgs.map(m => (<div key={m.id} className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${m.sender_id === user.id ? 'ml-auto bg-[#39FF14] text-black rounded-br-md' : 'mr-auto bg-zinc-900 border border-zinc-800 rounded-bl-md'}`}>{m.text}</div>))}
      </div>
      <div className="p-3 border-t border-zinc-900 bg-black flex gap-2 pb-4"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Message ${vendor.vendor_name}...`} className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-[13px] outline-none" /><button onClick={send} disabled={sending} className="bg-[#39FF14] text-black w-11 h-11 rounded-full font-black shrink-0">➤</button></div>
      <p className="text-center text-[9px] text-zinc-500 pb-2">⚠️ Never pay outside Faster Shop — you lose buyer protection</p>
    </div>
  );
}

export default function App(){
  const [user,setUser]=useState(null)
  const [profile,setProfile]=useState(null)
  const [tab,setTab]=useState('home')
  const [vendors,setVendors]=useState([])
  const [fasterShop,setFasterShop]=useState(null)
  const [products,setProducts]=useState([])
  const [stories,setStories]=useState([])
  const [selectedVendor,setSelectedVendor]=useState(null)
  const [selectedChat,setSelectedChat]=useState(null)
  const [selectedProduct,setSelectedProduct]=useState(null)
  const [activeStories,setActiveStories]=useState(null)
  const [activeStoryIdx,setActiveStoryIdx]=useState(0)
  const [selectedCategory,setSelectedCategory]=useState('All')
  const [cart,setCart]=useState([])
  const [followMap,setFollowMap]=useState({})
  const [likes,setLikes]=useState({})
  const [comments,setComments]=useState({})
  const [notifications,setNotifications]=useState([])
  const currentEmail=(user?.email||profile?.email||'').toLowerCase().trim()
  const isAdmin=ADMIN_EMAILS.includes(currentEmail)||profile?.is_faster_shop===true
  useEffect(()=>{supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))},[])
  useEffect(()=>{if(user)loadAll()},[user])
  useEffect(()=>{
    if(!user)return
    const ch=supabase.channel(`notifs-${user.id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${user.id}`},p=>setNotifications(prev=>[p.new,...prev])).subscribe()
    return()=>supabase.removeChannel(ch)
  },[user?.id])
  const loadAll=async()=>{
    let {data:p}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()
    if(!p){
      const wantedRole = localStorage.getItem('faster_role') || user.user_metadata?.role || 'buyer'
      await supabase.from('profiles').upsert({id:user.id,email:user.email,is_vendor:wantedRole==='vendor',vendor_name:user.email?.split('@')[0]||'Vendor'},{onConflict:'id'})
      const {data:p2}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()
      p=p2
    }
    setProfile(p||null)
    const {data:fs}=await supabase.from('profiles').select('*').eq('is_faster_shop',true).maybeSingle()
    setFasterShop(fs||null)
    const {data:v}=await supabase.from('profiles').select('*').eq('is_vendor',true).order('created_at',{ascending:false})
    setVendors(v||[])
    const {data:prods}=await supabase.from('products').select('*').order('created_at',{ascending:false})
    setProducts(prods||[])
    const {data:s}=await supabase.from('stories').select('*').gt('expires_at',new Date().toISOString()).order('created_at',{ascending:false})
    setStories(s||[])
    if(user){
      const {data:follows}=await supabase.from('follows').select('following_id').eq('follower_id',user.id)
      const m={};follows?.forEach(f=>m[f.following_id]=true);setFollowMap(m)
      const {data:lk}=await supabase.from('likes').select('*').eq('user_id',user.id)
      const lm={};lk?.forEach(l=>lm[l.product_id]=true);setLikes(lm)
      const {data:cm}=await supabase.from('comments').select('*').order('created_at',{ascending:true})
      const cmap={};cm?.forEach(c=>{if(!cmap[c.product_id])cmap[c.product_id]=[];cmap[c.product_id].push(c)});setComments(cmap)
      const {data:notifs}=await supabase.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(200)
      setNotifications(notifs||[])
    }
  }
  const sendNotif=async(targetUserId,type,title,message,product_id)=>{
    if(!targetUserId||targetUserId===user.id)return
    try{await supabase.from('notifications').insert({user_id:targetUserId,actor_id:user.id,actor_name:profile?.vendor_name||user.email?.split('@')[0]||'User',type,title,message,product_id})}catch(e){}
  }
  const unreadCount=notifications.filter(n=>!n.is_read).length
  const markNotifsRead=async()=>{if(!unreadCount)return;await supabase.from('notifications').update({is_read:true}).eq('user_id',user.id).eq('is_read',false);setNotifications(prev=>prev.map(n=>({...n,is_read:true})))}
  const getVendor=(id)=>{if(!id)return null;if(fasterShop?.id===id)return fasterShop;return vendors.find(v=>v.id===id)||(profile?.id===id?profile:null)||null}
  const toggleLike=async(pid)=>{
    const isLiked=likes[pid]
    const prod=products.find(x=>x.id===pid)
    if(isLiked){await supabase.from('likes').delete().eq('user_id',user.id).eq('product_id',pid);const n={...likes};delete n[pid];setLikes(n)}
    else{await supabase.from('likes').insert({user_id:user.id,product_id:pid});setLikes({...likes,[pid]:true});if(prod)sendNotif(prod.vendor_id,'like','Liked your product',`liked your post: ${prod.title||prod.name}`,pid)}
  }
  const addComment=async(pid,text)=>{
    if(!text.trim())return
    const {data}=await supabase.from('comments').insert({user_id:user.id,product_id:pid,text}).select().single()
    if(data){
      setComments(prev=>({...prev,[pid]:[...(prev[pid]||[]),data]}))
      const prod=products.find(x=>x.id===pid)
      if(prod) sendNotif(prod.vendor_id,'comment','New comment',`commented: "${text}" on ${prod.title||prod.name}`,pid)
    }
  }
  const deletePost=async(pid)=>{
    if(!confirm('Delete this post?'))return
    await supabase.from('products').delete().eq('id',pid)
    setProducts(prev=>prev.filter(p=>p.id!==pid))
  }
  const openStories=(list)=>{if(!list||!list.length)return;setActiveStories(list);setActiveStoryIdx(0)}
  const handleDM=(v,p)=>{ if(!v) return; if(v.id===user.id){ alert("You can't message yourself"); return } setSelectedChat(v); setSelectedProduct(p); setTab('chat') }
  if(!user) return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <ClothesRain />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div>
        <h1 className="font-black mt-3 tracking-widest">FASTER SHOP</h1>
        <p className="text-[11px] text-zinc-300 mt-1 mb-4">Lagos fashion is raining 👕👗🧢</p>
        <AuthForm/>
        <button onClick={()=>alert("Hi! I'm Uche. Login to chat with me for full support. For now: To buy - browse drops, chat vendor, pay inside app. To sell - sign up as vendor. If order wahala - never pay outside app!")} className="mt-4 bg-white text-black px-5 py-2.5 rounded-full text-[11px] font-black">💬 Chat Uche - Need Help?</button>
      </div>
    </div>
  )
  return(
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="w-9 h-9 bg-white text-black font-black flex items-center justify-center rounded-lg text-[15px]">F</div>
        <button onClick={()=>{setTab('notifications');markNotifsRead()}} className="relative w-9 h-9 flex items-center justify-center text-[18px]">🔔{unreadCount>0&&<span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">{unreadCount>9?'9+':unreadCount}</span>}</button>
        <button onClick={()=>setTab('settings')} className="w-9 h-9 flex items-center justify-center text-[18px]">⚙️</button>
      </div>
      {activeStories&&<StoryViewer stories={activeStories} idx={activeStoryIdx} setIdx={setActiveStoryIdx} onClose={()=>setActiveStories(null)} getVendor={getVendor}/>}
      {tab==='home'&&<Home products={products} stories={stories} fasterShop={fasterShop} vendors={vendors} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}} onDM={handleDM} onStoryClick={openStories} getVendor={getVendor} user={user} likes={likes} toggleLike={toggleLike} comments={comments} addComment={addComment} deletePost={deletePost} vendorsList={vendors} profile={profile}/>}
      {tab==='shop'&&<Shop products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} getVendor={getVendor} user={user} likes={likes} toggleLike={toggleLike}/>}
      {tab==='search'&&<><Search vendors={vendors} fasterShop={fasterShop} products={products} getVendor={getVendor} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}}/><FasterFinds /><EventsList /></>}
      {tab==='vendor'&&<VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} stories={stories.filter(s=>(s.vendor_id===selectedVendor?.id||s.user_id===selectedVendor?.id))} onBack={()=>setTab('home')} onStoryClick={openStories} reload={loadAll} followMap={followMap} setFollowMap={setFollowMap} fasterShop={fasterShop} sendNotif={sendNotif} getVendor={getVendor}/>}
      {tab==='messages'&&<MessagesListWithActions user={user} vendors={vendors} fasterShop={fasterShop} profile={profile} onSelect={(v)=>{if(v.id===user.id) return; setSelectedChat(v);setTab('chat')}} onViewProfile={(v)=>{setSelectedVendor(v);setTab('vendor')}}/>}
      {tab==='chat'&&<ChatRoomWithActions user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')} onViewProfile={(v)=>{setSelectedVendor(v);setTab('vendor')}} profile={profile}/>}
      {tab==='cart'&&<div className="p-4"><h2 className="font-black text-[13px]">Cart — Fastershop Store Only</h2>{cart.length===0?<p className="text-[11px] text-zinc-500 mt-6">Empty</p>:cart.map((p,i)=><div key={i} className="bg-zinc-900 p-3 rounded-xl flex gap-3 mt-2"><img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" /><div><p className="text-[11px] font-bold">{p.title||p.name}</p><p className="text-[10px] text-zinc-400">{p.price}</p></div></div>)}<button className="w-full mt-4 bg-[#39FF14] text-black font-black py-3 rounded-full text-[11px]">Pay with Paystack</button></div>}
      {tab==='profile'&&<>
        {profile?.is_vendor ? (<Profile user={user} profile={profile} products={products.filter(p=>p.vendor_id===user.id)} reload={loadAll} getVendor={getVendor}/>) : (<BuyerProfile user={user} profile={profile} reload={loadAll} setTab={setTab} products={products} likes={likes} getVendor={getVendor} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}} />)}
        {isAdmin && <><div className="mx-4 mt-6 mb-2 border-t-2 border-[#39FF14] pt-4"><p className="text-[12px] font-black">⚙️ ADMIN PANEL — Faster Shop Control</p><p className="text-[10px] text-zinc-500">Logged in as: {currentEmail||'unknown'} • ADMIN ✅</p></div><AdminPanel user={user} profile={profile} /></>}
      </>}
      {tab==='notifications'&&<Notifications notifications={notifications} products={products} getVendor={getVendor} onBack={()=>setTab('home')} onOpenProduct={(p)=>{const v=getVendor(p?.vendor_id);if(v){setSelectedVendor(v);setTab('vendor')}}} onOpenChat={(actorId)=>{const v=getVendor(actorId);if(v && v.id!==user.id){setSelectedChat(v);setTab('chat')}}} onClear={async()=>{await supabase.from('notifications').update({is_read:true}).eq('user_id',user.id);setNotifications(prev=>prev.map(n=>({...n,is_read:true})))}}/>}
      {tab==='settings'&&<Settings user={user} profile={profile} reload={loadAll} onBack={()=>setTab('profile')}/>}
      <UcheChat user={user} profile={profile} />
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3 text-[10px]">
        <button onClick={()=>setTab('home')} className={tab==='home'?'text-white font-black':'text-zinc-500'}>Home</button>
        <button onClick={()=>setTab('search')} className={tab==='search'?'text-white font-black':'text-zinc-500'}>Search</button>
        <button onClick={()=>setTab('shop')} className={tab==='shop'?'text-white font-black':'text-zinc-500'}>Shop</button>
        <button onClick={()=>setTab('cart')} className={tab==='cart'?'text-white font-black':'text-zinc-500'}>Cart</button>
        <button onClick={()=>setTab('messages')} className={tab==='messages'?'text-white font-black':'text-zinc-500'}>Messages</button>
        <button onClick={()=>setTab('profile')} className={tab==='profile'?'text-white font-black':'text-zinc-500'}>Profile</button>
      </div>
    </div>
  )
}

function AuthForm(){
  const [mode,setMode]=useState('login')
  const [role,setRole]=useState('buyer')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const submit=async(e)=>{
    e.preventDefault()
    if(!email||!password) return alert('Enter email + password')
    setLoading(true)
    try{
      if(mode==='login'){
        const res = await supabase.auth.signInWithPassword({email,password})
        if(res.error) throw res.error
      } else {
        localStorage.setItem('faster_role', role)
        const res = await supabase.auth.signUp({email,password, options:{ data:{ role } }})
        if(res.error) throw res.error
        alert(role==='vendor' ? 'Vendor account created! Check your email, then login.' : 'Buyer account created! Check your email, then login.')
      }
    }catch(err){ alert(err.message) } finally{ setLoading(false) }
  }
  return (
    <form onSubmit={submit} className="w-full max-w-[340px] bg-black/70 backdrop-blur-md border border-white/20 rounded-[24px] p-5 space-y-3 shadow-2xl">
      <div className="flex bg-zinc-900 rounded-full p-1">
        <button type="button" onClick={()=>setMode('login')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${mode==='login'?'bg-white text-black':'text-zinc-400'}`}>Login</button>
        <button type="button" onClick={()=>setMode('signup')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${mode==='signup'?'bg-white text-black':'text-zinc-400'}`}>Sign Up</button>
      </div>
      {mode==='signup' && (
        <div className="flex bg-zinc-900 rounded-full p-1">
          <button type="button" onClick={()=>setRole('buyer')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${role==='buyer'?'bg-[#39FF14] text-black':'text-zinc-400'}`}>🛍️ Buyer</button>
          <button type="button" onClick={()=>setRole('vendor')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${role==='vendor'?'bg-[#39FF14] text-black':'text-zinc-400'}`}>🏪 Vendor</button>
        </div>
      )}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-3 text-[13px] outline-none focus:border-[#39FF14]"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-3 text-[13px] outline-none focus:border-[#39FF14]"/>
      <button disabled={loading} className="w-full bg-[#39FF14] text-black font-black py-3.5 rounded-full text-[13px]">{loading?'Please wait...':mode==='login'?'Login →':'Create Account →'}</button>
      <p className="text-center text-[10px] text-zinc-400">{mode==='login'?'New here? Tap Sign Up above 👆':'Already have account? Tap Login 👆'}</p>
    </form>
  )
}

function StoryViewer({stories,idx,setIdx,onClose,getVendor}){
  const curr=stories[idx]
  useEffect(()=>{const t=setTimeout(()=>{if(idx<stories.length-1)setIdx(idx+1);else onClose()},5000);return()=>clearTimeout(t)},[idx,stories.length])
  if(!curr)return null
  const v=getVendor(curr.vendor_id||curr.user_id)
  return <div className="fixed inset-0 z-[100] bg-black flex flex-col">
    <div className="flex gap-1 p-2">{stories.map((_,i)=><div key={i} className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full bg-white ${i<idx?'w-full':i===idx?'w-1/2':''}`}/></div>)}</div>
    <div className="p-4 flex gap-3 items-center"><img src={v?.avatar_url} className="w-8 h-8 rounded-full object-cover" /><p className="text-[11px] font-bold">{v?.vendor_name||'Vendor'}</p><span className="text-[10px] text-zinc-500">{new Date(curr.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span><button onClick={onClose} className="ml-auto">✕</button></div>
    <div className="flex-1 relative flex items-center justify-center" onClick={(e)=>{if(e.clientX<window.innerWidth/2)setIdx(Math.max(0,idx-1));else if(idx<stories.length-1)setIdx(idx+1);else onClose()}}><img src={curr.image_url||curr.media_url||curr.url} className="max-h-[75vh] w-full object-contain" alt="" /></div>
    <p className="text-center text-[10px] text-zinc-500 pb-4">{idx+1}/{stories.length} • Tap left / right • Expires {new Date(curr.expires_at).toLocaleString()}</p>
  </div>
}

function Search({vendors,fasterShop,products,getVendor,onOpenVendor}){
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('All')
  const all=[...(fasterShop?[fasterShop]:[]),...vendors]
  const query=q.trim().toLowerCase()
  const TRENDING=['Agbada','Hoodies','Caps','Perfumes','Shoes','Bags','Aso Oke','Streetwear']
  const CATS2=['All','Men','Women','Traditional','Streetwear','Shoes','Bags']
  const vFiltered=all.filter(v=>!query||(v.vendor_name||'').toLowerCase().includes(query)||(v.bio||'').toLowerCase().includes(query))
  const pFiltered=products.filter(p=>{
    const matchesQ=!query||(p.title||p.name||'').toLowerCase().includes(query)||(p.category||'').toLowerCase().includes(query)
    const matchesCat=cat==='All'||(p.category||'').toLowerCase().includes(cat.toLowerCase())||(p.title||'').toLowerCase().includes(cat.toLowerCase())
    return matchesQ&&matchesCat
  })
  return <div className="p-4 space-y-4">
    <div><h2 className="font-black text-[20px] leading-none">Find your fit 🔍</h2><p className="text-[11px] text-zinc-500 mt-1">Search vendors, drops & Lagos fashion</p></div>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px]">🔍</span>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Agbada, Hoodies, Rossa..." className="w-full bg-zinc-900 border-2 border-[#39FF14]/40 focus:border-[#39FF14] outline-none rounded-full pl-11 pr-10 py-3.5 text-[13px] placeholder:text-zinc-500 shadow-[0_0_20px_rgba(57,255,20,0.15)]" />
      {q&&<button onClick={()=>setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-800 w-6 h-6 rounded-full text-[11px]">✕</button>}
    </div>
    <div><p className="text-[10px] font-black tracking-widest text-zinc-500 mb-2">🔥 TRENDING NOW</p><div className="flex gap-2 overflow-x-auto pb-1">{TRENDING.map(t=><button key={t} onClick={()=>setQ(t)} className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold border ${q===t?'bg-[#39FF14] text-black border-[#39FF14]':'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>{t}</button>)}</div></div>
    <div><p className="text-[10px] font-black tracking-widest text-zinc-500 mb-2">CATEGORIES</p><div className="flex gap-2 overflow-x-auto pb-1">{CATS2.map(c=><button key={c} onClick={()=>setCat(c)} className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold border ${cat===c?'bg-white text-black border-white':'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{c}</button>)}</div></div>
    <div>
      <div className="flex justify-between items-center mb-2"><p className="text-[12px] font-black">Vendors {vFiltered.length>0&&<span className="text-zinc-500 font-normal">({vFiltered.length})</span>}</p><p className="text-[10px] text-[#39FF14] font-bold">Swipe →</p></div>
      {vFiltered.length===0?<p className="text-[11px] text-zinc-500 bg-zinc-900 p-4 rounded-2xl text-center">No vendors found for "{q}"</p>:<div className="flex gap-3 overflow-x-auto pb-1">{vFiltered.map(v=><button key={v.id} onClick={()=>onOpenVendor(v)} className="shrink-0 w-[140px] bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left"><img src={v.avatar_url||''} className="w-14 h-14 rounded-full object-cover bg-zinc-800 border-2 border-[#39FF14]" alt="" /><p className="text-[12px] font-bold mt-2 truncate">{v.vendor_name}</p><p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight min-h-[28px]">{v.bio||'Faster Shop vendor'}</p><p className="text-[10px] font-black text-[#39FF14] mt-1">View Shop →</p></button>)}</div>}
    </div>
    <div>
      <p className="text-[12px] font-black mb-2">{query||cat!=='All'?'Results':'Fresh Drops'} {pFiltered.length>0&&<span className="text-zinc-500 font-normal">({pFiltered.length})</span>}</p>
      {pFiltered.length===0?<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center"><p className="text-[24px]">👀</p><p className="text-[12px] font-bold mt-1">Nothing yet</p><p className="text-[11px] text-zinc-500">Try "Agbada" or "Hoodies" — or tap a Trending chip above</p></div>:<div className="grid grid-cols-2 gap-3">{pFiltered.slice(0,20).map(p=>{const v=getVendor(p.vendor_id);return <button key={p.id} onClick={()=>{if(v)onOpenVendor(v)}} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-left"><img src={p.images?.[0]||''} className="w-full h-36 object-cover bg-zinc-800" alt="" /><div className="p-2.5"><p className="text-[11px] font-bold truncate">{p.title||p.name}</p><p className="text-[10px] text-zinc-400 truncate">{v?.vendor_name||'Vendor'}</p><p className="text-[11px] font-black text-[#39FF14] mt-0.5">₦{p.price} <span className="text-zinc-500 font-normal">• {p.category}</span></p></div></button>})}</div>}
    </div>
  </div>
}

function FollowList({title,ids,onClose,onOpenVendor,getVendor}){
  const [list,setList]=useState([])
  useEffect(()=>{const load=async()=>{if(!ids.length){setList([]);return}const {data}=await supabase.from('profiles').select('*').in('id',ids);setList(data||[])};load()},[ids.join(',')])
  return <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col"><div className="p-4 flex justify-between items-center"><p className="font-black text-[13px]">{title} ({list.length})</p><button onClick={onClose}>✕</button></div><div className="p-4 space-y-2 overflow-y-auto">{list.length===0?<p className="text-[11px] text-zinc-500 text-center mt-10">Nobody yet</p>:list.map(v=><button key={v.id} onClick={()=>{onClose();onOpenVendor(v)}} className="w-full bg-zinc-900 p-3 rounded-2xl flex gap-3 items-center text-left"><img src={v.avatar_url||''} className="w-10 h-10 rounded-full object-cover bg-zinc-800" alt="" /><div><p className="text-[12px] font-bold">{v.vendor_name}</p><p className="text-[10px] text-zinc-400">{v.bio||''}</p></div></button>)}</div></div>
}

function Notifications({notifications,products,getVendor,onBack,onOpenProduct,onOpenChat,onClear}){
  const getIcon=(t)=>t==='like'?'❤️':t==='comment'?'💬':t==='follow'?'👤':t==='message'?'✉️':'🔔'
  return <div className="p-4"><div className="flex items-center justify-between mb-4"><div className="flex gap-3 items-center"><button onClick={onBack}>Back</button><h2 className="font-black text-[14px]">Notifications</h2></div>{notifications.length>0&&<button onClick={onClear} className="text-[10px] text-zinc-400">Mark all read</button>}</div>
  {notifications.length===0?<div className="text-center py-16"><p className="text-[32px]">🔔</p><p className="text-[12px] font-bold mt-2">No notifications yet</p><p className="text-[11px] text-zinc-500 mt-1">When someone likes, comments, follows or messages you,<br/>it will show here. History is kept forever.</p></div>:<div className="space-y-2">{notifications.map(n=>{const prod=products.find(p=>p.id===n.product_id);return <button key={n.id} onClick={()=>{if(n.type==='message')onOpenChat(n.actor_id);else if(prod)onOpenProduct(prod)}} className={`w-full text-left bg-zinc-900 border ${n.is_read?'border-zinc-800':'border-[#39FF14]/40'} p-3 rounded-2xl flex gap-3`}><div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[16px] shrink-0">{getIcon(n.type)}</div><div className="flex-1 min-w-0"><p className="text-[11px] font-bold">{n.title} <span className="text-zinc-400 font-normal">• {n.actor_name||''}</span></p><p className="text-[11px] text-zinc-300 mt-0.5 line-clamp-2">{n.message}</p><p className="text-[9px] text-zinc-500 mt-1">{new Date(n.created_at).toLocaleString()}</p></div>{prod?.images?.[0]&&<img src={prod.images[0]} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />}{!n.is_read&&<span className="w-2 h-2 bg-[#39FF14] rounded-full shrink-0 mt-2" />}</button>})}</div>}</div>
}
function PostSlider({images}){
  const [idx,setIdx]=useState(0)
  const imgs=images?.filter(Boolean)||[]
  if(!imgs.length)return <div className="w-full h-80 bg-zinc-900" />
  return <div className="relative w-full h-[380px] bg-black overflow-hidden"><img src={imgs[idx]} className="w-full h-full object-cover" alt="" /><div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">{imgs.map((_,i)=><div key={i} className={`h-1 rounded-full ${i===idx?'w-5 bg-white':'w-1 bg-white/40'}`} />)}</div>{imgs.length>1&&<><button onClick={()=>setIdx((idx-1+imgs.length)%imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 w-7 h-7 rounded-full text-[12px]">‹</button><button onClick={()=>setIdx((idx+1)%imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 w-7 h-7 rounded-full text-[12px]">›</button><div className="absolute top-3 right-3 bg-black/60 text-[9px] px-2 py-1 rounded-full">{idx+1}/{imgs.length}</div></>}</div>
}
function PostCard({p,v,user,likes,toggleLike,comments,addComment,deletePost,onDM,vendorsList,profile}){
  const [showComments,setShowComments]=useState(false)
  const [commentText,setCommentText]=useState('')
  const imgs=p.images||p.image_urls||[]
  const isOwn=user.id===p.vendor_id
  const count=comments[p.id]?.length||0
  const getName=(uid)=>{if(uid===user.id) return 'You';const found=[...(vendorsList||[]),profile].find(x=>x?.id===uid);return found?.vendor_name||found?.email?.split('@')[0]||'User'}
  return <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
    <div className="p-3 flex gap-2 items-center"><img src={v?.avatar_url||``} className="w-8 h-8 rounded-full object-cover" alt="" /><p className="text-[11px] font-bold">{v?.vendor_name||'Vendor'}</p><span className="ml-auto text-[9px] bg-zinc-800 px-2 py-1 rounded-full">{imgs.length} slides</span>{isOwn&&<button onClick={()=>deletePost(p.id)} className="text-[12px] px-2">🗑️</button>}</div>
    <PostSlider images={imgs}/>
    <div className="p-3">
      <div className="flex gap-4 items-center"><button onClick={()=>toggleLike(p.id)} className="text-[16px]">{likes[p.id]?'❤️':'🤍'}</button><button onClick={()=>setShowComments(!showComments)} className="text-[16px]">💬 <span className="text-[11px]">{count}</span></button>{!isOwn&&<button onClick={()=>onDM(v,p)} className="ml-auto bg-white text-black text-[9px] px-3 py-2 rounded-full font-bold">Message</button>}</div>
      <p className="text-[11px] font-bold mt-2">{p.title||p.name}</p><p className="text-[10px] text-zinc-400">₦{p.price} • {p.category}{p.size?` • Size: ${p.size}`:''}</p>
      {p.description&&<p className="text-[10px] text-zinc-300 mt-1 whitespace-pre-wrap">{p.description}</p>}
      {showComments&&<div className="mt-3 space-y-2 border-t border-zinc-800 pt-3">{(comments[p.id]||[]).map(c=><div key={c.id} className="flex gap-2"><p className="text-[10px] font-bold shrink-0">{getName(c.user_id)}</p><p className="text-[10px] text-zinc-300">{c.text}</p></div>)}{(!comments[p.id]||comments[p.id].length===0)&&<p className="text-[10px] text-zinc-500">No comments yet — be first</p>}<div className="flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-zinc-800 rounded-full px-3 py-2 text-[10px]" /><button onClick={()=>{addComment(p.id,commentText);setCommentText('')}} className="bg-white text-black px-3 rounded-full text-[10px] font-bold">Post</button></div></div>}
    </div>
  </div>
}
function Featured({products,onOpenVendor,getVendor}){
  const [i,setI]=useState(0)
  const list=products.filter(p=>p.images?.length>0).slice(0,15)
  useEffect(()=>{if(!list.length)return;const t=setInterval(()=>setI(v=>(v+1)%list.length),4000);return()=>clearInterval(t)},[list.length])
  if(!list.length)return <div className="h-60 bg-gradient-to-br from-zinc-900 to-black border border-[#39FF14]/30 rounded-[24px] flex flex-col items-center justify-center gap-2"><p className="text-[28px]">✨</p><p className="text-[12px] font-bold">Featured Drop</p><p className="text-[11px] text-zinc-500">Your uploads will slide here</p></div>
  const curr=list[i]
  return <div className="h-[260px] rounded-[24px] overflow-hidden relative border border-[#39FF14]/30"><img src={curr.images?.[0]} className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" /><div className="absolute top-3 left-3 flex gap-2"><span className="bg-[#39FF14] text-black text-[9px] px-3 py-1.5 rounded-full font-black">🔥 FEATURED DROP</span><span className="bg-black/70 text-white text-[9px] px-3 py-1.5 rounded-full font-bold">{i+1}/{list.length}</span></div><div className="absolute bottom-0 left-0 right-0 p-4"><h2 className="font-black text-[20px] leading-none">{curr.title||curr.name}</h2><p className="text-[12px] text-zinc-300 mt-1">₦{curr.price} • {curr.category}{curr.size?` • Size: ${curr.size}`:''}</p><button onClick={()=>onOpenVendor(getVendor(curr.vendor_id))} className="mt-3 bg-[#39FF14] text-black px-5 py-2.5 rounded-full text-[11px] font-black">Shop Now →</button></div></div>
}
function getGreeting(){
  const hour = Number(new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',hour:'numeric',hour12:false}).format(new Date()))
  if(hour >= 5 && hour < 12) return { title: 'Good morning, Lagos ☀️', sub: 'Fresh drops from vendors you follow' }
  if(hour >= 12 && hour < 17) return { title: 'Lagos is buzzing 🔥', sub: "Fresh fits just landed — don't sleep on them" }
  if(hour >= 17 && hour < 21) return { title: 'Evening in Lagos hits different 🌇', sub: 'Wind down with fresh drops' }
  return { title: 'Lagos never sleeps 🌙', sub: 'Late night drops for night owls' }
}
function Home({products,stories,fasterShop,vendors,selectedCategory,setSelectedCategory,onOpenVendor,onDM,onStoryClick,getVendor,user,likes,toggleLike,comments,addComment,deletePost,vendorsList,profile}){
  const map={};stories.forEach(s=>{const id=s.vendor_id||s.user_id||s.profile_id; if(id){if(!map[id])map[id]=[];map[id].push(s)}})
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  const greeting=getGreeting()
  return <div className="p-4 space-y-5">
    <div><h1 className="font-black text-[22px] leading-none">{greeting.title}</h1><p className="text-[11px] text-zinc-500 mt-1">{greeting.sub}</p></div>
    <div className="flex gap-3 overflow-x-auto pb-1">
      {fasterShop&&<button onClick={()=>map[fasterShop.id]?onStoryClick(map[fasterShop.id]):onOpenVendor(fasterShop)} className="flex flex-col items-center shrink-0"><div className={`w-[64px] h-[64px] rounded-full p-[2.5px] ${map[fasterShop.id]?'bg-gradient-to-tr from-[#39FF14] to-yellow-400':'bg-[#39FF14]'}`}><img src={fasterShop.avatar_url} className="w-full h-full rounded-full border-[3px] border-black object-cover" alt="" /></div><span className="text-[9px] font-black mt-1">FASTER ⚡</span></button>}
      {vendors.map(v=><button key={v.id} onClick={()=>map[v.id]?onStoryClick(map[v.id]):onOpenVendor(v)} className="flex flex-col items-center shrink-0 min-w-[64px]"><div className={`w-[64px] h-[64px] rounded-full p-[2.5px] ${map[v.id]?'bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-400':'bg-zinc-700'}`}><img src={v.avatar_url||``} className="w-full h-full rounded-full border-[3px] border-black object-cover" alt="" /></div><span className="text-[9px] mt-1 truncate max-w-[64px]">{v.vendor_name?.split(' ')[0]}</span></button>)}
    </div>
    <Featured products={products} onOpenVendor={onOpenVendor} getVendor={getVendor}/>
    <div><p className="text-[10px] font-black tracking-widest text-zinc-500 mb-2">SHOP BY CATEGORY</p><div className="flex gap-2 overflow-x-auto pb-1">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold border ${selectedCategory===c?'bg-[#39FF14] text-black border-[#39FF14]':'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>{c}</button>)}</div></div>
    <div><div className="flex justify-between items-center mb-3"><p className="font-black text-[14px]">Latest Drops</p><span className="text-[10px] text-zinc-500">{filtered.length} posts</span></div><div className="space-y-4">{filtered.length===0?<div className="bg-zinc-900 rounded-[20px] p-8 text-center"><p className="text-[28px]">🛍️</p><p className="text-[12px] font-bold mt-2">No drops in {selectedCategory} yet</p></div>:filtered.map(p=><PostCard key={p.id} p={p} v={getVendor(p.vendor_id)} user={user} likes={likes} toggleLike={toggleLike} comments={comments} addComment={addComment} deletePost={deletePost} onDM={onDM} vendorsList={vendorsList} profile={profile}/>)}</div></div>
  </div>
}
function Shop({products,selectedCategory,setSelectedCategory,getVendor,user,likes,toggleLike}){
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  return <div className="p-4"><div className="flex gap-2 overflow-x-auto pb-3">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`px-4 py-2 rounded-full text-[11px] border ${selectedCategory===c?'bg-white text-black':'bg-zinc-900 border-zinc-800'}`}>{c}</button>)}</div><div className="grid grid-cols-2 gap-3">{filtered.map(p=>{const v=getVendor(p.vendor_id); const img=(p.images||[])[0]; return <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"><div className="relative"><img src={img} className="w-full h-36 object-cover" alt="" />{p.images?.length>1&&<span className="absolute top-2 right-2 bg-black/70 text-[8px] px-2 py-1 rounded-full">{p.images.length} SLIDES</span>}<button onClick={()=>toggleLike(p.id)} className="absolute bottom-2 right-2 bg-black/60 w-7 h-7 rounded-full text-[12px]">{likes[p.id]?'❤️':'🤍'}</button></div><div className="p-2"><p className="text-[10px] font-bold truncate">{p.title||p.name}</p><p className="text-[9px] text-zinc-400">₦{p.price}{p.size?` • Size: ${p.size}`:''} • {v?.vendor_name}</p></div></div>})}</div></div>
}

function VendorProfile({vendor,currentUser,products,stories,onBack,onStoryClick,reload,followMap,setFollowMap,fasterShop,sendNotif,getVendor}){
  const {followers,following,refresh:refreshFollowCounts}=useFollowerCounts(vendor?.id)
  const [editingBio,setEditingBio]=useState(false)
  const [bioText,setBioText]=useState(vendor?.bio||'')
  const [selectedPost,setSelectedPost]=useState(null)
  const [postIdx,setPostIdx]=useState(0)
  const [showFollow,setShowFollow]=useState(null)
  const [followIds,setFollowIds]=useState([])
  const [tab2,setTab2]=useState('posts')
  const isOwn=currentUser?.id===vendor?.id
  useEffect(()=>{setBioText(vendor?.bio||'')},[vendor?.id,vendor?.bio])
  const toggleFollow=async()=>{
    const isF=followMap[vendor.id]
    const r = isF ? await supabase.from('follows').delete().eq('follower_id',currentUser.id).eq('following_id',vendor.id) : await supabase.from('follows').insert({follower_id:currentUser.id,following_id:vendor.id})
    if(r.error)return alert(r.error.message)
    if(isF){const nm={...followMap};delete nm[vendor.id];setFollowMap(nm)}else{setFollowMap({...followMap,[vendor.id]:true});if(sendNotif)sendNotif(vendor.id,'follow','New follower','started following you',null)}
    await refreshFollowCounts()
  }
  const openFollowList=async(type)=>{const col=type==='followers'?'following_id':'follower_id';const valCol=type==='followers'?'follower_id':'following_id';const res = await supabase.from('follows').select(valCol).eq(col,vendor.id);setFollowIds((res.data||[]).map(x=>x[valCol]));setShowFollow(type)}
  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',vendor.id);await reload();setEditingBio(false)}
  const changeAvatar=async()=>{
    const input=document.createElement('input');input.type='file';input.accept='image/*';
    input.onchange=async(e)=>{const f=e.target.files?.[0]; if(!f)return; const name=`${vendor.id}/avatar-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`; const up = await supabase.storage.from('product-images').upload(name,f,{upsert:true}); if(up.error)return alert(up.error.message); const pub=supabase.storage.from('product-images').getPublicUrl(name); await supabase.from('profiles').update({avatar_url:pub.data.publicUrl}).eq('id',vendor.id); await reload(); alert('Profile picture updated')};
    input.click()
  }
  const deletePost=async(pid)=>{if(!confirm('Delete this post?'))return;const del = await supabase.from('products').delete().eq('id',pid);if(del.error)return alert(del.error.message);setSelectedPost(null);await reload()}
  if(!vendor)return null
  const hasStory=stories.length>0
  const coverImg=products[0]?.images?.[0]||vendor.avatar_url||''
  return <div className="pb-6">
    <div className="relative">
      <div className="h-[140px] overflow-hidden">{coverImg?<img src={coverImg} className="w-full h-full object-cover" alt="" />:<div className="w-full h-full bg-gradient-to-br from-[#39FF14]/30 via-zinc-900 to-black" />}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" /></div>
      <div className="absolute top-3 left-3 right-3 flex justify-between"><button onClick={onBack} className="bg-black/70 px-4 py-2 rounded-full text-[11px] font-bold">← Back</button><span className="bg-[#39FF14] text-black px-3 py-2 rounded-full text-[9px] font-black">✓ VERIFIED VENDOR</span></div>
      <div className="absolute -bottom-10 left-4 flex items-end gap-3"><button onClick={()=>hasStory&&onStoryClick(stories)} className={`w-[88px] h-[88px] rounded-full p-[3px] block shrink-0 ${hasStory?'bg-gradient-to-tr from-[#39FF14] to-yellow-400':'bg-white'}`}><img src={vendor.avatar_url||``} className="w-full h-full rounded-full border-4 border-black object-cover" alt="" /></button>{isOwn&&<button onClick={changeAvatar} className="mb-1 -ml-8 z-10 bg-white text-black w-7 h-7 rounded-full text-[12px] font-black border-2 border-black">+</button>}</div>
    </div>
    <div className="pt-12 px-4">
      <div className="flex justify-between items-start"><div><h1 className="font-black text-[20px] leading-none">{vendor.vendor_name}</h1><p className="text-[11px] text-zinc-500 mt-1">@{vendor.vendor_name?.toLowerCase().replace(/\s/g,'')} • Lagos, Nigeria</p></div><span className="bg-zinc-900 border border-zinc-800 text-[9px] px-3 py-1.5 rounded-full font-bold">⭐ FASTER SHOP</span></div>
      <div className="mt-3">{editingBio?<div className="space-y-2"><textarea value={bioText} onChange={e=>setBioText(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[12px]" /><div className="flex gap-2"><button onClick={saveBio} className="bg-white text-black px-5 py-2.5 rounded-full text-[11px] font-bold">Save Bio</button><button onClick={()=>setEditingBio(false)} className="bg-zinc-800 px-5 py-2.5 rounded-full text-[11px]">Cancel</button></div></div>:<><p className="text-[12px] text-zinc-300 leading-relaxed">{vendor.bio||'🔥 Fresh drops, quality pieces. Message me to order — fast delivery in Lagos.'}</p>{isOwn&&<div className="flex gap-2 mt-3"><button onClick={()=>setEditingBio(true)} className="text-[11px] bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full font-bold">Edit Bio</button><button onClick={changeAvatar} className="text-[11px] bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full font-bold">Change Photo</button></div>}</>}</div>
      <div className="flex gap-2 mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3"><div className="flex-1 text-center"><p className="font-black text-[16px]">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><button onClick={()=>openFollowList('followers')} className="flex-1 text-center border-x border-zinc-800"><p className="font-black text-[16px]">{followers}</p><p className="text-[10px] text-zinc-500 underline">Followers</p></button><button onClick={()=>openFollowList('following')} className="flex-1 text-center"><p className="font-black text-[16px]">{following}</p><p className="text-[10px] text-zinc-500 underline">Following</p></button></div>
      {!isOwn&&<div className="flex gap-2 mt-3"><button onClick={toggleFollow} className={`flex-1 py-3.5 rounded-full text-[12px] font-black ${followMap[vendor.id]?'bg-zinc-800 text-white border border-zinc-700':'bg-[#39FF14] text-black'}`}>{followMap[vendor.id]?'✓ Following':'Follow'}</button><button className="flex-1 py-3.5 rounded-full text-[12px] font-black bg-white text-black">Message 💬</button></div>}
      <div className="flex gap-2 mt-5 border-b border-zinc-900 pb-2"><button onClick={()=>setTab2('posts')} className={`px-4 py-2 rounded-full text-[11px] font-black ${tab2==='posts'?'bg-white text-black':'text-zinc-400'}`}>Posts ({products.length})</button><button onClick={()=>setTab2('about')} className={`px-4 py-2 rounded-full text-[11px] font-black ${tab2==='about'?'bg-white text-black':'text-zinc-400'}`}>About</button></div>
      {tab2==='about'?<div className="mt-4 bg-zinc-900 rounded-2xl p-4 space-y-2"><p className="text-[12px] font-bold">About {vendor.vendor_name}</p><p className="text-[11px] text-zinc-400 leading-relaxed">{vendor.bio||'This vendor sells quality fashion on Faster Shop. Tap Message to ask about sizes, delivery, and availability.'}</p><p className="text-[11px] text-zinc-400">📍 Lagos, Nigeria • 🚚 Fast delivery • 💬 Replies fast</p></div>:<div className="mt-3">{products.length===0?<div className="bg-zinc-900 rounded-2xl p-8 text-center"><p className="text-[28px]">🛍️</p><p className="text-[12px] font-bold mt-2">No posts yet</p></div>:<div className="grid grid-cols-3 gap-1">{products.map(p=>{const imgs=p.images||p.image_urls||[];return <div key={p.id} onClick={()=>{setSelectedPost(p);setPostIdx(0)}} className="aspect-square bg-zinc-900 relative cursor-pointer rounded-lg overflow-hidden"><img src={imgs[0]} className="w-full h-full object-cover" alt="" />{p.images?.length>1&&<span className="absolute top-1.5 right-1.5 bg-black/70 text-[8px] px-1.5 py-0.5 rounded-full font-bold">+{p.images.length-1}</span>}<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1.5"><p className="text-[9px] font-black truncate">₦{p.price}</p></div></div>})}</div>}</div>}
    </div>
    {showFollow&&<FollowList title={showFollow==='followers'?'Followers':'Following'} ids={followIds} onClose={()=>setShowFollow(null)} onOpenVendor={(v)=>{setShowFollow(null)}} getVendor={getVendor}/>}
    {selectedPost&&(()=>{const imgs=selectedPost.images||selectedPost.image_urls||[];return <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={()=>setSelectedPost(null)}><div className="flex justify-between items-center p-4" onClick={e=>e.stopPropagation()}><p className="text-[13px] font-black">{vendor.vendor_name}</p><button onClick={()=>setSelectedPost(null)} className="w-8 h-8 bg-zinc-800 rounded-full text-[16px]">✕</button></div><div className="flex-1 flex items-center justify-center relative px-4" onClick={e=>e.stopPropagation()}>{imgs.length>0&&<img src={imgs[postIdx]} className="max-h-[60vh] w-full object-contain rounded-2xl" alt="" />}{imgs.length>1&&<><button onClick={()=>setPostIdx((postIdx-1+imgs.length)%imgs.length)} className="absolute left-2 bg-black/70 w-9 h-9 rounded-full">‹</button><button onClick={()=>setPostIdx((postIdx+1)%imgs.length)} className="absolute right-2 bg-black/70 w-9 h-9 rounded-full">›</button><span className="absolute bottom-2 bg-black/70 px-2 py-1 rounded-full text-[10px]">{postIdx+1}/{imgs.length}</span></>}</div><div className="bg-zinc-900 p-4 space-y-2 rounded-t-[24px]" onClick={e=>e.stopPropagation()}><p className="text-[14px] font-black">{selectedPost.title||selectedPost.name}</p><p className="text-[11px] text-zinc-300 whitespace-pre-wrap">{selectedPost.description||selectedPost.caption||'No caption'}</p><div className="flex gap-2 text-[11px]"><span className="bg-[#39FF14] text-black px-3 py-1.5 rounded-full font-black">₦{selectedPost.price}</span>{selectedPost.size&&<span className="bg-zinc-800 px-3 py-1.5 rounded-full">Size: {selectedPost.size}</span>}<span className="bg-zinc-800 px-3 py-1.5 rounded-full">{selectedPost.category||''}</span></div>{isOwn&&<button onClick={()=>deletePost(selectedPost.id)} className="w-full mt-2 bg-red-600 text-white font-bold py-3 rounded-full text-[11px]">🗑️ Delete This Post</button>}</div></div>})()}
  </div>
}

function BuyerProfile({user,profile,reload,setTab,products,likes,getVendor,onOpenVendor}){
  const name = profile?.vendor_name || user.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  const go = (t)=> setTab ? setTab(t) : null
  const wishlist = (products||[]).filter(p=>likes?.[p.id])
  return <div className="p-4 space-y-4 bg-black">
    <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-4 flex gap-4 items-center">
      <div className="w-[72px] h-[72px] rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center shrink-0"><span className="font-black text-[22px] text-white">{initials || 'TN'}</span></div>
      <div className="min-w-0"><p className="font-black text-[16px] leading-tight truncate capitalize">{name}</p><p className="text-[12px] text-zinc-400 truncate mt-1">{user.email}</p><span className="inline-block mt-2 bg-[#39FF14]/15 text-[#39FF14] text-[9px] px-2.5 py-1 rounded-full font-black">🛍️ BUYER ACCOUNT</span></div>
    </div>
    <p className="text-[10px] font-black tracking-widest text-zinc-500 pt-1">ACCOUNT & DELIVERIES</p>
    <div className="bg-zinc-900 border border-zinc-800 rounded-[24px] overflow-hidden divide-y divide-zinc-800">
      <button onClick={()=>go('cart')} className="w-full p-4 flex items-center gap-3 text-left"><span className="text-[20px]">📦</span><span className="flex-1 font-bold text-[13px]">My Orders & Deliveries</span><span className="text-zinc-500">→</span></button>
      <button onClick={()=>go('settings')} className="w-full p-4 flex items-center gap-3 text-left"><span className="text-[20px]">📍</span><span className="flex-1 font-bold text-[13px]">Saved Shipping Addresses</span><span className="text-zinc-500">→</span></button>
      <button onClick={()=>go('shop')} className="w-full p-4 flex items-center gap-3 text-left"><span className="text-[20px]">❤️</span><span className="flex-1 font-bold text-[13px]">Wishlist <span className="text-zinc-500 font-normal">({wishlist.length})</span></span><span className="text-zinc-500">→</span></button>
      <button onClick={()=>go('settings')} className="w-full p-4 flex items-center gap-3 text-left"><span className="text-[20px]">⚙️</span><span className="flex-1 font-bold text-[13px]">Account Settings</span><span className="text-zinc-500">→</span></button>
    </div>
    <div>
      <p className="text-[12px] font-black mb-2">Saved for later ❤️</p>
      {wishlist.length===0 ? (<div className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6 text-center"><p className="text-[24px]">🤍</p><p className="text-[12px] font-bold mt-1">No wishlist yet</p><p className="text-[11px] text-zinc-500 mt-1">Tap ❤️ on any product to save it here to buy later.</p><button onClick={()=>go('shop')} className="mt-3 bg-[#39FF14] text-black font-black px-5 py-2.5 rounded-full text-[11px]">Browse Shop →</button></div>) : (<div className="grid grid-cols-2 gap-3">{wishlist.map(p=>{const v = getVendor ? getVendor(p.vendor_id) : null; return <button key={p.id} onClick={()=>{ if(v && onOpenVendor) onOpenVendor(v) }} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-left"><img src={p.images?.[0]||''} className="w-full h-28 object-cover bg-zinc-800" alt="" /><div className="p-2.5"><p className="text-[11px] font-bold truncate">{p.title||p.name}</p><p className="text-[10px] text-zinc-400 truncate">{v?.vendor_name||'Vendor'}</p><p className="text-[11px] font-black text-[#39FF14] mt-0.5">₦{p.price}</p></div></button>})}</div>)}
    </div>
  </div>
}

function Profile({user,profile,products,reload,getVendor}){
  const [view,setView]=useState('main')
  const [form,setForm]=useState({title:'',price:'',category:'Shoes',size:'',caption:''})
  const [files,setFiles]=useState([])
  const [previews,setPreviews]=useState([])
  const [uploading,setUploading]=useState(false)
  const {followers,following}=useFollowerCounts(user?.id)
  const [editingBio,setEditingBio]=useState(false)
  const [bioText,setBioText]=useState(profile?.bio||'')
  const [selectedPost,setSelectedPost]=useState(null)
  const [postIdx,setPostIdx]=useState(0)
  const [showFollow,setShowFollow]=useState(null)
  const [followIds,setFollowIds]=useState([])
  const storyInputRef=useRef(null)
  useEffect(()=>{setBioText(profile?.bio||'')},[profile])
  const handleFiles=(e)=>{const s=Array.from(e.target.files||[]).slice(0,10);setFiles(s);setPreviews(s.map(f=>URL.createObjectURL(f)))}
  const ensureProfile=async()=>{const {data,error}=await supabase.from('profiles').upsert({id:user.id,email:user.email,is_vendor:true,vendor_name:user.email.split('@')[0]},{onConflict:'id'}).select().single(); if(error)throw error; return data}
  const openFollowList=async(type)=>{const col=type==='followers'?'following_id':'follower_id';const valCol=type==='followers'?'follower_id':'following_id';const {data}=await supabase.from('follows').select(valCol).eq(col,user.id);setFollowIds((data||[]).map(r=>r[valCol]));setShowFollow(type)}
  const uploadProduct=async()=>{
    if(!form.title||files.length===0)return alert('Add title + images')
    setUploading(true)
    try{
      await ensureProfile()
      const urls=[]
      for(let i=0;i<files.length;i++){const f=files[i];const name=`${user.id}/${Date.now()}-${i}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;const {error}=await supabase.storage.from('product-images').upload(name,f,{upsert:true,contentType:f.type});if(error)throw error;const {data}=supabase.storage.from('product-images').getPublicUrl(name);urls.push(data.publicUrl)}
      const {error}=await supabase.from('products').insert({vendor_id:user.id,title:form.title,name:form.title,price:form.price||'20000',category:form.category,images:urls,is_featured:true,description:form.caption,size:form.size})
      if(error)throw error
      alert(`Posted! ${urls.length} slides`);setFiles([]);setPreviews([]);setForm({title:'',price:'',category:'Shoes',size:'',caption:''});await reload();setView('main')
    }catch(e){alert(e.message)}finally{setUploading(false)}
  }
  const onStoryFile=async(e)=>{
    const files=Array.from(e.target.files||[]); if(!files.length)return
    try{
      await ensureProfile()
      for(const f of files){
        const name=`${user.id}/story-${Date.now()}-${Math.random().toString(36).slice(2)}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`
        const {error}=await supabase.storage.from('product-images').upload(name,f,{upsert:true,contentType:f.type});if(error)throw error
        const {data}=supabase.storage.from('product-images').getPublicUrl(name)
        const expires=new Date(Date.now()+24*60*60*1000).toISOString()
        const {error:dbErr}=await supabase.from('stories').insert({image_url:data.publicUrl,media_url:data.publicUrl,url:data.publicUrl,expires_at:expires,vendor_id:user.id,user_id:user.id,profile_id:user.id})
        if(dbErr)throw dbErr
      }
      alert(`${files.length} stor${files.length>1?'ies':'y'} posted — each lasts 24h, post as many as you want`);await reload()
    }catch(err){alert('Story failed: '+err.message)}
    e.target.value=''
  }
  const changeAvatar=async()=>{
    const input=document.createElement('input');input.type='file';input.accept='image/*';
    input.onchange=async(e)=>{const f=e.target.files?.[0];if(!f)return;const name=`${user.id}/avatar-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;const {error}=await supabase.storage.from('product-images').upload(name,f,{upsert:true});if(error)return alert(error.message);const {data}=supabase.storage.from('product-images').getPublicUrl(name);await supabase.from('profiles').update({avatar_url:data.publicUrl}).eq('id',user.id);await reload();alert('Profile picture updated')};
    input.click()
  }
  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',user.id);await reload();setEditingBio(false)}
  const deletePost=async(pid)=>{if(!confirm('Delete this post? This cannot be undone.'))return;const {error}=await supabase.from('products').delete().eq('id',pid);if(error)return alert(error.message);setSelectedPost(null);await reload()}
  if(view!=='main'){
    return <div className="p-4"><button onClick={()=>setView('main')} className="mb-4 text-[12px]">Back</button>
      {view==='upload'&&<div className="space-y-3"><h2 className="font-black text-[13px]">Upload Product</h2><input placeholder="Title e.g MOONSHOT TEES" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><div className="flex gap-2"><input placeholder="Price / Amount 30000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select></div><input placeholder="Size e.g M / L / 42 / One Size" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Caption — describe this product..." value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-[11px] h-20" /><input type="file" multiple accept="image/*" onChange={handleFiles} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl" /><p className="text-[9px] text-zinc-500">Select up to 10 images — they slide as one post</p>{previews.length>0&&<div className="grid grid-cols-5 gap-2">{previews.map((p,i)=><img key={i} src={p} className="w-full h-16 object-cover rounded-lg" alt="" />)}</div>}<button onClick={uploadProduct} disabled={uploading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">{uploading?'Uploading...':`Post ${files.length} Images`}</button></div>}
    </div>
  }
  return <div className="p-4 space-y-4">
    <input ref={storyInputRef} type="file" accept="image/*" multiple onChange={onStoryFile} className="hidden" />
    <div className="flex gap-5">
      <div className="relative shrink-0"><button onClick={changeAvatar}><img src={profile?.avatar_url||``} className="w-20 h-20 rounded-full object-cover bg-zinc-800" alt="" /></button><button onClick={()=>storyInputRef.current?.click()} title="Upload Story" className="absolute -bottom-1 -right-1 bg-[#39FF14] text-black w-7 h-7 rounded-full text-[16px] font-black border-2 border-black flex items-center justify-center">+</button></div>
      <div className="flex-1">
        <div className="flex gap-5"><div className="text-center"><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><button onClick={()=>openFollowList('followers')} className="text-center"><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500 underline">Followers</p></button><button onClick={()=>openFollowList('following')} className="text-center"><p className="font-black">{following}</p><p className="text-[10px] text-zinc-500 underline">Following</p></button></div>
        <div className="mt-2">{editingBio?<div className="space-y-2"><textarea value={bioText} onChange={e=>setBioText(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-[11px]" /><div className="flex gap-2"><button onClick={saveBio} className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold">Save</button><button onClick={()=>setEditingBio(false)} className="bg-zinc-800 px-3 py-1 rounded-full text-[10px]">Cancel</button></div></div>:<><p className="text-[11px] font-bold">{profile?.vendor_name||user.email?.split('@')[0]}</p><p className="text-[11px]">{profile?.bio||'Add bio...'}</p><div className="flex gap-2 mt-1"><button onClick={()=>setEditingBio(true)} className="text-[10px] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">Edit Bio</button><button onClick={changeAvatar} className="text-[10px] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">Change Photo</button></div></>}</div>
      </div>
    </div>
    {showFollow&&<FollowList title={showFollow==='followers'?'Followers':'Following'} ids={followIds} onClose={()=>setShowFollow(null)} onOpenVendor={()=>setShowFollow(null)} getVendor={getVendor}/>}
    <button onClick={()=>setView('upload')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Upload Product</button>
    <div className="grid grid-cols-3 gap-0.5 mt-2">{products.map(p=>{const imgs=p.images||p.image_urls||[];return <div key={p.id} onClick={()=>{setSelectedPost(p);setPostIdx(0)}} className="aspect-square bg-zinc-900 relative cursor-pointer"><img src={imgs[0]} className="w-full h-full object-cover" alt="" />{imgs.length>1&&<span className="absolute top-1 right-1 bg-black/70 text-[7px] px-1 rounded">+{imgs.length-1}</span>}<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1"><p className="text-[8px] font-bold truncate">₦{p.price}</p>{p.size&&<p className="text-[7px] text-zinc-300">Size: {p.size}</p>}</div></div>})}</div>
    {products.length===0&&<p className="text-center text-[11px] text-zinc-500 mt-8">No posts yet — tap Upload Product</p>}
    {selectedPost&&(()=>{const imgs=selectedPost.images||selectedPost.image_urls||[];return <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col" onClick={()=>setSelectedPost(null)}><div className="flex justify-between items-center p-4" onClick={e=>e.stopPropagation()}><p className="text-[12px] font-black">{profile?.vendor_name||'You'}</p><button onClick={()=>setSelectedPost(null)} className="text-[18px]">✕</button></div><div className="flex-1 flex items-center justify-center relative px-4" onClick={e=>e.stopPropagation()}>{imgs.length>0&&<img src={imgs[postIdx]} className="max-h-[60vh] w-full object-contain rounded-xl" alt="" />}{imgs.length>1&&<><button onClick={()=>setPostIdx((postIdx-1+imgs.length)%imgs.length)} className="absolute left-2 bg-black/60 w-8 h-8 rounded-full">‹</button><button onClick={()=>setPostIdx((postIdx+1)%imgs.length)} className="absolute right-2 bg-black/60 w-8 h-8 rounded-full">›</button><span className="absolute bottom-2 bg-black/60 text-[9px] px-2 py-1 rounded-full">{postIdx+1}/{imgs.length}</span></>}</div><div className="bg-zinc-900 p-4 space-y-2" onClick={e=>e.stopPropagation()}><p className="text-[13px] font-bold">{selectedPost.title||selectedPost.name}</p><p className="text-[11px] text-zinc-300 whitespace-pre-wrap">{selectedPost.description||selectedPost.caption||'No caption'}</p><div className="flex gap-2 text-[11px]"><span className="bg-[#39FF14] text-black px-3 py-1 rounded-full font-black">₦{selectedPost.price}</span>{selectedPost.size&&<span className="bg-zinc-800 px-3 py-1 rounded-full">Size: {selectedPost.size}</span>}<span className="bg-zinc-800 px-3 py-1 rounded-full">{selectedPost.category||''}</span></div><button onClick={()=>deletePost(selectedPost.id)} className="w-full mt-2 bg-red-600 text-white font-bold py-3 rounded-full text-[11px]">🗑️ Delete This Post</button></div></div>})()}
  </div>
}

function Settings({user,profile,reload,onBack}){
  const [notif,setNotif]=useState(true)
  const [sound,setSound]=useState(true)
  const [privateAcc,setPrivateAcc]=useState(false)
  const [currency,setCurrency]=useState('NGN (₦)')
  const [language,setLanguage]=useState('English')
  const [newPass,setNewPass]=useState('')
  const [bio,setBio]=useState(profile?.bio||'')
  const [vendorName,setVendorName]=useState(profile?.vendor_name||'')
  const saveProfile=async()=>{await supabase.from('profiles').update({bio,vendor_name:vendorName}).eq('id',user.id);await reload();alert('Profile saved')}
  const changePassword=async()=>{if(!newPass)return alert('Enter new password');const {error}=await supabase.auth.updateUser({password:newPass});if(error)alert(error.message);else{alert('Password changed');setNewPass('')}}
  const clearCache=()=>{localStorage.clear();alert('Cache cleared')}
  return <div className="p-4 space-y-4">
    <div className="flex gap-3 items-center"><button onClick={onBack}>Back</button><h2 className="font-black text-[14px]">Settings</h2></div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"><p className="font-bold text-[12px]">Account</p><p className="text-[11px] text-zinc-400">{user.email}</p><input value={vendorName} onChange={e=>setVendorName(e.target.value)} placeholder="Shop name" className="w-full bg-zinc-800 rounded-full px-4 py-2 text-[11px]" /><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" className="w-full bg-zinc-800 rounded-xl p-3 text-[11px]" /><button onClick={saveProfile} className="w-full bg-white text-black py-2 rounded-full text-[11px] font-bold">Save Profile</button></div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"><p className="font-bold text-[12px]">Shopping</p><div className="flex justify-between"><p className="text-[11px]">Currency</p><select value={currency} onChange={e=>setCurrency(e.target.value)} className="bg-zinc-800 rounded-full px-3 py-1 text-[11px]"><option>NGN (₦)</option><option>USD ($)</option></select></div><div className="flex justify-between"><p className="text-[11px]">Language</p><select value={language} onChange={e=>setLanguage(e.target.value)} className="bg-zinc-800 rounded-full px-3 py-1 text-[11px]"><option>English</option><option>Pidgin</option></select></div><div className="flex justify-between"><p className="text-[11px]">Delivery Address</p><button onClick={()=>alert('Add your Lagos delivery address in chat with vendor for now')} className="text-[11px] bg-zinc-800 px-3 py-1 rounded-full">Manage</button></div></div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"><p className="font-bold text-[12px]">Notifications & Privacy</p><div className="flex justify-between"><p className="text-[11px]">Push Notifications</p><button onClick={()=>setNotif(!notif)} className={`w-10 h-5 rounded-full ${notif?'bg-[#39FF14]':'bg-zinc-700'} relative`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${notif?'right-0.5':'left-0.5'}`} /></button></div><div className="flex justify-between"><p className="text-[11px]">Message Sounds</p><button onClick={()=>setSound(!sound)} className={`w-10 h-5 rounded-full ${sound?'bg-[#39FF14]':'bg-zinc-700'} relative`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${sound?'right-0.5':'left-0.5'}`} /></button></div><div className="flex justify-between"><p className="text-[11px]">Private Account</p><button onClick={()=>setPrivateAcc(!privateAcc)} className={`w-10 h-5 rounded-full ${privateAcc?'bg-[#39FF14]':'bg-zinc-700'} relative`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full ${privateAcc?'right-0.5':'left-0.5'}`} /></button></div></div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"><p className="font-bold text-[12px]">Security</p><input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password" type="password" className="w-full bg-zinc-800 rounded-full px-4 py-2 text-[11px]" /><button onClick={changePassword} className="w-full bg-white text-black py-2 rounded-full text-[11px] font-bold">Change Password</button></div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3"><p className="font-bold text-[12px]">Support</p><button onClick={()=>alert("Hi! I'm Uche. Tap the 💬 button at bottom right to chat with me anytime.")} className="w-full bg-[#39FF14] text-black py-3 rounded-full text-[11px] font-black">💬 Chat Uche - Support</button><button onClick={()=>alert('Faster Shop v1.0 - Lagos Shops Here')} className="w-full bg-zinc-800 py-2 rounded-full text-[11px]">About Faster Shop</button><button onClick={clearCache} className="w-full bg-zinc-800 py-2 rounded-full text-[11px]">Clear Cache</button></div>
    <button onClick={async()=>{await supabase.auth.signOut()}} className="w-full bg-red-600 text-white py-3 rounded-full text-[11px] font-bold">Log Out</button>
  </div>
}