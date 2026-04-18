import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'

const metrics = [
  { name: 'Completion Rate', count: '92.3%', icon: 'lets-icons:done-ring-round', message: '+6.2% vs last month', iconColor: '#367B43', bgColor: '#C3EFCF' },
  { name: 'Avg Response Time', count: '2.4h', icon: 'akar-icons:clock', message: '-0.8% vs last month', iconColor: '#9E3333', bgColor: '#F0D6CE' },
  { name: 'Customer Satisfaction', count: '4.7/5', icon: 'akar-icons:star', message: '+0.2% vs last month', iconColor: '#2262C2', bgColor: '#BAD2F0' },
  { name: 'First-Time Fix Rate', count: '85%', icon: 'akar-icons:shield', message: '-3% vs last month', iconColor: '#9E3333', bgColor: '#F0D6CE' },
]

const lineData = [
  { month: 'Oct', Completed: 165, Pending: 18 },
  { month: 'Nov', Completed: 160, Pending: 22 },
  { month: 'Dec', Completed: 175, Pending: 15 },
  { month: 'Jan', Completed: 190, Pending: 20 },
  { month: 'Feb', Completed: 185, Pending: 25 },
  { month: 'Mar', Completed: 120, Pending: 22 },
]

const pieData = [
  { name: 'High', value: 27, color: '#E24B4A' },
  { name: 'Urgent', value: 13, color: '#FAC775' },
  { name: 'Low', value: 21, color: '#1D9E75' },
  { name: 'Medium', value: 40, color: '#378ADD' },
]

const barData = [
  { status: 'Completed', value: 95, color: '#1D9E75' },
  { status: 'In Progress', value: 30, color: '#378ADD' },
  { status: 'Pending', value: 25, color: '#FAC775' },
  { status: 'Cancelled', value: 5, color: '#E24B4A' },
]

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
  const radius = outerRadius + 24
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#6B7280" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {`${name} ${value}%`}
    </text>
  )
}

const Reports = () => {
  return (
    <div className="w-full px-8">
      <div className="flex justify-between items-start pt-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Performance insights and data analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 cursor-pointer outline-none">
            <option>March 2026</option>
            <option>February 2026</option>
            <option>January 2026</option>
          </select>
          <IconTextButton text="Export Report" icon="akar-icons:download" onClickHandler={() => {}} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <SummaryCard
            key={m.name}
            name={m.name}
            count={m.count}
            icon={m.icon}
            message={m.message}
            iconColor={m.iconColor}
            bgColor={m.bgColor}
          />
        ))}
      </div>

      <div className="pt-6 flex flex-col lg:flex-row gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-full lg:w-1/2">
          <p className="font-medium text-gray-900 mb-0.5">Monthly Performance</p>
          <p className="text-xs text-gray-500 mb-4">Work order completion trends</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e7eb' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Completed" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="Pending" stroke="#FAC775" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm w-full lg:w-1/2">
          <p className="font-medium text-gray-900 mb-0.5">Priority Distribution</p>
          <p className="text-xs text-gray-500 mb-4">Work orders by priority level</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                labelLine
                label={renderCustomLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pt-6 pb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="font-medium text-gray-900 mb-0.5">Current Status Overview</p>
          <p className="text-xs text-gray-500 mb-4">Distribution of work order statuses</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} domain={[0, 110]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #e5e7eb' }}
                formatter={(value) => [value, 'Work Orders']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports