import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WorkerCard from '../../components/WorkerCard'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { organizationAPI } from '../../api/services'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

/* ─── Credentials reveal modal ──────────────────────────────────────────── */
const CredentialsModal = ({ isOpen, onClose, credentials }) => {
  const [shown, setShown] = useState(false)
  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied!') }

  if (!credentials) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Created Successfully" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)' }}>
          <Icon icon="mdi:check-circle" className="text-green-500 shrink-0" width={22} />
          <p className="text-sm font-medium text-green-600">
            Account created! Share these credentials with the user.
          </p>
        </div>

        <div className="p-3 rounded-xl space-y-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Name</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{credentials.name}</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-bluelogo/10 text-bluelogo">{credentials.role}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Email</p>
              <p className="text-sm font-mono mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{credentials.email}</p>
            </div>
            <button onClick={() => copy(credentials.email)} className="p-1.5 rounded-lg hover:bg-bluelogo/10 text-gray-400 hover:text-bluelogo transition-all shrink-0">
              <Icon icon="mdi:content-copy" width={16} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Temporary Password</p>
              <p className={`text-sm font-mono mt-0.5 ${shown ? '' : 'blur-sm select-none'}`} style={{ color: 'var(--text-primary)' }}>
                {credentials.password}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setShown(s => !s)} className="p-1.5 rounded-lg hover:bg-bluelogo/10 text-gray-400 hover:text-bluelogo transition-all">
                <Icon icon={shown ? 'mdi:eye-off' : 'mdi:eye'} width={16} />
              </button>
              <button onClick={() => copy(credentials.password)} className="p-1.5 rounded-lg hover:bg-bluelogo/10 text-gray-400 hover:text-bluelogo transition-all">
                <Icon icon="mdi:content-copy" width={16} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          ⚠️ This password is shown once. Ask the user to change it after first login.
        </p>
        <button onClick={onClose}
          className="w-full bg-bluelogo text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-bluelogo/30">
          Done
        </button>
      </div>
    </Modal>
  )
}

