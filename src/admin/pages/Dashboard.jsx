import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WeeklyPerformanceChart from '../../components/ui/WeeklyPerformanceChart'
import ActiveWorkers from '../../components/ui/ActiveWorkers'
import RecentWorkOrders from '../../components/ui/RecentWorkOrders'
const Dashboard = () => {
  const workOrders = [
  {
    id: 'WO-2024-1234',
    title: 'Network Installation - Building A',
    description: 'Install and configure network infrastructure in new building',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Mike Johnson',
    location: 'Downtown Office',
    dueDate: '2026-03-05',
    estimatedTime: '8h estimated'
  },
  {
    id: 'WO-2024-1235',
    title: 'Maintenance Check - Server Room',
    description: 'Routine inspection and maintenance of all server units',
    status: 'pending',
    priority: 'low',
    assignee: 'Sarah Williams',
    location: 'Tech Park',
    dueDate: '2026-03-10',
    estimatedTime: '3h estimated'
  },
  {
    id: 'WO-2024-1236',
    title: 'Emergency Repair - Router',
    description: 'Fix connectivity issues and replace faulty router hardware',
    status: 'scheduled',
    priority: 'urgent',
    assignee: 'David Chen',
    location: 'Branch Office',
    dueDate: '2026-03-02',
    estimatedTime: '5h estimated'
  }
]
  const data = [
    { day: 'Mon', completed: 11, assigned: 15 },
    { day: 'Tue', completed: 15, assigned: 19 },
    { day: 'Wed', completed: 17, assigned: 18 },
    { day: 'Thu', completed: 8, assigned: 12 },
    { day: 'Fri', completed: 4, assigned: 9 },
    { day: 'Sat', completed: 19, assigned: 21 },
    { day: 'Sun', completed: 11, assigned: 15 },
  ];

  const workers = [
    { id: 1, name: 'Mike Johnson', location: 'Downtown Office', tasks: 2, status: 'On Site' },
    { id: 2, name: 'Sarah Williams', location: 'Tech Park', tasks: 1, status: 'En Route' },
    { id: 3, name: 'David Chen', location: 'Downtown Office', tasks: 2, status: 'On Site' },
    { id: 4, name: 'Emily Davis', location: 'Office', tasks: 0, status: 'Available' },
  ]

  return (
    <div className='w-full px-8'>
      <div className='flex justify-between pt-4 pb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Manager Dashboard</h1>
          <p className='text-sm text-gray-500'>Tech Solution Inc.</p>
        </div>
        <div>
          <IconTextButton text={"Create Work Order"} icon="akar-icons:clipboard" onClickHandler={() => { }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard name="Active Work Orders" count={24} icon="akar-icons:clipboard" message="+6 today" iconColor="#2262C2" bgColor="#BAD2F0" />
        <SummaryCard name="Field Workers" count={18} icon="fluent:people-12-regular" message="16 active" iconColor="#367B43" bgColor="#C3EFCF" />
        <SummaryCard name="Pending Tasks" count={18} icon="akar-icons:clock" message="3 urgent" iconColor="#9E3333" bgColor="#F0D6CE" />
        <SummaryCard name="Completed Today" count={8} icon="lets-icons:done-ring-round" message="67% rate" iconColor="#367B43" bgColor="#C3EFCF" />
      </div>
      <div className='pt-6 flex flex-col lg:flex-row gap-6'>
        <div className="w-full lg:w-2/3">
          <WeeklyPerformanceChart data={data} />
        </div>
        <div className="w-full lg:w-1/3">
          <ActiveWorkers workers={workers} />
        </div>
      </div>
      <div className='pt-6'>
        <RecentWorkOrders workOrders={workOrders} />
      </div>
    </div>
  )
}

export default Dashboard