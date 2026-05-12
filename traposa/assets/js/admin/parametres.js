// Admin Paramèt - Gestion des statistiques
// Load stats from Supabase
async function loadStats() {
  try {
    const { data: settings, error } = await window.supabaseClient
      .from('traposa_settings')
      .select('stat_beneficiaires, stat_projets, stat_benevoles, stat_dons_total, stat_komin, stat_experience')
      .single();

    if (error) throw error;

    if (settings) {
      const statBeneficiaires = document.getElementById('statBeneficiaires');
      const statProjets = document.getElementById('statProjets');
      const statBenevoles = document.getElementById('statBenevoles');
      const statDons = document.getElementById('statDons');
      const statKomin = document.getElementById('statKomin');
      const statExperience = document.getElementById('statExperience');

      if (statBeneficiaires) statBeneficiaires.value = settings.stat_beneficiaires ?? 10000;
      if (statProjets) statProjets.value = settings.stat_projets ?? 3;
      if (statBenevoles) statBenevoles.value = settings.stat_benevoles ?? 50;
      if (statDons) statDons.value = settings.stat_dons_total ?? 450000;
      if (statKomin) statKomin.value = settings.stat_komin ?? 5;
      if (statExperience) statExperience.value = settings.stat_experience ?? 3;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Sauvegarder les statistiques dans Supabase
async function saveStats() {
  try {
    const statBeneficiaires = document.getElementById('statBeneficiaires');
    const statProjets = document.getElementById('statProjets');
    const statBenevoles = document.getElementById('statBenevoles');
    const statDons = document.getElementById('statDons');
    const statKomin = document.getElementById('statKomin');
    const statExperience = document.getElementById('statExperience');

    const benevolesValue = statBenevoles?.value !== '' ? parseInt(statBenevoles.value) : 50;
    console.log('Saving stat_benevoles:', benevolesValue, 'from input:', statBenevoles?.value);

    const updateData = {
      stat_beneficiaires: statBeneficiaires?.value !== '' ? parseInt(statBeneficiaires.value) : 10000,
      stat_projets: statProjets?.value !== '' ? parseInt(statProjets.value) : 3,
      stat_benevoles: benevolesValue,
      stat_dons_total: statDons?.value !== '' ? parseFloat(statDons.value) : 450000,
      stat_komin: statKomin?.value !== '' ? parseInt(statKomin.value) : 5,
      stat_experience: statExperience?.value !== '' ? parseInt(statExperience.value) : 3
    };

    console.log('Update data to save:', updateData);

    const { data: settingsData } = await window.supabaseClient.from('traposa_settings').select('id').limit(1);
    console.log('Existing settings:', settingsData);
    const settingsId = settingsData && settingsData.length > 0 ? settingsData[0].id : null;

    let error;
    if (settingsId) {
      console.log('Updating existing settings with ID:', settingsId);
      ({ error } = await window.supabaseClient
        .from('traposa_settings')
        .update(updateData)
        .eq('id', settingsId));
    } else {
      console.log('Inserting new settings');
      ({ error } = await window.supabaseClient
        .from('traposa_settings')
        .insert([updateData]));
    }

    if (error) {
      console.error('Save error:', error);
      throw error;
    }

    console.log('Save successful!');
    showToast('Statistiques sauvegardées avec succès', 'success');
    
    // Reload to show updated value
    setTimeout(() => loadStats(), 500);
    
    return true;
  } catch (error) {
    console.error('Error saving stats:', error);
    showToast('Erreur lors de la sauvegarde: ' + error.message, 'error');
    return false;
  }
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
