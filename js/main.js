/* Portfolio — interactions de la page d'accueil. */
(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Thème clair / sombre ---------- */
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeToggle?.setAttribute('aria-pressed', String(theme === 'light'));
    themeColorMeta?.setAttribute('content', theme === 'light' ? '#f3e600' : '#050608');
  };

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    try {
      localStorage.setItem('theme', next);
    } catch { /* stockage indisponible : le choix n'est simplement pas mémorisé */ }
  });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');

  const setNavOpen = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => setNavOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setNavOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ---------- En-tête : bordure au défilement ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Lien de navigation actif ---------- */
  const navLinks = new Map(
    [...document.querySelectorAll('.site-nav a[href^="#"]')].map((a) => [a.hash.slice(1), a])
  );

  if ('IntersectionObserver' in window && navLinks.size) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        navLinks.get(entry.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    navLinks.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Apparition progressive ---------- */
  const revealables = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealables.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Pluie de katakana (canvas d'arrière-plan) ---------- */
  const rain = document.getElementById('rain');
  const ctx = rain?.getContext('2d');

  if (ctx) {
    const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const FONT_SIZE = 16;
    const FRAME_MS = 50; // ~20 i/s : suffisant pour l'effet, économe en CPU/batterie
    let colors = {};
    let drops = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let last = 0;

    const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    const readColors = () => {
      const style = getComputedStyle(root);
      colors = {
        body: style.getPropertyValue('--rain').trim() || '#00f0ff',
        head: style.getPropertyValue('--rain-head').trim() || '#ffffff',
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      rain.width = Math.floor(width * dpr);
      rain.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.textBaseline = 'top';

      // Conserve les colonnes existantes, en ajoute ou en retire selon la largeur.
      const columns = Math.ceil(width / FONT_SIZE);
      drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.random() * -height / FONT_SIZE);
    };

    const drawFrame = () => {
      // Estompe l'image précédente sans peindre de fond : le canvas reste transparent
      // et fonctionne quel que soit le thème.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      for (let i = 0; i < drops.length; i++) {
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        if (y >= 0) {
          ctx.fillStyle = colors.body;
          ctx.fillText(randomGlyph(), x, y - FONT_SIZE);
          ctx.fillStyle = colors.head;
          ctx.fillText(randomGlyph(), x, y);
        }
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    const loop = (time) => {
      rafId = requestAnimationFrame(loop);
      if (time - last < FRAME_MS) return;
      last = time;
      drawFrame();
    };

    const drawStatic = () => {
      // Mouvement réduit : une seule image figée, sans animation.
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colors.body;
      for (let i = 0; i < drops.length; i++) {
        const length = 4 + Math.floor(Math.random() * 14);
        const start = Math.floor(Math.random() * (height / FONT_SIZE));
        for (let j = 0; j < length; j++) {
          ctx.globalAlpha = 1 - j / length;
          ctx.fillText(randomGlyph(), i * FONT_SIZE, (start - j) * FONT_SIZE);
        }
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (prefersReducedMotion) drawStatic();
      else rafId = requestAnimationFrame(loop);
    };

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); if (prefersReducedMotion) drawStatic(); }, 150);
    });

    // Pas d'animation quand l'onglet n'est pas visible.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else start();
    });

    document.addEventListener('themechange', () => {
      readColors();
      ctx.clearRect(0, 0, width, height);
      if (prefersReducedMotion) drawStatic();
    });

    readColors();
    resize();
    start();
  }

  /* ---------- Année du footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
