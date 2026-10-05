import { useState } from "react";

const products = [
  { id: 1, brand: "RUBIAN GIRL", handle: "rubian-girl", name: "Corset Top", price: 90000, likes: 342, image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600" },
  { id: 2, brand: "KINGING", handle: "kinging", name: "Urban Jacket", price: 180000, likes: 128, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600" },
  { id: 3, brand: "RUBIAN GIRL", handle: "rubian-girl", name: "Brown Pants", price: 75000, likes: 256, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600" },
  { id: 4, brand: "KINGING", handle: "kinging", name: "Hoodie", price: 135000, likes: 189, image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600" },
];

const vendors = {
  "rubian-girl": { name: "RUBIAN GIRL", followers: "12.4k", items: 86, rating: 4.9, location: "Yaba, Lagos", bio: "Sustainable fits for the 20s girlies • Made in Yaba, Lagos", avatar: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=200" },
  "kinging": { name: "KINGING", followers: "8.1k", items: 42, rating: 4.8, location: "Lekki, Lagos", bio: "Urban streetwear for Lagos nights.", avatar: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200" }
};

export default function HomePage() {
  const [view,setView]=useState("shop");
  const [activeVendor,setActiveVendor]=useState(null);
  const [activeProduct,setActiveProduct]=useState(null);
  const [cart,setCart]=useState(0);

  if(view==="vendor"){
    const v=vendors[activeVendor];
    return(
      <div className="min-h-screen bg-black text-white max-w-md mx-auto">
        <div className="p-4 flex gap-3 items-center border-b border-zinc-800"><button onClick={()=>setView("shop")} className="text-xl">←</button><b>{v.name}</b><span className="text-blue-500">✔</span></div>
        <div className="p-4 flex gap-6"><img src={v.avatar} className="w-20 h-20 rounded-full object-cover"/><div className="flex gap-6 text-center"><div><p className="font-bold">{v.items}</p><p className="text-xs text-zinc-400">Items</p></div><div><p className="font-bold">{v.followers}</p><p className="text-xs text-zinc-400">Followers</p></div><div><p className="font-bold">{v.rating}</p><p className="text-xs text-zinc-400">Rating</p></div></div></div>
        <div className="px-4 text-xs"><b>{v.name}</b><p className="text-zinc-300 mt-1">{v.bio}</p><p className="mt-1 text-zinc-400">📍 {v.location}</p></div>
        <div className="px-4 flex gap-2 mt-4"><button className="flex-1 bg-white text-black py-2 rounded-lg font-bold text-sm">Follow</button><button className="flex-1 bg-zinc-800 py-2 rounded-lg font-bold text-sm">Chat on WhatsApp</button></div>
        <div className="grid grid-cols-3 gap-0.5 mt-6">{products.filter(p=>p.handle===activeVendor).map(p=>(<div key={p.id} onClick={()=>{setActiveProduct(p); setView("product")}} className="aspect-square relative bg-zinc-900"><img src={p.image} className="w-full h-full object-cover"/><span className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded">♥ {p.likes}</span></div>))}</div>
      </div>
    )
  }

  if(view==="product"){
    return(
      <div className="min-h-screen bg-white text-black max-w-md mx-auto"><div className="p-4 flex justify-between"><button onClick={()=>setView("vendor")}>← Back</button><b>FASTER</b><span/></div><img src={activeProduct.image} className="w-full h-[50vh] object-cover"/><div className="p-4"><h1 className="font-bold">{activeProduct.brand} - {activeProduct.name}</h1><p className="mt-2">N{activeProduct.price.toLocaleString()}</p><button onClick={()=>setCart(cart+1)} className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold">ADD TO BAG ({cart+1})</button></div></div>
    )
  }

  return(
    <div className="min-h-screen bg-black text-white max-w-md mx-auto pb-20">
      <div className="flex justify-between p-4 pt-6"><h1 className="font-black italic text-xl">faster</h1><div className="flex gap-3"><span>💬</span><span>🔔</span></div></div>
      <div className="px-4"><div className="bg-zinc-900 rounded-full px-4 py-3 text-zinc-400 text-sm">🔍 Search</div></div>
      <div className="px-4 mt-4"><div className="relative h-64 rounded-2xl overflow-hidden" onClick={()=>{setActiveVendor("rubian-girl"); setView("vendor")}}><img src={products[0].image} className="w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/><div className="absolute bottom-3 left-3"><p className="font-bold">RUBIAN GIRL - New Drop</p><button className="mt-2 bg-white text-black text-xs px-3 py-1.5 rounded-full font-bold">SHOP NOW</button></div></div></div>
      <div className="px-4 mt-6"><p className="font-bold text-sm mb-3">EXPLORE BRANDS - Tap for IG Profile</p><div className="grid grid-cols-2 gap-3">{products.map(p=>(<div key={p.id} onClick={()=>{setActiveVendor(p.handle); setView("vendor")}} className="bg-zinc-900 rounded-xl overflow-hidden"><img src={p.image} className="h-44 w-full object-cover"/><div className="p-2"><p className="text-[10px] bg-pink-500 inline px-1.5 rounded">{p.brand}</p><p className="text-xs mt-1">{p.name}</p><p className="text-xs font-bold">N{p.price.toLocaleString()}</p></div></div>))}</div></div>
    </div>
  );
}