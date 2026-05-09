import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { notificationAPI } from '../../api/services'
import toast from 'react-hot-toast'

const SubManagerNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getMy();
      setNotifications(res.data.data || []);
    } catch (err) { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try { await notificationAPI.markRead(id); fetchNotifications(); }
    catch { toast.error('Failed'); }
  };

  const handleMarkAllRead = async () => {
    try { await notificationAPI.markAllRead(); toast.success('All marked as read'); fetchNotifications(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try { await notificationAPI.delete(id); toast.success('Deleted'); fetchNotifications(); }
    catch { toast.error('Failed'); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className='w-full px-8 py-6'><div className='space-y-3'>{[1,2,3,4].map(i=><div key={i} className='h-16 loading-skeleton'/>)}</div></div>;

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold'>Notifications</h1>
          <p className='text-sm text-gray-500'>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className='text-sm text-bluelogo font-semibold hover:underline flex items-center gap-1'>
            <Icon icon="mdi:check-all" width={18} /> Mark all read
          </button>
        )}
      </div>

      <div className='space-y-2'>
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400 animate-fadeIn">
            <Icon icon="mdi:bell-off-outline" width={48} className="mx-auto mb-3" />
            <p className="font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : notifications.map((n, idx) => (
          <div key={n._id} className={`flex items-start gap-4 px-5 py-4 rounded-xl border transition-all duration-300 hover:shadow-md animate-slideUp ${n.isRead ? 'bg-white border-gray-100' : 'bg-bluelogo/5 border-bluelogo/10'}`}
            style={{ animationDelay: `${idx * 0.04}s` }}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.isRead ? 'bg-gray-100' : 'bg-bluelogo/10'}`}>
              <Icon icon={n.type === 'work_order' ? 'akar-icons:clipboard' : n.type === 'schedule' ? 'uil:calendar' : 'lucide:bell'} width={20} className={n.isRead ? 'text-gray-400' : 'text-bluelogo'} />
            </div>
            <div className='flex-1 min-w-0'>
              <p className={`text-sm ${n.isRead ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>{n.message || n.title}</p>
              <p className='text-xs text-gray-400 mt-1'>{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0'>
              {!n.isRead && (
                <button onClick={() => handleMarkRead(n._id)} className='text-bluelogo hover:bg-bluelogo/10 p-1.5 rounded-lg transition-colors' title="Mark as read">
                  <Icon icon="mdi:check" width={16} />
                </button>
              )}
              <button onClick={() => handleDelete(n._id)} className='text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors' title="Delete">
                <Icon icon="mdi:close" width={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubManagerNotifications
