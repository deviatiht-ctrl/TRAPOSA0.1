// TRAPOSA Admin Gallery Management

class AdminGalerie {
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
      const { data, error } = await window.supabaseClient
        .from('traposa_gallery')
        .select('*')
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
    const grid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');

    if (!this.photos || this.photos.length === 0) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    grid.innerHTML = this.photos.map(photo => `
      <div class="gallery-item">
        <div class="gallery-image">
          <img src="${photo.image_url}" alt="${photo.image_name || 'Gallery photo'}">
          <div class="gallery-overlay">
            <button class="gallery-btn gallery-btn-delete" onclick="deletePhoto(${photo.id})">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  }
}

// Initialize
const galerie = new AdminGalerie();

// Modal functions
function openModal() {
  document.getElementById('photoModal').style.display = 'flex';
  document.getElementById('photoForm').reset();
  document.getElementById('imagePreview').innerHTML = '<span style="color: var(--clr-text-muted);">Previzyon foto a</span>';
}

function closeModal() {
  document.getElementById('photoModal').style.display = 'none';
}

function previewImage(input) {
  const preview = document.getElementById('imagePreview');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function savePhoto(event) {
  event.preventDefault();
  
  const file = document.getElementById('photoFile').files[0];
  const name = document.getElementById('photoName').value;
  const saveBtn = document.getElementById('saveBtn');
  
  if (!file) return;

  saveBtn.disabled = true;
  saveBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Anrejistre...';

  try {
    // Upload to storage
    const fileName = `gallery/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
      .from('gallery-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = window.supabaseClient.storage
      .from('gallery-images')
      .getPublicUrl(fileName);

    // Save to database
    const { error: dbError } = await window.supabaseClient
      .from('traposa_gallery')
      .insert({
        image_url: publicUrl,
        image_name: name || null,
        display_order: galerie.photos.length
      });

    if (dbError) throw dbError;

    closeModal();
    await galerie.loadPhotos();
    galerie.renderPhotos();
  } catch (error) {
    console.error('Error saving photo:', error);
    alert('Erè nan anrejistreman foto a: ' + error.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = '<i data-lucide="save"></i> <span>Anrejistre</span>';
    lucide.createIcons();
  }
}

async function deletePhoto(id) {
  if (!confirm('Eske ou sèten ou vle efase foto sa?')) return;

  try {
    // Get photo info
    const photo = galerie.photos.find(p => p.id === id);
    if (!photo) return;

    // Delete from storage
    const fileName = photo.image_url.split('/').pop();
    const { error: storageError } = await window.supabaseClient.storage
      .from('gallery-images')
      .remove([`gallery/${fileName}`]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await window.supabaseClient
      .from('traposa_gallery')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    await galerie.loadPhotos();
    galerie.renderPhotos();
  } catch (error) {
    console.error('Error deleting photo:', error);
    alert('Erè nan efasman foto a: ' + error.message);
  }
}

function logout() {
  window.location.href = '../../pages/login.html';
}
