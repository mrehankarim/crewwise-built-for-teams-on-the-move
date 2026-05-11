import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { notificationAPI } from '../../api/services';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getMy();
      const data = res.data.data;
      setNotifications(data.notifications || []);
      setStats({
        total: data.total || 0,
        unread: data.unreadCount || 0
      });
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setStats(prev => ({ ...prev, unread: 0 }));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setStats(prev => ({
        total: prev.total - 1,
        unread: deleted && !deleted.isRead ? prev.unread - 1 : prev.unread
      }));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Icon icon="mdi:loading" width={40} className="animate-spin text-bluelogo" />
      </div>
    );
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between items-center pt-4 pb-8 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>System Notifications</h1>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Platform alerts and system-wide updates</p>
        </div>
        {stats.unread > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className='text-xs font-bold uppercase tracking-widest text-bluelogo hover:underline px-4 py-2 rounded-lg transition-all hover:bg-bluelogo/5'
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className='max-w-4xl space-y-3'>
        {notifications.length === 0 ? (
          <div className="text-center py-24 animate-fadeIn" style={{ color: 'var(--text-tertiary)' }}>
            <Icon icon="mdi:bell-off-outline" width={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold">All caught up!</p>
            <p className="text-sm opacity-60">No new notifications at the moment.</p>
          </div>
        ) : notifications.map((n, idx) => (
          <div 
            key={n._id} 
            className={`group flex items-start gap-4 px-6 py-5 rounded-2xl border transition-all duration-300 hover:shadow-lg animate-slideUp
              ${n.isRead ? 'opacity-80' : 'ring-1 ring-bluelogo/20 shadow-md shadow-bluelogo/5'}`}
            style={{ 
              animationDelay: `${idx * 0.05}s`,
              background: n.isRead ? 'var(--bg-card)' : 'var(--bg-secondary)',
              borderColor: n.isRead ? 'var(--border-primary)' : 'var(--bluelogo-light)'
            }}
          >
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${n.isRead ? 'bg-gray-100/10' : 'bg-bluelogo/10 text-bluelogo'}`}>
              <Icon icon={n.workOrder ? "akar-icons:clipboard" : "mdi:information-outline"} width={20} height={20} />
            </div>

            <div className='flex-1'>
              <div className='flex justify-between items-start mb-1'>
                <h3 className={`text-sm font-bold ${n.isRead ? 'text-gray-400' : ''}`} style={!n.isRead ? { color: 'var(--text-primary)' } : {}}>
                  {n.workOrder ? `Work Order: ${n.workOrder.title}` : 'System Update'}
                </h3>
                <span className='text-[10px] font-medium uppercase tracking-widest' style={{ color: 'var(--text-tertiary)' }}>
                  {new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className='text-sm leading-relaxed mb-3' style={{ color: n.isRead ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>
                {n.message}
              </p>
              
              <div className='flex items-center gap-4'>
                {!n.isRead && (
                  <button 
                    onClick={() => handleMarkRead(n._id)}
                    className='text-[10px] font-bold uppercase tracking-widest text-bluelogo transition-all hover:scale-110 active:scale-95'
                  >
                    Mark as read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(n._id)}
                  className='text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all hover:scale-110 active:scale-95'
                >
                  Delete
                </button>
              </div>
            </div>
            
            {!n.isRead && (
              <div className="w-2 h-2 rounded-full bg-bluelogo mt-1.5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
