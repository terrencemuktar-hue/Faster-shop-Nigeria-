import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

webpush.setVapidDetails(
  'mailto:hello@faster-shop-nigeria.vercel.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { title, message } = req.body || {};
  const { data: subs } = await supabase.from('push_subscriptions').select('*');
  let sent = 0, failed = 0;
  for (const s of subs || []) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify({ title: title || 'Faster Shop 💚', body: message || 'New update' }));
      sent++;
    } catch { failed++; }
  }
  return res.status(200).json({ sent, failed, total: subs?.length || 0 });
}