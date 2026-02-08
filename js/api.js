/**
 * API Module for Surat OTOP Biz (Frontend) - Compatible mode
 * ✅ ส่งทั้ง route และ action เพื่อรองรับ Backend ได้ทั้ง 2 แบบ
 */
const API = {
  baseURL: (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : '',

  async request(routeOrAction, data = {}) {
    const route = routeOrAction;
    const payload = { route, action: route, ...data };

    try {
      console.log(`📤 API Request: ${route}`, payload);

      if (!this.baseURL) {
        throw new Error('CONFIG.API_URL ไม่ถูกตั้งค่า');
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log(`📥 API Response: ${route}`, result);
      return result;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      return { success: false, error: error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' };
    }
  },

  async testConnection() { return await this.request('status'); },

  async login(phone, password) { return await this.request('login', { phone, password }); },
  async register(phone, newPassword) { return await this.request('register', { phone, newPassword }); },

  async saveCosting(costingData) { return await this.request('save-costing', costingData); },

  async addTransaction(transactionData) { return await this.request('add-transaction', transactionData); },
  async getTransactions(userId, limit = 100) { return await this.request('get-transactions', { userId, limit }); },

  async getDashboardData(userId) { return await this.request('get-dashboard', { userId }); },

  async getActiveNews() { return await this.request('active-news'); },

  async adminLogin(username, password) { return await this.request('adminLogin', { username, password }); },
  async getAdminStats(adminId) { return await this.request('admin-stats', { adminId }); },
  async getAdminUsers(adminId, limit = 10) { return await this.request('admin-users', { adminId, limit }); },
  async getAdminAllTransactions(adminId, limit = 20) { return await this.request('admin-all-transactions', { adminId, limit }); },
  async getAdminAllProducts(adminId, limit = 20) { return await this.request('admin-all-products', { adminId, limit }); },
  async adminUpdateUserStatus(adminId, userId, status) { return await this.request('admin-update-user-status', { adminId, userId, status }); },
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Surat OTOP Biz Frontend Loaded');
  console.log('📡 API URL:', API.baseURL);
});
