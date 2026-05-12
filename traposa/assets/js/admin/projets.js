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
    this.initModal();
    this.initForm();
  }

  async loadProjets() {
    try {
      console.log('Loading projects...');
      console.log('Supabase client:', window.supabaseClient);
      
      const { data, error } = await window.supabaseClient
        .from('traposa_projets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.projets = data || [];
      console.log('Projects loaded:', this.projets.length);
      this.renderProjets(this.projets);
    } catch (error) {
      console.error('Error loading projets:', error);
    }
  }

  renderProjets(projets) {
    const tbody = document.getElementById('projectsTable') || document.querySelector('.admin-table tbody');
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

  initModal() {
    // Check URL for action=new or action=edit
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const id = urlParams.get('id');

    if (action === 'new') {
      this.openModal();
    } else if (action === 'edit' && id) {
      this.editProjet(id);
    }
  }

  initForm() {
    const form = document.getElementById('projectForm');
    const imageInput = document.getElementById('projectImage');
    
    if (imageInput) {
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            document.getElementById('imagePreview').innerHTML = 
              `<img src="${e.target.result}" style="max-width:100%;max-height:200px;">`;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.saveProjet();
      });
    }
  }

  openModal() {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    if (modal && form) {
      form.reset();
      document.getElementById('projectId').value = '';
      document.getElementById('modalTitle').textContent = 'Nouvo Pwojè';
      document.getElementById('imagePreview').innerHTML = '';
      modal.style.display = 'flex';
    }
  }

  async editProjet(id) {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_projets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const modal = document.getElementById('projectModal');
      const form = document.getElementById('projectForm');
      
      if (modal && form) {
        document.getElementById('projectId').value = data.id;
        document.getElementById('projectTitle').value = data.title || '';
        document.getElementById('projectSlug').value = data.slug || '';
        document.getElementById('projectDescription').value = data.description || '';
        document.getElementById('projectCategory').value = data.category || 'Edikasyon';
        document.getElementById('projectLocation').value = data.location || '';
        document.getElementById('projectDepartment').value = data.department || '';
        document.getElementById('projectGoal').value = data.goal_amount || '';
        document.getElementById('projectRaised').value = data.raised_amount || '';
        document.getElementById('projectBeneficiaires').value = data.beneficiaires || '';
        document.getElementById('projectStatus').value = data.status || 'active';
        document.getElementById('projectFeatured').checked = data.is_featured || false;
        
        if (data.cover_image_url) {
          document.getElementById('imagePreview').innerHTML = 
            `<img src="${data.cover_image_url}" style="max-width:100%;max-height:200px;">`;
        }
        
        document.getElementById('modalTitle').textContent = 'Modifye Pwojè';
        modal.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error loading projet:', error);
      alert('Erè: ' + error.message);
    }
  }

  async saveProjet() {
    try {
      const id = document.getElementById('projectId').value;
      const imageFile = document.getElementById('projectImage').files[0];
      let coverImageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await window.supabaseClient
          .storage
          .from('project-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = window.supabaseClient
          .storage
          .from('project-images')
          .getPublicUrl(fileName);

        coverImageUrl = publicUrl;
      }

      const projetData = {
        title: document.getElementById('projectTitle').value,
        slug: document.getElementById('projectSlug').value || document.getElementById('projectTitle').value.toLowerCase().replace(/\s+/g, '-'),
        description: document.getElementById('projectDescription').value,
        category: document.getElementById('projectCategory').value,
        location: document.getElementById('projectLocation').value,
        department: document.getElementById('projectDepartment').value,
        goal_amount: parseFloat(document.getElementById('projectGoal').value) || 0,
        raised_amount: parseFloat(document.getElementById('projectRaised').value) || 0,
        beneficiaires: parseInt(document.getElementById('projectBeneficiaires').value) || 0,
        status: document.getElementById('projectStatus').value,
        is_featured: document.getElementById('projectFeatured').checked
      };

      if (coverImageUrl) {
        projetData.cover_image_url = coverImageUrl;
      }

      let error;
      if (id) {
        ({ error } = await window.supabaseClient.from('traposa_projets').update(projetData).eq('id', id));
      } else {
        ({ error } = await window.supabaseClient.from('traposa_projets').insert([projetData]));
      }

      if (error) throw error;

      closeModal();
      location.reload();
    } catch (error) {
      console.error('Error saving projet:', error);
      alert('Erè: ' + error.message);
    }
  }
}

async function editProjet(id) {
  const admin = new AdminProjets();
  await admin.editProjet(id);
}

async function deleteProjet(id) {
  if (!confirm('Èske ou sèten ou vle efase pwojè sa a?')) return;

  try {
    const { error } = await window.supabaseClient
      .from('traposa_projets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    location.reload();
  } catch (error) {
    alert('Erè: ' + error.message);
  }
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AdminProjets();
});
