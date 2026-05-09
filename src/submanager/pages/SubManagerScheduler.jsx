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

const SubManagerScheduler = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerSchedules, setWorkerSchedules] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ worker: '', workOrder: '', startTime: '', endTime: '' });

  useEffect(() => {
    if (!orgId) return;
    const fetch = async () => {
      try {
        const res = await organizationAPI.getWorkers(orgId, { limit: 20 });
        const wks = res.data.data?.workers || [];
        setWorkers(wks);
        const map = {};
        await Promise.all(wks.slice(0, 10).map(async (w) => {
          try { const s = await scheduleAPI.getWorkerSchedules(w._id); map[w._id] = s.data.data || []; }
          catch { map[w._id] = []; }
        }));
        setWorkerSchedules(map);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.worker || !form.workOrder || !form.startTime || !form.endTime) { toast.error('All fields required'); return; }
    setCreating(true);
    try {
      await scheduleAPI.create(form);
      toast.success('Schedule created!');
      setShowCreate(false);
      setForm({ worker: '', workOrder: '', startTime: '', endTime: '' });
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

  if (loading) return <div className='w-full px-8 py-6'><div className='space-y-4'>{[1,2,3].map(i=><div key={i} className='h-20 loading-skeleton'/>)}</div></div>;

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div><h1 className='text-2xl font-bold'>Schedule & Dispatch</h1><p className='text-sm text-gray-500'>Plan and manage work assignments</p></div>
        <IconTextButton text="Schedule Job" icon="uil:schedule" onClickHandler={() => setShowCreate(true)} />
      </div>
      <div className='w-full bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 mb-4 animate-fadeIn'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-lg font-bold font-roboto'>{weekDates[0]?.toLocaleDateString('en-US',{month:'long',day:'numeric'})} – {weekDates[6]?.toLocaleDateString('en-US',{month:'long',day:'numeric'})}, {now.getFullYear()}</p>
          <p className='text-gray-400 text-sm'>Weekly View</p>
        </div>
        <div className="overflow-x-auto"><div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-0 border-b border-gray-200 pb-2 mb-2">
            <div className="text-xs font-semibold text-gray-500 px-2">Worker</div>
            {days.map((day,i)=>(<div key={day} className="text-center"><p className="text-xs font-semibold text-gray-500">{day}</p><p className="text-xs text-gray-400">{weekDates[i]?.getDate()}</p></div>))}
          </div>
          {workers.length===0?(<div className="text-center py-12 text-gray-400"><Icon icon="mdi:calendar-blank" width={40} className="mx-auto mb-2"/><p className="text-sm">No workers</p></div>):workers.map((w,idx)=>(<div key={w._id} className="grid grid-cols-8 gap-0 py-2 border-b border-gray-50 hover:bg-gray-50/50 transition-colors animate-slideUp" style={{animationDelay:`${idx*0.05}s`}}>
            <div className="flex items-center gap-2 px-2"><div className="w-7 h-7 bg-bluelogo/10 rounded-full flex items-center justify-center text-xs font-bold text-bluelogo">{w.name?.charAt(0)}</div><span className="text-xs font-medium text-gray-700 truncate">{w.name}</span></div>
            {days.map((_,di)=>{const scheds=(workerSchedules[w._id]||[]).filter(s=>new Date(s.startTime).toDateString()===weekDates[di]?.toDateString());return(<div key={di} className="px-1">{scheds.length>0?scheds.map(s=>(<div key={s._id} className={`text-[10px] px-1.5 py-1 rounded border ${statusColors[s.status]||'bg-gray-50'} mb-0.5 truncate`}>{s.workOrder?.title||'Task'}</div>)):<div className="h-8"/>}</div>);})}
          </div>))}
        </div></div>
      </div>
      <div className='flex gap-4 animate-fadeIn'>{Object.entries(statusColors).map(([k,v])=>(<div key={k} className="flex items-center gap-2"><div className={`w-3 h-3 rounded ${v.split(' ')[0]}`}/><span className="text-xs text-gray-500 capitalize">{k.replace('_',' ')}</span></div>))}</div>
      <Modal isOpen={showCreate} onClose={()=>setShowCreate(false)} title="Schedule Job" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Worker *</label><select value={form.worker} onChange={e=>setForm(f=>({...f,worker:e.target.value}))} className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-sched-worker"><option value="">Select</option>{workers.map(w=><option key={w._id} value={w._id}>{w.name}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Work Order ID *</label><input type="text" value={form.workOrder} onChange={e=>setForm(f=>({...f,workOrder:e.target.value}))} className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-sched-wo"/></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-semibold text-gray-700 mb-1">Start *</label><input type="datetime-local" value={form.startTime} onChange={e=>setForm(f=>({...f,startTime:e.target.value}))} className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-sched-start"/></div><div><label className="block text-sm font-semibold text-gray-700 mb-1">End *</label><input type="datetime-local" value={form.endTime} onChange={e=>setForm(f=>({...f,endTime:e.target.value}))} className="w-full bg-gray-50 rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="sub-sched-end"/></div></div>
          <button type="submit" disabled={creating} className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="sub-sched-submit">{creating&&<Icon icon="mdi:loading" width={20} className="animate-spin"/>}{creating?'Creating...':'Schedule'}</button>
        </form>
      </Modal>
    </div>
  )
}

export default SubManagerScheduler
