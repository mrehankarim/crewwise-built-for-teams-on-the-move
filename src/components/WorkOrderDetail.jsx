import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useAuth } from '../context/AuthContext'
import { workOrderAPI, inventoryAPI, organizationAPI } from '../api/services'
import Modal from './Modal'
import toast from 'react-hot-toast'

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const statusStyles = {
  created:     { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'  },
  assigned:    { bg: 'bg-blue-100',   text: 'text-blue-600',   dot: 'bg-blue-500'  },
  in_progress: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500'},
  completed:   { bg: 'bg-green-100',  text: 'text-green-600',  dot: 'bg-green-500' },
  cancelled:   { bg: 'bg-red-100',    text: 'text-red-600',    dot: 'bg-red-500'   },
}
const priorityStyles = {
  regular:   { bg: 'bg-green-100',  text: 'text-green-700'  },
  urgent:    { bg: 'bg-orange-100', text: 'text-orange-700' },
  emergency: { bg: 'bg-red-100',    text: 'text-red-700'    },
}

const Badge = ({ value, map }) => {
  const s = map[value] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {value?.replace('_', ' ')}
    </span>
  )
}

const InfoChip = ({ icon, label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
    <div className="flex items-center gap-1.5">
      <Icon icon={icon} width={14} style={{ color: 'var(--text-secondary)' }} />
      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value || '—'}</span>
    </div>
  </div>
)

