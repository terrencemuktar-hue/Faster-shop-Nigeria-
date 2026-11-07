import { useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPanel({ user }) {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const [msg, setMsg] = useState('');

  if (!user || user.email !== 'terrence@fastersub.ng') return null;

  async function addEvent(e) {
    e.preventDefault();
    const title = titleRef.current?.value;
    const location = locationRef.current?.value || 'Lagos';
    const date = dateRef.current?.value;
    if (!title || !date) { setMsg('Fill title + date'); return; }
    setMsg('Saving...');
    const { error } = await supabase.from('events').insert([
      { title, location, date, created_by: user.id }
    ]);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Event added - check Search > LAGOS HAPPENINGS');
      if (titleRef.current) titleRef.current.value = '';
      if (dateRef.current) dateRef.current.value = '';
    }
  }

  return (
    <div style={{ background: '#111', color: '#fff', padding: 16, borderRadius: 12, marginTop: 20 }}>
      <h3>ADMIN PANEL — Faster Shop Control</h3>
      <p style={{ fontSize: 13, opacity: 0.8 }}>Only visible to you.</p>
      <form onSubmit={addEvent} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input ref={titleRef} placeholder="Event title e.g. Lagos Food Fest" style={{ padding: 10, borderRadius: 8, color: '#000', background: '#fff' }} />
        <input ref={locationRef} defaultValue="Lagos" placeholder="Location" style={{ padding: 10, borderRadius: 8, color: '#000', background: '#fff' }} />
        <input ref={dateRef} type="date" style={{ padding: 10, borderRadius: 8, color: '#000', background: '#fff' }} />
        <button type="submit" style={{ padding: 12, background: '#FFD700', fontWeight: 'bold', borderRadius: 8 }}>Add Event</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}