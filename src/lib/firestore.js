import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase.js'

export function subscribeProducts(callback) {
  if (!db) {
    callback([])
    return () => {}
  }

  const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'))

  return onSnapshot(
    productsQuery,
    (snapshot) => {
      callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    },
    (error) => {
      console.error('Unable to subscribe to products:', error)
      callback([])
    },
  )
}

export function subscribeOrdersForBuyer(buyerId, callback) {
  if (!db) {
    callback([])
    return () => {}
  }

  const ordersQuery = query(collection(db, 'orders'), where('buyerId', '==', buyerId), orderBy('createdAt', 'desc'))

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    },
    (error) => {
      console.error('Unable to subscribe to buyer orders:', error)
      callback([])
    },
  )
}

export function subscribeOrdersForVendor(vendorId, callback) {
  if (!db) {
    callback([])
    return () => {}
  }

  const ordersQuery = query(collection(db, 'orders'), where('vendorId', '==', vendorId), orderBy('createdAt', 'desc'))

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      callback(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    },
    (error) => {
      console.error('Unable to subscribe to vendor orders:', error)
      callback([])
    },
  )
}

export async function upsertProduct(product) {
  if (!db) return null

  const productId = product.id || `${product.vendorId || 'vendor'}-${Date.now()}`
  const productRef = doc(db, 'products', productId)

  await setDoc(
    productRef,
    {
      ...product,
      id: productId,
      updatedAt: serverTimestamp(),
      createdAt: product.createdAt ?? serverTimestamp(),
    },
    { merge: true },
  )

  return productId
}

export async function createOrderRecord(order) {
  if (!db) return null

  const orderRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return orderRef.id
}

export async function updateOrderStatus(orderId, status) {
  if (!db) return null

  const orderRef = doc(db, 'orders', orderId)
  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  })

  return orderId
}
