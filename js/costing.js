// costing.js - Smart Costing Module
const Costing = {
  ingredients: [],
  currentProduct: null,

  init() {
    this.loadDraft();
    this.setupEventListeners();
    this.updateSummary();
    this.loadRecentCosting();
  },

  setupEventListeners() {
    // Category change
    document.getElementById('category').addEventListener('change', (e) => {
      this.updateDefaultPercents(e.target.value);
    });

    // Add ingredient button
    document.getElementById('add-ingredient-btn').addEventListener('click', () => {
      this.addIngredientRow();
    });

    // Calculate button
    document.getElementById('calculate-btn').addEventListener('click', () => {
      this.calculate();
    });

    // Save button
    document.getElementById('save-btn').addEventListener('click', () => {
      this.save();
    });

    // Export buttons
    const ex = document.getElementById('export-costing-excel');
    if (ex) ex.addEventListener('click', (e) => { e.preventDefault(); this.exportAllCostingCSV(); });

    const ep = document.getElementById('export-costing-pdf');
    if (ep) ep.addEventListener('click', (e) => { e.preventDefault(); this.exportAllCostingPDF(); });

    const more = document.getElementById('recent-costing-more');
    if (more) more.addEventListener('click', (e) => { e.preventDefault(); this.showMoreRecentCosting(); });


    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.reset();
    });
  },

  updateDefaultPercents(category) {
    const marketing = CONFIG.DEFAULTS.MARKETING_PERCENT[category] || 10;
    const profit = CONFIG.DEFAULTS.PROFIT_PERCENT[category] || 25;
    
    document.getElementById('marketing-percent').value = marketing;
    document.getElementById('profit-percent').value = profit;
  },

  addIngredientRow(data = null) {
    const id = data?.id || Utils.generateId('ing');
    const row = document.createElement('div');
    row.className = 'ingredient-row grid grid-cols-12 gap-2 items-end mb-3';
    row.dataset.id = id;
    
    row.innerHTML = `
      <div class="col-span-4">
        <input type="text" 
               class="w-full p-2 border rounded-lg text-sm" 
               placeholder="วัตถุดิบ" 
               value="${data?.name || ''}"
               data-field="name">
      </div>
      <div class="col-span-2">
        <input type="number" 
               class="w-full p-2 border rounded-lg text-sm" 
               placeholder="จำนวน" 
               value="${data?.quantity || ''}"
               data-field="quantity"
               step="0.01">
      </div>
      <div class="col-span-2">
        <select class="w-full p-2 border rounded-lg text-sm" data-field="unit">
          ${CONFIG.UNITS.map(u => `<option ${data?.unit === u ? 'selected' : ''}>${u}</option>`).join('')}
        </select>
      </div>
      <div class="col-span-2">
        <input type="number" 
               class="w-full p-2 border rounded-lg text-sm" 
               placeholder="ราคา/หน่วย" 
               value="${data?.pricePerUnit || ''}"
               data-field="pricePerUnit"
               step="0.01">
      </div>
      <div class="col-span-1">
        <input type="text" 
               class="w-full p-2 border rounded-lg text-sm bg-gray-50 font-medium" 
               readonly 
               value="0"
               data-field="total">
      </div>
      <div class="col-span-1 text-center">
        <button onclick="Costing.removeIngredient('${id}')" 
                class="text-red-500 hover:text-red-700 p-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    `;

    // Add event listeners for auto-calculation
    row.querySelectorAll('input[data-field], select[data-field]').forEach(input => {
      input.addEventListener('input', () => {
        this.calculateRowTotal(row);
        this.updateSummary();
    this.loadRecentCosting();
        this.saveDraft();
      });
    });

    document.getElementById('ingredients-container').appendChild(row);
    
    if (data) {
      this.calculateRowTotal(row);
    }
  },

  calculateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('[data-field="quantity"]').value) || 0;
    const pricePerUnit = parseFloat(row.querySelector('[data-field="pricePerUnit"]').value) || 0;
    const total = quantity * pricePerUnit;
    
    row.querySelector('[data-field="total"]').value = Utils.formatNumber(total, 2);
    return total;
  },

  removeIngredient(id) {
    const row = document.querySelector(`[data-id="${id}"]`);
    if (row) {
      row.remove();
      this.updateSummary();
    this.loadRecentCosting();
      this.saveDraft();
    }
  },

  getIngredientsData() {
    const rows = document.querySelectorAll('.ingredient-row');
    const ingredients = [];
    
    rows.forEach(row => {
      const name = row.querySelector('[data-field="name"]').value;
      if (name.trim()) {
        ingredients.push({
          name: name,
          quantity: parseFloat(row.querySelector('[data-field="quantity"]').value) || 0,
          unit: row.querySelector('[data-field="unit"]').value,
          pricePerUnit: parseFloat(row.querySelector('[data-field="pricePerUnit"]').value) || 0,
          total: parseFloat(row.querySelector('[data-field="total"]').value) || 0
        });
      }
    });
    
    return ingredients;
  },

  updateSummary() {
    const ingredients = this.getIngredientsData();
    const ingredientsTotal = ingredients.reduce((sum, ing) => sum + ing.total, 0);
    
    document.getElementById('ingredients-total').textContent = Utils.formatCurrency(ingredientsTotal);
  },

  calculate() {
    // Get form data
    const productName = document.getElementById('product-name').value.trim();
    const category = document.getElementById('category').value;
    const ingredients = this.getIngredientsData();
    
    // Validation
    if (!productName) {
      Utils.showAlert('กรุณากรอกชื่อสินค้า', 'warning');
      return;
    }
    
    if (ingredients.length === 0) {
      Utils.showAlert('กรุณาเพิ่มวัตถุดิบอย่างน้อย 1 รายการ', 'warning');
      return;
    }

    // Get all costs
    const ingredientsTotal = ingredients.reduce((sum, ing) => sum + ing.total, 0);
    const yieldQuantity = parseFloat(document.getElementById('yield-quantity').value) || 1;
    const packagingCost = parseFloat(document.getElementById('packaging-cost').value) || 0;
    const labelCost = parseFloat(document.getElementById('label-cost').value) || 0;
    const laborCost = parseFloat(document.getElementById('labor-cost').value) || 0;
    const marketingPercent = parseFloat(document.getElementById('marketing-percent').value) || 0;
    const profitPercent = parseFloat(document.getElementById('profit-percent').value) || 0;

    // Calculate
    const costPerUnit = ingredientsTotal / yieldQuantity;
    const totalCostPerUnit = costPerUnit + packagingCost + labelCost + (laborCost / yieldQuantity);
    const marketingCost = totalCostPerUnit * (marketingPercent / 100);
    const profitMargin = (totalCostPerUnit + marketingCost) * (profitPercent / 100);
    const recommendedPrice = totalCostPerUnit + marketingCost + profitMargin;

    // Display results
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('result-cost-per-unit').textContent = Utils.formatCurrency(costPerUnit);
    document.getElementById('result-total-cost').textContent = Utils.formatCurrency(totalCostPerUnit);
    document.getElementById('result-marketing-cost').textContent = Utils.formatCurrency(marketingCost);
    document.getElementById('result-profit-margin').textContent = Utils.formatCurrency(profitMargin);
    document.getElementById('result-recommended-price').textContent = Utils.formatCurrency(recommendedPrice);

    // Store current calculation
    this.currentProduct = {
      productName,
      category,
      ingredients,
      yieldQuantity,
      packagingCost,
      labelCost,
      laborCost,
      marketingPercent,
      profitPercent,
      results: {
        costPerUnit,
        totalCostPerUnit,
        marketingCost,
        profitMargin,
        recommendedPrice
      }
    };

    Utils.showAlert('คำนวณเรียบร้อยแล้ว!', 'success');
  },

  async save() {
    if (!this.currentProduct) {
      Utils.showAlert('กรุณาคำนวณก่อนบันทึก', 'warning');
      return;
    }

    const user = Auth.getCurrentUser();
    if (!user) {
      Utils.showAlert('กรุณาเข้าสู่ระบบ', 'error');
      return;
    }

    try {
      Utils.showLoading(true, 'กำลังบันทึก...');

      const data = {
        userId: user.phone,
        ...this.currentProduct,
        createdAt: new Date().toISOString()
      };

      const result = await API.saveCosting(data);

      if (result.success) {
        Utils.showAlert('บันทึกสำเร็จ!', 'success');
        this.clearDraft();
        
        setTimeout(() => {
          if (confirm('ต้องการสร้างใบเสนอราคาหรือไม่?')) {
            window.location.href = 'sales-tools.html';
          }
        }, 1000);
      } else {
        Utils.showAlert(result.error || 'บันทึกไม่สำเร็จ', 'error');
      }

    } catch (error) {
      console.error('Save error:', error);
      Utils.showAlert('เกิดข้อผิดพลาด', 'error');
    } finally {
      Utils.showLoading(false);
    }
  },

  reset() {
    if (confirm('ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
      document.getElementById('costing-form').reset();
      document.getElementById('ingredients-container').innerHTML = '';
      document.getElementById('results').classList.add('hidden');
      this.currentProduct = null;
      this.clearDraft();
      this.addIngredientRow();
      Utils.showAlert('ล้างข้อมูลแล้ว', 'info');
    }
  },

  saveDraft() {
    const draft = {
      productName: document.getElementById('product-name').value,
      category: document.getElementById('category').value,
      ingredients: this.getIngredientsData(),
      yieldQuantity: document.getElementById('yield-quantity').value,
      packagingCost: document.getElementById('packaging-cost').value,
      labelCost: document.getElementById('label-cost').value,
      laborCost: document.getElementById('labor-cost').value,
      marketingPercent: document.getElementById('marketing-percent').value,
      profitPercent: document.getElementById('profit-percent').value
    };
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.COSTING_DRAFT, JSON.stringify(draft));
  },

  loadDraft() {
    const draft = localStorage.getItem(CONFIG.STORAGE_KEYS.COSTING_DRAFT);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        
        document.getElementById('product-name').value = data.productName || '';
        document.getElementById('category').value = data.category || 'food';
        document.getElementById('yield-quantity').value = data.yieldQuantity || '';
        document.getElementById('packaging-cost').value = data.packagingCost || '';
        document.getElementById('label-cost').value = data.labelCost || '';
        document.getElementById('labor-cost').value = data.laborCost || '';
        document.getElementById('marketing-percent').value = data.marketingPercent || 12;
        document.getElementById('profit-percent').value = data.profitPercent || 25;
        
        if (data.ingredients && data.ingredients.length > 0) {
          data.ingredients.forEach(ing => this.addIngredientRow(ing));
        } else {
          this.addIngredientRow();
        }
        
        this.updateSummary();
    this.loadRecentCosting();
      } catch (error) {
        console.error('Error loading draft:', error);
        this.addIngredientRow();
      }
    } else {
      this.addIngredientRow();
    }
  },

  clearDraft() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.COSTING_DRAFT);
  }

  async loadRecentCosting() {
    const user = Auth.getCurrentUser();
    if (!user || !user.userId) return;

    try {
      const res = await API.getCostingList(user.userId);
      if (!res || !res.success) {
        this.renderRecentCosting([]);
        return;
      }
      const list = res.data || [];
      list.sort((a,b) => String(b.timestamp||'').localeCompare(String(a.timestamp||'')));
      this._allCostingList = list;
      this.renderRecentCosting(list.slice(0,3));
      const moreBtn = document.getElementById('recent-costing-more');
      if (moreBtn) moreBtn.classList.toggle('hidden', list.length <= 3);
    } catch (e) {
      console.error(e);
      this.renderRecentCosting([]);
    }
  },

  renderRecentCosting(items) {
    const tbody = document.getElementById('recent-costing-list');
    if (!tbody) return;

    if (!items || items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-gray-400">ยังไม่มีรายการคำนวณ</td></tr>`;
      return;
    }

    const fmt = (n) => (typeof Utils !== 'undefined' && Utils.formatCurrency) ? Utils.formatCurrency(n) : Number(n||0).toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2});
    const dateFmt = (iso) => { try { return new Date(iso).toLocaleString('th-TH'); } catch { return ''; } };

    tbody.innerHTML = items.map(it => `
      <tr class="border-b">
        <td class="py-3 pr-4 text-gray-500">${dateFmt(it.timestamp)}</td>
        <td class="py-3 pr-4 font-medium text-gray-800">${it.product_name || it.productName || '-'}</td>
        <td class="py-3 pr-4 text-gray-600">${it.category || '-'}</td>
        <td class="py-3 pr-4 text-right font-bold text-emerald-700">฿${fmt(it.recommended_price || it.recommendedPrice || 0)}</td>
        <td class="py-3 pr-4 text-right">
          <div class="flex justify-end gap-2">
            <button type="button" class="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              onclick="Costing.editCosting('${it.product_id}')">แก้ไข</button>
            <button type="button" class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
              onclick="Costing.deleteCosting('${it.product_id}')">ลบ</button>
            <button type="button" class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              onclick="Costing.downloadCosting('${it.product_id}')">ดาวน์โหลด</button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  showMoreRecentCosting() {
    const list = this._allCostingList || [];
    if (!list.length) return;
    // แสดงทั้งหมดในตารางเดียว
    this.renderRecentCosting(list);
    const moreBtn = document.getElementById('recent-costing-more');
    if (moreBtn) moreBtn.classList.add('hidden');
  },

  async editCosting(productId) {
    const list = this._allCostingList || [];
    const item = list.find(x => String(x.product_id) === String(productId));
    if (!item) return;

    // เติมฟอร์ม
    document.getElementById('product-name').value = item.product_name || '';
    document.getElementById('category').value = item.category || 'food';
    document.getElementById('yield-quantity').value = item.yield_quantity || 1;
    document.getElementById('packaging-cost').value = item.packaging_cost || 0;
    document.getElementById('label-cost').value = item.label_cost || 0;
    document.getElementById('labor-cost').value = item.labor_cost || 0;
    document.getElementById('marketing-percent').value = item.marketing_percent || 0;
    document.getElementById('profit-percent').value = item.profit_percent || 0;

    // เคลียร์วัตถุดิบแล้วใส่ใหม่
    document.getElementById('ingredients-container').innerHTML = '';
    (item.ingredients_data || []).forEach(ing => {
      this.addIngredientRow({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        pricePerUnit: ing.pricePerUnit,
        total: ing.total
      });
    });
    this.updateSummary();

    // เก็บ product_id ไว้เพื่อ update
    this._editingProductId = productId;

    // คำนวณใหม่ให้ผลลัพธ์โชว์
    this.calculate();
  },

  async deleteCosting(productId) {
    if (!confirm('ยืนยันลบรายการนี้?')) return;
    try {
      const res = await API.request('delete-costing', { product_id: productId });
      if (res && res.success) {
        U_('showAlert')('ลบสำเร็จ', 'success');
        await this.loadRecentCosting();
      } else {
        U_('showAlert')('ลบไม่สำเร็จ: ' + (res.error || 'ไม่ทราบสาเหตุ'), 'error');
      }
    } catch (e) {
      U_('showAlert')('เกิดข้อผิดพลาด: ' + e.message, 'error');
    }
  },

  downloadCosting(productId) {
    const list = this._allCostingList || [];
    const item = list.find(x => String(x.product_id) === String(productId));
    if (!item) return;

    // ดาวน์โหลดเป็น JSON
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `costing_${productId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportAllCostingCSV() {
    const list = this._allCostingList || [];
    if (!list.length) return;

    const headers = ['timestamp','product_id','product_name','category','recommended_price'];
    const rows = list.map(x => [
      x.timestamp || '',
      x.product_id || '',
      (x.product_name || '').replaceAll('"','""'),
      (x.category || '').replaceAll('"','""'),
      x.recommended_price || 0
    ]);

    const csv = [headers.join(','), ...rows.map(r => `"${r[0]}","${r[1]}","${r[2]}","${r[3]}",${r[4]}`)].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_costing_all.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  exportAllCostingPDF() {
    const list = this._allCostingList || [];
    if (!list.length) return;

    const fmt = (n) => (typeof Utils !== 'undefined' && Utils.formatCurrency) ? Utils.formatCurrency(n) : Number(n||0).toLocaleString('th-TH', {minimumFractionDigits:2, maximumFractionDigits:2});
    const dateFmt = (iso) => { try { return new Date(iso).toLocaleString('th-TH'); } catch { return ''; } };

    const html = `
      <html><head><meta charset="utf-8"><title>Smart Costing Export</title>
      <style>
        body{font-family:Arial, sans-serif; padding:16px;}
        table{width:100%; border-collapse:collapse;}
        th,td{border:1px solid #ddd; padding:8px; font-size:12px;}
        th{background:#f5f5f5;}
        .r{text-align:right;}
      </style></head>
      <body>
        <h2>รายการคำนวณต้นทุน (ทั้งหมด)</h2>
        <table>
          <thead><tr><th>วันที่</th><th>สินค้า</th><th>ประเภท</th><th class="r">ราคาขายแนะนำ</th></tr></thead>
          <tbody>
            ${list.map(it => `<tr>
              <td>${dateFmt(it.timestamp)}</td>
              <td>${it.product_name || '-'}</td>
              <td>${it.category || '-'}</td>
              <td class="r">฿${fmt(it.recommended_price || 0)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <script>window.onload=()=>{window.print();}</script>
      </body></html>
    `;
    const w = window.open('', '_blank');
    w.document.open();
    w.document.write(html);
    w.document.close();
  },

};

document.addEventListener('DOMContentLoaded', () => {
  Costing.init();
});
