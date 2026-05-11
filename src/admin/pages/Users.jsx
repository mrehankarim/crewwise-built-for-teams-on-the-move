import { useState, useEffect } from 'react';
import SummaryCard from '../../components/SummaryCard';
import { Icon } from '@iconify/react';
import { authAPI } from '../../api/services';
import toast from 'react-hot-toast';

const Workers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [stats, setStats] = useState({ total: 0, technicians: 0, contractors: 0, managers: 0 });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (roleFilter) params.role = roleFilter;
      const res = await authAPI.getAllUsers(params);
      const fetchedUsers = res.data.data.users || [];
      setUsers(fetchedUsers);

      setStats({
        total: res.data.data.total || 0,
        technicians: fetchedUsers.filter(u => u.role === 'technician').length,
        contractors: fetchedUsers.filter(u => u.role === 'contractor').length,
        managers: fetchedUsers.filter(u => u.role === 'manager').length,
      });
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Icon icon="mdi:loading" width={40} className="animate-spin text-bluelogo" />
      </div>
    );
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>User Management</h1>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>View and manage all system users across organizations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard name="Total Users" count={stats.total} icon="mdi:account-group" message="System-wide" iconColor="#2563EB" bgColor="var(--accent-light)" />
        <SummaryCard name="Technicians" count={stats.technicians} icon="mdi:tools" message="Field staff" iconColor="#F59E0B" bgColor="rgba(245, 158, 11, 0.1)" />
        <SummaryCard name="Contractors" count={stats.contractors} icon="mdi:briefcase-account" message="External partners" iconColor="#7C3AED" bgColor="rgba(124, 58, 237, 0.1)" />
        <SummaryCard name="Managers" count={stats.managers} icon="mdi:account-tie" message="Org owners" iconColor="#16A34A" bgColor="rgba(22, 163, 74, 0.1)" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fadeIn">
        <div className="relative flex-1">
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={20} />
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by name or email..."
            className="themed-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all"
          />
        </div>
        <select
          className="themed-input px-4 py-2.5 rounded-xl text-sm outline-none"
          onChange={(e) => setRoleFilter(e.target.value)}
          value={roleFilter}
        >
          <option value="">All Roles</option>
          <option value="manager">Managers</option>
          <option value="submanager">Sub-Managers</option>
          <option value="technician">Technicians</option>
          <option value="contractor">Contractors</option>
        </select>
      </div>

      <div className='themed-card rounded-2xl overflow-hidden animate-slideUp'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>User</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Role</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Organization</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Status</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Joined</th>
            </tr>
          </thead>
          <tbody className='divide-y' style={{ divideColor: 'var(--border-secondary)' }}>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
                  No users found matching your criteria.
                </td>
              </tr>
            ) : filteredUsers.map((u) => (
              <tr key={u._id} className='hover:bg-gray-50/5 transition-colors' onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-bluelogo/10 flex items-center justify-center text-bluelogo font-bold text-xs'>
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className='text-sm font-semibold' style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                      <p className='text-xs' style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-100/10 rounded-md' style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                    {u.role}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>{u.organization?.name || 'N/A'}</p>
                </td>
                <td className='px-6 py-4'>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.isActive ? 'bg-green-100/10 text-green-500' : 'bg-red-100/10 text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm' style={{ color: 'var(--text-tertiary)' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Workers;
