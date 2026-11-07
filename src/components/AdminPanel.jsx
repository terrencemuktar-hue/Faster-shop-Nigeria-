import { supabase } from '../lib/supabase';
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
      <h3 style={{ marginTop: 20 }}>🔥 Add to Faster Finds</h3>
<input placeholder="Product title" id="ff-title" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
<input placeholder="Vendor name" id="ff-vendor" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
<input placeholder="Price e.g 25000" id="ff-price" type="number" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
<input placeholder="Image URL (paste link)" id="ff-image" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
<button onClick={async () => {
  const title = document.getElementById('ff-title').value;
  const vendor_name = document.getElementById('ff-vendor').value;
  const price = document.getElementById('ff-price').value;
  const image_url = document.getElementById('ff-image').value;
  if (!title) return alert('Add title');
  const { error } = await supabase.from('faster_finds').insert([{ title, vendor_name, price, image_url }]);
  if (error) alert(error.message); else alert('✅ Added to Faster Finds');
}} style={{ padding: 10, width: '100%' }}>Add to Faster Finds</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}