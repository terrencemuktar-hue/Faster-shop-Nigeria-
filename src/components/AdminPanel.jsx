import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel({ user }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState('');

  // ONLY you see this - nobody else
  if (!user || user.email !== 'terrence@fastersub.ng') return null;

  async function addEvent(e) {
    e.preventDefault();
    setMsg('Saving...');
    const { error } = await supabase.from('events').insert([
      { title, location, date, created_by: user.id }
    ]);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Event added - check Search > LAGOS HAPPENINGS');
      setTitle(''); setDate('');
    }
  }

  return (
    <div style={{ background: '#111', color: '#fff', padding: 16, borderRadius: 12, marginTop: 20 }}>
      <h3>ADMIN PANEL — Faster Shop Control</h3>
      <p style={{ fontSize: 13, opacity: 0.8 }}>Only visible to you.</p>
      <form onSubmit={addEvent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title e.g. Lagos Food Fest" required style={{ padding: 10, borderRadius: 8 }} />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" style={{ padding: 10, borderRadius: 8 }} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ padding: 10, borderRadius: 8 }} />
        <button type="submit" style={{ padding: 12, background: '#FFD700', fontWeight: 'bold', borderRadius: 8 }}>Add Event</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}