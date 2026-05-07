// TRAPOSA Homepage Interactions & Animations

document.addEventListener('DOMContentLoaded', () => {
  initHeroStats();
  initProjectsFilter();
  initImpactCounter();
  initPartnersCarousel();
  initVolunteerForm();
  initNewsletterForm();
  initGSAPAnimations();
});

// Load hero stats from Supabase
async function initHeroStats() {
  const statsContainer = document.querySelector('.hero-stats');
  if (!statsContainer) return;

  try {
    // Aggregate stats from various tables
    const [projetsRes, donationsRes] = await Promise.all([
      supabase?.from('traposa_projets').select('status').eq('status', 'active'),
      supabase?.from('traposa_donations').select('amount').eq('status', 'confirmed')
    ]);

    // Default values if Supabase not available
    const activeProjects = projetsRes?.data?.length || 6;
    const totalDonations = donationsRes?.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 125000;

    // Update DOM
    const beneficiairesEl = document.querySelector('[data-stat="beneficiaires"]');
    const projetsEl = document.querySelector('[data-stat="projets"]');
    const donsEl = document.querySelector('[data-stat="dons"]');

    if (beneficiairesEl) animateNumber(beneficiairesEl, 12450);
    if (projetsEl) animateNumber(projetsEl, activeProjects);
    if (donsEl) animateNumber(donsEl, totalDonations, 'HTG ');
  } catch (error) {
    console.warn('Could not load stats:', error);
    // Use default values
  }
}

// Animate number counting
function animateNumber(element, target, prefix = '') {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);
    
    element.textContent = prefix + current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Projects filter
function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Filter cards
      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

// Load impact stats - using default values (settings table uses named columns, not key-value)
async function loadImpactStats() {
  // traposa_settings uses named columns (org_name, slogan, etc.), not key-value pattern
  // Using hardcoded defaults for impact stats
  const statsDefaults = {
    beneficiaires: 12450,
    projets: 48,
    benevoles: 500,
    dons: 450000
  };

  // Update impact items with default values
  document.querySelectorAll('.impact-item').forEach(item => {
    const numberEl = item.querySelector('.impact-number');
    if (!numberEl) return;

    const statType = numberEl.dataset.stat; // beneficiaires, projets, benevoles, dons
    numberEl.dataset.target = statsDefaults[statType] || 0;
  });
}

// Impact counter animation
async function initImpactCounter() {
  // First load admin-managed stats
  await loadImpactStats();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberEl = entry.target.querySelector('.impact-number');
        if (numberEl) {
          const target = parseInt(numberEl.dataset.target) || 0;
          const prefix = numberEl.dataset.prefix || '';
          animateNumber(numberEl, target, prefix);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.impact-item').forEach(item => {
    observer.observe(item);
  });
}

// Partners carousel auto-scroll
function initPartnersCarousel() {
  const carousel = document.querySelector('.partners-carousel');
  if (!carousel) return;

  let scrollAmount = 0;
  const scrollStep = 1;
  let isPaused = false;

  carousel.addEventListener('mouseenter', () => isPaused = true);
  carousel.addEventListener('mouseleave', () => isPaused = false);

  function autoScroll() {
    if (!isPaused) {
      scrollAmount += scrollStep;
      if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
        scrollAmount = 0;
      }
      carousel.scrollLeft = scrollAmount;
    }
    requestAnimationFrame(autoScroll);
  }

  // Start auto-scroll
  autoScroll();
}

// Volunteer form
function initVolunteerForm() {
  const form = document.querySelector('.volunteer-form form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      full_name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      skills: formData.get('skills')?.split(',').map(s => s.trim()) || [],
      motivation: formData.get('motivation')
    };

    try {
      if (supabase) {
        const { error } = await supabase.from('traposa_benevoles').insert([data]);
        if (error) throw error;
      }

      // Show success message
      showToast('Mèsi! Nou resevwa demann ou a. / Thank you! We received your application.', 'success');
      form.reset();
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      showToast('Gen yon erè. Eseye ankò. / There was an error. Please try again.', 'error');
    }
  });
}

// Newsletter form
function initNewsletterForm() {
  const form = document.querySelector('.footer-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    const name = form.querySelector('input[name="name"]')?.value || '';

    try {
      if (supabase) {
        const { error } = await supabase.from('traposa_newsletter').insert([{ email, name }]);
        if (error) throw error;
      }

      showToast('Mèsi pou abònman ou! / Thank you for subscribing!', 'success');
      form.reset();
    } catch (error) {
      console.error('Error subscribing:', error);
      showToast('Gen yon erè. Eseye ankò. / There was an error. Please try again.', 'error');
    }
  });
}

// GSAP Animations
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Hero content entrance
  gsap.from('.hero-content > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Hero images entrance
  gsap.from('.hero-image', {
    opacity: 0,
    scale: 0.9,
    duration: 1,
    stagger: 0.2,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Mission pillars scroll animation
  gsap.from('.mission-pillar', {
    scrollTrigger: {
      trigger: '.mission-section',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // Project cards scroll animation
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // News cards scroll animation
  gsap.from('.news-card', {
    scrollTrigger: {
      trigger: '.news-grid',
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  });
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
