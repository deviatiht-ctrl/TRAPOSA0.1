// Admin Paramèt - Gestion des statistiques
// NOTE: traposa_settings uses named columns (org_name, slogan, etc.), not key-value pattern
// Stats are currently hardcoded in homepage.js and dashboard.js

// Charger les statistiques depuis Supabase (disabled - using hardcoded defaults)
async function loadStats() {
  // Stats are managed directly in homepage.js and dashboard.js with hardcoded values
  // This admin page would need a schema update to support dynamic stats
  console.warn('Statistiques gérées via hardcoded values dans homepage.js/dashboard.js');
}

// Sauvegarder les statistiques dans Supabase (disabled)
async function saveStats() {
  showToast('Gestion des stats non disponible - utilisez hardcoded values', 'error');
  return false;
}

// Toast notification
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">×</button>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    padding: '12px 24px',
    borderRadius: '8px',
    color: type === 'error' ? '#DC2626' : '#16A34A',
    background: type === 'error' ? '#FEE2E2' : '#F0FDF4',
    border: `1px solid ${type === 'error' ? '#FECACA' : '#BBF7D0'}`,
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Charger les statistiques
  loadStats();

  // Gestion soumission formulaire
  const form = document.querySelector('.admin-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveStats();
    });
  }
});
