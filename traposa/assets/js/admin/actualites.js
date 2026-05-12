// TRAPOSA Admin Actualites JavaScript

class AdminActualites {
  constructor() {
    this.articles = [];
    this.init();
  }

  async init() {
    await this.loadArticles();
    this.initModal();
    this.initForm();
  }

  async loadArticles() {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_actualites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.articles = data || [];
      this.renderArticles(this.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }

  renderArticles(articles) {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    if (articles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Okenn atik</td></tr>';
      return;
    }

    tbody.innerHTML = articles.map(a => `
      <tr data-id="${a.id}">
        <td><strong>${a.title}</strong></td>
        <td>${a.category}</td>
        <td>${a.author}</td>
        <td>${new Date(a.created_at).toLocaleDateString('ht-HT')}</td>
        <td><span class="admin-status ${a.is_published ? 'published' : 'draft'}">${a.is_published ? 'Pibliye' : 'Brouyon'}</span></td>
        <td class="table-actions">
          <button class="table-btn" onclick="editArticle('${a.id}')"><i data-lucide="edit"></i></button>
          <button class="table-btn delete" onclick="deleteArticle('${a.id}')"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>
    `).join('');

    lucide.createIcons();
  }

  initModal() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const id = urlParams.get('id');

    if (action === 'new') {
      this.openModal();
    } else if (action === 'edit' && id) {
      this.editArticle(id);
    }
  }

  initForm() {
    const form = document.getElementById('articleForm');
    const imageInput = document.getElementById('articleImage');
    
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
        await this.saveArticle();
      });
    }
  }

  openModal() {
    const modal = document.getElementById('articleModal');
    const form = document.getElementById('articleForm');
    if (modal && form) {
      form.reset();
      document.getElementById('articleId').value = '';
      document.getElementById('modalTitle').textContent = 'Nouvo Atik';
      document.getElementById('imagePreview').innerHTML = '';
      modal.style.display = 'flex';
    }
  }

  async editArticle(id) {
    try {
      const { data, error } = await window.supabaseClient
        .from('traposa_actualites')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      const modal = document.getElementById('articleModal');
      const form = document.getElementById('articleForm');
      
      if (modal && form) {
        document.getElementById('articleId').value = data.id;
        document.getElementById('articleTitle').value = data.title || '';
        document.getElementById('articleSlug').value = data.slug || '';
        document.getElementById('articleCategory').value = data.category || 'siksè';
        document.getElementById('articleExcerpt').value = data.excerpt || '';
        document.getElementById('articleContent').value = data.content || '';
        document.getElementById('articleAuthor').value = data.author || 'Ekip TRAPOSA';
        document.getElementById('articlePublished').checked = data.is_published || false;
        
        if (data.cover_image_url) {
          document.getElementById('imagePreview').innerHTML = 
            `<img src="${data.cover_image_url}" style="max-width:100%;max-height:200px;">`;
        }
        
        document.getElementById('modalTitle').textContent = 'Modifye Atik';
        modal.style.display = 'flex';
      }
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Erè: ' + error.message);
    }
  }

  async saveArticle() {
    try {
      const id = document.getElementById('articleId').value;
      const imageFile = document.getElementById('articleImage').files[0];
      let coverImageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await window.supabaseClient
          .storage
          .from('news-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = window.supabaseClient
          .storage
          .from('news-images')
          .getPublicUrl(fileName);

        coverImageUrl = publicUrl;
      }

      const articleData = {
        title: document.getElementById('articleTitle').value,
        slug: document.getElementById('articleSlug').value || document.getElementById('articleTitle').value.toLowerCase().replace(/\s+/g, '-'),
        category: document.getElementById('articleCategory').value,
        excerpt: document.getElementById('articleExcerpt').value,
        content: document.getElementById('articleContent').value,
        author: document.getElementById('articleAuthor').value,
        is_published: document.getElementById('articlePublished').checked
      };

      if (coverImageUrl) {
        articleData.cover_image_url = coverImageUrl;
      }

      if (articleData.is_published) {
        articleData.published_at = new Date().toISOString();
      }

      let error;
      if (id) {
        ({ error } = await window.supabaseClient.from('traposa_actualites').update(articleData).eq('id', id));
      } else {
        ({ error } = await window.supabaseClient.from('traposa_actualites').insert([articleData]));
      }

      if (error) throw error;

      closeModal();
      location.reload();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Erè: ' + error.message);
    }
  }
}

async function editArticle(id) {
  const admin = new AdminActualites();
  await admin.editArticle(id);
}

async function deleteArticle(id) {
  if (!confirm('Èske ou sèten?')) return;
  
  try {
    const { error } = await window.supabaseClient.from('traposa_actualites').delete().eq('id', id);
    if (error) throw error;
    location.reload();
  } catch (error) {
    alert('Erè: ' + error.message);
  }
}

function closeModal() {
  const modal = document.getElementById('articleModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminActualites();
});
