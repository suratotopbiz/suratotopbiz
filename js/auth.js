// auth.js - Authentication Module
// อัปเดตให้รองรับโครงสร้างผู้ใช้จากทะเบียน OTOP

const Auth = {
  currentUser: null,

  // Initialize authentication
  init() {
    this.loadUserFromStorage();
    this.checkAuthOnProtectedPages();
  },

  // Load user data from localStorage
  loadUserFromStorage() {
    const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearStorage();
      }
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  },

  // Check authentication on protected pages
  checkAuthOnProtectedPages() {
    const protectedPages = [
      'dashboard.html',
      'costing.html',
      'accounting.html',
      'sales-tools.html',
      'formula.html',
      'notes.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
      window.location.href = 'index.html';
    }
  },

  // Login function
  async login() {
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!phone || !password) {
      Utils.showAlert('กรุณากรอกเบอร์โทรและรหัสผ่าน', 'warning');
      return;
    }

    if (!Utils.validatePhone(phone)) {
      Utils.showAlert('เบอร์โทรไม่ถูกต้อง (ต้องเป็น 10 หลัก เริ่มต้นด้วย 0)', 'error');
      return;
    }

    if (password.length < 6) {
      Utils.showAlert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
      return;
    }

    try {
      Utils.showLoading(true, 'กำลังเข้าสู่ระบบ...');
      
      const result = await API.login(phone, password);
      
      if (result.success) {
        // Save user data
        this.currentUser = result.data;
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(result.data));
        
        // Generate simple token
        const token = btoa(`${phone}:${Date.now()}`);
        localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
        
        Utils.showAlert('เข้าสู่ระบบสำเร็จ!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
        
      } else {
        Utils.showAlert(result.error || 'ล็อกอินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 'error');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      Utils.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      Utils.showLoading(false);
    }
  },

  // Show register modal
  showRegisterModal() {
    const modal = document.createElement('div');
    modal.id = 'register-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">ตั้งรหัสผ่านครั้งแรก</h2>
        <p class="text-gray-600 mb-6">
          กรุณากรอกเบอร์โทรศัพท์ที่อยู่ในทะเบียนผู้ประกอบการ OTOP
        </p>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">
              เบอร์โทรศัพท์ (ตามทะเบียน)
            </label>
            <input type="tel" id="reg-phone" 
                   placeholder="0812345678"
                   maxlength="10"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">
              รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
            </label>
            <input type="password" id="reg-password" 
                   placeholder="รหัสผ่านใหม่"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-medium mb-1">
              ยืนยันรหัสผ่าน
            </label>
            <input type="password" id="reg-confirm-password" 
                   placeholder="ยืนยันรหัสผ่าน"
                   class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <button onclick="Auth.closeRegisterModal()" 
                  class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            ยกเลิก
          </button>
          <button onclick="Auth.register()" 
                  class="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
            ตั้งรหัสผ่าน
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto format phone
    document.getElementById('reg-phone').addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
    
    // Focus phone input
    setTimeout(() => {
      document.getElementById('reg-phone').focus();
    }, 100);
  },

  // Close register modal
  closeRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) {
      modal.remove();
    }
  },

  // Register/Set password
  async register() {
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // Validation
    if (!phone || !password || !confirmPassword) {
      Utils.showAlert('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
      return;
    }

    if (!Utils.validatePhone(phone)) {
      Utils.showAlert('เบอร์โทรไม่ถูกต้อง', 'error');
      return;
    }

    if (password.length < 6) {
      Utils.showAlert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Utils.showAlert('รหัสผ่านไม่ตรงกัน', 'error');
      return;
    }

    try {
      Utils.showLoading(true, 'กำลังตั้งรหัสผ่าน...');
      
      const result = await API.register(phone, password);
      
      if (result.success) {
        Utils.showAlert('ตั้งรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบ', 'success');
        this.closeRegisterModal();
        
        // Fill phone in login form
        document.getElementById('phone').value = phone;
        document.getElementById('password').focus();
        
      } else {
        Utils.showAlert(result.error || 'ตั้งรหัสผ่านไม่สำเร็จ', 'error');
      }
      
    } catch (error) {
      console.error('Register error:', error);
      Utils.showAlert('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      Utils.showLoading(false);
    }
  },

  // Logout
  logout() {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      this.clearStorage();
      window.location.href = 'index.html';
    }
  },

  // Clear storage
  clearStorage() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    this.currentUser = null;
  },

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },

  // Get user display name (ปรับให้แสดงชื่อจากทะเบียน)
  getUserDisplayName() {
    if (!this.currentUser) return 'ผู้ใช้';
    
    // ลำดับความสำคัญ: ชื่อผู้ประกอบการ → ชื่อเจ้าของ → เบอร์โทร
    return this.currentUser.entrepreneursName || 
           this.currentUser.chairmanOwnerName || 
           this.currentUser.phone || 
           'ผู้ใช้';
  },

  // Get user organization name
  getUserOrganization() {
    if (!this.currentUser) return '';
    
    // แสดงลักษณะผู้ประกอบการ
    return this.currentUser.operatingModel || '';
  },

  // Update user in storage
  updateUserInStorage(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(this.currentUser));
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
