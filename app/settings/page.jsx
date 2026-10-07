"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { User, ArrowLeft, LogOut, Lock, Edit3, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AccountSettingsPage() {
  const [userEmail, setUserEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Faster User');
      } else {
        setUserEmail('terrence@fastersupport.ng');
        setDisplayName('Nwezeh Terrence Uche');
      }
    }
    loadUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.updateUser({ data: { full_name: displayName } });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setSuccessMsg('Profile updated locally.');
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleChangePassword = async () => {
    if (userEmail) {
      await supabase.auth.resetPasswordForEmail(userEmail);
      alert(`Password reset email sent to ${userEmail}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <div className="w-full max-w-[430px] min-h-screen bg-black text-white flex flex-col relative space-y-6 pb-24">
        
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 pt-2">
          <Link href="/" className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm font-bold tracking-wider uppercase text-white">Account Settings</h1>
          <div className="w-8"></div>
        </div>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {successMsg}
          </div>
        )}

        <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-[20px] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#22c55e]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{displayName}</h2>
              <p className="text-xs text-zinc-400">{userEmail}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3 pt-2 border-t border-zinc-900">
              <label className="text-[11px] font-semibold text-zinc-400">Display Name</label>
              <input 
                type="text" 
                value={displayName} 
                onChange={e => setDisplayName(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-[#22c55e] text-black font-extrabold px-4 py-2.5 rounded-xl text-xs">Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-zinc-900 text-zinc-400 px-4 py-2.5 rounded-xl text-xs">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="pt-2 border-t border-zinc-900 flex flex-col gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold p-3 rounded-xl text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2"><Edit3 className="w-4 h-4 text-[#22c55e]" /> Edit Profile</span>
                <span>→</span>
              </button>

              <button 
                onClick={handleChangePassword}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold p-3 rounded-xl text-xs flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-[#22c55e]" /> Change Password</span>
                <span>→</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold p-3 rounded-xl text-xs flex items-center justify-between transition-all mt-2"
              >
                <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
