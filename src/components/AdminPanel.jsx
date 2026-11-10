import { supabase } from '../lib/supabase';
import { useRef, useState } from 'react';

export default function AdminPanel({ user }) {
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const dateRef = useRef(null);
  const [msg, setMsg] = useState('');

  // Faster Finds refs
  const ffTitleRef = useRef(null);
  const ffVendorRef = useRef(null);
  const ffPriceRef = useRef(null);
  const ffImageRef = useRef(null);

  if (user?.email !== "terrence@faster.shop") {
    return <div style={{ padding: 20 }}>Not authorized</div>;
  }

  async function addEvent(e) {
    e.preventDefault();
    const title = titleRef.current.value;
    const location = locationRef.current.value;
    const date = dateRef.current.value;
    if (!title) return setMsg('Add title');
    const { error } = await supabase.from('events').insert([{ title, location, date, created_by: user.email }]);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Event added - check Search > LAGOS HAPPENINGS');
      titleRef.current.value = '';
      locationRef.current.value = '';
      dateRef.current.value = '';
    }
  }

  async function addFasterFind(e) {
    e.preventDefault();
    const title = ffTitleRef.current.value;
    const vendor_name = ffVendorRef.current.value;
    const price = ffPriceRef.current.value;
    const image_url = ffImageRef.current.value;
    if (!title) return setMsg('Add Faster Find title');
    const { error } = await supabase.from('faster_finds').insert([{ title, vendor_name, price, image_url }]);
    if (error) setMsg('Error: ' + error.message);
    else {
      setMsg('✅ Added to Faster Finds - check Search');
      ffTitleRef.current.value = '';
      ffVendorRef.current.value = '';
      ffPriceRef.current.value = '';
      ffImageRef.current.value = '';
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>
      {msg && <p>{msg}</p>}

      <h3>Add Event - Lagos Happenings</h3>
      <form onSubmit={addEvent}>
        <input ref={titleRef} placeholder="Event title" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <input ref={locationRef} placeholder="Location e.g Lekki" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <input ref={dateRef} type="date" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <button type="submit" style={{ padding: 10, width: '100%' }}>Add Event</button>
      </form>

      <h3 style={{ marginTop: 30 }}>🔥 Add to Faster Finds</h3>
      <form onSubmit={addFasterFind}>
        <input ref={ffTitleRef} placeholder="Product title e.g Agbada Set" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <input ref={ffVendorRef} placeholder="Vendor name e.g Rossa" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <input ref={ffPriceRef} placeholder="Price e.g 25000" type="number" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <input ref={ffImageRef} placeholder="Image URL (paste link)" style={{ display: 'block', width: '100%', padding: 10, marginBottom: 8 }} />
        <button type="submit" style={{ padding: 10, width: '100%' }}>Add to Faster Finds</button>
      </form>
    </div>
  );
}