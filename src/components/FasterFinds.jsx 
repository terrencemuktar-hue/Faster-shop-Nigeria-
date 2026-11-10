import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function FasterFinds() {
  const [finds, setFinds] = useState([]);
  useEffect(() => {
    supabase.from('faster_finds').select('*').eq('is_active', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setFinds(data);
    });
  }, []);
  return (
    <div style={{ padding: 16, paddingTop: 4 }}>
      <h3>🔥 FASTER FINDS — The Drop</h3>
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: -6 }}>Hand-picked this week by Faster Shop</p>
      {finds.length === 0 ? (
        <div style={{ background: '#111', color: '#fff', padding: 16, borderRadius: 10 }}>This week's drop coming soon — check back Friday.</div>
      ) : (
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
          {finds.map(f => (
            <div key={f.id} style={{ minWidth: 160, background: '#111', color: '#fff', padding: 10, borderRadius: 10 }}>
              {f.image_url && <img src={f.image_url} alt={f.title} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8 }} />}
              <strong style={{ display: 'block', marginTop: 8 }}>{f.title}</strong>
              <div style={{ fontSize: 13, opacity: 0.8 }}>{f.vendor_name || ''}</div>
              <div style={{ fontWeight: 'bold', marginTop: 4 }}>₦{f.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}