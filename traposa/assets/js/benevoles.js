// TRAPOSA Volunteers Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initVolunteerForm();
  initSkillsSelect();
});

// Initialize volunteer form
function initVolunteerForm() {
  const form = document.querySelector('.volunteer-registration-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || 'Soumèt / Submit';

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Chajman... / Loading...';
    }

    // Gather form data
    const formData = new FormData(form);
    
    // Get selected skills
    const selectedSkills = Array.from(form.querySelectorAll('input[name="skills"]:checked'))
      .map(cb => cb.value);
    
    // Get availability
    const availability = Array.from(form.querySelectorAll('input[name="availability"]:checked'))
      .map(cb => cb.value)
      .join(', ');

    const volunteerData = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone: formData.get('phone') || null,
      department: formData.get('department') || null,
      skills: selectedSkills,
      availability: availability || null,
      motivation: formData.get('motivation') || null,
      status: 'pending'
    };

    // Validation
    if (!volunteerData.full_name || !volunteerData.email) {
      showToast('Tanpli ranpli tout chan obligatwa yo / Please fill all required fields', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      return;
    }

    try {
      // Check if user is logged in and link to user_id if so
      if (typeof auth !== 'undefined' && auth.isAuthenticated) {
        volunteerData.user_id = auth.user?.id;
      }

      // Submit to Supabase
      const { data, error } = await supabase
        ?.from('traposa_benevoles')
        .insert([volunteerData])
        .select()
        .single();

      if (error) throw error;

      // Success
      showSuccessState(form);
      showToast('Mèsi! Nou resevwa demann ou a. / Thank you! We received your application.', 'success');

    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      showToast('Gen yon erè. Tanpri eseye ankò. / There was an error. Please try again.', 'error');
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

// Initialize skills multi-select
function initSkillsSelect() {
  const skillsContainer = document.querySelector('.skills-select');
  if (!skillsContainer) return;

  const skills = [
    { value: 'enseignement', label: 'Anseyman / Teaching' },
    { value: 'soins-sante', label: 'Swen Sante / Healthcare' },
    { value: 'agriculture', label: 'Agrikilti / Agriculture' },
    { value: 'construction', label: 'Konstwiksyon / Construction' },
    { value: 'technologie', label: 'Teknoloji / Technology' },
    { value: 'communication', label: 'Kominikasyon / Communication' },
    { value: 'gestion-projet', label: 'Jesyon Pwojè / Project Management' },
    { value: 'comptabilite', label: 'Kontablite / Accounting' },
    { value: 'transport', label: 'Transpò / Transport' },
    { value: 'cuisine', label: 'Kizin / Cooking' },
    { value: 'traduction', label: 'Tradiksyon / Translation' },
    { value: 'autre', label: 'Lòt / Other' }
  ];

  skillsContainer.innerHTML = skills.map(skill => `
    <label class="skill-checkbox">
      <input type="checkbox" name="skills" value="${skill.value}">
      <span class="skill-label">${skill.label}</span>
    </label>
  `).join('');
}

// Show success state after submission
function showSuccessState(form) {
  form.innerHTML = `
    <div class="volunteer-success">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h3>Mèsi anpil! / Thank you very much!</h3>
      <p>Nou resevwa demann ou a pou vin bénévòl. Ekip nou pral kontakte ou nan 48 èdtan. / We received your volunteer application. Our team will contact you within 48 hours.</p>
      <div class="success-actions">
        <a href="/index.html" class="btn btn-primary">Retounen nan Akèy / Back to Home</a>
        <a href="/pages/projets.html" class="btn btn-outline">Wè Projè Nou Yo / See Our Projects</a>
      </div>
    </div>
  `;
}

// Toast notification helper
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
    left: '50%',
    transform: 'translateX(-50%)',
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
