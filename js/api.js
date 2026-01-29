/**
 * API Module for Surat OTOP Biz
 * ระบบจัดการการเชื่อมต่อกับ Google Apps Script Backend
 */

const API = {
  baseURL: CONFIG.API_URL,

  /**
   * ฟังก์ชันหลักสำหรับส่ง request ไป Backend
   */
  async request(route, data = {}) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        body: JSON.stringify({
          route: route,
          ...data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
      };
    }
  },

  // ========================
  // Authentication APIs
  // ========================

  /**
   * ทดสอบการเชื่อมต่อ
   */
  async testConnection() {
    try {
      const result = await this.request('status');
      return result;
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * เข้าสู่ระบบ
   */
  async login(phone, password) {
    try {
      const result = await this.request('login', {
        phone: phone,
        password: password
      });
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ตั้งรหัสผ่านครั้งแรก
   */
  async register(phone, newPassword) {
    try {
      const result = await this.request('register', {
        phone: phone,
        newPassword: newPassword
      });
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // Smart Costing APIs
  // ========================

  /**
   * บันทึกการคำนวณต้นทุน
   */
  async saveCosting(costingData) {
    try {
      const result = await this.request('save-costing', costingData);
      return result;
    } catch (error) {
      console.error('Save costing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ดึงรายการคำนวณต้นทุนทั้งหมด
   */
  async getCostingList(userId) {
    try {
      const result = await this.request('costing-list', {
        userId: userId
      });
      return result;
    } catch (error) {
      console.error('Get costing list error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // Transaction APIs
  // ========================

  /**
   * เพิ่มรายการรับ-จ่าย
   */
  async addTransaction(transactionData) {
    try {
      const result = await this.request('add-transaction', transactionData);
      return result;
    } catch (error) {
      console.error('Add transaction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ✅ ดึงรายการ Transactions
   */
  async getTransactions(userId, limit = 100) {
    try {
      const result = await this.request('get-transactions', {
        userId: userId,
        limit: limit
      });
      return result;
    } catch (error) {
      console.error('Get transactions error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ลบรายการ Transaction
   */
  async deleteTransaction(transactionId) {
    try {
      const result = await this.request('delete-transaction', {
        transactionId: transactionId
      });
      return result;
    } catch (error) {
      console.error('Delete transaction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // Dashboard APIs
  // ========================

  /**
   * ✅ ดึงข้อมูล Dashboard (สรุป)
   */
  async getDashboardData(userId) {
    try {
      const result = await this.request('get-dashboard', {
        userId: userId
      });
      return result;
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ดึงสถิติรายเดือน
   */
  async getMonthlyStats(userId, year, month) {
    try {
      const result = await this.request('monthly-stats', {
        userId: userId,
        year: year,
        month: month
      });
      return result;
    } catch (error) {
      console.error('Get monthly stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // News APIs
  // ========================

  /**
   * ดึงข่าวสารที่เปิดใช้งาน
   */
  async getActiveNews() {
    try {
      const result = await this.request('active-news');
      return result;
    } catch (error) {
      console.error('Get active news error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ดึงข่าวสารทั้งหมด (Admin)
   */
  async getAllNews() {
    try {
      const result = await this.request('all-news');
      return result;
    } catch (error) {
      console.error('Get all news error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // User Profile APIs
  // ========================

  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้
   */
  async getUserProfile(userId) {
    try {
      const result = await this.request('get-profile', {
        userId: userId
      });
      return result;
    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * อัปเดตโปรไฟล์ผู้ใช้
   */
  async updateProfile(userId, profileData) {
    try {
      const result = await this.request('update-profile', {
        userId: userId,
        ...profileData
      });
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ========================
  // Admin APIs
  // ========================

  /**
   * Admin เข้าสู่ระบบ
   */
  async adminLogin(username, password) {
    try {
      const result = await this.request('admin-login', {
        username: username,
        password: password
      });
      return result;
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * ดึงรายชื่อผู้ใช้ทั้งหมด
   */
  async getAllUsers() {
    try {
      const result = await this.request('all-users');
      return result;
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * เพิ่มผู้ใช้ใหม่
   */
  async addUser(userData) {
    try {
      const result = await this.request('add-user', userData);
      return result;
    } catch (error) {
      console.error('Add user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * อัปเดตสถานะผู้ใช้
   */
  async updateUserStatus(userId, status) {
    try {
      const result = await this.request('update-user-status', {
        userId: userId,
        status: status
      });
      return result;
    } catch (error) {
      console.error('Update user status error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// ทดสอบการเชื่อมต่อเมื่อโหลดหน้า (Development Mode)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  document.addEventListener('DOMContentLoaded', () => {
    API.testConnection().then(result => {
      console.log('🔌 API Connection Test:', result);
    });
  });
}