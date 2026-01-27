// dashboard.js - Dashboard Module
const Dashboard = {
  data: {
    summary: null,
    recentTransactions: [],
    recentCosting: [],
    news: []
  },

  // Initialize dashboard
  async init() {
    this.setupUI();
    await this.loadData();
    this.renderAll();
  },

  // Setup UI elements
  setupUI() {
    // Update user info
    const user = Auth.getCurrentUser();
    if (user) {
      document.getElementById('user-name').textContent = user.fullName || user.shopName || 'ผู้ใช้';
      document.getElementById('user-shop').textContent = user.shopName || user.district || '';
    }
  },

  // Load all dashboard data
  async loadData() {
    try {
      Utils.showLoading(true, 'กำลังโหลดข้อมูล...');
      
      const user = Auth.getCurrentUser();
      if (!user) {
        window.location.href = 'index.html';
        return;
      }

      // Load dashboard data from API
      const result = await API.getDashboardData(user.phone);
      
      if (result.success) {
        this.data.summary = result.data.summary || this.getDefaultSummary();
        this.data.recentTransactions = result.data.recentTransactions || [];
        this.data.recentCosting = result.data.recentCosting || [];
      } else {
        // Use default data if API fails
        this.data.summary = this.getDefaultSummary();
      }

      // Load active news
      const newsResult = await API.getActiveNews();
      if (newsResult.success) {
        this.data.news = newsResult.data || [];
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      this.data.summary = this.getDefaultSummary();
    } finally {
      Utils.showLoading(false);
    }
  },

  // Get default summary for new users
  getDefaultSummary() {
    return {
      monthlyIncome: 0,
      monthlyExpense: 0,
      productCount: 0,
      transactionCount: 0
    };
  },

  // Render all sections
  renderAll() {
    this.renderSummaryCards();
    this.renderQuickActions();
    this.renderRecentTransactions();
    this.renderNews();
  },

  // Render summary cards
  renderSummaryCards() {
    const summary = this.data.summary;
    const profit = summary.monthlyIncome - summary.monthlyExpense;
    const profitPercent = summary.monthlyExpense > 0 
      ? ((profit / summary.monthlyExpense) * 100).toFixed(1) 
      : 0;

    // Update income card
    document.getElementById('monthly-income').innerHTML = `
      <div class="text-3xl font-bold text-emerald-600">
        ${Utils.formatCurrency(summary.monthlyIncome)}
      </div>
      <div class="text-sm text-gray-600 mt-1">รายรับเดือนนี้</div>
    `;

    // Update expense card
    document.getElementById('monthly-expense').innerHTML = `
      <div class="text-3xl font-bold text-red-600">
        ${Utils.formatCurrency(summary.monthlyExpense)}
      </div>
      <div class="text-sm text-gray-600 mt-1">รายจ่ายเดือนนี้</div>
    `;

    // Update profit card
    const profitColor = profit >= 0 ? 'text-blue-600' : 'text-orange-600';
    document.getElementById('monthly-profit').innerHTML = `
      <div class="text-3xl font-bold ${profitColor}">
        ${Utils.formatCurrency(profit)}
      </div>
      <div class="text-sm text-gray-600 mt-1">
        กำไร/ขาดทุน 
        <span class="${profitColor}">(${profitPercent}%)</span>
      </div>
    `;

    // Update product count card
    document.getElementById('product-count').innerHTML = `
      <div class="text-3xl font-bold text-purple-600">
        ${summary.productCount}
      </div>
      <div class="text-sm text-gray-600 mt-1">สินค้าที่คำนวณแล้ว</div>
    `;
  },

  // Render quick actions
  renderQuickActions() {
    const actions = [
      {
        icon: '🧮',
        title: 'คำนวณต้นทุน',
        desc: 'Smart Costing',
        link: 'costing.html',
        color: 'from-emerald-500 to-teal-500'
      },
      {
        icon: '💰',
        title: 'บันทึกรายรับจ่าย',
        desc: 'Accounting',
        link: 'accounting.html',
        color: 'from-blue-500 to-cyan-500'
      },
      {
        icon: '📊',
        title: 'เครื่องมือขาย',
        desc: 'Sales Tools',
        link: 'sales-tools.html',
        color: 'from-purple-500 to-pink-500'
      },
      {
        icon: '📝',
        title: 'สูตรการผลิต',
        desc: 'Formula',
        link: 'formula.html',
        color: 'from-orange-500 to-red-500'
      }
    ];

    const container = document.getElementById('quick-actions');
    container.innerHTML = actions.map(action => `
      <a href="${action.link}" 
         class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 block">
        <div class="flex items-center mb-3">
          <div class="w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-2xl">
            ${action.icon}
          </div>
          <div class="ml-4">
            <h3 class="font-bold text-gray-800">${action.title}</h3>
            <p class="text-sm text-gray-500">${action.desc}</p>
          </div>
        </div>
      </a>
    `).join('');
  },

  // Render recent transactions
  renderRecentTransactions() {
    const container = document.getElementById('recent-transactions');
    
    if (this.data.recentTransactions.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>ยังไม่มีรายการบันทึก</p>
          <a href="accounting.html" class="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
            เริ่มบันทึกรายรับรายจ่าย →
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = this.data.recentTransactions.slice(0, 5).map(tx => {
      const isIncome = tx.type === 'income';
      const icon = isIncome ? '↑' : '↓';
      const colorClass = isIncome ? 'text-emerald-600' : 'text-red-600';
      const bgClass = isIncome ? 'bg-emerald-50' : 'bg-red-50';

      return `
        <div class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition">
          <div class="flex items-center">
            <div class="w-10 h-10 ${bgClass} rounded-full flex items-center justify-center ${colorClass} font-bold text-xl">
              ${icon}
            </div>
            <div class="ml-4">
              <div class="font-medium text-gray-800">${tx.description || tx.category}</div>
              <div class="text-sm text-gray-500">${Utils.formatDate(tx.date, 'short')}</div>
            </div>
          </div>
          <div class="${colorClass} font-bold">
            ${isIncome ? '+' : '-'}${Utils.formatCurrency(tx.amount)}
          </div>
        </div>
      `;
    }).join('');
  },

  // Render news
  renderNews() {
    const container = document.getElementById('news-section');
    
    if (this.data.news.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
          </svg>
          <p>ยังไม่มีข่าวสาร</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.data.news.map(news => `
      <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-l-4 border-emerald-500">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
              </svg>
            </div>
          </div>
          <div class="ml-4 flex-1">
            <h4 class="font-bold text-gray-800 mb-2">${news.title}</h4>
            <p class="text-gray-600 text-sm mb-3">${news.content}</p>
            <div class="text-xs text-gray-500">
              ${Utils.formatDate(news.date, 'short')}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Refresh data
  async refresh() {
    await this.loadData();
    this.renderAll();
    Utils.showAlert('รีเฟรชข้อมูลสำเร็จ', 'success');
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  Dashboard.init();
});
