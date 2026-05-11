import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { workOrderAPI, clientAPI, organizationAPI, inventoryAPI } from '../../api/services'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const statusStyles = {
  'created': { bg: 'bg-gray-50', text: 'text-gray-500' },
  'assigned': { bg: 'bg-blue-50', text: 'text-blue-500' },
  'in_progress': { bg: 'bg-indigo-50', text: 'text-indigo-500' },
  'completed': { bg: 'bg-green-50', text: 'text-green-500' },
  'cancelled': { bg: 'bg-red-50', text: 'text-red-500' },
}
const priorityStyles = {
  'regular': { bg: 'bg-green-50', text: 'text-green-500' },
  'urgent': { bg: 'bg-orange-50', text: 'text-orange-500' },
  'emergency': { bg: 'bg-red-50', text: 'text-red-500' },
}

/* ─── Manage Parts Modal ─────────────────────────────────────────────────── */
const ManagePartsModal = ({ isOpen, onClose, workOrder, onUpdated, orgId }) => {
  const [inventory, setInventory] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && orgId) {
      inventoryAPI.getByOrganization(orgId).then(res => setInventory(res.data.data?.inventory || []))
    }
  }, [isOpen, orgId])

  const handleAddPart = async () => {
    if (!selectedItem || quantity < 1) return toast.error('Select item and valid quantity')
    setLoading(true)
    try {
      await workOrderAPI.addPart(workOrder._id, { inventoryItemId: selectedItem, quantity })
      toast.success('Part added')
      onUpdated()
      setSelectedItem('')
      setQuantity(1)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add part') }
    finally { setLoading(false) }
  }

  const handleRemovePart = async (itemId) => {
    try {
      await workOrderAPI.removePart(workOrder._id, itemId)
      toast.success('Part removed')
      onUpdated()
    } catch (err) { toast.error('Failed to remove part') }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Parts: ${workOrder?.title}`} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Current Parts</label>
          {workOrder?.parts?.length === 0 ? (
            <p className="text-sm italic text-gray-400">No parts assigned.</p>
          ) : (
            <div className="space-y-2">
              {workOrder?.parts?.map(p => (
                <div key={p._id} className="flex items-center justify-between p-2 rounded-lg border themed-card" style={{ borderColor: 'var(--border-secondary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.inventoryItem?.name || 'Unknown'}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Qty: {p.quantity}</p>
                  </div>
                  <button onClick={() => handleRemovePart(p.inventoryItem?._id || p.inventoryItem)} className="text-red-400 hover:text-red-500 p-1">
                    <Icon icon="mdi:close-circle-outline" width={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <hr className="border-gray-100" style={{ borderColor: 'var(--border-secondary)' }} />
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Add Part</label>
          <div className="flex gap-2">
            <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="themed-input flex-1 py-2 px-3 text-sm outline-none">
              <option value="">Select Item</option>
              {inventory.map(item => <option key={item._id} value={item._id}>{item.name} ({item.quantity} in stock)</option>)}
            </select>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="themed-input w-20 py-2 px-3 text-sm outline-none" />
            <button onClick={handleAddPart} disabled={loading || !selectedItem} className="bg-bluelogo text-white px-3 py-2 rounded-xl text-sm font-bold disabled:opacity-50">
              {loading ? <Icon icon="mdi:loading" className="animate-spin" /> : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
const ManagerWorkOrders = () => {
  const { user, subscriptionStatus } = useAuth();
  const navigate = useNavigate();
  const orgId = user?.organization?._id || user?.organization;
  const plan = subscriptionStatus?.plan;
  const [workOrders, setWorkOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [clients, setClients] = useState([]);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, created: 0 });
  const [form, setForm] = useState({
    title: '', category: '', priority: 'regular', client: '',
  });


  const [partsModalOpen, setPartsModalOpen] = useState(false);
  const [selectedWO, setSelectedWO] = useState(null);

  const fetchWorkOrders = async () => {
    if (!orgId) return;
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const res = await workOrderAPI.getByOrganization(orgId, params);
      setWorkOrders(res.data.data?.workOrders || []);
      setStats({
        total: res.data.data?.total || 0,
        inProgress: (res.data.data?.workOrders || []).filter(w => w.status === 'in_progress').length,
        completed: (res.data.data?.workOrders || []).filter(w => w.status === 'completed').length,
        created: (res.data.data?.workOrders || []).filter(w => w.status === 'created').length,
      });
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  const fetchWorkers = async () => {
    if (!orgId) return;
    try {
      const res = await organizationAPI.getWorkers(orgId, { limit: 100 })
      setWorkers(res.data.data?.workers || [])
    } catch { /* silent */ }
  }

  useEffect(() => { fetchWorkOrders(); }, [orgId, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!orgId) return;
    clientAPI.getByOrganization(orgId).then(res => setClients(res.data.data?.clients || [])).catch(() => {});
    fetchWorkers()
  }, [orgId]);

  const filtered = workOrders.filter(wo =>
    wo.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.client) {
      toast.error('Please fill all required fields');
      return;
    }
    setCreating(true);
    try {
      await workOrderAPI.create({
        ...form,
        clientId: form.client,
        organization: orgId,
      });
      toast.success('Work order created!');
      setShowCreate(false);
      setForm({ title: '', category: '', priority: 'regular', client: '' });
      fetchWorkOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally { setCreating(false); }
  };

  const handleStatusChange = async (woId, newStatus) => {
    try {
      await workOrderAPI.updateStatus(woId, newStatus);
      toast.success('Status updated');
      fetchWorkOrders();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const handleDelete = async (woId) => {
    if (!confirm('Are you sure?')) return;
    try {
      await workOrderAPI.delete(woId);
      toast.success('Work order deleted');
      fetchWorkOrders();
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) {
    return (
      <div className='w-full px-8 py-6'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 bg-gray-200 rounded w-1/3' />
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map(i => <div key={i} className='h-32 loading-skeleton' />)}
          </div>
          <div className='space-y-3'>
            {[1, 2, 3].map(i => <div key={i} className='h-20 loading-skeleton' />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Work Orders</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Manage and track all work orders</p>
          {plan && (
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div 
                  className={`h-full transition-all ${stats.total >= plan.maxWorkOrders ? 'bg-red-500' : 'bg-bluelogo'}`}
                  style={{ width: `${Math.min((stats.total / plan.maxWorkOrders) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${stats.total >= plan.maxWorkOrders ? 'text-red-500' : 'text-gray-400'}`}>
                {stats.total} / {plan.maxWorkOrders} Work Orders
              </span>
            </div>
          )}
        </div>
        <IconTextButton text={"Create Work Order"} icon="mdi:plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total" count={stats.total} icon="akar-icons:clipboard" message="All orders" iconColor="#2563EB" bgColor="rgba(37,99,235,0.1)" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="In Progress" count={stats.inProgress} icon="mdi:progress-clock" message="Currently active" iconColor="#7C3AED" bgColor="rgba(124,58,237,0.1)" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="New" count={stats.created} icon="mdi:clock-outline" message="Waiting to start" iconColor="#F59E0B" bgColor="rgba(245,158,11,0.1)" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Completed" count={stats.completed} icon="mdi:check-circle-outline" message="Finished" iconColor="#16A34A" bgColor="rgba(22,163,74,0.1)" /></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6 animate-fadeIn">
        <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search work orders..."
          className="themed-input w-full px-3 py-2 rounded-lg text-sm focus:outline-none" id="wo-search" />
        <div className="flex gap-2">
          <select className="themed-input px-3 py-2 rounded-lg text-sm" onChange={(e) => setStatusFilter(e.target.value)} id="wo-status-filter">
            <option value="">All Status</option>
            <option value="created">Created</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="themed-input px-3 py-2 rounded-lg text-sm" onChange={(e) => setPriorityFilter(e.target.value)} id="wo-priority-filter">
            <option value="">All Priority</option>
            <option value="regular">Regular</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      <div className='pt-4 space-y-3'>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            <Icon icon="mdi:clipboard-text-off-outline" width={48} className="mx-auto mb-3" />
            <p className="font-medium">No work orders found</p>
            <p className="text-sm">Create your first work order to get started</p>
          </div>
        ) : filtered.map((wo, idx) => (
          <div key={wo._id}
            className="flex items-start justify-between border rounded-xl px-4 py-4 cursor-pointer
            hover:shadow-md transition-all duration-300 themed-card hover:border-bluelogo/50 animate-slideUp"
            style={{ animationDelay: `${idx * 0.05}s`, borderColor: 'var(--border-primary)' }}
            onClick={() => navigate(`/manager/work-orders/${wo._id}`)}>
            <div className='flex flex-col gap-2 w-full'>
              <div className='flex items-center justify-between flex-wrap gap-2'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>{wo.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[wo.status]?.bg || 'bg-gray-100'} ${statusStyles[wo.status]?.text || 'text-gray-600'}`}>
                    {wo.status?.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityStyles[wo.priority]?.bg || 'bg-gray-100'} ${priorityStyles[wo.priority]?.text || 'text-gray-600'}`}>
                    {wo.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setSelectedWO(wo); setPartsModalOpen(true); }} className="text-bluelogo hover:bg-bluelogo/10 px-2 py-1 rounded-md transition-colors text-xs font-semibold flex items-center gap-1">
                    <Icon icon="mdi:toolbox-outline" /> Parts ({wo.parts?.length || 0})
                  </button>
                  <select value={wo.status} onChange={(e) => handleStatusChange(wo._id, e.target.value)}
                    className="text-xs border rounded-md px-2 py-1 themed-input" style={{ borderColor: 'var(--border-secondary)' }}>
                    <option value="created">Created</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button onClick={() => handleDelete(wo._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                    <Icon icon="mdi:trash-can-outline" width={16} />
                  </button>
                </div>
              </div>
              <div className='flex flex-wrap items-center gap-4 text-gray-400'>
                <div className='flex items-center gap-1'>
                  <Icon icon="mdi:tag-outline" width={14} />
                  <span className='text-xs'>{wo.category}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Icon icon="mdi:account-outline" width={14} />
                  <span className='text-xs'>{wo.client?.name || 'No client'}</span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Work Order" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="Work order title" id="wo-title" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Category *</label>
            <input type="text" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="e.g. Electrical, Plumbing" id="wo-category" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Client *</label>
            <select value={form.client} onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="wo-client">
              <option value="">Select client</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Priority</label>
            <select value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="wo-priority">
              <option value="regular">Regular</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" id="wo-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Create Work Order'}
          </button>
        </form>
      </Modal>

      <ManagePartsModal
        isOpen={partsModalOpen}
        onClose={() => setPartsModalOpen(false)}
        workOrder={selectedWO}
        onUpdated={() => {
          fetchWorkOrders()
          if (selectedWO) {
            workOrderAPI.getById(selectedWO._id).then(res => setSelectedWO(res.data.data))
          }
        }}
        orgId={orgId}
      />

    </div>
  )
}

export default ManagerWorkOrders
