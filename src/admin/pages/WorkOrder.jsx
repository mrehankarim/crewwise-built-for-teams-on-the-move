import React,{useState} from 'react'
import SummaryCard from '../../components/SummaryCard'
import IconTextButton from '../../components/IconTextButton'
import WorkerOrdersList from '../../components/ui/WorkerOrdersList'
const WorkOrder = () => {
const [search, setSearch] = useState('')
const [statusFilter, setStatusFilter] = useState('')
const [priorityFilter, setPriorityFilter] = useState('')


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

  const filteredOrders = workOrders.filter(order => {
  return (
    order.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? order.status === statusFilter : true) &&
    (priorityFilter ? order.priority === priorityFilter : true)
  )
})


  return (
    <div className='w-full px-8'>
      <div className='flex justify-between pt-4 pb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Work Orders</h1>
          <p className='text-sm text-gray-500'>Manager and track all work orders</p>
        </div>
        <div>
          <IconTextButton text={"Create Work Order"} icon="akar-icons:clipboard" onClickHandler={() => { }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SummaryCard
          name="In Progress"
          count={12}
          icon="mdi:progress-clock"
          message="Currently active"
          iconColor="#2563EB"
          bgColor="#DBEAFE"
        />

        <SummaryCard
          name="Pending"
          count={6}
          icon="mdi:clock-outline"
          message="Waiting to start"
          iconColor="#F59E0B"
          bgColor="#FEF3C7"
        />

        <SummaryCard
          name="Scheduled"
          count={4}
          icon="mdi:calendar-clock"
          message="Upcoming tasks"
          iconColor="#7C3AED"
          bgColor="#EDE9FE"
        />

        <SummaryCard
          name="Completed"
          count={18}
          icon="mdi:check-circle-outline"
          message="Finished work orders"
          iconColor="#16A34A"
          bgColor="#DCFCE7"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-6">

        <input
        onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search work orders..."
          className="w-full  px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="flex gap-2 flex-wrap">
          <div className='flex gap-1'>

          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm" onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="urgent">Urgent</option>
          </select>
          </div>

        </div>
      </div>
      <div className='pt-6'>
        <WorkerOrdersList workOrders={filteredOrders} />
      </div>
    </div>
  )

}

export default WorkOrder
