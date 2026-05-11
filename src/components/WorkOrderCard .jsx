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
    <div className='flex items-start justify-between border rounded-xl px-4 py-4 hover:shadow-md 
     transition-all duration-300 cursor-pointer hover:scale-102 active:scale-98'
     style={{ 
       backgroundColor: 'var(--bg-card)', 
       borderColor: 'var(--border-primary)',
     }}
     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
    >
      
      <div className='flex flex-col gap-2 w-full'>
        
        <div className='flex items-center justify-between flex-wrap gap-2'>
          
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>{title}</p>

            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text}`}>
              {status?.replace('-', ' ')}
            </span>

            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${priorityStyle.bg} ${priorityStyle.text}`}>
              {priority}
            </span>
          </div>
          <span className='text-[10px] font-bold text-gray-400 whitespace-nowrap uppercase tracking-widest'>
            #{id}
          </span>
        </div>

        {description && (
          <p className='text-xs leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
            {description.length > 100 ? description.substring(0, 100) + '...' : description}
          </p>
        )}

        <div className='flex flex-wrap items-center gap-4 text-gray-400 mt-1'>
          
          <div className='flex items-center gap-1.5'>
            <Icon icon="ph:users-three" width={14} height={14} className="text-gray-400" />
            <span className='text-xs font-medium'>{assignee}</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <Icon icon="mdi:map-marker-outline" width={14} height={14} className="text-gray-400" />
            <span className='text-xs font-medium'>{location}</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <Icon icon="mdi:calendar-outline" width={14} height={14} className="text-gray-400" />
            <span className='text-xs font-medium'>Due: {dueDate}</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <Icon icon="mdi:clock-outline" width={14} height={14} className="text-gray-400" />
            <span className='text-xs font-medium'>{estimatedTime}</span>
          </div>

        </div>

      </div>

    </div>
  )
}

export default WorkOrderCard