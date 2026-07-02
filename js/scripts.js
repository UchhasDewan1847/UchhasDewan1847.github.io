// ==================== Dark Mode ====================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

applyTheme(localStorage.getItem('theme') || 'light');

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// ==================== Font Size Toggle ====================
const fontToggle = document.getElementById('font-toggle');
if (fontToggle) {
  const fontSizes = ['normal', 'large', 'xl'];
  const fontLabels = { normal: 'A', large: 'A+', xl: 'A++' };

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-font', size === 'normal' ? '' : size);
    if (size === 'normal') document.documentElement.removeAttribute('data-font');
    fontToggle.textContent = fontLabels[size];
    fontToggle.title = size === 'normal' ? 'Increase font size' : size === 'large' ? 'Increase font size more' : 'Reset font size';
  }

  const saved = localStorage.getItem('fontsize') || 'normal';
  applyFontSize(saved);

  fontToggle.addEventListener('click', () => {
    const current = localStorage.getItem('fontsize') || 'normal';
    const next = fontSizes[(fontSizes.indexOf(current) + 1) % fontSizes.length];
    localStorage.setItem('fontsize', next);
    applyFontSize(next);
  });
}

// ==================== Typing Effect ====================
const roles = [
  'Software Engineer',
  'Backend Developer',
  'Spring Boot Specialist',
  'AI Enthusiast',
  'System Design Nerd',
];

const typedEl = document.getElementById('typed-text');
if (typedEl) {
  let roleIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = roles[roleIndex];
    typedEl.textContent = isDeleting
      ? current.slice(0, --charIndex)
      : current.slice(0, ++charIndex);

    let delay = isDeleting ? 55 : 95;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

// ==================== Scroll Reveal ====================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

// ==================== Certificate Filters (certificates.html only) ====================
const filterBtns = document.querySelectorAll('.cert-filter-btn');
if (filterBtns.length) {
  const allCards = document.querySelectorAll('.cert-card-v2[data-category]');

  // Only run cert-specific logic when cert cards actually exist on this page.
  // (projects.html reuses .cert-filter-btn for styling but has no .cert-card-v2)
  if (allCards.length) {
    // Cache count for the main-page stat (rounded down to nearest 5)
    const rounded = Math.floor(allCards.length / 5) * 5;
    localStorage.setItem('certCount', String(allCards.length));
    localStorage.setItem('certCountRounded', String(rounded));

    // Keep cert-page header description in sync
    const certDesc = document.querySelector('.cert-page-header p');
    if (certDesc) {
      certDesc.textContent = `${allCards.length} certificates — online courses, specializations, workshops & extracurricular achievements`;
    }

    // Update filter button counts dynamically
    filterBtns.forEach(btn => {
      const filter = btn.dataset.filter;
      const countEl = btn.querySelector('.cert-count');
      if (!countEl) return;
      const n = filter === 'all'
        ? allCards.length
        : document.querySelectorAll(`.cert-card-v2[data-category="${filter}"]`).length;
      countEl.textContent = n;
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      allCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

// ==================== Project Filters (projects.html only) ====================
const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
if (projFilterBtns.length) {
  const allProjCards = document.querySelectorAll('.proj-card[data-category]');

  // Update project filter button counts dynamically
  projFilterBtns.forEach(btn => {
    const filter = btn.dataset.filter;
    const countEl = btn.querySelector('.cert-count');
    if (!countEl) return;
    const n = filter === 'all'
      ? allProjCards.length
      : document.querySelectorAll(`.proj-card[data-category="${filter}"]`).length;
    countEl.textContent = n;
  });

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      allProjCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

// ==================== Stat Counters ====================
// Sync the cert stat on index.html from the cached count (set when certificates.html is visited).
// Falls back to the hardcoded data-target if localStorage is empty.
const certStatEl = document.getElementById('cert-stat');
if (certStatEl) {
  const stored = localStorage.getItem('certCountRounded');
  if (stored && parseInt(stored) > 0) {
    certStatEl.dataset.target = stored;
    certStatEl.dataset.suffix = '+';
    certStatEl.textContent = '0+';
  }
}

const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statObserver.observe(el));
}

// ==================== Active Nav on Scroll ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
