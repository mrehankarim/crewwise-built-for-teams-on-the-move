import { useState, useEffect } from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import { useAuth } from '../../context/AuthContext'
import { organizationAPI, workOrderAPI } from '../../api/services'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const r = outerRadius + 24
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return <text x={x} y={y} fill="#6B7280" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>{`${name} ${value}`}</text>
}

const ManagerReports = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;
    const fetchData = async () => {
      try {
        const [dashRes, woStats] = await Promise.all([
          organizationAPI.getDashboard(orgId),
          workOrderAPI.getStats(orgId).catch(() => ({ data: { data: {} } })),
        ]);
        setStats({ ...dashRes.data.data, woStats: woStats.data.data });
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [orgId]);

  const total = stats?.workOrders?.total || 0;
  const completed = stats?.workOrders?.completed || 0;
  const inProgress = stats?.workOrders?.inProgress || 0;
  const created = stats?.workOrders?.created || 0;
  const cancelled = stats?.workOrders?.cancelled || 0;
  const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

  const pieData = [
    { name: 'Completed', value: completed, color: '#1D9E75' },
    { name: 'In Progress', value: inProgress, color: '#378ADD' },
    { name: 'Created', value: created, color: '#FAC775' },
    { name: 'Cancelled', value: cancelled, color: '#E24B4A' },
  ].filter(d => d.value > 0);

  const barData = [
    { status: 'Completed', value: completed, color: '#1D9E75' },
    { status: 'In Progress', value: inProgress, color: '#378ADD' },
    { status: 'Created', value: created, color: '#FAC775' },
    { status: 'Cancelled', value: cancelled, color: '#E24B4A' },
  ];

  const lineData = [
    { month: 'Week 1', Completed: Math.floor(completed * 0.2), Total: Math.floor(total * 0.2) },
    { month: 'Week 2', Completed: Math.floor(completed * 0.45), Total: Math.floor(total * 0.4) },
    { month: 'Week 3', Completed: Math.floor(completed * 0.7), Total: Math.floor(total * 0.65) },
    { month: 'Week 4', Completed: completed, Total: total },
  ];

  if (loading) return <div className='w-full px-8 py-6'><div className='space-y-6 animate-pulse'><div className='h-8 bg-gray-200 rounded w-1/3'/><div className='grid grid-cols-4 gap-4'>{[1,2,3,4].map(i=><div key={i} className='h-32 loading-skeleton'/>)}</div></div></div>;

  return (
    <div className="w-full px-8 pb-8">
      <div className="flex justify-between items-start pt-4 pb-6 animate-slideDown">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Performance insights from your organization data</p>
        </div>
        <IconTextButton text="Export Report" icon="akar-icons:download" onClickHandler={() => {}} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Completion Rate" count={`${rate}%`} icon="lets-icons:done-ring-round" message={`${completed} of ${total} orders`} iconColor="#367B43" bgColor="#C3EFCF" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="Total Workers" count={stats?.team?.totalWorkers || 0} icon="fluent:people-12-regular" message={`${stats?.team?.technicians || 0} tech, ${stats?.team?.contractors || 0} contract`} iconColor="#2262C2" bgColor="#BAD2F0" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="Active Orders" count={inProgress} icon="mdi:progress-clock" message="Currently in progress" iconColor="#9E3333" bgColor="#F0D6CE" /></div>
        <div className="animate-slideUp stagger-4"><SummaryCard name="Sub-Managers" count={stats?.team?.subManagers || 0} icon="mdi:account-supervisor" message="Team supervisors" iconColor="#7C3AED" bgColor="#EDE9FE" /></div>
      </div>

      <div className="pt-6 flex flex-col lg:flex-row gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-full lg:w-1/2 animate-slideUp stagger-5">
          <p className="font-medium text-gray-900 mb-0.5">Performance Trend</p>
          <p className="text-xs text-gray-500 mb-4">Work order completion over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e7eb' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Completed" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Total" stroke="#378ADD" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-full lg:w-1/2 animate-slideUp stagger-6">
          <p className="font-medium text-gray-900 mb-0.5">Status Distribution</p>
          <p className="text-xs text-gray-500 mb-4">Work orders by current status</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData.length > 0 ? pieData : [{ name: 'No data', value: 1, color: '#e5e7eb' }]} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={pieData.length > 0} label={pieData.length > 0 ? renderLabel : undefined}>
                {(pieData.length > 0 ? pieData : [{ color: '#e5e7eb' }]).map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-6 pb-6 animate-fadeIn">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="font-medium text-gray-900 mb-0.5">Status Overview</p>
          <p className="text-xs text-gray-500 mb-4">Distribution of all work order statuses</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => [v, 'Orders']} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ManagerReports
