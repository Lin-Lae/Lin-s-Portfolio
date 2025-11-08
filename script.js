(function() {
  const STORAGE_KEY = 'linlae-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggleBtn) toggleBtn.setAttribute('aria-label', `Toggle theme (current: ${theme})`);
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  // Initialize
  applyTheme(getPreferredTheme());

  // Listen for system changes
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) applyTheme(e.matches ? 'dark' : 'light');
    });
  } catch (_) {}

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  // Smooth scroll for internal anchors
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toReveal = Array.from(document.querySelectorAll('.reveal'));
  if (prefersReduced) {
    toReveal.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    toReveal.forEach(el => io.observe(el));
  }
})();
