import { Icon } from '@iconify/react'
import React from 'react'

const SummaryCard = ({ name, count, icon, message, iconColor, bgColor }) => {
  return (
    <div
      className='flex flex-col justify-between rounded-2xl p-5 gap-3 transition-shadow duration-300'
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      
      <div className='flex justify-between items-start'>
        <p className='text-sm font-medium' style={{ color: 'var(--text-tertiary)' }}>{name}</p>
        <div className='p-2 rounded-xl' style={{ backgroundColor: bgColor }}>
          <Icon icon={icon} width={20} height={20} color={iconColor} />
        </div>
      </div>

      <p className='text-3xl font-bold' style={{ color: 'var(--text-primary)' }}>{count}</p>

      <div style={{ borderTop: '1px solid var(--border-secondary)' }} />

    
      <p className='text-xs font-medium' style={{ color: 'var(--text-tertiary)' }}>{message}</p>

    </div>
  )
}

export default SummaryCard