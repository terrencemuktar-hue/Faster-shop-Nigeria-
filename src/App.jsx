import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
const CATS=['All','Men','Hoodies','Caps','Perfumes','Shoes','Bags']

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
  const [activeStory,setActiveStory]=useState(null)
  const [selectedCategory,setSelectedCategory]=useState('All')
  const [cart,setCart]=useState([])
  const [followMap,setFollowMap]=useState({})

  useEffect(()=>{supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user||null))},[])
  useEffect(()=>{if(user)loadAll()},[user])

  const loadAll=async()=>{
    const {data:p}=await supabase.from('profiles').select('*').eq('id',user.id).maybeSingle()
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
    }
  }

  const getVendor=(id)=>{if(!id)return null;if(fasterShop?.id===id)return fasterShop;return vendors.find(v=>v.id===id)||(profile?.id===id?profile:null)||null}

  if(!user)return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6"><div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl">F</div><h1 className="font-black mt-3">FASTER SHOP</h1><AuthForm/></div>

  return(
    <div className="min-h-screen bg-black text-white pb-20">
      {/* LOGO ONLY - NO TEXT */}
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-900 px-4 py-3 flex items-center">
        <div className="w-9 h-9 bg-white text-black font-black flex items-center justify-center rounded-lg text-[15px]">F</div>
      </div>

      {activeStory&&<div className="fixed inset-0 z-[100] bg-black flex flex-col"><div className="p-4 flex gap-3 items-center"><img src={getVendor(activeStory.vendor_id||activeStory.user_id)?.avatar_url} className="w-8 h-8 rounded-full"/><p className="text-[11px] font-bold">{getVendor(activeStory.vendor_id||activeStory.user_id)?.vendor_name}</p><button onClick={()=>setActiveStory(null)} className="ml-auto">✕</button></div><img src={activeStory.image_url||activeStory.media_url||activeStory.url} className="flex-1 object-contain" alt=""/></div>}

      {tab==='home'&&<Home products={products} stories={stories} fasterShop={fasterShop} vendors={vendors} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}} onDM={(v,p)=>{setSelectedChat(v);setSelectedProduct(p);setTab('chat')}} onStoryClick={setActiveStory} getVendor={getVendor}/>}
      {tab==='shop'&&<Shop products={products} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} getVendor={getVendor}/>}
      {tab==='vendor'&&<VendorProfile vendor={selectedVendor} currentUser={user} products={products.filter(p=>p.vendor_id===selectedVendor?.id)} stories={stories.filter(s=>(s.vendor_id===selectedVendor?.id||s.user_id===selectedVendor?.id))} onBack={()=>setTab('home')} onStoryClick={setActiveStory} reload={loadAll} followMap={followMap} setFollowMap={setFollowMap} fasterShop={fasterShop} cart={cart} setCart={setCart}/>}
      {tab==='messages'&&<MessagesList user={user} vendors={vendors} fasterShop={fasterShop} profile={profile} onSelect={(v)=>{setSelectedChat(v);setTab('chat')}}/>}
      {tab==='chat'&&<ChatRoom user={user} vendor={selectedChat} product={selectedProduct} onBack={()=>setTab('messages')}/>}
      {tab==='cart'&&<div className="p-4"><h2 className="font-black text-[13px]">Cart — Fastershop Store Only</h2><p className="text-[10px] text-zinc-500 mt-1">Other vendors: order in Chat, not Cart</p>{cart.length===0?<p className="text-[11px] text-zinc-500 mt-6">Empty</p>:cart.map((p,i)=><div key={i} className="bg-zinc-900 p-3 rounded-xl flex gap-3 mt-2"><img src={p.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt=""/><div><p className="text-[11px] font-bold">{p.title||p.name}</p><p className="text-[10px] text-zinc-400">{p.price}</p></div></div>)}<button className="w-full mt-4 bg-[#39FF14] text-black font-black py-3 rounded-full text-[11px]">Pay with Paystack — Fastershop Store</button></div>}
      {tab==='profile'&&<Profile user={user} profile={profile} products={products.filter(p=>p.vendor_id===user.id)} reload={loadAll} onOpenVendor={(v)=>{setSelectedVendor(v);setTab('vendor')}}/>}

      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 flex justify-around py-3 text-[11px]">
        <button onClick={()=>setTab('home')} className={tab==='home'?'text-white font-black':'text-zinc-500'}>Home</button>
        <button onClick={()=>setTab('shop')} className={tab==='shop'?'text-white font-black':'text-zinc-500'}>Shop</button>
        <button onClick={()=>setTab('cart')} className={tab==='cart'?'text-white font-black':'text-zinc-500'}>Cart</button>
        <button onClick={()=>setTab('messages')} className={tab==='messages'?'text-white font-black':'text-zinc-500'}>Messages</button>
        <button onClick={()=>setTab('profile')} className={tab==='profile'?'text-white font-black':'text-zinc-500'}>Profile</button>
      </div>
    </div>
  )
}

