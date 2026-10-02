import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const productsByVendor = {
  'Rubian Girl': [
    {
      id: 'rubian-girl-milan-pleated-dress',
      name: 'Milan Pleated Dress',
      category: 'Fashion',
      price: 25800,
      inventory: 18,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      description: 'A sleek pleated silhouette with a soft drape for polished city nights.',
      tag: 'Bestseller',
      vendorTag: 'New arrival',
      rating: 4.9,
      variants: ['Rose', 'Cocoa', 'Black'],
      shipping: 'Ships in 48 hours',
    },
    {
      id: 'rubian-girl-saffron-glow-set',
      name: 'Saffron Glow Set',
      category: 'Beauty',
      price: 16900,
      inventory: 25,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      description: 'A glowing skincare duo designed to nourish, brighten, and hydrate.',
      tag: 'Limited',
      vendorTag: 'Soft glow',
      rating: 4.8,
      variants: ['Spring', 'Evening', 'Bundle'],
      shipping: 'Free delivery above ₦30,000',
    },
  ],
  Kinging: [
    {
      id: 'kinging-royal-stripe-tee',
      name: 'Royal Stripe Tee',
      category: 'Fashion',
      price: 12200,
      inventory: 36,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      description: 'A relaxed premium tee in a luxe stripe finish made for everyday layering.',
      tag: 'Fresh drop',
      vendorTag: 'Street wear',
      rating: 4.7,
      variants: ['Navy', 'Cream', 'Red'],
      shipping: 'Ships in 2 days',
    },
    {
      id: 'kinging-weekend-utility-cap',
      name: 'Weekend Utility Cap',
      category: 'Accessories',
      price: 7800,
      inventory: 42,
      image: 'https://images.unsplash.com/photo-1521369909026-2afed882baee?auto=format&fit=crop&w=900&q=80',
      description: 'Structured comfort with subtle utility detailing for easy everyday styling.',
      tag: 'Everyday',
      vendorTag: 'New style',
      rating: 4.6,
      variants: ['Stone', 'Black', 'Olive'],
      shipping: 'Local pickup available',
    },
  ],
  'House of Cupid': [
    {
      id: 'house-of-cupid-rose-silk-gown',
      name: 'Rose Silk Gown',
      category: 'Fashion',
      price: 31200,
      inventory: 10,
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      description: 'An elegant silk statement piece designed for special events and celebratory moments.',
      tag: 'Signature',
      vendorTag: 'Event edit',
      rating: 5.0,
      variants: ['Blush', 'Ivory', 'Wine'],
      shipping: 'Ships in 3 days',
    },
    {
      id: 'house-of-cupid-love-letter-candle-duo',
      name: 'Love Letter Candle Duo',
      category: 'Home',
      price: 9800,
      inventory: 20,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
      description: 'Warm amber notes and a delicate floral finish for slow evenings and gifting.',
      tag: 'Gift pick',
      vendorTag: 'Trending now',
      rating: 4.8,
      variants: ['Velvet Rose', 'Amber Bloom'],
      shipping: 'Free shipping over ₦25,000',
    },
  ],
}

const vendorAccounts = [
  { storeName: 'Rubian Girl', email: process.env.VITE_VENDOR_RUBIAN_EMAIL, password: process.env.VITE_VENDOR_RUBIAN_PASSWORD },
  { storeName: 'Kinging', email: process.env.VITE_VENDOR_KINGING_EMAIL, password: process.env.VITE_VENDOR_KINGING_PASSWORD },
  { storeName: 'House of Cupid', email: process.env.VITE_VENDOR_CUPID_EMAIL, password: process.env.VITE_VENDOR_CUPID_PASSWORD },
]

const hasAllFirebaseConfig = Object.values(firebaseConfig).every(Boolean)
if (!hasAllFirebaseConfig) {
  console.error('Missing Firebase env vars. Add your project settings to .env.local before running this script.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const configuredAccounts = vendorAccounts.filter((account) => account.email && account.password)
if (!configuredAccounts.length) {
  console.warn('No vendor credentials configured. Set VITE_VENDOR_* values in .env.local to seed the catalog.')
  process.exit(0)
}

for (const account of configuredAccounts) {
  const products = productsByVendor[account.storeName] ?? []
  if (!products.length) {
    console.warn(`No catalog entries configured for ${account.storeName}.`)
    continue
  }

  await signInWithEmailAndPassword(auth, account.email, account.password)
  const user = auth.currentUser

  if (!user) {
    throw new Error(`Unable to sign in as ${account.storeName}.`)
  }

  for (const product of products) {
    await setDoc(
      doc(db, 'products', product.id),
      {
        ...product,
        vendorId: user.uid,
        vendor: account.storeName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  }

  console.log(`Seeded ${products.length} products for ${account.storeName}.`)
  await signOut(auth)
}

console.log('Catalog seeding complete.')
