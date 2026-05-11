import React from 'react'
import ActiveWorkerCard from '../ActiveWorkerCard'
const ActiveWorkers = ({workers}) => {
    return (
        <div className='themed-card rounded-2xl p-5 w-full'>
            <div className='mb-3'>
                <h2 className='text-base font-bold' style={{ color: 'var(--text-primary)' }}>Active Workers</h2>
                <p className='text-xs' style={{ color: 'var(--text-tertiary)' }}>Real-time worker status</p>
            </div>

            <div className='mb-2' style={{ borderTop: '1px solid var(--border-secondary)' }} />
            <div className='flex flex-col'>
                {workers.map(worker => (
                    <ActiveWorkerCard
                        key={worker.id}
                        name={worker.name}
                        location={worker.location}
                        tasks={worker.tasks}
                        status={worker.status}
                    />
                ))}
            </div>

        </div>
    )
}

export default ActiveWorkers