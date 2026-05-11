import React from 'react'
import WorkOrderCard from '../WorkOrderCard '

const WorkerOrdersList = ({ workOrders = [] }) => {
  return (
    <div className='themed-card rounded-2xl p-5 w-full'>

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

export default WorkerOrdersList