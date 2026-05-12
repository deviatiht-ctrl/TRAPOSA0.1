// TRAPOSA Admin Benevoles JavaScript

class AdminBenevoles {
  constructor() {
    this.benevoles = [];
    this.init();
  }

  async init() {
    await this.loadBenevoles();
  }

  async loadBenevoles() {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_benevoles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.benevoles = data || [];
      this.renderBenevoles(this.benevoles);
    } catch (error) {
      console.error('Error loading benevoles:', error);
    }
  }

  renderBenevoles(benevoles) {
    const tbody = document.getElementById('benevolesTable');
    if (!tbody) return;

    if (benevoles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Okenn bénévòl jwenn</td></tr>';
      return;
    }

    tbody.innerHTML = benevoles.map(b => `
      <tr>
        <td><strong>${b.full_name}</strong></td>
        <td>${b.email}</td>
        <td>${b.skills ? b.skills.join(', ') : '-'}</td>
        <td><span class="admin-status ${b.status}">${b.status === 'active' ? 'Aktif' : (b.status === 'pending' ? 'An atant' : 'Inaktif')}</span></td>
        <td class="table-actions">
          <button class="table-btn" title="Modifye"><i data-lucide="edit"></i></button>
          <button class="table-btn delete" title="Efase"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminBenevoles();
});
