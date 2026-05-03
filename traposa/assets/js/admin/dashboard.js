// TRAPOSA Admin Dashboard JavaScript

class AdminDashboard {
  constructor() {
    this.init();
  }

  async init() {
    // Check admin status
    if (typeof requireAdmin === 'function') {
      requireAdmin();
    }

    this.loadStats();
    this.loadRecentDonations();
  }

  async loadStats() {
    try {
      // Load aggregate stats
      const [donationsRes, projetsRes, benevolesRes] = await Promise.all([
        supabase?.from('traposa_donations').select('amount').eq('status', 'confirmed'),
        supabase?.from('traposa_projets').select('id').eq('status', 'active'),
        supabase?.from('traposa_benevoles').select('id').eq('status', 'active')
      ]);

      const totalDonations = donationsRes?.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const activeProjets = projetsRes?.data?.length || 0;
      const activeBenevoles = benevolesRes?.data?.length || 0;

      // Update UI
      this.updateStatDisplay('stat-donations', totalDonations, 'G');
      this.updateStatDisplay('stat-projets', activeProjets);
      this.updateStatDisplay('stat-benevoles', activeBenevoles);

    } catch (error) {
      console.error('Error loading stats:', error);
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
