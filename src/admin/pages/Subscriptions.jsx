import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { subscriptionAPI } from '../../api/services';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.getAll();
      setSubscriptions(res.data.data.subscriptions || []);
    } catch (err) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await subscriptionAPI.cancel(id);
      toast.success('Subscription cancelled successfully');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleActivate = async (id) => {
    if (!window.confirm('Are you sure you want to activate this subscription?')) return;
    try {
      await subscriptionAPI.activate(id);
      toast.success('Subscription activated successfully');
      fetchSubscriptions();
    } catch (err) {
      toast.error('Failed to activate subscription');
    }
  };

  return (
    <div className='w-full p-8'>
      <div className='flex justify-between items-center pb-6'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>System Subscriptions</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Manage and monitor all organization subscriptions</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
            <Icon icon="mdi:loading" width={40} className="animate-spin text-bluelogo" />
        </div>
      ) : (
        <div className="themed-card rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {subscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{sub.organization?.name || 'Unknown'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-bluelogo">{sub.plan?.name || 'Unknown'}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${sub.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        {sub.isActive ? (
                          <button onClick={() => handleCancel(sub._id)} className="p-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:text-red-400" title="Cancel Subscription">
                            <Icon icon="mdi:cancel" width={18} />
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(sub._id)} className="p-2 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors dark:bg-green-900/30 dark:text-green-400" title="Activate Subscription">
                            <Icon icon="mdi:check-circle" width={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
                      <Icon icon="mdi:card-account-details-outline" width={48} className="mx-auto mb-3 opacity-50" />
                      <p>No subscriptions found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
