import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { getStoredProducts } from '../lib/store';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ShopPage({ onAddToCart, onSelectProduct }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState(getStoredProducts());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFirestoreProducts() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const firestoreItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts([...firestoreItems, ...getStoredProducts()]);
        }
      } catch (e) {
        // Fallback to local
      } finally {
        setLoading(false);
      }
    }
    fetchFirestoreProducts();
  }, []);

  const categories = ['All', 'Luxury Wear', 'Streetwear', 'Leather & Accessories', 'Footwear'];
  const sizes = ['All', 'S', 'M', 'L', 'XL'];
  const priceRanges = ['All', 'Under N100k', 'N100k-N200k', 'Above N200k'];

  const filtered = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSize = selectedSize === 'All' || (item.sizes && item.sizes.includes(selectedSize)) || true;
    
    let matchesPrice = true;
    const price = item.price || 0;
    if (priceRange === 'Under N100k') matchesPrice = price < 100000;
    else if (priceRange === 'N100k-N200k') matchesPrice = price >= 100000 && price <= 200000;
    else if (priceRange === 'Above N200k') matchesPrice = price > 200000;

    return matchesSearch && matchesCat && matchesSize && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    return 0; // newest
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-white pb-24">
      
      {/* Header & Search */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Faster Shop Marketplace</h1>
        
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search RUBIAN GIRL, RINGING, hoodies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-filters (Sizes & Price & Sort) */}
        <div className="flex flex-wrap gap-2 items-center justify-between bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-zinc-400 font-semibold">Size:</span>
            {sizes.map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSize(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${selectedSize === s ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-xl border border-zinc-700 focus:outline-none"
            >
              <option value="newest">Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="aspect-square bg-zinc-900 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 space-y-2">
              <SlidersHorizontal className="w-12 h-12 text-zinc-700 mx-auto stroke-1" />
              <p className="text-zinc-400 font-medium">No items found</p>
              <p className="text-xs text-zinc-600">Try adjusting your filters.</p>
            </div>
          ) : (
            filtered.map((product) => (
              <div 
                key={product.id} 
                className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden group flex flex-col justify-between shadow-lg cursor-pointer hover:border-emerald-500/50 transition"
                onClick={() => onSelectProduct(product)}
              >
                <div>
                  <div className="relative aspect-square overflow-hidden bg-zinc-800">
                    <img src={product.image || product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {product.vendor || 'RUBIAN GIRL'}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-xs text-zinc-200 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold text-sm">₦{product.price?.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="w-full bg-zinc-800 hover:bg-emerald-600 text-zinc-200 hover:text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
