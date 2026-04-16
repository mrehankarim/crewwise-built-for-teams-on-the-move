import React from 'react'
import WorkOrderCard from '../WorkOrderCard '

const RecentWorkOrders = ({ workOrders = [] }) => {
  return (
    <div className='bg-white rounded-2xl p-5 w-full border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'>

      <div className='flex justify-between items-start mb-3'>
        <div>
          <h2 className='text-base font-semibold text-gray-800'>Recent Work Orders</h2>
          <p className='text-xs text-gray-400 mt-0.5'>Latest work order assignments</p>
        </div>
        <button className='text-xs bg-black border border-black px-3 py-1.5 rounded-lg text-white  transition-all duration-200 cursor-pointer
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black whitespace-nowrap'>
          View All
        </button>
      </div>

      <div className='border-t border-gray-100 mb-3' />

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