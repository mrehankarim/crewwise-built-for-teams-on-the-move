import { Icon } from '@iconify/react'
import React from 'react'

const SummaryCard = ({ name, count, icon, message, iconColor, bgColor }) => {
  return (
    <div className='flex flex-col justify-between bg-white rounded-2xl p-5 gap-3 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300'>
      
      <div className='flex justify-between items-start'>
        <p className='text-sm font-medium text-gray-400'>{name}</p>
        <div className='p-2 rounded-xl' style={{ backgroundColor: bgColor }}>
          <Icon icon={icon} width={20} height={20} color={iconColor} />
        </div>
      </div>

      <p className='text-3xl font-bold text-gray-800'>{count}</p>

      <div className='border-t border-gray-100' />

    
      <p className='text-xs font-medium text-gray-400'>{message}</p>

    </div>
  )
}

export default SummaryCard