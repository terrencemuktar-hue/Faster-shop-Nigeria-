import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true }).then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  if (!events.length) return <p style={{ padding: 16, opacity: 0.7 }}>No events yet — check back soon.</p>;

  return (
    <div style={{ padding: 16 }}>
      <h3>📍 LAGOS HAPPENINGS</h3>
      {events.map(e => (
        <div key={e.id} style={{ background: '#111', color: '#fff', padding: 12, borderRadius: 10, marginBottom: 10 }}>
          <strong>{e.title}</strong>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{e.location} • {e.date}</div>
        </div>
      ))}
    </div>
  );
}