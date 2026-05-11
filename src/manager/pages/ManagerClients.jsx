import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { clientAPI } from '../../api/services'
import Modal from '../../components/Modal'
import IconTextButton from '../../components/IconTextButton'
import toast from 'react-hot-toast'

const ManagerClients = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', notes: '' });
  const [expandedClient, setExpandedClient] = useState(null);
  const [showAddLocation, setShowAddLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({ address: '', city: '', state: '', postalCode: '' });

  const fetchClients = async () => {
    if (!orgId) return;
    try {
      const res = await clientAPI.getByOrganization(orgId);
      setClients(res.data.data.clients || []);
    } catch (err) { /* silent */ }
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

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    try {
      await clientAPI.delete(id);
      toast.success('Client deleted');
      fetchClients();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleAddLocation = async (clientId) => {
    if (!locationForm.address || !locationForm.city || !locationForm.state || !locationForm.postalCode) {
      toast.error('All location fields are required'); return;
    }
    try {
      await clientAPI.addLocation(clientId, locationForm);
      toast.success('Location added!');
      setShowAddLocation(null);
      setLocationForm({ address: '', city: '', state: '', postalCode: '' });
      fetchClients();
    } catch (err) { toast.error('Failed to add location'); }
  };

  const handleRemoveLocation = async (clientId, locId) => {
    try {
      await clientAPI.removeLocation(clientId, locId);
      toast.success('Location removed');
      fetchClients();
    } catch (err) { toast.error('Failed'); }
  };

  const filtered = clients.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className='w-full px-8 py-6'><div className='space-y-4'>{[1, 2, 3].map(i => <div key={i} className='h-24 loading-skeleton' />)}</div></div>;
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold'>Clients</h1>
          <p className='text-sm text-gray-500'>Manage your client base</p>
        </div>
        <IconTextButton text="Add Client" icon="mdi:account-plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="flex items-center gap-3 mb-4 animate-fadeIn">
        <div className="bg-bluelogo/10 p-3 rounded-xl"><Icon icon="mdi:account-group" width={24} className="text-bluelogo" /></div>
        <div><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{clients.length}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Clients</p></div>
      </div>

      <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search clients..."
        className="themed-input w-full px-3 py-2 rounded-lg text-sm focus:outline-none mb-4" id="client-search" />

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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Locations</p>
                  <button onClick={() => setShowAddLocation(c._id)} className="text-xs text-bluelogo hover:underline flex items-center gap-1">
                    <Icon icon="mdi:plus" width={14} /> Add Location
                  </button>
                </div>
                {c.locations?.length > 0 ? c.locations.map(loc => (
                  <div key={loc._id} className="flex items-center justify-between themed-card rounded-lg px-3 py-2 mb-1 border" style={{ borderColor: 'var(--border-secondary)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{loc.address}, {loc.city}, {loc.state} {loc.postalCode}</p>
                    <button onClick={() => handleRemoveLocation(c._id, loc._id)} className="text-gray-400 hover:text-red-500"><Icon icon="mdi:close" width={14} /></button>
                  </div>
                )) : <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No locations added</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleDelete(c._id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Icon icon="mdi:trash-can-outline" width={14} /> Delete Client
                  </button>
                </div>
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
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="client-name" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="client-email" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
            <input type="text" value={form.phoneNumber} onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="client-phone" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none resize-none" id="client-notes" />
          </div>
          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="client-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Add Client'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={!!showAddLocation} onClose={() => setShowAddLocation(null)} title="Add Location" size="sm">
        <div className="space-y-3">
          <input type="text" placeholder="Address" value={locationForm.address} onChange={(e) => setLocationForm(f => ({ ...f, address: e.target.value }))}
            className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="loc-address" />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="City" value={locationForm.city} onChange={(e) => setLocationForm(f => ({ ...f, city: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="loc-city" />
            <input type="text" placeholder="State" value={locationForm.state} onChange={(e) => setLocationForm(f => ({ ...f, state: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="loc-state" />
          </div>
          <input type="text" placeholder="Postal Code" value={locationForm.postalCode} onChange={(e) => setLocationForm(f => ({ ...f, postalCode: e.target.value }))}
            className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="loc-postal" />
          <button onClick={() => handleAddLocation(showAddLocation)}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg" id="loc-submit">
            Add Location
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ManagerClients
