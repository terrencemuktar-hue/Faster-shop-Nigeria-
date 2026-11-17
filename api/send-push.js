import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:support@faster-shop-nigeria.vercel.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, message } = req.body || {};
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });

  let sent = 0, failed = 0;
  for (const row of subs || []) {
    try {
      const sub = typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription;
      await webpush.sendNotification(sub, JSON.stringify({
        title: title || 'Faster Shop 💚',
        body: message || 'You have a new message',
      }));
      sent++;
    } catch (e) {
      failed++;
      if (e.statusCode === 410 || e.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', row.id);
      }
    }
  }
  return res.status(200).json({ sent, failed, total: subs?.length || 0 });
}
