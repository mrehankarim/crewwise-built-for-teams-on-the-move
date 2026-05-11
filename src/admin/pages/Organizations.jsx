import { useState, useEffect } from 'react';
import SummaryCard from '../../components/SummaryCard';
import { Icon } from '@iconify/react';
import { organizationAPI } from '../../api/services';
import toast from 'react-hot-toast';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, industries: {} });

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await organizationAPI.getAll();
      const fetched = res.data.data.organizations || [];
      setOrganizations(fetched);
      
      const industries = {};
      fetched.forEach(org => {
          if (org.industry) industries[org.industry] = (industries[org.industry] || 0) + 1;
      });

      setStats({
        total: res.data.data.total || 0,
        active: fetched.filter(org => org.isActive).length,
        industries: industries
      });
    } catch (err) {
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const filteredOrgs = organizations.filter(org =>
    org.name?.toLowerCase().includes(search.toLowerCase()) ||
    org.industry?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Organizations</h1>
          <p className='text-sm' style={{ color: 'var(--text-tertiary)' }}>Manage all registered companies and entities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard name="Total Orgs" count={stats.total} icon="mdi:domain" message="Registered" iconColor="#2563EB" bgColor="var(--accent-light)" />
        <SummaryCard name="Active" count={stats.active} icon="mdi:check-decagram" message="Operational" iconColor="#16A34A" bgColor="rgba(22, 163, 74, 0.1)" />
        <SummaryCard name="Industries" count={Object.keys(stats.industries).length} icon="mdi:factory" message="Diverse sectors" iconColor="#F59E0B" bgColor="rgba(245, 158, 11, 0.1)" />
        <SummaryCard name="New This Month" count={organizations.filter(o => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} icon="mdi:plus-circle-outline" message="Growth" iconColor="#7C3AED" bgColor="rgba(124, 58, 237, 0.1)" />
      </div>

      <div className="flex mb-6 animate-fadeIn">
        <div className="relative flex-1">
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={20} />
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search organizations by name or industry..."
            className="themed-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all"
          />
        </div>
      </div>

      <div className='themed-card rounded-2xl overflow-hidden animate-slideUp'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Organization</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Industry</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Location</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Status</th>
              <th className='px-6 py-4 text-xs font-bold uppercase tracking-wider' style={{ color: 'var(--text-tertiary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y' style={{ divideColor: 'var(--border-secondary)' }}>
            {filteredOrgs.length === 0 ? (
                <tr>
                    <td colSpan="5" className="px-6 py-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
                        No organizations found.
                    </td>
                </tr>
            ) : filteredOrgs.map((org) => (
              <tr key={org._id} className='hover:bg-gray-50/5 transition-colors' onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-sm'>
                      {org.name?.charAt(0)}
                    </div>
                    <div>
                      <p className='text-sm font-bold' style={{ color: 'var(--text-primary)' }}>{org.name}</p>
                      <p className='text-[10px]' style={{ color: 'var(--text-tertiary)' }}>ID: {org._id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <span className='text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md' style={{ border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    {org.industry || 'General'}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm' style={{ color: 'var(--text-secondary)' }}>
                  {org.location || 'Not specified'}
                </td>
                <td className='px-6 py-4'>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${org.isActive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {org.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <button className='text-gray-400 hover:text-bluelogo transition-colors'>
                    <Icon icon="mdi:dots-horizontal" width={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organizations;
