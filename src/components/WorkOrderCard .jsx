import { Icon } from '@iconify/react'
import React from 'react'

const statusStyles = {
  'in-progress': { bg: 'bg-blue-50',   text: 'text-blue-500'  },
  'pending':     { bg: 'bg-orange-50', text: 'text-orange-400' },
  'scheduled':   { bg: 'bg-purple-50', text: 'text-purple-500' },
  'completed':   { bg: 'bg-green-50',  text: 'text-green-500'  },
}

const priorityStyles = {
  'high':   { bg: 'bg-red-50',    text: 'text-red-500'    },
  'low':    { bg: 'bg-green-50',  text: 'text-green-500'  },
  'urgent': { bg: 'bg-orange-50', text: 'text-orange-500' },
  'medium': { bg: 'bg-yellow-50', text: 'text-yellow-600' },
}

const WorkOrderCard = ({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  location,
  dueDate,
  estimatedTime
}) => {

  const statusStyle   = statusStyles[status]   || { bg: 'bg-gray-100', text: 'text-gray-600' }
  const priorityStyle = priorityStyles[priority] || { bg: 'bg-gray-100', text: 'text-gray-600' }

  return (
    <div className='flex items-start justify-between border border-gray-200 rounded-xl px-4 py-4 hover:shadow-sm 
     transition-all duration-300
     hover:bg-gray-50 cursor-pointer hover:scale-102 
     active:scale-98'>
      
      <div className='flex flex-col gap-2 w-full'>
        
        <div className='flex items-center justify-between flex-wrap gap-2'>
          
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='text-sm font-semibold text-gray-800'>{title}</p>

            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              {status}
            </span>

            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
              {priority}
            </span>
          </div>
          <span className='text-xs text-gray-400 whitespace-nowrap'>
            #{id}
          </span>
        </div>

        {description && (
          <p className='text-xs text-gray-500'>
            {description.length > 100 ? description.substring(0, 100) + '...' : description}
          </p>
        )}

        <div className='flex flex-wrap items-center gap-4 text-gray-400'>
          
          <div className='flex items-center gap-1'>
            <Icon icon="ph:users-three" width={14} height={14} />
            <span className='text-xs'>{assignee}</span>
          </div>

          <div className='flex items-center gap-1'>
            <Icon icon="mdi:map-marker-outline" width={14} height={14} />
            <span className='text-xs'>{location}</span>
          </div>

          <div className='flex items-center gap-1'>
            <Icon icon="mdi:calendar-outline" width={14} height={14} />
            <span className='text-xs'>Due: {dueDate}</span>
          </div>

          <div className='flex items-center gap-1'>
            <Icon icon="mdi:clock-outline" width={14} height={14} />
            <span className='text-xs'>{estimatedTime}</span>
          </div>

        </div>

      </div>

      

    </div>
  )
}

export default WorkOrderCard