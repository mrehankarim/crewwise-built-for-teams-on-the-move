import { useState, useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { workOrderAPI, clientAPI } from '../../api/services'
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

const SubManagerWorkOrders = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [clients, setClients] = useState([]);
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, completed: 0, created: 0 });
  const [form, setForm] = useState({
    title: '', category: '', priority: 'regular', client: '', startTime: '', endTime: '',
  });

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
    } catch (err) { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkOrders(); }, [orgId, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!orgId) return;
    clientAPI.getByOrganization(orgId).then(res => setClients(res.data.data || [])).catch(() => {});
  }, [orgId]);

  const filtered = workOrders.filter(wo =>
    wo.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.client || !form.startTime || !form.endTime) {
      toast.error('Please fill all required fields');
      return;
    }
    setCreating(true);
    try {
      await workOrderAPI.create({
        ...form,
        organization: orgId,
      });
      toast.success('Work order created!');
      setShowCreate(false);
      setForm({ title: '', category: '', priority: 'regular', client: '', startTime: '', endTime: '' });
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
          <h1 className='text-2xl font-bold'>Work Orders</h1>
          <p className='text-sm text-gray-500'>Manage and track work orders</p>
        </div>
        <IconTextButton text={"Create Work Order"} icon="mdi:plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total" count={stats.total} icon="akar-icons:clipboard" message="All orders" iconColor="#2563EB" bgColor="#DBEAFE" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="In Progress" count={stats.inProgress} icon="mdi:progress-clock" message="Currently active" iconColor="#7C3AED" bgColor="#EDE9FE" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="New" count={stats.created} icon="mdi:clock-outline" message="Waiting to start" iconColor="#F59E0B" bgColor="#FEF3C7" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Completed" count={stats.completed} icon="mdi:check-circle-outline" message="Finished" iconColor="#16A34A" bgColor="#DCFCE7" /></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6 animate-fadeIn">
        <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search work orders..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-wo-search" />
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" onChange={(e) => setStatusFilter(e.target.value)} id="sub-wo-status">
            <option value="">All Status</option>
            <option value="created">Created</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" onChange={(e) => setPriorityFilter(e.target.value)} id="sub-wo-priority">
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
          <div key={wo._id} className="flex items-start justify-between border border-gray-200 rounded-xl px-4 py-4
            hover:shadow-md transition-all duration-300 hover:bg-gray-50/50 bg-white animate-slideUp"
            style={{ animationDelay: `${idx * 0.05}s` }}>
            <div className='flex flex-col gap-2 w-full'>
              <div className='flex items-center justify-between flex-wrap gap-2'>
                <div className='flex items-center gap-2 flex-wrap'>
                  <p className='text-sm font-semibold text-gray-800'>{wo.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[wo.status]?.bg || 'bg-gray-100'} ${statusStyles[wo.status]?.text || 'text-gray-600'}`}>
                    {wo.status?.replace('_', ' ')}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityStyles[wo.priority]?.bg || 'bg-gray-100'} ${priorityStyles[wo.priority]?.text || 'text-gray-600'}`}>
                    {wo.priority}
                  </span>
                </div>
                <select value={wo.status} onChange={(e) => handleStatusChange(wo._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white">
                  <option value="created">Created</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                <div className='flex items-center gap-1'>
                  <Icon icon="mdi:calendar-outline" width={14} />
                  <span className='text-xs'>{wo.startTime ? new Date(wo.startTime).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Work Order" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" placeholder="Work order title" id="sub-wo-title" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <input type="text" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" placeholder="e.g. Electrical, Plumbing" id="sub-wo-category" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client *</label>
            <select value={form.client} onChange={(e) => setForm(f => ({ ...f, client: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-wo-client">
              <option value="">Select client</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-wo-priority-sel">
              <option value="regular">Regular</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time *</label>
              <input type="datetime-local" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))}
                className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-wo-start" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Time *</label>
              <input type="datetime-local" value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))}
                className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-wo-end" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2" id="sub-wo-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Create Work Order'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default SubManagerWorkOrders
