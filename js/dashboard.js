// dashboard.js - Dashboard (User)

const Dashboard = {
  state: {
    summary: null,
    recentTransactions: [],
    news: []
  },

  async init() {
    this.bindUI();
    await this.load();
  },

  bindUI() {
    const user = Auth.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return;
    }
    const name = user.chairmanOwnerName || user.chairman_owner_name || user.fullName || user.full_name || user.shopName || user.shop_name || 'ผู้ใช้';
    document.getElementById('user-name').textContent = name;

    // marquee placeholder
    const marquee = document.getElementById('news-marquee');
    if (marquee) marquee.textContent = 'กำลังโหลดประกาศ...';
  },

  async load() {
    try {
      const user = Auth.getCurrentUser();
      if (!user || !user.userId) {
        window.location.href = 'index.html';
        return;
      }

      // โหลดสรุป
      const res = await API.getDashboardData(user.userId);
      if (res && res.success) {
        const data = res.data || {};
        this.state.summary = data.summary || data || {};
        this.state.recentTransactions = data.recentTransactions || [];
      } else {
        this.state.summary = { monthlyIncome:0, monthlyExpense:0, yearlyProfit:0, productCount:0 };
        this.state.recentTransactions = [];
      }

      // โหลดข่าว
      const newsRes = await API.getActiveNews();
      if (newsRes && newsRes.success) this.state.news = newsRes.data || [];
      else this.state.news = [];

      this.renderSummary();
      this.renderRecentTransactions();
      this.renderNewsMarquee();
    } catch (e) {
      console.error(e);
    }
  },

  renderSummary() {
    const s = this.state.summary || {};
    const income = Number(s.monthlyIncome || 0);
    const expense = Number(s.monthlyExpense || 0);
    const profit = income - expense;
    const yearlyProfit = Number(s.yearlyProfit || 0);
    const productCount = Number(s.productCount || 0);

    const fmt = (n) => (typeof Utils !== 'undefined' && Utils.formatCurrency) ? Utils.formatCurrency(n) : Number(n||0).toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2});

    const profitEl = document.getElementById('monthly-profit-value');
    if (profitEl) profitEl.textContent = '฿' + fmt(profit);

    const incomeEl = document.getElementById('monthly-income-value');
    if (incomeEl) incomeEl.textContent = '฿' + fmt(income);

    const expenseEl = document.getElementById('monthly-expense-value');
    if (expenseEl) expenseEl.textContent = '฿' + fmt(expense);

    const prodEl = document.getElementById('product-count-value');
    if (prodEl) prodEl.textContent = String(productCount);

    const yearEl = document.getElementById('transaction-count-value');
    if (yearEl) yearEl.textContent = '฿' + fmt(yearlyProfit);
  },

  renderRecentTransactions() {
    const list = document.getElementById('recent-transactions');
    if (!list) return;

    const txs = this.state.recentTransactions || [];
    if (!txs.length) {
      list.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <p>ยังไม่มีรายการบันทึก</p>
          <a href="accounting.html" class="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
            เริ่มบันทึกรายรับรายจ่าย →
          </a>
        </div>`;
      return;
    }

    const fmt = (n) => (typeof Utils !== 'undefined' && Utils.formatCurrency) ? Utils.formatCurrency(n) : Number(n||0).toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2});
    const dateFmt = (iso) => {
      try {
        const d = new Date(iso);
        return d.toLocaleString('th-TH');
      } catch { return ''; }
    };

    list.innerHTML = txs.slice(0,5).map(tx => {
      const isIncome = String(tx.type).toLowerCase() === 'income' || tx.type === 'รายรับ';
      const sign = isIncome ? '+' : '-';
      const color = isIncome ? 'text-emerald-600' : 'text-red-600';
      const bg = isIncome ? 'bg-emerald-50' : 'bg-red-50';
      const icon = isIncome ? '↑' : '↓';
      const title = tx.note || tx.description || tx.category || '-';
      return `
        <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
          <div class="flex items-center">
            <div class="w-10 h-10 ${bg} rounded-full flex items-center justify-center ${color} font-bold text-xl">
              ${icon}
            </div>
            <div class="ml-4">
              <div class="font-medium text-gray-800">${title}</div>
              <div class="text-sm text-gray-500">${dateFmt(tx.date)}</div>
            </div>
          </div>
          <div class="${color} font-bold">
            ${sign}฿${fmt(tx.amount)}
          </div>
        </div>`;
    }).join('');
  },

  renderNewsMarquee() {
    const marquee = document.getElementById('news-marquee');
    if (!marquee) return;

    const news = this.state.news || [];
    if (!news.length) {
      marquee.textContent = 'ยังไม่มีประกาศ';
      return;
    }

    const items = news.map(n => (n.title ? n.title : n.message || n.content || '')).filter(Boolean);
    marquee.innerHTML = `<div class="marquee">${items.join(' • ')}</div>`;
  },

  async refresh() { await this.load(); },

  logout() {
    Auth.logout();
    window.location.href = 'index.html';
  },

  showQuickMenu() {
    const m = document.getElementById('quick-menu-modal');
    if (m) m.classList.remove('hidden');
  },
  closeQuickMenu() {
    const m = document.getElementById('quick-menu-modal');
    if (m) m.classList.add('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
