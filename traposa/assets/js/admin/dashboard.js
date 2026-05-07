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
    // traposa_settings uses named columns (org_name, slogan, etc.), not key-value pattern
    // Using hardcoded defaults for stats
    const statsDefaults = {
      stat_dons_total: 450000,
      stat_beneficiaires: 12450,
      stat_projets: 48,
      stat_benevoles: 500
    };

    // Update UI with default values
    const donsEl = document.getElementById('statDons');
    const benefEl = document.getElementById('statBeneficiaires');
    const projEl = document.getElementById('statProjets');
    const benEl = document.getElementById('statBenevoles');

    if (donsEl) donsEl.textContent = 'G' + statsDefaults.stat_dons_total.toLocaleString();
    if (benefEl) benefEl.textContent = statsDefaults.stat_beneficiaires.toLocaleString();
    if (projEl) projEl.textContent = statsDefaults.stat_projets.toLocaleString();
    if (benEl) benEl.textContent = statsDefaults.stat_benevoles.toLocaleString() + '+';
  }

  updateStatDisplay(className, value, prefix = '') {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => {
      el.textContent = prefix + value.toLocaleString();
    });
  }

  async loadRecentDonations() {
    try {
      const { data: donations, error } = await supabase
        ?.from('traposa_donations')
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
