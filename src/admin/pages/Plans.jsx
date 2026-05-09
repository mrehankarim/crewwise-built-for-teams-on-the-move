import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { planAPI } from '../../api/services';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 30,
    maxUsers: 1,
    maxWorkOrders: 100,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await planAPI.getAll();
      setPlans(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        duration: plan.duration,
        maxUsers: plan.maxUsers,
        maxWorkOrders: plan.maxWorkOrders,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: 30,
        maxUsers: 5,
        maxWorkOrders: 500,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await planAPI.update(editingPlan._id, formData);
        toast.success('Plan updated successfully');
      } else {
        await planAPI.create(formData);
        toast.success('Plan created successfully');
      }
      closeModal();
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await planAPI.delete(id);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (err) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className='w-full p-8'>
      <div className='flex justify-between items-center pb-6'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Payment Plans</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Manage your SaaS subscription tiers</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-bluelogo text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Icon icon="mdi:plus" width={20} />
          Add Plan
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
            <Icon icon="mdi:loading" width={40} className="animate-spin text-bluelogo" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="rounded-xl border p-6 flex flex-col transition-all hover:shadow-lg" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openModal(plan)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400">
                    <Icon icon="mdi:pencil" width={18} />
                  </button>
                  <button onClick={() => handleDelete(plan._id)} className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:text-red-400">
                    <Icon icon="mdi:delete" width={18} />
                  </button>
                </div>
              </div>
              <div className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                ${plan.price} <span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>/ {plan.duration} days</span>
              </div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{plan.description}</p>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon icon="mdi:check-circle" className="text-green-500" width={18} />
                  Max Users: <strong style={{ color: 'var(--text-primary)' }}>{plan.maxUsers}</strong>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Icon icon="mdi:check-circle" className="text-green-500" width={18} />
                  Max Work Orders: <strong style={{ color: 'var(--text-primary)' }}>{plan.maxWorkOrders}</strong>
                </div>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
              <Icon icon="mdi:package-variant" width={48} className="mx-auto mb-3 opacity-50" />
              <p>No plans created yet.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editingPlan ? "Edit Plan" : "Add Plan"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Plan Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="themed-input w-full rounded-lg py-2 px-3 text-sm" placeholder="e.g. Pro Plan" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="themed-input w-full rounded-lg py-2 px-3 text-sm" placeholder="e.g. Best for growing teams" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Price ($)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="themed-input w-full rounded-lg py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Duration (Days)</label>
              <input type="number" name="duration" value={formData.duration} onChange={handleChange} required className="themed-input w-full rounded-lg py-2 px-3 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Max Users</label>
              <input type="number" name="maxUsers" value={formData.maxUsers} onChange={handleChange} required className="themed-input w-full rounded-lg py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Max Work Orders</label>
              <input type="number" name="maxWorkOrders" value={formData.maxWorkOrders} onChange={handleChange} required className="themed-input w-full rounded-lg py-2 px-3 text-sm" />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>Cancel</button>
            <button type="submit" className="bg-bluelogo text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Plans;
