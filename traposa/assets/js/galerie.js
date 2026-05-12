// TRAPOSA Public Gallery

class PublicGalerie {
  constructor() {
    this.photos = [];
    this.init();
  }

  async init() {
    await this.loadPhotos();
    this.renderPhotos();
  }

  async loadPhotos() {
    try {
      const { data, error } = await supabase
        ?.from('traposa_gallery')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.photos = data || [];
    } catch (error) {
      console.error('Error loading photos:', error);
      this.photos = [];
    }
  }

  renderPhotos() {
    const grid = document.getElementById('publicGallery');
    const empty = document.getElementById('galleryEmpty');

    if (!this.photos || this.photos.length === 0) {
      grid.style.display = 'none';
      empty.style.display = 'flex';
      return;
    }

    grid.style.display = 'grid';
    empty.style.display = 'none';

    grid.innerHTML = this.photos.map((photo, index) => `
      <div class="gallery-photo" style="animation-delay: ${index * 0.1}s">
        <img src="${photo.image_url}" alt="${photo.image_name || 'Gallery photo'}" loading="lazy">
        <div class="gallery-photo-overlay">
          <i data-lucide="maximize-2"></i>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PublicGalerie();
});
