import React, { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNotification } from '../context/NotificationContext';

const NotificationsPage = ({ title, subtitle }) => {
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllRead, 
    deleteNotification, 
    deleteAll,
    unreadCount 
  } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'assignment': return 'mdi:account-plus';
      case 'status_change': return 'mdi:progress-check';
      case 'schedule': return 'uil:calendar';
      case 'part': return 'mdi:package-variant';
      default: return 'lucide:bell';
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'assignment': return 'bg-blue-500/10 text-blue-500';
      case 'status_change': return 'bg-green-500/10 text-green-500';
      case 'schedule': return 'bg-amber-500/10 text-amber-500';
      case 'part': return 'bg-indigo-500/10 text-indigo-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className='w-full px-8 py-6'>
        <div className='animate-pulse space-y-3'>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className='h-20 bg-gray-100 dark:bg-gray-800 rounded-xl' />)}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full px-4 md:px-8 pb-8'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center pt-4 pb-6 gap-4 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>
            {subtitle || `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead} 
              className='text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-200 border border-bluelogo/20 text-bluelogo hover:bg-bluelogo hover:text-white flex items-center gap-2'
            >
              <Icon icon="mdi:check-all" width={16} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              onClick={() => confirm('Are you sure you want to delete all notifications?') && deleteAll()} 
              className='text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-200 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2'
            >
              <Icon icon="mdi:trash-can-outline" width={16} /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className='space-y-3'>
        {notifications.length === 0 ? (
          <div className="text-center py-24 themed-card rounded-2xl border border-dashed border-[var(--border-primary)] animate-fadeIn">
            <div className="w-16 h-16 bg-gray-500/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:bell-off-outline" width={32} className="text-gray-400" />
            </div>
            <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>No notifications yet</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>We'll notify you when something important happens.</p>
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div 
              key={n._id} 
              className={`group flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 hover:shadow-lg animate-slideUp 
                ${n.isRead ? 'themed-card border-[var(--border-primary)] opacity-80 hover:opacity-100' : 'bg-bluelogo/[0.03] border-bluelogo/20 shadow-sm'}`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${getIconBg(n.type)}`}>
                <Icon icon={getIcon(n.type)} width={24} />
              </div>
              
              <div className='flex-1 min-w-0 py-0.5'>
                <div className="flex items-center gap-2 mb-1">
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-bluelogo animate-pulse" />}
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${n.isRead ? 'text-gray-400' : 'text-bluelogo'}`}>
                    {n.type?.replace('_', ' ') || 'Notification'}
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${n.isRead ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-gray-100'}`}>
                  {n.message}
                </p>
                <p className='text-[10px] mt-2 font-medium flex items-center gap-1' style={{ color: 'var(--text-tertiary)' }}>
                  <Icon icon="mdi:clock-outline" width={12} />
                  {new Date(n.createdAt).toLocaleString(undefined, { 
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>

              <div className='flex flex-col gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                {!n.isRead && (
                  <button 
                    onClick={() => markAsRead(n._id)} 
                    className='w-8 h-8 flex items-center justify-center bg-bluelogo/10 text-bluelogo hover:bg-bluelogo hover:text-white rounded-lg transition-all shadow-sm'
                    title="Mark as read"
                  >
                    <Icon icon="mdi:check" width={18} />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(n._id)} 
                  className='w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm'
                  title="Delete"
                >
                  <Icon icon="mdi:trash-can-outline" width={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
