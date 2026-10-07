// Central Store Manager with LocalStorage Persistence for Faster Shop

const STORAGE_KEYS = {
  VENDORS: 'faster_shop_vendors_v1',
  PRODUCTS: 'faster_shop_products_v1',
  WISHLIST: 'faster_shop_wishlist_v1',
  CART: 'faster_shop_cart_v1'
};

// Initial default data if storage is empty
const defaultVendors = [
  { id: 'v1', name: 'Aura Lagos', category: 'Luxury Wear', location: 'Victoria Island, Lagos', rating: 4.9, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  { id: 'v2', name: 'Kano Crafts', category: 'Leather & Accessories', location: 'Kano State', rating: 4.8, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
  { id: 'v3', name: 'Lekki Threads', category: 'Streetwear', location: 'Lekki Phase 1, Lagos', rating: 4.7, image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9' }
];

const defaultProducts = [
  { id: 'p1', name: 'Velvet Oversized Hoodie', price: 45000, category: 'Fashion', vendor: 'Aura Lagos', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2', rating: 4.9 },
  { id: 'p2', name: 'Handcrafted Leather Tote', price: 65000, category: 'Accessories', vendor: 'Kano Crafts', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', rating: 4.8 },
  { id: 'p3', name: 'Urban Cargo Joggers', price: 32000, category: 'Streetwear', vendor: 'Lekki Threads', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8', rating: 4.7 }
];

export function getStoredVendors() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(defaultVendors));
      return defaultVendors;
    }
    return JSON.parse(data);
  } catch (e) {
    return defaultVendors;
  }
}

export function saveVendor(newVendor) {
  try {
    const vendors = getStoredVendors();
    const vendorWithId = { ...newVendor, id: 'v_' + Date.now(), rating: 5.0 };
    const updated = [vendorWithId, ...vendors];
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(updated));
    return vendorWithId;
  } catch (e) {
    console.error("Error saving vendor", e);
  }
}

export function getStoredProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
      return defaultProducts;
    }
    return JSON.parse(data);
  } catch (e) {
    return defaultProducts;
  }
}

export function saveProduct(newProduct) {
  try {
    const products = getStoredProducts();
    const productWithId = { ...newProduct, id: 'p_' + Date.now(), rating: 5.0 };
    const updated = [productWithId, ...products];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return productWithId;
  } catch (e) {
    console.error("Error saving product", e);
  }
}

export function getStoredWishlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveWishlist(wishlist) {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  } catch (e) {
    console.error("Error saving wishlist", e);
  }
}
