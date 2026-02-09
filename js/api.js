/**
 * API Module (Frontend) - Compatible Mode
 * ✅ ส่งทั้ง route และ action เพื่อรองรับ Backend ได้ทั้ง 2 แบบ
 */
const API = {
  baseURL: (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : '',

  async request(routeOrAction, data = {}) {
    const route = routeOrAction;
    const payload = { route, action: route, ...data };

    try {
      if (!this.baseURL) throw new Error('CONFIG.API_URL ไม่ถูกตั้งค่า');
      const res = await fetch(this.baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error('API.request error:', e);
      return { success: false, error: e.message || 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ' };
    }
  },

  // Auth
  login(phone, password) { return this.request('login', { phone, password }); },
  register(phone, newPassword) { return this.request('register', { phone, newPassword }); },

  // Dashboard
  getDashboardData(userId, phone='') { return this.request('get-dashboard', { userId, phone }); },

  // Costing
  saveCosting(data) { return this.request('save-costing', data); },

  // Transactions
  addTransaction(data) { return this.request('add-transaction', data); },
  getTransactions(userId, limit=100) { return this.request('get-transactions', { userId, limit }); },

  // Admin
  adminLogin(username, password) { return this.request('adminLogin', { username, password }); },
  getAdminStats(adminId) { return this.request('admin-stats', { adminId }); },
  getAdminUsers(adminId, limit=50) { return this.request('admin-users', { adminId, limit }); },
  getAdminAllTransactions(adminId, limit=50) { return this.request('admin-all-transactions', { adminId, limit }); },
  adminUpdateUserStatus(adminId, userId, status) { return this.request('admin-update-user-status', { adminId, userId, status }); },
};
