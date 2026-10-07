import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyPlaceholder-FasterShopNGKey",
  authDomain: "faster-shop-ng.firebaseapp.com",
  projectId: "faster-shop-ng",
  storageBucket: "faster-shop-ng.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
