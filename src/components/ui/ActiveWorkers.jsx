import React from 'react'
import ActiveWorkerCard from '../ActiveWorkerCard'
const ActiveWorkers = ({workers}) => {
    return (
        <div className='bg-white rounded-2xl p-5 w-full border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'>
            <div className='mb-3'>
                <h2 className='text-base font-semibold text-gray-800'>Active Workers</h2>
                <p className='text-xs text-gray-400 mt-0.5'>Real-time worker status</p>
            </div>

            <div className='border-t border-gray-100 mb-2' />
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