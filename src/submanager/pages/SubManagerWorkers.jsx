import { useState, useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import WorkerCard from '../../components/WorkerCard'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { organizationAPI } from '../../api/services'

const SubManagerWorkers = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    if (!orgId) return;
    const fetchData = async () => {
      try {
        const res = await organizationAPI.getWorkers(orgId, { limit: 50 });
        setWorkers(res.data.data?.workers || []);
      } catch (err) { }
      finally { setLoading(false); }
    };
    fetchData();
  }, [orgId]);

  const filteredWorkers = workers.filter(w =>
    (w.name?.toLowerCase().includes(search.toLowerCase()) || w.email?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? w.role === roleFilter : true)
  );

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
          <h1 className='text-2xl font-bold'>Workers</h1>
          <p className='text-sm text-gray-500'>View and manage assigned workers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total Workers" count={workers.length} icon="mdi:account-group" message="All registered" iconColor="#2563EB" bgColor="#DBEAFE" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="Technicians" count={techCount} icon="mdi:tools" message="Technical staff" iconColor="#F59E0B" bgColor="#FEF3C7" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="Contractors" count={contractorCount} icon="mdi:briefcase-account" message="External" iconColor="#7C3AED" bgColor="#EDE9FE" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Active" count={activeCount} icon="mdi:account-check" message="Working now" iconColor="#16A34A" bgColor="#DCFCE7" /></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6">
        <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search workers..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-worker-search" />
        <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" onChange={(e) => setRoleFilter(e.target.value)} id="sub-worker-role">
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
            <p className="text-sm">Workers are managed by the organization manager</p>
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
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubManagerWorkers
