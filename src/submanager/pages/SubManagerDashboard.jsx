import { useState, useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WeeklyPerformanceChart from '../../components/ui/WeeklyPerformanceChart'
import ActiveWorkers from '../../components/ui/ActiveWorkers'
import RecentWorkOrders from '../../components/ui/RecentWorkOrders'
import { useAuth } from '../../context/AuthContext'
import { organizationAPI } from '../../api/services'

const SubManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const orgId = user?.organization?._id || user?.organization;

  useEffect(() => {
    if (!orgId) return;
    const fetchData = async () => {
      try {
        const [dashRes, woRes, wkRes] = await Promise.all([
          organizationAPI.getDashboard(orgId),
          organizationAPI.getWorkOrders(orgId, { limit: 5 }),
          organizationAPI.getWorkers(orgId, { limit: 5 }),
        ]);
        setStats(dashRes.data.data);
        const rawOrders = woRes.data.data?.workOrders || [];
        setWorkOrders(rawOrders.map(wo => ({
          id: wo._id,
          title: wo.title,
          description: wo.category,
          status: wo.status?.replace('_', '-'),
          priority: wo.priority,
          assignee: wo.createdBy?.name || 'Unassigned',
          location: wo.client?.name || 'N/A',
          dueDate: wo.endTime ? new Date(wo.endTime).toLocaleDateString() : 'N/A',
          estimatedTime: wo.category,
        })));
        const rawWorkers = wkRes.data.data?.workers || [];
        setWorkers(rawWorkers.map(w => ({
          id: w._id,
          name: w.name,
          location: w.location || 'Not set',
          tasks: 0,
          status: w.workerDetails?.status === 'active' ? 'On Site' : w.workerDetails?.status === 'on_leave' ? 'On Leave' : 'Available',
        })));
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  const chartData = [
    { day: 'Mon', completed: stats?.workOrders?.completed || 0, assigned: stats?.workOrders?.assigned || 0 },
    { day: 'Tue', completed: Math.floor(Math.random() * 10) + 5, assigned: Math.floor(Math.random() * 10) + 8 },
    { day: 'Wed', completed: Math.floor(Math.random() * 10) + 5, assigned: Math.floor(Math.random() * 10) + 8 },
    { day: 'Thu', completed: Math.floor(Math.random() * 10) + 5, assigned: Math.floor(Math.random() * 10) + 8 },
    { day: 'Fri', completed: Math.floor(Math.random() * 10) + 5, assigned: Math.floor(Math.random() * 10) + 8 },
    { day: 'Sat', completed: Math.floor(Math.random() * 5), assigned: Math.floor(Math.random() * 5) + 2 },
    { day: 'Sun', completed: Math.floor(Math.random() * 3), assigned: Math.floor(Math.random() * 3) + 1 },
  ];

  if (loading) {
    return (
      <div className='w-full px-8 py-6'>
        <div className='animate-pulse space-y-6'>
          <div className='h-8 bg-gray-200 rounded w-1/3' />
          <div className='grid grid-cols-4 gap-4'>
            {[1, 2, 3, 4].map(i => <div key={i} className='h-32 loading-skeleton' />)}
          </div>
          <div className='flex gap-6'>
            <div className='w-2/3 h-80 loading-skeleton' />
            <div className='w-1/3 h-80 loading-skeleton' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Sub-Manager Dashboard</h1>
          <p className='text-sm text-gray-500'>{user?.organization?.name || 'Your Organization'}</p>
        </div>
        <div>
          <IconTextButton text={"Create Work Order"} icon="akar-icons:clipboard" onClickHandler={() => window.location.href = '/submanager/work-orders'} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1">
          <SummaryCard name="Total Work Orders" count={stats?.workOrders?.total || 0} icon="akar-icons:clipboard" message={`${stats?.workOrders?.inProgress || 0} in progress`} iconColor="#2262C2" bgColor="#BAD2F0" />
        </div>
        <div className="animate-slideUp stagger-2">
          <SummaryCard name="Field Workers" count={stats?.team?.totalWorkers || 0} icon="fluent:people-12-regular" message={`${stats?.team?.technicians || 0} technicians`} iconColor="#367B43" bgColor="#C3EFCF" />
        </div>
        <div className="animate-slideUp stagger-3">
          <SummaryCard name="Pending Tasks" count={stats?.workOrders?.created || 0} icon="akar-icons:clock" message={`${stats?.workOrders?.assigned || 0} assigned`} iconColor="#9E3333" bgColor="#F0D6CE" />
        </div>
        <div className="animate-slideUp stagger-4">
          <SummaryCard name="Completed" count={stats?.workOrders?.completed || 0} icon="lets-icons:done-ring-round" message={stats?.workOrders?.total ? `${Math.round((stats.workOrders.completed / stats.workOrders.total) * 100)}% rate` : '0% rate'} iconColor="#367B43" bgColor="#C3EFCF" />
        </div>
      </div>

      <div className='pt-6 flex flex-col lg:flex-row gap-6'>
        <div className="w-full lg:w-2/3 animate-slideUp stagger-5">
          <WeeklyPerformanceChart data={chartData} />
        </div>
        <div className="w-full lg:w-1/3 animate-slideUp stagger-6">
          <ActiveWorkers workers={workers.length > 0 ? workers : [
            { id: 1, name: 'No workers yet', location: '-', tasks: 0, status: '-' }
          ]} />
        </div>
      </div>

      <div className='pt-6 animate-fadeIn'>
        <RecentWorkOrders workOrders={workOrders} />
      </div>
    </div>
  )
}

export default SubManagerDashboard
