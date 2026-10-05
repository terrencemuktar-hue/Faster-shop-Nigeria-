'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  X, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Heart, 
  ChevronRight, 
  Sparkles, 
  Store, 
  ArrowRight,
  CheckCircle2,
  Menu
} from 'lucide-react';

// --- TYPINGS ---
interface Product {
  id: string;
  name: string;
  category: 'Textiles' | 'Home' | 'Beauty' | 'Craft';
  price: number;
  image: string;
  maker: string;
  makerLocation: string;
  rating: number;
}

interface Vendor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  avatar: string;
  featuredProduct: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- REAL LAGOS MAKER PRODUCT DATA ---
const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Hand-Woven Aso-Oke Tote Bag',
    category: 'Textiles',
    price: 18100,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    maker: 'Amina Atelier',
    makerLocation: 'Surulere, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-2',
    name: 'Raw Unrefined Shea Body Butter Oil',
    category: 'Beauty',
    price: 12400,
    image: 'https://images.unsplash.com/photo-1608248597263-000799965d13?auto=format&fit=crop&w=800&q=80',
    maker: 'Nia Botanicals',
    makerLocation: 'Ikeja, Lagos',
    rating: 5.0,
  },
  {
    id: 'prod-3',
    name: 'Handcrafted Terracotta Coffee Mug',
    category: 'Craft',
    price: 8800,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    maker: 'Yaba Clay Studio',
    makerLocation: 'Yaba, Lagos',
    rating: 4.8,
  },
  {
    id: 'prod-4',
    name: 'Hand-woven Elephant Grass Basket',
    category: 'Home',
    price: 22200,
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    maker: 'Kano Crafts Collective',
    makerLocation: 'Lekki Phase 1, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-5',
    name: 'Adire Indigo Silk Table Runner',
    category: 'Textiles',
    price: 26500,
    image: 'https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80',
    maker: 'Amina Atelier',
    makerLocation: 'Surulere, Lagos',
    rating: 5.0,
  },
  {
    id: 'prod-6',
    name: 'Botanical Hibiscus & Neem Facial Scrub',
    category: 'Beauty',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    maker: 'Nia Botanicals',
    makerLocation: 'Ikeja, Lagos',
    rating: 4.7,
  },
  {
    id: 'prod-7',
    name: 'Handmade Carved Teak Serving Bowl',
    category: 'Home',
    price: 19800,
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
    maker: 'Benin Woodwork Studio',
    makerLocation: 'Victoria Island, Lagos',
    rating: 4.9,
  },
  {
    id: 'prod-8',
    name: 'Custom Brass Pendant & Bead Necklace',
    category: 'Craft',
    price: 15200,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    maker: 'Eko Jewelry House',
    makerLocation: 'Ikoyi, Lagos',
    rating: 4.8,
  },
];