/* ─── Manage Parts Panel ─────────────────────────────────────────────────── */
const PartsPanel = ({ workOrder, orgId, onRefresh, isWorkerRole }) => {
  const [inventory, setInventory] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [returnItemId, setReturnItemId] = useState('')
  const [returnQty, setReturnQty] = useState(1)
  const [returning, setReturning] = useState(false)

  useEffect(() => {
    if (orgId) {
      inventoryAPI.getByOrganization(orgId, { limit: 200 })
        .then(res => {
          // backend returns { items, total } — not 'inventory'
          setInventory(res.data.data?.items || res.data.data?.inventory || [])
        })
        .catch(() => {})
    }
  }, [orgId])

  const handleAdd = async () => {
    if (!selectedItem || quantity < 1) return toast.error('Select item and valid quantity')
    setAdding(true)
    try {
      await workOrderAPI.addPart(workOrder._id, { inventoryItemId: selectedItem, quantity })
      toast.success('Part added — inventory deducted')
      setSelectedItem(''); setQuantity(1)
      onRefresh()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add part') }
    finally { setAdding(false) }
  }

  const handleRemove = async (itemId) => {
    if (!confirm('Remove this part? Inventory will be restored.')) return
    try {
      await workOrderAPI.removePart(workOrder._id, itemId)
      toast.success('Part removed — inventory restored')
      onRefresh()
    } catch { toast.error('Failed to remove part') }
  }

  const handleReturn = async () => {
    if (!returnItemId || returnQty < 1) return toast.error('Select a part and valid quantity to return')
    setReturning(true)
    try {
      await inventoryAPI.returnPart(workOrder._id, returnItemId, returnQty)
      toast.success('Parts returned to inventory')
      setReturnItemId(''); setReturnQty(1)
      onRefresh()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to return parts') }
    finally { setReturning(false) }
  }

  const parts = workOrder?.parts || []
  const usedItemIds = parts.map(p => (p.inventoryItem?._id || p.inventoryItem)?.toString())
  const availableInventory = inventory.filter(i => !usedItemIds.includes(i._id?.toString()))

  return (
    <div className="themed-card rounded-2xl p-5 space-y-4" style={{ border: '1px solid var(--border-primary)' }}>
      <div className="flex items-center gap-2">
        <Icon icon="mdi:toolbox-outline" width={20} style={{ color: 'var(--text-secondary)' }} />
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Parts & Inventory</h3>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-bluelogo/10 text-bluelogo">{parts.length}</span>
      </div>

      {parts.length === 0 ? (
        <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>No parts assigned yet.</p>
      ) : (
        <div className="space-y-2">
          {parts.map(p => (
            <div key={p._id} className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {p.inventoryItem?.name || 'Unknown Item'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  SKU: {p.inventoryItem?.sku || 'N/A'} · Qty used: <strong>{p.quantity}</strong>
                </p>
              </div>
              {/* Managers can forcibly remove; workers cannot */}
              {!isWorkerRole && (
                <button onClick={() => handleRemove(p.inventoryItem?._id || p.inventoryItem)}
                  title="Remove part (restores inventory)"
                  className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all">
                  <Icon icon="mdi:close-circle-outline" width={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <hr style={{ borderColor: 'var(--border-secondary)' }} />

      {/* ── WORKER: Return parts back to inventory ── */}
      {isWorkerRole && parts.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            Return Parts to Inventory
          </p>
          <div className="flex gap-2">
            <select value={returnItemId} onChange={e => setReturnItemId(e.target.value)}
              className="themed-input flex-1 py-2 px-3 text-sm outline-none">
              <option value="">Select part to return</option>
              {parts.map(p => (
                <option key={p._id} value={p.inventoryItem?._id || p.inventoryItem}>
                  {p.inventoryItem?.name || 'Unknown'} (used: {p.quantity})
                </option>
              ))}
            </select>
            <input type="number" min="1"
              max={parts.find(p => (p.inventoryItem?._id || p.inventoryItem)?.toString() === returnItemId)?.quantity || 99}
              value={returnQty} onChange={e => setReturnQty(Number(e.target.value))}
              className="themed-input w-16 py-2 px-2 text-sm outline-none text-center" />
            <button onClick={handleReturn} disabled={returning || !returnItemId}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all whitespace-nowrap">
              {returning ? <Icon icon="mdi:loading" className="animate-spin" width={16} /> : '↩ Return'}
            </button>
          </div>
        </div>
      )}

      {/* ── MANAGER: Add parts from inventory ── */}
      {!isWorkerRole && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
            Add Part from Inventory
          </p>
          {availableInventory.length === 0 ? (
            <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>
              No additional inventory items available.
            </p>
          ) : (
            <div className="flex gap-2">
              <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}
                className="themed-input flex-1 py-2 px-3 text-sm outline-none">
                <option value="">Select inventory item</option>
                {availableInventory.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.name} — {item.quantity} in stock
                  </option>
                ))}
              </select>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="themed-input w-16 py-2 px-2 text-sm outline-none text-center" />
              <button onClick={handleAdd} disabled={adding || !selectedItem}
                className="bg-bluelogo text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all">
                {adding ? <Icon icon="mdi:loading" className="animate-spin" width={16} /> : 'Add'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Assigned Workers Panel ─────────────────────────────────────────────── */
const AssignedWorkersPanel = ({ workOrder, orgId, role, onRefresh }) => {
  const [workers, setWorkers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('')
  const [assigning, setAssigning] = useState(false)

  const fetchAssignments = async () => {
    try {
      const res = await workOrderAPI.getAssignments(workOrder._id)
      setAssignments(res.data.data || [])
    } catch {}
  }

  useEffect(() => {
    fetchAssignments()
    if (orgId) {
      organizationAPI.getWorkers(orgId, { limit: 100 })
        .then(res => setWorkers(res.data.data?.workers || []))
        .catch(() => {})
    }
  }, [workOrder._id, orgId])

  const assignedIds = assignments.map(a => a.worker?._id)
  const available = workers.filter(w => !assignedIds.includes(w._id))

  const handleAssign = async () => {
    if (!selectedWorker) return toast.error('Select a worker')
    if (assignedIds.includes(selectedWorker)) {
      return toast.error('This worker is already assigned to this work order')
    }
    setAssigning(true)
    try {
      await workOrderAPI.assign({ workOrderId: workOrder._id, workerId: selectedWorker })
      toast.success('Worker assigned')
      setSelectedWorker('')
      fetchAssignments()
      onRefresh()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to assign') }
    finally { setAssigning(false) }
  }

  const handleUnassign = async (workerId) => {
    if (!confirm('Unassign this worker?')) return
    try {
      await workOrderAPI.unassign({ workOrderId: workOrder._id, workerId })
      toast.success('Worker unassigned')
      fetchAssignments()
      onRefresh()
    } catch { toast.error('Failed to unassign') }
  }

  return (
    <div className="themed-card rounded-2xl p-5 space-y-4" style={{ border: '1px solid var(--border-primary)' }}>
      <div className="flex items-center gap-2">
        <Icon icon="mdi:account-group-outline" width={20} style={{ color: 'var(--text-secondary)' }} />
        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Assigned Workers</h3>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-bluelogo/10 text-bluelogo">{assignments.length}</span>
      </div>

      {assignments.length === 0 ? (
        <p className="text-xs italic" style={{ color: 'var(--text-tertiary)' }}>No workers assigned yet.</p>
      ) : (
        <div className="space-y-2">
          {assignments.map(a => (
            <div key={a._id} className="flex items-center justify-between px-3 py-2 rounded-xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bluelogo/10 text-bluelogo flex items-center justify-center text-xs font-bold">
                  {a.worker?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{a.worker?.name}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-tertiary)' }}>{a.worker?.role}</p>
                </div>
              </div>
              <button onClick={() => handleUnassign(a.worker?._id)}
                className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all">
                <Icon icon="mdi:close-circle-outline" width={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <>
          <hr style={{ borderColor: 'var(--border-secondary)' }} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Assign Worker</p>
            <div className="flex gap-2">
              <select value={selectedWorker} onChange={e => setSelectedWorker(e.target.value)}
                className="themed-input flex-1 py-2 px-3 text-sm outline-none">
                <option value="">-- Select Worker --</option>
                {available.map(w => (
                  <option key={w._id} value={w._id}>{w.name} ({w.role})</option>
                ))}
              </select>
              <button onClick={handleAssign} disabled={assigning || !selectedWorker}
                className="bg-bluelogo text-white px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all">
                {assigning ? <Icon icon="mdi:loading" className="animate-spin" width={16} /> : 'Assign'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Main Detail Page ───────────────────────────────────────────────────── */
const WorkOrderDetail = () => {
  const { workOrderId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role
  const orgId = user?.organization?._id || user?.organization

  const [workOrder, setWorkOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', category: '', priority: 'regular' })
  const [saving, setSaving] = useState(false)

  const backPath = role === 'manager' ? '/manager/work-orders' : '/submanager/work-orders'

  const fetchWO = async () => {
    try {
      const res = await workOrderAPI.getById(workOrderId)
      setWorkOrder(res.data.data)
    } catch {
      toast.error('Failed to load work order')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchWO() }, [workOrderId])

  const handleStatusChange = async (newStatus) => {
    try {
      await workOrderAPI.updateStatus(workOrderId, newStatus)
      toast.success('Status updated')
      fetchWO()
    } catch { toast.error('Failed to update status') }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this work order? This cannot be undone.')) return
    try {
      await workOrderAPI.delete(workOrderId)
      toast.success('Work order deleted')
      navigate(backPath)
    } catch { toast.error('Failed to delete') }
  }

  const openEdit = () => {
    setEditForm({ title: workOrder.title, category: workOrder.category, priority: workOrder.priority })
    setEditOpen(true)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await workOrderAPI.update(workOrderId, editForm)
      toast.success('Work order updated')
      setEditOpen(false)
      fetchWO()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="w-full px-8 py-10 animate-pulse space-y-6">
        <div className="h-8 rounded w-1/3" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />)}
        </div>
        <div className="h-64 rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />
      </div>
    )
  }

  if (!workOrder) {
    return (
      <div className="w-full px-8 py-20 text-center">
        <Icon icon="mdi:clipboard-off-outline" width={56} className="mx-auto mb-4 text-gray-300" />
        <p className="font-semibold text-lg" style={{ color: 'var(--text-secondary)' }}>Work Order Not Found</p>
        <button onClick={() => navigate(backPath)} className="mt-4 text-bluelogo underline text-sm">← Back to Work Orders</button>
      </div>
    )
  }

  const st = statusStyles[workOrder.status] || statusStyles.created

  return (
    <div className="w-full px-6 pb-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 pt-5 pb-6 animate-slideDown">
        <button onClick={() => navigate(backPath)}
          className="flex items-center gap-1 text-sm font-semibold hover:text-bluelogo transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <Icon icon="mdi:arrow-left" width={18} />
          Back
        </button>
        <span style={{ color: 'var(--border-secondary)' }}>/</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Work Orders</span>
        <span style={{ color: 'var(--border-secondary)' }}>/</span>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{workOrder.title}</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={openEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
            <Icon icon="mdi:pencil-outline" width={16} />
            Edit
          </button>
          <button onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
            <Icon icon="mdi:trash-can-outline" width={16} />
            Delete
          </button>
        </div>
      </div>

      {/* ── Title + Badges + Status Changer ── */}
      <div className="themed-card rounded-2xl p-6 mb-5 animate-slideUp" style={{ border: '1px solid var(--border-primary)' }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge value={workOrder.status} map={statusStyles} />
              <Badge value={workOrder.priority} map={priorityStyles} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{workOrder.title}</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Created {new Date(workOrder.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
              {workOrder.createdBy?.name && <> by <strong>{workOrder.createdBy.name}</strong></>}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Change Status</p>
            <select value={workOrder.status} onChange={e => handleStatusChange(e.target.value)}
              className="themed-input py-2 px-3 text-sm outline-none rounded-xl min-w-36">
              <option value="created">Created</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 pt-6" style={{ borderTop: '1px solid var(--border-secondary)' }}>
          <InfoChip icon="mdi:tag-outline"        label="Category" value={workOrder.category} />
          <InfoChip icon="mdi:account-outline"    label="Client"   value={workOrder.client?.name} />
          <InfoChip icon="mdi:email-outline"      label="Client Email" value={workOrder.client?.email} />
          <InfoChip icon="mdi:phone-outline"      label="Client Phone" value={workOrder.client?.phoneNumber} />
        </div>
      </div>

      {/* ── Side-by-side panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <PartsPanel workOrder={workOrder} orgId={orgId} onRefresh={fetchWO} isWorkerRole={role === 'technician' || role === 'contractor'} />
        <AssignedWorkersPanel workOrder={workOrder} orgId={orgId} role={role} onRefresh={fetchWO} />
      </div>

      {/* ── Edit Modal ── */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Work Order" size="sm">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Title *</label>
            <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="Work order title" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category *</label>
            <input type="text" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none" placeholder="e.g. Electrical" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>Priority</label>
            <select value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: e.target.value }))}
              className="themed-input w-full py-2.5 px-4 text-sm outline-none">
              <option value="regular">Regular</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-bluelogo text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            {saving && <Icon icon="mdi:loading" className="animate-spin" width={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default WorkOrderDetail
