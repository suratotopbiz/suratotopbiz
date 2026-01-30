/**
 * Authentication Module for Surat OTOP Biz v2.3
 * จัดการ Login, Logout, และ Session
 */

const Auth = {
  /**
   * เช็คว่า Login แล้วหรือยัง
   */
  isLoggedIn() {
    const user = this.getUser();
    return user !== null;
  },

  /**
   * ดึงข้อมูลผู้ใช้จาก localStorage
   */
  getUser() {
    try {
      const userStr = localStorage.getItem('surat_otop_user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * บันทึกข้อมูลผู้ใช้
   */
  setUser(user) {
    try {
      localStorage.setItem('surat_otop_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Set user error:', error);
      return false;
    }
  },

  /**
   * Login
   */
  async login(phone, password) {
    try {
      // ✅ ถ้าไม่ได้ส่ง parameter มา ให้ดึงจาก form
      if (!phone || !password) {
        phone = document.getElementById('phone')?.value;
        password = document.getElementById('password')?.value;
      }
      
      // Validate
      if (!phone || !password) {
        alert('กรุณากรอกเบอร์โทรและรหัสผ่าน');
        return {
          success: false,
          error: 'กรุณากรอกเบอร์โทรและรหัสผ่าน'
        };
      }
      
      // Show loading
      if (typeof Utils !== 'undefined' && Utils.showLoading) {
        Utils.showLoading('กำลังเข้าสู่ระบบ...');
      }
      
      const result = await API.login(phone, password);
      
      // Hide loading
      if (typeof Utils !== 'undefined' && Utils.hideLoading) {
        Utils.hideLoading();
      }
      
      if (!result.success) {
        alert(result.error || 'เข้าสู่ระบบไม่สำเร็จ');
        return result;
      }
      
      // บันทึกข้อมูลผู้ใช้
      this.setUser(result.data);
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      // Hide loading
      if (typeof Utils !== 'undefined' && Utils.hideLoading) {
        Utils.hideLoading();
      }
      
      alert('เกิดข้อผิดพลาด: ' + error.message);
      
      return {
        success: false,
        error: 'เกิดข้อผิดพลาด: ' + error.message
      };
    }
  },

  /**
   * Register
   */
  async register(phone, newPassword) {
    try {
      const result = await API.register(phone, newPassword);
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'เกิดข้อผิดพลาด: ' + error.message
      };
    }
  },

  /**
   * Logout
   */
  logout() {
    try {
      localStorage.removeItem('surat_otop_user');
      localStorage.removeItem('surat_otop_token');
      window.location.href = 'index.html';
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  /**
   * เช็ค Session
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  /**
   * ดึง User ID
   */
  getUserId() {
    const user = this.getUser();
    return user ? user.userId : null;
  },

  /**
   * ดึงชื่อผู้ใช้
   */
  getUserName() {
    const user = this.getUser();
    return user ? (user.chairmanOwnerName || user.entrepreneursName || 'ผู้ใช้') : null;
  },

  /**
   * อัปเดตข้อมูลผู้ใช้
   */
  updateUser(updates) {
    const user = this.getUser();
    if (!user) return false;
    
    const updatedUser = { ...user, ...updates };
    return this.setUser(updatedUser);
  }
};

// ✅ Export
if (typeof window !== 'undefined') {
  window.Auth = Auth;
}