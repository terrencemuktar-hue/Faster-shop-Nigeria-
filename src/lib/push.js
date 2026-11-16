import { supabase } from './supabase';
const PUBLIC_KEY = 'BPh6z0Ej375hCwAzWXEJW9gQkED7A67yaXnBFvICENatmCTMHtCjPxhFl2AAbHlzufXtME63hMiWKbmkbzrhziM';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('This browser no support push. Try Chrome for Android or Add to Home Screen for iPhone.');
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;
  const reg = await navigator.serviceWorker.register('/sw.js');
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
  });
  const { data: { user } } = await supabase.auth.getUser();
  const keys = sub.toJSON().keys;
  await supabase.from('push_subscriptions').upsert({
    user_id: user?.id,
    endpoint: sub.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    user_agent: navigator.userAgent
  }, { onConflict: 'endpoint' });
  alert('Notifications ON! You go get alert even if app closed.');
}