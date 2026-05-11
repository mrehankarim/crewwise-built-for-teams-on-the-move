import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const WeeklyPerformanceChart = ({ data }) => {
    

    return (
        <div className='themed-card rounded-2xl p-6 w-full'>
            <div className='mb-4'>
                <h2 className='text-base font-bold' style={{ color: 'var(--text-primary)' }}>Weekly Performance</h2>
                <p className='text-xs' style={{ color: 'var(--text-tertiary)' }}>Work orders completed vs assigned</p>
            </div>

            <div className='mb-4' style={{ borderTop: '1px solid var(--border-secondary)' }} />

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} barCategoryGap="35%" barGap={3} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke='var(--border-secondary)' opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontWeight: 500 }} domain={[0, 'auto']} />
                    <Tooltip
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: '1px solid var(--border-primary)', 
                            boxShadow: 'var(--shadow-lg)', 
                            fontSize: '12px',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)'
                        }}
                        itemStyle={{ color: 'var(--text-secondary)' }}
                        cursor={{ fill: 'var(--bg-hover)', opacity: 0.4 }}
                    />
                    <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', paddingTop: '16px', fontWeight: 600 }}
                    />
                    <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="assigned" fill="#10b981" name="Assigned" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default WeeklyPerformanceChart