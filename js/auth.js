/**
 * Authentication Module for Surat OTOP Biz v2.4
 * จัดการ Login, Logout, Session + ตั้งรหัสผ่านครั้งแรก (Modal)
 */

const Auth = {
  // ---------- Session ----------
  isLoggedIn() {
    return this.getUser() !== null;
  },

  getUser() {
    try {
      const userStr = localStorage.getItem('surat_otop_user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  setUser(user) {
    try {
      localStorage.setItem('surat_otop_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Set user error:', error);
      return false;
    }
  },

  // ---------- Login ----------
  async login(phone, password) {
    try {
      if (!phone || !password) {
        phone = document.getElementById('phone')?.value;
        password = document.getElementById('password')?.value;
      }

      if (!phone || !password) {
        alert('กรุณากรอกเบอร์โทรและรหัสผ่าน');
        return { success: false, error: 'กรุณากรอกเบอร์โทรและรหัสผ่าน' };
      }

      if (typeof Utils !== 'undefined' && Utils.showLoading) {
        Utils.showLoading('กำลังเข้าสู่ระบบ...');
      }

      const result = await API.login(phone, password);

      if (typeof Utils !== 'undefined' && Utils.hideLoading) {
        Utils.hideLoading();
      }

      if (!result.success) {
        alert(result.error || 'เข้าสู่ระบบไม่สำเร็จ');
        return result;
      }

      this.setUser(result.data);
      window.location.href = 'dashboard.html';
      return result;

    } catch (error) {
      console.error('Login error:', error);
      if (typeof Utils !== 'undefined' && Utils.hideLoading) {
        Utils.hideLoading();
      }
      alert('เกิดข้อผิดพลาด: ' + (error.message || error));
      return { success: false, error: 'เกิดข้อผิดพลาด: ' + (error.message || error) };
    }
  },

  // ---------- Register (API only) ----------
  async register(phone, newPassword) {
    try {
      return await API.register(phone, newPassword);
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'เกิดข้อผิดพลาด: ' + (error.message || error) };
    }
  },

  // ---------- Logout ----------
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

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  getCurrentUser() { return this.getUser(); },
  getUserId() { return this.getUser()?.userId || null; },
  getUserName() {
    const u = this.getUser();
    return u ? (u.chairmanOwnerName || u.entrepreneursName || 'ผู้ใช้') : null;
  },

  updateUser(updates) {
    const user = this.getUser();
    if (!user) return false;
    return this.setUser({ ...user, ...updates });
  },

  // ==========================================================
  // ตั้งรหัสผ่านครั้งแรก (Modal)
  // ==========================================================
  ensureRegisterModal() {
    if (document.getElementById('register-modal')) return;

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="register-modal" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-800">ตั้งรหัสผ่านครั้งแรก</h3>
            <button class="p-2 rounded-lg hover:bg-gray-100" type="button" id="reg-close">✕</button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
              <input id="reg-phone" type="tel" maxlength="10"
                     class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                     placeholder="0812345678">
              <p class="text-xs text-gray-500 mt-1">กรอกเบอร์ที่มีอยู่ในระบบ (ตามที่ผู้ดูแลลงทะเบียนไว้)</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ตั้งรหัสผ่านใหม่</label>
              <input id="reg-password" type="password"
                     class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                     placeholder="อย่างน้อย 6 ตัวอักษร">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่าน</label>
              <input id="reg-password2" type="password"
                     class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                     placeholder="พิมพ์รหัสผ่านอีกครั้ง">
            </div>
          </div>

          <div class="mt-6 flex gap-3 justify-end">
            <button class="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200" type="button" id="reg-cancel">ยกเลิก</button>
            <button id="reg-submit" class="px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="button">
              บันทึกรหัสผ่าน
            </button>
          </div>
        </div>
      </div>
    `.trim();

    document.body.appendChild(wrap.firstElementChild);

    document.getElementById('reg-close').addEventListener('click', () => this.hideRegisterModal());
    document.getElementById('reg-cancel').addEventListener('click', () => this.hideRegisterModal());
    document.getElementById('reg-submit').addEventListener('click', () => this.submitFirstPassword());

    // กด ESC เพื่อปิด
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.hideRegisterModal();
    });
  },

  showRegisterModal() {
    this.ensureRegisterModal();

    const modal = document.getElementById('register-modal');

    // ถ้ามีช่อง login อยู่ ให้เติมเบอร์มาให้
    const phoneFromLogin = document.getElementById('phone')?.value || '';
    document.getElementById('reg-phone').value = phoneFromLogin.replace(/\D/g, '').slice(0, 10);

    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password2').value = '';

    modal.classList.remove('hidden');
    setTimeout(() => document.getElementById('reg-phone').focus(), 50);
  },

  hideRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) modal.classList.add('hidden');
  },

  async submitFirstPassword() {
    const phone = (document.getElementById('reg-phone').value || '').replace(/\D/g, '').slice(0, 10);
    const p1 = document.getElementById('reg-password').value || '';
    const p2 = document.getElementById('reg-password2').value || '';

    if (!phone || phone.length !== 10) { alert('❌ กรุณากรอกเบอร์โทร 10 หลัก'); return; }
    if (!p1 || p1.length < 6) { alert('❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    if (p1 !== p2) { alert('❌ รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน'); return; }

    const btn = document.getElementById('reg-submit');
    btn.disabled = true;
    btn.textContent = 'กำลังบันทึก...';

    try {
      const result = await this.register(phone, p1);

      if (result && result.success) {
        alert('✅ ตั้งรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบ');
        this.hideRegisterModal();

        // เติมค่าให้ช่อง login (ถ้ามี)
        const loginPhone = document.getElementById('phone');
        const loginPass = document.getElementById('password');
        if (loginPhone) loginPhone.value = phone;
        if (loginPass) {
          loginPass.value = '';
          loginPass.focus();
        }
      } else {
        alert('❌ ไม่สำเร็จ: ' + (result?.error || 'กรุณาลองใหม่'));
      }
    } catch (e) {
      console.error(e);
      alert('❌ เกิดข้อผิดพลาด: ' + (e?.message || e));
    } finally {
      btn.disabled = false;
      btn.textContent = 'บันทึกรหัสผ่าน';
    }
  }
};

// ✅ Export
if (typeof window !== 'undefined') {
  window.Auth = Auth;
}
