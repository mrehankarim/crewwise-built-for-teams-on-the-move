import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { scheduleAPI, organizationAPI } from '../../api/services'
import IconTextButton from '../../components/IconTextButton'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

const statusColors = {
  created: 'bg-gray-100 border-gray-300 text-gray-600',
  assigned: 'bg-blue-50 border-blue-300 text-blue-600',
  in_progress: 'bg-indigo-50 border-indigo-300 text-indigo-600',
  completed: 'bg-green-50 border-green-300 text-green-600',
  cancelled: 'bg-red-50 border-red-300 text-red-600',
}

const ManagerScheduler = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [workers, setWorkers] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerSchedules, setWorkerSchedules] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ worker: '', workOrder: '', startTime: '', endTime: '' });

  useEffect(() => {
    if (!orgId) return;
    const fetchData = async () => {
      try {
        const [wRes, woRes] = await Promise.all([
          organizationAPI.getWorkers(orgId, { limit: 50 }),
          organizationAPI.getWorkOrders(orgId, { limit: 50 })
        ]);
        const wks = wRes.data.data?.workers || [];
        setWorkers(wks);
        setWorkOrders(woRes.data.data?.workOrders || []);
        
        const schedMap = {};
        await Promise.all(wks.slice(0, 10).map(async (w) => {
          try {
            const sRes = await scheduleAPI.getWorkerSchedules(w._id);
            schedMap[w._id] = sRes.data.data || [];
          } catch { schedMap[w._id] = []; }
        }));
        setWorkerSchedules(schedMap);
      } catch (err) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, [orgId]);

  const fetchWorkerSchedules = async (wks) => {
    const schedMap = {};
    await Promise.all((wks || workers).slice(0, 20).map(async (w) => {
      try {
        const sRes = await scheduleAPI.getWorkerSchedules(w._id);
        schedMap[w._id] = sRes.data.data || [];
      } catch { schedMap[w._id] = []; }
    }));
    setWorkerSchedules(schedMap);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.worker || !form.workOrder || !form.startTime || !form.endTime) { toast.error('All fields required'); return; }
    setCreating(true);
    try {
      await scheduleAPI.create({
        ...form,
        workerId: form.worker,
        workOrderId: form.workOrder,
      });
      toast.success('Schedule created!');
      setShowCreate(false);
      setForm({ worker: '', workOrder: '', startTime: '', endTime: '' });
      fetchWorkerSchedules(); // refresh calendar
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const weekDates = days.map((_, i) => {
    const d = new Date(now);
    const diff = d.getDay() === 0 ? -6 : 1 - d.getDay();
    d.setDate(d.getDate() + diff + i);
    return d;
  });

  if (loading) {
    return <div className='w-full px-8 py-6'><div className='space-y-4'>{[1, 2, 3].map(i => <div key={i} className='h-20 loading-skeleton' />)}</div></div>;
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Schedule & Dispatch</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Plan and manage work assignments</p>
        </div>
        <IconTextButton text="Schedule Job" icon="uil:schedule" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className='w-full themed-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border mb-4 animate-fadeIn' style={{ borderColor: 'var(--border-primary)' }}>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-lg font-bold font-roboto' style={{ color: 'var(--text-primary)' }}>
            {weekDates[0]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – {weekDates[6]?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, {now.getFullYear()}
          </p>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Weekly View</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 gap-0 border-b pb-2 mb-2" style={{ borderColor: 'var(--border-secondary)' }}>
              <div className="text-xs font-semibold px-2" style={{ color: 'var(--text-secondary)' }}>Worker</div>
              {days.map((day, i) => (
                <div key={day} className="text-center">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{day}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{weekDates[i]?.getDate()}</p>
                </div>
              ))}
            </div>

            {workers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Icon icon="mdi:calendar-blank" width={40} className="mx-auto mb-2" />
                <p className="text-sm">No workers to schedule</p>
              </div>
            ) : workers.map((w, idx) => (
              <div key={w._id} className="grid grid-cols-8 gap-0 py-2 border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors animate-slideUp"
                style={{ animationDelay: `${idx * 0.05}s`, borderColor: 'var(--border-secondary)' }}>
                <div className="flex items-center gap-2 px-2">
                  <div className="w-7 h-7 bg-bluelogo/10 rounded-full flex items-center justify-center text-xs font-bold text-bluelogo">
                    {w.name?.charAt(0)}
                  </div>
                  <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{w.name}</span>
                </div>
                {days.map((_, dayIdx) => {
                  const schedules = workerSchedules[w._id] || [];
                  const daySchedules = schedules.filter(s => {
                    const sd = new Date(s.startTime);
                    return sd.toDateString() === weekDates[dayIdx]?.toDateString();
                  });
                  return (
                    <div key={dayIdx} className="px-1">
                      {daySchedules.length > 0 ? daySchedules.map(s => (
                        <div key={s._id} className={`text-[10px] px-1.5 py-1 rounded border ${statusColors[s.status] || 'bg-gray-50'} mb-0.5 truncate`}>
                          {s.workOrder?.title || 'Task'}
                        </div>
                      )) : (
                        <div className="h-8" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex gap-4 animate-fadeIn'>
        {Object.entries(statusColors).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${val.split(' ')[0]}`} />
            <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>{key.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule Job" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Worker *</label>
            <select value={form.worker} onChange={(e) => setForm(f => ({ ...f, worker: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none rounded-lg" id="sched-worker">
              <option value="">Select Worker</option>
              {workers.map(w => (
                <option key={w._id} value={w._id}>{w.name} ({w.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Work Order *</label>
            <select value={form.workOrder} onChange={(e) => setForm(f => ({ ...f, workOrder: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none rounded-lg" id="sched-wo">
              <option value="">Select Work Order</option>
              {workOrders.map(wo => (
                <option key={wo._id} value={wo._id}>{wo.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Start *</label>
              <input type="datetime-local" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))}
                className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="sched-start" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>End *</label>
              <input type="datetime-local" value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))}
                className="themed-input w-full py-2.5 px-4 text-sm outline-none" id="sched-end" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="sched-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Schedule'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default ManagerScheduler
