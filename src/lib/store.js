const VENDORS_KEY = 'faster_shop_vendors';
const PRODUCTS_KEY = 'faster_shop_products';

const INITIAL_VENDORS = [
  {
    id: 'v1',
    name: 'Amina Atelier',
    category: 'Aso-Oke & Indigo Textiles',
    location: 'Surulere, Lagos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tag: 'NEW THIS WEEK'
  },
  {
    id: 'v2',
    name: 'Nia Studio',
    category: 'Handmade Fashion & Accessories',
    location: 'Ikeja, Lagos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    tag: 'TOP RATED'
  },
  {
    id: 'v3',
    name: 'Lagos Rituals',
    category: 'High-Street Fashion',
    location: 'Lekki Phase 1, Lagos',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    tag: 'POPULAR'
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    vendorId: 'v1',
    brand: 'Amina Atelier',
    name: 'Hand-Woven Aso-Oke Tote Bag',
    price: 18100,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    tag: 'Fresh Drop',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'p2',
    vendorId: 'v2',
    brand: 'Nia Studio',
    name: 'Royal Stripe Summer Tee',
    price: 12200,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    sizes: ['M', 'L', 'XL', 'XXL']
  }
];

export const getVendors = () => {
  const data = localStorage.getItem(VENDORS_KEY);
  if (!data) {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(INITIAL_VENDORS));
    return INITIAL_VENDORS;
  }
  return JSON.parse(data);
};

export const saveVendor = (vendor) => {
  const vendors = getVendors();
  const newVendor = {
    ...vendor,
    id: `v_${Date.now()}`,
    tag: 'NEW VENDOR'
  };
  const updated = [newVendor, ...vendors];
  localStorage.setItem(VENDORS_KEY, JSON.stringify(updated));
  return newVendor;
};

export const getProducts = () => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  if (!data) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(data);
};

export const saveProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: `p_${Date.now()}`,
    price: Number(product.price)
  };
  const updated = [newProduct, ...products];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return newProduct;
};
