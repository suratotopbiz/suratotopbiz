/**
 * Utils Module (minimal, safe)
 */
const Utils = {
  showLoading(message = 'กำลังโหลด...') {
    try {
      let overlay = document.getElementById('loading-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        overlay.innerHTML = `
          <div class="bg-white rounded-xl p-6 flex flex-col items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mb-3"></div>
            <p id="loading-message" class="text-gray-700 text-sm">${message}</p>
          </div>
        `;
        document.body.appendChild(overlay);
      } else {
        const msg = document.getElementById('loading-message');
        if (msg) msg.textContent = message;
        overlay.classList.remove('hidden');
      }
    } catch (e) {
      console.warn('Utils.showLoading error:', e);
    }
  },
  hideLoading() {
    try {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) overlay.classList.add('hidden');
    } catch (e) {
      console.warn('Utils.hideLoading error:', e);
    }
  }
};
