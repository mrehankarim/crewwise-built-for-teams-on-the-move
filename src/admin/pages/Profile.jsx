import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [form, setForm] = useState({ name: '', phoneNumber: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [tab, setTab] = useState('profile');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phoneNumber: user.phoneNumber || '' });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try { await updateProfile(form); } catch {}
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch {}
  };

  return (
    <div className='w-full px-8 pb-8'>
      <div className='pt-4 pb-6 animate-slideDown'>
        <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Admin Settings</h1>
        <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Manage your administrator account</p>
      </div>
      <div className="flex gap-3 border-b mb-8 animate-fadeIn" style={{ borderColor: 'var(--border-secondary)' }}>
        <button onClick={() => setTab('profile')} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === 'profile' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Profile Information</button>
        <button onClick={() => setTab('password')} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === 'password' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Security</button>
      </div>

      {tab === 'profile' && (
        <div className='themed-card rounded-2xl p-8 animate-slideUp max-w-2xl'>
          <div className="flex items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-bluelogo to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-bluelogo/20 rotate-3 transition-transform hover:rotate-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-bluelogo/10 text-bluelogo text-[10px] font-black uppercase tracking-widest rounded-md border border-bluelogo/20">Super Admin</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>System Administrator</span>
              </div>
            </div>
          </div>
          <form onSubmit={handleUpdate} className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                    <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className='themed-input w-full py-3 px-4 rounded-xl text-sm outline-none transition-all' placeholder="Your full name" />
                </div>
                <div>
                    <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                    <input type='text' value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                        className='themed-input w-full py-3 px-4 rounded-xl text-sm outline-none transition-all' placeholder="Optional phone" />
                </div>
            </div>
            <div>
              <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>Email Address <span className="opacity-40 font-normal italic lowercase">(read-only)</span></label>
              <input type='email' value={user?.email || ''} disabled
                className='themed-input w-full py-3 px-4 rounded-xl text-sm opacity-50 cursor-not-allowed font-medium' />
              <p className="text-[10px] mt-2 italic" style={{ color: 'var(--text-tertiary)' }}>Email cannot be changed. Contact system support for assistance.</p>
            </div>
            
            <div className="pt-4">
                <button type='submit' className='bg-bluelogo text-white py-3.5 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-xl hover:shadow-bluelogo/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2'>
                <Icon icon="mdi:content-save-outline" width={18} />
                Save Changes
                </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className='themed-card rounded-2xl p-8 animate-slideUp max-w-2xl'>
          <div className="mb-8 flex items-center gap-4 bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 text-amber-500">
            <Icon icon="mdi:shield-alert-outline" width={32} className="flex-shrink-0" />
            <p className="text-xs font-bold leading-relaxed">Changing your password will require you to log back in on all devices for security purposes.</p>
          </div>
          <form onSubmit={handlePwChange} className='space-y-6'>
            <div>
              <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>Current Password</label>
              <input type='password' value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                className='themed-input w-full py-3 px-4 rounded-xl text-sm outline-none' placeholder="Enter current password" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>New Password</label>
                <input type='password' value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    className='themed-input w-full py-3 px-4 rounded-xl text-sm outline-none' placeholder="Min 6 characters" />
                </div>
                <div>
                <label className='block text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                <input type='password' value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                    className='themed-input w-full py-3 px-4 rounded-xl text-sm outline-none' placeholder="Repeat new password" />
                </div>
            </div>
            <div className="pt-4">
                <button type='submit' className='bg-gray-900 text-white py-3.5 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2' style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}>
                <Icon icon="mdi:lock-reset" width={18} />
                Update Password
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
