// TRAPOSA Admin Dashboard JavaScript

class AdminDashboard {
  constructor() {
    this.init();
  }

  async init() {
    // Check admin status
    if (typeof requireAdmin === 'function') {
      const ok = await requireAdmin();
      if (!ok) return;
    }

    this.loadStats();
    this.loadRecentDonations();
  }

  async loadStats() {
    try {
      const { data: settings, error } = await window.supabaseClient
        .from('traposa_settings')
        .select('stat_beneficiaires, stat_projets, stat_benevoles, stat_dons_total')
        .single();

      // Use database values or defaults
      const stats = settings || {
        stat_beneficiaires: 10000,
        stat_projets: 3,
        stat_benevoles: 50,
        stat_dons_total: 450000
      };

      // Update UI with database values
      const donsEl = document.getElementById('statDons');
      const benefEl = document.getElementById('statBeneficiaires');
      const projEl = document.getElementById('statProjets');
      const benEl = document.getElementById('statBenevoles');

      // Use nullish coalescing operator (??) so 0 is treated as a valid value instead of falsy
      if (donsEl) donsEl.textContent = 'G' + (stats.stat_dons_total ?? 450000).toLocaleString();
      if (benefEl) benefEl.textContent = (stats.stat_beneficiaires ?? 10000).toLocaleString();
      if (projEl) projEl.textContent = (stats.stat_projets ?? 3).toLocaleString();
      if (benEl) benEl.textContent = (stats.stat_benevoles ?? 50).toLocaleString() + '+';
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use default values on error
    }
  }

  updateStatDisplay(className, value, prefix = '') {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
      el.textContent = prefix + value.toLocaleString();
    });
  }

  async loadRecentDonations() {
    try {
      const { data: donations, error } = await window.supabaseClient
        .from('traposa_donations')
        .select('*')
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const tbody = document.querySelector('.admin-table tbody');
      if (tbody && donations) {
        tbody.innerHTML = donations.map(d => `
          <tr>
            <td>${d.is_anonymous ? 'Anonim' : (d.donor_name || 'Yon zanmi')}</td>
            <td>${d.cause_name || 'Jeneral'}</td>
            <td>${this.formatCurrency(d.amount, d.currency)}</td>
            <td>${this.formatDate(d.created_at)}</td>
            <td><span class="admin-status confirmed">Konfime</span></td>
          </tr>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading donations:', error);
    }
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
  new AdminDashboard();
});
