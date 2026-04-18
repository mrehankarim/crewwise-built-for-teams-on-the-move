import React from 'react'
import IconTextButton from '../../components/IconTextButton'
import { Icon } from '@iconify/react'
import ScheduleView from '../../components/ui/Scheduleview'   // <-- new import

const Scheduler = () => {

  const workerOrders = [
    {
      worker: 'Mike Johnson',
      tasks: [
        { title: 'Network Installation - Building A', time: "9:00 AM - 5:00 PM", date: 'April 18, 2026', workerOrderId: 'WO-MJ-1007', status: 'in-progress' },
        { title: 'Server Maintenance', time: "10:00 AM - 4:00 PM", date: 'April 17, 2026', workerOrderId: 'WO-MJ-1006', status: 'completed' },
        { title: 'CCTV Installation', time: "11:00 AM - 6:00 PM", date: 'April 16, 2026', workerOrderId: 'WO-MJ-1005', status: 'completed' },
        { title: 'WiFi Setup', time: "9:30 AM - 3:30 PM", date: 'April 15, 2026', workerOrderId: 'WO-MJ-1004', status: 'urgent' },
        { title: 'Hardware Repair', time: "12:00 PM - 5:00 PM", date: 'April 14, 2026', workerOrderId: 'WO-MJ-1003', status: 'completed' },
        { title: 'System Upgrade', time: "8:30 AM - 2:30 PM", date: 'April 13, 2026', workerOrderId: 'WO-MJ-1002', status: 'scheduled' },
        { title: 'Network Troubleshooting', time: "10:00 AM - 3:00 PM", date: 'April 12, 2026', workerOrderId: 'WO-MJ-1001', status: 'completed' },
      ],
    },
    {
      worker: 'Sarah Williams',
      tasks: [
        { title: 'Electrical Wiring', time: "9:00 AM - 4:00 PM", date: 'April 18, 2026', workerOrderId: 'WO-SW-2007', status: 'in-progress' },
        { title: 'Lighting Setup', time: "10:00 AM - 5:00 PM", date: 'April 17, 2026', workerOrderId: 'WO-SW-2006', status: 'completed' },
        { title: 'Generator Maintenance', time: "11:00 AM - 3:00 PM", date: 'April 16, 2026', workerOrderId: 'WO-SW-2005', status: 'urgent' },
        { title: 'Power Backup Installation', time: "9:30 AM - 2:30 PM", date: 'April 15, 2026', workerOrderId: 'WO-SW-2004', status: 'completed' },
        { title: 'Electrical Inspection', time: "12:00 PM - 5:00 PM", date: 'April 14, 2026', workerOrderId: 'WO-SW-2003', status: 'completed' },
        { title: 'Circuit Repair', time: "8:30 AM - 1:30 PM", date: 'April 13, 2026', workerOrderId: 'WO-SW-2002', status: 'scheduled' },
        { title: 'Panel Upgrade', time: "10:00 AM - 3:00 PM", date: 'April 12, 2026', workerOrderId: 'WO-SW-2001', status: 'completed' },
      ],
    },
    {
      worker: 'Ali Khan',
      tasks: [
        { title: 'AC Installation', time: "9:00 AM - 5:00 PM", date: 'April 18, 2026', workerOrderId: 'WO-AK-3007', status: 'in-progress' },
        { title: 'Ventilation Setup', time: "10:00 AM - 4:00 PM", date: 'April 17, 2026', workerOrderId: 'WO-AK-3006', status: 'completed' },
        { title: 'AC Maintenance', time: "11:00 AM - 3:00 PM", date: 'April 16, 2026', workerOrderId: 'WO-AK-3005', status: 'completed' },
        { title: 'Cooling System Repair', time: "9:30 AM - 2:30 PM", date: 'April 15, 2026', workerOrderId: 'WO-AK-3004', status: 'urgent' },
        { title: 'Duct Cleaning', time: "12:00 PM - 5:00 PM", date: 'April 14, 2026', workerOrderId: 'WO-AK-3003', status: 'completed' },
        { title: 'HVAC Inspection', time: "8:30 AM - 1:30 PM", date: 'April 13, 2026', workerOrderId: 'WO-AK-3002', status: 'scheduled' },
        { title: 'Thermostat Setup', time: "10:00 AM - 3:00 PM", date: 'April 12, 2026', workerOrderId: 'WO-AK-3001', status: 'completed' },
      ],
    },
  ]

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
  const weekBefore = new Date(new Date().setDate(new Date().getDate() - 6))
    .toLocaleDateString('en-US', { day: 'numeric', month: 'long' })

  return (
    <div className='w-full px-8'>
      <div className='flex justify-between pt-4 pb-6'>
        <div>
          <h1 className='text-2xl font-bold'>Schedule And Dispatch</h1>
          <p className='text-sm text-gray-500'>Plan And Manage Work Assignments</p>
        </div>
        <div>
          <IconTextButton text={'Schedule Job'} icon='uil:schedule' onClickHandler={() => { }} />
        </div>
      </div>

      <div className='w-full flex justify-between items-center bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-400 mb-4'>
        <div className='flex justify-center items-center px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-100 cursor-pointer hover:scale-105 transition-all duration-200 active:scale-98'>
          <Icon icon='material-symbols:arrow-back-ios-rounded' width={18} height={18} className='text-gray-500' />
        </div>
        <div className='text-center'>
          <p className='text-xl font-extrabold font-roboto'>{weekBefore} – {today}, 2026</p>
          <p className='text-gray-400 font-normal text-sm text-center'>Weekly View</p>
        </div>
        <div className='flex justify-center items-center px-2 py-1 border border-gray-400 rounded-md hover:bg-gray-100 cursor-pointer hover:scale-105 transition-all duration-200 active:scale-98'>
          <Icon icon='material-symbols:arrow-forward-ios-rounded' width={18} height={18} className='text-gray-500' />
        </div>
      </div>
      <ScheduleView workerOrders={workerOrders} />
      <div className='w-full flex justify-start items-center gap-2 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 mb-4 mt-2'>
        <p className='text-md font-bold font-roboto'>Legends:</p>
        <div  className='bg-blue-100 p-3 rounded-md'></div>
        <p className='text-sm text-gray-500'>InProgress</p>
        <div  className='bg-green-100 p-3 rounded-md'></div>
        <p className='text-sm text-gray-500'>Completed</p>
        <div  className='bg-red-100 p-3 rounded-md'></div>
        <p className='text-sm text-gray-500'>Urgent</p>
        <div  className='bg-purple-100 p-3 rounded-md'></div>
        <p className='text-sm text-gray-500'>Scheduled</p>

      </div>
    </div>
  )
}

export default Scheduler