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
      setClients(res.data.data || []);
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
          <h1 className='text-2xl font-bold'>Clients</h1>
          <p className='text-sm text-gray-500'>View and manage clients</p>
        </div>
        <IconTextButton text="Add Client" icon="mdi:account-plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="flex items-center gap-3 mb-4 animate-fadeIn">
        <div className="bg-bluelogo/10 p-3 rounded-xl"><Icon icon="mdi:account-group" width={24} className="text-bluelogo" /></div>
        <div><p className="text-2xl font-bold text-gray-900">{clients.length}</p><p className="text-xs text-gray-500">Total Clients</p></div>
      </div>

      <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search clients..."
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bluelogo/30 mb-4" id="sub-client-search" />

      <div className='space-y-3'>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            <Icon icon="mdi:account-off" width={48} className="mx-auto mb-3" />
            <p className="font-medium">No clients found</p>
          </div>
        ) : filtered.map((c, idx) => (
          <div key={c._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer" onClick={() => setExpandedClient(expandedClient === c._id ? null : c._id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-bluelogo to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {c.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{c.locations?.length || 0} locations</span>
                <Icon icon={expandedClient === c._id ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} className="text-gray-400" />
              </div>
            </div>
            {expandedClient === c._id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50 animate-slideDown">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1"><Icon icon="mdi:phone" width={14} />{c.phoneNumber}</div>
                  {c.notes && <div className="flex items-center gap-1"><Icon icon="mdi:note-text" width={14} />{c.notes}</div>}
                </div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Locations</p>
                {c.locations?.length > 0 ? c.locations.map(loc => (
                  <div key={loc._id} className="bg-white rounded-lg px-3 py-2 mb-1 border border-gray-100">
                    <p className="text-xs text-gray-600">{loc.address}, {loc.city}, {loc.state} {loc.postalCode}</p>
                  </div>
                )) : <p className="text-xs text-gray-400">No locations added</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Client" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-client-name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-client-email" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
            <input type="text" value={form.phoneNumber} onChange={(e) => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-client-phone" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} rows={2}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30 resize-none" id="sub-client-notes" />
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
