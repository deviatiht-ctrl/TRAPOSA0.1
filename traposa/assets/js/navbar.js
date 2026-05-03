// TRAPOSA Navbar Functionality

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollEffects();
  initLanguageSwitcher();
});

// Navbar initialization
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navbarNav = document.querySelector('.navbar-nav');

  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navbarNav) {
    menuToggle.addEventListener('click', () => {
      navbarNav.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navbarNav.classList.remove('open');
        menuToggle.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    navbarNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navbarNav.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // Set active nav item based on current page
  const currentPage = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPage.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });
}

// Mobile bottom navigation
function initMobileNav() {
  const mobileNav = document.querySelector('.mobile-nav');
  if (!mobileNav) return;

  const currentPage = window.location.pathname;
  
  mobileNav.querySelectorAll('.mobile-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPage.includes(href.replace('../', '').replace('./', ''))) {
      item.classList.add('active');
    }
  });
}

// Scroll effects
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 100;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Language switcher
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Get saved language or default to HT (Haitian Creole)
  const currentLang = localStorage.getItem('traposa-lang') || 'HT';
  
  // Set active button
  langButtons.forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      localStorage.setItem('traposa-lang', lang);
      
      // Update UI
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Trigger language change event
      document.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
      
      // Optionally reload page or update content
      // window.location.reload();
    });
  });
}

// Translations object (to be expanded)
const translations = {
  HT: {
    home: 'Akèy',
    mission: 'Misyon',
    projects: 'Projè',
    news: 'Aktualite',
    team: 'Ekip',
    partners: 'Partenè',
    contact: 'Kontakte',
    donate: 'Fe Yon Don',
    volunteer: 'Bénévòl'
  },
  FR: {
    home: 'Accueil',
    mission: 'Mission',
    projects: 'Projets',
    news: 'Actualités',
    team: 'Équipe',
    partners: 'Partenaires',
    contact: 'Contact',
    donate: 'Faire un Don',
    volunteer: 'Bénévole'
  },
  EN: {
    home: 'Home',
    mission: 'Mission',
    projects: 'Projects',
    news: 'News',
    team: 'Team',
    partners: 'Partners',
    contact: 'Contact',
    donate: 'Donate',
    volunteer: 'Volunteer'
  }
};

// Get translation helper
function t(key, lang = null) {
  const currentLang = lang || localStorage.getItem('traposa-lang') || 'HT';
  return translations[currentLang]?.[key] || translations.HT[key] || key;
}
