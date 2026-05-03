// TRAPOSA Admin Actualites JavaScript

class AdminActualites {
  constructor() {
    this.init();
  }

  async loadArticles() {
    try {
      const { data, error } = await supabase
        ?.from('traposa_actualites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.renderArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  }

  renderArticles(articles) {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

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
}

async function editArticle(id) {
  window.location.href = `?action=edit&id=${id}`;
}

async function deleteArticle(id) {
  if (!confirm('Èske ou sèten?')) return;
  
  try {
    const { error } = await supabase?.from('traposa_actualites').delete().eq('id', id);
    if (error) throw error;
    location.reload();
  } catch (error) {
    alert('Erè: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdminActualites();
});
