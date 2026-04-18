import React from 'react'

const STATUS_STYLES = {
  'in-progress': {
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
    text: 'text-blue-800',
    label: 'In Progress',
  },
  completed: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    dot: 'bg-green-500',
    text: 'text-green-800',
    label: 'Completed',
  },
  urgent: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    dot: 'bg-red-500',
    text: 'text-red-800',
    label: 'Urgent',
  },
  scheduled: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    dot: 'bg-purple-500',
    text: 'text-purple-800',
    label: 'Scheduled',
  },
}

const TaskCard = ({ task }) => {
  const style = STATUS_STYLES[task.status] || STATUS_STYLES['scheduled']
  return (
    <div
      className={`rounded-lg border px-2 py-1.5 mb-1.5 cursor-pointer transition-all duration-150 hover:shadow-md hover:scale-[1.02] ${style.bg} ${style.border}`}
    >
      <p className={`text-[11px] font-semibold leading-tight ${style.text}`}>{task.title}</p>
      <p className={`text-[10px] mt-0.5 font-mono ${style.text} opacity-80`}>{task.time}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className={`w-1.5 h-1.5 rounded-full inline-block ${style.dot}`} />
        <p className={`text-[9px] font-medium uppercase tracking-wide ${style.text} opacity-70`}>
          {task.workerOrderId}
        </p>
      </div>
    </div>
  )
}

const ScheduleView = ({ workerOrders }) => {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const formatDayKey = (date) =>
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const buildTaskMap = (tasks) => {
    const map = {}
    for (const task of tasks) {
      map[task.date] = map[task.date] ? [...map[task.date], task] : [task]
    }
    return map
  }
  const initials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  const AVATAR_COLORS = [
    'bg-indigo-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-violet-500',
  ]

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="w-36 px-4 py-3 text-left">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Worker
              </span>
            </th>
            {days.map((day, i) => {
              const isToday = day.toDateString() === today.toDateString()
              return (
                <th
                  key={i}
                  className={`px-2 py-3 text-center min-w-[110px] ${
                    isToday ? 'bg-indigo-50' : ''
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-widest ${
                      isToday ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  >
                    {DAY_LABELS[day.getDay()]}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-0.5 ${
                      isToday ? 'text-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    {MONTH_LABELS[day.getMonth()]} {day.getDate()}
                  </p>
                  {isToday && (
                    <span className="inline-block mt-1 text-[9px] bg-indigo-600 text-white font-bold uppercase tracking-wider rounded-full px-2 py-0.5">
                      Today
                    </span>
                  )}
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {workerOrders.map((wo, rowIdx) => {
            const taskMap = buildTaskMap(wo.tasks)
            const avatarColor = AVATAR_COLORS[rowIdx % AVATAR_COLORS.length]
            return (
              <tr
                key={rowIdx}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors"
              >
                {/* Worker cell */}
                <td className="px-4 py-4 align-top">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 ${avatarColor}`}
                    >
                      {initials(wo.worker)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      {wo.worker}
                    </span>
                  </div>
                </td>

                {/* Day cells */}
                {days.map((day, colIdx) => {
                  const key = formatDayKey(day)
                  const dayTasks = taskMap[key] || []
                  const isToday = day.toDateString() === today.toDateString()
                  return (
                    <td
                      key={colIdx}
                      className={`px-2 py-3 align-top ${
                        isToday ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {dayTasks.length > 0 ? (
                        dayTasks.map((task, ti) => <TaskCard key={ti} task={task} />)
                      ) : (
                        <p className="text-[10px] text-gray-300 text-center mt-1 select-none">
                          No jobs
                        </p>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ScheduleView