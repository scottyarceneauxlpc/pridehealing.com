// ============================================================
// Pride Healing & Recovery Services — shared site behavior
// ============================================================

(function themeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function setIcon(t) {
    if (!toggle) return;
    var next = t === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    toggle.setAttribute('title', 'Switch to ' + next + ' mode');
    var icon = toggle.querySelector('.theme-toggle__icon');
    var text = toggle.querySelector('.theme-toggle__text');
    if (icon) {
      icon.innerHTML = t === 'dark' ? SUN : MOON;
    } else {
      toggle.innerHTML = t === 'dark' ? SUN : MOON;
    }
    if (text) text.textContent = next === 'dark' ? 'Dark' : 'Light';
  }

  setIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      setIcon(theme);
    });
  }
})();

(function headerScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let lastY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      header.classList.toggle('header--scrolled', y > 8);
      if (y > lastY && y > 120) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastY = y;
    },
    { passive: true }
  );
})();

(function mobileNav() {
  const openBtn = document.querySelector('[data-nav-open]');
  const closeBtn = document.querySelector('[data-nav-close]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (!openBtn || !nav) return;

  const open = () => {
    nav.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    nav.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
  };

  openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

(function scrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    return; // content is visible by default; no enhancement needed
  }

  const viewportHeight = window.innerHeight;
  const pending = [];

  items.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top > viewportHeight * 0.92) {
      // Below the fold: safe to animate in on scroll
      el.classList.add('reveal-pending');
      pending.push(el);
    } else {
      // Already in view: show immediately, no animation
      el.classList.add('is-visible');
    }
  });

  if (!pending.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  pending.forEach((el) => observer.observe(el));

  // Safety net: if anything is somehow never observed as visible
  // (e.g. layout edge cases), reveal it after a short delay anyway.
  setTimeout(() => {
    pending.forEach((el) => el.classList.add('is-visible'));
  }, 2500);
})();

(function policiesMenu() {
  const items = document.querySelectorAll('.nav__item--menu');
  if (!items.length) return;
  const closeAll = (except) => {
    items.forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      const b = item.querySelector('[data-nav-menu]');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  };
  items.forEach((item) => {
    const btn = item.querySelector('[data-nav-menu]');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--menu')) closeAll(null);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });
})();
