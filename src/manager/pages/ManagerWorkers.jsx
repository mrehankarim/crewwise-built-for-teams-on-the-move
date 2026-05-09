import { useState, useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WorkerCard from '../../components/WorkerCard'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { organizationAPI } from '../../api/services'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const ManagerWorkers = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [workers, setWorkers] = useState([]);
  const [submanagers, setSubmanagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [addForm, setAddForm] = useState({ workerId: '', designatedManagerId: '' });
  const [subForm, setSubForm] = useState({ userId: '' });
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState('workers');

  const fetchData = async () => {
    if (!orgId) return;
    try {
      const [wkRes, subRes] = await Promise.all([
        organizationAPI.getWorkers(orgId, { limit: 50 }),
        organizationAPI.getSubmanagers(orgId),
      ]);
      setWorkers(wkRes.data.data?.workers || []);
      setSubmanagers(subRes.data.data || []);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [orgId]);

  const filteredWorkers = workers.filter(w =>
    (w.name?.toLowerCase().includes(search.toLowerCase()) || w.email?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? w.role === roleFilter : true)
  );

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!addForm.workerId) { toast.error('Worker ID is required'); return; }
    setAdding(true);
    try {
      await organizationAPI.addWorker(addForm);
      toast.success('Worker added!');
      setShowAddWorker(false);
      setAddForm({ workerId: '', designatedManagerId: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setAdding(false); }
  };

  const handleAddSub = async (e) => {
    e.preventDefault();
    if (!subForm.userId) { toast.error('User ID is required'); return; }
    setAdding(true);
    try {
      await organizationAPI.addSubmanager(subForm.userId);
      toast.success('Sub-manager added!');
      setShowAddSub(false);
      setSubForm({ userId: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setAdding(false); }
  };

  const handleRemoveWorker = async (workerId) => {
    if (!confirm('Remove this worker?')) return;
    try {
      await organizationAPI.removeWorker(workerId);
      toast.success('Worker removed');
      fetchData();
    } catch (err) { toast.error('Failed to remove'); }
  };

  const handleRemoveSub = async (userId) => {
    if (!confirm('Remove this sub-manager?')) return;
    try {
      await organizationAPI.removeSubmanager(userId);
      toast.success('Sub-manager removed');
      fetchData();
    } catch (err) { toast.error('Failed to remove'); }
  };

  const techCount = workers.filter(w => w.role === 'technician').length;
  const contractorCount = workers.filter(w => w.role === 'contractor').length;
  const activeCount = workers.filter(w => w.workerDetails?.status === 'active').length;

  if (loading) {
    return (
      <div className='w-full px-8 py-6'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 bg-gray-200 rounded w-1/4' />
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map(i => <div key={i} className='h-32 loading-skeleton' />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold'>Team Management</h1>
          <p className='text-sm text-gray-500'>Manage workers and sub-managers</p>
        </div>
        <div className="flex gap-2">
          <IconTextButton text="Add Worker" icon="mdi:account-plus" onClickHandler={() => setShowAddWorker(true)} />
          <IconTextButton text="Add Sub-Manager" icon="mdi:account-supervisor" onClickHandler={() => setShowAddSub(true)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total Workers" count={workers.length} icon="mdi:account-group" message="All registered" iconColor="#2563EB" bgColor="#DBEAFE" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="Technicians" count={techCount} icon="mdi:tools" message="Technical staff" iconColor="#F59E0B" bgColor="#FEF3C7" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="Contractors" count={contractorCount} icon="mdi:briefcase-account" message="External" iconColor="#7C3AED" bgColor="#EDE9FE" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Sub-Managers" count={submanagers.length} icon="mdi:account-supervisor" message="Supervisors" iconColor="#16A34A" bgColor="#DCFCE7" /></div>
      </div>

      <div className="flex gap-3 mt-6 border-b border-gray-200 animate-fadeIn">
        <button onClick={() => setTab('workers')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'workers' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Workers ({workers.length})
        </button>
        <button onClick={() => setTab('submanagers')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${tab === 'submanagers' ? 'border-bluelogo text-bluelogo' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Sub-Managers ({submanagers.length})
        </button>
      </div>

      {tab === 'workers' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-4">
            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search workers..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bluelogo/30" id="worker-search" />
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" onChange={(e) => setRoleFilter(e.target.value)} id="worker-role-filter">
              <option value="">All Roles</option>
              <option value="technician">Technicians</option>
              <option value="contractor">Contractors</option>
            </select>
          </div>
          <div className='my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredWorkers.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 animate-fadeIn">
                <Icon icon="mdi:account-off-outline" width={48} className="mx-auto mb-3" />
                <p className="font-medium">No workers found</p>
                <p className="text-sm">Add workers by their User ID after they register</p>
              </div>
            ) : filteredWorkers.map((w, idx) => (
              <div key={w._id} className="animate-slideUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <WorkerCard worker={{
                  ...w,
                  status: w.workerDetails?.status || 'inactive',
                  statusColor: w.workerDetails?.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600',
                  email: w.email,
                  phone: w.phoneNumber || 'Not set',
                  location: w.location || 'Not set',
                  activeJobs: 0,
                  completed: 0,
                  rating: '-',
                  skills: w.workerDetails?.skills?.map(s => s.name || s) || [],
                }} onRemove={() => handleRemoveWorker(w._id)} />
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'submanagers' && (
        <div className='my-4 space-y-3'>
          {submanagers.length === 0 ? (
            <div className="text-center py-16 text-gray-400 animate-fadeIn">
              <Icon icon="mdi:account-supervisor-outline" width={48} className="mx-auto mb-3" />
              <p className="font-medium">No sub-managers yet</p>
              <p className="text-sm">Add sub-managers by their User ID</p>
            </div>
          ) : submanagers.map((sub, idx) => (
            <div key={sub._id} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-all animate-slideUp"
              style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-bluelogo/10 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:account" width={22} className="text-bluelogo" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{sub.name}</p>
                  <p className="text-xs text-gray-500">{sub.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md font-medium">Sub-Manager</span>
                <button onClick={() => handleRemoveSub(sub._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Icon icon="mdi:close-circle-outline" width={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAddWorker} onClose={() => setShowAddWorker(false)} title="Add Worker" size="sm">
        <form onSubmit={handleAddWorker} className="space-y-4">
          <p className="text-sm text-gray-500">Workers must register first. Enter their User ID to add them.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Worker User ID *</label>
            <input type="text" value={addForm.workerId} onChange={(e) => setAddForm(f => ({ ...f, workerId: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" placeholder="Paste worker's User ID" id="add-worker-id" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Assign to Manager <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" value={addForm.designatedManagerId} onChange={(e) => setAddForm(f => ({ ...f, designatedManagerId: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" placeholder="Manager/Sub-manager User ID" id="add-worker-manager" />
          </div>
          <button type="submit" disabled={adding}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="add-worker-submit">
            {adding && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {adding ? 'Adding...' : 'Add Worker'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={showAddSub} onClose={() => setShowAddSub(false)} title="Add Sub-Manager" size="sm">
        <form onSubmit={handleAddSub} className="space-y-4">
          <p className="text-sm text-gray-500">Sub-managers must register with the "Sub-Manager" role first.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-Manager User ID *</label>
            <input type="text" value={subForm.userId} onChange={(e) => setSubForm(f => ({ ...f, userId: e.target.value }))}
              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" placeholder="Paste sub-manager's User ID" id="add-sub-id" />
          </div>
          <button type="submit" disabled={adding}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="add-sub-submit">
            {adding && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {adding ? 'Adding...' : 'Add Sub-Manager'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default ManagerWorkers
