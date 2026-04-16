import { Icon } from '@iconify/react'
import React from 'react'

const statusStyles = {
  'On Site':   { bg: 'bg-gray-100', text: 'text-gray-700' },
  'En Route':  { bg: 'bg-blue-50',  text: 'text-blue-600' },
  'Available': { bg: 'bg-green-50', text: 'text-green-600' },
}

const ActiveWorkerCard = ({ name, location, tasks, status }) => {
  const style = statusStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  return (
    <div className='flex flex-col gap-1 py-3 border-b border-gray-100 last:border-b-0'>
      
      <div className='flex justify-between items-center'>
        <p className='text-sm font-bold text-gray-800'>{name}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border border-gray-200 ${style.bg} ${style.text}`}>
          {status}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-1 text-gray-400'>
          <Icon icon="mdi:map-marker-outline" width={14} height={14} />
          <span className='text-xs'>{location}</span>
        </div>
        <span className='text-xs text-gray-400'>{tasks} {tasks === 1 ? 'task' : 'tasks'}</span>
      </div>

    </div>
  )
}

export default ActiveWorkerCard