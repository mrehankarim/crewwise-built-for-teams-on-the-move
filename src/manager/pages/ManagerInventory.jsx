import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '../../context/AuthContext'
import { inventoryAPI } from '../../api/services'
import Modal from '../../components/Modal'
import IconTextButton from '../../components/IconTextButton'
import SummaryCard from '../../components/SummaryCard'
import toast from 'react-hot-toast'

const ManagerInventory = () => {
  const { user } = useAuth();
  const orgId = user?.organization?._id || user?.organization;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', quantity: '', price: '' });

  const fetchItems = async () => {
    if (!orgId) return;
    try {
      const res = await inventoryAPI.getByOrganization(orgId);
      setItems(res.data.data.items || []);
    } catch (err) { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [orgId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.quantity || !form.price) { toast.error('All fields required'); return; }
    setCreating(true);
    try {
      await inventoryAPI.create({ ...form, quantity: Number(form.quantity), price: Number(form.price), organization: orgId });
      toast.success('Item created!');
      setShowCreate(false);
      setForm({ name: '', sku: '', quantity: '', price: '' });
      fetchItems();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try { await inventoryAPI.delete(id); toast.success('Deleted'); fetchItems(); }
    catch (err) { toast.error('Failed'); }
  };

  const filtered = items.filter(i => i.name?.toLowerCase().includes(search.toLowerCase()) || i.sku?.toLowerCase().includes(search.toLowerCase()));
  const totalValue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const lowStock = items.filter(i => i.quantity < 10).length;

  if (loading) {
    return <div className='w-full px-8 py-6'><div className='space-y-4'>{[1, 2, 3].map(i => <div key={i} className='h-16 loading-skeleton' />)}</div></div>;
  }

  return (
    <div className='w-full px-8 pb-8'>
      <div className='flex justify-between pt-4 pb-6 animate-slideDown'>
        <div>
          <h1 className='text-2xl font-bold' style={{ color: 'var(--text-primary)' }}>Inventory</h1>
          <p className='text-sm' style={{ color: 'var(--text-secondary)' }}>Manage parts and supplies</p>
        </div>
        <IconTextButton text="Add Item" icon="mdi:plus" onClickHandler={() => setShowCreate(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="animate-slideUp stagger-1"><SummaryCard name="Total Items" count={items.length} icon="mdi:package-variant" message="In inventory" iconColor="#2563EB" bgColor="#DBEAFE" /></div>
        <div className="animate-slideUp stagger-2"><SummaryCard name="Total Value" count={`$${totalValue.toLocaleString()}`} icon="mdi:currency-usd" message="Stock value" iconColor="#16A34A" bgColor="#DCFCE7" /></div>
        <div className="animate-slideUp stagger-3"><SummaryCard name="Low Stock" count={lowStock} icon="mdi:alert-circle" message="Below 10 units" iconColor="#F59E0B" bgColor="#FEF3C7" /></div>
      </div>

      <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search inventory..."
        className="themed-input w-full px-3 py-2 rounded-lg text-sm focus:outline-none mb-4" id="inv-search" />

      <div className="themed-card rounded-xl border overflow-hidden animate-fadeIn" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold uppercase" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          <div className="col-span-4">Item</div>
          <div className="col-span-2">SKU</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Icon icon="mdi:package-variant-closed-remove" width={40} className="mx-auto mb-2" />
            <p className="text-sm">No items found</p>
          </div>
        ) : filtered.map((item, idx) => (
          <div key={item._id} className="grid grid-cols-12 gap-2 px-5 py-3.5 border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors items-center animate-slideUp"
            style={{ animationDelay: `${idx * 0.03}s`, borderColor: 'var(--border-secondary)' }}>
            <div className="col-span-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{item.sku}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className={`text-sm font-medium ${item.quantity < 10 ? 'text-orange-500' : ''}`} style={item.quantity >= 10 ? { color: 'var(--text-primary)' } : {}}>{item.quantity}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>${item.price}</span>
            </div>
            <div className="col-span-2 flex justify-end">
              <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <Icon icon="mdi:trash-can-outline" width={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Inventory Item" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="themed-input w-full rounded-lg py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="inv-name" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>SKU *</label>
            <input type="text" value={form.sku} onChange={(e) => setForm(f => ({ ...f, sku: e.target.value }))}
              className="themed-input w-full rounded-lg py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="inv-sku" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Quantity *</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="inv-qty" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Price ($) *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm outline-none focus:ring-2 focus:ring-bluelogo/30" id="inv-price" />
            </div>
          </div>
          <button type="submit" disabled={creating}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" id="inv-submit">
            {creating && <Icon icon="mdi:loading" width={20} className="animate-spin" />}
            {creating ? 'Creating...' : 'Add Item'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default ManagerInventory
