import { supabase } from '../lib/supabase';
import { useEffect, useRef, useState } from 'react';

const ADMIN_EMAILS = ['terrence@faster.shop', 'terrence@fastersub.ng', 'terrence@fastershop.ng'];

export default function AdminPanel({ user, profile }) {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const [msg, setMsg] = useState('');
  const [events, setEvents] = useState([]);
  const [finds, setFinds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Faster Finds refs
  const ffTitleRef = useRef(null);
  const ffVendorRef = useRef(null);
  const ffPriceRef = useRef(null);
  const ffImageRef = useRef(null);

  // FIXED CHECK: App.jsx already verified admin, this is just a backup.
  // Checks BOTH user.email + profile.email, case-insensitive, + is_faster_shop flag
  const currentEmail = (user?.email || profile?.email || '').toLowerCase().trim();
  const isAdmin = ADMIN_EMAILS.includes(currentEmail) || profile?.is_faster_shop === true;

  // Load lists for delete
  const loadAll = async () => {
    const { data: ev } = await supabase.from('events').select('*').order('created_at', { ascending: false }).limit(20);
    const { data: ff } = await supabase.from('faster_finds').select('*').order('created_at', { ascending: false }).limit(20);
    setEvents(ev || []);
    setFinds(ff || []);
  };

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  if (!user) {
    return <div style={{ padding: 20 }}>Please login first to see Admin Panel</div>;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 20, background: '#18181b', borderRadius: 12, margin: 16 }}>
        <p style={{ fontWeight: 'bold' }}>Admin Panel hidden</p>
        <p style={{ fontSize: 12, color: '#a1a1aa' }}>
          Logged in as: <b>{currentEmail || 'unknown'}</b><br />
          To unlock Admin, login with terrence@faster.shop — or send me this email and I will add it to ADMIN_EMAILS.
        </p>
      </div>
    );
  }

  async function addEvent(e) {
    e.preventDefault();
    const title = titleRef.current.value?.trim();
    const location = locationRef.current.value?.trim();
    const date = dateRef.current.value;
    if (!title) return setMsg('Add title');
    setLoading(true);
    const { error } = await supabase.from('events').insert([{ title, location, date, created_by: currentEmail }]);
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Event added - check Search > LAGOS HAPPENINGS');
      titleRef.current.value = '';
      locationRef.current.value = '';
      dateRef.current.value = '';
      loadAll();
    }
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('🗑️ Event deleted'); loadAll(); }
  }

  async function addFasterFind(e) {
    e.preventDefault();
    const title = ffTitleRef.current.value?.trim();
    const vendor_name = ffVendorRef.current.value?.trim();
    const price = ffPriceRef.current.value;
    const image_url = ffImageRef.current.value?.trim();
    if (!title) return setMsg('Add Faster Find title');
    setLoading(true);
    const { error } = await supabase.from('faster_finds').insert([{ title, vendor_name, price: price ? Number(price) : null, image_url, is_active: true }]);
    setLoading(false);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Added to Faster Finds - check Search');
      ffTitleRef.current.value = '';
      ffVendorRef.current.value = '';
      ffPriceRef.current.value = '';
      ffImageRef.current.value = '';
      loadAll();
    }
  }

  async function deleteFind(id) {
    if (!confirm('Delete this Faster Find?')) return;
    const { error } = await supabase.from('faster_finds').delete().eq('id', id);
    if (error) setMsg('Error: ' + error.message);
    else { setMsg('🗑️ Faster Find deleted'); loadAll(); }
  }

  const inputStyle = { display: 'block', width: '100%', padding: 12, marginBottom: 8, background: '#27272a', border: '1px solid #3f3f46', borderRadius: 12, color: '#fff', fontSize: 12, boxSizing: 'border-box' };
  const btnStyle = { padding: 12, width: '100%', background: '#39FF14', color: '#000', fontWeight: '900', border: 'none', borderRadius: 999, fontSize: 12, cursor: 'pointer' };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 16, padding: 16 }}>
        <h2 style={{ margin: 0 }}>Admin Panel ✅</h2>
        <p style={{ fontSize: 11, color: '#a1a1aa', margin: '4px 0 0' }}>Logged in as: {currentEmail}</p>
        {msg && <p style={{ background: '#27272a', padding: 10, borderRadius: 10, fontSize: 12 }}>{msg}</p>}

        <h3 style={{ marginTop: 20 }}>Add Event - Lagos Happenings</h3>
        <form onSubmit={addEvent}>
          <input ref={titleRef} placeholder="Event title" style={inputStyle} />
          <input ref={locationRef} placeholder="Location e.g Lekki" style={inputStyle} />
          <input ref={dateRef} type="date" style={inputStyle} />
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Adding...' : 'Add Event'}</button>
        </form>

        {/* List + Delete Events */}
        {events.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 'bold' }}>Current Events ({events.length}) - tap 🗑️ to delete</p>
            {events.map(ev => (
              <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181b', padding: 10, borderRadius: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12 }}>{ev.title} • {ev.location || ''} • {ev.date || ''}</span>
                <button type="button" onClick={() => deleteEvent(ev.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11 }}>🗑️</button>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ marginTop: 30 }}>🔥 Add to Faster Finds</h3>
        <form onSubmit={addFasterFind}>
          <input ref={ffTitleRef} placeholder="Product title e.g Agbada Set" style={inputStyle} />
          <input ref={ffVendorRef} placeholder="Vendor name e.g Rossa" style={inputStyle} />
          <input ref={ffPriceRef} placeholder="Price e.g 25000" type="number" style={inputStyle} />
          <input ref={ffImageRef} placeholder="Image URL (paste link)" style={inputStyle} />
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Adding...' : 'Add to Faster Finds'}</button>
        </form>

        {/* List + Delete Faster Finds */}
        {finds.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 'bold' }}>Current Faster Finds ({finds.length}) - tap 🗑️ to delete</p>
            {finds.map(f => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181b', padding: 10, borderRadius: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12 }}>{f.title} • ₦{f.price} • {f.vendor_name || ''}</span>
                <button type="button" onClick={() => deleteFind(f.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 10px', fontSize: 11 }}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}