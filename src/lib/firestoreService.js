import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions, isFirebaseConfigured } from './firebase.js'

function requireFirestore() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not configured. Add the web app settings to .env.local.')
  }
}

function mapSnapshot(snapshot) {
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }))
}

function toOrderView(document) {
  const data = document.data()
  const date = data.createdAt?.toDate?.()

  return {
    id: document.id,
    ...data,
    customer: data.customerName,
    address: data.deliveryAddress,
    placedAt: date
      ? date.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
      : 'Just now',
  }
}

export function subscribeCatalog(onData, onError) {
  requireFirestore()
  return onSnapshot(collection(db, 'products'), (snapshot) => {
    onData(mapSnapshot(snapshot))
  }, onError)
}

export function subscribeVendorOrders(vendorId, onData, onError) {
  requireFirestore()
  const ordersQuery = query(collection(db, 'orders'), where('vendorId', '==', vendorId))
  return onSnapshot(ordersQuery, (snapshot) => {
    onData(snapshot.docs.map(toOrderView))
  }, onError)
}

export function subscribeBuyerOrders(buyerId, onData, onError) {
  requireFirestore()
  const ordersQuery = query(collection(db, 'orders'), where('buyerId', '==', buyerId))
  return onSnapshot(ordersQuery, (snapshot) => {
    onData(snapshot.docs.map(toOrderView))
  }, onError)
}

export async function saveVendorProduct(product, { vendorId, vendorName }) {
  requireFirestore()
  const reference = product.id
    ? doc(db, 'products', product.id)
    : doc(collection(db, 'products'))
  const existing = await getProductDocument(reference)

  await setDoc(reference, {
    vendorId,
    vendor: vendorName,
    name: product.name.trim(),
    category: product.category.trim(),
    price: Number(product.price),
    inventory: Number(product.inventory),
    image: product.image.trim(),
    description: product.description.trim(),
    vendorTag: product.vendorTag || 'New arrival',
    tag: product.tag || 'New',
    rating: Number(product.rating || 4.8),
    variants: Array.isArray(product.variants) ? product.variants : ['One size'],
    shipping: product.shipping || 'Ships in 2-3 days',
    createdAt: existing?.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return { ...product, id: reference.id, vendorId, vendor: vendorName }
}

async function getProductDocument(reference) {
  const snapshot = await getDoc(reference)
  return snapshot.exists() ? snapshot.data() : null
}

export async function updateVendorOrderStatus(orderId, status) {
  requireFirestore()
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function createCheckoutOrders({
  cartItems,
  customer,
  deliveryAddress,
  paymentMethod,
}) {
  requireFirestore()
  if (!functions) throw new Error('Firebase Functions is unavailable.')
  const submitCheckout = httpsCallable(functions, 'createOrder')
  const result = await submitCheckout({
    cartItems: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      variant: item.variant || '',
    })),
    customer,
    deliveryAddress,
    paymentMethod,
  })
  return result.data.orders
}