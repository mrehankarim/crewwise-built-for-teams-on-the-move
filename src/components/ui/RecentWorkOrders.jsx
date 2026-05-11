import React from 'react'
import WorkOrderCard from '../WorkOrderCard '

const RecentWorkOrders = ({ workOrders = [], onViewAll }) => {
  return (
    <div className='themed-card rounded-2xl p-5 w-full'>

      <div className='flex justify-between items-center mb-4'>
        <div>
          <h2 className='text-base font-bold' style={{ color: 'var(--text-primary)' }}>Recent Work Orders</h2>
          <p className='text-xs' style={{ color: 'var(--text-tertiary)' }}>Latest service requests</p>
        </div>
        <button 
          onClick={onViewAll}
          className='text-xs bg-black border border-black px-3 py-1.5 rounded-lg text-white transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black whitespace-nowrap'
        >
          View All
        </button>
      </div>

      <div className='mb-4' style={{ borderTop: '1px solid var(--border-secondary)' }} />

      <div className='flex flex-col gap-3'>
        {workOrders.map((order) => (
          <WorkOrderCard
          id={order.id}
            key={order.id}
            title={order.title}
            status={order.status}
            priority={order.priority}
            assignee={order.assignee}
            location={order.location}
            dueDate={order.dueDate}
            estimatedTime={order.estimatedTime}
            description={order.description}
          />
        ))}
      </div>

    </div>
  )
}

export default RecentWorkOrders