/**
 * Authentication Module for Surat OTOP Biz
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
      const userStr = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
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
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
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
      // เรียก API
      const result = await API.login(phone, password);
      
      if (!result.success) {
        return result;
      }
      
      // บันทึกข้อมูลผู้ใช้
      this.setUser(result.data);
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'เกิดข้อผิดพลาด: ' + error.message
      };
    }
  },

  /**
   * Register (ตั้งรหัสผ่านครั้งแรก)
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
      localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
      
      // Redirect to login
      window.location.href = 'index.html';
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  /**
   * เช็ค Session (ใช้ก่อนโหลดหน้าที่ต้อง Login)
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