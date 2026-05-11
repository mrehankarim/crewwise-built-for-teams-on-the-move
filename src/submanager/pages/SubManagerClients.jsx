import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { clientAPI } from '../../api/services'
import Modal from '../../components/Modal'
import IconTextButton from '../../components/IconTextButton'
import toast from 'react-hot-toast'

const SubManagerClients = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', notes: '' });
  const [expandedClient, setExpandedClient] = useState(null);

  const fetchClients = async () => {
    if (!orgId) return;
    try {
      const res = await clientAPI.getByOrganization(orgId);
      setClients(res.data.data?.clients || []);
    } catch (err) { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phoneNumber) { toast.error('Name, email, and phone are required'); return; }
    setCreating(true);
    try {
      await clientAPI.create({ ...form, organization: orgId });
      toast.success('Client created!');
      setShowCreate(false);
      setForm({ name: '', email: '', phoneNumber: '', notes: '' });
      fetchClients();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className='w-full px-8 py-6'><div className='space-y-4'>{[1, 2, 3].map(i => <div key={i} className='h-24 loading-skeleton' />)}</div></div>;
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Clients</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>View and manage clients</p>
        </div>
        <IconTextButton text="Add Client" icon="mdi:account-plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="flex items-center gap-3 mb-4 animate-fadeIn">
        <div className="bg-bluelogo/10 p-3 rounded-xl"><Icon icon="mdi:account-group" width={24} className="text-bluelogo" /></div>
        <div><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{clients.length}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Clients</p></div>
      </div>

      <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search clients..."
        className="themed-input w-full px-3 py-2 rounded-lg text-sm focus:outline-none mb-4" id="sub-client-search" />

      <div className='space-y-3'>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            <Icon icon="mdi:account-off" width={48} className="mx-auto mb-3" />
            <p className="font-medium">No clients found</p>
          </div>
        ) : filtered.map((c, idx) => (
          <div key={c._id} className="themed-card border overflow-hidden transition-all duration-300 hover:shadow-md animate-slideUp" style={{ animationDelay: `${idx * 0.05}s`, borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onClick={() => setExpandedClient(expandedClient === c._id ? null : c._id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-bluelogo to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.locations?.length || 0} locations</span>
                <Icon icon={expandedClient === c._id ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>
            {expandedClient === c._id && (
              <div className="border-t px-5 py-4 animate-slideDown" style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-4 text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1"><Icon icon="mdi:phone" width={14} />{c.phoneNumber}</div>
                  {c.notes && <div className="flex items-center gap-1"><Icon icon="mdi:note-text" width={14} />{c.notes}</div>}
                </div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Locations</p>
                {c.locations?.length > 0 ? c.locations.map(loc => (
                  <div key={loc._id} className="themed-card rounded-lg px-3 py-2 mb-1 border" style={{ borderColor: 'var(--border-secondary)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}, {loc.city}, {loc.state} {loc.postalCode}</p>
                  </div>
                )) : <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No locations added</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Client" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="sub-client-name" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="sub-client-email" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
            <input type="text" value={form.phoneNumber} onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="sub-client-phone" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none resize-none" id="sub-client-notes" />
          </div>
          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="sub-client-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Add Client'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default SubManagerClients
