// TRAPOSA News/Articles Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  loadNews();
  initCategoryFilter();
  initLoadMore();
});

// Load news from Supabase
async function loadNews(loadMore = false) {
  const container = document.querySelector('.news-grid');
  if (!container) return;

  const page = parseInt(container.dataset.page || '1');
  const limit = 9;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      ?.from('traposa_actualites')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Get URL params for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      query = query?.eq('category', category);
    }

    const { data: articles, error } = await query;

    if (error) throw error;

    if (!articles || articles.length === 0) {
      if (!loadMore) {
        container.innerHTML = `
          <div class="empty-state" style="grid-column: 1/-1;">
            <p>Poko gen aktualite nan kategori sa a. / No news in this category yet.</p>
          </div>
        `;
      }
      // Hide load more button
      const loadMoreBtn = document.querySelector('.load-more-btn');
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    if (loadMore) {
      appendNews(articles, container);
    } else {
      renderNews(articles, container);
    }

    // Update page number
    container.dataset.page = page + 1;

    // Show/hide load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = articles.length < limit ? 'none' : 'inline-flex';
    }

  } catch (error) {
    console.error('Error loading news:', error);
    if (!loadMore) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <p>Gen yon erè pandan chajman aktualite yo. / Error loading news.</p>
          <button onclick="location.reload()" class="btn btn-primary">Rechaje / Reload</button>
        </div>
      `;
    }
  }
}

// Render news cards
function renderNews(articles, container) {
  container.innerHTML = articles.map(article => createNewsCard(article)).join('');
}

// Append news cards (for load more)
function appendNews(articles, container) {
  const html = articles.map(article => createNewsCard(article)).join('');
  container.insertAdjacentHTML('beforeend', html);
}

// Create news card HTML
function createNewsCard(article) {
  const categoryClasses = {
    'ijan': 'ijan',
    'siksè': 'sikse',
    'rapò': 'rapo',
    'nouvèl': 'sikse',
    'partenariat': 'sikse'
  };

  const categoryLabels = {
    'ijan': 'Ijans',
    'siksè': 'Siksè',
    'rapò': 'Rapò',
    'nouvèl': 'Nouvèl',
    'partenariat': 'Partenariat'
  };

  const publishedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('ht-HT', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const readTime = Math.ceil((article.content?.length || 0) / 1000) + ' min li';

  return `
    <article class="news-card" data-id="${article.id}">
      <div class="news-image">
        <img src="${article.cover_image_url || '/assets/img/placeholder-news.jpg'}" alt="${article.title}" loading="lazy">
      </div>
      <div class="news-body">
        <div class="news-meta">
          <span class="badge badge-${categoryClasses[article.category] || 'gray'} news-category">${categoryLabels[article.category] || article.category}</span>
          <span class="news-date">${publishedDate}</span>
        </div>
        <h3 class="news-title">
          <a href="/pages/actualite-detail.html?id=${article.id}&slug=${article.slug}">${article.title}</a>
        </h3>
        <p class="news-excerpt">${article.excerpt || article.content?.substring(0, 150) + '...' || ''}</p>
        <span class="read-time">${readTime}</span>
      </div>
    </article>
  `;
}

// Initialize category filter
function initCategoryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;
      
      // Update URL
      const url = new URL(window.location);
      if (category && category !== 'all') {
        url.searchParams.set('category', category);
      } else {
        url.searchParams.delete('category');
      }
      window.history.replaceState({}, '', url);

      // Reset page and reload
      const container = document.querySelector('.news-grid');
      if (container) container.dataset.page = '1';
      
      await loadNews();
    });
  });

  // Set active filter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentCategory = urlParams.get('category');
  if (currentCategory) {
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Initialize load more button
function initLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Chajman... / Loading...';
    
    await loadNews(true);
    
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Chaje plis / Load more';
  });
}
