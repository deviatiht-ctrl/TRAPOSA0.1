// TRAPOSA Admin Partenaires JavaScript

class AdminPartenaires {
  constructor() {
    this.partenaires = [];
    this.init();
  }

  async init() {
    await this.loadPartenaires();
  }

  async loadPartenaires() {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_partenaires')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.partenaires = data || [];
      this.renderPartenaires(this.partenaires);
    } catch (error) {
      console.error('Error loading partenaires:', error);
    }
  }

  renderPartenaires(partenaires) {
    const tbody = document.getElementById('partenairesTable');
    if (!tbody) return;

    if (partenaires.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;">Okenn patnè jwenn</td></tr>';
      return;
    }

    tbody.innerHTML = partenaires.map(p => `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td>${p.website_url || '-'}</td>
        <td><span class="admin-status ${p.is_active ? 'active' : 'inactive'}">${p.is_active ? 'Aktif' : 'Inaktif'}</span></td>
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
  new AdminPartenaires();
});
