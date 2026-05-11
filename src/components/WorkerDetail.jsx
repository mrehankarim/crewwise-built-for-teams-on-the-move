import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useAuth } from '../context/AuthContext'
import { organizationAPI, scheduleAPI, workOrderAPI } from '../api/services'
import toast from 'react-hot-toast'

const statusDot = {
  active:   'bg-green-500',
  inactive: 'bg-gray-400',
  on_leave: 'bg-amber-400',
}

const scheduleStatusColors = {
  created:     'bg-gray-100 text-gray-600 border-gray-300',
  assigned:    'bg-blue-50 text-blue-600 border-blue-300',
  in_progress: 'bg-indigo-50 text-indigo-600 border-indigo-300',
  completed:   'bg-green-50 text-green-600 border-green-300',
  cancelled:   'bg-red-50 text-red-600 border-red-300',
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--bg-secondary)' }}>
      <Icon icon={icon} width={16} style={{ color: 'var(--text-secondary)' }} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>{value || '—'}</p>
    </div>
  </div>
)

const WorkerDetail = () => {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role
  const orgId = user?.organization?._id || user?.organization

  const backPath = role === 'manager' ? '/manager/workers' : '/submanager/workers'

  const [worker, setWorker] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchWorker = async () => {
    try {
      // Fetch full worker data from org workers list
      const res = await organizationAPI.getWorkers(orgId, { limit: 200 })
      const found = (res.data.data?.workers || []).find(w => w._id === workerId)
      if (found) setWorker(found)
      else toast.error('Worker not found')
    } catch { toast.error('Failed to load worker') }
  }

  const fetchSchedules = async () => {
    try {
      const res = await scheduleAPI.getWorkerSchedules(workerId)
      setSchedules(res.data.data || [])
    } catch {}
  }

  const fetchAssignments = async () => {
    try {
      // Get all work orders and check assignments for this worker
      const res = await workOrderAPI.getByOrganization(orgId, { limit: 200 })
      const wos = res.data.data?.workOrders || []
      // Filter WOs where this worker is assigned via checking assignments
      const assignedWOs = []
      for (const wo of wos) {
        try {
          const aRes = await workOrderAPI.getAssignments(wo._id)
          const aList = aRes.data.data || []
          if (aList.some(a => (a.worker?._id || a.worker) === workerId)) {
            assignedWOs.push(wo)
          }
        } catch {}
      }
      setAssignments(assignedWOs)
    } catch {}
  }

  useEffect(() => {
    if (!orgId || !workerId) return
    Promise.all([fetchWorker(), fetchSchedules(), fetchAssignments()])
      .finally(() => setLoading(false))
  }, [workerId, orgId])

  const handleRemove = async () => {
    if (!confirm('Remove this worker from your organization?')) return
    try {
      await organizationAPI.removeWorker(workerId)
      toast.success('Worker removed')
      navigate(backPath)
    } catch { toast.error('Failed to remove worker') }
  }

  if (loading) {
    return (
      <div className="w-full px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 rounded w-1/3" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />)}
        </div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="w-full px-8 py-20 text-center">
        <Icon icon="mdi:account-off-outline" width={56} className="mx-auto mb-4 text-gray-300" />
        <p className="font-semibold text-lg" style={{ color: 'var(--text-secondary)' }}>Worker Not Found</p>
        <button onClick={() => navigate(backPath)} className="mt-4 text-bluelogo underline text-sm">← Back to Workers</button>
      </div>
    )
  }

  const wStatus = worker.workerDetails?.status || 'inactive'
  const skills = worker.workerDetails?.skills?.map(s => s.name || s) || []
  const upcomingSchedules = schedules.filter(s => new Date(s.startTime) >= new Date())
  const pastSchedules = schedules.filter(s => new Date(s.startTime) < new Date())

  return (
    <div className="w-full px-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 pt-5 pb-6 animate-slideDown">
        <button onClick={() => navigate(backPath)}
          className="flex items-center gap-1 text-sm font-semibold hover:text-bluelogo transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <Icon icon="mdi:arrow-left" width={18} />
          Back
        </button>
        <span style={{ color: 'var(--border-secondary)' }}>/</span>
        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Workers</span>
        <span style={{ color: 'var(--border-secondary)' }}>/</span>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{worker.name}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
            <Icon icon="mdi:account-remove-outline" width={16} />
            Remove
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left: Profile Card ── */}
        <div className="lg:col-span-1 space-y-4 animate-slideUp">
          <div className="themed-card rounded-2xl p-6" style={{ border: '1px solid var(--border-primary)' }}>
            {/* Avatar + Name */}
            <div className="flex flex-col items-center text-center pb-5 mb-4" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
              <div className="w-20 h-20 rounded-full bg-bluelogo/10 text-bluelogo flex items-center justify-center font-bold text-3xl mb-3">
                {worker.name?.charAt(0)?.toUpperCase()}
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{worker.name}</h2>
              <p className="text-sm capitalize" style={{ color: 'var(--text-tertiary)' }}>{worker.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2 h-2 rounded-full ${statusDot[wStatus] || 'bg-gray-400'}`} />
                <span className="text-xs font-semibold capitalize" style={{ color: 'var(--text-secondary)' }}>
                  {wStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-0">
              <InfoRow icon="mdi:email-outline"       label="Email"       value={worker.email} />
              <InfoRow icon="mdi:phone-outline"       label="Phone"       value={worker.phoneNumber} />
              <InfoRow icon="mdi:map-marker-outline"  label="Location"    value={worker.location} />
              <InfoRow icon="mdi:briefcase-outline"   label="Designation" value={worker.workerDetails?.designation} />
              <InfoRow icon="mdi:tag-outline"         label="Category"    value={worker.workerDetails?.category} />
              <InfoRow icon="mdi:currency-usd"        label="Rate"        value={worker.workerDetails?.salary ? `$${worker.workerDetails.salary}/hr` : null} />
              <InfoRow icon="mdi:account-supervisor"  label="Manager"     value={worker.workerDetails?.manager?.name} />
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, i) => (
                    <span key={i} className="text-[10px] font-bold uppercase px-2 py-1 rounded-md"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats card */}
          <div className="themed-card rounded-2xl p-5" style={{ border: '1px solid var(--border-primary)' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Activity</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{assignments.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Assigned</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{upcomingSchedules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Upcoming</p>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{pastSchedules.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Past</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Schedules + Assignments ── */}
        <div className="lg:col-span-2 space-y-5 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {/* Upcoming Schedules */}
          <div className="themed-card rounded-2xl p-5" style={{ border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="mdi:calendar-clock" width={20} style={{ color: 'var(--text-secondary)' }} />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Upcoming Schedules</h3>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-bluelogo/10 text-bluelogo">
                {upcomingSchedules.length}
              </span>
            </div>
            {upcomingSchedules.length === 0 ? (
              <p className="text-xs italic text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
                No upcoming schedules
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingSchedules.map(s => (
                  <div key={s._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {s.workOrder?.title || 'Work Order'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(s.startTime).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                        {' '}{new Date(s.startTime).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}
                        {' → '}{new Date(s.endTime).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${scheduleStatusColors[s.status] || 'bg-gray-50'}`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Work Orders */}
          <div className="themed-card rounded-2xl p-5" style={{ border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="mdi:clipboard-list-outline" width={20} style={{ color: 'var(--text-secondary)' }} />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Assigned Work Orders</h3>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-bluelogo/10 text-bluelogo">
                {assignments.length}
              </span>
            </div>
            {assignments.length === 0 ? (
              <p className="text-xs italic text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
                No work orders assigned
              </p>
            ) : (
              <div className="space-y-2">
                {assignments.map(wo => (
                  <div key={wo._id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:shadow-sm transition-all"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}
                    onClick={() => navigate(`/${role}/work-orders/${wo._id}`)}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{wo.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {wo.category} · {wo.client?.name || 'No client'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${{
                        created:'bg-gray-100 text-gray-600',
                        assigned:'bg-blue-100 text-blue-600',
                        in_progress:'bg-indigo-100 text-indigo-600',
                        completed:'bg-green-100 text-green-600',
                        cancelled:'bg-red-100 text-red-600',
                      }[wo.status] || 'bg-gray-100 text-gray-600'}`}>
                        {wo.status?.replace('_', ' ')}
                      </span>
                      <Icon icon="mdi:chevron-right" width={16} style={{ color: 'var(--text-tertiary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Schedules */}
          {pastSchedules.length > 0 && (
            <div className="themed-card rounded-2xl p-5" style={{ border: '1px solid var(--border-primary)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:history" width={20} style={{ color: 'var(--text-secondary)' }} />
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Schedule History</h3>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  {pastSchedules.length}
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pastSchedules.slice(0, 10).map(s => (
                  <div key={s._id} className="flex items-center justify-between px-3 py-2 rounded-xl opacity-70"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {s.workOrder?.title || 'Work Order'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(s.startTime).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${scheduleStatusColors[s.status] || 'bg-gray-50'}`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkerDetail
