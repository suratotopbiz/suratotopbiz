// api.js - API Service Layer
const API = {
  baseURL: CONFIG.API_BASE_URL,

  // Helper: Make HTTP request
  async request(route, data = null, method = 'POST') {
    try {
      let url = `${this.baseURL}?route=${route}`;
      
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (method === 'POST' && data) {
        options.body = JSON.stringify({ ...data, route });
      } else if (method === 'GET' && data) {
        const params = new URLSearchParams(data);
        url += `&${params.toString()}`;
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง'
      };
    }
  },

  // ========================
  // Authentication APIs
  // ========================

  async login(phone, password) {
    return this.request('login', { phone, password });
  },

  async register(phone, newPassword) {
    return this.request('register', { phone, newPassword });
  },

  async checkPhoneExists(phone) {
    return this.request('check-phone', { phone }, 'GET');
  },

  // ========================
  // User APIs
  // ========================

  async getUserProfile(userId) {
    return this.request('user-profile', { userId }, 'GET');
  },

  async updateUserProfile(userId, updates) {
    return this.request('update-profile', { userId, updates });
  },

  async getAllUsers() {
    return this.request('all-users', null, 'GET');
  },

  // ========================
  // Smart Costing APIs
  // ========================

  async saveCosting(costingData) {
    return this.request('save-costing', costingData);
  },

  async getCostingList(userId) {
    return this.request('costing-list', { userId }, 'GET');
  },

  async getCostingById(costingId) {
    return this.request('costing-detail', { costingId }, 'GET');
  },

  async deleteCosting(costingId) {
    return this.request('delete-costing', { costingId });
  },

  async duplicateCosting(costingId) {
    return this.request('duplicate-costing', { costingId });
  },

  // ========================
  // Transaction APIs
  // ========================

  async addTransaction(transactionData) {
    return this.request('add-transaction', transactionData);
  },

  async getTransactions(userId, filters = {}) {
    return this.request('transactions', { userId, ...filters }, 'GET');
  },

  async getTransactionSummary(userId, startDate, endDate) {
    return this.request('transaction-summary', { 
      userId, 
      startDate, 
      endDate 
    }, 'GET');
  },

  async deleteTransaction(transactionId) {
    return this.request('delete-transaction', { transactionId });
  },

  async updateTransaction(transactionId, updates) {
    return this.request('update-transaction', { transactionId, updates });
  },

  // ========================
  // Dashboard APIs
  // ========================

  async getDashboardData(userId) {
    return this.request('dashboard', { userId }, 'GET');
  },

  async getMonthlyStats(userId, year, month) {
    return this.request('monthly-stats', { userId, year, month }, 'GET');
  },

  // ========================
  // News APIs
  // ========================

  async getActiveNews() {
    return this.request('active-news', null, 'GET');
  },

  async getAllNews() {
    return this.request('all-news', null, 'GET');
  },

  async addNews(newsData) {
    return this.request('add-news', newsData);
  },

  async updateNews(newsId, updates) {
    return this.request('update-news', { newsId, updates });
  },

  async deleteNews(newsId) {
    return this.request('delete-news', { newsId });
  },

  // ========================
  // Admin APIs
  // ========================

  async adminLogin(username, password) {
    return this.request('admin-login', { username, password });
  },

  async addUser(userData) {
    return this.request('add-user', userData);
  },

  async updateUserStatus(userId, status) {
    return this.request('update-user-status', { userId, status });
  },

  async deleteUser(userId) {
    return this.request('delete-user', { userId });
  },

  async getSystemStats() {
    return this.request('system-stats', null, 'GET');
  },

  async exportData(dataType, filters = {}) {
    return this.request('export-data', { dataType, ...filters }, 'GET');
  },

  // ========================
  // Formula APIs
  // ========================

  async saveFormula(formulaData) {
    return this.request('save-formula', formulaData);
  },

  async getFormulas(userId) {
    return this.request('formulas', { userId }, 'GET');
  },

  async deleteFormula(formulaId) {
    return this.request('delete-formula', { formulaId });
  },

  // ========================
  // Notes APIs
  // ========================

  async saveNote(noteData) {
    return this.request('save-note', noteData);
  },

  async getNotes(userId) {
    return this.request('notes', { userId }, 'GET');
  },

  async deleteNote(noteId) {
    return this.request('delete-note', { noteId });
  },

  // ========================
  // Quotation APIs
  // ========================

  async generateQuotation(quotationData) {
    return this.request('generate-quotation', quotationData);
  },

  async getQuotations(userId) {
    return this.request('quotations', { userId }, 'GET');
  },

  // ========================
  // Utility functions
  // ========================

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch(this.baseURL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get API status
  async getStatus() {
    return this.request('status', null, 'GET');
  }
};

// Auto-test connection on load (development mode)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  API.testConnection().then(result => {
    console.log('API Connection Test:', result);
  });
}
