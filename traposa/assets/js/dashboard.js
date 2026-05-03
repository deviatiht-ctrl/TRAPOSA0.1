// TRAPOSA User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  loadUserData();
  loadUserDonations();
  loadUserVolunteerStatus();
  loadUserActivity();
  initProfileForm();
});

// Initialize dashboard
async function initDashboard() {
  // Check if user is authenticated
  if (typeof auth !== 'undefined' && !auth.isAuthenticated) {
    // Redirect to login
    window.location.href = '/pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }

  // Show loading state
  document.body.classList.add('dashboard-loading');
}

// Load user data
async function loadUserData() {
  if (!auth?.user) return;

  // Update user info in header
  const userNameEl = document.querySelector('.dashboard-user-name');
  const userEmailEl = document.querySelector('.dashboard-user-email');
  const avatarEl = document.querySelector('.dashboard-avatar');

  if (userNameEl) userNameEl.textContent = auth.user.user_metadata?.full_name || 'Itilizatè';
  if (userEmailEl) userEmailEl.textContent = auth.user.email;
  if (avatarEl) {
    const initials = getInitials(auth.user.email);
    avatarEl.textContent = initials;
  }

  document.body.classList.remove('dashboard-loading');
}

// Get initials from email
function getInitials(email) {
  if (!email) return '?';
  return email.split('@')[0].slice(0, 2).toUpperCase();
}

// Load user's donations
async function loadUserDonations() {
  if (!auth?.user?.id) return;

  try {
    const { data: donations, error } = await supabase
      ?.from('traposa_donations')
      .select('*')
      .eq('user_id', auth.user.id)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const container = document.querySelector('.donations-table tbody');
    const totalEl = document.querySelector('.stat-donations');

    if (donations && donations.length > 0) {
      // Calculate total
      const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
      if (totalEl) animateNumber(totalEl, total, 'G');

      // Render table
      if (container) {
        container.innerHTML = donations.map(d => `
          <tr>
            <td>${formatDate(d.created_at)}</td>
            <td>${d.cause_name || 'Jeneral'}</td>
            <td>${formatCurrency(d.amount, d.currency)}</td>
            <td><span class="donation-status ${d.status}">${d.status}</span></td>
            <td>${d.is_anonymous ? 'Anonim' : 'Non'}</td>
          </tr>
        `).join('');
      }
    } else {
      if (container) {
        container.innerHTML = `
          <tr>
            <td colspan="5" class="empty-table">
              <div class="empty-state-small">
                <p>Ou poko fè don. / You haven't made any donations yet.</p>
                <a href="/pages/don.html" class="btn btn-primary btn-sm">Fe Yon Don / Make a Donation</a>
              </div>
            </td>
          </tr>
        `;
      }
      if (totalEl) totalEl.textContent = 'G0';
    }
  } catch (error) {
    console.error('Error loading donations:', error);
  }
}

// Load volunteer status
async function loadUserVolunteerStatus() {
  if (!auth?.user?.id) return;

  try {
    const { data: volunteer, error } = await supabase
      ?.from('traposa_benevoles')
      .select('*')
      .eq('user_id', auth.user.id)
      .single();

    const container = document.querySelector('.volunteer-status-section');
    
    if (volunteer && container) {
      const statusText = {
        'pending': 'An atant / Pending',
        'active': 'Aktif / Active',
        'inactive': 'Inaktif / Inactive'
      };

      const statusClass = volunteer.status;

      container.innerHTML = `
        <div class="volunteer-status">
          <span class="volunteer-status-badge ${statusClass}">${statusText[volunteer.status]}</span>
          <span class="volunteer-department">${volunteer.department || 'N/A'}</span>
        </div>
        <div class="volunteer-skills">
          <h4>Konpetans / Skills</h4>
          <div class="skills-list">
            ${(volunteer.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      `;
    } else if (container) {
      container.innerHTML = `
        <div class="empty-state-small">
          <p>Ou poko enskri kòm bénévòl. / You haven't registered as a volunteer yet.</p>
          <a href="/pages/benevoles.html" class="btn btn-primary btn-sm">Enskri Kounye a / Register Now</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading volunteer status:', error);
  }
}

// Load user activity
async function loadUserActivity() {
  if (!auth?.user?.id) return;

  // Combine donations and volunteer updates
  const activities = [];

  try {
    // Get recent donations as activities
    const { data: donations } = await supabase
      ?.from('traposa_donations')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (donations) {
      donations.forEach(d => {
        activities.push({
          type: 'donation',
          title: `Don pou ${d.cause_name || 'TRAPOSA'}`,
          meta: formatDate(d.created_at),
          amount: formatCurrency(d.amount, d.currency),
          date: new Date(d.created_at)
        });
      });
    }

    // Sort by date
    activities.sort((a, b) => b.date - a.date);

    // Render
    const container = document.querySelector('.activity-list');
    if (container) {
      if (activities.length > 0) {
        container.innerHTML = activities.map(a => `
          <li class="activity-item">
            <div class="activity-icon ${a.type}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${a.type === 'donation' 
                  ? '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
                  : '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/>'
                }
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-title">${a.title}</p>
              <span class="activity-meta">${a.meta}</span>
            </div>
            ${a.amount ? `<span class="activity-amount">${a.amount}</span>` : ''}
          </li>
        `).join('');
      } else {
        container.innerHTML = `
          <li class="activity-item empty">
            <p>Ou poko gen aktivite. / No activity yet.</p>
          </li>
        `;
      }
    }
  } catch (error) {
    console.error('Error loading activity:', error);
  }
}

// Initialize profile form
function initProfileForm() {
  const form = document.querySelector('.profile-form');
  if (!form) return;

  // Pre-fill with current user data
  if (auth?.user) {
    const nameInput = form.querySelector('input[name="full_name"]');
    const emailInput = form.querySelector('input[name="email"]');
    
    if (nameInput) nameInput.value = auth.user.user_metadata?.full_name || '';
    if (emailInput) emailInput.value = auth.user.email || '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    try {
      const { error } = await supabase?.auth.updateUser({
        data: {
          full_name: formData.get('full_name'),
          phone: formData.get('phone')
        }
      });

      if (error) throw error;

      showToast('Pwofil ajou! / Profile updated!', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Gen yon erè. / There was an error.', 'error');
    }
  });
}

// Format helpers
function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ht-HT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatCurrency(amount, currency = 'HTG') {
  const symbols = { HTG: 'G', USD: '$', EUR: '€' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${(amount || 0).toLocaleString()}`;
}

function animateNumber(element, target, prefix = '') {
  const duration = 1500;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    
    element.textContent = prefix + current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
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
    right: '24px',
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
