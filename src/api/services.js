import api from './axios';

export const organizationAPI = {
  create: (data) => api.post('/organizations', data),
  getDetails: (orgId) => api.get(`/organizations/${orgId}`),
  update: (orgId, data) => api.put(`/organizations/${orgId}`, data),
  getDashboard: (orgId) => api.get(`/organizations/${orgId}/dashboard`),

  // One-step user creation: register + add to org + store temp password
  createManagedUser: (data) => api.post('/organizations/managed-user/create', data),
  getManagedUserCredentials: (userId) => api.get(`/organizations/managed-user/${userId}/credentials`),

  getSubmanagers: (orgId) => api.get(`/organizations/${orgId}/submanagers`),
  addSubmanager: (userId) => api.post('/organizations/submanager/add', { userId }),
  removeSubmanager: (userId) => api.delete(`/organizations/submanager/${userId}/remove`),

  getWorkers: (orgId, params) => api.get(`/organizations/${orgId}/workers`, { params }),
  addWorker: (data) => api.post('/organizations/worker/add', data),
  removeWorker: (workerId) => api.delete(`/organizations/worker/${workerId}/remove`),
  reassignWorker: (data) => api.post('/organizations/worker/reassign-manager', data),
  getManagerWorkers: (managerId) => api.get(`/organizations/manager/${managerId}/workers`),

  getWorkOrders: (orgId, params) => api.get(`/organizations/${orgId}/work-orders`, { params }),
  getTotalWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/total`),
  getCompletedWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/completed`),
  getInProgressWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/in-progress`),
  getCancelledWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/cancelled`),
  getAssignedWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/assigned`),
  getCreatedWorkOrders: (orgId) => api.get(`/organizations/${orgId}/work-orders/created`),

  getTotalWorkers: (orgId) => api.get(`/organizations/${orgId}/workers/total`),
  getTotalManagers: (orgId) => api.get(`/organizations/${orgId}/managers/total`),
  getTotalContractors: (orgId) => api.get(`/organizations/${orgId}/contractors/total`),
  getTotalTechnicians: (orgId) => api.get(`/organizations/${orgId}/technicians/total`),
  getAll: (params) => api.get('/organizations/all', { params }),
};


export const workOrderAPI = {
  create: (data) => api.post('/work-orders', data),
  getById: (id) => api.get(`/work-orders/${id}`),
  update: (id, data) => api.put(`/work-orders/${id}`, data),
  delete: (id) => api.delete(`/work-orders/${id}`),
  updateStatus: (id, status) => api.patch(`/work-orders/${id}/status`, { status }),
  assign: (data) => api.post('/work-orders/assign', data),
  unassign: (data) => api.post('/work-orders/unassign', data),
  getAssignments: (id) => api.get(`/work-orders/${id}/assignments`),
  getByOrganization: (orgId, params) => api.get(`/work-orders/organization/${orgId}`, { params }),
  getStats: (orgId) => api.get(`/work-orders/organization/${orgId}/stats`),
  addPart: (id, data) => api.post(`/work-orders/${id}/parts`, data),
  removePart: (id, itemId) => api.delete(`/work-orders/${id}/parts/${itemId}`),
  getAll: (params) => api.get('/work-orders/all', { params }),
};

export const clientAPI = {
  create: (data) => api.post('/clients', data),
  getById: (id) => api.get(`/clients/${id}`),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  getByOrganization: (orgId) => api.get(`/clients/organization/${orgId}`),
  addLocation: (id, data) => api.post(`/clients/${id}/locations`, data),
  removeLocation: (id, locId) => api.delete(`/clients/${id}/locations/${locId}`),
};

export const inventoryAPI = {
  create: (data) => api.post('/inventory', data),
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
  getByOrganization: (orgId, params) => api.get(`/inventory/organization/${orgId}`, { params }),
  returnPart: (workOrderId, inventoryItemId, quantity) =>
    api.post(`/work-orders/${workOrderId}/parts/return`, { inventoryItemId, quantity }),
};

export const scheduleAPI = {
  create: (data) => api.post('/schedules', data),
  getById: (id) => api.get(`/schedules/${id}`),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
  getWorkerSchedules: (workerId) => api.get(`/schedules/worker/${workerId}`),
  getWorkOrderSchedules: (woId) => api.get(`/schedules/work-order/${woId}`),
};

export const attendanceAPI = {
  getOrganizationAttendance: (orgId) => api.get(`/attendance/organization/${orgId}`),
  getWorkerAttendance: (workerId) => api.get(`/attendance/worker/${workerId}`),
};

export const notificationAPI = {
  getMy: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications/delete-all'),
};

export const planAPI = {
  getAll: () => api.get('/plans'),
  getById: (id) => api.get(`/plans/${id}`),
  create: (data) => api.post('/plans', data),
  update: (id, data) => api.put(`/plans/${id}`, data),
  delete: (id) => api.delete(`/plans/${id}`),
};



export const subscriptionAPI = {
  subscribe: (data) => api.post('/subscriptions', data),
  getOrgSubscription: (orgId) => api.get(`/subscriptions/organization/${orgId}`),
  getHistory: (orgId) => api.get(`/subscriptions/organization/${orgId}/history`),
  getAll: () => api.get('/subscriptions/all'),
  cancel: (id) => api.patch(`/subscriptions/${id}/cancel`),
  activate: (id) => api.patch(`/subscriptions/${id}/activate`),
};

export const paymentAPI = {
  createPaypalOrder: (data) => api.post('/payments/paypal/create-order', data),
  capturePaypalOrder: (paypalOrderId) => api.post(`/payments/paypal/capture/${paypalOrderId}`),
  getAll: () => api.get('/payments/all'),
  getOrgPayments: (orgId) => api.get(`/payments/organization/${orgId}`),
  getByInvoice: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
  refund: (id) => api.patch(`/payments/${id}/refund`),
};

export const invoiceAPI = {
  getAll: () => api.get('/invoices/all'),
  getOrgInvoices: (orgId) => api.get(`/invoices/organization/${orgId}`),
  getById: (id) => api.get(`/invoices/${id}`),
  updateStatus: (id, data) => api.patch(`/invoices/${id}/status`, data),
};

export const skillAPI = {
  getAll: () => api.get('/skills'),
  getById: (id) => api.get(`/skills/${id}`),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
  assign: (data) => api.post('/skills/assign', data),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getAllUsers: (params) => api.get('/auth/users', { params }),
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/auth/users/${id}/role`, { role }),
  toggleUserActive: (id) => api.patch(`/auth/users/${id}/toggle-active`),
};

export const auditLogAPI = {
  getAll: (params) => api.get('/audit-logs', { params }),
};
