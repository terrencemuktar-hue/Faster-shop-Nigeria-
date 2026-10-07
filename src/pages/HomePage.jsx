import React from 'react';
import Logo from '../components/Logo';

export default function HomePage({ setActiveTab, setSelectedVendor, setSelectedProduct }) {
  const trendingCollections = [
    { title: 'Summer Styles', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80', vendor: 'RUBIAN GIRL' },
    { title: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', vendor: 'RINGING' },
    { title: 'Streetwear', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80', vendor: 'Amardedon' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-neutral-900 pb-28 font-sans max-w-[430px] mx-auto relative shadow-2xl">
      <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-black text-white">
        <Logo size="sm" />
        <div className="flex items-center gap-4 text-xl">
          <button className="relative">💬<span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF2D78] rounded-full"></span></button>
          <button>🔔</button>
          <button>⚙️</button>
        </div>
      </header>

      <div className="px-5 py-3 bg-black">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">🔍</span>
          <input
            type="text"
            placeholder="Search"
            onClick={() => setActiveTab('search')}
            readOnly
            className="w-full bg-[#F1F1F1] text-neutral-900 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div 
          onClick={() => setSelectedVendor('RUBIAN GIRL')}
          className="relative h-[420px] rounded-[24px] overflow-hidden shadow-lg cursor-pointer group"
        >
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80" 
            alt="Rubian Girl Hero" 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white space-y-3">
            <span className="text-xs tracking-widest uppercase font-semibold text-neutral-300">Models 20s, 20s</span>
            <h1 className="text-2xl font-black tracking-wide">RUBIAN GIRL - New Drop</h1>
            <div>
              <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs shadow-md uppercase tracking-wider">
                SHOP NOW
              </button>
            </div>
          </div>
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
          </div>
        </div>

        <section>
          <h2 className="text-base font-bold tracking-wide text-neutral-900 mb-4">Trending Collections</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {trendingCollections.map((item, index) => (
              <div 
                key={index}
                onClick={() => setSelectedVendor(item.vendor)}
                className="flex-shrink-0 w-36 bg-white rounded-2xl p-2 shadow-sm border border-neutral-100 cursor-pointer group"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-neutral-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <h3 className="font-bold text-xs text-neutral-900 truncate">{item.title}</h3>
                <p className="text-[10px] text-neutral-500">{item.vendor}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
