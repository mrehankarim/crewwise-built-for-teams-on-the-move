import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ManagerProfile = () => {
  const { user, subscriptionStatus, updateProfile, changePassword } = useAuth();
  const plan = subscriptionStatus?.plan;
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
        <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Manage your account settings</p>
      </div>
      <div className="flex gap-3 border-b mb-8 animate-fadeIn" style={{ borderColor: 'var(--border-secondary)' }}>
        <button onClick={() => setTab('profile')} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === 'profile' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Profile</button>
        <button onClick={() => setTab('password')} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === 'password' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Password</button>
        <button onClick={() => setTab('subscription')} className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === 'subscription' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>Subscription</button>
      </div>

      {tab === 'profile' && (
        <div className='themed-card rounded-2xl p-8 animate-slideUp max-w-2xl'>
          <div className="flex items-center gap-6 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-bluelogo to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-bluelogo/20 rotate-3 transition-transform hover:rotate-0 cursor-default">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-sm font-semibold capitalize mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {user?.role} • <span className="text-bluelogo">{user?.organization?.name || 'No organization'}</span>
              </p>
            </div>
          </div>
          <form onSubmit={handleUpdate} className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Name</label>
                <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className='themed-input w-full py-2.5 px-4 rounded-xl text-sm outline-none' id="mgr-prof-name" />
              </div>
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Phone</label>
                <input type='text' value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                  className='themed-input w-full py-2.5 px-4 rounded-xl text-sm outline-none' id="mgr-prof-phone" />
              </div>
            </div>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Email <span className="opacity-40 font-normal">(Non-editable)</span></label>
              <input type='email' value={user?.email || ''} disabled
                className='themed-input w-full py-2.5 px-4 rounded-xl text-sm opacity-50 cursor-not-allowed' />
            </div>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Organization</label>
              <input type='text' value={user?.organization?.name || ''} disabled
                className='themed-input w-full py-2.5 px-4 rounded-xl text-sm opacity-50 cursor-not-allowed' />
            </div>
            <button type='submit' className='bg-bluelogo text-white py-3.5 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-bluelogo/30 hover:scale-[1.02] active:scale-[0.98]' id="mgr-prof-save">
              Update Profile
            </button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className='themed-card rounded-2xl p-8 animate-slideUp max-w-2xl'>
          <form onSubmit={handlePwChange} className='space-y-6'>
            <div>
              <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Current Password</label>
              <input type='password' value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                className='themed-input w-full py-2.5 px-4 rounded-xl text-sm outline-none' id="mgr-pw-current" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>New Password</label>
                <input type='password' value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  className='themed-input w-full py-2.5 px-4 rounded-xl text-sm outline-none' id="mgr-pw-new" />
              </div>
              <div>
                <label className='block text-xs font-bold uppercase tracking-wider mb-2' style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                <input type='password' value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  className='themed-input w-full py-2.5 px-4 rounded-xl text-sm outline-none' id="mgr-pw-confirm" />
              </div>
            </div>
            <button type='submit' className='bg-bluelogo text-white py-3.5 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-bluelogo/30 hover:scale-[1.02] active:scale-[0.98]' id="mgr-pw-save">
              Change Password
            </button>
          </form>
        </div>
      )}

      {tab === 'subscription' && (
        <div className='themed-card rounded-2xl p-8 animate-slideUp max-w-2xl'>
          {subscriptionStatus?.active ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{plan?.name} Plan</h3>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Active until <span className="text-bluelogo">{new Date(subscriptionStatus.expiresAt).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/20">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>User Capacity</p>
                  <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{plan?.maxUsers} <span className="text-sm font-normal opacity-50">Members</span></p>
                </div>
                <div className="p-6 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Order Limit</p>
                  <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{plan?.maxWorkOrders} <span className="text-sm font-normal opacity-50">Monthly</span></p>
                </div>
              </div>

              <div className="pt-6 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>Need more capacity or enterprise features? Upgrade your plan to unlock higher limits and priority support.</p>
                <div className="flex gap-4">
                  <button onClick={() => window.location.href = '/manager/subscription'} className='bg-bluelogo text-white py-3.5 px-8 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-bluelogo/30 hover:scale-[1.02] active:scale-[0.98]' id="mgr-sub-upgrade">
                    Upgrade Now
                  </button>
                  <button className='bg-error/10 text-error py-3.5 px-8 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-error hover:text-white' id="mgr-sub-cancel">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:alert-circle-outline" width={40} className="text-error" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No Active Subscription</h3>
              <p className="text-sm max-w-sm mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>{subscriptionStatus?.message || 'Please purchase a plan to unlock all features and manage your team.'}</p>
              <button onClick={() => window.location.href = '/manager/subscription'} className='bg-bluelogo text-white py-3.5 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-bluelogo/30' id="mgr-sub-purchase">
                Explore Plans
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ManagerProfile