/* ─── Create user form modal ─────────────────────────────────────────────── */
const CreateUserModal = ({ isOpen, onClose, title, role, onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role })
  const [showPwd, setShowPwd] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) setForm({ name: '', email: '', password: '', role })
  }, [isOpen, role])

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
    const pwd = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setForm(f => ({ ...f, password: pwd }))
    setShowPwd(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast.error('All fields required'); return }
    setSaving(true)
    try {
      const res = await organizationAPI.createManagedUser(form)
      const { user, credentials } = res.data.data
      onCreated({ name: user.name, email: credentials.email, password: credentials.password, role: user.role })
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account')
    } finally { setSaving(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Fill in the details below. A temporary password will be generated that you can share with the user.
        </p>

        {[
          { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
          { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label} *</label>
            <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder={placeholder} />
          </div>
        ))}

        {role === 'technician' || role === 'contractor' ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Role *</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="themed-input w-full py-2.5 px-4 text-sm outline-none">
                  <option value="technician">Technician</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Designation</label>
                <input type="text" value={form.designation || ''} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="e.g. Lead Tech" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <input type="text" value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="e.g. Electrical" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Salary / Rate</label>
                <input type="number" value={form.salary || ''} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                  className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="$ / hr" />
              </div>
            </div>
          </>
        ) : null}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Temporary Password *</label>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 pr-20 text-sm outline-none font-mono" placeholder="Min 6 characters" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button type="button" onClick={() => setShowPwd(s => !s)} className="p-1 text-gray-400 hover:text-bluelogo transition-all">
                <Icon icon={showPwd ? 'mdi:eye-off' : 'mdi:eye'} width={18} />
              </button>
              <button type="button" onClick={generatePassword} title="Auto-generate" className="p-1 text-gray-400 hover:text-bluelogo transition-all">
                <Icon icon="mdi:dice-multiple" width={18} />
              </button>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-bluelogo text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all hover:shadow-lg hover:shadow-bluelogo/30 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {saving && <Icon icon="mdi:loading" width={18} className="animate-spin" />}
          {saving ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </Modal>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const ManagerWorkers = () => {
  const { user, subscriptionStatus } = useAuth()
  const navigate = useNavigate()
  const orgId = user?.organization?._id || user?.organization
  const plan = subscriptionStatus?.plan
  const [workers, setWorkers] = useState([])
  const [submanagers, setSubmanagers] = useState([])
  const totalOrgUsers = (workers?.length || 0) + (submanagers?.length || 0) + 1
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [tab, setTab] = useState('workers')

  // Create modals
  const [showAddWorker, setShowAddWorker] = useState(false)
  const [showAddSub, setShowAddSub] = useState(false)

  // Credentials modal
  const [credsModal, setCredsModal] = useState(false)
  const [lastCreds, setLastCreds] = useState(null)

  const fetchData = async () => {
    if (!orgId) return
    try {
      const [wkRes, subRes] = await Promise.all([
        organizationAPI.getWorkers(orgId, { limit: 50 }),
        organizationAPI.getSubmanagers(orgId),
      ])
      setWorkers(wkRes.data.data?.workers || [])
      setSubmanagers(subRes.data.data || [])
    } catch { /* silent */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [orgId])

  const handleCreated = (creds) => {
    setLastCreds(creds)
    setCredsModal(true)
    fetchData()
    toast.success(`${creds.role === 'submanager' ? 'Sub-manager' : 'Worker'} created!`)
  }

  const handleRemoveWorker = async (workerId) => {
    if (!confirm('Remove this worker from your organization?')) return
    try { await organizationAPI.removeWorker(workerId); toast.success('Worker removed'); fetchData() }
    catch { toast.error('Failed to remove worker') }
  }

  const handleRemoveSub = async (userId) => {
    if (!confirm('Remove this sub-manager?')) return
    try { await organizationAPI.removeSubmanager(userId); toast.success('Sub-manager removed'); fetchData() }
    catch { toast.error('Failed to remove') }
  }

  const filteredWorkers = workers.filter(w =>
    (w.name?.toLowerCase().includes(search.toLowerCase()) || w.email?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? w.role === roleFilter : true)
  )
  const techCount = workers.filter(w => w.role === 'technician').length
  const contractorCount = workers.filter(w => w.role === 'contractor').length

  if (loading) return (
    <div className='w-full px-8 py-6'>
      <div className='animate-pulse space-y-6'>
        <div className='h-8 bg-gray-200 rounded w-1/4' />
        <div className='grid grid-cols-4 gap-4'>{[1,2,3,4].map(i => <div key={i} className='h-32 loading-skeleton' />)}</div>
      </div>
    </div>
  )

  return (
    <div className='w-full px-8 pb-8'>
      {/* Header */}
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Team Management</h1>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Manage workers and sub-managers</p>
          {plan && (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 w-32 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className={`h-full transition-all ${totalOrgUsers >= plan.maxUsers ? 'bg-red-500' : 'bg-bluelogo'}`}
                  style={{ width: `${Math.min((totalOrgUsers / plan.maxUsers) * 100, 100)}%` }} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${totalOrgUsers >= plan.maxUsers ? 'text-red-500' : 'text-gray-400'}`}>
                {totalOrgUsers} / {plan.maxUsers} Users
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <IconTextButton text="Add Worker" icon="mdi:account-plus" onClickHandler={() => setShowAddWorker(true)} />
          <IconTextButton text="Add Sub-Manager" icon="mdi:account-supervisor" onClickHandler={() => setShowAddSub(true)} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total Workers" count={workers.length} icon="mdi:account-group" message="All registered" iconColor="#2563EB" bgColor="rgba(37,99,235,0.1)" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="Technicians" count={techCount} icon="mdi:tools" message="Technical staff" iconColor="#F59E0B" bgColor="rgba(245,158,11,0.1)" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="Contractors" count={contractorCount} icon="mdi:briefcase-account" message="External" iconColor="#7C3AED" bgColor="rgba(124,58,237,0.1)" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Sub-Managers" count={submanagers.length} icon="mdi:account-supervisor" message="Supervisors" iconColor="#16A34A" bgColor="rgba(22,163,74,0.1)" /></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mt-8 border-b animate-fadeIn" style={{ borderColor: 'var(--border-secondary)' }}>
        {['workers', 'submanagers'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${tab === t ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
            {t === 'workers' ? `Workers (${workers.length})` : `Sub-Managers (${submanagers.length})`}
          </button>
        ))}
      </div>

      {/* Workers Tab */}
      {tab === 'workers' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6">
            <div className="relative flex-1">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={20} />
              <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search workers..."
                className="themed-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm" id="worker-search" />
            </div>
            <select className="themed-input px-4 py-2.5 rounded-xl text-sm outline-none" onChange={e => setRoleFilter(e.target.value)} id="worker-role-filter">
              <option value="">All Roles</option>
              <option value="technician">Technicians</option>
              <option value="contractor">Contractors</option>
            </select>
          </div>

          <div className='my-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredWorkers.length === 0 ? (
              <div className="col-span-full text-center py-20 animate-fadeIn" style={{ color: 'var(--text-tertiary)' }}>
                <Icon icon="mdi:account-off-outline" width={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">No workers found</p>
                <p className="text-sm opacity-60">Click "Add Worker" to create and invite a worker</p>
              </div>
            ) : filteredWorkers.map((w, idx) => (
              <div key={w._id} className="animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <WorkerCard worker={{
                  ...w,
                  status: w.workerDetails?.status || 'inactive',
                  statusColor: w.workerDetails?.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500',
                  phone: w.phoneNumber || 'Not set',
                  location: w.location || 'Not set',
                  activeJobs: 0, completed: 0, rating: '—',
                  skills: w.workerDetails?.skills?.map(s => s.name || s) || [],
                }} 
                onViewDetails={() => navigate(`/manager/workers/${w._id}`)}
                onRemove={() => handleRemoveWorker(w._id)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sub-Managers Tab */}
      {tab === 'submanagers' && (
        <div className='my-6 space-y-4'>
          {submanagers.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn" style={{ color: 'var(--text-tertiary)' }}>
              <Icon icon="mdi:account-supervisor-outline" width={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-bold">No sub-managers yet</p>
              <p className="text-sm opacity-60">Click "Add Sub-Manager" to create one</p>
            </div>
          ) : submanagers.map((sub, idx) => (
            <div key={sub._id}
              className="flex items-center justify-between themed-card border border-transparent hover:border-[var(--border-primary)] rounded-2xl px-6 py-5 hover:scale-[1.01] transition-all animate-slideUp"
              style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bluelogo/10 rounded-full flex items-center justify-center font-bold text-bluelogo text-lg">
                  {sub.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{sub.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sub.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 px-3 py-1 rounded-md border border-purple-500/20">Sub-Manager</span>
                <button onClick={() => handleRemoveSub(sub._id)} className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 p-1.5 rounded-lg hover:bg-red-500/10">
                  <Icon icon="mdi:delete-outline" width={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateUserModal isOpen={showAddWorker} onClose={() => setShowAddWorker(false)}
        title="Create New Worker" role="technician" onCreated={handleCreated} />
      <CreateUserModal isOpen={showAddSub} onClose={() => setShowAddSub(false)}
        title="Create Sub-Manager" role="submanager" onCreated={handleCreated} />
      <CredentialsModal isOpen={credsModal} onClose={() => setCredsModal(false)} credentials={lastCreds} />
    </div>
  )
}

export default ManagerWorkers
