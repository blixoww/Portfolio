/*
 * Bascule Night City (sombre) / Arasaka (clair).
 * Le thème initial est appliqué avant le rendu par public/theme-init.js (anti-flash).
 */
const THEME_COLORS = { light: '#f3e600', dark: '#050608' };

export function initThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    toggle?.setAttribute('aria-pressed', String(theme === 'light'));
    themeColorMeta?.setAttribute('content', THEME_COLORS[theme]);
  };

  apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
    try {
      localStorage.setItem('theme', next);
    } catch { /* stockage indisponible : le choix n'est simplement pas mémorisé */ }
  });
}
