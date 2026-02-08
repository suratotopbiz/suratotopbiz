/**
 * API Module for Surat OTOP Biz (Frontend)
 * ✅ Sync กับ Backend routes (Apps Script v2.5)
 * Routes ที่ Backend รองรับ: status, login, register, adminLogin,
 * save-costing, add-transaction, get-transactions, get-dashboard, active-news,
 * admin-stats, admin-users, admin-all-transactions, admin-all-products, admin-update-user-status
 */

const API = {
  baseURL: CONFIG.API_URL, // จาก config.js :contentReference[oaicite:7]{index=7}

  async request(route, data = {}) {
    try {
      console.log(`📤 API Request: ${route}`, data);

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          // Apps Script Web App มักรับ text/plain ได้เสถียรกว่า (หลีกเลี่ยง CORS บางกรณี)
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          route,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`📥 API Response: ${route}`, result);
      return result;
    } catch (error) {
      console.error('❌ API Request Error:', error);
      return {
        success: false,
        error: error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      };
    }
  },

  // ========================
  // Health check
  // ========================
  async testConnection() {
    return await this.request('status');
  },

  // ========================
  // Authentication (User)
  // ========================
  async login(phone, password) {
    return await this.request('login', { phone, password });
  },

  async register(phone, newPassword) {
    return await this.request('register', { phone, newPassword });
  },

  // ========================
  // Costing
  // ========================
  async saveCosting(costingData) {
    return await this.request('save-costing', costingData);
  },

  // ========================
  // Transactions (User)
  // ========================
  async addTransaction(transactionData) {
    return await this.request('add-transaction', transactionData);
  },

  async getTransactions(userId, limit = 100) {
    return await this.request('get-transactions', { userId, limit });
  },

  // ========================
  // Dashboard (User)
  // ========================
  async getDashboardData(userId) {
    return await this.request('get-dashboard', { userId });
  },

  // ========================
  // News
  // ========================
  async getActiveNews() {
    return await this.request('active-news');
  },

  // ========================
  // Admin
  // ========================
  async adminLogin(username, password) {
    return await this.request('adminLogin', { username, password });
  },

  async getAdminStats(adminId) {
    return await this.request('admin-stats', { adminId });
  },

  async getAdminUsers(adminId, limit = 10) {
    return await this.request('admin-users', { adminId, limit });
  },

  async getAdminAllTransactions(adminId, limit = 20) {
    return await this.request('admin-all-transactions', { adminId, limit });
  },

  async getAdminAllProducts(adminId, limit = 20) {
    return await this.request('admin-all-products', { adminId, limit });
  },

  async adminUpdateUserStatus(adminId, userId, status) {
    // Backend route ชื่อ admin-update-user-status :contentReference[oaicite:8]{index=8}
    return await this.request('admin-update-user-status', { adminId, userId, status });
  },

  // ===== Admin News (ต้องมี backend routes เพิ่ม) =====
  async adminNewsList(adminId) {
    return await this.request('admin-news-list', { adminId });
  },

  async adminNewsUpsert(adminId, news) {
    return await this.request('admin-news-upsert', { adminId, news });
  },

  async adminNewsDelete(adminId, newsId) {
    return await this.request('admin-news-delete', { adminId, newsId });
  },

};

// Optional: log ตอนโหลด
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Surat OTOP Biz Frontend Loaded');
  console.log('📡 API URL:', API.baseURL);
});
