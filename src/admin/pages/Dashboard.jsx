import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import SummaryCard from '../../components/SummaryCard';
import { authAPI, planAPI, subscriptionAPI, invoiceAPI } from '../../api/services';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlans: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [usersRes, plansRes, subsRes, invoicesRes] = await Promise.all([
          authAPI.getAllUsers({ limit: 5 }),
          planAPI.getAll(),
          subscriptionAPI.getAll(),
          invoiceAPI.getAll()
        ]);

        const usersData = usersRes.data.data;
        const plansData = plansRes.data.data || [];
        const subsData = subsRes.data.data.subscriptions || [];
        const invoicesData = invoicesRes.data.data.invoices || [];

        const activeSubs = subsData.filter(s => s.isActive);
        const revenue = invoicesData
          .filter(inv => inv.status === 'paid')
          .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        setStats({
          totalUsers: usersData.total || 0,
          totalPlans: plansData.length,
          activeSubscriptions: activeSubs.length,
          totalRevenue: revenue,
        });

        setRecentUsers(usersData.users || []);
        setSubscriptions(activeSubs.slice(0, 5));
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Icon icon="mdi:loading" width={48} className="animate-spin text-bluelogo" />
      </div>
    );
  }

  return (
    <div className='w-full px-8 py-6'>
      <div className='flex justify-between items-center pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>System Overview and Metrics</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard name="Total Users" count={stats.totalUsers} icon="fluent:people-12-regular" message="Registered" iconColor="#3b82f6" bgColor="rgba(59, 130, 246, 0.1)" />
        <SummaryCard name="Active Subscriptions" count={stats.activeSubscriptions} icon="mdi:crown" message="Currently active" iconColor="#10b981" bgColor="rgba(16, 185, 129, 0.1)" />
        <SummaryCard name="Payment Plans" count={stats.totalPlans} icon="mdi:cash-register" message="Available tiers" iconColor="#f59e0b" bgColor="rgba(245, 158, 11, 0.1)" />
        <SummaryCard name="Total Revenue" count={`$${stats.totalRevenue.toLocaleString()}`} icon="mdi:currency-usd" message="Paid invoices" iconColor="#8b5cf6" bgColor="rgba(139, 92, 246, 0.1)" />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className="themed-card rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recently Registered Users</h2>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No users found.</p>
            ) : (
              recentUsers.map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 rounded-lg border transition-all hover:scale-102" style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bluelogo/10 flex items-center justify-center text-bluelogo font-bold uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="themed-card rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Active Subscriptions</h2>
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No active subscriptions.</p>
            ) : (
              subscriptions.map(sub => (
                <div key={sub._id} className="flex items-center justify-between p-3 rounded-lg border transition-all hover:scale-102" style={{ borderColor: 'var(--border-secondary)', background: 'var(--bg-secondary)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <Icon icon="mdi:crown" width={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {sub.organization?.name || 'Unknown Organization'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Plan: {sub.plan?.name || 'Unknown Plan'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-1 rounded-md bg-green-500/10 text-green-500 font-bold uppercase tracking-wider border border-green-500/20">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;