// TRAPOSA Admin Equipe JavaScript

class AdminEquipe {
  constructor() {
    this.equipe = [];
    this.init();
  }

  async init() {
    await this.loadEquipe();
  }

  async loadEquipe() {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_equipe')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.equipe = data || [];
      this.renderEquipe(this.equipe);
    } catch (error) {
      console.error('Error loading equipe:', error);
    }
  }

  renderEquipe(equipe) {
    const tbody = document.getElementById('equipeTable');
    if (!tbody) return;

    if (equipe.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Okenn manm jwenn</td></tr>';
      return;
    }

    tbody.innerHTML = equipe.map(m => `
      <tr>
        <td><strong>${m.full_name}</strong></td>
        <td>${m.role}</td>
        <td>${m.department || '-'}</td>
        <td>${m.email || '-'}</td>
        <td><span class="admin-status ${m.is_active ? 'active' : 'inactive'}">${m.is_active ? 'Aktif' : 'Inaktif'}</span></td>
        <td class="table-actions">
          <button class="table-btn"><i data-lucide="edit"></i></button>
          <button class="table-btn delete"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminEquipe();
});
