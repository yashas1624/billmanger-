/**
 * Frontend API Service for connecting to the Express Backend
 */

const API_BASE = '/api';

async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.details = data?.details;
      throw err;
    }

    return data;
  } catch (err) {
    console.warn(`[API] Error on ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: async () => {
    return request(`${API_BASE}/health`);
  },

  // Bills
  getBills: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.userId) query.append('userId', params.userId);
    if (params.category) query.append('category', params.category);
    const qStr = query.toString();
    return request(`${API_BASE}/bills${qStr ? `?${qStr}` : ''}`);
  },

  getUpcomingBills: async (days = 7) => {
    return request(`${API_BASE}/bills/upcoming?days=${days}`);
  },

  getBillById: async (id) => {
    return request(`${API_BASE}/bills/${id}`);
  },

  createBill: async (billData) => {
    return request(`${API_BASE}/bills`, {
      method: 'POST',
      body: JSON.stringify(billData)
    });
  },

  updateBill: async (id, billData) => {
    return request(`${API_BASE}/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(billData)
    });
  },

  markBillAsPaid: async (id) => {
    return request(`${API_BASE}/bills/${id}/pay`, {
      method: 'PATCH'
    });
  },

  updateBillStatus: async (id, status) => {
    return request(`${API_BASE}/bills/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  deleteBill: async (id) => {
    return request(`${API_BASE}/bills/${id}`, {
      method: 'DELETE'
    });
  },

  // Users
  getUsers: async () => {
    return request(`${API_BASE}/users`);
  },

  getUserById: async (id) => {
    return request(`${API_BASE}/users/${id}`);
  },

  updateUserPreferences: async (id, preferences) => {
    return request(`${API_BASE}/users/${id}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(preferences)
    });
  },

  // Background Worker & Scheduler
  runWorkerReminders: async (targetDate = null) => {
    return request(`${API_BASE}/worker/run-reminders`, {
      method: 'POST',
      body: JSON.stringify(targetDate ? { targetDate } : {})
    });
  },

  getWorkerStatus: async () => {
    return request(`${API_BASE}/worker/status`);
  }
};
