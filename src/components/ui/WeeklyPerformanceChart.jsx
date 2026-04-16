import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const WeeklyPerformanceChart = ({ data }) => {
    

    return (
        <div className='bg-white rounded-2xl p-6 w-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100'>
            <div className='mb-4'>
                <h2 className='text-base font-semibold text-gray-800'>Weekly Performance</h2>
                <p className='text-xs text-gray-400 mt-0.5'>Work orders completed vs assigned</p>
            </div>

            <div className='border-t border-gray-100 mb-4' />

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} barCategoryGap="35%" barGap={3} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke='#f0f0f0' />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                        cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '12px', paddingTop: '16px', color: '#6b7280' }}
                    />
                    <Bar dataKey="completed" fill="#3299E3" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assigned" fill="#5CA26E" name="Assigned" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default WeeklyPerformanceChart