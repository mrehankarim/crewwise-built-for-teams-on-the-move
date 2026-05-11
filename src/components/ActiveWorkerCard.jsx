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
    <div className='flex flex-col gap-1 py-3 last:border-b-0' style={{ borderBottom: '1px solid var(--border-secondary)' }}>
      
      <div className='flex justify-between items-center'>
        <p className='text-sm font-bold' style={{ color: 'var(--text-primary)' }}>{name}</p>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${style.bg} ${style.text}`} style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
          {status}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-1.5' style={{ color: 'var(--text-tertiary)' }}>
          <Icon icon="mdi:map-marker-outline" width={14} height={14} />
          <span className='text-xs font-medium'>{location}</span>
        </div>
        <span className='text-xs font-semibold' style={{ color: 'var(--text-tertiary)' }}>{tasks} {tasks === 1 ? 'task' : 'tasks'}</span>
      </div>

    </div>
  )
}

export default ActiveWorkerCard