// --- VENDOR DATA ---
const VENDORS: Vendor[] = [
  {
    id: 'v-1',
    name: 'Amina Atelier',
    specialty: 'Aso-Oke & Indigo Textiles',
    location: 'Surulere, Lagos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    featuredProduct: 'Aso-Oke Tote Bag',
  },
  {
    id: 'v-2',
    name: 'Nia Botanicals',
    specialty: 'Organic Shea & Oils',
    location: 'Ikeja, Lagos',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    featuredProduct: 'Shea Body Butter',
  },
  {
    id: 'v-3',
    name: 'Yaba Clay Studio',
    specialty: 'Handthrown Ceramics',
    location: 'Yaba, Lagos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    featuredProduct: 'Terracotta Mugs',
  },
  {
    id: 'v-4',
    name: 'Kano Crafts Co.',
    specialty: 'Natural Fiber Weaving',
    location: 'Lekki Phase 1, Lagos',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    featuredProduct: 'Elephant Grass Baskets',
  },
];

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Cart Calculations
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0), [cart]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.maker.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const generateWhatsAppLink = (productName: string, price: number) => {
    const text = encodeURIComponent(`Hi! I want to buy the "${productName}" (₦${price.toLocaleString()}) on Faster Shop Nigeria.`);
    return `https://wa.me/2348123456789?text=${text}`;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EC] text-[#111827] selection:bg-[#14332E] selection:text-[#FDF6EC]">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#14332E] text-[#FDF6EC] border-b border-[#0F2D2D]/50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF6EC] text-[#14332E] flex items-center justify-center font-bold text-xl shadow-inner">
              ⚡
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FDF6EC]">
                Faster Shop
              </span>
              <span className="block text-[10px] text-[#A8C3B8] font-mono tracking-widest uppercase">
                Lagos Edition
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#E2EFEB]">
            <a href="#shop" className="hover:text-white transition-colors">Shop Collections</a>
            <a href="#vendors" className="hover:text-white transition-colors">Makers & Artisans</a>
            <a href="#stories" className="hover:text-white transition-colors">Lagos Stories</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            
            {/* Search Input Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#0F2D2D] rounded-2xl px-3 py-1.5 border border-[#234D46]">
                  <Search className="w-4 h-4 text-[#A8C3B8] mr-2" />
                  <input
                    type="text"
                    placeholder="Search artisan items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder-[#87A89B] outline-none w-36 sm:w-48"
                    autoFocus
                  />
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="text-[#A8C3B8] hover:text-white ml-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-2xl hover:bg-[#0F2D2D] text-[#E2EFEB] hover:text-white transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-[#0F2D2D] text-[#E2EFEB] hover:text-white hover:bg-[#1b433c] transition-all border border-[#234D46] flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-semibold hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E11D48] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#14332E]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Sign in Button */}
            <button className="hidden sm:inline-flex px-5 py-2.5 rounded-2xl bg-[#FDF6EC] text-[#14332E] font-semibold text-sm hover:bg-white transition-all shadow-sm">
              Sign In
            </button>

          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-[#14332E] text-[#FDF6EC] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F2D2D] border border-[#234D46] text-xs text-[#A8C3B8]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct from independent makers in Lagos</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-[#FDF6EC]">
              Shop what feels local, <br />
              <span className="italic font-light text-[#D1E3DB]">made with heart.</span>
            </h1>

            <p className="text-[#B3CEBF] text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Discover verified local artisans across Surulere, Yaba, Ikeja, and Lekki. Everyday bags, pottery, oils, and textiles crafted in small batches.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#shop"
                className="px-6 py-3.5 rounded-2xl bg-[#FDF6EC] text-[#14332E] font-semibold text-sm hover:bg-white transition-all shadow-md flex items-center gap-2"
              >
                <span>Browse collections</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#vendors"
                className="px-6 py-3.5 rounded-2xl border border-[#2e5e55] text-[#E2EFEB] hover:bg-[#0F2D2D] font-semibold text-sm transition-all"
              >
                Meet the makers
              </a>
            </div>

            {/* Stats Row */}
            <div className="pt-8 border-t border-[#234D46]/60 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-serif font-bold text-white">1.2k+</div>
                <div className="text-xs text-[#87A89B] mt-0.5">Unique pieces</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-white">186</div>
                <div className="text-xs text-[#87A89B] mt-0.5">Verified makers</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-white">20k+</div>
                <div className="text-xs text-[#87A89B] mt-0.5">Lagos stories</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Vendor Pick Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#FDF6EC] text-[#111827] rounded-3xl p-6 shadow-2xl border border-[#E8DCCB] space-y-4 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="relative h-80 rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Amina - Lead Weaver"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#14332E] text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-[#234D46]">
                  Vendor Pick of the Week
                </div>
              </div>

              <div className="flex items-start justify-between pt-2">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#14332E]">Amina Atelier</h3>
                  <p className="text-xs text-gray-600">Surulere, Lagos • Master Aso-Oke Weaver</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                  ★ 5.0 (42 reviews)
                </span>
              </div>

              <p className="text-xs text-gray-600 italic line-clamp-2">
                "Each piece takes 3 days of loom weaving in our Surulere workshop using locally dyed cotton threads."
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-gray-200">
                <span className="text-xs font-medium text-gray-500">Featured drop: Aso-Oke Tote Bag</span>
                <a href="#shop" className="text-xs font-bold text-[#14332E] hover:underline flex items-center gap-1">
                  View Drop <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VENDORS / MAKERS SECTION */}
      <section id="vendors" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14332E]/70">Lagos Creatives</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14332E] mt-1">People worth meeting</h2>
          </div>
          <a href="#shop" className="text-xs sm:text-sm font-semibold text-[#14332E] hover:underline flex items-center gap-1">
            All 186 Vendors <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Horizontal Vendors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {VENDORS.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl p-5 border border-[#E8DCCB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="relative w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-[#14332E]/10 p-0.5 group-hover:border-[#14332E] transition-colors">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="font-serif font-bold text-base text-[#14332E]">{vendor.name}</h3>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">{vendor.specialty}</p>
              <p className="text-[11px] text-gray-500 mt-1">{vendor.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#E8DCCB] pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14332E]/70">Small Batch Drops</span>
            <h2 className="font-serif text-3xl font-bold text-[#14332E] mt-1">Fresh finds for today</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['All', 'Textiles', 'Home', 'Beauty', 'Craft'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#14332E] text-[#FDF6EC] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E8DCCB]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DCCB] max-w-md mx-auto my-12">
            <p className="text-gray-500 text-sm">No artisan items match your search.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-2xl bg-[#14332E] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DCCB] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Hover Quick Action */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Category Label */}
                    <span className="absolute top-3 left-3 bg-[#FDF6EC]/90 backdrop-blur-md text-[#14332E] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#E8DCCB]">
                      {product.category}
                    </span>

                    {/* Quick Add Button Overlay */}
                    <button
                      onClick={() => addToCart(product)}
                      className="absolute bottom-3 right-3 bg-[#14332E] text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:scale-105"
                      title="Add to Cart"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <div className="text-[11px] text-gray-500 font-medium">
                      By {product.maker} • {product.makerLocation}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#14332E] mt-1 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xl font-bold font-mono text-[#14332E]">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-amber-600 font-semibold">
                        ★ {product.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 pb-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 py-2.5 rounded-xl bg-[#FDF6EC] text-[#14332E] border border-[#E8DCCB] font-semibold text-xs hover:bg-[#14332E] hover:text-white transition-colors"
                  >
                    Add to Bag
                  </button>

                  <a
                    href={generateWhatsAppLink(product.name, product.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                    title="Chat on WhatsApp to order"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CART SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-[#FDF6EC] h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
            
            {/* Drawer Header */}
            <div className="p-6 bg-[#14332E] text-white flex items-center justify-between border-b border-[#234D46]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#A8C3B8]" />
                <h2 className="font-serif text-xl font-bold">Your Bag ({cartCount})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-[#A8C3B8] hover:text-white hover:bg-[#0F2D2D] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100/50 text-[#14332E] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-gray-600 font-serif text-lg">Your bag is empty.</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Explore handmade ceramics, woven textiles, and organic body oils from Lagos artisans.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-[#E8DCCB] shadow-sm flex gap-4 items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#14332E] truncate">
                        {item.name}
                      </h4>
                      <div className="text-xs text-gray-500">{item.maker}</div>
                      <div className="text-sm font-bold font-mono text-[#14332E] mt-1">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-xs font-bold hover:bg-gray-200 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-xs font-bold hover:bg-gray-200 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-[#E8DCCB] space-y-4">
                <div className="flex items-center justify-between text-base font-bold">
                  <span className="font-serif text-[#14332E]">Subtotal:</span>
                  <span className="font-mono text-xl text-[#14332E]">₦{cartTotal.toLocaleString()}</span>
                </div>

                <p className="text-[11px] text-gray-500">
                  Direct dispatch from artisan workshops in Lagos via Paystack or WhatsApp.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => alert('Proceeding to Paystack Secure Checkout...')}
                    className="w-full py-3.5 rounded-2xl bg-[#14332E] text-white font-bold text-sm hover:bg-[#0F2D2D] transition-colors shadow-md"
                  >
                    Pay with Paystack (₦{cartTotal.toLocaleString()})
                  </button>

                  <a
                    href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Hi, I'd like to place an order for items totaling ₦${cartTotal.toLocaleString()}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Order All via WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#14332E] text-[#FDF6EC] pt-16 pb-12 border-t border-[#0F2D2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info & Made in Lagos Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="font-serif text-xl font-bold text-white">Faster Shop</span>
            </div>
            <p className="text-xs text-[#A8C3B8] leading-relaxed">
              Empowering independent makers across Lagos with real-time digital storefronts. Small-batch craft, ethically sourced materials.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F2D2D] border border-[#234D46] text-xs text-amber-300">
              <span>🇳🇬 Made in Lagos, Nigeria</span>
            </div>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-[#A8C3B8]">
              <li><a href="#shop" className="hover:text-white">Aso-Oke & Textiles</a></li>
              <li><a href="#shop" className="hover:text-white">Handcrafted Ceramics</a></li>
              <li><a href="#shop" className="hover:text-white">Organic Shea Oils</a></li>
              <li><a href="#shop" className="hover:text-white">Elephant Grass Baskets</a></li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Makers & Community</h4>
            <ul className="space-y-2.5 text-xs text-[#A8C3B8]">
              <li><a href="#vendors" className="hover:text-white">Apply as a Maker</a></li>
              <li><a href="#vendors" className="hover:text-white">Surulere Studio Tour</a></li>
              <li><a href="#vendors" className="hover:text-white">Artisan Directory</a></li>
              <li><a href="#vendors" className="hover:text-white">WhatsApp Buyer Group</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscribe */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4">Lagos Drops Digest</h4>
            <p className="text-xs text-[#A8C3B8] mb-3">
              Get notified when Surulere or Yaba artisans drop new limited collections.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#0F2D2D] rounded-2xl border border-[#234D46] text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to Lagos drops!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0F2D2D] border border-[#234D46] text-xs text-white placeholder-[#87A89B] outline-none focus:border-[#A8C3B8]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-[#FDF6EC] text-[#14332E] font-bold text-xs hover:bg-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-12 border-t border-[#234D46]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#87A89B] gap-4">
          <div>© {new Date().getFullYear()} Faster Shop Nigeria. Built for Lagos Makers.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Paystack Direct Merchant</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
