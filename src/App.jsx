import EventsList from './components/EventsList';
import FasterFinds from './components/FasterFinds';
import AdminPanel from './components/AdminPanel';
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from './lib/supabase'
import ClothesRain from "./components/ClothesRain";
const CATS=['All','Men','Women','Hoodies','Caps','Perfumes','Shoes','Bags','Gym Wear','Kids Wear','Hair & Wigs','Dresses','Streetwear','Traditional Wear']
const FULL_CATS=['Men','Women','Hoodies','Caps','Perfumes','Shoes','Bags','Gym Wear','Kids Wear','Hair & Wigs','Dresses','Tops','Trousers & Jeans','Skirts','Suits & Agbada','Traditional Wear','Streetwear','Underwear & Lingerie','Swimwear','Jackets & Coats','Accessories','Watches','Jewelry','Sunglasses','Handbags','Sneakers','Sandals & Slides']
const ADMIN_EMAILS=['terrence@faster.shop','terrence@fastersub.ng','terrence@fastershop.ng']
const getLocalChats = (userId) => { try { return JSON.parse(localStorage.getItem(`faster_msgs_${userId}`) || '[]'); } catch { return []; } };
const saveLocalMessage = (userId, msg) => { try { const all = getLocalChats(userId); all.push(msg); localStorage.setItem(`faster_msgs_${userId}`, JSON.stringify(all.slice(-500))); } catch {} };
const deleteLocalChat = (userId, otherId) => { try { const all = getLocalChats(userId).filter(m => !((m.sender_id === userId && m.receiver_id === otherId) || (m.sender_id === otherId && m.receiver_id === userId))); localStorage.setItem(`faster_msgs_${userId}`, JSON.stringify(all)); } catch {} };
async function compressImage(file, maxWidth = 1200, quality = 0.82) {
  try {
    if (!file.type.startsWith('image/')) return file;
    if (file.size < 300 * 1024) return file;
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.(png|heic|webp)$/i, '.jpg'), { type: 'image/jpeg' });
  } catch { return file; }
}
async function ensureProfilePreserve(user) {
  const { data: existing } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase.from('profiles').insert({ id: user.id, email: user.email, is_vendor: user.user_metadata?.role === 'vendor', vendor_name: user.email.split('@')[0] }).select().single();
  if (error) return existing;
  return data;
}
function isFasterShopVendor(v) {
  if (!v) return false;
  if (v.is_faster_shop === true) return true;
  const name = String(v.vendor_name || '').toLowerCase();
  const email = String(v.email || '').toLowerCase();
  if (name.includes('faster') || name.includes('fastershop')) return true;
  if (email.includes('faster') || email.includes('terrence')) return true;
  return false;
}
function VerifiedBadge({ vendor, size = 14 }) {
  const isVerified = vendor?.is_verified === true || vendor?.is_faster_shop === true || isFasterShopVendor(vendor);
  if (!isVerified) return null;
  return (
    <span title="Verified by Faster Shop" style={{ width: size, height: size, fontSize: size * 0.6 }} className="inline-flex items-center justify-center rounded-full bg-[#FFD700] text-black font-black border border-black shrink-0 ml-1 align-middle">✓</span>
  );
}
function isVerifiedVendor(v) { return v?.is_verified === true || v?.is_faster_shop === true || isFasterShopVendor(v); }
function getStarLevel(count) {
  if (count >= 50) return { stars: 5, label: '⭐⭐⭐⭐⭐ TOP SELLER' };
  if (count >= 30) return { stars: 4, label: '⭐⭐⭐⭐' };
  if (count >= 20) return { stars: 3, label: '⭐⭐⭐' };
  if (count >= 10) return { stars: 2, label: '⭐⭐' };
  if (count >= 1) return { stars: 1, label: '⭐' };
  return { stars: 0, label: 'No stars yet' };
}
function StarProgress({ vendorId, compact = false }) {
  const [count, setCount] = useState(0);
  const load = async () => {
    let c = 0;
    try {
      const { count: cc } = await supabase.from('vendor_stars').select('*', { count: 'exact', head: true }).eq('vendor_id', vendorId);
      if (cc != null) c = cc;
    } catch {}
    if (c === 0) { try { c = JSON.parse(localStorage.getItem(`faster_stars_${vendorId}`) || '[]').length; } catch {} }
    setCount(c);
  };
  useEffect(() => { if (vendorId) load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [vendorId]);
  const lvl = getStarLevel(count);
  const pct = Math.min(100, Math.round((count / 50) * 100));
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-black">
        <span className="text-[#FFD700]">{lvl.stars === 0 ? '☆☆☆☆☆' : '⭐'.repeat(lvl.stars) + '☆'.repeat(5 - lvl.stars)}</span>
        <span className="text-zinc-400 font-normal">({count})</span>
      </span>
    );
  }
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 mt-3">
      <div className="flex justify-between items-center">
        <p className="text-[11px] font-black">⭐ Vendor Rating</p>
        <span className="text-[10px] bg-[#FFD700] text-black px-2 py-1 rounded-full font-black">{count} / 50 Stars</span>
      </div>
      <p className="text-[14px] mt-1">{lvl.stars === 0 ? '☆☆☆☆☆' : '⭐'.repeat(lvl.stars) + '☆'.repeat(5 - lvl.stars)} <span className="text-[10px] text-zinc-400">{lvl.label}</span></p>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2"><div className="h-full bg-[#FFD700]" style={{ width: pct + '%' }} /></div>
      <p className="text-[10px] text-zinc-500 mt-1">{count >= 50 ? '🏆 FULL 5 STARS - Eligible for Vendor of the Year Award!' : `${50 - count} more confirmed deliveries to reach full 5 stars • Stars only come from buyers tapping ⭐ in chat after delivery`}</p>
    </div>
  );
}
function Avatar({ user, size = 40, onClick }) {
  const name = user?.vendor_name || user?.email?.split('@')[0] || 'User';
  const letter = (name.trim()[0] || 'U').toUpperCase();
  const colors = ['bg-[#39FF14] text-black','bg-white text-black','bg-zinc-700 text-white','bg-yellow-400 text-black','bg-pink-500 text-white'];
  const color = colors[(letter.charCodeAt(0) || 0) % colors.length];
  if (user?.avatar_url) return <img loading="lazy" decoding="async" onClick={onClick} src={user.avatar_url} className="rounded-full object-cover bg-zinc-800 shrink-0" style={{ width: size, height: size }} alt="" />;
  return (
    <div onClick={onClick} className={`rounded-full flex items-center justify-center font-black shrink-0 ${color} ${onClick ? 'cursor-pointer' : ''}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>{letter}</div>
  );
}
function useFollowerCounts(userId){
  const [counts,setCounts]=useState({followers:0,following:0})
  const refresh=useCallback(async()=>{
    if(!userId) return;
    const [f1,f2]=await Promise.all([
      supabase.from('follows').select('*',{count:'exact',head:true}).eq('following_id',userId),
      supabase.from('follows').select('*',{count:'exact',head:true}).eq('follower_id',userId)
    ]);
    setCounts({ followers: f1.count ?? 0, following: f2.count ?? 0 });
  },[userId])
  useEffect(()=>{
    if(!userId) return;
    refresh();
    const ch = supabase.channel(`follows-count-${userId}`).on('postgres_changes',{event:'*',schema:'public',table:'follows'}, (payload) => {
      const n = payload.new, o = payload.old;
      if (n?.following_id === userId || n?.follower_id === userId || o?.following_id === userId || o?.follower_id === userId) refresh();
    }).subscribe();
    const t = setInterval(refresh, 5000);
    return ()=>{ supabase.removeChannel(ch); clearInterval(t); }
  },[userId,refresh])
  return {...counts,refresh}
}
function UcheChatFull({ user, profile, onClose }) {
  const [messages, setMessages] = useState([{ sender: 'uche', text: "Hi! I'm Uche, your Faster Shop helper 👋 What is wrong? I go sort am quick." }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
  const quickButtons = ["My order never arrived","Wrong item / wrong size","Vendor is not replying","I want refund / return","How to buy?","How to sell?","Report a vendor","Delivery wahala"];
  const getUcheReply = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes("never arrived")) return "Sorry about that, I go sort am. Send me: 1. Vendor name 2. What you ordered 3. When you paid.";
    if (m.includes("wrong") || m.includes("size")) return "No wahala. Send photo of what you received + what you ordered. I go contact vendor now.";
    if (m.includes("not replying")) return "I don enter am. I go message vendor now. If vendor no reply in 24 hours, we go refund you.";
    if (m.includes("refund")) return "Okay for refund: I need 1. Order / vendor name 2. Photo 3. Reason. Send them here.";
    if (m.includes("how to buy")) return "To buy: 1. Find your fit 2. Chat vendor 3. Pay INSIDE Faster Shop 4. Receive package.";
    if (m.includes("how to sell")) return "To sell: 1. Sign up as vendor 2. Post product 3. Reply fast 4. Sell & Grow.";
    if (m.includes("report") || m.includes("scam")) return "Thank you for reporting. Tell me vendor name + what dem do + screenshot.";
    if (m.includes("delivery")) return "Delivery for Lagos is usually 1-3 days. If e don pass 3 days, tell me vendor name + order.";
    if (m.includes("hi") || m.includes("hello")) return "Hi my guy! You wan buy or sell today? Or you get complaint?";
    if (m.includes("thank")) return "You welcome! Anytime you need help, I dey here.";
    return "I hear you. Is it about order, vendor, refund or delivery? Tap one button below.";
  };
  const saveToSupabase = async (text, sender) => { try { await supabase.from('uche_chats').insert({ user_id: user?.id || null, user_email: user?.email || 'guest', user_name: profile?.vendor_name || 'Guest', message: text, sender, topic: 'general', status: 'open' }); } catch {} };
  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    const clean = text.trim();
    setMessages(prev => [...prev, { sender: 'user', text: clean }]);
    setInput(""); setSending(true); saveToSupabase(clean, 'user');
    setTimeout(() => { const reply = getUcheReply(clean); setMessages(prev => [...prev, { sender: 'uche', text: reply }]); saveToSupabase(reply, 'uche'); setSending(false); }, 700);
  };
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="bg-black border-b border-zinc-900 p-3 flex items-center gap-3">
        <button onClick={onClose} className="text-[16px] px-1">←</button>
        <div className="w-10 h-10 bg-[#39FF14] rounded-full flex items-center justify-center text-[20px]">🤖</div>
        <div className="flex-1"><p className="font-black text-[13px]">Uche - Faster Shop</p><p className="text-[10px] text-[#39FF14] mt-1">● Online</p></div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 bg-black space-y-2">
        {messages.map((msg, i) => (<div key={i} className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-[13px] ${msg.sender === 'user' ? 'ml-auto bg-[#39FF14] text-black' : 'mr-auto bg-zinc-900 border border-zinc-800'}`}>{msg.text}</div>))}
        {sending && <div className="mr-auto bg-zinc-900 px-3 py-2 rounded-2xl text-[12px] text-zinc-400">Uche dey type...</div>}
        {messages.length <= 2 && (<div className="flex flex-wrap gap-2 pt-2">{quickButtons.map(btn => (<button key={btn} onClick={() => sendMessage(btn)} className="bg-zinc-900 border border-zinc-700 rounded-full px-3 py-2 text-[11px] font-bold">{btn}</button>))}</div>)}
      </div>
      <div className="p-3 border-t border-zinc-900 bg-black flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} placeholder="Ask Uche anything..." className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-[13px] outline-none" /><button onClick={() => sendMessage(input)} className="bg-[#39FF14] text-black w-11 h-11 rounded-full font-black">➤</button></div>
    </div>
  );
}
function MessagesListWithActions({ user, vendors, fasterShop, profile, onSelect, onViewProfile, onOpenUche, refreshKey }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const loadChats = async () => {
    setLoading(true);
    let allMsgs = [];
    try { const { data, error } = await supabase.from('messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(300); if (!error && data) allMsgs.push(...data.map(m => ({ id: m.id, sender_id: m.sender_id, receiver_id: m.receiver_id, text: m.text || m.message || '', created_at: m.created_at, is_read: m.is_read }))); } catch {}
    const local = getLocalChats(user.id); local.forEach(m => { if (!allMsgs.find(x => x.id === m.id)) allMsgs.push(m); });
    if (allMsgs.length > 0) {
      const map = {}; allMsgs.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).forEach(m => { const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id; if (!otherId) return; if (!map[otherId]) map[otherId] = { id: otherId, lastMessage: m.text || '', lastAt: m.created_at, unread: 0 }; if (m.receiver_id === user.id && !m.is_read) map[otherId].unread += 1; });
      const ids = Object.keys(map); let profs = []; try { const { data } = await supabase.from('profiles').select('*').in('id', ids); profs = data || []; } catch {}
      setChats(Object.values(map).map(c => { const p = profs.find(x => x.id === c.id) || (vendors || []).find(x => x.id === c.id) || (fasterShop?.id === c.id ? fasterShop : null); return { ...c, vendor: p || { id: c.id, vendor_name: 'Vendor', avatar_url: '' } }; }));
    } else setChats([]);
    setLoading(false);
  };
  useEffect(() => { loadChats(); }, [user?.id, refreshKey]);
  useEffect(() => { if (!user?.id) return; const ch = supabase.channel(`messages-list-${user.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, () => loadChats()).subscribe(); return () => supabase.removeChannel(ch); }, [user?.id]);
  const deleteChat = async (chat) => { if (!confirm(`Delete chat with ${chat.vendor?.vendor_name}?`)) return; setOpenMenu(null); try { await supabase.from('messages').delete().or(`and(sender_id.eq.${user.id},receiver_id.eq.${chat.id}),and(sender_id.eq.${chat.id},receiver_id.eq.${user.id})`); } catch {} deleteLocalChat(user.id, chat.id); setChats(prev => prev.filter(c => c.id !== chat.id)); };
  const reportVendor = async (chat) => { setOpenMenu(null); try { await supabase.from('uche_chats').insert({ user_id: user.id, user_email: user.email, user_name: profile?.vendor_name || 'User', message: `REPORT: ${chat.vendor?.vendor_name}`, sender: 'user', topic: 'report', status: 'open' }); } catch {} alert(`Reported ${chat.vendor?.vendor_name}.`); };
  const filteredChats = chats.filter(c => !search || (c.vendor?.vendor_name || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-4" onClick={() => openMenu && setOpenMenu(null)}>
      <h2 className="font-black text-[18px]">Messages 💬</h2>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..." className="w-full mt-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[12px] outline-none" />
      {loading && <p className="text-[11px] text-zinc-500 text-center mt-8">Loading chats...</p>}
      {!loading && (
        <div className="mt-4 space-y-2">
          <button onClick={onOpenUche} className="w-full bg-zinc-900 border-2 border-[#39FF14]/40 p-3 rounded-2xl flex gap-3 items-center text-left"><div className="w-11 h-11 bg-[#39FF14] rounded-full flex items-center justify-center text-[20px]">🤖</div><div className="flex-1"><p className="text-[12px] font-black">Uche - Faster Shop ⚡</p><p className="text-[11px] text-zinc-400">Hi! I'm Uche, your helper.</p></div><span>→</span></button>
          {filteredChats.map(c => (
            <div key={c.id} className="relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl flex gap-3 items-center p-3">
              <button onClick={() => onSelect(c.vendor)} className="flex gap-3 items-center flex-1 text-left min-w-0"><Avatar user={c.vendor} size={44} /><div className="flex-1 min-w-0"><p className="text-[12px] font-bold truncate flex items-center">{c.vendor?.vendor_name || 'User'}<VerifiedBadge vendor={c.vendor} size={13} /></p><p className="text-[11px] text-zinc-400 truncate">{c.lastMessage || 'Tap to chat'}</p></div>{c.unread > 0 && <span className="bg-[#39FF14] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{c.unread}</span>}</button>
              <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }} className="w-8 h-8 flex items-center justify-center text-[18px] font-black text-zinc-400">⋮</button>
              {openMenu === c.id && (<div className="absolute right-2 top-12 z-20 w-[190px] bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}><button onClick={() => { setOpenMenu(null); onViewProfile && onViewProfile(c.vendor); }} className="w-full text-left px-4 py-3 text-[12px] border-b border-zinc-700">👤 View Profile</button><button onClick={() => reportVendor(c)} className="w-full text-left px-4 py-3 text-[12px] border-b border-zinc-700">🚩 Report</button><button onClick={() => deleteChat(c)} className="w-full text-left px-4 py-3 text-[12px] text-red-400 font-bold">🗑️ Delete Chat</button></div>)}
            </div>
          ))}
          {filteredChats.length === 0 && (<div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 text-center"><p className="text-[12px] font-bold">No vendor chats yet</p><p className="text-[11px] text-zinc-500 mt-1">Go to Home or Shop, tap Message to chat a vendor.</p></div>)}
        </div>
      )}
    </div>
  );
}
function ChatRoomWithActions({ user, vendor, product, onBack, onViewProfile, profile, onSent }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [starredToday, setStarredToday] = useState(false);
  const [starCount, setStarCount] = useState(0);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs]);
  const loadStars = async () => {
    if (!vendor?.id) return;
    try {
      const { count } = await supabase.from('vendor_stars').select('*', { count: 'exact', head: true }).eq('vendor_id', vendor.id);
      if (count != null) setStarCount(count);
    } catch {
      try { setStarCount(JSON.parse(localStorage.getItem(`faster_stars_${vendor.id}`) || '[]').length); } catch {}
    }
    try {
      const { data } = await supabase.from('vendor_stars').select('*').eq('vendor_id', vendor.id).eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(1);
      if (data && data.length > 0) {
        const last = new Date(data[0].created_at);
        const now = new Date();
        const diffH = (now - last) / (1000 * 60 * 60);
        if (diffH < 24) setStarredToday(true);
      }
    } catch {}
  };
  useEffect(() => { loadStars(); }, [vendor?.id]);
  useEffect(() => {
    if (!vendor?.id) return;
    const load = async () => {
      let combined = [];
      try { const { data, error } = await supabase.from('messages').select('*').or(`and(sender_id.eq.${user.id},receiver_id.eq.${vendor.id}),and(sender_id.eq.${vendor.id},receiver_id.eq.${user.id})`).order('created_at', { ascending: true }); if (!error && data) combined = data.map(m => ({ id: m.id, sender_id: m.sender_id, text: m.text || m.message || '', reply_to_text: m.reply_to_text || null, created_at: m.created_at })); } catch {}
      const local = getLocalChats(user.id).filter(m => (m.sender_id === user.id && m.receiver_id === vendor.id) || (m.sender_id === vendor.id && m.receiver_id === user.id));
      local.forEach(m => { if (!combined.find(x => x.id === m.id)) combined.push({ id: m.id, sender_id: m.sender_id, text: m.text, created_at: m.created_at }); });
      combined.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); setMsgs(combined);
      try { await supabase.from('messages').update({ is_read: true }).eq('receiver_id', user.id).eq('sender_id', vendor.id); } catch {}
    };
    load();
    const ch = supabase.channel(`chat-${user.id}-${vendor.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => { const m = p.new; const isThisChat = (m.sender_id === user.id && m.receiver_id === vendor.id) || (m.sender_id === vendor.id && m.receiver_id === user.id); if (isThisChat) setMsgs(prev => { if (prev.find(x => x.id === m.id)) return prev; return [...prev, { id: m.id, sender_id: m.sender_id, text: m.text || '', created_at: m.created_at }]; }); }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [vendor?.id, user?.id]);
  const send = async () => {
    if (!text.trim() || sending) return;
    const clean = text.trim(); const tempId = 'temp-' + Date.now();
    setMsgs(prev => [...prev, { id: tempId, sender_id: user.id, text: clean, reply_to_text: replyTo?.text || null, created_at: new Date().toISOString() }]);
    setReplyTo(null);
    setText(''); setSending(true);
    try { const { data, error } = await supabase.from('messages').insert({ sender_id: user.id, receiver_id: vendor.id, text: clean, reply_to_text: replyTo?.text || null, is_read: false }).select().single(); if (error) { saveLocalMessage(user.id, { id: tempId, sender_id: user.id, receiver_id: vendor.id, text: clean, created_at: new Date().toISOString() }); } else if (data) setMsgs(prev => prev.map(m => m.id === tempId ? { ...m, id: data.id } : m)); try { await supabase.from('notifications').insert({ user_id: vendor.id, actor_id: user.id, actor_name: profile?.vendor_name || 'User', type: 'message', title: 'New message', message: clean, product_id: product?.id || null, is_read: false }); } catch {} } catch {}
    setSending(false); if (onSent) onSent();
  };
  const giveStar = async () => {
    if (!vendor || vendor.id === user.id) return alert("You can't star yourself");
    if (starredToday) return alert('You already gave ⭐ to this vendor today. Come back after your next delivery.');
    if (!confirm(`Give ⭐ to ${vendor.vendor_name}?\n\nThis means: I paid, I received my package, transaction successful.`)) return;
    try { const {data:_ex} = await supabase.from('vendor_stars').select('id').eq('vendor_id', vendor?.id).eq('user_id', user?.id).maybeSingle(); if(_ex) return; await supabase.from('vendor_stars').insert({ vendor_id: vendor.id, buyer_id: user.id, buyer_name: profile?.vendor_name || user.email?.split('@')[0] || 'Buyer' }); } catch (e) { console.log('Star table not yet created, using local', e.message); }
    try { const arr = JSON.parse(localStorage.getItem(`faster_stars_${vendor.id}`) || '[]'); arr.push({ buyer_id: user.id, created_at: new Date().toISOString() }); localStorage.setItem(`faster_stars_${vendor.id}`, JSON.stringify(arr)); } catch {}
    try { await supabase.from('notifications').insert({ user_id: vendor.id, actor_id: user.id, actor_name: profile?.vendor_name || 'Buyer', type: 'star', title: '⭐ New Star!', message: `${profile?.vendor_name || 'A buyer'} confirmed delivery and gave you ⭐ - your rating went up!`, is_read: false }); } catch {}
    try { await supabase.from('messages').insert({ sender_id: user.id, receiver_id: vendor.id, text: `⭐ I confirm - I received my package, transaction successful! Thank you ${vendor.vendor_name}!`, is_read: false }); } catch {}
    setStarredToday(true); setStarCount(c => c + 1);
    setMsgs(prev => [...prev, { id: 'star-' + Date.now(), sender_id: user.id, text: `⭐ I confirm - I received my package, transaction successful!`, created_at: new Date().toISOString() }]);
    alert(`⭐ Star given! ${vendor.vendor_name} now has ${starCount + 1} stars. Thank you for confirming delivery.`);
  };
  const deleteChat = async () => { setShowMenu(false); if (!confirm(`Delete chat with ${vendor.vendor_name}?`)) return; try { await supabase.from('messages').delete().or(`and(sender_id.eq.${user.id},receiver_id.eq.${vendor.id}),and(sender_id.eq.${vendor.id},receiver_id.eq.${user.id})`); } catch {} deleteLocalChat(user.id, vendor.id); setMsgs([]); onBack(); };
  if (!vendor) return <div className="p-6 text-center"><button onClick={onBack} className="bg-white text-black px-5 py-2 rounded-full text-[11px] font-bold">Back</button></div>;
  return (
    <div className="flex flex-col h-[calc(100vh-120px)] relative" onClick={() => showMenu && setShowMenu(false)}>
      <div className="p-3 flex items-center gap-3 border-b border-zinc-900 bg-black sticky top-0">
        <button onClick={onBack}>←</button>
        <button onClick={() => onViewProfile && onViewProfile(vendor)} className="flex items-center gap-2 flex-1 text-left"><Avatar user={vendor} size={36} /><div><p className="text-[12px] font-black flex items-center">{vendor.vendor_name}<VerifiedBadge vendor={vendor} size={13} /></p><p className="text-[10px] text-[#39FF14] mt-1">● Online • ⭐ {starCount} stars</p></div></button>
        <button onClick={giveStar} className={`w-10 h-10 rounded-full text-[20px] font-black shrink-0 ${starredToday ? 'bg-zinc-800 text-zinc-500' : 'bg-[#FFD700] text-black'}`} title="Tap ⭐ after you receive your package">⭐</button>
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="w-9 h-9 text-[20px] font-black">⋮</button>
        {showMenu && (<div className="absolute right-0 top-10 z-30 w-[200px] bg-zinc-800 border border-zinc-700 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}><button onClick={() => { setShowMenu(false); onViewProfile && onViewProfile(vendor); }} className="w-full text-left px-4 py-3 text-[12px] border-b border-zinc-700">👤 View Profile</button><button onClick={giveStar} className="w-full text-left px-4 py-3 text-[12px] border-b border-zinc-700">⭐ Give Star - Confirm Delivery</button><button onClick={deleteChat} className="w-full text-left px-4 py-3 text-[12px] text-red-400 font-bold">🗑️ Delete Chat</button></div>)}
      </div>
      <div className="mx-3 mt-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-2xl p-3 flex gap-2 items-center"><span className="text-[20px]">⭐</span><div className="flex-1"><p className="text-[11px] font-bold">Received your package from {vendor.vendor_name}?</p><p className="text-[10px] text-zinc-400">Tap ⭐ to confirm delivery. It adds to their rating for Vendor of the Year.</p></div><button onClick={giveStar} className={`px-4 py-2 rounded-full text-[11px] font-black shrink-0 ${starredToday ? 'bg-zinc-800 text-zinc-400' : 'bg-[#FFD700] text-black'}`}>{starredToday ? 'Starred ✓' : 'Give ⭐'}</button></div>
      {product && (<div className="mx-3 mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 flex gap-3 items-center"><img loading="lazy" decoding="async" src={product.images?.[0] || ''} className="w-12 h-12 rounded-xl object-cover bg-zinc-800" alt="" /><div><p className="text-[11px] font-bold">{product.title || product.name}</p><p className="text-[10px] text-[#39FF14] font-black">₦{product.price}</p></div></div>)}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.length === 0 && (<div className="text-center mt-10 px-6"><p className="text-[28px]">👋</p><p className="text-[12px] font-bold mt-2">Say hi to {vendor.vendor_name}</p><p className="text-[11px] text-zinc-500">Ask about price, size, delivery. After you receive package, tap ⭐ to confirm.</p></div>)}
        {msgs.map(m => (
  <div key={m.id} onClick={() => setReplyTo(m)} className={`max-w-[80%] px-3 py-2 rounded-2xl text-[13px] relative group cursor-pointer active:opacity-80 ${m.sender_id === user.id ? 'ml-auto bg-[#39FF14] text-black' : 'mr-auto bg-zinc-900 border border-zinc-800'}`}>
    {m.reply_to_text && <div className={`text-[10px] px-2 py-1 rounded-lg mb-1 opacity-70 border-l-2 ${m.sender_id === user.id ? 'bg-black/10 border-black' : 'bg-black/40 border-[#39FF14]'}`}>↩️ Replying to: {m.reply_to_text}</div>}
    <div>{m.text}</div>
    <button onClick={() => setReplyTo(m)} className="text-[10px] mt-1 opacity-60 font-bold">↩️ Reply</button>
  </div>
))}
      </div>
      {replyTo && (<div className="mx-3 mb-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 flex justify-between items-center"><p className="text-[11px] text-zinc-400 truncate">↩️ Replying to: <span className="text-white">{replyTo.text}</span></p><button onClick={() => setReplyTo(null)} className="text-[14px] px-2">✕</button></div>)}<div className="p-3 border-t border-zinc-900 bg-black flex gap-2 pb-4"><input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={`Message ${vendor.vendor_name}...`} className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-[13px] outline-none" /><button onClick={send} disabled={sending} className="bg-[#39FF14] text-black w-11 h-11 rounded-full font-black">➤</button></div>
    </div>
  );
}
function BuyerPublicProfile({ vendor, currentUser, onBack, onMessage }) {
  return (
    <div className="pb-6">
      <div className="relative"><div className="h-[110px] bg-gradient-to-br from-zinc-900 to-black" /><button onClick={onBack} className="absolute top-3 left-3 bg-black/70 px-4 py-2 rounded-full text-[11px] font-bold">← Back</button></div>
      <div className="px-4 -mt-10"><Avatar user={vendor} size={88} /><h1 className="font-black text-[20px] mt-3">{vendor.vendor_name}</h1><p className="text-[11px] text-zinc-500 mt-1">@{vendor.vendor_name?.toLowerCase().replace(/\s/g,'')} • Lagos</p><span className="inline-block mt-2 bg-[#39FF14]/15 text-[#39FF14] text-[9px] px-2.5 py-1 rounded-full font-black">🛍️ BUYER ACCOUNT</span><p className="text-[12px] text-zinc-300 mt-3">{vendor.bio || 'Shops on Faster Shop.'}</p>{currentUser?.id !== vendor?.id && <button onClick={onMessage} className="w-full mt-4 bg-white text-black py-3.5 rounded-full text-[12px] font-black">Message 💬</button>}</div>
    </div>
  );
}
function VendorOrders({ user, profile }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    let list = [];
    try {
      const { data, error } = await supabase.from('orders').select('*').eq('vendor_id', user.id).order('created_at', { ascending: false }).limit(100);
      if (!error && data) list = data;
      if (list.length === 0) {
        const { data: data2 } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100);
        if (data2) list = data2.filter(o => !o.vendor_id || o.vendor_id === user.id);
      }
    } catch {}
    if (list.length === 0) {
      try { const all = JSON.parse(localStorage.getItem(`faster_orders_${user.id}`) || '[]'); list = all; } catch {}
      try { const all2 = JSON.parse(localStorage.getItem('faster_orders_fastershop_all') || '[]'); if (isFasterShopVendor(profile)) list = [...list, ...all2]; } catch {}
    }
    setOrders(list); setLoading(false);
  };
  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, [user?.id]);
  const updateStatus = async (order, newStatus) => {
    try { await supabase.from('orders').update({ status: newStatus }).eq('id', order.id); } catch {}
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('faster_orders_'));
      keys.forEach(k => { try { const arr = JSON.parse(localStorage.getItem(k) || '[]'); const upd = arr.map(o => o.id === order.id ? { ...o, status: newStatus } : o); localStorage.setItem(k, JSON.stringify(upd)); } catch {} });
    } catch {}
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
    try { await supabase.from('notifications').insert({ user_id: order.buyer_id || order.user_id, actor_id: user.id, actor_name: 'Faster Shop', type: 'order', title: `Order ${order.id} - ${newStatus}`, message: `Your order is now: ${newStatus}`, is_read: false }); } catch {}
  };
  const filtered = filter === 'All' ? orders : orders.filter(o => (o.status || '').toLowerCase().includes(filter.toLowerCase()));
  const totalSales = orders.reduce((s,o) => s + (Number(o.total || o.total_amount || 0) || 0), 0);
  const newCount = orders.filter(o => o.status === 'Order Placed' || o.status === 'Paid').length;
  const isFaster = isFasterShopVendor(profile);
  return (
    <div className="mt-6 border-t-2 border-[#39FF14] pt-4 space-y-3">
      <div className="flex justify-between items-center"><div><p className="font-black text-[14px]">📦 My Orders {isFaster ? '— FasterShop' : ''}</p><p className="text-[10px] text-zinc-500">{isFaster ? 'Paystack orders appear here automatically.' : 'When we connect you to Paystack, your paid orders will appear here automatically. For now, buyers confirm with ⭐ in chat.'}</p></div>{newCount > 0 && <span className="bg-[#39FF14] text-black text-[10px] font-black px-3 py-1 rounded-full">{newCount} NEW</span>}</div>
      <div className="flex gap-2"><div className="flex-1 bg-zinc-900 rounded-2xl p-3 text-center"><p className="font-black text-[16px]">{orders.length}</p><p className="text-[10px] text-zinc-500">Total Orders</p></div><div className="flex-1 bg-zinc-900 rounded-2xl p-3 text-center"><p className="font-black text-[16px] text-[#39FF14]">₦{totalSales.toLocaleString()}</p><p className="text-[10px] text-zinc-500">Total Sales</p></div></div>
      <div className="flex gap-2 overflow-x-auto">{['All','Order Placed','Paid','Preparing','Shipped','Delivered'].map(f => <button key={f} onClick={() => setFilter(f)} className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold ${filter === f ? 'bg-white text-black' : 'bg-zinc-900'}`}>{f}</button>)}</div>
      {loading && <p className="text-[11px] text-zinc-500 text-center py-4">Loading orders...</p>}
      {!loading && filtered.length === 0 && <div className="bg-zinc-900 rounded-2xl p-6 text-center"><p className="text-[24px]">📦</p><p className="text-[12px] font-bold mt-1">No orders yet</p><p className="text-[11px] text-zinc-500">{isFaster ? 'When a buyer pays for a FasterShop product, it will show here.' : 'When we connect you to Paystack, paid orders will show here. For now, buyers will message you + give ⭐ after delivery.'}</p><p className="text-[10px] text-[#FFD700] mt-2">⭐ Your stars still count from chat — even without Paystack yet</p></div>}
      {filtered.map(o => {
        const items = o.items || o.order_items || [];
        const buyerName = o.buyer_name || o.customer_name || o.buyer_email || 'Buyer';
        return (
          <div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between"><p className="font-black text-[12px]">Order {o.id}</p><span className="text-[10px] bg-[#39FF14] text-black px-2 py-1 rounded-full font-black">{o.status || 'Order Placed'}</span></div>
            <p className="text-[11px] text-zinc-400">👤 {buyerName} • {o.created_at ? new Date(o.created_at).toLocaleString() : ''}</p>
            <p className="text-[11px] text-zinc-300">{Array.isArray(items) ? items.map(i => `${i.title || i.name} x${i.qty || 1}`).join(', ') : 'Items'}</p>
            <p className="font-black text-[13px] text-[#39FF14]">₦{Number(o.total || o.total_amount || 0).toLocaleString()}</p>
            <div className="flex gap-2 flex-wrap">{['Preparing','Shipped','Out for Delivery','Delivered'].map(s => <button key={s} onClick={() => updateStatus(o, s)} className={`px-3 py-2 rounded-full text-[10px] font-bold ${o.status === s ? 'bg-[#39FF14] text-black' : 'bg-zinc-800'}`}>{s}</button>)}</div>
            <button onClick={async () => { try { await supabase.from('messages').insert({ sender_id: user.id, receiver_id: o.buyer_id || o.user_id, text: `Hi! Your order ${o.id} is now ${o.status}. Thank you for shopping!`, is_read: false }); alert('Message sent to buyer'); } catch { alert('Could not message buyer'); } }} className="w-full bg-white text-black py-2.5 rounded-full text-[11px] font-bold">💬 Message Buyer</button>
          </div>
        );
      })}
    </div>
  );
}
function CartTab({ cart, setCart, fasterShop, user, profile }) {
  const [orders, setOrders] = useState(() => { try { return JSON.parse(localStorage.getItem(`faster_orders_${user?.id}`) || '[]'); } catch { return []; } });
  const [showTracking, setShowTracking] = useState(null);
  const [paying, setPaying] = useState(false);
  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
  const deliveryFee = cart.length > 0 ? 2500 : 0;
  const grandTotal = total + deliveryFee;
  const updateQty = (id, delta) => { setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, (i.qty || 1) + delta) } : i)); };
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const checkout = async () => {
    if (cart.length === 0) return alert('Cart is empty');
    setPaying(true);
    const orderId = 'FS-' + Date.now().toString().slice(-6);
    const vendorId = fasterShop?.id || cart[0]?.vendor_id || null;
    const order = { id: orderId, vendor_id: vendorId, buyer_id: user.id, user_id: user.id, buyer_name: profile?.vendor_name || user.email?.split('@')[0], buyer_email: user.email, items: cart, total: grandTotal, total_amount: grandTotal, status: 'Order Placed', created_at: new Date().toISOString(), tracking: [{ label: 'Order Placed', done: true, time: new Date().toLocaleString() }, { label: 'Preparing', done: false }, { label: 'Shipped', done: false }, { label: 'Out for Delivery', done: false }, { label: 'Delivered', done: false }] };
    try { await supabase.from('orders').insert({ id: orderId, vendor_id: vendorId, buyer_id: user.id, user_id: user.id, buyer_name: order.buyer_name, buyer_email: user.email, items: cart, total: grandTotal, total_amount: grandTotal, status: 'Order Placed' }); } catch (e) { console.log('Orders table not yet created', e.message); }
    try { await supabase.from('notifications').insert({ user_id: fasterShop?.id, actor_id: user.id, actor_name: order.buyer_name, type: 'order', title: `New Order ${orderId}`, message: `${order.buyer_name} ordered ${cart.length} item(s) - ₦${grandTotal.toLocaleString()}`, is_read: false }); } catch {}
    const newOrders = [order, ...orders]; setOrders(newOrders); localStorage.setItem(`faster_orders_${user?.id}`, JSON.stringify(newOrders));
    try { const all = JSON.parse(localStorage.getItem('faster_orders_fastershop_all') || '[]'); localStorage.setItem('faster_orders_fastershop_all', JSON.stringify([order, ...all])); } catch {}
    setCart([]); setPaying(false); alert(`Payment successful! Order ${order.id} placed. FasterShop will see it in Orders now.`); setShowTracking(order.id);
  };
  const advanceTracking = (orderId) => {
    const updated = orders.map(o => { if (o.id !== orderId) return o; const idx = o.tracking.findIndex(t => !t.done); if (idx !== -1) { o.tracking[idx].done = true; o.tracking[idx].time = new Date().toLocaleString(); o.status = o.tracking[idx].label; } return { ...o }; });
    setOrders(updated); localStorage.setItem(`faster_orders_${user?.id}`, JSON.stringify(updated));
  };
  return (
    <div className="p-4 space-y-4">
      <h2 className="font-black text-[18px]">Cart 🛒 — Faster Shop Store Only</h2>
      <p className="text-[11px] text-zinc-500">Only Faster Shop store products can be paid with Paystack + tracked.</p>
      {cart.length === 0 ? (<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center"><p className="text-[32px]">🛒</p><p className="text-[12px] font-bold mt-2">Cart is empty</p><p className="text-[11px] text-zinc-500">Go to Shop, look for ✓ Verified Faster Shop products and tap Add to Cart.</p></div>) : (<><div className="space-y-2">{cart.map(item => (<div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex gap-3"><img loading="lazy" decoding="async" src={item.images?.[0] || ''} className="w-16 h-16 rounded-xl object-cover bg-zinc-800" alt="" /><div className="flex-1"><p className="text-[12px] font-bold">{item.title || item.name}</p><p className="text-[10px] text-zinc-400">Faster Shop ✓ Verified</p><p className="text-[11px] font-black text-[#39FF14] mt-1">₦{Number(item.price).toLocaleString()} x {item.qty || 1}</p><div className="flex gap-2 mt-2"><button onClick={() => updateQty(item.id, -1)} className="bg-zinc-800 w-7 h-7 rounded-full">-</button><span className="text-[12px] font-bold py-1">{item.qty || 1}</span><button onClick={() => updateQty(item.id, 1)} className="bg-zinc-800 w-7 h-7 rounded-full">+</button><button onClick={() => removeItem(item.id)} className="ml-auto text-[11px] text-red-400">Remove</button></div></div></div>))}</div><div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1 text-[12px]"><div className="flex justify-between"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div><div className="flex justify-between"><span>Delivery (Lagos)</span><span>₦{deliveryFee.toLocaleString()}</span></div><div className="flex justify-between font-black text-[14px] pt-2 border-t border-zinc-800"><span>Total</span><span className="text-[#39FF14]">₦{grandTotal.toLocaleString()}</span></div></div><button onClick={checkout} disabled={paying} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[12px]">{paying ? 'Processing...' : `Pay ₦${grandTotal.toLocaleString()} with Paystack →`}</button></>)}
      <div><p className="font-black text-[13px] mb-2">My Orders & Tracking 📦</p>{orders.length === 0 ? <p className="text-[11px] text-zinc-500 bg-zinc-900 p-4 rounded-2xl text-center">No orders yet. After delivery, tap ⭐ in chat to confirm + rate vendor.</p> : orders.map(o => (<div key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-2"><div className="flex justify-between"><p className="font-black text-[12px]">Order {o.id}</p><span className="text-[10px] bg-[#39FF14] text-black px-2 py-1 rounded-full font-black">{o.status}</span></div><p className="text-[11px] text-zinc-400 mt-1">{o.items.length} items • ₦{o.total.toLocaleString()} • {new Date(o.created_at).toLocaleString()}</p><button onClick={() => setShowTracking(showTracking === o.id ? null : o.id)} className="mt-2 text-[11px] bg-zinc-800 px-4 py-2 rounded-full font-bold">{showTracking === o.id ? 'Hide Tracking' : 'Track Delivery →'}</button>{showTracking === o.id && (<div className="mt-3 space-y-2">{o.tracking.map((t, i) => (<div key={i} className="flex gap-2 items-center"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${t.done ? 'bg-[#39FF14] text-black' : 'bg-zinc-800'}`}>{t.done ? '✓' : '○'}</span><p className="text-[11px]">{t.label}</p>{t.time && <span className="text-[9px] text-zinc-500 ml-auto">{t.time}</span>}</div>))}<button onClick={() => advanceTracking(o.id)} className="mt-2 w-full bg-white text-black py-2 rounded-full text-[10px] font-bold">Simulate Next Step (Demo)</button></div>)}</div>))}</div>
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
  const [cart,setCart]=useState(()=>{ try { return JSON.parse(localStorage.getItem('faster_cart') || '[]'); } catch { return []; } })
  const [followMap,setFollowMap]=useState({})
  const [likes,setLikes]=useState({})
  const [comments,setComments]=useState({})
  const [notifications,setNotifications]=useState([])
  const [showUche,setShowUche]=useState(false)
  const [msgRefresh,setMsgRefresh]=useState(0)
  const currentEmail=(user?.email||profile?.email||'').toLowerCase().trim()
  const isAdmin=ADMIN_EMAILS.includes(currentEmail)||profile?.is_faster_shop===true
  useEffect(()=>{ localStorage.setItem('faster_cart', JSON.stringify(cart)); },[cart])
  useEffect(()=>{supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))},[])
  useEffect(()=>{if(user)loadAll()},[user])
  useEffect(()=>{
    if(!user) return;
    const loadNotifs = async () => { const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(200); if (data) setNotifications(data); };
    loadNotifs();
    const ch1 = supabase.channel(`notifs-${user.id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:`user_id=eq.${user.id}`},p=>setNotifications(prev=>[p.new,...prev])).subscribe();
    const ch2 = supabase.channel(`msgs-notif-${user.id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`receiver_id=eq.${user.id}`}, async (p) => {
      const m = p.new; let senderName = 'Someone';
      try { const { data } = await supabase.from('profiles').select('vendor_name,email').eq('id', m.sender_id).maybeSingle(); senderName = data?.vendor_name || data?.email?.split('@')[0] || 'Someone'; } catch {}
      setNotifications(prev => [{ id: 'local-notif-' + m.id, user_id: user.id, actor_id: m.sender_id, actor_name: senderName, type: 'message', title: 'New message', message: m.text || 'New message', created_at: m.created_at || new Date().toISOString(), is_read: false }, ...prev]);
    }).subscribe();
    const t = setInterval(loadNotifs, 10000);
    return ()=>{ supabase.removeChannel(ch1); supabase.removeChannel(ch2); clearInterval(t); }
  },[user?.id])
  const loadAll=async()=>{
    let {data:p}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()
    if(!p){
      const wantedRole = localStorage.getItem('faster_role') || user.user_metadata?.role || 'buyer'
      const {data:p2} = await supabase.from('profiles').insert({id:user.id,email:user.email,is_vendor:wantedRole==='vendor',vendor_name:user.email?.split('@')[0]||'Vendor'}).select().single();
      p = p2 || (await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()).data;
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
    try{await supabase.from('notifications').insert({user_id:targetUserId,actor_id:user.id,actor_name:profile?.vendor_name||user.email?.split('@')[0]||'User',type,title,message,product_id,is_read:false})}catch(e){}
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
    if(data){ setComments(prev=>({...prev,[pid]:[...(prev[pid]||[]),data]})); const prod=products.find(x=>x.id===pid); if(prod) sendNotif(prod.vendor_id,'comment','New comment',`commented: "${text}" on ${prod.title||prod.name}`,pid) }
  }
  const deletePost=async(pid)=>{ if(!confirm('Delete this post?'))return; await supabase.from('products').delete().eq('id',pid); setProducts(prev=>prev.filter(p=>p.id!==pid)) }
  const openStories=(list)=>{if(!list||!list.length)return;setActiveStories(list);setActiveStoryIdx(0)}
  const handleDM=(v,p)=>{ if(!v) return; if(v.id===user.id){ alert("You can't message yourself"); return } setSelectedChat(v); setSelectedProduct(p); setTab('chat') }
  const addToCart=(p)=>{
    const v=getVendor(p.vendor_id);
    const isFaster = isFasterShopVendor(v) || v?.is_faster_shop === true || p.vendor_id === fasterShop?.id;
    if(!isFaster){ alert('Cart is only for Faster Shop store for now. For other vendors, chat them + give ⭐ after delivery. Soon their products will also go to Cart with Paystack split.'); return; }
    setCart(prev=>{ const found=prev.find(x=>x.id===p.id); if(found) return prev.map(x=>x.id===p.id?{...x,qty:(x.qty||1)+1}:x); return [...prev,{...p,qty:1}]; });
    alert('Added to cart! Go to Cart to pay with Paystack.');
  }
  if(!user) return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <ClothesRain />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div>
        <h1 className="font-black mt-3 tracking-widest">FASTER SHOP</h1>
        <p className="text-[11px] text-zinc-300 mt-1 mb-4">Lagos fashion is raining 👕👗🧢</p>
        <AuthForm/>
        <button onClick={()=>alert("Hi! I'm Uche. Login to chat with me.")} className="mt-4 bg-white text-black px-5 py-2.5 rounded-full text-[11px] font-black">💬 Chat Uche - Need Help?</button>
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
      {showUche && <UcheChatFull user={user} profile={profile} onClose={()=>setShowUche(false)} />}
      {activeStories&&<StoryViewer stories={activeStories} idx={activeStoryIdx} setIdx={setActiveStoryIdx} onClose={()=>setActiveStories(null)} getVendor={getVendor}/>}
      {tab==='home'&&<Home products={products} stories={stories} fasterShop={fasterShop} vendors={vendors} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}} onDM={handleDM} onStoryClick={openStories} getVendor={getVendor} user={user} likes={likes} toggleLike={toggleLike} comments={comments} addComment={addComment} deletePost={deletePost} vendorsList={vendors} profile={profile} onAddToCart={addToCart} />}
      {tab==='shop'&&<Shop products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} getVendor={getVendor} user={user} likes={likes} toggleLike={toggleLike} onAddToCart={addToCart} fasterShop={fasterShop} />}
      {tab==='search'&&<><Search vendors={vendors} fasterShop={fasterShop} products={products} getVendor={getVendor} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}}/><FasterFinds /><EventsList /></>}
      {tab==='vendor'&&(selectedVendor && selectedVendor.is_vendor === false ? <BuyerPublicProfile vendor={selectedVendor} currentUser={user} onBack={()=>setTab('home')} onMessage={()=>{ setSelectedChat(selectedVendor); setTab('chat'); }} /> : <VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} stories={stories.filter(s=>(s.vendor_id===selectedVendor?.id||s.user_id===selectedVendor?.id))} onBack={()=>setTab('home')} onStoryClick={openStories} reload={loadAll} followMap={followMap} setFollowMap={setFollowMap} fasterShop={fasterShop} sendNotif={sendNotif} getVendor={getVendor} isAdmin={isAdmin} onAddToCart={addToCart} onMessage={() => { setSelectedChat(selectedVendor); setSelectedProduct(null); setTab('chat'); }} />)}
      {tab==='messages'&&<MessagesListWithActions user={user} vendors={vendors} fasterShop={fasterShop} profile={profile} refreshKey={msgRefresh} onSelect={(v)=>{if(v.id===user.id) return; setSelectedChat(v);setTab('chat')}} onViewProfile={(v)=>{setSelectedVendor(v);setTab('vendor')}} onOpenUche={()=>setShowUche(true)} />}
      {tab==='chat'&&<ChatRoomWithActions user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>{setTab('messages'); setMsgRefresh(x=>x+1);}} onViewProfile={(v)=>{setSelectedVendor(v);setTab('vendor')}} profile={profile} onSent={()=>setMsgRefresh(x=>x+1)} />}
      {tab==='cart'&&<CartTab cart={cart} setCart={setCart} fasterShop={fasterShop} user={user} profile={profile} />}
      {tab==='profile'&&<>{profile?.is_vendor ? (<Profile user={user} profile={profile} products={products.filter(p=>p.vendor_id===user.id)} reload={loadAll} getVendor={getVendor}/>) : (<BuyerProfile user={user} profile={profile} reload={loadAll} setTab={setTab} products={products} likes={likes} getVendor={getVendor} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}} />)}{isAdmin && <><div className="mx-4 mt-6 mb-2 border-t-2 border-[#39FF14] pt-4"><p className="text-[12px] font-black">⚙️ ADMIN PANEL</p><p className="text-[10px] text-zinc-500">Logged in as: {currentEmail} • ADMIN ✅</p></div><AdminPanel user={user} profile={profile} /></>}</>}
      {tab==='notifications'&&<Notifications notifications={notifications} products={products} getVendor={getVendor} onBack={()=>setTab('home')} onOpenProduct={(p)=>{const v=getVendor(p?.vendor_id);if(v){setSelectedVendor(v);setTab('vendor')}}} onOpenChat={(actorId)=>{const v=getVendor(actorId);if(v && v.id!==user.id){setSelectedChat(v);setTab('chat')}}} onClear={async()=>{await supabase.from('notifications').update({is_read:true}).eq('user_id',user.id);setNotifications(prev=>prev.map(n=>({...n,is_read:true})))}}/>}
      {tab==='settings'&&<Settings user={user} profile={profile} reload={loadAll} onBack={()=>setTab('profile')} onOpenUche={()=>setShowUche(true)} />}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3 text-[10px]">
        <button onClick={()=>setTab('home')} className={tab==='home'?'text-white font-black':'text-zinc-500'}>Home</button>
        <button onClick={()=>setTab('search')} className={tab==='search'?'text-white font-black':'text-zinc-500'}>Search</button>
        <button onClick={()=>setTab('shop')} className={tab==='shop'?'text-white font-black':'text-zinc-500'}>Shop</button>
        <button onClick={()=>setTab('cart')} className={`relative ${tab==='cart'?'text-white font-black':'text-zinc-500'}`}>Cart {cart.length>0 && <span className="absolute -top-1 -right-2 bg-[#39FF14] text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cart.reduce((s,i)=>s+(i.qty||1),0)}</span>}</button>
        <button onClick={()=>{setTab('messages'); setMsgRefresh(x=>x+1);}} className={tab==='messages'?'text-white font-black':'text-zinc-500'}>Messages</button>
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
      if(mode==='login'){ const res = await supabase.auth.signInWithPassword({email,password}); if(res.error) throw res.error }
      else { localStorage.setItem('faster_role', role); const res = await supabase.auth.signUp({email,password, options:{ data:{ role } }}); if(res.error) throw res.error; alert('Account created! Check your email, then login.') }
    }catch(err){ alert(err.message) } finally{ setLoading(false) }
  }
  return (
    <form onSubmit={submit} className="w-full max-w-[340px] bg-black/70 backdrop-blur-md border border-white/20 rounded-[24px] p-5 space-y-3">
      <div className="flex bg-zinc-900 rounded-full p-1">
        <button type="button" onClick={()=>setMode('login')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${mode==='login'?'bg-white text-black':'text-zinc-400'}`}>Login</button>
        <button type="button" onClick={()=>setMode('signup')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${mode==='signup'?'bg-white text-black':'text-zinc-400'}`}>Sign Up</button>
      </div>
      {mode==='signup' && (<div className="flex bg-zinc-900 rounded-full p-1"><button type="button" onClick={()=>setRole('buyer')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${role==='buyer'?'bg-[#39FF14] text-black':'text-zinc-400'}`}>🛍️ Buyer</button><button type="button" onClick={()=>setRole('vendor')} className={`flex-1 py-2.5 rounded-full text-[12px] font-black ${role==='vendor'?'bg-[#39FF14] text-black':'text-zinc-400'}`}>🏪 Vendor</button></div>)}
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-3 text-[13px] outline-none"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-zinc-900 border border-zinc-700 rounded-full px-4 py-3 text-[13px] outline-none"/>
      <button disabled={loading} className="w-full bg-[#39FF14] text-black font-black py-3.5 rounded-full text-[13px]">{loading?'Please wait...':mode==='login'?'Login →':'Create Account →'}</button>
    </form>
  )
}
function StoryViewer({stories,idx,setIdx,onClose,getVendor}){
  const curr=stories[idx]
  useEffect(()=>{const t=setTimeout(()=>{if(idx<stories.length-1)setIdx(idx+1);else onClose()},5000);return()=>clearTimeout(t)},[idx,stories.length])
  if(!curr)return null
  const v=getVendor(curr.vendor_id||curr.user_id)
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex gap-1 p-2">{stories.map((_,i)=><div key={i} className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full bg-white ${i<idx?'w-full':i===idx?'w-1/2':''}`}/></div>)}</div>
      <div className="p-4 flex gap-3 items-center"><Avatar user={v} size={32} /><p className="text-[11px] font-bold flex items-center">{v?.vendor_name||'Vendor'}<VerifiedBadge vendor={v} size={13} /></p><button onClick={onClose} className="ml-auto">✕</button></div>
      <div className="flex-1 flex items-center justify-center" onClick={(e)=>{if(e.clientX<window.innerWidth/2)setIdx(Math.max(0,idx-1));else if(idx<stories.length-1)setIdx(idx+1);else onClose()}}><img loading="lazy" decoding="async" src={curr.image_url||curr.media_url||curr.url} className="max-h-[75vh] w-full object-contain" alt="" /></div>
      <p className="text-center text-[10px] text-zinc-500 pb-4">{idx+1}/{stories.length}</p>
    </div>
  );
}
function Search({vendors,fasterShop,products,getVendor,onOpenVendor}){
  const [q,setQ]=useState('')
  const [cat,setCat]=useState('All')
  const all=[...(fasterShop?[fasterShop]:[]),...vendors]
  const query=q.trim().toLowerCase()
  const TRENDING=['Agbada','Hoodies','Caps','Perfumes','Shoes','Bags','Hair & Wigs','Gym Wear','Kids Wear']
  const CATS2=['All','Men','Women','Hoodies','Gym Wear','Kids Wear','Hair & Wigs','Dresses','Traditional Wear','Streetwear','Shoes','Bags']
  const vFiltered=all.filter(v=>!query||(v.vendor_name||'').toLowerCase().includes(query)||(v.bio||'').toLowerCase().includes(query))
  const pFiltered=products.filter(p=>{ const matchesQ=!query||(p.title||p.name||'').toLowerCase().includes(query)||(p.category||'').toLowerCase().includes(query); const matchesCat=cat==='All'||(p.category||'').toLowerCase().includes(cat.toLowerCase()); return matchesQ&&matchesCat });
  return (
    <div className="p-4 space-y-4">
      <h2 className="font-black text-[20px]">Find your fit 🔍</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Agbada, Hoodies, Hair, Gym..." className="w-full bg-zinc-900 border-2 border-[#39FF14]/40 rounded-full px-4 py-3.5 text-[13px] outline-none" />
      <div><p className="text-[10px] font-black text-zinc-500 mb-2">🔥 TRENDING</p><div className="flex gap-2 overflow-x-auto">{TRENDING.map(t=><button key={t} onClick={()=>setQ(t)} className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold border ${q===t?'bg-[#39FF14] text-black':'bg-zinc-900 border-zinc-800'}`}>{t}</button>)}</div></div>
      <div><p className="text-[10px] font-black text-zinc-500 mb-2">CATEGORIES</p><div className="flex gap-2 overflow-x-auto">{CATS2.map(c=><button key={c} onClick={()=>setCat(c)} className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold border ${cat===c?'bg-white text-black':'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{c}</button>)}</div></div>
      <div className="flex gap-3 overflow-x-auto">{vFiltered.map(v=><button key={v.id} onClick={()=>onOpenVendor(v)} className="shrink-0 w-[140px] bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-left"><Avatar user={v} size={56} /><p className="text-[12px] font-bold mt-2 flex items-center">{v.vendor_name}<VerifiedBadge vendor={v} size={12} /></p><p className="text-[10px] text-zinc-400">{v.bio||'Faster Shop vendor'}</p><StarProgress vendorId={v.id} compact={true} /></button>)}</div>
      <div className="grid grid-cols-2 gap-3">{pFiltered.slice(0,20).map(p=>{const v=getVendor(p.vendor_id);return <button key={p.id} onClick={()=>{if(v)onOpenVendor(v)}} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-left"><img loading="lazy" decoding="async" src={p.images?.[0]||''} className="w-full h-36 object-cover bg-zinc-800" alt="" /><div className="p-2.5"><p className="text-[11px] font-bold truncate">{p.title||p.name}</p><p className="text-[10px] text-zinc-400 flex items-center">{v?.vendor_name}<VerifiedBadge vendor={v} size={11} /></p><p className="text-[11px] font-black text-[#39FF14]">₦{p.price} • {p.category}</p></div></button>})}</div>
    </div>
  );
}
function FollowList({title,ids,onClose,onOpenVendor}){
  const [list,setList]=useState([])
  useEffect(()=>{const load=async()=>{if(!ids.length){setList([]);return}const {data}=await supabase.from('profiles').select('*').in('id',ids);setList(data||[])};load()},[ids.join(',')])
  return (<div className="fixed inset-0 z-[100] bg-black/90 flex flex-col"><div className="p-4 flex justify-between"><p className="font-black">{title} ({list.length})</p><button onClick={onClose}>✕</button></div><div className="p-4 space-y-2 overflow-y-auto">{list.map(v=><button key={v.id} onClick={()=>{onClose();onOpenVendor(v)}} className="w-full bg-zinc-900 p-3 rounded-2xl flex gap-3 text-left"><Avatar user={v} size={40} /><p className="text-[12px] font-bold flex items-center">{v.vendor_name}<VerifiedBadge vendor={v} size={12} /></p></button>)}</div></div>);
}
function Notifications({notifications,products,getVendor,onBack,onOpenProduct,onOpenChat,onClear}){
  return (<div className="p-4"><div className="flex justify-between mb-4"><button onClick={onBack}>Back</button><h2 className="font-black">Notifications</h2>{notifications.length>0&&<button onClick={onClear} className="text-[10px] text-zinc-400">Mark all read</button>}</div>{notifications.length===0?<p className="text-center text-[12px] text-zinc-500 py-10">No notifications yet</p>:<div className="space-y-2">{notifications.map(n=>{const prod=products.find(p=>p.id===n.product_id);return <button key={n.id} onClick={()=>{if(n.type==='message')onOpenChat(n.actor_id);else if(prod)onOpenProduct(prod)}} className="w-full text-left bg-zinc-900 border border-zinc-800 p-3 rounded-2xl flex gap-3"><div className="flex-1"><p className="text-[11px] font-bold">{n.title} • {n.actor_name||''}</p><p className="text-[11px] text-zinc-300">{n.message}</p><p className="text-[9px] text-zinc-500">{n.created_at?new Date(n.created_at).toLocaleString():''}</p></div>{prod?.images?.[0]&&<img loading="lazy" src={prod.images[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />}</button>})}</div>}</div>);
}
function PostSlider({images}){
  const [idx,setIdx]=useState(0)
  const imgs=images?.filter(Boolean)||[]
  if(!imgs.length)return <div className="w-full h-80 bg-zinc-900" />
  return (<div className="relative w-full h-[380px] bg-black overflow-hidden"><img loading="lazy" decoding="async" src={imgs[idx]} className="w-full h-full object-cover" alt="" />{imgs.length>1&&<><button onClick={()=>setIdx((idx-1+imgs.length)%imgs.length)} className="absolute left-3 top-1/2 bg-black/50 w-7 h-7 rounded-full">‹</button><button onClick={()=>setIdx((idx+1)%imgs.length)} className="absolute right-3 top-1/2 bg-black/50 w-7 h-7 rounded-full">›</button><div className="absolute top-3 right-3 bg-black/60 text-[9px] px-2 py-1 rounded-full">{idx+1}/{imgs.length}</div></>}</div>);
}
function PostCard({p,v,user,likes,toggleLike,comments,addComment,deletePost,onDM,vendorsList,profile,onAddToCart,fasterShop}){
  const [showComments,setShowComments]=useState(false)
  const [commentText,setCommentText]=useState('')
  const imgs=p.images||[]
  const isOwn=user.id===p.vendor_id
  const isFaster = isFasterShopVendor(v) || v?.is_faster_shop === true || p.vendor_id === fasterShop?.id
  const getName=(uid)=>{if(uid===user.id) return 'You';const found=[...(vendorsList||[]),profile].find(x=>x?.id===uid);return found?.vendor_name||'User'}
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-3 flex gap-2 items-center"><Avatar user={v} size={32} /><div className="flex-1"><p className="text-[11px] font-bold flex items-center">{v?.vendor_name}<VerifiedBadge vendor={v} size={13} /></p><StarProgress vendorId={v?.id} compact={true} /></div>{isOwn&&<button onClick={()=>deletePost(p.id)} className="ml-auto">🗑️</button>}</div>
      <PostSlider images={imgs}/>
      <div className="p-3">
        <div className="flex gap-4 items-center"><button onClick={()=>toggleLike(p.id)}>{likes[p.id]?'❤️':'🤍'}</button><button onClick={()=>setShowComments(!showComments)}>💬 {(comments[p.id]||[]).length}</button>{!isOwn&&<div className="ml-auto flex gap-2"><button onClick={()=>onDM(v,p)} className="bg-white text-black text-[9px] px-3 py-2 rounded-full font-bold">Message</button>{isFaster&&<button onClick={()=>onAddToCart&&onAddToCart(p)} className="bg-[#39FF14] text-black text-[9px] px-3 py-2 rounded-full font-bold">Add to Cart</button>}</div>}</div>
        <p className="text-[11px] font-bold mt-2">{p.title||p.name}</p><p className="text-[10px] text-zinc-400">₦{p.price} • {p.category} {p.size?`• ${p.size}`:''} {isFaster&&<span className="text-[#FFD700] font-black">• Faster Shop ✓</span>}</p>
        {p.description&&<p className="text-[10px] text-zinc-300 mt-1">{p.description}</p>}
        {showComments&&(<div className="mt-3 space-y-2 border-t border-zinc-800 pt-3">{(comments[p.id]||[]).map(c=><div key={c.id} className="flex gap-2"><p className="text-[10px] font-bold">{getName(c.user_id)}</p><p className="text-[10px] text-zinc-300">{c.text}</p></div>)}<div className="flex gap-2"><input value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-zinc-800 rounded-full px-3 py-2 text-[10px]" /><button onClick={()=>{addComment(p.id,commentText);setCommentText('')}} className="bg-white text-black px-3 rounded-full text-[10px] font-bold">Post</button></div></div>)}
      </div>
    </div>
  );
}
function Featured({products,onOpenVendor,getVendor,onAddToCart}){
  const [i,setI]=useState(0)
  const list=products.filter(p=>p.images?.length>0).slice(0,15)
  useEffect(()=>{if(!list.length)return;const t=setInterval(()=>setI(v=>(v+1)%list.length),4000);return()=>clearInterval(t)},[list.length])
  if(!list.length)return <div className="h-60 bg-zinc-900 rounded-[24px] flex items-center justify-center"><p>Featured Drop</p></div>
  const curr=list[i]; const v=getVendor(curr.vendor_id); const isFaster=isFasterShopVendor(v) || v?.is_faster_shop===true
  return (<div className="h-[260px] rounded-[24px] overflow-hidden relative border border-[#39FF14]/30"><img loading="lazy" src={curr.images?.[0]} className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" /><div className="absolute bottom-0 p-4"><h2 className="font-black text-[20px] flex items-center">{curr.title}<VerifiedBadge vendor={v} size={16} /></h2><p className="text-[12px] text-zinc-300">₦{curr.price} • {curr.category}</p><div className="flex gap-2 mt-3"><button onClick={()=>onOpenVendor(getVendor(curr.vendor_id))} className="bg-[#39FF14] text-black px-5 py-2.5 rounded-full text-[11px] font-black">Shop Now →</button>{isFaster&&<button onClick={()=>onAddToCart&&onAddToCart(curr)} className="bg-white text-black px-5 py-2.5 rounded-full text-[11px] font-black">Add to Cart</button>}</div></div></div>);
}
function getGreeting(){
  const hour = Number(new Intl.DateTimeFormat('en-NG',{timeZone:'Africa/Lagos',hour:'numeric',hour12:false}).format(new Date()))
  if(hour >= 5 && hour < 12) return { title: 'Good morning, Lagos ☀️', sub: 'Fresh drops' }
  if(hour >= 12 && hour < 17) return { title: 'Lagos is buzzing 🔥', sub: "Fresh fits just landed" }
  if(hour >= 17 && hour < 21) return { title: 'Evening in Lagos 🌇', sub: 'Wind down with fresh drops' }
  return { title: 'Lagos never sleeps 🌙', sub: 'Late night drops' }
}
function Home({products,stories,fasterShop,vendors,selectedCategory,setSelectedCategory,onOpenVendor,onDM,onStoryClick,getVendor,user,likes,toggleLike,comments,addComment,deletePost,vendorsList,profile,onAddToCart}){
  const map={};stories.forEach(s=>{const id=s.vendor_id||s.user_id; if(id){if(!map[id])map[id]=[];map[id].push(s)}})
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  const greeting=getGreeting()
  return (
    <div className="p-4 space-y-5">
      <h1 className="font-black text-[22px]">{greeting.title}</h1><p className="text-[11px] text-zinc-500">{greeting.sub}</p>
      <div className="flex gap-3 overflow-x-auto">{fasterShop&&<button onClick={()=>map[fasterShop.id]?onStoryClick(map[fasterShop.id]):onOpenVendor(fasterShop)} className="flex flex-col items-center shrink-0"><Avatar user={fasterShop} size={58} /><span className="text-[9px] font-black flex items-center">FASTER<VerifiedBadge vendor={fasterShop} size={10} /></span></button>}{vendors.map(v=><button key={v.id} onClick={()=>map[v.id]?onStoryClick(map[v.id]):onOpenVendor(v)} className="flex flex-col items-center shrink-0"><Avatar user={v} size={58} /><span className="text-[9px] flex items-center">{v.vendor_name?.split(' ')[0]}<VerifiedBadge vendor={v} size={9} /></span></button>)}</div>
      <Featured products={products} onOpenVendor={onOpenVendor} getVendor={getVendor} onAddToCart={onAddToCart}/>
      <div className="flex gap-2 overflow-x-auto">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold border ${selectedCategory===c?'bg-[#39FF14] text-black':'bg-zinc-900 border-zinc-800'}`}>{c}</button>)}</div>
      <div className="space-y-4">{filtered.slice(0,30).map(p=><PostCard key={p.id} p={p} v={getVendor(p.vendor_id)} user={user} likes={likes} toggleLike={toggleLike} comments={comments} addComment={addComment} deletePost={deletePost} onDM={onDM} vendorsList={vendorsList} profile={profile} onAddToCart={onAddToCart} fasterShop={fasterShop} />)}</div>
    </div>
  );
}
function Shop({products,selectedCategory,setSelectedCategory,getVendor,user,likes,toggleLike,onAddToCart,fasterShop}){
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  return (<div className="p-4"><div className="flex gap-2 overflow-x-auto pb-3">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`px-4 py-2 rounded-full text-[11px] border ${selectedCategory===c?'bg-white text-black':'bg-zinc-900 border-zinc-800'}`}>{c}</button>)}</div><div className="grid grid-cols-2 gap-3">{filtered.map(p=>{const v=getVendor(p.vendor_id);const isFaster=isFasterShopVendor(v)||v?.is_faster_shop===true;return <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"><img loading="lazy" decoding="async" src={p.images?.[0]} className="w-full h-36 object-cover" alt="" /><div className="p-2"><p className="text-[10px] font-bold truncate">{p.title}</p><p className="text-[9px] text-zinc-400 flex items-center">₦{p.price} • {v?.vendor_name}<VerifiedBadge vendor={v} size={10} /></p>{isFaster?<button onClick={()=>onAddToCart&&onAddToCart(p)} className="w-full mt-2 bg-[#39FF14] text-black py-2 rounded-full text-[10px] font-black">Add to Cart 🛒</button>:<p className="mt-2 text-[9px] text-zinc-500">Chat vendor to order → After delivery tap ⭐</p>}</div></div>})}</div></div>);
}
function VendorProfile({vendor,currentUser,products,stories,onBack,onStoryClick,reload,followMap,setFollowMap,sendNotif,getVendor,isAdmin,onAddToCart, onMessage}){
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
  const toggleFollow=async()=>{ const isF=followMap[vendor.id]; const r=isF?await supabase.from('follows').delete().eq('follower_id',currentUser.id).eq('following_id',vendor.id):await supabase.from('follows').insert({follower_id:currentUser.id,following_id:vendor.id}); if(r.error)return alert(r.error.message); if(isF){const nm={...followMap};delete nm[vendor.id];setFollowMap(nm)}else{setFollowMap({...followMap,[vendor.id]:true});if(sendNotif)sendNotif(vendor.id,'follow','New follower','started following you',null)} await refreshFollowCounts() }
  const toggleVerify=async()=>{ const newVal=!isVerifiedVendor(vendor); const {error}=await supabase.from('profiles').update({is_verified:newVal}).eq('id',vendor.id); if(error) return alert('Verify failed - Run SQL to add is_verified column'); alert(newVal?`${vendor.vendor_name} is now VERIFIED ✓`:'Verification removed'); await reload(); }
  const openFollowList=async(type)=>{ const col=type==='followers'?'following_id':'follower_id'; const valCol=type==='followers'?'follower_id':'following_id'; const res=await supabase.from('follows').select(valCol).eq(col,vendor.id); setFollowIds((res.data||[]).map(x=>x[valCol])); setShowFollow(type) }
  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',vendor.id);await reload();setEditingBio(false)}
  const changeAvatar=async()=>{ const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=async(e)=>{const f=e.target.files?.[0];if(!f)return;const small=await compressImage(f);const name=`${vendor.id}/avatar-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;const up=await supabase.storage.from('product-images').upload(name,small,{upsert:true});if(up.error)return alert(up.error.message);const pub=supabase.storage.from('product-images').getPublicUrl(name);await supabase.from('profiles').update({avatar_url:pub.data.publicUrl}).eq('id',vendor.id);await reload();}; input.click() }
  const deletePost=async(pid)=>{ if(!confirm('Delete this post?'))return; await supabase.from('products').delete().eq('id',pid); setSelectedPost(null); await reload() }
  if(!vendor)return null
  const coverImg=products[0]?.images?.[0]||vendor.avatar_url||''
  const isFaster = isFasterShopVendor(vendor) || vendor?.is_faster_shop === true
  return (
    <div className="pb-6">
      <div className="relative"><div className="h-[140px] overflow-hidden">{coverImg?<img loading="lazy" src={coverImg} className="w-full h-full object-cover" alt="" />:<div className="w-full h-full bg-zinc-900" />}</div><div className="absolute top-3 left-3 right-3 flex justify-between"><button onClick={onBack} className="bg-black/70 px-4 py-2 rounded-full text-[11px] font-bold">← Back</button>{isVerifiedVendor(vendor)?<span className="bg-[#FFD700] text-black px-3 py-2 rounded-full text-[9px] font-black border border-black">✓ VERIFIED • FASTER SHOP APPROVED</span>:<span className="bg-zinc-900 px-3 py-2 rounded-full text-[9px] font-bold">NOT VERIFIED YET</span>}</div><div className="absolute -bottom-10 left-4"><Avatar user={vendor} size={82} /></div></div>
      <div className="pt-12 px-4">
        <h1 className="font-black text-[20px] flex items-center">{vendor.vendor_name}<VerifiedBadge vendor={vendor} size={18} /></h1>
        <p className="text-[11px] text-zinc-500">@{vendor.vendor_name?.toLowerCase().replace(/\s/g,'')} • Lagos {isFaster&&<span className="text-[#FFD700] font-black">• MAIN STORE</span>}</p>
        <StarProgress vendorId={vendor.id} />
        {isAdmin && !isFaster && <button onClick={toggleVerify} className={`w-full mt-3 py-3 rounded-full text-[11px] font-black ${isVerifiedVendor(vendor)?'bg-red-600 text-white':'bg-[#FFD700] text-black border-2 border-black'}`}>{isVerifiedVendor(vendor)?'✕ Remove Verification (Admin Only)':'✓ Verify This Vendor — Give Gold Tick (Admin Only)'}</button>}
        <div className="mt-3">{editingBio?<div><textarea value={bioText} onChange={e=>setBioText(e.target.value)} className="w-full bg-zinc-900 rounded-xl p-3 text-[12px]" /><button onClick={saveBio} className="bg-white text-black px-5 py-2 rounded-full text-[11px] font-bold mt-2">Save Bio</button></div>:<><p className="text-[12px] text-zinc-300">{vendor.bio||'Fresh drops, quality pieces.'}</p>{isOwn&&<button onClick={()=>setEditingBio(true)} className="text-[11px] bg-zinc-900 px-4 py-2 rounded-full mt-2">Edit Bio</button>}</>}</div>
        <div className="flex gap-2 mt-4 bg-zinc-900 rounded-2xl p-3"><div className="flex-1 text-center"><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><button onClick={()=>openFollowList('followers')} className="flex-1 text-center"><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></button><button onClick={()=>openFollowList('following')} className="flex-1 text-center"><p className="font-black">{following}</p><p className="text-[10px] text-zinc-500">Following</p></button></div>
        {!isOwn&&<div className="flex gap-2 mt-3"><button onClick={toggleFollow} className={`flex-1 py-3.5 rounded-full text-[12px] font-black ${followMap[vendor.id]?'bg-zinc-800':'bg-[#39FF14] text-black'}`}>{followMap[vendor.id]?'✓ Following':'Follow'}</button><button className="flex-1 py-3.5 rounded-full bg-white text-black text-[12px] font-black">Message 💬</button></div>}
        <div className="flex gap-2 mt-5"><button onClick={()=>setTab2('posts')} className={`px-4 py-2 rounded-full text-[11px] font-black ${tab2==='posts'?'bg-white text-black':'text-zinc-400'}`}>Posts ({products.length})</button><button onClick={()=>setTab2('about')} className={`px-4 py-2 rounded-full text-[11px] font-black ${tab2==='about'?'bg-white text-black':'text-zinc-400'}`}>About</button></div>
        {tab2==='about'?<p className="text-[11px] text-zinc-400 mt-4">{vendor.bio||'Vendor on Faster Shop.'} {isVerifiedVendor(vendor)?'• ✓ Verified':''}</p>:<div className="grid grid-cols-3 gap-1 mt-3">{products.map(p=><div key={p.id} onClick={()=>{setSelectedPost(p);setPostIdx(0)}} className="aspect-square bg-zinc-900 relative"><img loading="lazy" src={p.images?.[0]} className="w-full h-full object-cover" alt="" /><p className="absolute bottom-1 left-1 text-[9px] font-black">₦{p.price}</p></div>)}</div>}
      </div>
      {showFollow&&<FollowList title={showFollow} ids={followIds} onClose={()=>setShowFollow(null)} onOpenVendor={()=>setShowFollow(null)} />}
      {selectedPost&&(()=>{const imgs=selectedPost.images||[];return <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={()=>setSelectedPost(null)}><div className="p-4 flex justify-between" onClick={e=>e.stopPropagation()}><p className="font-black flex items-center">{vendor.vendor_name}<VerifiedBadge vendor={vendor} size={14} /></p><button onClick={()=>setSelectedPost(null)}>✕</button></div><div className="flex-1 flex items-center justify-center px-4" onClick={e=>e.stopPropagation()}>{imgs.length>0&&<img src={imgs[postIdx]} className="max-h-[60vh] object-contain" alt="" />}</div><div className="bg-zinc-900 p-4" onClick={e=>e.stopPropagation()}><p className="font-black">{selectedPost.title}</p><p className="text-[11px] text-zinc-300">{selectedPost.description||'No caption'}</p><p className="mt-2">₦{selectedPost.price} • {selectedPost.category}</p>{isFaster?<button onClick={()=>{setSelectedPost(null);onAddToCart&&onAddToCart(selectedPost)}} className="w-full mt-2 bg-[#39FF14] text-black py-3 rounded-full font-bold text-[11px]">🛒 Add to Cart - Pay with Paystack</button>:<p className="text-[10px] text-zinc-500 text-center mt-2">Chat vendor to order • After delivery tap ⭐ in chat</p>}{isOwn&&<button onClick={()=>deletePost(selectedPost.id)} className="w-full mt-2 bg-red-600 py-3 rounded-full text-[11px] font-bold">🗑️ Delete</button>}</div></div>})()}
    </div>
  );
}
function BuyerProfile({user,profile,reload,setTab,products,likes,getVendor,onOpenVendor}){
  const name = profile?.vendor_name || user.email?.split('@')[0] || 'User'
  const wishlist = (products||[]).filter(p=>likes?.[p.id])
  const changeAvatar = async () => { const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=async(e)=>{const f=e.target.files?.[0];if(!f)return;const small=await compressImage(f);const fn=`${user.id}/avatar-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;const {error}=await supabase.storage.from('product-images').upload(fn,small,{upsert:true});if(error)return alert(error.message);const {data}=supabase.storage.from('product-images').getPublicUrl(fn);await supabase.from('profiles').update({avatar_url:data.publicUrl}).eq('id',user.id);await reload();}; input.click() };
  return (<div className="p-4 space-y-4"><div className="bg-zinc-900 rounded-[24px] p-4 flex gap-4 items-center"><Avatar user={profile} size={72} /><div><p className="font-black text-[16px]">{name}</p><p className="text-[12px] text-zinc-400">{user.email}</p><span className="bg-[#39FF14]/15 text-[#39FF14] text-[9px] px-2 py-1 rounded-full font-black">🛍️ BUYER</span><button onClick={changeAvatar} className="block mt-2 text-[10px] bg-zinc-800 px-3 py-1 rounded-full">Change Photo</button></div></div><button onClick={()=>setTab('cart')} className="w-full bg-zinc-900 p-4 rounded-2xl text-left font-bold text-[13px]">📦 My Orders & Deliveries →</button><button onClick={()=>setTab('settings')} className="w-full bg-zinc-900 p-4 rounded-2xl text-left font-bold text-[13px]">⚙️ Account Settings →</button><p className="font-black text-[12px]">Saved ❤️ ({wishlist.length})</p>{wishlist.length===0?<p className="text-[11px] text-zinc-500">Tap ❤️ on any product to save it here.</p>:<div className="grid grid-cols-2 gap-3">{wishlist.map(p=>{const v=getVendor(p.vendor_id);return <button key={p.id} onClick={()=>onOpenVendor(v)} className="bg-zinc-900 rounded-2xl overflow-hidden text-left"><img loading="lazy" src={p.images?.[0]} className="w-full h-28 object-cover" alt="" /><p className="p-2 text-[11px] font-bold">{p.title} • ₦{p.price}</p></button>})}</div>}</div>);
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
  const ensureProfile=async()=>{ const {data:existing}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(); if(existing) return existing; const {data,error}=await supabase.from('profiles').insert({id:user.id,email:user.email,is_vendor:true,vendor_name:user.email.split('@')[0]}).select().single(); if(error) throw error; return data; }
  const openFollowList=async(type)=>{ const col=type==='followers'?'following_id':'follower_id'; const valCol=type==='followers'?'follower_id':'following_id'; const {data}=await supabase.from('follows').select(valCol).eq(col,user.id); setFollowIds((data||[]).map(r=>r[valCol])); setShowFollow(type) }
  const uploadProduct=async()=>{
    if(!form.title||files.length===0)return alert('Add title + images')
    setUploading(true)
    try{
      await ensureProfile()
      const urls=[]
      for(let i=0;i<files.length;i++){ const raw=files[i]; const f=await compressImage(raw); const name=`${user.id}/${Date.now()}-${i}-${raw.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`; const {error}=await supabase.storage.from('product-images').upload(name,f,{upsert:true,contentType:f.type}); if(error)throw error; const {data}=supabase.storage.from('product-images').getPublicUrl(name); urls.push(data.publicUrl) }
      const {error}=await supabase.from('products').insert({vendor_id:user.id,title:form.title,name:form.title,price:form.price||'20000',category:form.category,images:urls,is_featured:true,description:form.caption,size:form.size})
      if(error)throw error
      alert(`Posted! ${urls.length} slides — compressed for speed, username stays as ${profile?.vendor_name}`);
      setFiles([]); setPreviews([]); setForm({title:'',price:'',category:'Shoes',size:'',caption:''}); await reload(); setView('main')
    }catch(e){alert(e.message)}finally{setUploading(false)}
  }
  const onStoryFile=async(e)=>{
    const files=Array.from(e.target.files||[]); if(!files.length)return
    try{ await ensureProfile(); for(const raw of files){ const f=await compressImage(raw); const name=`${user.id}/story-${Date.now()}-${raw.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`; const {error}=await supabase.storage.from('product-images').upload(name,f,{upsert:true}); if(error)throw error; const {data}=supabase.storage.from('product-images').getPublicUrl(name); const expires=new Date(Date.now()+24*60*60*1000).toISOString(); await supabase.from('stories').insert({image_url:data.publicUrl,media_url:data.publicUrl,url:data.publicUrl,expires_at:expires,vendor_id:user.id,user_id:user.id,profile_id:user.id}) } alert('Story posted — lasts 24h'); await reload() }catch(err){alert('Story failed: '+err.message)} e.target.value=''
  }
  const changeAvatar=async()=>{ const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=async(e)=>{const f=e.target.files?.[0];if(!f)return;const small=await compressImage(f);const name=`${user.id}/avatar-${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'_')}`;const {error}=await supabase.storage.from('product-images').upload(name,small,{upsert:true});if(error)return alert(error.message);const {data}=supabase.storage.from('product-images').getPublicUrl(name);await supabase.from('profiles').update({avatar_url:data.publicUrl}).eq('id',user.id);await reload();}; input.click() }
  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',user.id);await reload();setEditingBio(false)}
  const deletePost=async(pid)=>{ if(!confirm('Delete this post?'))return; await supabase.from('products').delete().eq('id',pid); setSelectedPost(null); await reload() }
  if(view!=='main'){
    return (<div className="p-4"><button onClick={()=>setView('main')} className="mb-4 text-[12px]">Back</button>{view==='upload'&&(<div className="space-y-3"><h2 className="font-black">Upload Product</h2><p className="text-[10px] text-zinc-500">Posting as: <span className="text-white font-bold">{profile?.vendor_name}</span> — will NOT change your username</p><input placeholder="Title e.g MOONSHOT TEES" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-zinc-900 rounded-full px-4 py-3 text-[11px]" /><div className="flex gap-2"><input placeholder="Price 30000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="flex-1 bg-zinc-900 rounded-full px-4 py-3 text-[11px]" /><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="bg-zinc-900 rounded-full px-4 py-3 text-[11px] max-w-[160px]">{FULL_CATS.map(c=><option key={c}>{c}</option>)}</select></div><input placeholder="Size e.g M / L / 42" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className="w-full bg-zinc-900 rounded-full px-4 py-3 text-[11px]" /><textarea placeholder="Caption..." value={form.caption} onChange={e=>setForm({...form,caption:e.target.value})} className="w-full bg-zinc-900 rounded-xl px-4 py-3 text-[11px] h-20" /><input type="file" multiple accept="image/*" onChange={handleFiles} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl" /><p className="text-[9px] text-zinc-500">Up to 10 images • Auto-compressed for speed • {FULL_CATS.length} categories</p>{previews.length>0&&<div className="grid grid-cols-5 gap-2">{previews.map((p,i)=><img key={i} src={p} className="w-full h-16 object-cover rounded-lg" alt="" />)}</div>}<button onClick={uploadProduct} disabled={uploading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">{uploading?'Compressing + Uploading...':`Post ${files.length} Images`}</button></div>)}</div>)
  }
  return (
    <div className="p-4 space-y-4">
      <input ref={storyInputRef} type="file" accept="image/*" multiple onChange={onStoryFile} className="hidden" />
      <div className="flex gap-5"><div className="relative"><button onClick={changeAvatar}><Avatar user={profile} size={80} /></button><button onClick={()=>storyInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-[#39FF14] text-black w-7 h-7 rounded-full font-black border-2 border-black">+</button></div><div className="flex-1"><div className="flex gap-5"><div className="text-center"><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><button onClick={()=>openFollowList('followers')} className="text-center"><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></button><button onClick={()=>openFollowList('following')} className="text-center"><p className="font-black">{following}</p><p className="text-[10px] text-zinc-500">Following</p></button></div><div className="mt-2">{editingBio?<div><textarea value={bioText} onChange={e=>setBioText(e.target.value)} className="w-full bg-zinc-900 rounded-xl p-2 text-[11px]" /><button onClick={saveBio} className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold mt-1">Save</button></div>:<><p className="text-[11px] font-bold flex items-center">{profile?.vendor_name}<VerifiedBadge vendor={profile} size={13} /></p><p className="text-[11px]">{profile?.bio||'Add bio...'}</p><button onClick={()=>setEditingBio(true)} className="text-[10px] bg-zinc-900 px-3 py-1 rounded-full mt-1">Edit Bio</button></>}</div></div></div>
      <StarProgress vendorId={user.id} />
      {showFollow&&<FollowList title={showFollow} ids={followIds} onClose={()=>setShowFollow(null)} onOpenVendor={()=>setShowFollow(null)} />}
      <button onClick={()=>setView('upload')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Upload Product</button>
      <VendorOrders user={user} profile={profile} />
      <div className="grid grid-cols-3 gap-0.5 mt-4">{products.map(p=><div key={p.id} onClick={()=>{setSelectedPost(p);setPostIdx(0)}} className="aspect-square bg-zinc-900 relative"><img loading="lazy" src={p.images?.[0]} className="w-full h-full object-cover" alt="" /><p className="absolute bottom-0 text-[8px] font-bold p-1">₦{p.price}</p></div>)}</div>
      {products.length===0&&<p className="text-center text-[11px] text-zinc-500 mt-8">No posts yet — tap Upload Product</p>}
      {selectedPost&&(()=>{const imgs=selectedPost.images||[];return <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col" onClick={()=>setSelectedPost(null)}><div className="p-4 flex justify-between" onClick={e=>e.stopPropagation()}><p className="font-black flex items-center">{profile?.vendor_name}<VerifiedBadge vendor={profile} size={13} /></p><button onClick={()=>setSelectedPost(null)}>✕</button></div><div className="flex-1 flex items-center px-4" onClick={e=>e.stopPropagation()}>{imgs.length>0&&<img src={imgs[postIdx]} className="max-h-[60vh] w-full object-contain rounded-xl" alt="" />}</div><div className="bg-zinc-900 p-4" onClick={e=>e.stopPropagation()}><p className="font-bold">{selectedPost.title}</p><p className="text-[11px] text-zinc-300">{selectedPost.description||'No caption'}</p><p className="mt-1">₦{selectedPost.price} • {selectedPost.category}</p><button onClick={()=>deletePost(selectedPost.id)} className="w-full mt-2 bg-red-600 py-3 rounded-full text-[11px] font-bold">🗑️ Delete This Post</button></div></div>})()}
    </div>
  );
}
function Settings({user,profile,reload,onBack,onOpenUche}){
  const [notif,setNotif]=useState(true)
  const [sound,setSound]=useState(true)
  const [privateAcc,setPrivateAcc]=useState(false)
  const [currency,setCurrency]=useState('NGN (₦)')
  const [language,setLanguage]=useState('English')
  const [newPass,setNewPass]=useState('')
  const [bio,setBio]=useState(profile?.bio||'')
  const [vendorName,setVendorName]=useState(profile?.vendor_name||'')
  const saveProfile=async()=>{await supabase.from('profiles').update({bio,vendor_name:vendorName}).eq('id',user.id);await reload();alert('Profile saved — username will NOT reset on upload anymore')}
  const changePassword=async()=>{if(!newPass)return alert('Enter new password');const {error}=await supabase.auth.updateUser({password:newPass});if(error)alert(error.message);else{alert('Password changed');setNewPass('')}}
  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-3 items-center"><button onClick={onBack}>Back</button><h2 className="font-black">Settings</h2></div>
      <div className="bg-zinc-900 rounded-2xl p-4 space-y-3"><p className="font-bold">Account</p><p className="text-[11px] text-zinc-400">{user.email}</p><input value={vendorName} onChange={e=>setVendorName(e.target.value)} placeholder="Shop name" className="w-full bg-zinc-800 rounded-full px-4 py-2 text-[11px]" /><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Bio" className="w-full bg-zinc-800 rounded-xl p-3 text-[11px]" /><button onClick={saveProfile} className="w-full bg-white text-black py-2 rounded-full text-[11px] font-bold">Save Profile</button><p className="text-[10px] text-zinc-500">Set username once. Uploading will never change it again.</p></div>
      <div className="bg-zinc-900 rounded-2xl p-4 space-y-3"><p className="font-bold">Shopping</p><div className="flex justify-between"><p className="text-[11px]">Currency</p><select value={currency} onChange={e=>setCurrency(e.target.value)} className="bg-zinc-800 rounded-full px-3 py-1 text-[11px]"><option>NGN (₦)</option><option>USD ($)</option></select></div><div className="flex justify-between"><p className="text-[11px]">Language</p><select value={language} onChange={e=>setLanguage(e.target.value)} className="bg-zinc-800 rounded-full px-3 py-1 text-[11px]"><option>English</option><option>Pidgin</option></select></div></div>
      <div className="bg-zinc-900 rounded-2xl p-4 space-y-3"><p className="font-bold">Security</p><input value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="New password" type="password" className="w-full bg-zinc-800 rounded-full px-4 py-2 text-[11px]" /><button onClick={changePassword} className="w-full bg-white text-black py-2 rounded-full text-[11px] font-bold">Change Password</button></div>
      <div className="bg-zinc-900 rounded-2xl p-4 space-y-3"><p className="font-bold">Support</p><button onClick={onOpenUche} className="w-full bg-[#39FF14] text-black py-3 rounded-full text-[11px] font-black">💬 Chat Uche - Support</button></div>
      <button onClick={async()=>{await supabase.auth.signOut()}} className="w-full bg-red-600 text-white py-3 rounded-full text-[11px] font-bold">Log Out</button>
<button onClick={async()=>{if(!confirm('Delete your account permanently?')) return; try{ await supabase.from('profiles').delete().eq('id', user?.id); await supabase.auth.signOut(); }catch(e){ alert(e.message); }}} className="w-full bg-zinc-900 text-white py-3 rounded-full text-[11px] font-bold mt-2">Delete Account</button>
    </div>
  );
}