function Featured({products,onOpenVendor,getVendor}){
  const [i,setI]=useState(0)
  const list=products.filter(p=>p.images?.length>0).slice(0,15)
  useEffect(()=>{if(!list.length)return;const t=setInterval(()=>setI(v=>(v+1)%list.length),3500);return()=>clearInterval(t)},[list.length])
  if(!list.length)return <div className="h-56 bg-zinc-900 border border-[#39FF14]/30 rounded-[20px] flex items-center justify-center text-[11px] text-zinc-500">Featured Drop — Your uploads will slide here</div>
  const curr=list[i]
  return <div className="h-60 rounded-[20px] overflow-hidden relative border border-[#39FF14]/30"><img src={curr.images?.[0]} className="w-full h-full object-cover" alt=""/><div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"/><div className="absolute top-3 left-3 bg-[#39FF14] text-black text-[8px] px-2 py-1 rounded-full font-black">FEATURED DROP {i+1}/{list.length} • {curr.images?.length||1} SLIDES</div><div className="absolute bottom-4 left-4 right-4"><h2 className="font-black text-[16px]">{curr.title||curr.name}</h2><p className="text-[11px] text-zinc-300">{curr.price} • {curr.category} • {curr.images?.length||1} pics</p><button onClick={()=>onOpenVendor(getVendor(curr.vendor_id))} className="mt-2 bg-[#39FF14] text-black px-4 py-2 rounded-full text-[11px] font-black">Shop Now →</button></div></div>
}

function PostSlider({images}){
  const [idx,setIdx]=useState(0)
  const imgs=images?.filter(Boolean)||[]
  if(!imgs.length)return <div className="w-full h-80 bg-zinc-900"/>
  return <div className="relative w-full h-[380px] bg-black overflow-hidden"><img src={imgs[idx]} className="w-full h-full object-cover" alt=""/><div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">{imgs.map((_,i)=><div key={i} className={`h-1 rounded-full ${i===idx?'w-5 bg-white':'w-1 bg-white/40'}`}/>)}</div>{imgs.length>1&&<><button onClick={()=>setIdx((idx-1+imgs.length)%imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 w-7 h-7 rounded-full text-[12px]">‹</button><button onClick={()=>setIdx((idx+1)%imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 w-7 h-7 rounded-full text-[12px]">›</button><div className="absolute top-3 right-3 bg-black/60 text-[9px] px-2 py-1 rounded-full">{idx+1}/{imgs.length}</div></>}</div>
}

function Home({products,stories,fasterShop,vendors,selectedCategory,setSelectedCategory,onOpenVendor,onDM,onStoryClick,getVendor}){
  const map={};stories.forEach(s=>{const id=s.vendor_id||s.user_id||s.profile_id; if(id) map[id]=s})
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  return <div className="p-4 space-y-4">
    <div className="flex gap-4 overflow-x-auto pb-1">
      {fasterShop&&<button onClick={()=>map[fasterShop.id]?onStoryClick(map[fasterShop.id]):onOpenVendor(fasterShop)} className="flex flex-col items-center"><div className={`w-14 h-14 rounded-full p-[2px] ${map[fasterShop.id]?'bg-gradient-to-tr from-[#39FF14] to-yellow-400':'bg-[#39FF14]'}`}><img src={fasterShop.avatar_url} className="w-full h-full rounded-full border-2 border-black object-cover" alt=""/></div><span className="text-[9px] font-black">FASTER</span></button>}
      {vendors.map(v=><button key={v.id} onClick={()=>map[v.id]?onStoryClick(map[v.id]):onOpenVendor(v)} className="flex flex-col items-center min-w-[60px]"><div className={`w-14 h-14 rounded-full p-[2px] ${map[v.id]?'bg-gradient-to-tr from-pink-500 to-yellow-400':'bg-zinc-700'}`}><img src={v.avatar_url||`https://i.pravatar.cc/100?u=${v.id}`} className="w-full h-full rounded-full border-2 border-black object-cover" alt=""/></div><span className="text-[9px]">{v.vendor_name?.split(' ')[0]}</span></button>)}
    </div>
    <Featured products={products} onOpenVendor={onOpenVendor} getVendor={getVendor}/>
    <div className="flex gap-2 overflow-x-auto">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`px-4 py-2 rounded-full text-[11px] border ${selectedCategory===c?'bg-[#39FF14] text-black':'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{c}</button>)}</div>
    <div className="space-y-4">{filtered.map(p=>{const v=getVendor(p.vendor_id); const imgs=p.images||p.image_urls||[]; return <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"><div className="p-3 flex gap-2 items-center"><img src={v?.avatar_url} className="w-8 h-8 rounded-full" alt=""/><p className="text-[11px] font-bold">{v?.vendor_name||'Vendor'}</p><span className="ml-auto text-[9px] bg-zinc-800 px-2 py-1 rounded-full">{imgs.length} slides</span></div><PostSlider images={imgs}/><div className="p-3 flex justify-between items-center"><div><p className="text-[11px] font-bold">{p.title||p.name}</p><p className="text-[10px] text-zinc-400">{p.price} • {p.category}</p></div><button onClick={()=>onDM(v,p)} className="bg-white text-black text-[9px] px-3 py-2 rounded-full font-bold">Message</button></div></div>})}</div>
  </div>
}

function Shop({products,selectedCategory,setSelectedCategory,getVendor}){
  const filtered=selectedCategory==='All'?products:products.filter(p=>p.category===selectedCategory)
  return <div className="p-4"><div className="flex gap-2 overflow-x-auto pb-3">{CATS.map(c=><button key={c} onClick={()=>setSelectedCategory(c)} className={`px-4 py-2 rounded-full text-[11px] border ${selectedCategory===c?'bg-white text-black':'bg-zinc-900 border-zinc-800'}`}>{c}</button>)}</div><div className="grid grid-cols-2 gap-3">{filtered.map(p=>{const v=getVendor(p.vendor_id); const img=(p.images||[])[0]||p.image_urls?.[0]; return <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"><div className="relative"><img src={img} className="w-full h-36 object-cover" alt=""/>{p.images?.length>1&&<span className="absolute top-2 right-2 bg-black/70 text-[8px] px-2 py-1 rounded-full">{p.images.length} SLIDES</span>}</div><div className="p-2"><p className="text-[10px] font-bold truncate">{p.title||p.name}</p><p className="text-[9px] text-zinc-400">{p.price} • {v?.vendor_name}</p></div></div>})}</div></div>
}

function VendorProfile({vendor,currentUser,products,stories,onBack,onStoryClick,reload,followMap,setFollowMap,fasterShop,cart,setCart}){
  const [followers,setFollowers]=useState(0)
  const [following,setFollowing]=useState(0)
  const [editingBio,setEditingBio]=useState(false)
  const [bioText,setBioText]=useState(vendor?.bio||'')
  const isOwn=currentUser?.id===vendor?.id
  const isFasterShop=vendor?.id===fasterShop?.id
  useEffect(()=>{const loadCounts=async()=>{const {count:f1}=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('following_id',vendor?.id);const {count:f2}=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('follower_id',vendor?.id);setFollowers(f1||0);setFollowing(f2||0);setBioText(vendor?.bio||'')};loadCounts()},[vendor?.id])
  const toggleFollow=async()=>{
    const isFollowing=followMap[vendor.id]
    if(isFollowing){await supabase.from('follows').delete().eq('follower_id',currentUser.id).eq('following_id',vendor.id);const nm={...followMap};delete nm[vendor.id];setFollowMap(nm);setFollowers(f=>f-1)}
    else{await supabase.from('follows').insert({follower_id:currentUser.id,following_id:vendor.id});setFollowMap({...followMap,[vendor.id]:true});setFollowers(f=>f+1)}
  }
  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',vendor.id);await reload();setEditingBio(false)}
  if(!vendor)return null
  const hasStory=stories.length>0
  return <div><div className="p-4 border-b border-zinc-900 flex gap-3 items-center"><button onClick={onBack} className="text-[13px]">Back</button><p className="font-black text-[12px]">{vendor.vendor_name}</p></div>
  <div className="p-4 flex gap-5 items-start">
    <button onClick={()=>hasStory&&onStoryClick(stories[0])} className={`w-20 h-20 rounded-full p-[2px] ${hasStory?'bg-gradient-to-tr from-[#39FF14] to-yellow-400':'bg-zinc-700'}`}><img src={vendor.avatar_url||`https://i.pravatar.cc/150?u=${vendor.id}`} className="w-full h-full rounded-full border-2 border-black object-cover" alt=""/></button>
    <div className="flex-1">
      <div className="flex gap-6"><div className="text-center"><p className="font-black text-[16px]">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><div className="text-center"><p className="font-black text-[16px]">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div><div className="text-center"><p className="font-black text-[16px]">{following}</p><p className="text-[10px] text-zinc-500">Following</p></div></div>
      <div className="mt-3">
        {editingBio?<div className="space-y-2"><textarea value={bioText} onChange={e=>setBioText(e.target.value)} placeholder="Write bio..." className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px]"/><div className="flex gap-2"><button onClick={saveBio} className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold">Save Bio</button><button onClick={()=>setEditingBio(false)} className="bg-zinc-800 px-4 py-2 rounded-full text-[10px]">Cancel</button></div></div>:<><p className="text-[11px] leading-[1.4]">{vendor.bio||'Faster Shop vendor'}</p>{isOwn&&<button onClick={()=>setEditingBio(true)} className="mt-2 text-[10px] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">Edit Bio</button>}</>}
      </div>
      {!isOwn&&<button onClick={toggleFollow} className={`mt-3 w-full py-2 rounded-full text-[11px] font-bold ${followMap[vendor.id]?'bg-zinc-800 text-white':'bg-white text-black'}`}>{followMap[vendor.id]?'Following':'Follow'}</button>}
      {isFasterShop&&<p className="mt-2 text-[9px] text-[#39FF14] font-bold">✓ FASTERSHOP STORE — Cart + Paystack enabled</p>}
      {!isFasterShop&&!isOwn&&<p className="mt-2 text-[9px] text-zinc-500">Chat to order — no cart for this vendor</p>}
    </div>
  </div>
  <div className="grid grid-cols-3 gap-0.5 mt-4">{products.length===0?<p className="col-span-3 text-center text-[11px] text-zinc-600 py-10">No posts yet — upload 1-10 slides</p>:products.map(p=>{const img=(p.images||[])[0];return <div key={p.id} className="aspect-square bg-zinc-900 relative"><img src={img} className="w-full h-full object-cover" alt=""/>{p.images?.length>1&&<span className="absolute top-1 right-1 bg-black/70 text-[7px] px-1 py-0.5 rounded">+{p.images.length-1}</span>}</div>})}</div>
  </div>
}

function Profile({user,profile,products,reload,onOpenVendor}){
  const [view,setView]=useState('main')
  const [form,setForm]=useState({title:'',price:'',category:'Shoes'})
  const [files,setFiles]=useState([])
  const [previews,setPreviews]=useState([])
  const [uploading,setUploading]=useState(false)
  const [storyFile,setStoryFile]=useState(null)
  const [followers,setFollowers]=useState(0)
  const [following,setFollowing]=useState(0)
  const [editingBio,setEditingBio]=useState(false)
  const [bioText,setBioText]=useState(profile?.bio||'')

  useEffect(()=>{setBioText(profile?.bio||'');const load=async()=>{const {count:f1}=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('following_id',user.id);const {count:f2}=await supabase.from('follows').select('*',{count:'exact',head:true}).eq('follower_id',user.id);setFollowers(f1||0);setFollowing(f2||0)};load()},[profile])

  const handleFiles=(e)=>{
    const selected=Array.from(e.target.files||[]).slice(0,10)
    setFiles(selected)
    setPreviews(selected.map(f=>URL.createObjectURL(f)))
  }

  const ensureProfile=async()=>{const {data}=await supabase.from('profiles').select('id').eq('id',user.id).maybeSingle(); if(!data){await supabase.from('profiles').insert({id:user.id,email:user.email,is_vendor:true,vendor_name:user.email.split('@')[0],bio:'New vendor'})}}

  const uploadProduct=async()=>{
    if(!form.title||files.length===0)return alert('Add title + 1-10 images')
    setUploading(true)
    try{
      await ensureProfile()
      const urls=[]
      for(let i=0;i<files.length;i++){
        const f=files[i]
        const safeName=f.name.replace(/[^a-zA-Z0-9.-]/g,'_')
        const fileName=`${user.id}/${Date.now()}-${i}-${safeName}`
        const {error}=await supabase.storage.from('product-images').upload(fileName,f,{upsert:true,contentType:f.type})
        if(error) throw error
        const {data}=supabase.storage.from('product-images').getPublicUrl(fileName)
        urls.push(data.publicUrl)
      }
      const {error}=await supabase.from('products').insert({vendor_id:user.id,title:form.title,name:form.title,price:form.price||'20000',category:form.category,images:urls,is_featured:true,description:''})
      if(error) throw error
      alert(`SUCCESS! ${urls.length} slides posted — shows in vendor profile + Featured Drop + Shop`)
      setFiles([]);setPreviews([]);setForm({title:'',price:'',category:'Shoes'});await reload();setView('main')
    }catch(e){alert('Failed: '+e.message)}finally{setUploading(false)}
  }

  const uploadStory=async()=>{
    if(!storyFile)return alert('Select image')
    try{
      await ensureProfile()
      const safeName=storyFile.name.replace(/[^a-zA-Z0-9.-]/g,'_')
      const fileName=`${user.id}/story-${Date.now()}-${safeName}`
      const {error}=await supabase.storage.from('product-images').upload(fileName,storyFile,{upsert:true,contentType:storyFile.type})
      if(error) throw error
      const {data}=supabase.storage.from('product-images').getPublicUrl(fileName)
      const expires=new Date(Date.now()+24*60*60*1000).toISOString()
      const payload={image_url:data.publicUrl,media_url:data.publicUrl,url:data.publicUrl,expires_at:expires,vendor_id:user.id,user_id:user.id,profile_id:user.id}
      const {error:dbErr}=await supabase.from('stories').insert(payload)
      if(dbErr) throw dbErr
      alert('Story posted — ring shows 24h')
      setStoryFile(null);await reload();setView('main')
    }catch(e){alert('Story failed: '+e.message+' — run SQL fix first')}
  }

  const saveBio=async()=>{await supabase.from('profiles').update({bio:bioText}).eq('id',user.id);await reload();setEditingBio(false)}

  if(view!=='main'){
    return <div className="p-4"><button onClick={()=>setView('main')} className="mb-4 text-[12px]">Back</button>
      {view==='upload'&&<div className="space-y-3"><h2 className="font-black text-[13px]">Upload Product — Up to 10 Slides</h2><input placeholder="Title e.g MOONSHOT TEES" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]"/><div className="flex gap-2"><input placeholder="Price 30000" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]"/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]">{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select></div><input type="file" multiple accept="image/*" onChange={handleFiles} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl"/><p className="text-[9px] text-zinc-500">Select 1-10 images — they will slide as ONE post</p>{previews.length>0&&<div className="grid grid-cols-5 gap-2">{previews.map((p,i)=><img key={i} src={p} className="w-full h-16 object-cover rounded-lg" alt=""/>)}</div>}<button onClick={uploadProduct} disabled={uploading} className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-[11px]">{uploading?`Uploading ${files.length}...`:`Post ${files.length} Slides — Vendor Profile + Featured + Shop`}</button></div>}
      {view==='story'&&<div className="space-y-3"><h2 className="font-black text-[13px]">Upload Story — Fixed</h2><input type="file" accept="image/*" onChange={e=>setStoryFile(e.target.files?.[0]||null)} className="w-full text-[11px] bg-zinc-900 p-2 rounded-xl"/><button onClick={uploadStory} className="w-full bg-white text-black font-bold py-3 rounded-full text-[11px]">Post Story — Ring Shows Now</button></div>}
    </div>
  }

  return <div className="p-4 space-y-4">
    <div className="flex gap-5">
      <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center font-black text-xl">{user.email[0].toUpperCase()}</div>
      <div className="flex-1">
        <div className="flex gap-5"><div className="text-center"><p className="font-black">{products.length}</p><p className="text-[10px] text-zinc-500">Posts</p></div><div className="text-center"><p className="font-black">{followers}</p><p className="text-[10px] text-zinc-500">Followers</p></div><div className="text-center"><p className="font-black">{following}</p><p className="text-[10px] text-zinc-500">Following</p></div></div>
        <div className="mt-2">{editingBio?<div className="space-y-2"><textarea value={bioText} onChange={e=>setBioText(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-[11px]"/><div className="flex gap-2"><button onClick={saveBio} className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold">Save</button><button onClick={()=>setEditingBio(false)} className="bg-zinc-800 px-3 py-1 rounded-full text-[10px]">Cancel</button></div></div>:<><p className="text-[11px]">{profile?.bio||'Add bio...'}</p><button onClick={()=>setEditingBio(true)} className="mt-1 text-[10px] bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">Edit Bio</button></>}</div>
      </div>
    </div>
    <button onClick={()=>onOpenVendor(profile)} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-left text-[11px]">View Vendor Profile — {products.length} posts</button>
    <button onClick={()=>setView('upload')} className="w-full bg-[#39FF14] text-black font-black py-4 rounded-full text-[11px]">Upload Product — 1-10 Slides — Fixed</button>
    <button onClick={()=>setView('story')} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-left text-[12px]">Upload Story — Ring 24h — Fixed</button>
    <button onClick={async()=>{await supabase.auth.signOut();location.reload()}} className="w-full bg-red-950/30 border border-red-900/50 text-red-400 py-3 rounded-full text-[11px]">Log Out</button>
    <div className="grid grid-cols-3 gap-0.5 mt-2">{products.map(p=><div key={p.id} className="aspect-square bg-zinc-900 relative"><img src={(p.images||[])[0]} className="w-full h-full object-cover" alt=""/>{p.images?.length>1&&<span className="absolute top-1 right-1 bg-black/70 text-[7px] px-1 rounded">+{p.images.length-1}</span>}</div>)}</div>
  </div>
}

function MessagesList({user,vendors,fasterShop,profile,onSelect}){
  const [convos,setConvos]=useState([])
  useEffect(()=>{const load=async()=>{const{data:conv}=await supabase.from('conversations').select('*').or(`buyer_id.eq.${user.id},vendor_id.eq.${user.id}`).order('created_at',{ascending:false});if(!conv)return;const all=[...vendors];if(fasterShop)all.push(fasterShop);if(profile)all.push(profile);const map={};all.forEach(p=>map[p.id]=p);setConvos(conv.map(c=>{const otherId=c.buyer_id===user.id?c.vendor_id:c.buyer_id;return {...c,other:map[otherId]||{vendor_name:'Vendor',id:otherId}} }))};load()},[user.id,vendors,fasterShop,profile])
  return <div className="p-4"><h2 className="font-black text-[13px] mb-3">Messages</h2>{convos.map(c=><button key={c.id} onClick={()=>onSelect(c.other)} className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex gap-3 mb-2 text-left"><img src={c.other?.avatar_url} className="w-10 h-10 rounded-full" alt=""/><p className="text-[12px] font-bold">{c.other?.vendor_name}</p></button>)}</div>
}
function ChatRoom({user,vendor,product,onBack}){
  const [msgs,setMsgs]=useState([]);const [text,setText]=useState('');const [convId,setConvId]=useState(null);const ref=useRef()
  useEffect(()=>{const init=async()=>{let{data:conv}=await supabase.from('conversations').select('*').or(`and(buyer_id.eq.${user.id},vendor_id.eq.${vendor.id}),and(buyer_id.eq.${vendor.id},vendor_id.eq.${user.id})`).maybeSingle();if(!conv){const{data:newConv}=await supabase.from('conversations').insert({buyer_id:user.id,vendor_id:vendor.id}).select().single();conv=newConv}setConvId(conv.id);const{data:m}=await supabase.from('messages').select('*').eq('conversation_id',conv.id).order('created_at');setMsgs(m||[])};init()},[user.id,vendor.id])
  useEffect(()=>{if(!convId)return;const ch=supabase.channel(`chat-${convId}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`conversation_id=eq.${convId}`},p=>setMsgs(prev=>[...prev,p.new])).subscribe();return()=>supabase.removeChannel(ch)},[convId])
  useEffect(()=>{ref.current?.scrollIntoView({behavior:'smooth'})},[msgs])
  const send=async()=>{if(!text.trim()||!convId)return;await supabase.from('messages').insert({conversation_id:convId,sender_id:user.id,text});setText('')}
  return <div className="flex flex-col h-[calc(100vh-112px)]"><div className="p-4 border-b border-zinc-900 flex gap-3"><button onClick={onBack}>Back</button><p className="text-[12px] font-bold">{vendor?.vendor_name}</p></div>{product&&<div className="p-3 bg-zinc-900 border-b border-zinc-800 flex gap-3"><img src={product.images?.[0]} className="w-12 h-12 rounded-lg object-cover"/><div><p className="text-[11px] font-bold">{product.title}</p><p className="text-[10px] text-zinc-400">{product.price} • Chatting about this product</p></div></div>}<div className="flex-1 overflow-y-auto p-4 space-y-3">{msgs.map(m=><div key={m.id} className={`max-w-[75%] p-3 rounded-2xl text-[11px] ${m.sender_id===user.id?'ml-auto bg-[#39FF14] text-black':'bg-zinc-900 border border-zinc-800'}`}>{m.text}</div>)}<div ref={ref}></div></div><div className="p-3 border-t border-zinc-900 flex gap-2"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Message vendor inside Faster Shop..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-[11px]" onKeyDown={e=>e.key==='Enter'&&send()}/><button onClick={send} className="bg-white text-black px-5 rounded-full text-[11px] font-bold">Send</button></div></div>
}
function AuthForm(){
  const [email,setEmail]=useState('');const [pass,setPass]=useState('');const [mode,setMode]=useState('login')
  const handle=async(e)=>{e.preventDefault();try{if(mode==='signup'){const{error}=await supabase.auth.signUp({email,password:pass});if(error)throw error;alert('Created! Login now');setMode('login')}else{const{error}=await supabase.auth.signInWithPassword({email,password:pass});if(error)throw error}}catch(err){alert(err.message)}}
  return <form onSubmit={handle} className="w-full max-w-sm space-y-3 mt-6"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-sm"/><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded-full bg-zinc-900 border border-zinc-800 text-sm"/><button className="w-full bg-[#39FF14] text-black font-bold py-3 rounded-full text-sm">{mode==='signup'?'Create Account':'Login'}</button><button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} className="w-full text-[11px] text-zinc-500">{mode==='login'?'Need account? Signup':'Have account? Login'}</button></form>
}