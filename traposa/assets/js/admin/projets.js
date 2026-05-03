// TRAPOSA Admin Projects JavaScript

class AdminProjets {
  constructor() {
    this.projets = [];
    this.init();
  }

  async init() {
    await this.loadProjets();
    this.initFilters();
    this.initSearch();
  }

  async loadProjets() {
    try {
      const { data, error } = await supabase
        ?.from('traposa_projets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.projets = data || [];
      this.renderProjets(this.projets);
    } catch (error) {
      console.error('Error loading projets:', error);
    }
  }

  renderProjets(projets) {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    if (projets.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;">Okenn pwojè</td></tr>';
      return;
    }

    tbody.innerHTML = projets.map(p => `
      <tr data-id="${p.id}">
        <td><strong>${p.title}</strong></td>
        <td>${p.category}</td>
        <td>${p.department || '-'}</td>
        <td>G${(p.goal_amount || 0).toLocaleString()}</td>
        <td>G${(p.raised_amount || 0).toLocaleString()}</td>
        <td><span class="admin-status ${p.status}">${p.status}</span></td>
        <td class="table-actions">
          <button class="table-btn" onclick="editProjet('${p.id}')"><i data-lucide="edit"></i></button>
          <button class="table-btn delete" onclick="deleteProjet('${p.id}')"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();
  }

  initFilters() {
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const status = e.target.value.toLowerCase();
        if (status === 'tout') {
          this.renderProjets(this.projets);
        } else {
          const filtered = this.projets.filter(p => p.status === status);
          this.renderProjets(filtered);
        }
      });
    }
  }

  initSearch() {
    const searchInput = document.querySelector('.admin-search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = this.projets.filter(p => 
          p.title?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term)
        );
        this.renderProjets(filtered);
      });
    }
  }
}

async function editProjet(id) {
  // Navigate to edit page or open modal
  window.location.href = `?action=edit&id=${id}`;
}

async function deleteProjet(id) {
  if (!confirm('Èske ou sèten ou vle efase pwojè sa a?')) return;

  try {
    const { error } = await supabase
      ?.from('traposa_projets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    location.reload();
  } catch (error) {
    alert('Erè: ' + error.message);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminProjets();
});
