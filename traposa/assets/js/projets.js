// TRAPOSA Projects Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  initProjectFilters();
  initSearch();
  initSort();
});

// Load projects from Supabase
async function loadProjects() {
  const container = document.querySelector('.projects-page-grid .projects-grid, #projectsGrid');
  if (!container) return;

  // Show loading state
  container.innerHTML = `
    <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
      <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--clr-green-light); border-top-color: var(--clr-green); border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <p style="margin-top: 1rem; color: var(--clr-text-secondary);">Chajman projè yo...</p>
    </div>
  `;

  try {
    let query = supabase
      ?.from('traposa_projets')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    // Get URL params for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
      query = query?.eq('category', category);
    }

    const { data: projects, error } = await query;

    if (error) throw error;

    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Poko gen projè nan kategori sa a. / No projects in this category yet.</p>
        </div>
      `;
      return;
    }

    renderProjects(projects, container);
    updateProjectCount(projects.length);

  } catch (error) {
    console.error('Error loading projects:', error);
    // Fallback: render empty or show error
    container.innerHTML = `
      <div class="empty-state">
        <p>Gen yon erè pandan chajman projè yo. / Error loading projects.</p>
        <button onclick="location.reload()" class="btn btn-primary">Rechaje / Reload</button>
      </div>
    `;
  }
}

// Render project cards
function renderProjects(projects, container) {
  container.innerHTML = projects.map(project => `
    <article class="project-card ${project.is_featured ? 'featured' : ''}" data-category="${project.category}" data-id="${project.id}">
      <div class="project-image">
        <img src="${project.cover_image_url || '/assets/img/placeholder-project.jpg'}" alt="${project.title}" loading="lazy">
        <span class="badge badge-green project-category">${project.category}</span>
      </div>
      <div class="project-body">
        <h3 class="project-title">
          <a href="/pages/projet-detail.html?id=${project.id}&slug=${project.slug}">${project.title}</a>
        </h3>
        <div class="project-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          ${project.location}${project.department ? `, ${project.department}` : ''}
        </div>
        ${project.goal_amount ? `
          <div class="project-progress">
            <div class="progress-info">
              <span class="raised">${formatCurrency(project.raised_amount || 0, 'HTG')}</span>
              <span class="goal">sou ${formatCurrency(project.goal_amount, 'HTG')}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min((project.raised_amount || 0) / project.goal_amount * 100, 100)}%"></div>
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `).join('');
}

// Format currency helper
function formatCurrency(amount, currency = 'HTG') {
  const symbols = { HTG: 'G', USD: '$', EUR: '€' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${(amount || 0).toLocaleString()}`;
}

// Update project count
function updateProjectCount(count) {
  const countEl = document.querySelector('.projects-count');
  if (countEl) {
    countEl.textContent = `${count} projè jwenn / ${count} projects found`;
  }
}

// Initialize project filters
function initProjectFilters() {
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

      // Reload projects
      await loadProjects();
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

// Initialize search
function initSearch() {
  const searchInput = document.querySelector('.projects-search');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterProjectsBySearch(e.target.value);
    }, 300);
  });
}

// Filter projects by search term
function filterProjectsBySearch(term) {
  const cards = document.querySelectorAll('.project-card');
  const lowerTerm = term.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector('.project-title')?.textContent?.toLowerCase() || '';
    const location = card.querySelector('.project-location')?.textContent?.toLowerCase() || '';
    
    if (title.includes(lowerTerm) || location.includes(lowerTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  // Update count
  const visibleCount = document.querySelectorAll('.project-card:not([style*="display: none"])').length;
  updateProjectCount(visibleCount);
}

// Initialize sort
function initSort() {
  const sortSelect = document.querySelector('.projects-sort select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    sortProjects(e.target.value);
  });
}

// Sort projects
function sortProjects(sortBy) {
  const container = document.querySelector('.projects-grid');
  const cards = Array.from(container.querySelectorAll('.project-card'));

  cards.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.dataset.created || 0) - new Date(a.dataset.created || 0);
      case 'oldest':
        return new Date(a.dataset.created || 0) - new Date(b.dataset.created || 0);
      case 'goal-high':
        return parseFloat(b.dataset.goal || 0) - parseFloat(a.dataset.goal || 0);
      case 'goal-low':
        return parseFloat(a.dataset.goal || 0) - parseFloat(b.dataset.goal || 0);
      default:
        return 0;
    }
  });

  cards.forEach(card => container.appendChild(card));
}
