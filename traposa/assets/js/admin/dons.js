// TRAPOSA Admin Dons JavaScript

class AdminDons {
  constructor() {
    this.dons = [];
    this.init();
  }

  async init() {
    await this.loadStats();
    await this.loadDons();
  }

  async loadStats() {
    try {
      const { data: settings, error } = await window.supabaseClient
        .from('traposa_settings')
        .select('stat_dons_total')
        .single();

      // Use database values or defaults
      const totalDons = settings?.stat_dons_total || 0;

      // Update UI with database values
      const donsTotalEl = document.getElementById('statTotalDons');

      if (donsTotalEl) donsTotalEl.textContent = 'G' + totalDons.toLocaleString();
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async loadDons() {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.dons = data || [];
      
      // Update count
      const countEl = document.getElementById('statCountDons');
      if (countEl) countEl.textContent = this.dons.length.toLocaleString();
      
      this.renderDons(this.dons);
    } catch (error) {
      console.error('Error loading donations:', error);
    }
  }

  renderDons(dons) {
    const tbody = document.getElementById('donsTable');
    if (!tbody) return;

    if (dons.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Okenn don jwenn</td></tr>';
      return;
    }

    tbody.innerHTML = dons.map(d => `
      <tr>
        <td>${this.formatDate(d.created_at)}</td>
        <td><strong>${d.is_anonymous ? 'Anonim' : (d.donor_name || 'Yon zanmi')}</strong></td>
        <td>${d.cause_name || 'Jeneral'}</td>
        <td><strong>${this.formatCurrency(d.amount, d.currency)}</strong></td>
        <td>${d.payment_method || 'Kat Kredit'}</td>
        <td><span class="admin-status ${d.status}">${d.status === 'confirmed' ? 'Konfime' : d.status}</span></td>
      </tr>
    `).join('');

    lucide.createIcons();
  }

  formatCurrency(amount, currency = 'HTG') {
    const symbols = { HTG: 'G', USD: '$', EUR: '€' };
    const symbol = symbols[currency] || currency;
    return `${symbol}${(amount || 0).toLocaleString()}`;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ht-HT');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminDons();
});
