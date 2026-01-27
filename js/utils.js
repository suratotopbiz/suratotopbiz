// utils.js - Utility Functions
const Utils = {
  // Format number เป็นเงินบาท
  formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  },

  // Format number ธรรมดา
  formatNumber(number, decimals = 0) {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number);
  },

  // Format date เป็นภาษาไทย
  formatDate(date, format = 'full') {
    const d = new Date(date);
    const options = {
      full: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      },
      short: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      },
      time: { 
        hour: '2-digit', 
        minute: '2-digit' 
      }
    };
    
    return new Intl.DateTimeFormat('th-TH', options[format]).format(d);
  },

  // Validate เบอร์โทร
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && cleaned.startsWith('0');
  },

  // Format เบอร์โทร
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  // Generate unique ID
  generateId(prefix = 'id') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  },

  // แสดง Loading
  showLoading(show = true, message = 'กำลังโหลด...') {
    let loader = document.getElementById('global-loader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = `
          <div class="bg-white rounded-lg p-6 shadow-xl">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p class="text-gray-700 text-center">${message}</p>
          </div>
        `;
        document.body.appendChild(loader);
      }
      loader.classList.remove('hidden');
    } else {
      if (loader) {
        loader.classList.add('hidden');
      }
    }
  },

  // แสดง Alert
  showAlert(message, type = 'info') {
    const colors = {
      success: 'bg-green-100 border-green-400 text-green-700',
      error: 'bg-red-100 border-red-400 text-red-700',
      warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
      info: 'bg-blue-100 border-blue-400 text-blue-700'
    };

    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 ${colors[type]} border px-4 py-3 rounded shadow-lg z-50 max-w-md`;
    alert.innerHTML = `
      <div class="flex items-start">
        <span class="flex-1">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  },

  // แสดง Confirm Dialog
  async showConfirm(message, title = 'ยืนยัน') {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-gray-800 mb-4">${title}</h3>
          <p class="text-gray-600 mb-6">${message}</p>
          <div class="flex gap-3 justify-end">
            <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              ยกเลิก
            </button>
            <button id="confirm-btn" class="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
              ยืนยัน
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      modal.querySelector('#cancel-btn').onclick = () => {
        modal.remove();
        resolve(false);
      };
      
      modal.querySelector('#confirm-btn').onclick = () => {
        modal.remove();
        resolve(true);
      };
    });
  },

  // คำนวณ % เปลี่ยนแปลง
  calculatePercentChange(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showAlert('คัดลอกแล้ว!', 'success');
      return true;
    } catch (err) {
      this.showAlert('ไม่สามารถคัดลอกได้', 'error');
      return false;
    }
  },

  // Download as JSON
  downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Export to CSV
  exportToCSV(data, filename) {
    if (!data || data.length === 0) {
      this.showAlert('ไม่มีข้อมูลที่จะ export', 'warning');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const cell = row[header];
          // Escape commas and quotes
          return typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Check if mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Truncate text
  truncate(text, length = 50) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  },

  // Calculate pagination
  paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }
};
