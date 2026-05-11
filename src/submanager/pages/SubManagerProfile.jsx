import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const SubManagerProfile = () => {
  const { user, updateProfile, changePassword, loading } = useAuth();
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
    try { await changePassword(pwForm.currentPassword, pwForm.newPassword); setPwForm({ currentPassword: '', newPassword: '', confirm: '' }); } catch {}
  };

  return (
    <div className='w-full px-8 pb-8'>
      <div className='pt-4 pb-6 animate-slideDown'>
        <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Manage your account settings</p>
      </div>
      <div className="flex gap-3 border-b mb-6 animate-fadeIn" style={{ borderColor: 'var(--border-primary)' }}>
        <button onClick={() => setTab('profile')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'profile' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-500'}`}>Profile</button>
        <button onClick={() => setTab('password')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'password' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-500'}`}>Password</button>
      </div>

      {tab === 'profile' && (
        <div className='themed-card rounded-2xl p-6 border animate-slideUp max-w-2xl' style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-bluelogo to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{user?.role} • {user?.organization?.name || 'No org'}</p>
            </div>
          </div>
          <form onSubmit={handleUpdate} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Name</label>
              <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 text-sm outline-none' id="sub-prof-name" />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input type='email' value={user?.email || ''} disabled
                className='themed-input w-full py-2.5 px-4 text-sm cursor-not-allowed opacity-70' />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Phone</label>
              <input type='text' value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 text-sm outline-none' id="sub-prof-phone" />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Role</label>
              <input type='text' value={user?.role || ''} disabled
                className='themed-input w-full py-2.5 px-4 text-sm cursor-not-allowed opacity-70 capitalize' />
            </div>
            <button type='submit' className='bg-bluelogo text-white py-2.5 px-6 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' id="sub-prof-save">
              Save Changes
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className='themed-card rounded-2xl p-6 border animate-slideUp max-w-2xl' style={{ borderColor: 'var(--border-primary)' }}>
          <form onSubmit={handlePwChange} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Current Password</label>
              <input type='password' value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 text-sm outline-none' id="sub-pw-current" />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>New Password</label>
              <input type='password' value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 text-sm outline-none' id="sub-pw-new" />
            </div>
            <div>
              <label className='block text-sm font-semibold mb-1' style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input type='password' value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 text-sm outline-none' id="sub-pw-confirm" />
            </div>
            <button type='submit' className='bg-bluelogo text-white py-2.5 px-6 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]' id="sub-pw-save">
              Change Password
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default SubManagerProfile
