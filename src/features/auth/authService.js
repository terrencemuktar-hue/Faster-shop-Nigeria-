import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../../lib/firebase.js'

const googleProvider = new GoogleAuthProvider()

function requireFirebaseConfig() {
  if (!isFirebaseConfigured) {
    throw new Error('Add your Firebase web app settings to .env.local to enable sign in.')
  }
}

export async function ensureUserProfile(user, role = 'buyer', storeName = '') {
  const profileRef = doc(db, 'users', user.uid)

  await runTransaction(db, async (transaction) => {
    const profile = await transaction.get(profileRef)

    if (!profile.exists()) {
      transaction.set(profileRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? null,
        role,
        storeName: role === 'vendor' ? storeName.trim() : '',
        vendorStatus: role === 'vendor' ? 'approved' : 'none',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }
  })

  const profile = await getDoc(profileRef)
  return profile.data()
}

export async function createAccount({ name, email, password, role = 'buyer', storeName = '' }) {
  requireFirebaseConfig()
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(credential.user, { displayName: name.trim() })
  await ensureUserProfile(credential.user, role, storeName)
  return credential.user
}

export async function signInWithEmail({ email, password }) {
  requireFirebaseConfig()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  await ensureUserProfile(credential.user)
  return credential.user
}

export async function signInWithGoogle() {
  requireFirebaseConfig()
  const credential = await signInWithPopup(auth, googleProvider)
  await ensureUserProfile(credential.user)
  return credential.user
}

export function signOutUser() {
  requireFirebaseConfig()
  return signOut(auth)
}