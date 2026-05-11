import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { attendanceAPI, organizationAPI } from '../../api/services'

const ManagerAttendance = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [records, setRecords] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    if (!orgId) return;
    const fetchData = async () => {
      try {
        const [attRes, wkRes] = await Promise.all([
          attendanceAPI.getOrganizationAttendance(orgId),
          organizationAPI.getWorkers(orgId, { limit: 50 }),
        ]);
        setRecords(attRes.data.data || []);
        setWorkers(wkRes.data.data?.workers || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [orgId]);

  const filtered = selectedWorker
    ? records.filter(r => r.worker?._id === selectedWorker || r.worker === selectedWorker)
    : records;

  if (loading) return <div className='w-full px-8 py-6'><div className='space-y-3'>{[1,2,3,4].map(i=><div key={i} className='h-14 loading-skeleton'/>)}</div></div>;

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Attendance</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Track worker attendance records</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 animate-fadeIn">
        <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)}
          className="themed-input px-3 py-2 rounded-lg text-sm min-w-[200px]" id="att-worker-filter">
          <option value="">All Workers</option>
          {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
        </select>
        <div className="flex items-center gap-2 bg-bluelogo/5 px-4 py-2 rounded-xl">
          <Icon icon="mdi:clipboard-list" width={18} className="text-bluelogo" />
          <span className="text-sm font-semibold text-bluelogo">{filtered.length} records</span>
        </div>
      </div>

      <div className="themed-card rounded-xl border overflow-hidden animate-fadeIn" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          <div className="col-span-3">Worker</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Check In</div>
          <div className="col-span-2">Check Out</div>
          <div className="col-span-2">Hours</div>
          <div className="col-span-1">Status</div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Icon icon="mdi:calendar-blank-outline" width={48} className="mx-auto mb-3" />
            <p className="font-medium">No attendance records</p>
            <p className="text-sm">Records appear when workers check in via the mobile app</p>
          </div>
        ) : filtered.map((rec, idx) => {
          const checkIn = rec.checkIn ? new Date(rec.checkIn) : null;
          const checkOut = rec.checkOut ? new Date(rec.checkOut) : null;
          const hours = checkIn && checkOut ? ((checkOut - checkIn) / 3600000).toFixed(1) : '-';
          return (
            <div key={rec._id || idx} className="grid grid-cols-12 gap-2 px-5 py-3.5 border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors items-center animate-slideUp"
              style={{ animationDelay: `${idx * 0.03}s`, borderColor: 'var(--border-secondary)' }}>
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-7 h-7 bg-bluelogo/10 rounded-full flex items-center justify-center text-xs font-bold text-bluelogo">
                  {(rec.worker?.name || 'W').charAt(0)}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{rec.worker?.name || 'Unknown'}</span>
              </div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{checkIn ? checkIn.toLocaleDateString() : '-'}</div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{checkIn ? checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{checkOut ? checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
              <div className="col-span-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{hours}h</div>
              <div className="col-span-1">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${checkOut ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {checkOut ? 'Done' : 'Active'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ManagerAttendance
